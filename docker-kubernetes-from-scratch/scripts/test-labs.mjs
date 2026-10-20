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
if (!['all','docker','kubernetes','visor'].includes(suite)) throw new Error('Use all, docker, kubernetes or visor');
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

// The live viewer: its page, read-only HTTP, both planes read correctly, no effects on Docker or the
// cluster, and the last good reading kept (marked old) when the cluster cannot be reached.
async function visorSuite() {
  const http=await import('node:http');
  const raw=(method,p,host='127.0.0.1:18091')=>new Promise((resolve,reject)=>{const req=http.request({host:'127.0.0.1',port:18091,path:p,method,headers:{host}},res=>{let body='';res.on('data',c=>body+=c);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));});req.on('error',reject);req.end();});
  const state=async()=>JSON.parse((await raw('GET','/api/state')).body);
  async function until(what,predicate,ms=90000){const end=Date.now()+ms;let s;do{try{s=await state();if(predicate(s))return s;}catch(e){s=String(e);}await pause(500);}while(Date.now()<end);throw Error('Viewer condition not reached: '+what+'\n'+JSON.stringify(s).slice(0,800));}
  const must=(line,label)=>{const r=run(line);if(r.exit!==0)throw Error((label||line)+'\n'+r.output);return r.output;};
  const pass=(what)=>{results.push({check:what,ok:true});console.log('PASS '+what);};
  const wasRunning=run('docker compose ps --status running --services visor').output.split(/\r?\n/).includes('visor');
  must('docker compose up -d --wait visor');
  try {
    const page=await raw('GET','/');
    if(page.status!==200||!page.body.includes('visor.js'))throw Error('Viewer page missing');
    if((await raw('POST','/api/state')).status!==405||(await raw('DELETE','/')).status!==405)throw Error('The viewer accepted a write method');
    if((await raw('GET','/api/state','evil.example:18091')).status!==403)throw Error('The viewer answered a foreign host');
    if(!/default-src 'self'/.test(page.headers['content-security-policy']||'')||page.headers['x-content-type-options']!=='nosniff'||page.headers['cache-control']!=='no-store')throw Error('Viewer headers');
    pass('viewer page, 405 for write methods, 403 for a foreign host, CSP and headers');
    must('docker compose up -d --wait app');
    const app=s=>s.docker.ok&&s.docker.data.containers.find(c=>c.service==='app');
    await until('app with port, volume and network',s=>{const a=app(s);return a&&a.running&&a.ports.some(p=>p[0]==='127.0.0.1'&&p[1]===18080&&p[2]===8080)&&a.mounts.some(m=>m[2]==='/data')&&a.networks.some(n=>n[0]==='prumathe-dk_default')&&a.secrets.includes('/run/secrets/demo_token');});
    pass('Docker plane: app running with 127.0.0.1:18080, the signal-data volume, the project network and the secret mounted');
    run("docker run --rm prumathe-signal:1.0.0 sh -c 'exit 3'");
    await until('ephemeral container with exit 3',s=>s.events.some(e=>e.code==='ephemeral'&&e.exit===3));
    must('docker compose exec -T app touch /tmp/fail-live');
    await until('unhealthy app',s=>app(s)&&app(s).health&&app(s).health.status==='unhealthy'&&app(s).running&&s.events.some(e=>e.code==='health'&&e.to==='unhealthy'));
    must('docker compose exec -T app rm /tmp/fail-live');
    await until('healthy app again',s=>app(s)&&app(s).health&&app(s).health.status==='healthy');
    pass('Docker events: a container of less than a second with its exit code, unhealthy with the process running, and back to healthy');
    // No effects on Docker: in a quiet window, the course objects stay the same and no event touches them
    // except the health checks of app.
    // Sorted: the image list came out in a different order between two calls with nothing changed.
    const snapshot=()=>[must("docker ps -a --filter label=com.docker.compose.project=prumathe-dk --format '{{.ID}} {{.State}}'"),must("docker images --format '{{.ID}} {{.Repository}}:{{.Tag}}' prumathe-signal"),must("docker volume ls --filter label=com.docker.compose.project=prumathe-dk --format '{{.Name}}'")].join('\n').split(/\r?\n/).filter(Boolean).sort().join('\n');
    const before=snapshot();const t0=Math.floor(Date.now()/1000);await pause(10000);const t1=Math.floor(Date.now()/1000);
    const evs=must(`docker events --since ${t0} --until ${t1} --filter label=com.docker.compose.project=prumathe-dk --format '{{.Type}} {{.Action}}'`).split(/\r?\n/).filter(l=>l.trim()&&!/exec_(create|start|die)|health_status: healthy/.test(l)&&!l.includes('/app/probe.py'));
    const after=snapshot();
    if(after!==before||evs.length)throw Error('Something changed in a quiet window\n'+before+'\n'+after+'\n'+evs.join('\n'));
    pass('no effects on Docker: course containers, images and volumes unchanged and no events but health checks in 10 seconds');
    if(!fs.existsSync(path.join(cwd,'kubeconfig'))){console.log('SKIP Kubernetes plane: no course cluster (lesson 13)');return;}
    const nets=run("docker inspect --format '{{json .NetworkSettings.Networks}}' prumathe-dk-visor-1");
    if(!nets.output.includes('"kind"'))must('docker network connect kind prumathe-dk-visor-1');
    if(inNode)must('docker cp k8s/. prumathe-dk-control-plane:/course-k8s');
    const k=(s)=>s.k8s.ok&&s.k8s.data;
    await until('two Ready nodes',s=>k(s)&&k(s).nodes.length===2&&k(s).nodes.every(n=>n.ready));
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk apply -f k8s/namespace.yaml');
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml');
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s');
    const ready=await until('Deployment 2/2 with its endpoints',s=>{const d=k(s)&&k(s).deployments.find(x=>x.name==='signal');const e=k(s)&&k(s).endpointslices.filter(x=>x.service==='signal').flatMap(x=>x.endpoints);return d&&d.desired===2&&d.ready===2&&e.filter(x=>x.ready).length===2;});
    const oldPods=k(ready).pods.filter(p=>p.labels.app==='signal').map(p=>p.name);
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete pod -l app=signal --wait=true');
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s');
    await until('replacement Pods with new names',s=>{const p=k(s)&&k(s).pods.filter(x=>x.labels.app==='signal'&&x.ready&&!x.terminating);return p&&p.length===2&&p.every(x=>!oldPods.includes(x.name))&&s.events.some(e=>e.code==='podDeleted'&&oldPods.includes(e.pod));});
    pass('Kubernetes plane: nodes, Deployment 2/2 with its endpoints, and Pods replaced with new names');
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/probe.yaml');
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab wait --for=condition=Ready pod/probe --timeout=90s');
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec probe -- touch /tmp/not-ready');
    await until('probe not ready, endpoint not ready',s=>{const p=k(s)&&k(s).pods.find(x=>x.name==='probe');const e=k(s)&&k(s).endpointslices.filter(x=>x.service==='probe-entry').flatMap(x=>x.endpoints);return p&&!p.ready&&p.phase==='Running'&&e.length&&e.every(x=>!x.ready);});
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec probe -- rm /tmp/not-ready');
    await until('probe ready again',s=>{const p=k(s)&&k(s).pods.find(x=>x.name==='probe');return p&&p.ready;});
    must('kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete -f k8s/probe.yaml --wait=true');
    pass('readiness: Ready false with the process running and its endpoint out, then back');
    // No effects on the cluster: in a quiet window, every object in dk-lab keeps its resourceVersion.
    const versions=()=>must("kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployments,replicasets,pods,services,endpointslices,configmaps,secrets,persistentvolumeclaims,serviceaccounts,roles,rolebindings -o 'jsonpath={range .items[*]}{.kind}/{.metadata.name}={.metadata.resourceVersion} {end}'");
    await pause(5000);const v0=versions();await pause(10000);const v1=versions();
    if(v0!==v1)throw Error('An object in dk-lab changed in a quiet window\n'+v0+'\n'+v1);
    if(/visor/i.test(v1))throw Error('An object of the viewer appeared in dk-lab');
    pass('no effects on the cluster: every object in dk-lab keeps its resourceVersion for 10 seconds, none belongs to the viewer');
    const secret=JSON.stringify((await state()).k8s.data.secrets);
    if(/practice-only|token/i.test(secret.replace(/demo-token/g,'')))throw Error('Secret content reached the viewer: '+secret);
    pass('Secrets by name only');
    must('docker network disconnect kind prumathe-dk-visor-1');
    await until('Kubernetes plane old, last reading kept',s=>!s.k8s.ok&&s.k8s.since&&s.k8s.data&&s.k8s.data.nodes.length===2,30000);
    must('docker network connect kind prumathe-dk-visor-1');
    await until('Kubernetes plane back',s=>s.k8s.ok);
    pass('cluster unreachable: last good reading kept and marked old, then back');
  } finally {
    if(!wasRunning)run('docker compose stop visor');
  }
}

try {
  if(suite==='visor') { await visorSuite(); throw 'done'; }
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
        if(line.startsWith('docker network connect kind ')) {
          // Repeating lesson 13 finds the viewer already on the cluster network: Docker refuses, nothing changes.
          const nets=run("docker inspect --format '{{json .NetworkSettings.Networks}}' prumathe-dk-visor-1");
          if(nets.exit===0 && nets.output.includes('"kind"')) { output+='Viewer already on the kind network\n';continue; }
        }
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
} catch(error) { if(error!=='done'){failure=String(error.stack||error);console.error(failure);process.exitCode=1;} }
fs.mkdirSync(path.join(root,'.qa'),{recursive:true});
const report=`labs-${suite}${from?'-from-'+from:''}.json`;
fs.writeFileSync(path.join(root,'.qa',report),JSON.stringify({date:new Date().toISOString(),suite,from,versions,results,failure},null,2)+'\n');
console.log(`${results.length} checks completed${failure?'; failed':'; all passed'}. Evidence: .qa/${report}`);
