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
// The page shell: content, language and skin are resolved by the scripts in the browser. The
// shell itself is in English, with a Spanish line for readers without JavaScript.
function html(lesson=null, overview=false){
  const p=lesson?'../':'', title=(lesson?lesson.title.en:overview?about.title.en:'Microsoft Entra from scratch');
  const description=lesson?`${lesson.intro.en} Visual models, experiments and a real Entra tenant workbook, in English and Rioplatense Spanish.`:overview?`${about.lead.en} English and Rioplatense Spanish.`:'Understand authentication and authorization through Angular, Spring and PostgreSQL. Visual models, experiments and a real Entra tenant workbook, in English and Rioplatense Spanish.';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(title)} | Prumathe</title><meta name="description" content="${esc(description)}"><link rel="icon" href="${p}assets/favicon.svg"><script src="${p}assets/theme.js"></script><link rel="stylesheet" href="${p}assets/course.css"></head><body${lesson?` data-lesson="${lesson.id}"`:overview?' data-page="about"':''}><div id="app"></div><noscript><main><h1>${esc(title)}</h1><p>This course needs JavaScript. Every script is included locally.</p><a href="${p}downloads/course-notes-en.txt">Read the complete English notes</a><p lang="es-AR">Este curso necesita JavaScript. Todos los scripts están incluidos localmente.</p><a lang="es-AR" href="${p}downloads/course-notes-es.txt">Leé los apuntes completos en español</a></main></noscript><script src="${p}assets/curriculum.js"></script><script src="${p}assets/reference.js"></script><script src="${p}assets/visuals.js"></script>${overview?`<script src="${p}assets/about.js"></script>`:''}<script src="${p}assets/app.js"></script></body></html>
`;
}
for(const d of ['lessons','downloads','dist'])fs.mkdirSync(path.join(root,d),{recursive:true});
fs.writeFileSync(path.join(root,'index.html'),html());
fs.writeFileSync(path.join(root,'what-entra-is.html'),html(null,true));
for(const l of course.lessons)fs.writeFileSync(path.join(root,'lessons',l.slug+'.html'),html(l));
// The big picture: one page drawn by assets/big-picture.js, with the whole picture as text, in
// both languages, for readers without JavaScript. The data and the engine are checked by check.mjs.
const bp={window:{}};
for(const name of ['curriculum','big-picture-data','big-picture'])vm.runInNewContext(fs.readFileSync(path.join(root,'assets',name+'.js'),'utf8'),bp);
const picture=bp.window.BIG_PICTURE;
const pictureText=lang=>bp.window.BigPicture.outline(picture,course,lang,{query:`?lang=${lang}`});
fs.writeFileSync(path.join(root,'big-picture.html'),`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(picture.title.en)} · Microsoft Entra from scratch | Prumathe</title><meta name="description" content="${esc(picture.subtitle.en)}: every piece of the course on one scene, and journeys that follow a request stop by stop. English and Rioplatense Spanish."><link rel="icon" href="assets/favicon.svg"><script src="assets/theme.js"></script><link rel="stylesheet" href="assets/course.css"><link rel="stylesheet" href="assets/big-picture.css"></head><body class="bp-page"><div id="bp"></div><noscript><main class="bp-noscript">${pictureText('en')}<hr><div lang="es-AR">${pictureText('es')}</div></main></noscript><script src="assets/curriculum.js"></script><script src="assets/big-picture-data.js"></script><script src="assets/big-picture.js"></script></body></html>
`);
// Plain-text notes, one file per language, with the same content and structure.
const W={
  en:{head:'MICROSOFT ENTRA FROM SCRATCH',version:'Version',reviewed:'Sources reviewed',route:'Evidence route',rule:'Rule',model:'MODEL EXPERIMENT',activity:'ACTIVITY',reference:'Reference',observe:'Observe',checkpoint:'CHECKPOINT',answers:'ANSWERS AND REASONS',sources:'SOURCES',glossary:'GLOSSARY',picture:'BIG PICTURE'},
  es:{head:'MICROSOFT ENTRA DESDE CERO',version:'Versión',reviewed:'Fuentes revisadas el',route:'Recorrido de la evidencia',rule:'Regla',model:'EXPERIMENTO CON EL MODELO',activity:'ACTIVIDAD',reference:'Referencia',observe:'Observá',checkpoint:'CONTROL',answers:'RESPUESTAS Y MOTIVOS',sources:'FUENTES',glossary:'GLOSARIO',picture:'PANORAMA'},
};
for(const lang of ['en','es']){
  const w=W[lang],T=x=>(typeof x==='object'?x[lang]:x);
  let notes=`${w.head}\n${w.version} ${course.version} | ${w.reviewed} ${course.date}\nAngular ${course.angular} | MSAL Browser ${course.msal} | Spring Boot ${course.spring} | PostgreSQL ${course.postgres}\n\n${about.title[lang]}\n${about.lead[lang]}\n\n`;
  for(const section of [about.what,about.origin])notes+=section.title[lang]+'\n'+section.text.map(p=>p[lang]).join('\n\n')+'\n\n';
  for(const p of about.origin.timeline)notes+=p.year+' '+p.label[lang]+': '+p.text[lang]+'\n';
  for(const section of [about.fits,about.misfits])notes+='\n'+section.title[lang]+'\n'+section.intro[lang]+'\n'+section.items.map(x=>x.title[lang]+': '+(x.text?.[lang]||x.why[lang]+' '+x.instead[lang])).join('\n')+'\n';
  notes+='\n'+about.decide.questions.map((q,i)=>`${i+1}. ${q[lang]}`).join('\n')+'\n\n';
  for(const l of course.lessons){
    notes+=`\n${String(l.id).padStart(2,'0')}. ${l.title[lang]}\n${'='.repeat(65)}\n${l.intro[lang]}\n${w.route}: ${l.mode}\n\n`;
    for(const f of l.frames)notes+=f.title[lang]+'\n'+f.text[lang]+'\n'+w.rule+': '+f.rule[lang]+'\n\n';
    notes+=w.model+': '+l.experiment[lang]+'\n\n'+w.activity+'\n';
    for(const [i,s] of l.lab.entries())notes+=`${i+1}. ${s.title[lang]}\n${s.text[lang]}\n${s.command?w.reference+': '+s.command+'\n':''}${w.observe}: ${s.expected[lang]}\n\n`;
    notes+=w.checkpoint+'\n';
    for(const [i,q]of l.quiz.entries())notes+=`${i+1}. ${q.question[lang]}\n${q.options.map((o,j)=>String.fromCharCode(65+j)+'. '+o[lang]).join('\n')}\n\n`;
    notes+=w.answers+'\n'+l.quiz.map((q,i)=>`${i+1}. ${String.fromCharCode(65+q.correct)}: ${q.explanation[lang]}`).join('\n')+'\n\n';
    notes+=w.sources+'\n'+[refs.sources[l.source],...(refs.more[l.source]||[])].map(([a,b])=>a+'\n'+b).join('\n')+'\n';
  }
  notes+='\n'+w.glossary+'\n'+refs.glossary.map(g=>lang==='en'?g[0]+': '+g[2]:g[1]+': '+g[3]).join('\n')+'\n';
  notes+='\n'+w.picture+'\n'+picture.journeys.map(j=>`${j.id}. ${T(j.title)}\n`+j.stops.map((s,i)=>`  ${i+1}. ${T(picture.nodes[s.node].label)}: ${T(s.text)}`).join('\n')+'\n  '+T(j.outcome)).join('\n')+'\n';
  fs.writeFileSync(path.join(root,`downloads/course-notes-${lang}.txt`),notes);
}
createZip(root);
for(const item of ['index.html','what-entra-is.html','big-picture.html','assets','lessons','downloads','404.html','_headers'])fs.cpSync(path.join(root,item),path.join(root,'dist',item),{recursive:true});
console.log(`Built ${course.lessons.length} lessons in English and Spanish, the big picture (${picture.journeys.length} journeys, ${picture.journeys.reduce((n,j)=>n+j.stops.length,0)} stops), ${course.lessons.length*3} scenes, ${course.lessons.length*3} questions, ${course.lessons.reduce((n,l)=>n+l.lab.length,0)} activity steps, notes and lab ZIP.`);
