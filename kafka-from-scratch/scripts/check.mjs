/* Static validation of the course: curriculum shape and bilingual completeness, every diagram in
   every language and skin, the Murmur2 vectors, local links in the generated pages, the lab ZIP,
   lab command coverage against the Java client, version consistency and the no-dash rule. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {}, TextEncoder };
for (const name of ['curriculum', 'visuals', 'reference', 'about']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets', name + '.js'), 'utf8'), ctx);
}
const course = ctx.window.KAFKA_COURSE;
const visuals = ctx.window.KafkaVisuals;
const { lessons, units } = course;
assert.equal(lessons.length, 30);
assert.equal(units.length, 9);
assert.equal(new Set(lessons.map((x) => x.slug)).size, 30);

const supported = new Set([
  'help',
  'cluster',
  'prepare',
  'seed',
  'describe',
  'read',
  'read-topic',
  'put',
  'offsets',
  'expand',
  'consume',
  'watch',
  'reset',
  'lag',
  'describe-group',
  'benchmark',
  'compact-seed',
  'table',
  'delivery',
  'duplicate',
  'dedup',
  'transactions',
  'eos',
  'verify',
  'schema',
  'connect-status',
  'outbox',
  'streams',
  'windows',
  'window-seed',
  'acl',
  'skew',
  'mirror',
  'share',
  'create-extra',
]);
const DASHES = /[\u2013\u2014]/;

function bilingual(v, where) {
  assert.equal(typeof v.en, 'string', where + ' en missing');
  assert.equal(typeof v.es, 'string', where + ' es missing');
  assert.ok(v.en.trim() && v.es.trim(), where + ' blank');
  assert.ok(!DASHES.test(v.en) && !DASHES.test(v.es), where + ' contains an en or em dash');
}

let frames = 0,
  steps = 0,
  questions = 0;
for (const l of lessons) {
  assert.equal(l.id, lessons.indexOf(l));
  assert.ok(Number.isInteger(l.unit));
  assert.ok(units[l.unit]);
  bilingual(l.title, l.slug);
  bilingual(l.intro, l.slug);
  bilingual(l.experiment, l.slug + ' experiment');
  assert.equal(l.frames.length, 3);
  assert.ok(l.lab.length >= 4);
  assert.ok(ctx.window.KAFKA_REFERENCE.sources[l.source]);
  for (const f of l.frames) {
    for (const key of ['title', 'text', 'rule']) bilingual(f[key], l.slug + ' ' + key);
    frames++;
  }
  for (const s of l.lab) {
    for (const key of ['title', 'text', 'expected']) bilingual(s[key], l.slug + ' ' + key);
    assert.ok(s.command);
    for (const cmd of s.command.matchAll(/docker compose run --rm lab ([\w-]+)/g)) {
      assert.ok(supported.has(cmd[1]), 'Unknown lab command ' + cmd[1]);
    }
    steps++;
  }
  assert.ok(Array.isArray(l.quiz) && l.quiz.length === 3, l.slug + ' needs three questions');
  for (const q of l.quiz) {
    bilingual(q.question, l.slug + ' question');
    bilingual(q.explanation, l.slug + ' explanation');
    assert.equal(q.options.length, 3, l.slug + ' options');
    q.options.forEach((x) => bilingual(x, l.slug + ' option'));
    for (const lang of ['en', 'es'])
      assert.equal(new Set(q.options.map((x) => x[lang])).size, 3, l.slug + ' repeated option');
    assert.ok(q.correct >= 0 && q.correct < q.options.length);
    questions++;
  }
  for (const theme of visuals.themes) {
    for (const lang of ['en', 'es']) {
      for (let step = 0; step < 3; step++) {
        const out = visuals.render(l.visual, step, {}, lang, theme);
        assert.ok(
          out.svg.includes('<svg') && out.svg.includes('<rect'),
          l.slug + ' has no diagram',
        );
        assert.ok(
          !out.svg.includes('undefined') && !out.svg.includes('NaN'),
          `${l.slug} invalid diagram (${theme}, ${lang})`,
        );
      }
    }
  }
  const page = fs.readFileSync(path.join(root, 'lessons', l.slug + '.html'), 'utf8');
  assert.ok(page.includes('data-lesson="' + l.id + '"'), l.slug + ' incorrect page index');
}

const unitStarts = [
  'before-you-start', 'start', 'keys-order', 'rebalances', 'retention',
  'transactions', 'streams', 'scaling', 'spring-java',
];
units.forEach((_, unit) => {
  const members = lessons.filter((l) => l.unit === unit);
  assert.equal(members.length, unit === 0 || unit === 8 ? 1 : 4);
  assert.equal(members[0].slug, unitStarts[unit]);
});
assert.equal(lessons[0].slug, 'before-you-start');
assert.equal(lessons[0].source, 'docker');
assert.equal(lessons[0].lab.length, 4);
assert.ok(lessons[0].lab.every((s) => !s.command.includes('prepare ')));
assert.equal(lessons[1].slug, 'start');
assert.equal(lessons[29].slug, 'spring-java');
assert.equal(frames, lessons.length * 3);
assert.equal(questions, lessons.length * 3);
assert.equal(steps, 134);
for (const lang of ['en', 'es']) {
  const notes = fs.readFileSync(path.join(root, 'downloads/course-notes-' + lang + '.txt'), 'utf8');
  for (const l of lessons)
    assert.ok(notes.includes(String(l.id).padStart(2, '0') + '. ' + l.title[lang]));
}
for (const entry of ctx.window.KAFKA_REFERENCE.glossary) {
  assert.ok(Number.isInteger(entry[4]) && entry[4] >= 1 && entry[4] < lessons.length);
}

// Kafka Java Utils.murmur2, positive form.
const murmur = visuals.murmur2;
assert.equal(murmur(''), 275646681);
assert.equal(murmur('hello'), 2132663229);

// The "What Kafka is" page: every string bilingual and without dashes, sources with URLs, and
// the log model it embeds renders in every skin.
const about = ctx.window.KAFKA_ABOUT;
(function walkAbout(node, where) {
  if (node && typeof node === 'object' && 'en' in node && 'es' in node) {
    bilingual(node, where);
    return;
  }
  if (Array.isArray(node)) node.forEach((x, i) => walkAbout(x, where + '[' + i + ']'));
  else if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node)) walkAbout(v, where + '.' + k);
})(about, 'about');
assert.equal(about.origin.timeline.length, 6);
assert.equal(about.misfits.headers.length, 3);
for (const [name, url] of about.sources.items) assert.ok(name && /^https:\/\//.test(url), 'about source ' + name);
for (const theme of visuals.themes)
  for (const lang of ['en', 'es']) assert.ok(visuals.render('log', 0, {}, lang, theme).svg.includes('<svg'));
const aboutPage = fs.readFileSync(path.join(root, 'what-kafka-is.html'), 'utf8');
assert.ok(aboutPage.includes('data-page="about"') && aboutPage.includes('assets/about.js'));

// Every local reference in the generated pages points to a real file.
for (const filename of ['index.html', 'what-kafka-is.html', ...lessons.map((l) => 'lessons/' + l.slug + '.html')]) {
  const text = fs.readFileSync(path.join(root, filename), 'utf8');
  for (const [, url] of text.matchAll(/(?:src|href)="([^"?#]+)[^"]*"/g)) {
    if (url.startsWith('http') || url.startsWith('#')) continue;
    assert.ok(
      fs.existsSync(path.resolve(root, path.dirname(filename), url)),
      `${filename}: broken local reference ${url}`,
    );
  }
}
assert.ok(fs.statSync(path.join(root, 'downloads/kafka-labs.zip')).size > 1000);

// The Java dispatcher knows every command the lessons use.
const java = fs.readFileSync(path.join(root, 'labs/src/main/java/course/Lab.java'), 'utf8');
for (const command of supported) {
  assert.ok(java.includes(`case "${command}"`), 'Java command missing ' + command);
}

// One version, declared in curriculum.js and repeated only where a tool requires it.
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
assert.ok(
  pkg.version === course.version,
  'package.json version disagrees with curriculum.js',
);
const compose = fs.readFileSync(path.join(root, 'labs/compose.yaml'), 'utf8');
assert.ok(
  compose.includes(`image: apache/kafka:${course.kafka}`),
  'compose.yaml Kafka image disagrees with curriculum.js',
);
assert.ok(
  compose.includes(`kafka-course-lab:${course.version}`),
  'compose.yaml lab image tag disagrees with curriculum.js',
);

assert.ok(
  compose.includes('image: kafka-course-spring:' + course.version),
  'compose.yaml Spring image tag disagrees with curriculum.js',
);
for (const filename of ['labs/pom.xml', 'labs/spring/pom.xml']) {
  const pom = fs.readFileSync(path.join(root, filename), 'utf8');
  const project = pom.replace(/<parent>[\s\S]*?<\/parent>/, '');
  assert.equal(project.match(/<version>([^<]+)<\/version>/)?.[1], course.version, filename);
}
const labPom = fs.readFileSync(path.join(root, 'labs/pom.xml'), 'utf8');
for (const artifact of ['kafka-clients', 'kafka-streams'])
  assert.ok(
    labPom.includes('<artifactId>' + artifact + '</artifactId><version>' + course.kafka + '</version>'),
    artifact + ' version disagrees with curriculum.js',
  );

// The no-dash rule also covers the interface strings and the reference data.
for (const name of ['app.js', 'visuals.js', 'reference.js', 'theme.js', 'about.js']) {
  const text = fs.readFileSync(path.join(root, 'assets', name), 'utf8');
  assert.ok(!DASHES.test(text), name + ' contains an en or em dash');
}

console.log(
  `PASS: ${lessons.length} pages, ${frames} bilingual scenes, ${steps} bilingual lab steps, ${questions} checkpoint questions, the What Kafka is page, all diagram variants in ${visuals.themes.length} skins, local links, real Murmur2 vectors, lab command coverage and version consistency.`,
);
