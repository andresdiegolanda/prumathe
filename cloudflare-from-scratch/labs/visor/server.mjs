// The live viewer of the kit: http://127.0.0.1:18098. It runs inside the edge container, next to
// wrangler dev, and reads the spans that wrangler dev records for every request, message, alarm
// and cron, from the same local API that `lab spans` uses. It only reads: it answers GET and HEAD,
// nothing else, and only to requests addressed to this computer. It never calls the Worker.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PORT = Number(process.env.VISOR_PORT ?? 8788);
const PUBLISHED = 18098;
const EXPLORER = 'http://127.0.0.1:8787/cdn-cgi/local/explorer/api/local/observability/query';
const STATIC = join(import.meta.dirname, 'static');
const HOSTS = new Set([`localhost:${PUBLISHED}`, `127.0.0.1:${PUBLISHED}`, `[::1]:${PUBLISHED}`, `localhost:${PORT}`, `127.0.0.1:${PORT}`]);
const KEEP = 2000;

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };
const FILES = new Map(['index.html', 'visor.css', 'visor.js', 'favicon.svg', 'lessons.json', 'pieces.json'].map((name) => [
  name === 'index.html' ? '/' : `/${name}`,
  { body: readFileSync(join(STATIC, name)), type: TYPES[name.slice(name.lastIndexOf('.'))] },
]));
const SECURITY = {
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// ------------------------------------------------------------------ the lessons, for each command

const course = JSON.parse(FILES.get('/lessons.json').body);
let cursor = 0;

/** The lesson step of a lab command: the first match from where the last one was, else from the start. */
function stepOf(argv) {
  const at = (from) => course.commands.findIndex((c, i) => i >= from && c.argv.join(' ') === argv);
  let i = at(cursor);
  if (i < 0) i = at(0);
  if (i < 0) return null;
  cursor = i + 1;
  return { lesson: course.commands[i].lesson, step: course.commands[i].step };
}

// ----------------------------------------------------------------------------- the local spans

async function query(sql, params = []) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(EXPLORER, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sql, params }),
      signal: AbortSignal.timeout(5000),
    });
    const j = await r.json().catch(() => ({}));
    if (j.result) return j.result.rows;
    // 10000: the local runtime was busy or restarting; it answers a moment later.
    await new Promise((done) => setTimeout(done, 300));
  }
  throw new Error('the local explorer did not answer');
}

const attr = (json) => {
  try {
    return JSON.parse(json ?? '{}') ?? {};
  } catch {
    return {};
  }
};

/** One span, as a step of the drawing: the piece it touches and what it did. Others are left out. */
function describe(span) {
  const a = span.a;
  if (span.service !== 'rumbo-edge') return span.service === 'returns' ? { piece: 'workflow', label: 'Workflow' } : null;
  switch (span.name) {
    case 'kv_get':
    case 'kv_put':
    case 'kv_delete':
    case 'kv_list':
      return { piece: 'kv', label: `KV ${span.name.slice(3)} ${a['cloudflare.kv.query.keys'] ?? a['cloudflare.kv.query.prefix'] ?? ''}`.trim() };
    case 'd1_first':
    case 'd1_run':
    case 'd1_all':
    case 'd1_raw':
    case 'd1_batch':
    case 'd1_exec':
      return { piece: 'd1', label: `D1 ${span.name.slice(3)}` };
    case 'r2_get':
    case 'r2_put':
    case 'r2_head':
    case 'r2_list':
    case 'r2_delete':
      return { piece: 'r2', label: `R2 ${span.name.slice(3)} ${a['cloudflare.r2.request.key'] ?? ''}`.trim() };
    case 'cache_match':
    case 'cache_put':
    case 'cache_delete':
      return { piece: 'cacheapi', label: `cache ${span.name.slice(6)}${a['cache.response.cache_status'] ? ': ' + a['cache.response.cache_status'] : ''}` };
    case 'queue_send':
      return { piece: 'queue', label: 'queue send' };
    case 'hyperdrive_connect':
      return { piece: 'hyperdrive', label: 'Hyperdrive' };
    case 'durable_object_subrequest':
      return { piece: 'dobj', label: 'Durable Object' };
    case 'durable_object_storage_setAlarm':
      return { piece: 'alarm', label: 'setAlarm' };
    case 'durable_object_storage_deleteAlarm':
      return { piece: 'alarm', label: 'deleteAlarm' };
    case 'hibernatableWebSocket':
      return { piece: 'dobj', label: 'WebSocket' };
    case 'fetch': {
      let u;
      try {
        u = new URL(String(a['url.full']));
      } catch {
        return null;
      }
      if (u.hostname === 'ratelimit') return { piece: 'ratelimit', label: 'rate limit' };
      if (['d1', 'r2', 'kv', 'cache'].includes(u.hostname)) return null;
      return { piece: u.hostname === 'origin' ? 'api' : null, label: `fetch ${u.host}${u.pathname}` };
    }
    default:
      return null;
  }
}

/** A root span with its whole trace, as an event of the page. */
async function event(root) {
  const rows = await query(
    'SELECT service, kind, name, start_ms, duration_ms, json(attributes) FROM spans WHERE trace_id = ? AND parent_id IS NOT NULL ORDER BY start_ms, rowid',
    [root.trace],
  );
  const a = root.a;
  let kind, label, from;
  if (root.kind === 'http') {
    const u = new URL(String(a['url.full'] ?? 'http://edge/'));
    kind = 'request';
    label = `${root.name} ${u.pathname}${u.search}`;
    from = ['kit', 'worker'];
  } else if (root.kind === 'queue') {
    kind = 'queue';
    label = `queue ${a['cloudflare.queue.name'] ?? ''}`.trim();
    from = ['queue', 'consumer'];
  } else if (root.name === 'alarm') {
    kind = 'alarm';
    label = 'alarm';
    from = ['dobj', 'alarm'];
  } else if (root.name === 'scheduled') {
    kind = 'cron';
    label = `cron ${a['faas.cron'] ?? ''}`.trim();
    from = ['cron'];
  } else {
    kind = 'other';
    label = root.name;
    from = ['worker'];
  }
  const steps = [];
  let workflow = false;
  for (const [service, , name, start, duration, attrs] of rows) {
    const d = describe({ service, name, a: attr(attrs) });
    if (!d) continue;
    if (d.piece === 'workflow') {
      if (workflow) continue;
      workflow = true;
    }
    steps.push({ ...d, start: Math.max(0, (start ?? root.start) - root.start), ms: duration ?? 0 });
  }
  const path = [...from];
  for (const s of steps) {
    if (s.piece && path.at(-1) !== s.piece) path.push(s.piece);
    if (s.piece === 'hyperdrive') path.push('postgres');
  }
  return {
    id: root.rowid,
    kind,
    label,
    status: a['http.response.status_code'] ?? null,
    outcome: root.outcome,
    ms: root.duration ?? 0,
    step: root.step,
    command: root.command,
    path,
    steps,
  };
}

// --------------------------------------------------------------------- the events, in order

const BOOT = Date.now().toString(36);
const events = [];
const pending = new Map(); // rowid -> a request still running, already given its command
let last = 0;
let seq = 0;
let edge = false;
let lastCommand = null;

async function emit(root) {
  events.push({ ...(await event(root)), seq: ++seq });
  if (events.length > KEEP) events.splice(0, events.length - KEEP);
}

/** New root spans in the order they arrived: lab marks name the command, the rest become events. */
async function scan() {
  const roots = await query(
    "SELECT rowid, trace_id, kind, name, outcome, start_ms, duration_ms, json(attributes) FROM spans WHERE parent_id IS NULL AND service = 'rumbo-edge' AND rowid > ? ORDER BY rowid LIMIT 200",
    [last],
  );
  for (const [rowid, trace, kind, name, outcome, start, duration, attrs] of roots) {
    last = rowid;
    const a = attr(attrs);
    const url = String(a['url.full'] ?? '');
    // Every lab command first asks /health?run=<command>&poll=lab, so what follows is its doing.
    const run = /[?&]run=([^&]*)&poll=lab$/.exec(url);
    if (run) {
      const argv = decodeURIComponent(run[1]);
      lastCommand = { argv, step: stepOf(argv) };
      continue;
    }
    if (url.endsWith('poll=lab')) continue;
    const root = { rowid, trace, kind, name, start, a, step: lastCommand?.step ?? null, command: lastCommand?.argv ?? null, since: Date.now() };
    if (duration === null) pending.set(rowid, root);
    else await emit({ ...root, outcome, duration });
  }
  // A WebSocket or a long request ends later; it keeps the command it had when it started.
  if (pending.size) {
    const rows = await query(`SELECT rowid, outcome, duration_ms, json(attributes) FROM spans WHERE rowid IN (${[...pending.keys()].join(',')})`);
    for (const [rowid, outcome, duration, attrs] of rows) {
      const root = pending.get(rowid);
      if (duration !== null) {
        pending.delete(rowid);
        await emit({ ...root, a: attr(attrs), outcome, duration });
      } else if (Date.now() - root.since > 120000) pending.delete(rowid);
    }
  }
}

async function loop() {
  try {
    await scan();
    edge = true;
  } catch {
    edge = false;
  }
  setTimeout(loop, 1000);
}
loop();

// ---------------------------------------------------------------------------- the web server

function send(res, status, type, body, extra = {}) {
  res.writeHead(status, { ...SECURITY, 'Content-Type': type, ...extra });
  res.end(body);
}

createServer((req, res) => {
  if (!HOSTS.has(req.headers.host ?? '')) return send(res, 403, 'text/plain; charset=utf-8', 'This viewer answers only at http://127.0.0.1:18098\n');
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'text/plain; charset=utf-8', 'The viewer only reads.\n', { Allow: 'GET, HEAD' });
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/events') {
    const after = Number(url.searchParams.get('after') ?? 0) || 0;
    const body = JSON.stringify({ boot: BOOT, edge, version: course.version, events: events.filter((e) => e.seq > after).slice(0, 300) });
    return send(res, 200, TYPES['.json'], req.method === 'HEAD' ? '' : body, { 'Cache-Control': 'no-store' });
  }
  if (url.pathname === '/health') return send(res, 200, 'text/plain; charset=utf-8', 'ok\n', { 'Cache-Control': 'no-store' });
  const file = FILES.get(url.pathname);
  if (!file) return send(res, 404, 'text/plain; charset=utf-8', 'Not found.\n');
  send(res, 200, file.type, req.method === 'HEAD' ? '' : file.body, { 'Cache-Control': 'no-cache' });
}).listen(PORT, '0.0.0.0');
