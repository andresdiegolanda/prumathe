/* Local illustrative models. They run in the browser and never call the kit or Cloudflare. Numbers
   marked as measured come from the labs of the course; the rest are illustrative and say so. */
window.CFVisuals = (() => {
  const PALETTES = {
    light: {
      ink: '#1d2a3a', green: '#25785f', mint: '#d6efe2', orange: '#d4733c', amber: '#f6dca9',
      purple: '#6b5fb0', blue: '#3f78ad', red: '#b5504a', line: '#bccad6', muted: '#5f6f80',
      white: '#fffef9', panel: '#eef2f5', panelAlt: '#e7ecf0', glass: '#e6eef3', ghost: '#ede0dc', fail: '#f4d6cf',
    },
    dark: {
      ink: '#e3eaf1', green: '#5fc49d', mint: '#1f463b', orange: '#efa06c', amber: '#6b5a2a',
      purple: '#a99ce4', blue: '#82b2de', red: '#e2847c', line: '#3c4e60', muted: '#9fb0c0',
      white: '#16212d', panel: '#1b2836', panelAlt: '#20303f', glass: '#182531', ghost: '#45322f', fail: '#552e2a',
    },
    reading: {
      ink: '#1b2633', green: '#25785f', mint: '#d6efe2', orange: '#c9692f', amber: '#f6dca9',
      purple: '#62559f', blue: '#3a6f9f', red: '#ab4943', line: '#b1bfcb', muted: '#4c5c6c',
      white: '#fffdf6', panel: '#eef1f3', panelAlt: '#e8ecef', glass: '#e7edf1', ghost: '#ede0dc', fail: '#f4d6cf',
    },
    projector: {
      ink: '#0b1724', green: '#156a4c', mint: '#cfe7da', orange: '#bf5a1d', amber: '#f2cf88',
      purple: '#514397', blue: '#2f6292', red: '#a33f39', line: '#8fa2b3', muted: '#2c3c4c',
      white: '#ffffff', panel: '#e5ebf0', panelAlt: '#dfe6ec', glass: '#e2eaf0', ghost: '#efd7d0', fail: '#f2cbc1',
    },
  };
  const palette = (theme) => PALETTES[theme] || PALETTES.light;

  function render(type, step = 0, state = {}, lang = 'en', theme = 'light') {
    const P = palette(theme), t = (en, es) => (lang === 'es' ? es : en);
    const course = window.CF_COURSE;
    const lesson = course.lessons.find((l) => l.visual === type);
    if (!lesson) throw Error('Unknown model ' + type);
    const s = Math.max(0, Math.min(2, step));
    const frameText = lesson.frames[s].text[lang];
    const details = {}, controls = [], parts = [];
    const e = (x) => String(x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const text = (x, y, str, size = 14, color = P.ink, anchor = 'middle', weight = 400) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="${weight}">${e(str)}</text>`;
    const mono = (x, y, str, size = 12, color = P.ink, anchor = 'start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-family="ui-monospace,Consolas,monospace">${e(str)}</text>`;
    const rect = (x, y, w, h, fill = P.panel, stroke = P.line, rx = 10, dash = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
    const box = (x, y, w, h, label, sub = '', key = '', fill = P.white, info = '', stroke = '') => {
      if (key) details[key] = info || frameText;
      return `<g ${key ? `class="selectable" tabindex="0" role="button" data-node="${key}" aria-label="${e(label)}"` : ''}>${rect(x, y, w, h, fill, stroke || (key ? P.green : P.line))}${text(x + w / 2, y + h / 2 + (sub ? -4 : 5), label, 14)}${sub ? text(x + w / 2, y + h / 2 + 15, sub, 11, P.muted) : ''}</g>`;
    };
    const arrow = (x1, y1, x2, y2, color = P.line, dash = '') => {
      const a = Math.atan2(y2 - y1, x2 - x1), h = 8;
      const p1 = `${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)}`, p2 = `${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)}`;
      return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="2"${dash ? ` stroke-dasharray="${dash}"` : ''} fill="none"/><path d="M${x2} ${y2}L${p1}L${p2}Z" fill="${color}"/>`;
    };
    const pill = (x, y, str, color = P.green, w = 0) => {
      const width = w || Math.max(46, str.length * 7 + 16);
      return `${rect(x, y, width, 22, P.white, color, 11)}${mono(x + width / 2, y + 15, str, 11, color, 'middle')}`;
    };
    const title = (en, es) => parts.push(`<text x="40" y="34" font-size="12" letter-spacing="2" fill="${P.muted}">${e(t(en, es))}</text>`);
    const note = (str) => parts.push(text(380, 440, str, 13, P.muted));
    const toggle = (en, es) => {
      controls.push({ kind: 'button', action: 'toggle', label: t(en, es) });
      return Boolean(state.toggle);
    };
    const range = (key, label, min, max, value) => {
      const v = Math.max(min, Math.min(max, Number.isFinite(state[key]) ? state[key] : value));
      controls.push({ kind: 'range', key, label, min, max, value: v });
      return v;
    };
    const lit = (on) => (on ? P.amber : P.white);

    if (type === 'kit') {
      const account = toggle('Account: on / off', 'Cuenta: sí / no');
      title('THE KIT ON YOUR MACHINE', 'EL KIT EN TU MÁQUINA');
      parts.push(rect(30, 52, 470, 360, P.panel, P.line, 14), text(60, 76, t('Docker on your machine', 'Docker en tu máquina'), 13, P.muted, 'start'));
      parts.push(box(50, 100, 130, 64, 'lab', t('requests and prints', 'pide e imprime'), 'lab', s === 1 ? P.amber : P.white, t('The lab command: same image as the edge, run with docker compose run --rm lab.', 'El comando lab: la misma imagen que el borde, con docker compose run --rm lab.')));
      parts.push(box(210, 100, 140, 64, 'edge', 'wrangler dev', 'edge', s !== 1 ? P.amber : P.white, t('The Worker of Rumbo on workerd, with every binding simulated. The only service published: 127.0.0.1:18097, and its live viewer on 127.0.0.1:18098.', 'El Worker de Rumbo en workerd, con todos los bindings simulados. El único servicio publicado: 127.0.0.1:18097, y su visor en vivo en 127.0.0.1:18098.')));
      parts.push(box(380, 100, 100, 64, 'origin', 'Spring Boot', 'origin', s === 1 ? P.amber : P.white, t('The API of Rumbo on Java 25. No port on the host.', 'La API de Rumbo sobre Java 25. Sin puerto en el host.')));
      parts.push(box(380, 196, 100, 64, 'db', 'PostgreSQL 18', 'db', P.white, t('Shipments and movements. Hyperdrive reaches it too.', 'Envíos y movimientos. Hyperdrive también llega.')));
      parts.push(arrow(180, 132, 208, 132, P.green), arrow(350, 132, 378, 132, P.green), arrow(430, 164, 430, 194, P.line));
      parts.push(rect(210, 196, 140, 100, P.white, P.line, 10, '4 4'), text(280, 220, t('bindings', 'bindings'), 13, P.muted));
      ['KV  D1  R2', 'DO  Queue', 'Workflow  Hyperdrive'].forEach((x, i) => parts.push(mono(280, 244 + i * 18, x, 11, P.ink, 'middle')));
      parts.push(box(50, 196, 130, 48, 'tunnel', t('profile tunnel', 'perfil tunnel'), 'tunnel', P.white, t('cloudflared, only in lesson 04.', 'cloudflared, solo en la lección 04.')));
      parts.push(box(50, 256, 130, 48, 'impostor', t('profile tls', 'perfil tls'), 'impostor', P.white, t('A self-signed server, only in lesson 03.', 'Un servidor autofirmado, solo en la lección 03.')));
      parts.push(pill(210, 312, '127.0.0.1:18097', P.green, 140), text(360, 327, 'Worker', 11, P.muted, 'start'), pill(210, 342, '127.0.0.1:18098', P.green, 140), text(360, 357, t('viewer', 'visor'), 11, P.muted, 'start'), text(280, 386, t('the only published ports', 'los únicos puertos publicados'), 12, s === 2 ? P.orange : P.muted));
      parts.push(rect(530, 52, 200, 360, account ? P.mint : P.panelAlt, account ? P.green : P.line, 14, account ? '' : '6 5'));
      parts.push(text(630, 80, t('Your Cloudflare account', 'Tu cuenta de Cloudflare'), 13, P.muted));
      parts.push(box(550, 100, 160, 64, 'rumbo-edge-demo', 'workers.dev', 'demo', account ? P.white : P.panelAlt, t('The Worker of edge/deploy: optional, lessons 09 and 10.', 'El Worker de edge/deploy: opcional, lecciones 09 y 10.')));
      parts.push(text(630, 200, account ? t('steps marked account run', 'corren los pasos de cuenta') : t('account steps are skipped', 'los pasos de cuenta se saltean'), 12, account ? P.green : P.muted));
      [['local', t('in the kit, no account', 'en el kit, sin cuenta'), P.green], ['account', t('optional, labs/.env', 'opcional, labs/.env'), P.blue], ['zone', t('case study', 'caso de estudio'), P.orange]].forEach(([k, d, c], i) => parts.push(pill(590, 232 + i * 56, k, c, 80), text(630, 270 + i * 56, d, 11, P.muted)));
      note(s === 0 ? t('Three kinds of evidence; every lab step says which.', 'Tres clases de evidencia; cada paso dice cuál.') : s === 1 ? t('Rumbo: one Worker in front of one Spring API.', 'Rumbo: un Worker delante de una API de Spring.') : t('Measured: about 800 MB for edge, origin and database.', 'Medido: unos 800 MB entre borde, origen y base.'));
    } else if (type === 'anycast') {
      const where = range('value', t('Client', 'Cliente'), 0, 3, 0);
      title('ONE ADDRESS, MANY DATA CENTERS', 'UNA DIRECCIÓN, MUCHOS DATA CENTERS');
      const dcs = [['LHR', 150, 110], ['ORD', 600, 110], ['GRU', 600, 300], ['NRT', 150, 300]];
      const clients = [[t('London', 'Londres'), 0], ['Chicago', 1], ['São Paulo', 2], [t('Tokyo', 'Tokio'), 3]];
      if (s < 2) {
        dcs.forEach(([c, x, y], i) => parts.push(box(x - 70, y - 30, 140, 60, c, '104.16.123.96', 'dc' + c, i === clients[where][1] ? P.amber : P.white, t(`Data center ${c}: it announces the same address as every other one.`, `Data center ${c}: anuncia la misma dirección que todos los demás.`))));
        parts.push(box(305, 175, 150, 64, clients[where][0], t('client', 'cliente'), 'client', P.mint, t('Routing takes it to one data center, usually nearby; the networks in between decide.', 'El ruteo lo lleva a un data center, en general cercano; deciden las redes del medio.')));
        const [, dx, dy] = dcs[clients[where][1]];
        parts.push(arrow(380, 175 + (dy > 200 ? 64 : 0), dx + (dx < 380 ? 70 : -70), dy, P.orange));
        if (s === 1) parts.push(pill(300, 270, `colo=${dcs[clients[where][1]][0]}`, P.orange, 160), text(380, 318, t('cf-ray: …-' + dcs[clients[where][1]][0] + ' in the validation run', 'cf-ray: …-' + dcs[clients[where][1]][0] + ' en la corrida de validación'), 12, P.muted));
      } else {
        parts.push(box(80, 140, 200, 80, t('your machine', 'tu máquina'), 'wrangler dev · workerd', 'local', P.amber, t('One place: no anycast, no other data centers.', 'Un lugar: sin anycast, sin otros data centers.')));
        parts.push(box(480, 140, 200, 80, 'Cloudflare', t('once, at start', 'una vez, al arrancar'), 'cfobj', P.white, t('wrangler fetches one real request.cf object when it starts.', 'wrangler trae un objeto request.cf real cuando arranca.')));
        parts.push(arrow(480, 180, 282, 180, P.blue, '5 4'), text(380, 168, 'request.cf', 12, P.blue));
        parts.push(text(380, 290, t('Same code as the edge; not the network of the edge.', 'El mismo código que el borde; no la red del borde.'), 14, P.ink));
      }
      note(t('Illustrative: routing usually, not always, picks the nearest.', 'Ilustrativo: el ruteo suele elegir el más cercano, no siempre.'));
    } else if (type === 'dns') {
      const proxied = !toggle('Proxied / DNS only', 'Con proxy / solo DNS');
      title('THE SAME RECORD, TWO PATHS', 'EL MISMO REGISTRO, DOS CAMINOS');
      parts.push(box(40, 80, 140, 64, t('browser', 'navegador'), 'api.rumbo.example', 'client', P.mint, t('Asks DNS for the address of the name.', 'Le pregunta al DNS la dirección del nombre.')));
      parts.push(box(300, 80, 170, 64, 'Cloudflare DNS', proxied ? t('proxied', 'con proxy') : t('DNS only', 'solo DNS'), 'dns', P.amber, proxied ? t('Answers with Cloudflare anycast addresses; TTL fixed at 300 s.', 'Responde con direcciones anycast de Cloudflare; TTL fijo de 300 s.') : t('Answers with the real address of the record.', 'Responde con la dirección real del registro.')));
      parts.push(arrow(180, 112, 298, 112, P.line), mono(240, 104, 'A?', 11, P.muted, 'middle'));
      parts.push(pill(300, 160, proxied ? '104.16.123.96' : '203.0.113.10', proxied ? P.green : P.red, 170));
      parts.push(box(300, 230, 170, 64, t('edge', 'borde'), 'cache · WAF · Worker', 'edge', proxied ? P.white : P.panelAlt, t('Only proxied requests meet the edge.', 'Solo los pedidos con proxy se encuentran con el borde.')));
      parts.push(box(570, 230, 150, 64, t('origin', 'origen'), '203.0.113.10', 'origin', P.white, t('Your server.', 'Tu servidor.')));
      if (proxied) parts.push(arrow(110, 144, 300, 262, P.orange), arrow(470, 262, 568, 262, P.orange));
      else parts.push(`<path d="M110 144C200 380 480 380 600 296" stroke="${P.red}" stroke-width="2.5" fill="none"/>`, text(380, 360, t('straight to the server: no edge on the way', 'directo al servidor: sin borde en el camino'), 12, P.red));
      if (s === 2) parts.push(box(40, 330, 150, 56, t('someone else', 'alguien más'), t('knows 203.0.113.10', 'conoce 203.0.113.10'), 'leak', P.fail, t('An old record or a mail server can leak the address; this path skips the edge.', 'Un registro viejo o un servidor de mail pueden filtrar la dirección; este camino se saltea el borde.')), arrow(190, 358, 600, 296, P.red, '6 4'));
      note(s === 0 ? t('Only A, AAAA and CNAME can be proxied.', 'Solo A, AAAA y CNAME pueden ir con proxy.') : s === 1 ? t('DNS only: no cache, no WAF, no Workers on the way.', 'Solo DNS: sin cache, sin WAF, sin Workers en el camino.') : t('Hiding the address is not closing the door.', 'Esconder la dirección no es cerrar la puerta.'));
    } else if (type === 'tls') {
      const MODES = ['Off', 'Flexible', 'Full', 'Full (strict)'];
      const m = range('value', t('Mode', 'Modo'), 0, 3, 1);
      title('TWO LEGS, ONE SETTING', 'DOS TRAMOS, UN AJUSTE');
      parts.push(box(30, 150, 130, 70, t('visitor', 'visitante'), m === 0 ? 'HTTP' : 'HTTPS', 'visitor', P.mint, t('Leg 1 ends at the edge, with its certificate.', 'El tramo 1 termina en el borde, con su certificado.')));
      parts.push(box(300, 150, 150, 70, t('edge', 'borde'), MODES[m], 'edge', P.amber, t('The encryption mode of the zone decides leg 2.', 'El modo de cifrado de la zona decide el tramo 2.')));
      parts.push(arrow(160, 185, 298, 185, m === 0 ? P.red : P.green), text(229, 172, t('leg 1', 'tramo 1'), 12, P.muted));
      const leg2 = m <= 1 ? P.red : m === 2 ? P.orange : P.green;
      parts.push(box(580, 90, 150, 64, t('origin', 'origen'), t('signed by the CA', 'firmado por la CA'), 'origin', P.white, t('Certificate of the kit CA: a stand-in for a public CA or Origin CA.', 'Certificado de la CA del kit: hace de una CA pública o de Origin CA.')));
      parts.push(box(580, 220, 150, 64, t('impostor', 'impostor'), t('self-signed', 'autofirmado'), 'impostor', P.fail, t('Same name, nobody trusted signed it.', 'El mismo nombre, no lo firmó nadie confiable.')));
      parts.push(arrow(450, 175, 578, 122, leg2), text(515, 128, m <= 1 ? 'HTTP' : 'HTTPS', 12, leg2));
      const impostorOk = m === 2 || m <= 1;
      parts.push(arrow(450, 200, 578, 252, impostorOk ? P.red : P.line, impostorOk ? '' : '4 4'), text(515, 262, impostorOk ? t('accepted', 'aceptado') : t('rejected', 'rechazado'), 12, impostorOk ? P.red : P.green));
      parts.push(text(380, 340, [t('Nothing is encrypted.', 'No se cifra nada.'), t('Leg 2 travels in plain HTTP.', 'El tramo 2 viaja en HTTP plano.'), t('Encrypted, but any certificate will do.', 'Cifrado, pero cualquier certificado sirve.'), t('Encrypted and the certificate is checked.', 'Cifrado y con el certificado verificado.')][m], 15, leg2));
      note(t('Strict, the fifth mode, always uses HTTPS with validation to the origin.', 'Strict, el quinto modo, usa siempre HTTPS con validación hacia el origen.'));
    } else if (type === 'tunnel') {
      const open = toggle('Public port: closed / open', 'Puerto público: cerrado / abierto');
      title('OUTBOUND ONLY', 'SOLO SALIENTE');
      parts.push(box(40, 70, 140, 60, t('visitor', 'visitante'), 'rumbo.example', 'visitor', P.mint, t('Reaches the edge, never the origin.', 'Llega al borde, nunca al origen.')));
      parts.push(box(280, 60, 120, 54, 'LHR', t('data center', 'data center'), 'dc1', P.white, t('Two of the four connections of a named tunnel.', 'Dos de las cuatro conexiones de un túnel con nombre.')));
      parts.push(box(280, 140, 120, 54, 'AMS', t('data center', 'data center'), 'dc2', P.white, t('The other two: two data centers for redundancy.', 'Las otras dos: dos data centers por redundancia.')));
      parts.push(arrow(180, 100, 278, 88, P.orange));
      parts.push(rect(470, 50, 270, 300, P.panelAlt, P.line, 14), text(605, 72, t('your private network', 'tu red privada'), 12, P.muted));
      parts.push(box(490, 90, 120, 60, 'cloudflared', t('dials out', 'llama hacia afuera'), 'cfd', s === 0 ? P.amber : P.white, t('Opens the connections; nothing listens for them.', 'Abre las conexiones; nada las espera escuchando.')));
      parts.push(box(600, 210, 120, 60, t('origin', 'origen'), 'origin:8080', 'origin', P.white, t('Listens only on the private network.', 'Escucha solo en la red privada.')));
      parts.push(arrow(490, 110, 402, 90, P.blue), arrow(490, 130, 402, 165, P.blue), text(445, 205, t('outbound', 'salientes'), 11, P.blue));
      parts.push(arrow(550, 150, 620, 208, P.green));
      if (s === 1) parts.push(pill(40, 170, 'xxx.trycloudflare.com', P.orange, 190), text(135, 210, t('quick tunnel: random name, no account', 'túnel rápido: nombre al azar, sin cuenta'), 11, P.muted));
      if (open) parts.push(box(40, 300, 150, 56, t('someone else', 'alguien más'), t('found the IP', 'encontró la IP'), 'attacker', P.fail, t('An open public port skips the edge, its cache, WAF and Access.', 'Un puerto público abierto se saltea el borde, su cache, el WAF y Access.')), arrow(190, 328, 598, 250, P.red), pill(600, 290, ':8080 public', P.red, 120));
      note(open ? t('The tunnel added a way in; the open port is still another.', 'El túnel agregó una entrada; el puerto abierto sigue siendo otra.') : t('No inbound port: the firewall stays closed.', 'Sin puerto de entrada: el firewall queda cerrado.'));
    } else if (type === 'isolate') {
      const n = range('value', t('Requests', 'Pedidos'), 1, 6, 4);
      const evicted = toggle('Evict isolate B', 'Desalojar el isolate B');
      title('MANY ISOLATES, ONE PROCESS', 'MUCHOS ISOLATES, UN PROCESO');
      parts.push(rect(250, 60, 470, 300, P.panel, P.line, 14), text(485, 84, t('one runtime process', 'un proceso del runtime'), 12, P.muted));
      const hits = [0, 0, 0];
      for (let i = 0; i < n; i++) hits[i % 3]++;
      ['A', 'B', 'C'].forEach((k, i) => {
        const off = evicted && i === 1;
        parts.push(box(275 + i * 150, 110, 130, 90, `isolate ${k}${off ? t(' (new)', ' (nuevo)') : ''}`, `hits = ${off ? 1 : hits[i]}`, 'iso' + k, off ? P.amber : P.white, t('A global variable counts only the requests of this isolate, while it lives.', 'Una variable global cuenta solo los pedidos de este isolate, mientras vive.')));
      });
      parts.push(text(485, 240, t('tenants of other accounts share the process', 'inquilinos de otras cuentas comparten el proceso'), 12, P.muted));
      for (let i = 0; i < 8; i++) parts.push(`<circle cx="${300 + i * 55}" cy="280" r="12" fill="${P.panelAlt}" stroke="${P.line}"/>`);
      parts.push(box(40, 140, 160, 60, t('requests', 'pedidos'), `${n}`, 'req', P.mint, t('Requests are spread over isolates; nothing promises the same one twice.', 'Los pedidos se reparten entre isolates; nada promete el mismo dos veces.')), arrow(200, 170, 270, 155, P.orange));
      if (s === 2) parts.push(pill(40, 230, t('CPU 10 ms free', 'CPU 10 ms gratis'), P.orange, 160), pill(40, 262, '128 MB', P.orange, 160));
      note(t('Locally there is one isolate, so a global seems to work.', 'En local hay un solo isolate, así que una global parece funcionar.'));
    } else if (type === 'config') {
      const inVars = toggle('Secret in vars / in .dev.vars', 'Secreto en vars / en .dev.vars');
      title('ONE FILE, EVERY CAPABILITY', 'UN ARCHIVO, CADA CAPACIDAD');
      parts.push(rect(40, 60, 300, 330, P.white, P.green, 12));
      const lines = ['"name": "rumbo-edge"', '"main": "src/index.ts"', '"compatibility_date":', '   "2026-11-01"', '"vars": { "ORIGIN": … }', '"kv_namespaces": FLAGS', '"d1_databases": DB', '"queues": MOVES', '"durable_objects": …'];
      lines.forEach((x, i) => parts.push(mono(60, 92 + i * 30, x, 12, i >= 5 && s === 0 ? P.green : i >= 2 && i <= 3 && s === 2 ? P.orange : P.ink)));
      if (inVars) parts.push(mono(60, 362, '"RUMBO_TOKEN": "local-only-value"', 11, P.red));
      details.file = t('wrangler.jsonc: committed with the code.', 'wrangler.jsonc: se versiona con el código.');
      parts.push(`<g class="selectable" tabindex="0" role="button" data-node="file" aria-label="wrangler.jsonc">${rect(40, 60, 300, 26, 'none', 'none')}</g>`);
      parts.push(box(420, 70, 140, 50, 'env.FLAGS', 'KVNamespace', 'kv', P.white, t('A binding: a name in env pointing to one KV namespace.', 'Un binding: un nombre en env que apunta a un namespace de KV.')));
      parts.push(box(420, 140, 140, 50, 'env.DB', 'D1Database', 'd1', P.white, t('Locally the id only names a local store.', 'En local el id solo nombra un almacén local.')));
      parts.push(box(420, 210, 140, 50, 'env.MOVES', 'Queue', 'q', P.white, t('Generated by wrangler types.', 'Generado por wrangler types.')));
      [95, 165, 235].forEach((y) => parts.push(arrow(340, 250, 418, y, P.line)));
      parts.push(box(600, 70, 130, 70, t('repository', 'repositorio'), inVars ? t('the secret is here', 'el secreto está acá') : t('no secret', 'sin secreto'), 'repo', inVars ? P.fail : P.mint, t('Everything in wrangler.jsonc ends up here.', 'Todo lo de wrangler.jsonc termina acá.')));
      parts.push(box(600, 290, 130, 70, '.dev.vars', inVars ? t('empty', 'vacío') : 'RUMBO_TOKEN', 'devvars', inVars ? P.white : P.amber, t('Local secrets, read when wrangler dev starts, never committed.', 'Secretos locales, que se leen cuando arranca wrangler dev, nunca versionados.')));
      parts.push(arrow(340, 105, 598, 105, inVars ? P.red : P.line));
      note(inVars ? t('In vars, the token travels with every commit.', 'En vars, el token viaja con cada commit.') : t('The Worker sees the secret; the repository does not.', 'El Worker ve el secreto; el repositorio no.'));
    } else if (type === 'gateway') {
      const R = [['GET /api/shipments/R-1043', 200], ['OPTIONS shop.example', 204], ['OPTIONS other.example', 204], ['GET /api/admin/users', 403]];
      const r = range('value', t('Request', 'Pedido'), 0, 3, 0);
      title('THE WORKER DECIDES FIRST', 'EL WORKER DECIDE PRIMERO');
      parts.push(box(30, 180, 170, 64, t('request', 'pedido'), R[r][0], 'req', P.mint, t('Every request reaches the fetch handler first.', 'Todo pedido llega primero al handler fetch.')));
      const steps = [['OPTIONS?', 'preflight', r === 1 || r === 2], ['/api/admin?', '403', r === 3], [t('limit + flag', 'límite + flag'), 'LIMITER · FLAGS', r === 0], ['fetch', 'origin:8080', r === 0]];
      steps.forEach(([a, b, on], i) => parts.push(box(240 + i * 125, 80 + (i % 2) * 0, 110, 60, a, b, 'g' + i, on ? P.amber : P.white, [t('A CORS preflight is answered at the edge, only for the allowed shop.', 'Un preflight de CORS se responde en el borde, solo para la tienda permitida.'), t('The admin API never reaches the origin.', 'La API de administración nunca llega al origen.'), t('One budget per API key, and the maintenance flag in KV.', 'Un presupuesto por API key, y la flag de mantenimiento en KV.'), t('Forwarded with x-rumbo-request-id and x-rumbo-edge.', 'Reenviado con x-rumbo-request-id y x-rumbo-edge.')][i])));
      for (let i = 0; i < 3; i++) parts.push(arrow(350 + i * 125, 110, 363 + i * 125, 110, P.line));
      parts.push(arrow(200, 212, 238, 120, P.orange));
      const result = [t('200 from the origin, x-rumbo-via: edge', '200 del origen, x-rumbo-via: edge'), t('204 with access-control-allow-origin', '204 con access-control-allow-origin'), t('204 without access-control headers', '204 sin encabezados access-control'), t('403 blocked at the edge', '403 bloqueado en el borde')][r];
      parts.push(box(300, 250, 360, 64, `HTTP ${R[r][1]}`, result, 'res', r === 3 ? P.fail : P.white, t('What the client receives.', 'Lo que recibe el cliente.')));
      if (r === 0 || s === 2) parts.push(box(300, 340, 360, 50, 'ctx.waitUntil', t('KV put last-request, after the answer', 'KV put last-request, después de la respuesta'), 'wait', s === 2 ? P.amber : P.white, t('Up to 30 seconds after the response.', 'Hasta 30 segundos después de la respuesta.')));
      note(r === 0 ? t('Only this one reaches Spring Boot.', 'Solo este llega a Spring Boot.') : t('The origin never sees this request.', 'El origen nunca ve este pedido.'));
    } else if (type === 'tests') {
      const down = toggle('Fake origin: up / down', 'Origen falso: arriba / caído');
      title('TESTS INSIDE WORKERD', 'PRUEBAS DENTRO DE WORKERD');
      parts.push(rect(40, 60, 420, 330, P.panel, P.line, 14), text(250, 84, 'workerd · @cloudflare/vitest-plugin', 12, P.muted));
      const names = [t('answers /health', 'responde /health'), t('blocks the admin API', 'bloquea la API de administración'), t('CORS for the shop only', 'CORS solo para la tienda'), t('503 in maintenance', '503 en mantenimiento'), t('forwards and marks', 'reenvía y marca'), t('502 if the origin is dead', '502 si el origen está caído')];
      names.forEach((x, i) => {
        const fails = (down && i === 4) || (!down && i === 5);
        parts.push(`${rect(60, 100 + i * 46, 380, 36, fails ? P.fail : P.mint, fails ? P.red : P.green, 8)}${text(80, 123 + i * 46, (fails ? '✗ ' : '✓ ') + x, 13, P.ink, 'start')}`);
      });
      details.suite = t('Each test calls exports.default.fetch, as a request would.', 'Cada prueba llama a exports.default.fetch, como lo haría un pedido.');
      parts.push(`<g class="selectable" tabindex="0" role="button" data-node="suite" aria-label="tests">${rect(60, 100, 380, 36, 'none', 'none')}</g>`);
      parts.push(box(520, 90, 200, 64, 'vi.spyOn(fetch)', down ? 'mockRejectedValue' : 'mockImplementation', 'fake', P.amber, t('The fake answer is built inside the request.', 'La respuesta falsa se arma dentro del pedido.')));
      parts.push(box(520, 200, 200, 64, 'env.FLAGS', t('shared by the file', 'compartido por el archivo'), 'env', s === 1 ? P.amber : P.white, t('A test that writes cleans up after itself.', 'Una prueba que escribe limpia después.')));
      parts.push(arrow(460, 300, 518, 125, P.orange), arrow(460, 260, 518, 232, P.line));
      note(t('Illustrative: with the fake origin swapped, a different test fails.', 'Ilustrativo: al cambiar el origen falso, falla otra prueba.'));
    } else if (type === 'versions') {
      const pct = range('value', t('Traffic to v2 (%)', 'Tráfico a v2 (%)'), 0, 100, 10);
      title('A VERSION IS UPLOADED; A DEPLOYMENT DECIDES', 'UNA VERSIÓN SE SUBE; UN DESPLIEGUE DECIDE');
      parts.push(box(40, 80, 160, 64, 'v1', `${100 - pct}%`, 'v1', P.white, t('Uploaded and deployed with wrangler deploy --tag v1.', 'Subida y desplegada con wrangler deploy --tag v1.')));
      parts.push(box(40, 200, 160, 64, 'v2', `${pct}%`, 'v2', pct ? P.amber : P.panelAlt, t('Uploaded with versions upload; serves only after versions deploy.', 'Subida con versions upload; atiende solo después de versions deploy.')));
      parts.push(box(260, 140, 160, 64, t('deployment', 'despliegue'), `v1@${100 - pct}% v2@${pct}%`, 'dep', P.mint, t('Each request is routed on its own, unless version affinity.', 'Cada pedido se rutea por su cuenta, salvo version affinity.')));
      parts.push(arrow(200, 112, 258, 160, P.line), arrow(200, 232, 258, 188, P.line));
      // A fixed sample of 20 requests: request i goes to v2 when its position in a fixed shuffle is below the share.
      const ORDER = [7, 15, 2, 11, 18, 4, 13, 0, 9, 16, 6, 19, 1, 12, 5, 17, 3, 10, 14, 8];
      ORDER.forEach((o, i) => parts.push(`<circle cx="${470 + (i % 5) * 50}" cy="${100 + Math.floor(i / 5) * 56}" r="16" fill="${o < Math.round(pct / 5) ? P.orange : P.green}"/>${text(470 + (i % 5) * 50, 105 + Math.floor(i / 5) * 56, o < Math.round(pct / 5) ? 'v2' : 'v1', 11, P.white)}`));
      parts.push(text(570, 345, t('20 requests, an illustrative draw', '20 pedidos, un sorteo ilustrativo'), 12, P.muted));
      if (s === 2) parts.push(pill(40, 300, 'wrangler deploy --dry-run', P.green, 220));
      note(t('Moving traffic back is another versions deploy.', 'Volver el tráfico atrás es otro versions deploy.'));
    } else if (type === 'cachedefault') {
      const K = [['public, max-age=60', 'MISS', 'HIT'], ['private, max-age=60', 'BYPASS', 'BYPASS'], ['public + Set-Cookie', 'BYPASS', 'BYPASS'], [t('no Cache-Control', 'sin Cache-Control'), 'MISS', 'HIT']];
      const k = range('value', t('Response', 'Respuesta'), 0, 3, 0);
      title('WHAT THE EDGE KEEPS', 'QUÉ GUARDA EL BORDE');
      if (s === 0) {
        parts.push(box(40, 70, 320, 64, t('zone cache', 'cache de la zona'), t('by extension, not MIME type', 'por extensión, no por tipo MIME'), 'zone', P.amber, t('HTML and JSON are not cached by default.', 'HTML y JSON no se guardan por defecto.')));
        ['.css .js .png .pdf', '.html  .json'].forEach((x, i) => parts.push(pill(40, 160 + i * 40, x, i ? P.red : P.green, 220), text(280, 176 + i * 40, i ? t('not by default', 'no por defecto') : t('kept', 'se guarda'), 12, i ? P.red : P.green, 'start')));
        parts.push(text(200, 300, t('no cache: private, no-store, no-cache, max-age=0,', 'no se guarda: private, no-store, no-cache, max-age=0,'), 12, P.muted), text(200, 320, t('Set-Cookie, or a method other than GET', 'Set-Cookie, o un método que no sea GET'), 12, P.muted));
      }
      parts.push(box(420, 70, 300, 64, 'Workers Cache', t('in front of the Worker', 'delante del Worker'), 'wc', s ? P.amber : P.white, t('A hit does not run the Worker: no CPU.', 'Un acierto no ejecuta el Worker: sin CPU.')));
      parts.push(box(420, 170, 300, 50, 'Cache-Control', K[k][0], 'cc', P.white, t('What the response of the Worker says.', 'Lo que dice la respuesta del Worker.')));
      parts.push(pill(440, 250, `1: ${K[k][1]}`, K[k][1] === 'MISS' ? P.orange : P.red, 120), pill(580, 250, `2: ${K[k][2]}`, K[k][2] === 'HIT' ? P.green : P.red, 120));
      parts.push(text(570, 310, k === 3 ? t('kept 7,200 s by heuristic', 'guardada 7.200 s por heurística') : k === 0 ? t('the second request does not run the Worker', 'el segundo pedido no ejecuta el Worker') : t('the Worker runs every time', 'el Worker corre cada vez'), 12, P.muted));
      if (s === 2) parts.push(text(570, 350, t('the kit cannot show this: account steps', 'el kit no lo puede mostrar: pasos de cuenta'), 12, P.orange));
      note(t('From the documentation of Workers Cache; measured on an account only.', 'Según la documentación de Workers Cache; se mide solo en una cuenta.'));
    } else if (type === 'cachekey') {
      const fixed = toggle('Profile: public / private', 'Perfil: public / private');
      title('THE KEY IS THE URL', 'LA CLAVE ES LA URL');
      parts.push(box(40, 80, 140, 60, 'Ana', 'x-user: ana', 'ana', P.mint, t('First request: the Worker builds her profile.', 'Primer pedido: el Worker arma su perfil.')));
      parts.push(box(40, 260, 140, 60, 'Beto', 'x-user: beto', 'beto', P.mint, t('Same URL a moment later.', 'La misma URL un momento después.')));
      parts.push(box(290, 160, 200, 80, t('cache key', 'clave de cache'), '/lab/cache/profile', 'key', P.amber, t('Scheme, host, path and query string: no user.', 'Esquema, host, ruta y query string: sin usuario.')));
      parts.push(arrow(180, 110, 288, 185, P.green), arrow(180, 290, 288, 215, P.orange));
      if (!fixed) {
        parts.push(box(560, 160, 170, 80, t('stored entry', 'entrada guardada'), t("Ana's profile", 'el perfil de Ana'), 'entry', P.fail, t('public, max-age=300: any shared cache may keep it.', 'public, max-age=300: cualquier cache compartida la puede guardar.')));
        parts.push(arrow(490, 200, 558, 200, P.red), text(380, 360, t('Beto receives Ana: x-rumbo-from: cache', 'Beto recibe a Ana: x-rumbo-from: cache'), 15, P.red));
      } else {
        parts.push(box(560, 160, 170, 80, t('nothing stored', 'nada guardado'), 'private, no-store', 'entry', P.mint, t('Each person gets their own answer from the Worker.', 'Cada persona recibe su propia respuesta del Worker.')));
        parts.push(text(380, 360, t('Beto receives Beto: x-rumbo-from: worker', 'Beto recibe a Beto: x-rumbo-from: worker'), 15, P.green));
      }
      if (s === 2) parts.push(pill(560, 270, t('purge: URL, tag, prefix…', 'purga: URL, tag, prefijo…'), P.blue, 170));
      note(t('Fix the header; purging only removes the past.', 'Arreglá el encabezado; purgar solo saca el pasado.'));
    } else if (type === 'cacheapi') {
      const purged = toggle('cache.delete in MAD', 'cache.delete en MAD');
      const from = range('value', t('Request from', 'Pedido desde'), 0, 1, 0);
      title('ONE DATA CENTER AT A TIME', 'DE A UN DATA CENTER POR VEZ');
      [['MAD', 120], ['DUB', 480]].forEach(([dc, x], i) => {
        const has = i === 0 ? !purged : true;
        parts.push(rect(x - 80, 70, 260, 240, P.panel, P.line, 14), text(x + 50, 94, dc, 14, P.muted));
        parts.push(box(x - 60, 110, 220, 60, 'caches.default', has ? t('rate of DUB, 60 s', 'tarifa de DUB, 60 s') : t('empty', 'vacía'), 'c' + dc, has ? P.amber : P.white, t(`The Cache API of ${dc}: not replicated anywhere.`, `La Cache API de ${dc}: no se replica a ningún lado.`)));
        parts.push(text(x + 50, 210, i === from ? (has ? 'match → HIT' : 'match → MISS') : '', 13, has ? P.green : P.orange));
      });
      parts.push(text(380, 350, purged ? t('The purge emptied MAD only; DUB still answers from its copy.', 'La purga vació solo MAD; DUB sigue respondiendo con su copia.') : t('Each data center stored its own copy when it computed the rate.', 'Cada data center guardó su copia cuando calculó la tarifa.'), 13, purged ? P.orange : P.muted));
      if (s === 1) parts.push(text(380, 380, t('Independent of Workers Cache and of the fetch cache.', 'Independiente de Workers Cache y de la cache del fetch.'), 12, P.muted));
      note(t('Illustrative: locally there is one data center.', 'Ilustrativo: en local hay un solo data center.'));
    } else if (type === 'waf') {
      const upper = toggle('Path: /api/admin / /API/admin', 'Ruta: /api/admin / /API/admin');
      title('SECURITY PHASES IN A FIXED ORDER', 'FASES DE SEGURIDAD EN ORDEN FIJO');
      const phases = ['DDoS', t('custom rules', 'reglas propias'), 'rate limiting', t('managed', 'administradas'), 'SBFM', 'Worker', t('origin', 'origen')];
      phases.forEach((p, i) => {
        const blocked = !upper && i === 1;
        const reached = upper || i <= 1;
        parts.push(box(30 + i * 104, 160, 94, 64, p, blocked ? 'Block' : reached ? t('passes', 'pasa') : '', 'p' + i, blocked ? P.fail : i === 1 && s === 0 ? P.amber : reached ? P.white : P.panelAlt, [t('HTTP DDoS protection, first.', 'Protección DDoS HTTP, primero.'), t('Your expressions: 5 rules on the free plan.', 'Tus expresiones: 5 reglas en el plan gratuito.'), t('Rate limiting rules: one on the free plan.', 'Reglas de rate limiting: una en el plan gratuito.'), t('The Free Managed Ruleset on the free plan.', 'El Free Managed Ruleset en el plan gratuito.'), 'Super Bot Fight Mode.', t('Runs only if no phase ended the request.', 'Corre solo si ninguna fase cortó el pedido.'), t('Your server.', 'Tu servidor.')][i]));
        if (i < 6) parts.push(arrow(124 + i * 104, 192, 132 + i * 104, 192, reached && !(blocked) ? P.line : P.panelAlt));
      });
      parts.push(mono(40, 280, 'starts_with(http.request.uri.path, "/api/admin")', 13, P.ink));
      parts.push(mono(40, 310, upper ? 'GET /API/admin/users  → ' + t('no match', 'no coincide') : 'GET /api/admin/users  → Block', 13, upper ? P.red : P.green));
      if (s >= 1) parts.push(mono(40, 350, 'starts_with(lower(http.request.uri.path), "/api/admin")', 13, P.green));
      note(upper ? t('Text comparison: the case changed, the rule missed.', 'Comparación de texto: cambiaron las mayúsculas, la regla no coincidió.') : t('A block ends the request: later phases never see it.', 'Un bloqueo corta el pedido: las fases siguientes no lo ven.'));
    } else if (type === 'ratelimit') {
      const n = range('value', t('Burst of k1', 'Ráfaga de k1'), 1, 9, 7);
      const k2 = toggle('Also send k2', 'Mandar también k2');
      title('A BUDGET PER KEY, PER WINDOW', 'UN PRESUPUESTO POR CLAVE, POR VENTANA');
      parts.push(rect(40, 70, 680, 40, P.panel, P.line, 8), text(380, 96, t('one window of 10 seconds · limit 5', 'una ventana de 10 segundos · límite 5'), 13, P.muted));
      for (let i = 0; i < n; i++) {
        const ok = i < 5;
        parts.push(`<rect x="${50 + i * 74}" y="150" width="62" height="44" rx="8" fill="${ok ? P.mint : P.fail}" stroke="${ok ? P.green : P.red}"/>${text(81 + i * 74, 177, ok ? '200' : '429', 14)}`);
      }
      details.k1 = t('k1: five allowed, then 429 with retry-after: 10. A refused call does not add to the count.', 'k1: cinco permitidos, después 429 con retry-after: 10. Una llamada rechazada no suma.');
      parts.push(`<g class="selectable" tabindex="0" role="button" data-node="k1" aria-label="k1">${text(40, 140, 'x-api-key: k1', 12, P.muted, 'start')}${rect(40, 125, 120, 22, 'none', 'none')}</g>`);
      if (k2) {
        for (let i = 0; i < 3; i++) parts.push(`<rect x="${50 + i * 74}" y="250" width="62" height="44" rx="8" fill="${P.mint}" stroke="${P.green}"/>${text(81 + i * 74, 277, '200', 14)}`);
        parts.push(text(40, 240, 'x-api-key: k2', 12, P.muted, 'start'));
      }
      if (s === 1) parts.push(text(380, 350, t('Per location and approximate: counts agree eventually.', 'Por lugar y aproximado: las cuentas se ponen de acuerdo con el tiempo.'), 13, P.orange));
      if (s === 2) parts.push(text(380, 350, t('Zone rule: before any Worker. Binding: inside your code.', 'Regla de zona: antes de cualquier Worker. Binding: dentro de tu código.'), 13, P.blue));
      note(t('Measured locally: 200 200 200 200 200 429 429.', 'Medido en local: 200 200 200 200 200 429 429.'));
    } else if (type === 'access') {
      const CASES = [[t('valid token', 'token válido'), -1], [t('other audience', 'otra audiencia'), 1], [t('expired', 'vencido'), 3], [t('changed after signing', 'cambiado después de firmar'), 0], [t('no token, straight to the origin', 'sin token, directo al origen'), 4]];
      const c = range('value', t('Token', 'Token'), 0, 4, 0);
      title('IDENTITY AT THE EDGE, PROOF AT THE ORIGIN', 'IDENTIDAD EN EL BORDE, PRUEBA EN EL ORIGEN');
      parts.push(box(30, 90, 140, 60, t('employee', 'empleada'), 'ana@rumbo.example', 'emp', P.mint, t('Signs in with an identity provider.', 'Entra con un proveedor de identidad.')));
      parts.push(box(220, 90, 150, 60, 'Access', t('policy', 'política'), 'access', c === 4 ? P.panelAlt : P.white, t('Adds Cf-Access-Jwt-Assertion to requests that pass.', 'Agrega Cf-Access-Jwt-Assertion a los pedidos que pasan.')));
      parts.push(arrow(170, 120, 218, 120, c === 4 ? P.panelAlt : P.green));
      parts.push(box(440, 60, 290, 340, t('origin: Spring Security', 'origen: Spring Security'), '', 'origin', P.panel, t('Validates every token, whoever sends it.', 'Valida cada token, lo mande quien lo mande.')));
      const checks = [t('signature (certs of the team)', 'firma (certs del equipo)'), t('aud = AUD tag', 'aud = AUD tag'), t('iss = team domain', 'iss = dominio del equipo'), t('exp in the future', 'exp en el futuro')];
      const failAt = CASES[c][1];
      checks.forEach((x, i) => {
        const failed = failAt === i || (failAt === 4 && i === 0);
        const passed = failAt === -1 || (failAt > i && failAt !== 4);
        parts.push(`${rect(460, 110 + i * 56, 250, 42, failed ? P.fail : passed ? P.mint : P.white, failed ? P.red : passed ? P.green : P.line, 8)}${text(585, 136 + i * 56, (failed ? '✗ ' : passed ? '✓ ' : '· ') + x, 12)}`);
      });
      parts.push(arrow(370, 120, 438, 140, c === 4 ? P.panelAlt : P.green));
      if (c === 4) parts.push(box(220, 300, 150, 60, t('someone', 'alguien'), t('found the origin', 'encontró el origen'), 'direct', P.fail, t('Skips Access; the origin still asks for proof.', 'Se saltea Access; el origen igual pide prueba.')), arrow(370, 330, 438, 330, P.red));
      parts.push(text(585, 370, failAt === -1 ? 'HTTP 200' : 'HTTP 401', 18, failAt === -1 ? P.green : P.red, 'middle', 600));
      parts.push(text(220, 210, CASES[c][0], 13, P.ink, 'start'));
      note(t('In the kit, a test issuer of the course stands in for Access.', 'En el kit, un emisor de prueba del curso hace de Access.'));
    } else if (type === 'kv') {
      const T = [0, 15, 30, 60, 90];
      const v = range('value', t('Seconds after the write', 'Segundos después de la escritura'), 0, 4, 0);
      const race = toggle('Show the race', 'Mostrar la carrera');
      title('ONE WRITE, MANY COPIES', 'UNA ESCRITURA, MUCHAS COPIAS');
      if (!race) {
        parts.push(box(300, 60, 160, 60, t('central store', 'almacén central'), 'maintenance = on', 'central', P.amber, t('Writes land here first.', 'Las escrituras llegan acá primero.')));
        [['MAD', 120, 0], ['DUB', 380, 1], ['GRU', 640, 2]].forEach(([dc, x, i]) => {
          const fresh = i === 0 || T[v] >= [0, 30, 60][i];
          parts.push(box(x - 80, 230, 160, 64, dc, fresh ? 'maintenance = on' : t('old copy: off', 'copia vieja: off'), 'dc' + dc, fresh ? P.mint : P.white, i === 0 ? t('The write was made here: seen at once.', 'La escritura se hizo acá: se ve enseguida.') : t('A cached copy, refreshed after its cacheTtl.', 'Una copia en cache, que se renueva después de su cacheTtl.')));
          parts.push(arrow(380, 120, x, 228, fresh ? P.green : P.line, fresh ? '' : '5 4'));
        });
        parts.push(text(380, 350, `${T[v]} s`, 18, P.ink, 'middle', 600), text(380, 378, t('up to 60 seconds or more, illustrative', 'hasta 60 segundos o más, ilustrativo'), 12, P.muted));
      } else {
        parts.push(box(40, 80, 200, 64, t('50 requests', '50 pedidos'), 'read race → +1 → write', 'reqs', P.mint, t('All of them read the same old value.', 'Todos leen el mismo valor viejo.')));
        for (let i = 0; i < 5; i++) parts.push(arrow(240, 112, 420, 80 + i * 40, P.orange));
        parts.push(box(420, 60, 300, 210, 'race', t('each one writes 0 + 1', 'cada uno escribe 0 + 1'), 'race', P.fail, t('No atomic increment in KV.', 'KV no tiene incremento atómico.')));
        parts.push(text(380, 330, t('final: 1 (measured)', 'final: 1 (medido)'), 20, P.red, 'middle', 600));
      }
      note(t('KV: read a lot, write a little, never count.', 'KV: leé mucho, escribí poco, nunca cuentes.'));
    } else if (type === 'd1') {
      const bookmark = toggle('Session with bookmark', 'Sesión con bookmark');
      title('ONE PRIMARY, READ REPLICAS', 'UNA PRINCIPAL, RÉPLICAS DE LECTURA');
      parts.push(box(40, 80, 170, 64, 'POST /quotes', 'MAD 2.5 kg', 'w', P.mint, t('A write goes to the primary.', 'Una escritura va a la principal.')));
      parts.push(box(300, 80, 170, 64, t('primary', 'principal'), 'quotes: 1 row', 'primary', P.amber, t('Takes every write.', 'Recibe todas las escrituras.')));
      parts.push(box(560, 80, 170, 64, t('replica', 'réplica'), bookmark ? 'quotes: 1 row' : t('quotes: 0 rows (late)', 'quotes: 0 filas (atrasada)'), 'replica', bookmark ? P.mint : P.white, t('Read replication is in beta.', 'La replicación de lectura está en beta.')));
      parts.push(arrow(210, 112, 298, 112, P.green), arrow(470, 112, 558, 112, P.line, '5 4'));
      parts.push(box(300, 200, 430, 64, t('next read, routed to the replica', 'lectura siguiente, ruteada a la réplica'), bookmark ? t('waits until the replica has the write', 'espera a que la réplica tenga la escritura') : t('may miss the write', 'puede no ver la escritura'), 'read', bookmark ? P.mint : P.fail, t('The Sessions API carries a bookmark between requests.', 'La Sessions API lleva un bookmark entre pedidos.')));
      if (s === 1) ['0001_zones.sql ✓', '0002_quotes.sql ✓'].forEach((x, i) => parts.push(pill(40, 300 + i * 34, x, P.green, 200)));
      note(s === 2 ? t('Illustrative timing; the kit has one local database.', 'Tiempos ilustrativos; el kit tiene una base local.') : t('Bind values; never build SQL with strings.', 'Usá bind para los valores; nunca armes SQL con textos.'));
    } else if (type === 'r2') {
      const reads = range('value', t('Reads (thousands)', 'Lecturas (miles)'), 0, 10, 3);
      title('OBJECTS BY KEY, NO EGRESS FEES', 'OBJETOS POR CLAVE, SIN COSTO DE SALIDA');
      parts.push(box(40, 80, 170, 64, 'PUT /proofs/R-1043', 'signed by Ana', 'put', P.mint, t('The body goes to put as a stream.', 'El cuerpo va a put como stream.')));
      parts.push(rect(290, 60, 250, 230, P.panel, P.line, 14), text(415, 84, 'bucket rumbo-proofs', 12, P.muted));
      ['proofs/R-1042.txt', 'proofs/R-1043.txt'].forEach((k, i) => parts.push(box(310, 100 + i * 70, 210, 50, k, i ? '13 bytes · etag' : '', 'k' + i, i ? P.amber : P.white, t('A key is a name; the slash is a convention.', 'Una clave es un nombre; la barra es una convención.'))));
      parts.push(arrow(210, 112, 308, 192, P.green));
      parts.push(box(590, 80, 140, 64, 'GET', t('stream to the client', 'stream al cliente'), 'get', P.white, t('writeHttpMetadata copies the content type.', 'writeHttpMetadata copia el tipo de contenido.')));
      parts.push(arrow(520, 192, 588, 120, P.blue));
      parts.push(text(415, 330, t(`Class B operations: ${reads},000 of 10 million free per month`, `Operaciones Clase B: ${reads}.000 de 10 millones gratis por mes`), 13, P.ink), text(415, 356, t('egress: 0, at any volume', 'salida: 0, en cualquier volumen'), 13, P.green));
      note(t('Enabling R2 asks for a payment method: not verified in the documentation.', 'Habilitar R2 pide un medio de pago: no verificado en la documentación.'));
    } else if (type === 'do') {
      const useKv = toggle('Store: Durable Object / KV', 'Almacenamiento: Durable Object / KV');
      title('ONE ID, ONE PLACE', 'UN ID, UN LUGAR');
      parts.push(box(40, 70, 140, 56, 'Lima', 'R-1043', 'lima', P.mint, t('A request for the object R-1043.', 'Un pedido para el objeto R-1043.')));
      parts.push(box(40, 300, 140, 56, 'Madrid', 'R-1043', 'madrid', P.mint, t('Another request for the same id.', 'Otro pedido para el mismo id.')));
      if (!useKv) {
        parts.push(box(300, 170, 200, 80, 'Shipment R-1043', t('one call at a time', 'una llamada por vez'), 'obj', P.amber, t('Every request for this id reaches this instance.', 'Todo pedido para este id llega a esta instancia.')));
        parts.push(arrow(180, 98, 298, 190, P.orange), arrow(180, 328, 298, 230, P.orange));
        parts.push(box(570, 170, 160, 80, t('its storage', 'su almacenamiento'), 'SQLite · consistent', 'store', P.mint, t('Strongly consistent; only SQLite on the free plan.', 'Fuertemente consistente; solo SQLite en el plan gratuito.')));
        parts.push(arrow(500, 210, 568, 210, P.green), text(380, 300, t('50 increments → final: 50 (measured)', '50 incrementos → final: 50 (medido)'), 16, P.green, 'middle', 600));
      } else {
        parts.push(box(300, 70, 200, 56, 'KV · LIM', 'race = 0 → 1', 'kvl', P.white, t('Read, add, write, in parallel.', 'Leer, sumar, escribir, en paralelo.')));
        parts.push(box(300, 300, 200, 56, 'KV · MAD', 'race = 0 → 1', 'kvm', P.white, t('Same old value, same write.', 'El mismo valor viejo, la misma escritura.')));
        parts.push(arrow(180, 98, 298, 98, P.orange), arrow(180, 328, 298, 328, P.orange), text(380, 220, t('50 increments → final: 1 (measured)', '50 incrementos → final: 1 (medido)'), 16, P.red, 'middle', 600));
      }
      if (s === 2) parts.push(text(380, 400, t('Soft limit: 1,000 requests per second per object.', 'Límite blando: 1.000 pedidos por segundo por objeto.'), 12, P.muted));
      note(t('Many small objects scale; one big object queues.', 'Muchos objetos chicos escalan; un objeto grande hace cola.'));
    } else if (type === 'live') {
      const at = range('value', t('Time', 'Tiempo'), 0, 3, 3);
      const delivered = toggle('Last status: out for delivery / delivered', 'Último estado: out for delivery / delivered');
      title('AN OBJECT THAT NOTICES SILENCE', 'UN OBJETO QUE NOTA EL SILENCIO');
      const marks = [[t('socket open', 'socket abierto'), '0 s'], [t('movement', 'movimiento'), '~2.6 s'], [t('silence', 'silencio'), '8 s'], [delivered ? t('no alarm', 'sin alarma') : t('alarm: delayed', 'alarma: demorado'), '~10.6 s']];
      parts.push(`<path d="M60 150H700" stroke="${P.line}" stroke-width="3"/>`);
      marks.forEach(([a, b], i) => {
        const on = i <= at;
        parts.push(`<circle cx="${80 + i * 200}" cy="150" r="12" fill="${on ? (i === 3 ? (delivered ? P.green : P.orange) : P.green) : P.panelAlt}"/>`, text(80 + i * 200, 120, a, 13, on ? P.ink : P.muted), mono(80 + i * 200, 185, b, 12, P.muted, 'middle'));
      });
      parts.push(box(240, 230, 280, 70, 'Shipment R-1044', at >= 3 ? (delivered ? 'delivered · delayed false' : 'out for delivery · delayed true') : at >= 1 ? 'out for delivery' : 'no movements yet', 'obj', P.amber, t('setAlarm on each movement; deleteAlarm on a final status.', 'setAlarm en cada movimiento; deleteAlarm en un estado final.')));
      parts.push(box(40, 340, 160, 56, t('browser', 'navegador'), t('watchers 1', 'watchers 1'), 'ws', P.mint, t('The socket stays open while the object hibernates.', 'El socket queda abierto mientras el objeto hiberna.')), arrow(200, 368, 238, 290, P.blue));
      note(t('Measured in the kit; in production the wait would be hours.', 'Medido en el kit; en producción la espera sería de horas.'));
    } else if (type === 'hyperdrive') {
      const local = toggle('Account / kit', 'Cuenta / kit');
      title('A CONNECTION STRING THROUGH CLOUDFLARE', 'UN CONNECTION STRING QUE PASA POR CLOUDFLARE');
      parts.push(box(30, 90, 150, 60, 'Worker · LHR', 'postgres.js', 'w1', P.mint, t('An ordinary driver, with env.PG.connectionString.', 'Un driver común, con env.PG.connectionString.')));
      parts.push(box(30, 260, 150, 60, 'Worker · GRU', 'postgres.js', 'w2', P.mint, t('Many Workers, few database connections.', 'Muchos Workers, pocas conexiones a la base.')));
      if (!local) {
        parts.push(box(240, 170, 160, 70, 'Hyperdrive', t('setup near the Worker', 'armado cerca del Worker'), 'hd', P.amber, t('Caches read queries for max_age; does not invalidate on writes.', 'Guarda consultas de lectura por max_age; no las invalida cuando hay escrituras.')));
        parts.push(box(450, 170, 130, 70, 'pool', t('near the database', 'cerca de la base'), 'pool', P.white, t('In the regions closest to your database.', 'En las regiones más cercanas a tu base.')));
        parts.push(arrow(180, 120, 238, 190, P.orange), arrow(180, 290, 238, 220, P.orange), arrow(400, 205, 448, 205, P.green), arrow(580, 205, 618, 205, P.green));
      } else {
        parts.push(box(240, 170, 340, 70, t('direct connection', 'conexión directa'), 'localConnectionString → db:5432', 'hd', P.white, t('Locally: no pool, no cache.', 'En local: sin pool ni cache.')));
        parts.push(arrow(180, 120, 238, 195, P.orange), arrow(580, 205, 618, 205, P.green));
      }
      parts.push(box(620, 170, 120, 70, 'PostgreSQL', t('your server', 'tu servidor'), 'pg', P.white, t('Every query not cached reaches it.', 'Toda consulta que no está en cache llega.')));
      if (s === 2) parts.push(text(380, 380, t('A private database: through a Tunnel, or Workers VPC (beta).', 'Una base privada: por un Tunnel, o Workers VPC (beta).'), 12, P.blue));
      note(local ? t('The kit proves the path, not the speed.', 'El kit prueba el camino, no la velocidad.') : t('Illustrative layout of the documented design.', 'Disposición ilustrativa del diseño documentado.'));
    } else if (type === 'queue') {
      const M = [['m-1', 'delivered', t('saved at the origin', 'saved at the origin'), 1], ['m-1', 'delivered', t('already saved', 'already saved'), 1], ['m-2', 'lost in space', 'DLQ', 3]];
      const m = range('value', t('Message', 'Mensaje'), 0, 2, 0);
      title('AT LEAST ONCE', 'AL MENOS UNA VEZ');
      parts.push(box(30, 80, 150, 60, 'webhook', 'HTTP 202', 'prod', P.mint, t('Answers at once; the work goes to the queue.', 'Responde enseguida; el trabajo va a la cola.')));
      parts.push(box(230, 80, 150, 60, 'movements', t('batches of 10 / 2 s', 'lotes de 10 / 2 s'), 'queue', P.amber, t('In the kit: max_batch_timeout 2, max_retries 2.', 'En el kit: max_batch_timeout 2, max_retries 2.')));
      parts.push(box(430, 80, 150, 60, t('consumer', 'consumidor'), `attempts ${M[m][3]}`, 'cons', P.white, t('ack or retry, per message.', 'ack o retry, por mensaje.')));
      parts.push(arrow(180, 110, 228, 110, P.line), arrow(380, 110, 428, 110, P.line));
      for (let i = 0; i < M[m][3]; i++) parts.push(`<circle cx="${465 + i * 40}" cy="170" r="12" fill="${m === 2 ? P.red : P.green}"/>`, text(465 + i * 40, 175, String(i + 1), 11, P.white));
      parts.push(box(430, 220, 150, 60, t('origin', 'origen'), 'PRIMARY KEY event_id', 'origin', m === 1 ? P.amber : P.white, t('INSERT ... ON CONFLICT DO NOTHING: a duplicate changes nothing.', 'INSERT ... ON CONFLICT DO NOTHING: un duplicado no cambia nada.')));
      parts.push(arrow(505, 140, 505, 218, m === 2 ? P.red : P.green));
      parts.push(box(600, 220, 150, 60, 'movements-dead', m === 2 ? 'm-2' : t('empty', 'vacía'), 'dlq', m === 2 ? P.fail : P.white, t('After max_retries, the dead letter queue.', 'Después de max_retries, la cola de mensajes muertos.')));
      if (m === 2) parts.push(arrow(580, 250, 598, 250, P.red));
      parts.push(text(380, 340, `${M[m][0]} · ${M[m][1]} → ${M[m][2]}`, 16, m === 2 ? P.red : P.green, 'middle', 600), text(380, 366, t('movements of R-1042 at the origin: 1', 'movimientos de R-1042 en el origen: 1'), 12, P.muted));
      note(t('Measured in the kit: three attempts in about eight seconds.', 'Medido en el kit: tres intentos en unos ocho segundos.'));
    } else if (type === 'workflow') {
      const p = range('value', t('Progress', 'Avance'), 0, 3, 1);
      title('STEPS THAT SURVIVE', 'PASOS QUE SOBREVIVEN');
      const S = [[t('register', 'registrar'), 'step.do'], [t('wait for approval', 'esperar aprobación'), 'waitForEvent'], [t('refund', 'reintegrar'), t('attempt 1 fails', 'falla el intento 1')], [t('notify', 'avisar'), 'step.do']];
      S.forEach(([a, b], i) => {
        const done = i < p, now = i === p;
        parts.push(box(30 + i * 180, 140, 160, 70, a, b, 's' + i, done ? P.mint : now ? P.amber : P.white, [t('Its result is stored: never run again.', 'Su resultado queda guardado: nunca corre de nuevo.'), t('Nothing runs while it waits; sendEvent wakes it.', 'No corre nada mientras espera; sendEvent la despierta.'), t('Retried on its own: retries limit 3, delay 1 second.', 'Se reintenta solo: retries limit 3, delay 1 second.'), t('Then the instance is complete.', 'Después la instancia queda complete.')][i]));
        if (i < 3) parts.push(arrow(190 + i * 180, 175, 208 + i * 180, 175, done ? P.green : P.line));
      });
      if (p >= 2) parts.push(`<circle cx="500" cy="250" r="12" fill="${P.red}"/>${text(500, 255, '1', 11, P.white)}<circle cx="540" cy="250" r="12" fill="${P.green}"/>${text(540, 255, '2', 11, P.white)}`, text(590, 255, 'attempts: 2', 12, P.muted, 'start'));
      parts.push(text(380, 330, ['running', 'running', 'running', 'complete'][p], 18, p === 3 ? P.green : P.orange, 'middle', 600));
      note(t('Measured: refund with attempts 2, then complete.', 'Medido: refund con attempts 2, y después complete.'));
    } else if (type === 'cron') {
      const off = range('value', t('Your UTC offset (hours)', 'Tu diferencia con UTC (horas)'), -5, 3, -3);
      title('CRON RUNS IN UTC', 'CRON CORRE EN UTC');
      parts.push(`<circle cx="200" cy="210" r="130" fill="${P.panel}" stroke="${P.line}" stroke-width="2"/>`);
      for (let h = 0; h < 24; h += 3) {
        const a = (h / 24) * 2 * Math.PI - Math.PI / 2;
        parts.push(mono(200 + 105 * Math.cos(a), 214 + 105 * Math.sin(a), String(h).padStart(2, '0'), 11, h === 3 ? P.orange : P.muted, 'middle'));
      }
      const a3 = (3 / 24) * 2 * Math.PI - Math.PI / 2;
      parts.push(`<path d="M200 210L${200 + 80 * Math.cos(a3)} ${210 + 80 * Math.sin(a3)}" stroke="${P.orange}" stroke-width="4"/>`, text(200, 370, '0 3 * * *', 14, P.ink));
      details.clock = t('Cron Triggers execute on UTC time.', 'Los Cron Triggers corren en hora UTC.');
      parts.push(`<g class="selectable" tabindex="0" role="button" data-node="clock" aria-label="cron">${`<circle cx="200" cy="210" r="130" fill="none" stroke="none"/>`}</g>`);
      const local = (3 + off + 24) % 24;
      parts.push(box(420, 100, 300, 70, t('in your time zone', 'en tu zona horaria'), `${String(local).padStart(2, '0')}:00 (UTC${off >= 0 ? '+' : ''}${off})`, 'local', P.amber, t('Write the schedule in UTC and convert when you read it.', 'Escribí el horario en UTC y convertí cuando lo leas.')));
      parts.push(box(420, 200, 300, 70, t('the daily close', 'el cierre diario'), t('shipments by status → KV close:last', 'envíos por estado → KV close:last'), 'close', P.white, t('Reads PostgreSQL through Hyperdrive.', 'Lee PostgreSQL por Hyperdrive.')));
      if (s === 2) parts.push(box(420, 300, 300, 70, t('R2 notification → queue', 'notificación de R2 → cola'), t('on the account only', 'solo en la cuenta'), 'r2n', P.white, t('Configured with wrangler r2 bucket notification.', 'Se configura con wrangler r2 bucket notification.')));
      note(t('After a change, up to 15 minutes to propagate.', 'Después de un cambio, hasta 15 minutos para propagarse.'));
    } else if (type === 'capstone') {
      const n = range('value', t('Line', 'Línea'), 0, 4, s);
      title('DECISIONS WITH EVIDENCE', 'DECISIONES CON EVIDENCIA');
      const rubric = [[t('What no code should see is refused at the edge', 'Lo que ningún código debería ver se rechaza en el borde'), 'lab get /api/admin/users → 403'], [t('Skipping the edge does not skip the check', 'Saltear el borde no saltea la verificación'), 'lab panel --direct → 401'], [t('The consumer is idempotent', 'El consumidor es idempotente'), 'lab webhook c-1 ×2 → already saved'], [t('Coordination lives in one place', 'La coordinación vive en un lugar'), 'lab race do → 50'], [t('Every claim has a trace', 'Cada afirmación tiene una traza'), 'lab spans']];
      rubric.forEach(([a, b], i) => parts.push(box(40, 52 + i * 74, 680, 62, a, b, 'r' + i, i === n ? P.amber : i < n ? P.mint : P.white, lesson.frames[Math.min(2, Math.floor(i / 2))].text[lang])));
      note(t('Each line points to a command you can run again.', 'Cada línea apunta a un comando que podés volver a ejecutar.'));
    }
    if (!parts.length) throw Error('Unimplemented ' + type);
    if (!Object.keys(details).length) details.model = frameText;
    return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 460" role="group" aria-label="${e(lesson.title[lang])}" style="font-family:Segoe UI,system-ui,sans-serif"><title>${e(lesson.title[lang])}</title>${parts.join('')}</svg>`, controls, details };
  }
  return { render, palette, themes: Object.keys(PALETTES) };
})();
