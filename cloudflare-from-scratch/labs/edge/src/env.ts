import type { Counter, Shipment } from "./objects";
import type { ReturnFlow } from "./returns";

/** Everything the Worker can reach, as declared in wrangler.jsonc. */
export interface Env {
  ORIGIN: string;
  ALLOWED_ORIGIN: string;
  ISSUER: string;
  RUMBO_TOKEN?: string;
  FLAGS: KVNamespace;
  DB: D1Database;
  PROOFS: R2Bucket;
  SHIPMENTS: DurableObjectNamespace<Shipment>;
  COUNTERS: DurableObjectNamespace<Counter>;
  MOVES: Queue<Movement>;
  RETURNS: Workflow<{ shipment: string; reason: string }>;
  LIMITER: RateLimit;
  PG: Hyperdrive;
}

/** One movement reported by a carrier: the message that travels through the queue. sent tells
    one delivery of the webhook from another, so the lab can wait for the right one. */
export interface Movement {
  event: string;
  shipment: string;
  status: string;
  sent?: string;
}
