/** Small helpers shared by the routes. */
export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body, null, 2) + "\n", {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

export function notFound(path: string): Response {
  return json({ error: "no such route at the edge", path }, 404);
}
