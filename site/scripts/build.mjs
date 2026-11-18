/* Assembles the publishable Prumathe site in site/dist/: this home page at the root and every
   course beside this folder under its own name (kafka-from-scratch/, ...). Each course is built
   with its own scripts/build.mjs first, and its dist/ is copied as is. Run from anywhere:
   node site/scripts/build.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(site, '..');
const dist = path.join(site, 'dist');
// The published address: canonical links, structured data, robots.txt and sitemap.xml use it.
const origin = 'https://prumathe.com';
const repoUrl = 'https://github.com/andresdiegolanda/prumathe';

// The published version: when this build ran and from which commit. Workers Builds passes the
// commit in WORKERS_CI_COMMIT_SHA; a local build reads it from git. Both go into the <head> of the
// home page and of each course's first page as meta tags, and each page shows them in its footer.
const commit = (() => {
  if (process.env.WORKERS_CI_COMMIT_SHA) return process.env.WORKERS_CI_COMMIT_SHA.trim();
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' });
  return head.status === 0 ? head.stdout.trim() : '';
})();
if (commit && !/^[0-9a-f]{7,40}$/.test(commit)) throw new Error(`unexpected commit id: ${commit}`);
const builtAt = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const publishedMeta = `<meta name="prumathe-published-at" content="${builtAt}">\n${commit ? `<meta name="prumathe-published-commit" content="${commit}">\n` : ''}`;
const withPublished = (html, where) => {
  if (!html.includes('</head>')) throw new Error(`${where} has no </head>`);
  return html.replace('</head>', publishedMeta + '</head>');
};

const courses = fs
  .readdirSync(repo, { withFileTypes: true })
  .filter((e) => e.isDirectory() && fs.existsSync(path.join(repo, e.name, 'scripts', 'build.mjs')) && e.name !== path.basename(site))
  .map((e) => e.name)
  .sort();
if (courses.length === 0) throw new Error('No course folders with scripts/build.mjs found beside ' + site);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

// The home page's data, read from assets/site.js, which stops after its data when asked to.
const data = { site: null };
vm.runInNewContext(fs.readFileSync(path.join(site, 'assets', 'site.js'), 'utf8'), { window: { PRUMATHE_SITE_DATA: data }, document: { body: { dataset: {} } } });
const page = data.site;
if (!page) throw new Error('assets/site.js did not expose its data');
const home = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
if (!home.includes('data-courses-base="../"')) throw new Error('index.html lost its data-courses-base attribute');
for (const course of courses) {
  if (!page.courses.some((c) => c.slug === course)) throw new Error(`assets/site.js has no card for ${course}`);
  if (!home.includes(`href="../${course}/index.html"`)) throw new Error(`index.html <noscript> does not link ${course}`);
}

// The home page: the same files as in this folder, with course links relative to the site root.
// In the published copy, the page is also written as static text inside #app, in both languages,
// for readers and tools that do not run JavaScript (site.js replaces it on load), and described
// with schema.org structured data. The <noscript> note is then unnecessary.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const both = (v, tag = 'p') => `<${tag} lang="en">${esc(v.en)}</${tag}><${tag}>${esc(v.es)}</${tag}>`;
const staticHome = `<div class="static-home">
<h1>Prumathe</h1>
<p lang="en"><strong>${esc(page.eyebrow.en)}.</strong> ${esc(page.title.en.join(' '))}</p>
<p><strong>${esc(page.eyebrow.es)}.</strong> ${esc(page.title.es.join(' '))}</p>
${both(page.lead)}
<ul>${page.facts.map((f) => `<li><span lang="en">${esc(f.en)}</span> / ${esc(f.es)}</li>`).join('')}</ul>
<h2><span lang="en">${esc(page.coursesTitle.en)}</span> / ${esc(page.coursesTitle.es)}</h2>
${both(page.coursesIntro)}
${page.courses.map((c) => `<section>
<h3><a href="${c.slug}/index.html"><span lang="en">${esc(c.title.en)}</span> / ${esc(c.title.es)}</a></h3>
${both(c.text)}
<p>${c.links.map(([href, label]) => `<a href="${c.slug}/${href}"><span lang="en">${esc(label.en)}</span> / ${esc(label.es)}</a>`).join(' · ')}</p>
</section>`).join('\n')}
</div>`;
const structured = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${origin}/#website`, url: `${origin}/`, name: 'Prumathe', description: page.lead.en, inLanguage: ['en', 'es'], publisher: { '@id': `${origin}/#organization` } },
    { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'Prumathe', url: `${origin}/` },
    ...page.courses.map((c) => ({
      '@type': 'Course', name: c.title.en, alternateName: c.title.es, description: c.text.en, url: `${origin}/${c.slug}/`,
      teaches: c.tech, inLanguage: ['en', 'es'], isAccessibleForFree: true, provider: { '@id': `${origin}/#organization` },
    })),
  ],
};
const jsonLd = `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>\n`;
let published = home.replaceAll('data-courses-base="../"', 'data-courses-base=""').replaceAll('href="../', 'href="');
published = published.replace('<div id="app"></div>', `<div id="app">${staticHome}</div>`).replace(/<noscript>[\s\S]*?<\/noscript>\n/, '').replace('</head>', jsonLd + '</head>');
if (!published.includes('class="static-home"') || published.includes('<noscript>') || !published.includes('application/ld+json')) throw new Error('could not write the static home page');
fs.writeFileSync(path.join(dist, 'index.html'), withPublished(published, 'index.html'));
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
  const first = path.join(dist, course, 'index.html');
  fs.writeFileSync(first, withPublished(fs.readFileSync(first, 'utf8'), `${course}/index.html`));
  // The root _headers file covers the whole site; the copies inside each course are not read there.
  fs.rmSync(path.join(dist, course, '_headers'), { force: true });
}

// One _headers file for the whole site: the home rules plus the download rule of every course.
const headers = fs.readFileSync(path.join(site, '_headers'), 'utf8').trimEnd();
const downloads = courses.map((c) => `\n\n/${c}/downloads/*\n  Content-Disposition: attachment`).join('');
fs.writeFileSync(path.join(dist, '_headers'), headers.replace(/\n\n\/downloads\/\*\n  Content-Disposition: attachment$/, '') + downloads + '\n');

// robots.txt and sitemap.xml: every page may be read, and the sitemap lists every page of the
// site (a folder's index.html by the folder's address), so a crawler finds them all; error pages
// and the pages that belong to a course's lab kit are left out.
const pages = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.html') && e.name !== '404.html') pages.push(path.relative(dist, full).split(path.sep).join('/'));
  }
};
walk(dist);
pages.splice(0, pages.length, 'index.html', ...pages.filter((p) => p !== 'index.html' && !p.split('/').includes('labs')));
const loc = (p) => `${origin}/${p === 'index.html' ? '' : p.endsWith('/index.html') ? p.slice(0, -'index.html'.length) : p}`;
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${esc(loc(p))}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`Built site/dist: home page plus ${courses.length} courses (${courses.join(', ')}), robots.txt and a sitemap of ${pages.length} pages.`);
