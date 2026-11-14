import type { Env } from "./env";
import { json } from "./http";

/** Routes that exist only to make a mechanism visible in the lessons: /lab/... */

// Module state lives as long as the isolate does: nothing promises it to the next request.
// The runtime forbids random values at global scope, so the id is drawn on the first request.
let isolateId = "";
let isolateHits = 0;

export async function lab(request: Request, url: URL, env: Env): Promise<Response> {
  const n = Math.min(Number(url.searchParams.get("n") ?? "50"), 200);
  switch (url.pathname) {
    case "/lab/cf": {
      const cf = (request as unknown as { cf?: Record<string, unknown> }).cf ?? {};
      const keep = ["colo", "country", "continent", "httpProtocol", "tlsVersion"];
      return json({ note: "request.cf as the edge describes the client", ...Object.fromEntries(keep.map((k) => [k, cf[k] ?? null])) });
    }
    case "/lab/isolate":
      isolateId ||= crypto.randomUUID().slice(0, 8);
      return json({ isolate: isolateId, hits: ++isolateHits });
    case "/lab/race/kv": {
      await env.FLAGS.put("race", "0");
      await Promise.all(
        Array.from({ length: n }, async () => {
          const current = Number(await env.FLAGS.get("race"));
          await env.FLAGS.put("race", String(current + 1));
        }),
      );
      return json({ store: "KV", increments: n, final: Number(await env.FLAGS.get("race")) });
    }
    case "/lab/race/do": {
      const counter = env.COUNTERS.getByName(`race-${Date.now()}`);
      await Promise.all(Array.from({ length: n }, () => counter.increment()));
      return json({ store: "Durable Object", increments: n, final: await counter.value() });
    }
    case "/lab/config":
      return json({
        vars: { ORIGIN: env.ORIGIN, ALLOWED_ORIGIN: env.ALLOWED_ORIGIN, ISSUER: env.ISSUER },
        secrets: { RUMBO_TOKEN: env.RUMBO_TOKEN ? `set, ${env.RUMBO_TOKEN.length} characters` : "not set" },
        bindings: Object.keys(env).filter((k) => !["ORIGIN", "ALLOWED_ORIGIN", "ISSUER", "RUMBO_TOKEN"].includes(k)).sort(),
      });
    case "/lab/last-request":
      return json({ lastRequest: await env.FLAGS.get("last-request", "json") });
    case "/lab/close":
      return json({ close: await env.FLAGS.get("close:last", "json") });
    case "/lab/cache/profile":
      return profile(request, url, false);
    case "/lab/cache/profile-safe":
      return profile(request, url, true);
    case "/lab/cache/rate":
      return rate(url);
    case "/lab/cache/purge": {
      const deleted = await caches.default.delete(rateKey(url));
      return json({ purged: deleted, zone: zoneOf(url), note: "cache.delete purges this data center only" });
    }
    default:
      return json({ error: "no such lab route", path: url.pathname }, 404);
  }
}

/**
 * A personalized answer stored in the cache. The trap: the key is the URL alone, so the next user
 * gets the first user's data. The safe version keeps personalized answers out of the shared cache.
 */
async function profile(request: Request, url: URL, safe: boolean): Promise<Response> {
  const user = request.headers.get("x-user") ?? "anonymous";
  const key = new Request(`https://rumbo.example${url.pathname}`);
  if (!safe) {
    const hit = await caches.default.match(key);
    if (hit) return withSource(hit, "cache");
  }
  const body = { user, address: `${user}'s delivery address`, generated: new Date().toISOString() };
  const fresh = new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": safe ? "private, no-store" : "public, max-age=300" },
  });
  if (!safe) await caches.default.put(key, fresh.clone());
  return withSource(fresh, "worker");
}

const zoneOf = (url: URL) => (url.searchParams.get("zone") ?? "MVD").toUpperCase();
const rateKey = (url: URL) => new Request(`https://rumbo.example/lab/cache/rate?zone=${zoneOf(url)}`);

/** A public answer, the same for everyone: safe to keep for 60 seconds. */
async function rate(url: URL): Promise<Response> {
  const key = rateKey(url);
  const hit = await caches.default.match(key);
  if (hit) return withSource(hit, "cache");
  const fresh = json({ zone: zoneOf(url), generated: new Date().toISOString() }, 200, { "cache-control": "public, max-age=60" });
  await caches.default.put(key, fresh.clone());
  return withSource(fresh, "worker");
}

function withSource(response: Response, source: string): Response {
  const copy = new Response(response.body, response);
  copy.headers.set("x-rumbo-from", source);
  return copy;
}
