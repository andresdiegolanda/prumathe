/**
 * Rumbo on workers.dev: one route per caching case of lesson 10, and /version for the gradual
 * deployment of lesson 09. Every answer says which version produced it and when.
 */
interface Env {
  VERSION: string;
}

const routes: Record<string, { headers: Record<string, string>; note: string }> = {
  "/c/public": { headers: { "cache-control": "public, max-age=60" }, note: "public for 60 seconds: the edge keeps it" },
  "/c/private": { headers: { "cache-control": "private, max-age=60" }, note: "private: only the browser may keep it" },
  "/c/no-store": { headers: { "cache-control": "no-store" }, note: "no-store: nobody keeps it" },
  "/c/cookie": { headers: { "cache-control": "public, max-age=60", "set-cookie": "session=demo; Secure; HttpOnly" }, note: "public, but with Set-Cookie" },
  "/c/silent": { headers: {}, note: "no Cache-Control at all: the edge decides" },
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const route = routes[url.pathname];
    const common = { "content-type": "application/json; charset=utf-8", "x-rumbo-version": env.VERSION };
    if (url.pathname === "/version") {
      return Response.json({ version: env.VERSION }, { headers: { ...common, "cache-control": "no-store" } });
    }
    if (!route) {
      return Response.json({ worker: "rumbo-edge-demo", version: env.VERSION, routes: ["/version", ...Object.keys(routes)] }, { headers: { ...common, "cache-control": "no-store" } });
    }
    const body = { path: url.pathname, note: route.note, generated: new Date().toISOString(), version: env.VERSION };
    return new Response(`${JSON.stringify(body, null, 2)}\n`, { headers: { ...common, ...route.headers } });
  },
} satisfies ExportedHandler<Env>;
