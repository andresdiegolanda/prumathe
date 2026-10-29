import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createZip } from './zip.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context={window:{}};
for(const name of ['curriculum','reference','about']) vm.runInNewContext(fs.readFileSync(path.join(root,'assets',name+'.js'),'utf8'),context);
const course=context.window.ENTRA_COURSE, refs=context.window.ENTRA_REFERENCE, about=context.window.ENTRA_ABOUT;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function html(lesson=null, overview=false){
  const p=lesson?'../':'', title=(lesson?lesson.title.en:overview?about.title.en:'Microsoft Entra from scratch');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(title)} | Prumathe</title><meta name="description" content="Understand authentication and authorization through Angular, Spring and PostgreSQL. Visual models, experiments and a real Entra tenant workbook."><link rel="icon" href="${p}assets/favicon.svg"><script src="${p}assets/theme.js"></script><link rel="stylesheet" href="${p}assets/course.css"></head><body${lesson?` data-lesson="${lesson.id}"`:overview?' data-page="about"':''}><div id="app"></div><noscript><main><h1>${esc(title)}</h1><p>This course needs JavaScript. Every script is included locally.</p><a href="${p}downloads/course-notes-en.txt">Read the complete English notes</a></main></noscript><script src="${p}assets/curriculum.js"></script><script src="${p}assets/reference.js"></script><script src="${p}assets/visuals.js"></script>${overview?`<script src="${p}assets/about.js"></script>`:''}<script src="${p}assets/app.js"></script></body></html>
`;
}
for(const d of ['lessons','downloads','dist'])fs.mkdirSync(path.join(root,d),{recursive:true});
fs.writeFileSync(path.join(root,'index.html'),html());
fs.writeFileSync(path.join(root,'what-entra-is.html'),html(null,true));
for(const l of course.lessons)fs.writeFileSync(path.join(root,'lessons',l.slug+'.html'),html(l));
let notes=`MICROSOFT ENTRA FROM SCRATCH\nVersion ${course.version} | Sources reviewed ${course.date}\nAngular ${course.angular} | MSAL Browser ${course.msal} | Spring Boot ${course.spring} | PostgreSQL ${course.postgres}\n\n${about.title.en}\n${about.lead.en}\n\n`;
for(const section of [about.what,about.origin])notes+=section.title.en+'\n'+section.text.map(p=>p.en).join('\n\n')+'\n\n';
for(const p of about.origin.timeline)notes+=p.year+' '+p.label.en+': '+p.text.en+'\n';
for(const section of [about.fits,about.misfits])notes+='\n'+section.title.en+'\n'+section.intro.en+'\n'+section.items.map(x=>x.title.en+': '+(x.text?.en||x.why.en+' '+x.instead.en)).join('\n')+'\n';
notes+='\n'+about.decide.questions.map((q,i)=>`${i+1}. ${q.en}`).join('\n')+'\n\n';
for(const l of course.lessons){
  notes+=`\n${String(l.id).padStart(2,'0')}. ${l.title.en}\n${'='.repeat(65)}\n${l.intro.en}\nEvidence route: ${l.mode}\n\n`;
  for(const f of l.frames)notes+=f.title.en+'\n'+f.text.en+'\nRule: '+f.rule.en+'\n\n';
  notes+='MODEL EXPERIMENT: '+l.experiment.en+'\n\nACTIVITY\n';
  for(const [i,s] of l.lab.entries())notes+=`${i+1}. ${s.title.en}\n${s.text.en}\n${s.command?'Reference: '+s.command+'\n':''}Observe: ${s.expected.en}\n\n`;
  notes+='CHECKPOINT\n';
  for(const [i,q]of l.quiz.entries())notes+=`${i+1}. ${q.question.en}\n${q.options.map((o,j)=>String.fromCharCode(65+j)+'. '+o.en).join('\n')}\n\n`;
  notes+='ANSWERS AND REASONS\n'+l.quiz.map((q,i)=>`${i+1}. ${String.fromCharCode(65+q.correct)}: ${q.explanation.en}`).join('\n')+'\n\n';
  notes+='SOURCES\n'+[refs.sources[l.source],...(refs.more[l.source]||[])].map(([a,b])=>a+'\n'+b).join('\n')+'\n';
}
notes+='\nGLOSSARY\n'+refs.glossary.map(g=>g[0]+': '+g[2]).join('\n')+'\n';
fs.writeFileSync(path.join(root,'downloads/course-notes-en.txt'),notes);
createZip(root);
for(const item of ['index.html','what-entra-is.html','assets','lessons','downloads','404.html','_headers'])fs.cpSync(path.join(root,item),path.join(root,'dist',item),{recursive:true});
console.log(`Built ${course.lessons.length} English lessons, ${course.lessons.length*3} scenes, ${course.lessons.length*3} questions, ${course.lessons.reduce((n,l)=>n+l.lab.length,0)} activity steps, notes and lab ZIP.`);
