/* Repository checks: what no course can check about itself. Run from anywhere:
     node scripts/check.mjs
   It fails when a file outside the courses is not UTF-8 without BOM and with LF, or has an en or
   em dash; when a relative link of a repository document points to nothing that Git knows; when
   the copies of the shared big picture engine differ; when two courses use the same local port;
   when the home page cards disagree with a course about its lessons or lab steps; when a review
   is not named after a course; when the board does not have its four columns, or a card has no
   owner, names a version while it is open, waits without saying for what or is in progress
   without its size; when the root README names a version; when a new CHANGELOG entry is long;
   or when Git tracks something that never enters the repository. It warns, without failing,
   when the same figure appears in more than one current document (metodo/arranque.md, "Un dueño
   por hecho").
   Node.js only, no packages; Git must be on the PATH. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (...p) => path.join(repo, ...p);
const read = (f) => fs.readFileSync(rel(f), 'utf8');
const failures = [];
const warnings = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);
const warn = (where, what) => warnings.push(`${where}: ${what}`);

// The courses: every folder beside site/ that builds itself.
const courses = fs
  .readdirSync(repo, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== 'site' && fs.existsSync(rel(e.name, 'scripts', 'build.mjs')))
  .map((e) => e.name)
  .sort();
if (courses.length === 0) throw new Error('No course folders with scripts/build.mjs found in ' + repo);
const inCourse = (f) => courses.some((c) => f.startsWith(c + '/'));

// What Git tracks, and what it knows: tracked files plus the untracked ones it would add.
const git = (...args) => {
  const r = spawnSync('git', ['-c', 'core.quotepath=false', ...args, '-z'], { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${r.stderr || r.error}`);
  return r.stdout.split('\0').filter(Boolean);
};
const tracked = git('ls-files');
const known = [...new Set([...tracked, ...git('ls-files', '--others', '--exclude-standard')])].filter((f) => fs.existsSync(rel(f)));
const knownSet = new Set(known);
const knownFolder = (f) => known.some((k) => k.startsWith(f.replace(/\/$/, '') + '/'));

// 1. Files outside the courses: UTF-8 without BOM, LF, no en or em dash, no double encoding.
//    Each course checks its own files with its scripts/check.mjs.
const TEXT = /\.(md|mjs|js|css|html|yml|yaml|json|jsonc|txt|svg|xml|ps1|py)$|(^|\/)(LICENSE|\.gitignore|\.gitattributes|_headers)$/;
// Built from code points, so that this file has none of the characters it looks for.
const chars = (...codes) => String.fromCharCode(...codes);
const DASHES = new RegExp(`[${chars(0x2013, 0x2014)}]`);
const DOUBLE_ENCODED = new RegExp(`${chars(0xc3)}[${chars(0x80)}-${chars(0xbf)}]|${chars(0xe2, 0x20ac)}`);
const VERSION = /(?<![\d.])\d+\.\d+\.\d+(?![\d.])/;
const decoder = new TextDecoder('utf-8', { fatal: true });
// Examples in code fences and names in code spans are not statements of the document.
const prose = (t) => t.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
const rootFiles = known.filter((f) => !inCourse(f));
const text = new Map();
for (const f of rootFiles.filter((x) => TEXT.test(x))) {
  const bytes = fs.readFileSync(rel(f));
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) fail(f, 'starts with a BOM');
  let t;
  try {
    t = decoder.decode(bytes);
  } catch {
    fail(f, 'is not valid UTF-8');
    continue;
  }
  if (t.includes('\r')) fail(f, 'has CR line endings; files use LF');
  const dash = t.split('\n').findIndex((l) => DASHES.test(l));
  if (dash >= 0) fail(`${f}:${dash + 1}`, 'has an en or em dash');
  if (DOUBLE_ENCODED.test(f.endsWith('.md') ? prose(t) : t)) fail(f, 'looks double encoded');
  text.set(f, t);
}

// 2. Relative links of the repository documents point to something Git knows, so they also
//    work in a fresh clone.
let links = 0;
for (const [f, t] of text) {
  if (!f.endsWith('.md')) continue;
  const body = prose(t);
  const targets = [...body.matchAll(/\]\(([^)\s]+)\)/g), ...body.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  for (const target of targets) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const clean = decodeURIComponent(target.split('#')[0].split('?')[0]);
    if (!clean) continue;
    links++;
    const to = path.posix.normalize(path.posix.join(path.posix.dirname(f), clean)).replace(/\/$/, '');
    if (to.startsWith('..')) fail(f, `links to ${target}, outside the repository`);
    else if (to !== '.' && !knownSet.has(to) && !knownFolder(to)) fail(f, `links to ${target}, which Git does not know`);
  }
}

// 3. What the courses share is the same file in every course.
const SHARED = ['assets/big-picture.js', 'assets/big-picture.css'];
for (const name of SHARED) {
  const copies = courses.filter((c) => fs.existsSync(rel(c, name))).map((c) => [c, fs.readFileSync(rel(c, name))]);
  for (const [c, bytes] of copies.slice(1)) {
    if (!bytes.equals(copies[0][1])) fail(`${c}/${name}`, `differs from the copy in ${copies[0][0]}`);
  }
}

// 4. A local port belongs to one course: someone may have two courses up at the same time.
//    Ports are the ones a Compose file publishes and the 180xx ones named in the lab sources.
const KNOWN_CLASHES = { 18080: ['docker-kubernetes-from-scratch', 'kafka-from-scratch'] }; // card "Puertos repetidos entre cursos" in tablero.md
const ports = new Map();
for (const c of courses) {
  const sources = known.filter((f) => f.startsWith(`${c}/labs/`) && /\.(ya?ml|mjs|js|ts|json|java|py|properties)$/.test(f) && !f.endsWith('package-lock.json'));
  for (const f of sources) {
    const t = read(f);
    const found = /compose\.ya?ml$/.test(f) ? [...t.matchAll(/127\.0\.0\.1:(\d+):\d+/g)].map((m) => m[1]) : [];
    for (const m of t.matchAll(/(?<![\d.])(180\d\d)(?![\d.])/g)) found.push(m[1]);
    for (const p of found) ports.set(p, (ports.get(p) ?? new Set()).add(c));
  }
}
for (const [p, users] of ports) {
  if (users.size < 2) continue;
  const list = [...users].sort();
  if (KNOWN_CLASHES[p] && list.every((c) => KNOWN_CLASHES[p].includes(c))) warn(`port ${p}`, `known clash between ${list.join(' and ')}; its card is in tablero.md`);
  else fail(`port ${p}`, `is used by ${list.join(' and ')}`);
}

// 5. The course is the owner of its version and its counts; the home page cards repeat the
//    lessons and the lab steps, so they are compared here.
const loadCourse = (c) => {
  const ctx = { window: {}, TextEncoder };
  vm.runInNewContext(read(`${c}/assets/curriculum.js`), ctx);
  const key = Object.keys(ctx.window).find((k) => k.endsWith('_COURSE'));
  if (!key) throw new Error(`${c}/assets/curriculum.js does not expose its course`);
  return ctx.window[key];
};
const course = Object.fromEntries(courses.map((c) => [c, loadCourse(c)]));
for (const c of courses) {
  const pkg = JSON.parse(read(`${c}/package.json`)).version;
  if (pkg !== course[c].version) fail(`${c}/package.json`, `says ${pkg} and assets/curriculum.js says ${course[c].version}`);
}
const home = { site: null };
vm.runInNewContext(read('site/assets/site.js'), { window: { PRUMATHE_SITE_DATA: home }, document: { body: { dataset: {} } } });
if (!home.site) throw new Error('site/assets/site.js did not expose its data');
for (const card of home.site.courses) {
  const c = course[card.slug];
  if (!c) {
    fail('site/assets/site.js', `has a card for ${card.slug}, which is not a course folder`);
    continue;
  }
  const lessons = c.lessons.length;
  const steps = c.lessons.reduce((n, l) => n + (Array.isArray(l.lab) ? l.lab.length : 0), 0);
  for (const stat of card.stats ?? []) {
    for (const lang of ['en', 'es']) {
      const said = stat[lang] ?? '';
      const l = /^(\d+) (?:lessons|lecciones)$/.exec(said);
      const s = /^(\d+) (?:lab steps|pasos de lab)$/.exec(said);
      if (l && Number(l[1]) !== lessons) fail('site/assets/site.js', `says "${said}" for ${card.slug}, which has ${lessons}`);
      if (s && Number(s[1]) !== steps) fail('site/assets/site.js', `says "${said}" for ${card.slug}, which has ${steps}`);
    }
  }
}
for (const c of courses) {
  if (!home.site.courses.some((x) => x.slug === c)) fail('site/assets/site.js', `has no card for ${c}`);
}

// 6. A review is named after the course and the version it reviewed.
for (const f of rootFiles.filter((x) => x.startsWith('reviews/'))) {
  const m = /^reviews\/\d{4}-\d{2}-\d{2}-(.+)-v\d+\.\d+\.\d+\.md$/.exec(f);
  if (!m) fail(f, 'is not named AAAA-MM-DD-<course>-v<version>.md');
  else if (!courses.includes(m[1])) fail(f, `names ${m[1]}, which is not a course folder`);
}

// 7. The board: every card sits in a column, has a title and ends with its owner; only the
//    cards of "Hecho" are ticked.
const board = text.get('tablero.md') ?? '';
const columns = [];
for (const [i, line] of board.split('\n').entries()) {
  const heading = /^## (.+)$/.exec(line);
  if (heading) {
    columns.push({ name: heading[1].trim(), cards: [] });
    continue;
  }
  const card = /^- \[([ x])\] (.*)$/.exec(line);
  if (!card) continue;
  const where = `tablero.md:${i + 1}`;
  const column = columns.at(-1);
  if (!column) {
    fail(where, 'card outside a column');
    continue;
  }
  column.cards.push({ line, where });
  if (!/^\*\*[^*]+\*\*/.test(card[2])) fail(where, 'card without a title in bold');
  if (!/\*\*[^*]+\*\*$/.test(card[2].trimEnd())) fail(where, 'card without an owner in bold at the end');
  if ((card[1] === 'x') !== (column.name === 'Hecho')) fail(where, card[1] === 'x' ? `ticked card in "${column.name}"` : 'card of "Hecho" that is not ticked');
}
const cards = columns.reduce((n, c) => n + c.cards.length, 0);
if (cards === 0) fail('tablero.md', 'has no cards');
// Its columns, and what the cards of each one must say. An open card links to the document that
// owns a version instead of naming it: a version written in a card goes stale without notice.
const COLUMNS = ['En curso', 'Para empezar', 'Esperando', 'Hecho'];
if (columns.map((c) => c.name).join('|') !== COLUMNS.join('|')) fail('tablero.md', `has the columns ${columns.map((c) => c.name).join(', ')}; they are ${COLUMNS.join(', ')}`);
for (const column of columns) {
  for (const { line, where } of column.cards) {
    if (column.name !== 'Hecho' && VERSION.test(line)) fail(where, `names version ${VERSION.exec(line)[0]}; an open card links to the document that owns it`);
    if (column.name === 'Esperando' && !line.includes(' Espera: ')) fail(where, 'card of "Esperando" that does not say what it waits for ("Espera: ...")');
    if (column.name === 'En curso' && !/Tamaño (chico|mediano|grande)/.test(line)) fail(where, 'card of "En curso" without its size ("Tamaño chico", "mediano" or "grande")');
  }
}

// The root README says what each course is and where to look: versions live in the course.
for (const [i, line] of (text.get('README.md') ?? '').split('\n').entries()) {
  if (VERSION.test(line)) fail(`README.md:${i + 1}`, `names version ${VERSION.exec(line)[0]}; versions and counts live in each course`);
}

// A new CHANGELOG entry is short: what changed, where, and the link to the document with the rest.
const LONG_ENTRY = 600;
let day = '';
for (const [i, line] of (text.get('CHANGELOG.md') ?? '').split('\n').entries()) {
  const heading = /^## \[(\d{4}-\d{2}-\d{2})\]/.exec(line);
  if (heading) day = heading[1];
  else if (day > '2026-11-18' && line.startsWith('- ') && line.length > LONG_ENTRY) fail(`CHANGELOG.md:${i + 1}`, `entry of ${line.length} characters; new entries stay under ${LONG_ENTRY} and link to the document with the detail`);
}

// 8. What never enters the repository (metodo/arranque.md, "Convenciones de trabajo").
const NEVER = [/^tmp\/(?!README\.md$)/, /(^|\/)\.qa\//, /(^|\/)labs\/runs\//, /(^|\/)labs\/kubeconfig$/, /(^|\/)dist\//, /(^|\/)release\//, /(^|\/)\.wrangler\//, /(^|\/)node_modules\//];
for (const f of tracked) {
  if (NEVER.some((r) => r.test(f))) fail(f, 'is tracked, and it never enters the repository');
}

// 9. One owner per fact. A warning, not a failure: the same figure (a three part version or a
//    count of lessons, steps and the like) in two current documents of this level, or in one of
//    them and in a course README, which owns it. History does not count: CHANGELOG.md, the
//    "Hecho" column and reviews/ tell what happened with the figures of their time.
const UNITS = 'lecciones|escenas|preguntas|pasos|términos|aserciones|experimentos|recorridos|paradas|piezas|zonas|unidades|lessons|scenes|questions|steps|terms|assertions|experiments|journeys|stops|pieces|zones|units';
const FIGURE = new RegExp(`(?<![\\d.])\\d+\\.\\d+\\.\\d+(?![\\d.])|(?<![\\d.,])\\d+ (?:${UNITS})(?![\\wáéíóúñ])`, 'g');
const current = new Map(
  [
    ['README.md', text.get('README.md')],
    ['tablero.md', board.split(/^## Hecho$/m)[0]],
    ['metodo/arranque.md', text.get('metodo/arranque.md')],
    ['site/README.md', text.get('site/README.md')],
  ]
    .filter(([, t]) => t !== undefined)
    .map(([f, t]) => [f, prose(t)]),
);
const owners = courses.filter((c) => fs.existsSync(rel(c, 'README.md'))).map((c) => [`${c}/README.md`, prose(read(`${c}/README.md`))]);
const seen = new Map();
for (const [f, t] of current) {
  for (const m of t.matchAll(FIGURE)) seen.set(m[0], (seen.get(m[0]) ?? new Set()).add(f));
}
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const [figure, where] of seen) {
  const exact = new RegExp(`(?<![\\d.,])${escape(figure)}(?![\\d.]|[\\wáéíóúñ])`);
  const also = owners.filter(([, t]) => exact.test(t)).map(([f]) => f);
  if (where.size > 1 || also.length > 0) warn(`"${figure}"`, `is repeated in ${[...where, ...also].join(', ')}`);
}

for (const w of warnings) console.log('WARN  ' + w);
if (failures.length > 0) {
  for (const f of failures) console.error('FAIL  ' + f);
  console.error(`\n${failures.length} problem${failures.length === 1 ? '' : 's'} found.`);
  process.exit(1);
}
console.log(
  `PASS: ${text.size} files outside the courses, ${links} links, ${courses.length} courses with their shared engine and ${ports.size} local ports, ${home.site.courses.length} home page cards, ${cards} board cards${warnings.length ? `, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}` : ''}.`,
);
