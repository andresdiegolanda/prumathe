import { env, exports } from "cloudflare:workers";
import { afterEach, describe, expect, it, vi } from "vitest";

const call = (path: string, init?: RequestInit) => exports.default.fetch(`https://rumbo.example${path}`, init);

describe("the gateway of Rumbo", () => {
  afterEach(() => vi.restoreAllMocks());

  it("answers /health at the edge", async () => {
    const r = await call("/health");
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: true, worker: "rumbo-edge" });
  });

  it("blocks the admin API before it reaches the origin", async () => {
    const r = await call("/api/admin/users");
    expect(r.status).toBe(403);
  });

  it("answers the CORS preflight for the shop only", async () => {
    const shop = await call("/api/shipments/R-1042", { method: "OPTIONS", headers: { origin: "https://shop.example" } });
    expect(shop.status).toBe(204);
    expect(shop.headers.get("access-control-allow-origin")).toBe("https://shop.example");
    const other = await call("/api/shipments/R-1042", { method: "OPTIONS", headers: { origin: "https://other.example" } });
    expect(other.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("answers 503 while the maintenance flag is on", async () => {
    await env.FLAGS.put("maintenance", "on");
    const r = await call("/api/shipments/R-1042");
    expect(r.status).toBe(503);
    // The storage is shared by the tests of this file: leave it as it was.
    await env.FLAGS.delete("maintenance");
  });

  it("forwards to the origin and marks the answer", async () => {
    // The fake answer is built inside the request, like a real one: a body made outside it cannot be read.
    const origin = vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json({ id: "R-1042" }));
    const r = await call("/api/shipments/R-1042");
    expect(r.status).toBe(200);
    expect(r.headers.get("x-rumbo-via")).toBe("edge");
    const sent = origin.mock.calls[0][0] as Request;
    expect(sent.url).toBe("http://origin:8080/api/shipments/R-1042");
    expect(sent.headers.get("x-rumbo-request-id")).toBe(r.headers.get("x-rumbo-request-id"));
  });

  it("answers 502 when the origin does not answer", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Network connection lost."));
    const r = await call("/api/shipments/R-1042");
    expect(r.status).toBe(502);
  });
});
