/* Live viewer of the course cluster. Asks /api/state every half second and redraws only when the
   cluster changed or the reader did something. Everything that comes from the cluster (names,
   keys, values, headers) is escaped before it reaches the page. */
(() => {
  'use strict';

  const POLL_MS = 500;
  const NEW_MS = 4000;
  const LAB = 'docker compose run --rm lab ';

  // Lesson topic labN -> [lesson number, title EN, title ES]. scripts/check.mjs compares it with
  // the curriculum, so a lesson that changes its topic fails the check until this table follows.
  const LESSONS = {"1":["02","An event is a fact","Un evento es un hecho"],"2":["03","Inside a record","Adentro de un mensaje"],"3":["04","One topic, many logs","Un tópico, varios logs"],"4":["05","Keys choose a lane","Las claves eligen un carril"],"5":["06","The producer’s waiting room","La sala de espera del productor"],"6":["07","One stream, independent teams","Un flujo, equipos independientes"],"7":["08","A bookmark, not a receipt","Un señalador, no un recibo"],"8":["09","When the team changes","Cuando cambia el equipo"],"9":["10","Copies that follow a leader","Copias que siguen a un líder"],"10":["11","What does “saved” mean?","¿Qué significa «guardado»?"],"11":["12","Who keeps the cluster’s map?","¿Quién guarda el mapa del clúster?"],"12":["13","History has a horizon","La historia tiene un horizonte"],"13":["14","Keep the latest known value","Conservá el último valor conocido"],"14":["15","The crash between two actions","La caída entre dos acciones"],"15":["16","Two different kinds of duplicate","Dos clases distintas de duplicado"],"16":["17","Make the boundary atomic","Hacé atómico el límite"],"17":["18","A contract that can evolve","Un contrato que puede evolucionar"],"18":["19","Move data without a custom loop","Mové datos sin escribir otro loop"],"19":["20","From a database to an event","De una base de datos a un evento"],"20":["21","A stream becomes a table","Un flujo se convierte en tabla"],"21":["22","Which minute does it belong to?","¿A qué minuto pertenece?"],"22":["23","Identity, permission, privacy","Identidad, permiso, privacidad"],"23":["24","Observe the system, not one light","Observá el sistema, no una luz"],"24":["25","Scale the right dimension","Escalá la dimensión correcta"],"25":["26","A second cluster is another system","Un segundo clúster es otro sistema"],"26":["27","When work sharing is the goal","Cuando el objetivo es repartir tareas"],"27":["28","Ship an order. Survive a failure.","Entregá un pedido. Sobreviví a una falla."]};

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
  let lang = query.get('lang') || store.get('visor-lang') || ((navigator.language || '').startsWith('es') ? 'es' : 'en');
  if (lang !== 'es') lang = 'en';

  let data = null;
  let version = 0;
  let status = { ok: false, error: 'Starting', readAt: 0, reached: false };
  let paused = false;
  let pinned = null; // topic chosen by the reader; null follows the activity
  let sel = null; // selected object id
  let hover = null; // record id under the pointer or the focus
  let internal = false;
  const seen = new Map(); // record id -> first time it appeared
  let firstLoad = true;
  let lastGood = 0; // time of the last reading in which the cluster answered

  const L = (en, es) => (lang === 'es' ? es : en);
  const e = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const $ = (s) => document.querySelector(s);
  const app = $('#app');

  // ------------------------------------------------------------------ data helpers

  const lessonOf = (name) => {
    const m = /^lab(\d+)$/.exec(name);
    return m && LESSONS[m[1]] ? { n: Number(m[1]), id: LESSONS[m[1]][0], title: L(LESSONS[m[1]][1], LESSONS[m[1]][2]) } : null;
  };
  const topicByName = (name) => (data ? data.topics.find((t) => t.name === name) : null);
  const groupById = (id) => (data ? data.groups.find((g) => g.id === id) : null);
  const committed = (g, topic, p) => {
    const o = g.offsets.find((x) => x[0] === topic && x[1] === p);
    return o ? o[2] : null;
  };
  const groupsOf = (topic) =>
    data.groups.filter((g) => g.offsets.some((o) => o[0] === topic) || g.members.some((m) => m.assigned.some((a) => a[0] === topic)));
  const colorOf = (id) => {
    let h = 0;
    for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return 'g' + (h % 6);
  };
  const recId = (t, p, o) => `rec:${t}:${p}:${o}`;
  const lessonTopics = () =>
    data.topics
      .filter((t) => lessonOf(t.name))
      .sort((a, b) => lessonOf(a.name).n - lessonOf(b.name).n);
  const otherTopics = () => data.topics.filter((t) => !lessonOf(t.name) && (internal || !t.internal));
  const fmtTime = (ms) => new Date(ms).toLocaleTimeString(lang === 'es' ? 'es-AR' : 'en-GB', { hour12: false });
  const fmtStamp = (ms) => {
    const d = new Date(ms);
    return d.toLocaleTimeString(lang === 'es' ? 'es-AR' : 'en-GB', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
  };
  const pretty = (v) => {
    if (v == null) return 'null';
    try {
      const j = JSON.parse(v);
      if (j && typeof j === 'object') return JSON.stringify(j, null, 2);
    } catch {}
    return v;
  };
  const upBroker = () => (data.brokers.find((b) => b.up) || { id: 1 }).id;

  // The topic on screen: the one the reader pinned, else the lesson topic that changed last.
  function currentTopic() {
    if (pinned && topicByName(pinned)) return topicByName(pinned);
    for (const ev of data.events) {
      if (ev.topic && topicByName(ev.topic) && lessonOf(ev.topic)) return topicByName(ev.topic);
    }
    const lt = lessonTopics();
    if (lt.length) return lt[lt.length - 1];
    return data.topics.find((t) => !t.internal) || null;
  }

  function markNew() {
    const now = Date.now();
    for (const t of data.topics)
      for (const p of t.partitions)
        for (const r of p.records) {
          const id = recId(t.name, p.p, r.o);
          if (!seen.has(id)) seen.set(id, firstLoad ? 0 : now);
        }
    firstLoad = false;
  }
  const isNew = (id) => Date.now() - (seen.get(id) || 0) < NEW_MS;
  const anyNew = () => [...seen.values()].some((t) => Date.now() - t < NEW_MS);

  // ------------------------------------------------------------------ events

  const states = {
    Stable: ['shared out and reading', 'repartido y leyendo'],
    Empty: ['no consumers; its bookmarks stay saved', 'sin consumidores; sus señaladores siguen guardados'],
    PreparingRebalance: ['rebalancing: the assignment is changing', 'rebalanceando: el reparto está cambiando'],
    CompletingRebalance: ['rebalancing: the assignment is changing', 'rebalanceando: el reparto está cambiando'],
    Reconciling: ['rebalancing: members are taking their new partitions', 'rebalanceando: los miembros toman sus particiones nuevas'],
    Assigning: ['rebalancing: the assignment is changing', 'rebalanceando: el reparto está cambiando'],
    Dead: ['deleted', 'borrado'],
  };
  const stateText = (s) => (states[s] ? L(states[s][0], states[s][1]) : s);
  const list = (xs) => xs.map((x) => 'B' + x).join(', ') || L('none', 'ninguna');

  function eventText(ev) {
    switch (ev.code) {
      case 'start':
        return L(`The viewer started reading: ${ev.brokers} brokers, ${ev.topics} lesson topics.`, `El visor empezó a leer: ${ev.brokers} brokers, ${ev.topics} tópicos de lección.`);
      case 'brokerDown':
        return L(`Broker ${ev.broker} stopped responding.`, `El broker ${ev.broker} dejó de responder.`);
      case 'brokerUp':
        return L(`Broker ${ev.broker} is back.`, `El broker ${ev.broker} volvió.`);
      case 'controller':
        return ev.from < 0
          ? L(`The active controller is broker ${ev.to}.`, `El controlador activo es el broker ${ev.to}.`)
          : L(`The active controller moved from broker ${ev.from} to broker ${ev.to}.`, `El controlador activo pasó del broker ${ev.from} al broker ${ev.to}.`);
      case 'topicCreated':
        if (ev.internal) return L(`Kafka created its internal topic ${ev.topic} (${ev.partitions} partitions).`, `Kafka creó su tópico interno ${ev.topic} (${ev.partitions} particiones).`);
        return L(`${ev.topic} was created: ${ev.partitions} partitions with ${ev.rf} replicas each.`, `Se creó ${ev.topic}: ${ev.partitions} particiones con ${ev.rf} réplicas cada una.`);
      case 'topicDeleted':
        return L(`${ev.topic} was deleted.`, `Se borró ${ev.topic}.`);
      case 'partitionsAdded':
        return L(`${ev.topic} went from ${ev.from} to ${ev.to} partitions.`, `${ev.topic} pasó de ${ev.from} a ${ev.to} particiones.`);
      case 'records': {
        const parts = ev.parts.map((x) => `P${x[0]} +${x[1]}`).join(', ');
        return L(`${ev.topic} received ${ev.count} record${ev.count === 1 ? '' : 's'}: ${parts}.`, `${ev.topic} recibió ${ev.count} registro${ev.count === 1 ? '' : 's'}: ${parts}.`);
      }
      case 'startMoved':
        return L(`${ev.topic} P${ev.p}: the start of the log moved from ${ev.from} to ${ev.to}; what was before can no longer be read.`, `${ev.topic} P${ev.p}: el inicio del log pasó de ${ev.from} a ${ev.to}; lo anterior ya no se puede leer.`);
      case 'leader':
        return ev.to < 0
          ? L(`${ev.topic} P${ev.p} has no leader: it cannot be read or written.`, `${ev.topic} P${ev.p} quedó sin líder: no se puede leer ni escribir.`)
          : ev.from < 0
            ? L(`${ev.topic} P${ev.p}: B${ev.to} is the leader again.`, `${ev.topic} P${ev.p}: B${ev.to} vuelve a ser líder.`)
            : L(`${ev.topic} P${ev.p}: the leader moved from B${ev.from} to B${ev.to}.`, `${ev.topic} P${ev.p}: el líder pasó de B${ev.from} a B${ev.to}.`);
      case 'isr':
        return L(`${ev.topic} P${ev.p}: in-sync replicas went from ${list(ev.from)} to ${list(ev.to)}.`, `${ev.topic} P${ev.p}: el ISR pasó de ${list(ev.from)} a ${list(ev.to)}.`);
      case 'internalMoved':
        return L(`${ev.topic}, Kafka’s internal topic: ${ev.leaders} partitions changed leader and ${ev.isr} changed in-sync replicas.`, `${ev.topic}, tópico interno de Kafka: ${ev.leaders} particiones cambiaron de líder y ${ev.isr} de ISR.`);
      case 'groupCreated':
        return L(`Group ${ev.group} appeared.`, `Apareció el grupo ${ev.group}.`);
      case 'groupDeleted':
        return L(`Group ${ev.group} was deleted.`, `Se borró el grupo ${ev.group}.`);
      case 'groupState':
        return L(`${ev.group} went from ${ev.from} to ${ev.to}: ${stateText(ev.to)}.`, `${ev.group} pasó de ${ev.from} a ${ev.to}: ${stateText(ev.to)}.`);
      case 'assignment':
        if (ev.members === 0) return L(`${ev.group} has no consumers left; its bookmarks stay saved.`, `${ev.group} se quedó sin consumidores; sus señaladores siguen guardados.`);
        return L(`${ev.group}: the partitions were shared out again among ${ev.members} consumer${ev.members === 1 ? '' : 's'}.`, `${ev.group}: se volvieron a repartir las particiones entre ${ev.members} consumidor${ev.members === 1 ? '' : 'es'}.`);
      case 'commit': {
        const parts = ev.parts.map((x) => `P${x[0]} → ${x[2]}`).join(', ');
        return L(`${ev.group} saved its bookmark in ${ev.topic}: ${parts}.`, `${ev.group} guardó su señalador en ${ev.topic}: ${parts}.`);
      }
      default:
        return ev.code;
    }
  }

  // ------------------------------------------------------------------ the detail panel

  function cmd(text, command) {
    return { text, cmd: command || '' };
  }

  function detail(id) {
    if (!id || !data) return null;
    const [kind, ...rest] = id.split(':');
    const gone = { kind: L('GONE', 'YA NO ESTÁ'), title: id.split(':').slice(1).join(' '), what: L('It is no longer in the cluster.', 'Ya no existe en el clúster.'), why: '', now: [], actions: [] };
    if (kind === 'broker') {
      const b = data.brokers.find((x) => String(x.id) === rest[0]);
      if (!b) return gone;
      const leads = data.topics.filter((t) => !t.internal).flatMap((t) => t.partitions.filter((p) => p.leader === b.id).map((p) => `${t.name} P${p.p}`));
      const k = b.up ? b.id : upBroker();
      return {
        kind: 'BROKER',
        title: L('Broker ', 'Broker ') + b.id,
        what: L('A Kafka server. It keeps partition replicas on its disk and serves producers and consumers. In this lab each broker is also a controller (KRaft): the three of them keep the map of the cluster.', 'Un servidor de Kafka. Guarda en su disco réplicas de particiones y atiende a productores y consumidores. En este laboratorio cada broker también es controlador (KRaft): entre los tres llevan el mapa del clúster.'),
        why: L('To spread data and load: each partition has its leader on one broker and copies on others, so the cluster keeps serving when one fails.', 'Repartir datos y carga: cada partición tiene su líder en un broker y copias en otros, así el clúster sigue sirviendo si uno se cae.'),
        now: [
          b.up ? L('Responding.', 'Responde.') : L('Not responding.', 'No responde.'),
          data.controller === b.id ? L('Active controller.', 'Controlador activo.') : '',
          leads.length ? L('Leader of ', 'Líder de ') + leads.join(', ') + '.' : L('Leader of no lesson partition.', 'No es líder de ninguna partición de lección.'),
        ].filter(Boolean),
        actions: [
          b.up ? cmd(L('Stop it to see what a failure does (lesson 10):', 'Detenerlo para ver qué pasa cuando falla (lección 10):'), `docker compose stop kafka${b.id}`) : cmd(L('Start it again:', 'Volver a levantarlo:'), 'docker compose up -d --wait'),
          cmd(L('See who the active controller is (lesson 12):', 'Ver quién es el controlador activo (lección 12):'), `docker compose exec kafka${k} /opt/kafka/bin/kafka-metadata-quorum.sh --bootstrap-server kafka${k}:9092 describe --status`),
        ],
      };
    }
    if (kind === 'topic') {
      const t = topicByName(rest.join(':'));
      if (!t) return gone;
      const les = lessonOf(t.name);
      const stored = t.partitions.reduce((s, p) => s + Math.max(0, p.end - p.start), 0);
      const rf = t.partitions.length ? t.partitions[0].replicas.length : 0;
      const cfg = Object.entries(t.config).map(([k, v]) => `${k} ${v}`).join(' · ');
      const special = {
        __consumer_offsets: L('Kafka’s internal topic where consumer groups keep their bookmarks (lesson 08).', 'El tópico interno donde Kafka guarda los señaladores de los grupos (lección 08).'),
        __transaction_state: L('Kafka’s internal topic where the transaction coordinator keeps its state (lesson 17).', 'El tópico interno donde el coordinador de transacciones guarda su estado (lección 17).'),
      };
      const k = upBroker();
      return {
        kind: t.internal ? L('INTERNAL TOPIC', 'TÓPICO INTERNO') : L('TOPIC', 'TÓPICO'),
        title: t.name,
        what: special[t.name] || L('A name for a stream of events, split into partitions. Each partition is an ordered log that only grows at its end.', 'Un nombre para un flujo de eventos, partido en particiones. Cada partición es un log ordenado al que solo se le agrega al final.'),
        why: L('To keep facts of one kind together so that many readers can read them at their own pace, each group with its own bookmark.', 'Juntar los hechos de un mismo tipo para que muchos lectores los lean a su ritmo, cada grupo con su propio señalador.'),
        now: [
          les ? L(`Topic of lesson ${les.id}: ${les.title}.`, `Tópico de la lección ${les.id}: ${les.title}.`) : '',
          L(`${t.partitions.length} partition${t.partitions.length === 1 ? '' : 's'} · ${rf} replicas each · ${stored} offsets between start and end.`, `${t.partitions.length} partici${t.partitions.length === 1 ? 'ón' : 'ones'} · ${rf} réplicas cada una · ${stored} offsets entre inicio y fin.`),
          cfg,
        ].filter(Boolean),
        actions: les
          ? [
              cmd(L('Prepare it from scratch for its lesson (stop that lesson’s consumers first; it touches nothing else):', 'Prepararlo de cero para su lección (pará antes sus consumidores; no toca nada más):'), LAB + 'prepare ' + les.n),
              cmd(L('See partitions, leaders and in-sync replicas:', 'Ver particiones, líderes e ISR:'), LAB + 'describe ' + les.n),
              cmd(L('Read all its records:', 'Leer todos sus registros:'), LAB + 'read ' + les.n),
              cmd(L('Add a partition. It can only grow, and it changes where new keys go (lesson 05):', 'Agregar una partición. Solo se puede aumentar, y cambia a qué partición va cada clave nueva (lección 05):'), LAB + 'expand ' + les.n + ' ' + (t.partitions.length + 1)),
            ]
          : [cmd(L('Describe it:', 'Describirlo:'), `docker compose exec kafka${k} /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka${k}:9092 --describe --topic ${t.name}`)],
      };
    }
    if (kind === 'part' || kind === 'end' || kind === 'rep' || kind === 'rec') {
      const name = rest[0];
      const t = topicByName(name);
      const p = t && t.partitions.find((x) => String(x.p) === rest[1]);
      if (!p) return gone;
      const les = lessonOf(name);
      const n = les ? les.n : null;
      const minIsr = Number(t.config['min.insync.replicas'] || 1);
      const where = `${name} / P${p.p}`;
      if (kind === 'part') {
        return {
          kind: L('PARTITION', 'PARTICIÓN'),
          title: where,
          what: L('An ordered log: each new record goes at the end and gets the next offset. Order holds inside a partition, not across partitions.', 'Un log ordenado: cada registro nuevo va al final y recibe el offset siguiente. El orden vale dentro de la partición, no entre particiones.'),
          why: L('It is the unit of parallelism: inside a group, each partition is read by a single consumer at a time.', 'Es la unidad de paralelismo: dentro de un grupo, cada partición la lee un solo consumidor a la vez.'),
          now: [
            L(`Start ${p.start}, end ${p.end}: ${Math.max(0, p.end - p.start)} offsets. In a compacted topic or one with transactions not every offset holds a record.`, `Inicio ${p.start}, fin ${p.end}: ${Math.max(0, p.end - p.start)} offsets. En un tópico compactado o con transacciones no todos tienen registro.`),
            p.leader < 0 ? L('No leader.', 'Sin líder.') : L(`Leader B${p.leader}; replicas ${list(p.replicas)}; in sync ${list(p.isr)}.`, `Líder B${p.leader}; réplicas ${list(p.replicas)}; en sincronía ${list(p.isr)}.`),
          ],
          actions: n
            ? [
                cmd(L('See start and end of every partition:', 'Ver inicio y fin de cada partición:'), LAB + 'offsets ' + n),
                cmd(L('Write one record. The key picks the partition: the same key always lands in the same one.', 'Escribir un registro. La clave decide la partición: la misma clave cae siempre en la misma.'), LAB + 'put ' + n + ' order-9 ' + L('hello', 'hola')),
              ]
            : [],
        };
      }
      if (kind === 'end') {
        return {
          kind: L('END OF THE LOG', 'FIN DEL LOG'),
          title: `${where} · offset ${p.end}`,
          what: L(`The next offset of P${p.p}. Kafka reports as end the high watermark: up to here are the records already copied to the in-sync replicas, which are the ones consumers can read.`, `El próximo offset de P${p.p}. Kafka informa como fin el high watermark: hasta acá llegan los registros ya copiados en las réplicas del ISR, que son los que los consumidores pueden leer.`),
          why: L('Subtract a group’s bookmark from it and you get its lag: how many records it still has to read.', 'Restándole el señalador de un grupo se obtiene su lag: cuántos registros le faltan leer.'),
          now: [L(`End ${p.end}; start ${p.start}.`, `Fin ${p.end}; inicio ${p.start}.`)],
          actions: n ? [cmd(L('See start and end of every partition:', 'Ver inicio y fin de cada partición:'), LAB + 'offsets ' + n)] : [],
        };
      }
      if (kind === 'rep') {
        const b = Number(rest[2]);
        const leader = p.leader === b;
        const inIsr = p.isr.includes(b);
        return {
          kind: leader ? L('LEADER REPLICA', 'RÉPLICA LÍDER') : L('FOLLOWER REPLICA', 'RÉPLICA SEGUIDORA'),
          title: L(`P${p.p} on broker ${b}`, `P${p.p} en el broker ${b}`),
          what: leader
            ? L(`The copy of P${p.p} that takes the writes and serves the reads. The others copy from it.`, `La copia de P${p.p} que recibe las escrituras y atiende las lecturas. Las demás copian de ella.`)
            : inIsr
              ? L(`A copy of P${p.p} that keeps up by reading from the leader. It is in sync (ISR): if the leader fails it can take over without losing acknowledged records.`, `Una copia de P${p.p} que se mantiene al día leyendo del líder. Está en el ISR: si el líder cae, puede reemplazarlo sin perder registros confirmados.`)
              : L(`A copy of P${p.p} that fell behind or whose broker is not responding. It is out of sync: it does not count to acknowledge writes with acks=all.`, `Una copia de P${p.p} que quedó atrasada o cuyo broker no responde. Está fuera del ISR: no cuenta para confirmar escrituras con acks=all.`),
          why: L(`So that an acknowledged record survives a broker failure. With min.insync.replicas ${minIsr}, a write with acks=all needs at least ${minIsr} replicas in sync.`, `Que un registro confirmado sobreviva a la caída de un broker. Con min.insync.replicas ${minIsr}, una escritura con acks=all necesita al menos ${minIsr} réplicas en el ISR.`),
          now: [L(`In sync: ${list(p.isr)}. Leader: ${p.leader < 0 ? 'none' : 'B' + p.leader}.`, `En sincronía: ${list(p.isr)}. Líder: ${p.leader < 0 ? 'ninguno' : 'B' + p.leader}.`)],
          actions: [
            n ? cmd(L('See leader, replicas and in-sync replicas:', 'Ver líder, réplicas e ISR:'), LAB + 'describe ' + n) : null,
            p.leader > 0 ? cmd(L('Force a leader change by stopping the leader’s broker (lesson 10):', 'Provocar un cambio de líder apagando el broker del líder (lección 10):'), `docker compose stop kafka${p.leader}`) : null,
            cmd(L('Bring back the stopped brokers:', 'Volver a levantar los brokers detenidos:'), 'docker compose up -d --wait'),
          ].filter(Boolean),
        };
      }
      const o = Number(rest[2]);
      const r = p.records.find((x) => x.o === o);
      if (!r) return gone;
      const gs = groupsOf(name);
      const read = gs.filter((g) => (committed(g, name, p.p) ?? -1) > o).map((g) => g.id);
      const unread = gs.filter((g) => !read.includes(g.id)).map((g) => g.id);
      const headers = r.h.length ? r.h.map((h) => `${h[0]}=${h[1] ?? 'null'}`).join(', ') : L('none', 'ninguno');
      return {
        kind: L('RECORD', 'REGISTRO'),
        title: `${where} · offset ${o}`,
        what: L('A stored event: key, value, headers and timestamp, at a fixed position of the partition. It cannot be changed.', 'Un evento guardado: clave, valor, encabezados y marca de tiempo, en una posición fija de la partición. No se modifica.'),
        why: L('To tell a fact that already happened. Reading it does not remove it: it stays for the next group and for reading it again.', 'Contar un hecho que ya pasó. Leerlo no lo borra: sigue ahí para el próximo grupo y para volver a leerlo.'),
        now: [
          read.length ? L('Already read by ', 'Ya lo leyó ') + read.join(', ') + '.' : '',
          unread.length ? L('Not yet read by ', 'Todavía no lo leyó ') + unread.join(', ') + '.' : '',
          !gs.length ? L('No group reads this topic.', 'Ningún grupo lee este tópico.') : '',
          r.v === null && /compact/.test(t.config['cleanup.policy'] || '')
            ? L('Its value is null: it is a tombstone, which tells compaction to remove this key (lesson 14).', 'Su valor es null: es un tombstone, que le indica a la compactación que borre esta clave (lección 14).')
            : '',
        ].filter(Boolean),
        content: `${L('key', 'clave')}         ${r.k ?? 'null'}\n${L('value', 'valor')}         ${pretty(r.v).replace(/\n/g, '\n              ')}\ntimestamp     ${fmtStamp(r.ts)}\n${L('headers', 'encabezados')}   ${headers}\n${L('size', 'tamaño')}        ${L('key', 'clave')} ${r.kb < 0 ? 'null' : r.kb + ' B'} · ${L('value', 'valor')} ${r.vb < 0 ? 'null' : r.vb + ' B'}`,
        actions: [
          n ? cmd(L('Read it with the rest of the topic:', 'Leerlo junto con el resto del tópico:'), LAB + 'read ' + n) : null,
          cmd(L('It is not deleted one by one: it leaves through retention (lesson 13) or, in a compacted topic, when a newer record with the same key arrives (lesson 14).', 'No se borra de a uno: sale por retención (lección 13) o, en un tópico compactado, cuando llega otro con la misma clave (lección 14).')),
        ].filter(Boolean),
      };
    }
    if (kind === 'ptr') {
      const [gid, name, ps] = rest;
      const g = groupById(gid);
      const t = topicByName(name);
      const p = t && t.partitions.find((x) => String(x.p) === ps);
      if (!g || !p) return gone;
      const c = committed(g, name, p.p);
      const les = lessonOf(name);
      return {
        kind: L('BOOKMARK', 'SEÑALADOR'),
        title: L(`${gid} on ${name} / P${p.p}`, `${gid} en ${name} / P${p.p}`),
        what: L(`The next offset group ${gid} will read in P${p.p}. Kafka keeps it in the internal topic __consumer_offsets.`, `El próximo offset que el grupo ${gid} va a leer en P${p.p}. Kafka lo guarda en el tópico interno __consumer_offsets.`),
        why: L('If the consumer restarts, the group continues from here. It is a bookmark, not a receipt: it does not say whether the record was processed well (lesson 08).', 'Si el consumidor se reinicia, el grupo sigue desde acá. Es un señalador, no un recibo: no dice si el registro se procesó bien (lección 08).'),
        now: [L(`Bookmark ${c}, end ${p.end}, lag ${p.end - c}.`, `Señalador ${c}, fin ${p.end}, lag ${p.end - c}.`)],
        actions: les
          ? [
              cmd(L('See the group’s lag:', 'Ver el lag del grupo:'), LAB + 'lag ' + les.n + ' ' + gid),
              cmd(L('Read again from the beginning (the group must have no consumers):', 'Volver a leer desde el principio (el grupo tiene que estar sin consumidores):'), LAB + 'reset ' + les.n + ' ' + gid),
            ]
          : [],
      };
    }
    if (kind === 'group') {
      const g = groupById(rest.join(':'));
      if (!g) return gone;
      const t = currentTopic();
      const les = t ? lessonOf(t.name) : null;
      const k = upBroker();
      const members = g.members.map((m) => `${m.client}: ${m.assigned.map((a) => `${a[0]} P${a[1]}`).join(', ') || L('nothing', 'nada')}`);
      return {
        kind: L('CONSUMER GROUP', 'GRUPO DE CONSUMIDORES'),
        title: g.id,
        what: L('A team of consumers that shares out the partitions of the topics it reads: each partition is read by a single member at a time.', 'Un equipo de consumidores que se reparte las particiones de los tópicos que lee: cada partición la lee un solo miembro a la vez.'),
        why: L('So that each system reads the same stream on its own, with its own bookmarks, without taking anything from another group (lesson 07).', 'Que cada sistema lea el mismo flujo por su cuenta, con sus propios señaladores, sin quitarle nada a otro grupo (lección 07).'),
        now: [
          `${g.state}: ${stateText(g.state)}.`,
          g.type ? L(`Rebalance protocol: ${g.type.toLowerCase()}.`, `Protocolo de rebalanceo: ${g.type.toLowerCase()}.`) : '',
          ...members,
        ].filter(Boolean),
        actions: les
          ? [
              cmd(L('Add a consumer in another terminal (it triggers a rebalance, lesson 09):', 'Sumar un consumidor en otra terminal (dispara un rebalanceo, lección 09):'), LAB + 'watch ' + les.n + ' ' + g.id),
              cmd(L('See members and assignments:', 'Ver miembros y asignaciones:'), LAB + 'describe-group ' + g.id),
              cmd(L('See the lag:', 'Ver el lag:'), LAB + 'lag ' + les.n + ' ' + g.id),
            ]
          : [cmd(L('Describe it:', 'Describirlo:'), `docker compose exec kafka${k} /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka${k}:9092 --describe --group ${g.id}`)],
      };
    }
    return null;
  }

  // ------------------------------------------------------------------ rendering

  const ring = (id) => (sel === id ? ' selected' : '');

  function statusInfo() {
    const ago = status.readAt ? Math.max(0, (Date.now() - status.readAt) / 1000) : null;
    if (!status.reached) return { cls: 'down', text: L('No connection with the viewer', 'Sin conexión con el visor') };
    if (!status.ok) return { cls: 'down', text: L('The cluster does not answer', 'El clúster no responde') };
    if (paused) return { cls: 'paused', text: L('Paused', 'Pausado') };
    const s = ago === null ? '' : ago.toFixed(1).replace('.', lang === 'es' ? ',' : '.') + ' s';
    return { cls: 'live', text: L('Live · read ' + s + ' ago', 'En vivo · leído hace ' + s) };
  }

  function header() {
    const { text, cls } = statusInfo();
    return `<header class="top">
      <div class="brand">
        <img src="favicon.svg" alt="" width="20" height="20">
        <div><strong>Kafka from scratch</strong><span class="eyebrow">${L('LIVE VIEWER', 'VISOR EN VIVO')}</span></div>
      </div>
      <div class="controls">
        <span class="status ${cls}" id="status"><span class="dot"></span>${e(text)}</span>
        <button type="button" data-act="pause">${paused ? L('Resume', 'Seguir') : L('Pause', 'Pausar')}</button>
        <div class="langs" role="group" aria-label="${L('Language', 'Idioma')}">
          <button type="button" data-act="en" aria-pressed="${lang === 'en'}">EN</button>
          <button type="button" data-act="es" aria-pressed="${lang === 'es'}">ES</button>
        </div>
      </div>
    </header>`;
  }

  function brokers() {
    return `<section class="brokers" aria-label="Brokers">${data.brokers
      .map((b) => {
        const leads = data.topics.filter((t) => !t.internal).reduce((s, t) => s + t.partitions.filter((p) => p.leader === b.id).length, 0);
        const detailText = !status.ok
          ? L('no answer from the cluster', 'el clúster no responde')
          : b.up
          ? [data.controller === b.id ? L('active controller', 'controlador activo') : '', L(`leader of ${leads} partition${leads === 1 ? '' : 's'}`, `líder de ${leads} partici${leads === 1 ? 'ón' : 'ones'}`)].filter(Boolean).join(' · ')
          : L('not responding', 'no responde');
        return `<button type="button" class="broker${!status.ok ? ' stale' : b.up ? '' : ' down'}${ring('broker:' + b.id)}" data-sel="broker:${b.id}"><span class="dot"></span><span><strong>Broker ${b.id}</strong><small>${e(detailText)}</small></span></button>`;
      })
      .join('')}</section>`;
  }

  function topicButton(t, current) {
    const les = lessonOf(t.name);
    const stored = t.partitions.reduce((s, p) => s + Math.max(0, p.end - p.start), 0);
    const meta = [les ? L('lesson ', 'lección ') + les.id : '', `${t.partitions.length} ${L(t.partitions.length === 1 ? 'partition' : 'partitions', t.partitions.length === 1 ? 'partición' : 'particiones')}`, `${stored} offsets`].filter(Boolean).join(' · ');
    return `<button type="button" class="topic${current && current.name === t.name ? ' current' : ''}" data-topic="${e(t.name)}"${current && current.name === t.name ? ' aria-current="true"' : ''}><strong>${e(t.name)}</strong><small>${e(meta)}</small></button>`;
  }

  function nav(current) {
    const lt = lessonTopics();
    const ot = otherTopics();
    return `<nav class="topics" aria-label="${L('Topics', 'Tópicos')}">
      <span class="eyebrow">${L('TOPICS', 'TÓPICOS')}</span>
      <button type="button" class="follow${pinned ? '' : ' on'}" data-act="follow" aria-pressed="${!pinned}">${pinned ? L('Follow the activity', 'Seguir la actividad') : L('Following the activity', 'Siguiendo la actividad')}</button>
      ${lt.map((t) => topicButton(t, current)).join('') || `<p class="muted">${L('No lesson topic yet.', 'Todavía no hay tópicos de lección.')}</p>`}
      ${ot.length ? `<span class="eyebrow sub">${L('OTHER TOPICS', 'OTROS TÓPICOS')}</span>${ot.map((t) => topicButton(t, current)).join('')}` : ''}
      <label class="check"><input type="checkbox" data-act="internal"${internal ? ' checked' : ''}> ${L('Show internal topics', 'Mostrar tópicos internos')}</label>
    </nav>`;
  }

  function lane(t, p) {
    const gs = groupsOf(t.name);
    const recs = p.records;
    const slots = [];
    recs.forEach((r) => slots.push({ r }));
    slots.push({ next: true });
    const markersAt = slots.map(() => []);
    for (const g of gs) {
      const c = committed(g, t.name, p.p);
      if (c === null) continue;
      let i = recs.findIndex((r) => r.o >= c);
      if (i < 0) i = recs.length;
      const behind = recs.length && c < recs[0].o;
      markersAt[i].push({ g, c, behind });
    }
    const replicas = p.replicas
      .map((b) => {
        const cls = p.leader === b ? 'leader' : p.isr.includes(b) ? 'follower' : 'out';
        const label = p.leader === b ? L('Leader on', 'Líder en') : p.isr.includes(b) ? L('In-sync follower on', 'Seguidora en sincronía en') : L('Out-of-sync replica on', 'Réplica fuera del ISR en');
        return `<button type="button" class="rep ${cls}${ring(`rep:${t.name}:${p.p}:${b}`)}" data-sel="rep:${e(t.name)}:${p.p}:${b}" aria-label="${e(label)} B${b}">B${b}</button>`;
      })
      .join('');
    const cells = slots
      .map((s, i) => {
        let body;
        if (s.r) {
          const id = recId(t.name, p.p, s.r.o);
          const fresh = isNew(id);
          body = `<button type="button" class="rec${fresh ? ' fresh' : ''}${ring(id)}" data-sel="${e(id)}" data-rec="${e(id)}" aria-label="${e(L('Record at offset ', 'Registro en offset ') + s.r.o + ', ' + L('key ', 'clave ') + (s.r.k ?? 'null'))}"><span class="off">${s.r.o}${fresh ? L(' · new', ' · nuevo') : ''}</span><strong>${e(s.r.k ?? L('no key', 'sin clave'))}</strong><span class="val">${e(s.r.v ?? 'null')}</span></button>`;
        } else {
          body = `<button type="button" class="next${ring(`end:${t.name}:${p.p}`)}" data-sel="end:${e(t.name)}:${p.p}" aria-label="${e(L('End of the log, offset ', 'Fin del log, offset ') + p.end)}"><span class="off">${p.end}</span><span>${L('next', 'próximo')}</span></button>`;
        }
        const marks = markersAt[i]
          .map((m) => `<button type="button" class="ptr ${colorOf(m.g.id)}${ring(`ptr:${m.g.id}:${t.name}:${p.p}`)}" data-sel="ptr:${e(m.g.id)}:${e(t.name)}:${p.p}" aria-label="${e(L('Bookmark of ', 'Señalador de ') + m.g.id)}"><svg width="10" height="8" viewBox="0 0 10 8" aria-hidden="true"><path d="M5 0L10 8H0Z"></path></svg>${e(m.g.id)}${m.behind ? ' · ' + m.c : ''}</button>`)
          .join('');
        return `<div class="slot">${body}<div class="marks">${marks}</div></div>`;
      })
      .join('');
    const from = Math.max(p.start, p.end - data.window);
    const gaps = recs.some((r, i) => r.o !== (i === 0 ? from : recs[i - 1].o + 1));
    const ends = [
      `${L('start', 'inicio')} ${p.start} · ${L('end', 'fin')} ${p.end}`,
      from > p.start ? L(`offsets ${p.start} to ${from - 1} not shown`, `offsets ${p.start} a ${from - 1} sin mostrar`) : '',
      gaps ? L('offsets without a record: removed by compaction or taken by transaction markers', 'offsets sin registro: los quitó la compactación o son marcas de transacción') : '',
    ].filter(Boolean).join(' · ');
    return `<div class="lane${p.leader < 0 ? ' noleader' : ''}">
      <div class="lane-head">
        <button type="button" class="pname${ring(`part:${t.name}:${p.p}`)}" data-sel="part:${e(t.name)}:${p.p}" aria-label="${L('Partition', 'Partición')} P${p.p}">P${p.p}</button>
        <div class="reps">${replicas}</div>
        <small>${e(ends)}</small>
      </div>
      ${t.internal ? '' : `<div class="track">${cells}</div>`}
    </div>`;
  }

  // The content of a record under the pointer or the keyboard focus, drawn without redrawing the page.
  function tipHtml(id) {
    const [, name, ps, os] = id.split(':');
    const t = topicByName(name);
    const p = t && t.partitions.find((x) => String(x.p) === ps);
    const r = p && p.records.find((x) => String(x.o) === os);
    if (!r) return '';
    return `<div class="tip" role="tooltip" id="tip"><span class="eyebrow">${e(name)} · P${p.p} · OFFSET ${r.o}</span><span><span class="muted">${L('key', 'clave')}</span> <strong class="mono">${e(r.k ?? 'null')}</strong></span><span class="muted">${L('value', 'valor')}</span><code>${e(pretty(r.v))}</code><span class="muted">timestamp ${e(fmtStamp(r.ts))} · ${r.h.length ? r.h.map((h) => `${h[0]}=${h[1] ?? 'null'}`).map(e).join(', ') : L('no headers', 'sin encabezados')}</span></div>`;
  }

  function showTip() {
    for (const old of app.querySelectorAll('.tip')) old.remove();
    for (const b of app.querySelectorAll('[aria-describedby="tip"]')) b.removeAttribute('aria-describedby');
    if (!hover) return;
    const b = app.querySelector(`[data-rec="${CSS.escape(hover)}"]`);
    if (!b) return;
    b.insertAdjacentHTML('afterend', tipHtml(hover));
    b.setAttribute('aria-describedby', 'tip');
  }

  function banners(t) {
    const out = [];
    if (!status.ok) {
      return `<div class="banner" role="status"><p>${e(L('The cluster does not answer.', 'El clúster no responde.'))}</p><p>${e(L(`What you see is the last reading in which it answered${lastGood ? ', at ' + fmtTime(lastGood) : ''}. Start it again from the labs folder with docker compose up -d --wait.`, `Lo que ves es la última lectura en la que respondió${lastGood ? ', a las ' + fmtTime(lastGood) : ''}. Levantalo desde la carpeta labs con docker compose up -d --wait.`))}</p></div>`;
    }
    const down = data.brokers.filter((b) => !b.up);
    const under = data.topics.flatMap((x) => x.partitions.filter((p) => p.isr.length < p.replicas.length));
    if (down.length) {
      out.push(L(`Broker ${down.map((b) => b.id).join(', ')} is not responding.`, `${down.length === 1 ? 'El broker' : 'Los brokers'} ${down.map((b) => b.id).join(', ')} no ${down.length === 1 ? 'responde' : 'responden'}.`));
    }
    if (under.length) {
      out.push(L(`${under.length} partition${under.length === 1 ? ' has' : 's have'} fewer in-sync replicas than assigned.`, `${under.length} partici${under.length === 1 ? 'ón tiene' : 'ones tienen'} menos réplicas en sincronía que las asignadas.`));
    }
    if (t) {
      const minIsr = Number(t.config['min.insync.replicas'] || 1);
      for (const p of t.partitions) {
        if (p.leader < 0) out.push(L(`${t.name} P${p.p} has no leader: it can be neither read nor written.`, `${t.name} P${p.p} no tiene líder: no se puede leer ni escribir.`));
        else if (p.isr.length < minIsr) out.push(L(`${t.name} P${p.p} has ${p.isr.length} in-sync replica${p.isr.length === 1 ? '' : 's'}; with min.insync.replicas ${minIsr} it rejects writes with acks=all.`, `${t.name} P${p.p} tiene ${p.isr.length} réplica${p.isr.length === 1 ? '' : 's'} en sincronía; con min.insync.replicas ${minIsr} rechaza escrituras con acks=all.`));
        else if (p.isr.length < p.replicas.length) out.push(L(`${t.name} P${p.p}: ${p.isr.length} of ${p.replicas.length} replicas in sync; with min.insync.replicas ${minIsr} it still accepts writes with acks=all.`, `${t.name} P${p.p}: ${p.isr.length} de ${p.replicas.length} réplicas en sincronía; con min.insync.replicas ${minIsr} todavía acepta escrituras con acks=all.`));
      }
    }
    return out.length ? `<div class="banner" role="status">${out.map((x) => `<p>${e(x)}</p>`).join('')}</div>` : '';
  }

  function main(t) {
    if (!t) {
      return `<main class="main"><div class="empty"><h1>${L('No topics yet', 'Todavía no hay tópicos')}</h1><p>${L('Prepare the first lesson topic and it will appear here:', 'Prepará el primer tópico de lección y aparece acá:')}</p><code>${LAB}prepare 1</code></div>${feed()}</main>`;
    }
    const les = lessonOf(t.name);
    const stored = t.partitions.reduce((s, p) => s + Math.max(0, p.end - p.start), 0);
    const rf = t.partitions.length ? t.partitions[0].replicas.length : 0;
    const meta = [
      `${t.partitions.length} ${L(t.partitions.length === 1 ? 'partition' : 'partitions', t.partitions.length === 1 ? 'partición' : 'particiones')}`,
      L(`${rf} replicas each`, `${rf} réplicas cada una`),
      t.config['min.insync.replicas'] ? 'min.insync.replicas ' + t.config['min.insync.replicas'] : '',
      t.config['cleanup.policy'] && t.config['cleanup.policy'] !== 'delete' ? 'cleanup.policy ' + t.config['cleanup.policy'] : '',
      L(`${stored} offsets between start and end`, `${stored} offsets entre inicio y fin`),
    ].filter(Boolean).join(' · ');
    return `<main class="main">
      ${banners(t)}
      <div class="topic-head">
        <div>
          <span class="eyebrow green">${les ? e(L('LESSON ', 'LECCIÓN ') + les.id + ' · ' + les.title.toUpperCase()) : t.internal ? L('INTERNAL TOPIC', 'TÓPICO INTERNO') : L('TOPIC', 'TÓPICO')}</span>
          <h1><button type="button" class="tname${ring('topic:' + t.name)}" data-sel="topic:${e(t.name)}">${e(t.name)}</button></h1>
          <span class="meta">${e(meta)}</span>
        </div>
        <div class="legend">
          <span><span class="rep leader">B</span>${L('leader', 'líder')}</span>
          <span><span class="rep follower">B</span>${L('in sync (ISR)', 'en sincronía (ISR)')}</span>
          <span><span class="rep out">B</span>${L('out of sync', 'fuera del ISR')}</span>
          <span><span class="rec-mini fresh">0</span>${L('just arrived', 'recién llegado')}</span>
        </div>
      </div>
      <p class="hint">${L('Hover a record to see its content. Click any object to see what it is, what it is for and what you can do with it.', 'Pasá el mouse por un registro para ver su contenido. Hacé clic en cualquier objeto para ver qué es, para qué sirve y qué podés hacer con él.')}</p>
      ${t.partitions.map((p) => lane(t, p)).join('')}
      ${feed()}
    </main>`;
  }

  function feed() {
    const evs = data.events.slice(0, 14);
    return `<section class="feed" aria-label="${L('What just happened', 'Lo que acaba de pasar')}">
      <span class="eyebrow">${L('WHAT JUST HAPPENED', 'LO QUE ACABA DE PASAR')}</span>
      ${evs.map((ev) => `<div class="ev"><span class="mono muted">${e(fmtTime(ev.t))}</span><span>${e(eventText(ev))}</span></div>`).join('') || `<p class="muted">${L('Nothing yet.', 'Nada todavía.')}</p>`}
    </section>`;
  }

  function aside(t) {
    const d = detail(sel);
    const panel = d
      ? `<section class="detail" aria-label="${L('Detail', 'Detalle')}">
          <div class="detail-head">
            <div><span class="eyebrow green">${e(d.kind)}</span><h2>${e(d.title)}</h2></div>
            <button type="button" class="close" data-act="close" aria-label="${L('Close the detail', 'Cerrar el detalle')}">×</button>
          </div>
          <div class="block"><span class="eyebrow">${L('WHAT IT IS', 'QUÉ ES')}</span><p>${e(d.what)}</p></div>
          ${d.why ? `<div class="block"><span class="eyebrow">${L('WHAT IT IS FOR', 'PARA QUÉ SIRVE')}</span><p>${e(d.why)}</p></div>` : ''}
          ${d.now.length ? `<div class="block now"><span class="eyebrow">${L('NOW', 'AHORA')}</span>${d.now.map((x) => `<p>${e(x)}</p>`).join('')}</div>` : ''}
          ${d.content ? `<div class="block"><span class="eyebrow">${L('CONTENT', 'CONTENIDO')}</span><code>${e(d.content)}</code></div>` : ''}
          ${d.actions.length ? `<div class="block"><span class="eyebrow">${L('WHAT YOU CAN DO', 'QUÉ PODÉS HACER')}</span>${d.actions.map((a) => `<p>${e(a.text)}</p>${a.cmd ? `<code>${e(a.cmd)}</code>` : ''}`).join('')}<p class="muted small">${L('The viewer runs nothing: run these in your terminal, in the labs folder.', 'El visor no ejecuta nada: corré estos comandos en tu terminal, en la carpeta labs.')}</p></div>` : ''}
        </section>`
      : `<div class="hintbox">${L('Click a broker, a topic, a partition, a replica, a record or a bookmark to see here what it is, what it is for and what you can do with it.', 'Hacé clic en un broker, un tópico, una partición, una réplica, un registro o un señalador para ver acá qué es, para qué sirve y qué podés hacer con él.')}</div>`;
    const gs = t ? groupsOf(t.name) : [];
    const groups = gs
      .map((g) => {
        const rows = t.partitions
          .map((p) => {
            const c = committed(g, t.name, p.p);
            return `<span>P${p.p}</span><span>${c ?? '·'}</span><span>${p.end}</span><span class="b">${c === null ? '·' : Math.max(0, p.end - c)}</span>`;
          })
          .join('');
        const total = t.partitions.reduce((s, p) => {
          const c = committed(g, t.name, p.p);
          return c === null ? s : s + Math.max(0, p.end - c);
        }, 0);
        const mine = g.members
          .map((m) => {
            const parts = m.assigned.filter((a) => a[0] === t.name).map((a) => 'P' + a[1]);
            return parts.length ? `${m.client}: ${parts.join(', ')}` : '';
          })
          .filter(Boolean);
        const membersText = g.members.length
          ? L(`${g.members.length} consumer${g.members.length === 1 ? '' : 's'}`, `${g.members.length} consumidor${g.members.length === 1 ? '' : 'es'}`) + (mine.length ? ': ' + mine.join(' · ') : '')
          : L('No consumers: its bookmarks stay saved', 'Sin consumidores: sus señaladores siguen guardados');
        return `<div class="group${ring('group:' + g.id)}">
          <div class="group-head"><button type="button" class="gname" data-sel="group:${e(g.id)}"><span class="sw ${colorOf(g.id)}"></span>${e(g.id)}</button><span class="pill">${e(g.state)}</span></div>
          <small>${e(membersText)}</small>
          <div class="gtable" role="table" aria-label="${L('Group offsets', 'Offsets del grupo')}"><span class="h">${L('Partition', 'Partición')}</span><span class="h">${L('Bookmark', 'Señalador')}</span><span class="h">${L('End', 'Fin del log')}</span><span class="h">Lag</span>${rows}</div>
          <strong class="small">${L('Total lag: ', 'Lag total: ')}${total}</strong>
        </div>`;
      })
      .join('');
    return `<aside class="side" aria-label="${L('Detail and groups', 'Detalle y grupos')}">
      ${panel}
      <span class="eyebrow">${t ? L('GROUPS READING ', 'GRUPOS QUE LEEN ') + e(t.name) : L('GROUPS', 'GRUPOS')}</span>
      ${groups || `<div class="hintbox">${t ? L('No group reads this topic.', 'Ningún grupo lee este tópico.') : ''}</div>`}
      <p class="muted small">${L('Lag says how much a group still has to read, not whether what it read was processed well.', 'El lag dice cuánto le falta leer a cada grupo, no si lo que leyó se procesó bien.')}</p>
    </aside>`;
  }

  function footer() {
    return `<footer class="foot">${L(
      'The viewer reads the cluster every half second with the Admin API and a consumer without a group. It creates no topics or groups and saves no offsets: what you see in the terminal does not change because it is open. It shows the three-broker course cluster; the separate clusters of the security, mirroring and share group lessons do not appear here.',
      'El visor lee el clúster cada medio segundo con la Admin API y un consumidor sin grupo. No crea tópicos ni grupos ni guarda offsets: lo que ves en la terminal no cambia por tenerlo abierto. Muestra el clúster de tres brokers del curso; los clústeres aparte de las lecciones de seguridad, replicación entre clústeres y share groups no aparecen acá.',
    )}</footer>`;
  }

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

  function draw() {
    document.documentElement.lang = lang;
    document.title = L('Live viewer · Kafka from scratch', 'Visor en vivo · Kafka from scratch');
    if (!data || !data.brokers || !data.brokers.length) {
      app.innerHTML = header() + `<div class="wait"><h1>${L('Waiting for the cluster', 'Esperando el clúster')}</h1><p>${L('Start it from the labs folder and this page fills in by itself:', 'Levantalo desde la carpeta labs y esta página se completa sola:')}</p><code>docker compose up -d --wait</code></div>` + footer();
      return;
    }
    const focused = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.sel || document.activeElement.dataset.topic || document.activeElement.dataset.act : null;
    const t = currentTopic();
    app.innerHTML = header() + brokers() + `<div class="body">${nav(t)}${main(t)}${aside(t)}</div>` + footer();
    if (focused) {
      const again = app.querySelector(`[data-sel="${CSS.escape(focused)}"], [data-topic="${CSS.escape(focused)}"], [data-act="${CSS.escape(focused)}"]`);
      if (again) again.focus({ preventScroll: true });
    }
    showTip();
  }

  function renderStatus() {
    const s = $('#status');
    if (!s) return render();
    const { text, cls } = statusInfo();
    s.className = 'status ' + cls;
    s.lastChild.textContent = text;
  }

  // ------------------------------------------------------------------ input

  app.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-sel], [data-topic], [data-act]');
    if (!el) return;
    if (el.dataset.act) {
      const a = el.dataset.act;
      if (a === 'pause') paused = !paused;
      else if (a === 'en' || a === 'es') {
        lang = a;
        store.set('visor-lang', a);
      } else if (a === 'follow') pinned = null;
      else if (a === 'internal') internal = el.checked;
      else if (a === 'close') sel = null;
      render();
      return;
    }
    if (el.dataset.topic) {
      pinned = el.dataset.topic;
      sel = 'topic:' + el.dataset.topic;
    } else {
      sel = el.dataset.sel;
    }
    render();
  });
  const enter = (ev) => {
    if (rendering) return;
    const el = ev.target.closest('[data-rec]');
    if (el && hover !== el.dataset.rec) {
      hover = el.dataset.rec;
      showTip();
    }
  };
  const leave = (ev) => {
    if (rendering) return;
    const to = ev.relatedTarget && ev.relatedTarget.closest ? ev.relatedTarget.closest('[data-rec], .tip') : null;
    if (hover && !to) {
      hover = null;
      showTip();
    }
  };
  app.addEventListener('mouseover', enter);
  app.addEventListener('focusin', enter);
  app.addEventListener('mouseout', leave);
  app.addEventListener('focusout', leave);
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && (sel || hover)) {
      sel = null;
      hover = null;
      render();
    }
  });

  // ------------------------------------------------------------------ polling

  async function tick() {
    let changed = false;
    try {
      const r = await fetch('/api/state?v=' + version, { cache: 'no-store' });
      const j = await r.json();
      status = { ok: j.ok, error: j.error, readAt: j.readAt, reached: true };
      if (j.ok) lastGood = j.readAt;
      if (!j.same && j.brokers) {
        data = j;
        version = j.version;
        markNew();
        changed = true;
      }
    } catch {
      status = { ...status, reached: false };
    }
    if (!paused && (changed || anyNew() || !data)) render();
    else renderStatus();
    setTimeout(tick, POLL_MS);
  }

  render();
  tick();
})();
