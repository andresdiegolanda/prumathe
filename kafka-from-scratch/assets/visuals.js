/* SVG models are illustrative, deterministic and entirely local.
   Colors come from one palette per skin (light, dark, reading, projector); render() picks the
   palette from its theme argument, or from html[data-theme] when it runs in a browser. */
window.KafkaVisuals = (() => {
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );
  let language = 'en',
    details = {};
  const t = (en, es) => (language === 'es' ? es : en);
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
  let C = PALETTES.light;
  function palette(theme) {
    return PALETTES[theme] || PALETTES.light;
  }
  function currentTheme() {
    return typeof document !== 'undefined' ? document.documentElement.dataset.theme : undefined;
  }
  function txt(x, y, s, size = 14, color = C.ink, anchor = 'start', extra = '') {
    return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
  }
  function box(x, y, w, h, label, sub = '', color = C.green, id = '', info = '') {
    if (id) details[id] = info || label;
    return `<g ${id ? `class="selectable" tabindex="0" role="button" aria-label="${esc(label)}" data-node="${id}"` : ''}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${C.white}" stroke="${color}" stroke-width="1.5"/>${txt(x + w / 2, y + h / 2 + (sub ? -4 : 5), label, 16, color, 'middle', 'font-weight="650"')}${sub ? txt(x + w / 2, y + h / 2 + 19, sub, 11, C.muted, 'middle') : ''}</g>`;
  }
  function arrow(x, y, x2, y2, color = C.green, dash = false) {
    return `<path d="M${x} ${y} C${(x + x2) / 2} ${y},${(x + x2) / 2} ${y2},${x2} ${y2}" fill="none" stroke="${color}" stroke-width="2" ${dash ? 'stroke-dasharray="5 5"' : ''} marker-end="url(#arrow-${color.slice(1)})"/>`;
  }
  function pill(x, y, w, label, color = C.mint) {
    return `<rect x="${x}" y="${y}" width="${w}" height="29" rx="14" fill="${color}"/>${txt(x + w / 2, y + 19, label, 12, C.ink, 'middle')}`;
  }
  function lane(y, name, records, opts = {}) {
    let s =
      txt(35, y + 30, name, 13, C.muted) +
      `<rect x="120" y="${y}" width="600" height="62" rx="9" fill="${C.panel}" stroke="${C.line}"/>`;
    records.forEach((r, i) => {
      const x = 134 + i * 69;
      const v = typeof r === 'object' ? r : { label: r, offset: i };
      const color = v.deleted ? C.ghost : v.color || C.mint;
      s += `<g class="selectable record-token ${v.deleted ? 'ghost' : ''}" tabindex="0" role="button" data-node="record-${y}-${i}" aria-label="${esc(v.label)}"><rect x="${x}" y="${y + 9}" width="59" height="43" rx="6" fill="${color}" stroke="${v.deleted ? C.red : C.line}"/>${txt(x + 29, y + 28, v.label, 12, C.ink, 'middle')}${txt(x + 29, y + 43, v.offset === undefined ? i : v.offset, 10, C.muted, 'middle')}</g>`;
      details[`record-${y}-${i}`] = t(
        'Record at this partition offset. Its key and business identity can repeat.',
        'Mensaje en este offset de partición. Su clave e identidad de negocio pueden repetirse.',
      );
    });
    return s;
  }
  function heading(a, b) {
    return (
      txt(35, 38, a, 12, C.green, 'start', 'letter-spacing="2" font-weight="700"') +
      txt(35, 66, b, 19, C.ink)
    );
  }
  function metric(x, y, n, label, color = C.green) {
    return (
      txt(x, y, n, 36, color, 'middle', 'font-weight="650"') +
      txt(x, y + 24, label, 12, C.muted, 'middle')
    );
  }
  function murmur2(str) {
    let b = new TextEncoder().encode(str),
      len = b.length,
      h = (0x9747b28c ^ len) | 0,
      m = 0x5bd1e995;
    let i = 0;
    for (; i + 4 <= len; i += 4) {
      let k = b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24);
      k = Math.imul(k, m);
      k ^= k >>> 24;
      k = Math.imul(k, m);
      h = Math.imul(h, m) ^ k;
    }
    let r = len - i;
    if (r === 3) h ^= b[i + 2] << 16;
    if (r >= 2) h ^= b[i + 1] << 8;
    if (r >= 1) {
      h ^= b[i];
      h = Math.imul(h, m);
    }
    h ^= h >>> 13;
    h = Math.imul(h, m);
    h ^= h >>> 15;
    return (h & 0x7fffffff) >>> 0;
  }
  function render(type, step, state, lang, theme) {
    language = lang;
    C = palette(theme || currentTheme());
    details = {};
    let s = '',
      controls = [];
    const n = state.n || 3,
      count = state.count || 4,
      pos = state.pos || 0,
      commit = state.commit || 0,
      toggle = !!state.toggle;
    const button = (action, en, es) => controls.push({ kind: 'button', action, label: t(en, es) });
    const range = (key, en, es, min, max, value) =>
      controls.push({ kind: 'range', key, label: t(en, es), min, max, value });
    const stages = [C.green, C.blue, C.purple];
    if (type === 'method') {
      const phase = Math.max(0, Math.min(3, Number(state.phase) || 0));
      s = heading(
        t('THE COURSE ANATOMY', 'LA ANATOMÍA DEL CURSO'),
        t('Understand here. Test in your terminal.', 'Entendé acá. Probá en tu terminal.'),
      );
      s += box(
        35, 100, 330, 105, t('Browser', 'Navegador'),
        t('Model + 3 scenes: simulation', 'Modelo + 3 escenas: simulación'),
        C.green, 'browser',
        t('Select and change the model to build intuition. No browser diagram contacts Kafka.',
          'Seleccioná y cambiá el modelo para construir intuición. Ningún diagrama contacta Kafka.'),
      );
      s += box(
        395, 100, 330, 105, 'Docker',
        t('Real Kafka: 3 brokers', 'Kafka real: 3 brokers'),
        C.orange, 'docker',
        t('Run commands from the extracted labs folder. Java and Maven run inside containers.',
          'Ejecutá los comandos desde labs descomprimido. Java y Maven corren en contenedores.'),
      );
      s += txt(380, 234,
        t('A diagram is not a broker connection.', 'Un diagrama no es una conexión al broker.'),
        13, C.muted, 'middle');
      const cycle = [
        [t('Intuition', 'Intuición'), t('Manipulate', 'Manipulá'), C.green,
          t('Predict a change, then manipulate the model.', 'Predecí un cambio y manipulá el modelo.')],
        [t('Rule', 'Regla'), t('Name the limit', 'Nombrá el límite'), C.blue,
          t('Explain the guarantee and its boundary.', 'Explicá la garantía y su límite.')],
        [t('Experiment', 'Experimento'), t('Run the lab', 'Ejecutá el lab'), C.orange,
          t('Use your terminal and compare the actual output with your prediction.',
            'Usá tu terminal y compará la salida real con tu predicción.')],
        [t('Checkpoint', 'Control'), t('3 questions', '3 preguntas'), C.purple,
          t('Explain three answers. Progress lives in this browser; you declare the lab done.',
            'Explicá tres respuestas. El avance vive en este navegador; vos declarás el lab hecho.')],
      ];
      cycle.forEach(([label, sub, color, detail], i) => {
        const x = 35 + i * 180;
        s += box(x, 265, 150, 66, label, sub, color, 'cycle' + i, detail);
        if (i < 3) s += arrow(x + 153, 298, x + 176, 298, C.line);
        if (step === 1 && phase === i)
          s += '<circle cx="' + (x + 75) + '" cy="347" r="5" fill="' + color + '"/>';
      });
      if (step === 0) {
        s += pill(120, 382, 520,
          t('The diagram teaches; the experiment tests.', 'El diagrama enseña; el experimento prueba.'),
          C.mint);
      } else if (step === 1) {
        s += txt(380, 389,
          t('You declare the lab done; the quiz cannot detect commands.',
            'Vos declarás el lab hecho; el control no detecta comandos.'),
          13, C.ink, 'middle');
        range('phase', 'Cycle marker', 'Señalador del circuito', 0, 3, phase);
      } else {
        s += pill(35, 374, 210, t('Full course: 00 to 29', 'Completo: 00 a 29'), C.mint);
        s += pill(265, 374, 210, t('Choose a unit', 'Elegí una unidad'), C.amber);
        s += pill(495, 374, 230, t('Shortcuts: 13 or 29', 'Atajos: 13 o 29'), C.panelAlt);
        s += txt(380, 432,
          t('One kit. A terminal. Free memory for the services.',
            'Un kit. Una terminal. Memoria libre para los servicios.'),
          13, C.muted, 'middle');
      }
    } else if (type === 'cluster') {
      s = heading(
        t('YOUR LOCAL LAB', 'TU LABORATORIO LOCAL'),
        t('One network. Clear responsibilities.', 'Una red. Responsabilidades claras.'),
      );
      s += `<rect x="190" y="100" width="370" height="275" rx="20" fill="${C.glass}" stroke="${C.line}" stroke-dasharray="6 6"/>`;
      s += txt(210, 128, t('DOCKER NETWORK', 'RED DE DOCKER'), 11, C.muted);
      for (let i = 0; i < 3; i++) {
        s += box(
          230,
          150 + i * 67,
          290,
          50,
          'kafka' + (i + 1),
          t('broker + controller', 'broker + controlador'),
          stages[i],
          'node' + i,
          t(
            'This node stores partition replicas and participates in the KRaft metadata quorum.',
            'Este nodo guarda réplicas y participa del quórum de metadatos KRaft.',
          ),
        );
      }
      s +=
        box(
          25,
          195,
          135,
          66,
          t('Producer', 'Productor'),
          'localhost:19092',
          C.orange,
          'producer',
          t(
            'Host clients discover brokers through the external listener.',
            'Los clientes del host descubren brokers por el listener externo.',
          ),
        ) + arrow(160, 226, 227, 175, step ? C.orange : C.line);
      s +=
        box(
          590,
          195,
          145,
          66,
          t('Lab client', 'Cliente lab'),
          'kafka1:9092',
          C.green,
          'client',
          t(
            'The lab container uses internal Docker hostnames.',
            'El contenedor de laboratorio usa nombres internos de Docker.',
          ),
        ) + arrow(590, 227, 523, 175, step ? C.green : C.line);
      s += pill(
        240,
        394,
        275,
        t('Named volumes keep the logs', 'Los volúmenes conservan los logs'),
      );
    } else if (['log', 'partitions', 'keys', 'offsets', 'retention', 'compaction'].includes(type)) {
      let rows = type === 'partitions' || type === 'keys' ? n : 1;
      let key = state.key || 'order-42';
      let target = murmur2(key) % rows;
      const labels = {
        log: [
          t('APPEND-ONLY LOG', 'LOG DE SOLO AGREGADO'),
          t('Reading does not remove a record.', 'Leer no elimina un mensaje.'),
        ],
        partitions: [
          t('TOPIC / ORDERS', 'TÓPICO / ORDERS'),
          t(
            'Each lane owns its own offset sequence.',
            'Cada carril tiene su secuencia de offsets.',
          ),
        ],
        keys: [
          t('THE KEY CHOOSES THE LANE', 'LA CLAVE ELIGE EL CARRIL'),
          t(
            'Same bytes. Same count. Same partition.',
            'Mismos bytes. Misma cantidad. Misma partición.',
          ),
        ],
        offsets: [
          t('THREE POSITIONS', 'TRES POSICIONES'),
          t(
            'Fetch position is not a durable bookmark.',
            'La posición de lectura no es un señalador durable.',
          ),
        ],
        retention: [
          t(
            'SEGMENTS AGE; OFFSETS DO NOT RESET',
            'LOS SEGMENTOS ENVEJECEN; LOS OFFSETS NO VUELVEN A CERO',
          ),
          t('The beginning of the log can move.', 'El comienzo del log puede avanzar.'),
        ],
        compaction: [
          t('A LOG THAT CAN REBUILD STATE', 'UN LOG QUE RECONSTRUYE ESTADO'),
          t('Latest value per key. Stable offsets.', 'Último valor por clave. Offsets estables.'),
        ],
      };
      s = heading(...labels[type]);
      if (type === 'keys') {
        s +=
          box(
            35,
            91,
            160,
            50,
            key,
            'UTF-8',
            C.orange,
            'key',
            t(
              'Hash the serialized key bytes. Other client partitioners can differ.',
              'Se calcula el hash de los bytes. Otros clientes pueden particionar distinto.',
            ),
          ) +
          arrow(195, 116, 254, 116, C.orange) +
          box(
            260,
            91,
            210,
            50,
            'Murmur2 % ' + rows,
            '= ' + target,
            C.green,
            'hash',
            t(
              'Actual Java-compatible Murmur2 calculation. A changed partition count changes the modulo.',
              'Cálculo Murmur2 compatible con Java. Cambiar la cantidad cambia el módulo.',
            ),
          );
        controls.push({ kind: 'text', key: 'key', label: t('Record key', 'Clave'), value: key });
      }
      for (let r = 0; r < rows; r++) {
        const y = (type === 'keys' ? 150 : 118) + r * (rows === 4 ? 68 : 80);
        let records = [];
        if (type === 'compaction')
          records = [
            { label: 'A=10', offset: 0, deleted: toggle },
            { label: 'B=20', offset: 1, deleted: toggle },
            { label: 'A=30', offset: 2 },
            { label: 'B=null', offset: 3, color: C.amber },
          ];
        else if (type === 'retention')
          records = Array.from({ length: 6 }, (_, i) => ({
            label: 'E' + i,
            offset: i,
            deleted: toggle && i < 3,
          }));
        else
          records = Array.from({ length: Math.min(count, 8) }, (_, i) => ({
            label: type === 'keys' ? (r === target ? key.slice(0, 8) : '·') : 'E' + (i + 1),
            offset: i,
            color: type === 'keys' && r === target ? C.amber : C.mint,
          }));
        s += lane(y, 'P' + r, records);
      }
      if (rows === 1) {
        const y = 249;
        if (type === 'offsets') {
          s +=
            arrow(144 + Math.min(pos, 7) * 69, 224, 144 + Math.min(pos, 7) * 69, 185, C.blue) +
            txt(150, y, t('Position: ', 'Posición: ') + pos, 14, C.blue);
          s += txt(
            150,
            y + 30,
            t('Committed next offset: ', 'Próximo offset confirmado: ') + commit,
            14,
            C.purple,
          );
          s += metric(610, 280, Math.max(0, count - commit), t('offset lag', 'lag en offsets'));
          button('read', 'Poll one', 'Leé uno');
          button('commit', 'Commit position', 'Confirmá posición');
        } else if (type === 'retention') {
          s +=
            box(
              130,
              235,
              230,
              65,
              toggle
                ? t('Expired segment', 'Segmento vencido')
                : t('Closed segment', 'Segmento cerrado'),
              '0 · 1 · 2',
              C.orange,
            ) + box(390, 235, 230, 65, t('Active segment', 'Segmento activo'), '3 · 4 · 5');
          s += metric(
            375,
            368,
            toggle ? 3 : 0,
            t('earliest retained offset', 'primer offset retenido'),
          );
          button('toggle', 'Expire closed segment', 'Vencé el segmento cerrado');
        } else if (type === 'compaction') {
          s +=
            arrow(380, 192, 380, 245) +
            box(
              245,
              251,
              270,
              95,
              t('Materialized table', 'Tabla materializada'),
              'A → 30     B → ∅',
              C.purple,
              'table',
              t(
                'Applying the tombstone deletes B even before log cleaning.',
                'Aplicar el tombstone borra B incluso antes de limpiar el log.',
              ),
            );
          button('toggle', 'Toggle cleaner view', 'Alterná la vista de limpieza');
        } else {
          s +=
            arrow(150 + Math.min(pos, 7) * 69, 249, 150 + Math.min(pos, 7) * 69, 187, C.orange) +
            txt(150, 279, t('Reader bookmark', 'Señalador del lector'), 14, C.orange) +
            pill(
              330,
              310,
              290,
              t('Records stay after the reader passes', 'Los mensajes quedan después de leer'),
            );
          button('append', 'Append event', 'Agregá evento');
          button('read', 'Move reader', 'Mové el lector');
        }
      }
      if (type === 'keys' || type === 'partitions')
        range('n', 'Partitions', 'Particiones', 1, 4, n);
    } else if (type === 'record') {
      s = heading(
        t('RECORD / ORDER-42', 'MENSAJE / ORDER-42'),
        t('The payload is only part of the story.', 'El valor es solo una parte de la historia.'),
      );
      s += box(
        60,
        110,
        640,
        65,
        t('Key', 'Clave') + ' → order-42',
        t('serialized bytes · entity identity', 'bytes serializados · identidad de entidad'),
        C.orange,
        'key',
        t(
          'Keys are not unique constraints. They guide routing.',
          'Las claves no imponen unicidad. Orientan el ruteo.',
        ),
      );
      s += box(
        60,
        190,
        640,
        85,
        t('Value', 'Valor') + ' → {"event":"OrderPlaced","amount":120}',
        t('serialized bytes · the business fact', 'bytes serializados · el hecho de negocio'),
        C.green,
        'value',
        t(
          'Kafka stores bytes. JSON is a choice of serializer, not a broker requirement.',
          'Kafka guarda bytes. JSON es una elección, no un requisito del broker.',
        ),
      );
      s += box(
        60,
        290,
        305,
        65,
        t('Headers', 'Cabeceras') + ' → trace-id',
        t('context, not routing', 'contexto, no ruteo'),
        C.purple,
        'headers',
        t(
          'Headers are optional metadata pairs.',
          'Las cabeceras son pares opcionales de metadatos.',
        ),
      );
      s += box(
        385,
        290,
        315,
        65,
        'Timestamp → 10:42:03',
        t('know which clock', 'identificá el reloj'),
        C.blue,
        'timestamp',
        t(
          'The broker timestamp and business event time need not be the same.',
          'El timestamp del broker y la hora de negocio pueden diferir.',
        ),
      );
      if (step > 0) s += pill(145, 382, 470, 'orders / partition 0 / offset 7', C.amber);
    } else if (['groups', 'rebalance', 'share'].includes(type)) {
      const members = state.n || 2;
      s = heading(
        type === 'share' ? 'SHARE GROUP' : 'CONSUMER GROUP',
        type === 'share'
          ? t('Acquire records; acknowledge each one.', 'Adquirí mensajes; confirmá cada uno.')
          : t(
              'One owner per partition, within this group.',
              'Un dueño por partición, dentro de este grupo.',
            ),
      );
      for (let i = 0; i < 3; i++) {
        s += box(
          45,
          115 + i * 85,
          185,
          56,
          'orders / P' + i,
          'E0 · E1 · E2',
          stages[i],
          'partition' + i,
          t(
            'Partition assignment belongs to this consumer group. Other groups read independently.',
            'La asignación pertenece a este grupo. Otros grupos leen por separado.',
          ),
        );
        if (type !== 'share')
          s += arrow(230, 143 + i * 85, 490, 117 + (i % members) * 70 + 26, stages[i]);
      }
      for (let i = 0; i < members; i++)
        s += box(
          490,
          117 + i * 70,
          210,
          52,
          t('Consumer ', 'Consumidor ') + (i + 1),
          i > 2 && type !== 'share'
            ? t('idle · no partition', 'libre · sin partición')
            : type === 'share'
              ? toggle
                ? 'ACCEPT'
                : 'ACQUIRE'
              : t('assigned', 'asignado'),
          i > 2 && type !== 'share' ? C.muted : stages[i % 3],
          'member' + i,
          t(
            'A process running the consumer client.',
            'Un proceso que ejecuta el cliente consumidor.',
          ),
        );
      if (type === 'share') {
        s +=
          arrow(230, 143, 490, 143, C.orange) +
          arrow(230, 143, 490, 213, C.purple, true) +
          pill(256, 260, 205, toggle ? 'ACCEPT → done' : 'RELEASE → retry', C.amber);
        button('toggle', 'Release / accept', 'Liberá / aceptá');
      }
      range('n', 'Group members', 'Miembros del grupo', 1, 4, members);
      s += txt(
        380,
        423,
        type === 'share'
          ? t(
              'Preview in the pinned Kafka 4.1.2 lab; production-ready since Kafka 4.2',
              'Preview en el laboratorio con Kafka 4.1.2; production-ready desde Kafka 4.2',
            )
          : t(
              'A second group gets an independent set of assignments.',
              'Otro grupo obtiene sus propias asignaciones.',
            ),
        13,
        C.muted,
        'middle',
      );
    } else if (['replicas', 'durability', 'quorum'].includes(type)) {
      const live = state.n || 3,
        acks = state.acks || 'all';
      s = heading(
        type === 'quorum' ? 'KRAFT / METADATA' : 'ORDERS / P0',
        type === 'quorum'
          ? t(
              'A majority lets metadata move forward.',
              'Una mayoría permite avanzar con metadatos.',
            )
          : t('One partition. Several copies.', 'Una partición. Varias copias.'),
      );
      for (let i = 0; i < 3; i++) {
        const alive = i < live;
        let role =
          type === 'quorum'
            ? i === 0
              ? t('active controller', 'controlador activo')
              : t('voter', 'votante')
            : i === 0
              ? t('leader', 'líder')
              : t('follower', 'seguidora');
        s += box(
          35 + i * 245,
          129,
          210,
          120,
          'Broker ' + (i + 1),
          alive ? role : t('offline', 'caído'),
          alive ? stages[i] : C.red,
          'replica' + i,
          alive
            ? t(
                'This is a live member in the illustrative model.',
                'Es un miembro vivo en este modelo ilustrativo.',
              )
            : t(
                'This node is unavailable. Real failure detection takes time.',
                'Este nodo no está disponible. La detección real lleva tiempo.',
              ),
        );
        if (i < 2)
          s += arrow(245 + i * 245, 190, 280 + i * 245, 190, alive ? C.green : C.red, true);
      }
      const ok =
        type === 'quorum'
          ? live >= 2
          : type === 'durability'
            ? acks === '1' || live >= 2
            : live >= 2;
      s += pill(
        210,
        290,
        340,
        ok
          ? t('Progress is possible', 'Se puede avanzar')
          : t('The required condition is missing', 'Falta la condición requerida'),
        ok ? C.mint : C.fail,
      );
      if (type === 'quorum')
        s += metric(
          380,
          379,
          live + ' / 3',
          t('live voters · majority = 2', 'votantes vivos · mayoría = 2'),
        );
      else
        s += txt(
          380,
          359,
          `ISR = ${live}     acks = ${acks}     min.insync.replicas = 2`,
          15,
          C.muted,
          'middle',
        );
      range(
        'n',
        type === 'quorum' ? 'Live controllers' : 'ISR members',
        type === 'quorum' ? 'Controladores vivos' : 'Miembros del ISR',
        1,
        3,
        live,
      );
      if (type === 'durability') {
        controls.push({
          kind: 'select',
          key: 'acks',
          label: 'acks',
          value: acks,
          options: ['all', '1'],
        });
      }
    } else if (type === 'producer') {
      const batch = state.n || 3;
      s = heading(
        t('INSIDE THE PRODUCER', 'DENTRO DEL PRODUCTOR'),
        t('Buffer → batch → request → acknowledgment', 'Buffer → lote → pedido → confirmación'),
      );
      s +=
        box(
          35,
          160,
          135,
          90,
          'send()',
          t('application', 'aplicación'),
          C.orange,
          'send',
          t(
            'Completion is asynchronous. Inspect the future or callback.',
            'La finalización es asíncrona. Inspeccioná el future o callback.',
          ),
        ) + arrow(170, 205, 230, 205, C.orange);
      s += box(
        230,
        125,
        260,
        160,
        t('Partition buffer', 'Buffer de partición'),
        'batch.size / linger.ms',
        C.green,
        'batch',
        t(
          'A producer batches per partition, not one global batch for the topic.',
          'El productor arma lotes por partición, no un lote global.',
        ),
      );
      for (let i = 0; i < batch; i++) s += pill(250 + i * 48, 236, 40, 'E' + i);
      s +=
        arrow(490, 205, 565, 205) +
        box(
          565,
          160,
          160,
          90,
          t('Broker', 'Broker'),
          'acks=all',
          C.purple,
          'acks',
          t(
            'The acknowledgment is a broker result, not proof of downstream processing.',
            'La confirmación es un resultado del broker, no prueba de procesamiento posterior.',
          ),
        );
      s +=
        metric(230, 369, 12, t('records', 'mensajes')) +
        metric(530, 369, Math.ceil(12 / batch), t('modeled requests', 'pedidos del modelo'));
      range('n', 'Records per batch', 'Mensajes por lote', 1, 5, batch);
    } else if (type === 'spring') {
      s = heading(
        'SPRING BOOT / JAVA',
        t('One event, three different milestones.', 'Un evento, tres momentos distintos.'),
      );
      s += box(
        30,
        115,
        190,
        80,
        'OrderController',
        'POST /orders/order-42',
        C.orange,
        'http',
        t(
          'Accept a JSON OrderPlaced. The path supplies the key. HTTP 202 is sent after the broker acknowledgment.',
          'Recibí un OrderPlaced JSON. La ruta aporta la clave. HTTP 202 llega después de la confirmación del broker.',
        ),
      );
      s +=
        arrow(220, 155, 265, 155, C.orange) +
        box(
          270,
          115,
          215,
          80,
          'OrderProducer',
          'KafkaTemplate.send(...)',
          C.green,
          'template',
          t(
            'template.send("spring-orders", orderId, event) returns a CompletableFuture. Its result contains topic, partition and offset.',
            'template.send("spring-orders", orderId, event) devuelve un CompletableFuture. El resultado contiene tópico, partición y offset.',
          ),
        );
      s +=
        arrow(485, 155, 530, 155) +
        box(
          535,
          115,
          195,
          80,
          'spring-orders',
          'P0 · P1 · P2 / RF 3',
          C.purple,
          'topic',
          t(
            'TopicBuilder.name("spring-orders").partitions(3).replicas(3). KafkaConfig also sets min.insync.replicas=2.',
            'TopicBuilder.name("spring-orders").partitions(3).replicas(3). KafkaConfig también define min.insync.replicas=2.',
          ),
        );
      s +=
        arrow(630, 195, 630, 268, C.purple) +
        box(
          470,
          275,
          260,
          85,
          'OrderConsumer',
          '@KafkaListener',
          C.blue,
          'listener',
          t(
            '@KafkaListener(topics="spring-orders", groupId="spring-kitchen") receives a ConsumerRecord<String, OrderPlaced>.',
            '@KafkaListener(topics="spring-orders", groupId="spring-kitchen") recibe un ConsumerRecord<String, OrderPlaced>.',
          ),
        );
      s +=
        arrow(470, 317, 325, 317, C.blue) +
        box(
          45,
          275,
          275,
          85,
          t('Group checkpoint', 'Checkpoint del grupo'),
          toggle ? 'next offset = 1' : 'next offset = 0',
          C.green,
          'commit',
          t(
            'AckMode.RECORD commits after a successful listener return. A failure stops this example’s listener; the failed record stays uncommitted.',
            'AckMode.RECORD confirma después de un retorno exitoso. Una falla detiene el listener de este ejemplo; el mensaje fallido queda sin confirmar.',
          ),
        );
      s += pill(
        140,
        397,
        480,
        toggle
          ? t(
              'Listener returned → commit next offset',
              'El listener retornó → confirmar próximo offset',
            )
          : t('Broker ACK ≠ listener completed', 'ACK del broker ≠ listener terminado'),
        toggle ? C.mint : C.amber,
      );
      button('toggle', 'Broker ACK / listener done', 'ACK del broker / listener terminó');
    } else if (type === 'idempotence') {
      s = heading(
        t(
          'PROTOCOL IDENTITY ≠ BUSINESS IDENTITY',
          'IDENTIDAD DEL PROTOCOLO ≠ IDENTIDAD DE NEGOCIO',
        ),
        t('A retry and a new send are not the same.', 'Un reintento y otro envío no son lo mismo.'),
      );
      s +=
        box(
          30,
          125,
          220,
          95,
          t('Application', 'Aplicación'),
          toggle ? 'send(E42) · send(E42)' : 'send(E42) → retry',
          C.orange,
          'app',
          t(
            'Calling send twice creates two logical records even when their payload is identical.',
            'Llamar dos veces a send crea dos mensajes lógicos aunque el contenido sea idéntico.',
          ),
        ) + arrow(250, 173, 310, 173, C.orange);
      s +=
        box(
          315,
          125,
          190,
          95,
          t('Producer protocol', 'Protocolo productor'),
          toggle ? 'seq 0 · seq 1' : 'seq 0 · seq 0',
          C.green,
          'sequence',
          t(
            'The broker recognizes producer identity and sequence numbers for retries of the same batch.',
            'El broker reconoce identidad de productor y secuencias para reintentos del mismo lote.',
          ),
        ) + arrow(505, 173, 555, 173);
      s += box(
        560,
        125,
        170,
        95,
        t('Stored log', 'Log guardado'),
        toggle ? 'E42 · E42' : 'E42',
        C.purple,
        'stored',
        t(
          'A repeated key or event ID is not a uniqueness constraint in Kafka.',
          'Una clave o ID repetido no es una restricción de unicidad en Kafka.',
        ),
      );
      s +=
        metric(380, 310, toggle ? 2 : 1, t('logical records', 'mensajes lógicos')) +
        pill(
          155,
          375,
          450,
          t(
            'Business deduplication needs a durable event ID',
            'Deduplicar negocio necesita un ID de evento durable',
          ),
          C.amber,
        );
      button('toggle', 'Retry / new send', 'Reintento / otro envío');
    } else if (type === 'delivery') {
      const before = step === 0,
        crashed = toggle;
      s = heading(
        t('TWO SEPARATE ACTIONS', 'DOS ACCIONES SEPARADAS'),
        before
          ? t(
              'Commit first: a crash can skip the effect.',
              'Primero commit: una caída puede saltear el efecto.',
            )
          : t(
              'Effect first: a crash can repeat it.',
              'Primero el efecto: una caída puede repetirlo.',
            ),
      );
      s += box(
        35,
        135,
        190,
        90,
        before
          ? t('1. Commit offset', '1. Confirmar offset')
          : t('1. Apply effect', '1. Aplicar efecto'),
        before ? 'next = 1' : 'effect(E1)',
        C.green,
        'first',
        t(
          'This action completes before the failure point.',
          'Esta acción termina antes del punto de falla.',
        ),
      );
      s +=
        arrow(225, 180, 285, 180, crashed ? C.red : C.green) +
        box(
          290,
          135,
          180,
          90,
          crashed ? t('CRASH', 'CAÍDA') : t('Continue', 'Continuar'),
          crashed ? t('then restart', 'y reiniciar') : '→',
          crashed ? C.red : C.green,
          'gap',
          t(
            'Kafka cannot atomically include an arbitrary external side effect and an offset commit.',
            'Kafka no puede incluir atómicamente un efecto externo arbitrario y un commit de offset.',
          ),
        );
      s +=
        arrow(470, 180, 530, 180, crashed ? C.red : C.green) +
        box(
          535,
          135,
          190,
          90,
          before
            ? t('2. Apply effect', '2. Aplicar efecto')
            : t('2. Commit offset', '2. Confirmar offset'),
          crashed ? t('not reached', 'no llegó') : before ? 'effect(E1)' : 'next = 1',
          C.blue,
          'second',
          t(
            'A restart resumes from the last committed next offset.',
            'Un reinicio retoma desde el último próximo offset confirmado.',
          ),
        );
      s += metric(
        380,
        315,
        crashed ? (before ? 0 : 2) : 1,
        t('effects after recovery', 'efectos tras recuperar'),
        crashed ? C.orange : C.green,
      );
      s += pill(
        155,
        380,
        450,
        step === 2
          ? t(
              'Retries and DLT routing need a deliberate policy',
              'Reintentos y DLT necesitan una política explícita',
            )
          : before
            ? t('At most once: work can be lost', 'Como máximo una vez: se puede perder trabajo')
            : t(
                'At least once: make duplicates safe',
                'Al menos una vez: hacé seguros los duplicados',
              ),
        C.amber,
      );
      button('toggle', 'Crash / normal run', 'Caída / corrida normal');
    } else if (['transactions', 'capstone'].includes(type)) {
      s = heading(
        type === 'capstone'
          ? 'CAFÉ / END-TO-END'
          : t('THE FAILURE BOUNDARY', 'EL LÍMITE DE LA FALLA'),
        type === 'idempotence'
          ? t(
              'A retry and a new send are not the same.',
              'Un reintento y otro envío no son lo mismo.',
            )
          : t(
              'Follow the effect and the durable bookmark.',
              'Seguí el efecto y el señalador durable.',
            ),
      );
      s +=
        box(
          35,
          160,
          170,
          85,
          t('Input log', 'Log de entrada'),
          'E1 / offset 0',
          C.orange,
          'input',
          t(
            'The input record remains available for replay.',
            'El mensaje de entrada queda disponible para replay.',
          ),
        ) + arrow(205, 203, 284, 203, C.orange);
      s += box(
        285,
        126,
        195,
        155,
        type === 'idempotence'
          ? toggle
            ? 'send() + send()'
            : 'retry(sequence=0)'
          : t('Transaction', 'Transacción'),
        toggle ? t('aborted / crashed', 'abortada / caída') : t('committed', 'confirmada'),
        toggle ? C.red : C.green,
        'tx',
        t(
          'Kafka transactions can include output and input offsets. External systems are outside.',
          'Las transacciones pueden incluir salida y offsets de entrada. Los sistemas externos quedan afuera.',
        ),
      );
      s +=
        arrow(480, 203, 555, 203, toggle ? C.red : C.green) +
        box(
          555,
          160,
          170,
          85,
          t('Output', 'Salida'),
          type === 'idempotence'
            ? toggle
              ? 'E1 · E1'
              : 'E1'
            : type === 'delivery'
              ? toggle
                ? 'E1 · E1'
                : 'E1'
              : toggle
                ? '∅'
                : 'E1',
          C.purple,
          'output',
          t(
            'This view shows committed visibility, not physical storage.',
            'Esta vista muestra visibilidad confirmada, no almacenamiento físico.',
          ),
        );
      s += box(
        250,
        330,
        260,
        60,
        t('Durable bookmark', 'Señalador durable'),
        toggle ? 'next = 0' : 'next = 1',
        C.blue,
        'commit',
        t(
          'The next input offset to resume from after restart.',
          'El próximo offset de entrada desde el que retomar al reiniciar.',
        ),
      );
      s += arrow(381, 283, 381, 327, C.blue, true);
      button(
        'toggle',
        type === 'idempotence'
          ? 'Retry / new send'
          : type === 'delivery'
            ? 'Crash / normal run'
            : 'Abort / commit',
        type === 'idempotence'
          ? 'Reintento / otro envío'
          : type === 'delivery'
            ? 'Caída / corrida normal'
            : 'Abortá / confirmá',
      );
      if (type === 'transactions')
        s += txt(
          380,
          425,
          t(
            'read_committed view · aborted records can exist on disk',
            'Vista read_committed · los abortados pueden existir en disco',
          ),
          12,
          C.muted,
          'middle',
        );
    } else if (type === 'schema') {
      s = heading(
        t('WRITER ↔ READER CONTRACT', 'CONTRATO ESCRITOR ↔ LECTOR'),
        t(
          'Backward: can the new reader read old data?',
          'Hacia atrás: ¿el lector nuevo lee datos viejos?',
        ),
      );
      s +=
        box(
          40,
          145,
          220,
          130,
          t('Writer v1', 'Escritor v1'),
          'amount: string',
          C.orange,
          'writer',
          t(
            'The writer schema describes how the stored bytes were encoded.',
            'El esquema escritor describe cómo se codificaron los bytes.',
          ),
        ) + arrow(260, 210, 480, 210, toggle ? C.red : C.green);
      s += box(
        480,
        145,
        240,
        130,
        t('Reader v2', 'Lector v2'),
        toggle ? 'amount: record' : 'currency: default "ARS"',
        toggle ? C.red : C.green,
        'reader',
        t(
          'The reader schema describes the structure expected by the consumer.',
          'El esquema lector describe lo que espera el consumidor.',
        ),
      );
      s += pill(250, 325, 260, toggle ? 'INCOMPATIBLE' : 'COMPATIBLE', toggle ? C.fail : C.mint);
      button('toggle', 'Default field / type change', 'Campo por defecto / otro tipo');
    } else if (type === 'connect') {
      s = heading(
        t('CONNECT / RUNTIME AND WORK', 'CONNECT / EJECUCIÓN Y TRABAJO'),
        t(
          'A task can fail while a connector remains running.',
          'Una tarea puede fallar con el conector en marcha.',
        ),
      );
      s +=
        `<rect x="205" y="102" width="350" height="285" rx="18" fill="${C.glass}" stroke="${C.line}"/>` +
        txt(230, 133, 'WORKER', 13, C.green);
      s +=
        box(
          240,
          157,
          280,
          57,
          'Connector',
          'RUNNING',
          C.green,
          'connector',
          t('Defines the integration and creates tasks.', 'Define la integración y crea tareas.'),
        ) +
        box(
          240,
          236,
          125,
          75,
          'Task 0',
          toggle ? 'FAILED' : 'RUNNING',
          toggle ? C.red : C.green,
          'task',
          t(
            'A task executes actual work. Inspect its errors separately.',
            'Una tarea ejecuta trabajo real. Revisá sus errores por separado.',
          ),
        ) +
        box(
          385,
          236,
          135,
          75,
          t('Converter', 'Convertidor'),
          'bytes ↔ data',
          C.purple,
          'converter',
          t(
            'Converts the Connect data model to Kafka bytes or back.',
            'Convierte entre el modelo de Connect y bytes Kafka.',
          ),
        );
      s +=
        box(25, 230, 140, 75, t('File source', 'Archivo origen'), 'line 1', C.orange) +
        arrow(165, 266, 238, 266, C.orange) +
        arrow(522, 266, 594, 266, toggle ? C.red : C.green) +
        box(595, 230, 140, 75, 'Kafka', 'lab18');
      button('toggle', 'Fail / recover task', 'Fallá / recuperá la tarea');
    } else if (type === 'outbox') {
      s = heading(
        t('ONE DATABASE TRANSACTION', 'UNA TRANSACCIÓN DE BASE'),
        t('The order and its event are born together.', 'El pedido y su evento nacen juntos.'),
      );
      s +=
        `<rect x="30" y="110" width="325" height="230" rx="18" fill="${C.glass}" stroke="${C.green}"/>` +
        txt(55, 143, 'PostgreSQL', 17, C.green);
      s +=
        box(
          55,
          168,
          275,
          60,
          'orders',
          'order-42 → accepted',
          C.green,
          'order',
          t(
            'The business row and event row are inserted in one database transaction.',
            'La fila de negocio y el evento se insertan en la misma transacción.',
          ),
        ) +
        box(
          55,
          251,
          275,
          60,
          'outbox',
          'event-42 → pending',
          C.orange,
          'outbox',
          t(
            'A durable outbox row survives a crash before Kafka publication.',
            'La fila durable sobrevive a una caída anterior a publicar en Kafka.',
          ),
        );
      s +=
        arrow(355, 279, 420, 279, C.orange) +
        box(
          425,
          240,
          130,
          78,
          'Relay',
          toggle ? t('retry', 'reintento') : t('publish', 'publicar'),
        ) +
        arrow(555, 279, 600, 279) +
        box(605, 240, 130, 78, 'Kafka', toggle ? 'E42 · E42' : 'E42', C.purple);
      s += pill(
        200,
        377,
        360,
        t('Stable event ID survives relay retries', 'El ID estable sobrevive a los reintentos'),
      );
      button('toggle', 'Crash & retry relay', 'Caé y reintentá el relay');
    } else if (type === 'streams') {
      const c = state.count || 2;
      s = heading(
        'KAFKA STREAMS',
        t(
          'A topology lives inside your application.',
          'Una topología vive dentro de tu aplicación.',
        ),
      );
      s +=
        box(30, 160, 155, 80, 'KStream', 'A · A · B', C.orange) +
        arrow(185, 200, 262, 200, C.orange) +
        box(
          265,
          130,
          235,
          140,
          'groupByKey().count()',
          t('local state store', 'store local'),
          C.green,
          'store',
          t(
            'Each task maintains the state required for its assigned data.',
            'Cada tarea mantiene el estado que necesita para sus datos.',
          ),
        ) +
        arrow(500, 200, 570, 200) +
        box(575, 160, 155, 80, 'KTable', 'A → ' + c + '  B → 1', C.purple);
      s +=
        arrow(380, 270, 380, 328, C.blue, true) +
        box(
          220,
          333,
          320,
          66,
          'changelog',
          t('recoverable state updates', 'cambios de estado recuperables'),
          C.blue,
          'changelog',
          t(
            'The changelog backs the local store. It is not the same as the input topic.',
            'El changelog respalda el store. No es el mismo tópico de entrada.',
          ),
        );
      button('append', 'Apply another A', 'Aplicá otro A');
    } else if (type === 'windows') {
      const late = state.n || 1;
      s = heading(
        t('EVENT TIME / 10-SECOND WINDOWS', 'HORA DEL EVENTO / VENTANAS DE 10 SEGUNDOS'),
        t(
          'Window closes after end + grace, as stream time advances.',
          'La ventana cierra tras fin + tolerancia al avanzar el flujo.',
        ),
      );
      s += `<line x1="50" y1="235" x2="710" y2="235" stroke="${C.line}" stroke-width="3"/>`;
      for (let i = 0; i < 3; i++) {
        s +=
          `<rect x="${55 + i * 220}" y="135" width="205" height="98" rx="10" fill="${i === 0 ? C.mint : C.panelAlt}"/>` +
          txt(155 + i * 220, 170, `[${i * 10}, ${(i + 1) * 10})`, 20, C.ink, 'middle') +
          txt(
            155 + i * 220,
            207,
            i === 0 ? 'count = ' + (late === 2 ? 2 : late === 3 ? 2 : 1) : '·',
            16,
            C.green,
            'middle',
          ) +
          txt(55 + i * 220, 260, i * 10 + 's', 12, C.muted);
      }
      s += box(
        190,
        310,
        380,
        64,
        late === 1
          ? 't = 1s'
          : late === 2
            ? 't = 4s / stream time = 12s'
            : 't = 2s / stream time = 30s',
        late === 3
          ? t('too late → dropped', 'demasiado tarde → descartado')
          : t('accepted → update the window', 'aceptado → actualizá la ventana'),
        late === 3 ? C.red : C.green,
      );
      range('n', 'Arrival scenario', 'Escenario de llegada', 1, 3, late);
    } else if (type === 'security') {
      s = heading(
        t('IDENTITY ≠ PERMISSION', 'IDENTIDAD ≠ PERMISO'),
        t(
          'A valid identity can still be denied.',
          'Una identidad válida puede recibir un rechazo.',
        ),
      );
      s +=
        box(35, 170, 170, 90, toggle ? 'User:reader' : 'User:writer', 'SASL', C.orange) +
        arrow(205, 215, 280, 215, C.orange) +
        box(
          285,
          132,
          190,
          165,
          'ACL',
          toggle ? 'READ' : 'WRITE',
          C.green,
          'acl',
          t(
            'An ACL authorizes a principal, operation and resource.',
            'Una ACL autoriza un principal, operación y recurso.',
          ),
        ) +
        arrow(475, 215, 550, 215, toggle ? C.red : C.green) +
        box(
          555,
          170,
          170,
          90,
          'WRITE orders',
          toggle ? 'DENIED' : 'ALLOWED',
          toggle ? C.red : C.green,
        );
      s += pill(
        200,
        350,
        360,
        t('TLS encrypts the connection separately', 'TLS cifra la conexión por separado'),
      );
      button('toggle', 'Writer / reader identity', 'Identidad escritora / lectora');
    } else if (type === 'metrics' || type === 'scaling') {
      s = heading(
        type === 'metrics'
          ? t('BACKLOG IS A FLOW BALANCE', 'EL PENDIENTE DEPENDE DEL BALANCE')
          : t('ESTIMATE WITH UNITS', 'ESTIMÁ CON UNIDADES'),
        type === 'metrics'
          ? t(
              'Production minus consumption changes the backlog.',
              'Producción menos consumo cambia el pendiente.',
            )
          : t('Rate × bytes × retention × replicas', 'Tasa × bytes × retención × réplicas'),
      );
      const rate = state.rate || 1000,
        read = state.readRate || 800,
        days = state.days || 1;
      if (type === 'metrics') {
        s +=
          metric(160, 160, rate, t('events / second in', 'eventos / segundo entran')) +
          metric(590, 160, read, t('events / second out', 'eventos / segundo salen'));
        s +=
          arrow(220, 220, 540, 220) +
          box(
            245,
            266,
            270,
            90,
            (rate - read > 0 ? '+' : '') + (rate - read) + ' / s',
            rate > read
              ? t('backlog grows', 'el pendiente crece')
              : t('backlog can drain', 'el pendiente puede bajar'),
            rate > read ? C.orange : C.green,
          );
        range('rate', 'Producer rate', 'Tasa productora', 200, 2000, rate);
        range('readRate', 'Consumer rate', 'Tasa consumidora', 200, 2000, read);
      } else {
        s +=
          metric(155, 165, rate, t('events / second', 'eventos / segundo')) +
          metric(380, 165, '1 KB', t('serialized event', 'evento serializado')) +
          metric(605, 165, days, t('days of retention', 'días de retención'));
        s += box(
          140,
          250,
          480,
          110,
          ((rate * 1000 * 86400 * days * 3) / 1e9).toFixed(1) + ' GB',
          t(
            'raw replicated estimate · RF 3 · before overhead',
            'estimación bruta replicada · RF 3 · sin extras',
          ),
        );
        range('rate', 'Events / second', 'Eventos / segundo', 100, 5000, rate);
        range('days', 'Retention days', 'Días de retención', 1, 7, days);
      }
    } else if (type === 'mirror') {
      s = heading(
        t('CROSS-CLUSTER COPY', 'COPIA ENTRE CLÚSTERES'),
        t('Same fact. Different log coordinates.', 'Mismo hecho. Distintas coordenadas.'),
      );
      s +=
        box(
          45,
          130,
          265,
          170,
          t('Cluster A', 'Clúster A'),
          'E42 → offset 0',
          C.green,
          'source',
          t(
            'The source has its own independent log offsets.',
            'El origen tiene sus propios offsets independientes.',
          ),
        ) +
        arrow(310, 215, 450, 215, C.orange, true) +
        box(
          455,
          130,
          265,
          170,
          t('Cluster B', 'Clúster B'),
          toggle ? 'E42 → 1, 2' : 'E42 → offset 1',
          C.purple,
          'target',
          t(
            'A target can already contain records. Copying does not preserve source offsets.',
            'El destino puede tener mensajes previos. Copiar no conserva offsets del origen.',
          ),
        );
      s += pill(
        170,
        350,
        420,
        t(
          'Replication lag sets a recovery exposure',
          'El atraso de réplica expone a pérdida al recuperar',
        ),
        C.amber,
      );
      button('toggle', 'Repeat naive copy', 'Repetí la copia ingenua');
    }
    const defs = Object.values(C)
      .filter((x) => /^#[0-9a-f]{6}$/i.test(x))
      .map(
        (c) =>
          `<marker id="arrow-${c.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${c}"/></marker>`,
      )
      .join('');
    const focus = Object.keys(details).filter((k) => !k.startsWith('record-'));
    if (focus.length) {
      const selected = focus[Math.min(step, focus.length - 1)];
      s = s.replace(`data-node="${selected}"`, `data-node="${selected}" data-focus="true"`);
    }
    return {
      svg: `<svg viewBox="0 0 760 460" role="group" aria-label="${esc(t('Interactive teaching model. Select labeled objects for details.', 'Modelo didáctico interactivo. Seleccioná objetos para ver detalles.'))}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${s}</svg>`,
      controls,
      details,
    };
  }
  return { render, murmur2, palette, themes: Object.keys(PALETTES) };
})();
