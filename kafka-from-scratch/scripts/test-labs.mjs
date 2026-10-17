/* Integration checks against the isolated kafka-from-scratch Compose project.
   Resets course practice topics. Never point BOOTSTRAP_SERVERS at another cluster. */
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),cwd=path.join(root,'labs');
const suite=process.argv[2]||'core',log=[];fs.mkdirSync(path.join(root,'.qa'),{recursive:true});
function docker(args,{allowFailure=false,match=null,timeout=90000}={}){const r=spawnSync('docker',['compose',...args],{cwd,encoding:'utf8',timeout,maxBuffer:8*1024*1024});const out=(r.stdout||'')+(r.stderr||'');log.push({args,status:r.status,output:out});fs.writeFileSync(path.join(root,'.qa',`labs-${suite}.json`),JSON.stringify(log,null,2));if(r.error)throw r.error;if(!allowFailure&&r.status!==0)throw new Error(`docker compose ${args.join(' ')} failed:\n${out}`);if(match&&!match.test(out))throw new Error(`Missing ${match} in:\n${out}`);console.log(`${r.status===0?'PASS':'EXPECTED FAILURE'} ${args.join(' ')}`);return out;}
const lab=(...a)=>docker(['run','--rm','lab',...a.map(String)]);
const expect=(args,pattern)=>docker(['run','--rm','lab',...args.map(String)],{match:pattern});
const failure=(args,pattern)=>{const out=docker(['run','--rm','lab',...args.map(String)],{allowFailure:true,match:pattern});if(log.at(-1).status===0)throw new Error('Expected nonzero exit');return out;};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(fn,predicate,ms=45000){const end=Date.now()+ms;let out;do{try{out=fn();if(predicate(out))return out;}catch(err){out=String(err);}await pause(2000);}while(Date.now()<end);throw new Error('Condition not reached: '+out);}
if(suite==='core'){
  expect(['cluster'],/id: 3/);
  for(const n of [1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27])lab('prepare',n);
  for(const n of [1,2,3,4,6,8]){lab('seed',n);expect(['read',n],new RegExp('RECORDS '+([3,6,8].includes(n)?6:3)));}
  expect(['read',1],/RECORDS 3/);expect(['read',2],/event-type=OrderPlaced,trace-id=course-demo/);
  lab('expand',4,4);lab('seed',4);expect(['read',4],/RECORDS 6/);
  lab('prepare',5);expect(['benchmark',5,0,1024],/ACKNOWLEDGED 2000/);expect(['benchmark',5,20,65536],/ACKNOWLEDGED 2000/);expect(['offsets',5],/end=4000/);
  lab('seed',7);expect(['consume',7,'bookmarks'],/PROCESSED 3/);expect(['consume',7,'bookmarks'],/PROCESSED 0/);expect(['lag',7,'bookmarks'],/lag=0/);lab('reset',7,'bookmarks');expect(['consume',7,'bookmarks'],/PROCESSED 3/);
  lab('compact-seed',13);expect(['table',13],/TABLE \{A=30\}/);
  lab('seed',14);failure(['delivery','crash'],/INTENTIONAL CRASH/);lab('delivery','resume');expect(['read-topic','lab14-effects'],/RECORDS 4/);
  lab('duplicate',15);expect(['read',15],/RECORDS 2/);expect(['dedup',15],/APPLY event-E42[\s\S]*SKIP event-E42/);
  lab('transactions',16);expect(['read',16,'read_uncommitted'],/RECORDS 2/);expect(['read',16,'read_committed'],/RECORDS 1/);lab('seed',16);lab('eos',16);expect(['eos',16],/NO REMAINING INPUT/);
  expect(['schema','compatible'],/^COMPATIBLE/m);expect(['schema','incompatible'],/^INCOMPATIBLE/m);lab('put',17,'order-1','not-avro');expect(['read',17],/value=not-avro/);
  lab('seed',23);lab('reset',23,'ops');lab('consume',23,'ops');const lag=lab('lag',23,'ops');if((lag.match(/lag=0/g)||[]).length!==3)throw new Error('Lag did not reach zero on all partitions');
  expect(['skew',24],/PARTITION COUNTS/);lab('expand',24,6);expect(['skew',24],/PARTITION COUNTS/);
  lab('seed',27);lab('eos',27,'abort');expect(['read-topic','lab27-output','read_committed'],/RECORDS 0/);lab('eos',27);expect(['eos',27],/NO REMAINING INPUT/);expect(['verify',27],/PASS: six unique/);
}
else if(suite==='failures'){
  lab('prepare',9);lab('seed',9);lab('prepare',10);lab('seed',10);
  try{docker(['stop','kafka3']);await eventually(()=>lab('describe',10),s=>{const isr=s.match(/isr=(.*?), elr=/)?.[1]||'';return isr.includes('id: 1')&&isr.includes('id: 2')&&!isr.includes('id: 3');});failure(['seed',10],/NotEnoughReplicas|Timeout/);expect(['read',9],/RECORDS 3/);lab('create-extra',11);}finally{docker(['up','-d','--wait'],{timeout:180000});}
  await eventually(()=>lab('seed',10),s=>s.includes('ACK'));
  try{docker(['stop','kafka1']);expect(['verify',27],/PASS: six unique/);}finally{docker(['up','-d','--wait'],{timeout:180000});}
  lab('prepare',12);lab('seed',12);await pause(2200);lab('seed',12);await eventually(()=>lab('offsets',12),s=>/beginning=[1-9]/.test(s),50000);
  const names=['kafka-course-qa-member-a','kafka-course-qa-member-b'];
  try{docker(['run','-d','--name',names[0],'lab','watch','6','qa-members']);await eventually(()=>lab('describe-group','qa-members'),s=>s.includes('lab6-0'));docker(['run','-d','--name',names[1],'lab','watch','6','qa-members']);await eventually(()=>lab('describe-group','qa-members'),s=>(s.match(/consumer-qa-members/g)||[]).length>=2);}
  finally{for(const name of names){spawnSync('docker',['stop',name],{encoding:'utf8',timeout:20000});spawnSync('docker',['rm',name],{encoding:'utf8',timeout:10000});}}
}
else if(suite==='integrations'){
  lab('prepare',18);docker(['--profile','connect','up','-d','connect']);try{await eventually(()=>docker(['run','--rm','lab','connect-status'],{allowFailure:true}),s=>s.includes('RUNNING'));docker(['exec','connect','sh','/course/connect/append.sh']);await eventually(()=>lab('read',18),s=>s.includes('OrderPlaced from the file'));}finally{docker(['--profile','connect','stop','connect']);}
  lab('prepare',19);docker(['--profile','database','up','-d','--wait','postgres'],{timeout:180000});try{lab('outbox','create');failure(['outbox','crash'],/INTENTIONAL CRASH/);lab('outbox','relay');expect(['read',19],/RECORDS 2/);}finally{docker(['--profile','database','stop','postgres']);}
  for(const n of [20,21]){
    lab('prepare',n);const name='kafka-course-qa-stream-'+n;
    try{docker(['run','-d','--name',name,'lab',n===20?'streams':'windows',String(n)]);await pause(5000);lab(n===20?'seed':'window-seed',n);await eventually(()=>lab('read-topic',n===20?'lab20-counts':'lab21-windows','read_committed'),s=>s.includes('value=2'));
      if(n===20){spawnSync('docker',['stop',name],{encoding:'utf8',timeout:20000});spawnSync('docker',['rm',name],{encoding:'utf8',timeout:10000});docker(['run','-d','--name',name,'lab','streams','20']);await pause(5000);lab('seed',20);await eventually(()=>lab('read-topic','lab20-counts','read_committed'),s=>s.includes('value=4'));}
    }finally{spawnSync('docker',['stop',name],{encoding:'utf8',timeout:20000});spawnSync('docker',['rm',name],{encoding:'utf8',timeout:10000});}
  }
  docker(['--profile','security','up','-d','--wait','secure'],{timeout:180000});try{lab('acl','setup');expect(['acl','writer'],/ACK/);failure(['acl','reader'],/TopicAuthorizationException/);}finally{docker(['--profile','security','stop','secure']);}
  lab('prepare',25);lab('seed',25);docker(['--profile','mirror','up','-d','--wait','mirror'],{timeout:180000});try{expect(['mirror'],/SOURCE P0 offset=0 -> TARGET/);lab('mirror');}finally{docker(['--profile','mirror','stop','mirror']);}
  docker(['--profile','share','up','-d','--wait','share'],{timeout:180000});try{docker(['exec','share','/opt/kafka/bin/kafka-features.sh','--bootstrap-server','share:9092','upgrade','--feature','share.version=1']);expect(['share'],/PASS: released once, accepted all six offsets/);}finally{docker(['--profile','share','stop','share']);}
}else if(suite==='spring'){
  docker(['--profile','spring','up','-d','--wait','spring'],{timeout:180000});
  try{
    const received=async()=>{const r=await fetch('http://127.0.0.1:18080/received');if(!r.ok)throw new Error('HTTP '+r.status);return r.json();};
    async function waitReceived(count){for(let attempt=0;attempt<25;attempt++){const records=await received();if(records.length>=count)return records;await pause(400);}throw new Error('Listener did not receive expected records');}
    const initial=await received();
    const post=['run','--rm','http','--fail-with-body','-i','-X','POST','http://spring:8080/orders/order-42','-H','Content-Type:application/json','--data-binary','@/requests/order.json'];
    docker(post,{match:/HTTP\/1.1 202[\s\S]*"topic":"spring-orders"/});
    let records=await waitReceived(initial.length+1);let first=records.at(-1);
    if(first.key!=='order-42'||first.event.eventId!=='evt-spring-42'||first.event.quantity!==2)throw new Error('Key or typed payload mismatch');
    docker(post,{match:/HTTP\/1.1 202/});records=await waitReceived(initial.length+2);let second=records.at(-1);
    if(first.partition!==second.partition||first.offset===second.offset)throw new Error('Duplicate send partition/offset mismatch');
    docker(['run','--rm','http','--fail-with-body','http://spring:8080/received'],{match:/evt-spring-42/});
    await eventually(()=>docker(['exec','kafka1','/opt/kafka/bin/kafka-consumer-groups.sh','--bootstrap-server','kafka1:9092','--group','spring-kitchen','--describe']),s=>{const rows=s.split('\n').filter(x=>x.startsWith('spring-kitchen')).map(x=>x.trim().split(/\s+/));return rows.length===3&&rows.every(r=>r[5]==='0'||(r[3]==='-'&&r[4]==='0'));});
    docker(['restart','spring']);docker(['--profile','spring','up','-d','--wait','spring'],{timeout:180000});
    await pause(1500);if((await received()).length!==0)throw new Error('Committed records replayed on restart');
    docker(post,{match:/HTTP\/1.1 202/});await waitReceived(1);
    const invalid=await fetch('http://127.0.0.1:18080/orders/invalid',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"eventId":"bad","item":"espresso","quantity":0}'});
    if(invalid.status!==400)throw new Error('Invalid input was not rejected');
    docker(['logs','--tail','20','spring'],{match:/RECEIVED key=order-42/});
    console.log('PASS typed JSON, Kafka key, broker acknowledgment, duplicate sends, no outstanding group work, restart offsets, post-restart consumption and invalid input');
  }finally{docker(['--profile','spring','stop','spring']);}
}else throw new Error('Suite must be core, failures, integrations or spring');
console.log(`SUITE ${suite} PASSED (${log.length} operations). Evidence: .qa/labs-${suite}.json`);
