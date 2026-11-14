import type { Env, Movement } from "./env";
import { json } from "./http";

/** The carriers' webhook: answer at once and leave the work to the queue. */
export async function webhook(request: Request, env: Env): Promise<Response> {
  let body: Partial<Movement>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "expected a JSON body" }, 400);
  }
  if (!body.shipment || !body.status) return json({ error: "shipment and status are required" }, 400);
  const movement: Movement = { event: body.event ?? crypto.randomUUID(), shipment: body.shipment, status: body.status, sent: crypto.randomUUID() };
  await env.MOVES.send(movement);
  return json({ queued: movement.event, shipment: movement.shipment, status: movement.status, sent: movement.sent }, 202);
}

/** What the consumer last did with one event, kept so the lab can show it. */
interface Delivery extends Movement {
  attempts: number;
  outcome: string;
  at: string;
}

/**
 * The consumer: a batch of movements at a time. Each one is saved at the origin, whose table uses
 * the event id as primary key, so a message delivered twice is saved once. A status the origin
 * rejects is retried, and after max_retries the message goes to the dead letter queue.
 * message.attempts is counted by Queues itself: no counter of our own is needed.
 */
export async function consume(batch: MessageBatch<Movement>, env: Env): Promise<void> {
  if (batch.queue === "movements-dead") {
    for (const message of batch.messages) {
      const last = await env.FLAGS.get<Delivery>(`delivery:${message.body.event}`, "json");
      await env.FLAGS.put(`dead:${message.body.event}`, JSON.stringify({ ...message.body, attempts: last?.attempts ?? 0, outcome: last?.outcome ?? "unknown" }));
      message.ack();
    }
    return;
  }
  for (const message of batch.messages) {
    const m = message.body;
    const answer = await fetch(`${env.ORIGIN}/api/movements`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: m.event, shipment: m.shipment, status: m.status }),
    }).catch(() => null);
    const saved = answer?.ok ? ((await answer.json()) as { saved: boolean }).saved : null;
    const outcome = !answer ? "origin unreachable" : !answer.ok ? `rejected by the origin (${answer.status})` : saved ? "saved at the origin" : "already saved: not saved again";
    const delivery: Delivery = { ...m, attempts: message.attempts, outcome, at: new Date().toISOString() };
    await env.FLAGS.put(`delivery:${m.event}`, JSON.stringify(delivery));
    if (saved === null) {
      message.retry();
      continue;
    }
    if (saved) await env.SHIPMENTS.getByName(m.shipment).move(m.shipment, m.status, m.event);
    message.ack();
  }
}

export async function dead(env: Env): Promise<Response> {
  const list = await env.FLAGS.list({ prefix: "dead:" });
  const items = await Promise.all(list.keys.map(async (k) => JSON.parse((await env.FLAGS.get(k.name)) ?? "{}")));
  return json({ dead: items.map(({ sent, ...rest }) => rest) });
}

export async function delivery(event: string, env: Env): Promise<Response> {
  const last = await env.FLAGS.get<Delivery>(`delivery:${event}`, "json");
  const deadOne = await env.FLAGS.get<Delivery>(`dead:${event}`, "json");
  return json({ event, delivery: last, dead: deadOne !== null, deadSent: deadOne?.sent ?? null });
}
