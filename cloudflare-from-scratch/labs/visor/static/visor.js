/* The live viewer: asks the server for new events every second and draws the selected one on the
   pieces of the kit. The cards of the pieces come from the map of the course (pieces.json) and the
   lessons from the lab steps (lessons.json); build.mjs writes both. */
(() => {
  const $ = (id) => document.getElementById(id);
  const B = (en, es) => ({ en, es });
  const T = {
    en: {
      title: 'Rumbo · edge viewer', live: 'live · 127.0.0.1:18098', down: 'the edge does not answer', connecting: 'connecting',
      count: (n) => `${n} ${n === 1 ? 'event' : 'events'}`, follow: 'Follow the latest', pause: 'Pause', other: 'ES', theme: { light: 'Dark', dark: 'Light' },
      feed: 'What happened at the edge', scene: 'The path of the event', show: 'Show:', event: 'The event, span by span', piece: 'The piece',
      kinds: { request: 'requests', queue: 'queue', alarm: 'alarms', cron: 'cron' }, chip: { request: 'request', queue: 'queue', alarm: 'alarm', cron: 'cron', other: 'other' },
      hatch: 'The hatched pieces do not run in the kit; the viewer does not make them up.',
      empty: 'Nothing has reached the edge yet. Try, in the labs folder:', whole: 'the whole event', noCalls: 'No calls to other services.', more: (n) => `and ${n} more calls`,
      step: (l, s, title) => `lesson ${String(l).padStart(2, '0')}, step ${s}: ${title}`, notStep: 'a command that is not a step of the course', noCommand: 'no lab command before it',
      what: 'What it is', forwhat: 'What it is for', not: 'What it does not do', free: 'Free plan', lessonTag: (n) => `Lesson ${String(n).padStart(2, '0')}`,
      local: { yes: 'local: in the kit', part: 'local: partly', no: 'not in the kit' }, sceneLabel: 'The path of the selected event over the pieces of the kit',
      edgeBox: 'the edge on your machine: wrangler dev, 127.0.0.1:18097', infraBox: 'your infrastructure', bindings: 'bindings', after: 'what runs after the request',
    },
    es: {
      title: 'Rumbo · visor del borde', live: 'en vivo · 127.0.0.1:18098', down: 'el borde no responde', connecting: 'conectando',
      count: (n) => `${n} ${n === 1 ? 'evento' : 'eventos'}`, follow: 'Seguir lo último', pause: 'Pausar', other: 'EN', theme: { light: 'Oscuro', dark: 'Claro' },
      feed: 'Lo que pasó en el borde', scene: 'El recorrido del evento', show: 'Mostrar:', event: 'El evento, span por span', piece: 'La pieza',
      kinds: { request: 'pedidos', queue: 'cola', alarm: 'alarmas', cron: 'cron' }, chip: { request: 'pedido', queue: 'cola', alarm: 'alarma', cron: 'cron', other: 'otro' },
      hatch: 'Las piezas rayadas no corren en el kit; el visor no las inventa.',
      empty: 'Todavía no pasó nada por el borde. Probá, en la carpeta de los labs:', whole: 'el evento entero', noCalls: 'Sin llamadas a otros servicios.', more: (n) => `y ${n} llamadas más`,
      step: (l, s, title) => `lección ${String(l).padStart(2, '0')}, paso ${s}: ${title}`, notStep: 'un comando que no es un paso del curso', noCommand: 'sin un comando de lab antes',
      what: 'Qué es', forwhat: 'Para qué sirve', not: 'Qué no hace', free: 'Plan gratuito', lessonTag: (n) => `Lección ${String(n).padStart(2, '0')}`,
      local: { yes: 'local: en el kit', part: 'local: en parte', no: 'no está en el kit' }, sceneLabel: 'El recorrido del evento elegido sobre las piezas del kit',
      edgeBox: 'el borde en tu máquina: wrangler dev, 127.0.0.1:18097', infraBox: 'tu infraestructura', bindings: 'bindings', after: 'lo que corre después del pedido',
    },
  };
  // x, y, w, h on a 900 x 530 scene; kind; title; subtitle.
  const N = {
    kit: [20, 150, 120, 70, 'client', 'lab', B('your terminal', 'tu terminal')],
    dns: [170, 40, 112, 56, 'off', 'DNS, anycast', B('no zone', 'sin zona')],
    waf: [292, 40, 108, 56, 'off', 'WAF', B('no zone', 'sin zona')],
    access: [410, 40, 120, 56, 'off', 'Access', B('a test issuer', 'emisor de prueba')],
    cache: [540, 40, 140, 56, 'off', 'Workers Cache', B('not in wrangler dev', 'no corre en wrangler dev')],
    worker: [170, 140, 510, 96, 'worker', 'Worker rumbo-edge', B('the gateway: rules in code, CORS, maintenance', 'el gateway: reglas en código, CORS, mantenimiento')],
    ratelimit: [170, 272, 92, 70, 'binding', 'rate limit', 'LIMITER'],
    kv: [272, 272, 92, 70, 'binding', 'KV', 'FLAGS'],
    cacheapi: [374, 272, 92, 70, 'binding', 'Cache API', 'caches.default'],
    d1: [476, 272, 92, 70, 'binding', 'D1', 'DB'],
    r2: [578, 272, 102, 70, 'binding', 'R2', 'PROOFS'],
    queue: [170, 356, 92, 70, 'binding', 'Queue', 'MOVES'],
    dobj: [272, 356, 112, 70, 'binding', 'Durable Object', 'SHIPMENTS'],
    workflow: [394, 356, 92, 70, 'binding', 'Workflow', 'RETURNS'],
    hyperdrive: [496, 356, 184, 70, 'binding', 'Hyperdrive', B('PG, straight to the database', 'PG, directo a la base')],
    consumer: [170, 450, 160, 62, 'after', B('queue consumer', 'consumidor de la cola'), 'movements'],
    alarm: [340, 450, 160, 62, 'after', B('object alarm', 'alarma del objeto'), 'Shipment'],
    cron: [510, 450, 170, 62, 'after', 'Cron Trigger', '0 3 * * *'],
    api: [720, 150, 160, 80, 'infra', B('API of Rumbo', 'API de Rumbo'), 'origin:8080'],
    postgres: [720, 356, 160, 70, 'infra', 'PostgreSQL 18', 'db:5432'],
  };
  const MAIN = { queue: 'consumer', alarm: 'alarm', cron: 'cron' };

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
  const asked = new URLSearchParams(location.search).get('lang');
  let lang = ['en', 'es'].includes(asked) ? asked : store.get('cf-visor-lang') || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en');
  let theme = store.get('cf-visor-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  let course = { lessons: [] };
  let pieces = {};
  let events = [];
  let after = 0;
  let boot = null;
  let edge = null;
  let sel = null;
  let card = 'worker';
  let follow = true;
  let paused = false;
  const show = { request: true, queue: true, alarm: true, cron: true, other: true };

  const t = () => T[lang];
  const L = (v) => (typeof v === 'string' ? v : v[lang]);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const visible = () => events.filter((e) => show[e.kind] ?? true);
  const current = () => events.find((e) => e.id === sel) ?? null;
  const okStatus = (e) => (e.status ? e.status < 400 : e.outcome === 'ok');

  function mainPiece(e) {
    return MAIN[e.kind] ?? e.steps.find((s) => s.piece)?.piece ?? 'worker';
  }

  function header() {
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = theme;
    document.title = t().title;
    $('title').textContent = t().title;
    $('live').classList.toggle('down', edge === false);
    $('live-text').textContent = `${edge === null ? t().connecting : edge ? t().live : t().down} · ${t().count(events.length)}`;
    $('follow').textContent = t().follow;
    $('follow').setAttribute('aria-pressed', String(follow));
    $('pause').textContent = t().pause;
    $('pause').setAttribute('aria-pressed', String(paused));
    $('lang').textContent = t().other;
    $('theme').textContent = t().theme[theme];
    $('feed-title').textContent = t().feed;
    $('scene-title').textContent = t().scene;
    $('show-label').textContent = t().show;
    $('event-title').textContent = t().event;
    $('piece-title').textContent = t().piece;
    $('hatch-note').textContent = t().hatch;
    for (const b of document.querySelectorAll('[data-kind]')) {
      b.textContent = t().kinds[b.dataset.kind];
      b.setAttribute('aria-pressed', String(show[b.dataset.kind]));
    }
  }

  function feed() {
    const list = visible().slice().reverse();
    $('feed').innerHTML = list.length
      ? list
          .map(
            (e) =>
              `<button class="item" type="button" data-id="${e.id}" aria-current="${e.id === sel}"><span class="top"><span class="chip k-${e.kind}">${esc(t().chip[e.kind] ?? e.kind)}</span><span class="what">${esc(e.label)}</span></span><span class="meta"><span class="${okStatus(e) ? 'ok' : 'bad'}">${esc(e.status ?? e.outcome)}</span> · ${e.ms} ms${e.step ? ' · ' + esc(t().lessonTag(e.step.lesson).toLowerCase()) + '.' + e.step.step : ''}</span></button>`,
          )
          .join('')
      : `<p class="empty">${esc(t().empty)}<br><code>docker compose run --rm lab get /api/shipments/R-1042</code></p>`;
    for (const b of $('feed').querySelectorAll('.item'))
      b.onclick = () => {
        follow = false;
        sel = Number(b.dataset.id);
        card = mainPiece(current());
        render();
      };
  }

  function scene() {
    const e = current();
    const order = new Map();
    (e?.path ?? []).forEach((n, i) => order.has(n) || order.set(n, order.size + 1));
    const C = { client: css('--blue'), worker: css('--orange'), binding: css('--green'), after: css('--purple'), infra: css('--blue'), off: css('--muted') };
    const ink = css('--ink'), muted = css('--muted'), line = css('--line'), panel = css('--panel'), white = css('--white'), mint = css('--mint'), amber = css('--amber'), orange = css('--orange');
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p = [];
    p.push(`<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${orange}"/></marker><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="${css('--hatch')}" stroke-width="3"/></pattern></defs>`);
    p.push(`<rect x="155" y="24" width="540" height="500" rx="10" fill="${panel}" stroke="${line}"/><text x="167" y="18" font-size="11" fill="${muted}" font-family="ui-monospace,Consolas,monospace">${esc(t().edgeBox)}</text>`);
    p.push(`<rect x="705" y="130" width="190" height="310" rx="10" fill="${panel}" stroke="${line}"/><text x="717" y="124" font-size="11" fill="${muted}" font-family="ui-monospace,Consolas,monospace">${esc(t().infraBox)}</text>`);
    p.push(`<text x="170" y="263" font-size="10.5" fill="${muted}" font-family="ui-monospace,Consolas,monospace">${esc(t().bindings)}</text><text x="170" y="443" font-size="10.5" fill="${muted}" font-family="ui-monospace,Consolas,monospace">${esc(t().after)}</text>`);
    const last = e?.path.at(-1);
    for (const [id, [x, y, w, h, kind, title, sub]] of Object.entries(N)) {
      const on = order.has(id), off = kind === 'off', pick = id === card;
      const fill = off ? 'url(#hatch)' : on ? (id === last ? amber : mint) : white;
      const stroke = pick ? ink : on ? orange : C[kind];
      p.push(
        `<g class="node" data-node="${id}" tabindex="0" role="button" aria-label="${esc(L(title))}" opacity="${on || off || id === 'kit' || !e ? 1 : 0.55}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${on || pick ? 2.5 : 1.3}"${off ? ' stroke-dasharray="4 4"' : ''}/><text x="${x + 10}" y="${y + 22}" font-size="11.5" font-family="ui-monospace,Consolas,monospace" fill="${ink}">${esc(L(title))}</text><text x="${x + 10}" y="${y + 39}" font-size="10" fill="${muted}">${esc(L(sub))}</text>${on ? `<circle cx="${x + 2}" cy="${y + 2}" r="9" fill="${orange}"/><text x="${x + 2}" y="${y + 6}" font-size="10" text-anchor="middle" fill="#fff" font-weight="700">${order.get(id)}</text>` : ''}</g>`,
      );
    }
    const mid = (id) => {
      const [x, y, w, h] = N[id];
      return [x + w / 2, y + h / 2];
    };
    const path = e?.path ?? [];
    for (let i = 1; i < path.length; i++) {
      if (!N[path[i - 1]] || !N[path[i]]) continue;
      const [x1, y1] = mid(path[i - 1]), [x2, y2] = mid(path[i]);
      const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 30 - i * 4;
      p.push(`<path class="flight" d="M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="${orange}" stroke-width="2.5" stroke-dasharray="7 5" marker-end="url(#ar)">${still ? '' : '<animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.8s" repeatCount="indefinite"/>'}</path>`);
    }
    $('scene').innerHTML = `<svg viewBox="0 0 900 530" role="group" aria-label="${esc(t().sceneLabel)}" font-family="Segoe UI,system-ui,sans-serif">${p.join('')}</svg>`;
    for (const g of $('scene').querySelectorAll('.node')) {
      const pick = () => {
        card = g.dataset.node;
        render();
        $('scene').querySelector(`[data-node="${card}"]`)?.focus();
      };
      g.onclick = pick;
      g.onkeydown = (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          pick();
        }
      };
    }
  }

  function side() {
    const e = current();
    if (!e) {
      $('wf').innerHTML = '';
      $('attrs').innerHTML = '';
    } else {
      const total = Math.max(1, e.ms);
      const shown = e.steps.length > 14 ? e.steps.slice(0, 13) : e.steps;
      const rows = [[t().whole, 0, e.ms, true], ...shown.map((s) => [s.label, s.start, s.ms, false])];
      $('wf').innerHTML = rows
        .map(([n, start, d, root]) => `<div class="row ${root ? 'root' : ''}"><span title="${esc(n)}">${esc(n)}</span><span class="track"><span class="fill" data-left="${Math.min(98, (start / total) * 100)}" data-width="${Math.max(2, Math.min(100, (d / total) * 100))}"></span></span><span class="ms">${d} ms</span></div>`)
        .join('') + (shown.length < e.steps.length ? `<p class="attrs">${esc(t().more(e.steps.length - shown.length))}</p>` : '');
      // The page allows no inline styles: the bars are placed through the DOM.
      for (const f of $('wf').querySelectorAll('.fill')) {
        f.style.left = `${f.dataset.left}%`;
        f.style.width = `${f.dataset.width}%`;
      }
      const lesson = e.step ? course.lessons.find((l) => l.id === e.step.lesson) : null;
      $('attrs').innerHTML = [
        `<p><span class="${okStatus(e) ? 'ok' : 'bad'}">${e.status ? 'HTTP ' + esc(e.status) + ' · ' : ''}${esc(e.outcome)}</span>${e.steps.length ? '' : ' · ' + esc(t().noCalls)}</p>`,
        e.command ? `<p><code>lab ${esc(e.command)}</code></p>` : '',
        `<p>${esc(lesson ? t().step(e.step.lesson, e.step.step, L(lesson.title)) : e.command ? t().notStep : t().noCommand)}</p>`,
      ].join('');
    }
    const k = pieces[card];
    $('card').innerHTML = k
      ? `<div class="card"><h3>${esc(L(N[card][5]))}</h3><dl><dt>${esc(t().what)}</dt><dd>${esc(L(k.what))}</dd><dt>${esc(t().forwhat)}</dt><dd>${esc(L(k.forwhat))}</dd><dt>${esc(t().not)}</dt><dd>${esc(L(k.not))}</dd>${k.free ? `<dt>${esc(t().free)}</dt><dd>${esc(L(k.free))}</dd>` : ''}</dl><div class="tags"><span>${esc(t().lessonTag(k.lesson))}</span><span>${esc(t().local[k.local])}</span></div></div>`
      : '';
  }

  function render() {
    header();
    feed();
    scene();
    side();
  }

  // Redraws only when something changed, so a focused or hovered item stays put between polls.
  async function poll() {
    if (!paused) {
      const before = edge;
      let changed = false;
      try {
        const r = await fetch(`api/events?after=${after}`, { cache: 'no-store' });
        const data = await r.json();
        if (data.boot !== boot) {
          boot = data.boot;
          events = [];
          after = 0;
          changed = true;
          if (data.events.length && data.events[0].seq !== 1) {
            setTimeout(poll, 0);
            return;
          }
        }
        edge = data.edge;
        if (data.events.length) {
          changed = true;
          events.push(...data.events);
          events.sort((a, b) => a.id - b.id);
          if (events.length > 500) events = events.slice(-500);
          after = Math.max(after, ...data.events.map((e) => e.seq));
          const newest = visible().at(-1);
          if (follow && newest) {
            sel = newest.id;
            card = mainPiece(newest);
          }
        }
      } catch {
        edge = false;
      }
      if (changed || edge !== before) render();
    }
    setTimeout(poll, 1000);
  }

  $('follow').onclick = () => {
    follow = !follow;
    const newest = visible().at(-1);
    if (follow && newest) {
      sel = newest.id;
      card = mainPiece(newest);
    }
    render();
  };
  $('pause').onclick = () => {
    paused = !paused;
    render();
  };
  $('lang').onclick = () => {
    lang = lang === 'en' ? 'es' : 'en';
    store.set('cf-visor-lang', lang);
    render();
  };
  $('theme').onclick = () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set('cf-visor-theme', theme);
    render();
  };
  for (const b of document.querySelectorAll('[data-kind]'))
    b.onclick = () => {
      show[b.dataset.kind] = !show[b.dataset.kind];
      render();
    };

  Promise.all([fetch('lessons.json').then((r) => r.json()), fetch('pieces.json').then((r) => r.json())])
    .then(([l, p]) => {
      course = l;
      pieces = p.pieces;
    })
    .catch(() => {})
    .finally(() => {
      render();
      poll();
    });
})();
