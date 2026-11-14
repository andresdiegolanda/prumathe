/* The map of Cloudflare: every piece of the course on one scene, a card per piece, and scenarios
   that follow a request stop by stop. It keeps its own state (scenario, stop, card, playing) and is
   drawn with the palette of the active skin. Values marked as measured come from the labs. */
window.CFMap = (() => {
  const B = (en, es) => ({ en, es });
  // x, y, w, h on a 1220 x 830 scene. kind: client, find, stage, binding, after, infra, account, risk.
  const N = {
    browser: [22, 92, 146, 62, 'client', B('browser', 'navegador'), B('tracks a shipment', 'sigue un envío'), '/track/R-1042'],
    shop: [22, 166, 146, 62, 'client', B('shop app', 'app de la tienda'), B('calls the API of Rumbo', 'llama a la API de Rumbo'), 'GET /api/shipments/…'],
    carrier: [22, 240, 146, 62, 'client', B('carrier', 'transportista'), B('reports every movement', 'avisa cada movimiento'), 'POST /webhooks/…'],
    employee: [22, 314, 146, 62, 'client', B('employee', 'empleada'), B('uses the internal panel', 'entra al panel interno'), '/panel'],
    someone: [22, 388, 146, 78, 'risk', B('someone else', 'alguien más'), B('knows the origin address', 'conoce la dirección del origen'), B('illustrative', 'ilustrativo')],
    dns: [204, 92, 136, 70, 'find', B('Cloudflare DNS', 'DNS de Cloudflare'), B('proxied record', 'registro con proxy'), 'api.rumbo.example'],
    anycast: [204, 176, 136, 70, 'find', B('anycast IP', 'IP anycast'), B('announced everywhere', 'anunciada en todos lados'), B('one nearby answers', 'contesta uno cerca')],
    dnsonly: [204, 260, 136, 70, 'risk', B('DNS-only record', 'registro solo DNS'), B('straight to a server', 'directo a un servidor'), B('no edge', 'sin borde')],
    tls: [376, 92, 96, 84, 'stage', B('TLS', 'TLS'), B('ends the TLS of the visitor', 'termina el TLS del visitante'), ''],
    waf: [482, 92, 104, 84, 'stage', B('WAF', 'WAF'), B('custom, rate and managed rules', 'reglas propias, rate y administradas'), ''],
    access: [596, 92, 96, 84, 'stage', B('Access', 'Access'), B('identity before passing', 'identidad antes de pasar'), ''],
    cache: [702, 92, 96, 84, 'stage', B('Cache', 'Cache'), B('Workers Cache', 'Workers Cache'), ''],
    worker: [808, 92, 104, 84, 'stage', B('Worker', 'Worker'), B('your code', 'tu código'), 'rumbo-edge'],
    kv: [388, 226, 120, 96, 'binding', B('KV', 'KV'), B('read fast, write eventual', 'leer rápido, escribir eventual'), 'FLAGS'],
    d1: [518, 226, 120, 96, 'binding', B('D1', 'D1'), B('SQLite, with migrations', 'SQLite, con migraciones'), 'DB'],
    r2: [648, 226, 120, 96, 'binding', B('R2', 'R2'), B('objects, no egress fees', 'objetos, sin costo de salida'), 'PROOFS'],
    hyperdrive: [778, 226, 122, 96, 'binding', B('Hyperdrive', 'Hyperdrive'), B('your Postgres, pooled', 'tu Postgres, con pool'), 'PG'],
    dobj: [388, 334, 120, 100, 'binding', B('Durable Object', 'Durable Object'), B('one place per id', 'un lugar por id'), 'SHIPMENTS'],
    queue: [518, 334, 120, 100, 'binding', B('Queue', 'Queue'), B('at least once', 'al menos una vez'), 'MOVES'],
    workflow: [648, 334, 120, 100, 'binding', B('Workflow', 'Workflow'), B('steps that survive', 'pasos que sobreviven'), 'RETURNS'],
    ratelimit: [778, 334, 122, 100, 'binding', B('Rate limit', 'Rate limit'), B('a budget per key', 'un presupuesto por clave'), 'LIMITER'],
    consumer: [388, 492, 160, 96, 'after', B('queue consumer', 'consumidor de la cola'), B('batches, ack, retry', 'lotes, ack, retry'), 'movements-dead'],
    cron: [560, 492, 160, 96, 'after', B('Cron Trigger', 'Cron Trigger'), B('at a time, in UTC', 'a una hora, en UTC'), '0 3 * * *'],
    alarm: [732, 492, 168, 96, 'after', B('object alarm', 'alarma del objeto'), B('wakes one object', 'despierta a un objeto'), B('delayed after 8 s', 'demorado a los 8 s')],
    cloudflared: [950, 92, 246, 72, 'infra', B('cloudflared · Tunnel', 'cloudflared · Tunnel'), B('outbound connections to Cloudflare', 'conexiones salientes hacia Cloudflare'), ''],
    api: [950, 178, 246, 84, 'infra', B('API of Rumbo', 'API de Rumbo'), B('Spring Boot 4.1 on Java 25', 'Spring Boot 4.1 sobre Java 25'), B('origin:8080 · no port on the host', 'origin:8080 · sin puerto en el host')],
    postgres: [950, 276, 246, 72, 'infra', B('PostgreSQL 18', 'PostgreSQL 18'), B('shipments and movements', 'envíos y movimientos'), ''],
    panel: [950, 362, 246, 72, 'infra', B('internal panel', 'panel interno'), B('validates the JWT itself', 'valida el JWT por su cuenta'), ''],
    openport: [950, 448, 246, 72, 'risk', B('an open port', 'un puerto abierto'), B('a way around the edge', 'un camino que rodea el borde'), B('illustrative', 'ilustrativo')],
    wrangler: [22, 550, 152, 80, 'account', B('Wrangler', 'Wrangler'), B('dev, deploy, versions', 'dev, deploy, versions'), 'wrangler.jsonc'],
    dashboard: [186, 550, 154, 80, 'account', B('Cloudflare dashboard', 'Panel de Cloudflare'), B('zone, rules, Access', 'zona, reglas, Access'), ''],
    kit: [22, 642, 318, 86, 'account', B('the kit: wrangler dev', 'el kit: wrangler dev'), B('the same Worker, every binding simulated, no account', 'el mismo Worker, cada binding simulado, sin cuenta'), '127.0.0.1:18097/cdn-cgi/local/explorer'],
  };
  const ZONES = [
    [10, 40, 170, 440, B('Who asks', 'Quien pide'), B('people and systems', 'personas y sistemas')],
    [192, 40, 160, 440, B('Finding the edge', 'Encontrar el borde'), B('DNS and anycast', 'DNS y anycast')],
    [364, 40, 560, 700, B('The edge: one data center', 'El borde: un data center de Cloudflare'), B('every request passes these stages, in this order, where it arrived', 'cada pedido pasa por estas etapas, en este orden, donde llegó')],
    [938, 40, 270, 560, B('Your infrastructure', 'Tu infraestructura'), B('the origin of Rumbo, no inbound port', 'el origen de Rumbo, sin puertos de entrada')],
    [10, 500, 342, 240, B('Your account and your machine', 'Tu cuenta y tu máquina'), B('where it is configured and deployed', 'dónde se configura y se despliega')],
  ];
  // What it is, what it is for, what it does not do, the free plan, the lesson, and how the kit runs it.
  const C = (what, forwhat, not, free, lesson, local) => ({ what, forwhat, not, free, lesson, local });
  const L = { yes: B('local: in the kit', 'local: en el kit'), part: B('local: partly', 'local: en parte'), no: B('not in the kit', 'no está en el kit') };
  const CARDS = {
    browser: C(B('A person on a web page.', 'Una persona en una página web.'), B('The public tracking page: the same for everyone.', 'La página pública de seguimiento: igual para todos.'), B('It does not see the origin: only the edge.', 'No ve el origen: solo el borde.'), null, 10, 'yes'),
    shop: C(B('Another system calling the API with its key.', 'Otro sistema que llama a la API con su clave.'), B('Orders and tracking from the shop.', 'Pedidos y seguimiento desde la tienda.'), B('It does not share the budget of other keys.', 'No comparte el presupuesto de otras claves.'), null, 7, 'yes'),
    carrier: C(B('A carrier that posts a webhook per movement.', 'Un transportista que manda un webhook por movimiento.'), B('Movements arrive in bursts and sometimes twice.', 'Los movimientos llegan en ráfagas y a veces dos veces.'), B('It does not wait for the work: it gets 202.', 'No espera el trabajo: recibe 202.'), null, 22, 'yes'),
    employee: C(B('A person of Rumbo with a login.', 'Una persona de Rumbo con un login.'), B('The internal panel, behind Access.', 'El panel interno, detrás de Access.'), B('It does not reach the panel without identity.', 'No llega al panel sin identidad.'), null, 15, 'yes'),
    someone: C(B('Whoever was not invited: a bot, an attack, someone who found the address.', 'Quien no fue invitado: un bot, un ataque, alguien que encontró la dirección.'), B('The reason for every layer.', 'La razón de cada capa.'), B('Illustrative: the kit plays it with the lab container.', 'Ilustrativo: el kit lo representa con el contenedor del lab.'), null, 4, 'yes'),
    dns: C(B('The authoritative DNS of your zone, run by Cloudflare.', 'El DNS con autoridad de tu zona, operado por Cloudflare.'), B('A proxied record answers with anycast addresses, so requests meet the edge first.', 'Un registro con proxy responde con direcciones anycast, así los pedidos se encuentran primero con el borde.'), B('It hides the origin in DNS only, not everywhere.', 'Esconde el origen solo en el DNS, no en todos lados.'), B('Included.', 'Incluido.'), 2, 'no'),
    anycast: C(B('The same addresses announced from every data center.', 'Las mismas direcciones anunciadas desde todos los data centers.'), B('Answer from nearby and spread load and attacks.', 'Responder desde cerca y repartir carga y ataques.'), B('It does not promise the closest city: routing decides.', 'No promete la ciudad más cercana: decide el ruteo.'), B('Included.', 'Incluido.'), 1, 'no'),
    dnsonly: C(B('A record answered with its real address.', 'Un registro que se responde con su dirección real.'), B('Mail, verification and services that must not go through the edge.', 'Mail, verificaciones y servicios que no tienen que pasar por el borde.'), B('No cache, no WAF, no Workers on its way.', 'Sin cache, sin WAF, sin Workers en su camino.'), B('Included.', 'Incluido.'), 2, 'no'),
    tls: C(B('The end of the encrypted connection of the visitor, with a certificate for your zone.', 'El final de la conexión cifrada del visitante, con un certificado para tu zona.'), B('Encrypt leg 1; the encryption mode decides leg 2.', 'Cifrar el tramo 1; el modo de cifrado decide el tramo 2.'), B('The padlock says nothing of leg 2: Flexible sends it in plain HTTP.', 'El candado no dice nada del tramo 2: Flexible lo manda en HTTP plano.'), B('Included.', 'Incluido.'), 3, 'part'),
    waf: C(B('Rules on each request, in fixed phases: custom, rate limiting, managed.', 'Reglas sobre cada pedido, en fases fijas: propias, rate limiting, administradas.'), B('Stop what no code should see, before the Worker.', 'Frenar lo que ningún código debería ver, antes del Worker.'), B('It compares text: a rule without lower() misses another case.', 'Compara texto: una regla sin lower() no ve otras mayúsculas.'), B('5 custom rules, 1 rate limiting rule, the Free Managed Ruleset.', '5 reglas propias, 1 de rate limiting, el Free Managed Ruleset.'), 13, 'part'),
    access: C(B('A login in front of an application, with policies.', 'Un login delante de una aplicación, con políticas.'), B('Internal tools without a VPN; a signed JWT for the origin.', 'Herramientas internas sin VPN; un JWT firmado para el origen.'), B('It does not close the origin: the origin validates the JWT.', 'No cierra el origen: el origen valida el JWT.'), B('Zero Trust: free up to 50 users.', 'Zero Trust: gratis hasta 50 usuarios.'), 15, 'part'),
    cache: C(B('Workers Cache: a cache in front of the Worker, by the Cache-Control of its answers.', 'Workers Cache: una cache delante del Worker, según el Cache-Control de sus respuestas.'), B('Serve what is the same for everyone without running the Worker.', 'Servir lo que es igual para todos sin correr el Worker.'), B('The key has no user: never cache personal answers as public.', 'La clave no tiene usuario: nunca guardes respuestas personales como públicas.'), B('Any plan, no price of its own: each request still counts as a Worker request.', 'Cualquier plan, sin precio propio: cada pedido sigue contando como pedido del Worker.'), 10, 'no'),
    worker: C(B('Your code, in a V8 isolate of the data center that got the request.', 'Tu código, en un isolate de V8 del data center que recibió el pedido.'), B('Decide, rewrite, answer or forward; reach the bindings.', 'Decidir, reescribir, responder o reenviar; llegar a los bindings.'), B('No global state you can trust; no Java.', 'Sin estado global confiable; sin Java.'), B('100,000 requests a day, 10 ms of CPU each.', '100.000 pedidos por día, 10 ms de CPU cada uno.'), 5, 'yes'),
    kv: C(B('A key-value store, cached near its readers.', 'Un almacén de clave y valor, en cache cerca de sus lectores.'), B('Flags, configuration, allow lists.', 'Flags, configuración, listas de permitidos.'), B('Not a counter: eventual and without atomic operations.', 'No es un contador: eventual y sin operaciones atómicas.'), B('100,000 reads and 1,000 writes a day.', '100.000 lecturas y 1.000 escrituras por día.'), 16, 'yes'),
    d1: C(B('A managed SQL database with the SQL of SQLite.', 'Una base SQL administrada con el SQL de SQLite.'), B('Tables the edge reads and writes: the quotes of Rumbo.', 'Tablas que el borde lee y escribe: las cotizaciones de Rumbo.'), B('Not your big relational database: one primary per database.', 'No es tu base relacional grande: una principal por base.'), B('10 databases, 5 GB, 5 million rows read a day.', '10 bases, 5 GB, 5 millones de filas leídas por día.'), 17, 'yes'),
    r2: C(B('Object storage with an S3-compatible API.', 'Almacenamiento de objetos con una API compatible con S3.'), B('Files read by many: the proofs of delivery.', 'Archivos que leen muchos: los comprobantes de entrega.'), B('No egress fees, but storage and operations are counted.', 'Sin costo de salida, pero se cuentan el almacenamiento y las operaciones.'), B('10 GB-month, 1 million Class A, 10 million Class B a month.', '10 GB-mes, 1 millón Clase A, 10 millones Clase B por mes.'), 18, 'yes'),
    hyperdrive: C(B('A pool and a query cache between Workers and your own database.', 'Un pool y una cache de consultas entre Workers y tu propia base.'), B('Reach PostgreSQL from many data centers without a connection per request.', 'Llegar a PostgreSQL desde muchos data centers sin una conexión por pedido.'), B('It does not replicate your data, nor invalidate its cache on writes.', 'No replica tus datos, ni invalida su cache cuando hay escrituras.'), B('100,000 queries a day.', '100.000 consultas por día.'), 21, 'part'),
    dobj: C(B('An instance of your class, one per id, in one place.', 'Una instancia de tu clase, una por id, en un lugar.'), B('Counters, live state, coordination: one call at a time.', 'Contadores, estado en vivo, coordinación: una llamada por vez.'), B('Not one global table: one object queues every caller.', 'No es una tabla global: un objeto hace hacer cola a todos.'), B('SQLite backend only; 5 GB in total.', 'Solo backend SQLite; 5 GB en total.'), 19, 'yes'),
    queue: C(B('Messages from a producer to a consumer, in batches.', 'Mensajes de un productor a un consumidor, en lotes.'), B('Answer now, work later, absorb bursts.', 'Responder ahora, trabajar después, absorber ráfagas.'), B('Not exactly once: duplicates are rare but possible.', 'No es exactamente una vez: los duplicados son raros pero posibles.'), B('10,000 operations a day, 24 hours of retention.', '10.000 operaciones por día, 24 horas de retención.'), 22, 'yes'),
    workflow: C(B('A process of steps whose results are stored.', 'Un proceso de pasos cuyos resultados se guardan.'), B('Returns that wait days for a person, with retries per step.', 'Devoluciones que esperan días a una persona, con reintentos por paso.'), B('Not a place for heavy computation: each step is a Worker invocation.', 'No es lugar para cálculo pesado: cada paso es una invocación de Worker.'), B('3,000 steps a day.', '3.000 pasos por día.'), 23, 'yes'),
    ratelimit: C(B('A counter per key in a window of 10 or 60 seconds, from the Worker.', 'Un contador por clave en una ventana de 10 o 60 segundos, desde el Worker.'), B('A budget per API key, user or tenant.', 'Un presupuesto por API key, usuario o tenant.'), B('Not exact: per location and eventually consistent.', 'No es exacto: por lugar y eventualmente consistente.'), null, 14, 'yes'),
    consumer: C(B('The queue handler of a Worker.', 'El handler queue de un Worker.'), B('Process each message, ack or retry; a dead letter queue at the end.', 'Procesar cada mensaje, ack o retry; una cola de mensajes muertos al final.'), B('It must be idempotent: the same message may come twice.', 'Tiene que ser idempotente: el mismo mensaje puede llegar dos veces.'), null, 22, 'yes'),
    cron: C(B('A schedule that runs the scheduled handler.', 'Un horario que corre el handler scheduled.'), B('The daily close of Rumbo at 03:00 UTC.', 'El cierre diario de Rumbo a las 03:00 UTC.'), B('Not in your time zone: in UTC. Changes take up to 15 minutes.', 'No en tu zona horaria: en UTC. Los cambios tardan hasta 15 minutos.'), B('5 Cron Triggers per account.', '5 Cron Triggers por cuenta.'), 24, 'part'),
    alarm: C(B('One scheduled wake-up per Durable Object.', 'Un despertador programado por Durable Object.'), B('Notice silence: a shipment with no movement becomes delayed.', 'Notar el silencio: un envío sin movimientos queda demorado.'), B('Not more than one at a time per object.', 'No más de una por vez por objeto.'), null, 20, 'yes'),
    cloudflared: C(B('The program next to your service that opens the tunnel.', 'El programa al lado de tu servicio que abre el túnel.'), B('Publish without an inbound port or a public IP.', 'Publicar sin puerto de entrada ni IP pública.'), B('It does not close other ways in.', 'No cierra otras entradas.'), B('All plans.', 'Todos los planes.'), 4, 'part'),
    api: C(B('The Spring Boot API of Rumbo: the origin.', 'La API de Spring Boot de Rumbo: el origen.'), B('The business: shipments, movements, the panel.', 'El negocio: envíos, movimientos, el panel.'), B('It does not trust the edge blindly: it validates tokens.', 'No confía ciegamente en el borde: valida tokens.'), null, 0, 'yes'),
    postgres: C(B('The database of the origin.', 'La base del origen.'), B('The source of truth for shipments.', 'La fuente de verdad de los envíos.'), B('It is not in Cloudflare: Hyperdrive and the origin reach it.', 'No está en Cloudflare: llegan Hyperdrive y el origen.'), null, 21, 'yes'),
    panel: C(B('An internal page for the people of Rumbo.', 'Una página interna para la gente de Rumbo.'), B('Operations: who approves a return.', 'Operaciones: quién aprueba una devolución.'), B('It does not let in a token of another application, expired or changed.', 'No deja entrar un token de otra aplicación, vencido o cambiado.'), null, 15, 'yes'),
    openport: C(B('A public port the origin still listens on.', 'Un puerto público en el que el origen sigue escuchando.'), B('Nothing: it is the risk the tunnel leaves if you forget it.', 'Nada: es el riesgo que deja el túnel si te olvidás.'), B('Cloudflare does not protect requests that never reach it.', 'Cloudflare no protege pedidos que nunca le llegan.'), null, 4, 'yes'),
    wrangler: C(B('The command line of Workers.', 'La línea de comandos de Workers.'), B('dev, deploy, versions, tail, d1, kv, r2.', 'dev, deploy, versions, tail, d1, kv, r2.'), B('It is moving to cf, in open beta since 28 September 2026.', 'Se está pasando a cf, en beta abierta desde el 28 de septiembre de 2026.'), null, 6, 'yes'),
    dashboard: C(B('The web interface of your account.', 'La interfaz web de tu cuenta.'), B('Zone, DNS, rules, Access, logs, versions.', 'Zona, DNS, reglas, Access, logs, versiones.'), B('Cron Triggers are managed in the configuration file, not here.', 'Los Cron Triggers se manejan en el archivo de configuración, no acá.'), null, 9, 'no'),
    // Not a piece of the scene: the live viewer of the kit draws it, with this card.
    cacheapi: C(B('The cache of one data center, from your code: caches.default, with match, put and delete.', 'La cache de un data center, desde tu código: caches.default, con match, put y delete.'), B('Keep what the Worker computed, under a key it chooses: the rates of Rumbo.', 'Guardar lo que calculó el Worker, bajo una clave que elige: las tarifas de Rumbo.'), B('It does not replicate: delete purges this data center only.', 'No se replica: delete purga solo este data center.'), B('Any plan.', 'Cualquier plan.'), 12, 'yes'),
    kit: C(B('wrangler dev in Docker, with the origin and the database of Rumbo.', 'wrangler dev en Docker, con el origen y la base de Rumbo.'), B('Every lesson, with no account.', 'Cada lección, sin cuenta.'), B('No anycast, no zone, no Workers Cache, no pool in Hyperdrive.', 'Sin anycast, sin zona, sin Workers Cache, sin pool en Hyperdrive.'), B('Free: it runs on your machine.', 'Gratis: corre en tu máquina.'), 0, 'yes'),
  };
  const S = (node, title, text) => ({ node, title, text });
  const SCENARIOS = [
    { id: 'A', group: 'map', name: B('What is in each zone', 'Qué hay en cada zona'), stops: [
      S('browser', B('Who asks', 'Quien pide'), B('People and systems on the internet: a customer, the app of a shop, a carrier, an employee, and someone nobody invited.', 'Personas y sistemas en internet: una clienta, la app de una tienda, un transportista, una empleada, y alguien a quien nadie invitó.')),
      S('dns', B('Finding the edge', 'Encontrar el borde'), B('Before any server sees a request, DNS and anycast decide where it goes.', 'Antes de que un servidor vea un pedido, el DNS y anycast deciden adónde va.')),
      S('tls', B('The stages of the edge', 'Las etapas del borde'), B('TLS, WAF, Access, cache and your Worker, in this order, in the data center that received the request.', 'TLS, WAF, Access, cache y tu Worker, en este orden, en el data center que recibió el pedido.')),
      S('kv', B('The bindings', 'Los bindings'), B('Storage and services the Worker reaches by name, each with its own guarantee.', 'Almacenamiento y servicios a los que el Worker llega por nombre, cada uno con su garantía.')),
      S('api', B('Your infrastructure', 'Tu infraestructura'), B('The origin of Rumbo and its database, with no inbound port open.', 'El origen de Rumbo y su base, sin puertos de entrada abiertos.')),
      S('kit', B('Your account and your machine', 'Tu cuenta y tu máquina'), B('Where you configure and deploy; the kit runs all of it with no account.', 'Dónde configurás y desplegás; el kit corre todo esto sin cuenta.')),
    ] },
    { id: 'B', group: 'paths', name: B('A public tracking page', 'Una página pública de seguimiento'), stops: [
      S('browser', B('A customer opens the page', 'Una clienta abre la página'), B('GET /track/R-1042: the same page for everyone who follows that shipment.', 'GET /track/R-1042: la misma página para todos los que siguen ese envío.')),
      S('dns', B('DNS answers with the edge', 'El DNS responde con el borde'), B('The record is proxied: the answer is an anycast address of Cloudflare, not the origin.', 'El registro va con proxy: la respuesta es una dirección anycast de Cloudflare, no el origen.')),
      S('anycast', B('A nearby data center', 'Un data center cercano'), B('Routing takes the request to a data center, usually a nearby one.', 'El ruteo lleva el pedido a un data center, en general cercano.')),
      S('tls', B('TLS ends here', 'TLS termina acá'), B('Leg 1 is encrypted with the certificate of the zone; leg 2 is Full (strict).', 'El tramo 1 va cifrado con el certificado de la zona; el tramo 2 es Full (strict).')),
      S('waf', B('The rules let it pass', 'Las reglas lo dejan pasar'), B('Nothing in the custom, rate limiting or managed rules matches.', 'Nada de las reglas propias, de rate limiting o administradas coincide.')),
      S('cache', B('MISS, the first time', 'MISS, la primera vez'), B('No stored copy for this URL yet: the Worker runs.', 'Todavía no hay copia guardada para esta URL: corre el Worker.')),
      S('worker', B('The Worker forwards it', 'El Worker lo reenvía'), B('The gateway adds x-rumbo-request-id and calls the origin through the tunnel.', 'El gateway agrega x-rumbo-request-id y llama al origen por el túnel.')),
      S('api', B('The origin allows a shared copy', 'El origen permite una copia compartida'), B('Cache-Control: max-age=60, public. Measured in the kit.', 'Cache-Control: max-age=60, public. Medido en el kit.')),
      S('cache', B('HIT, for a minute', 'HIT, por un minuto'), B('The next visitors get the stored copy; the Worker does not run, so it uses no CPU.', 'Los siguientes visitantes reciben la copia guardada; el Worker no corre, así que no usa CPU.')),
    ] },
    { id: 'C', group: 'paths', name: B('A call to the API', 'Una llamada a la API'), stops: [
      S('shop', B('The shop asks for a shipment', 'La tienda pide un envío'), B('GET /api/shipments/R-1042 with its x-api-key.', 'GET /api/shipments/R-1042 con su x-api-key.')),
      S('dns', B('To the edge', 'Al borde'), B('A proxied record, an anycast address.', 'Un registro con proxy, una dirección anycast.')),
      S('tls', B('TLS', 'TLS'), B('The connection of the app ends at the edge.', 'La conexión de la app termina en el borde.')),
      S('waf', B('The rules', 'Las reglas'), B('/api/admin would be blocked here; /api/shipments passes.', '/api/admin se bloquearía acá; /api/shipments pasa.')),
      S('cache', B('BYPASS', 'BYPASS'), B('The API answers no-store: nothing to keep.', 'La API responde no-store: nada que guardar.')),
      S('worker', B('The gateway decides', 'El gateway decide'), B('Before the origin: the budget of the key and the maintenance flag.', 'Antes del origen: el presupuesto de la clave y la flag de mantenimiento.')),
      S('ratelimit', B('The budget of the key', 'El presupuesto de la clave'), B('5 requests per 10 seconds per key. Measured: 200 200 200 200 200 429 429.', '5 pedidos cada 10 segundos por clave. Medido: 200 200 200 200 200 429 429.')),
      S('kv', B('The maintenance flag', 'La flag de mantenimiento'), B('off: the request goes on. With on, the edge answers 503.', 'off: el pedido sigue. Con on, el borde responde 503.')),
      S('cloudflared', B('Through the tunnel', 'Por el túnel'), B('The request enters the private network through a connection cloudflared opened.', 'El pedido entra a la red privada por una conexión que abrió cloudflared.')),
      S('api', B('The origin answers', 'El origen responde'), B('servedBy rumbo-origin, no-store; the edge adds x-rumbo-via: edge.', 'servedBy rumbo-origin, no-store; el borde agrega x-rumbo-via: edge.')),
    ] },
    { id: 'D', group: 'paths', name: B('The webhook of a carrier', 'El webhook de un transportista'), stops: [
      S('carrier', B('A movement arrives', 'Llega un movimiento'), B('POST /webhooks/movement: m-1, R-1042, delivered.', 'POST /webhooks/movement: m-1, R-1042, delivered.')),
      S('worker', B('202 at once', '202 enseguida'), B('The Worker sends the message to the queue and answers; the carrier does not wait for the work.', 'El Worker manda el mensaje a la cola y responde; el transportista no espera el trabajo.')),
      S('queue', B('Into the queue', 'A la cola'), B('At least once: a batch every 2 seconds in the kit, up to 5 by default.', 'Al menos una vez: un lote cada 2 segundos en el kit, hasta 5 por defecto.')),
      S('consumer', B('The consumer takes the batch', 'El consumidor toma el lote'), B('attempts: 1. It calls the origin with the movement.', 'attempts: 1. Llama al origen con el movimiento.')),
      S('api', B('Stored once', 'Guardado una vez'), B('The event id is the primary key: the same message twice changes nothing. Measured: already saved.', 'El id del evento es la clave primaria: el mismo mensaje dos veces no cambia nada. Medido: already saved.')),
      S('dobj', B('The shipment object', 'El objeto del envío'), B('Shipment R-1042 takes the new status and pushes it to its watchers.', 'Shipment R-1042 toma el estado nuevo y se lo manda a quienes lo miran.')),
      S('alarm', B('No alarm after delivered', 'Sin alarma después de delivered'), B('A final status cancels the alarm; any other one sets it again.', 'Un estado final cancela la alarma; cualquier otro la vuelve a programar.')),
      S('browser', B('The page updates', 'La página se actualiza'), B('Through the WebSocket of the object: no polling.', 'Por el WebSocket del objeto: sin consultar cada tanto.')),
    ] },
    { id: 'E', group: 'paths', name: B('An employee opens the panel', 'Una empleada entra al panel'), stops: [
      S('employee', B('Ana opens the panel', 'Ana abre el panel'), B('panel.rumbo.example, from home, with no VPN.', 'panel.rumbo.example, desde su casa, sin VPN.')),
      S('tls', B('TLS', 'TLS'), B('Leg 1 at the edge.', 'El tramo 1 en el borde.')),
      S('access', B('Access asks who she is', 'Access pregunta quién es'), B('She signs in with the identity provider; a policy allows the people of operations.', 'Entra con el proveedor de identidad; una política permite a la gente de operaciones.')),
      S('access', B('A signed JWT', 'Un JWT firmado'), B('The edge adds Cf-Access-Jwt-Assertion: iss the team, aud the application, exp in minutes.', 'El borde agrega Cf-Access-Jwt-Assertion: iss el equipo, aud la aplicación, exp en minutos.')),
      S('cloudflared', B('Through the tunnel', 'Por el túnel'), B('The panel has no public port either.', 'El panel tampoco tiene puerto público.')),
      S('panel', B('The origin validates it', 'El origen lo valida'), B('Signature, audience, issuer and expiry. Measured with the test issuer: 200 for the right token, 401 for the others.', 'Firma, audiencia, emisor y vencimiento. Medido con el emisor de prueba: 200 para el token correcto, 401 para los demás.')),
    ] },
    { id: 'F', group: 'paths', name: B('A return that waits for approval', 'Una devolución que espera aprobación'), stops: [
      S('shop', B('A return is requested', 'Se pide una devolución'), B('POST /returns/r-1 for R-1043, wrong size.', 'POST /returns/r-1 para R-1043, wrong size.')),
      S('worker', B('The Worker starts an instance', 'El Worker arranca una instancia'), B('The id r-1 makes a repeated request harmless: already_exists.', 'El id r-1 vuelve inofensivo un pedido repetido: already_exists.')),
      S('workflow', B('Registered, then waiting', 'Registrada, y esperando'), B('step.do stores the registration; waitForEvent waits for approved. Nothing runs meanwhile.', 'step.do guarda el registro; waitForEvent espera approved. Mientras tanto no corre nada.')),
      S('employee', B('A person approves', 'Una persona aprueba'), B('From the panel, an approved event with her name.', 'Desde el panel, un evento approved con su nombre.')),
      S('workflow', B('The refund fails once', 'El reintegro falla una vez'), B('Only that step is retried. Measured: attempts 2.', 'Solo ese paso se reintenta. Medido: attempts 2.')),
      S('workflow', B('Complete', 'Completa'), B('Notified, and the outputs of every step stored.', 'Avisada, y las salidas de cada paso guardadas.')),
    ] },
    { id: 'G', group: 'fail', name: B('A dead origin, a message that fails, and someone at the origin', 'Un origen caído, un mensaje que falla y alguien en el origen'), stops: [
      S('worker', B('The origin does not answer', 'El origen no responde'), B('fetch fails and the gateway answers 502, origin unreachable: a test of lesson 08 covers it.', 'fetch falla y el gateway responde 502, origin unreachable: una prueba de la lección 08 lo cubre.')),
      S('carrier', B('A status the origin rejects', 'Un estado que el origen rechaza'), B('m-2, lost in space: the origin answers 422.', 'm-2, lost in space: el origen responde 422.')),
      S('consumer', B('Retried, then dead', 'Reintentado, y después muerto'), B('Three attempts, then movements-dead. Measured in about eight seconds.', 'Tres intentos, y después movements-dead. Medido en unos ocho segundos.')),
      S('alarm', B('A carrier goes silent', 'Un transportista se calla'), B('No movement in 8 seconds: the alarm marks the shipment delayed.', 'Sin movimientos en 8 segundos: la alarma marca el envío demorado.')),
      S('someone', B('Someone finds the origin', 'Alguien encuentra el origen'), B('An old DNS-only record leaked its address.', 'Un registro viejo solo DNS filtró su dirección.')),
      S('openport', B('A port left open', 'Un puerto que quedó abierto'), B('This path never meets the edge: no WAF, no Access, no cache.', 'Este camino nunca pasa por el borde: sin WAF, sin Access, sin cache.')),
      S('panel', B('The origin still asks for proof', 'El origen igual pide prueba'), B('No valid token, 401. Measured: lab panel --direct.', 'Sin token válido, 401. Medido: lab panel --direct.')),
    ] },
  ];

  let st = { scenario: 'A', stop: 0, card: null, playing: false, timer: null, zoom: 'full', follow: true };
  try {
    const saved = JSON.parse(localStorage.getItem('cf-course-map') || '{}');
    if (SCENARIOS.some((x) => x.id === saved.scenario)) st.scenario = saved.scenario;
  } catch {}
  const scen = () => SCENARIOS.find((x) => x.id === st.scenario);
  const esc = (x) => String(x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  /* Words into lines of at most max characters: the scene is SVG, which does not wrap text. */
  function wrap(str, max) {
    const lines = [];
    let line = '';
    for (const w of String(str).split(' ')) {
      if (line && (line + ' ' + w).length > max) { lines.push(line); line = w; } else line = line ? line + ' ' + w : w;
    }
    if (line) lines.push(line);
    return lines;
  }

  function scene(o) {
    const P = window.CFVisuals.palette(o.theme);
    const L1 = (x) => (typeof x === 'string' ? x : x?.[o.lang] || '');
    const s = scen(), stops = s.stops.slice(0, st.stop + 1);
    const current = s.stops[st.stop].node;
    const visited = new Map();
    stops.forEach((x, i) => visited.set(x.node, i + 1));
    const color = { client: P.blue, find: P.blue, stage: P.orange, binding: P.green, after: P.purple, infra: P.blue, account: P.purple, risk: P.red };
    const parts = [];
    parts.push(`<defs><marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${P.orange}"/></marker></defs>`);
    for (const [x, y, w, h, title, sub] of ZONES) parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${P.panel}" stroke="${P.line}"/><text x="${x + 12}" y="${y + 22}" font-size="13" font-weight="600" fill="${P.ink}">${esc(L1(title))}</text><text x="${x + 12}" y="${y + 37}" font-size="10" fill="${P.muted}">${esc(L1(sub))}</text>`);
    parts.push(`<rect x="376" y="196" width="536" height="250" rx="9" fill="none" stroke="${P.blue}" stroke-dasharray="5 4"/><text x="388" y="214" font-size="11" fill="${P.blue}" font-family="ui-monospace,Consolas,monospace">${esc(o.lang === 'es' ? 'bindings del Worker, en wrangler.jsonc' : 'bindings of the Worker, in wrangler.jsonc')}</text>`);
    parts.push(`<rect x="376" y="462" width="536" height="140" rx="9" fill="none" stroke="${P.line}"/><text x="388" y="480" font-size="11" fill="${P.muted}" font-family="ui-monospace,Consolas,monospace">${esc(o.lang === 'es' ? 'lo que corre después del pedido' : 'what runs after the request')}</text>`);
    parts.push(`<rect x="376" y="616" width="536" height="112" rx="9" fill="none" stroke="${P.line}" stroke-dasharray="3 4"/><text x="388" y="636" font-size="11" fill="${P.muted}" font-family="ui-monospace,Consolas,monospace">${esc(o.lang === 'es' ? 'otros data centers' : 'other data centers')}</text>`);
    const others = o.lang === 'es' ? ['La cache y la Cache API son de cada data center. KV se replica a todos.', 'Un Durable Object vive en un solo lugar y los demás le hablan a ese.', 'D1 tiene una base principal y réplicas de lectura (beta).'] : ['The cache and the Cache API belong to each data center. KV replicates to all.', 'A Durable Object lives in one place and the others talk to it.', 'D1 has a primary database and read replicas (beta).'];
    others.forEach((x, i) => parts.push(`<text x="388" y="${658 + i * 18}" font-size="10.5" fill="${P.muted}">${esc(x)}</text>`));
    parts.push(`<g stroke="${P.line}" stroke-width="1.5" fill="none">${[[472, 134, 480], [586, 134, 594], [692, 134, 700], [798, 134, 806]].map(([a, y, b]) => `<path d="M${a} ${y}H${b}"/>`).join('')}</g>`);
    for (const [id, [x, y, w, h, kind, title, sub, extra]] of Object.entries(N)) {
      const on = id === current, seen = visited.has(id), picked = id === st.card;
      const stroke = on ? P.orange : picked ? P.green : color[kind];
      const fill = on ? P.amber : seen ? P.mint : P.white;
      const dash = kind === 'risk' ? ' stroke-dasharray="4 4"' : '';
      // Title in monospace, shrunk to fit; the subtitle wrapped; the extra line only if it fits.
      const name = L1(title), room = w - (seen ? 34 : 18);
      const size = Math.max(9, Math.min(12, room / (name.length * 0.62)));
      const extraText = L1(extra);
      const subLines = wrap(L1(sub), Math.floor((w - 18) / 5.4)).slice(0, extraText ? 2 : 3);
      let ty = y + 34;
      const subSvg = subLines.map((line) => `<text x="${x + 10}" y="${(ty += 13) - 13}" font-size="10" fill="${P.muted}">${esc(line)}</text>`).join('');
      const extraSvg = extraText && ty + 4 < y + h && extraText.length * 6.1 < w - 16 ? `<text x="${x + 10}" y="${ty + 4}" font-size="10" fill="${P.muted}" font-family="ui-monospace,Consolas,monospace">${esc(extraText)}</text>` : '';
      parts.push(`<g class="map-node" tabindex="0" role="button" data-map-node="${id}" aria-label="${esc(name)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${on || picked ? 3 : 1.5}"${dash}/><text x="${x + 10}" y="${y + 19}" font-size="${size.toFixed(1)}" font-family="ui-monospace,Consolas,monospace" fill="${P.ink}">${esc(name)}</text>${subSvg}${extraSvg}${seen ? `<circle cx="${x + w - 12}" cy="${y + 12}" r="9" fill="${on ? P.orange : P.green}"/><text x="${x + w - 12}" y="${y + 16}" font-size="10" text-anchor="middle" fill="${P.white}" font-weight="700">${visited.get(id)}</text>` : ''}</g>`);
    }
    if (st.stop > 0) {
      const from = N[s.stops[st.stop - 1].node], to = N[current];
      if (from !== to) {
        const x1 = from[0] + from[2] / 2, y1 = from[1] + from[3] / 2, x2 = to[0] + to[2] / 2, y2 = to[1] + to[3] / 2;
        const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 40;
        parts.push(`<path class="map-flight" d="M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="${P.orange}" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#map-arrow)"/>`);
      }
    }
    return `<svg viewBox="0 0 1220 760" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="${esc(o.lang === 'es' ? 'El mapa de Cloudflare' : 'The map of Cloudflare')}" style="font-family:Segoe UI,system-ui,sans-serif">${parts.join('')}</svg>`;
  }

  function card(o, id) {
    const c = CARDS[id], n = N[id];
    const L1 = (x) => (typeof x === 'string' ? x : x?.[o.lang] || '');
    const t = (en, es) => (o.lang === 'es' ? es : en);
    const lesson = o.lessons[c.lesson];
    return `<div class="map-card"><h3>${esc(L1(n[5]))}</h3><dl><dt>${t('What it is', 'Qué es')}</dt><dd>${esc(L1(c.what))}</dd><dt>${t('What it is for', 'Para qué sirve')}</dt><dd>${esc(L1(c.forwhat))}</dd><dt>${t('What it does not do', 'Qué no hace')}</dt><dd>${esc(L1(c.not))}</dd>${c.free ? `<dt>${t('Free plan', 'Plan gratuito')}</dt><dd>${esc(L1(c.free))}</dd>` : ''}</dl><div class="map-tags"><a class="map-tag lesson" href="${o.link(lesson)}">${t('Lesson', 'Lección')} ${String(lesson.id).padStart(2, '0')}</a><span class="map-tag ${c.local}">${esc(L1(L[c.local]))}</span></div></div>`;
  }

  function view(o) {
    const t = (en, es) => (o.lang === 'es' ? es : en);
    const L1 = (x) => x?.[o.lang] || '';
    const s = scen(), stop = s.stops[st.stop];
    const groups = [['map', t('The map', 'El mapa')], ['paths', t('Paths of a request', 'Recorridos de un pedido')], ['fail', t('When something fails', 'Cuando algo falla')]];
    const list = groups.map(([g, name]) => `<div class="map-group">${name}</div>${SCENARIOS.filter((x) => x.group === g).map((x) => `<button class="map-scenario ${x.id === st.scenario ? 'active' : ''}" data-map-scenario="${x.id}" aria-pressed="${x.id === st.scenario}"><span class="map-letter">${x.id}</span><span>${esc(L1(x.name))}<small>${x.id === st.scenario ? t(`stop ${st.stop + 1} of ${x.stops.length}`, `parada ${st.stop + 1} de ${x.stops.length}`) : t(`${x.stops.length} stops`, `${x.stops.length} paradas`)}</small></span></button>`).join('')}`).join('');
    const picked = st.card || stop.node;
    return `<div class="map-layout"><nav class="map-scenarios" aria-label="${t('Scenarios', 'Escenarios')}"><h1>${t('The map of Cloudflare', 'El mapa de Cloudflare')}</h1><p>${t('Every piece of the course in its place. Pick a scenario and follow it stop by stop; select any piece for its card.', 'Cada pieza del curso en su lugar. Elegí un escenario y seguilo parada por parada; tocá cualquier pieza para ver su ficha.')}</p>${list}</nav><section class="map-canvas" aria-label="${t('Map', 'Mapa')}"><div class="map-scroll ${st.zoom}">${scene(o)}</div></section><aside class="map-panel" aria-live="polite"><span class="eyebrow">${s.id} · ${esc(L1(s.name))} · ${t(`stop ${st.stop + 1} of ${s.stops.length}`, `parada ${st.stop + 1} de ${s.stops.length}`)}</span><h2>${esc(L1(stop.title))}</h2><p>${esc(L1(stop.text))}</p>${card(o, picked)}</aside><div class="map-controls"><button class="btn" data-map-act="first" aria-label="${t('First stop', 'Primera parada')}">⏮</button><button class="btn" data-map-act="prev" aria-label="${t('Previous stop', 'Parada anterior')}" ${st.stop === 0 ? 'disabled' : ''}>◀</button><button class="btn primary" data-map-act="play">${st.playing ? t('Pause', 'Pausa') : t('Play', 'Reproducir')}</button><button class="btn" data-map-act="next" aria-label="${t('Next stop', 'Parada siguiente')}" ${st.stop === s.stops.length - 1 ? 'disabled' : ''}>▶</button><button class="btn" data-map-act="zoom" aria-pressed="${st.zoom === 'fit'}">${st.zoom === 'fit' ? t('Actual size', 'Tamaño real') : t('See it all', 'Ver todo')}</button><span class="map-phrase">${esc(L1(stop.title))}</span></div></div>`;
  }

  function bind(root, o) {
    if (!root) return;
    // The page re-renders on a change of language or skin: the timer always uses the latest root and options.
    st.root = root;
    st.o = o;
    const rerender = () => {
      const r = st.root, opts = st.o;
      const scroll = r.querySelector('.map-scroll');
      const left = scroll ? scroll.scrollLeft : 0, top = scroll ? scroll.scrollTop : 0;
      r.innerHTML = view(opts);
      bind(r, opts);
      const again = r.querySelector('.map-scroll');
      if (again) { again.scrollLeft = left; again.scrollTop = top; }
      try { localStorage.setItem('cf-course-map', JSON.stringify({ scenario: st.scenario })); } catch {}
    };
    const go = (n) => {
      st.stop = Math.max(0, Math.min(scen().stops.length - 1, n));
      st.card = null;
      rerender();
      follow();
    };
    // At actual size, bring the piece of the current stop into view.
    const follow = () => {
      const r = st.root, scroll = r.querySelector('.map-scroll'), svg = scroll?.querySelector('svg');
      if (!svg || st.zoom !== 'full') return;
      const n = N[scen().stops[st.stop].node], k = svg.clientWidth / 1220;
      const cx = (n[0] + n[2] / 2) * k, cy = (n[1] + n[3] / 2) * k;
      scroll.scrollTo({ left: Math.max(0, cx - scroll.clientWidth / 2), top: Math.max(0, cy - scroll.clientHeight / 2), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    const stopPlay = () => { st.playing = false; clearInterval(st.timer); st.timer = null; };
    root.querySelectorAll('[data-map-scenario]').forEach((b) => (b.onclick = () => { stopPlay(); st.scenario = b.dataset.mapScenario; go(0); }));
    root.querySelectorAll('[data-map-node]').forEach((g) => {
      const pick = () => { st.card = g.dataset.mapNode; rerender(); st.root.querySelector(`[data-map-node="${st.card}"]`)?.focus(); };
      g.onclick = pick;
      g.onkeydown = (ev) => { if (['Enter', ' '].includes(ev.key)) { ev.preventDefault(); pick(); } };
    });
    root.querySelectorAll('[data-map-act]').forEach((b) => (b.onclick = () => {
      const a = b.dataset.mapAct;
      if (a === 'first') { stopPlay(); go(0); }
      if (a === 'prev') { stopPlay(); go(st.stop - 1); }
      if (a === 'next') { stopPlay(); go(st.stop + 1); }
      if (a === 'zoom') { st.zoom = st.zoom === 'fit' ? 'full' : 'fit'; rerender(); follow(); }
      if (a === 'play') {
        if (st.playing) { stopPlay(); rerender(); return; }
        st.playing = true;
        if (st.stop === scen().stops.length - 1) st.stop = 0;
        st.timer = setInterval(() => {
          if (st.stop >= scen().stops.length - 1) { stopPlay(); rerender(); return; }
          go(st.stop + 1);
        }, 3200);
        rerender();
      }
    }));
    if (!window.__cfMapKeys) {
      window.__cfMapKeys = true;
      document.addEventListener('keydown', (ev) => {
        if (document.querySelector('#dialog[open]') || /INPUT|SELECT|TEXTAREA/.test(ev.target.tagName) || ev.ctrlKey || ev.metaKey || ev.altKey) return;
        const r = document.querySelector('.map-page');
        if (!r) return;
        if (ev.key === 'ArrowRight') { ev.preventDefault(); r.querySelector('[data-map-act="next"]')?.click(); }
        if (ev.key === 'ArrowLeft') { ev.preventDefault(); r.querySelector('[data-map-act="prev"]')?.click(); }
        if (ev.key.toLowerCase() === 'g' && st.o?.glossary) st.o.glossary();
      });
    }
  }

  return { view, bind, scenarios: SCENARIOS, nodes: N, cards: CARDS };
})();
