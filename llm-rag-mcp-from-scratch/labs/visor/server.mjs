// The live viewer of the course. It reads the events volume, where every lab and app command
// writes one JSON file when it ends and every MCP server appends one line per message, and serves
// them to the page in static/. It only reads: it answers GET and HEAD, nothing else, and only to
// requests addressed to this computer. It never talks to the models or to the MCP servers.
import { createServer } from 'node:http';
import { closeSync, openSync, readFileSync, readSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIR = process.env.EVENTS_DIR ?? '/events';
const PORT = Number(process.env.PORT ?? 18093);
const STATIC = join(import.meta.dirname, 'static');
const HOSTS = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`, `[::1]:${PORT}`]);
// A new MCP session starts with initialize, or after this long without messages.
const GAP = 3000;
// A message of a server belongs to a command when it falls in the command's time, give or take this.
const SLACK = 1000;

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };
const FILES = new Map(['index.html', 'visor.css', 'visor.js', 'favicon.svg', 'lessons.json'].map((name) => [
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

// ---------------------------------------------------------------------------- the events folder

const commands = new Map(); // file name -> the event of a command, once written
const logs = new Map(); // file name -> { size, rest, lines } of an MCP server log

function readFrom(file, start, length) {
  const buf = Buffer.alloc(length);
  const fd = openSync(file, 'r');
  try {
    readSync(fd, buf, 0, length, start);
  } finally {
    closeSync(fd);
  }
  return buf;
}

/** Reads what is new in the folder: command files once, and the lines added to each log. */
function scan() {
  let names;
  try {
    names = readdirSync(DIR);
  } catch {
    commands.clear();
    logs.clear();
    return;
  }
  const present = new Set(names);
  for (const name of [...commands.keys()]) if (!present.has(name)) commands.delete(name);
  for (const name of [...logs.keys()]) if (!present.has(name)) logs.delete(name);
  for (const name of names) {
    const file = join(DIR, name);
    if (name.endsWith('.json') && !commands.has(name)) {
      try {
        const event = JSON.parse(readFileSync(file, 'utf8'));
        if (event && event.type === 'command' && Number.isFinite(event.start)) commands.set(name, event);
      } catch {
        // Not an event of the course: ignored.
      }
    } else if (name.endsWith('.jsonl')) {
      let size;
      try {
        size = statSync(file).size;
      } catch {
        continue;
      }
      let log = logs.get(name);
      if (!log || size < log.size) {
        log = { size: 0, rest: Buffer.alloc(0), lines: [] };
        logs.set(name, log);
      }
      if (size === log.size) continue;
      // Bytes, not text, until a whole line is in: a character can be split between two reads.
      const bytes = Buffer.concat([log.rest, readFrom(file, log.size, size - log.size)]);
      log.size = size;
      const last = bytes.lastIndexOf(10);
      log.rest = bytes.subarray(last + 1);
      if (last < 0) continue;
      for (const part of bytes.subarray(0, last).toString('utf8').split('\n')) {
        try {
          const line = JSON.parse(part);
          if (line && line.type === 'rpc' && Number.isFinite(line.at)) log.lines.push(line);
        } catch {
          // A line that is not JSON is skipped.
        }
      }
    }
  }
}

const isInitialize = (line) => {
  const body = line.transport === 'stdio' ? (line.direction === 'in' ? line.body : '') : line.request?.body;
  return /"method"\s*:\s*"initialize"/.test(body ?? '');
};

/**
 * The list the page shows: each command with the server messages of its time, and the messages
 * no command explains (the Inspector, the stdio server) grouped in sessions.
 */
function build() {
  scan();
  const list = [...commands.entries()].map(([name, e]) => ({
    id: name.slice(0, -5), kind: 'command', source: e.source, start: e.start, end: e.end ?? e.start, event: e, rpc: [],
  }));
  list.sort((a, b) => a.start - b.start);
  const loose = [];
  for (const [name, log] of logs) {
    log.lines.forEach((line, index) => {
      const owner = line.transport === 'stdio' ? null : list.find((c) => line.at >= c.start - SLACK && line.at <= c.end + SLACK);
      if (owner) owner.rpc.push(line);
      else loose.push({ name, index, line });
    });
  }
  loose.sort((a, b) => a.line.at - b.line.at);
  const sessions = [];
  const open = new Map(); // log file -> its current session
  for (const item of loose) {
    let s = open.get(item.name);
    const stdio = item.line.transport === 'stdio';
    if (!s || (!stdio && (item.line.at - s.end > GAP || isInitialize(item.line)))) {
      s = { id: `${item.name.slice(0, -6)}~${item.index}`, kind: 'session', source: item.line.source, transport: item.line.transport, start: item.line.at, end: item.line.at, rpc: [] };
      sessions.push(s);
      open.set(item.name, s);
    }
    s.rpc.push(item.line);
    s.end = Math.max(s.end, item.line.at + (item.line.ms ?? 0));
  }
  const all = [...list, ...sessions].sort((a, b) => a.start - b.start);
  for (const e of all) {
    e.rpc.sort((a, b) => a.at - b.at);
    e.rev = e.rpc.length;
  }
  return all;
}

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619) >>> 0;
  return h.toString(16);
}

// ---------------------------------------------------------------------------- HTTP

function send(res, status, type, body, extra, head) {
  res.writeHead(status, { ...SECURITY, 'Content-Type': type, 'Content-Length': Buffer.byteLength(body), ...extra });
  res.end(head ? undefined : body);
}

const json = (res, status, value, head) => send(res, status, 'application/json; charset=utf-8', JSON.stringify(value), { 'Cache-Control': 'no-store' }, head);

createServer((req, res) => {
  const head = req.method === 'HEAD';
  if (req.method !== 'GET' && !head) {
    send(res, 405, 'text/plain; charset=utf-8', 'The viewer only reads: GET and HEAD.\n', { Allow: 'GET, HEAD' }, false);
    return;
  }
  // DNS rebinding: a page of another site whose name resolves to 127.0.0.1 still sends its own name.
  if (!HOSTS.has(String(req.headers.host ?? '').toLowerCase())) {
    send(res, 403, 'text/plain; charset=utf-8', `Open the viewer at http://localhost:${PORT} or http://127.0.0.1:${PORT}.\n`, {}, head);
    return;
  }
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const file = FILES.get(url.pathname);
  if (file) {
    send(res, 200, file.type, file.body, { 'Cache-Control': 'no-cache' }, head);
    return;
  }
  if (url.pathname === '/api/events') {
    const all = build();
    const events = all.map(({ id, kind, source, transport, start, end, rev, event }) => ({
      id, kind, source, transport, start, end, rev, ...(event && { argv: event.argv, exit: event.exit }),
    }));
    json(res, 200, { version: hash(events.map((e) => `${e.id}:${e.rev}`).join(',')), events }, head);
    return;
  }
  if (url.pathname === '/api/event') {
    const id = url.searchParams.get('id') ?? '';
    const found = build().find((e) => e.id === id);
    if (!found) {
      json(res, 404, { error: 'No event with that id.' }, head);
      return;
    }
    json(res, 200, found, head);
    return;
  }
  send(res, 404, 'text/plain; charset=utf-8', 'Not found.\n', {}, head);
}).listen(PORT, '0.0.0.0', () => console.log(`Live viewer on port ${PORT}, reading ${DIR}`));
