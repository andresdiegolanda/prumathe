import type { Env } from "./env";
import { json } from "./http";

/**
 * The gateway in front of the API of Rumbo: everything the edge does not answer itself goes to the
 * origin, after the edge has decided whether it may.
 */
export async function gateway(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const cors = corsHeaders(request, env);

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  // A route that never reaches the origin.
  if (url.pathname.startsWith("/api/admin")) return json({ error: "blocked at the edge", path: url.pathname }, 403, cors);

  if (url.pathname.startsWith("/api/")) {
    // One budget per API key; without a key, everyone shares the anonymous one.
    const key = request.headers.get("x-api-key") ?? "anonymous";
    const { success } = await env.LIMITER.limit({ key });
    if (!success) return json({ error: "too many requests", key }, 429, { ...cors, "retry-after": "10" });

    if ((await env.FLAGS.get("maintenance")) === "on") return json({ error: "maintenance, try again later" }, 503, cors);
  }

  const requestId = crypto.randomUUID();
  const upstream = new Request(env.ORIGIN + url.pathname + url.search, request);
  upstream.headers.set("x-rumbo-request-id", requestId);
  upstream.headers.set("x-rumbo-edge", "rumbo-edge");

  let answer: Response;
  try {
    answer = await fetch(upstream);
  } catch (error) {
    return json({ error: "origin unreachable", detail: String(error) }, 502, cors);
  }

  const response = new Response(answer.body, answer);
  response.headers.set("x-rumbo-via", "edge");
  response.headers.set("x-rumbo-request-id", requestId);
  for (const [k, v] of Object.entries(cors)) response.headers.set(k, v);

  // After the answer is sent: remember the last request, without making the client wait.
  ctx.waitUntil(env.FLAGS.put("last-request", JSON.stringify({ path: url.pathname, status: answer.status, at: new Date().toISOString() })));
  return response;
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  if (request.headers.get("origin") !== env.ALLOWED_ORIGIN) return {};
  return {
    "access-control-allow-origin": env.ALLOWED_ORIGIN,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-api-key",
    vary: "Origin",
  };
}
