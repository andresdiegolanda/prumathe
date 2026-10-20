/* Verifies the course: content in both languages, the structure of every lesson and lab step, the
   models in every skin, the kit (pinned images, no host ports, no secrets in the ZIP), the about
   page, the generated pages and notes, and UTF-8 without BOM, LF and no long dashes in every file.
   Run after `npm run build`. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const c = { window: {} };
for (const f of ['curriculum', 'reference', 'visuals', 'about', 'forum']) vm.runInNewContext(read(`assets/${f}.js`), c);
const course = c.window.LLM_COURSE, refs = c.window.LLM_REFERENCE, visuals = c.window.LLMVisuals;
const pair = (v, label) => {
  assert.equal(typeof v?.en, 'string', label);
  assert.equal(typeof v?.es, 'string', label);
  assert.ok(v.en.trim() && v.es.trim(), label + ' empty');
};
const pending = [];

// Shape of the course.
assert.equal(course.lessons.length, 26);
assert.equal(course.units.length, 8);
course.units.forEach((u, i) => pair(u, 'unit ' + i));
assert.equal(course.version, JSON.parse(read('package.json')).version);
pair(course.baseline, 'baseline');
const UNIT = [0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 7];
const KINDS = ['contains', 'absent', 'matches', 'sameLines'];
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
  if (i > 0) pair(l.visor, `${i} visor note`);
  else assert.equal(l.visor, undefined, 'lesson 00 has no viewer note: the viewer opens in lesson 01');
  for (const s of l.lab) {
    steps++;
    for (const key of ['title', 'text', 'expected']) pair(s[key], `${i} lab ${key}`);
    assert.ok(s.command.trim(), `${i} command`);
    for (const k of Object.keys(s)) assert.ok(['title', 'text', 'command', 'expected', 'checks', 'optional', 'exit', 'input'].includes(k), `${i} unknown step key ${k}`);
    for (const line of s.command.split('\n')) assert.ok(/^(docker compose |docker version|docker stats |cd labs$)/.test(line), `${i} command outside the kit: ${line}`);
    assert.ok(!/prune|down -v|\brm -rf\b/.test(s.command), `${i} destructive command`);
    assert.ok(!/'[^']*"[^']*'/.test(s.command), `${i} nests double quotes inside single quotes (breaks in Windows PowerShell 5.1)`);
    if (s.command.includes('--remote')) assert.equal(s.optional, true, `${i} --remote must be optional: a key is never required`);
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

// The kit: images pinned by digest, no model server published on the host, the models checked by
// SHA256, and the optional key only through .env.
const compose = read('labs/compose.yaml');
for (const m of compose.matchAll(/^\s+image: (\S+)$/gm)) if (!m[1].startsWith('prumathe-')) assert.ok(/@sha256:[0-9a-f]{64}$/.test(m[1]), 'image not pinned: ' + m[1]);
const ports = [...compose.matchAll(/^\s+- "([^"]+)"$/gm)].map((m) => m[1]).filter((p) => /:\d+$/.test(p));
for (const p of ports) assert.ok(p.startsWith('127.0.0.1:'), 'port published beyond 127.0.0.1: ' + p);
const manifest = read('labs/models/manifest.txt').split('\n').filter((x) => x.trim() && !x.startsWith('#'));
assert.equal(manifest.length, 3, 'three models in the manifest');
for (const line of manifest) assert.ok(/[0-9a-f]{64}/.test(line), 'model without SHA256: ' + line);
assert.ok(fs.existsSync(path.join(root, 'labs/.env.example')), 'labs/.env.example');
for (const v of ['LLM_BASE_URL', 'LLM_API_KEY', 'LLM_MODEL', 'LLM_THREADS']) assert.ok(read('labs/.env.example').includes(v + '='), '.env.example ' + v);
assert.ok(read('.gitignore').split('\n').some((x) => x.trim() === 'labs/.env' || x.trim() === '.env'), '.gitignore keeps .env out');
const zip = fs.readFileSync(path.join(root, 'downloads/llm-rag-mcp-labs.zip'));
const names = [];
for (let o = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06])), n = zip.readUInt16LE(o + 10), p = zip.readUInt32LE(o + 16), k = 0; k < n; k++) {
  const len = zip.readUInt16LE(p + 28), extra = zip.readUInt16LE(p + 30), comment = zip.readUInt16LE(p + 32);
  names.push(zip.subarray(p + 46, p + 46 + len).toString('utf8'));
  p += 46 + len + extra + comment;
}
assert.ok(names.includes('labs/compose.yaml') && names.includes('labs/.env.example'), 'ZIP content');
assert.ok(!names.some((n) => /(^|\/)\.env$/.test(n) || /kubeconfig|\.gguf$|\/target\//.test(n)), 'ZIP carries a secret, a model or build output');

// The live viewer: lesson 01 opens it, Compose publishes it only on 127.0.0.1:18093.
assert.equal(course.lessons[1].lab[0].command, 'docker compose up -d --wait visor', 'lesson 01 opens the viewer');
if (fs.existsSync(path.join(root, 'labs/visor'))) {
  const service = (name) => compose.split(new RegExp(`\\n  ${name}:\\n`))[1]?.split(/\n  [a-z]/)[0] || '';
  for (const needle of ['profiles: [visor]', 'image: prumathe-llm-visor:' + course.version, 'build: ./visor', '"127.0.0.1:18093:18093"', '- events:/events:ro']) assert.ok(service('visor').includes(needle), 'compose visor service: ' + needle);
  // Every service that writes events mounts the volume; the viewer only reads it.
  for (const s of ['lab', 'app', 'mcp', 'mcp-stdio', 'mcp-modern', 'mcp-poisoned']) assert.ok(service(s).includes('- events:/events\n'), `compose ${s} mounts the events volume`);
  assert.ok(/\n  events:\n/.test((compose.split('\nvolumes:\n')[1] || '') + '\n'), 'compose declares the events volume');
  const server = read('labs/visor/server.mjs');
  for (const needle of ["req.method !== 'GET' && !head", "default-src 'none'", 'HOSTS.has(']) assert.ok(server.includes(needle), 'viewer server: ' + needle);
  const page = read('labs/visor/static/index.html');
  assert.ok(!/<script>|<style|\sstyle=|\son[a-z]+=/i.test(page), 'the viewer page has no inline code: its CSP allows none');
  new vm.Script(read('labs/visor/static/visor.js'), { filename: 'visor.js' });
  // lessons.json, generated by npm run build, follows the lab steps.
  const viewer = JSON.parse(read('labs/visor/static/lessons.json'));
  assert.equal(viewer.version, course.version, 'viewer lessons.json version');
  assert.equal(JSON.stringify(viewer.lessons.map((l) => [l.id, l.title, l.visor])), JSON.stringify(course.lessons.map((l) => [l.id, l.title, l.visor])), 'viewer lessons.json lessons');
  const runs = course.lessons.flatMap((l) => l.lab.flatMap((s, i) => s.command.split('\n').filter((x) => /^docker compose run --rm (lab|app|inspector|mcp-stdio)\b/.test(x.trim())).map(() => `${l.id}.${i + 1}`)));
  assert.equal(viewer.commands.map((x) => `${x.lesson}.${x.step}`).join(), runs.join(), 'viewer lessons.json follows the lab steps: run npm run build');
} else pending.push('the live viewer (labs/visor) is not built yet');

// The "What LLMs, RAG and MCP are" page: every string bilingual, six milestones, three table headers.
const about = c.window.LLM_ABOUT;
(function walkAbout(node, where) {
  if (node && typeof node === 'object' && 'en' in node && 'es' in node && typeof node.en === 'string') {
    assert.ok(node.en.trim() && node.es.trim(), where + ' empty');
    return;
  }
  if (Array.isArray(node)) node.forEach((x, i) => walkAbout(x, where + '[' + i + ']'));
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walkAbout(v, where + '.' + k);
})(about, 'about');
assert.equal(about.origin.timeline.length, 6);
assert.equal(about.misfits.headers.length, 3);
assert.ok(about.fits.items.length >= 5 && about.misfits.items.length >= 5 && about.decide.questions.length === 5);
for (const [name, url] of about.sources.items) assert.ok(name && /^https:\/\//.test(url), 'about source ' + name);
const aboutPage = read('what-llms-rag-and-mcp-are.html');
assert.ok(aboutPage.includes('data-page="about"') && aboutPage.includes('assets/about.js'), 'about page shell');

// Documents of the course.
for (const f of ['README.md', 'labs/README.md', 'docs/TEACHING.md', 'docs/VALIDATION.md', 'docs/DEPLOYMENT.md', 'docs/validation-results.json', 'LICENSE']) assert.ok(fs.existsSync(path.join(root, f)), 'missing ' + f);
JSON.parse(read('docs/validation-results.json'));

// Every file: UTF-8 without BOM, LF, no long dashes, no double encoding, and no name of a tool that
// produced the material or of another course.
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    ['dist', 'release', '.qa', 'node_modules', 'target', '.m2', '.git'].includes(e.name) || e.name === '.env' ? [] : e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
let files = 0;
for (const file of walk(root)) {
  if (['.zip', '.png', '.ico', '.gguf'].includes(path.extname(file))) continue;
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
for (const f of ['app', 'theme', 'curriculum', 'reference', 'visuals', 'about', 'forum']) new vm.Script(read(`assets/${f}.js`), { filename: f + '.js' });
for (const lang of ['en', 'es']) {
  const notes = read(`downloads/course-notes-${lang}.txt`);
  for (const l of course.lessons) assert.ok(notes.includes(`${String(l.id).padStart(2, '0')}. ${l.title[lang]}`), `notes ${lang} ${l.id}`);
}

// The discussion of each lesson: configuration present, pages load it, the CSP allows giscus.
const forum = c.window.LLM_FORUM;
assert.ok(forum && forum.repo && forum.category && forum.term === 'llm-rag-mcp-from-scratch', 'forum configuration');
if (forum.enabled) assert.ok(forum.repoId && forum.categoryId, 'forum ids missing while enabled');
assert.ok(read('_headers').includes('https://giscus.app'), 'CSP allows giscus');
assert.ok(read(`lessons/${course.lessons[0].slug}.html`).includes('assets/forum.js'), 'lesson pages load forum.js');

console.log(`PASS: 26 lessons, 78 scenes, 78 questions, ${steps} lab steps, ${renders} model renders, ${refs.glossary.length} glossary entries, the kit, the about page, ${files} files in UTF-8/LF.`);
if (pending.length) {
  console.log('PENDING: ' + pending.join('; '));
  process.exitCode = 1;
}
