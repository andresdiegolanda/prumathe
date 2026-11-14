import type { Env } from "./env";
import { json } from "./http";

/**
 * A TEST issuer, not Cloudflare Access. It signs tokens shaped like the ones Access sends to an
 * origin (header Cf-Access-Jwt-Assertion, ES256, aud as a list, email), so the origin of the course
 * can be configured to validate them. It proves the validation code of the origin; it proves
 * nothing about Access, its login or its policies.
 */
const KEY = "test-issuer:key";

interface StoredKey {
  kid: string;
  privateJwk: JsonWebKey;
  publicJwk: JsonWebKey;
}

async function signingKey(env: Env): Promise<StoredKey> {
  const stored = await env.FLAGS.get<StoredKey>(KEY, "json");
  if (stored) return stored;
  const pair = (await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])) as CryptoKeyPair;
  const key: StoredKey = {
    kid: crypto.randomUUID(),
    privateJwk: (await crypto.subtle.exportKey("jwk", pair.privateKey)) as JsonWebKey,
    publicJwk: (await crypto.subtle.exportKey("jwk", pair.publicKey)) as JsonWebKey,
  };
  await env.FLAGS.put(KEY, JSON.stringify(key));
  return key;
}

const b64url = (data: ArrayBuffer | string): string =>
  btoa(typeof data === "string" ? data : String.fromCharCode(...new Uint8Array(data)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");

export async function certs(env: Env): Promise<Response> {
  const key = await signingKey(env);
  const { kty, crv, x, y } = key.publicJwk;
  return json({ keys: [{ kty, crv, x, y, kid: key.kid, alg: "ES256", use: "sig" }] });
}

export async function token(url: URL, env: Env): Promise<Response> {
  const key = await signingKey(env);
  // age: how many seconds ago the token was issued, so the lab can show an expired one.
  const now = Math.floor(Date.now() / 1000) - Number(url.searchParams.get("age") ?? "0");
  const ttl = Number(url.searchParams.get("ttl") ?? "300");
  const claims = {
    iss: env.ISSUER,
    aud: [url.searchParams.get("aud") ?? "rumbo-panel"],
    email: url.searchParams.get("email") ?? "ana@rumbo.example",
    sub: crypto.randomUUID(),
    type: "app",
    iat: now,
    nbf: now,
    exp: now + ttl,
  };
  const header = { alg: "ES256", kid: key.kid, typ: "JWT" };
  const input = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
  const priv = await crypto.subtle.importKey("jwk", key.privateJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, priv, new TextEncoder().encode(input));
  return json({ token: `${input}.${b64url(signature)}`, claims, note: "test issuer of the course, not Cloudflare Access" });
}
