import postgres from "postgres";
import type { Env } from "./env";
import { json } from "./http";

/** D1: a quote answered at the edge, from the zones table, and recorded. */
export async function quote(url: URL, env: Env): Promise<Response> {
  const code = (url.searchParams.get("zone") ?? "").toUpperCase();
  const kg = Number(url.searchParams.get("kg") ?? "1");
  const zone = await env.DB.prepare("SELECT code, name, days, base_eur, per_kg_eur FROM zones WHERE code = ?")
    .bind(code)
    .first<{ code: string; name: string; days: number; base_eur: number; per_kg_eur: number }>();
  if (!zone) return json({ error: "unknown zone", zone: code }, 404);
  const total = Math.round((zone.base_eur + zone.per_kg_eur * kg) * 100) / 100;
  const saved = await env.DB.prepare("INSERT INTO quotes (zone, kg, total_eur) VALUES (?, ?, ?)").bind(code, kg, total).run();
  return json({ zone: zone.code, name: zone.name, days: zone.days, kg, total_eur: total, quote: saved.meta.last_row_id });
}

/** R2: proofs of delivery, stored and served by the edge. */
export async function proof(request: Request, shipment: string, env: Env): Promise<Response> {
  const key = `proofs/${shipment}.txt`;
  if (request.method === "PUT") {
    const object = await env.PROOFS.put(key, request.body, { httpMetadata: { contentType: request.headers.get("content-type") ?? "text/plain" } });
    return json({ stored: object?.key, size: object?.size, etag: object?.etag }, 201);
  }
  const object = await env.PROOFS.get(key);
  if (!object) return json({ error: "no proof for this shipment", shipment }, 404);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("x-rumbo-via", "edge, r2");
  return new Response(object.body, { headers });
}

/** Hyperdrive: the edge reads the database of the origin directly. */
export async function direct(shipment: string, env: Env): Promise<Response> {
  const sql = postgres(env.PG.connectionString, { max: 1, fetch_types: false });
  try {
    const rows = await sql`SELECT id, destination, status, updated FROM shipments WHERE id = ${shipment}`;
    if (!rows.length) return json({ error: "unknown shipment", shipment }, 404);
    return json(rows[0], 200, { "x-rumbo-via": "edge, hyperdrive" });
  } finally {
    await sql.end();
  }
}

/** The daily close: what the cron trigger computes at 03:00 UTC. */
export async function close(env: Env): Promise<{ at: string; byStatus: Record<string, number> }> {
  const sql = postgres(env.PG.connectionString, { max: 1, fetch_types: false });
  try {
    const rows = await sql<{ status: string; n: number }[]>`SELECT status, count(*)::int AS n FROM shipments GROUP BY status ORDER BY status`;
    const summary = { at: new Date().toISOString(), byStatus: Object.fromEntries(rows.map((r) => [r.status, r.n])) };
    await env.FLAGS.put("close:last", JSON.stringify(summary));
    return summary;
  } finally {
    await sql.end();
  }
}
