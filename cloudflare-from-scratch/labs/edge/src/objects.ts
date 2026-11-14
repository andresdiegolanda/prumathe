import { DurableObject } from "cloudflare:workers";
import type { Env } from "./env";

export interface ShipmentState {
  shipment: string;
  status: string;
  event: string | null;
  updated: string | null;
  delayed: boolean;
  watchers: number;
}

/** Seconds without a movement before a shipment is marked delayed: short, so the lab can see it. */
const DELAY_SECONDS = 8;
/** Statuses after which nothing else is expected, so no alarm is left waiting. */
const FINAL = ["delivered", "returned"];

/**
 * One Durable Object per shipment: the only place where its live status lives. It answers one call
 * at a time, keeps the status in its own SQLite storage, pushes every change to the browsers
 * connected by WebSocket and wakes itself with an alarm when the carrier goes quiet.
 */
export class Shipment extends DurableObject<Env> {
  /** name: the id the caller used, for an object that has not stored its own yet. */
  async state(name?: string): Promise<ShipmentState> {
    return {
      shipment: (await this.ctx.storage.get<string>("shipment")) ?? name ?? "unknown",
      status: (await this.ctx.storage.get<string>("status")) ?? "no movements yet",
      event: (await this.ctx.storage.get<string>("event")) ?? null,
      updated: (await this.ctx.storage.get<string>("updated")) ?? null,
      delayed: (await this.ctx.storage.get<boolean>("delayed")) ?? false,
      watchers: this.ctx.getWebSockets().length,
    };
  }

  async move(shipment: string, status: string, event: string): Promise<ShipmentState> {
    await this.ctx.storage.put({ shipment, status, event, updated: new Date().toISOString(), delayed: false });
    if (FINAL.includes(status)) await this.ctx.storage.deleteAlarm();
    else await this.ctx.storage.setAlarm(Date.now() + DELAY_SECONDS * 1000);
    const now = await this.state();
    this.broadcast(now);
    return now;
  }

  async alarm(): Promise<void> {
    await this.ctx.storage.put("delayed", true);
    this.broadcast(await this.state());
  }

  /** WebSocket upgrade: the hibernation API lets the object sleep while sockets stay open. */
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("upgrade") !== "websocket") return new Response("expected a WebSocket", { status: 426 });
    const url = new URL(request.url);
    await this.ctx.storage.put("shipment", url.pathname.split("/")[2] ?? "unknown");
    const pair = new WebSocketPair();
    this.ctx.acceptWebSocket(pair[1]);
    pair[1].send(JSON.stringify({ type: "snapshot", ...(await this.state()) }));
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async webSocketMessage(ws: WebSocket): Promise<void> {
    ws.send(JSON.stringify({ type: "snapshot", ...(await this.state()) }));
  }

  private broadcast(state: ShipmentState): void {
    for (const ws of this.ctx.getWebSockets()) ws.send(JSON.stringify({ type: "update", ...state }));
  }
}

/** A counter in one place: increments arrive one at a time, so none is lost. */
export class Counter extends DurableObject<Env> {
  async increment(): Promise<number> {
    const next = ((await this.ctx.storage.get<number>("n")) ?? 0) + 1;
    await this.ctx.storage.put("n", next);
    return next;
  }

  async value(): Promise<number> {
    return (await this.ctx.storage.get<number>("n")) ?? 0;
  }
}
