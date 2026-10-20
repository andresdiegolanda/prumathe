/* Generates everything derived from assets/curriculum.js: one HTML shell per lesson, the home
   page, the bilingual text notes, the lab ZIP and dist/ for static hosting. Run `npm run build`
   after any content change; `npm run check` then verifies the result. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/curriculum.js'), 'utf8'), context);
const course = context.window.DK_COURSE;
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/about.js'), 'utf8'), context);
const about = context.window.DK_ABOUT;
const esc = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

/** The page shell. Content, language and skin are resolved by the scripts in the browser.
    `page` is 'about' for the "What Docker and Kubernetes are" page, which also loads assets/about.js. */
const html = (lesson, page = null) => {
  const p = lesson ? '../' : '';
  const title = lesson
    ? `${lesson.title.en} · Docker & Kubernetes from scratch`
    : page === 'about'
      ? `${about.title.en} · Docker & Kubernetes from scratch`
      : 'Docker & Kubernetes from scratch. A visual field guide';
  const description = lesson
    ? `${lesson.intro.en} Interactive visual explanations, a step-by-step lab with Docker and Kubernetes, and Rioplatense Spanish translation.`
    : page === 'about'
      ? `${about.lead.en} English and Rioplatense Spanish.`
      : `Learn Docker and Kubernetes from zero through ${course.lessons.length} interactive visual lessons and hands-on labs. English and Rioplatense Spanish. Works offline.`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#21664e"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="icon" href="${p}assets/favicon.svg" type="image/svg+xml"><script src="${p}assets/theme.js"></script><link rel="stylesheet" href="${p}assets/course.css"></head>
<body${lesson ? ` data-lesson="${lesson.id}"` : page ? ` data-page="${page}"` : ''}><div id="app"></div><noscript><main class="noscript"><h1>${esc(title)}</h1><p>This interactive course needs JavaScript. All scripts are included locally. Read the complete course notes instead.</p><p>Este curso interactivo necesita JavaScript. Todos los scripts están incluidos localmente. También podés leer los apuntes completos.</p><p><a href="${p}downloads/course-notes-en.txt">English notes</a> · <a href="${p}downloads/course-notes-es.txt">Apuntes en español</a></p></main></noscript><script src="${p}assets/curriculum.js"></script><script src="${p}assets/reference.js"></script><script src="${p}assets/visuals.js"></script>${page === 'about' ? `<script src="${p}assets/about.js"></script>` : ''}<script src="${p}assets/forum.js"></script><script src="${p}assets/app.js"></script></body></html>
`;
};

fs.mkdirSync(path.join(root, 'lessons'), { recursive: true });
fs.mkdirSync(path.join(root, 'downloads'), { recursive: true });
fs.writeFileSync(path.join(root, 'index.html'), html());
fs.writeFileSync(path.join(root, 'what-docker-and-kubernetes-are.html'), html(null, 'about'));
for (const l of course.lessons) {
  fs.writeFileSync(path.join(root, 'lessons', l.slug + '.html'), html(l));
}

/** Plain-text notes, one file per language, for reading without a browser. */
for (const lang of ['en', 'es']) {
  const letter = (i) => String.fromCharCode(65 + i);
  let text =
    lang === 'en' ? 'DOCKER & KUBERNETES FROM SCRATCH. COURSE NOTES\n' : 'DOCKER Y KUBERNETES DESDE CERO. APUNTES DEL CURSO\n';
  text += `Kubernetes ${course.kubernetes} | ${course.date} | v${course.version}\n\n`;
  // The "What Docker and Kubernetes are" page opens the notes, as it opens the course.
  text += `${about.title[lang].toUpperCase()}\n${'='.repeat(65)}\n${about.lead[lang]}\n\n`;
  for (const part of [about.what, about.origin]) {
    text += `${part.title[lang]}\n${part.text.map((x) => x[lang]).join('\n')}\n`;
    if (part.rule) text += `→ ${part.rule[lang]}\n`;
    if (part.timeline)
      text += part.timeline.map((m) => `${m.year} ${m.label[lang]}: ${m.text[lang]}`).join('\n') + '\n';
    text += '\n';
  }
  text += `${about.fits.title[lang]}\n${about.fits.intro[lang]}\n${about.fits.items.map((x) => `- ${x.title[lang]}: ${x.text[lang]}`).join('\n')}\n\n`;
  text += `${about.misfits.title[lang]}\n${about.misfits.intro[lang]}\n${about.misfits.items.map((x) => `- ${x.title[lang]}: ${x.why[lang]} ${about.misfits.headers[2][lang]}: ${x.instead[lang]}`).join('\n')}\n\n`;
  text += `${about.decide.title[lang]}\n${about.decide.questions.map((q, i) => `${i + 1}. ${q[lang]}`).join('\n')}\n${about.decide.closing[lang]}\n\n\n`;
  for (const l of course.lessons) {
    text += `${String(l.id).padStart(2, '0')}. ${l.title[lang]}\n${'='.repeat(65)}\n${l.intro[lang]}\n\n`;
    for (const f of l.frames) text += `${f.title[lang]}\n${f.text[lang]}\n→ ${f.rule[lang]}\n\n`;
    text += lang === 'en' ? 'LAB\n' : 'LABORATORIO\n';
    if (l.visor) text += (lang === 'en' ? 'Live viewer (http://127.0.0.1:18091): ' : 'Visor en vivo (http://127.0.0.1:18091): ') + l.visor[lang] + '\n\n';
    for (const [i, s] of l.lab.entries()) {
      text += `${i + 1}. ${s.title[lang]}\n${s.text[lang]}\n\n${s.command}\n\n${lang === 'en' ? 'Observe' : 'Observá'}: ${s.expected[lang]}\n\n`;
    }
    text += lang === 'en' ? 'CHECKPOINT\n' : 'CONTROL\n';
    for (const [qi, q] of l.quiz.entries()) {
      text += `${qi + 1}. ${q.question[lang]}\n${q.options.map((x, i) => `${letter(i)}. ${x[lang]}`).join('\n')}\n${lang === 'en' ? 'Answer' : 'Respuesta'}: ${letter(q.correct)}. ${q.explanation[lang]}\n\n`;
    }
    text += '\n';
  }
  fs.writeFileSync(path.join(root, `downloads/course-notes-${lang}.txt`), text);
}

/** Every file under labs/, except build output and local caches. */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (['target', '.m2', 'node_modules', '.qa', 'kubeconfig', '__pycache__'].includes(e.name)) return [];
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

// A dependency-free ZIP writer, using the standard stored method and CRC32.
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) {
    crc ^= b;
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
const local = [],
  central = [];
let offset = 0;
const files = walk(path.join(root, 'labs'));
for (const f of files) {
  const name = Buffer.from(path.relative(root, f).replaceAll('\\', '/'));
  const body = fs.readFileSync(f);
  const crc = crc32(body);
  const h = Buffer.alloc(30);
  h.writeUInt32LE(0x04034b50);
  h.writeUInt16LE(20, 4);
  h.writeUInt16LE(0x800, 6);
  h.writeUInt16LE(0x5d4f, 12);
  h.writeUInt32LE(crc, 14);
  h.writeUInt32LE(body.length, 18);
  h.writeUInt32LE(body.length, 22);
  h.writeUInt16LE(name.length, 26);
  local.push(h, name, body);
  const c = Buffer.alloc(46);
  c.writeUInt32LE(0x02014b50);
  c.writeUInt16LE(20, 4);
  c.writeUInt16LE(20, 6);
  c.writeUInt16LE(0x800, 8);
  c.writeUInt16LE(0x5d4f, 14);
  c.writeUInt32LE(crc, 16);
  c.writeUInt32LE(body.length, 20);
  c.writeUInt32LE(body.length, 24);
  c.writeUInt16LE(name.length, 28);
  c.writeUInt32LE(offset, 42);
  central.push(c, name);
  offset += h.length + name.length + body.length;
}
const cd = Buffer.concat(central),
  end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(cd.length, 12);
end.writeUInt32LE(offset, 16);
fs.writeFileSync(path.join(root, 'downloads/docker-kubernetes-labs.zip'), Buffer.concat([...local, cd, end]));

/** dist/ is the static site as Cloudflare Pages serves it. */
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
for (const entry of ['index.html', 'what-docker-and-kubernetes-are.html', 'assets', 'lessons', 'downloads', '_headers', '404.html']) {
  if (fs.existsSync(path.join(root, entry))) {
    fs.cpSync(path.join(root, entry), path.join(dist, entry), { recursive: true });
  }
}
for (const f of files) {
  const target = path.join(dist, path.relative(root, f));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(f, target);
}
console.log(
  `Built ${course.lessons.length} independent lesson pages, bilingual text notes, a ${files.length}-file lab ZIP, and dist/ for Cloudflare Pages.`,
);
