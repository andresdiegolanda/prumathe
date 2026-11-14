import type { Env, Movement } from "./env";
import { gateway } from "./gateway";
import { json } from "./http";
import { certs, token } from "./issuer";
import { lab } from "./labs";
import { consume, dead, delivery, webhook } from "./movements";
import { close, direct, proof, quote } from "./storage";

export { Counter, Shipment } from "./objects";
export { ReturnFlow } from "./returns";

/**
 * The Worker of Rumbo. Routes answered at the edge come first; everything else goes through the
 * gateway to the origin, the Spring API of the course.
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    let m: RegExpMatchArray | null;

    if (path === "/health") return json({ ok: true, worker: "rumbo-edge" });
    if (path.startsWith("/lab/")) return lab(request, url, env);
    if (path === "/test-issuer/certs") return certs(env);
    if (path === "/test-issuer/token") return token(url, env);
    if (path === "/quotes") return quote(url, env);
    if (path === "/webhooks/movement" && request.method === "POST") return webhook(request, env);
    if (path === "/movements/dead") return dead(env);
    if ((m = path.match(/^\/movements\/([^/]+)$/))) return delivery(m[1], env);
    if ((m = path.match(/^\/proofs\/([A-Z0-9-]+)$/))) return proof(request, m[1], env);
    if ((m = path.match(/^\/direct\/shipments\/([A-Z0-9-]+)$/))) return direct(m[1], env);
    if ((m = path.match(/^\/shipments\/([A-Z0-9-]+)\/live$/))) return env.SHIPMENTS.getByName(m[1]).fetch(request);
    if ((m = path.match(/^\/shipments\/([A-Z0-9-]+)\/state$/))) return json(await env.SHIPMENTS.getByName(m[1]).state(m[1]));
    if ((m = path.match(/^\/returns\/([A-Za-z0-9-]+)(\/approve)?$/))) return returns(request, m[1], Boolean(m[2]), url, env);
    return gateway(request, env, ctx);
  },

  async queue(batch: MessageBatch<Movement>, env: Env): Promise<void> {
    await consume(batch, env);
  },

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(close(env));
  },
} satisfies ExportedHandler<Env, Movement>;

async function returns(request: Request, id: string, approve: boolean, url: URL, env: Env): Promise<Response> {
  if (request.method === "POST" && !approve) {
    try {
      const params = { shipment: url.searchParams.get("shipment") ?? "R-1042", reason: url.searchParams.get("reason") ?? "damaged" };
      const instance = await env.RETURNS.create({ id, params });
      return json({ started: instance.id, status: (await instance.status()).status }, 201);
    } catch (error) {
      return json({ error: `could not start return ${id}`, detail: String(error) }, 409);
    }
  }
  let instance: WorkflowInstance;
  try {
    instance = await env.RETURNS.get(id);
  } catch {
    return json({ error: `no return ${id}` }, 404);
  }
  if (approve) {
    await instance.sendEvent({ type: "approved", payload: { by: url.searchParams.get("by") ?? "operations" } });
    return json({ approved: id });
  }
  // Only the documented fields of the instance status: local development adds others of its own.
  const { status, error, output } = await instance.status();
  return json({ id, status, ...(error ? { error } : {}), output: output ?? null });
}
