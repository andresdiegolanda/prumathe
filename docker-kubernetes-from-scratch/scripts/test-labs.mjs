/* Execute the commands printed in the lessons. No global prune or default kubeconfig use. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cwd = path.join(root, 'labs');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/curriculum.js'),'utf8'),context);
const suite = process.argv[2] || 'all';
const inNode = process.argv.includes('--in-node');
const from = Number(process.argv.find(arg=>arg.startsWith('--from='))?.split('=')[1]||0);
if(!Number.isInteger(from)||from<0||from>24)throw Error('Invalid --from lesson');
if (!['all','docker','kubernetes'].includes(suite)) throw new Error('Use all, docker or kubernetes');
const course = context.window.DK_COURSE;
const results = [];
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
const matches = (check, output) => check.exactLine ? output.split(/\r?\n/).includes(check.exactLine) : output.includes(check.contains);
function tokens(line) {
  // The course uses single-quoted arguments with literal double quotes inside, never shell expansion.
  return [...line.matchAll(/'([^']*)'|"([^"]*)"|(\S+)/g)].map(m=>m[1]??m[2]??m[3]);
}
function run(line) {
  let [cmd,...args]=tokens(line);
  if(inNode && cmd==='kubectl' && args.includes('--kubeconfig')) {
    args=args.filter((arg,i,all)=>!['--kubeconfig','--context'].includes(arg)&&!['--kubeconfig','--context'].includes(all[i-1])).map(arg=>arg.startsWith('k8s/')?'/course-k8s/'+arg.slice(4):arg);
    args=['exec','prumathe-dk-control-plane','kubectl','--kubeconfig=/etc/kubernetes/admin.conf','--context=kubernetes-admin@prumathe-dk',...args];
    cmd='docker';
  }
  const p=spawnSync(cmd,args,{cwd,encoding:'utf8',timeout:600000,maxBuffer:8*1024*1024});
  if(p.error)throw p.error;
  return {exit:p.status,output:(p.stdout||'')+(p.stderr||'')};
}
const versions={docker:run('docker version').output,compose:run('docker compose version').output,node:process.version,platform:process.platform,kubernetesTransport:inNode?'docker exec into course control-plane, admin.conf':'host kubectl with course kubeconfig'};
let failure;
try {
  if(inNode && from>13) {
    const copy=run('docker cp k8s/. prumathe-dk-control-plane:/course-k8s');
    if(copy.exit!==0)throw Error(copy.output);
  }
  for(const lesson of course.lessons) {
    if(lesson.id<from)continue;
    if(suite==='docker' && lesson.id>=13 || suite==='kubernetes' && lesson.id<13)continue;
    for(const [index,step] of lesson.lab.entries()) {
      const started=Date.now();
      const lines=step.command.split('\n');
      const checks=step.checks||[];
      let output='', last;
      for(const [i,line] of lines.entries()) {
        if(line==='cd labs') { if(!fs.existsSync(path.join(cwd,'compose.yaml')))throw Error('Missing extracted labs');continue; }
        if(line.startsWith('kind create cluster ')) {
          const existing=run('kind get clusters');
          if(existing.exit===0 && existing.output.split(/\r?\n/).includes('prumathe-dk')) {
            if(!fs.existsSync(path.join(cwd,'kubeconfig')))throw Error('Course cluster exists but its kubeconfig is missing');
            output+='Existing course cluster retained\n';continue;
          }
        }
        last=run(line);
        const expectedExit=i===lines.length-1 ? (checks.find(c=>c.exit!==undefined)?.exit??0):0;
        if(last.exit!==expectedExit)throw Error(`${lesson.id}.${index+1}: exit ${last.exit}, expected ${expectedExit}\n${line}\n${last.output}`);
        output+=last.output+'\n';
        if(inNode && line.startsWith('kind load docker-image')) {
          const copy=run('docker cp k8s/. prumathe-dk-control-plane:/course-k8s');
          if(copy.exit!==0)throw Error(copy.output);
        }
      }
      const retry=checks.find(c=>c.retry);
      if(retry && !matches(retry,output)) {
        for(let attempt=0;attempt<retry.retry;attempt++) {
          await pause(1000);
          last=run(lines.at(-1));
          if(last.exit!==0)throw Error(last.output);
          output+=last.output+'\n';
          if(matches(retry,last.output))break;
        }
      }
      for(const check of checks) {
        if(check.contains && !output.includes(check.contains))throw Error(`${lesson.id}.${index+1}: missing ${check.contains}\n${output}`);
        if(check.exactLine && !matches(check,output))throw Error(`${lesson.id}.${index+1}: missing line ${check.exactLine}\n${output}`);
        if(check.equalLines) {
          const hashes=output.trim().split(/\r?\n/).filter(x=>x.startsWith('sha256:'));
          if(hashes.length!==2 || hashes[0]!==hashes[1])throw Error('Image alias identities differ');
        }
      }
      results.push({lesson:lesson.id,step:index+1,ok:true,ms:Date.now()-started,output});
      console.log(`PASS ${String(lesson.id).padStart(2,'0')}.${index+1} ${step.title.en}`);
    }
  }
  if(suite!=='kubernetes') {
    const r=await fetch('http://127.0.0.1:18080');
    const body=await r.json();
    if(!r.ok || body.service!=='signal' || body.message!=='hello-compose')throw Error('Host port assertion failed');
    results.push({check:'Published host HTTP endpoint',ok:true});
  }
} catch(error) { failure=String(error.stack||error);console.error(failure);process.exitCode=1; }
fs.mkdirSync(path.join(root,'.qa'),{recursive:true});
const report=`labs-${suite}${from?'-from-'+from:''}.json`;
fs.writeFileSync(path.join(root,'.qa',report),JSON.stringify({date:new Date().toISOString(),suite,from,versions,results,failure},null,2)+'\n');
console.log(`${results.length} checks completed${failure?'; failed':'; all passed'}. Evidence: .qa/${report}`);
