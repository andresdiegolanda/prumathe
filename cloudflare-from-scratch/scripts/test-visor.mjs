/* Checks the live viewer against the kit, after a full run of the labs: node scripts/test-visor.mjs
   The kit must be up (cd labs, docker compose up -d --wait); the spans of the run are kept in the
   edge-state volume, and the viewer reads them again when it starts. It only reads: no command of
   the lessons runs here. The evidence goes to .qa/visor.json. */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = { host: '127.0.0.1', port: 18098 };
const results = [];

function request(pathname, { method = 'GET', host = '127.0.0.1:18098' } = {}) {
  return new Promise((done, fail) => {
    const req = http.request({ ...BASE, path: pathname, method, headers: { Host: host }, timeout: 10000 }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (body += c));
      res.on('end', () => done({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', fail);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.end();
  });
}

async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, ok: true, ...(detail && { detail }) });
    console.log(`PASS ${name}${detail ? ': ' + detail : ''}`);
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
    console.log(`FAIL ${name}: ${error.message}`);
  }
}
const expect = (cond, message) => {
  if (!cond) throw new Error(message);
};

await check('the page, with its CSP and nosniff', async () => {
  const r = await request('/');
  expect(r.status === 200 && r.headers['content-type'].startsWith('text/html'), `status ${r.status}`);
  const csp = r.headers['content-security-policy'] ?? '';
  expect(csp.includes("script-src 'self'") && csp.includes("style-src 'self'") && !csp.includes('unsafe'), 'CSP ' + csp);
  expect(r.headers['x-content-type-options'] === 'nosniff', 'nosniff');
});
await check('its files, and nothing else', async () => {
  for (const f of ['/visor.js', '/visor.css', '/lessons.json', '/pieces.json', '/favicon.svg']) expect((await request(f)).status === 200, f);
  for (const f of ['/server.mjs', '/static/visor.js', '/../server.mjs', '/api']) expect((await request(f)).status === 404, f + ' should be 404');
});
await check('405 for POST, PUT and DELETE', async () => {
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const r = await request('/api/events', { method });
    expect(r.status === 405 && r.headers.allow === 'GET, HEAD', `${method}: ${r.status}`);
  }
});
await check('403 for another Host', async () => {
  for (const host of ['example.com', 'edge:8788', '127.0.0.1.nip.io:18098']) expect((await request('/', { host })).status === 403, host);
});

// The events of the run: the viewer reads them all again when it starts, so wait until it settles.
async function allEvents() {
  let all = [], after = 0, page;
  do {
    page = JSON.parse((await request(`/api/events?after=${after}`)).body);
    all = all.concat(page.events);
    after = all.at(-1)?.seq ?? after;
  } while (page.events.length === 300);
  return { edge: page.edge, events: all };
}
let data;
await check('the viewer reads the edge', async () => {
  let previous = -1;
  for (let i = 0; i < 60; i++) {
    data = await allEvents();
    if (data.edge && data.events.length && data.events.length === previous) break;
    previous = data.events.length;
    await new Promise((done) => setTimeout(done, 2000));
  }
  expect(data.edge === true, 'edge ' + data.edge);
  return `${data.events.length} events`;
});
const events = data?.events ?? [];
await check('requests, queue messages, alarms and cron', async () => {
  const kinds = new Set(events.map((e) => e.kind));
  for (const k of ['request', 'queue', 'alarm', 'cron']) expect(kinds.has(k), 'no ' + k);
  return [...kinds].join(', ');
});
await check('each event names the lab command and the lesson step before it', async () => {
  const lessons = JSON.parse(fs.readFileSync(path.join(root, 'labs/visor/static/lessons.json'), 'utf8'));
  const named = new Set(events.filter((e) => e.step).map((e) => e.step.lesson));
  for (const e of events.filter((x) => x.step)) {
    const c = lessons.commands.find((x) => x.lesson === e.step.lesson && x.step === e.step.step && x.argv.join(' ') === e.command);
    expect(c, `event ${e.id} names ${e.step.lesson}.${e.step.step} for ${e.command}`);
  }
  const want = [0, 1, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
  const missing = want.filter((l) => !named.has(l));
  expect(!missing.length, 'no events for lessons ' + missing.join(', '));
  return `${events.filter((e) => e.step).length} of ${events.length} events with a step, ${named.size} lessons`;
});
await check('every piece of the kit lights up at least once', async () => {
  const lit = new Set(events.flatMap((e) => e.path));
  const want = ['kit', 'worker', 'ratelimit', 'kv', 'cacheapi', 'd1', 'r2', 'queue', 'dobj', 'workflow', 'hyperdrive', 'postgres', 'consumer', 'alarm', 'cron', 'api'];
  const missing = want.filter((p) => !lit.has(p));
  expect(!missing.length, 'never lit: ' + missing.join(', '));
});
await check('the failing message: three attempts, then the dead letter queue', async () => {
  const of = events.filter((e) => e.step?.lesson === 22 && e.step.step === 3 && e.kind === 'queue');
  expect(of.filter((e) => e.label === 'queue movements').length >= 3, `${of.length} queue events`);
  expect(of.some((e) => e.label === 'queue movements-dead'), 'no movements-dead');
});
await check('the alarm of lesson 20, with no request in front', async () => {
  expect(events.some((e) => e.kind === 'alarm' && e.step?.lesson === 20), 'no alarm under lesson 20');
});
await check('no secret in what the viewer serves', async () => {
  const text = JSON.stringify(events).toLowerCase();
  for (const s of ['authorization', 'cookie', 'cf-access-jwt', 'eyj', 'cloudflare_api_token']) expect(!text.includes(s), s);
  const env = path.join(root, 'labs/.env');
  if (fs.existsSync(env)) {
    const token = /CLOUDFLARE_API_TOKEN=(\S+)/.exec(fs.readFileSync(env, 'utf8'))?.[1];
    if (token) expect(!text.includes(token.toLowerCase()), 'the token of labs/.env');
  }
});

fs.mkdirSync(path.join(root, '.qa'), { recursive: true });
fs.writeFileSync(path.join(root, '.qa', 'visor.json'), JSON.stringify({ date: new Date().toISOString(), results, events: events.length }, null, 2) + '\n');
const failed = results.filter((r) => !r.ok).length;
console.log(`${results.length - failed} of ${results.length} checks passed. Evidence: .qa/visor.json`);
process.exit(failed ? 1 : 0);
