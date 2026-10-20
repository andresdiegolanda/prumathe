/* Live viewer of the local Git experiments: http://127.0.0.1:18092, started with node lab.mjs visor.

   Every half second it looks at the runs under labs/runs and rereads only the repositories whose
   files changed. It reads them with a closed list of Git commands that only query, run with
   --no-optional-locks so Git does not even refresh the index, and it never writes: what the
   experiments print and assert is the same with the viewer open. The page asks /api/state and
   redraws only when something changed. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const RUNS = path.join(here, 'runs');
const PAGE = path.join(here, 'visor');
const PORT = Number(process.env.VISOR_PORT || 18092);
const EVERY_MS = 500;
const MAX_EVENTS = 60;
const MAX_COMMITS = 60;
const MAX_TEXT = 2000;
const MAX_RUNS = 10;
const WATCH_MS = 15000;
const STALE_MS = 30000;
// The only Git subcommands the viewer runs. All of them read; none takes a lock.
const READS = new Set(['for-each-ref', 'log', 'ls-files', 'ls-tree', 'cat-file', 'config']);
const TYPES = { 'index.html': 'text/html; charset=utf-8', 'visor.css': 'text/css; charset=utf-8', 'visor.js': 'text/javascript; charset=utf-8', 'favicon.svg': 'image/svg+xml' };
const CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'";
const HOSTS = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`]);

// ------------------------------------------------------------------ reading Git

function envFor(runDir) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith('GIT_')));
  const blank = path.join(runDir, 'empty.gitconfig');
  return Object.assign(env, { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: fs.existsSync(blank) ? blank : '', GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' });
}

function gitRead(runDir, cwd, args, input) {
  if (!READS.has(args[0]) || (args[0] === 'config' && args[1] !== '--get-regexp')) throw new Error('Not a read-only Git command: ' + args.join(' '));
  const r = spawnSync('git', ['--no-optional-locks', '-c', 'core.fsmonitor=false', ...args], { cwd, env: envFor(runDir), input, windowsHide: true, timeout: 10000, maxBuffer: 8 * 1024 * 1024 });
  return r.status === 0 && !r.error ? r.stdout : null;
}

const exists = (p) => fs.existsSync(p);
const readText = (p) => {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
};
const clip = (buf) => {
  if (buf == null) return null;
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  if (b.includes(0)) return { binary: true };
  const t = b.subarray(0, MAX_TEXT).toString('utf8');
  return b.length > MAX_TEXT ? t + '\n…' : t;
};

function reposOf(runDir) {
  let entries = [];
  try {
    entries = fs.readdirSync(runDir, { withFileTypes: true }).filter((e) => e.isDirectory());
  } catch {
    return [];
  }
  const out = [];
  for (const e of entries) {
    const dir = path.join(runDir, e.name);
    if (exists(path.join(dir, '.git', 'HEAD'))) out.push({ name: e.name, dir, gitDir: path.join(dir, '.git'), bare: false });
    else if (exists(path.join(dir, 'HEAD')) && exists(path.join(dir, 'objects')) && exists(path.join(dir, 'refs'))) out.push({ name: e.name, dir, gitDir: dir, bare: true });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function walkFiles(dir, skip, rel = '') {
  let list = [];
  let entries = [];
  try {
    entries = fs.readdirSync(path.join(dir, rel), { withFileTypes: true });
  } catch {
    return list;
  }
  for (const e of entries) {
    const r = rel ? rel + '/' + e.name : e.name;
    if (skip(r)) continue;
    if (e.isDirectory()) list = list.concat(walkFiles(dir, skip, r));
    else list.push(r);
  }
  return list;
}

// What has to change for a reread: Git's own state files, the refs and the working files.
function fingerprint(repo) {
  const parts = [];
  const stat = (p) => {
    try {
      const s = fs.statSync(p);
      return s.mtimeMs + ':' + s.size;
    } catch {
      return '-';
    }
  };
  for (const f of ['HEAD', 'index', 'packed-refs', 'MERGE_HEAD', 'ORIG_HEAD', 'FETCH_HEAD', 'REVERT_HEAD', 'CHERRY_PICK_HEAD', 'logs/HEAD', 'config']) parts.push(f + '=' + stat(path.join(repo.gitDir, f)));
  parts.push('rebase=' + (exists(path.join(repo.gitDir, 'rebase-merge')) || exists(path.join(repo.gitDir, 'rebase-apply'))));
  for (const f of walkFiles(path.join(repo.gitDir, 'refs'), () => false)) parts.push('refs/' + f + '=' + stat(path.join(repo.gitDir, 'refs', f)));
  if (!repo.bare) for (const f of walkFiles(repo.dir, (r) => r === '.git')) parts.push('w/' + f + '=' + stat(path.join(repo.dir, f)));
  return parts.join('|');
}

function parseHead(text) {
  const t = (text || '').trim();
  return t.startsWith('ref: ') ? { ref: t.slice(5), sha: null } : { ref: null, sha: t || null };
}

function readRepo(runDir, repo) {
  const cwd = repo.dir;
  const head = parseHead(readText(path.join(repo.gitDir, 'HEAD')));
  const branches = [];
  const remotes = [];
  const tags = [];
  const refsOut = gitRead(runDir, cwd, ['for-each-ref', '--format=%(refname)%09%(objectname)%09%(objecttype)%09%(*objectname)']);
  for (const line of String(refsOut || '').split('\n')) {
    if (!line.trim()) continue;
    const [ref, sha, type, peeled] = line.split('\t');
    if (ref.startsWith('refs/heads/')) branches.push([ref.slice(11), sha]);
    else if (ref.startsWith('refs/remotes/') && !ref.endsWith('/HEAD')) remotes.push([ref.slice(13), sha]);
    else if (ref.startsWith('refs/tags/')) tags.push([ref.slice(10), type === 'tag' ? peeled : sha, type === 'tag']);
  }
  if (head.ref) {
    const b = branches.find((x) => 'refs/heads/' + x[0] === head.ref);
    head.sha = b ? b[1] : null;
  }
  const mergeHead = (readText(path.join(repo.gitDir, 'MERGE_HEAD')) || '').trim().split('\n')[0] || null;
  // Each commit with what it changed against its first parent: enough to rebuild every snapshot.
  const logArgs = ['log', '--all', '--topo-order', '--raw', '--no-abbrev', '--no-renames', '--diff-merges=first-parent', '--format=%x01%H%x09%P%x09%ct%x09%s', '-n', String(MAX_COMMITS + 1)];
  if (mergeHead) logArgs.push('MERGE_HEAD');
  const commits = [];
  for (const chunk of String(gitRead(runDir, cwd, logArgs) || '').split('\x01')) {
    const lines = chunk.split('\n');
    if (!lines[0].trim()) continue;
    const [id, parents, t, ...s] = lines[0].split('\t');
    const changes = [];
    for (const line of lines.slice(1)) {
      const m = /^:\d+ \d+ [0-9a-f]+ ([0-9a-f]+) ([AMDT])\t(.+)$/.exec(line);
      if (m) changes.push([m[2], m[3], /^0+$/.test(m[1]) ? null : m[1]]);
    }
    commits.push({ id, parents: parents ? parents.split(' ') : [], t: Number(t) * 1000, s: s.join('\t'), changes });
  }
  const truncated = commits.length > MAX_COMMITS;
  if (truncated) commits.length = MAX_COMMITS;
  const links = [];
  for (const line of String(gitRead(runDir, cwd, ['config', '--get-regexp', '^remote\\..*\\.url$']) || '').split('\n')) {
    const m = /^remote\.(.+)\.url (.+)$/.exec(line.trim());
    if (!m) continue;
    const target = path.resolve(cwd, m[2]);
    const inside = path.dirname(target) === runDir ? path.basename(target) : null;
    links.push([m[1], inside]);
  }
  const snap = { name: repo.name, bare: repo.bare, head, branches, remotes, tags, commits, truncated, links, merge: mergeHead, rebase: exists(path.join(repo.gitDir, 'rebase-merge')) || exists(path.join(repo.gitDir, 'rebase-apply')), files: [], reflog: [], blobs: {} };

  // The index and the tree of HEAD (non-bare only), then one cat-file for every blob the page shows.
  const index = new Map();
  for (const entry of repo.bare ? [] : String(gitRead(runDir, cwd, ['ls-files', '--stage', '-z']) || '').split('\0')) {
    const m = /^(\d+) ([0-9a-f]+) (\d)\t(.+)$/s.exec(entry);
    if (!m) continue;
    if (!index.has(m[4])) index.set(m[4], []);
    index.get(m[4]).push({ stage: Number(m[3]), sha: m[2] });
  }
  const tree = new Map();
  if (head.sha && !repo.bare) {
    for (const entry of String(gitRead(runDir, cwd, ['ls-tree', '-r', '-z', 'HEAD']) || '').split('\0')) {
      const m = /^\d+ blob ([0-9a-f]+)\t(.+)$/s.exec(entry);
      if (m) tree.set(m[2], m[1]);
    }
  }
  const wanted = [...new Set([...tree.values(), ...[...index.values()].flat().map((x) => x.sha), ...commits.flatMap((c) => c.changes.map((x) => x[2]))].filter(Boolean))];
  const blobs = new Map();
  if (wanted.length) {
    const out = gitRead(runDir, cwd, ['cat-file', '--batch'], wanted.join('\n') + '\n');
    let at = 0;
    while (out && at < out.length) {
      const nl = out.indexOf(10, at);
      if (nl < 0) break;
      const [sha, type, size] = out.subarray(at, nl).toString('utf8').split(' ');
      if (type === 'missing' || size === undefined) {
        at = nl + 1;
        continue;
      }
      const n = Number(size);
      blobs.set(sha, clip(out.subarray(nl + 1, nl + 1 + n)));
      at = nl + 1 + n + 1;
    }
  }
  snap.blobs = Object.fromEntries(blobs);
  if (repo.bare) return snap;
  const work = new Map();
  for (const f of walkFiles(cwd, (r) => r === '.git')) {
    try {
      work.set(f, clip(fs.readFileSync(path.join(cwd, f))));
    } catch {}
  }
  // The three places of every file, as blob ids (texts in blobs) and the working text.
  for (const p of [...new Set([...tree.keys(), ...index.keys(), ...work.keys()])].sort()) {
    const stages = (index.get(p) || []).sort((a, b) => a.stage - b.stage).map((x) => ({ stage: x.stage, blob: x.sha }));
    snap.files.push({ path: p, head: tree.get(p) || null, index: stages, work: work.has(p) ? work.get(p) : null });
  }
  snap.reflog = String(gitRead(runDir, cwd, ['log', '-g', '--format=%H%x09%gs', '-n', '12', 'HEAD']) || '')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => l.split('\t'));
  return snap;
}

// ------------------------------------------------------------------ runs and events

const runs = new Map(); // name -> { repos: Map(name -> { fp, snap }), events, seq, progress, json, content, version }
const asked = new Map(); // run name -> last time a page asked for it
let latest = null;
let versions = 0; // one counter for every run, so two runs never share a version

function listRuns() {
  let entries = [];
  try {
    entries = fs.readdirSync(RUNS, { withFileTypes: true }).filter((e) => e.isDirectory() && /^faro-/.test(e.name));
  } catch {
    return [];
  }
  return entries
    .map((e) => {
      const dir = path.join(RUNS, e.name);
      const mtime = (p) => {
        try {
          return fs.statSync(p).mtimeMs;
        } catch {
          return 0;
        }
      };
      return { name: e.name, dir, touched: Math.max(mtime(dir), mtime(path.join(dir, 'progress.json'))) };
    })
    .sort((a, b) => b.touched - a.touched);
}

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

// Whether the helper that writes progress.json is still running (signal 0 only asks).
function alive(pid) {
  if (!pid) return null;
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === 'EPERM';
  }
}

function statusOf(dir, progress) {
  if (exists(path.join(dir, 'result.json'))) return 'done';
  if (!progress) return 'unknown';
  const running = alive(progress.pid);
  if (running === false) return 'stopped';
  if (progress.next) return 'paused';
  return running === null && Date.now() - (progress.updatedAt || 0) > STALE_MS ? 'stopped' : 'running';
}

function summary(r) {
  const progress = readJson(path.join(r.dir, 'progress.json'));
  const result = readJson(path.join(r.dir, 'result.json'));
  return { name: r.name, experiments: progress?.experiments || result?.experiments || [], status: statusOf(r.dir, progress), touched: r.touched };
}

const ancestors = (commits, id) => {
  const parents = new Map(commits.map((c) => [c.id, c.parents]));
  const seen = new Set();
  const todo = [id];
  while (todo.length) {
    const x = todo.pop();
    if (!x || seen.has(x)) continue;
    seen.add(x);
    for (const p of parents.get(x) || []) todo.push(p);
  }
  return seen;
};
const how = (commits, from, to) => (ancestors(commits, to).has(from) ? 'forward' : ancestors(commits, from).has(to) ? 'back' : 'rewritten');
const short = (ref) => (ref ? ref.replace(/^refs\/heads\//, '') : null);
const textOf = (v) => (v && typeof v === 'object' ? '(binary)' : v);

function diffRepo(prev, cur, emit) {
  if (!prev) {
    emit({ code: cur.bare ? 'bareCreated' : 'repoCreated', repo: cur.name, from: cur.links.find((l) => l[0] === 'origin')?.[1] || null });
    return;
  }
  const map = (xs) => new Map(xs.map((x) => [x[0], x[1]]));
  const known = new Set(prev.commits.map((c) => c.id));
  // A new commit on the current branch is one event, not also "the branch moved".
  const committed = !cur.bare && cur.head.sha && cur.head.sha !== prev.head.sha && !known.has(cur.head.sha) && cur.head.ref === prev.head.ref ? short(cur.head.ref) : null;
  const kinds = [
    ['branch', map(prev.branches), map(cur.branches)],
    ['remote', map(prev.remotes), map(cur.remotes)],
  ];
  for (const [kind, a, b] of kinds) {
    for (const [name, sha] of b) {
      if (!a.has(name)) emit({ code: kind + 'Created', repo: cur.name, ref: name, to: sha, bare: cur.bare });
      else if (a.get(name) !== sha && !(kind === 'branch' && name === committed && sha === cur.head.sha)) emit({ code: kind + 'Moved', repo: cur.name, ref: name, from: a.get(name), to: sha, how: how(cur.commits, a.get(name), sha), bare: cur.bare });
    }
    for (const [name, sha] of a) if (!b.has(name)) emit({ code: kind + 'Deleted', repo: cur.name, ref: name, from: sha, bare: cur.bare });
  }
  const oldTags = map(prev.tags);
  for (const t of cur.tags) if (!oldTags.has(t[0])) emit({ code: 'tagCreated', repo: cur.name, ref: t[0], to: t[1], annotated: t[2] });
  if (cur.bare) return;
  const switched = prev.head.ref !== cur.head.ref;
  if (switched) emit({ code: 'headMoved', repo: cur.name, from: short(prev.head.ref) || prev.head.sha, to: short(cur.head.ref) || cur.head.sha, detached: !cur.head.ref });
  if (cur.head.sha && cur.head.sha !== prev.head.sha && !known.has(cur.head.sha)) {
    const c = cur.commits.find((x) => x.id === cur.head.sha);
    if (c) emit({ code: 'commit', repo: cur.name, id: c.id, s: c.s, parents: c.parents, on: short(cur.head.ref) });
  }
  if (!prev.merge && cur.merge) emit({ code: 'mergeStopped', repo: cur.name, with: cur.merge, files: cur.files.filter((f) => f.index.some((x) => x.stage > 0)).map((f) => f.path) });
  if (prev.merge && !cur.merge && cur.head.sha === prev.head.sha) emit({ code: 'mergeAborted', repo: cur.name });
  if (cur.head.sha !== prev.head.sha || switched || (!prev.merge && cur.merge)) return;
  const old = new Map(prev.files.map((f) => [f.path, f]));
  for (const f of cur.files) {
    const o = old.get(f.path);
    const idx = (x) => JSON.stringify(x ? x.index : null);
    if (!o || textOf(o.work) !== textOf(f.work)) emit({ code: f.work == null ? 'fileRemoved' : o && o.work != null ? 'fileEdited' : 'fileCreated', repo: cur.name, file: f.path });
    if (idx(o) !== idx(f) && !cur.merge) emit({ code: f.index.length ? 'fileStaged' : 'fileUnstaged', repo: cur.name, file: f.path });
  }
  for (const [p, o] of old) if (!cur.files.some((f) => f.path === p) && o.work != null) emit({ code: 'fileRemoved', repo: cur.name, file: p });
}

function updateRun(r) {
  let run = runs.get(r.name);
  const first = !run;
  if (!run) {
    run = { repos: new Map(), events: [], seq: 0, progress: null, content: null, version: 0, json: null, head: null };
    runs.set(r.name, run);
  }
  const now = Date.now();
  const emit = (ev) => {
    run.events.unshift({ seq: ++run.seq, at: now, ...ev });
    if (run.events.length > MAX_EVENTS) run.events.length = MAX_EVENTS;
  };
  const progress = readJson(path.join(r.dir, 'progress.json')) || run.progress;
  if (!first && progress && run.progress && progress.done > run.progress.done && progress.last && progress.last.exit && progress.last.expected) {
    emit({ code: 'rejected', repo: progress.last.repo, op: progress.last });
  }
  run.progress = progress;
  const found = reposOf(r.dir);
  for (const repo of found) {
    const fp = fingerprint(repo);
    const known = run.repos.get(repo.name);
    if (known && known.fp === fp) continue;
    const snap = readRepo(r.dir, repo);
    if (!first) diffRepo(known ? known.snap : null, snap, emit);
    run.repos.set(repo.name, { fp, snap });
  }
  for (const name of [...run.repos.keys()]) {
    if (!found.some((x) => x.name === name)) {
      run.repos.delete(name);
      if (!first) emit({ code: 'repoGone', repo: name });
    }
  }
  if (first) emit({ code: 'watch', run: r.name, repos: found.length });
  const sum = summary(r);
  const body = {
    ok: true,
    error: null,
    run: { name: r.name, experiments: sum.experiments, status: sum.status, progress: progress ? { current: progress.current, step: progress.step, done: progress.done, last: progress.last, next: progress.next, finished: progress.finished } : null, repos: [...run.repos.values()].map((x) => x.snap) },
    events: run.events,
  };
  const content = JSON.stringify(body);
  if (content !== run.content) {
    run.content = content;
    run.version = ++versions;
  }
}

function stateFor(name, readAt) {
  const list = listRuns();
  const runsSummary = list.slice(0, MAX_RUNS).map((r) => summary(r));
  if (!list.length) return { version: 0, ok: true, error: null, readAt, following: true, runs: [], run: null, events: [] };
  const target = (name && list.find((r) => r.name === name)) || list[0];
  if (!runs.has(target.name)) updateRun(target);
  const run = runs.get(target.name);
  const body = JSON.parse(run.content);
  return { version: run.version, ok: true, error: null, readAt, following: !name || target.name !== name, runs: runsSummary, ...body };
}

function tick() {
  const started = Date.now();
  try {
    const list = listRuns();
    latest = list[0] ? list[0].name : null;
    for (const [name, at] of asked) if (started - at > WATCH_MS) asked.delete(name);
    const watched = new Set([latest, ...asked.keys()].filter(Boolean));
    for (const r of list) if (watched.has(r.name)) updateRun(r);
    for (const name of [...runs.keys()]) if (!list.some((r) => r.name === name)) runs.delete(name);
  } catch (e) {
    console.error('VISOR: ' + e.message);
  }
  setTimeout(tick, Math.max(0, EVERY_MS - (Date.now() - started)));
}

// ------------------------------------------------------------------ HTTP

const safeJson = (o) => JSON.stringify(o).replace(/[<>&\u2028\u2029]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));

function send(res, method, status, type, body) {
  res.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(body),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': CSP,
    'Cache-Control': 'no-store',
  });
  res.end(method === 'HEAD' ? undefined : body);
}

const server = http.createServer((req, res) => {
  const text = 'text/plain; charset=utf-8';
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, req.method, 405, text, 'Read only / Solo lectura');
  if (!HOSTS.has(String(req.headers.host || '').toLowerCase())) return send(res, req.method, 403, text, 'Forbidden host / Host no permitido');
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname === '/api/state') {
    const name = url.searchParams.get('run');
    const valid = name && /^faro-[A-Za-z0-9]+$/.test(name) ? name : null;
    if (valid) asked.set(valid, Date.now());
    let state;
    try {
      state = stateFor(valid, Date.now());
    } catch (e) {
      state = { version: 0, ok: false, error: e.message, readAt: Date.now(), runs: [], run: null, events: [] };
    }
    const same = String(state.version) === url.searchParams.get('v') && state.run;
    const body = same ? { version: state.version, same: true, ok: state.ok, error: state.error, readAt: state.readAt, following: state.following, runs: state.runs, run: { name: state.run.name, status: state.run.status } } : state;
    return send(res, req.method, 200, 'application/json; charset=utf-8', safeJson(body));
  }
  const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  if (!TYPES[file]) return send(res, req.method, 404, text, 'Not found / No encontrado');
  let body;
  try {
    body = fs.readFileSync(path.join(PAGE, file));
  } catch {
    return send(res, req.method, 404, text, 'Not found / No encontrado');
  }
  return send(res, req.method, 200, TYPES[file], body);
});

server.on('error', (e) => {
  console.error(e.code === 'EADDRINUSE' ? `VISOR: port ${PORT} is in use / el puerto ${PORT} está ocupado` : 'VISOR: ' + e.message);
  process.exit(1);
});
server.listen(PORT, '127.0.0.1', () => {
  console.log(`VISOR http://127.0.0.1:${PORT}  (Ctrl+C)`);
  console.log('Reads labs/runs; writes nothing / Lee labs/runs; no escribe nada');
  tick();
});
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
