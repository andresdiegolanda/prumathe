/* Checks the live viewer after the lessons ran (npm run test:labs): it only reads, answers only to
   this computer, sends its CSP, and holds an event for every step that runs the lab or the app,
   MCP sessions over HTTP and stdio, and no recorded secret. Usage: node scripts/test-visor.mjs
   It needs `docker compose up -d --wait visor` and writes the evidence to .qa/visor.json. */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 18093;
const SECRET = new Set(['authorization', 'proxy-authorization', 'x-api-key', 'api-key', 'cookie', 'set-cookie']);

function request(method, url, host = `127.0.0.1:${PORT}`) {
  return new Promise((resolve, reject) => {
    const r = http.request({ host: '127.0.0.1', port: PORT, method, path: url, headers: { Host: host } }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
    });
    r.on('error', reject);
    r.end();
  });
}

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`);
};

const page = await request('GET', '/');
check('the page answers', page.status === 200 && page.body.includes('visor.js'));
check('CSP without inline code', /default-src 'none'; script-src 'self'; style-src 'self'/.test(page.headers['content-security-policy'] ?? ''));
check('nosniff', page.headers['x-content-type-options'] === 'nosniff');
for (const method of ['POST', 'PUT', 'DELETE']) {
  const r = await request(method, '/api/events');
  check(`${method} is refused`, r.status === 405 && r.headers.allow === 'GET, HEAD', String(r.status));
}
const rebinding = await request('GET', '/', `evil.example:${PORT}`);
check('another host name is refused', rebinding.status === 403, String(rebinding.status));
check('the server code is not served', (await request('GET', '/server.mjs')).status === 404);
check('an id outside the events is not found', (await request('GET', '/api/event?id=..%2F..%2Fetc%2Fpasswd')).status === 404);

const list = JSON.parse((await request('GET', '/api/events')).body);
const details = [];
for (const e of list.events) details.push(JSON.parse((await request('GET', `/api/event?id=${encodeURIComponent(e.id)}`)).body));
check('every event loads', details.length === list.events.length && details.every((d) => d.id), `${details.length} events`);
const commands = details.filter((d) => d.kind === 'command');
check('events of the lab', commands.some((d) => d.source === 'lab'), String(commands.filter((d) => d.source === 'lab').length));
check('events of the app', commands.some((d) => d.source === 'app'), String(commands.filter((d) => d.source === 'app').length));
const sessions = details.filter((d) => d.kind === 'session');
check('MCP sessions over HTTP (Inspector)', sessions.some((d) => d.transport === 'http'), String(sessions.filter((d) => d.transport === 'http').length));
check('MCP session over stdio', sessions.some((d) => d.transport === 'stdio'));
check('MCP messages joined to the commands that sent them', commands.some((d) => d.source === 'app' && d.event.argv[0] === 'agent' && d.rpc.length > 0)
  && commands.some((d) => d.source === 'lab' && d.event.argv[0] === 'mcp-wire' && d.rpc.length > 0));

// Every lab and app step of the lessons left its event, with the same command line.
const viewer = JSON.parse(fs.readFileSync(path.join(root, 'labs/visor/static/lessons.json'), 'utf8'));
const seen = new Set(commands.map((d) => JSON.stringify([d.source, d.event.argv])));
const missing = viewer.commands.filter((c) => ['lab', 'app'].includes(c.tool) && !seen.has(JSON.stringify([c.tool, c.argv])))
  .filter((c) => !(c.argv.includes('--remote')));
check('an event for every lab and app step', missing.length === 0, missing.map((c) => `${c.lesson}.${c.step}`).join(', ') || `${viewer.commands.filter((c) => ['lab', 'app'].includes(c.tool)).length} steps`);

// No secret recorded: every secret header says it was not recorded.
const leaks = [];
const headersOf = (d) => [
  ...(d.event?.calls ?? []).flatMap((c) => [c.requestHeaders, c.responseHeaders]),
  ...(d.rpc ?? []).flatMap((l) => [l.request?.headers, l.response?.headers]),
].filter(Boolean);
for (const d of details) for (const h of headersOf(d)) for (const [k, v] of Object.entries(h)) if (SECRET.has(k.toLowerCase()) && v !== '[not recorded]') leaks.push(`${d.id} ${k}`);
check('no secret header recorded', leaks.length === 0, leaks.join(', '));
const env = path.join(root, 'labs/.env');
if (fs.existsSync(env)) {
  const key = (fs.readFileSync(env, 'utf8').match(/^LLM_API_KEY=(.+)$/m)?.[1] ?? '').trim();
  if (key) check('the key of labs/.env appears in no event', !JSON.stringify(details).includes(key));
}

const bytes = JSON.stringify(details).length;
fs.mkdirSync(path.join(root, '.qa'), { recursive: true });
fs.writeFileSync(path.join(root, '.qa/visor.json'), JSON.stringify({ date: new Date().toISOString(), events: details.length, commands: commands.length, sessions: sessions.length, bytes, results }, null, 2) + '\n');
const failed = results.filter((r) => !r.ok).length;
console.log(`${results.length - failed} of ${results.length} checks passed; ${details.length} events, ${Math.round(bytes / 1024)} KB. Evidence: .qa/visor.json`);
if (failed) process.exitCode = 1;
