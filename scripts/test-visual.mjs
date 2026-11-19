/* Visual checks in a real browser, for what a static check cannot measure: that every page opens
   without errors and without horizontal overflow, that every text of a lesson model stays inside
   its drawing, and that the big picture is drawn with every text inside its box, no piece over
   another and every zone label inside its zone and clear of the pieces. Run from anywhere, for
   every course and the home page or only for the folders named:
     node scripts/test-visual.mjs [folder ...]
   It needs puppeteer-core, looked up in PRUMATHE_TOOLS (by default tmp/herramientas-node), and a
   Chrome or an Edge (CHROME, or the usual places). It opens the pages from the files, as a
   course folder is opened, and leaves screenshots in CAPTURAS (by default tmp/capturas/): the
   big picture and the phone home page of each course, and every page with a problem. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tools = path.resolve(process.env.PRUMATHE_TOOLS || path.join(repo, 'tmp', 'herramientas-node'));
const shots = path.resolve(process.env.CAPTURAS || path.join(repo, 'tmp', 'capturas'));

let puppeteer;
try {
  puppeteer = createRequire(path.join(tools, 'package.json'))('puppeteer-core');
} catch {
  console.error(`puppeteer-core is not installed in ${tools}. Install it with:\n  npm install --prefix "${tools}" puppeteer-core`);
  process.exit(2);
}
const browserPath = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && fs.existsSync(p));
if (!browserPath) {
  console.error('No Chrome or Edge found. Set CHROME to the path of one.');
  process.exit(2);
}

const courses = fs
  .readdirSync(repo, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== 'site' && fs.existsSync(path.join(repo, e.name, 'scripts', 'build.mjs')))
  .map((e) => e.name)
  .sort();
const folders = [...courses, 'site'];
const asked = process.argv.slice(2);
for (const a of asked) {
  if (!folders.includes(a)) throw new Error(`${a} is not a course folder or site`);
}
const chosen = asked.length > 0 ? asked : folders;

// Every page is opened on a desktop and on a phone, once in each language and in two of the
// appearances; the home page and the big picture of a course also in the other two.
const DESK = { lang: 'es', theme: 'light', width: 1366, height: 768 };
const PHONE = { lang: 'en', theme: 'dark', width: 390, height: 844 };
const OTHER = [
  { lang: 'es', theme: 'reading', width: 390, height: 844 },
  { lang: 'en', theme: 'projector', width: 1920, height: 1080 },
];
// The big picture is measured in both languages on the screen its scene was designed for.
const SCENE = ['es', 'en'].map((lang) => ({ lang, theme: 'light', width: 1440, height: 900 }));

const pagesOf = (folder) => {
  const dir = path.join(repo, folder);
  const html = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.html')).sort() : []);
  return [...html(dir), ...html(path.join(dir, 'lessons')).map((f) => 'lessons/' + f)];
};
const label = (c) => `${c.lang} ${c.theme} ${c.width}x${c.height}`;
const shot = (...parts) => path.join(shots, parts.join('-').replace(/[\\/]/g, '-').replace(/\.html/g, '') + '.png');

// Runs in the page: the checks that need the rendered boxes.
const measure = () => {
  const rect = (el) => {
    const b = el.getBoundingClientRect();
    return { x: b.left, y: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height };
  };
  const inside = (a, b, t = 1) => a.x >= b.x - t && a.y >= b.y - t && a.r <= b.r + t && a.b <= b.b + t;
  const hit = (a, b, t = 0.5) => a.x < b.r - t && b.x < a.r - t && a.y < b.b - t && b.y < a.b - t;
  const cut = (s) => (s.length > 40 ? s.slice(0, 40) + '...' : s);
  const problems = [];

  const overflow = document.documentElement.scrollWidth - window.innerWidth;
  if (overflow > 1) problems.push(`the page is ${overflow} px wider than the screen`);

  // Every text of a drawing stays inside the drawing (the big picture is measured below).
  for (const svg of document.querySelectorAll('svg:not(.bp-svg)')) {
    const frame = rect(svg);
    if (frame.w < 150 || svg.closest('[hidden]') || svg.closest('.bp-shell')) continue;
    for (const t of svg.querySelectorAll('text')) {
      const b = rect(t);
      if (b.w > 0 && b.h > 0 && !inside(b, frame, 2)) problems.push(`a text of a drawing leaves it: "${cut(t.textContent.trim())}"`);
    }
  }

  const scene = document.querySelector('.bp-svg');
  let pieces = 0;
  if (scene) {
    const nodes = [...scene.querySelectorAll('g.bp-node[data-node]')].map((g) => ({
      id: g.dataset.node,
      box: rect(g.querySelector('rect.bp-box')),
      texts: [...g.querySelectorAll('text')].map((t) => ({ s: t.textContent.trim(), b: rect(t) })),
    }));
    pieces = nodes.length;
    if (pieces === 0) problems.push('the big picture has no pieces');
    for (const n of nodes) {
      for (const t of n.texts) {
        if (t.b.w > 0 && !inside(t.b, n.box)) problems.push(`piece ${n.id}: "${cut(t.s)}" leaves its box`);
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (hit(nodes[i].box, nodes[j].box)) problems.push(`pieces ${nodes[i].id} and ${nodes[j].id} overlap`);
      }
    }
    for (const zone of scene.querySelectorAll('g.bp-zone')) {
      const frame = zone.querySelector(':scope > rect');
      const name = zone.querySelector(':scope > text.bp-zone-label');
      if (!frame || !name) continue;
      const b = rect(name);
      if (b.w === 0) continue;
      const said = cut(name.textContent.trim());
      if (!inside(b, rect(frame))) problems.push(`zone label "${said}" leaves its zone`);
      for (const n of nodes) {
        if (hit(b, n.box)) problems.push(`zone label "${said}" covers piece ${n.id}`);
      }
    }
  }
  return { problems, pieces };
};

fs.mkdirSync(shots, { recursive: true });
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: process.env.CI ? ['--no-sandbox'] : [] });
const page = await browser.newPage();
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push(String(e.message || e)));

const failures = [];
try {
  for (const folder of chosen) {
    const pages = pagesOf(folder);
    if (pages.length === 0) throw new Error(`${folder} has no pages`);
    let loads = 0;
    let pieces = 0;
    const before = failures.length;
    for (const file of pages) {
      const big = file === 'big-picture.html';
      const first = file === 'index.html';
      const configs = [DESK, PHONE, ...(folder !== 'site' && (big || first) ? OTHER : []), ...(big ? SCENE : [])];
      for (const cfg of configs) {
        errors.length = 0;
        await page.setViewport({ width: cfg.width, height: cfg.height });
        await page.goto(`${pathToFileURL(path.join(repo, folder, file)).href}?lang=${cfg.lang}&theme=${cfg.theme}`, { waitUntil: 'load' });
        const rendered = await page
          .waitForFunction((b) => (b ? document.querySelectorAll('.bp-svg g.bp-node').length > 0 : document.body && document.body.innerText.trim().length > 40), { timeout: 8000 }, big)
          .then(() => true, () => false);
        const found = rendered ? await page.evaluate(measure) : { problems: ['the page did not render'], pieces: 0 };
        loads++;
        if (big && SCENE.includes(cfg)) pieces = found.pieces;
        const problems = [...new Set([...errors.map((e) => 'console error: ' + e), ...found.problems])];
        const where = `${folder}/${file} [${label(cfg)}]`;
        if (problems.length > 0) {
          for (const p of problems.slice(0, 6)) failures.push(`${where}: ${p}`);
          if (problems.length > 6) failures.push(`${where}: and ${problems.length - 6} more`);
          await page.screenshot({ path: shot('FALLA', folder, file, cfg.lang, cfg.theme, cfg.width) });
        } else if ((big && cfg === SCENE[0]) || (first && cfg === PHONE)) {
          await page.screenshot({ path: shot(folder, file, cfg.lang, cfg.theme, cfg.width) });
        }
      }
    }
    const bad = failures.length - before;
    console.log(`${bad === 0 ? 'PASS' : 'FAIL'} ${folder}: ${pages.length} pages, ${loads} page loads${pieces ? `, ${pieces} pieces of the big picture measured in two languages` : ''}${bad ? `, ${bad} problem${bad === 1 ? '' : 's'}` : ''}`);
  }
} finally {
  await browser.close();
}
if (failures.length > 0) {
  for (const f of failures) console.error('FAIL  ' + f);
  console.error(`\n${failures.length} problem${failures.length === 1 ? '' : 's'} found. Screenshots: ${shots}`);
  process.exit(1);
}
console.log(`Screenshots: ${shots}`);
