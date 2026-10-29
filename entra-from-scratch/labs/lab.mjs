import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';

const root = path.dirname(fileURLToPath(import.meta.url));
const API = 'http://127.0.0.1:18095';
const ISSUER = 'http://127.0.0.1:18096';
let count = 0;
const evidence = [];
function pass(label) { count++; evidence.push(label); console.log('PASS ' + label); }
function sql(statement) {
  const result = spawnSync('docker', ['compose', '-f', path.join(root, 'compose.yaml'), 'exec', '-T', 'db',
    'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U', 'course_admin', '-d', 'procurement', '-At', '-c', statement], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message || 'SQL failed');
  return result.stdout.trim();
}
async function token(name) {
  const result = await fetch(ISSUER + '/token?case=' + name);
  assert.equal(result.status, 200);
  return (await result.json()).access_token;
}
async function request(name, id = 41, method = 'GET', expected = 200, extraHeaders = {}) {
  const headers = { ...extraHeaders };
  if (name) headers.Authorization = 'Bearer ' + await token(name);
  const response = await fetch(API + '/api/requests/' + id + (method === 'POST' ? '/approve' : ''), { method, headers });
  const body = await response.text();
  console.log(`${method} request/${id} | ${name || 'no token'} -> ${response.status}`);
  assert.equal(response.status, expected, body);
  pass(`${name || 'no token'}: HTTP ${expected}`);
  return { response, body };
}
const scenarios = {
  async setup() {
    const target = path.join(root, 'frontend/public/config.json');
    if (!fs.existsSync(target)) fs.copyFileSync(path.join(root, 'frontend/public/config.example.json'), target);
    console.log('Frontend configuration present. Node ' + process.versions.node);
    console.log('Next: docker compose up -d --build. Then, in frontend: npm ci; npm start.');
    console.log('Open http://localhost:18094. Local fixture mode never signs in a real person.');
    pass('setup preserved any existing configuration');
  },
  async boundary() { await request(null, 41, 'GET', 401); await request('alice'); },
  async tokens() {
    const raw = await token('alice');
    const c = JSON.parse(Buffer.from(raw.split('.')[1], 'base64url'));
    console.log(JSON.stringify({ iss: c.iss, aud: c.aud, tid: c.tid, oid: c.oid, scp: c.scp, roles: c.roles }, null, 2));
    console.log('Decoded fixture claims. Decoding has NOT checked the signature.');
    await request('id-token', 41, 'GET', 401);
    await request('alice');
  },
  async audience() { await request('wrong-audience', 41, 'GET', 401); await request('alice'); },
  async signature() { await request('forged', 41, 'GET', 401); await request('wrong-issuer', 41, 'GET', 401); },
  async time() { await request('expired', 41, 'GET', 401); await request('future', 41, 'GET', 401); },
  async scopes() { await request('no-scope', 42, 'POST', 403); await request('no-scope', 41, 'GET', 200); },
  async roles() { await request('no-role', 42, 'POST', 403); await request('approver', 41, 'POST', 404); },
  async delegation() { await request('app-only', 42, 'POST', 403); await request('wrong-client', 41, 'GET', 401); },
  async owner() { await request('alice', 42, 'GET', 404); await request('bob', 42); },
  async tenant() { await request('other-tenant', 43, 'GET', 401); await request('alice', 43, 'GET', 404); },
  async subject() { await request('missing-subject', 41, 'GET', 401); await request('alice'); },
  async database() {
    const principal = sql('SET ROLE app_runtime; SELECT current_user;');
    assert.equal(principal.split('\n').at(-1), 'app_runtime');
    console.log('Database principal: app_runtime'); pass('database connection has its own role');
    const privileges = sql("SELECT has_column_privilege('app_runtime', 'purchase_request', 'owner_oid', 'UPDATE'), has_column_privilege('app_runtime', 'purchase_request', 'status', 'UPDATE');");
    assert.equal(privileges, 'f|t');
    console.log('May update owner_oid: false; may update status: true'); pass('column grants prevent rewriting ownership');
  },
  async http() {
    const missing = await fetch(API + '/api/requests/41');
    assert.equal(missing.status, 401);
    assert.match(missing.headers.get('www-authenticate') || '', /^Bearer/);
    console.log('401 with WWW-Authenticate: Bearer'); pass('missing authentication produces a bearer challenge');
    const denied = await fetch(API + '/api/requests/42', { headers: { Authorization: 'Bearer ' + await token('alice') } });
    assert.equal(denied.status, 404);
    assert.ok(!(await denied.text()).includes('reference books'));
    console.log('404 without the protected description'); pass('row denial does not reveal the description');
  },
  async rls() {
    const flags = sql("SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname = 'app_runtime'");
    assert.equal(flags, 'app_runtime|f|f'); console.log(flags); pass('runtime is neither superuser nor BYPASSRLS');
    const without = sql('SET ROLE app_runtime; SELECT count(*) FROM purchase_request;');
    assert.equal(without.split('\n').at(-1), '0'); console.log('Rows without context: 0'); pass('RLS denies rows without context');
    const withContext = sql("BEGIN; SET LOCAL ROLE app_runtime; SELECT set_config('app.tenant', '11111111-1111-4111-8111-111111111111', true); SELECT set_config('app.subject', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true); SELECT id FROM purchase_request ORDER BY id; ROLLBACK;");
    assert.match(withContext, /\n41\n/); assert.doesNotMatch(withContext, /\n(42|43)\n/);
    console.log('Unfiltered SELECT under Alice context: 41'); pass('RLS filters an unscoped SELECT');
  },
  async pool() {
    const after = sql("BEGIN; SET LOCAL ROLE app_runtime; SELECT set_config('app.tenant', '11111111-1111-4111-8111-111111111111', true); SELECT set_config('app.subject', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true); SELECT count(*) FROM purchase_request; COMMIT; SET ROLE app_runtime; SELECT count(*) FROM purchase_request;");
    assert.equal(after.split('\n').at(-1), '0'); console.log('Same SQL connection after COMMIT: 0 visible rows'); pass('transaction-local context resets after commit');
    for (let i = 0; i < 4; i++) { await request('alice'); await request('bob', 41, 'GET', 404); }
  },
  async atomic() {
    // Reset only the fixed practice row. No other course or database is touched.
    sql("UPDATE purchase_request SET status='PENDING' WHERE id=42;");
    const raw = await token('approver');
    const results = await Promise.all([1, 2].map(() => fetch(API + '/api/requests/42/approve', { method: 'POST', headers: { Authorization: 'Bearer ' + raw } })));
    assert.deepEqual(results.map(r => r.status).sort(), [200, 404]);
    console.log('Concurrent approvals: one 200, one 404'); pass('only one state transition wins');
    assert.equal(sql('SELECT status FROM purchase_request WHERE id=42'), 'APPROVED'); pass('PostgreSQL persisted APPROVED');
    sql("UPDATE purchase_request SET status='PENDING' WHERE id=42;");
  },
  async cors() {
    const response = await fetch(API + '/api/requests/41', { method: 'OPTIONS', headers: { Origin: 'http://localhost:18094', 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'authorization' } });
    assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:18094'); pass('permitted preflight names the exact origin');
    await request(null, 41, 'GET', 401);
    await request('alice');
    const denied = await fetch(API + '/api/requests/41', { method: 'OPTIONS', headers: { Origin: 'https://stranger.invalid', 'Access-Control-Request-Method': 'GET' } });
    assert.equal(denied.status, 403); pass('foreign-origin preflight denied');
  },
  async pkce() {
    const verifier = randomBytes(32).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    const wrong = createHash('sha256').update('a-different-verifier').digest('base64url');
    assert.notEqual(wrong, challenge); pass('another verifier does not reproduce the challenge');
    console.log('S256 challenge length: ' + challenge.length + '. This tests hashing, not an Entra code exchange.');
  },
  async matrix() {
    await request(null, 41, 'GET', 401); await request('alice');
    await request('no-role', 42, 'POST', 403); await request('alice', 42, 'GET', 404);
  }
};
const name = process.argv[2] || 'help';
if (name === 'help') {
  console.log('node lab.mjs ' + Object.keys(scenarios).join(' | ') + ' | all');
  process.exit(0);
}
try {
  if (name !== 'setup' && name !== 'pkce') {
    let health;
    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        const response = await fetch(API + '/health', { signal: AbortSignal.timeout(2000) });
        if (response.ok) { health = await response.json(); break; }
      } catch { /* Startup is allowed to take time; acceptance checks never fail open. */ }
      if (attempt === 0) console.log('Waiting for the local API to finish starting...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    assert.ok(health, 'The local API did not become ready. Inspect docker compose logs api.');
    assert.equal(health.authMode, 'fixture', 'This test suite refuses to run against Entra mode.');
  }
  if (name === 'all') for (const run of Object.values(scenarios)) await run();
  else if (scenarios[name]) await scenarios[name]();
  else throw new Error('Unknown scenario. Run node lab.mjs help.');
  fs.mkdirSync(path.join(root, 'runs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'runs', name + '.json'), JSON.stringify({ date: new Date().toISOString(), evidence: 'local fixture + real services', assertions: count, results: evidence }, null, 2) + '\n');
  console.log(`${count} assertions passed. Services remain running. No Entra tenant was tested.`);
} catch (error) { console.error('FAIL ' + error.message); process.exitCode = 1; }
