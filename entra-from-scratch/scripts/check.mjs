import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const c={window:{}};
for(const name of ['curriculum','reference','about','visuals'])vm.runInNewContext(read('assets/'+name+'.js'),c);
const course=c.window.ENTRA_COURSE,refs=c.window.ENTRA_REFERENCE,visuals=c.window.EntraVisuals;
assert.equal(course.lessons.length,24);assert.equal(course.units.length,7);
assert.equal(new Set(course.lessons.map(l=>l.slug)).size,24);
const answers=[];
let commands=0;
const runner=read('labs/lab.mjs');
for(const [index,l] of course.lessons.entries()){
  assert.equal(l.id,index);assert.ok(course.units[l.unit]);assert.equal(l.frames.length,3);assert.equal(l.quiz.length,3);
  assert.ok(refs.sources[l.source]);assert.ok(fs.existsSync(path.join(root,'lessons',l.slug+'.html')));
  for(const f of l.frames){assert.ok(f.text.en.length>150);assert.ok(f.rule.en.length>20);}
  for(const q of l.quiz){assert.equal(q.options.length,3);assert.ok(q.correct>=0&&q.correct<3);assert.ok(q.explanation.en.length>30);answers.push(q.correct);}
  for(const s of l.lab){assert.ok(s.text.en&&s.expected.en);if(s.command?.startsWith('node lab.mjs ')){commands++;const scenario=s.command.split(' ').at(-1);assert.ok(scenario==='all'||runner.includes('async '+scenario+'()'),scenario);}}
  for(const theme of ['light','dark','reading','projector'])for(let i=0;i<3;i++){
    const model=visuals.render(l.visual,i,{},'en',theme);
    assert.ok(model.svg.includes('role="group"'));assert.ok(model.controls.length);assert.ok(!/undefined|NaN/.test(model.svg));
    for(const control of model.controls)for(const value of control.options||[]){
      const variant=visuals.render(l.visual,i,{[control.key]:value},'en',theme);assert.ok(!/undefined|NaN/.test(variant.svg));
    }
  }
}
for(let period=1;period<=6;period++)assert.ok(!answers.every((v,i)=>v===answers[i%period]),'Repeating answer pattern');
for(let answer=0;answer<3;answer++)assert.ok(answers.filter(x=>x===answer).length>=15);
for(const g of refs.glossary)assert.ok(course.lessons[g[4]]);
assert.equal(JSON.parse(read('package.json')).version,course.version);
const frontend=JSON.parse(read('labs/frontend/package.json'));
assert.equal(frontend.dependencies['@angular/core'],course.angular);assert.equal(frontend.dependencies['@azure/msal-browser'],course.msal);
assert.ok(read('labs/api/pom.xml').includes('<version>'+course.spring+'</version>'));
assert.ok(read('labs/compose.yaml').includes('postgres:'+course.postgres+'-alpine'));
const forbidden=['node_modules','dist','.angular','runs','target','.qa'];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>forbidden.includes(e.name)?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk(root)){
  if(!/\.(js|mjs|json|html|css|md|txt|sql|java|xml|properties|yaml)$/.test(file))continue;
  const b=fs.readFileSync(file),text=b.toString('utf8');
  assert.ok(!(b[0]===239&&b[1]===187&&b[2]===191),'BOM '+file);
  assert.ok(!text.includes('\r'),'CRLF '+file);assert.ok(!/[\u2013\u2014]/.test(text),'Typographic dash '+file);
  if(/\.(js|mjs)$/.test(file))assert.equal(spawnSync(process.execPath,['--check',file]).status,0,file);
}
const zip=fs.readFileSync(path.join(root,'downloads/entra-labs.zip'));let offset=0;const entries=[];
while(zip.readUInt32LE(offset)===0x04034b50){
  const size=zip.readUInt32LE(offset+18),nameLen=zip.readUInt16LE(offset+26),extra=zip.readUInt16LE(offset+28);
  const name=zip.subarray(offset+30,offset+30+nameLen).toString();entries.push(name);offset+=30+nameLen+extra+size;
}
assert.ok(entries.includes('labs/TENANT.md')&&entries.includes('labs/frontend/package-lock.json'));
assert.ok(!entries.some(n=>/node_modules|\/dist\/|\/runs\/|\/target\/|\/\.env|\/config\.json/.test(n)));
assert.ok(!fs.existsSync(path.join(root,'dist/labs')),'dist should expose only the downloadable kit');
assert.ok(read('_headers').includes("connect-src 'none'"));
console.log(`PASS 24 lessons / 72 scenes / 72 questions / ${refs.glossary.length} terms; all model states in four themes; ${commands} scenario commands; ${entries.length} clean ZIP entries; encoding, syntax and pinned versions.`);
