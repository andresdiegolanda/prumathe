/* Deterministic teaching models. No Git commands or network calls run in the browser. */
window.GitHubVisuals = (() => {
  const themes = ['light', 'dark', 'reading', 'projector'];
  const palettes = {
    light: { ink:'#20342c', muted:'#61746a', green:'#21664e', orange:'#b75c25', red:'#a73535', white:'#fffef8', panel:'#eeeee4', line:'#ccd6cb', mint:'#dcebdc', amber:'#f3dfbd' },
    dark: { ink:'#e5ede6', muted:'#9ab3a2', green:'#86c99c', orange:'#efb878', red:'#f28e8e', white:'#17281f', panel:'#20382b', line:'#3e5948', mint:'#284d38', amber:'#594528' },
    reading: { ink:'#2d302b', muted:'#66695e', green:'#345e42', orange:'#a25c2a', red:'#a73535', white:'#fffdf4', panel:'#f1eddf', line:'#d6d0bc', mint:'#e2ead7', amber:'#f4e4c5' },
    projector: { ink:'#10271b', muted:'#3a5142', green:'#145a32', orange:'#914414', red:'#982b2b', white:'#ffffff', panel:'#f1f5ef', line:'#9fac9d', mint:'#d4eacf', amber:'#f8dca5' },
  };
  const palette = (theme) => palettes[theme] || palettes.light;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(kind, scene = 0, state = {}, lang = 'es', theme = 'light') {
    const C = palette(theme), t = (en, es) => lang === 'es' ? es : en;
    const details = {}, controls = []; let s = '', note = '';
    const tx = (x,y,text,size=16,color=C.ink,anchor='middle') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}">${esc(text)}</text>`;
    const range = (key,label,min,max,value) => { const n = Math.max(min,Math.min(max,Number(state[key] ?? value))); controls.push({kind:'range',key,label,min,max,value:n}); return n; };
    const node = (id,x,y,w,title,sub,info,color=C.green) => {
      details[id] = info;
      return `<g class="selectable" tabindex="0" role="button" data-node="${id}" aria-label="${esc(title)}"><rect x="${x}" y="${y}" width="${w}" height="82" rx="12" fill="${C.white}" stroke="${color}" stroke-width="2"/>${tx(x+w/2,y+32,title,17,color)}${tx(x+w/2,y+59,sub,12,C.muted)}</g>`;
    };
    const arrow = (x,y,x2,y2,color=C.green,dash=false) => `<path d="M${x},${y} L${x2},${y2}" fill="none" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="6 5"':''} marker-end="url(#tip-${color.slice(1)})"/>`;
    const commit = (name,x,y,parent=null,color=C.green,sub='') => {
      let out = parent ? arrow(x-26,y,parent[0]+26,parent[1],color) : '';
      details[name] = t('Snapshot '+name+'. Arrows point from a child to its parent. '+sub, 'Instantánea '+name+'. Las flechas van del hijo a su padre. '+sub);
      return out + `<g class="selectable" tabindex="0" role="button" data-node="${name}" aria-label="${esc('Commit '+name)}"><circle cx="${x}" cy="${y}" r="25" fill="${C.white}" stroke="${color}" stroke-width="2.5"/>${tx(x,y+6,name,17,color)}</g>`;
    };
    const tag = (x,y,text,color=C.green) => `<rect x="${x-73}" y="${y-18}" width="146" height="29" rx="14" fill="${C.mint}"/>${tx(x,y+2,text,12,color)}`;
    const caption = text => tx(380,89,text,15,C.muted);
    const phase = label => range('phase',label,0,2,scene);
    const lesson = window.GITHUB_COURSE.lessons.find(l=>l.visual===kind);
    s += tx(30,34,t('FARO / A SHARED GUIDE','FARO / UNA GUÍA COMPARTIDA'),12,C.green,'start');
    s += tx(30,62,lesson?.title[lang] || kind,22,C.ink,'start');
    switch(kind) {
      case 'before-you-start': {
        const p=phase(t('Evidence','Evidencia'));
        const names=[t('Browser','Navegador'),'Git local','GitHub'];
        const subs=[t('Illustration','Ilustración'),t('Executed experiment','Experimento ejecutado'),t('Online observation','Observación en línea')];
        for(let i=0;i<3;i++) s+=node('evidence'+i,35+i*242,145,206,names[i],subs[i],t('Different evidence supports different claims.','Distintas evidencias sostienen distintas afirmaciones.'),p===i?C.orange:C.line);
        s+=tx(380,295,[t('A model helps you predict.','Un modelo te ayuda a predecir.'),t('Git checks actual repository state.','Git comprueba estado real del repositorio.'),t('Inspect actual reviews and permissions.','Inspeccioná revisiones y permisos reales.')][p],19);
        note=t('Predict → observe → explain → name the limit','Predecí → observá → explicá → nombrá el límite'); break;
      }
      case 'git-and-github': {
        const p=phase(t('0 edit · 1 record · 2 publish','0 editar · 1 registrar · 2 publicar'));
        s+=node('local',65,150,250,t('Ana’s computer','Computadora de Ana'),p===0?t('Edited: 10:00','Editado: 10:00'):t('Commit B: 10:00','Commit B: 10:00'),t('Saving and committing are local actions.','Guardar y hacer commit son acciones locales.'));
        s+=node('host',445,150,250,'GitHub',p===2?'main → B':'main → A',t('Publishing sends history to another repository.','Publicar envía historia a otro repositorio.'));
        s+=arrow(318,191,440,191,p===2?C.green:C.line,p!==2);
        s+=tx(380,270,p===2?t('Shared history; Bruno still needs to obtain it.','Historia compartida; Bruno aún debe obtenerla.'):t('GitHub still has the previous recorded version.','GitHub todavía tiene la versión registrada anterior.'),16);
        note=t('Save ≠ record ≠ share','Guardar ≠ registrar ≠ compartir'); break;
      }
      case 'commits': {
        const p=phase(t('Inspect snapshot','Inspeccioná la instantánea'));
        ['A','B','C'].forEach((n,i)=>{s+=commit(n,150+i*230,160,i?[150+(i-1)*230,160]:null,p===i?C.orange:C.green);});
        s+=node('snapshot',180,235,400,t('Snapshot ','Instantánea ')+['A','B','C'][p],['guide.txt = 09:00','guide.txt = 10:00','guide.txt = 10:00 + contact.txt'][p],t('A diff compares two snapshots; it is not the whole snapshot.','Un diff compara dos instantáneas; no es la instantánea completa.'),C.orange);
        note=t('Ancestry points backward; reading order is not a timestamp sort.','La ascendencia apunta hacia atrás; no es un orden por fecha.'); break;
      }
      case 'staging': {
        const prepared=range('prepared',t('Prepared hour','Hora preparada'),9,11,9+scene);
        s+=node('head',25,155,205,'HEAD','09:00',t('The current recorded snapshot.','La instantánea registrada actual.'));
        s+=node('index',275,155,205,'Index',String(prepared).padStart(2,'0')+':00',t('This content enters the next normal commit.','Este contenido entra al próximo commit normal.'),C.orange);
        s+=node('work',525,155,205,'Working tree','11:00',t('Your current editable file can differ from the index.','Tu archivo editable puede diferir del index.'));
        s+=arrow(270,194,235,194,C.orange)+arrow(520,194,485,194);
        s+=tx(380,295,prepared===9?t('No staged change','Sin cambios preparados'):t('Next commit: ','Próximo commit: ')+String(prepared).padStart(2,'0')+':00',24,C.orange);
        note=prepared===9?t('An ordinary commit has nothing new to record.','Un commit normal no tiene nada nuevo para registrar.'):t('Staged diff: HEAD ↔ index. Ordinary diff: index ↔ files.','Diff preparado: HEAD ↔ index. Diff común: index ↔ archivos.'); break;
      }
      case 'branches': {
        const p=phase(t('Commits on hours','Commits en hours'));
        s+=commit('A',160,220); for(let i=1;i<=p;i++)s+=commit(['','B','C'][i],160+i*200,220,[160+(i-1)*200,220]);
        s+=tag(160,165,'main');s+=tag(160+p*200,290,'HEAD → hours',C.orange);
        note=t('Only the current branch advances when you record a commit.','Solo la rama actual avanza cuando registrás un commit.'); break;
      }
      case 'merging': {
        const p=phase(t('0 aligned · 1 diverged · 2 merged','0 alineadas · 1 divergentes · 2 integradas'));
        s+=commit('A',110,230)+commit('B',300,150,[110,230]);
        if(p===0){s+=tag(110,295,'main')+tag(300,105,'hours');note=t('main can fast-forward to B.','main puede avanzar por fast-forward hasta B.');}
        else {s+=commit('C',300,300,[110,230]);s+=tag(300,105,'hours');
          if(p===2){s+=commit('M',600,225,[300,150])+arrow(576,239,326,300)+tag(600,285,'main');}
          else s+=tag(300,355,'main');
          note=p===2?t('M records the result and two parents.','M registra el resultado y dos padres.'):t('Neither tip contains the other; the histories diverged.','Ninguna punta contiene a la otra; las historias divergieron.');}
        break;
      }
      case 'conflicts': {
        const p=phase(t('Resolution: 0 ours · 1 theirs · 2 agreement','Resolución: 0 actual · 1 entrante · 2 acuerdo'));
        s+=node('base',275,103,210,t('Common base','Base común'),'09:00',t('Both sides started from this content.','Ambos lados partieron de este contenido.'));
        s+=node('ours',40,215,210,t('Current side','Lado actual'),'10:00',t('The current side is relative to the operation.','El lado actual depende de la operación.'));
        s+=node('theirs',510,215,210,t('Incoming side','Lado entrante'),'11:00',t('A different edit from the same base.','Otra edición desde la misma base.'));
        s+=arrow(310,187,180,210)+arrow(450,187,580,210);
        s+=tx(380,338,t('Chosen result: ','Resultado elegido: ')+['10:00','11:00','10:30'][p],23,C.orange);
        note=t('The decision needs domain knowledge; Git cannot pick the schedule.','La decisión necesita conocer el problema; Git no elige el horario.'); break;
      }
      case 'remotes': case 'sync': {
        const p=phase(kind==='remotes'?t('Remote progress','Avance remoto'):t('0 before · 1 fetched · 2 integrated','0 antes · 1 obtenido · 2 integrado'));
        const remote=kind==='remotes'?(p? 'B':'A'):'B';
        const seen=kind==='remotes'?(p===2?'B':'A'):(p?'B':'A');
        const local=kind==='sync'&&p===2?'B':'A';
        s+=node('server',275,112,210,t('Remote main','main remoto'),remote,t('The actual reference in the other repository.','La referencia real del otro repositorio.'));
        s+=node('seen',50,250,260,'origin/main',seen,t('A local observation that can be stale.','Una observación local que puede estar desactualizada.'),C.orange);
        s+=node('local-main',450,250,260,t('Local main','main local'),local,t('Your current branch does not automatically follow the server.','Tu rama actual no sigue automáticamente al servidor.'));
        s+=arrow(320,198,210,245,C.orange)+arrow(315,290,445,290);
        s+=tx(220,218,'fetch',12,C.orange)+tx(380,275,t('integrate','integrar'),12,C.green);
        note=t('Three references, three states. Files follow the checked-out history.','Tres referencias, tres estados. Los archivos siguen la historia seleccionada.');break;
      }
      case 'forks': {
        const p=phase(t('0 clone · 1 publish · 2 propose','0 clonar · 1 publicar · 2 proponer'));
        s+=node('original',40,125,260,t('Original / maintainer','Original / responsable'),'main → A',t('Publishing in a fork does not update this repository.','Publicar en un fork no actualiza este repositorio.'));
        s+=node('fork',460,125,260,t('Your fork','Tu fork'),p?'hours → B':'main → A',t('A separate hosted repository in a GitHub fork network.','Otro repositorio alojado en una red de forks de GitHub.'));
        s+=node('clone',250,270,260,t('Your clone','Tu clon'),'hours → B',t('origin usually names your fork; upstream usually names the original.','origin suele nombrar tu fork; upstream suele nombrar el original.'));
        s+=arrow(500,270,580,210,C.green,p===0)+tx(580,245,'push',12,C.green);
        if(p===2)s+=arrow(455,165,306,165,C.orange)+tx(380,145,'pull request',12,C.orange);
        note=t('A proposal crosses the boundary; the maintainer decides integration.','La propuesta cruza el límite; quien mantiene decide la integración.');break;
      }
      case 'issues': {
        const p=phase(t('Problem clarity','Claridad del problema'));
        const title=[t('Improve the guide','Mejorar la guía'),t('Hours disagree','Los horarios no coinciden'),t('Observable criteria','Criterios observables')][p];
        s+=node('issue',120,130,520,title,[t('Which outcome?','¿Qué resultado?'),'09:00 → 10:00',t('Guide + workshop consistent','Guía y taller coherentes')][p],t('The issue records a need; it does not edit files.','El issue registra una necesidad; no edita archivos.'),p===2?C.green:C.orange);
        s+=node('files',245,270,270,'README',t('Still unchanged','Todavía sin cambios'),t('A proposal is needed to change recorded content.','Hace falta una propuesta para cambiar contenido registrado.'));
        note=t('Need → acceptance criteria → evidence','Necesidad → criterios de aceptación → evidencia');break;
      }
      case 'pull-requests': {
        const p=phase(t('0 draft · 1 open · 2 merged','0 borrador · 1 abierto · 2 integrado'));
        s+=node('head',45,145,250,'head: winter-hours','10:00',t('Source of the proposed work.','Origen del trabajo propuesto.'));
        s+=node('base-pr',465,145,250,'base: main',p===2?'10:00':'09:00',t('The destination changes upon integration, not opening.','El destino cambia al integrar, no al abrir.'));
        s+=arrow(305,187,455,187,p===2?C.green:C.orange,p<2);
        s+=tag(380,275,[t('Draft','Borrador'),t('Open','Abierto'),t('Merged','Integrado')][p]);
        note=p<2?t('The proposed difference exists; main has not adopted it.','Existe la diferencia propuesta; main todavía no la adoptó.'):t('Integration changes the destination history.','La integración cambia la historia de destino.');break;
      }
      case 'reviews': case 'rules': {
        const approved=range('approved',t('Human approval (0/1)','Aprobación humana (0/1)'),0,1,scene===2?1:0);
        const checks=range('checks',t('Passing check (0/1)','Control aprobado (0/1)'),0,1,scene?1:0);
        const required=kind==='rules'?range('required',t('Require review (0/1)','Exigir revisión (0/1)'),0,1,1):1;
        s+=node('review',40,130,290,t('Human review','Revisión humana'),approved?t('Approved','Aprobado'):t('Missing','Falta'),t('A review assesses intent and context.','Una revisión evalúa intención y contexto.'),approved?C.green:C.orange);
        s+=node('check',430,130,290,t('Automated check','Control automático'),checks?'PASS':'FAIL',t('The assertion checks whether 10:00 occurs in the guide.','La afirmación verifica si aparece 10:00 en la guía.'),checks?C.green:C.red);
        const allowed=checks&&(!required||approved);
        s+=node('gate',200,275,360,kind==='rules'?t('Example policy','Política del ejemplo'):t('Evidence collected','Evidencia reunida'),allowed?t('Required conditions met','Condiciones requeridas cumplidas'):t('Required evidence missing','Falta evidencia requerida'),t('Illustrative policy only. Actual target patterns, permissions and bypass actors matter.','Solo política ilustrativa. Importan patrones reales, permisos y la lista de bypass.'),allowed?C.green:C.orange);
        s+=arrow(185,215,290,270)+arrow(575,215,470,270);
        note=t('Assumes write permission, matching active rule and no bypass.','Supone permiso de escritura, regla activa aplicable y sin excepciones.');break;
      }
      case 'integration-strategies': {
        const p=phase(t('0 merge · 1 squash · 2 rebase','0 merge · 1 squash · 2 rebase'));
        s+=caption(t('Same final file: 10:00 + contact.txt','Mismo archivo final: 10:00 + contact.txt'));
        s+=commit('A',100,250)+commit('C',260,250,[100,250]);
        if(p===0){s+=commit('B',260,140,[100,250])+commit('M',560,250,[260,250])+arrow(540,232,284,153)+tag(560,310,'main');}
        else if(p===1){s+=commit('S',560,250,[260,250])+tag(560,310,'main');s+=tx(380,150,t('B’s combined effect, new identity S','Efecto combinado de B, identidad nueva S'),16,C.orange);}
        else {s+=commit('B′',560,250,[260,250])+tag(560,310,'main');s+=tx(380,150,t('B replayed onto C becomes B′','B reaplicado sobre C pasa a ser B′'),16,C.orange);}
        note=t('Compare ancestry as well as content. Letters are illustrative IDs.','Compará ascendencia además de contenido. Las letras son IDs ilustrativos.');break;
      }
      case 'undo': {
        const p=phase(t('0 mistake · 1 revert · 2 soft reset','0 error · 1 revert · 2 soft reset'));
        s+=commit('A',130,195)+commit('B',380,195,[130,195]);
        if(p===1){s+=commit('R',630,195,[380,195])+tag(630,140,'main');}
        else s+=tag(p===2?130:380,140,'main');
        s+=node('undo-content',175,275,410,t('Result','Resultado'),p===1?t('New R restores 09:00','R nuevo restaura 09:00'):p===2?t('main at A; 10:00 still staged','main en A; 10:00 aún preparado'):'B: 10:00',t('Revert adds a correction; soft reset moves the reference and keeps the index.','Revert agrega una corrección; soft reset mueve la referencia y conserva el index.'),C.orange);
        note=t('These operations run only in isolated practice repositories in the kit.','En el kit, estas operaciones usan solo repositorios de práctica aislados.');break;
      }
      case 'actions': {
        const pass=range('pass',t('Assertion passes (0/1)','La afirmación pasa (0/1)'),0,1,scene===2?1:0);
        s+=node('event',25,140,200,t('Event','Evento'),'pull_request',t('The configured event starts a workflow run.','El evento configurado inicia una ejecución.'));
        s+=node('job',280,140,200,'Job: hours','runner',t('A machine executes ordered steps in this job.','Una máquina ejecuta pasos en orden dentro del job.'));
        s+=node('step',535,140,200,'Step: test',pass?'PASS':'FAIL',t('This test only checks that README contains 10:00.','Esta prueba solo verifica que README contenga 10:00.'),pass?C.green:C.red);
        s+=arrow(230,180,275,180)+arrow(485,180,530,180);
        s+=tx(380,300,pass?t('The assertion passed for this revision.','La afirmación pasó para esta revisión.'):t('Read the log and inspect the assertion.','Leé el log e inspeccioná la afirmación.'),19,pass?C.green:C.red);
        note=t('No deployment step is defined in this example.','En este ejemplo no se define un paso de despliegue.');break;
      }
      case 'releases': {
        const p=phase(t('Commits after v1.0','Commits después de v1.0'));
        s+=commit('A',130,200)+tag(130,140,'v1.0',C.orange);
        for(let i=1;i<=p;i++)s+=commit(['','B','C'][i],130+i*250,200,[130+(i-1)*250,200]);
        s+=tag(130+p*250,260,'main');
        s+=tx(380,330,t('Release: notes + assets at a tag','Release: notas + archivos en un tag'),19);
        note=t('Tagging does not prove that any environment is running that version.','Crear un tag no prueba que un entorno ejecute esa versión.');break;
      }
      case 'secrets': {
        const p=phase(t('0 recorded · 1 ignored · 2 deleted','0 registrado · 1 ignorado · 2 borrado'));
        s+=node('past',40,145,280,t('Earlier snapshot','Instantánea anterior'),'FAKE_NOT_A_SECRET',t('Past snapshots still contain their original recorded content.','Las instantáneas anteriores conservan su contenido original.'),C.orange);
        s+=node('present',440,145,280,t('Current snapshot','Instantánea actual'),p===2?t('File removed','Archivo quitado'):'FAKE_NOT_A_SECRET',t('Ignoring a tracked file does not remove it; deletion changes the new snapshot only.','Ignorar un archivo seguido no lo quita; borrar cambia solo la instantánea nueva.'));
        s+=tx(380,295,p===1?'.gitignore ≠ '+t('erase history','borrar historia'):t('Revocation stops authority; cleanup removes traces.','Revocar detiene autoridad; limpiar quita rastros.'),18);
        note=t('Only a fake marker is used. Never practice with a real credential.','Solo se usa un marcador ficticio. Nunca practiques con una credencial real.');break;
      }
      case 'capstone': {
        const p=phase(t('Missing link: 0 need · 1 evidence · 2 none','Falta: 0 necesidad · 1 evidencia · 2 nada'));
        const names=[t('Need','Necesidad'),t('Proposal','Propuesta'),t('Evidence','Evidencia'),t('Delivery','Entrega')];
        for(let i=0;i<4;i++){const missing=(p===0&&i===0)||(p===1&&i===2);s+=node('chain'+i,20+i*187,170,160,names[i],missing?'?':'✓',t('Keep this link inspectable by the next maintainer.','Dejá este enlace inspeccionable para quien mantenga el proyecto.'),missing?C.red:C.green);if(i<3)s+=arrow(183+i*187,211,202+i*187,211);}
        s+=tx(380,315,t('Workshop 09:30 · library opens 10:00','Taller 09:30 · biblioteca abre 10:00'),19,C.orange);
        note=t('A clean merge can still combine contradictory decisions.','Una integración sin conflictos puede combinar decisiones contradictorias.');break;
      }
      default: throw new Error('Unknown model '+kind);
    }
    s+=tx(380,405,note,13,C.muted);
    const defs=[C.green,C.orange,C.red,C.line].map(c=>`<marker id="tip-${c.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${c}"/></marker>`).join('');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 430" role="group" aria-label="${esc(lesson?.title[lang]||kind)}" font-family="Segoe UI, system-ui, sans-serif"><title>${esc(lesson?.title[lang]||kind)}</title><defs>${defs}</defs><rect width="760" height="430" fill="${C.panel}"/>${s}</svg>`;
    return {svg,details,controls};
  }
  return {render,palette,themes};
})();
