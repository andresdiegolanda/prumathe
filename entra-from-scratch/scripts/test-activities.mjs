// Execute the commands printed in the curriculum, in order, through the learner's shell.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/curriculum.js'),'utf8'),context);
const results=[];
for(const lesson of context.window.ENTRA_COURSE.lessons)for(const [index,step] of lesson.lab.entries()){
  // Service setup is a documented prerequisite, not repeated by this read/experiment suite.
  if(!step.command.startsWith('node lab.mjs '))continue;
  const shell=process.platform==='win32'?'powershell.exe':'sh';
  const args=process.platform==='win32'?['-NoProfile','-Command',step.command]:['-c',step.command];
  const start=Date.now();
  const result=spawnSync(shell,args,{cwd:path.join(root,'labs'),encoding:'utf8',timeout:120000});
  if(result.status!==0)throw new Error(`${lesson.slug} step ${index+1}: ${result.stderr}\n${result.stdout}`);
  results.push({lesson:lesson.slug,step:index+1,command:step.command,milliseconds:Date.now()-start,output:result.stdout});
  console.log(`PASS ${lesson.slug} step ${index+1}`);
}
fs.mkdirSync(path.join(root,'.qa'),{recursive:true});
fs.writeFileSync(path.join(root,'.qa/activity-run.json'),JSON.stringify({date:new Date().toISOString(),shell:process.platform==='win32'?'Windows PowerShell':'sh',results},null,2)+'\n');
console.log(`${results.length} curriculum commands passed in order. Tenant and manual steps remain separate evidence.`);
