/* The live viewer against real experiments: it serves its page, answers only GET and HEAD to its own
   host, shows the intermediate states that --step stops at, and leaves the repositories exactly as
   they were. Runs without network or containers. Leaves the new runs under labs/runs, like test:labs. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const labs = path.join(root, 'labs');
const PORT = Number(process.env.VISOR_TEST_PORT || 18192);
const base = `http://127.0.0.1:${PORT}`;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let passes = 0;
const pass = (what) => {
  passes++;
  console.log('PASS: ' + what);
};
const fail = (what, detail) => {
  throw new Error(what + (detail ? '\n' + JSON.stringify(detail).slice(0, 1500) : ''));
};

function request(method, pathName, host = `127.0.0.1:${PORT}`) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: PORT, path: pathName, method, headers: { host } }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.end();
  });
}
const state = async (run) => JSON.parse((await request('GET', '/api/state' + (run ? '?run=' + run : ''))).body);
async function until(predicate, what, run, ms = 30000) {
  const end = Date.now() + ms;
  let s;
  do {
    try {
      s = await state(run);
      if (predicate(s)) return s;
    } catch (e) {
      s = String(e);
    }
    await pause(150);
  } while (Date.now() < end);
  fail('Viewer condition not reached: ' + what, s);
}
const repo = (s, name) => s.run.repos.find((r) => r.name === name);
const file = (r, p) => r.files.find((f) => f.path === p);
const text = (r, blob) => (blob ? r.blobs[blob] : null);
const ref = (list, name) => (list.find((x) => x[0] === name) || [])[1];

// Content and modification time of every file of a run: the viewer must not change either.
function fingerprint(dir) {
  const h = crypto.createHash('sha256');
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else h.update(path.relative(dir, p) + ':' + fs.statSync(p).mtimeMs + ':' + crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') + '\n');
    }
  };
  walk(dir);
  return h.digest('hex');
}

// Runs one experiment with --step; at every pause, waits until the viewer shows that pause and calls
// check(next, state). Enter goes through the pipe, one line per pause. Pauses are detected through the
// viewer, not the printed prompt, because on POSIX a pipe may still hold the prompt while the helper waits.
const runsNow = () => new Set(fs.existsSync(path.join(labs, 'runs')) ? fs.readdirSync(path.join(labs, 'runs')) : []);
async function stepThrough(experiment, check) {
  const old = runsNow();
  const child = spawn(process.execPath, ['lab.mjs', experiment, '--step'], { cwd: labs, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
  let out = '';
  child.stdout.on('data', (c) => (out += c));
  child.stderr.on('data', (c) => (out += c));
  const done = new Promise((resolve) => child.on('exit', resolve));
  let exited = null;
  done.then((code) => (exited = code));
  let runName = null;
  for (const end = Date.now() + 15000; !runName && Date.now() < end; await pause(50)) runName = [...runsNow()].find((n) => !old.has(n) && /^faro-/.test(n)) || null;
  if (!runName) fail(`${experiment}: no new run folder`, out);
  for (let seen = 1; exited === null; seen++) {
    let s = null;
    for (const end = Date.now() + 30000; exited === null && Date.now() < end; await pause(150)) {
      const x = await state(runName);
      if (x.run && x.run.name === runName && x.run.progress && x.run.progress.next && x.run.progress.done === seen - 1) {
        s = x;
        break;
      }
    }
    if (exited !== null) break;
    if (!s) fail(`${experiment}: pause ${seen} not seen in the viewer`, out.slice(-800));
    await check(s.run.progress.next, s, runName);
    child.stdin.write('\n');
  }
  if ((await done) !== 0) fail(`${experiment} --step failed`, out.slice(-1500));
  if (!/PASS: \d+ assertions/.test(out)) fail(`${experiment} --step did not finish its assertions`, out.slice(-800));
  return runName;
}

// ------------------------------------------------------------------ setup: a full run before the viewer exists

const all = spawnSync(process.execPath, ['lab.mjs', 'all'], { cwd: labs, encoding: 'utf8', windowsHide: true, timeout: 180000 });
if (all.status !== 0) fail('node lab.mjs all failed', all.stdout + all.stderr);
const allRun = /runs[\\/](faro-[A-Za-z0-9]+)/.exec(all.stdout)[1];
const allDir = path.join(labs, 'runs', allRun);
const before = fingerprint(allDir);

const visor = spawn(process.execPath, ['lab.mjs', 'visor'], { cwd: labs, env: { ...process.env, VISOR_PORT: String(PORT) }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
let visorOut = '';
visor.stdout.on('data', (c) => (visorOut += c));
visor.stderr.on('data', (c) => (visorOut += c));
try {
  const start = Date.now();
  while (!visorOut.includes('VISOR http') && Date.now() - start < 15000) await pause(100);
  if (!visorOut.includes('VISOR http')) fail('The viewer did not start', visorOut);

  // HTTP: the page, read-only methods, own host only, headers.
  const page = await request('GET', '/');
  if (page.status !== 200 || !page.body.includes('visor.js')) fail('Viewer page missing', page);
  for (const name of ['visor.js', 'visor.css', 'favicon.svg']) if ((await request('GET', '/' + name)).status !== 200) fail('Viewer file missing: ' + name);
  if ((await request('POST', '/api/state')).status !== 405) fail('The viewer accepted a POST');
  if ((await request('DELETE', '/')).status !== 405) fail('The viewer accepted a DELETE');
  if ((await request('GET', '/api/state', 'evil.example:' + PORT)).status !== 403) fail('The viewer answered a foreign host');
  if ((await request('GET', '/../lab.mjs')).status !== 404) fail('The viewer served a file outside its page');
  const h = page.headers;
  if (!/default-src 'self'/.test(h['content-security-policy'] || '') || h['x-content-type-options'] !== 'nosniff' || h['cache-control'] !== 'no-store' || h['referrer-policy'] !== 'no-referrer') fail('Viewer headers', h);
  pass('page, 405 for POST and DELETE, 403 for a foreign host, 404 outside the page, CSP and headers');

  // Reading a finished run: 25 repositories, a two-parent merge, an annotated tag, remotes inside the run.
  const s = await until((x) => x.run && x.run.name === allRun && x.run.repos.length === 25, 'the full run is read', allRun);
  const merged = repo(s, 'strategy-merge').commits[0];
  if (merged.parents.length !== 2) fail('strategy-merge tip should have two parents', merged);
  const tag = repo(s, '14-tags').tags.find((t) => t[0] === 'v1.0');
  if (!tag || tag[2] !== true) fail('v1.0 should be an annotated tag', repo(s, '14-tags').tags);
  if (!repo(s, 'sync-bruno').links.some((l) => l[0] === 'origin' && l[1] === 'sync-remote.git')) fail('sync-bruno origin should point to sync-remote.git', repo(s, 'sync-bruno').links);
  if (!repo(s, 'sync-remote.git').bare) fail('sync-remote.git should be bare');
  const secret = repo(s, '15-secrets');
  if (file(secret, 'practice.env')) fail('practice.env should be gone from every place of 15-secrets', file(secret, 'practice.env'));
  const added = secret.commits.flatMap((c) => c.changes).find((x) => x[0] === 'A' && x[1] === 'practice.env');
  if (!added || !/FAKE_NOT_A_SECRET/.test(text(secret, added[2])) || !secret.commits.some((c) => c.changes.some((x) => x[0] === 'D' && x[1] === 'practice.env'))) fail('15-secrets history should keep practice.env in an earlier commit', secret.commits);
  if (!s.runs.some((r) => r.name === allRun && r.status === 'done')) fail('The full run should be listed as done', s.runs);
  for (let i = 0; i < 40; i++) {
    await state(allRun);
    await pause(50);
  }
  if (fingerprint(allDir) !== before) fail('Reading changed a repository (content or modification time)');
  pass('full run read (25 repositories, two-parent merge, annotated tag, remotes inside the run, a deleted file still in history) and unchanged after 40 reads');

  // staging: right before the commit, three different versions of guide.txt.
  let sawStaging = false;
  await stepThrough('staging', async (next, st) => {
    if (next.op === 'git' && next.args[0] === 'commit' && next.args.includes('Record prepared winter hours')) {
      const r = repo(st, '01-staging');
      const f = file(r, 'guide.txt');
      if (!/09:00/.test(text(r, f.head)) || f.index.length !== 1 || !/10:00/.test(text(r, f.index[0].blob)) || !/11:00/.test(f.work)) fail('staging: three places before the commit', f);
      sawStaging = true;
    }
  });
  if (!sawStaging) fail('staging: the commit pause was not seen');
  pass('staging --step: HEAD 09:00, index 10:00 and working file 11:00 before the commit');

  // conflict: after the stopped merge, three versions in the index and markers in the file.
  let sawConflict = false;
  await stepThrough('conflict', async (next, st) => {
    if (next.op === 'write' && /10:30/.test(next.text)) {
      const r = repo(st, '01-conflict');
      const f = file(r, 'guide.txt');
      const stages = f.index.map((x) => x.stage).join(',');
      if (!r.merge || stages !== '1,2,3' || !/09:00/.test(text(r, f.index[0].blob)) || !/11:00/.test(text(r, f.index[1].blob)) || !/10:00/.test(text(r, f.index[2].blob)) || !/<<<<<<</.test(f.work)) fail('conflict: stopped merge', { merge: r.merge, f });
      if (!st.events.some((e) => e.code === 'mergeStopped' && e.files.includes('guide.txt'))) fail('conflict: mergeStopped event missing', st.events.slice(0, 5));
      sawConflict = true;
    }
  });
  if (!sawConflict) fail('conflict: the pause after the merge was not seen');
  pass('conflict --step: MERGE_HEAD, stages 1, 2 and 3 (09:00, 11:00, 10:00), markers in the file and the event');

  // sync: Bruno's knowledge is stale before the fetch and current after it; the rejected push leaves the remote still.
  let fetchSeen = false;
  let rejectSeen = false;
  let remoteBeforePush = null;
  await stepThrough('sync', async (next, st) => {
    const bruno = repo(st, 'sync-bruno');
    const remote = repo(st, 'sync-remote.git');
    if (!fetchSeen && next.op === 'git' && next.args[0] === 'fetch' && next.repo === 'sync-bruno') {
      if (ref(bruno.remotes, 'origin/main') === ref(remote.branches, 'main')) fail('sync: origin/main should be stale before the fetch', { bruno: bruno.remotes, remote: remote.branches });
      fetchSeen = 'before';
    } else if (fetchSeen === 'before') {
      if (ref(bruno.remotes, 'origin/main') !== ref(remote.branches, 'main') || ref(bruno.branches, 'main') === ref(remote.branches, 'main')) fail('sync: after the fetch, origin/main moves and main does not', { bruno, remote: remote.branches });
      fetchSeen = 'after';
    }
    if (next.op === 'git' && next.args[0] === 'push' && next.repo === 'sync-bruno' && !remoteBeforePush) remoteBeforePush = ref(remote.branches, 'main');
    const last = st.run.progress.last;
    if (!rejectSeen && last && last.op === 'git' && last.args[0] === 'push' && last.repo === 'sync-bruno' && last.exit === 1) {
      if (ref(remote.branches, 'main') !== remoteBeforePush) fail('sync: the rejected push moved the remote');
      if (!st.events.some((e) => e.code === 'rejected' && e.repo === 'sync-bruno')) fail('sync: rejected event missing', st.events.slice(0, 5));
      rejectSeen = true;
    }
  });
  if (fetchSeen !== 'after' || !rejectSeen) fail('sync: fetch or rejection not seen', { fetchSeen, rejectSeen });
  pass('sync --step: stale origin/main before the fetch, moved after it with main still, rejected push with the remote unchanged');

  console.log(`\nVISOR PASSED: ${passes} checks. Runs left under labs/runs: ${allRun} and the three --step runs.`);
} catch (e) {
  console.error(String(e.stack || e));
  console.error('Viewer output:\n' + visorOut.slice(-1500));
  process.exitCode = 1;
} finally {
  visor.kill();
}
