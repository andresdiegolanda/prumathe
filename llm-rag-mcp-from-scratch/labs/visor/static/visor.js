/* The page of the live viewer. It asks the viewer for the list of events, then for the detail of
   each new one, and draws what each lesson asks to look at: what reached the model, the
   retrieval, the tool calls and every message on the wire. Text from the events is always
   inserted as text, never as HTML: a tool description or a retrieved chunk can carry anything. */
'use strict';
(() => {
  // ------------------------------------------------------------------------- words, in both languages

  const S = {
    title: ['Live viewer', 'Visor en vivo'],
    sources: ['events of the lab, the app and the MCP servers', 'eventos del laboratorio, la app y los servidores MCP'],
    note: ['It only reads the events the course commands write. It never talks to the models.', 'Solo lee los eventos que escriben los comandos del curso. No habla con los modelos.'],
    offline: ['the viewer does not answer', 'el visor no responde'],
    follow: ['Follow the latest', 'Seguir el último'],
    log: ['Log', 'Registro'],
    logHelp: ['Each command adds an event. Pick one to see its detail; with "Follow the latest" on, the newest stays selected.', 'Cada comando agrega un evento. Elegí uno para ver su detalle; con «Seguir el último», el más nuevo queda seleccionado.'],
    empty: ['No events yet. Run a command of the lab, for example:', 'Todavía no hay eventos. Corré un comando del laboratorio, por ejemplo:'],
    loading: ['Loading the event...', 'Cargando el evento...'],
    lesson: ['lesson {0}', 'lección {0}'],
    step: ['step {0}', 'paso {0}'],
    lookAt: ['What to look at', 'Qué mirar'],
    pin: ['Pin to compare', 'Fijar para comparar'],
    unpin: ['Unpin', 'Soltar'],
    pinned: ['pinned', 'fijado'],
    pinHelp: ['Pick another event: the two appear side by side.', 'Elegí otro evento: los dos aparecen lado a lado.'],
    exit: ['exit {0}', 'salida {0}'],
    lane1: ['1 · What reaches the model', '1 · Lo que llega al modelo'],
    lane2: ['2 · The retrieval', '2 · La recuperación'],
    lane3: ['3 · The calls', '3 · Las llamadas'],
    seq: ['Messages of the event', 'Mensajes del evento'],
    seqHelp: ['Each arrow opens and shows the request and the response whole, with their headers.', 'Cada flecha se abre y muestra el pedido y la respuesta completos, con sus encabezados.'],
    notRecorded: ['{0} more requests were not recorded: an event keeps up to 120.', 'No se registraron {0} pedidos más: un evento guarda hasta 120.'],
    terminal: ['What the terminal showed', 'Lo que mostró la terminal'],
    noModel: ['This event did not talk to a model.', 'Este evento no habló con un modelo.'],
    otherCalls: ['Requests to the model servers: {0}. Open them in the messages below.', 'Pedidos a los servidores de modelos: {0}. Abrilos en los mensajes de abajo.'],
    noRetrieval: ['No retrieval in this event.', 'Sin recuperación en este evento.'],
    noCalls: ['No tool calls in this event.', 'Sin llamadas a tools en este evento.'],
    noMessages: ['No messages on the wire.', 'Sin mensajes en la red.'],
    more: ['Show the other {0}', 'Mostrar los otros {0}'],
    sent: ['Messages sent: {0}', 'Mensajes enviados: {0}'],
    context: ['Context used: {0} of {1} tokens', 'Contexto usado: {0} de {1} tokens'],
    rejected: ['Rejected: {0} tokens for a context of {1}', 'Rechazado: {0} tokens para un contexto de {1}'],
    toolsN: ['tools: {0}', 'tools: {0}'],
    toolsShare: ['The definitions of the tools are {0} of the characters of the request.', 'Las definiciones de las tools son el {0} de los caracteres del pedido.'],
    requests: ['Requests to the model', 'Pedidos al modelo'],
    hReq: ['#', '#'], hMsgs: ['messages', 'mensajes'], hPrompt: ['prompt tokens', 'tokens del prompt'], hReply: ['reply', 'respuesta'],
    asksFor: ['asks for {0}', 'pide {0}'],
    speeds: ['Two speeds', 'Dos velocidades'],
    reading: ['reading the prompt', 'leer el prompt'],
    writing: ['writing the answer', 'escribir la respuesta'],
    perSecond: ['{0} tok/s', '{0} tok/s'],
    answer: ['Answer', 'Respuesta'],
    reasoning: ['Reasoning, {0} characters', 'Razonamiento, {0} caracteres'],
    stream: ['Server-sent events: {0}, in order', 'Eventos del servidor: {0}, en orden'],
    nextModel: ['Next token, as the model computes it', 'Próximo token, como lo calcula el modelo'],
    nextSampler: ['After the sampler, temperature {0}', 'Después del sampler, temperatura {0}'],
    text: ['Text', 'Texto'],
    steps: ['Each step adds the most probable token', 'Cada paso agrega el token más probable'],
    result: ['Result', 'Resultado'],
    draws: ['Draws', 'Sorteos'],
    noSeed: ['no seed', 'sin semilla'],
    tokensOf: [['{0} token for {1} characters', '{0} tokens for {1} characters'], ['{0} token para {1} caracteres', '{0} tokens para {1} caracteres']],
    hChars: ['characters', 'caracteres'], hTokens: ['tokens', 'tokens'],
    template: ['The text the model receives; special tokens highlighted', 'El texto que recibe el modelo; los tokens especiales, resaltados'],
    specials: ['special tokens: {0}', 'tokens especiales: {0}'],
    vector: ['A vector of {0} numbers; the first ones:', 'Un vector de {0} números; los primeros:'],
    similar: ['Cosine similarity; the strongest pair, outlined', 'Similitud coseno; el par más fuerte, marcado'],
    schema: ['with a JSON schema', 'con esquema JSON'],
    noSchema: ['without a schema', 'sin esquema'],
    verdict: ['Validation', 'Validación'],
    server: ['The server', 'El servidor'],
    query: ['Query', 'Consulta'],
    question: ['question', 'pregunta'],
    chunk: ['chunk', 'chunk'], trust: ['trust', 'confianza'], score: ['score', 'puntaje'], why: ['how it got there', 'cómo llegó'],
    cited: ['cited', 'citado'],
    chunkTexts: ['Text of the chunks', 'Texto de los chunks'],
    toolSearch: ['Retrieval by the MCP server: {0}', 'Recuperación del servidor MCP: {0}'],
    before: ['Before the reranker', 'Antes del reranker'],
    after: ['After the reranker', 'Después del reranker'],
    was: ['was #{0}', 'era #{0}'],
    finalPrompt: ['Final prompt, {0} tokens', 'Prompt final, {0} tokens'],
    finalPromptN: ['Final prompt', 'Prompt final'],
    declined: ['says it does not know', 'dice que no sabe'],
    index: ['Index: {0} chunks from {1} files, strategy {2}', 'Índice: {0} chunks de {1} archivos, estrategia {2}'],
    lengths: ['from {0} to {1} characters', 'de {0} a {1} caracteres'],
    hFile: ['file', 'archivo'], hChunks: ['chunks', 'chunks'],
    example: ['Example chunk: {0}', 'Chunk de ejemplo: {0}'],
    evalTitle: ['Retrieval, top {0}: position of the first right chunk', 'Recuperación, top {0}: posición del primer chunk correcto'],
    hitRate: ['hit rate', 'hit rate'], mrr: ['MRR', 'MRR'],
    answers: ['Answers', 'Respuestas'],
    judge: ['judge', 'juez'], agrees: ['agrees', 'coincide'], disagrees: ['disagrees', 'no coincide'],
    offered: ['Tools of the servers', 'Tools de los servidores'],
    notOffered: ['not offered to the model', 'no se le ofreció al modelo'],
    readOnly: ['read-only (as the server says)', 'solo lectura (según el servidor)'],
    changes: ['changes data', 'cambia datos'],
    description: ['Description, as the model reads it', 'Descripción, como la lee el modelo'],
    calls: ['Calls the model asked for', 'Llamadas que pidió el modelo'],
    st_read: ['ran', 'se ejecutó'],
    st_ran: ['ran without asking', 'se ejecutó sin preguntar'],
    st_approved: ['approved and ran', 'aprobada y ejecutada'],
    st_denied: ['denied: it did not run', 'negada: no se ejecutó'],
    st_stopped: ['stopped: the budget of calls is spent', 'frenada: se acabó el presupuesto de llamadas'],
    st_local: ['the client runs it', 'la ejecuta el cliente'],
    resultWhole: ['Result, whole', 'Resultado completo'],
    hidden: ['Possible hidden instruction: «{0}»', 'Posible instrucción escondida: «{0}»'],
    stopped: ['No answer: the host stopped the run after {0} tool calls.', 'Sin respuesta: el host frenó la corrida después de {0} llamadas a tools.'],
    finalAnswer: ['Final answer', 'Respuesta final'],
    request: ['Request', 'Pedido'], response: ['Response', 'Respuesta'],
    headers: ['headers', 'encabezados'], body: ['body', 'cuerpo'],
    noBody: ['no body', 'sin cuerpo'],
    client: ['client', 'cliente'],
    runsLocal: ['{0} runs {1}: {2}', '{0} ejecuta {1}: {2}'],
    // A pair of forms picks the singular when the first value is 1.
    nTools: [['{0} tool', '{0} tools'], ['{0} tool', '{0} tools']],
    nResources: [['{0} resource', '{0} resources'], ['{0} resource', '{0} resources']],
    nTemplates: [['{0} template', '{0} templates'], ['{0} template', '{0} templates']],
    nPrompts: [['{0} prompt', '{0} prompts'], ['{0} prompt', '{0} prompts']],
    sumMessages: [['{0} MCP message', '{0} MCP messages'], ['{0} mensaje MCP', '{0} mensajes MCP']],
    sumCalls: [['{0} request', '{0} requests'], ['{0} pedido', '{0} pedidos']],
    sumSources: [['{0} source', '{0} sources'], ['{0} fuente', '{0} fuentes']],
    sumCites: ['cites {0}', 'cita {0}'],
    sumChunks: [['{0} chunk · {1}', '{0} chunks · {1}'], ['{0} chunk · {1}', '{0} chunks · {1}']],
    sumIndex: [['{0} chunk from {1} files', '{0} chunks from {1} files'], ['{0} chunk de {1} archivos', '{0} chunks de {1} archivos']],
    sumDraws: [['{0} draw', '{0} draws'], ['{0} sorteo', '{0} sorteos']],
    sumRounds: [['{0} round to the model', '{0} rounds to the model'], ['{0} vuelta al modelo', '{0} vueltas al modelo']],
    sumVector: ['vector of {0} numbers', 'vector de {0} números'],
    sumMatrix: ['{0} × {0} matrix', 'matriz de {0} × {0}'],
    sumToolCalls: [['{0} tool call', '{0} tool calls'], ['{0} llamada a tool', '{0} llamadas a tools']],
    sumRan: ['{0} ran', '{0} se ejecutó'],
    sumDenied: ['{0} denied', '{0} negada'],
    sumStopped: [['stopped after {0} call', 'stopped after {0} calls'], ['frenada después de {0} llamada', 'frenada después de {0} llamadas']],
    sumFailed: ['ended with exit {0}', 'terminó con salida {0}'],
  };

  // ------------------------------------------------------------------------- state

  const state = {
    lang: 'en', lessons: null, index: [], details: new Map(), lessonOf: new Map(),
    selected: null, pinned: null, follow: true, version: null, online: true, folds: new Map(), more: new Set(),
  };
  const browserLang = () => ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en');
  try {
    const saved = localStorage.getItem('llm-visor-lang');
    state.lang = saved === 'es' || saved === 'en' ? saved : browserLang();
  } catch {
    state.lang = browserLang();
  }

  // ------------------------------------------------------------------------- small helpers

  const t = (key, ...args) => {
    const pair = S[key];
    let s = pair ? pair[state.lang === 'es' ? 1 : 0] : key;
    if (Array.isArray(s)) s = s[Number(args[0]) === 1 ? 0 : 1];
    args.forEach((a, i) => { s = s.split(`{${i}}`).join(String(a)); });
    return s;
  };
  const L = (o) => (o ? o[state.lang] ?? o.en ?? '' : '');
  const locale = () => (state.lang === 'es' ? 'es-AR' : 'en-US');
  const num = (n, digits = 0) => new Intl.NumberFormat(locale(), { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
  const pct = (p) => `${num(p * 100, 1)} %`;
  const clock = (ms) => new Date(ms).toLocaleTimeString(state.lang === 'es' ? 'es-AR' : 'en-GB', { hour12: false });
  const parse = (text) => {
    if (typeof text !== 'string') return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };
  const pretty = (text) => {
    const j = parse(text);
    return j == null ? String(text ?? '') : JSON.stringify(j, null, 2);
  };
  const snip = (s, n) => {
    const x = String(s ?? '').replace(/\s+/g, ' ').trim();
    return x.length > n ? `${x.slice(0, n - 1)}…` : x;
  };
  const quoteArg = (a) => (a === '' || /[\s"'$`\\]/.test(a) ? JSON.stringify(a) : a);
  const pathOf = (u) => {
    try {
      return new URL(u).pathname;
    } catch {
      return String(u ?? '');
    }
  };
  const hostOf = (u) => {
    try {
      return new URL(u).hostname;
    } catch {
      return '';
    }
  };
  const header = (h, name) => {
    if (!h) return undefined;
    const k = Object.keys(h).find((x) => x.toLowerCase() === name);
    return k === undefined ? undefined : h[k];
  };
  const isMcp = (url) => /\/mcp\/?$/.test(pathOf(url));

  /** Builds an element. Children that are not nodes become text: nothing is parsed as HTML. */
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : String(v));
      }
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid instanceof Node ? kid : String(kid));
    }
    return el;
  }
  const tag = (text, cls) => h('span', { class: cls ? `tag ${cls}` : 'tag', text });
  const empty = (text) => h('p', { class: 'empty', text });
  const code = (text) => h('pre', { class: 'code', text: String(text ?? '') });

  /** A details element that remembers whether it is open, and builds its body only when opened. */
  function fold(key, summary, body, openByDefault = false) {
    const open = state.folds.has(key) ? state.folds.get(key) : openByDefault;
    const d = h('details', { open }, h('summary', null, summary));
    let built = false;
    const build = () => {
      if (!built) {
        built = true;
        d.append(body());
      }
    };
    if (open) build();
    d.addEventListener('toggle', () => {
      state.folds.set(key, d.open);
      if (d.open) build();
    });
    return d;
  }

  function table(head, rows, opts = {}) {
    const t1 = h('table', { class: opts.class });
    t1.append(h('thead', null, h('tr', null, head.map((x, i) => h('th', { class: opts.numeric?.includes(i) ? 'n' : null, text: x })))));
    const tb = h('tbody');
    rows.forEach((r, ri) => {
      const tr = h('tr', { class: opts.rowClass ? opts.rowClass(ri) : null });
      r.forEach((cell, i) => tr.append(cell instanceof Node ? h('td', { class: opts.mono?.includes(i) ? 'm' : opts.numeric?.includes(i) ? 'n' : null }, cell)
        : h('td', { class: opts.mono?.includes(i) ? 'm' : opts.numeric?.includes(i) ? 'n' : null, text: cell ?? '' })));
      tb.append(tr);
    });
    t1.append(tb);
    if (opts.foot) t1.append(h('tfoot', null, opts.foot.map((r) => h('tr', null, r.map((cell, i) => h('td', { class: opts.numeric?.includes(i) ? 'n' : null, text: cell ?? '' }))))));
    return t1;
  }

  function bars(list) {
    const box = h('div', { class: 'bars' });
    for (const { label, p } of list) {
      const fill = h('i');
      fill.style.width = `${Math.max(0.5, Math.min(100, p * 100))}%`;
      box.append(h('div', { class: 'bar' }, h('span', { class: 'm', text: label }), h('span', { class: 'track' }, fill), h('span', { class: 'v', text: pct(p) })));
    }
    return box;
  }

  function gauge(used, of, label, over) {
    const fill = h('i');
    fill.style.width = `${Math.max(0.5, Math.min(100, (used / of) * 100))}%`;
    return [h('p', { class: over ? 'line bad' : 'line', text: label }), h('div', { class: over ? 'gauge over' : 'gauge' }, fill)];
  }

  // Instructions addressed to the model inside data: the shapes the course plants, and the usual ones.
  const HIDDEN = /<IMPORTANT>|SYSTEM NOTICE|\b(note|notice|message|instructions?) (for|to) the (\w+ )?assistant\b|\bnota para el asistente\b|ignore (all |any )?(the )?(previous|prior|above) instructions|do not (mention|tell) (this|the user)|before (you answer|using any other tool)/i;
  function hiddenInstruction(text) {
    const s = String(text ?? '');
    const m = HIDDEN.exec(s);
    return m ? snip(s.slice(Math.max(0, m.index - 10), m.index + 230), 240) : null;
  }
  const hiddenCallout = (text) => {
    const found = hiddenInstruction(text);
    return found ? h('div', { class: 'callout bad', text: t('hidden', found) }) : null;
  };

  /** Splits a text at [n] citations and highlights them. */
  function withCitations(text) {
    const p = h('p', { class: 'answer' });
    for (const part of String(text ?? '').split(/(\[\d+\])/)) p.append(/^\[\d+\]$/.test(part) ? h('span', { class: 'cite', text: part }) : part);
    return p;
  }

  // ------------------------------------------------------------------------- reading events

  const KINDS = [[/chat\/completions$/, 'chat'], [/\/completion$/, 'completion'], [/\/tokenize$/, 'tokenize'], [/\/apply-template$/, 'template'],
    [/\/embeddings$/, 'embed'], [/\/rerank(ing)?$/, 'rerank'], [/\/props$/, 'props'], [/\/models$/, 'models']];
  const kindOf = (url) => (KINDS.find(([re]) => re.test(pathOf(url))) ?? [null, 'other'])[1];

  function modelCalls(d) {
    return (d.event?.calls ?? []).filter((c) => !isMcp(c.url)).map((c) => ({ ...c, kind: kindOf(c.url), req: parse(c.requestBody), res: parse(c.responseBody) }));
  }
  function streamFinal(x) {
    for (let i = (x.stream?.length ?? 0) - 1; i >= 0; i--) {
      const j = parse(x.stream[i]);
      if (j && (j.timings || j.usage)) return j;
    }
    return null;
  }
  const promptTokens = (x) => x.res?.usage?.prompt_tokens ?? x.res?.timings?.prompt_n ?? streamFinal(x)?.usage?.prompt_tokens ?? streamFinal(x)?.timings?.prompt_n ?? null;
  const rejection = (x) => (x.status === 400 && x.res?.error?.type === 'exceed_context_size_error' ? x.res.error : null);
  function messageOf(x) {
    const m = x.res?.choices?.[0]?.message;
    if (m) return m;
    if (!x.stream) return null;
    let content = '';
    for (const line of x.stream) content += parse(line)?.choices?.[0]?.delta?.content ?? '';
    return { content };
  }
  function contextSize(calls) {
    for (const c of calls) {
      const n = c.kind === 'props' ? c.res?.default_generation_settings?.n_ctx : null;
      if (n) return n;
    }
    return 8192;
  }

  const SERVERS = { mcp: 'mcp · Spring', 'mcp-modern': 'mcp-modern · TypeScript', 'mcp-poisoned': 'mcp-poisoned' };
  const serverName = (s) => SERVERS[s] ?? s;

  /** JSON-RPC messages of a body: one object, a batch, or server-sent events with data lines. */
  function rpcMessages(text, contentType) {
    if (!text) return [];
    const trimmed = String(text).trim();
    if (/event-stream/.test(contentType ?? '') || (!trimmed.startsWith('{') && !trimmed.startsWith('[') && /^data:/m.test(trimmed))) {
      return trimmed.split('\n').filter((l) => l.startsWith('data:')).map((l) => parse(l.slice(5).trim())).filter(Boolean);
    }
    const j = parse(trimmed);
    return j == null ? [] : Array.isArray(j) ? j : [j];
  }

  /**
   * The MCP exchanges of an event: from the servers' own logs when there are any (what the server
   * received and sent), otherwise from the client's requests to an /mcp endpoint.
   */
  function exchanges(d) {
    const out = [];
    const lines = d.rpc ?? [];
    if (lines.length) {
      const pending = new Map();
      for (const line of lines) {
        if (line.transport === 'stdio') {
          const msgs = rpcMessages(line.body);
          if (line.direction === 'in') {
            const x = { at: line.at, transport: 'stdio', server: line.source, messages: msgs, replies: [], reqBody: line.body };
            out.push(x);
            for (const m of msgs) if (m.id != null) pending.set(String(m.id), x);
          } else {
            for (const m of msgs) {
              const x = m.id != null ? pending.get(String(m.id)) : null;
              if (x) {
                x.replies.push(m);
                x.resBody = x.resBody ? `${x.resBody}\n${line.body}` : line.body;
              } else {
                out.push({ at: line.at, transport: 'stdio', server: line.source, messages: [], replies: [m], resBody: line.body, fromServer: true });
              }
            }
          }
        } else {
          const rq = line.request ?? {};
          const rs = line.response ?? {};
          out.push({
            at: line.at, transport: 'http', server: line.source, method: rq.method, path: rq.path,
            reqHeaders: rq.headers, reqBody: rq.body, status: rs.status, resHeaders: rs.headers, resBody: rs.body,
            messages: rpcMessages(rq.body), replies: rpcMessages(rs.body, header(rs.headers, 'content-type')),
          });
        }
      }
    } else {
      for (const c of d.event?.calls ?? []) {
        if (!isMcp(c.url)) continue;
        out.push({
          at: c.at, transport: 'http', server: hostOf(c.url), method: c.method, path: pathOf(c.url),
          reqHeaders: c.requestHeaders, reqBody: c.requestBody, status: c.status, resHeaders: c.responseHeaders, resBody: c.responseBody,
          messages: rpcMessages(c.requestBody), replies: rpcMessages(c.responseBody, header(c.responseHeaders, 'content-type')),
        });
      }
    }
    return out;
  }

  /** What each server says about its tools, from the tools/list answers of the event. */
  function toolHints(d, xs) {
    const m = new Map();
    for (const x of xs) for (const r of x.replies) for (const tool of r?.result?.tools ?? []) m.set(tool.name, tool.annotations ?? {});
    for (const tool of d.event?.data?.agent?.tools ?? []) if (!m.has(tool.name)) m.set(tool.name, { readOnlyHint: tool.readOnly });
    return m;
  }
  // Without readOnlyHint the specification assumes a tool can change data; an unknown tool is not marked.
  const mutating = (hints, name) => (hints.has(name) ? hints.get(name).readOnlyHint !== true : false);

  // ------------------------------------------------------------------------- lessons

  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  const option = (argv, name) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };

  function candidates(e) {
    const commands = state.lessons?.commands ?? [];
    if (e.kind === 'command') {
      const argv = e.argv ?? [];
      const exact = commands.filter((c) => c.tool === e.source && same(c.argv, argv));
      if (exact.length) return { list: exact, exact: true };
      return { list: commands.filter((c) => c.tool === e.source && c.argv[0] === argv[0]), exact: false };
    }
    if (e.transport === 'stdio') return { list: commands.filter((c) => c.tool === 'mcp-stdio'), exact: true };
    const d = state.details.get(e.id);
    const methods = new Set();
    const tools = new Set();
    for (const x of d ? exchanges(d) : []) {
      for (const m of x.messages) {
        if (m.method) methods.add(m.method);
        if (m.method === 'tools/call') tools.add(m.params?.name);
      }
    }
    const list = commands.filter((c) => {
      if (c.tool !== 'inspector') return false;
      const method = option(c.argv, '--method');
      return methods.has(method) && (method !== 'tools/call' || tools.has(option(c.argv, '--tool-name')));
    });
    return { list, exact: false };
  }

  /** Each event gets the lesson whose step it repeats; among several, the one the learner is on. */
  function assignLessons() {
    let current = 0;
    state.lessonOf.clear();
    for (const e of state.index) {
      const { list, exact } = candidates(e);
      if (!list.length) continue;
      const ids = [...new Set(list.map((c) => c.lesson))].sort((a, b) => a - b);
      const lesson = ids.includes(current) ? current : ids.find((x) => x >= current) ?? ids[ids.length - 1];
      const steps = list.filter((c) => c.lesson === lesson);
      state.lessonOf.set(e.id, { lesson, step: exact && steps.length === 1 ? steps[0].step : null });
      current = lesson;
    }
  }
  const lessonInfo = (id) => state.lessons?.lessons?.find((l) => l.id === id);

  // ------------------------------------------------------------------------- one line per event

  function sourceName(e) {
    if (e.kind === 'session') return serverName(e.source) + (e.transport === 'stdio' ? ' · stdio' : '');
    return e.source;
  }
  function commandLine(e) {
    return [e.source, ...(e.argv ?? []).map(quoteArg)].join(' ');
  }
  function sessionLine(e, d) {
    const xs = d ? exchanges(d) : [];
    const methods = [...new Set(xs.flatMap((x) => x.messages.map((m) => m.method)).filter(Boolean))];
    return methods.length ? methods.join(', ') : serverName(e.source);
  }

  function summary(e, d) {
    if (!d) return { text: '' };
    if (e.kind === 'session') return { text: t('sumMessages', exchanges(d).length) };
    const ev = d.event ?? {};
    const data = ev.data ?? {};
    const cmd = ev.argv?.[0];
    if (ev.exit) {
      const line = String(ev.output ?? '').split('\n').find((l) => l.startsWith('ERROR'));
      return { text: snip(line ?? t('sumFailed', ev.exit), 120), bad: true };
    }
    const calls = modelCalls(d);
    const chats = calls.filter((c) => c.kind === 'chat');
    const rej = chats.map(rejection).find(Boolean) ?? calls.map(rejection).find(Boolean);
    if (rej) return { text: t('rejected', num(rej.n_prompt_tokens), num(rej.n_ctx)), bad: true };
    const tc = data.toolCalls ?? [];
    if (tc.length) {
      const ran = tc.find((c) => c.status === 'ran' && !c.readOnly);
      if (ran) return { text: t('sumRan', ran.name), bad: true };
      const denied = tc.find((c) => c.status === 'denied');
      if (denied) return { text: t('sumDenied', denied.name) };
      if (tc.some((c) => c.status === 'stopped')) return { text: t('sumStopped', tc.length - 1), bad: true };
      return { text: t('sumToolCalls', tc.length) };
    }
    if (data.asks?.length) {
      const a = data.asks[data.asks.length - 1];
      if (a.declined) return { text: `${t('sumSources', a.sources?.length ?? 0)} · ${t('declined')}` };
      const cites = (a.cited ?? []).map((n) => `[${n}]`).join(' ');
      return { text: `${t('sumSources', a.sources?.length ?? 0)}${cites ? ` · ${t('sumCites', cites)}` : ''}` };
    }
    if (data.index) return { text: t('sumIndex', data.index.chunks, data.index.files) };
    if (data.eval) {
      const last = (data.eval.modes ?? []).length - 1;
      return { text: last >= 0 ? `${data.eval.modes[last]}: ${data.eval.hitRate?.[last] ?? ''} · MRR ${num(data.eval.mrr?.[last] ?? 0, 2)}` : '' };
    }
    if (data.retrievals?.length) {
      const r = data.retrievals[data.retrievals.length - 1];
      return { text: t('sumChunks', r.hits?.length ?? 0, r.mode) };
    }
    if (data.extract) return { text: data.extract.verdict, bad: !String(data.extract.verdict).startsWith('VALID') };
    if (data.similar) return { text: t('sumMatrix', data.similar.texts?.length ?? 0) };
    const comps = calls.filter((c) => c.kind === 'completion');
    if (cmd === 'next' && comps[0]) {
      const top = comps[0].res?.completion_probabilities?.[0]?.top_logprobs?.[0];
      if (top) return { text: `top: ${JSON.stringify(top.token)} ${pct(Math.exp(top.logprob))}` };
    }
    if (cmd === 'generate' && comps[0]) return { text: JSON.stringify(`${comps[0].req?.prompt ?? ''}${comps[0].res?.content ?? ''}`) };
    if (cmd === 'sample') return { text: t('sumDraws', comps.length) };
    if (cmd === 'tokens') {
      const tk = calls.filter((c) => c.kind === 'tokenize');
      if (tk.length === 1) return { text: t('tokensOf', countTokens(tk[0]), String(tk[0].req?.content ?? '').length) };
      return { text: t('sumCalls', tk.length) };
    }
    if (cmd === 'template') {
      const p = calls.find((c) => c.kind === 'template')?.res?.prompt ?? '';
      return { text: t('specials', (p.match(/<\|[^|<>]*\|>/g) ?? []).length) };
    }
    if (cmd === 'embed') {
      const v = calls.find((c) => c.kind === 'embed')?.res?.data?.[0]?.embedding;
      if (v) return { text: t('sumVector', v.vectorLength ?? v.length) };
    }
    if (chats.length > 1 && chats.some((c) => messageOf(c)?.tool_calls?.length)) return { text: t('sumRounds', chats.length) };
    if (chats.length) {
      const last = chats[chats.length - 1];
      const m = messageOf(last);
      const p = promptTokens(last);
      return { text: `${snip(m?.content ?? '', 60)}${p != null ? ` · ${num(p)} tokens` : ''}` };
    }
    const xs = exchanges(d);
    if (xs.length) {
      const bad = xs.find((x) => x.status >= 400);
      return { text: `${t('sumMessages', xs.length)}${bad ? ` · HTTP ${bad.status}` : ''}`, bad: !!bad };
    }
    const out = String(ev.output ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
    return { text: snip(out[out.length - 1] ?? '', 100) };
  }

  const countTokens = (c) => {
    const tk = c.res?.tokens;
    return Array.isArray(tk) ? tk.length : tk?.vectorLength ?? 0;
  };

  // ------------------------------------------------------------------------- lane 1: what reaches the model

  function chatBlocks(ev, chats, calls) {
    const nodes = [];
    const main = chats[chats.length - 1];
    const req = main.req ?? {};
    const msgs = Array.isArray(req.messages) ? req.messages : [];
    const roles = {};
    for (const m of msgs) roles[m.role] = (roles[m.role] ?? 0) + 1;
    const tags = h('div', { class: 'tags' }, Object.entries(roles).map(([r, n]) => tag(n > 1 ? `${r} × ${n}` : r, r)));
    if (Array.isArray(req.tools)) tags.append(tag(t('toolsN', req.tools.length), 'tool'));
    for (const k of ['temperature', 'seed', 'max_tokens']) if (req[k] != null) tags.append(tag(`${k} ${req[k]}`));
    if (req.response_format) tags.append(tag(`response_format ${req.response_format.type}`));
    if (req.chat_template_kwargs?.enable_thinking) tags.append(tag('enable_thinking'));
    if (req.stream) tags.append(tag('stream'));
    nodes.push(tags, h('p', { class: 'line', text: t('sent', msgs.length) }));
    const rej = chats.map(rejection).find(Boolean);
    if (rej) nodes.push(...gauge(rej.n_prompt_tokens, rej.n_ctx, t('rejected', num(rej.n_prompt_tokens), num(rej.n_ctx)), true));
    else {
      const used = Math.max(...chats.map(promptTokens).filter((n) => n != null));
      const of = contextSize(calls);
      if (Number.isFinite(used)) nodes.push(...gauge(used, of, t('context', num(used), num(of)), used > of));
    }
    if (Array.isArray(req.tools) && main.requestBody) nodes.push(h('p', { class: 'legend', text: t('toolsShare', pct(JSON.stringify(req.tools).length / main.requestBody.length)) }));
    if (chats.length > 1) {
      nodes.push(h('h3', { text: t('requests') }), table([t('hReq'), t('hMsgs'), t('hPrompt'), t('hReply')], chats.map((c, i) => {
        const m = messageOf(c);
        const reply = m?.tool_calls?.length ? t('asksFor', m.tool_calls.map((x) => x.function?.name).join(', ')) : c.status >= 400 ? `HTTP ${c.status}` : snip(m?.content ?? '', 60);
        return [String(i + 1), String(c.req?.messages?.length ?? ''), promptTokens(c) == null ? '' : num(promptTokens(c)), reply];
      }), { numeric: [0, 1, 2] }));
    }
    const timings = main.res?.timings ?? streamFinal(main)?.timings;
    if (timings && ((ev.argv ?? []).includes('--timings') || ev.argv?.[0] === 'context')) {
      const top = Math.max(timings.prompt_per_second ?? 0, timings.predicted_per_second ?? 0) || 1;
      const row = (label, speed, n) => {
        const fill = h('i');
        fill.style.width = `${Math.max(0.5, (speed / top) * 100)}%`;
        return h('div', { class: 'bar' }, h('span', { class: 'm', text: `${label} (${n})` }), h('span', { class: 'track' }, fill), h('span', { class: 'v', text: t('perSecond', num(speed, 1)) }));
      };
      nodes.push(h('h3', { text: t('speeds') }), h('div', { class: 'bars' }, row(t('reading'), timings.prompt_per_second ?? 0, timings.prompt_n), row(t('writing'), timings.predicted_per_second ?? 0, timings.predicted_n)));
    }
    const m = messageOf(main);
    if (m?.reasoning_content) nodes.push(fold(`${ev.start}:reasoning`, t('reasoning', m.reasoning_content.length), () => code(m.reasoning_content)));
    if (m?.content && !ev.data?.asks && !ev.data?.extract) nodes.push(h('h3', { text: t('answer') }), h('p', { class: 'answer', text: m.content.trim() }));
    if (main.stream) nodes.push(fold(`${ev.start}:stream`, t('stream', main.stream.length), () => code(main.stream.join('\n')), true));
    return nodes;
  }

  function completionBlocks(ev, cmd, comps) {
    const nodes = [];
    const first = comps[0];
    if (cmd === 'next') {
      nodes.push(h('p', { class: 'line' }, `${t('text')}: `, h('strong', { text: JSON.stringify(first.req?.prompt ?? '') })));
      const top = first.res?.completion_probabilities?.[0]?.top_logprobs ?? [];
      nodes.push(h('h3', { text: t('nextModel') }), bars(top.map((c) => ({ label: JSON.stringify(c.token), p: Math.exp(c.logprob) }))));
      const sampled = comps.find((c) => c.res?.completion_probabilities?.[0]?.top_probs);
      if (sampled) {
        nodes.push(h('h3', { text: t('nextSampler', sampled.req?.temperature) }), bars(sampled.res.completion_probabilities[0].top_probs.map((c) => ({ label: JSON.stringify(c.token), p: c.prob }))));
      }
    } else if (cmd === 'generate') {
      nodes.push(h('p', { class: 'line' }, `${t('text')}: `, h('strong', { text: JSON.stringify(first.req?.prompt ?? '') })), h('h3', { text: t('steps') }));
      const list = h('div', { class: 'steps' });
      (first.res?.completion_probabilities ?? []).forEach((c, i) => {
        const alts = (c.top_logprobs ?? []).filter((o) => o.token !== c.token).map((o) => `${JSON.stringify(o.token)} ${pct(Math.exp(o.logprob))}`).join('  ');
        list.append(h('div', { class: 'step' }, h('span', { text: String(i + 1) }), h('span', { class: 'chip', text: JSON.stringify(c.token) }), h('span', { text: pct(Math.exp(c.logprob)) }), h('span', { class: 'alt', text: alts })));
      });
      nodes.push(list, h('p', { class: 'line' }, `${t('result')}: `, h('strong', { text: JSON.stringify(`${first.req?.prompt ?? ''}${first.res?.content ?? ''}`) })));
    } else if (cmd === 'sample') {
      const r = first.req ?? {};
      nodes.push(h('div', { class: 'tags' }, tag(`temperature ${r.temperature}`), tag(r.seed != null ? `seed ${r.seed}` : t('noSeed')), tag(`n_predict ${r.n_predict}`)), h('h3', { text: t('draws') }),
        h('ol', { class: 'draws' }, comps.map((c) => h('li', { text: JSON.stringify(`${c.req?.prompt ?? ''}${c.res?.content ?? ''}`) }))));
    }
    return nodes;
  }

  function tokenBlocks(calls) {
    const withPieces = calls.filter((c) => c.req?.with_pieces);
    if (withPieces.length) {
      return withPieces.flatMap((c) => [
        h('p', { class: 'line', text: t('tokensOf', countTokens(c), String(c.req.content ?? '').length) }),
        h('div', { class: 'chips' }, (c.res?.tokens ?? []).map((x) => h('span', { class: 'chip', title: `id ${x.id}`, text: typeof x.piece === 'string' ? x.piece.replace(/\n/g, '\\n').replace(/\t/g, '\\t') : `<${JSON.stringify(x.piece)}>` }))),
      ]);
    }
    return [table(['#', t('hChars'), t('hTokens')], calls.map((c, i) => [String(i + 1), num(String(c.req?.content ?? '').length), num(countTokens(c))]), { numeric: [0, 1, 2] })];
  }

  function templateBlock(call) {
    const prompt = call?.res?.prompt ?? '';
    const pre = h('pre', { class: 'code' });
    for (const part of prompt.split(/(<\|[^|<>]*\|>)/)) pre.append(/^<\|[^|<>]*\|>$/.test(part) ? h('span', { class: 'special', text: part }) : part);
    return [h('h3', { text: t('template') }), h('div', { class: 'tags' }, tag(t('specials', (prompt.match(/<\|[^|<>]*\|>/g) ?? []).length))), pre];
  }

  function matrixBlock(sim) {
    const texts = sim.texts ?? [];
    const m = sim.matrix ?? [];
    let best = -Infinity;
    for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) best = Math.max(best, m[i][j]);
    const level = (v) => (v >= 0.8 ? 'l4' : v >= 0.6 ? 'l3' : v >= 0.4 ? 'l2' : v >= 0.2 ? 'l1' : '');
    const tb = h('table', { class: 'matrix' }, h('thead', null, h('tr', null, h('th', { text: '' }), texts.map((_, i) => h('th', { class: 'n', text: String(i + 1) })))));
    const body = h('tbody');
    m.forEach((row, i) => body.append(h('tr', null, h('td', { text: `${i + 1}. ${snip(texts[i], 60)}` }),
      row.map((v, j) => h('td', { class: `n ${level(v)}${i !== j && v === best ? ' strong' : ''}`, text: num(v, 3) })))));
    tb.append(body);
    return [h('h3', { text: t('similar') }), tb];
  }

  function extractBlock(x) {
    const ok = String(x.verdict).startsWith('VALID');
    return [h('div', { class: 'tags' }, tag(x.schema ? t('schema') : t('noSchema'), x.schema ? 'ok' : null)), code(pretty(x.answer)),
      h('p', { class: ok ? 'line ok' : 'line bad' }, h('strong', { text: `${t('verdict')}: ` }), x.verdict)];
  }

  function propsBlock(props, models) {
    const p = props.res ?? {};
    const meta = models?.res?.data?.[0]?.meta ?? {};
    const rows = [
      ['model', p.model_alias ?? models?.res?.data?.[0]?.id ?? ''],
      ['n_ctx', p.default_generation_settings?.n_ctx],
      ['total_slots', p.total_slots],
      ['build_info', p.build_info],
      ['n_params', meta.n_params],
      ['size', meta.size],
      ['n_vocab', meta.n_vocab],
    ].filter(([, v]) => v != null && v !== '').map(([k, v]) => [k, String(v)]);
    return [h('h3', { text: t('server') }), table(['', ''], rows, { mono: [0, 1] })];
  }

  function lane1(d) {
    const sec = h('section', null, h('h2', { text: t('lane1') }));
    const ev = d.event ?? {};
    const cmd = ev.argv?.[0];
    const data = ev.data ?? {};
    const calls = modelCalls(d);
    const chats = calls.filter((c) => c.kind === 'chat');
    const comps = calls.filter((c) => c.kind === 'completion');
    const before = sec.childNodes.length;
    if (chats.length) sec.append(...chatBlocks(ev, chats, calls));
    if (comps.length) sec.append(...completionBlocks(ev, cmd, comps));
    if (cmd === 'tokens') sec.append(...tokenBlocks(calls.filter((c) => c.kind === 'tokenize')));
    if (cmd === 'template') sec.append(...templateBlock(calls.find((c) => c.kind === 'template')));
    if (cmd === 'embed') {
      const v = calls.find((c) => c.kind === 'embed')?.res?.data?.[0]?.embedding;
      if (v) sec.append(h('p', { class: 'line', text: t('vector', v.vectorLength ?? v.length) }), code((v.first ?? v.slice(0, 8)).map((x) => num(x, 4)).join('   ')));
    }
    if (data.similar) sec.append(...matrixBlock(data.similar));
    if (data.extract) sec.append(...extractBlock(data.extract));
    const props = calls.find((c) => c.kind === 'props');
    if (props && (cmd === 'props' || cmd === 'hello')) sec.append(...propsBlock(props, calls.find((c) => c.kind === 'models')));
    if (sec.childNodes.length === before) sec.append(empty(calls.length ? t('otherCalls', calls.length) : t('noModel')));
    return sec;
  }

  // ------------------------------------------------------------------------- lane 2: the retrieval

  function retrievalBlock(key, r, ask) {
    const nodes = [];
    nodes.push(h('p', { class: 'line' }, h('strong', { text: `${t('query')}: ` }), r.query, ' ', tag(r.mode), tag(`k ${r.k}`), r.trusted ? tag('trusted', 'ok') : null));
    const cited = new Set((ask?.cited ?? []).map((n) => ask.sources?.[n - 1]).filter(Boolean));
    const hits = r.hits ?? [];
    if (r.pool?.length) {
      const was = (label) => r.pool.findIndex((p) => p.label === label) + 1;
      nodes.push(h('div', { class: 'moves' },
        h('div', null, h('h3', { text: t('before') }), h('ol', null, r.pool.map((p) => h('li', { text: p.label })))),
        h('div', null, h('h3', { text: t('after') }), h('ol', null, hits.map((x) => h('li', { text: `${x.label} · ${t('was', was(x.label))}` }))))));
    }
    nodes.push(table(['#', t('chunk'), t('trust'), t('score'), t('why')], hits.map((x, i) => [
      String(i + 1),
      h('span', null, x.label, cited.has(x.label) ? h('span', { class: 'tag ok', text: ` ✓ ${t('cited')}` }) : null),
      x.trust ? tag(x.trust, x.trust === 'external' ? 'bad' : null) : '',
      num(x.score, 4), x.why,
    ]), { mono: [1, 4], numeric: [0, 3], rowClass: (i) => (hits[i].trust === 'external' ? 'inj' : cited.has(hits[i].label) ? 'cited' : null) }));
    for (const x of hits) {
      const callout = hiddenCallout(x.text);
      if (callout) nodes.push(callout);
    }
    nodes.push(fold(`${key}:chunks`, t('chunkTexts'), () => h('div', null, hits.map((x, i) => [h('h3', { text: `[${i + 1}] ${x.label}` }), code(x.text)]))));
    return nodes;
  }

  function evalBlock(e) {
    const modes = e.modes ?? [];
    const nodes = [h('h3', { text: t('evalTitle', e.k) })];
    nodes.push(table(['id', t('question'), ...modes], (e.table ?? []).map((q) => [q.id, snip(q.question, 60), ...(q.ranks ?? []).map((r) => (r ? String(r) : '-'))]), {
      mono: [0], numeric: modes.map((_, i) => i + 2),
      foot: [[t('hitRate'), '', ...(e.hitRate ?? [])], [t('mrr'), '', ...(e.mrr ?? []).map((x) => num(x, 2))]],
    }));
    return nodes;
  }

  function answersBlock(answers) {
    return [h('h3', { text: t('answers') }), table(['id', '', '', t('judge')], answers.map((a) => [
      a.id, a.ok ? tag('ok', 'ok') : tag('FAIL', 'bad'), a.detail ?? '',
      a.judge == null ? '' : `${a.judge ? 'yes' : 'no'} · ${a.agrees ? t('agrees') : t('disagrees')}`,
    ]), { mono: [0] })];
  }

  function lane2(d) {
    const sec = h('section', null, h('h2', { text: t('lane2') }));
    const ev = d.event ?? {};
    const data = ev.data ?? {};
    const before = sec.childNodes.length;
    if (data.index) {
      const x = data.index;
      sec.append(h('p', { class: 'line', text: t('index', x.chunks, x.files, x.strategy === 'fixed' ? `fixed ${x.size}/${x.overlap}` : x.strategy) }),
        h('p', { class: 'legend', text: t('lengths', x.minLength, x.maxLength) }),
        table([t('hFile'), t('hChunks')], (x.perFile ?? []).map((f) => [f.source, String(f.chunks)]), { mono: [0], numeric: [1] }),
        h('h3', { text: t('example', `${x.example?.source} #${x.example?.chunk}`) }), code(x.example?.text));
    }
    const asks = data.asks ?? [];
    (data.retrievals ?? []).forEach((r, i) => {
      const ask = asks.find((a) => a.question === r.query) ?? asks[i];
      sec.append(...retrievalBlock(`${ev.start}:r${i}`, r, ask));
    });
    if (asks.length) {
      const chats = modelCalls(d).filter((c) => c.kind === 'chat');
      const first = chats[0];
      if (first?.req?.messages) {
        const tokens = promptTokens(first);
        sec.append(fold(`${ev.start}:prompt`, tokens == null ? t('finalPromptN') : t('finalPrompt', num(tokens)),
          () => code(first.req.messages.map((m) => `[${m.role}]\n${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`).join('\n\n'))));
      }
      for (const a of asks) {
        sec.append(h('h3', { text: t('answer') }));
        if (a.declined) sec.append(h('div', { class: 'tags' }, tag(t('declined'), 'ok')));
        sec.append(withCitations(a.answer));
      }
    }
    if (data.eval) sec.append(...evalBlock(data.eval));
    if (data.answers?.length) sec.append(...answersBlock(data.answers));
    // An agent retrieves through a tool: the MCP server searches, and its result is what the model reads.
    (data.toolCalls ?? []).filter((c) => /search/i.test(c.name) && c.result != null).forEach((c, i) => {
      sec.append(h('h3', { text: t('toolSearch', `${c.name} ${c.input ?? ''}`) }), fold(`${ev.start}:search${i}`, t('resultWhole'), () => code(pretty(c.result)), true));
    });
    if (sec.childNodes.length === before) sec.append(empty(t('noRetrieval')));
    return sec;
  }

  // ------------------------------------------------------------------------- lane 3: the calls

  /** Tool calls of the lab and of plain Spring AI: from the model's requests and the results sent back. */
  function localCalls(chats) {
    const results = new Map();
    for (const c of chats) for (const m of c.req?.messages ?? []) if (m.role === 'tool') results.set(m.tool_call_id, m.content);
    const out = [];
    for (const c of chats) for (const x of messageOf(c)?.tool_calls ?? []) out.push({ name: x.function?.name, input: x.function?.arguments, status: 'local', result: results.get(x.id) });
    return out;
  }

  function lane3(d) {
    const sec = h('section', null, h('h2', { text: t('lane3') }));
    const ev = d.event ?? {};
    const data = ev.data ?? {};
    const agent = data.agent;
    const before = sec.childNodes.length;
    if (agent?.tools?.length) {
      sec.append(h('h3', { text: t('offered') }));
      agent.tools.forEach((tool, i) => {
        const hidden = hiddenInstruction(tool.description);
        sec.append(h('div', { class: tool.offered === false ? 'toolrow off' : 'toolrow' },
          h('div', { class: 'name', text: `${tool.name} · ${tool.server}` }),
          h('div', { class: tool.readOnly ? 'what' : 'what bad', text: `${tool.readOnly ? t('readOnly') : t('changes')}${tool.offered === false ? ` · ${t('notOffered')}` : ''}` }),
          fold(`${ev.start}:desc${i}`, t('description'), () => code(tool.description), !!hidden),
          hidden ? h('div', { class: 'callout bad', text: t('hidden', hidden) }) : null));
      });
    }
    const chats = modelCalls(d).filter((c) => c.kind === 'chat');
    const calls = data.toolCalls?.length ? data.toolCalls : localCalls(chats);
    if (calls.length) {
      sec.append(h('h3', { text: t('calls') }));
      calls.forEach((c, i) => {
        const bad = c.status === 'ran' && !c.readOnly;
        const ok = c.status === 'denied';
        const what = c.status === 'local' ? t('st_local') : `${c.readOnly ? t('readOnly') : t('changes')} · ${t(`st_${c.status}`)}`;
        sec.append(h('div', { class: 'toolrow' },
          h('div', { class: 'name', text: `${c.name} ${c.input ?? ''}` }),
          h('div', { class: bad ? 'what bad' : ok ? 'what ok' : 'what', text: what }),
          c.result != null ? fold(`${ev.start}:res${i}`, t('resultWhole'), () => code(pretty(c.result)), !!hiddenInstruction(c.result)) : null,
          hiddenCallout(c.result)));
      });
    }
    if (agent?.stopped) sec.append(h('p', { class: 'line bad', text: t('stopped', agent.maxSteps) }));
    if (agent?.answer) sec.append(h('h3', { text: t('finalAnswer') }), h('p', { class: 'answer', text: agent.answer }));
    if (sec.childNodes.length === before) sec.append(empty(t('noCalls')));
    return sec;
  }

  // ------------------------------------------------------------------------- the messages on the wire

  function requestLabel(x) {
    if (!x.messages.length) return `${x.method ?? ''} ${x.path ?? ''}`.trim();
    return x.messages.map((m) => {
      const p = m.params ?? {};
      if (m.method === 'tools/call') return `tools/call ${p.name} ${snip(JSON.stringify(p.arguments ?? {}), 60)}`;
      if (m.method === 'initialize') return `initialize · ${p.protocolVersion ?? ''}`;
      if (m.method === 'resources/read') return `resources/read ${p.uri ?? ''}`;
      if (m.method === 'prompts/get') return `prompts/get ${p.name ?? ''}`;
      return m.method ?? (m.error ? 'error' : 'result');
    }).join(' + ');
  }
  function replyLabel(r) {
    if (r.error) return `error ${r.error.code}: ${snip(r.error.message, 70)}`;
    const res = r.result ?? {};
    if (res.protocolVersion) return `${res.serverInfo?.name ?? ''} · ${res.protocolVersion}`;
    if (Array.isArray(res.tools)) return t('nTools', res.tools.length);
    if (Array.isArray(res.resources)) return t('nResources', res.resources.length);
    if (Array.isArray(res.resourceTemplates)) return t('nTemplates', res.resourceTemplates.length);
    if (Array.isArray(res.prompts)) return t('nPrompts', res.prompts.length);
    if (Array.isArray(res.contents)) return snip(res.contents[0]?.text ?? '', 70);
    if (Array.isArray(res.messages)) return snip(res.messages[0]?.content?.text ?? '', 70);
    if (Array.isArray(res.content)) return `${res.isError ? 'isError · ' : ''}${snip(res.content.map((c) => c.text ?? '').join(' '), 70)}`;
    return r.method ?? snip(JSON.stringify(res), 70);
  }
  function responseLabel(x) {
    const parts = [];
    if (x.status && x.status !== 200) parts.push(String(x.status));
    parts.push(...x.replies.map(replyLabel));
    if (header(x.resHeaders, 'mcp-session-id') && x.messages.some((m) => m.method === 'initialize')) parts.push('Mcp-Session-Id');
    return parts.join(' · ') || String(x.status ?? '');
  }
  const mcpHeaders = (hd) => Object.entries(hd ?? {}).filter(([k]) => /^mcp-|^origin$/i.test(k)).map(([k, v]) => `${k}: ${snip(v, 50)}`).join('  ');

  function callLabels(c) {
    const p = pathOf(c.url);
    const host = hostOf(c.url);
    let req = `${c.method} ${p}`;
    let res = String(c.status ?? '');
    if (c.kind === 'chat') {
      req += ` · ${t('sent', c.req?.messages?.length ?? 0)}${Array.isArray(c.req?.tools) ? ` · ${t('toolsN', c.req.tools.length)}` : ''}`;
      const m = messageOf(c);
      const tokens = promptTokens(c);
      if (c.status >= 400) res += ` · ${snip(c.res?.error?.message ?? c.responseBody, 70)}`;
      else if (m?.tool_calls?.length) res += ` · ${t('asksFor', m.tool_calls.map((x) => x.function?.name).join(', '))}`;
      else res += ` · ${snip(m?.content ?? '', 50)}`;
      if (tokens != null) res += ` · ${num(tokens)} tokens`;
      if (c.stream) res += ` · ${t('stream', c.stream.length)}`;
    } else if (c.status >= 400) res += ` · ${snip(c.res?.error?.message ?? c.responseBody, 70)}`;
    return { host, req, res };
  }

  function wireDetail(item) {
    const box = h('div');
    const part = (title, headers, body, extra) => {
      box.append(h('h4', { text: title }));
      const rows = Object.entries(headers ?? {}).map(([k, v]) => [k, String(v)]);
      if (rows.length) box.append(table([t('headers'), ''], rows, { mono: [0, 1] }));
      if (body) box.append(code(pretty(body)));
      else if (!extra) box.append(empty(t('noBody')));
      if (extra) box.append(extra);
    };
    if (item.type === 'call') {
      const c = item.call;
      part(`${t('request')} · ${c.method} ${c.url}`, c.requestHeaders, c.requestBody);
      part(`${t('response')} · ${c.status}`, c.responseHeaders, c.responseBody, c.stream ? code(c.stream.join('\n')) : null);
    } else {
      const x = item.x;
      if (x.transport === 'stdio') {
        if (x.reqBody) part(`${t('request')} · stdin`, null, x.reqBody);
        if (x.resBody) part(`${t('response')} · stdout`, null, x.resBody);
      } else {
        part(`${t('request')} · ${x.method} ${x.path}`, x.reqHeaders, x.reqBody);
        part(`${t('response')} · ${x.status}`, x.resHeaders, x.resBody);
      }
    }
    return box;
  }

  function sequence(d) {
    const ev = d.event;
    const agent = header(d.rpc?.[0]?.request?.headers, 'user-agent');
    const client = d.kind === 'session'
      ? `${t('client')}${agent ? ` · ${snip(agent, 30)}` : ''}`
      : `${ev.source}${ev.argv?.[0] === 'agent' ? ' · agent' : ''}`;
    const parts = [client];
    const col = (name) => {
      let i = parts.indexOf(name);
      if (i < 0) i = parts.push(name) - 1;
      return i;
    };
    const items = [];
    const calls = d.kind === 'command' ? modelCalls(d) : [];
    calls.forEach((c) => items.push({ at: c.at, type: 'call', target: hostOf(c.url) || c.url, call: c }));
    exchanges(d).forEach((x) => items.push({ at: x.at, type: 'rpc', target: serverName(x.server), x }));
    for (const tc of ev?.data?.toolCalls ?? []) if (tc.at) items.push({ at: tc.at, type: 'decision', tc });
    if (!ev?.data?.toolCalls?.length) {
      const chats = calls.filter((c) => c.kind === 'chat');
      const seen = new Set();
      chats.forEach((c) => {
        for (const m of c.req?.messages ?? []) {
          if (m.role !== 'tool' || seen.has(m.tool_call_id)) continue;
          seen.add(m.tool_call_id);
          const asked = chats.flatMap((p) => messageOf(p)?.tool_calls ?? []).find((x) => x.id === m.tool_call_id);
          items.push({ at: c.at - 1, type: 'local', name: asked?.function?.name ?? 'tool', content: m.content });
        }
      });
    }
    items.sort((a, b) => a.at - b.at);
    for (const it of items) if (it.target) it.col = col(it.target);
    return { parts, items };
  }

  function renderSequence(d, key) {
    const { parts, items } = sequence(d);
    if (!items.length) return empty(t('noMessages'));
    const hints = toolHints(d, exchanges(d));
    const grid = h('div', { class: 'seq' });
    const columns = `repeat(${parts.length}, minmax(0, 1fr))`;
    grid.style.gridTemplateColumns = columns;
    for (const p of parts) grid.append(h('div', { class: 'head', text: p }));
    const wires = items.filter((i) => i.type === 'call' || i.type === 'rpc').length;
    const limit = state.more.has(key) ? items.length : 60;
    items.slice(0, limit).forEach((it, n) => {
      if (it.type === 'decision') {
        const c = it.tc;
        const cls = c.status === 'ran' && !c.readOnly ? 'seqnote bad' : c.status === 'denied' ? 'seqnote ok' : 'seqnote';
        grid.append(h('div', { class: cls, text: `${parts[0]}: ${c.name} ${snip(c.input, 60)} · ${t(`st_${c.status}`)}` }));
        return;
      }
      if (it.type === 'local') {
        grid.append(h('div', { class: 'seqnote', text: t('runsLocal', parts[0], it.name, snip(it.content, 90)) }));
        return;
      }
      const rowKey = `${key}:w${n}`;
      const arrows = [];
      if (it.type === 'call') {
        const l = callLabels(it.call);
        arrows.push({ label: l.req, back: false, bad: false });
        arrows.push({ label: l.res, back: true, bad: it.call.status >= 400 });
      } else {
        const x = it.x;
        const toolCall = x.messages.find((m) => m.method === 'tools/call');
        if (!x.fromServer) arrows.push({ label: requestLabel(x), sub: mcpHeaders(x.reqHeaders), back: false, bad: !!toolCall && mutating(hints, toolCall.params?.name) });
        const hidden = x.replies.some((r) => hiddenInstruction(JSON.stringify(r.result ?? '')));
        if (x.replies.length || x.status) arrows.push({ label: responseLabel(x), sub: mcpHeaders(x.resHeaders), back: true, bad: x.status >= 400 || x.replies.some((r) => r.error) || hidden });
      }
      const open = state.folds.has(rowKey) ? state.folds.get(rowKey) : wires === 1;
      const box = h('div', { class: 'wire' });
      box.hidden = !open;
      if (open) box.append(wireDetail(it));
      const toggle = () => {
        const now = box.hidden;
        box.hidden = !now;
        state.folds.set(rowKey, now);
        if (now && !box.firstChild) box.append(wireDetail(it));
      };
      for (const a of arrows) {
        const row = h('div', { class: 'msg' });
        row.style.gridTemplateColumns = columns;
        const btn = h('button', { class: `arrow${a.back ? ' back' : ''}${a.bad ? ' bad' : ''}`, type: 'button', 'aria-expanded': String(open), onclick: toggle }, a.label, a.sub ? h('span', { class: 'sub', text: a.sub }) : null);
        btn.style.gridColumn = `1 / ${it.col + 2}`;
        row.append(btn);
        grid.append(row);
      }
      grid.append(box);
    });
    const nodes = [grid];
    if (items.length > limit) {
      nodes.push(h('button', { class: 'more', type: 'button', onclick: () => { state.more.add(key); render(); } }, t('more', items.length - limit)));
    }
    if (d.event?.callsNotRecorded) nodes.push(h('p', { class: 'legend', text: t('notRecorded', d.event.callsNotRecorded) }));
    nodes.push(h('p', { class: 'legend', text: t('seqHelp') }));
    return nodes;
  }

  // ------------------------------------------------------------------------- the page

  function detail(id) {
    const e = state.index.find((x) => x.id === id);
    const d = state.details.get(id);
    const box = h('div', { class: 'detail' });
    if (!e || !d) {
      box.append(empty(t('loading')));
      return box;
    }
    const lesson = state.lessonOf.get(id);
    const info = lesson ? lessonInfo(lesson.lesson) : null;
    const pinned = state.pinned === id;
    const ev = d.event;
    const head = h('div', { class: 'dhead' },
      h('div', { class: 'row' },
        h('span', { class: 't', text: `${clock(e.start)} · ${sourceName(e)}` }),
        info ? h('span', { class: 'pill warn', text: `${t('lesson', info.id)} · ${L(info.title)}${lesson.step ? ` · ${t('step', lesson.step)}` : ''}` }) : null,
        ev && ev.exit ? h('span', { class: 'pill bad', text: t('exit', ev.exit) }) : null,
        pinned ? h('span', { class: 'pill warn', text: t('pinned') }) : null,
        h('button', { class: 'pinbtn', type: 'button', 'aria-pressed': String(pinned), onclick: () => { state.pinned = pinned ? null : id; render(); } }, pinned ? t('unpin') : t('pin'))),
      h('div', { class: 'c', text: e.kind === 'command' ? commandLine(e) : sessionLine(e, d) }),
      info?.visor ? h('p', { class: 'look' }, h('strong', { text: `${t('lookAt')}: ` }), L(info.visor)) : null,
      pinned && state.selected === id ? h('p', { class: 'legend', text: t('pinHelp') }) : null);
    box.append(head);
    if (e.kind === 'command') box.append(h('div', { class: 'lanes' }, lane1(d), lane2(d), lane3(d)));
    box.append(h('section', { class: 'wide' }, h('h2', { text: t('seq') }), renderSequence(d, id)));
    if (ev?.output) box.append(h('section', { class: 'wide' }, fold(`${id}:out`, t('terminal'), () => code(ev.output))));
    return box;
  }

  function select(id) {
    state.selected = id;
    state.follow = id === state.index[state.index.length - 1]?.id;
    render();
  }

  function render() {
    const app = document.getElementById('app');
    const asideScroll = app.querySelector('aside')?.scrollTop ?? 0;
    document.documentElement.lang = state.lang;
    document.title = `${t('title')} · LLMs, RAG & MCP`;
    const selected = state.index.find((e) => e.id === state.selected);
    const lesson = selected ? state.lessonOf.get(selected.id) : null;
    const info = lesson ? lessonInfo(lesson.lesson) : null;
    const langButton = (code1) => h('button', { type: 'button', 'aria-pressed': String(state.lang === code1), onclick: () => {
      state.lang = code1;
      try {
        localStorage.setItem('llm-visor-lang', code1);
      } catch {
        // The choice lasts until the page is reloaded.
      }
      render();
    } }, code1.toUpperCase());
    const followBox = h('input', { type: 'checkbox', checked: state.follow, onchange: (ev) => {
      state.follow = ev.target.checked;
      if (state.follow && state.index.length) state.selected = state.index[state.index.length - 1].id;
      render();
    } });
    const header1 = h('header', null,
      h('h1', { text: t('title') }),
      h('span', { class: 'pill', text: location.host }),
      h('span', { class: 'pill', text: t('sources') }),
      info ? h('span', { class: 'pill warn', text: `${t('lesson', info.id)} · ${L(info.title)}` }) : null,
      state.online ? null : h('span', { class: 'pill bad', text: t('offline') }),
      h('span', { class: 'note', text: t('note') }),
      h('div', { class: 'controls' }, h('label', null, followBox, t('follow')), h('span', { class: 'lang' }, langButton('en'), langButton('es'))));
    const aside = h('aside', null, h('h2', { text: t('log') }));
    for (const e of state.index) {
      const d = state.details.get(e.id);
      const s = summary(e, d);
      const l = state.lessonOf.get(e.id);
      aside.append(h('button', {
        type: 'button',
        class: `ev${e.id === state.selected ? ' sel' : ''}${e.id === state.pinned ? ' pin' : ''}${s.bad ? ' bad' : ''}`,
        onclick: () => select(e.id),
      },
      h('span', { class: 't', text: `${clock(e.start)} · ${sourceName(e)}${l ? ` · ${t('lesson', l.lesson)}` : ''}` }),
      h('span', { class: 'c', text: snip(e.kind === 'command' ? commandLine(e) : sessionLine(e, d), 90) }),
      s.text ? h('span', { class: 'r', text: s.text }) : null));
    }
    aside.append(h('p', { class: 'legend', text: t('logHelp') }));
    let view;
    if (!state.index.length) {
      view = h('div', { class: 'view' }, h('p', { text: t('empty') }), code('docker compose run --rm lab next "The capital of France is"'));
    } else if (state.pinned && state.selected && state.pinned !== state.selected) {
      view = h('div', { class: 'view compare' }, detail(state.pinned), detail(state.selected));
    } else {
      view = h('div', { class: 'view' }, detail(state.selected));
    }
    app.replaceChildren(header1, h('main', null, aside, view));
    const newAside = app.querySelector('aside');
    newAside.scrollTop = state.follow ? newAside.scrollHeight : asideScroll;
  }

  // ------------------------------------------------------------------------- polling

  async function getJSON(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }

  async function poll() {
    try {
      const list = await getJSON('api/events');
      let changed = !state.online;
      state.online = true;
      if (list.version !== state.version) {
        let complete = true;
        for (const e of list.events) {
          const have = state.details.get(e.id);
          if (have && have.rev === e.rev) continue;
          try {
            state.details.set(e.id, await getJSON(`api/event?id=${encodeURIComponent(e.id)}`));
          } catch {
            complete = false;
          }
        }
        const ids = new Set(list.events.map((e) => e.id));
        for (const id of [...state.details.keys()]) if (!ids.has(id)) state.details.delete(id);
        if (state.pinned && !ids.has(state.pinned)) state.pinned = null;
        state.index = list.events;
        if (state.follow || !ids.has(state.selected)) state.selected = list.events.length ? list.events[list.events.length - 1].id : null;
        if (complete) state.version = list.version;
        assignLessons();
        changed = true;
      }
      if (changed) render();
    } catch {
      if (state.online) {
        state.online = false;
        render();
      }
    }
    setTimeout(poll, 1500);
  }

  async function start() {
    try {
      state.lessons = await getJSON('lessons.json');
    } catch {
      state.lessons = null;
    }
    render();
    poll();
  }
  start();
})();
