#!/usr/bin/env node
// The lab command of the course: docker compose run --rm lab <command>.
// It talks to the edge (wrangler dev) and, inside the Compose network, to the origin.
// It never prints secrets: no API token, no Authorization header, no Access assertion.
import { resolve4, resolveNs } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { spawnSync } from "node:child_process";

const EDGE = process.env.EDGE ?? "http://edge:8787";
const ORIGIN = process.env.ORIGIN ?? "http://origin:8080";
const TLS = { origin: process.env.TLS_ORIGIN ?? "origin:8443", impostor: process.env.TLS_IMPOSTOR ?? "impostor:8443" };
const TUNNEL_METRICS = process.env.TUNNEL_METRICS ?? "http://tunnel:2000";
const API = "https://api.cloudflare.com/client/v4";
const SHOWN = [
  "access-control-allow-origin", "age", "cache-control", "cf-cache-status", "cf-ray", "etag", "retry-after", "server",
  "x-rumbo-from", "x-rumbo-request-id", "x-rumbo-via",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = (text = "") => process.stdout.write(`${text}\n`);
function fail(message, code = 1) {
  process.stderr.write(`${message}\n`);
  process.exit(code);
}

/** Waits for the edge to answer /health, so a command right after "up" or "restart" works. */
async function edgeReady() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${EDGE}/health?poll=lab`);
      if (r.ok) return;
    } catch {}
    await sleep(1000);
  }
  fail(`the edge does not answer at ${EDGE}: docker compose up -d --wait`);
}

function pretty(text, type) {
  if (!type?.includes("json")) return text.replace(/\n$/, "");
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text.replace(/\n$/, "");
  }
}

async function show(response, { headers = true } = {}) {
  out(`HTTP ${response.status}`);
  if (headers) {
    for (const name of SHOWN) {
      const value = response.headers.get(name);
      if (value !== null) out(`${name}: ${value}`);
    }
  }
  const body = await response.text();
  if (body) {
    out();
    out(pretty(body, response.headers.get("content-type")));
  }
}

function headerArgs(args) {
  const headers = {};
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--header" || args[i] === "-H") {
      const [k, ...v] = args[++i].split(":");
      headers[k.trim().toLowerCase()] = v.join(":").trim();
    } else rest.push(args[i]);
  }
  return { headers, rest };
}

const flag = (args, name, fallback = null) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : (args[i + 1] ?? fallback);
};

// ---------- through the edge ----------

async function get(args) {
  const { headers, rest } = headerArgs(args);
  if (!rest[0]) fail("usage: lab get <path> [--header name:value]");
  await edgeReady();
  await show(await fetch(`${EDGE}${rest[0]}`, { headers }));
}

async function send(method, args) {
  const { headers, rest } = headerArgs(args);
  if (!rest[0]) fail(`usage: lab ${method.toLowerCase()} <path> [body]`);
  await edgeReady();
  const body = rest[1] ?? "";
  const type = body.startsWith("{") ? "application/json" : "text/plain";
  await show(await fetch(`${EDGE}${rest[0]}`, { method, headers: { "content-type": type, ...headers }, body }));
}

async function options([path, from]) {
  if (!path || !from) fail("usage: lab options <path> <origin of the page>");
  await edgeReady();
  const r = await fetch(`${EDGE}${path}`, {
    method: "OPTIONS",
    headers: { origin: from, "access-control-request-method": "GET" },
  });
  out(`HTTP ${r.status}`);
  for (const name of ["access-control-allow-origin", "access-control-allow-methods", "access-control-allow-headers"]) {
    out(`${name}: ${r.headers.get(name) ?? "(none)"}`);
  }
}

async function originDirect([path]) {
  if (!path) fail("usage: lab origin <path>");
  const r = await fetch(`${ORIGIN}${path}`).catch(() => null);
  if (!r) fail(`the origin does not answer at ${ORIGIN}`);
  out(`(straight to ${ORIGIN}, without the edge)`);
  await show(r);
}

async function json(path, init) {
  await edgeReady();
  const r = await fetch(`${EDGE}${path}`, init);
  return { status: r.status, body: await r.json() };
}

async function printJson(path, init) {
  const { status, body } = await json(path, init);
  if (status >= 400) process.exitCode = 1;
  out(JSON.stringify(body, null, 2));
}

async function limit([key = "k1", n = "7"]) {
  await edgeReady();
  // The local simulation counts in fixed 10 second windows: start the burst inside one of them.
  const into = Date.now() % 10_000;
  if (into > 7_000) await sleep(10_050 - into);
  const codes = [];
  for (let i = 0; i < Number(n); i++) {
    const r = await fetch(`${EDGE}/api/shipments/R-1042`, { headers: { "x-api-key": key } });
    await r.arrayBuffer();
    codes.push(r.status);
  }
  out(`key ${key}: ${codes.join(" ")}`);
}

async function race([store, n = "50"]) {
  if (store !== "kv" && store !== "do") fail("usage: lab race <kv|do> [n]");
  await printJson(`/lab/race/${store}?n=${n}`);
}

async function quote([zone, kg]) {
  if (!zone || !kg) fail("usage: lab quote <zone> <kg>");
  await printJson(`/quotes?zone=${encodeURIComponent(zone)}&kg=${encodeURIComponent(kg)}`);
}

async function proof([action, id, ...text]) {
  if (action === "put" && id) return send("PUT", [`/proofs/${id}`, text.join(" ") || "signed by the customer"]);
  if (action === "get" && id) return get([`/proofs/${id}`]);
  fail("usage: lab proof <put|get> <shipment> [text]");
}

// ---------- events ----------

async function webhook([event, shipment, ...status]) {
  if (!event || !shipment || !status.length) fail("usage: lab webhook <event> <shipment> <status>");
  const { status: code, body } = await json("/webhooks/movement", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event, shipment, status: status.join(" ") }),
  });
  out(`HTTP ${code}: queued ${body.queued} for ${body.shipment} (${body.status})`);
  // The webhook answered at once; the consumer works later. Wait for its last word on this event.
  let last = null;
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    const now = (await json(`/movements/${encodeURIComponent(event)}?poll=lab`)).body;
    const fresh = now.delivery?.sent === body.sent;
    const settled = fresh && (!now.delivery.outcome.startsWith("rejected") || now.deadSent === body.sent);
    if (settled) {
      last = now;
      break;
    }
  }
  if (!last) fail("the consumer did not settle the event in 20 seconds");
  out(`attempts: ${last.delivery.attempts}`);
  out(`outcome: ${last.delivery.outcome}`);
  out(`dead letter queue: ${last.dead ? "yes" : "no"}`);
  const saved = await fetch(`${ORIGIN}/api/movements/${encodeURIComponent(shipment)}`).then((r) => r.json()).catch(() => null);
  if (saved) out(`movements of ${shipment} at the origin: ${saved.count}`);
}

async function movements([shipment]) {
  if (!shipment) fail("usage: lab movements <shipment>");
  const r = await fetch(`${ORIGIN}/api/movements/${encodeURIComponent(shipment)}`).catch(() => null);
  if (!r) fail(`the origin does not answer at ${ORIGIN}`);
  out(JSON.stringify(await r.json(), null, 2));
}

async function live([shipment, ...status]) {
  if (!shipment) fail("usage: lab live <shipment> [status]");
  await edgeReady();
  const event = `live-${Date.now()}`;
  const ws = new WebSocket(`${EDGE.replace(/^http/, "ws")}/shipments/${shipment}/live`);
  const done = new Promise((resolveDone) => {
    const timer = setTimeout(() => resolveDone("no alarm in 20 seconds"), 20_000);
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      out(`${m.type}: ${m.status}, delayed ${m.delayed}, watchers ${m.watchers}`);
      if (m.delayed) {
        clearTimeout(timer);
        resolveDone(null);
      }
    };
  });
  await new Promise((r) => (ws.onopen = r));
  await sleep(500);
  out(`(the carrier reports ${event}; then silence)`);
  await fetch(`${EDGE}/webhooks/movement`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event, shipment, status: status.join(" ") || "out for delivery" }),
  });
  const problem = await done;
  ws.close();
  if (problem) fail(problem);
}

async function returns([action, id, extra]) {
  if (!id || !["start", "approve", "status"].includes(action)) fail("usage: lab return <start|approve|status> <id> [shipment|approver]");
  if (action === "start") {
    const started = await json(`/returns/${id}?shipment=${extra ?? "R-1043"}&reason=wrong%20size`, { method: "POST" });
    if (started.status >= 400) {
      out(JSON.stringify(started.body, null, 2));
      process.exit(1);
    }
    await sleep(1500);
  }
  if (action === "approve") {
    const approved = await json(`/returns/${id}/approve?by=${extra ?? "ana"}`, { method: "POST" });
    if (approved.status >= 400) {
      out(JSON.stringify(approved.body, null, 2));
      process.exit(1);
    }
    out(`approval sent to ${id}`);
  }
  // After an approval, wait for the steps that no longer wait for anyone.
  let last = await json(`/returns/${id}`);
  for (let i = 0; action === "approve" && i < 20 && ["queued", "running", "waiting"].includes(last.body.status); i++) {
    await sleep(1000);
    last = await json(`/returns/${id}?poll=lab`);
  }
  if (last.status >= 400) process.exitCode = 1;
  out(JSON.stringify(last.body, null, 2));
}

// ---------- the local tools of wrangler dev ----------

async function explorer(path, body) {
  // The local tools of wrangler dev check the Host header: they answer only on the edge's own address.
  if (!/^http:\/\/(127\.0\.0\.1|localhost):/.test(EDGE)) fail(`this command runs inside the edge: docker compose exec edge lab ${process.argv.slice(2).join(" ")}`);
  await edgeReady();
  let answer;
  // Right after a reload, the explorer can answer for a moment that the Worker is not there yet.
  for (let i = 0; i < 5; i++) {
    const r = await fetch(`${EDGE}/cdn-cgi/local/explorer/api/local/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
    answer = await r.json();
    if (answer.success || answer.errors?.[0]?.code !== 10000) break;
    await sleep(1000);
  }
  if (!answer.success) fail(`local explorer: ${JSON.stringify(answer.errors)}`);
  return answer.result;
}

async function cron() {
  const result = await explorer("scheduled?worker=rumbo-edge", { cron: "0 3 * * *" });
  out(`scheduled handler, cron "0 3 * * *": ${result.outcome}`);
  await sleep(500);
  await printJson("/lab/close");
}

function describe(span) {
  const a = span.attributes ?? {};
  switch (span.name) {
    case "kv_get":
    case "kv_put":
    case "kv_list":
      return `KV ${span.name.slice(3)} ${a["cloudflare.kv.query.keys"] ?? a["cloudflare.kv.query.prefix"] ?? ""}`.trim();
    case "d1_first":
    case "d1_run":
    case "d1_all": {
      const q = String(a["db.query.text"] ?? "");
      const table = q.match(/\b(?:FROM|INTO|UPDATE)\s+(\w+)/i)?.[1] ?? "";
      return `D1 ${q.split(/\s/)[0]} ${table}`.trim();
    }
    case "r2_get":
    case "r2_put":
    case "r2_head":
    case "r2_delete":
      return `R2 ${span.name.slice(3)}`;
    case "cache_match":
    case "cache_put":
    case "cache_delete":
      return `cache ${span.name.slice(6)}`;
    case "queue_send":
      return "queue send";
    case "hyperdrive_connect":
      return "Hyperdrive";
    case "durable_object_subrequest":
      return "Durable Object";
    case "fetch": {
      const u = new URL(String(a["url.full"] ?? "http://unknown/"));
      if (u.hostname === "ratelimit") return "rate limit";
      if (["d1", "r2", "kv", "cache"].includes(u.hostname)) return null;
      return `fetch ${u.host}${u.pathname}`;
    }
    default:
      return null;
  }
}

async function spans([n = "5"]) {
  const count = Math.min(Number(n) || 5, 50);
  // rowid is the order in which the explorer stored the requests; the start_ms of a request can lag
  // behind it. Within one request, start_ms orders the calls.
  const roots = await explorer("observability/query", {
    sql: "SELECT trace_id, span_id, name, kind, outcome, duration_ms, json(attributes) AS a FROM spans WHERE parent_id IS NULL AND service = 'rumbo-edge' AND coalesce(json_extract(attributes, '$.\"url.full\"'), '') NOT LIKE '%poll=lab' ORDER BY rowid DESC LIMIT ?",
    params: [count],
  });
  const rows = roots.rows.reverse();
  for (const [trace, span, name, kind, outcome, ms, attrs] of rows) {
    const a = JSON.parse(attrs ?? "{}");
    const children = await explorer("observability/query", {
      sql: "SELECT name, json(attributes) FROM spans WHERE trace_id = ? AND parent_id = ? ORDER BY start_ms, rowid",
      params: [trace, span],
    });
    let what = kind;
    if (kind === "http") {
      const u = new URL(a["url.full"]);
      what = `${name} ${u.pathname}${u.search} ${a["http.response.status_code"] ?? ""}`.trim();
    } else if (kind === "queue") what = `queue consumer${a["cloudflare.queue.name"] ? ` of ${a["cloudflare.queue.name"]}` : ""}`;
    else if (name === "alarm") what = "Durable Object alarm";
    else if (name === "scheduled") what = "cron";
    const steps = children.rows.map(([cn, ca]) => describe({ name: cn, attributes: JSON.parse(ca ?? "{}") })).filter(Boolean);
    out(`${what} (${outcome}, ${ms ?? "?"} ms)`);
    out(`  ${steps.length ? steps.join(" > ") : kind === "http" ? "(answered by the Worker alone)" : "(no calls to other services)"}`);
  }
  if (!rows.length) out("no requests recorded yet");
  out("(the polls of lab itself, marked poll=lab, are left out)");
}

// ---------- the network in front ----------

async function trace([host = "www.cloudflare.com"]) {
  const r = await fetch(`https://${host}/cdn-cgi/trace`).catch((e) => fail(`no answer from ${host}: ${e.cause?.code ?? e.message}`));
  const fields = Object.fromEntries((await r.text()).trim().split("\n").map((l) => l.split("=")));
  out(`https://${host}/cdn-cgi/trace`);
  for (const k of ["h", "colo", "http", "tls", "visit_scheme"]) if (fields[k]) out(`${k}=${fields[k]}`);
  out(`ip=${fields.ip ? "(your public address: present, not printed)" : "(none)"}`);
}

async function headers([url = "https://www.cloudflare.com/"]) {
  const r = await fetch(url, { redirect: "manual" }).catch((e) => fail(`no answer from ${url}: ${e.cause?.code ?? e.message}`));
  await r.arrayBuffer();
  out(`${url}: HTTP ${r.status}`);
  for (const name of ["server", "cf-ray", "cf-cache-status", "age", "cache-control"]) out(`${name}: ${r.headers.get(name) ?? "(none)"}`);
}

function inRange(ip, cidr) {
  const [base, bits] = cidr.split("/");
  const toInt = (s) => s.split(".").reduce((n, o) => (n << 8) + Number(o), 0) >>> 0;
  const mask = bits === "0" ? 0 : (~0 << (32 - Number(bits))) >>> 0;
  return (toInt(ip) & mask) === (toInt(base) & mask);
}

async function dns([name, kind]) {
  if (!name) fail("usage: lab dns <name> [ns]");
  if (kind === "ns") {
    const ns = await resolveNs(name).catch((e) => fail(`no NS for ${name}: ${e.code}`));
    out(`${name} NS`);
    for (const n of ns.sort()) out(`  ${n}${n.endsWith(".ns.cloudflare.com") ? "  (Cloudflare DNS)" : ""}`);
    return;
  }
  // The address ranges Cloudflare publishes for its own network: https://www.cloudflare.com/ips/
  const ranges = await fetch(`${API}/ips`).then((r) => r.json()).then((j) => j.result.ipv4_cidrs).catch(() => fail("could not read Cloudflare's address ranges from the API"));
  const ips = await resolve4(name).catch((e) => fail(`no A record for ${name}: ${e.code}`));
  out(`${name} A`);
  for (const ip of ips.sort()) out(`  ${ip}  ${ranges.some((c) => inRange(ip, c)) ? "in Cloudflare's network: the request goes to the edge" : "outside Cloudflare's network"}`);
}

function tlsGet(target, options) {
  const [host, port] = target.split(":");
  return new Promise((resolveGet) => {
    const req = httpsRequest({ host, port: Number(port), path: "/", servername: "origin", timeout: 5000, ...options }, (res) => {
      const cert = res.socket.getPeerCertificate();
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => resolveGet({ ok: true, cert, body }));
    });
    req.on("error", (e) => resolveGet({ ok: false, error: e.code ?? e.message }));
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.end();
  });
}

async function tls([mode, who = "origin"]) {
  if (!["flexible", "full", "strict"].includes(mode) || !TLS[who]) fail("usage: lab tls <flexible|full|strict> [origin|impostor]");
  if (mode === "flexible") {
    const r = await fetch(`${ORIGIN}/status`).catch(() => fail(`the origin does not answer at ${ORIGIN}`));
    out("edge to origin: plain HTTP to port 8080");
    out("encrypted: no; anyone on the path between edge and origin reads and changes the traffic");
    out(`answer: ${await r.text()}`);
    return;
  }
  let ca;
  if (mode === "strict") ca = await fetch(`${ORIGIN}/ca.pem`).then((r) => r.text()).catch(() => fail("could not read the CA of the kit from the origin"));
  const r = await tlsGet(TLS[who], mode === "full" ? { rejectUnauthorized: false } : { ca, rejectUnauthorized: true });
  out(`edge to ${who}: HTTPS to ${TLS[who]}, ${mode === "full" ? "certificate not checked" : "certificate checked against the CA of the kit, for the name origin"}`);
  if (!r.ok) {
    out(`result: rejected (${r.error})`);
    return;
  }
  out(`certificate: subject ${r.cert.subject?.CN}, issuer ${r.cert.issuer?.CN}`);
  out(`result: accepted, answer ${r.body.trim()}`);
}

async function tunnel() {
  // cloudflared answers /ready with 200 once it holds a connection to Cloudflare.
  let ready = false;
  for (let i = 0; i < 40 && !ready; i++) {
    ready = await fetch(`${TUNNEL_METRICS}/ready`).then((r) => r.ok).catch(() => false);
    if (!ready) await sleep(1000);
  }
  if (!ready) fail("no tunnel connected: docker compose --profile tunnel up -d tunnel, then docker compose logs tunnel");
  const info = await fetch(`${TUNNEL_METRICS}/quicktunnel`).then((r) => r.json()).catch(() => ({}));
  if (!info.hostname) fail("the tunnel has no hostname: docker compose logs tunnel");
  out(`quick tunnel: https://${info.hostname} (public, while the tunnel runs)`);
  // The new name can take a minute to appear in DNS, and a resolver that asked too early remembers
  // it as missing. The edge routes by the name the request carries, not by DNS, so lab sends the
  // request to the shared address of trycloudflare.com with the new name.
  const address = await resolve4(info.hostname.split(".").slice(-2).join(".")).then((a) => a[0]).catch(() => null);
  if (address) out(`sent to ${address}, the address of trycloudflare.com: the edge routes by name, not by DNS`);
  else await sleep(8000);
  for (let i = 0; i < 30; i++) {
    const r = await getVia(`https://${info.hostname}/api/shipments/R-1042`, address);
    if (r && r.status < 500) {
      out(`HTTP ${r.status}`);
      for (const name of ["server", "cf-ray", "cf-cache-status"]) out(`${name}: ${r.headers[name] ?? "(none)"}`);
      out();
      out(pretty(r.body, "json"));
      return;
    }
    await sleep(3000);
  }
  fail("the tunnel hostname did not answer: the network may block it, or the name is not routed yet");
}

// GET over HTTPS; with an address, the connection goes there and TLS still names the host.
function getVia(url, address) {
  return new Promise((done) => {
    const lookup = (host, options, cb) => (options.all ? cb(null, [{ address, family: 4 }]) : cb(null, address, 4));
    const req = httpsRequest(url, { timeout: 10000, ...(address ? { lookup } : {}) }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (body += c));
      res.on("end", () => done({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on("error", () => done(null));
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.end();
  });
}

// ---------- identity ----------

async function testToken(args) {
  const params = new URLSearchParams();
  if (flag(args, "--aud")) params.set("aud", flag(args, "--aud"));
  if (flag(args, "--ttl")) params.set("ttl", flag(args, "--ttl"));
  if (flag(args, "--email")) params.set("email", flag(args, "--email"));
  if (flag(args, "--age")) params.set("age", flag(args, "--age"));
  return (await json(`/test-issuer/token?${params}`)).body;
}

async function token(args) {
  const t = await testToken(args);
  const [h, p] = t.token.split(".");
  out(`token: ${h.slice(0, 12)}...${p.slice(0, 12)}... (${t.token.length} characters, three parts)`);
  out(JSON.stringify({ claims: t.claims, note: t.note }, null, 2));
}

function tamper(jwt) {
  const [h, p, s] = jwt.split(".");
  const claims = JSON.parse(Buffer.from(p, "base64url").toString());
  claims.email = "intruder@rumbo.example";
  return `${h}.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.${s}`;
}

async function panel(args) {
  const base = args.includes("--direct") ? ORIGIN : EDGE;
  const headers = {};
  let label = "no token";
  if (args.includes("--token") || args.includes("--tampered") || args.includes("--expired") || flag(args, "--aud")) {
    const t = await testToken(args.includes("--expired") ? ["--age", "600"] : args);
    headers["cf-access-jwt-assertion"] = args.includes("--tampered") ? tamper(t.token) : t.token;
    label = args.includes("--tampered") ? "token with the email changed after signing" : args.includes("--expired") ? "token issued 10 minutes ago, valid for 5" : `token for audience ${t.claims.aud[0]}`;
  }
  if (base === EDGE) await edgeReady();
  const r = await fetch(`${base}/panel`, { headers });
  out(`${base === ORIGIN ? "straight to the origin" : "through the edge"}, ${label}`);
  out(`HTTP ${r.status}`);
  const body = await r.text();
  if (body) out(pretty(body, r.headers.get("content-type") ?? "json"));
  const why = r.headers.get("www-authenticate")?.match(/error_description="([^"]+)"/)?.[1];
  if (why) out(`why: ${why.replace("An error occurred while attempting to decode the Jwt: ", "")}`);
}

// ---------- your account (optional) ----------

function credentials() {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const tokenValue = process.env.CLOUDFLARE_API_TOKEN;
  if (!account || !tokenValue) fail("this step needs your account: fill CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in labs/.env (see .env.example)");
  return { account, tokenValue };
}

async function cfApi(path) {
  const { tokenValue } = credentials();
  const r = await fetch(`${API}${path}`, { headers: { authorization: `Bearer ${tokenValue}` } });
  const j = await r.json();
  if (!j.success) throw new Error(`Cloudflare API ${path}: ${JSON.stringify(j.errors)}`);
  return j.result;
}

async function account() {
  const { account: id } = credentials();
  const verified = await cfApi(`/accounts/${id}/tokens/verify`).catch(() => cfApi("/user/tokens/verify"));
  out(`token: ${verified.status}`);
  const sub = await cfApi(`/accounts/${id}/workers/subdomain`).catch(() => ({}));
  out(`workers.dev subdomain: ${sub.subdomain ? "set" : "not set yet: open Workers in the dashboard once"}`);
}

/** Wrangler itself, on the Worker of deploy/, with the credentials of labs/.env. */
function wrangler(args) {
  if (!args.includes("--dry-run")) credentials();
  const r = spawnSync("npx", ["wrangler", ...args], { stdio: "inherit", cwd: "/edge/deploy" });
  process.exit(r.status ?? 1);
}

async function remoteUrl() {
  const { account: id } = credentials();
  const sub = await cfApi(`/accounts/${id}/workers/subdomain`);
  return `https://rumbo-edge-demo.${sub.subdomain}.workers.dev`;
}

async function remote([path = "/", times = "1"]) {
  const base = await remoteUrl();
  for (let i = 0; i < Number(times); i++) {
    const r = await fetch(`${base}${path}`);
    out(`${path}: HTTP ${r.status}, cf-cache-status ${r.headers.get("cf-cache-status") ?? "(none)"}, x-rumbo-version ${r.headers.get("x-rumbo-version") ?? "(none)"}`);
    await r.arrayBuffer();
  }
}

async function split([path = "/version", n = "40"]) {
  const base = await remoteUrl();
  const seen = {};
  for (let i = 0; i < Number(n); i++) {
    const r = await fetch(`${base}${path}?n=${i}`);
    const v = r.headers.get("x-rumbo-version") ?? "(none)";
    seen[v] = (seen[v] ?? 0) + 1;
    await r.arrayBuffer();
  }
  out(`${n} requests to ${path}:`);
  for (const [v, c] of Object.entries(seen).sort()) out(`  version ${v}: ${c}`);
}

// ---------- dispatch ----------

const HELP = `lab: the command of the course kit

through the edge   get <path> [-H name:value]  post <path> [json]  put <path> <text>  options <path> <origin>
the origin         origin <path>  movements <shipment>
mechanisms         cf  isolate  config  race <kv|do> [n]  limit [key] [n]  quote <zone> <kg>  proof <put|get> <id> [text]
events             webhook <event> <shipment> <status>  dead  live <shipment> [status]  return <start|approve|status> <id>  cron
what happened      spans [n]
network in front   trace [host]  headers [url]  dns <name> [ns]  tls <flexible|full|strict> [origin|impostor]  tunnel
identity           token [--aud a] [--ttl s]  panel [--token|--aud a|--expired|--tampered] [--direct]
your account       account  wrangler <arguments>  remote <path> [times]  split [path] [n]`;

const [command, ...args] = process.argv.slice(2);
const commands = {
  get: () => get(args),
  post: () => send("POST", args),
  put: () => send("PUT", args),
  options: () => options(args),
  origin: () => originDirect(args),
  movements: () => movements(args),
  cf: () => printJson("/lab/cf"),
  isolate: () => printJson("/lab/isolate"),
  config: () => printJson("/lab/config"),
  race: () => race(args),
  limit: () => limit(args),
  quote: () => quote(args),
  proof: () => proof(args),
  webhook: () => webhook(args),
  dead: () => printJson("/movements/dead"),
  live: () => live(args),
  return: () => returns(args),
  cron: () => cron(),
  spans: () => spans(args),
  trace: () => trace(args),
  headers: () => headers(args),
  dns: () => dns(args),
  tls: () => tls(args),
  tunnel: () => tunnel(),
  token: () => token(args),
  panel: () => panel(args),
  account: () => account(),
  wrangler: () => wrangler(args),
  remote: () => remote(args),
  split: () => split(args),
};

if (!command || command === "help" || !commands[command]) {
  out(HELP);
  process.exit(command && command !== "help" ? 2 : 0);
}
// The live viewer (127.0.0.1:18098) names the lesson of what follows from this mark; poll=lab at
// the end keeps it out of lab spans.
await fetch(`${EDGE}/health?run=${encodeURIComponent([command, ...args].join(" "))}&poll=lab`, { signal: AbortSignal.timeout(1500) }).catch(() => {});
try {
  await commands[command]();
} catch (error) {
  fail(error.message);
}
// Open connections (keep-alive, a closing WebSocket) must not keep the command waiting.
process.exit(process.exitCode ?? 0);
