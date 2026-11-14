/* Verifies the course: content in both languages, the structure of every lesson and lab step, the
   models in every skin, the big picture, the kit (pinned images, only 127.0.0.1 ports, no secrets in the ZIP),
   the about page, the generated pages and notes, and UTF-8 without BOM, LF and no long dashes in every
   file. Run after `npm run build`. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const c = { window: {} };
for (const f of ['curriculum', 'reference', 'visuals', 'about', 'forum']) vm.runInNewContext(read(`assets/${f}.js`), c);
const course = c.window.CF_COURSE, refs = c.window.CF_REFERENCE, visuals = c.window.CFVisuals;
// The big picture, read by its own engine: its pieces carry the cards the live viewer shows.
const bp = { window: {} };
for (const name of ['curriculum', 'big-picture-data', 'big-picture']) vm.runInNewContext(read(`assets/${name}.js`), bp);
const picture = bp.window.BIG_PICTURE, BigPicture = bp.window.BigPicture;
const cards = { ...Object.fromEntries(Object.entries(picture.nodes).map(([id, n]) => [id, n.card])), ...picture.extraCards };
const pair = (v, label) => {
  assert.equal(typeof v?.en, 'string', label);
  assert.equal(typeof v?.es, 'string', label);
  assert.ok(v.en.trim() && v.es.trim(), label + ' empty');
};
const walkPairs = (node, where) => {
  if (node && typeof node === 'object' && 'en' in node && 'es' in node && typeof node.en === 'string') return pair(node, where);
  if (Array.isArray(node)) node.forEach((x, i) => walkPairs(x, where + '[' + i + ']'));
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walkPairs(v, where + '.' + k);
};
const pending = [];

// Shape of the course.
assert.equal(course.lessons.length, 26);
assert.equal(course.units.length, 8);
course.units.forEach((u, i) => pair(u, 'unit ' + i));
assert.equal(course.version, JSON.parse(read('package.json')).version);
pair(course.baseline, 'baseline');
const UNIT = [0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 7];
const KINDS = ['contains', 'absent', 'matches', 'sameLines'];
const ACCOUNT = /docker compose run --rm lab (account|remote|split|wrangler (?!.*--dry-run))/;
const visorBuilt = fs.existsSync(path.join(root, 'labs/visor'));
const slugs = new Set();
let steps = 0, renders = 0;
for (const [i, l] of course.lessons.entries()) {
  assert.equal(l.id, i);
  assert.ok(/^[a-z0-9-]+$/.test(l.slug) && !slugs.has(l.slug), `${i} slug`);
  slugs.add(l.slug);
  assert.equal(l.unit, UNIT[i], `${i} unit`);
  for (const key of ['title', 'intro', 'experiment']) pair(l[key], `${i} ${key}`);
  assert.equal(l.frames.length, 3, `${i} frames`);
  assert.equal(l.quiz.length, 3, `${i} quiz`);
  assert.ok(l.lab.length >= 4, `${i} lab steps`);
  for (const f of l.frames) for (const k of ['title', 'text', 'rule']) pair(f[k], `${i} frame ${k}`);
  for (const q of l.quiz) {
    pair(q.question, `${i} question`);
    pair(q.explanation, `${i} explanation`);
    assert.equal(q.options.length, 3, `${i} options`);
    q.options.forEach((x) => pair(x, `${i} option`));
    assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 3, `${i} correct`);
  }
  assert.ok(refs.sources[l.source]?.[1].startsWith('https://'), `${i} source ${l.source}`);
  if (visorBuilt && i > 0) pair(l.visor, `${i} visor note`);
  for (const s of l.lab) {
    steps++;
    for (const key of ['title', 'text', 'expected']) pair(s[key], `${i} lab ${key}`);
    assert.ok(s.command.trim(), `${i} command`);
    for (const k of Object.keys(s)) assert.ok(['title', 'text', 'command', 'expected', 'checks', 'optional', 'exit', 'input'].includes(k), `${i} unknown step key ${k}`);
    for (const line of s.command.split('\n')) assert.ok(/^(docker compose |docker version|cd labs$)/.test(line), `${i} command outside the kit: ${line}`);
    assert.ok(!/prune|down -v|\brm -rf\b|--force/.test(s.command), `${i} destructive command`);
    assert.ok(!/'[^']*"[^']*'/.test(s.command), `${i} nests double quotes inside single quotes (breaks in Windows PowerShell 5.1)`);
    assert.ok(!/\s[^\s"]*\?[^\s"]*(\s|$)/.test(s.command + ' '), `${i} an unquoted ? is a pattern in zsh: ${s.command}`);
    if (ACCOUNT.test(s.command)) assert.equal(s.optional, true, `${i} a step on the account must be optional: an account is never required`);
    assert.ok(Array.isArray(s.checks), `${i} checks`);
    for (const ch of s.checks) {
      const kinds = Object.keys(ch);
      assert.equal(kinds.length, 1, `${i} one kind per check`);
      assert.ok(KINDS.includes(kinds[0]), `${i} check kind ${kinds[0]}`);
      if (kinds[0] === 'matches') new RegExp(ch.matches, 'm');
    }
    if ('exit' in s) assert.ok(Number.isInteger(s.exit), `${i} exit`);
    if ('input' in s) assert.equal(typeof s.input, 'string', `${i} input`);
  }
  for (const theme of visuals.themes) for (const lang of ['en', 'es']) for (let scene = 0; scene < 3; scene++) for (const state of [{}, { toggle: true, value: 3 }]) {
    const r = visuals.render(l.visual, scene, state, lang, theme);
    assert.ok(r.svg.includes('<svg'), `${i} svg`);
    assert.ok(!/undefined|NaN/.test(r.svg), `${i} ${l.visual} renders undefined or NaN`);
    assert.ok(r.controls.length > 0, `${i} controls`);
    assert.ok(Object.keys(r.details).length > 0, `${i} details`);
    renders++;
  }
  assert.ok(read(`lessons/${l.slug}.html`).includes(`data-lesson="${i}"`), `${i} page`);
}
if (!visorBuilt) pending.push('the live viewer (labs/visor) is not built yet');
assert.equal(visuals.themes.join(), 'light,dark,reading,projector');

// The correct answer must not sit in a predictable position: no lesson repeats the previous lesson's
// sequence shifted by one, which is what a simple rotation produces.
const answers = course.lessons.map((l) => l.quiz.map((q) => q.correct).join(''));
assert.ok(new Set(answers).size >= 6, 'quiz answer positions repeat too few distinct sequences');
for (let i = 1; i < answers.length; i++) assert.ok(answers[i] !== answers[i - 1].split('').map((d) => (Number(d) + 1) % 3).join(''), `lesson ${i} quiz positions are a rotation of lesson ${i - 1}`);

// Glossary: term and definition in both languages, and the lesson that introduces it.
for (const g of refs.glossary) {
  assert.equal(g.length, 5, 'glossary entry ' + g[0]);
  assert.ok(g.slice(0, 4).every((x) => typeof x === 'string' && x.trim()), 'glossary entry ' + g[0]);
  assert.ok(course.lessons[g[4]], 'glossary lesson ' + g[0]);
}
for (const [key, [name, url]] of Object.entries(refs.sources)) assert.ok(name && url.startsWith('https://'), 'source ' + key);

// The big picture: the shared engine validates its data (ids, geometry, both languages, journeys
// that move only along lines), every command it shows is, letter by letter, one of the lessons, and
// every piece has a card with its lesson and how the kit runs it.
const lessonCommands = new Set(course.lessons.flatMap((l) => l.lab.flatMap((s) => s.command.split('\n').map((x) => x.trim()))));
const pictureErrors = [...BigPicture.validate(picture, bp.window.CF_COURSE, { icons: BigPicture.icons(), lab: (x) => lessonCommands.has(x) })];
assert.equal(pictureErrors.length, 0, pictureErrors.join('\n'));
walkPairs(cards, 'big picture cards');
for (const [id, card] of Object.entries(cards)) {
  for (const k of ['what', 'forwhat', 'not']) pair(card[k], `card ${id} ${k}`);
  assert.ok(course.lessons[card.lesson], `card ${id} lesson`);
  assert.ok(['yes', 'part', 'no'].includes(card.local), `card ${id} local`);
}
const pictureHtml = read('big-picture.html');
assert.ok(pictureHtml.includes('assets/big-picture.js') && pictureHtml.includes('<noscript>'), 'big-picture.html');
assert.ok(read('assets/app.js').includes('big-picture.html'), 'the home page links the big picture');

// The kit: images pinned by digest, only 127.0.0.1 on the host, the account only through .env.
const compose = read('labs/compose.yaml');
for (const m of compose.matchAll(/^\s+image: (\S+)$/gm)) if (!m[1].startsWith('prumathe-')) assert.ok(/@sha256:[0-9a-f]{64}$/.test(m[1]), 'image not pinned: ' + m[1]);
for (const m of compose.matchAll(/^\s+ports: \[([^\]]*)\]/gm)) for (const p of m[1].split(',').map((x) => x.trim().replace(/"/g, ''))) assert.ok(p.startsWith('127.0.0.1:'), 'port published beyond 127.0.0.1: ' + p);
assert.ok(!/^\s+ports:\s*$/m.test(compose), 'ports as a list: write them inline so this check reads them');
for (const f of ['labs/edge/Dockerfile', 'labs/origin/Dockerfile']) for (const m of read(f).matchAll(/^FROM (\S+)/gm)) assert.ok(/@sha256:[0-9a-f]{64}$/.test(m[1]), `${f}: base image not pinned ${m[1]}`);
assert.ok(fs.existsSync(path.join(root, 'labs/.env.example')), 'labs/.env.example');
for (const v of ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']) assert.ok(read('labs/.env.example').includes(v + '='), '.env.example ' + v);
assert.ok(read('.gitignore').split('\n').some((x) => x.trim() === 'labs/.env' || x.trim() === '.env'), '.gitignore keeps .env out');
const zip = fs.readFileSync(path.join(root, 'downloads/cloudflare-labs.zip'));
const names = [];
for (let o = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06])), n = zip.readUInt16LE(o + 10), p = zip.readUInt32LE(o + 16), k = 0; k < n; k++) {
  const len = zip.readUInt16LE(p + 28), extra = zip.readUInt16LE(p + 30), comment = zip.readUInt16LE(p + 32);
  names.push(zip.subarray(p + 46, p + 46 + len).toString('utf8'));
  p += 46 + len + extra + comment;
}
for (const f of ['labs/compose.yaml', 'labs/.env.example', 'labs/edge/package-lock.json', 'labs/edge/wrangler.jsonc', 'labs/edge/lab/lab.mjs']) assert.ok(names.includes(f), 'ZIP content ' + f);
assert.ok(!names.some((n) => /(^|\/)\.env$|\.dev\.vars|kubeconfig|node_modules|\.wrangler|\/target\//.test(n)), 'ZIP carries a secret, dependencies or build output');

// The live viewer: published on 127.0.0.1 only, started next to wrangler dev, read-only, no inline
// code, and its data written by build.mjs from the lab steps and the cards of the big picture.
if (visorBuilt) {
  assert.ok(compose.includes('"127.0.0.1:18098:8788"') && compose.includes('./visor:/visor:ro'), 'compose: the viewer port and its read-only folder');
  assert.ok(compose.includes('http://127.0.0.1:8788/health'), 'compose: the health check of the edge includes the viewer');
  assert.ok(read('labs/edge/entrypoint.sh').includes('node /visor/server.mjs &'), 'entrypoint starts the viewer');
  const server = read('labs/visor/server.mjs');
  assert.ok(server.includes("script-src 'self'") && !server.includes('unsafe-inline') && server.includes("'X-Content-Type-Options': 'nosniff'"), 'viewer: CSP and nosniff');
  assert.ok(server.includes("req.method !== 'GET' && req.method !== 'HEAD'") && server.includes('HOSTS.has(req.headers.host'), 'viewer: GET only, and only to this computer');
  assert.ok(server.includes('127.0.0.1:8787/cdn-cgi/local/explorer'), 'viewer reads the local explorer on 127.0.0.1');
  const page = read('labs/visor/static/index.html');
  assert.ok(!/<script>|<style|style="| on[a-z]+="/.test(page), 'viewer page: no inline script or style');
  assert.ok(!/style="|eval\(|new Function/.test(read('labs/visor/static/visor.js')), 'viewer script: no inline styles or eval');
  const vl = JSON.parse(read('labs/visor/static/lessons.json'));
  const vp = JSON.parse(read('labs/visor/static/pieces.json'));
  assert.equal(vl.version, course.version, 'viewer lessons version');
  const labCommands = course.lessons.flatMap((l) => l.lab.flatMap((s) => s.command.split('\n').filter((x) => /^docker compose (run --rm|exec edge) lab /.test(x.trim()))));
  assert.equal(vl.commands.length, labCommands.length, 'viewer lessons.json up to date: npm run build');
  for (const [id, card] of Object.entries(vp.pieces)) assert.deepEqual(card, JSON.parse(JSON.stringify(cards[id])), 'viewer pieces.json up to date: ' + id);
  for (const f of ['labs/visor/server.mjs', 'labs/visor/static/index.html', 'labs/visor/static/visor.js', 'labs/visor/static/lessons.json', 'labs/visor/static/pieces.json']) assert.ok(names.includes(f), 'ZIP content ' + f);
}

// The "What Cloudflare is" page: every string bilingual, six milestones, three table headers.
const about = c.window.CF_ABOUT;
walkPairs(about, 'about');
assert.equal(about.origin.timeline.length, 6);
assert.equal(about.misfits.headers.length, 3);
assert.ok(about.fits.items.length >= 5 && about.misfits.items.length >= 5 && about.decide.questions.length === 5);
for (const [name, url] of about.sources.items) assert.ok(name && /^https:\/\//.test(url), 'about source ' + name);
const aboutPage = read('what-cloudflare-is.html');
assert.ok(aboutPage.includes('data-page="about"') && aboutPage.includes('assets/about.js'), 'about page shell');

// Documents of the course.
for (const f of ['README.md', 'labs/README.md', 'docs/TEACHING.md', 'docs/VALIDATION.md', 'docs/DEPLOYMENT.md', 'LICENSE']) {
  if (!fs.existsSync(path.join(root, f))) pending.push('missing ' + f);
}

// Every file: UTF-8 without BOM, LF, no long dashes, no double encoding, and no name of a tool that
// produced the material or of another course.
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    ['dist', 'release', '.qa', 'node_modules', 'target', '.m2', '.git', '.wrangler'].includes(e.name) || ['.env', '.dev.vars', 'worker-configuration.d.ts', 'package-lock.json'].includes(e.name) ? [] : e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
let files = 0;
for (const file of walk(root)) {
  if (['.zip', '.png', '.ico', '.jar', '.p12'].includes(path.extname(file))) continue;
  files++;
  const raw = fs.readFileSync(file), text = raw.toString('utf8'), rel = path.relative(root, file);
  assert.ok(!raw.subarray(0, 3).equals(Buffer.from([239, 187, 191])), rel + ' BOM');
  assert.ok(!text.includes('\r'), rel + ' CRLF');
  assert.ok(!/[\u2013\u2014]/.test(text), rel + ' long dash');
  if (!file.endsWith('check.mjs')) {
    assert.ok(!/Ã.|Â.|â€|â†/.test(text), rel + ' double-encoded UTF-8');
    assert.ok(!/\bkafka\b|norton|codex|chatgpt|\bclaude\b/i.test(text), rel + ' names another course or a tool that produced the material');
  }
  if (file.endsWith('.html')) for (const match of text.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const target = match[1];
    if (!/^(https?:|mailto:)/.test(target)) assert.ok(fs.existsSync(path.resolve(path.dirname(file), target)), rel + ' missing ' + target);
  }
}
for (const f of ['app', 'theme', 'curriculum', 'reference', 'visuals', 'about', 'forum', 'big-picture-data', 'big-picture']) new vm.Script(read(`assets/${f}.js`), { filename: f + '.js' });
for (const lang of ['en', 'es']) {
  const notes = read(`downloads/course-notes-${lang}.txt`);
  for (const l of course.lessons) assert.ok(notes.includes(`${String(l.id).padStart(2, '0')}. ${l.title[lang]}`), `notes ${lang} ${l.id}`);
}

// The discussion of each lesson: configuration present, pages load it, the CSP allows giscus.
const forum = c.window.CF_FORUM;
assert.ok(forum && forum.repo && forum.category && forum.term === 'cloudflare-from-scratch', 'forum configuration');
if (forum.enabled) assert.ok(forum.repoId && forum.categoryId, 'forum ids missing while enabled');
assert.ok(read('_headers').includes('https://giscus.app'), 'CSP allows giscus');
assert.ok(read(`lessons/${course.lessons[0].slug}.html`).includes('assets/forum.js'), 'lesson pages load forum.js');

const optional = course.lessons.reduce((a, l) => a + l.lab.filter((s) => s.optional).length, 0);
console.log(`PASS: 26 lessons, 78 scenes, 78 questions, ${steps} lab steps (${optional} optional, on an account), ${renders} model renders, ${refs.glossary.length} glossary entries, the big picture (${picture.journeys.length} journeys, ${picture.journeys.reduce((n, j) => n + j.stops.length, 0)} stops), the kit, the about page, ${files} files in UTF-8/LF.`);
if (pending.length) {
  console.log('PENDING: ' + pending.join('; '));
  process.exitCode = 1;
}
