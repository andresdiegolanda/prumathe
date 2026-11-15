/* The big picture of a course: every piece on one scene, a card per piece and per item, and
   journeys that a dot follows stop by stop, carrying the items of each stop. The scene and the
   journeys come from assets/big-picture-data.js (window.BIG_PICTURE); the lesson titles and
   links, from the course object. The page keeps its state (journey, stop, card, camera) in the
   address, draws with the variables of the active skin and never writes inline styles, so it
   works under a CSP without 'unsafe-inline'. The same file serves every course; validate() and
   outline() also run in Node, for check.mjs and for the text that build.mjs puts in <noscript>. */
(() => {
  'use strict';
  const BP = (window.BigPicture = window.BigPicture || {});

  const UI = {
    en: {
      title: 'Big picture', back: 'Course', startOver: 'Start over', legend: 'Legend', howTo: 'How to use',
      text: 'Text version', skin: 'Skin', language: 'Language', close: 'Close', journeys: 'Journeys',
      stops: 'stops', stop: 'Stop', of: 'of', play: 'Play', pause: 'Pause', next: 'Next stop', prev: 'Previous stop',
      first: 'First stop', speed: 'Speed', slow: 'slow', normal: 'normal', fast: 'fast', noJourney: 'No journey yet',
      pick: 'Pick a journey, or click any piece of the scene.', shows: 'What this picture shows',
      startWith: 'Start with journey', thenWith: 'Then journey', carries: 'What the dot carries',
      carriesNothing: 'Nothing yet.', thisPiece: 'This piece', about: 'About', aboutHint: 'what it is, what it holds',
      deeper: 'Go deeper', lesson: 'Lesson', tryIt: 'Try it', copy: 'Copy', copied: 'Copied',
      hint: 'Click the dot or press → for the next stop', drag: 'Drag to move · wheel or pinch to zoom · click a piece',
      zoomIn: 'Zoom in', zoomOut: 'Zoom out', fit: 'Fit', follow: 'Follow', on: 'on', off: 'off',
      what: 'What it is', holds: 'What it holds', not: 'What it does not do', through: 'Journeys through here',
      noneThrough: 'No journey stops here.', comesFrom: 'Comes from', endsUp: 'Ends up', heldBy: 'Held by', lives: 'Where it is, moment by moment',
      carriedIn: 'Carried in', overview: 'Overview', end: 'End of the journey', nextJourney: 'Next: journey',
      again: 'Again', backTo: 'Back to the stop', piece: 'Piece', item: 'Item', where: 'Where you see it',
      zone: 'Area', zones: 'Areas', inside: 'What is inside', zoneJourneys: 'Journeys that cross it', noneCross: 'No journey crosses it.',
      howZones: 'Click the name or the empty space of an area for its card: what it is, what it does not do and what is inside.',
      edges: 'Lines', nodes: 'Pieces', tags: 'Evidence', stamps: 'Stamps', dot: 'The dot',
      dotText: 'The dot is the request or the message of the journey; the letters next to it are what it carries.',
      stampText: 'A stamp marks a decision at a piece: green lets it pass, orange stops it, grey only notes.',
      allStops: 'All stops of this journey', journey: 'Journey', textIntro: 'The same picture as text: every journey, stop by stop, and every piece.',
      keys: 'Keyboard', mouse: 'Mouse and touch', current: 'Current stop', visited: 'visited',
      announce: (j, s, n, node, text) => `Journey ${j}, stop ${s} of ${n}, ${node}. ${text}`,
      howItems: [
        'Pick a journey: the dot travels from piece to piece and stops where something is decided.',
        'At each stop the panel explains what happens, what the dot carries and which lesson goes deeper.',
        'Click any piece for its card: what it is, what it holds, what it does not do, and every journey that stops there.',
        'The letters are the items the dot carries. Click one to see where it comes from and where it ends up.',
      ],
      howKeys: [
        ['→ or Space', 'next stop; Space plays and pauses'], ['←', 'previous stop'], ['Home / End', 'first / last stop'],
        ['1 to 9', 'journey by number'], ['+ / −', 'zoom'], ['F', 'fit the scene'], ['W', 'follow the dot'],
        ['H', 'show where items live'], ['L', 'legend'], ['T', 'text version'], ['R', 'start over'], ['Esc', 'close, then back to the overview'],
      ],
    },
    es: {
      title: 'Panorama', back: 'Curso', startOver: 'Empezar de nuevo', legend: 'Referencias', howTo: 'Cómo se usa',
      text: 'Versión en texto', skin: 'Apariencia', language: 'Idioma', close: 'Cerrar', journeys: 'Recorridos',
      stops: 'paradas', stop: 'Parada', of: 'de', play: 'Reproducir', pause: 'Pausa', next: 'Parada siguiente', prev: 'Parada anterior',
      first: 'Primera parada', speed: 'Velocidad', slow: 'lento', normal: 'normal', fast: 'rápido', noJourney: 'Ningún recorrido todavía',
      pick: 'Elegí un recorrido, o hacé clic en cualquier pieza de la escena.', shows: 'Qué muestra este panorama',
      startWith: 'Empezar por el recorrido', thenWith: 'Después, el recorrido', carries: 'Qué lleva el punto',
      carriesNothing: 'Nada todavía.', thisPiece: 'Esta pieza', about: 'Sobre', aboutHint: 'qué es, qué guarda',
      deeper: 'Para profundizar', lesson: 'Lección', tryIt: 'Probalo', copy: 'Copiar', copied: 'Copiado',
      hint: 'Hacé clic en el punto o apretá → para la parada siguiente', drag: 'Arrastrá para mover · rueda o pellizco para acercar · clic en una pieza',
      zoomIn: 'Acercar', zoomOut: 'Alejar', fit: 'Ajustar', follow: 'Seguir', on: 'sí', off: 'no',
      what: 'Qué es', holds: 'Qué guarda', not: 'Qué no hace', through: 'Recorridos que pasan por acá',
      noneThrough: 'Ningún recorrido para acá.', comesFrom: 'De dónde viene', endsUp: 'Dónde termina', heldBy: 'Lo guarda', lives: 'Dónde está, momento a momento',
      carriedIn: 'Viaja en', overview: 'Inicio', end: 'Fin del recorrido', nextJourney: 'Sigue: recorrido',
      again: 'Otra vez', backTo: 'Volver a la parada', piece: 'Pieza', item: 'Elemento', where: 'Dónde se ve',
      zone: 'Zona', zones: 'Zonas', inside: 'Qué hay adentro', zoneJourneys: 'Recorridos que la cruzan', noneCross: 'Ningún recorrido la cruza.',
      howZones: 'Hacé clic en el nombre o en el espacio libre de una zona para ver su ficha: qué es, qué no hace y qué hay adentro.',
      edges: 'Líneas', nodes: 'Piezas', tags: 'Evidencia', stamps: 'Sellos', dot: 'El punto',
      dotText: 'El punto es el pedido o el mensaje del recorrido; las letras que lo acompañan son lo que lleva.',
      stampText: 'Un sello marca una decisión en una pieza: verde deja pasar, naranja frena, gris solo anota.',
      allStops: 'Todas las paradas del recorrido', journey: 'Recorrido', textIntro: 'El mismo panorama en texto: cada recorrido, parada por parada, y cada pieza.',
      keys: 'Teclado', mouse: 'Mouse y pantalla táctil', current: 'Parada actual', visited: 'visitada',
      announce: (j, s, n, node, text) => `Recorrido ${j}, parada ${s} de ${n}, ${node}. ${text}`,
      howItems: [
        'Elegí un recorrido: el punto viaja de pieza en pieza y se detiene donde se decide algo.',
        'En cada parada, el panel explica qué pasa, qué lleva el punto y qué lección lo profundiza.',
        'Hacé clic en cualquier pieza para ver su ficha: qué es, qué guarda, qué no hace y cada recorrido que para ahí.',
        'Las letras son lo que lleva el punto. Hacé clic en una para ver de dónde viene y dónde termina.',
      ],
      howKeys: [
        ['→ o Espacio', 'parada siguiente; Espacio reproduce y pausa'], ['←', 'parada anterior'], ['Inicio / Fin', 'primera / última parada'],
        ['1 a 9', 'recorrido por número'], ['+ / −', 'zoom'], ['F', 'ajustar la escena'], ['W', 'seguir al punto'],
        ['H', 'mostrar dónde viven los elementos'], ['L', 'referencias'], ['T', 'versión en texto'], ['R', 'empezar de nuevo'], ['Esc', 'cerrar, y después volver al inicio'],
      ],
    },
  };
  const EDGE_KINDS = ['call', 'read', 'async', 'admin', 'risk'];
  const EDGE_NAMES = {
    call: { en: 'a call or a request, in the direction of the arrow', es: 'una llamada o un pedido, en el sentido de la flecha' },
    read: { en: 'reads configuration, keys or metadata', es: 'lee configuración, claves o metadatos' },
    async: { en: 'a message that does not wait for an answer', es: 'un mensaje que no espera respuesta' },
    admin: { en: 'set up once, by an administrator or a pipeline', es: 'se configura una vez, por una persona administradora o un pipeline' },
    risk: { en: 'a path that must not work', es: 'un camino que no tiene que funcionar' },
  };
  const TONES = ['ok', 'deny', 'info'];
  const SHORT = {
    title: { en: 'Reading the picture', es: 'Cómo leer el dibujo' },
    call: { en: 'a request', es: 'un pedido' }, read: { en: 'reads keys or configuration', es: 'lee claves o configuración' },
    async: { en: 'a message, no waiting', es: 'un mensaje, sin esperar' }, admin: { en: 'set up once', es: 'se configura una vez' },
    risk: { en: 'must not work', es: 'no tiene que funcionar' }, trail: { en: 'the dot\'s way', es: 'el camino del punto' },
    dot: { en: 'the dot, its load', es: 'el punto y su carga' },
  };

  const L = (x, lang) => (x == null ? '' : typeof x === 'string' ? x : x[lang] ?? x.en ?? '');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const pad = (n) => String(n).padStart(2, '0');

  /* Geometry, shared by the page and by validate(). A route is a polyline from the border of one
     piece to the border of the other: straight when the pieces face each other, an elbow when they
     do not, or through the points that the data gives. */
  function box(n) {
    return { x: n.x, y: n.y, w: n.w, h: n.h, cx: n.x + n.w / 2, cy: n.y + n.h / 2, r: n.x + n.w, b: n.y + n.h };
  }
  function anchor(n, p) {
    const k = box(n);
    if (p[0] > k.x && p[0] < k.r) return [p[0], p[1] < k.cy ? k.y : k.b];
    if (p[1] > k.y && p[1] < k.b) return [p[0] < k.cx ? k.x : k.r, p[1]];
    return Math.abs(p[0] - k.cx) / k.w > Math.abs(p[1] - k.cy) / k.h ? [p[0] < k.cx ? k.x : k.r, k.cy] : [k.cx, p[1] < k.cy ? k.y : k.b];
  }
  function route(nodes, edge) {
    const a = box(nodes[edge.from]), b = box(nodes[edge.to]), s = edge.shift || 0;
    if (edge.points?.length) {
      const pts = edge.points.map((p) => p.slice());
      return [anchor(nodes[edge.from], pts[0]), ...pts, anchor(nodes[edge.to], pts.at(-1))];
    }
    const ox0 = Math.max(a.x, b.x), ox1 = Math.min(a.r, b.r), oy0 = Math.max(a.y, b.y), oy1 = Math.min(a.b, b.b);
    if (edge.route !== 'hv' && edge.route !== 'vh') {
      if (ox1 - ox0 >= 16) {
        const x = (ox0 + ox1) / 2 + s;
        return a.b <= b.y ? [[x, a.b], [x, b.y]] : [[x, a.y], [x, b.b]];
      }
      if (oy1 - oy0 >= 12) {
        const y = (oy0 + oy1) / 2 + s;
        return a.r <= b.x ? [[a.r, y], [b.x, y]] : [[a.x, y], [b.r, y]];
      }
    }
    if (edge.route === 'hv') {
      const sx = b.cx > a.cx ? a.r : a.x, ey = b.cy > a.cy ? b.y : b.b;
      return [[sx, a.cy + s], [b.cx + s, a.cy + s], [b.cx + s, ey]];
    }
    if (edge.route === 'vh') {
      const sy = b.cy > a.cy ? a.b : a.y, ex = b.cx > a.cx ? b.x : b.r;
      return [[a.cx + s, sy], [a.cx + s, b.cy + s], [ex, b.cy + s]];
    }
    const gapX = b.x >= a.r ? b.x - a.r : a.x >= b.r ? a.x - b.r : -1;
    const gapY = b.y >= a.b ? b.y - a.b : a.y >= b.b ? a.y - b.b : -1;
    if (gapX >= gapY) {
      const right = b.x >= a.r, mx = (right ? (a.r + b.x) / 2 : (a.x + b.r) / 2) + s;
      return [[right ? a.r : a.x, a.cy], [mx, a.cy], [mx, b.cy], [right ? b.x : b.r, b.cy]];
    }
    const down = b.y >= a.b, my = (down ? (a.b + b.y) / 2 : (a.y + b.b) / 2) + s;
    return [[a.cx, down ? a.b : a.y], [a.cx, my], [b.cx, my], [b.cx, down ? b.y : b.b]];
  }
  function length(pts) {
    let n = 0;
    for (let i = 1; i < pts.length; i++) n += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return n;
  }
  function at(pts, t) {
    const total = length(pts);
    let goal = total * t;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (goal <= d || i === pts.length - 1) {
        const k = d ? Math.min(1, goal / d) : 1;
        return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
      }
      goal -= d;
    }
    return pts.at(-1);
  }
  function rounded(pts, r = 9) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const a = Math.min(r, Math.hypot(x1 - x0, y1 - y0) / 2), b = Math.min(r, Math.hypot(x2 - x1, y2 - y1) / 2);
      const u = [x1 - Math.sign(x1 - x0) * a, y1 - Math.sign(y1 - y0) * a], v = [x1 + Math.sign(x2 - x1) * b, y1 + Math.sign(y2 - y1) * b];
      d += ` L${u[0]} ${u[1]} Q${x1} ${y1} ${v[0]} ${v[1]}`;
    }
    return d + ` L${pts.at(-1)[0]} ${pts.at(-1)[1]}`;
  }
  // The edge between two consecutive stops, in either direction.
  function link(D, a, b) {
    const i = D.edges.findIndex((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a));
    return i < 0 ? null : { index: i, reverse: D.edges[i].from !== a };
  }
  // The pieces the dot crosses to reach stop k: from the previous stop, through via, to this one.
  function hops(j, k) {
    const chain = [j.stops[k - 1].node, ...(j.stops[k].via || []), j.stops[k].node], out = [];
    for (let i = 1; i < chain.length; i++) if (chain[i] !== chain[i - 1]) out.push([chain[i - 1], chain[i]]);
    return out;
  }

  /* The checks that check.mjs runs on the data of every course: ids, references, geometry, every
     text in every language, and journeys that move only along lines of the scene. */
  BP.validate = (D, course, opts = {}) => {
    const errors = [], langs = D.config.langs, fail = (m) => errors.push(m);
    const text = (x, where) => {
      for (const l of langs) if (!L(x, l) || (typeof x === 'object' && !x[l])) fail(`${where}: no ${l} text`);
    };
    const lessons = new Set(course.lessons.map((l) => l.id));
    const nodes = D.nodes, items = D.items, ids = Object.keys(nodes);
    const inside = (k, z, m = 0) => k.x >= z.x + m && k.y >= z.y + m && k.x + k.w <= z.x + z.w - m && k.y + k.h <= z.y + z.h - m;
    text(D.title, 'title');
    text(D.subtitle, 'subtitle');
    D.intro.forEach((p, i) => text(p, 'intro ' + i));
    for (const z of D.zones) {
      text(z.label, 'zone ' + z.id);
      if (z.note) text(z.note, `zone ${z.id}.note`);
      // A zone may have a card, like a piece: what it is and what it does not do, both or neither.
      if (z.what || z.not) for (const k of ['what', 'not']) text(z[k], `zone ${z.id}.${k}`);
      for (const l of z.lessons || []) if (!lessons.has(l)) fail(`zone ${z.id}: unknown lesson ${l}`);
      if (z.x < 0 || z.y < 0 || z.x + z.w > D.scene.w || z.y + z.h > D.scene.h) fail('zone outside the scene: ' + z.id);
      if (z.parent && !D.zones.some((p) => p.id === z.parent && inside(z, p, 4))) fail('zone outside its parent: ' + z.id);
    }
    for (const id of ids) {
      const n = nodes[id];
      for (const k of ['label', 'what', 'not']) text(n[k], `node ${id}.${k}`);
      if (n.sub) text(n.sub, `node ${id}.sub`);
      (n.facts || []).forEach((f, i) => { text(f.label, `node ${id}.facts ${i}`); text(f.text, `node ${id}.facts ${i}`); });
      const z = D.zones.find((x) => x.id === n.zone);
      if (!z) fail(`node ${id}: unknown zone ${n.zone}`);
      else if (!inside(n, z, 6)) fail(`node ${id} is not inside zone ${n.zone}`);
      for (const other of D.zones) if (other.parent === n.zone && !(n.x >= other.x + other.w + 4 || n.x + n.w <= other.x - 4 || n.y >= other.y + other.h + 4 || n.y + n.h <= other.y - 4)) fail(`node ${id} overlaps zone ${other.id}`);
      for (const l of n.lessons || []) if (!lessons.has(l)) fail(`node ${id}: unknown lesson ${l}`);
      for (const i of n.holds || []) if (!items[i]) fail(`node ${id}: unknown item ${i}`);
      if (n.icon && opts.icons && !opts.icons.includes(n.icon)) fail(`node ${id}: unknown icon ${n.icon}`);
      for (const o of ids) {
        const m = nodes[o];
        if (o > id && n.x < m.x + m.w + 6 && m.x < n.x + n.w + 6 && n.y < m.y + m.h + 6 && m.y < n.y + n.h + 6) fail(`nodes ${id} and ${o} overlap`);
      }
    }
    const letters = new Set();
    for (const [id, it] of Object.entries(items)) {
      for (const k of ['name', 'what', 'from', 'to']) text(it[k], `item ${id}.${k}`);
      if (letters.has(it.letter)) fail('repeated letter ' + it.letter);
      letters.add(it.letter);
      if (!/^c[1-8]$/.test(it.color)) fail(`item ${id}: color ${it.color}`);
      for (const l of it.lessons || []) if (!lessons.has(l)) fail(`item ${id}: unknown lesson ${l}`);
      (it.lives || []).forEach((x, i) => {
        text(x.when, `item ${id}.lives ${i}`);
        text(x.where, `item ${id}.lives ${i}`);
        if (x.node && !nodes[x.node]) fail(`item ${id}.lives ${i}: unknown node ${x.node}`);
      });
    }
    const pairs = new Set();
    for (const [i, e] of D.edges.entries()) {
      if (!nodes[e.from] || !nodes[e.to]) { fail(`edge ${i}: unknown end ${e.from} ${e.to}`); continue; }
      if (!EDGE_KINDS.includes(e.kind)) fail(`edge ${i}: kind ${e.kind}`);
      const key = [e.from, e.to].sort().join(' ');
      if (pairs.has(key)) fail('two edges between ' + key);
      pairs.add(key);
      const pts = route(nodes, e);
      if (pts.some((p) => !Number.isFinite(p[0]) || !Number.isFinite(p[1]))) fail(`edge ${i}: bad route`);
      for (let k = 1; k < pts.length; k++) if (pts[k][0] !== pts[k - 1][0] && pts[k][1] !== pts[k - 1][1]) fail(`edge ${e.from} to ${e.to}: a diagonal segment`);
      for (const id of ids) {
        if (id === e.from || id === e.to) continue;
        const n = nodes[id];
        for (let k = 1; k < pts.length; k++) {
          const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
          if (Math.max(x0, x1) > n.x + 2 && Math.min(x0, x1) < n.x + n.w - 2 && Math.max(y0, y1) > n.y + 2 && Math.min(y0, y1) < n.y + n.h - 2) fail(`edge ${e.from} to ${e.to} crosses node ${id}`);
        }
      }
    }
    const journeys = new Set();
    for (const j of D.journeys) {
      if (journeys.has(j.id)) fail('repeated journey ' + j.id);
      journeys.add(j.id);
      for (const k of ['title', 'summary', 'outcome']) text(j[k], `journey ${j.id}.${k}`);
      if (j.stops.length < 3) fail(`journey ${j.id}: fewer than 3 stops`);
      j.stops.forEach((s, i) => {
        const where = `journey ${j.id} stop ${i + 1}`;
        if (!nodes[s.node]) return fail(`${where}: unknown node ${s.node}`);
        text(s.text, where);
        if (s.detail) text(s.detail, where + ' detail');
        if (s.stamp) {
          text(s.stamp.text, where + ' stamp');
          if (!TONES.includes(s.stamp.tone)) fail(`${where}: stamp tone ${s.stamp.tone}`);
        }
        for (const c of s.carries || []) if (!items[c]) fail(`${where}: unknown item ${c}`);
        if (s.lesson != null && !lessons.has(s.lesson)) fail(`${where}: unknown lesson ${s.lesson}`);
        if (s.tag && !D.tags?.[s.tag]) fail(`${where}: unknown tag ${s.tag}`);
        if (s.lane != null && !nodes[s.node].lanes?.[s.lane]) fail(`${where}: no lane ${s.lane} in ${s.node}`);
        if (s.lab && opts.lab && !opts.lab(s.lab)) fail(`${where}: unknown lab command ${s.lab}`);
        for (const v of s.via || []) if (!nodes[v]) fail(`${where}: unknown via ${v}`);
        if (i > 0 && !s.jump) for (const [a, b] of hops(j, i)) if (!link(D, a, b)) fail(`${where}: no edge from ${a} to ${b}`);
      });
    }
    for (const [k, t] of Object.entries(D.tags || {})) { text(t.label, 'tag ' + k); text(t.text, 'tag text ' + k); }
    for (const id of ids) if (!D.journeys.some((j) => j.stops.some((s) => s.node === id)) && !nodes[id].quiet) fail(`node ${id}: no journey stops there`);
    for (const id of Object.keys(items)) if (!D.journeys.some((j) => j.stops.some((s) => s.carries?.includes(id))) && !ids.some((n) => nodes[n].holds?.includes(id))) fail(`item ${id}: never carried or held`);
    return errors;
  };

  // Facts of a piece: the ones placed after "What it is", or the rest, after "What it does not do".
  const facts = (n, early) => (n.facts || []).filter((f) => (f.place === 'what') === early);

  /* The whole picture as text: what <noscript> shows and what "Text version" opens. */
  BP.outline = (D, course, lang, opts = {}) => {
    const u = UI[lang] || UI.en, lessonsPath = opts.lessons ?? 'lessons/', q = opts.query ?? '';
    const lessonLink = (id) => {
      const l = course.lessons[id];
      return l ? `<a href="${lessonsPath}${esc(l.slug)}.html${q}">${u.lesson} ${pad(id)} · ${esc(L(l.title, lang))}</a>` : '';
    };
    const items = Object.entries(D.items);
    let h = `<h2>${esc(L(D.title, lang))}</h2><p>${esc(L(D.subtitle, lang))}</p>${D.intro.map((p) => `<p>${esc(L(p, lang))}</p>`).join('')}`;
    for (const j of D.journeys) {
      h += `<section class="bp-text-journey"><h3>${esc(j.id)} · ${esc(L(j.title, lang))}</h3><p>${esc(L(j.summary, lang))}</p><ol>`;
      for (const s of j.stops) {
        const carried = (s.carries || []).map((c) => L(D.items[c].name, lang)).join(', ');
        h += `<li><strong>${esc(L(D.nodes[s.node].label, lang))}</strong>${s.stamp ? ` <span class="bp-text-stamp">[${esc(L(s.stamp.text, lang))}]</span>` : ''}: ${esc(L(s.text, lang))}${s.detail ? ' ' + esc(L(s.detail, lang)) : ''}${carried ? ` <em>${u.carries}: ${esc(carried)}.</em>` : ''}${s.tag ? ` <span class="bp-text-tag">${esc(L(D.tags[s.tag].label, lang))}</span>` : ''}${s.lesson != null ? ' ' + lessonLink(s.lesson) : ''}${s.lab ? ` <code>${esc(s.lab)}</code>` : ''}</li>`;
      }
      h += `</ol><p><strong>${u.end}:</strong> ${esc(L(j.outcome, lang))}</p></section>`;
    }
    const cards = D.zones.filter((z) => z.what);
    if (cards.length) {
      h += `<section><h3>${u.zones}</h3><dl>`;
      for (const z of cards) h += `<dt id="bp-text-zone-${esc(z.id)}">${esc(L(z.label, lang))}${z.note ? ` · ${esc(L(z.note, lang))}` : ''}</dt><dd>${esc(L(z.what, lang))} <em>${u.not}:</em> ${esc(L(z.not, lang))}${(z.lessons || []).length ? ' ' + z.lessons.map(lessonLink).join(', ') : ''}</dd>`;
      h += '</dl></section>';
    }
    h += `<section><h3>${u.nodes}</h3><dl>`;
    for (const [id, n] of Object.entries(D.nodes)) {
      h += `<dt id="bp-text-${esc(id)}">${esc(L(n.label, lang))}${n.sub ? ` · ${esc(L(n.sub, lang))}` : ''}</dt><dd>${esc(L(n.what, lang))}${facts(n, true).map((f) => ` <em>${esc(L(f.label, lang))}:</em> ${esc(L(f.text, lang))}`).join('')} <em>${u.not}:</em> ${esc(L(n.not, lang))}${facts(n, false).map((f) => ` <em>${esc(L(f.label, lang))}:</em> ${esc(L(f.text, lang))}`).join('')}${(n.lessons || []).length ? ' ' + n.lessons.map(lessonLink).join(', ') : ''}</dd>`;
    }
    h += `</dl></section><section><h3>${esc(L(D.config.items, lang))}</h3><dl>`;
    for (const [, it] of items) h += `<dt>${esc(it.letter)} · ${esc(L(it.name, lang))}</dt><dd>${esc(L(it.what, lang))} <em>${u.comesFrom}:</em> ${esc(L(it.from, lang))} <em>${u.endsUp}:</em> ${esc(L(it.to, lang))}${it.lives?.length ? ` <em>${u.lives}:</em> ${it.lives.map((x) => `${esc(L(x.when, lang))}: ${esc(L(x.where, lang))}`).join(' ')}` : ''}</dd>`;
    return h + '</dl></section>';
  };
  BP.ui = UI;
  BP.route = route;
  BP.hops = hops;

  /* Icons: 24 by 24, drawn with the stroke of the piece. Generic shapes, no product marks. */
  const ICONS = {
    person: '<circle cx="12" cy="7.5" r="3.6"/><path d="M4.5 20.5c.8-4.2 3.8-6.4 7.5-6.4s6.7 2.2 7.5 6.4"/>',
    people: '<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c.7-3.6 3.2-5.6 6.2-5.6s5.5 2 6.2 5.6"/><circle cx="16.5" cy="7" r="2.6"/><path d="M15.5 12.4c3 .2 5 2 5.7 5.2"/>',
    browser: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 8.8h18"/><circle cx="6" cy="6.7" r=".6"/><circle cx="8.2" cy="6.7" r=".6"/>',
    app: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 10l-2.5 2.5 2.5 2.5M14.5 10l2.5 2.5-2.5 2.5"/>',
    server: '<rect x="4" y="4" width="16" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="16" height="6.5" rx="1.5"/><path d="M7.5 7.3h.01M7.5 16.8h.01M11 7.3h5M11 16.8h5"/>',
    database: '<ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v12c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V6M5 12c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8"/>',
    table: '<rect x="3.5" y="5" width="17" height="14" rx="1.5"/><path d="M3.5 9.5h17M3.5 14h17M9.5 9.5V19"/>',
    key: '<circle cx="8" cy="12" r="3.8"/><path d="M11.8 12H21M17.5 12v3.2M20 12v2.4"/>',
    keys: '<circle cx="7.5" cy="9" r="3"/><path d="M10.5 9H19M16 9v2.5"/><circle cx="9.5" cy="16" r="2.4"/><path d="M11.9 16H18"/>',
    shield: '<path d="M12 3.2l7 2.8v5.5c0 4.5-3 7.8-7 9.3-4-1.5-7-4.8-7-9.3V6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="1.8"/><path d="M8.2 10.5V8a3.8 3.8 0 017.6 0v2.5M12 14.3v2.2"/>',
    badge: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><circle cx="12" cy="10" r="2.7"/><path d="M7.8 17c.6-2 2.2-3.1 4.2-3.1s3.6 1.1 4.2 3.1M9.5 3.5v2h5v-2"/>',
    cloud: '<path d="M7.5 18.5h9.8a4 4 0 00.5-8 5.6 5.6 0 00-10.8-.6A4.3 4.3 0 007.5 18.5z"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.3M12 18.2v2.3M3.5 12h2.3M18.2 12h2.3M6 6l1.6 1.6M16.4 16.4L18 18M6 18l1.6-1.6M16.4 7.6L18 6"/>',
    filter: '<path d="M4 5h16l-6.2 7.2V19l-3.6-1.8v-5z"/>',
    funnel: '<path d="M4 5h16l-6.2 7.2V19l-3.6-1.8v-5z"/>',
    check: '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.7 2.7 5.3-5.6"/>',
    route: '<circle cx="6" cy="6" r="2.3"/><circle cx="18" cy="18" r="2.3"/><path d="M8.3 6H15a3.2 3.2 0 010 6.4H9a3.2 3.2 0 000 6.4h6.7"/>',
    swap: '<path d="M5 8h13l-3-3M19 16H6l3 3"/>',
    pool: '<circle cx="6.5" cy="12" r="2.5"/><circle cx="17.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/><path d="M9 12h3.5l2.8-4M12.5 12l2.8 4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2V12l3.2 2"/>',
    list: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="5" cy="6.5" r=".9"/><circle cx="5" cy="12" r=".9"/><circle cx="5" cy="17.5" r=".9"/>',
    log: '<rect x="3.5" y="7" width="17" height="10" rx="1.5"/><path d="M7.5 7v10M11.5 7v10M15.5 7v10"/>',
    queue: '<rect x="3" y="8" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="8" rx="1"/><rect x="17" y="8" width="4" height="8" rx="1"/>',
    topic: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/><path d="M7 4.8v3.4M12 10.3v3.4M16 15.8v3.4"/>',
    bolt: '<path d="M13 3L5.5 13.5H12L11 21l7.5-10.5H12z"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1.8"/><path d="M4 7l8 6 8-6"/>',
    doc: '<path d="M7 3.5h7l4.5 4.5v12.5H7z"/><path d="M14 3.5V8h4.5M9.8 12.5h5.5M9.8 16h5.5"/>',
    code: '<path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.3 5.5l-2.6 13"/>',
    terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 9.5l3 2.5-3 2.5M12.5 15h4.5"/>',
    box: '<path d="M12 3.5l8 4.3v8.4l-8 4.3-8-4.3V7.8z"/><path d="M4 7.8l8 4.3 8-4.3M12 12.1v8.4"/>',
    boxes: '<rect x="3.5" y="12" width="7.5" height="7.5" rx="1"/><rect x="13" y="12" width="7.5" height="7.5" rx="1"/><rect x="8.2" y="3.8" width="7.5" height="7.5" rx="1"/>',
    layers: '<path d="M12 4l8.5 4.3L12 12.6 3.5 8.3z"/><path d="M3.5 12.2l8.5 4.3 8.5-4.3M3.5 16l8.5 4.3 8.5-4.3"/>',
    wheel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.3"/><path d="M12 3.5v6.2M12 14.3v6.2M3.5 12h6.2M14.3 12h6.2M6 6l4.4 4.4M13.6 13.6L18 18M6 18l4.4-4.4M13.6 10.4L18 6"/>',
    network: '<circle cx="12" cy="5.5" r="2.3"/><circle cx="5.5" cy="18" r="2.3"/><circle cx="18.5" cy="18" r="2.3"/><path d="M11 7.6l-4.4 8.3M13 7.6l4.4 8.3M7.8 18h8.4"/>',
    branch: '<circle cx="7" cy="5.5" r="2.2"/><circle cx="7" cy="18.5" r="2.2"/><circle cx="17" cy="8.5" r="2.2"/><path d="M7 7.7v8.6M17 10.7c0 3.6-3.6 3.8-8.4 6.2"/>',
    merge: '<circle cx="7" cy="5.5" r="2.2"/><circle cx="7" cy="18.5" r="2.2"/><circle cx="17" cy="18.5" r="2.2"/><path d="M7 7.7v8.6M8.6 7c4.4 1 8.4 4 8.4 9.3"/>',
    commit: '<circle cx="12" cy="12" r="3.5"/><path d="M3 12h5.5M15.5 12H21"/>',
    tag: '<path d="M4 4h7.5l8.5 8.5-7.5 7.5L4 11.5z"/><circle cx="8.3" cy="8.3" r="1.3"/>',
    play: '<circle cx="12" cy="12" r="8.5"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
    chip: '<rect x="6.5" y="6.5" width="11" height="11" rx="1.5"/><path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3"/>',
    spark: '<path d="M12 3.5l1.9 5.6 5.6 1.9-5.6 1.9-1.9 5.6-1.9-5.6-5.6-1.9 5.6-1.9z"/><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    vector: '<path d="M4 20L20 4M4 20h7M4 20v-7"/><circle cx="14" cy="8" r="1"/><circle cx="9" cy="11" r="1"/><circle cx="16" cy="13" r="1"/>',
    tool: '<path d="M14.5 5.5a4 4 0 00-5 5L4 16l4 4 5.5-5.5a4 4 0 005-5l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    plug: '<path d="M9 3.5v4M15 3.5v4M6.5 7.5h11v3.5a5.5 5.5 0 01-11 0zM12 16.5v4"/>',
    eye: '<path d="M2.8 12S6 5.8 12 5.8 21.2 12 21.2 12 18 18.2 12 18.2 2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.8"/>',
    warning: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.2M12 17h.01"/>',
    bug: '<rect x="7.5" y="7.5" width="9" height="12" rx="4.5"/><path d="M12 7.5v12M9.5 7.5a2.5 2.5 0 015 0M4 11h3.5M16.5 11H20M4 16h3.5M16.5 16H20"/>',
    door: '<path d="M6 20.5V4.5h9v16M4 20.5h16M12.3 12.5h.01"/>',
    folder: '<path d="M3.5 7a1.5 1.5 0 011.5-1.5h4.3l2 2.2H19a1.5 1.5 0 011.5 1.5v8.3A1.5 1.5 0 0119 19H5a1.5 1.5 0 01-1.5-1.5z"/>',
    flow: '<rect x="3.5" y="4" width="6" height="5" rx="1"/><rect x="14.5" y="15" width="6" height="5" rx="1"/><path d="M9.5 6.5h4a2 2 0 012 2V15"/>',
    sign: '<path d="M4 20l3-1 10.5-10.5-2-2L5 17z"/><path d="M14 8l2 2M13 20h7"/>',
    stack: '<rect x="4" y="4" width="16" height="4.5" rx="1"/><rect x="4" y="9.8" width="16" height="4.5" rx="1"/><rect x="4" y="15.6" width="16" height="4.5" rx="1"/>',
    ruler: '<rect x="3" y="8" width="18" height="8" rx="1.2"/><path d="M7 8v3M11 8v4M15 8v3M19 8v3"/>',
  };
  BP.icons = () => Object.keys(ICONS);

  if (typeof document === 'undefined') return;
  const D = window.BIG_PICTURE, root = document.getElementById('bp');
  if (!D || !root) return;
  const course = window[D.config.course];
  const NODES = D.nodes, IDS = Object.keys(NODES), ITEMS = D.items, ITEM_IDS = Object.keys(ITEMS);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const query = new URLSearchParams(location.search);
  const THEMES = ['light', 'dark', 'reading', 'projector'];
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch { return null; } return null; };
  let lang = query.get('lang');
  if (!D.config.langs.includes(lang)) lang = store(D.config.langKey);
  if (!D.config.langs.includes(lang)) lang = D.config.langs[0];
  let theme = document.documentElement.dataset.theme;
  if (!THEMES.includes(theme)) theme = 'light';
  const u = () => UI[lang] || UI.en, T = (x) => L(x, lang);
  const SPEEDS = { slow: 0.55, normal: 1, fast: 1.8 };
  const S = {
    j: -1, s: 0, view: 'overview', piece: null, item: null, zone: null, playing: false, speed: 'normal', held: false,
    follow: false, cam: null, moving: false, bubble: true, from: null,
  };
  let svg, view, panel, bubble, dotG, player, live, timer = 0, anim = 0, camAnim = 0, measure, lastFocus = null;

  /* Text wrapping, measured with the font that the SVG uses. */
  function wrap(str, max, font) {
    if (!measure) measure = document.createElement('canvas').getContext('2d');
    measure.font = font;
    const words = String(str).split(/\s+/), lines = [];
    let line = '';
    for (const w of words) {
      const next = line ? line + ' ' + w : w;
      if (measure.measureText(next).width <= max || !line) line = next;
      else { lines.push(line); line = w; }
    }
    if (line) lines.push(line);
    return lines;
  }
  const family = () => getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';
  const monoFamily = () => getComputedStyle(document.documentElement).getPropertyValue('--mono').trim() || 'monospace';
  function textWidth(str, font) {
    if (!measure) measure = document.createElement('canvas').getContext('2d');
    measure.font = font;
    return measure.measureText(String(str)).width;
  }

  function lessonHref(id) {
    const l = course.lessons[id];
    return `lessons/${l.slug}.html?lang=${lang}&theme=${theme}`;
  }
  function lessonLink(id) {
    const l = course.lessons[id];
    if (!l) return '';
    return `<a class="bp-lesson" href="${lessonHref(id)}"><span>${u().lesson} ${pad(id)}</span>${esc(T(l.title))}</a>`;
  }
  const chip = (id, label = true) => {
    const it = ITEMS[id];
    return `<button type="button" class="bp-chip" data-item="${esc(id)}" aria-label="${esc(T(it.name))}"><span class="bp-letter bp-${it.color}" aria-hidden="true">${esc(it.letter)}</span>${label ? `<span>${esc(T(it.name))}</span>` : ''}</button>`;
  };
  const tagBadge = (k) => (k && D.tags?.[k] ? `<span class="bp-tag bp-tag-${esc(k)}" title="${esc(T(D.tags[k].text))}">${esc(T(D.tags[k].label))}</span>` : '');
  const journey = () => (S.j >= 0 ? D.journeys[S.j] : null);
  const stop = () => journey()?.stops[S.s] ?? null;

  /* The shell. */
  function shell() {
    const U = u(), home = `${D.config.home || 'index.html'}?lang=${lang}&theme=${theme}`;
    const langs = D.config.langs.length > 1
      ? `<div class="bp-langs" role="group" aria-label="${U.language}">${D.config.langs.map((l) => `<button type="button" class="btn ${l === lang ? 'on' : ''}" data-lang="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`).join('')}</div>`
      : `<span class="bp-lang-static">${D.config.langs[0].toUpperCase()}</span>`;
    const names = { light: lang === 'es' ? 'Clásica' : 'Classic', dark: lang === 'es' ? 'Oscura' : 'Dark', reading: lang === 'es' ? 'Lectura' : 'Reading', projector: lang === 'es' ? 'Proyector' : 'Projector' };
    root.innerHTML = `<div class="bp-shell">
<header class="bp-head"><a class="bp-back" href="${home}"><span aria-hidden="true">←</span> <span class="bp-course">${esc(T(D.config.name))}</span></a>
<div class="bp-title"><h1>${esc(T(D.title))}</h1><p>${esc(T(D.subtitle))}</p></div>
<div class="bp-actions" role="toolbar" aria-label="${esc(T(D.title))}">
<button type="button" class="btn" data-act="reset">${U.startOver}</button>
<button type="button" class="btn" data-act="items">${esc(T(D.config.items))}</button>
<button type="button" class="btn" data-act="held" aria-pressed="${S.held}">${esc(T(D.config.held))}</button>
<button type="button" class="btn" data-act="legend">${U.legend}</button>
<button type="button" class="btn" data-act="text">${U.text}</button>
<button type="button" class="btn" data-act="how">${U.howTo}</button>
<label class="bp-skin"><span class="sr-only">${U.skin}</span><select data-skin aria-label="${U.skin}">${THEMES.map((x) => `<option value="${x}" ${x === theme ? 'selected' : ''}>${names[x]}</option>`).join('')}</select></label>${langs}</div></header>
<div class="bp-main"><section class="bp-stage" aria-label="${esc(T(D.title))}">
<nav class="bp-strip" aria-label="${U.journeys}"><span class="bp-strip-label">${U.journeys}</span><div class="bp-strip-list">${D.journeys.map((j, i) => `<button type="button" class="bp-jchip" data-journey="${i}" aria-label="${esc(j.id + ' · ' + T(j.title))}" title="${esc(j.id + ' · ' + T(j.title))}"><b>${esc(j.id)}</b><span>${esc(T(j.title))}</span></button>`).join('')}</div></nav>
<div class="bp-view" tabindex="-1"><svg class="bp-svg" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="${esc(T(D.title))}"></svg>
<div class="bp-bubble" hidden></div>
<p class="bp-hint">${U.drag}</p>
<div class="bp-zoom"><button type="button" class="btn" data-act="out" aria-label="${U.zoomOut}">−</button><button type="button" class="btn" data-act="in" aria-label="${U.zoomIn}">+</button><button type="button" class="btn" data-act="fit">${U.fit}</button><button type="button" class="btn" data-act="follow" aria-pressed="${S.follow}">${U.follow}: ${S.follow ? U.on : U.off}</button></div></div>
</section><aside class="bp-panel" aria-label="${U.thisPiece}"></aside></div>
<footer class="bp-foot"></footer>
<p class="sr-only" aria-live="polite" data-live></p>
<dialog class="bp-dialog" aria-labelledby="bp-dialog-title"><div class="bp-dialog-head"><h2 id="bp-dialog-title"></h2><button type="button" class="btn" data-act="close" aria-label="${U.close}">×</button></div><div class="bp-dialog-body"></div></dialog></div>`;
    svg = root.querySelector('.bp-svg');
    view = root.querySelector('.bp-view');
    panel = root.querySelector('.bp-panel');
    bubble = root.querySelector('.bp-bubble');
    player = root.querySelector('.bp-foot');
    live = root.querySelector('[data-live]');
    document.documentElement.lang = lang;
    document.title = `${T(D.title)} · ${T(D.config.name)} | Prumathe`;
    scene();
    bindView();
  }

  /* The scene: zones, lines, pieces, then the layers that change: trail, stamps and the dot. */
  function scene() {
    const f = family();
    const defs = `<defs>${Object.entries(ICONS).map(([k, p]) => `<symbol id="bp-i-${k}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</g></symbol>`).join('')}
${['call', 'read', 'async', 'admin', 'risk', 'trail'].map((k) => `<marker id="bp-a-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="${k === 'trail' ? 13 : 10}" markerHeight="${k === 'trail' ? 13 : 10}" orient="auto-start-reverse"><path class="bp-arrow bp-arrow-${k}" d="M0 1L9 5L0 9z"/></marker>`).join('')}</defs>`;
    const zones = D.zones.map((z) => `<g class="bp-zone bp-zone-${z.tone || 'plain'}${z.parent ? ' bp-zone-inner' : ''}${z.what ? ' bp-zone-card" data-zone="' + esc(z.id) + '" tabindex="0" role="button" aria-label="' + esc(T(z.label) + (z.note ? ', ' + T(z.note) : '')) : ''}"><rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="${z.parent ? 10 : 14}"/><text x="${z.x + 14 + (z.labelDx || 0)}" y="${z.labelBottom ? z.y + z.h - 10 : z.y + (z.parent ? 17 : 21)}" class="bp-zone-label">${esc(T(z.label).toUpperCase())}${z.note ? `<tspan class="bp-zone-note" dx="8">${esc(T(z.note))}</tspan>` : ''}</text></g>`).join('');
    const edges = D.edges.map((e, i) => {
      const pts = route(NODES, e);
      const mid = at(pts, 0.5);
      const label = e.label ? `<text class="bp-edge-label" x="${mid[0] + (e.labelDx || 0)}" y="${mid[1] - 5 + (e.labelDy || 0)}" text-anchor="middle">${esc(T(e.label))}</text>` : '';
      return `<g class="bp-edge bp-edge-${e.kind}" data-edge="${i}" data-from="${e.from}" data-to="${e.to}"><path d="${rounded(pts)}" marker-end="url(#bp-a-${e.kind})"${e.both ? ` marker-start="url(#bp-a-${e.kind})"` : ''}/>${label}</g>`;
    }).join('');
    const nodes = IDS.map((id) => {
      const n = NODES[id], icon = n.icon && n.w >= 96, tx = icon ? 37 : 12, tw = n.w - tx - 9;
      const lf = `600 15px ${f}`, sf = `400 12px ${f}`;
      const label = wrap(T(n.label), tw, lf), sub = n.sub && n.h >= 46 ? wrap(T(n.sub), tw, sf) : [];
      const blockH = label.length * 18 + sub.length * 15;
      let y = (n.lanes ? 14 + blockH / 2 : n.h / 2) - blockH / 2 + 13.5;
      const lines = label.map((t, k) => `<tspan x="${tx}" y="${(y + k * 18).toFixed(1)}">${esc(t)}</tspan>`).join('');
      y += label.length * 18;
      const subs = sub.map((t, k) => `<tspan x="${tx}" y="${(y + k * 15 - 1.5).toFixed(1)}">${esc(t)}</tspan>`).join('');
      const tone = n.tone || D.zones.find((z) => z.id === n.zone)?.tone || 'plain';
      const iconY = n.lanes ? 14 + blockH / 2 - 10 : n.h / 2 - 10;
      return `<g class="bp-node bp-tone-${tone}" data-node="${id}" transform="translate(${n.x} ${n.y})" tabindex="0" role="button" aria-label="${esc(T(n.label) + (n.sub ? ', ' + T(n.sub) : ''))}"><rect class="bp-halo" x="-6" y="-6" width="${n.w + 12}" height="${n.h + 12}" rx="14"/><rect class="bp-box" width="${n.w}" height="${n.h}" rx="9"/>${icon ? `<use href="#bp-i-${n.icon}" class="bp-icon" x="10" y="${iconY}" width="20" height="20"/>` : ''}<text class="bp-label">${lines}</text>${subs ? `<text class="bp-sub">${subs}</text>` : ''}${n.lanes ? lanesOf(n, blockH) : ''}<g class="bp-holds"></g></g>`;
    }).join('');
    svg.innerHTML = `${defs}<g class="bp-zones">${zones}</g>${sceneLegend()}<g class="bp-edges">${edges}</g><g class="bp-trail"></g><g class="bp-nodes">${nodes}</g><g class="bp-stamps"></g><g class="bp-dot" tabindex="0" role="button" aria-label="${u().next}"><circle class="bp-dot-ring" r="15"/><circle class="bp-dot-core" r="8.5"/><g class="bp-dot-items"></g></g>`;
    dotG = svg.querySelector('.bp-dot');
    dotG.style.display = 'none';
  }

  /* Lanes: a piece that is a log (a topic, a queue) draws one lane per partition under its name,
     each with a few records. A stop can light the lane it is about. */
  function laneBox(n, i) {
    const top = 14 + laneTextH(n) + 14, gap = 8, count = n.lanes.length, h = (n.h - top - 12 - gap * (count - 1)) / count;
    return { x: 12, y: top + i * (h + gap), w: n.w - 24, h };
  }
  function laneTextH(n) {
    const f = family(), tx = n.icon && n.w >= 96 ? 37 : 12, tw = n.w - tx - 9;
    return wrap(T(n.label), tw, `600 15px ${f}`).length * 18 + (n.sub ? wrap(T(n.sub), tw, `400 12px ${f}`).length * 15 : 0);
  }
  function lanesOf(n) {
    return `<g class="bp-lanes">${n.lanes.map((name, i) => {
      const b = laneBox(n, i), start = b.x + 22 + Math.max(26, textWidth(T(name), `700 11px ${monoFamily()}`));
      const cells = Math.max(3, Math.round(((b.x + b.w - 30 - start) / 17) * [0.66, 0.5, 0.58, 0.44][i % 4]));
      let r = `<g class="bp-lane" data-lane="${i}"><rect class="bp-lane-bg" x="${b.x}" y="${b.y.toFixed(1)}" width="${b.w}" height="${b.h.toFixed(1)}" rx="6"/><text class="bp-lane-label" x="${b.x + 10}" y="${(b.y + b.h / 2 + 4).toFixed(1)}">${esc(T(name))}</text>`;
      for (let c = 0; c < cells; c++) r += `<rect class="bp-cell" x="${(start + c * 17).toFixed(1)}" y="${(b.y + 6).toFixed(1)}" width="13" height="${Math.max(4, b.h - 12).toFixed(1)}" rx="2"/>`;
      return r + '</g>';
    }).join('')}</g>`;
  }

  /* A small key inside the scene, for whoever never opens the legend. */
  function sceneLegend() {
    const g = D.sceneLegend;
    if (!g) return '';
    const kinds = EDGE_KINDS.filter((k) => D.edges.some((e) => e.kind === k)), short = { ...SHORT, ...(D.legend?.short || {}) };
    const entries = kinds.map((k) => ['edge', k]).concat([['trail'], ['dot']]);
    const cols = g.cols || 1, per = Math.ceil(entries.length / cols), cw = (g.w - 16) / cols, step = (g.h - 52) / Math.max(1, per - 1);
    const rows = entries.map(([type, k], i) => {
      const x = g.x + 14 + Math.floor(i / per) * cw, y = g.y + 40 + (i % per) * Math.min(18, step);
      const sample = type === 'edge'
        ? `<g class="bp-edge bp-edge-${k}"><path d="M${x} ${y}H${x + 30}" marker-end="url(#bp-a-${k})"/></g>`
        : type === 'trail'
          ? `<path class="bp-trail-path" d="M${x} ${y}H${x + 30}" marker-end="url(#bp-a-trail)"/>`
          : `<circle class="bp-dot-core" cx="${x + 8}" cy="${y}" r="6"/><circle cx="${x + 22}" cy="${y - 5}" r="5.5" class="bp-c2"/>`;
      return `${sample}<text class="bp-slegend-text" x="${x + 38}" y="${y + 4}">${esc(T(type === 'edge' ? short[k] : short[type]))}</text>`;
    }).join('');
    return `<g class="bp-slegend" aria-hidden="true"><rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" rx="12"/><text class="bp-zone-label" x="${g.x + 14}" y="${g.y + 22}">${esc(T(short.title).toUpperCase())}</text>${rows}</g>`;
  }

  /* The camera is the viewBox. Fit shows the whole scene; zoom keeps the point under the pointer. */
  // Fit leaves room under the scene for the zoom buttons, so they never cover a piece.
  function fitCam() {
    const r = view.getBoundingClientRect(), vw = r.width || 1, vh = r.height || 1;
    const padX = 16, padT = 14, padB = vw < 700 ? 14 : 52;
    const k = Math.min((vw - padX * 2) / D.scene.w, (vh - padT - padB) / D.scene.h);
    return { x: -(padX + (vw - padX * 2 - D.scene.w * k) / 2) / k, y: -(padT + (vh - padT - padB - D.scene.h * k) / 2) / k, w: vw / k, h: vh / k };
  }
  function scale() { return view.getBoundingClientRect().width / S.cam.w; }
  function applyCam() {
    svg.setAttribute('viewBox', `${S.cam.x.toFixed(2)} ${S.cam.y.toFixed(2)} ${S.cam.w.toFixed(2)} ${S.cam.h.toFixed(2)}`);
    placeBubble();
  }
  function clampCam(c) {
    const fit = fitCam(), minW = fit.w / 6, maxW = fit.w * 1.25;
    const w = Math.max(minW, Math.min(maxW, c.w)), h = (w * c.h) / c.w;
    const x = Math.max(-w * 0.6, Math.min(D.scene.w - w * 0.4, c.x)), y = Math.max(-h * 0.6, Math.min(D.scene.h - h * 0.4, c.y));
    return { x, y, w, h };
  }
  function moveCam(target, ms = 380) {
    cancelAnimationFrame(camAnim);
    target = clampCam(target);
    if (reduced || ms <= 0 || !S.cam) { S.cam = target; applyCam(); return; }
    const from = { ...S.cam }, t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      S.cam = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e };
      applyCam();
      if (k < 1) camAnim = requestAnimationFrame(step);
    };
    camAnim = requestAnimationFrame(step);
  }
  function zoom(f, px, py) {
    const r = view.getBoundingClientRect();
    const cx = px ?? r.width / 2, cy = py ?? r.height / 2;
    const sx = S.cam.x + (cx / r.width) * S.cam.w, sy = S.cam.y + (cy / r.height) * S.cam.h;
    const w = S.cam.w / f, h = S.cam.h / f;
    return { x: sx - (cx / r.width) * w, y: sy - (cy / r.height) * h, w, h };
  }
  // Follow keeps the current piece centred, at a scale where its text reads at 12 px or more.
  function followTo(id, ms) {
    const st = stop(), base = NODES[id], r = view.getBoundingClientRect();
    let n = base;
    if (base.lanes && st && st.node === id && st.lane != null) { const b = laneBox(base, st.lane); n = { x: base.x + b.x, y: base.y + b.y, w: b.w, h: b.h }; }
    let w = S.cam.w;
    const want = r.width / (r.width < 600 ? 0.95 : 0.9);
    if (r.width / w < 0.86) w = Math.min(w, want);
    const h = (w * r.height) / r.width;
    moveCam({ x: n.x + n.w / 2 - w / 2, y: n.y + n.h / 2 - h / 2, w, h }, ms);
  }

  function bindView() {
    let drag = null;
    const pointers = new Map();
    view.addEventListener('pointerdown', (ev) => {
      if (ev.target.closest('.bp-zoom, .bp-bubble, .bp-node, .bp-dot')) return;
      pointers.set(ev.pointerId, [ev.clientX, ev.clientY]);
      view.setPointerCapture(ev.pointerId);
      // A press on an area with a card opens it on release, unless the press became a drag.
      drag = { x: ev.clientX, y: ev.clientY, cam: { ...S.cam }, moved: false, zone: pointers.size === 1 ? ev.target.closest('.bp-zone-card')?.dataset.zone : undefined };
      cancelAnimationFrame(camAnim);
    });
    view.addEventListener('pointermove', (ev) => {
      if (!pointers.has(ev.pointerId)) return;
      const prev = pointers.get(ev.pointerId);
      pointers.set(ev.pointerId, [ev.clientX, ev.clientY]);
      const r = view.getBoundingClientRect();
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()], other = [...pointers.entries()].find(([k]) => k !== ev.pointerId)[1];
        const before = Math.hypot(prev[0] - other[0], prev[1] - other[1]), after = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (before > 0) S.cam = clampCam(zoom(after / before, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top));
        applyCam();
        drag = null;
        return;
      }
      if (!drag) return;
      const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      const k = drag.cam.w / r.width;
      S.cam = clampCam({ ...drag.cam, x: drag.cam.x - dx * k, y: drag.cam.y - dy * k });
      applyCam();
    });
    const up = (ev) => { pointers.delete(ev.pointerId); if (!pointers.size) drag = null; };
    view.addEventListener('pointerup', (ev) => { const zone = drag && !drag.moved && drag.zone; up(ev); if (zone) openZone(zone); });
    view.addEventListener('pointercancel', up);
    view.addEventListener('wheel', (ev) => {
      ev.preventDefault();
      const r = view.getBoundingClientRect();
      cancelAnimationFrame(camAnim);
      S.cam = clampCam(zoom(Math.exp(-ev.deltaY * (ev.ctrlKey ? 0.01 : 0.0018)), ev.clientX - r.left, ev.clientY - r.top));
      applyCam();
    }, { passive: false });
    svg.addEventListener('click', (ev) => {
      const n = ev.target.closest('.bp-node');
      if (n) return openPiece(n.dataset.node);
      if (ev.target.closest('.bp-dot')) next();
    });
    svg.addEventListener('keydown', (ev) => {
      const n = ev.target.closest('.bp-node');
      if (n && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); ev.stopPropagation(); openPiece(n.dataset.node); }
      const z = ev.target.closest('.bp-zone-card');
      if (z && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); ev.stopPropagation(); openZone(z.dataset.zone); }
      if (ev.target.closest('.bp-dot') && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); ev.stopPropagation(); next(); }
    });
    const near = (id, on) => {
      svg.classList.toggle('bp-hovering', on);
      for (const e of svg.querySelectorAll('.bp-edge')) e.classList.toggle('bp-near', on && (e.dataset.from === id || e.dataset.to === id));
      for (const n of svg.querySelectorAll('.bp-node')) {
        const linked = on && (n.dataset.node === id || D.edges.some((e) => (e.from === id && e.to === n.dataset.node) || (e.to === id && e.from === n.dataset.node)));
        n.classList.toggle('bp-near', linked);
      }
    };
    svg.addEventListener('pointerover', (ev) => { const n = ev.target.closest('.bp-node'); if (n) near(n.dataset.node, true); });
    svg.addEventListener('pointerout', (ev) => { const n = ev.target.closest('.bp-node'); if (n && !n.contains(ev.relatedTarget)) near(n.dataset.node, false); });
    svg.addEventListener('focusin', (ev) => { const n = ev.target.closest('.bp-node'); if (n) near(n.dataset.node, true); });
    svg.addEventListener('focusout', (ev) => { const n = ev.target.closest('.bp-node'); if (n) near(n.dataset.node, false); });
    new ResizeObserver(() => {
      if (!S.cam) return;
      const r = view.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const h = (S.cam.w * r.height) / r.width, cy = S.cam.y + S.cam.h / 2;
      S.cam = { ...S.cam, y: cy - h / 2, h };
      if (S.fitted) S.cam = fitCam();
      applyCam();
    }).observe(view);
  }

  /* What changes with the stop: visited pieces, the trail, stamps, held items, the dot. */
  function paint() {
    const j = journey(), cur = stop();
    const inJourney = new Set(j ? j.stops.flatMap((s) => [s.node, ...(s.via || [])]) : []);
    const visited = new Set(j ? j.stops.slice(0, S.s + 1).map((s) => s.node) : []);
    svg.classList.toggle('bp-active', !!j);
    for (const g of svg.querySelectorAll('.bp-zone-card')) g.classList.toggle('bp-selected', S.view === 'zone' && S.zone === g.dataset.zone);
    for (const g of svg.querySelectorAll('.bp-node')) {
      const id = g.dataset.node;
      g.classList.toggle('bp-in', inJourney.has(id));
      g.classList.toggle('bp-visited', visited.has(id));
      g.classList.toggle('bp-current', !!cur && cur.node === id && !S.moving);
      g.classList.toggle('bp-selected', S.view === 'piece' && S.piece === id);
      for (const lane of g.querySelectorAll('.bp-lane')) lane.classList.toggle('bp-lane-on', !!cur && cur.node === id && cur.lane === Number(lane.dataset.lane));
      const holds = g.querySelector('.bp-holds'), n = NODES[id];
      holds.innerHTML = S.held && n.holds?.length
        ? n.holds.map((i, k) => `<g class="bp-hold" transform="translate(${n.w - 9 - k * 17} -1)"><circle r="8" class="bp-${ITEMS[i].color}"/><text text-anchor="middle" y="3.6">${esc(ITEMS[i].letter)}</text></g>`).join('')
        : '';
      if (S.view === 'item' && S.item) g.classList.toggle('bp-holds-item', !!n.holds?.includes(S.item));
      else g.classList.remove('bp-holds-item');
    }
    const drawn = new Map(), inJ = new Set();
    if (j) for (let k = 1; k < j.stops.length; k++) for (const [a, b] of hops(j, k)) {
      const l = link(D, a, b);
      if (l) inJ.add(l.index);
      if (k > S.s) continue;
      const pts = l ? route(NODES, D.edges[l.index]) : [dotSpot(a), dotSpot(b)];
      const key = l ? l.index + (l.reverse ? 'r' : 'f') : a + '>' + b;
      drawn.set(key, `<path class="bp-trail-path${k === S.s ? ' bp-trail-last' : ''}${l ? '' : ' bp-jump'}" d="${rounded(l?.reverse ? pts.slice().reverse() : pts)}" marker-end="url(#bp-a-trail)"/>`);
    }
    svg.querySelector('.bp-trail').innerHTML = [...drawn.values()].join('');
    for (const e of svg.querySelectorAll('.bp-edge')) e.classList.toggle('bp-in', inJ.has(Number(e.dataset.edge)));
    const stamps = [];
    if (j) {
      const last = new Map();
      j.stops.slice(0, S.s + 1).forEach((s, k) => { if (s.stamp) last.set(s.node, k); });
      for (const [node, k] of last) {
        const s = j.stops[k], n = NODES[node], label = T(s.stamp.text);
        const w = Math.max(30, Math.ceil(textWidth(label, `700 11px ${monoFamily()}`)) + 16);
        stamps.push(`<g class="bp-stamp bp-stamp-${s.stamp.tone}${k === S.s && !S.moving ? ' bp-stamp-now' : ''}" transform="translate(${n.x + n.w - w - 6} ${n.y - 14}) rotate(-3)"><rect width="${w}" height="20" rx="5"/><text x="${w / 2}" y="14" text-anchor="middle">${esc(label)}</text></g>`);
      }
    }
    svg.querySelector('.bp-stamps').innerHTML = stamps.join('');
    if (j && !S.moving) placeDot(cur.node, dotSpot(cur.node, cur.lane));
    dotG.style.display = j ? '' : 'none';
    for (const b of root.querySelectorAll('.bp-jchip')) {
      const on = Number(b.dataset.journey) === S.j;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
      if (on && S.j !== S.shownChip) {
        S.shownChip = S.j;
        const list = b.parentElement;
        requestAnimationFrame(() => { if (b.offsetLeft < list.scrollLeft || b.offsetLeft + b.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = b.offsetLeft - 24; });
      }
    }
  }
  // The letters ride above the dot, up the right border of the piece: half outside, so they
  // never cover its text, which stops 9 units before the border.
  function carriedMarks(ids) {
    return ids.map((i, k) => `<g transform="translate(0 ${-21 - k * 17})"><circle r="8" class="bp-${ITEMS[i].color}"/><text text-anchor="middle" y="3.6">${esc(ITEMS[i].letter)}</text></g>`).join('');
  }
  function dotSpot(id, lane) {
    const n = NODES[id];
    if (n.lanes && lane != null && n.lanes[lane]) { const b = laneBox(n, lane); return [n.x + b.x + b.w - 10, n.y + b.y + b.h / 2]; }
    return [n.x + n.w, n.y + n.h - 2];
  }
  function placeDot(id, p) {
    const [x, y] = p || dotSpot(id);
    dotG.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    dotG.querySelector('.bp-dot-items').innerHTML = carriedMarks(stop()?.carries || []);
  }

  /* The bubble next to the current piece. */
  function showBubble() {
    const s = stop();
    // On a phone the panel and the player already show the stop, right under the scene: a bubble
    // would only hide the piece it talks about.
    if (!s || !S.bubble || S.moving || view.getBoundingClientRect().width < 600) { bubble.hidden = true; return; }
    const U = u();
    bubble.innerHTML = `<button type="button" class="bp-x" data-act="bubble" aria-label="${U.close}">×</button><p>${esc(T(s.text))}</p>${s.carries?.length ? `<div class="bp-chips">${s.carries.map((c) => chip(c)).join('')}</div>` : ''}<small>${S.s < journey().stops.length - 1 ? U.hint : U.end}</small>`;
    bubble.hidden = false;
    placeBubble();
  }
  /* The bubble goes where it hides the least: never over the current piece, then as little as
     possible of the pieces of this journey, then of the rest. */
  function placeBubble() {
    if (!bubble || bubble.hidden) return;
    const s = stop();
    if (!s) return;
    // A piece drawn as lanes is avoided by its lit lane, where the dot is, not by its whole box.
    const g = svg.querySelector(`.bp-node[data-node="${CSS.escape(s.node)}"] ${s.lane != null ? `.bp-lane[data-lane="${s.lane}"] .bp-lane-bg` : '.bp-box'}`);
    if (!g) return;
    const vr = view.getBoundingClientRect(), nr = g.getBoundingClientRect(), br = bubble.getBoundingClientRect();
    const m = 10, bw = br.width, bh = br.height, gap = 18, bottom = vr.height - 52;
    const rel = (r) => ({ x: r.left - vr.left, y: r.top - vr.top, r: r.right - vr.left, b: r.bottom - vr.top });
    const node = rel(nr), j = journey();
    const inJ = new Set(j ? j.stops.flatMap((x) => [x.node, ...(x.via || [])]) : []);
    const others = [...svg.querySelectorAll('.bp-node')].map((n) => ({ box: rel(n.querySelector('.bp-box').getBoundingClientRect()), w: n.dataset.node === s.node ? (s.lane != null ? 1 : 1000) : inJ.has(n.dataset.node) ? 3 : 0.4 }));
    others.push({ box: node, w: 1000 });
    const cx = (node.x + node.r) / 2 - bw / 2, cy = (node.y + node.b) / 2 - bh / 2;
    const candidates = [
      [cx, node.y - gap - bh], [cx, node.b + gap + 8], [node.r + gap, cy], [node.x - gap - bw, cy],
      [node.r + gap, node.y - bh * 0.6], [node.x - gap - bw, node.y - bh * 0.6], [node.r + gap, node.b - bh * 0.4], [node.x - gap - bw, node.b - bh * 0.4],
    ];
    let best = null;
    candidates.forEach(([x0, y0], i) => {
      const x = Math.max(m, Math.min(vr.width - bw - m, x0)), y = Math.max(m, Math.min(Math.max(m, bottom - bh), y0));
      const a = { x, y, r: x + bw, b: y + bh };
      let score = i * 0.01 + (Math.abs(x - x0) + Math.abs(y - y0)) * 2;
      for (const o of others) score += o.w * Math.max(0, Math.min(a.r, o.box.r) - Math.max(a.x, o.box.x)) * Math.max(0, Math.min(a.b, o.box.b) - Math.max(a.y, o.box.y)) / 100;
      if (!best || score < best.score) best = { x, y, score };
    });
    bubble.style.left = `${Math.round(best.x)}px`;
    bubble.style.top = `${Math.round(best.y)}px`;
  }

  /* The panel. */
  function renderPanel() {
    const U = u();
    let h = '';
    if (S.view === 'piece' && S.piece) h = pieceView(S.piece);
    else if (S.view === 'item' && S.item) h = itemView(S.item);
    else if (S.view === 'zone' && S.zone) h = zoneView(S.zone);
    else if (journey()) h = stopView();
    else h = overview();
    panel.innerHTML = h;
    panel.scrollTop = 0;
    const back = panel.querySelector('[data-act="panel-back"]');
    if (back) back.setAttribute('aria-label', journey() && S.view !== 'stop' ? U.backTo : U.overview);
  }
  function panelHead(title, backable) {
    return `<div class="bp-panel-head">${backable ? `<button type="button" class="btn bp-icon-btn" data-act="panel-back"><span aria-hidden="true">←</span></button>` : ''}<h2>${title}</h2>${journey() && S.view !== 'stop' ? `<button type="button" class="btn bp-small" data-act="to-stop">${u().current}</button>` : ''}</div>`;
  }
  function overview() {
    const U = u(), [a, b] = D.journeys;
    return `${panelHead(esc(T(D.subtitle)), false)}<div class="bp-panel-body">
<div class="bp-start">${a ? `<button type="button" class="btn primary" data-journey="0"><span aria-hidden="true">▶</span> ${U.startWith} ${esc(a.id)}: ${esc(T(a.title))}</button>` : ''}${b ? `<button type="button" class="btn" data-journey="1"><span aria-hidden="true">▶</span> ${U.thenWith} ${esc(b.id)}: ${esc(T(b.title))}</button>` : ''}</div>
<div class="bp-shows"><h3>${U.shows}</h3>${D.intro.map((p) => `<p>${esc(T(p))}</p>`).join('')}</div>
<h3 class="bp-eyebrow">${U.journeys}</h3><ol class="bp-journeys">${D.journeys.map((j, i) => `<li><button type="button" data-journey="${i}"><span class="bp-jletter">${esc(j.id)}</span><span><strong>${esc(T(j.title))}</strong><small>${j.stops.length} ${U.stops} · ${esc(T(j.summary))}</small></span></button></li>`).join('')}</ol>
<h3 class="bp-eyebrow">${esc(T(D.config.itemsTable || D.config.items))}</h3>${itemsTable()}</div>`;
  }
  function itemsTable() {
    const U = u();
    return `<table class="bp-items"><thead><tr><th scope="col">${esc(T(D.config.item))}</th><th scope="col">${U.comesFrom}</th><th scope="col">${U.endsUp}</th></tr></thead><tbody>${ITEM_IDS.map((i) => `<tr><td>${chip(i)}</td><td>${esc(T(ITEMS[i].from))}</td><td>${esc(T(ITEMS[i].to))}</td></tr>`).join('')}</tbody></table>`;
  }
  function stopView() {
    const U = u(), j = journey(), s = stop(), n = NODES[s.node], last = S.s === j.stops.length - 1;
    const nextJ = D.journeys[S.j + 1];
    const stops = j.stops.map((x, k) => `<button type="button" class="bp-stopchip${k === S.s ? ' on' : k < S.s ? ' done' : ''}" data-stop="${k}" aria-label="${U.stop} ${k + 1}: ${esc(T(NODES[x.node].label))}"${k === S.s ? ' aria-current="step"' : ''}>${k + 1} <span>${esc(T(NODES[x.node].short || NODES[x.node].label))}</span></button>`).join('');
    const deeper = (s.lesson != null || s.lab) ? `<h3 class="bp-eyebrow">${U.deeper}</h3>${s.lesson != null ? lessonLink(s.lesson) : ''}${s.lab ? `<div class="bp-lab"><span>${U.tryIt}</span><code>${esc(s.lab)}</code><button type="button" class="btn bp-small" data-copy="${esc(s.lab)}">${U.copy}</button></div>` : ''}` : '';
    return `${panelHead(`<span class="bp-jtitle">${esc(j.id)} · ${esc(T(j.title))}</span>`, true)}<div class="bp-panel-body">
<p class="bp-eyebrow">${U.stop} ${S.s + 1} ${U.of} ${j.stops.length}</p>
<div class="bp-stop-title"><h3>${esc(T(n.label))}</h3>${tagBadge(s.tag)}${s.stamp ? `<span class="bp-stampchip bp-stamp-${s.stamp.tone}">${esc(T(s.stamp.text))}</span>` : ''}</div>
<p class="bp-stop-text">${esc(T(s.text))}</p>${s.detail ? `<p class="bp-stop-detail">${esc(T(s.detail))}</p>` : ''}
${last ? `<div class="bp-outcome"><strong>${U.end}.</strong> ${esc(T(j.outcome))}<div class="bp-start">${nextJ ? `<button type="button" class="btn primary" data-journey="${S.j + 1}">${U.nextJourney} ${esc(nextJ.id)}: ${esc(T(nextJ.title))} →</button>` : ''}<button type="button" class="btn" data-journey="${S.j}">${U.again}</button></div></div>` : ''}
<h3 class="bp-eyebrow">${U.carries}</h3><div class="bp-chips">${s.carries?.length ? s.carries.map((c) => chip(c)).join('') : `<span class="bp-muted">${U.carriesNothing}</span>`}</div>
<h3 class="bp-eyebrow">${U.thisPiece}</h3><button type="button" class="bp-about" data-piece="${s.node}"><span>${U.about} ${esc(T(n.label))}</span><small>${U.aboutHint}</small></button>
${deeper}
<h3 class="bp-eyebrow">${U.allStops}</h3><div class="bp-stops">${stops}</div></div>`;
  }
  function passes(filter) {
    const out = [];
    D.journeys.forEach((j, ji) => j.stops.forEach((s, si) => { if (filter(s)) out.push({ ji, si, j, s }); }));
    return out;
  }
  function passList(list) {
    const U = u();
    if (!list.length) return `<p class="bp-muted">${U.noneThrough}</p>`;
    return `<ul class="bp-passes">${list.map(({ ji, si, j, s }) => `<li><button type="button" data-goto="${ji}:${si}"><b>${esc(j.id)}${si + 1}</b><span>${esc(T(s.text))}</span></button></li>`).join('')}</ul>`;
  }
  function pieceView(id) {
    const U = u(), n = NODES[id], tone = n.tone || D.zones.find((z) => z.id === n.zone)?.tone;
    const zone = D.zones.find((z) => z.id === n.zone);
    return `${panelHead(`${U.piece}`, true)}<div class="bp-panel-body">
<div class="bp-card-title"><svg class="bp-card-icon bp-tone-${tone || 'plain'}" viewBox="0 0 24 24" aria-hidden="true"><use href="#bp-i-${n.icon || 'box'}"/></svg><div><h3>${esc(T(n.label))}</h3>${n.sub ? `<p>${esc(T(n.sub))}</p>` : ''}${zone.what ? `<button type="button" class="bp-zone-link" data-zone="${esc(zone.id)}">${esc(T(zone.label))}</button>` : `<small>${esc(T(zone.label))}</small>`}</div></div>
<h4>${U.what}</h4><p>${esc(T(n.what))}</p>
${facts(n, true).map((f) => `<h4>${esc(T(f.label))}</h4><p>${esc(T(f.text))}</p>`).join('')}
${n.holds?.length ? `<h4>${U.holds}</h4><div class="bp-chips">${n.holds.map((c) => chip(c)).join('')}</div>` : ''}
<h4>${U.not}</h4><p>${esc(T(n.not))}</p>
${facts(n, false).map((f) => `<h4>${esc(T(f.label))}</h4><p>${esc(T(f.text))}</p>`).join('')}
${n.lessons?.length ? `<h4>${U.deeper}</h4>${n.lessons.map(lessonLink).join('')}` : ''}
<h4>${U.through}</h4>${passList(passes((s) => s.node === id))}</div>`;
  }
  // Where an item is at each moment: an ordered list, each step with the piece that keeps it.
  function livesList(it, heading = true) {
    if (!it.lives?.length) return '';
    const list = `<ol class="bp-lives">${it.lives.map((x) => `<li><span class="bp-lives-when">${esc(T(x.when))}</span>${esc(T(x.where))}${x.node ? ` <button type="button" class="bp-chip" data-piece="${esc(x.node)}">${esc(T(NODES[x.node].label))}</button>` : ''}</li>`).join('')}</ol>`;
    return heading ? `<h4>${u().lives}</h4>${list}` : list;
  }
  function itemView(id) {
    const U = u(), it = ITEMS[id];
    const holders = IDS.filter((n) => NODES[n].holds?.includes(id));
    return `${panelHead(`${esc(T(D.config.item))}`, true)}<div class="bp-panel-body">
<div class="bp-card-title"><span class="bp-letter bp-big bp-${it.color}" aria-hidden="true">${esc(it.letter)}</span><div><h3>${esc(T(it.name))}</h3></div></div>
<h4>${U.what}</h4><p>${esc(T(it.what))}</p><h4>${U.comesFrom}</h4><p>${esc(T(it.from))}</p><h4>${U.endsUp}</h4><p>${esc(T(it.to))}</p>
${livesList(it)}
${holders.length ? `<h4>${U.heldBy}</h4><div class="bp-chips">${holders.map((n) => `<button type="button" class="bp-chip" data-piece="${n}">${esc(T(NODES[n].label))}</button>`).join('')}</div>` : ''}
${it.lessons?.length ? `<h4>${U.deeper}</h4>${it.lessons.map(lessonLink).join('')}` : ''}
<h4>${U.carriedIn}</h4>${passList(passes((s) => s.carries?.includes(id)))}</div>`;
  }

  // An area: what it is, what it does not do, what is inside it and the journeys that cross it.
  function zoneView(id) {
    const U = u(), z = D.zones.find((x) => x.id === id), parent = D.zones.find((x) => x.id === z.parent);
    const within = (zid) => zid === id || D.zones.some((x) => x.id === zid && x.parent && within(x.parent));
    const inner = D.zones.filter((x) => x.parent === id), pieces = IDS.filter((n) => NODES[n].zone === id);
    const crossing = D.journeys.map((j, i) => ({ j, i })).filter(({ j }) => j.stops.some((s) => within(NODES[s.node].zone)));
    return `${panelHead(U.zone, true)}<div class="bp-panel-body">
<div class="bp-card-title"><svg class="bp-card-icon bp-tone-${z.tone || 'plain'}" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"${z.parent ? ' stroke-dasharray="3 2"' : ''}/></svg><div><h3>${esc(T(z.label))}</h3>${z.note ? `<p>${esc(T(z.note))}</p>` : ''}${parent ? (parent.what ? `<button type="button" class="bp-zone-link" data-zone="${esc(parent.id)}">${esc(T(parent.label))}</button>` : `<small>${esc(T(parent.label))}</small>`) : ''}</div></div>
<h4>${U.what}</h4><p>${esc(T(z.what))}</p>
<h4>${U.not}</h4><p>${esc(T(z.not))}</p>
${inner.length || pieces.length ? `<h4>${U.inside}</h4><div class="bp-chips">${inner.map((x) => `<button type="button" class="bp-chip bp-chip-zone"${x.what ? ` data-zone="${esc(x.id)}"` : ' disabled'}>${esc(T(x.label))}</button>`).join('')}${pieces.map((n) => `<button type="button" class="bp-chip" data-piece="${n}">${esc(T(NODES[n].label))}</button>`).join('')}</div>` : ''}
${z.lessons?.length ? `<h4>${U.deeper}</h4>${z.lessons.map(lessonLink).join('')}` : ''}
<h4>${U.zoneJourneys}</h4>${crossing.length ? `<ol class="bp-journeys">${crossing.map(({ j, i }) => `<li><button type="button" data-journey="${i}"><span class="bp-jletter">${esc(j.id)}</span><span><strong>${esc(T(j.title))}</strong><small>${esc(T(j.summary))}</small></span></button></li>`).join('')}</ol>` : `<p class="bp-muted">${U.noneCross}</p>`}</div>`;
  }

  function renderPlayer() {
    const U = u(), j = journey(), s = stop();
    const caption = j ? `${esc(T(j.title))} · ${U.stop} ${S.s + 1} ${U.of} ${j.stops.length} · ${esc(T(NODES[s.node].label))}` : U.noJourney;
    const text = j ? esc(T(s.text)) : U.pick;
    const segs = j ? `<div class="bp-progress">${j.stops.map((x, k) => `<button type="button" class="${k < S.s ? 'done' : k === S.s ? 'on' : ''}" data-stop="${k}" aria-label="${U.stop} ${k + 1}"></button>`).join('')}</div>` : '';
    player.innerHTML = `<div class="bp-controls"><button type="button" class="btn" data-act="first" aria-label="${U.first}" ${!j || S.s === 0 ? 'disabled' : ''}>⏮</button><button type="button" class="btn" data-act="prev" aria-label="${U.prev}" ${!j || S.s === 0 ? 'disabled' : ''}>◀</button><button type="button" class="btn primary bp-play" data-act="play">${S.playing ? '❚❚ ' + U.pause : '▶ ' + U.play}</button><button type="button" class="btn" data-act="next" aria-label="${U.next}" ${j && S.s === j.stops.length - 1 ? 'disabled' : ''}>▶</button><label class="bp-speed"><span class="sr-only">${U.speed}</span><select data-speed aria-label="${U.speed}">${Object.keys(SPEEDS).map((k) => `<option value="${k}" ${k === S.speed ? 'selected' : ''}>${U[k]}</option>`).join('')}</select></label></div><div class="bp-now"><span class="bp-eyebrow">${caption}</span><p>${text}</p></div>${segs}`;
  }

  /* State changes. */
  function syncURL() {
    const q = new URLSearchParams();
    if (D.config.langs.length > 1) q.set('lang', lang);
    q.set('theme', theme);
    if (journey()) { q.set('j', journey().id); q.set('s', String(S.s + 1)); }
    if (S.view === 'piece' && S.piece) q.set('piece', S.piece);
    if (S.view === 'item' && S.item) q.set('item', S.item);
    if (S.view === 'zone' && S.zone) q.set('zone', S.zone);
    try { history.replaceState(null, '', `${location.pathname}?${q}`); } catch { /* file:// in some browsers */ }
  }
  function update({ panel: p = true, bubble: b = true } = {}) {
    paint();
    if (p) renderPanel();
    renderPlayer();
    if (b) showBubble(); else bubble.hidden = true;
    syncURL();
  }
  function announce() {
    const j = journey(), s = stop();
    if (j) live.textContent = u().announce(j.id, S.s + 1, j.stops.length, T(NODES[s.node].label), T(s.text));
  }
  function startJourney(i, at = 0) {
    stopPlay();
    finishMove();
    S.j = i;
    S.s = Math.max(0, Math.min(D.journeys[i].stops.length - 1, at));
    S.view = 'stop';
    S.bubble = true;
    update();
    announce();
    if (S.follow) followTo(stop().node);
  }
  function goStop(k, animate = false) {
    const j = journey();
    if (!j) return;
    k = Math.max(0, Math.min(j.stops.length - 1, k));
    finishMove();
    const from = stop().node;
    S.view = 'stop';
    S.bubble = true;
    if (animate && k === S.s + 1 && !reduced && (from !== j.stops[k].node || j.stops[k].via?.length || j.stops[k].lane !== j.stops[S.s].lane)) return travel(from, k);
    S.s = k;
    update();
    announce();
    if (S.follow) followTo(stop().node);
  }
  function travel(from, k) {
    const j = journey(), to = j.stops[k].node;
    let pts = [dotSpot(from, j.stops[k - 1].lane)];
    for (const [a, b] of hops(j, k)) {
      const l = link(D, a, b);
      const seg = l ? route(NODES, D.edges[l.index]) : [dotSpot(a), dotSpot(b)];
      pts = pts.concat(l?.reverse ? seg.slice().reverse() : seg);
    }
    pts.push(dotSpot(to, j.stops[k].lane));
    S.moving = true;
    S.s = k;
    update({ bubble: false });
    if (S.follow) followTo(to, 500);
    const len = length(pts), ms = Math.max(420, Math.min(1700, (len / 0.5) / SPEEDS[S.speed]));
    const t0 = performance.now();
    dotG.querySelector('.bp-dot-items').innerHTML = carriedMarks(j.stops[k - 1].carries || []);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / ms), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const [x, y] = at(pts, e);
      dotG.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      if (t < 1) anim = requestAnimationFrame(step);
      else arrive();
    };
    anim = requestAnimationFrame(step);
  }
  function arrive() {
    S.moving = false;
    update({ panel: false });
    announce();
    if (S.playing) schedule();
  }
  function finishMove() {
    if (!S.moving) return;
    cancelAnimationFrame(anim);
    S.moving = false;
  }
  function next() {
    const j = journey();
    if (!j) return startJourney(0);
    if (S.s < j.stops.length - 1) goStop(S.s + 1, true);
    else stopPlay();
  }
  function prev() { if (journey() && S.s > 0) { stopPlay(); goStop(S.s - 1); } }
  function schedule() {
    clearTimeout(timer);
    const s = stop();
    if (!s) return;
    const ms = (2200 + T(s.text).length * 32) / SPEEDS[S.speed];
    timer = setTimeout(() => {
      if (!S.playing) return;
      const j = journey();
      if (S.s >= j.stops.length - 1) { stopPlay(); return; }
      goStop(S.s + 1, true);
      if (reduced) schedule();
    }, ms);
  }
  function play() {
    if (!journey()) startJourney(0);
    const j = journey();
    if (S.s >= j.stops.length - 1) goStop(0);
    S.playing = true;
    renderPlayer();
    schedule();
  }
  function stopPlay() {
    clearTimeout(timer);
    if (S.playing) { S.playing = false; if (player) renderPlayer(); }
  }
  function openPiece(id) {
    lastFocus = document.activeElement;
    S.view = 'piece';
    S.piece = id;
    update({ bubble: !!journey() });
    panel.querySelector('h3')?.setAttribute('tabindex', '-1');
    panel.querySelector('h3')?.focus({ preventScroll: true });
  }
  function openItem(id) {
    S.view = 'item';
    S.item = id;
    update({ bubble: !!journey() });
    panel.querySelector('h3')?.setAttribute('tabindex', '-1');
    panel.querySelector('h3')?.focus({ preventScroll: true });
  }
  function openZone(id) {
    lastFocus = document.activeElement;
    S.view = 'zone';
    S.zone = id;
    update({ bubble: !!journey() });
    panel.querySelector('h3')?.setAttribute('tabindex', '-1');
    panel.querySelector('h3')?.focus({ preventScroll: true });
  }
  function panelBack() {
    if (journey() && S.view !== 'stop') { S.view = 'stop'; update(); return; }
    reset();
  }
  function reset() {
    stopPlay();
    finishMove();
    S.j = -1; S.s = 0; S.view = 'overview'; S.piece = null; S.item = null; S.zone = null;
    update();
    S.fitted = true;
    moveCam(fitCam());
  }

  /* Dialogs. */
  function dialog(title, body) {
    const d = root.querySelector('.bp-dialog');
    lastFocus = document.activeElement;
    d.querySelector('#bp-dialog-title').textContent = title;
    d.querySelector('.bp-dialog-body').innerHTML = body;
    d.querySelector('.bp-dialog-body').scrollTop = 0;
    if (!d.open) d.showModal();
  }
  function legend() {
    const U = u(), names = D.legend?.edges || {};
    const line = (k) => `<svg viewBox="0 0 64 14" aria-hidden="true"><g class="bp-edge bp-edge-${k}"><path d="M2 7H58" marker-end="url(#bp-a-${k})"/></g></svg>`;
    const used = EDGE_KINDS.filter((k) => D.edges.some((e) => e.kind === k));
    const tones = [...new Set([...D.zones.map((z) => z.tone || 'plain'), ...IDS.map((id) => NODES[id].tone).filter(Boolean)])];
    const toneNames = D.legend?.tones || {};
    return `<div class="bp-legend"><h3>${U.edges}</h3><ul>${used.map((k) => `<li>${line(k)}<span>${esc(T(names[k] || EDGE_NAMES[k]))}</span></li>`).join('')}<li><svg viewBox="0 0 64 14" aria-hidden="true"><path class="bp-trail-path" d="M2 7H58" marker-end="url(#bp-a-trail)"/></svg><span>${esc(T(D.legend?.trail || { en: 'the way the dot has travelled in this journey', es: 'el camino que hizo el punto en este recorrido' }))}</span></li></ul>
<h3>${U.nodes}</h3><ul>${tones.filter((t) => toneNames[t]).map((t) => `<li><svg viewBox="0 0 64 26" aria-hidden="true"><g class="bp-node bp-tone-${t}"><rect class="bp-box" x="4" y="3" width="56" height="20" rx="6"/></g></svg><span>${esc(T(toneNames[t]))}</span></li>`).join('')}</ul>
<h3>${U.dot}</h3><p>${U.dotText}</p><h3>${U.stamps}</h3><p>${U.stampText}</p><div class="bp-chips">${TONES.map((t) => `<span class="bp-stampchip bp-stamp-${t}">${esc(T(D.legend?.stamps?.[t] || { ok: { en: 'passes', es: 'pasa' }, deny: { en: 'stops', es: 'frena' }, info: { en: 'notes', es: 'anota' } }[t]))}</span>`).join('')}</div>
${D.tags ? `<h3>${U.tags}</h3><dl>${Object.keys(D.tags).map((k) => `<dt>${tagBadge(k)}</dt><dd>${esc(T(D.tags[k].text))}</dd>`).join('')}</dl>` : ''}</div>`;
  }
  function howTo() {
    const U = u();
    const items = D.zones.some((z) => z.what) ? [...U.howItems.slice(0, 3), U.howZones, ...U.howItems.slice(3)] : U.howItems;
    return `<div class="bp-how"><ol>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><h3>${U.keys}</h3><dl class="bp-keys">${U.howKeys.map(([k, v]) => `<dt><kbd>${esc(k)}</kbd></dt><dd>${esc(v)}</dd>`).join('')}</dl><h3>${U.mouse}</h3><p>${U.drag}.</p></div>`;
  }
  function textVersion() {
    return `<div class="bp-text"><p class="bp-muted">${u().textIntro}</p>${BP.outline(D, course, lang, { query: `?lang=${lang}&theme=${theme}` })}</div>`;
  }
  function itemsDialog() {
    const U = u();
    return `${D.config.itemsIntro ? `<p>${esc(T(D.config.itemsIntro))}</p>` : ''}<div class="bp-catalog">${ITEM_IDS.map((i) => { const it = ITEMS[i]; return `<article><h3><span class="bp-letter bp-${it.color}" aria-hidden="true">${esc(it.letter)}</span>${esc(T(it.name))}</h3><p>${esc(T(it.what))}</p><dl><dt>${U.comesFrom}</dt><dd>${esc(T(it.from))}</dd><dt>${U.endsUp}</dt><dd>${esc(T(it.to))}</dd>${it.lives?.length ? `<dt>${U.lives}</dt><dd>${livesList(it, false)}</dd>` : ''}</dl><button type="button" class="btn bp-small" data-item="${i}">${U.carriedIn} →</button></article>`; }).join('')}</div>`;
  }

  /* Events. */
  function bindUI() {
    root.addEventListener('click', (ev) => {
      const t = ev.target.closest('button, a');
      if (!t || !root.contains(t)) return;
      const dlg = root.querySelector('.bp-dialog');
      const inDialog = dlg.contains(t);
      if (t.dataset.journey !== undefined) { if (inDialog) dlg.close(); return startJourney(Number(t.dataset.journey)); }
      if (t.dataset.stop !== undefined) { stopPlay(); return goStop(Number(t.dataset.stop)); }
      if (t.dataset.goto) { const [a, b] = t.dataset.goto.split(':').map(Number); if (inDialog) dlg.close(); return startJourney(a, b); }
      if (t.dataset.piece) { if (inDialog) dlg.close(); return openPiece(t.dataset.piece); }
      if (t.dataset.item) { if (inDialog) dlg.close(); return openItem(t.dataset.item); }
      if (t.dataset.zone) { if (inDialog) dlg.close(); return openZone(t.dataset.zone); }
      if (t.dataset.lang) { lang = t.dataset.lang; store(D.config.langKey, lang); rebuild(); return; }
      if (t.dataset.copy) {
        const done = () => { t.textContent = u().copied; setTimeout(() => (t.textContent = u().copy), 1400); };
        navigator.clipboard?.writeText(t.dataset.copy).then(done, () => {});
        return;
      }
      const act = t.dataset.act;
      if (!act) return;
      ({
        reset, next, prev, play: () => (S.playing ? stopPlay() : play()), first: () => { stopPlay(); goStop(0); },
        items: () => dialog(T(D.config.items), itemsDialog()), legend: () => dialog(u().legend, legend()),
        how: () => dialog(u().howTo, howTo()), text: () => dialog(u().text, textVersion()),
        close: () => dlg.close(), held: toggleHeld, bubble: () => { S.bubble = false; bubble.hidden = true; },
        in: () => { S.fitted = false; moveCam(zoom(1.35), 200); }, out: () => { S.fitted = false; moveCam(zoom(1 / 1.35), 200); },
        fit: () => { S.fitted = true; moveCam(fitCam()); }, follow: toggleFollow,
        'panel-back': panelBack, 'to-stop': () => { S.view = 'stop'; update(); },
      })[act]?.();
    });
    root.addEventListener('change', (ev) => {
      if (ev.target.matches('[data-skin]')) {
        theme = THEMES.includes(ev.target.value) ? ev.target.value : 'light';
        document.documentElement.dataset.theme = theme;
        store(D.config.themeKey, theme);
        syncURL();
        renderPanel();
        requestAnimationFrame(() => { if (S.fitted) S.cam = fitCam(); applyCam(); });
      }
      if (ev.target.matches('[data-speed]')) { S.speed = ev.target.value; if (S.playing) schedule(); }
    });
    root.querySelector('.bp-dialog').addEventListener('close', () => lastFocus?.focus?.());
    document.addEventListener('keydown', (ev) => {
      const dlg = root.querySelector('.bp-dialog');
      if (dlg.open || ev.altKey || ev.ctrlKey || ev.metaKey) return;
      if (ev.target.closest('input, select, textarea')) return;
      const k = ev.key, onButton = ev.target.closest('button, a, .bp-node, .bp-zone-card, .bp-dot');
      if (k === 'ArrowRight') { ev.preventDefault(); stopPlay(); next(); }
      else if (k === 'ArrowLeft') { ev.preventDefault(); prev(); }
      else if (k === ' ' && !onButton) { ev.preventDefault(); S.playing ? stopPlay() : play(); }
      else if (k === 'Home' && journey()) { ev.preventDefault(); stopPlay(); goStop(0); }
      else if (k === 'End' && journey()) { ev.preventDefault(); stopPlay(); goStop(journey().stops.length - 1); }
      else if (/^[1-9]$/.test(k) && D.journeys[Number(k) - 1]) startJourney(Number(k) - 1);
      else if (k === '+' || k === '=') { S.fitted = false; moveCam(zoom(1.35), 200); }
      else if (k === '-' || k === '−') { S.fitted = false; moveCam(zoom(1 / 1.35), 200); }
      else if (k === 'f' || k === 'F') { S.fitted = true; moveCam(fitCam()); }
      else if (k === 'w' || k === 'W') toggleFollow();
      else if (k === 'h' || k === 'H') toggleHeld();
      else if (k === 'l' || k === 'L') dialog(u().legend, legend());
      else if (k === 't' || k === 'T') dialog(u().text, textVersion());
      else if (k === '?') dialog(u().howTo, howTo());
      else if (k === 'r' || k === 'R') reset();
      else if (k === 'Escape') {
        if (!bubble.hidden) { S.bubble = false; bubble.hidden = true; }
        else if (S.view === 'piece' || S.view === 'item' || S.view === 'zone') panelBack();
        else if (journey()) reset();
      }
    });
    window.addEventListener('resize', () => placeBubble());
  }
  function toggleHeld() {
    S.held = !S.held;
    const b = root.querySelector('[data-act="held"]');
    b.setAttribute('aria-pressed', String(S.held));
    b.classList.toggle('on', S.held);
    paint();
  }
  function toggleFollow() {
    S.follow = !S.follow;
    const b = root.querySelector('[data-act="follow"]');
    b.setAttribute('aria-pressed', String(S.follow));
    b.classList.toggle('on', S.follow);
    b.textContent = `${u().follow}: ${S.follow ? u().on : u().off}`;
    if (S.follow && stop()) { S.fitted = false; followTo(stop().node); }
    if (!S.follow) { S.fitted = true; moveCam(fitCam()); }
  }
  function rebuild() {
    const cam = S.cam;
    shell();
    S.cam = cam;
    applyCam();
    update();
    if (S.held) root.querySelector('[data-act="held"]').classList.add('on');
  }

  /* Start: from the address, if it names a journey, a stop, a piece or an item. */
  function init() {
    shell();
    bindUI();
    S.follow = view.getBoundingClientRect().width < 700;
    const fb = root.querySelector('[data-act="follow"]');
    fb.setAttribute('aria-pressed', String(S.follow));
    fb.classList.toggle('on', S.follow);
    fb.textContent = `${u().follow}: ${S.follow ? u().on : u().off}`;
    S.cam = fitCam();
    S.fitted = true;
    applyCam();
    const ji = D.journeys.findIndex((j) => j.id === query.get('j'));
    if (ji >= 0) {
      S.j = ji;
      S.s = Math.max(0, Math.min(D.journeys[ji].stops.length - 1, (Number(query.get('s')) || 1) - 1));
      S.view = 'stop';
    }
    const piece = query.get('piece'), item = query.get('item'), zone = D.zones.find((z) => z.what && z.id === query.get('zone'));
    if (piece && NODES[piece]) { S.view = 'piece'; S.piece = piece; }
    else if (item && ITEMS[item]) { S.view = 'item'; S.item = item; }
    else if (zone) { S.view = 'zone'; S.zone = zone.id; }
    update();
    if (S.follow && stop()) { S.fitted = false; followTo(stop().node, 0); }
    if (document.fonts?.ready) document.fonts.ready.then(() => { const cam = S.cam; scene(); bindSceneAgain(); S.cam = cam; applyCam(); paint(); placeBubble(); });
  }
  // After the fonts load, the scene is drawn again so the wrapping uses the real font.
  function bindSceneAgain() { dotG = svg.querySelector('.bp-dot'); dotG.style.display = journey() ? '' : 'none'; }
  init();
})();
