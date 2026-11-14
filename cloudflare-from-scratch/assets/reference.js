/* Sources of each lesson and the glossary: [term, term in Spanish, definition, definition in Spanish, lesson]. */
window.CF_REFERENCE = {
  "sources": {
    "localdev": [
      "Cloudflare Workers: local development",
      "https://developers.cloudflare.com/workers/local-development/"
    ],
    "anycast": [
      "Cloudflare Learning Center: what is anycast",
      "https://cloudflare.com/learning/cdn/what-is-anycast"
    ],
    "proxystatus": [
      "Cloudflare DNS: proxy status",
      "https://developers.cloudflare.com/dns/proxy-status/"
    ],
    "sslmodes": [
      "Cloudflare SSL/TLS: encryption modes",
      "https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/"
    ],
    "tunnel": [
      "Cloudflare Tunnel",
      "https://developers.cloudflare.com/tunnel/"
    ],
    "howworkers": [
      "Cloudflare Workers: how Workers works",
      "https://developers.cloudflare.com/workers/reference/how-workers-works/"
    ],
    "wranglerconfig": [
      "Wrangler: configuration",
      "https://developers.cloudflare.com/workers/wrangler/configuration/"
    ],
    "workercontext": [
      "Cloudflare Workers: context (ctx) and waitUntil",
      "https://developers.cloudflare.com/workers/runtime-apis/context/"
    ],
    "vitest": [
      "Cloudflare Workers: Vitest integration, test APIs",
      "https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis"
    ],
    "gradual": [
      "Cloudflare Workers: gradual deployments",
      "https://developers.cloudflare.com/workers/versions-and-deployments/gradual-deployments/"
    ],
    "workerscache": [
      "Cloudflare Workers: Workers Cache",
      "https://developers.cloudflare.com/workers/cache/"
    ],
    "cachekeys": [
      "Cloudflare Cache: cache keys",
      "https://developers.cloudflare.com/cache/how-to/cache-keys/"
    ],
    "cacheapi": [
      "Cloudflare Workers: Cache API",
      "https://developers.cloudflare.com/workers/runtime-apis/cache/"
    ],
    "customrules": [
      "Cloudflare WAF: custom rules",
      "https://developers.cloudflare.com/waf/custom-rules/"
    ],
    "ratelimit": [
      "Cloudflare Workers: rate limiting binding",
      "https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/"
    ],
    "accessjwt": [
      "Cloudflare Access: validate the JWT",
      "https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/"
    ],
    "howkv": [
      "Workers KV: how KV works",
      "https://developers.cloudflare.com/kv/concepts/how-kv-works/"
    ],
    "d1": [
      "Cloudflare D1: read replication",
      "https://developers.cloudflare.com/d1/best-practices/read-replication/"
    ],
    "r2": [
      "Cloudflare R2: pricing",
      "https://developers.cloudflare.com/r2/pricing/"
    ],
    "durableobjects": [
      "Durable Objects: what are Durable Objects",
      "https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/"
    ],
    "doalarms": [
      "Durable Objects: alarms",
      "https://developers.cloudflare.com/durable-objects/api/alarms/"
    ],
    "hyperdrive": [
      "Hyperdrive: how Hyperdrive works",
      "https://developers.cloudflare.com/hyperdrive/concepts/how-hyperdrive-works/"
    ],
    "queues": [
      "Cloudflare Queues: batching, retries and delays",
      "https://developers.cloudflare.com/queues/configuration/batching-retries/"
    ],
    "workflows": [
      "Cloudflare Workflows: sleeping and retrying",
      "https://developers.cloudflare.com/workflows/build/sleeping-and-retrying/"
    ],
    "cron": [
      "Cloudflare Workers: Cron Triggers",
      "https://developers.cloudflare.com/workers/configuration/cron-triggers/"
    ],
    "pricing": [
      "Cloudflare Workers: pricing and the free plan",
      "https://developers.cloudflare.com/workers/platform/pricing/"
    ]
  },
  "glossary": [
    [
      "Edge",
      "Borde",
      "The data centers of Cloudflare that receive requests before your origin, and the products that run there.",
      "Los data centers de Cloudflare que reciben los pedidos antes que tu origen, y los productos que corren ahí.",
      1
    ],
    [
      "Origin",
      "Origen",
      "Your own server, the one the edge sits in front of. In the course, the Spring Boot API of Rumbo.",
      "Tu propio servidor, el que tiene el borde delante. En el curso, la API de Spring Boot de Rumbo.",
      1
    ],
    [
      "Anycast",
      "Anycast",
      "One IP address announced from many data centers; routing takes each client to one of them, usually nearby.",
      "Una dirección IP anunciada desde muchos data centers; el ruteo lleva a cada cliente a uno de ellos, en general cercano.",
      1
    ],
    [
      "Ray ID",
      "Ray ID",
      "The identifier of a request that went through Cloudflare, sent in the cf-ray header. Not guaranteed to be unique.",
      "El identificador de un pedido que pasó por Cloudflare, en el encabezado cf-ray. No tiene garantía de ser único.",
      1
    ],
    [
      "Data center (colo)",
      "Data center (colo)",
      "One location of the Cloudflare network, named by an airport code such as LHR in /cdn-cgi/trace.",
      "Un lugar de la red de Cloudflare, nombrado por un código de aeropuerto como LHR en /cdn-cgi/trace.",
      1
    ],
    [
      "Proxied record",
      "Registro con proxy",
      "A DNS record answered with Cloudflare addresses, so requests reach the edge first. Only A, AAAA and CNAME.",
      "Un registro DNS que se responde con direcciones de Cloudflare, así los pedidos llegan primero al borde. Solo A, AAAA y CNAME.",
      2
    ],
    [
      "DNS-only record",
      "Registro solo DNS",
      "A DNS record answered with its real address; requests go straight to that server.",
      "Un registro DNS que se responde con su dirección real; los pedidos van directo a ese servidor.",
      2
    ],
    [
      "Zone",
      "Zona",
      "A domain added to Cloudflare, with its DNS, its settings and its rules.",
      "Un dominio agregado a Cloudflare, con su DNS, sus ajustes y sus reglas.",
      2
    ],
    [
      "Encryption mode",
      "Modo de cifrado",
      "The zone setting that decides how the edge connects to the origin: Off, Flexible, Full, Full (strict) or Strict.",
      "El ajuste de la zona que decide cómo se conecta el borde al origen: Off, Flexible, Full, Full (strict) o Strict.",
      3
    ],
    [
      "Full (strict)",
      "Full (strict)",
      "HTTPS to the origin with its certificate validated against a public authority or Cloudflare Origin CA.",
      "HTTPS al origen con su certificado validado contra una autoridad pública o Cloudflare Origin CA.",
      3
    ],
    [
      "Cloudflare Tunnel",
      "Cloudflare Tunnel",
      "Outbound connections opened by cloudflared to Cloudflare, through which requests reach a service with no open port.",
      "Conexiones salientes que abre cloudflared hacia Cloudflare, por las que los pedidos llegan a un servicio sin puertos abiertos.",
      4
    ],
    [
      "cloudflared",
      "cloudflared",
      "The program that runs next to your service and keeps the connections of a tunnel.",
      "El programa que corre al lado de tu servicio y mantiene las conexiones de un túnel.",
      4
    ],
    [
      "Quick tunnel",
      "Túnel rápido",
      "A tunnel with a random trycloudflare.com name and no account, for testing.",
      "Un túnel con un nombre al azar de trycloudflare.com y sin cuenta, para pruebas.",
      4
    ],
    [
      "Worker",
      "Worker",
      "Your code running at the edge, in a V8 isolate, called by a request, a queue, a cron or an alarm.",
      "Tu código corriendo en el borde, en un isolate de V8, llamado por un pedido, una cola, un cron o una alarma.",
      5
    ],
    [
      "Isolate",
      "Isolate",
      "A V8 sandbox inside a shared runtime process; starts fast and is not guaranteed to live long.",
      "Un entorno aislado de V8 dentro de un proceso compartido del runtime; arranca rápido y no tiene garantía de durar.",
      5
    ],
    [
      "workerd",
      "workerd",
      "The open source runtime of Workers; wrangler dev and the tests run it on your machine.",
      "El runtime de código abierto de Workers; wrangler dev y las pruebas lo corren en tu máquina.",
      5
    ],
    [
      "CPU time",
      "Tiempo de CPU",
      "The time a Worker computes, not counting waits for I/O. 10 ms per request on the free plan.",
      "El tiempo que un Worker calcula, sin contar las esperas de E/S. 10 ms por pedido en el plan gratuito.",
      5
    ],
    [
      "Wrangler",
      "Wrangler",
      "The command line of Workers: dev, deploy, versions, tail, migrations, secrets.",
      "La línea de comandos de Workers: dev, deploy, versions, tail, migraciones, secretos.",
      6
    ],
    [
      "Binding",
      "Binding",
      "A name in env that gives the Worker access to one resource, declared in wrangler.jsonc.",
      "Un nombre en env que le da al Worker acceso a un recurso, declarado en wrangler.jsonc.",
      6
    ],
    [
      "Compatibility date",
      "Fecha de compatibilidad",
      "The date that pins the behavior of the runtime for a Worker.",
      "La fecha que fija el comportamiento del runtime para un Worker.",
      6
    ],
    [
      ".dev.vars",
      ".dev.vars",
      "The file of local secrets for wrangler dev, read when it starts and never committed.",
      "El archivo de secretos locales de wrangler dev, que se lee al arrancar y nunca se versiona.",
      6
    ],
    [
      "waitUntil",
      "waitUntil",
      "A method of ctx that keeps work running after the response, for up to 30 seconds.",
      "Un método de ctx que mantiene trabajo corriendo después de la respuesta, hasta 30 segundos.",
      7
    ],
    [
      "Version",
      "Versión",
      "The code and configuration of a Worker, uploaded and kept; it serves traffic only when deployed.",
      "El código y la configuración de un Worker, subidos y guardados; atiende tráfico solo cuando se despliega.",
      9
    ],
    [
      "Gradual deployment",
      "Despliegue gradual",
      "A deployment that splits traffic between versions by percentage.",
      "Un despliegue que reparte el tráfico entre versiones por porcentaje.",
      9
    ],
    [
      "workers.dev",
      "workers.dev",
      "The subdomain of your account where a Worker answers without a zone of your own.",
      "El subdominio de tu cuenta donde un Worker responde sin zona propia.",
      9
    ],
    [
      "Workers Cache",
      "Workers Cache",
      "A cache in front of a Worker, driven by the Cache-Control of its responses; a hit does not run the Worker.",
      "Una cache delante de un Worker, guiada por el Cache-Control de sus respuestas; un acierto no ejecuta el Worker.",
      10
    ],
    [
      "cf-cache-status",
      "cf-cache-status",
      "The response header that says what the cache did: MISS, HIT, BYPASS, DYNAMIC and others.",
      "El encabezado de respuesta que dice qué hizo la cache: MISS, HIT, BYPASS, DYNAMIC y otros.",
      10
    ],
    [
      "Cache key",
      "Clave de cache",
      "What identifies a stored response: by default scheme, host, path and query string, not the user.",
      "Lo que identifica una respuesta guardada: por defecto esquema, host, ruta y query string, no el usuario.",
      11
    ],
    [
      "Purge",
      "Purga",
      "Removing stored copies, by URL, hostname, tag, prefix or everything, on every plan.",
      "Sacar copias guardadas, por URL, hostname, tag, prefijo o todo, en todos los planes.",
      11
    ],
    [
      "Cache API",
      "Cache API",
      "caches.default in a Worker: match, put and delete, per data center.",
      "caches.default en un Worker: match, put y delete, por data center.",
      12
    ],
    [
      "WAF",
      "WAF",
      "The rules of a zone that inspect each request: managed rules, custom rules and rate limiting rules.",
      "Las reglas de una zona que revisan cada pedido: administradas, propias y de rate limiting.",
      13
    ],
    [
      "Custom rule",
      "Regla propia",
      "An expression of the Rules language and an action, such as Block. 5 on the free plan.",
      "Una expresión del lenguaje de Rules y una acción, como Block. 5 en el plan gratuito.",
      13
    ],
    [
      "Rate limit",
      "Rate limit",
      "A count of requests per key in a window, with an action past the threshold, usually 429.",
      "Una cuenta de pedidos por clave en una ventana, con una acción pasado el umbral, en general 429.",
      14
    ],
    [
      "Cloudflare Access",
      "Cloudflare Access",
      "Identity checked at the edge before an application; passes a signed JWT to the origin.",
      "Identidad verificada en el borde antes de una aplicación; le pasa un JWT firmado al origen.",
      15
    ],
    [
      "Cf-Access-Jwt-Assertion",
      "Cf-Access-Jwt-Assertion",
      "The request header where Access puts the signed JWT that the origin must validate.",
      "El encabezado del pedido donde Access pone el JWT firmado que el origen tiene que validar.",
      15
    ],
    [
      "AUD tag",
      "AUD tag",
      "The audience of an Access application; the aud claim of its tokens must match it.",
      "La audiencia de una aplicación de Access; el claim aud de sus tokens tiene que coincidir.",
      15
    ],
    [
      "Workers KV",
      "Workers KV",
      "A key-value store cached close to readers and eventually consistent: for reads, not counters.",
      "Un almacén de clave y valor guardado cerca de los lectores y eventualmente consistente: para leer, no para contar.",
      16
    ],
    [
      "Eventual consistency",
      "Consistencia eventual",
      "A write becomes visible everywhere, without a promise of when; in KV, up to 60 seconds or more.",
      "Una escritura se vuelve visible en todos lados, sin promesa de cuándo; en KV, hasta 60 segundos o más.",
      16
    ],
    [
      "D1",
      "D1",
      "A managed SQL database with the SQL of SQLite, migrations and read replicas in beta.",
      "Una base SQL administrada con el SQL de SQLite, migraciones y réplicas de lectura en beta.",
      17
    ],
    [
      "Migration",
      "Migración",
      "A numbered SQL file that changes the schema, applied once and recorded in d1_migrations.",
      "Un archivo SQL numerado que cambia el esquema, aplicado una vez y registrado en d1_migrations.",
      17
    ],
    [
      "Local Explorer",
      "Local Explorer",
      "The page and API of wrangler dev at /cdn-cgi/local/explorer, with the local data, spans and logs.",
      "La página y la API de wrangler dev en /cdn-cgi/local/explorer, con los datos locales, los spans y los logs.",
      17
    ],
    [
      "R2",
      "R2",
      "Object storage with an S3-compatible API and no egress fees.",
      "Almacenamiento de objetos con una API compatible con S3 y sin costo de salida.",
      18
    ],
    [
      "Durable Object",
      "Durable Object",
      "An instance of your class with a unique id, in one place, with consistent storage, handling one call at a time.",
      "Una instancia de tu clase con un id único, en un lugar, con almacenamiento consistente, que atiende una llamada por vez.",
      19
    ],
    [
      "Alarm",
      "Alarma",
      "One scheduled wake-up per Durable Object, run at least once and retried on error.",
      "Un despertador programado por Durable Object, que corre al menos una vez y se reintenta si falla.",
      20
    ],
    [
      "WebSocket hibernation",
      "Hibernación de WebSockets",
      "Sockets accepted by a Durable Object that stay open while the object leaves memory.",
      "Sockets aceptados por un Durable Object que quedan abiertos mientras el objeto sale de memoria.",
      20
    ],
    [
      "Hyperdrive",
      "Hyperdrive",
      "A pool of connections near your database and a cache of read queries, for Workers.",
      "Un pool de conexiones cerca de tu base y una cache de consultas de lectura, para Workers.",
      21
    ],
    [
      "Queue",
      "Cola",
      "Messages sent by a producer and received in batches by a consumer, at least once.",
      "Mensajes que manda un productor y recibe en lotes un consumidor, al menos una vez.",
      22
    ],
    [
      "Dead letter queue",
      "Cola de mensajes muertos",
      "Where a queue writes the messages that failed every retry.",
      "Donde una cola escribe los mensajes que fallaron todos los reintentos.",
      22
    ],
    [
      "Idempotency",
      "Idempotencia",
      "Doing an operation twice leaves the same result as once; needed with at-least-once delivery.",
      "Hacer una operación dos veces deja el mismo resultado que una; necesario con entrega al menos una vez.",
      22
    ],
    [
      "Workflow",
      "Workflow",
      "A process of steps whose results are stored, retried step by step, able to sleep and wait for events.",
      "Un proceso de pasos cuyos resultados se guardan, reintentado paso por paso, que puede dormir y esperar eventos.",
      23
    ],
    [
      "Cron Trigger",
      "Cron Trigger",
      "A schedule in UTC that runs the scheduled handler of a Worker.",
      "Un horario en UTC que corre el handler scheduled de un Worker.",
      24
    ]
  ]
};
