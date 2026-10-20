/* Real, offline Git experiments. Each invocation creates new repositories under labs/runs.
   No credentials, user repositories, global configuration, shell interpolation or cleanup.
   --step pauses before each operation that changes a repository; progress.json in the run folder
   records the last and the next operation for the live viewer (node lab.mjs visor). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const here = path.dirname(fileURLToPath(import.meta.url));
const experiments = { setup, local, snapshots, staging, branches, merge, conflict, remotes, sync, forks, strategies, undo, tags, secrets };
const words = process.argv.slice(2);
const requested = words.find(w => !w.startsWith('--')) || 'help';
const stepMode = words.includes('--step');
// Git commands that change a repository. With --step the helper pauses before each one and before each file it writes.
const CHANGES = new Set(['init','add','commit','switch','merge','rebase','revert','reset','tag','rm','clone','fetch','push']);
let active = null;
if (requested === 'visor') {
  await import('./visor.mjs');
} else if (requested === 'help' || !['all', ...Object.keys(experiments)].includes(requested)) {
  console.log('GitHub from scratch / GitHub desde cero\nnode lab.mjs <experiment> [--step]\n' + Object.keys(experiments).join(', ') + ', all\n--step: pause before each operation that changes a repository / pausa antes de cada operación que cambia un repositorio\nnode lab.mjs visor: live viewer / visor en vivo, http://127.0.0.1:18092');
  if (requested !== 'help') process.exitCode = 1;
} else {
  fs.mkdirSync(path.join(here, 'runs'), { recursive: true });
  const root = fs.mkdtempSync(path.join(here, 'runs', 'faro-'));
  const blankConfig = path.join(root, 'empty.gitconfig');
  const blankHooks = path.join(root, 'empty-hooks');
  fs.writeFileSync(blankConfig, ''); fs.mkdirSync(blankHooks);
  // Ignore inherited Git overrides and user defaults so experiments stay self-contained.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith('GIT_')));
  Object.assign(env, { GIT_CONFIG_NOSYSTEM:'1', GIT_CONFIG_GLOBAL:blankConfig, GIT_TERMINAL_PROMPT:'0', GIT_ALLOW_PROTOCOL:'file', GIT_EDITOR:'true', GIT_SEQUENCE_EDITOR:'true', GIT_MERGE_AUTOEDIT:'no', GIT_AUTHOR_NAME:'Faro Student', GIT_AUTHOR_EMAIL:'student@example.invalid', GIT_COMMITTER_NAME:'Faro Student', GIT_COMMITTER_EMAIL:'student@example.invalid' });
  const ctx = { root, env, blankHooks, passes:0, sequence:0, step:stepMode, done:0, current:null, last:null, list: requested === 'all' ? Object.keys(experiments) : [requested] };
  active = ctx; progress(ctx, null);
  console.log('EXPERIMENT / EXPERIMENTO: ' + root);
  if (stepMode) console.log('STEP BY STEP / PASO A PASO: Enter runs each operation / Enter ejecuta cada operación');
  console.log('Node ' + process.version);
  git(ctx, root, ['--version']);
  for (const name of requested === 'all' ? Object.keys(experiments) : [requested]) {
    console.log('\nEXPERIMENT / EXPERIMENTO: ' + name);
    ctx.current = name;
    experiments[name](ctx);
  }
  fs.writeFileSync(path.join(root, 'result.json'), JSON.stringify({ experiments: requested === 'all' ? Object.keys(experiments) : [requested], assertions:ctx.passes, node:process.version, git:git(ctx,root,['--version'],false).out.trim(), platform:process.platform, completedAt:new Date().toISOString() },null,2)+'\n');
  progress(ctx, null, true);
  console.log('\nPASS: ' + ctx.passes + ' assertions / comprobaciones');
  console.log('Inspect files / Inspeccioná archivos: ' + root);
}
function git(c, cwd, args, echo = true, expected = 0) {
  const resolved = path.resolve(cwd);
  assert.ok(resolved === c.root || resolved.startsWith(c.root + path.sep), 'Git cwd outside experiment');
  const options = ['-c','core.autocrlf=false','-c','commit.gpgsign=false','-c','tag.gpgsign=false','-c','core.hooksPath='+c.blankHooks,'-c','init.templateDir='+c.blankHooks,'-c','core.excludesFile='+path.join(c.root,'empty.gitconfig')];
  const op = changes(args) ? { op:'git', args, repo: repoOf(c, resolved, args) } : null;
  if(op) before(c, op);
  if(echo) console.log('$ '+shown(args));
  const r = spawnSync('git',[...options,...args],{cwd:resolved,env:c.env,encoding:'utf8',windowsHide:true,timeout:30000});
  if(r.error) throw r.error;
  if(op) after(c, op, r.status, expected !== 0);
  const out = r.stdout || '', err = r.stderr || '';
  if(echo && out.trim()) console.log(out.trim());
  if(r.status !== expected) throw new Error('Git result '+r.status+', expected '+expected+'\n'+out+err);
  if(expected !== 0 && echo) console.log('EXPECTED REJECTION / RECHAZO ESPERADO\n'+err.trim());
  return {out,err,status:r.status};
}
function check(c, condition, en, es) { assert.ok(condition,en); c.passes++; console.log('PASS: '+en+' / '+es); }
function write(repo,name,text) {
  const op = active ? { op:'write', file:name, text, repo: path.relative(active.root, repo) || '.' } : null;
  if(op) before(active, op);
  fs.writeFileSync(path.join(repo,name),text);
  if(op) after(active, op, null, false);
}
function changes(args) { return CHANGES.has(args[0]) || (args[0] === 'remote' && args[1] === 'add'); }
function repoOf(c, cwd, args) { return ['init','clone'].includes(args[0]) ? path.basename(args.at(-1)) : (path.relative(c.root, cwd) || '.'); }
function shown(args) { return 'git '+args.map(a => /\s/.test(a) ? "'"+a+"'" : a).join(' '); }
// In --step mode, show the next operation and wait for Enter. A child process reads the line, so the
// experiments stay synchronous and unchanged.
function before(c, op) {
  if(!c.step) return;
  progress(c, op);
  const what = op.op === 'git' ? shown(op.args) : 'write / escribir '+op.file+': '+op.text.trim().split('\n').join(' | ');
  console.log('\nSTEP / PASO '+(c.done+1)+' · '+op.repo+'\n  '+what+'\nEnter: run / ejecutar');
  spawnSync(process.execPath,['-e',"process.stdin.once('data',()=>process.exit(0));process.stdin.once('end',()=>process.exit(0));"],{stdio:'inherit'});
}
function after(c, op, exit, expected) { c.done++; c.last = { ...op, exit, expected }; progress(c, null); }
function progress(c, next, finished = false) {
  fs.writeFileSync(path.join(c.root,'progress.json'), JSON.stringify({ experiments:c.list, current:c.current, step:c.step, done:c.done, last:c.last, next, finished, pid:process.pid, updatedAt:Date.now() },null,2)+'\n');
}
function read(repo,name) { return fs.readFileSync(path.join(repo,name),'utf8'); }
function rev(c,r,ref='HEAD') { return git(c,r,['rev-parse',ref],false).out.trim(); }
function record(c,r,message) { git(c,r,['add','.']); git(c,r,['commit','-m',message]); return rev(c,r); }
function create(c,name) {
  const r=path.join(c.root,String(++c.sequence).padStart(2,'0')+'-'+name);
  git(c,c.root,['init','--initial-branch=main',r]);
  write(r,'guide.txt','Faro library\nOpen at 09:00\n'); record(c,r,'Record the original opening hours');
  return r;
}
function graph(c,r) { git(c,r,['log','--all','--graph','--oneline','--decorate']); }
function setup(c) {
  const r=create(c,'setup');
  check(c,git(c,r,['rev-list','--count','HEAD'],false).out.trim()==='1','One real local commit','Un commit local real');
  check(c,git(c,r,['remote'],false).out.trim()==='','No remote configured','Ningún remoto configurado');
}
function local(c) {
  const r=create(c,'local');write(r,'guide.txt','Faro library\nOpen at 10:00\n');record(c,r,'Adapt hours for winter');graph(c,r);
  check(c,git(c,r,['rev-list','--count','HEAD'],false).out.trim()==='2','Two local commits','Dos commits locales');
  check(c,git(c,r,['remote'],false).out.trim()==='','Recording needed no remote','Registrar no necesitó remoto');
}
function snapshots(c) {
  const r=create(c,'snapshots'), old=rev(c,r);
  write(r,'guide.txt','Faro library\nOpen at 10:00\n');record(c,r,'Adapt hours for winter');
  const past=git(c,r,['show',old+':guide.txt']).out, now=git(c,r,['show','HEAD:guide.txt']).out;
  git(c,r,['diff',old,'HEAD']);
  check(c,past.includes('09:00')&&now.includes('10:00'),'Both snapshots retain their own content','Cada instantánea conserva su contenido');
  check(c,rev(c,r,'HEAD^')===old,'New commit links to its parent','El commit nuevo enlaza a su padre');
}
function staging(c) {
  const r=create(c,'staging');
  write(r,'guide.txt','Faro library\nOpen at 10:00\n');git(c,r,['add','guide.txt']);
  write(r,'guide.txt','Faro library\nOpen at 11:00\n');
  git(c,r,['diff']);git(c,r,['diff','--cached']);
  const prepared=git(c,r,['show',':guide.txt']).out;
  git(c,r,['commit','-m','Record prepared winter hours']);
  const committed=git(c,r,['show','HEAD:guide.txt']).out;
  check(c,prepared.includes('10:00')&&committed.includes('10:00'),'Prepared 10:00 was recorded','Se registró el 10:00 preparado');
  check(c,read(r,'guide.txt').includes('11:00'),'Working file still says 11:00','El archivo de trabajo sigue en 11:00');
  check(c,git(c,r,['diff'],false).out.includes('11:00'),'Later edit remains uncommitted','La edición posterior sigue sin registrar');
}
function branches(c) {
  const r=create(c,'branches'), first=rev(c,r);
  git(c,r,['switch','-c','hours']);
  check(c,rev(c,r,'hours')===first&&rev(c,r,'main')===first,'New branch starts at the same commit','La rama nueva parte del mismo commit');
  write(r,'guide.txt','Faro library\nOpen at 10:00\n');record(c,r,'Change hours on the proposal branch');graph(c,r);
  check(c,rev(c,r,'main')===first&&rev(c,r,'hours')!==first,'Only hours advanced','Solo avanzó hours');
  git(c,r,['switch','main']);
  check(c,read(r,'guide.txt').includes('09:00'),'Switching restores the selected snapshot','Cambiar recupera la instantánea seleccionada');
}
function merge(c) {
  const ff=create(c,'fast-forward');git(c,ff,['switch','-c','hours']);
  write(ff,'guide.txt','Faro library\nOpen at 10:00\n');const tip=record(c,ff,'Update hours');
  git(c,ff,['switch','main']);git(c,ff,['merge','--ff-only','hours']);
  check(c,rev(c,ff,'main')===tip,'Fast-forward reuses the existing tip','Fast-forward reutiliza la punta existente');
  const r=create(c,'merge');git(c,r,['switch','-c','hours']);
  write(r,'guide.txt','Faro library\nOpen at 10:00\n');record(c,r,'Update hours');
  git(c,r,['switch','main']);write(r,'contact.txt','Contact the Faro desk\n');record(c,r,'Add contact information');
  git(c,r,['merge','--no-edit','hours']);graph(c,r);
  check(c,git(c,r,['show','-s','--format=%P','HEAD'],false).out.trim().split(' ').length===2,'Merge has two parents','La integración tiene dos padres');
  check(c,read(r,'guide.txt').includes('10:00')&&fs.existsSync(path.join(r,'contact.txt')),'Both changes are present','Ambos cambios están presentes');
}
function conflict(c) {
  const r=create(c,'conflict');git(c,r,['switch','-c','hours']);
  write(r,'guide.txt','Faro library\nOpen at 10:00\n');record(c,r,'Choose 10:00');
  git(c,r,['switch','main']);write(r,'guide.txt','Faro library\nOpen at 11:00\n');record(c,r,'Choose 11:00');
  git(c,r,['merge','--no-edit','hours'],true,1);
  const marked=read(r,'guide.txt'); console.log(marked);
  check(c,marked.includes('<<<<<<<')&&marked.includes('======='),'Conflicting intentions are marked','Las intenciones incompatibles están marcadas');
  write(r,'guide.txt','Faro library\nOpen at 10:30\n');record(c,r,'Agree on 10:30 after reviewing both intentions');
  check(c,read(r,'guide.txt').includes('10:30'),'Resolution records the chosen agreement','La resolución registra el acuerdo elegido');
  check(c,git(c,r,['status','--porcelain'],false).out.trim()==='','No unfinished conflict remains','No queda conflicto pendiente');
  check(c,git(c,r,['show','-s','--format=%P','HEAD'],false).out.trim().split(' ').length===2,'Resolution retains both parents','La resolución conserva ambos padres');
}
function shared(c,name) {
  const a=create(c,name+'-ana'), server=path.join(c.root,name+'-remote.git'), b=path.join(c.root,name+'-bruno');
  git(c,c.root,['clone','--bare',a,server]);git(c,a,['remote','add','origin',server]);git(c,a,['fetch','origin']);
  git(c,c.root,['clone',server,b]);return {a,b,server};
}
function publishHours(c,a,hour) {write(a,'guide.txt','Faro library\nOpen at '+hour+'\n');record(c,a,'Publish opening hours '+hour);git(c,a,['push','origin','main']);}
function remotes(c) {
  const {a,b,server}=shared(c,'remotes'), old=rev(c,b,'origin/main');publishHours(c,a,'10:00');
  console.log('REMOTE main: '+rev(c,server,'main')+'\nBRUNO origin/main: '+rev(c,b,'origin/main'));
  check(c,rev(c,b,'origin/main')===old&&rev(c,server,'main')!==old,'Remote-tracking knowledge can be stale','El conocimiento de seguimiento puede estar desactualizado');
  check(c,read(b,'guide.txt').includes('09:00'),'Bruno has an independent working copy','Bruno tiene una copia de trabajo independiente');
}
function sync(c) {
  const {a,b,server}=shared(c,'sync'), original=rev(c,b);publishHours(c,a,'10:00');
  git(c,b,['fetch','origin']);
  check(c,rev(c,b)===original&&read(b,'guide.txt').includes('09:00'),'Fetch did not integrate or edit files','Fetch no integró ni editó archivos');
  check(c,rev(c,b,'origin/main')===rev(c,server,'main'),'Fetch updated remote knowledge','Fetch actualizó el conocimiento remoto');
  git(c,b,['merge','--ff-only','origin/main']);
  check(c,read(b,'guide.txt').includes('10:00'),'Integration updates the working version','Integrar actualiza la versión de trabajo');
  publishHours(c,a,'11:00');const remoteTip=rev(c,server,'main');
  write(b,'contact.txt','Faro desk\n');record(c,b,'Add contact while another author advances');
  const rejected=git(c,b,['push','origin','main'],true,1);
  check(c,/rejected/.test(rejected.err)&&rev(c,server,'main')===remoteTip,'Divergent push rejected without changing remote','Push divergente rechazado sin cambiar el remoto');
  git(c,b,['fetch','origin']);git(c,b,['merge','--no-edit','origin/main']);git(c,b,['push','origin','main']);
  check(c,rev(c,server,'main')===rev(c,b)&&read(b,'guide.txt').includes('11:00'),'Integration preserves both authors before publishing','Integrar conserva a ambos autores antes de publicar');
}
function forks(c) {
  const source=create(c,'fork-source'), original=path.join(c.root,'original.git'), fork=path.join(c.root,'fork.git'), clone=path.join(c.root,'fork-clone');
  git(c,c.root,['clone','--bare',source,original]);git(c,c.root,['clone','--bare',original,fork]);git(c,c.root,['clone',fork,clone]);
  git(c,clone,['remote','add','upstream',original]);git(c,clone,['remote','-v']);
  const old=rev(c,original,'main');write(clone,'guide.txt','Faro library\nOpen at 10:00\n');record(c,clone,'Propose new hours in independent repository');git(c,clone,['push','origin','main']);
  check(c,rev(c,original,'main')===old,'Original repository stays unchanged','El repositorio original queda intacto');
  check(c,rev(c,fork,'main')===rev(c,clone)&&rev(c,clone)!==old,'Only the fork-like repository receives the publication','Solo el repositorio semejante al fork recibe la publicación');
  console.log('BOUNDARY / LÍMITE: local repository topology, not a GitHub fork network / topología local, no una red de forks de GitHub');
}
function strategies(c) {
  const seed=create(c,'strategies-source');git(c,seed,['switch','-c','feature']);write(seed,'contact.txt','Faro desk\n');record(c,seed,'Add contact');write(seed,'workshop.txt','Workshop at 11:00\n');const originalFeature=record(c,seed,'Add workshop');
  git(c,seed,['switch','main']);write(seed,'guide.txt','Faro library\nOpen at 10:00\n');record(c,seed,'Adapt opening hours');
  const results={};
  for(const mode of ['merge','squash','rebase']) {
    const r=path.join(c.root,'strategy-'+mode);git(c,c.root,['clone',seed,r]);
    if(mode==='merge') git(c,r,['merge','--no-ff','origin/feature','-m','Integrate feature with ancestry']);
    if(mode==='squash') {git(c,r,['merge','--squash','origin/feature']);git(c,r,['commit','-m','Deliver contact and workshop together']);}
    if(mode==='rebase') {git(c,r,['switch','-c','replayed','origin/feature']);git(c,r,['rebase','main']);git(c,r,['switch','main']);git(c,r,['merge','--ff-only','replayed']);}
    graph(c,r);results[mode]={tree:rev(c,r,'HEAD^{tree}'),parents:git(c,r,['show','-s','--format=%P','HEAD'],false).out.trim().split(' '),head:rev(c,r),count:Number(git(c,r,['rev-list','--count','origin/main..HEAD'],false).out.trim())};
  }
  console.log(JSON.stringify(results,null,2));
  check(c,new Set(Object.values(results).map(x=>x.tree)).size===1,'All strategies yield identical final trees','Todas las estrategias producen árboles finales idénticos');
  check(c,results.merge.parents.length===2&&results.squash.parents.length===1&&results.rebase.parents.length===1,'Parent counts reflect different topology','Las cantidades de padres reflejan distinta topología');
  check(c,results.squash.count===1&&results.rebase.count===2,'Squash combines while rebase retains two replayed decisions','Squash combina y rebase conserva dos decisiones reaplicadas');
  check(c,results.rebase.head!==originalFeature,'Replay onto a new base changes identity','Reaplicar sobre otra base cambia la identidad');
}
function undo(c) {
  const r=create(c,'undo'), original=rev(c,r);write(r,'guide.txt','Faro library\nOpen at 10:00\n');const mistake=record(c,r,'Record mistaken hours');
  git(c,r,['revert','--no-edit',mistake]);const correction=rev(c,r);graph(c,r);
  check(c,read(r,'guide.txt').includes('09:00')&&correction!==original,'Revert restores content with a new commit','Revert recupera contenido con un commit nuevo');
  check(c,rev(c,r,'HEAD^')===mistake,'The original mistake remains an ancestor','El error original sigue siendo ancestro');
  git(c,r,['switch','-c','soft-reset-example',mistake]);git(c,r,['reset','--soft',original]);
  check(c,rev(c,r)===original&&read(r,'guide.txt').includes('10:00'),'Soft reset moves the branch while keeping files','Soft reset mueve la rama y conserva archivos');
  check(c,git(c,r,['diff','--cached'],false).out.includes('10:00'),'The changed content remains prepared','El contenido cambiado sigue preparado');
}
function tags(c) {
  const r=create(c,'tags'), version=rev(c,r);git(c,r,['tag','-a','v1.0','-m','Original public schedule']);
  write(r,'guide.txt','Faro library\nOpen at 10:00\n');record(c,r,'Prepare the next schedule');graph(c,r);
  check(c,rev(c,r,'v1.0^{}')===version&&rev(c,r)!==version,'Tag stays while main advances','El tag queda mientras main avanza');
  const old=git(c,r,['show','v1.0:guide.txt']).out;
  check(c,old.includes('09:00')&&read(r,'guide.txt').includes('10:00'),'Each reference selects its own version','Cada referencia selecciona su versión');
}
function secrets(c) {
  const r=create(c,'secrets');write(r,'practice.env','FAKE_NOT_A_SECRET=learning-only\n');const exposed=record(c,r,'Record a deliberately fake marker');
  write(r,'.gitignore','practice.env\n');record(c,r,'Add ignore rule after the file was tracked');
  check(c,git(c,r,['ls-files','practice.env'],false).out.trim()==='practice.env','Ignore rule does not untrack an existing file','La regla de ignorar no deja de seguir un archivo existente');
  git(c,r,['rm','practice.env']);git(c,r,['commit','-m','Remove fake marker from current snapshot']);
  check(c,!fs.existsSync(path.join(r,'practice.env')),'Current working file is removed','El archivo actual fue quitado');
  const old=git(c,r,['show',exposed+':practice.env']).out;
  check(c,old.includes('FAKE_NOT_A_SECRET'),'Old snapshot still contains the fake marker','La instantánea vieja todavía contiene el marcador ficticio');
}
