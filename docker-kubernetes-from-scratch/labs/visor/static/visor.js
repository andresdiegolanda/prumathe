/* Live viewer of the course: Docker and the practice cluster. Asks /api/state every half second and
   redraws only when something changed or the reader did something. Everything that comes from
   Docker or Kubernetes (names, messages, values) is escaped before it reaches the page. */
(() => {
  'use strict';

  const POLL_MS = 500;
  const NEW_MS = 4000;
  const PORT = 18091;

  // Lessons the viewer points to: number -> [title EN, title ES]. scripts/check.mjs compares it with
  // the curriculum, so a lesson that changes its title fails the check until this table follows.
  const LESSONS = {"01":["A process with boundaries","Un proceso con límites"],"02":["Start, stop, remove","Arrancar, parar, borrar"],"03":["Images and layers","Imágenes y capas"],"04":["Build an image","Construí una imagen"],"05":["Data that outlives a container","Datos que sobreviven al contenedor"],"06":["Names on a network","Nombres en una red"],"07":["Publish a port deliberately","Publicá un puerto a propósito"],"08":["Describe the local system","Describí el sistema local"],"09":["Configuration and secrets","Configuración y secretos"],"10":["Health and resource limits","Salud y límites de recursos"],"11":["Tags, digests and delivery","Tags, digests y distribución"],"12":["Follow the evidence","Seguí la evidencia"],"13":["Meet the cluster","Conocé el clúster"],"14":["The Pod boundary","El límite del Pod"],"15":["Desired and observed state","Estado deseado y observado"],"16":["Keep replicas running","Mantené réplicas en marcha"],"17":["A stable front door","Una entrada estable"],"18":["Inject runtime configuration","Inyectá configuración de ejecución"],"19":["Storage beyond a Pod","Almacenamiento más allá de un Pod"],"20":["Alive, ready, started","Vivo, listo, arrancado"],"21":["Requests, limits and placement","Requests, limits y ubicación"],"22":["Change versions with a way back","Cambiá versiones con una vuelta posible"],"23":["Grant only the needed verbs","Otorgá solo los verbos necesarios"],"24":["Deploy, break, recover","Desplegá, rompé, recuperá"]};

  // Commands the detail panel offers: key -> [lesson, command]. Each one is a line of that lesson's
  // practice, run from labs; scripts/check.mjs verifies it.
  const CMDS = {"health":["10","docker inspect --format '{{.State.Health.Status}} {{.State.Running}}' prumathe-dk-app-1"],"fail":["10","docker compose exec -T app touch /tmp/fail-live"],"heal":["10","docker compose exec -T app rm /tmp/fail-live"],"limits":["10","docker inspect --format '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}' prumathe-dk-app-1"],"port":["07","docker compose port app 8080"],"logs":["12","docker compose logs --tail 5 app"],"mounts":["05","docker inspect --format '{{json .Mounts}}' prumathe-dk-app-1"],"recreate":["05","docker compose up -d --wait --force-recreate app"],"ps":["08","docker compose ps"],"env":["09","docker compose exec -T app printenv MESSAGE"],"life":["02","docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' dk-life"],"lifeStart":["02","docker start dk-life"],"lifeRm":["02","docker rm dk-life"],"history":["03","docker image history prumathe-signal:1.0.0"],"defaults":["03","docker image inspect --format '{{.Config.User}} {{json .Config.Cmd}}' prumathe-signal:1.0.0"],"build":["04","docker build --build-arg APP_VERSION=1.1.0 -t prumathe-signal:1.1.0 app"],"imageId":["11","docker image inspect --format '{{.Id}}' prumathe-signal:1.0.0"],"aliasId":["11","docker image inspect --format '{{.Id}}' prumathe-signal:practice"],"untag":["11","docker image rm prumathe-signal:practice"],"digest":["11","docker image inspect --format '{{json .RepoDigests}}' python:3.14.8-alpine3.24@sha256:f6a589d43c42b9e7f7dc67a12d37132491f362859a5d750607710cc56da3bc72"],"net":["06","docker network inspect prumathe-dk_default"],"visor":["13","docker compose up -d --wait visor"],"connect":["13","docker network connect kind prumathe-dk-visor-1"],"nodes":["13","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk get nodes"],"namespace":["13","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk apply -f k8s/namespace.yaml"],"desired":["15","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment signal -o 'jsonpath={.spec.replicas}/{.status.readyReplicas}'"],"scale":["15","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab scale deployment/signal --replicas=3"],"baseline":["15","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml"],"chain":["16","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment,replicaset,pod -l app=signal"],"deletePods":["16","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete pod -l app=signal --wait=true"],"solo":["14","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get pod solo -o wide"],"soloUid":["14","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get pod solo -o 'jsonpath={.metadata.uid}'"],"soloDelete":["14","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete pod solo --wait=true"],"service":["17","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get service signal -o yaml"],"slices":["17","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get endpointslices -l kubernetes.io/service-name=signal -o yaml"],"configmap":["18","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get configmap signal-settings"],"secret":["18","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get secret demo-token"],"fromCm":["18","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab set env deployment/signal --from=configmap/signal-settings"],"pvc":["19","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get pvc notebook"],"writer":["19","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec writer -- cat /data/marker"],"probe":["20","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get pod probe -o yaml"],"notReady":["20","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec probe -- touch /tmp/not-ready"],"ready":["20","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec probe -- rm /tmp/not-ready"],"probeSlices":["20","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get endpointslices -l kubernetes.io/service-name=probe-entry -o yaml"],"budgets":["21","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment signal -o 'jsonpath={.spec.template.spec.containers[0].resources}'"],"noRoom":["21","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab describe pod no-room"],"rollout":["22","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s"],"setImage":["22","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab set image deployment/signal app=prumathe-signal:1.1.0"],"undo":["22","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout undo deployment/signal"],"canList":["23","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab auth can-i list pods --as=system:serviceaccount:dk-lab:observer"],"canDelete":["23","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab auth can-i delete pods --as=system:serviceaccount:dk-lab:observer"],"canSecrets":["23","kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab auth can-i get secrets --as=system:serviceaccount:dk-lab:observer"]};

  const MARK = '<svg width="28" height="28" viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="16" rx="2" fill="#f6f5ed"/><path d="M5.5 15.2V6.4C8.1 6.4 10.5 7.8 10.5 10.2" fill="none" stroke="#21664e" stroke-width="2.6" stroke-linejoin="round"/><path d="M5.5 0.8C4 2.4 4.1 4 5.5 5.3C6.9 4 7 2.4 5.5 0.8Z" fill="#d77936"/></svg>';

  const store = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch {}
    },
  };
  const query = new URLSearchParams(location.search);
  let lang = query.get('lang') || store.get('dk-visor-lang') || ((navigator.language || '').startsWith('es') ? 'es' : 'en');
  if (lang !== 'es') lang = 'en';
  const local = ['127.0.0.1', 'localhost'].includes(location.hostname);

  let data = null; // the last full state
  let version = 0;
  let status = { readAt: 0, reached: false, lostAt: 0 };
  let paused = false;
  let tab = null; // plane chosen by the reader; null follows the activity
  let sel = null; // selected object: kind|name
  let hoverPod = null; // Pod under the pointer or the focus: its endpoints light up too
  const seen = new Map(); // object key -> first time on screen
  const loaded = { page: false, docker: false, k8s: false };
  let hadNew = false;

  const L = (en, es) => (lang === 'es' ? es : en);
  const e = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const $ = (s) => document.querySelector(s);
  const app = $('#app');
  const fmtTime = (ms) => (ms ? new Date(ms).toLocaleTimeString(lang === 'es' ? 'es-AR' : 'en-GB', { hour12: false }) : '…');
  const num = (x) => (lang === 'es' ? String(x).replace('.', ',') : String(x));
  const plural = (n, en1, enN, es1, esN) => `${n} ${n === 1 ? L(en1, es1) : L(enN, esN)}`;
  const selc = (id) => (sel === id ? 'selected' : '');
  const muted = (t) => `<p class="muted">${e(t)}</p>`;
  const nodeShort = (n) => String(n || '').replace(/^prumathe-dk-/, '');
  const portText = (p) => `${p[0] || '0.0.0.0'}:${p[1]} → ${p[2]}/${p[3]}`;
  const MODES = { ReadWriteOnce: 'RWO', ReadOnlyMany: 'ROX', ReadWriteMany: 'RWX', ReadWriteOncePod: 'RWOP' };
  const lessonRef = (n) => (LESSONS[n] ? `${L('lesson', 'lección')} ${n}, ${L(LESSONS[n][0], LESSONS[n][1])}` : '');

  const dk = () => (data && data.docker && data.docker.data) || null;
  const ks = () => (data && data.k8s && data.k8s.data) || null;

  function markNew() {
    const now = Date.now();
    const add = (key, first) => {
      if (!seen.has(key)) seen.set(key, first ? 0 : now);
    };
    for (const ev of data.events || []) add('ev:' + ev.seq, !loaded.page);
    loaded.page = true;
    const D = dk();
    if (D) {
      for (const c of D.containers) add('c:' + c.name + ':' + c.id, !loaded.docker);
      for (const i of D.images) add('i:' + i.id, !loaded.docker);
      loaded.docker = true;
    }
    const S = ks();
    if (S) {
      for (const p of S.pods) add('p:' + p.name, !loaded.k8s);
      for (const r of S.replicasets) add('r:' + r.name, !loaded.k8s);
      loaded.k8s = true;
    }
  }
  const isNew = (key) => Date.now() - (seen.get(key) || 0) < NEW_MS;
  const anyNew = () => [...seen.values()].some((t) => Date.now() - t < NEW_MS);

  // The plane on screen: the one the reader chose, else the one of the latest event.
  function shownPlane() {
    if (tab) return tab;
    const ev = data && (data.events || [])[0];
    if (ev) return ev.plane === 'k8s' ? 'k8s' : 'docker';
    return ks() ? 'k8s' : 'docker';
  }

  // ------------------------------------------------------------------ status

  function planeState(name) {
    const p = data && data[name];
    if (!p) return { cls: 'idle', text: L('waiting', 'esperando') };
    if (p.ok) return { cls: '', text: L('reading', 'leyendo') };
    if (p.data) return { cls: 'down', text: L(`stale since ${fmtTime(p.since)}`, `vieja desde ${fmtTime(p.since)}`) };
    if (p.reason === 'starting') return { cls: 'idle', text: L('starting', 'arrancando') };
    if (name === 'k8s' && p.reason === 'no-kubeconfig') return { cls: 'idle', text: L('no cluster yet', 'todavía sin clúster') };
    if (name === 'k8s' && p.reason === 'not-connected') return { cls: 'idle', text: L('viewer not connected', 'visor sin conectar') };
    return { cls: 'down', text: name === 'k8s' ? L('no answer', 'sin respuesta') : L('no access', 'sin acceso') };
  }

  function statusHtml() {
    if (!status.reached) {
      const text = status.lostAt ? L(`The viewer stopped answering at ${fmtTime(status.lostAt)}. Is the visor service still running?`, `El visor dejó de responder a las ${fmtTime(status.lostAt)}. ¿Sigue corriendo el servicio visor?`) : L('Connecting…', 'Conectando…');
      return `<span><span class="dot down"></span>${e(text)}</span>`;
    }
    if (paused) return `<span><span class="dot paused"></span>${L('Viewer paused', 'Visor en pausa')}</span>`;
    const d = planeState('docker');
    const k = planeState('k8s');
    return `<span><span class="dot ${d.cls}"></span>Docker: ${e(d.text)}</span><span><span class="dot ${k.cls}"></span>Kubernetes: ${e(k.text)}</span><span>${e(fmtTime(status.readAt))}</span>`;
  }

  function header() {
    return `<header class="top"><div class="brand">${MARK}<div><span class="eyebrow green">${L('LIVE VIEWER', 'VISOR EN VIVO')}</span><strong>${L('Docker and Kubernetes from scratch', 'Docker y Kubernetes desde cero')}</strong></div></div><div class="controls"><span class="status" id="status">${statusHtml()}</span><button data-act="pause" aria-pressed="${paused}">${paused ? L('Resume', 'Seguir') : L('Pause', 'Pausar')}</button><span class="langs"><button data-act="en" aria-pressed="${lang === 'en'}">EN</button><button data-act="es" aria-pressed="${lang === 'es'}">ES</button></span></div></header>`;
  }

  function planes(shown) {
    const D = dk();
    const S = ks();
    const dSum = D ? `${plural(D.containers.length, 'container', 'containers', 'contenedor', 'contenedores')}, ${plural(D.images.length, 'image', 'images', 'imagen', 'imágenes')}` : planeState('docker').text;
    const kSum = S ? `${plural(S.nodes.length, 'node', 'nodes', 'nodo', 'nodos')}, ${plural(S.pods.length, 'Pod', 'Pods', 'Pod', 'Pods')} ${L('in', 'en')} dk-lab` : planeState('k8s').text;
    const following = !tab;
    return `<nav class="planes" aria-label="${L('Planes', 'Planos')}"><button class="plane" data-act="docker" aria-pressed="${shown === 'docker'}">Docker <small>${e(dSum)}</small></button><button class="plane" data-act="k8s" aria-pressed="${shown === 'k8s'}">Kubernetes <small>${e(kSum)}</small></button><button class="follow ${following ? 'on' : ''}" data-act="follow" aria-pressed="${following}">${following ? '● ' : ''}${L('Follow the activity', 'Seguir la actividad')}</button></nav>`;
  }

  // A plane that answered before and does not answer now: its last good reading stays on screen.
  function staleBanner(p, name) {
    const what = name === 'k8s' ? L('the cluster', 'el clúster') : 'Docker';
    let why = '';
    let code = '';
    if (name === 'k8s' && p.reason === 'not-connected') {
      why = L('The viewer is no longer on the kind network. Connect it again:', 'El visor ya no está en la red kind. Conectalo de nuevo:');
      code = CMDS.connect[1];
    } else if (name === 'k8s' && p.reason === 'no-kubeconfig') {
      why = L('The kubeconfig in labs is gone: the cluster was probably deleted.', 'El kubeconfig de labs ya no está: probablemente se borró el clúster.');
    } else if (name === 'k8s') {
      why = L('The API server does not answer. Check that the cluster is running:', 'El API server no responde. Fijate si el clúster está corriendo:');
      code = CMDS.nodes[1];
    }
    return `<div class="banner"><p>${e(L(`This is the last good reading, from ${fmtTime(p.readAt)}: ${what} stopped answering at ${fmtTime(p.since)}.`, `Esta es la última lectura buena, de las ${fmtTime(p.readAt)}: ${what} dejó de responder a las ${fmtTime(p.since)}.`))}</p>${why ? `<p>${e(why)}</p>` : ''}${code ? `<code>${e(code)}</code>` : ''}</div>`;
  }

  function missingBox(eyebrow, title, text, code) {
    return `<div class="box"><span class="eyebrow">${e(eyebrow)}</span><h1 class="title">${e(title)}</h1><p>${e(text)}</p>${code ? `<code>${e(code)}</code>` : ''}</div>`;
  }

  // ------------------------------------------------------------------ Docker plane

  const imgKind = (i) => (i.base ? 'base' : i.tags.concat(i.digest || []).some((t) => t.startsWith('kindest/node')) ? 'node' : 'app');
  const imgName = (i) => (i.tags[0] ? i.tags[0] : i.base && i.baseRef ? i.baseRef.split('@')[0] : i.digest ? i.digest.replace(/@sha256:(.{12}).*/, '@sha256:$1…') : i.id);

  function imageItem(i) {
    const k = imgKind(i);
    let small;
    if (k === 'base') small = `${L('pinned base', 'base fijada')} · ${(String(i.baseRef || i.digest || '').split('@')[1] || '').slice(0, 19)}…`;
    const used = i.users.length ? L(`used by ${plural(i.users.length, 'container', 'containers', '', '')}`, `la usan ${plural(i.users.length, '', '', 'contenedor', 'contenedores')}`) : L('no container uses it', 'ningún contenedor la usa');
    if (k === 'node') small = `${L('image of the cluster nodes', 'imagen de los nodos del clúster')} · ID ${i.id} · ${used}`;
    else if (k === 'app') small = `ID ${i.id}${i.layers != null ? ' · ' + plural(i.layers, 'layer', 'layers', 'capa', 'capas') : ''} · ${used}`;
    const also = i.tags.length > 1 ? `<small>${L('also', 'también')}: ${e(i.tags.slice(1).join(', '))}</small>` : '';
    return `<button class="item ${isNew('i:' + i.id) ? 'fresh' : ''} ${selc('image|' + i.id)}" data-sel="image|${e(i.id)}"><strong>${e(imgName(i))}</strong><small>${e(small)}</small>${also}</button>`;
  }

  function stateChip(c) {
    if (c.state === 'running') return `<span class="chip ok">running</span>`;
    if (c.state === 'exited') return `<span class="chip ${c.exit ? 'bad' : 'off'}">exited ${e(c.exit)}</span>`;
    if (c.state === 'restarting') return `<span class="chip warn">restarting</span>`;
    return `<span class="chip off">${e(c.state)}</span>`;
  }

  function healthBox(h) {
    const bad = h.status === 'unhealthy';
    const head = h.status === 'healthy' && h.streak ? L(`Health check: still healthy, ${h.streak} failures in a row so far.`, `Health check: todavía healthy, ${h.streak} fallas seguidas por ahora.`) : h.status === 'healthy' ? L('Health check: passing.', 'Health check: pasa.') : h.status === 'starting' ? L('Health check: starting.', 'Health check: arrancando.') : L(`Health check: ${h.streak} failures in a row. Docker does not restart it.`, `Health check: ${h.streak} fallas seguidas. Docker no lo reinicia.`);
    const streak = (h.checks || []).map((x) => `<i class="${x ? 'x' : ''}"></i>`).join('');
    return `<span class="health ${bad ? '' : 'ok'}"><span>${e(head)}</span><span class="streak">${streak}</span>${bad && h.last ? `<span class="mono">${e(h.last)}</span>` : ''}</span>`;
  }

  const kv = (rows) => `<span class="kv">${rows
    .filter((r) => r[1])
    .map(([k, v]) => `<span class="k">${e(k)}</span><span class="v">${v}</span>`)
    .join('')}</span>`;

  // The health of a stopped container is the one of its last run: it is not shown.
  const live = (c) => (c.running ? c : { ...c, health: null });
  const imageText = (c) => (c.image.startsWith('sha256:') ? `${c.image.slice(7, 19)} (${L('the name it was created with no longer points to this image', 'el nombre con que se creó ya no apunta a esta imagen')})` : c.image);

  function containerItem(c) {
    c = live(c);
    const chips = [stateChip(c)];
    if (c.health) chips.push(`<span class="chip ${c.health.status === 'healthy' ? 'ok' : c.health.status === 'unhealthy' ? 'bad' : 'warn'}">${e(c.health.status)}</span>`);
    const fresh = isNew('c:' + c.name + ':' + c.id) ? 'fresh' : '';
    const bad = c.health && c.health.status === 'unhealthy' ? 'bad' : '';
    const head = `<span class="item-head"><strong>${e(c.name)}</strong><span class="chips">${chips.join('')}</span></span>`;
    if (c.kind === 'node') {
      const nets = c.networks.map((n) => `${L('network', 'red')} ${n[0]} ${n[1] || ''}`).join(' · ');
      const role = c.role === 'control-plane' ? L('control-plane node of cluster prumathe-dk', 'nodo de control del clúster prumathe-dk') : L('worker node of cluster prumathe-dk', 'nodo worker del clúster prumathe-dk');
      return `<button class="item ${fresh} ${selc('container|' + c.name)}" data-sel="container|${e(c.name)}">${head}<small>${e(role)}${nets ? ' · ' + e(nets) : ''}</small></button>`;
    }
    const rows = [
      [L('service', 'servicio'), c.service ? e(c.service) + ' (Compose)' : ''],
      [L('image', 'imagen'), e(imageText(c))],
      [L('user', 'usuario'), e(c.user)],
      [L('port', 'puerto'), c.ports.map((p) => e(portText(p))).join('<br>')],
      [L('network', 'red'), c.networks.map((n) => e(n[0] + (n[1] ? ' · ' + n[1] : ''))).join('<br>')],
      [L('mounts', 'montajes'), c.mounts.map((m) => e(`${m[1].length > 40 ? '…' + m[1].slice(-32) : m[1]} → ${m[2]}${m[3] ? '' : ' (ro)'}`)).concat(c.secrets.map((s) => e(`${L('secret', 'secreto')} → ${s}`))).join('<br>')],
      [L('limits', 'límites'), c.memory || c.cpus ? e([c.memory ? Math.round(c.memory / 1048576) + ' MiB' : '', c.cpus ? num(c.cpus) + ' CPU' : ''].filter(Boolean).join(' · ')) : ''],
      ...Object.entries(c.env || {}).map(([k, v]) => [k, e(v)]),
      [L('restarts', 'reinicios'), c.restarts ? e(c.restarts) : ''],
    ];
    return `<button class="item ${fresh || bad} ${selc('container|' + c.name)}" data-sel="container|${e(c.name)}">${head}${c.health ? healthBox(c.health) : ''}${kv(rows)}</button>`;
  }

  function dockerMissing(p) {
    const eb = 'DOCKER';
    if (p.reason === 'socket-denied') return missingBox(eb, L('The viewer cannot open the Docker socket', 'El visor no puede abrir el socket de Docker'), L('Docker refused the viewer access to its socket. On Linux with Docker Engine the socket usually belongs to the docker group: start the viewer with the number of that group.', 'Docker no le dio acceso al socket. En Linux con Docker Engine el socket suele ser del grupo docker: levantá el visor con el número de ese grupo.'), 'DOCKER_GID=$(getent group docker | cut -d: -f3) docker compose up -d --wait visor');
    if (p.reason === 'no-socket') return missingBox(eb, L('The viewer does not see the Docker socket', 'El visor no ve el socket de Docker'), L('It reads Docker through /var/run/docker.sock, which the visor service of labs/compose.yaml mounts. Start it from labs:', 'Lee Docker por /var/run/docker.sock, que monta el servicio visor de labs/compose.yaml. Levantalo desde labs:'), CMDS.visor[1]);
    if (p.reason === 'starting') return missingBox(eb, L('Reading Docker…', 'Leyendo Docker…'), L('The first reading arrives in a moment.', 'La primera lectura llega en un momento.'), '');
    return missingBox(eb, L('Docker does not answer', 'Docker no responde'), L(`The socket is there but the Engine does not answer (${p.reason || 'error'}). Check that Docker is running.`, `El socket está pero el Engine no responde (${p.reason || 'error'}). Fijate si Docker está corriendo.`), '');
  }

  // Right after the viewer starts, its first state has no planes yet.
  const STARTING = { ok: false, reason: 'starting', data: null };

  function dockerPlane() {
    const p = data.docker || STARTING;
    const D = dk();
    if (!D) return dockerMissing(p);
    const images = D.images.map(imageItem).join('') || muted(L('No course images yet: lesson 00 builds the first one.', 'Todavía no hay imágenes del curso: la lección 00 construye la primera.'));
    const ephemeral = (data.events || [])
      .filter((ev) => ev.code === 'ephemeral')
      .slice(0, 2)
      .map((ev) => `<div class="item ghost"><small><b>${L('Ephemeral:', 'Efímero:')}</b> ${e(ev.container)}, ${L('from', 'desde')} ${e(ev.image)}. ${e(ev.exit == null ? L(`Removed at ${fmtTime(ev.at)}.`, `Se borró a las ${fmtTime(ev.at)}.`) : L(`Exited with ${ev.exit} and was removed at ${fmtTime(ev.at)}.`, `Salió con ${ev.exit} y se borró a las ${fmtTime(ev.at)}.`))}</small></div>`)
      .join('');
    let containers = D.containers.map(containerItem).join('') || muted(L('No course containers now.', 'Ahora no hay contenedores del curso.'));
    containers += ephemeral;
    if (D.logs && D.logs.lines.length) containers += `<div class="item"><span class="eyebrow">${L('LAST LOG LINES', 'ÚLTIMAS LÍNEAS DEL LOG')} · ${e(D.logs.container)}</span><span class="logs">${e(D.logs.lines.join('\n'))}</span></div>`;
    if (D.hidden) containers += `<small class="muted">${e(L(`${plural(D.hidden, 'container', 'containers', '', '')} of other projects ${D.hidden === 1 ? 'is' : 'are'} not shown.`, `${D.hidden === 1 ? '1 contenedor de otros proyectos no se muestra' : D.hidden + ' contenedores de otros proyectos no se muestran'}.`))}</small>`;
    const volumes = D.volumes.map((v) => `<button class="item ${selc('volume|' + v.name)}" data-sel="volume|${e(v.name)}"><strong>${e(v.name)}</strong><small>${e(v.users.length ? v.users.map((u) => L(`mounted by ${u[0]} at ${u[1]}`, `montado por ${u[0]} en ${u[1]}`)).join(' · ') : L('no container mounts it now', 'ningún contenedor lo monta ahora'))}</small></button>`).join('') || muted(L('No volumes yet.', 'Todavía no hay volúmenes.'));
    const onKind = (D.visorNetworks || []).includes('kind');
    const networks = D.networks.map((n) => {
      const members = n.members.map((m) => e(`${m[0]} · ${m[1]}`)).join('<br>');
      const extra = n.name === 'kind' ? `<small>${e(onKind ? L('The viewer is on this network too.', 'El visor también está en esta red.') : L('The viewer is not on this network: the Kubernetes plane needs it (lesson 13).', 'El visor no está en esta red: el plano Kubernetes la necesita (lección 13).'))}</small>` : '';
      return `<button class="item ${selc('network|' + n.name)}" data-sel="network|${e(n.name)}"><strong>${e(n.name)}</strong><small>${members || e(L('no containers', 'sin contenedores'))}</small>${extra}</button>`;
    }).join('') || muted(L('No course networks yet.', 'Todavía no hay redes del curso.'));
    const body = `<div class="cols3"><section class="col"><span class="eyebrow">${L('IMAGES', 'IMÁGENES')}</span>${images}</section><section class="col"><span class="eyebrow">${L('CONTAINERS', 'CONTENEDORES')}</span>${containers}</section><section class="col"><span class="eyebrow">${L('VOLUMES', 'VOLÚMENES')}</span>${volumes}<span class="eyebrow">${L('NETWORKS', 'REDES')}</span>${networks}</section></div>`;
    return p.ok ? body : staleBanner(p, 'docker') + `<div class="stack stale-data">${body}</div>`;
  }

  // ------------------------------------------------------------------ Kubernetes plane

  function k8sMissing(p) {
    const eb = 'KUBERNETES';
    if (p.reason === 'starting') return missingBox(eb, L('Reading the cluster…', 'Leyendo el clúster…'), L('The first reading arrives in a moment.', 'La primera lectura llega en un momento.'), '');
    if (p.reason === 'no-kubeconfig') return missingBox(eb, L('No cluster yet', 'Todavía no hay clúster'), L('Lesson 13 creates the practice cluster and writes its kubeconfig in labs. Then connect the viewer to the kind network:', 'La lección 13 crea el clúster de práctica y escribe su kubeconfig en labs. Después conectá el visor a la red kind:'), CMDS.connect[1]);
    if (p.reason === 'not-connected') return missingBox(eb, L('The viewer is not on the kind network', 'El visor no está en la red kind'), L('The cluster answers on the kind network and the viewer has to join it (lesson 13). If the viewer container is recreated, connect it again:', 'El clúster atiende en la red kind y el visor tiene que sumarse (lección 13). Si se recrea el contenedor del visor, conectalo de nuevo:'), CMDS.connect[1]);
    if (p.reason === 'unreachable') return missingBox(eb, L('The API server does not answer', 'El API server no responde'), L(`The viewer is on the kind network but the API server does not answer (${p.detail || 'error'}). Check that the cluster is running:`, `El visor está en la red kind pero el API server no responde (${p.detail || 'error'}). Fijate si el clúster está corriendo:`), CMDS.nodes[1]);
    if (p.reason === 'bad-kubeconfig') return missingBox(eb, L('The kubeconfig in labs cannot be read', 'No se puede leer el kubeconfig de labs'), L('The viewer reads labs/kubeconfig, the file that kind writes when it creates the cluster in lesson 13. It lacks a field the viewer needs.', 'El visor lee labs/kubeconfig, el archivo que escribe kind al crear el clúster en la lección 13. Le falta un campo que el visor necesita.'), '');
    return missingBox(eb, L('The cluster could not be read', 'No se pudo leer el clúster'), `${p.reason || 'error'} ${p.detail || ''}`, '');
  }

  function podButton(p) {
    const failing = (p.waiting && /Err|BackOff/.test(p.waiting)) || p.unschedulable;
    const cls = p.terminating ? 'term' : failing ? 'bad' : isNew('p:' + p.name) ? 'fresh' : '';
    const dot = p.terminating ? 'idle' : p.ready ? '' : failing ? 'down' : 'paused';
    const st = p.terminating ? L('Terminating', 'Terminando') : p.unschedulable ? L('Pending, no room', 'Pendiente, sin lugar') : p.waiting ? p.waiting : p.ready ? 'Ready' : `${p.phase}, ${L('not Ready', 'no Ready')}`;
    const bits = [st];
    if (p.node) bits.push(nodeShort(p.node));
    if (p.ip) bits.push(p.ip);
    if (!p.terminating) bits.push(plural(p.restarts, 'restart', 'restarts', 'reinicio', 'reinicios'));
    return `<button class="pod ${cls} ${selc('pod|' + p.name)}" data-sel="pod|${e(p.name)}" data-pod="${e(p.name)}"><span class="dot ${dot}"></span><span><strong>${e(p.name)}</strong><small>${e(bits.join(' · '))}</small></span></button>`;
  }

  const rsOf = (S, d) => S.replicasets.filter((r) => r.owner && r.owner[0] === 'Deployment' && r.owner[1] === d.name).sort((a, b) => Number(b.revision) - Number(a.revision));
  const podsOf = (S, r) => S.pods.filter((p) => p.owner && p.owner[0] === 'ReplicaSet' && p.owner[1] === r.name);

  function deploymentBox(S, d) {
    const chips = [`<span class="chip">${L('desired', 'deseado')} ${e(d.desired)}</span>`, `<span class="chip ${d.ready === d.desired ? 'ok' : 'warn'}">${L('ready', 'listos')} ${e(d.ready)}</span>`];
    if (d.updated !== d.desired) chips.push(`<span class="chip warn">${e(L(`updated ${d.updated} of ${d.desired}`, `actualizados ${d.updated} de ${d.desired}`))}</span>`);
    chips.push(`<span class="chip">${L('revision', 'revisión')} ${e(d.revision)}</span>`);
    const strategy = d.surge != null ? ` · RollingUpdate, maxSurge ${d.surge}, maxUnavailable ${d.unavailable}` : '';
    const left = `<div class="col"><span class="eyebrow">${L('DESIRED AND OBSERVED', 'DESEADO Y OBSERVADO')}</span><button class="item ${selc('deploy|' + d.name)}" data-sel="deploy|${e(d.name)}"><span class="ratio">${e(d.desired)} / ${e(d.ready)} <small>${L('desired / ready', 'deseado / listo')}</small></span><small>${e(d.image + strategy)}</small>${d.envFrom.length ? `<small>envFrom ${e(d.envFrom.join(', '))}</small>` : ''}</button></div>`;
    const rows = rsOf(S, d)
      .map((r) => {
        const pods = podsOf(S, r);
        const count = r.desired ? L(`${r.ready} of ${r.desired} ready`, `${r.ready} de ${r.desired} listos`) : L('0 replicas, template kept', '0 réplicas, plantilla guardada');
        return `<div class="rsrow"><button class="item ${isNew('r:' + r.name) ? 'fresh' : ''} ${selc('rs|' + r.name)}" data-sel="rs|${e(r.name)}"><strong>${e(r.name)}</strong><small>${e(`${L('revision', 'revisión')} ${r.revision} · ${r.image} · ${count}`)}</small></button><div class="col">${pods.map(podButton).join('')}</div></div>`;
      })
      .join('');
    return `<div class="box"><div class="box-head"><div><span class="eyebrow">DEPLOYMENT · dk-lab</span><button class="title" data-sel="deploy|${e(d.name)}">${e(d.name)}</button></div><span class="chips">${chips.join('')}</span></div><div class="flow">${left}<div class="col"><span class="eyebrow">${L('REPLICASETS AND THEIR PODS', 'REPLICASETS Y SUS PODS')}</span>${rows || muted(L('No ReplicaSets yet.', 'Todavía no hay ReplicaSets.'))}</div></div></div>`;
  }

  function epRow(ep, port) {
    const st = ep.ready ? L('ready', 'listo') : ep.terminating ? L('terminating, no new traffic', 'terminando, sin tráfico nuevo') : L('not ready, no traffic', 'no listo, sin tráfico');
    const addr = `${ep.ip}${port != null ? ':' + port : ''}`;
    const inner = `<span>${e(addr)}</span><span>${e(st + (ep.pod ? ' · ' + ep.pod : ''))}</span>`;
    const cls = ep.ready ? 'ready' : 'not';
    return ep.pod ? `<button class="ep ${cls} ${selc('pod|' + ep.pod)}" data-sel="pod|${e(ep.pod)}" data-pod="${e(ep.pod)}">${inner}</button>` : `<div class="ep ${cls}">${inner}</div>`;
  }

  function serviceBox(S, s) {
    const chips = s.ports.map((p) => `<span class="chip">${e(p[0])} → ${e(p[1])}</span>`).concat(Object.entries(s.selector).map(([k, v]) => `<span class="chip">selector ${e(k)}=${e(v)}</span>`));
    const slices = S.endpointslices.filter((x) => x.service === s.name);
    const eps = slices.map((x) => `<span class="eyebrow">ENDPOINTSLICE ${e(x.name)}</span><div class="eps">${x.endpoints.map((ep) => epRow(ep, x.ports[0])).join('') || muted(L('No endpoints: no Pod matches the selector.', 'Sin endpoints: ningún Pod coincide con el selector.'))}</div>`).join('');
    return `<div class="box"><div class="box-head"><div><span class="eyebrow">SERVICE · ${e(s.type)} ${e(s.clusterIP)}</span><button class="title" data-sel="service|${e(s.name)}">${e(s.name)}</button></div><span class="chips">${chips.join('')}</span></div>${eps}</div>`;
  }

  const VERBS = ['get', 'list', 'watch', 'delete'];
  const allowed = (rules, res, verb) => rules.some((r) => (r[1].includes(res) || r[1].includes('*')) && (r[2].includes(verb) || r[2].includes('*')));

  function rulesTable(rules) {
    const resources = [...new Set(rules.flatMap((r) => r[1]).concat('secrets'))];
    let html = `<span class="rules"><span class="h"></span>${VERBS.map((v) => `<span class="h">${v}</span>`).join('')}`;
    for (const res of resources) html += `<span>${e(res)}</span>` + VERBS.map((v) => (allowed(rules, res, v) ? `<span class="y">${L('yes', 'sí')}</span>` : '<span class="n">no</span>')).join('');
    return html + '</span>';
  }

  function grid(S) {
    const config =
      S.configmaps.map((c) => `<button class="item ${selc('cm|' + c.name)}" data-sel="cm|${e(c.name)}"><strong>ConfigMap ${e(c.name)}</strong>${Object.entries(c.data).map(([k, v]) => `<small class="mono">${e(k + '=' + v)}</small>`).join('')}</button>`).join('') +
      S.secrets.map((s) => `<button class="item ${selc('secret|' + s.name)}" data-sel="secret|${e(s.name)}"><strong>Secret ${e(s.name)}</strong><small>${L('Name only: the viewer does not read its contents.', 'Solo el nombre: el visor no lee su contenido.')}</small></button>`).join('');
    const storage = S.pvcs
      .map((c) => {
        const vol = c.volume ? ` · ${L('volume', 'volumen')} ${c.volume.slice(0, 12)}…` : '';
        const users = c.users.length ? L(`mounted by ${c.users.join(', ')}`, `montado por ${c.users.join(', ')}`) : L('no Pod mounts it now', 'ningún Pod lo monta ahora');
        return `<button class="item ${selc('pvc|' + c.name)}" data-sel="pvc|${e(c.name)}"><strong>PVC ${e(c.name)}</strong><small>${e([c.phase, c.size, c.modes.map((m) => MODES[m] || m).join(', ')].filter(Boolean).join(' · ') + vol)}</small><small>${e(users)}</small></button>`;
      })
      .join('');
    const rbac = S.rbac.bindings
      .map((b) => {
        const role = S.rbac.roles.find((r) => r.name === b.role);
        const subjects = b.subjects.map((s) => s[1]).join(', ');
        return `<button class="item ${selc('rbac|' + b.name)}" data-sel="rbac|${e(b.name)}"><strong>${e(subjects)}</strong><small>${e(`${b.subjects.map((s) => s[0]).join(', ')} → RoleBinding ${b.name} → Role ${b.role}`)}</small>${role ? rulesTable(role.rules) : ''}</button>`;
      })
      .join('');
    return `<div class="grid3"><div class="box"><span class="eyebrow">${L('CONFIGURATION', 'CONFIGURACIÓN')}</span>${config || muted(L('Nothing yet: lesson 18.', 'Nada todavía: lección 18.'))}</div><div class="box"><span class="eyebrow">${L('STORAGE', 'ALMACENAMIENTO')}</span>${storage || muted(L('Nothing yet: lesson 19.', 'Nada todavía: lección 19.'))}</div><div class="box"><span class="eyebrow">${L('PERMISSIONS', 'PERMISOS')}</span>${rbac || muted(L('Nothing yet: lesson 23.', 'Nada todavía: lección 23.'))}</div></div>`;
  }

  function k8sPlane() {
    const p = data.k8s || STARTING;
    const S = ks();
    if (!S) return k8sMissing(p);
    let body = '';
    if (!S.namespace) body += `<div class="banner info"><p>${L('The namespace dk-lab does not exist yet.', 'El namespace dk-lab todavía no existe.')}</p><p>${L('Lesson 13 creates it:', 'La lección 13 lo crea:')}</p><code>${e(CMDS.namespace[1])}</code></div>`;
    body += `<div class="nodes">${S.nodes
      .map((n) => {
        const here = S.pods.filter((x) => x.node === n.name).length;
        const bits = [n.ready ? 'Ready' : 'NotReady', n.version].concat(n.taints.map((t) => 'taint ' + t.replace(/^node-role\.kubernetes\.io\//, '')), [L(`${here} Pods of dk-lab`, `${here} Pods de dk-lab`)]);
        return `<button class="knode ${selc('node|' + n.name)}" data-sel="node|${e(n.name)}"><span class="dot ${n.ready ? '' : 'down'}"></span><span><strong>${e(n.name)}</strong><small>${e(bits.filter(Boolean).join(' · '))}</small></span></button>`;
      })
      .join('')}</div>`;
    const shown = new Set();
    for (const d of S.deployments) {
      body += deploymentBox(S, d);
      for (const r of rsOf(S, d)) for (const x of podsOf(S, r)) shown.add(x.name);
    }
    const others = S.pods.filter((x) => !shown.has(x.name));
    if (others.length) body += `<div class="box"><span class="eyebrow">${L('PODS WITHOUT AN OWNER', 'PODS SIN DUEÑO')}</span><div class="eps">${others.map(podButton).join('')}</div></div>`;
    for (const s of S.services) body += serviceBox(S, s);
    if (S.namespace && !S.deployments.length && !S.pods.length && !S.services.length) body += muted(L('Nothing in dk-lab yet: lesson 14 creates the first Pod and lesson 15 the Deployment.', 'Todavía no hay nada en dk-lab: la lección 14 crea el primer Pod y la 15 el Deployment.'));
    if (S.namespace) body += grid(S);
    return p.ok ? body : staleBanner(p, 'k8s') + `<div class="stack stale-data">${body}</div>`;
  }

  // ------------------------------------------------------------------ events

  function eventText(ev) {
    const b = (x) => `<b>${e(x)}</b>`;
    const m = (x) => `<span class="mono">${e(x)}</span>`;
    switch (ev.code) {
      case 'created':
        if (ev.plane === 'k8s') return L(`${e(ev.kind)} ${b(ev.name)} created.`, `Se creó el ${e(ev.kind)} ${b(ev.name)}.`);
        return L(`${b(ev.container)} was created from ${e(ev.image)}.`, `Se creó ${b(ev.container)} desde ${e(ev.image)}.`);
      case 'deleted':
        return L(`${e(ev.kind)} ${b(ev.name)} deleted.`, `Se borró el ${e(ev.kind)} ${b(ev.name)}.`);
      case 'started':
        return L(`${b(ev.container)} started.`, `${b(ev.container)} arrancó.`);
      case 'exited':
        return L(`${b(ev.container)} stopped with exit code ${e(ev.exit)}.`, `${b(ev.container)} paró con código ${e(ev.exit)}.`);
      case 'removed':
        return L(`${b(ev.container)} was removed.`, `Se borró ${b(ev.container)}.`);
      case 'restart':
        return L(`${b(ev.container)} restarted.`, `${b(ev.container)} se reinició.`);
      case 'oom':
        return L(`${b(ev.container)} ran out of memory.`, `${b(ev.container)} se quedó sin memoria.`);
      case 'ephemeral':
        return ev.exit == null ? L(`Ephemeral container ${b(ev.container)} from ${e(ev.image)}: it was removed.`, `Contenedor efímero ${b(ev.container)} desde ${e(ev.image)}: se borró.`) : L(`Ephemeral container ${b(ev.container)} from ${e(ev.image)}: it exited with ${e(ev.exit)} and was removed.`, `Contenedor efímero ${b(ev.container)} desde ${e(ev.image)}: salió con ${e(ev.exit)} y se borró.`);
      case 'exec':
        return L(`${b(ev.container)}: exec ${m(ev.cmd)}, exited with ${e(ev.exit)}.`, `${b(ev.container)}: exec ${m(ev.cmd)}, salió con ${e(ev.exit)}.`);
      case 'health':
        return ev.to === 'unhealthy' ? L(`${b(ev.container)} is now ${b('unhealthy')}: its health check failed several times in a row. The process keeps running.`, `${b(ev.container)} pasó a ${b('unhealthy')}: su health check falló varias veces seguidas. El proceso sigue corriendo.`) : L(`${b(ev.container)} is now ${b(ev.to)}.`, `${b(ev.container)} pasó a ${b(ev.to)}.`);
      case 'imageTag':
        return L(`Image tagged ${b(ev.image)} (ID ${e(ev.id)}).`, `Se etiquetó la imagen ${b(ev.image)} (ID ${e(ev.id)}).`);
      case 'imageUntag':
        return L(`Tag removed: ${b(ev.image)}.`, `Se quitó el tag ${b(ev.image)}.`);
      case 'imageDelete':
        return L(`Image deleted: ${b(ev.image)}.`, `Se borró la imagen ${b(ev.image)}.`);
      case 'imagePull':
        return L(`Image pulled: ${b(ev.image)}.`, `Se descargó la imagen ${b(ev.image)}.`);
      case 'volumeCreate':
        return L(`Volume ${b(ev.volume)} created.`, `Se creó el volumen ${b(ev.volume)}.`);
      case 'volumeDestroy':
        return L(`Volume ${b(ev.volume)} removed.`, `Se borró el volumen ${b(ev.volume)}.`);
      case 'networkConnect':
        return ev.visor ? L(`The viewer joined the network ${b(ev.network)}.`, `El visor se sumó a la red ${b(ev.network)}.`) : L(`${b(ev.container)} joined the network ${b(ev.network)}.`, `${b(ev.container)} se sumó a la red ${b(ev.network)}.`);
      case 'networkDisconnect':
        return ev.visor ? L(`The viewer left the network ${b(ev.network)}.`, `El visor salió de la red ${b(ev.network)}.`) : L(`${b(ev.container)} left the network ${b(ev.network)}.`, `${b(ev.container)} salió de la red ${b(ev.network)}.`);
      case 'k8sStart':
        return L(`The viewer reads the cluster: ${plural(ev.nodes, 'node', 'nodes', '', '')}, ${plural(ev.pods, 'Pod', 'Pods', '', '')} in dk-lab.`, `El visor lee el clúster: ${plural(ev.nodes, '', '', 'nodo', 'nodos')}, ${plural(ev.pods, '', '', 'Pod', 'Pods')} en dk-lab.`);
      case 'nodeReady':
        return ev.ready ? L(`Node ${b(ev.node)} is Ready.`, `El nodo ${b(ev.node)} está Ready.`) : L(`Node ${b(ev.node)} is no longer Ready.`, `El nodo ${b(ev.node)} dejó de estar Ready.`);
      case 'podCreated':
        return ev.owner ? L(`${e(ev.owner[0])} ${e(ev.owner[1])} created the Pod ${b(ev.pod)}.`, `${e(ev.owner[0])} ${e(ev.owner[1])} creó el Pod ${b(ev.pod)}.`) : L(`Pod ${b(ev.pod)} created, without an owner.`, `Se creó el Pod ${b(ev.pod)}, sin dueño.`);
      case 'podTerminating':
        return L(`Pod ${b(ev.pod)} is terminating.`, `El Pod ${b(ev.pod)} está terminando.`);
      case 'podReady':
        return ev.ready ? L(`Pod ${b(ev.pod)} is Ready on ${e(nodeShort(ev.node))}.`, `El Pod ${b(ev.pod)} quedó Ready en ${e(nodeShort(ev.node))}.`) : L(`Pod ${b(ev.pod)} is no longer Ready: Services stop sending it traffic.`, `El Pod ${b(ev.pod)} dejó de estar Ready: los Services dejan de mandarle tráfico.`);
      case 'podRestarted':
        return L(`Pod ${b(ev.pod)} restarted its container (${plural(ev.restarts, 'restart', 'restarts', '', '')}).`, `El Pod ${b(ev.pod)} reinició su contenedor (${plural(ev.restarts, '', '', 'reinicio', 'reinicios')}).`);
      case 'podDeleted':
        return L(`Pod ${b(ev.pod)} no longer exists.`, `El Pod ${b(ev.pod)} ya no existe.`);
      case 'desired':
        return L(`Deployment ${b(ev.name)}: desired replicas from ${e(ev.frm)} to ${e(ev.to)}.`, `Deployment ${b(ev.name)}: réplicas deseadas de ${e(ev.frm)} a ${e(ev.to)}.`);
      case 'revision':
        return L(`Deployment ${b(ev.name)} moved to revision ${e(ev.revision)}, with ${e(ev.image)}.`, `El Deployment ${b(ev.name)} pasó a la revisión ${e(ev.revision)}, con ${e(ev.image)}.`);
      case 'rsCreated':
        return L(`New ReplicaSet ${b(ev.name)}, revision ${e(ev.revision)}, with ${e(ev.image)}.`, `ReplicaSet nuevo ${b(ev.name)}, revisión ${e(ev.revision)}, con ${e(ev.image)}.`);
      case 'endpoint': {
        const who = ev.pod ? ` (${e(ev.pod)})` : '';
        if (ev.ready) return L(`Service ${b(ev.service)}: endpoint ${m(ev.ip)}${who} receives traffic.`, `Service ${b(ev.service)}: el endpoint ${m(ev.ip)}${who} recibe tráfico.`);
        if (ev.terminating) return L(`Service ${b(ev.service)}: endpoint ${m(ev.ip)} stops getting new traffic: its Pod is terminating.`, `Service ${b(ev.service)}: el endpoint ${m(ev.ip)} deja de recibir tráfico nuevo: su Pod está terminando.`);
        return L(`Service ${b(ev.service)}: endpoint ${m(ev.ip)}${who} is not ready and gets no traffic.`, `Service ${b(ev.service)}: el endpoint ${m(ev.ip)}${who} no está listo y no recibe tráfico.`);
      }
      case 'endpointGone':
        return L(`Service ${b(ev.service)}: endpoint ${m(ev.ip)} left the EndpointSlice.`, `Service ${b(ev.service)}: el endpoint ${m(ev.ip)} salió del EndpointSlice.`);
      case 'pvcPhase':
        return L(`Claim ${b(ev.name)} is now ${b(ev.phase)}.`, `El claim ${b(ev.name)} pasó a ${b(ev.phase)}.`);
      case 'namespace':
        return ev.present ? L('Namespace dk-lab created.', 'Se creó el namespace dk-lab.') : L('Namespace dk-lab no longer exists.', 'El namespace dk-lab ya no existe.');
      case 'kevent':
        return `${b(ev.reason)} · ${e(ev.kind)} ${e(ev.name)}: ${e(ev.message)}${ev.count > 1 ? ` (×${e(ev.count)})` : ''}`;
      default:
        return e(ev.code);
    }
  }

  function feed() {
    const evs = (data.events || []).slice(0, 14);
    return `<div class="feed"><span class="eyebrow">${L('WHAT HAPPENED', 'LO QUE PASÓ')}</span>${evs.map((ev) => `<div class="ev ${isNew('ev:' + ev.seq) ? 'fresh' : ''}"><span class="mono">${fmtTime(ev.at)}</span><span class="tagp ${ev.plane === 'k8s' ? 'k' : ''}">${ev.plane === 'k8s' ? 'K8S' : 'DOCKER'}</span><span>${eventText(ev)}</span></div>`).join('') || muted(L('Nothing yet.', 'Nada todavía.'))}</div>`;
  }

  // ------------------------------------------------------------------ detail

  const IMAGE_WHAT = () => L('A read-only template: layers of files plus defaults such as the user and the command. Every container starts from an image and adds its own writable layer.', 'Una plantilla de solo lectura: capas de archivos más valores por defecto como el usuario y el comando. Todo contenedor arranca de una imagen y le suma su propia capa escribible.');

  function imageDetail(i) {
    const k = imgKind(i);
    const now = [`ID ${i.id}.` + (i.tags.length ? ` ${L('Tags', 'Tags')}: ${i.tags.join(', ')}.` : '')];
    if (i.tags.length > 1) now.push(L('Several tags with the same ID are names of the same image: removing one name leaves the image and its other names.', 'Varios tags con el mismo ID son nombres de la misma imagen: borrar un nombre deja la imagen y sus otros nombres.'));
    if (i.layers != null) now.push(L(`${plural(i.layers, 'layer', 'layers', '', '')} with content, ${num((i.size / 1e6).toFixed(1))} MB in all.`, `${plural(i.layers, '', '', 'capa', 'capas')} con contenido, ${num((i.size / 1e6).toFixed(1))} MB en total.`));
    now.push(i.users.length ? L(`Containers that use it: ${i.users.join(', ')}.`, `Contenedores que la usan: ${i.users.join(', ')}.`) : L('No container uses it now.', 'Ningún contenedor la usa ahora.'));
    if (k === 'base') {
      now.unshift(L(`Pinned as ${i.baseRef}.`, `Fijada como ${i.baseRef}.`));
      return { kind: L('IMAGE · PINNED BASE', 'IMAGEN · BASE FIJADA'), title: imgName(i), what: IMAGE_WHAT(), why: L('The application Dockerfile starts FROM it by digest, so every build starts from the same bytes even if the tag moves.', 'El Dockerfile de la aplicación parte de ella por digest: cada build arranca de los mismos bytes aunque el tag se mueva.'), now, acts: [['Read the digests Docker recorded', 'Leer los digests que registró Docker', 'digest']] };
    }
    if (k === 'node') return { kind: L('IMAGE · CLUSTER NODES', 'IMAGEN · NODOS DEL CLÚSTER'), title: imgName(i), what: IMAGE_WHAT(), why: L('kind runs every node of the practice cluster as a container made from this image.', 'kind corre cada nodo del clúster de práctica como un contenedor hecho con esta imagen.'), now, acts: [['List the nodes as Kubernetes sees them', 'Listar los nodos como los ve Kubernetes', 'nodes']] };
    // The lessons name these images by tag: each one gets the commands that name it.
    const acts = [];
    if (i.tags.includes('prumathe-signal:1.0.0')) acts.push(['Read its layers', 'Leer sus capas', 'history'], ['Read its default user and command', 'Leer su usuario y comando por defecto', 'defaults'], ['Read its full ID', 'Leer su ID completo', 'imageId']);
    if (i.tags.includes('prumathe-signal:1.1.0')) acts.push(['Build this version again', 'Construir otra vez esta versión', 'build']);
    if (i.tags.includes('prumathe-signal:practice')) acts.push(['Compare the ID of the other name', 'Comparar el ID del otro nombre', 'aliasId'], ['Remove only the practice name', 'Borrar solo el nombre practice', 'untag']);
    return { kind: L('IMAGE', 'IMAGEN'), title: imgName(i), what: IMAGE_WHAT(), why: L('The course application, built from labs/app. A new build with the same tag moves the name to a new ID; the previous image stays, without that name.', 'La aplicación del curso, construida desde labs/app. Un build nuevo con el mismo tag mueve el nombre a un ID nuevo; la imagen anterior queda, sin ese nombre.'), now, acts };
  }

  function containerDetail(c) {
    c = live(c);
    const S = ks();
    if (c.kind === 'node') {
      const n = S && S.nodes.find((x) => x.name === c.name);
      const now = [c.running ? L('Running.', 'Corriendo.') : L(`State ${c.state}.`, `Estado ${c.state}.`)];
      if (c.networks.length) now.push(c.networks.map((x) => L(`Network ${x[0]}, address ${x[1] || '?'}.`, `Red ${x[0]}, dirección ${x[1] || '?'}.`)).join(' '));
      if (n) now.push(L(`For Kubernetes: ${n.ready ? 'Ready' : 'NotReady'}, kubelet ${n.version}${n.taints.length ? ', taints ' + n.taints.join(', ') : ''}.`, `Para Kubernetes: ${n.ready ? 'Ready' : 'NotReady'}, kubelet ${n.version}${n.taints.length ? ', taints ' + n.taints.join(', ') : ''}.`));
      return { kind: L('CONTAINER · CLUSTER NODE', 'CONTENEDOR · NODO DEL CLÚSTER'), title: c.name, what: L('A container that kind uses as a Kubernetes node. Inside it run the kubelet, a container runtime and the containers of the Pods placed on that node.', 'Un contenedor que kind usa como nodo de Kubernetes. Adentro corren el kubelet, un runtime de contenedores y los contenedores de los Pods ubicados en ese nodo.'), why: c.role === 'control-plane' ? L('It runs the control plane: the API server that the viewer reads, the scheduler and the controllers.', 'Corre el plano de control: el API server que lee el visor, el scheduler y los controladores.') : L('It runs the Pods of the practice.', 'Corre los Pods de la práctica.'), now, acts: [['List the nodes as Kubernetes sees them', 'Listar los nodos como los ve Kubernetes', 'nodes']] };
    }
    const what = L('An isolated process created from an image, with its own writable layer, its network and its mounts.', 'Un proceso aislado creado desde una imagen, con su propia capa escribible, su red y sus montajes.') + ' ' + (c.service ? L(`Compose created it for the service ${c.service}.`, `Compose lo creó para el servicio ${c.service}.`) : L('It was created with docker run.', 'Se creó con docker run.'));
    let why = L('A container of the course.', 'Un contenedor del curso.');
    if (c.service === 'app') why = L(`It answers HTTP on port 8080 inside the container${c.ports.length ? ', published at ' + c.ports.map(portText).join(', ') + ' of your computer' : ''}.`, `Atiende HTTP en el puerto 8080 del contenedor${c.ports.length ? ', publicado en ' + c.ports.map(portText).join(', ') + ' de tu computadora' : ''}.`);
    else if (c.service === 'toolbox') why = L('It runs the probe against the app and exits: Compose creates one for each run.', 'Corre la prueba contra la app y termina: Compose crea uno en cada corrida.');
    else if (c.name === 'dk-life') why = L('The named container of lesson 02: stopping it keeps its writable layer; removing it throws the layer away.', 'El contenedor con nombre de la lección 02: pararlo conserva su capa escribible; borrarlo la descarta.');
    const now = [];
    if (c.state === 'running') now.push(L('Running.', 'Corriendo.'));
    else if (c.state === 'exited') now.push(L(`Stopped with exit code ${c.exit}.`, `Parado con código ${c.exit}.`));
    else if (c.state === 'created') now.push(L('Created, never started.', 'Creado, nunca arrancó.'));
    else now.push(L(`State ${c.state}.`, `Estado ${c.state}.`));
    if (c.health) {
      if (c.health.status === 'unhealthy') now.push(L(`Unhealthy: the health check failed ${c.health.streak} times in a row. The process keeps running: the health check reports, it does not restart the container or cut its traffic.`, `Unhealthy: el health check falló ${c.health.streak} veces seguidas. El proceso sigue corriendo: el health check informa, no reinicia el contenedor ni le corta el tráfico.`));
      else if (c.health.status === 'healthy') now.push(L('Healthy: the last health check passed.', 'Healthy: el último health check pasó.'));
      else now.push(L('Health: starting, waiting for the first checks.', 'Salud: arrancando, esperando los primeros checks.'));
    }
    now.push(L(`Image ${imageText(c)}.`, `Imagen ${imageText(c)}.`));
    if (c.user) now.push(L(`User ${c.user}.`, `Usuario ${c.user}.`));
    if (c.memory || c.cpus) now.push(L(`Limits: ${c.memory ? Math.round(c.memory / 1048576) + ' MiB of memory' : 'no memory limit'}, ${c.cpus ? num(c.cpus) + ' CPU' : 'no CPU limit'}.`, `Límites: ${c.memory ? Math.round(c.memory / 1048576) + ' MiB de memoria' : 'sin límite de memoria'}, ${c.cpus ? num(c.cpus) + ' CPU' : 'sin límite de CPU'}.`));
    for (const [k, v] of Object.entries(c.env || {})) now.push(`${k}=${v}`);
    if (c.restarts) now.push(L(`Restarted ${c.restarts} times.`, `Se reinició ${c.restarts} veces.`));
    let acts = [['See the containers of the project', 'Ver los contenedores del proyecto', 'ps']];
    if (c.service === 'app') {
      acts = [['Read health and process state', 'Leer salud y estado del proceso', 'health']];
      if (c.health && c.health.status === 'unhealthy') acts.push(['Remove the failure and wait for the next check', 'Quitar la falla y esperar el próximo check', 'heal']);
      else acts.push(['Make the health endpoint fail', 'Hacer fallar el endpoint de salud', 'fail']);
      acts.push(['Read its last log lines', 'Leer sus últimas líneas de log', 'logs'], ['Read the published address', 'Leer la dirección publicada', 'port'], ['Read its mounts', 'Leer sus montajes', 'mounts'], ['Read its limits', 'Leer sus límites', 'limits'], ['Replace the container', 'Reemplazar el contenedor', 'recreate']);
    } else if (c.name === 'dk-life') {
      acts = [['Read state and exit code', 'Leer estado y código de salida', 'life']];
      if (c.state === 'exited') acts.push(['Start the same container again', 'Arrancar el mismo contenedor otra vez', 'lifeStart'], ['Remove it, now that it is stopped', 'Borrarlo, ahora que está parado', 'lifeRm']);
    }
    return { kind: L('CONTAINER', 'CONTENEDOR'), title: c.name, what, why, now, acts };
  }

  function detail(id) {
    if (!id || !data) return null;
    const cut = id.indexOf('|');
    const kind = id.slice(0, cut);
    const name = id.slice(cut + 1);
    const D = dk();
    const S = ks();
    if (D && kind === 'image') {
      const i = D.images.find((x) => x.id === name);
      return i ? imageDetail(i) : null;
    }
    if (D && kind === 'container') {
      const c = D.containers.find((x) => x.name === name);
      return c ? containerDetail(c) : null;
    }
    if (D && kind === 'volume') {
      const v = D.volumes.find((x) => x.name === name);
      if (!v) return null;
      return { kind: L('VOLUME', 'VOLUMEN'), title: v.name, what: L('Storage that Docker manages outside any container. A container mounts it at a path; replacing the container leaves the volume and its data.', 'Almacenamiento que Docker administra fuera de los contenedores. Un contenedor lo monta en una ruta; reemplazar el contenedor deja el volumen y sus datos.'), why: L('So that data outlives the container: the app writes /data/marker and the next container reads it.', 'Para que los datos sobrevivan al contenedor: la app escribe /data/marker y el contenedor siguiente lo lee.'), now: [v.users.length ? v.users.map((u) => L(`Mounted by ${u[0]} at ${u[1]}.`, `Montado por ${u[0]} en ${u[1]}.`)).join(' ') : L('No container mounts it now; its data is still there.', 'Ningún contenedor lo monta ahora; sus datos siguen ahí.')], acts: [['Read the mounts of the app', 'Leer los montajes de la app', 'mounts'], ['Replace the app container', 'Reemplazar el contenedor de la app', 'recreate']] };
    }
    if (D && kind === 'network') {
      const n = D.networks.find((x) => x.name === name);
      if (!n) return null;
      const now = [n.members.length ? n.members.map((x) => `${x[0]} · ${x[1]}`).join(', ') + '.' : L('No containers.', 'Sin contenedores.')];
      if (n.name === 'kind') {
        now.push((D.visorNetworks || []).includes('kind') ? L('The viewer is on this network too.', 'El visor también está en esta red.') : L('The viewer is not on this network.', 'El visor no está en esta red.'));
        return { kind: L('NETWORK', 'RED'), title: n.name, what: L('The network where kind places the nodes of the cluster.', 'La red donde kind pone los nodos del clúster.'), why: L('The viewer joins it to reach the API server at prumathe-dk-control-plane:6443 by name.', 'El visor se suma a ella para llegar al API server en prumathe-dk-control-plane:6443 por nombre.'), now, acts: [['Connect the viewer', 'Conectar el visor', 'connect']] };
      }
      return { kind: L('NETWORK', 'RED'), title: n.name, what: L('The network that Compose creates for the project. Its containers reach each other by service name through the DNS of Docker.', 'La red que Compose crea para el proyecto. Sus contenedores se encuentran por nombre de servicio con el DNS de Docker.'), why: L('The toolbox reaches the app at http://app:8080 without publishing anything.', 'La toolbox llega a la app en http://app:8080 sin publicar nada.'), now, acts: [['Inspect who is on it', 'Ver quién está en ella', 'net']] };
    }
    if (!S) return null;
    if (kind === 'node') {
      const n = S.nodes.find((x) => x.name === name);
      if (!n) return null;
      const pods = S.pods.filter((p) => p.node === n.name).map((p) => p.name);
      const now = [L(`${n.ready ? 'Ready' : 'NotReady'}, kubelet ${n.version}${n.roles.length ? ', role ' + n.roles.join(', ') : ''}.`, `${n.ready ? 'Ready' : 'NotReady'}, kubelet ${n.version}${n.roles.length ? ', rol ' + n.roles.join(', ') : ''}.`)];
      if (n.taints.length) now.push(L(`Taints: ${n.taints.join(', ')}. Pods without a toleration are not placed here.`, `Taints: ${n.taints.join(', ')}. Los Pods sin una toleration no se ubican acá.`));
      now.push(L(`Allocatable CPU: ${n.cpu}.`, `CPU asignable: ${n.cpu}.`));
      now.push(pods.length ? L(`Pods of dk-lab here: ${pods.join(', ')}.`, `Pods de dk-lab acá: ${pods.join(', ')}.`) : L('No Pods of dk-lab here.', 'No hay Pods de dk-lab acá.'));
      return { kind: L('NODE', 'NODO'), title: n.name, what: L('A machine where Pods run. Here every node is a container that kind created.', 'Una máquina donde corren Pods. Acá cada nodo es un contenedor que creó kind.'), why: L('The scheduler places each Pod on a node that has room for its requests and whose taints it tolerates.', 'El scheduler ubica cada Pod en un nodo con lugar para sus requests y cuyos taints tolera.'), now, acts: [['List the nodes', 'Listar los nodos', 'nodes']] };
    }
    if (kind === 'deploy') {
      const d = S.deployments.find((x) => x.name === name);
      if (!d) return null;
      const now = [L(`Desired ${d.desired}, ready ${d.ready}, updated ${d.updated}, available ${d.available}.`, `Deseado ${d.desired}, listos ${d.ready}, actualizados ${d.updated}, disponibles ${d.available}.`), L(`Revision ${d.revision}, image ${d.image}.`, `Revisión ${d.revision}, imagen ${d.image}.`)];
      if (d.surge != null) now.push(L(`RollingUpdate with maxSurge ${d.surge} and maxUnavailable ${d.unavailable}: it adds new Pods before removing old ones.`, `RollingUpdate con maxSurge ${d.surge} y maxUnavailable ${d.unavailable}: suma Pods nuevos antes de sacar los viejos.`));
      if (d.envFrom.length) now.push(L(`Takes environment variables from ${d.envFrom.join(', ')}.`, `Toma variables de entorno de ${d.envFrom.join(', ')}.`));
      for (const [k, v] of Object.entries(d.env)) now.push(`${k}=${v}`);
      const res = d.resources;
      if (res.requests || res.limits) now.push(L(`Requests ${JSON.stringify(res.requests || {})}, limits ${JSON.stringify(res.limits || {})}.`, `Requests ${JSON.stringify(res.requests || {})}, limits ${JSON.stringify(res.limits || {})}.`));
      const acts = [['Read specification and status', 'Leer especificación y estado', 'desired'], ['Change the desired replicas', 'Cambiar las réplicas deseadas', 'scale'], ['See the ownership chain', 'Ver la cadena de dueños', 'chain'], ['Read the declared budgets', 'Leer los presupuestos declarados', 'budgets'], ['Follow the rollout', 'Seguir el rollout', 'rollout']];
      if (Number(d.revision) > 1) acts.push(['Go back to the previous revision', 'Volver a la revisión anterior', 'undo']);
      return { kind: 'DEPLOYMENT', title: d.name, what: L('It declares the desired state: which Pod template and how many replicas. Its controller makes the cluster match it through ReplicaSets.', 'Declara el estado deseado: qué plantilla de Pod y cuántas réplicas. Su controlador hace que el clúster coincida, a través de ReplicaSets.'), why: L('To change versions gradually and be able to go back: every change of the template is a new revision with its own ReplicaSet.', 'Para cambiar de versión de a poco y poder volver: cada cambio de la plantilla es una revisión nueva con su propio ReplicaSet.'), now, acts };
    }
    if (kind === 'rs') {
      const r = S.replicasets.find((x) => x.name === name);
      if (!r) return null;
      const now = [L(`Revision ${r.revision}, image ${r.image}.`, `Revisión ${r.revision}, imagen ${r.image}.`), L(`${r.ready} of ${r.desired} Pods ready.`, `${r.ready} de ${r.desired} Pods listos.`)];
      if (!r.desired) now.push(L('Zero replicas: it keeps its template, and rollout undo can go back to it.', 'Cero réplicas: guarda su plantilla y rollout undo puede volver a ella.'));
      if (r.hash) now.push(L(`Its Pods carry the label pod-template-hash=${r.hash}.`, `Sus Pods llevan la etiqueta pod-template-hash=${r.hash}.`));
      if (r.owner) now.push(L(`Owner: ${r.owner[0]} ${r.owner[1]}.`, `Dueño: ${r.owner[0]} ${r.owner[1]}.`));
      return { kind: 'REPLICASET', title: r.name, what: L('It keeps a number of identical Pods made from one template. The Deployment creates one for every version of the template and shares the replicas between them.', 'Mantiene una cantidad de Pods idénticos hechos con una plantilla. El Deployment crea uno por cada versión de la plantilla y reparte las réplicas entre ellos.'), why: L('To change versions gradually and be able to go back: the previous ReplicaSet stays with zero replicas and its template saved.', 'Para cambiar de versión de a poco y poder volver: el ReplicaSet anterior queda con cero réplicas y su plantilla guardada.'), now, acts: [['See the ownership chain', 'Ver la cadena de dueños', 'chain'], ['Follow the rollout', 'Seguir el rollout', 'rollout'], ['Go back to the previous revision', 'Volver a la revisión anterior', 'undo']] };
    }
    if (kind === 'pod') {
      const p = S.pods.find((x) => x.name === name);
      if (!p) return null;
      const owner = p.owner ? `${p.owner[0]} ${p.owner[1]}` : null;
      const now = [];
      if (p.terminating) now.push(L('Terminating: it leaves the endpoints and goes away when its containers stop.', 'Terminando: sale de los endpoints y se va cuando paran sus contenedores.'));
      else if (p.unschedulable) now.push(L('Pending: no node has room for its requests. The reason is in the events of the Pod.', 'Pendiente: ningún nodo tiene lugar para sus requests. El motivo está en los eventos del Pod.'));
      else if (p.waiting) now.push(L(`Waiting: ${p.waiting}.`, `Esperando: ${p.waiting}.`));
      else if (p.ready) now.push(L(`Ready on ${p.node}: Services send it traffic.`, `Ready en ${p.node}: los Services le mandan tráfico.`));
      else now.push(L(`${p.phase}, not Ready: Services do not send it traffic.`, `${p.phase}, no Ready: los Services no le mandan tráfico.`));
      now.push([p.ip ? 'IP ' + p.ip : '', 'UID ' + p.uid + '…', plural(p.restarts, 'restart', 'restarts', 'reinicio', 'reinicios')].filter(Boolean).join(' · '));
      now.push(L(`Image ${p.image}.`, `Imagen ${p.image}.`));
      const probes = Object.entries(p.probes || {});
      if (probes.length) now.push(L(`Probes: ${probes.map(([k, v]) => k + ' ' + (v || '')).join(', ')}.`, `Probes: ${probes.map(([k, v]) => k + ' ' + (v || '')).join(', ')}.`));
      if (p.claims.length) now.push(L(`Mounts the claim ${p.claims.join(', ')}.`, `Monta el claim ${p.claims.join(', ')}.`));
      if (p.envFrom.length) now.push(L(`Environment from ${p.envFrom.join(', ')}.`, `Entorno desde ${p.envFrom.join(', ')}.`));
      let acts = [];
      if (p.name === 'solo') acts = [['Read identity and placement', 'Leer identidad y ubicación', 'solo'], ['Read its UID', 'Leer su UID', 'soloUid'], ['Delete it: nothing creates it again', 'Borrarlo: nada lo vuelve a crear', 'soloDelete']];
      else if (p.name === 'writer') acts = [['Read what it wrote in the claim', 'Leer lo que escribió en el claim', 'writer'], ['Read the claim', 'Leer el claim', 'pvc']];
      else if (p.name === 'probe') acts = [['Read its three probes', 'Leer sus tres probes', 'probe'], p.ready ? ['Fail readiness only', 'Hacer fallar solo readiness', 'notReady'] : ['Restore readiness', 'Restaurar readiness', 'ready'], ['Read the endpoints of its Service', 'Leer los endpoints de su Service', 'probeSlices']];
      else if (p.name === 'no-room') acts = [['Read the scheduling reason', 'Leer el motivo de scheduling', 'noRoom']];
      else if (p.owner && p.owner[0] === 'ReplicaSet') acts = [['See the ownership chain', 'Ver la cadena de dueños', 'chain'], ['Delete the Pods of the app and watch them come back', 'Borrar los Pods de la app y verlos volver', 'deletePods']];
      return { kind: 'POD', title: p.name, what: L('The smallest unit that Kubernetes schedules: one or more containers that share an IP address and volumes.', 'La unidad más chica que ubica Kubernetes: uno o más contenedores que comparten una dirección IP y volúmenes.'), why: owner ? L(`${owner} owns it: if the Pod disappears, it creates another one, with a new name, UID and IP.`, `Es del ${owner}: si el Pod desaparece, crea otro, con nombre, UID e IP nuevos.`) : L('Nobody owns it: if it is deleted, nothing creates it again.', 'No tiene dueño: si se borra, nada lo vuelve a crear.'), now, acts };
    }
    if (kind === 'service') {
      const s = S.services.find((x) => x.name === name);
      if (!s) return null;
      const eps = S.endpointslices.filter((x) => x.service === s.name).flatMap((x) => x.endpoints);
      const now = [L(`${s.type} ${s.clusterIP}, ports ${s.ports.map((p) => p[0] + ' → ' + p[1]).join(', ')}.`, `${s.type} ${s.clusterIP}, puertos ${s.ports.map((p) => p[0] + ' → ' + p[1]).join(', ')}.`), L(`Selector ${Object.entries(s.selector).map(([k, v]) => k + '=' + v).join(', ')}.`, `Selector ${Object.entries(s.selector).map(([k, v]) => k + '=' + v).join(', ')}.`), L(`${eps.filter((x) => x.ready).length} of ${eps.length} endpoints ready.`, `${eps.filter((x) => x.ready).length} de ${eps.length} endpoints listos.`)];
      const acts = s.name === 'signal' ? [['Read the port translation', 'Leer la traducción de puertos', 'service'], ['Read the discovered backends', 'Leer los backends descubiertos', 'slices']] : s.name === 'probe-entry' ? [['Read its endpoints', 'Leer sus endpoints', 'probeSlices']] : [];
      return { kind: 'SERVICE', title: s.name, what: L('A stable name and virtual IP in front of the Pods that its selector matches.', 'Un nombre y una IP virtual estables delante de los Pods que elige su selector.'), why: L('Pods come and go with new IPs; clients use the name of the Service and the DNS of the cluster. Only ready endpoints get traffic.', 'Los Pods van y vienen con IPs nuevas; los clientes usan el nombre del Service y el DNS del clúster. Solo los endpoints listos reciben tráfico.'), now, acts };
    }
    if (kind === 'cm') {
      const c = S.configmaps.find((x) => x.name === name);
      if (!c) return null;
      const users = S.deployments.filter((d) => d.envFrom.includes(c.name)).map((d) => d.name);
      const now = Object.entries(c.data).map(([k, v]) => `${k}=${v}`);
      now.push(users.length ? L(`Imported by the Deployment ${users.join(', ')}.`, `Lo importa el Deployment ${users.join(', ')}.`) : L('No Deployment imports it now.', 'Ningún Deployment lo importa ahora.'));
      return { kind: 'CONFIGMAP', title: c.name, what: L('Configuration as key and value pairs, outside the image.', 'Configuración en pares de clave y valor, fuera de la imagen.'), why: L('The same image runs with different configuration; a change to it reaches the Pods through a new template.', 'La misma imagen corre con distinta configuración; un cambio llega a los Pods con una plantilla nueva.'), now, acts: c.name === 'signal-settings' ? [['Read it', 'Leerlo', 'configmap'], ['Import its values into the Deployment', 'Importar sus valores en el Deployment', 'fromCm']] : [] };
    }
    if (kind === 'secret') {
      const s = S.secrets.find((x) => x.name === name);
      if (!s) return null;
      return { kind: 'SECRET', title: s.name, what: L('Like a ConfigMap, for values that need more care: RBAC can deny reading them while other objects stay readable.', 'Como un ConfigMap, para valores que necesitan más cuidado: RBAC puede negar su lectura aunque el resto se pueda leer.'), why: L('The value travels in base64, which is an encoding, not encryption: whoever can read the Secret reads the value.', 'El valor viaja en base64, que es una codificación y no un cifrado: quien puede leer el Secret lee el valor.'), now: [L('The viewer lists only its name: it never reads its contents.', 'El visor lista solo su nombre: nunca lee su contenido.')], acts: [['See it without printing its values', 'Verlo sin imprimir sus valores', 'secret'], ['Check that observer cannot read Secrets', 'Comprobar que observer no puede leer Secrets', 'canSecrets']] };
    }
    if (kind === 'pvc') {
      const c = S.pvcs.find((x) => x.name === name);
      if (!c) return null;
      const pv = S.pvs.find((v) => v.name === c.volume);
      const now = [L(`${c.phase}, ${c.size}, ${c.modes.join(', ')}, class ${c.class}.`, `${c.phase}, ${c.size}, ${c.modes.join(', ')}, clase ${c.class}.`)];
      if (c.volume) now.push(L(`Bound to the volume ${c.volume}${pv ? ', reclaim policy ' + pv.reclaim : ''}.`, `Unido al volumen ${c.volume}${pv ? ', política de reclamo ' + pv.reclaim : ''}.`));
      now.push(c.users.length ? L(`Mounted by ${c.users.join(', ')}.`, `Montado por ${c.users.join(', ')}.`) : L('No Pod mounts it now; the data stays in the volume.', 'Ningún Pod lo monta ahora; los datos quedan en el volumen.'));
      return { kind: 'PERSISTENTVOLUMECLAIM', title: c.name, what: L('A request for storage: size and access mode. The cluster binds it to a PersistentVolume.', 'Un pedido de almacenamiento: tamaño y modo de acceso. El clúster lo une a un PersistentVolume.'), why: L('The data lives in the volume, not in the Pod: replace the Pod and the next one finds the same data.', 'Los datos viven en el volumen, no en el Pod: reemplazás el Pod y el siguiente encuentra los mismos datos.'), now, acts: [['Read the claim', 'Leer el claim', 'pvc'], ['Read what the writer left', 'Leer lo que dejó writer', 'writer']] };
    }
    if (kind === 'rbac') {
      const b = S.rbac.bindings.find((x) => x.name === name);
      if (!b) return null;
      const role = S.rbac.roles.find((r) => r.name === b.role);
      const now = [L(`Subjects: ${b.subjects.map((s) => s[0] + ' ' + s[1]).join(', ')}. Role: ${b.role}.`, `Sujetos: ${b.subjects.map((s) => s[0] + ' ' + s[1]).join(', ')}. Role: ${b.role}.`)];
      if (role) for (const r of role.rules) now.push(`${r[1].join(', ')}: ${r[2].join(', ')}`);
      return { kind: 'ROLEBINDING', title: b.name, what: L('A RoleBinding gives the verbs of a Role, in this namespace, to the subjects it names.', 'Un RoleBinding le da los verbos de un Role, en este namespace, a los sujetos que nombra.'), why: L('Least privilege: grant the verbs that a process needs and nothing else.', 'Mínimo privilegio: otorgar los verbos que un proceso necesita y nada más.'), now, acts: [['Check the permitted action', 'Comprobar la acción permitida', 'canList'], ['Check a denied destructive action', 'Comprobar una acción destructiva negada', 'canDelete'], ['Check a denied data read', 'Comprobar una lectura de datos negada', 'canSecrets']] };
    }
    return null;
  }

  function aside() {
    const d = detail(sel);
    if (!d) return `<aside class="side"><div class="hintbox">${L('Select an image, a container, a volume, a node, a Pod, a ReplicaSet, a Service or any other object to see what it is, what it is for, what it shows now and which commands of the course act on it.', 'Elegí una imagen, un contenedor, un volumen, un nodo, un Pod, un ReplicaSet, un Service o cualquier otro objeto para ver qué es, para qué sirve, qué muestra ahora y qué comandos del curso actúan sobre él.')}</div></aside>`;
    const acts = (d.acts || []).filter((a) => CMDS[a[2]]);
    const actions = acts.length ? `<div class="block"><span class="eyebrow">${L('WHAT YOU CAN DO', 'QUÉ PODÉS HACER')}</span><p class="muted">${L('From the labs folder.', 'Desde la carpeta labs.')}</p>${acts.map(([en, es, k]) => `<p>${e(L(en, es))} (${e(lessonRef(CMDS[k][0]))}):</p><code>${e(CMDS[k][1])}</code>`).join('')}</div>` : '';
    return `<aside class="side"><div class="detail"><div class="detail-head"><div><span class="eyebrow">${e(d.kind)}</span><h2>${e(d.title)}</h2></div><button class="close" data-act="close" aria-label="${L('Close', 'Cerrar')}">×</button></div><div class="block"><span class="eyebrow">${L('WHAT IT IS', 'QUÉ ES')}</span><p>${e(d.what)}</p></div>${d.why ? `<div class="block"><span class="eyebrow">${L('WHAT IT IS FOR', 'PARA QUÉ SIRVE')}</span><p>${e(d.why)}</p></div>` : ''}${d.now.length ? `<div class="block now"><span class="eyebrow">${L('WHAT IT SHOWS NOW', 'QUÉ MUESTRA AHORA')}</span>${d.now.map((x) => `<p>${e(x)}</p>`).join('')}</div>` : ''}${actions}</div></aside>`;
  }

  function footer() {
    return `<footer class="foot">${L('The viewer only makes GET requests to the Docker socket and to the Kubernetes API, and it never reads the contents of a Secret. The socket would give it full control of the daemon and the course kubeconfig is an administrator one: what guarantees that it only reads is its code, and the visor suite checks it. It shows what belongs to the course; the rest of your computer does not appear.', 'El visor solo hace GET al socket de Docker y al API de Kubernetes, y nunca lee el contenido de un Secret. El socket le daría control total del daemon y el kubeconfig del curso es de administrador: lo que garantiza que solo lee es su código, y la suite visor lo comprueba. Muestra lo del curso; el resto de tu computadora no aparece.')}</footer>`;
  }

  function waitScreen(title, text, code) {
    return `<div class="wait"><h1>${e(title)}</h1><p>${e(text)}</p>${code ? `<code>${e(code)}</code>` : ''}</div>`;
  }

  // ------------------------------------------------------------------ drawing

  let rendering = false;
  let queued = false;

  function render() {
    if (rendering) {
      queued = true;
      return;
    }
    rendering = true;
    try {
      draw();
    } finally {
      rendering = false;
    }
    if (queued) {
      queued = false;
      requestAnimationFrame(render);
    }
  }

  function applyHover() {
    for (const el of app.querySelectorAll('.hl')) el.classList.remove('hl');
    if (hoverPod) for (const el of app.querySelectorAll(`[data-pod="${CSS.escape(hoverPod)}"]`)) el.classList.add('hl');
  }

  function draw() {
    document.documentElement.lang = lang;
    document.title = L('Live viewer · Docker and Kubernetes from scratch', 'Visor en vivo · Docker y Kubernetes desde cero');
    if (!local) {
      app.innerHTML = header() + waitScreen(L('This viewer runs on your computer', 'Este visor corre en tu computadora'), L(`Start it from the labs folder of the kit and open http://127.0.0.1:${PORT}:`, `Levantalo desde la carpeta labs del kit y abrí http://127.0.0.1:${PORT}:`), CMDS.visor[1]) + footer();
      return;
    }
    if (!data) {
      app.innerHTML = header() + waitScreen(L('Waiting for the viewer', 'Esperando el visor'), L('This page fills in by itself when the visor service answers. From labs:', 'Esta página se completa sola cuando responde el servicio visor. Desde labs:'), CMDS.visor[1]) + footer();
      return;
    }
    const active = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset : null;
    const focused = active ? (active.sel ? ['sel', active.sel] : active.act ? ['act', active.act] : null) : null;
    const shown = shownPlane();
    app.innerHTML = header() + planes(shown) + `<div class="body"><main class="main">${shown === 'k8s' ? k8sPlane() : dockerPlane()}${feed()}</main>${aside()}</div>` + footer();
    if (focused) {
      const again = app.querySelector(`[data-${focused[0]}="${CSS.escape(focused[1])}"]`);
      if (again) again.focus({ preventScroll: true });
    }
    applyHover();
  }

  function renderStatus() {
    const s = $('#status');
    if (!s) return render();
    s.innerHTML = statusHtml();
  }

  // ------------------------------------------------------------------ input

  app.addEventListener('click', (ev) => {
    if (rendering) return;
    const el = ev.target.closest('[data-act], [data-sel]');
    if (!el) return;
    if (el.dataset.act) {
      const a = el.dataset.act;
      if (a === 'pause') paused = !paused;
      else if (a === 'en' || a === 'es') {
        lang = a;
        store.set('dk-visor-lang', a);
      } else if (a === 'follow') tab = null;
      else if (a === 'docker' || a === 'k8s') tab = a;
      else if (a === 'close') sel = null;
      render();
      return;
    }
    sel = el.dataset.sel;
    render();
  });

  function hoverFrom(ev) {
    if (rendering) return;
    const el = ev.target && ev.target.closest ? ev.target.closest('[data-pod]') : null;
    const pod = el ? el.dataset.pod : null;
    if (pod !== hoverPod) {
      hoverPod = pod;
      applyHover();
    }
  }
  app.addEventListener('mouseover', hoverFrom);
  app.addEventListener('focusin', hoverFrom);
  app.addEventListener('mouseleave', () => {
    hoverPod = null;
    applyHover();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && sel) {
      sel = null;
      render();
    }
  });

  // ------------------------------------------------------------------ polling

  async function tick() {
    let changed = false;
    try {
      const r = await fetch('/api/state?v=' + version, { cache: 'no-store' });
      const j = await r.json();
      status = { readAt: j.readAt, reached: true, lostAt: 0 };
      if (j.same) {
        if (data) for (const p of ['docker', 'k8s']) if (data[p] && j[p]) data[p].readAt = j[p].readAt;
      } else {
        data = j;
        version = j.version;
        markNew();
        changed = true;
      }
    } catch {
      if (status.reached) status = { ...status, reached: false, lostAt: Date.now() };
    }
    const nowNew = anyNew();
    try {
      if (!paused && (changed || nowNew || hadNew)) render();
      else renderStatus();
    } finally {
      hadNew = nowNew;
      setTimeout(tick, POLL_MS); // a failed redraw must not stop the reading
    }
  }

  render();
  if (local) tick();
})();
