/* Assembles the publishable Prumathe site in site/dist/: this home page at the root and every
   course beside this folder under its own name (kafka-from-scratch/, ...). Each course is built
   with its own scripts/build.mjs first, and its dist/ is copied as is. Run from anywhere:
   node site/scripts/build.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(site, '..');
const dist = path.join(site, 'dist');

const courses = fs
  .readdirSync(repo, { withFileTypes: true })
  .filter((e) => e.isDirectory() && fs.existsSync(path.join(repo, e.name, 'scripts', 'build.mjs')) && e.name !== path.basename(site))
  .map((e) => e.name)
  .sort();
if (courses.length === 0) throw new Error('No course folders with scripts/build.mjs found beside ' + site);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

// The home page: the same files as in this folder, with course links relative to the site root.
const home = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
if (!home.includes('data-courses-base="../"')) throw new Error('index.html lost its data-courses-base attribute');
fs.writeFileSync(path.join(dist, 'index.html'), home.replaceAll('data-courses-base="../"', 'data-courses-base=""').replaceAll('href="../', 'href="'));
fs.copyFileSync(path.join(site, '404.html'), path.join(dist, '404.html'));
fs.cpSync(path.join(site, 'assets'), path.join(dist, 'assets'), { recursive: true });

// Each course: build it, then copy its dist/ under its folder name.
for (const course of courses) {
  const dir = path.join(repo, course);
  const built = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: dir, stdio: 'inherit' });
  if (built.status !== 0) throw new Error(`Build failed for ${course}`);
  const courseDist = path.join(dir, 'dist');
  if (!fs.existsSync(path.join(courseDist, 'index.html'))) throw new Error(`${course}/dist has no index.html`);
  fs.cpSync(courseDist, path.join(dist, course), { recursive: true });
  // The root _headers file covers the whole site; the copies inside each course are not read there.
  fs.rmSync(path.join(dist, course, '_headers'), { force: true });
}

// One _headers file for the whole site: the home rules plus the download rule of every course.
const headers = fs.readFileSync(path.join(site, '_headers'), 'utf8').trimEnd();
const downloads = courses.map((c) => `\n\n/${c}/downloads/*\n  Content-Disposition: attachment`).join('');
fs.writeFileSync(path.join(dist, '_headers'), headers.replace(/\n\n\/downloads\/\*\n  Content-Disposition: attachment$/, '') + downloads + '\n');

console.log(`Built site/dist: home page plus ${courses.length} courses (${courses.join(', ')}).`);
