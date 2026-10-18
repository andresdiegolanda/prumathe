/* Local illustrative models. No runtime, cluster or network access. */
window.DKVisuals = (() => {
  const PALETTES = {
    light: {
      ink: '#193c3a',
      green: '#247b61',
      mint: '#d4f0df',
      orange: '#dc7841',
      amber: '#f7dba7',
      purple: '#7364b0',
      blue: '#4d82ae',
      red: '#b9524d',
      line: '#b8cbc3',
      muted: '#667b73',
      white: '#fffef8',
      panel: '#edf2eb',
      panelAlt: '#e9ece5',
      glass: '#e5efe6',
      ghost: '#ecddd8',
      fail: '#f3d4cd',
    },
    dark: {
      ink: '#e4ede7',
      green: '#5ec79c',
      mint: '#1f4a3b',
      orange: '#f09a66',
      amber: '#6e5a26',
      purple: '#a79ae0',
      blue: '#7fb0da',
      red: '#e07f78',
      line: '#3b5a50',
      muted: '#9bb0a6',
      white: '#172b27',
      panel: '#1b332e',
      panelAlt: '#203b35',
      glass: '#182f2a',
      ghost: '#45302c',
      fail: '#552c29',
    },
    reading: {
      ink: '#1a2825',
      green: '#247b61',
      mint: '#d4f0df',
      orange: '#d06f38',
      amber: '#f7dba7',
      purple: '#6a5ba8',
      blue: '#45779f',
      red: '#b04a45',
      line: '#aebfb6',
      muted: '#4f655b',
      white: '#fffdf7',
      panel: '#edf1ea',
      panelAlt: '#e8ebe3',
      glass: '#e6eee6',
      ghost: '#ecddd8',
      fail: '#f3d4cd',
    },
    projector: {
      ink: '#0a1d1a',
      green: '#176a4d',
      mint: '#cfe8d6',
      orange: '#c5601f',
      amber: '#f3d08a',
      purple: '#5a4a9c',
      blue: '#356a95',
      red: '#a8403b',
      line: '#8fa89d',
      muted: '#2d443d',
      white: '#ffffff',
      panel: '#e6ece5',
      panelAlt: '#e1e6de',
      glass: '#e3ece3',
      ghost: '#efd6cf',
      fail: '#f2c9bf',
    },
  };
  const palette = theme => PALETTES[theme] || PALETTES.light;
  function render(type,step=0,state={},lang='en',theme='light') {
    const P=palette(theme), t=(en,es)=>lang==='es'?es:en;
    const course=window.DK_COURSE;
    const lesson=course.lessons.find(l=>l.visual===type);
    if(!lesson)throw Error('Unknown model '+type);
    const details={}, controls=[], parts=[];
    const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const text=(x,y,s,size=15,color=P.ink,anchor='middle')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${e(s)}</text>`;
    const rect=(x,y,w,h,fill=P.panel,stroke=P.line)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
    const box=(x,y,w,h,label,sub='',key='',fill=P.white,info='')=>{
      if(key)details[key]=info||lesson.frames[step].text[lang];
      return `<g ${key?`class="selectable" tabindex="0" role="button" data-node="${key}" aria-label="${e(label)}"`:''}>${rect(x,y,w,h,fill,key?P.green:P.line)}${text(x+w/2,y+h/2+(sub?-4:5),label,16)}${sub?text(x+w/2,y+h/2+19,sub,12,P.muted):''}</g>`;
    };
    const line=(x,y,x2,y2,color=P.green,dash=false)=>`<path d="M${x} ${y} L${x2} ${y2}" stroke="${color}" stroke-width="2" fill="none" ${dash?'stroke-dasharray="6 5"':''}/><circle cx="${x2}" cy="${y2}" r="3" fill="${color}"/>`;
    const note=s=>parts.push(text(380,421,s,14,P.muted));
    const title=(a,b)=>parts.push(text(38,44,t(a,b),12,P.muted,'start'));
    const range=(label,min,max,value)=>{const v=Math.max(min,Math.min(max,Number(state.value??value)));controls.push({kind:'range',key:'value',label,min,max,value:v});return v;};
    const toggle=label=>{controls.push({kind:'button',action:'toggle',label});return !!state.toggle;};
    const pod=(x,y,n,label='Pod',fill=P.mint)=>box(x,y,115,58,label+' '+n,'signal:1.0.0','pod-'+n,fill);
    if(type==='method') {
      const n=range(t('Stage','Etapa'),0,2,step);
      title('THE LEARNING CYCLE','EL CIRCUITO DE APRENDIZAJE');
      const labels=[t('See','Mirá'),t('Run','Ejecutá'),t('Explain','Explicá')];
      labels.forEach((s,i)=>{if(i<2)parts.push(line(230+i*230,205,295+i*230,205));parts.push(box(45+i*235,150,200,110,s,i===1?'Docker / kubectl':t('browser','navegador'),'stage'+i,i===n?P.amber:P.white,lesson.frames[i].text[lang]));});
      parts.push(box(165,305,430,60,t('Prediction → observation → limit','Predicción → observación → límite'),'','cycle',P.mint));
      note(t('A diagram does not run a container.','Un diagrama no ejecuta un contenedor.'));
    } else if(type==='process'||type==='lifecycle') {
      const n=type==='lifecycle'?range(t('0 run · 1 stop · 2 remove','0 run · 1 stop · 2 remove'),0,2,step):(toggle(t('Stop / start A','Detené / arrancá A'))?1:0);
      title('PROCESS ISOLATION','AISLAMIENTO DE PROCESOS');
      parts.push(rect(40,85,680,290),text(65,115,t('LINUX HOST','HOST LINUX'),12,P.muted,'start'));
      parts.push(box(70,320,620,38,t('Shared Linux kernel','Kernel Linux compartido'),'','kernel',P.panelAlt,lesson.frames[0].text[lang]));
      for(let i=0;i<2;i++){
        const x=80+i*330, removed=i===0&&n===2, stopped=i===0&&n===1;
        parts.push(rect(x,145,270,145,removed?P.panel:stopped?P.ghost:P.mint));
        parts.push(box(x+20,170,230,60,'Container '+(i?'B':'A'),removed?t('removed','borrado'):stopped?'exited':'PID 1 · running','container'+i,removed?P.panel:stopped?P.fail:P.white));
        parts.push(text(x+135,270,removed?t('layer removed','capa borrada'):t('private writable layer','capa escribible propia'),13));
      }
      note(type==='lifecycle'?t('A stopped container still owns its layer.','Un contenedor detenido conserva su capa.'):t('Separate views; one shared kernel.','Vistas separadas; un kernel compartido.'));
    } else if(type==='layers'||type==='build') {
      const change=range(type==='build'?t('First changed step','Primer paso cambiado'):t('Runtime writes','Escrituras de ejecución'),0,3,step);
      title(type==='build'?'BUILD INPUTS AND CACHE':'READ-ONLY IMAGE, WRITABLE CONTAINER',type==='build'?'INSUMOS Y CACHÉ':'IMAGEN DE SOLO LECTURA, CONTENEDOR ESCRIBIBLE');
      const labels=type==='build'?['FROM · digest','RUN · user','COPY · source','ENV · version']:['Python / Alpine','Application files','Image metadata',t('Writable layer','Capa escribible')];
      labels.forEach((label,i)=>{parts.push(box(80,305-i*67,365,54,label,'','layer'+i,i===3?P.amber:P.mint));parts.push(text(570,338-i*67,type==='build'?(i<change?'CACHED':t('rebuild','reconstruir')):(i===3?change+' '+t('changes','cambios'):t('unchanged','sin cambios')),14,i<change?P.green:P.orange));});
      note(type==='build'?t('Changed inputs invalidate dependent results.','Los insumos cambiados invalidan resultados dependientes.'):t('A runtime write does not edit the image.','Escribir durante la ejecución no edita la imagen.'));
    } else if(type==='volume'||type==='pvc') {
      const replace=toggle(t('Replace the process','Reemplazá el proceso'));
      title('PROCESS LIFETIME / DATA LIFETIME','VIDA DEL PROCESO / VIDA DE LOS DATOS');
      parts.push(box(65,120,260,105,type==='pvc'?'Pod writer':'Container app',replace?t('new identity B','identidad nueva B'):t('identity A','identidad A'),'writer',replace?P.amber:P.mint));
      parts.push(line(325,172,455,172));
      parts.push(box(455,110,240,125,type==='pvc'?'PVC notebook':'signal-data','/data/marker','storage',P.mint));
      parts.push(box(65,285,260,65,t('Writable layer','Capa escribible'),replace?t('empty replacement','reemplazo vacío'):t('temporary files','archivos temporales'),'ephemeral',P.ghost));
      parts.push(box(455,285,240,65,t('Marker retained','Marca conservada'),type==='pvc'?'local kind storage':'Docker volume','marker',P.white));
      note(t('Retained data is not a backup.','Los datos conservados no son un respaldo.'));
    } else if(['network','ports','compose'].includes(type)) {
      const changed=toggle(type==='ports'?t('Publish / unpublish','Publicá / quitá publicación'):type==='network'?t('Connect / disconnect peer','Conectá / desconectá cliente'):t('Stop / start app','Detené / arrancá app'));
      title('NAMES AND REACHABILITY','NOMBRES Y CONECTIVIDAD');
      parts.push(rect(240,90,475,280,P.panel),text(265,119,'prumathe-dk_default',13,P.muted,'start'));
      parts.push(box(280,155,165,85,'toolbox',type==='network'&&changed?t('disconnected','desconectado'):'DNS: app','peer',type==='network'&&changed?P.fail:P.white));
      parts.push(box(510,155,165,85,'app',type==='compose'&&changed?'exited':':8080','app',type==='compose'&&changed?P.fail:P.mint));
      parts.push(line(445,197,510,197,changed&&type!=='ports'?P.red:P.green,changed&&type!=='ports'));
      parts.push(box(35,170,165,70,t('Host browser','Navegador host'),':18080','host'));
      parts.push(line(117,240,117,325,changed&&type==='ports'?P.red:P.orange),line(117,325,590,325,changed&&type==='ports'?P.red:P.orange,changed&&type==='ports'),line(590,325,590,240));
      parts.push(text(355,310,changed&&type==='ports'?t('not published','sin publicar'):'127.0.0.1:18080 → app:8080',13));
      note(t("localhost refers to the caller's own network namespace.",'localhost se refiere al espacio de red de quien llama.'));
    } else if(type==='config'||type==='secret') {
      const value=range(t('Configured value','Valor configurado'),1,3,step+1), restarted=toggle(t('Restart / compare old process','Reiniciá / compará proceso anterior'));
      title('DELIVERY AND CONSUMPTION','ENTREGA Y CONSUMO');
      parts.push(box(50,120,270,105,type==='secret'?'ConfigMap':t('Runtime configuration','Configuración de ejecución'),'MESSAGE=value-'+value,'settings',P.amber));
      parts.push(line(320,172,440,172));
      parts.push(box(440,120,270,105,t('Process environment','Entorno del proceso'),'MESSAGE=value-'+(restarted?value:1),'process',P.mint));
      parts.push(box(120,290,520,65,type==='secret'?'Secret: access controls ≠ encryption':'/run/secrets/demo_token',t('Practice token only','Solo token de práctica'),'secret',P.white));
      note(t('A changed source does not rewrite a running environment.','Cambiar el origen no reescribe un entorno activo.'));
    } else if(type==='health'||type==='probes') {
      const fail=range(type==='health'?t('0 healthy · 1 failure','0 healthy · 1 falla'):t('0 OK · 1 readiness · 2 liveness','0 OK · 1 readiness · 2 liveness'),0,type==='health'?1:2,Math.min(step,type==='health'?1:2));
      title('SIGNAL → DECISION','SEÑAL → DECISIÓN');
      parts.push(box(70,110,250,100,'app',fail===2?t('restart requested','reinicio solicitado'):'process running','process',fail===2?P.amber:P.mint));
      parts.push(box(440,110,250,100,type==='health'?'Docker HEALTHCHECK':fail===1?'readinessProbe':'livenessProbe',fail?'HTTP 503':'HTTP 200','probe',fail?P.fail:P.mint));
      parts.push(line(320,160,440,160,fail?P.red:P.green));
      const result=type==='health'?(fail?'unhealthy · running':'healthy · running'):fail===1?t('Service excludes endpoint','Service excluye endpoint'):fail===2?t('kubelet restarts container','kubelet reinicia contenedor'):t('Service can route traffic','Service puede enviar tráfico');
      parts.push(box(110,285,540,70,result,'','decision',fail?P.amber:P.mint));
      note(type==='health'?t('Health status alone does not restart Docker containers.','El estado de salud solo no reinicia contenedores Docker.'):t('Startup gates the other probes until it succeeds.','Startup demora las otras sondas hasta tener éxito.'));
    } else if(type==='registry') {
      const move=toggle(t('Move the tag','Mové el tag'));
      title('NAME ≠ CONTENT IDENTITY','NOMBRE ≠ IDENTIDAD DE CONTENIDO');
      parts.push(box(60,170,220,85,'signal:practice',t('mutable tag','tag mutable'),'tag',P.amber));
      parts.push(box(455,100,230,90,t('Artifact A','Artefacto A'),'sha256:aaa…','a',P.mint),box(455,270,230,90,t('Artifact B','Artefacto B'),'sha256:bbb…','b',P.mint));
      parts.push(line(280,212,455,move?315:145));
      note(t('Moving a tag does not rewrite either artifact.','Mover un tag no reescribe ningún artefacto.'));
    } else if(type==='debug') {
      const n=range(t('Failed layer','Capa que falla'),0,3,step);
      title('FOLLOW THE REQUEST','SEGUÍ EL PEDIDO');
      ['DNS','TCP','HTTP',t('Content','Contenido')].forEach((label,i)=>{const x=35+i*185;if(i<3)parts.push(line(x+155,205,x+185,205,i>=n?P.red:P.green,i>=n));parts.push(box(x,150,155,110,label,i===n?t('inspect here','inspeccioná acá'):i<n?'OK':t('not reached','sin alcanzar'),'hop'+i,i===n?P.fail:i<n?P.mint:P.panel));});
      note(t('A later layer cannot repair an earlier failed hop.','Una capa posterior no repara un salto anterior fallido.'));
    } else if(type==='cluster'||type==='pod') {
      const n=range(type==='cluster'?t('Assigned Pods','Pods asignados'):t('Pod generation','Generación del Pod'),1,3,step+1);
      title(type==='cluster'?'CONTROL PLANE AND WORKER':'A SHARED POD BOUNDARY',type==='cluster'?'PLANO DE CONTROL Y WORKER':'UN LÍMITE DE POD COMPARTIDO');
      if(type==='cluster') {
        parts.push(box(40,110,270,90,'API server',t('desired state','estado deseado'),'api',P.amber),box(40,255,270,80,'Controllers + scheduler',t('compare and assign','comparar y asignar'),'control',P.white));
        parts.push(rect(400,90,320,280),text(560,123,'worker · kubelet + runtime',14));
        for(let i=0;i<n;i++)parts.push(pod(435,145+i*70,i+1));
        parts.push(line(310,295,400,295));
      } else {
        parts.push(rect(70,95,620,275,P.mint),text(380,130,'Pod UID: generation-'+n,16));
        parts.push(box(110,170,235,90,'Container A','app:8080','a'),box(415,170,235,90,'Container B',t('optional sidecar','sidecar opcional'),'b'));
        parts.push(box(155,290,450,50,t('Shared network namespace','Espacio de red compartido'),'','network',P.amber));
      }
      note(type==='cluster'?t('kind nodes share the same physical host.','Los nodos kind comparten el mismo host físico.'):t('One Pod is assigned to one node.','Un Pod se asigna a un nodo.'));
    } else if(type==='reconcile'||type==='deployment') {
      const desired=range(t('Desired replicas','Réplicas deseadas'),1,4,step+1),missing=toggle(t('Lose / restore an instance','Perdé / restaurá una instancia'));
      title('DESIRED STATE → OBSERVED STATE','ESTADO DESEADO → ESTADO OBSERVADO');
      parts.push(box(45,110,240,90,'Deployment','replicas: '+desired,'deployment',P.amber),box(45,265,240,75,'ReplicaSet',t('maintain the count','mantener cantidad'),'rs'));
      parts.push(line(165,200,165,265),line(285,303,345,303));
      for(let i=0;i<desired;i++)parts.push(pod(365+(i%2)*170,125+Math.floor(i/2)*110,i+1,i===desired-1&&missing?t('missing','faltante'):'Pod',i===desired-1&&missing?P.ghost:P.mint));
      parts.push(text(535,360,t('Observed','Observadas')+': '+(desired-(missing?1:0))+' / '+desired,18,missing?P.orange:P.green));
      note(missing?t('The controller must create a replacement.','El controlador tiene que crear un reemplazo.'):t('The count converges; local files are not restored.','La cantidad converge; no se restauran archivos locales.'));
    } else if(type==='service') {
      const ready=range(t('Ready endpoints','Endpoints listos'),0,3,3-step);
      title('STABLE FRONT DOOR, CHANGING BACKENDS','ENTRADA ESTABLE, DESTINOS CAMBIANTES');
      parts.push(box(45,175,235,95,'Service signal','port 80 → target 8080','service',P.amber));
      for(let i=0;i<3;i++){parts.push(line(280,222,465,115+i*100,i<ready?P.green:P.red,i>=ready));parts.push(box(465,80+i*100,240,70,'Pod '+(i+1),i<ready?'Ready':'NotReady','backend'+i,i<ready?P.mint:P.ghost));}
      note(ready?t('DNS stays stable while endpoints change.','DNS sigue estable mientras cambian endpoints.'):t('The Service exists, but no ready backend can serve.','El Service existe, pero no hay destinos listos.'));
    } else if(type==='scheduler') {
      const request=range(t('Requested CPU units','Unidades CPU pedidas'),1,6,step+2),fits=request<=4;
      title('DECLARED NEEDS AND AVAILABLE CAPACITY','NECESIDADES DECLARADAS Y CAPACIDAD DISPONIBLE');
      parts.push(box(45,155,230,100,'Pending Pod','request: '+request,'request',fits?P.amber:P.fail),line(275,205,420,205,fits?P.green:P.red,!fits));
      parts.push(rect(420,95,285,270),text(562,133,t('Node capacity: 4','Capacidad del nodo: 4'),16));
      for(let i=0;i<4;i++)parts.push(rect(455+i*53,175,38,105,i<request?P.mint:P.white,P.green));
      parts.push(text(562,325,fits?t('fits','entra'):'Pending',19,fits?P.green:P.red));
      note(t('This model isolates CPU fit; real scheduling has more constraints.','Este modelo aísla CPU; el scheduling real tiene más restricciones.'));
    } else if(type==='rollout') {
      const stage=range(t('Rollout stage','Etapa de rollout'),0,3,step);
      title('ROLLING UPDATE · DESIRED 2 · SURGE 1','ROLLING UPDATE · DESEADAS 2 · SURGE 1');
      const old=[2,2,1,0][stage],fresh=[0,1,2,2][stage];
      parts.push(text(205,115,'ReplicaSet v1.0.0',18),text(555,115,'ReplicaSet v1.1.0',18));
      for(let i=0;i<old;i++)parts.push(box(90,155+i*90,230,65,t('Old Pod ','Pod anterior ')+(i+1),'1.0.0','old'+i,P.panelAlt));
      for(let i=0;i<fresh;i++)parts.push(box(440,155+i*90,230,65,t('New Pod ','Pod nuevo ')+(i+1),'1.1.0','new'+i,P.mint));
      parts.push(text(380,370,t('Total','Total')+': '+(old+fresh),19));
      note(t('Illustrative stages; readiness gates removal of old replicas.','Etapas ilustrativas; readiness condiciona retirar réplicas viejas.'));
    } else if(type==='rbac') {
      const n=range(t('0 list Pods · 1 delete · 2 read Secrets','0 listar Pods · 1 borrar · 2 leer Secrets'),0,2,step);
      title('IDENTITY → BINDING → PERMISSION','IDENTIDAD → VÍNCULO → PERMISO');
      parts.push(box(35,125,200,90,'observer','ServiceAccount','sa'),line(235,170,280,170),box(280,125,200,90,'RoleBinding','dk-lab','binding'),line(480,170,525,170),box(525,125,200,90,'pod-reader','get · list · watch','role',P.mint));
      parts.push(box(170,285,420,75,['list pods → yes','delete pods → no','get secrets → no'][n],'','decision',n?P.fail:P.mint));
      note(t('Authorization is not network reachability.','Autorización no es conectividad de red.'));
    } else if(type==='capstone') {
      const n=range(t('0 baseline · 1 failure · 2 recovery','0 base · 1 falla · 2 recuperación'),0,2,step);
      title('DEPLOY → OBSERVE → REPLACE → VERIFY','DESPLEGAR → OBSERVAR → REEMPLAZAR → VERIFICAR');
      const names=[t('Image','Imagen'),'Deployment','Pods','Service'];
      names.forEach((label,i)=>{const x=35+i*185;if(i<3)parts.push(line(x+155,205,x+185,205,i>=1&&n===1?P.red:P.green,n===1&&i>=1));parts.push(box(x,155,155,100,label,i===2?(n===1?'0 / 2':'2 / 2'):i===0?'1.0.0':i===3?(n===1?'no endpoint':'HTTP 200'):'replicas: 2','node'+i,n===1&&i>=2?P.fail:P.mint));});
      parts.push(box(150,310,460,55,n===2?t('New identities, expected behavior','Identidades nuevas, comportamiento esperado'):t('Observe every boundary','Observá cada límite'),'','result'));
      note(t('This is not a zero-downtime measurement.','Esto no es una medición de cero interrupciones.'));
    }
    if(!parts.length)throw Error('Unimplemented '+type);
    return {svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 460" role="group" aria-label="${e(lesson.title[lang])}" style="font-family:Segoe UI,system-ui,sans-serif"><title>${e(lesson.title[lang])}</title>${parts.join('')}</svg>`,controls,details};
  }
  return {render,palette,themes:Object.keys(PALETTES)};
})();
