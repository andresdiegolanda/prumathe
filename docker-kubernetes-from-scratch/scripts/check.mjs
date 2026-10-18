import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const c={window:{}};
for(const f of ['curriculum','reference','visuals','about','forum'])vm.runInNewContext(fs.readFileSync(path.join(root,`assets/${f}.js`),'utf8'),c);
const course=c.window.DK_COURSE,refs=c.window.DK_REFERENCE,visuals=c.window.DKVisuals;
const pair=(v,label)=>{assert.equal(typeof v?.en,'string',label);assert.equal(typeof v?.es,'string',label);assert.ok(v.en.trim()&&v.es.trim(),label);};
assert.equal(course.lessons.length,25);
assert.equal(course.units.length,7);
assert.equal(course.version,JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version);
const slugs=new Set();let steps=0,renders=0;
for(const [i,l] of course.lessons.entries()) {
  assert.equal(l.id,i);assert.ok(!slugs.has(l.slug));slugs.add(l.slug);
  assert.equal(l.unit,i===0?0:Math.ceil(i/4));
  for(const key of ['title','intro','experiment'])pair(l[key],`${i} ${key}`);
  assert.equal(l.frames.length,3);assert.equal(l.quiz.length,3);assert.ok(l.lab.length>=4);
  for(const f of l.frames)for(const k of ['title','text','rule'])pair(f[k],`${i} frame ${k}`);
  for(const q of l.quiz){pair(q.question,'question');pair(q.explanation,'explanation');assert.equal(q.options.length,3);q.options.forEach(x=>pair(x,'option'));assert.ok(q.correct>=0&&q.correct<3);}
  assert.ok(refs.sources[l.source]?.[1].startsWith('https://'));
  for(const s of l.lab){steps++;for(const key of ['title','text','expected'])pair(s[key],`${i} lab ${key}`);assert.ok(s.command.trim());for(const line of s.command.split('\n'))if(line.startsWith('kubectl ')&&!line.includes('version --client')){assert.ok(line.includes('--kubeconfig kubeconfig'));assert.ok(line.includes('--context kind-prumathe-dk'));}assert.ok(!s.command.includes('prune'));assert.ok(!/'[^']*"[^']*'/.test(s.command),`${i} lab command nests double quotes inside single quotes (breaks in Windows PowerShell 5.1)`);}
  for(const theme of ['light','dark','reading','projector'])for(const lang of ['en','es'])for(let scene=0;scene<3;scene++)for(const state of [{},{toggle:true,value:3}]) {
    const r=visuals.render(l.visual,scene,state,lang,theme);assert.ok(r.svg.includes('<svg'));assert.ok(!/undefined|NaN/.test(r.svg));assert.ok(r.controls.length>0);assert.ok(Object.keys(r.details).length>0);renders++;
  }
  const html=fs.readFileSync(path.join(root,'lessons',l.slug+'.html'),'utf8');assert.ok(html.includes(`data-lesson="${i}"`));
}
assert.equal(steps,100);
// The "What Docker and Kubernetes are" page: every string bilingual, six milestones, three table headers, https sources.
const about=c.window.DK_ABOUT;
(function walkAbout(node,where){
  if(node&&typeof node==='object'&&'en' in node&&'es' in node&&typeof node.en==='string'){assert.ok(node.en.trim()&&node.es.trim(),where+' empty');return;}
  if(Array.isArray(node))node.forEach((x,i)=>walkAbout(x,where+'['+i+']'));
  else if(node&&typeof node==='object')for(const [k,v] of Object.entries(node))walkAbout(v,where+'.'+k);
})(about,'about');
assert.equal(about.origin.timeline.length,6);assert.equal(about.misfits.headers.length,3);assert.ok(about.fits.items.length>=5&&about.misfits.items.length>=5&&about.decide.questions.length===5);
for(const [name,url] of about.sources.items)assert.ok(name&&/^https:\/\//.test(url),'about source '+name);
const aboutPage=fs.readFileSync(path.join(root,'what-docker-and-kubernetes-are.html'),'utf8');assert.ok(aboutPage.includes('data-page="about"')&&aboutPage.includes('assets/about.js'),'about page shell');
assert.ok(visuals.render('reconcile',0,{},'en','light').svg.includes('<svg'),'about model');
// The correct answer must not sit in a predictable position: no lesson repeats the previous lesson's
// sequence shifted by one, which is what a simple rotation produces.
const answers=course.lessons.map(l=>l.quiz.map(q=>q.correct).join(''));
assert.ok(new Set(answers).size>=6,'quiz answer positions repeat too few distinct sequences');
for(let i=1;i<answers.length;i++)assert.ok(answers[i]!==answers[i-1].split('').map(d=>(Number(d)+1)%3).join(''),`lesson ${i} quiz positions are a rotation of lesson ${i-1}`);
// The pinned base image is one fact in two places: the Dockerfile and the lesson that reads its digest.
const from=fs.readFileSync(path.join(root,'labs/app/Dockerfile'),'utf8').match(/^FROM (\S+)/m)[1];
assert.ok(course.lessons.some(l=>l.lab.some(s=>s.command.includes(from))),'lesson command does not reference the Dockerfile base image '+from);
assert.ok(course.lessons[13].lab.some(s=>s.command.includes(`kindest/node:v${course.kubernetes}@sha256:`)),'lesson 13 does not pin the declared Kubernetes version');
for(const g of refs.glossary){assert.equal(g.length,5);assert.ok(course.lessons[g[4]]);}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>['dist','release','.qa','node_modules','__pycache__'].includes(e.name)||e.name==='kubeconfig'?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk(root)) {
  if(path.extname(file)==='.zip')continue;
  const raw=fs.readFileSync(file),text=raw.toString('utf8');assert.ok(!raw.subarray(0,3).equals(Buffer.from([239,187,191])),file+' BOM');assert.ok(!text.includes('\r'),file+' CRLF');assert.ok(!/[\u2013\u2014]/.test(text),file+' dash');if(!file.endsWith('check.mjs')){assert.ok(!/Ã.|Â.|â€|â†/.test(text),file+' double-encoded UTF-8');assert.ok(!/\bkafka\b|norton|codex|chatgpt|openai|anthropic|\bclaude\b/i.test(text),file+' mentions another course, a tool or a product of the validation machine');}
  if(file.endsWith('.html'))for(const match of text.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)){const target=match[1];if(!/^(https?:|mailto:)/.test(target))assert.ok(fs.existsSync(path.resolve(path.dirname(file),target)),file+' missing '+target);}
}
for(const f of ['app','theme','curriculum','reference','visuals','about','forum']) new vm.Script(fs.readFileSync(path.join(root,'assets',f+'.js'),'utf8'));
const app=fs.readFileSync(path.join(root,'assets/app.js'),'utf8');assert.ok(!/Kafka|KAFKA|kafka|Spring|Lab\.java/.test(app));
for(const lang of ['en','es']){const notes=fs.readFileSync(path.join(root,`downloads/course-notes-${lang}.txt`),'utf8');for(const l of course.lessons)assert.ok(notes.includes(`${String(l.id).padStart(2,'0')}. ${l.title[lang]}`));}
// The discussion of each lesson: configuration present, pages load it, the CSP allows giscus.
const forum = c.window.DK_FORUM;
assert.ok(forum && forum.repo && forum.category && forum.term === 'docker-kubernetes-from-scratch', 'forum configuration');
if (forum.enabled) assert.ok(forum.repoId && forum.categoryId, 'forum ids missing while enabled');
assert.ok(fs.readFileSync(path.join(root, '_headers'), 'utf8').includes('https://giscus.app'), 'CSP allows giscus');
assert.ok(fs.readFileSync(path.join(root, 'lessons', course.lessons[0].slug + '.html'), 'utf8').includes('assets/forum.js'), 'lesson pages load forum.js');
console.log(`PASS: 25 lessons, 75 scenes, 75 questions, ${steps} lab steps, ${renders} model renders, ${refs.glossary.length} glossary entries, quoting, versions, the What Docker and Kubernetes are page, local links and UTF-8/LF.`);
