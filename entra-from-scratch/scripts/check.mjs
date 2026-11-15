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
assert.equal(course.lessons.length,25);assert.equal(course.units.length,7);
assert.equal(new Set(course.lessons.map(l=>l.slug)).size,25);
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
// The big picture: the shared engine validates its own data (ids, geometry, every text, journeys
// that move only along lines), and every lab command it names exists.
const bp={window:{}};
for(const name of ['curriculum','big-picture-data','big-picture'])vm.runInNewContext(read('assets/'+name+'.js'),bp);
const picture=bp.window.BIG_PICTURE,BigPicture=bp.window.BigPicture;
// A lab command is a lab.mjs scenario, a kit script, or a command that a lesson step prints, such as dsregcmd /status.
const labCommand=(command)=>{const [, file, scenario]=command.split(' ');if(file==='lab.mjs')return runner.includes('async '+scenario+'()');if(['configure.mjs','tenant-probe.mjs'].includes(file))return fs.existsSync(path.join(root,'labs',file));return course.lessons.some(l=>l.lab.some(s=>s.command===command));};
const pictureErrors=[...BigPicture.validate(picture,bp.window.ENTRA_COURSE,{icons:BigPicture.icons(),lab:labCommand})];
assert.equal(pictureErrors.length,0,pictureErrors.join('\n'));
assert.ok(read('big-picture.html').includes('assets/big-picture.js')&&read('big-picture.html').includes('<noscript>'));
assert.ok(fs.existsSync(path.join(root,'dist/big-picture.html')),'dist publishes the big picture');
assert.ok(read('assets/app.js').includes('big-picture.html'),'the course links the big picture');
console.log(`PASS ${course.lessons.length} lessons / ${course.lessons.length*3} scenes / ${course.lessons.length*3} questions / ${refs.glossary.length} terms; big picture with ${picture.journeys.length} journeys and ${Object.keys(picture.nodes).length} pieces; all model states in four themes; ${commands} scenario commands; ${entries.length} clean ZIP entries; encoding, syntax and pinned versions.`);
