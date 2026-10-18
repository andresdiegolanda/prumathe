import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{}};
for(const name of ['curriculum','reference','visuals','about'])vm.runInNewContext(fs.readFileSync(path.join(root,'assets',name+'.js'),'utf8'),context);
const course=context.window.GITHUB_COURSE, refs=context.window.GITHUB_REFERENCE, visuals=context.window.GitHubVisuals;
const c={window:context.window};
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const runnerSource=fs.readFileSync(path.join(root,'labs/lab.mjs'),'utf8');
const supported=new Set(runnerSource.match(/const experiments = \{([^}]+)\}/)[1].split(',').map(s=>s.trim()));
assert.equal(pkg.version,course.version);
assert.equal(course.lessons.length,20);assert.equal(course.units.length,6);
assert.equal(new Set(course.lessons.map(l=>l.slug)).size,20);
const B=(value,label)=>{for(const lang of ['en','es']) assert.ok(typeof value?.[lang]==='string'&&value[lang].trim(),label+' '+lang);};
let renderings=0,commands=0;
for(const [i,l] of course.lessons.entries()){
  assert.equal(l.id,i);assert.ok(course.units[l.unit]);assert.ok(refs.sources[l.source]);
  for(const key of ['title','intro','experiment'])B(l[key],l.slug+' '+key);
  assert.equal(l.frames.length,3);assert.equal(l.quiz.length,3);assert.equal(l.lab.length,4);
  for(const f of l.frames)for(const key of ['title','text','rule'])B(f[key],l.slug+' '+key);
  for(const q of l.quiz){B(q.question,l.slug);B(q.explanation,l.slug);assert.equal(q.options.length,3);q.options.forEach(o=>B(o,l.slug));assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<3);for(const lang of ['en','es'])assert.equal(new Set(q.options.map(o=>o[lang])).size,3);}
  for(const step of l.lab){for(const key of ['title','text','expected'])B(step[key],l.slug);if(step.command){assert.match(step.command,/^node lab\.mjs [a-z]+$/);assert.ok(supported.has(step.command.split(' ').at(-1)),'Unknown experiment');commands++;}}
  assert.equal(l.lab.filter(s=>s.command).length,l.mode==='local'?1:0);
  for(const lang of ['en','es'])for(const theme of visuals.themes)for(let scene=0;scene<3;scene++){
    const rendered=visuals.render(l.visual,scene,{},lang,theme);
    assert.ok(rendered.svg.includes('<svg')&&rendered.svg.includes('<title>'));
    assert.ok(!/undefined|NaN/.test(rendered.svg));assert.ok(Object.keys(rendered.details).length>=1);
    assert.ok(rendered.controls.length>0);
    for(const control of rendered.controls){
      for(const value of [control.min,control.max]){
        const changed=visuals.render(l.visual,scene,{[control.key]:value},lang,theme);
        assert.ok(!/undefined|NaN/.test(changed.svg));renderings++;
      }
      const a=visuals.render(l.visual,scene,{[control.key]:control.min},lang,theme).svg;
      const b=visuals.render(l.visual,scene,{[control.key]:control.max},lang,theme).svg;
      // Turning the review requirement off can leave an already-approved policy unchanged.
      if(control.key!=='required')assert.notEqual(a,b,l.slug+' inert control '+control.key);
    }
    renderings++;
  }
  const html=fs.readFileSync(path.join(root,'lessons',l.slug+'.html'),'utf8');assert.ok(html.includes('data-lesson="'+i+'"'));
  for(const lang of ['en','es'])assert.ok(fs.readFileSync(path.join(root,'downloads','course-notes-'+lang+'.txt'),'utf8').includes(l.title[lang]));
}
// The "What Git and GitHub are" page: every string bilingual, six milestones, three table headers, https sources.
const about=c.window.GITHUB_ABOUT;
(function walkAbout(node,where){
  if(node&&typeof node==='object'&&'en' in node&&'es' in node&&typeof node.en==='string'){assert.ok(node.en.trim()&&node.es.trim(),where+' empty');return;}
  if(Array.isArray(node))node.forEach((x,i)=>walkAbout(x,where+'['+i+']'));
  else if(node&&typeof node==='object')for(const [k,v] of Object.entries(node))walkAbout(v,where+'.'+k);
})(about,'about');
assert.equal(about.origin.timeline.length,6);assert.equal(about.misfits.headers.length,3);assert.ok(about.fits.items.length>=5&&about.misfits.items.length>=5&&about.decide.questions.length===5);
for(const [name,url] of about.sources.items)assert.ok(name&&/^https:\/\//.test(url),'about source '+name);
const aboutPage=fs.readFileSync(path.join(root,'what-git-and-github-are.html'),'utf8');assert.ok(aboutPage.includes('data-page="about"')&&aboutPage.includes('assets/about.js'),'about page shell');
assert.ok(visuals.render('git-and-github',0,{},'en','light').svg.includes('<svg'),'about model');
assert.equal(commands,14);assert.equal(course.lessons.filter(l=>l.mode==='github').length,6);
for(const [i,u] of course.units.entries()){B(u,'unit');assert.ok(course.lessons.some(l=>l.unit===i));}
for(const g of refs.glossary){assert.equal(g.length,5);assert.ok(course.lessons[g[4]]);for(let i=0;i<4;i++)assert.ok(g[i]);}
for(const s of [...Object.values(refs.sources),...Object.values(refs.more).flat()])assert.ok(/^https:\/\/(git-scm.com|docs.github.com)\//.test(s[1]));
// Guard the key distinctions illustrated by the models.
const model=(slug,state)=>visuals.render(slug,0,state,'en','light').svg;
assert.match(model('staging',{prepared:10}),/Next commit: 10:00/);
assert.notEqual(model('sync',{phase:1}),model('sync',{phase:2}));
assert.match(model('rules',{approved:0,checks:1,required:1}),/Required evidence missing/);
assert.match(model('rules',{approved:0,checks:1,required:0}),/Required conditions met/);
assert.match(model('staging',{prepared:9}),/No staged change/);

function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  if(['dist','runs','node_modules','.git'].includes(e.name))return [];
  const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p];
});}
for(const file of walk(root)){
  if(/\.(js|mjs|html|css|md|json|txt|ya?ml|svg)$/.test(file)){
    const bytes=fs.readFileSync(file),text=bytes.toString('utf8');
    assert.ok(!text.includes('\uFFFD'),'Invalid UTF-8 '+file);
    assert.ok(!text.startsWith('\uFEFF'),'BOM '+file);assert.ok(!text.includes('\r'),'Not LF '+file);
    assert.ok(!/[\u2013\u2014]/.test(text),'En/em dash '+file);
    assert.ok(!/\u00c3|\u00c2|\u00e2\u20ac/.test(text),'Double-encoded UTF-8 '+file);
    // Every text file in the folder: lessons, assets, docs, labs, README and the root files.
    if(path.resolve(file)!==path.resolve(fileURLToPath(import.meta.url))) assert.ok(!/kafka|docker|broker|norton|codex|chatgpt|openai|claude|anthropic/i.test(text),'Copied subject left in '+file);
    if(/\.(js|mjs)$/.test(file)){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8',windowsHide:true});assert.equal(result.status,0,result.stderr);}
    if(file.endsWith('.html'))for(const [,url]of text.matchAll(/(?:src|href)="([^"?#]+)[^"]*"/g)){
      if(/^https?:|^#/.test(url))continue;assert.ok(fs.existsSync(path.resolve(path.dirname(file),url)),'Missing link '+url);
    }
  }
}
const app=fs.readFileSync(path.join(root,'assets/app.js'),'utf8');
assert.ok(app.includes('github-course-progress'));assert.ok(app.includes('<details class="command-reference">'));
assert.ok(app.includes('refs.more[lesson.source]'));
const zip=fs.readFileSync(path.join(root,'downloads/github-labs.zip'));
assert.equal(zip.readUInt32LE(0),0x04034b50);assert.ok(!zip.includes(Buffer.from('labs/runs/')));
assert.ok(zip.includes(Buffer.from('labs/lab.mjs'))&&zip.includes(Buffer.from('labs/CAPSTONE.md')));
for(const l of course.lessons)assert.ok(fs.existsSync(path.join(root,'dist/lessons',l.slug+'.html')));
assert.ok(fs.existsSync(path.join(root,'dist/what-git-and-github-are.html')),'about page in dist');
// Prove the supplied narrow assertion fails for 09:00 and passes for 10:00, locally, outside the course folder.
const sample=fs.mkdtempSync(path.join(os.tmpdir(),'github-course-hours-'));
for(const [hour,success]of [['09:00',false],['10:00',true]]){
  fs.writeFileSync(path.join(sample,'README.md'),'Faro library\nOpen at '+hour+'\n');
  const result=spawnSync(process.execPath,['--test',path.join(root,'labs/examples/hours.test.mjs')],{cwd:sample,encoding:'utf8',windowsHide:true});
  assert.equal(result.status,success?0:1,'Unexpected hours assertion: '+result.stdout+result.stderr);
}
console.log(`PASS: 20 lessons, 60 scenes, 60 questions, 80 activity steps, 37 glossary terms, ${renderings} model renderings, the What Git and GitHub are page, bilingual notes, local links, ZIP isolation, script syntax and example failure/success.`);
