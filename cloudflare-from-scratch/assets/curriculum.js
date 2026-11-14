/* Canonical bilingual content. Generated HTML and notes are built from this file. */
window.CF_COURSE = {
  "version": "1.1.0",
  "date": "2026-11-14",
  "stack": "WRANGLER 4.162.0 / WORKERD",
  "baseline": { "en": "Wrangler 4.162.0 and workerd 1.20261113.1 on Node 26.13.1; cloudflared 2026.11.0; Spring Boot 4.1.2 on Java 25 with PostgreSQL 18.7; facts of the platform and of the free plan checked on 14 November 2026", "es": "Wrangler 4.162.0 y workerd 1.20261113.1 sobre Node 26.13.1; cloudflared 2026.11.0; Spring Boot 4.1.2 sobre Java 25 con PostgreSQL 18.7; datos de la plataforma y del plan gratuito verificados el 14 de noviembre de 2026" },
  "units": [
    { "en": "Start here", "es": "Antes de empezar" },
    { "en": "The network in front of your app", "es": "La red delante de tu aplicación" },
    { "en": "Workers", "es": "Workers" },
    { "en": "Cache", "es": "Cache" },
    { "en": "Security at the edge", "es": "Seguridad en el borde" },
    { "en": "State at the edge", "es": "Estado en el borde" },
    { "en": "Events", "es": "Eventos" },
    { "en": "Capstone", "es": "Integradora" }
  ],
  "lessons": [
    {
      "id": 0,
      "unit": 0,
      "slug": "before-you-start",
      "title": { "en": "Before you start", "es": "Antes de empezar" },
      "intro": { "en": "See the model, predict a result, then run the experiment on a real edge on your machine.", "es": "Mirá el modelo, predecí un resultado y después ejecutá el experimento en un borde real en tu máquina." },
      "visual": "kit",
      "frames": [
        {
          "title": { "en": "Two workspaces and three kinds of evidence", "es": "Dos espacios y tres clases de evidencia" },
          "text": { "en": "The browser shows illustrative models of each mechanism. Your terminal runs the kit: the same runtime Cloudflare uses for Workers, on your machine. Every lab step says where its evidence comes from: local runs in the kit with no account; account needs a free Cloudflare account and is optional; zone needs a domain of your own on Cloudflare, so the course shows it as a case study with real outputs.", "es": "El navegador muestra modelos ilustrativos de cada mecanismo. Tu terminal ejecuta el kit: el mismo runtime que usa Cloudflare para Workers, en tu máquina. Cada paso del laboratorio dice de dónde sale su evidencia: local corre en el kit, sin cuenta; cuenta necesita una cuenta gratuita de Cloudflare y es opcional; zona necesita un dominio propio en Cloudflare, así que el curso la muestra como caso de estudio con salidas reales." },
          "rule": { "en": "A model explains; a lab produces evidence, and says which kind.", "es": "Un modelo explica; un laboratorio produce evidencia, y dice de qué clase." }
        },
        {
          "title": { "en": "One kit, one fictional company", "es": "Un kit, una empresa ficticia" },
          "text": { "en": "Rumbo is a fictional shipment tracking platform. Its origin is a Spring Boot API on Java 25 with PostgreSQL 18: shipments, the movements carriers report and an internal panel. In front of it, the edge is one Worker run by wrangler dev, with every binding simulated: KV, D1, R2, Durable Objects, Queues, Workflows, Hyperdrive and rate limiting. A lab command, also in Docker, makes the requests and prints what matters.", "es": "Rumbo es una plataforma ficticia de seguimiento de envíos. Su origen es una API de Spring Boot sobre Java 25 con PostgreSQL 18: envíos, los movimientos que reportan los transportistas y un panel interno. Delante, el borde es un Worker que corre wrangler dev, con todos los bindings simulados: KV, D1, R2, Durable Objects, Queues, Workflows, Hyperdrive y rate limiting. Un comando lab, también en Docker, hace los pedidos e imprime lo que importa." },
          "rule": { "en": "Keep the company small so the mechanism stays visible.", "es": "Mantené la empresa chica para que el mecanismo siga a la vista." }
        },
        {
          "title": { "en": "What runs where", "es": "Qué corre dónde" },
          "text": { "en": "Only the edge is published: the Worker on 127.0.0.1:18097 and its live viewer on 127.0.0.1:18098; the origin and the database have no port on your machine, as an origin behind Cloudflare should. The kit uses about 800 MB of memory, almost all of it the edge with its viewer, about 450 MB, and the origin, about 300 MB, measured on the validation machine. Images download once. The local tools of wrangler dev, such as the Local Explorer at /cdn-cgi/local/explorer, answer on the port of the Worker.", "es": "Solo se publica el borde: el Worker en 127.0.0.1:18097 y su visor en vivo en 127.0.0.1:18098; el origen y la base no tienen puerto en tu máquina, como debe pasar con un origen detrás de Cloudflare. El kit usa unos 800 MB de memoria, casi todo el borde con su visor, unos 450 MB, y el origen, unos 300 MB, medido en la máquina de validación. Las imágenes se bajan una vez. Las herramientas locales de wrangler dev, como el Local Explorer en /cdn-cgi/local/explorer, responden en el puerto del Worker." },
          "rule": { "en": "Publish only what has to be reached.", "es": "Publicá solo lo que se tiene que alcanzar." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "What does the visual model in the browser test?", "es": "¿Qué prueba el modelo visual del navegador?" },
          "options": [
            { "en": "What Cloudflare will answer to your request", "es": "Lo que Cloudflare le va a responder a tu pedido" },
            { "en": "Your reasoning within its assumptions", "es": "Tu razonamiento dentro de sus supuestos" },
            { "en": "The speed of your connection", "es": "La velocidad de tu conexión" }
          ],
          "correct": 1,
          "explanation": { "en": "Only the lab commands reach a real runtime: the kit, or your account in the optional steps.", "es": "Solo los comandos del laboratorio llegan a un runtime real: el kit, o tu cuenta en los pasos opcionales." }
        },
        {
          "question": { "en": "Which steps need a Cloudflare account?", "es": "¿Qué pasos necesitan una cuenta de Cloudflare?" },
          "options": [
            { "en": "All of them, because Workers only run on Cloudflare", "es": "Todos, porque Workers solo corre en Cloudflare" },
            { "en": "Only the zone steps", "es": "Solo los pasos de zona" },
            { "en": "The steps marked account, and they are optional", "es": "Los pasos marcados como cuenta, y son opcionales" }
          ],
          "correct": 2,
          "explanation": { "en": "wrangler dev runs the Worker and simulates its bindings with no login; the account is for deploying.", "es": "wrangler dev corre el Worker y simula sus bindings sin login; la cuenta es para desplegar." }
        },
        {
          "question": { "en": "Why does the origin of Rumbo have no port on your machine?", "es": "¿Por qué el origen de Rumbo no tiene puerto en tu máquina?" },
          "options": [
            { "en": "Because only the edge should be reachable from outside", "es": "Porque solo el borde se tiene que poder alcanzar desde afuera" },
            { "en": "Because Spring Boot cannot listen on a port in Docker", "es": "Porque Spring Boot no puede escuchar en un puerto en Docker" },
            { "en": "Because the database would refuse the connection", "es": "Porque la base rechazaría la conexión" }
          ],
          "correct": 0,
          "explanation": { "en": "The edge and the lab reach it inside the Compose network; nobody else needs to.", "es": "El borde y el lab llegan por la red de Compose; nadie más lo necesita." }
        }
      ],
      "source": "localdev",
      "experiment": { "en": "Toggle the account and see which parts of the kit need one: none of the local steps do.", "es": "Prendé y apagá la cuenta y mirá qué partes del kit la necesitan: ninguno de los pasos locales." },
      "lab": [
        {
          "title": { "en": "Check Docker", "es": "Verificá Docker" },
          "text": { "en": "The kit needs Docker with Compose. Nothing else is installed on your machine: Node, Wrangler, Java and PostgreSQL run in containers.", "es": "El kit necesita Docker con Compose. No se instala nada más en tu máquina: Node, Wrangler, Java y PostgreSQL corren en contenedores." },
          "command": "docker version --format \"{{.Server.Version}}\"",
          "expected": { "en": "A version number of the Docker Engine, such as 29.1.3. An error means Docker Desktop or the daemon is not running.", "es": "Un número de versión del Docker Engine, como 29.1.3. Un error quiere decir que Docker Desktop o el daemon no está corriendo." },
          "checks": [{ "matches": "^\\d+\\.\\d+" }]
        },
        {
          "title": { "en": "Build and start the kit", "es": "Construí y levantá el kit" },
          "text": { "en": "From the folder where you extracted the kit, enter labs and start it. The first time it builds two images, the edge and the origin, and downloads the base images; later starts take seconds. --wait returns when every service answers its health check.", "es": "Desde la carpeta donde descomprimiste el kit, entrá a labs y levantalo. La primera vez construye dos imágenes, el borde y el origen, y baja las imágenes base; después arranca en segundos. --wait vuelve cuando cada servicio responde su chequeo de salud." },
          "command": "cd labs\ndocker compose up -d --build --wait",
          "expected": { "en": "The three services, db, origin and edge, end Healthy. The first build takes a few minutes, most of it Maven downloading the dependencies of the origin.", "es": "Los tres servicios, db, origin y edge, terminan Healthy. La primera construcción tarda unos minutos, casi todo Maven bajando las dependencias del origen." },
          "checks": [{ "contains": "prumathe-cf-edge-1" }]
        },
        {
          "title": { "en": "See what is published", "es": "Mirá qué está publicado" },
          "text": { "en": "docker compose ps lists the services and their ports. Only one line has an address on your machine.", "es": "docker compose ps lista los servicios y sus puertos. Solo una línea tiene una dirección en tu máquina." },
          "command": "docker compose ps --format \"{{.Service}} {{.Ports}}\"",
          "expected": { "en": "edge shows 127.0.0.1:18097->8787/tcp and 127.0.0.1:18098->8788/tcp, the Worker and its viewer; origin shows 8080/tcp and 8443/tcp without an address; db shows 5432/tcp without one. Only the edge can be reached from your machine.", "es": "edge muestra 127.0.0.1:18097->8787/tcp y 127.0.0.1:18098->8788/tcp, el Worker y su visor; origin muestra 8080/tcp y 8443/tcp sin dirección; db muestra 5432/tcp sin dirección. Solo al borde se llega desde tu máquina." },
          "checks": [{ "contains": "127.0.0.1:18097->8787/tcp" }, { "contains": "127.0.0.1:18098->8788/tcp" }]
        },
        {
          "title": { "en": "Ask the origin through the edge", "es": "Pedile al origen a través del borde" },
          "text": { "en": "The lab command runs in the same image as the edge and talks to it inside the Compose network. get prints the status, the headers that matter and the body. Open http://127.0.0.1:18098 in your browser: the live viewer draws this request, and every one after it, over the pieces of the kit.", "es": "El comando lab corre en la misma imagen que el borde y le habla por la red de Compose. get imprime el estado, los encabezados que importan y el cuerpo. Abrí http://127.0.0.1:18098 en tu navegador: el visor en vivo dibuja este pedido, y todos los que siguen, sobre las piezas del kit." },
          "command": "docker compose run --rm lab get /api/shipments/R-1042",
          "expected": { "en": "HTTP 200, x-rumbo-via: edge and a request id added by the Worker, and a body that says servedBy rumbo-origin: the answer came from Spring Boot, through the edge.", "es": "HTTP 200, x-rumbo-via: edge y un id de pedido que agregó el Worker, y un cuerpo que dice servedBy rumbo-origin: la respuesta vino de Spring Boot, a través del borde." },
          "checks": [{ "contains": "x-rumbo-via: edge" }, { "contains": "\"servedBy\": \"rumbo-origin\"" }]
        },
        {
          "title": { "en": "Read the commands of the lab", "es": "Leé los comandos del lab" },
          "text": { "en": "Every lesson uses this same command. help lists what it can do: requests through the edge, the mechanisms of each lesson and the optional steps of your account.", "es": "Todas las lecciones usan este mismo comando. help lista lo que hace: pedidos a través del borde, los mecanismos de cada lección y los pasos opcionales de tu cuenta." },
          "command": "docker compose run --rm lab help",
          "expected": { "en": "Groups of commands: through the edge, the origin, mechanisms, events, what happened, network in front, identity and your account.", "es": "Grupos de comandos: through the edge, the origin, mechanisms, events, what happened, network in front, identity y your account." },
          "checks": [{ "contains": "through the edge" }]
        }
      ]
    },
    {
      "id": 1,
      "unit": 1,
      "slug": "a-request-through-the-edge",
      "title": { "en": "A request goes through the edge", "es": "Un pedido pasa por el borde" },
      "intro": { "en": "One address announced from many places, and the data center that answers you.", "es": "Una dirección anunciada desde muchos lugares, y el data center que te responde." },
      "visual": "anycast",
      "frames": [
        {
          "title": { "en": "One address, many places", "es": "Una dirección, muchos lugares" },
          "text": { "en": "Anycast: Cloudflare announces the same IP addresses from all its data centers, and internet routing takes each client to one of them, usually a nearby one. What it is: a way of routing, not a server. What it is for: to answer from close by and to spread load and attacks over the whole network. What it does not do: promise the geographically closest city; the routes of the networks in between decide.", "es": "Anycast: Cloudflare anuncia las mismas direcciones IP desde todos sus data centers, y el ruteo de internet lleva a cada cliente a uno de ellos, en general uno cercano. Qué es: una forma de rutear, no un servidor. Para qué sirve: para responder desde cerca y repartir carga y ataques en toda la red. Qué no hace: prometer la ciudad más cercana en el mapa; deciden las rutas de las redes del medio." },
          "rule": { "en": "The address is the same everywhere; the data center that answers is not.", "es": "La dirección es la misma en todos lados; el data center que responde, no." }
        },
        {
          "title": { "en": "The edge answers first", "es": "El borde responde primero" },
          "text": { "en": "Your TLS connection ends at that data center, which runs every product of the zone on the request before it goes anywhere else. Each request gets a Ray ID, sent to the origin in the cf-ray header; Cloudflare says Ray IDs are not guaranteed to be unique. /cdn-cgi/trace on a site behind Cloudflare shows which data center answered, in its colo field.", "es": "Tu conexión TLS termina en ese data center, que corre todos los productos de la zona sobre el pedido antes de que vaya a otro lado. Cada pedido recibe un Ray ID, que viaja al origen en el encabezado cf-ray; Cloudflare aclara que los Ray IDs no tienen garantía de ser únicos. /cdn-cgi/trace en un sitio detrás de Cloudflare muestra qué data center respondió, en el campo colo." },
          "rule": { "en": "Log the Ray ID: it is how you find one request in Cloudflare.", "es": "Registrá el Ray ID: es cómo encontrás un pedido en Cloudflare." }
        },
        {
          "title": { "en": "Your edge in the kit", "es": "Tu borde en el kit" },
          "text": { "en": "wrangler dev runs workerd, the open source runtime of Workers, on your machine. It is one place, not a network: no anycast and no other data centers. request.cf, the object where the edge describes the client, is fetched once from Cloudflare when wrangler starts and describes your own connection; on Cloudflare each request carries its own.", "es": "wrangler dev corre workerd, el runtime de código abierto de Workers, en tu máquina. Es un lugar, no una red: no hay anycast ni otros data centers. request.cf, el objeto donde el borde describe al cliente, se trae una vez de Cloudflare cuando arranca wrangler y describe tu propia conexión; en Cloudflare cada pedido trae el suyo." },
          "rule": { "en": "The kit runs the same code; it does not reproduce the network.", "es": "El kit corre el mismo código; no reproduce la red." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "What does anycast decide?", "es": "¿Qué decide anycast?" },
          "options": [
            { "en": "Which data center receives a request for the same IP address", "es": "Qué data center recibe un pedido a la misma dirección IP" },
            { "en": "That the request always reaches the nearest city on the map", "es": "Que el pedido llegue siempre a la ciudad más cercana en el mapa" },
            { "en": "Which server inside a data center runs your Worker", "es": "Qué servidor dentro de un data center corre tu Worker" }
          ],
          "correct": 0,
          "explanation": { "en": "Routing chooses among many places that announce the same address; it is usually, not always, the nearest.", "es": "El ruteo elige entre muchos lugares que anuncian la misma dirección; suele ser el más cercano, no siempre." }
        },
        {
          "question": { "en": "Where does the visitor TLS connection end, for a proxied site?", "es": "¿Dónde termina la conexión TLS del visitante, en un sitio con proxy?" },
          "options": [
            { "en": "At your origin", "es": "En tu origen" },
            { "en": "At the Cloudflare data center that received it", "es": "En el data center de Cloudflare que la recibió" },
            { "en": "At the DNS resolver", "es": "En el resolver de DNS" }
          ],
          "correct": 1,
          "explanation": { "en": "The edge terminates TLS; the connection to the origin is a second one, lesson 03.", "es": "El borde termina TLS; la conexión al origen es otra, lección 03." }
        },
        {
          "question": { "en": "What does request.cf describe in the kit?", "es": "¿Qué describe request.cf en el kit?" },
          "options": [
            { "en": "Each request the lab makes, measured at that moment", "es": "Cada pedido que hace el lab, medido en ese momento" },
            { "en": "The data center closest to the origin", "es": "El data center más cercano al origen" },
            { "en": "Your connection to Cloudflare when wrangler started", "es": "Tu conexión a Cloudflare cuando arrancó wrangler" }
          ],
          "correct": 2,
          "explanation": { "en": "wrangler dev fetches one real cf object at start; in production every request has its own.", "es": "wrangler dev trae un objeto cf real al arrancar; en producción cada pedido tiene el suyo." }
        }
      ],
      "source": "anycast",
      "experiment": { "en": "Move the client and watch which data center answers the same address.", "es": "Mové al cliente y mirá qué data center responde la misma dirección." },
      "visor": { "en": "Only lab cf and lab get /echo reach the kit: the first is answered by the Worker alone, the second goes on to the API of Rumbo. trace and headers go to www.cloudflare.com, and lab origin skips the edge, so they leave nothing.", "es": "Solo lab cf y lab get /echo llegan al kit: el primero lo responde el Worker solo, el segundo sigue hasta la API de Rumbo. trace y headers van a www.cloudflare.com, y lab origin saltea el borde, así que no dejan nada." },
      "lab": [
        {
          "title": { "en": "Ask Cloudflare which data center answered", "es": "Preguntale a Cloudflare qué data center respondió" },
          "text": { "en": "/cdn-cgi/trace exists on every site behind Cloudflare. The lab reads it from www.cloudflare.com and prints some fields; your public address is in the answer but is not printed. This step needs internet, and a corporate proxy may block it.", "es": "/cdn-cgi/trace existe en todo sitio detrás de Cloudflare. El lab lo lee de www.cloudflare.com e imprime algunos campos; tu dirección pública viene en la respuesta pero no se imprime. Este paso necesita internet, y un proxy corporativo lo puede bloquear." },
          "command": "docker compose run --rm lab trace",
          "expected": { "en": "colo with three letters, such as LHR or ORD: the airport code of the data center that answered you. tls=TLSv1.3 and http=http/2 describe the connection that ended there.", "es": "colo con tres letras, como LHR u ORD: el código de aeropuerto del data center que te respondió. tls=TLSv1.3 y http=http/2 describen la conexión que terminó ahí." },
          "checks": [{ "matches": "^colo=[A-Z]{3}$" }, { "contains": "not printed" }]
        },
        {
          "title": { "en": "Look at the headers of a response", "es": "Mirá los encabezados de una respuesta" },
          "text": { "en": "headers asks for a page and prints the headers the edge adds.", "es": "headers pide una página e imprime los encabezados que agrega el borde." },
          "command": "docker compose run --rm lab headers",
          "expected": { "en": "server: cloudflare and a cf-ray header. In the validation run the cf-ray ended in the same three letters as colo, such as a5a636edac9dd8f8-LHR; the documentation describes the Ray ID but not this format. cf-cache-status is lesson 10.", "es": "server: cloudflare y un encabezado cf-ray. En la corrida de validación, el cf-ray terminaba con las mismas tres letras que colo, como a5a636edac9dd8f8-LHR; la documentación describe el Ray ID pero no ese formato. cf-cache-status es la lección 10." },
          "checks": [{ "contains": "server: cloudflare" }, { "matches": "cf-ray: [0-9a-f]+-[A-Z]{3}" }]
        },
        {
          "title": { "en": "Read request.cf in the local edge", "es": "Leé request.cf en el borde local" },
          "text": { "en": "The Worker of Rumbo returns part of request.cf. In the kit it is the object wrangler fetched from Cloudflare when it started.", "es": "El Worker de Rumbo devuelve parte de request.cf. En el kit es el objeto que wrangler trajo de Cloudflare cuando arrancó." },
          "command": "docker compose run --rm lab cf",
          "expected": { "en": "A colo and a country that match your connection, not the lab container: the same object for every request until the edge restarts.", "es": "Un colo y un país que coinciden con tu conexión, no con el contenedor del lab: el mismo objeto para todos los pedidos hasta que el borde reinicia." },
          "checks": [{ "matches": "\"colo\": \"[A-Z]{3}\"" }]
        },
        {
          "title": { "en": "See what reached the origin", "es": "Mirá qué llegó al origen" },
          "text": { "en": "/echo is an origin route that returns the headers it received. Through the edge, the Worker adds two of its own.", "es": "/echo es una ruta del origen que devuelve los encabezados que recibió. A través del borde, el Worker agrega dos propios." },
          "command": "docker compose run --rm lab get /echo",
          "expected": { "en": "The origin saw x-rumbo-edge and x-rumbo-request-id, the same id that came back in the response headers.", "es": "El origen vio x-rumbo-edge y x-rumbo-request-id, el mismo id que volvió en los encabezados de la respuesta." },
          "checks": [{ "contains": "\"x-rumbo-edge\": \"rumbo-edge\"" }]
        },
        {
          "title": { "en": "Go straight to the origin", "es": "Andá directo al origen" },
          "text": { "en": "The lab container is inside the Compose network, so it can skip the edge. Nobody outside can: the origin has no port on your machine.", "es": "El contenedor del lab está dentro de la red de Compose, así que puede saltear el borde. Nadie de afuera puede: el origen no tiene puerto en tu máquina." },
          "command": "docker compose run --rm lab origin /echo",
          "expected": { "en": "Only the host header: no x-rumbo headers, because nothing passed through the Worker.", "es": "Solo el encabezado host: no hay encabezados x-rumbo, porque nada pasó por el Worker." },
          "checks": [{ "absent": "x-rumbo-edge" }, { "contains": "\"host\": \"origin:8080\"" }]
        }
      ]
    },
    {
      "id": 2,
      "unit": 1,
      "slug": "proxied-dns",
      "title": { "en": "DNS with or without the proxy", "es": "DNS con proxy o sin proxy" },
      "intro": { "en": "The same record can send the request to the edge or straight to your server.", "es": "El mismo registro puede mandar el pedido al borde o directo a tu servidor." },
      "visual": "dns",
      "frames": [
        {
          "title": { "en": "Proxied: the edge answers", "es": "Con proxy: responde el borde" },
          "text": { "en": "Cloudflare DNS hosts the records of your zone. A record marked proxied is answered with Cloudflare anycast addresses, so HTTP and HTTPS requests reach the edge first and the address of your origin is not published. Only A, AAAA and CNAME records can be proxied; the dashboard turns the proxy on by default for them. Proxied records have a fixed TTL of 300 seconds.", "es": "El DNS de Cloudflare guarda los registros de tu zona. Un registro marcado con proxy se responde con direcciones anycast de Cloudflare, así que los pedidos HTTP y HTTPS llegan primero al borde y la dirección de tu origen no se publica. Solo los registros A, AAAA y CNAME pueden ir con proxy; el panel lo prende por defecto para ellos. Los registros con proxy tienen un TTL fijo de 300 segundos." },
          "rule": { "en": "Proxied means the request meets the edge before your server.", "es": "Con proxy quiere decir que el pedido se encuentra con el borde antes que con tu servidor." }
        },
        {
          "title": { "en": "DNS only: Cloudflare only answers DNS", "es": "Solo DNS: Cloudflare solo responde DNS" },
          "text": { "en": "A DNS-only record is answered with the real address you wrote. Requests go straight to that server: no cache, no WAF, no Workers on the way, and only DNS analytics. The address is visible to anyone who asks for the record. MX and TXT records are always DNS only.", "es": "Un registro solo DNS se responde con la dirección real que escribiste. Los pedidos van directo a ese servidor: sin cache, sin WAF, sin Workers en el camino, y solo con analíticas de DNS. La dirección la ve cualquiera que pregunte por el registro. Los registros MX y TXT son siempre solo DNS." },
          "rule": { "en": "A DNS-only record skips every product of the zone.", "es": "Un registro solo DNS se saltea todos los productos de la zona." }
        },
        {
          "title": { "en": "What the proxy does not hide", "es": "Lo que el proxy no esconde" },
          "text": { "en": "The proxy hides the origin address in DNS, not everywhere. An old DNS-only record, a mail server on the same machine or a direct link can reveal it, and whoever knows it can skip the edge. Two defenses come later: an origin with no open port, lesson 04, and an origin that checks who sent the request, lesson 15.", "es": "El proxy esconde la dirección del origen en el DNS, no en todos lados. Un registro viejo solo DNS, un servidor de mail en la misma máquina o un enlace directo la pueden revelar, y quien la conoce se saltea el borde. Hay dos defensas más adelante: un origen sin puertos abiertos, lección 04, y un origen que verifica quién mandó el pedido, lección 15." },
          "rule": { "en": "Hiding an address is not the same as closing a door.", "es": "Esconder una dirección no es lo mismo que cerrar una puerta." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "A proxied A record is answered with", "es": "Un registro A con proxy se responde con" },
          "options": [
            { "en": "The address of your origin, with a shorter TTL", "es": "La dirección de tu origen, con un TTL más corto" },
            { "en": "Nothing, until the edge checks the request", "es": "Nada, hasta que el borde revisa el pedido" },
            { "en": "Cloudflare anycast addresses", "es": "Direcciones anycast de Cloudflare" }
          ],
          "correct": 2,
          "explanation": { "en": "That is what puts the edge in front: the client connects to Cloudflare, not to you.", "es": "Eso es lo que pone al borde adelante: el cliente se conecta a Cloudflare, no a vos." }
        },
        {
          "question": { "en": "Which record cannot be proxied?", "es": "¿Qué registro no puede ir con proxy?" },
          "options": [
            { "en": "CNAME", "es": "CNAME" },
            { "en": "MX", "es": "MX" },
            { "en": "AAAA", "es": "AAAA" }
          ],
          "correct": 1,
          "explanation": { "en": "Only A, AAAA and CNAME can be proxied; mail and text records are always DNS only.", "es": "Solo A, AAAA y CNAME pueden ir con proxy; los registros de mail y de texto son siempre solo DNS." }
        },
        {
          "question": { "en": "Your API is proxied, but someone calls the origin IP directly. What protects you?", "es": "Tu API va con proxy, pero alguien llama directo a la IP del origen. ¿Qué te protege?" },
          "options": [
            { "en": "The proxy, because it hid the address", "es": "El proxy, porque escondió la dirección" },
            { "en": "Nothing from Cloudflare: that request never met the edge", "es": "Nada de Cloudflare: ese pedido nunca pasó por el borde" },
            { "en": "The WAF, because it sees every request to your IP", "es": "El WAF, porque ve todo pedido a tu IP" }
          ],
          "correct": 1,
          "explanation": { "en": "Close the origin, lesson 04, or make it check who is calling, lesson 15.", "es": "Cerrá el origen, lección 04, o hacé que verifique quién llama, lección 15." }
        }
      ],
      "source": "proxystatus",
      "experiment": { "en": "Switch the record between proxied and DNS only, and follow where the request goes.", "es": "Cambiá el registro entre con proxy y solo DNS, y seguí adónde va el pedido." },
      "visor": { "en": "Nothing appears: these steps ask DNS and the API of Cloudflare, not the edge of the kit.", "es": "No aparece nada: estos pasos le preguntan al DNS y a la API de Cloudflare, no al borde del kit." },
      "lab": [
        {
          "title": { "en": "Resolve a proxied name", "es": "Resolvé un nombre con proxy" },
          "text": { "en": "dns resolves the A records of a name and checks each address against the ranges Cloudflare publishes for its network, read from its API. This step needs internet.", "es": "dns resuelve los registros A de un nombre y compara cada dirección con los rangos que Cloudflare publica para su red, leídos de su API. Este paso necesita internet." },
          "command": "docker compose run --rm lab dns www.cloudflare.com",
          "expected": { "en": "Two or more addresses, each one in Cloudflare's network: the request goes to the edge.", "es": "Dos o más direcciones, cada una en la red de Cloudflare: el pedido va al borde." },
          "checks": [{ "contains": "in Cloudflare's network" }]
        },
        {
          "title": { "en": "Resolve a name that is not behind the proxy", "es": "Resolvé un nombre que no está detrás del proxy" },
          "text": { "en": "A site that does not use the Cloudflare proxy answers with addresses of its own network.", "es": "Un sitio que no usa el proxy de Cloudflare responde con direcciones de su propia red." },
          "command": "docker compose run --rm lab dns github.com",
          "expected": { "en": "The addresses are outside Cloudflare's network: nothing of the edge sits between you and that server.", "es": "Las direcciones están fuera de la red de Cloudflare: nada del borde se pone entre vos y ese servidor." },
          "checks": [{ "contains": "outside Cloudflare's network" }]
        },
        {
          "title": { "en": "Find who answers the DNS of a zone", "es": "Encontrá quién responde el DNS de una zona" },
          "text": { "en": "The NS records say which servers are authoritative for a zone. dig is installed in the lab image.", "es": "Los registros NS dicen qué servidores tienen autoridad sobre una zona. dig está instalado en la imagen del lab." },
          "command": "docker compose run --rm --entrypoint dig lab +short NS cloudflare.com",
          "expected": { "en": "Names under cloudflare.com, such as ns3.cloudflare.com. A zone of a customer gets two assigned names under ns.cloudflare.com instead.", "es": "Nombres bajo cloudflare.com, como ns3.cloudflare.com. La zona de un cliente recibe en cambio dos nombres asignados bajo ns.cloudflare.com." },
          "checks": [{ "matches": "ns\\d\\.cloudflare\\.com\\." }]
        },
        {
          "title": { "en": "Read the ranges Cloudflare publishes", "es": "Leé los rangos que publica Cloudflare" },
          "text": { "en": "The same list the dns command uses. It is how an origin can accept connections only from Cloudflare when it cannot use a tunnel.", "es": "La misma lista que usa el comando dns. Es cómo un origen puede aceptar conexiones solo de Cloudflare cuando no puede usar un túnel." },
          "command": "docker compose run --rm --entrypoint curl lab -s https://api.cloudflare.com/client/v4/ips",
          "expected": { "en": "A JSON with ipv4_cidrs and ipv6_cidrs, such as 104.16.0.0/13, and an etag that changes when the list does.", "es": "Un JSON con ipv4_cidrs e ipv6_cidrs, como 104.16.0.0/13, y un etag que cambia cuando cambia la lista." },
          "checks": [{ "contains": "ipv4_cidrs" }]
        }
      ]
    },
    {
      "id": 3,
      "unit": 1,
      "slug": "tls-two-legs",
      "title": { "en": "TLS in two legs", "es": "TLS en dos tramos" },
      "intro": { "en": "The visitor connects to the edge, and the edge connects to your origin: two connections, one setting.", "es": "El visitante se conecta al borde, y el borde se conecta a tu origen: dos conexiones, un ajuste." },
      "visual": "tls",
      "frames": [
        {
          "title": { "en": "Two connections", "es": "Dos conexiones" },
          "text": { "en": "The first leg goes from the visitor to the edge, with a certificate Cloudflare manages for your zone. The second goes from the edge to your origin, and the SSL/TLS encryption mode of the zone decides how: Off, Flexible, Full, Full (strict) or Strict. It applies to the whole zone; a configuration rule can change it for one hostname. The default is Automatic SSL/TLS, which picks the most secure mode it can and never lowers yours.", "es": "El primer tramo va del visitante al borde, con un certificado que Cloudflare administra para tu zona. El segundo va del borde a tu origen, y lo decide el modo de cifrado SSL/TLS de la zona: Off, Flexible, Full, Full (strict) o Strict. Aplica a toda la zona; una regla de configuración lo puede cambiar para un hostname. El valor por defecto es Automatic SSL/TLS, que elige el modo más seguro que puede y nunca baja el tuyo." },
          "rule": { "en": "A padlock in the browser only speaks for the first leg.", "es": "El candado del navegador solo habla del primer tramo." }
        },
        {
          "title": { "en": "What each mode checks", "es": "Qué verifica cada modo" },
          "text": { "en": "Flexible encrypts the first leg and sends the second in plain HTTP. Full uses HTTPS to the origin without validating its certificate, so a self-signed one is accepted, and so is any server that answers with one. Full (strict) validates it against a public certificate authority or Cloudflare Origin CA. Strict always connects to the origin over HTTPS with validation, whatever the visitor used. Cloudflare strongly recommends Full or Full (strict).", "es": "Flexible cifra el primer tramo y manda el segundo en HTTP plano. Full usa HTTPS hacia el origen sin validar su certificado, así que acepta uno autofirmado, y también cualquier servidor que conteste con uno. Full (strict) lo valida contra una autoridad de certificación pública o contra Cloudflare Origin CA. Strict siempre se conecta al origen por HTTPS con validación, use lo que use el visitante. Cloudflare recomienda fuertemente Full o Full (strict)." },
          "rule": { "en": "Encrypting is not authenticating: Full encrypts, Full (strict) also checks who answers.", "es": "Cifrar no es autenticar: Full cifra, Full (strict) además verifica quién responde." }
        },
        {
          "title": { "en": "The second leg, in the kit", "es": "El segundo tramo, en el kit" },
          "text": { "en": "lab tls plays the edge on the second leg. The origin has a certificate signed by a test CA of the kit, generated when its image is built; an impostor service has a self-signed one for the same name. The kit CA stands for the authorities Full (strict) trusts. It is test material: it is not trusted anywhere else.", "es": "lab tls hace de borde en el segundo tramo. El origen tiene un certificado firmado por una CA de prueba del kit, generada cuando se construye su imagen; un servicio impostor tiene uno autofirmado para el mismo nombre. La CA del kit hace de las autoridades en las que confía Full (strict). Es material de prueba: no se confía en ningún otro lado." },
          "rule": { "en": "Test which server answers, not only whether the line is encrypted.", "es": "Probá qué servidor responde, no solo si la línea está cifrada." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "In Flexible mode, what travels in plain text?", "es": "En modo Flexible, ¿qué viaja en texto plano?" },
          "options": [
            { "en": "The connection from the visitor to the edge", "es": "La conexión del visitante al borde" },
            { "en": "The connection from the edge to the origin", "es": "La conexión del borde al origen" },
            { "en": "Nothing: both legs are encrypted", "es": "Nada: los dos tramos van cifrados" }
          ],
          "correct": 1,
          "explanation": { "en": "The visitor sees a padlock while the second leg is HTTP.", "es": "El visitante ve un candado mientras el segundo tramo va en HTTP." }
        },
        {
          "question": { "en": "Why does Full accept the impostor of the lab?", "es": "¿Por qué Full acepta al impostor del lab?" },
          "options": [
            { "en": "Because Full does not validate the certificate of the origin", "es": "Porque Full no valida el certificado del origen" },
            { "en": "Because the impostor uses a newer version of TLS", "es": "Porque el impostor usa una versión más nueva de TLS" },
            { "en": "Because the impostor answers faster", "es": "Porque el impostor responde más rápido" }
          ],
          "correct": 0,
          "explanation": { "en": "Full encrypts with whatever certificate answers; it does not ask who signed it.", "es": "Full cifra con el certificado que conteste; no pregunta quién lo firmó." }
        },
        {
          "question": { "en": "What lets Full (strict) reject the impostor?", "es": "¿Qué le permite a Full (strict) rechazar al impostor?" },
          "options": [
            { "en": "A rule of the WAF", "es": "Una regla del WAF" },
            { "en": "The IP address of the impostor", "es": "La dirección IP del impostor" },
            { "en": "A certificate that does not chain to a trusted authority", "es": "Un certificado que no encadena con una autoridad confiable" }
          ],
          "correct": 2,
          "explanation": { "en": "The self-signed certificate is valid for the name, but nobody trusted signed it.", "es": "El certificado autofirmado vale para el nombre, pero no lo firmó nadie confiable." }
        }
      ],
      "source": "sslmodes",
      "experiment": { "en": "Pick a mode and see which servers the edge would accept on the second leg.", "es": "Elegí un modo y mirá qué servidores aceptaría el borde en el segundo tramo." },
      "visor": { "en": "Nothing appears either: lab tls plays the leg from the edge to the origin by connecting from its own container to the origin and to the impostor, and the Worker is not on that path.", "es": "Tampoco aparece nada: lab tls hace de tramo entre el borde y el origen conectándose desde su propio contenedor al origen y al impostor, y el Worker no está en ese camino." },
      "lab": [
        {
          "title": { "en": "Start the impostor", "es": "Levantá el impostor" },
          "text": { "en": "The impostor uses the image of the origin with a self-signed certificate. It is in the tls profile, so it only runs when you ask for it.", "es": "El impostor usa la imagen del origen con un certificado autofirmado. Está en el perfil tls, así que solo corre cuando lo pedís." },
          "command": "docker compose --profile tls up -d --wait impostor",
          "expected": { "en": "prumathe-cf-impostor-1 ends Healthy, once its HTTPS port answers.", "es": "prumathe-cf-impostor-1 termina Healthy, cuando su puerto HTTPS responde." },
          "checks": [{ "contains": "prumathe-cf-impostor-1" }]
        },
        {
          "title": { "en": "Flexible: the second leg in plain HTTP", "es": "Flexible: el segundo tramo en HTTP plano" },
          "text": { "en": "The lab connects to the origin on port 8080, as the edge does in Flexible.", "es": "El lab se conecta al origen en el puerto 8080, como hace el borde en Flexible." },
          "command": "docker compose run --rm lab tls flexible",
          "expected": { "en": "encrypted: no, and the answer of the origin: whoever is between the edge and your origin can read and change it.", "es": "encrypted: no, y la respuesta del origen: quien esté entre el borde y tu origen la puede leer y cambiar." },
          "checks": [{ "contains": "encrypted: no" }]
        },
        {
          "title": { "en": "Full: any certificate will do", "es": "Full: cualquier certificado sirve" },
          "text": { "en": "HTTPS to the impostor, without checking the certificate.", "es": "HTTPS al impostor, sin verificar el certificado." },
          "command": "docker compose run --rm lab tls full impostor",
          "expected": { "en": "certificate: subject origin, issuer origin, a self-signed one, and result: accepted with the answer Not Rumbo: an impostor. The line was encrypted, to the wrong server.", "es": "certificate: subject origin, issuer origin, uno autofirmado, y result: accepted con la respuesta Not Rumbo: an impostor. La línea iba cifrada, al servidor equivocado." },
          "checks": [{ "contains": "Not Rumbo: an impostor" }]
        },
        {
          "title": { "en": "Full (strict) with the real origin", "es": "Full (strict) con el origen real" },
          "text": { "en": "HTTPS to the origin, validating its certificate against the CA of the kit, for the name origin.", "es": "HTTPS al origen, validando su certificado contra la CA del kit, para el nombre origin." },
          "command": "docker compose run --rm lab tls strict origin",
          "expected": { "en": "issuer Rumbo course test CA and result: accepted.", "es": "issuer Rumbo course test CA y result: accepted." },
          "checks": [{ "contains": "issuer Rumbo course test CA" }, { "contains": "result: accepted" }]
        },
        {
          "title": { "en": "Full (strict) with the impostor", "es": "Full (strict) con el impostor" },
          "text": { "en": "The same validation, against the impostor.", "es": "La misma validación, contra el impostor." },
          "command": "docker compose run --rm lab tls strict impostor",
          "expected": { "en": "result: rejected (DEPTH_ZERO_SELF_SIGNED_CERT): the certificate is for the right name, but nobody trusted signed it.", "es": "result: rejected (DEPTH_ZERO_SELF_SIGNED_CERT): el certificado es para el nombre correcto, pero no lo firmó nadie confiable." },
          "checks": [{ "contains": "result: rejected" }]
        },
        {
          "title": { "en": "Stop the impostor", "es": "Pará el impostor" },
          "text": { "en": "The impostor is only for this lesson.", "es": "El impostor es solo para esta lección." },
          "command": "docker compose --profile tls stop impostor",
          "expected": { "en": "prumathe-cf-impostor-1 Stopped.", "es": "prumathe-cf-impostor-1 Stopped." },
          "checks": [{ "contains": "Stopped" }]
        }
      ]
    },
    {
      "id": 4,
      "unit": 1,
      "slug": "origin-without-open-ports",
      "title": { "en": "An origin with no open ports", "es": "Un origen sin puertos abiertos" },
      "intro": { "en": "The origin dials out to Cloudflare, and requests come back through that connection.", "es": "El origen llama hacia Cloudflare, y los pedidos vuelven por esa conexión." },
      "visual": "tunnel",
      "frames": [
        {
          "title": { "en": "Nothing listens on the internet", "es": "Nada escucha en internet" },
          "text": { "en": "Cloudflare Tunnel: cloudflared, a small program next to your service, opens outbound connections to Cloudflare, and the edge sends the requests for your hostname through them. Each tunnel keeps four long-lived connections to two data centers. What it is for: publishing a service with no open inbound port and no public IP. It is available on all plans.", "es": "Cloudflare Tunnel: cloudflared, un programa chico al lado de tu servicio, abre conexiones salientes hacia Cloudflare, y el borde manda por ahí los pedidos para tu hostname. Cada túnel mantiene cuatro conexiones de larga duración con dos data centers. Para qué sirve: publicar un servicio sin puertos de entrada abiertos y sin IP pública. Está disponible en todos los planes." },
          "rule": { "en": "Outbound only: the firewall of the origin can stay closed.", "es": "Solo saliente: el firewall del origen puede quedar cerrado." }
        },
        {
          "title": { "en": "Quick tunnel and named tunnel", "es": "Túnel rápido y túnel con nombre" },
          "text": { "en": "A quick tunnel needs no account: cloudflared gets a random name under trycloudflare.com, for testing, with limits such as 200 requests in flight and no server-sent events. A named tunnel belongs to your account, survives restarts and maps hostnames of your zone to local services; with Access in front, lesson 15, only identified people reach them.", "es": "Un túnel rápido no necesita cuenta: cloudflared recibe un nombre al azar bajo trycloudflare.com, para pruebas, con límites como 200 pedidos en curso y sin server-sent events. Un túnel con nombre es de tu cuenta, sobrevive reinicios y asocia hostnames de tu zona con servicios locales; con Access delante, lección 15, solo llegan personas identificadas." },
          "rule": { "en": "Quick tunnels are for trying; named tunnels are for running.", "es": "Los túneles rápidos son para probar; los túneles con nombre, para operar." }
        },
        {
          "title": { "en": "The door you forgot", "es": "La puerta que te olvidaste" },
          "text": { "en": "A tunnel adds a way in; it does not close the others. If the origin still listens on a public address, anyone who finds it skips the edge, with its cache, WAF and Access. With a tunnel, the origin can listen only on its private network, as it does in the kit.", "es": "Un túnel agrega una entrada; no cierra las otras. Si el origen sigue escuchando en una dirección pública, quien la encuentre se saltea el borde, con su cache, su WAF y Access. Con un túnel, el origen puede escuchar solo en su red privada, como pasa en el kit." },
          "rule": { "en": "The tunnel protects only if it is the only way in.", "es": "El túnel protege solo si es la única entrada." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Which way do the connections of cloudflared go?", "es": "¿Hacia dónde van las conexiones de cloudflared?" },
          "options": [
            { "en": "From Cloudflare into your network", "es": "De Cloudflare hacia tu red" },
            { "en": "From the visitor straight to cloudflared", "es": "Del visitante directo a cloudflared" },
            { "en": "From your network out to Cloudflare", "es": "De tu red hacia Cloudflare" }
          ],
          "correct": 2,
          "explanation": { "en": "That is why no inbound port is needed: the requests come back through a connection the origin opened.", "es": "Por eso no hace falta un puerto de entrada: los pedidos vuelven por una conexión que abrió el origen." }
        },
        {
          "question": { "en": "What does a quick tunnel need?", "es": "¿Qué necesita un túnel rápido?" },
          "options": [
            { "en": "Only cloudflared and internet access", "es": "Solo cloudflared y acceso a internet" },
            { "en": "A Cloudflare account and a zone", "es": "Una cuenta de Cloudflare y una zona" },
            { "en": "An open port on the origin", "es": "Un puerto abierto en el origen" }
          ],
          "correct": 0,
          "explanation": { "en": "It gets a random trycloudflare.com name; it is meant for testing.", "es": "Recibe un nombre al azar de trycloudflare.com; es para pruebas." }
        },
        {
          "question": { "en": "Your origin has a tunnel and still listens on a public IP. What follows?", "es": "Tu origen tiene un túnel y sigue escuchando en una IP pública. ¿Qué pasa?" },
          "options": [
            { "en": "Requests to that IP skip the edge and its protections", "es": "Los pedidos a esa IP se saltean el borde y sus protecciones" },
            { "en": "The tunnel encrypts the requests to the public port too", "es": "El túnel cifra también los pedidos al puerto público" },
            { "en": "Cloudflare closes the public port automatically", "es": "Cloudflare cierra el puerto público automáticamente" }
          ],
          "correct": 0,
          "explanation": { "en": "A tunnel adds a way in; closing the others is your job.", "es": "Un túnel agrega una entrada; cerrar las otras es tarea tuya." }
        }
      ],
      "source": "tunnel",
      "experiment": { "en": "Open and close the public port of the origin, and see which requests skip the edge.", "es": "Abrí y cerrá el puerto público del origen, y mirá qué pedidos se saltean el borde." },
      "visor": { "en": "The request of the tunnel does not cross the Worker of the kit: it goes from Cloudflare through cloudflared to the origin, so the viewer stays still while it travels.", "es": "El pedido del túnel no cruza el Worker del kit: va de Cloudflare por cloudflared al origen, así que el visor queda quieto mientras viaja." },
      "lab": [
        {
          "title": { "en": "Ask Compose for the public port of the origin", "es": "Pedile a Compose el puerto público del origen" },
          "text": { "en": "docker compose port prints the address on your machine where a container port is published.", "es": "docker compose port imprime la dirección en tu máquina donde se publica un puerto del contenedor." },
          "command": "docker compose port origin 8080",
          "expected": { "en": ":0, that is, no address: port 8080 of the origin is not published. Compare with docker compose port edge 8787.", "es": ":0, es decir, ninguna dirección: el puerto 8080 del origen no está publicado. Compará con docker compose port edge 8787." },
          "checks": [{ "contains": ":0" }]
        },
        {
          "title": { "en": "Start a quick tunnel", "es": "Levantá un túnel rápido" },
          "text": { "en": "The tunnel service runs cloudflared 2026.11.0 pointed at http://origin:8080, inside the Compose network. It needs internet; some corporate networks block it.", "es": "El servicio tunnel corre cloudflared 2026.11.0 apuntado a http://origin:8080, dentro de la red de Compose. Necesita internet; algunas redes corporativas lo bloquean." },
          "command": "docker compose --profile tunnel up -d tunnel",
          "expected": { "en": "prumathe-cf-tunnel-1 Started.", "es": "prumathe-cf-tunnel-1 Started." },
          "checks": [{ "contains": "prumathe-cf-tunnel-1" }]
        },
        {
          "title": { "en": "Call the origin through Cloudflare", "es": "Llamá al origen a través de Cloudflare" },
          "text": { "en": "tunnel waits until cloudflared is connected, reads the random hostname and requests a shipment through it. It does not wait for DNS, where a new name can take a minute to appear: it sends the request to the address of trycloudflare.com with the new name, and the edge routes it by that name. The name is public while the tunnel runs: anyone with it reaches the test API of the kit.", "es": "tunnel espera a que cloudflared esté conectado, lee el hostname al azar y pide un envío por ahí. No espera al DNS, donde un nombre nuevo puede tardar un minuto en aparecer: manda el pedido a la dirección de trycloudflare.com con el nombre nuevo, y el borde lo enruta por ese nombre. El nombre es público mientras el túnel corre: quien lo tenga llega a la API de prueba del kit." },
          "command": "docker compose run --rm lab tunnel",
          "expected": { "en": "A trycloudflare.com name, HTTP 200, server: cloudflare, a cf-ray and cf-cache-status: DYNAMIC, with the body of rumbo-origin: the request crossed the Cloudflare network and entered through a connection the origin side opened. In the validation runs it took between 14 and 41 seconds, depending on how soon Cloudflare routed the new name.", "es": "Un nombre de trycloudflare.com, HTTP 200, server: cloudflare, un cf-ray y cf-cache-status: DYNAMIC, con el cuerpo de rumbo-origin: el pedido cruzó la red de Cloudflare y entró por una conexión que abrió el lado del origen. En las corridas de validación tardó entre 14 y 41 segundos, según cuánto tardó Cloudflare en enrutar el nombre nuevo." },
          "checks": [{ "contains": "server: cloudflare" }, { "contains": "\"servedBy\": \"rumbo-origin\"" }]
        },
        {
          "title": { "en": "Read how cloudflared connected", "es": "Leé cómo se conectó cloudflared" },
          "text": { "en": "The log of cloudflared says where its connection went.", "es": "El log de cloudflared dice adónde fue su conexión." },
          "command": "docker compose logs tunnel",
          "expected": { "en": "Registered tunnel connection, with a location such as lhr20 and protocol=quic: an outbound connection to a data center. A quick tunnel showed one connection in the validation run; a named tunnel keeps four.", "es": "Registered tunnel connection, con una location como lhr20 y protocol=quic: una conexión saliente a un data center. Un túnel rápido mostró una conexión en la corrida de validación; un túnel con nombre mantiene cuatro." },
          "checks": [{ "contains": "Registered tunnel connection" }]
        },
        {
          "title": { "en": "Close the tunnel", "es": "Cerrá el túnel" },
          "text": { "en": "Stopping cloudflared removes the only way in from the internet.", "es": "Parar cloudflared saca la única entrada desde internet." },
          "command": "docker compose --profile tunnel stop tunnel",
          "expected": { "en": "prumathe-cf-tunnel-1 Stopped; the trycloudflare.com name stops answering.", "es": "prumathe-cf-tunnel-1 Stopped; el nombre de trycloudflare.com deja de responder." },
          "checks": [{ "contains": "Stopped" }]
        }
      ]
    },
    {
      "id": 5,
      "unit": 2,
      "slug": "isolates",
      "title": { "en": "An isolate, not a container", "es": "Un isolate, no un contenedor" },
      "intro": { "en": "Your code runs in a V8 isolate inside a process that runs many others, and global state is a guess.", "es": "Tu código corre en un isolate de V8 dentro de un proceso que corre muchos otros, y el estado global es una apuesta." },
      "visual": "isolate",
      "frames": [
        {
          "title": { "en": "Isolates instead of machines", "es": "Isolates en lugar de máquinas" },
          "text": { "en": "A Worker does not get a virtual machine or a container: it gets a V8 isolate inside a runtime process that already exists, and one instance of the runtime runs hundreds or thousands of isolates. An isolate starts around a hundred times faster than a Node process in a container and uses an order of magnitude less memory, which removes the cold start of the virtual machine model.", "es": "Un Worker no recibe una máquina virtual ni un contenedor: recibe un isolate de V8 dentro de un proceso del runtime que ya existe, y una instancia del runtime corre cientos o miles de isolates. Un isolate arranca unas cien veces más rápido que un proceso de Node en un contenedor y usa un orden de magnitud menos de memoria, lo que elimina el arranque en frío del modelo de máquinas virtuales." },
          "rule": { "en": "Many isolates per process: cheap to start, nothing to keep.", "es": "Muchos isolates por proceso: arrancar es barato, no hay nada que guardar." }
        },
        {
          "title": { "en": "Global state is not yours to keep", "es": "El estado global no es tuyo" },
          "text": { "en": "Isolates are not necessarily long lived: they can be evicted for resource limits and other reasons, and two requests of the same user may reach different instances, in the same data center or in another. A variable at module level survives between some requests and not others. Cloudflare recommends not using or mutating global state; state goes to a binding, unit 5.", "es": "Los isolates no necesariamente duran: se pueden desalojar por límites de recursos y otros motivos, y dos pedidos del mismo usuario pueden llegar a instancias distintas, en el mismo data center o en otro. Una variable a nivel de módulo sobrevive entre algunos pedidos y no entre otros. Cloudflare recomienda no usar ni modificar el estado global; el estado va a un binding, unidad 5." },
          "rule": { "en": "A counter in a global variable counts one isolate, for a while.", "es": "Un contador en una variable global cuenta un isolate, por un rato." }
        },
        {
          "title": { "en": "CPU, memory and the free plan", "es": "CPU, memoria y el plan gratuito" },
          "text": { "en": "The limit that matters is CPU time, not wall time: waiting for fetch or a binding does not count. The free plan gives 10 ms of CPU per request and 100,000 requests per day; the paid plan, 30 seconds by default and up to 5 minutes. Each isolate has 128 MB of memory, and a request can make 50 subrequests on the free plan. The runtime also refuses random values, timers and I/O at global scope: they belong in a handler.", "es": "El límite que importa es el tiempo de CPU, no el tiempo de reloj: esperar a fetch o a un binding no cuenta. El plan gratuito da 10 ms de CPU por pedido y 100.000 pedidos por día; el pago, 30 segundos por defecto y hasta 5 minutos. Cada isolate tiene 128 MB de memoria, y un pedido puede hacer 50 subpedidos en el plan gratuito. El runtime además rechaza valores aleatorios, timers y E/S a nivel global: van dentro de un handler." },
          "rule": { "en": "Budget CPU, not seconds.", "es": "Presupuestá CPU, no segundos." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Where does a Worker run inside a data center?", "es": "¿Dónde corre un Worker dentro de un data center?" },
          "options": [
            { "en": "In a container started for each request", "es": "En un contenedor que se arranca para cada pedido" },
            { "en": "In a V8 isolate inside a shared runtime process", "es": "En un isolate de V8 dentro de un proceso compartido del runtime" },
            { "en": "In a virtual machine reserved for your account", "es": "En una máquina virtual reservada para tu cuenta" }
          ],
          "correct": 1,
          "explanation": { "en": "That is why it starts fast and why the process is not yours.", "es": "Por eso arranca rápido y por eso el proceso no es tuyo." }
        },
        {
          "question": { "en": "A global counter of the Worker reached 2 and then went back to 1. What happened?", "es": "Un contador global del Worker llegó a 2 y después volvió a 1. ¿Qué pasó?" },
          "options": [
            { "en": "KV lost a write", "es": "KV perdió una escritura" },
            { "en": "The CPU limit reset the variable", "es": "El límite de CPU reinició la variable" },
            { "en": "The request was served by a new isolate", "es": "El pedido lo atendió un isolate nuevo" }
          ],
          "correct": 2,
          "explanation": { "en": "Module state lives as long as its isolate, and nothing promises the next request the same one.", "es": "El estado del módulo vive lo que vive su isolate, y nada le promete al próximo pedido el mismo." }
        },
        {
          "question": { "en": "A Worker waits 2 seconds for its origin. How much of the 10 ms CPU limit of the free plan does the wait use?", "es": "Un Worker espera 2 segundos a su origen. ¿Cuánto del límite de 10 ms de CPU del plan gratuito usa la espera?" },
          "options": [
            { "en": "None: waiting for I/O is not CPU time", "es": "Nada: esperar E/S no es tiempo de CPU" },
            { "en": "Half, because waiting counts at half rate", "es": "La mitad, porque esperar cuenta a mitad de tarifa" },
            { "en": "All of it: the request is cut after 10 ms", "es": "Todo: el pedido se corta a los 10 ms" }
          ],
          "correct": 0,
          "explanation": { "en": "The limit is CPU time: parsing, computing, serializing. Waiting is wall time.", "es": "El límite es tiempo de CPU: parsear, calcular, serializar. Esperar es tiempo de reloj." }
        }
      ],
      "source": "howworkers",
      "experiment": { "en": "Send requests to two isolates and evict one: see what the global counter remembers.", "es": "Mandá pedidos a dos isolates y desalojá uno: mirá qué recuerda el contador global." },
      "visor": { "en": "Each lab isolate is a GET /lab/isolate that the Worker answers alone. docker compose restart edge restarts the viewer too: it reads the same spans again and the list comes back.", "es": "Cada lab isolate es un GET /lab/isolate que el Worker responde solo. docker compose restart edge reinicia también el visor: vuelve a leer los mismos spans y la lista reaparece." },
      "lab": [
        {
          "title": { "en": "Ask the isolate who it is", "es": "Preguntale al isolate quién es" },
          "text": { "en": "/lab/isolate returns an id drawn by the isolate on its first request and a counter kept in a global variable.", "es": "/lab/isolate devuelve un id que el isolate saca en su primer pedido y un contador que guarda en una variable global." },
          "command": "docker compose run --rm lab isolate",
          "expected": { "en": "An isolate id of eight characters and hits with a small number.", "es": "Un id de isolate de ocho caracteres y hits con un número chico." },
          "checks": [{ "matches": "\"isolate\": \"[0-9a-f]{8}\"" }]
        },
        {
          "title": { "en": "Ask again", "es": "Preguntá de nuevo" },
          "text": { "en": "Locally there is one isolate, so the global variable seems to work.", "es": "En local hay un solo isolate, así que la variable global parece funcionar." },
          "command": "docker compose run --rm lab isolate",
          "expected": { "en": "The same id, and hits one more than before.", "es": "El mismo id, y hits uno más que antes." },
          "checks": [{ "matches": "\"hits\": ([2-9]|\\d\\d+)" }]
        },
        {
          "title": { "en": "Restart the edge", "es": "Reiniciá el borde" },
          "text": { "en": "A restart is what eviction looks like from the outside: the runtime starts again with fresh isolates. Storage on disk stays.", "es": "Un reinicio es como se ve un desalojo desde afuera: el runtime arranca de nuevo con isolates frescos. Lo guardado en disco queda." },
          "command": "docker compose restart edge",
          "expected": { "en": "prumathe-cf-edge-1 Started. The next lab command waits until the edge answers again.", "es": "prumathe-cf-edge-1 Started. El próximo comando lab espera a que el borde vuelva a responder." },
          "checks": [{ "contains": "prumathe-cf-edge-1" }]
        },
        {
          "title": { "en": "Ask the new isolate", "es": "Preguntale al isolate nuevo" },
          "text": { "en": "Same route, same code, after the restart.", "es": "Misma ruta, mismo código, después del reinicio." },
          "command": "docker compose run --rm lab isolate",
          "expected": { "en": "Another id and hits: 1. On Cloudflare there is no restart to see: requests are spread over many isolates, in many data centers, and each counts its own.", "es": "Otro id y hits: 1. En Cloudflare no hay un reinicio a la vista: los pedidos se reparten en muchos isolates, en muchos data centers, y cada uno cuenta lo suyo." },
          "checks": [{ "contains": "\"hits\": 1" }]
        }
      ]
    },
    {
      "id": 6,
      "unit": 2,
      "slug": "wrangler-and-config",
      "title": { "en": "Wrangler and the configuration", "es": "Wrangler y la configuración" },
      "intro": { "en": "One file says what the Worker is and what it can reach; secrets stay out of it.", "es": "Un archivo dice qué es el Worker y a qué puede llegar; los secretos quedan afuera." },
      "visual": "config",
      "frames": [
        {
          "title": { "en": "wrangler.jsonc", "es": "wrangler.jsonc" },
          "text": { "en": "Wrangler is the command line for Workers: dev, deploy, tail, migrations, secrets. Its configuration file names the Worker, its entry point and its compatibility date, which pins the behavior of the runtime to that day; flags such as nodejs_compat turn on more APIs. Each binding is a name in env pointing to a resource: a KV namespace, a D1 database, a queue. Locally the ids only name local stores; on the account they name real resources.", "es": "Wrangler es la línea de comandos de Workers: dev, deploy, tail, migraciones, secretos. Su archivo de configuración nombra al Worker, su punto de entrada y su fecha de compatibilidad, que fija el comportamiento del runtime a ese día; flags como nodejs_compat prenden más APIs. Cada binding es un nombre en env que apunta a un recurso: un namespace de KV, una base D1, una cola. En local los ids solo nombran almacenes locales; en la cuenta nombran recursos reales." },
          "rule": { "en": "A binding is a capability: if it is not in the file, the Worker cannot reach it.", "es": "Un binding es una capacidad: si no está en el archivo, el Worker no llega a eso." }
        },
        {
          "title": { "en": "Vars and secrets", "es": "Variables y secretos" },
          "text": { "en": "vars in the configuration are plain values, committed with the code; the documentation says not to put sensitive information there. Secrets go to the account with wrangler secret put and, for local development, in a .dev.vars file or a .env file next to the configuration, never both and never committed. wrangler dev reads .dev.vars when it starts. wrangler types generates the TypeScript type of env from the file.", "es": "Las vars de la configuración son valores planos, que se versionan con el código; la documentación dice no poner ahí información sensible. Los secretos van a la cuenta con wrangler secret put y, para desarrollo local, en un archivo .dev.vars o .env al lado de la configuración, nunca los dos y nunca versionados. wrangler dev lee .dev.vars cuando arranca. wrangler types genera el tipo de TypeScript de env a partir del archivo." },
          "rule": { "en": "If it is in the repository, it is not a secret.", "es": "Si está en el repositorio, no es un secreto." }
        },
        {
          "title": { "en": "Wrangler 4 and cf", "es": "Wrangler 4 y cf" },
          "text": { "en": "The course pins Wrangler 4.162.0. Since 28 September 2026, cf, a new command line for the whole Cloudflare API, is in open beta; when the beta ends, Wrangler gets a last major version that points to cf, with 18 months of maintenance. The concepts of the course are the same in both: configuration, bindings, versions.", "es": "El curso fija Wrangler 4.162.0. Desde el 28 de septiembre de 2026, cf, una línea de comandos nueva para toda la API de Cloudflare, está en beta abierta; cuando termine la beta, Wrangler sale con una última versión mayor que remite a cf, con 18 meses de mantenimiento. Los conceptos del curso son los mismos en las dos: configuración, bindings, versiones." },
          "rule": { "en": "Pin the tool; learn the model behind it.", "es": "Fijá la herramienta; aprendé el modelo que tiene atrás." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "What is a binding?", "es": "¿Qué es un binding?" },
          "options": [
            { "en": "A name in env that gives the Worker access to one resource", "es": "Un nombre en env que le da al Worker acceso a un recurso" },
            { "en": "A DNS record that points to the Worker", "es": "Un registro DNS que apunta al Worker" },
            { "en": "A library you import from npm", "es": "Una biblioteca que importás de npm" }
          ],
          "correct": 0,
          "explanation": { "en": "The Worker reaches only what its configuration binds.", "es": "El Worker llega solo a lo que su configuración le asocia." }
        },
        {
          "question": { "en": "Where does a secret go for local development?", "es": "¿Dónde va un secreto para desarrollo local?" },
          "options": [
            { "en": "In vars of wrangler.jsonc", "es": "En vars de wrangler.jsonc" },
            { "en": "In compatibility_flags", "es": "En compatibility_flags" },
            { "en": "In .dev.vars or .env, out of the repository", "es": "En .dev.vars o .env, fuera del repositorio" }
          ],
          "correct": 2,
          "explanation": { "en": "vars are committed with the code; .dev.vars and .env are not.", "es": "Las vars se versionan con el código; .dev.vars y .env no." }
        },
        {
          "question": { "en": "Why did the lab restart the edge after writing .dev.vars?", "es": "¿Por qué el lab reinició el borde después de escribir .dev.vars?" },
          "options": [
            { "en": "Because secrets need a new compatibility date", "es": "Porque los secretos necesitan una fecha de compatibilidad nueva" },
            { "en": "Because wrangler dev reads .dev.vars when it starts", "es": "Porque wrangler dev lee .dev.vars cuando arranca" },
            { "en": "Because the file must be committed first", "es": "Porque el archivo primero tiene que estar versionado" }
          ],
          "correct": 1,
          "explanation": { "en": "Edits to the source reload the Worker; the local secrets file is read at start.", "es": "Los cambios del código recargan el Worker; el archivo de secretos locales se lee al arrancar." }
        }
      ],
      "source": "wranglerconfig",
      "experiment": { "en": "Move a value between vars and secrets, and see where it ends up and who can read it.", "es": "Mové un valor entre vars y secretos, y mirá dónde termina y quién lo puede leer." },
      "visor": { "en": "lab config shows as GET /lab/config, answered by the Worker alone. The wrangler commands work on files and leave nothing.", "es": "lab config aparece como GET /lab/config, respondido por el Worker solo. Los comandos de wrangler trabajan sobre archivos y no dejan nada." },
      "lab": [
        {
          "title": { "en": "See which Wrangler runs", "es": "Mirá qué Wrangler corre" },
          "text": { "en": "exec runs a command inside the edge container, where Wrangler is installed.", "es": "exec corre un comando dentro del contenedor del borde, donde está instalado Wrangler." },
          "command": "docker compose exec edge npx wrangler --version",
          "expected": { "en": "4.162.0, the version fixed in package.json of the edge.", "es": "4.162.0, la versión fijada en package.json del borde." },
          "checks": [{ "contains": "4.162.0" }]
        },
        {
          "title": { "en": "Read what the Worker can reach", "es": "Leé a qué puede llegar el Worker" },
          "text": { "en": "/lab/config lists the vars, whether the secret RUMBO_TOKEN exists, never its value, and the names of the bindings in env.", "es": "/lab/config lista las vars, si existe el secreto RUMBO_TOKEN, nunca su valor, y los nombres de los bindings en env." },
          "command": "docker compose run --rm lab config",
          "expected": { "en": "Three vars, RUMBO_TOKEN: not set and nine bindings: COUNTERS, DB, FLAGS, LIMITER, MOVES, PG, PROOFS, RETURNS and SHIPMENTS.", "es": "Tres vars, RUMBO_TOKEN: not set y nueve bindings: COUNTERS, DB, FLAGS, LIMITER, MOVES, PG, PROOFS, RETURNS y SHIPMENTS." },
          "checks": [{ "contains": "\"RUMBO_TOKEN\": \"not set\"" }, { "contains": "\"SHIPMENTS\"" }]
        },
        {
          "title": { "en": "Write a local secret", "es": "Escribí un secreto local" },
          "text": { "en": "The file goes inside the edge container, next to wrangler.jsonc, not in your folder: it never reaches the repository and disappears when the container is recreated.", "es": "El archivo va dentro del contenedor del borde, al lado de wrangler.jsonc, no en tu carpeta: nunca llega al repositorio y desaparece cuando se recrea el contenedor." },
          "command": "docker compose exec edge sh -c \"echo RUMBO_TOKEN=local-only-value > .dev.vars\"",
          "expected": { "en": "No output: the file exists, and wrangler dev has not read it yet.", "es": "Sin salida: el archivo existe, y wrangler dev todavía no lo leyó." },
          "checks": []
        },
        {
          "title": { "en": "Restart and read the secret", "es": "Reiniciá y leé el secreto" },
          "text": { "en": "wrangler dev reads .dev.vars when it starts.", "es": "wrangler dev lee .dev.vars cuando arranca." },
          "command": "docker compose restart edge\ndocker compose run --rm lab config",
          "expected": { "en": "RUMBO_TOKEN: set, 16 characters. The Worker sees the value; the lab prints only its length.", "es": "RUMBO_TOKEN: set, 16 characters. El Worker ve el valor; el lab imprime solo su largo." },
          "checks": [{ "contains": "set, 16 characters" }]
        },
        {
          "title": { "en": "Generate the types of env", "es": "Generá los tipos de env" },
          "text": { "en": "wrangler types reads the configuration and writes worker-configuration.d.ts, with the type of env and the types of the runtime.", "es": "wrangler types lee la configuración y escribe worker-configuration.d.ts, con el tipo de env y los tipos del runtime." },
          "command": "docker compose exec edge npx wrangler types",
          "expected": { "en": "An Env with FLAGS: KVNamespace, DB: D1Database, MOVES: Queue and the rest, RUMBO_TOKEN: string from .dev.vars, and Types written to worker-configuration.d.ts.", "es": "Un Env con FLAGS: KVNamespace, DB: D1Database, MOVES: Queue y el resto, RUMBO_TOKEN: string de .dev.vars, y Types written to worker-configuration.d.ts." },
          "checks": [{ "contains": "FLAGS: KVNamespace;" }, { "contains": "worker-configuration.d.ts" }]
        }
      ]
    },
    {
      "id": 7,
      "unit": 2,
      "slug": "worker-in-front",
      "title": { "en": "A Worker in front of your API", "es": "Un Worker delante de tu API" },
      "intro": { "en": "The Worker sees each request first: it answers, rewrites, refuses or forwards.", "es": "El Worker ve cada pedido primero: responde, reescribe, rechaza o reenvía." },
      "visual": "gateway",
      "frames": [
        {
          "title": { "en": "A handler for every request", "es": "Un handler para cada pedido" },
          "text": { "en": "The fetch handler receives a Request, the env with the bindings and a context, and returns a Response. In between it can answer by itself, call the origin with fetch and change what comes back. In Rumbo, the gateway adds x-rumbo-request-id and x-rumbo-edge on the way in, and x-rumbo-via on the way out.", "es": "El handler fetch recibe un Request, el env con los bindings y un contexto, y devuelve un Response. En el medio puede responder solo, llamar al origen con fetch y cambiar lo que vuelve. En Rumbo, el gateway agrega x-rumbo-request-id y x-rumbo-edge a la ida, y x-rumbo-via a la vuelta." },
          "rule": { "en": "The Worker owns the request until it returns a Response.", "es": "El Worker es dueño del pedido hasta que devuelve un Response." }
        },
        {
          "title": { "en": "Decide before the origin", "es": "Decidir antes del origen" },
          "text": { "en": "Some answers never need the origin. A CORS preflight is answered at the edge, only for the shop that is allowed. A route of the admin API is refused with 403: the origin gets no load from it and never sees it. Each decision taken at the edge is one the origin does not have to take, and one it cannot get wrong.", "es": "Algunas respuestas nunca necesitan al origen. Un preflight de CORS se responde en el borde, solo para la tienda permitida. Una ruta de la API de administración se rechaza con 403: al origen no le llega carga ni la ve. Cada decisión que se toma en el borde es una que el origen no tiene que tomar, y que no puede tomar mal." },
          "rule": { "en": "Refuse as early as you can.", "es": "Rechazá lo más temprano que puedas." }
        },
        {
          "title": { "en": "After the answer", "es": "Después de la respuesta" },
          "text": { "en": "ctx.waitUntil keeps work going after the response is sent, for up to 30 seconds: the gateway records the last request in KV without making the client wait. Service bindings let one Worker call another without going through the public internet; the course does not use them.", "es": "ctx.waitUntil mantiene trabajo en curso después de mandar la respuesta, hasta 30 segundos: el gateway registra el último pedido en KV sin hacer esperar al cliente. Los service bindings dejan que un Worker llame a otro sin pasar por internet público; el curso no los usa." },
          "rule": { "en": "What the client does not need, do after answering.", "es": "Lo que el cliente no necesita, hacelo después de responder." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Which request never reaches the origin of Rumbo?", "es": "¿Qué pedido nunca llega al origen de Rumbo?" },
          "options": [
            { "en": "GET /api/shipments/R-1043", "es": "GET /api/shipments/R-1043" },
            { "en": "GET /track/R-1043", "es": "GET /track/R-1043" },
            { "en": "GET /api/admin/users", "es": "GET /api/admin/users" }
          ],
          "correct": 2,
          "explanation": { "en": "The gateway answers 403 itself; the spans show no fetch to the origin.", "es": "El gateway responde 403 solo; los spans no muestran fetch al origen." }
        },
        {
          "question": { "en": "What does ctx.waitUntil do?", "es": "¿Qué hace ctx.waitUntil?" },
          "options": [
            { "en": "Makes the client wait for a binding", "es": "Hace esperar al cliente por un binding" },
            { "en": "Keeps work running after the response, for up to 30 seconds", "es": "Mantiene trabajo corriendo después de la respuesta, hasta 30 segundos" },
            { "en": "Retries the fetch if the origin fails", "es": "Reintenta el fetch si el origen falla" }
          ],
          "correct": 1,
          "explanation": { "en": "The client gets its answer; the edge finishes the rest.", "es": "El cliente recibe su respuesta; el borde termina el resto." }
        },
        {
          "question": { "en": "A preflight comes from https://other.example. What does the gateway answer?", "es": "Llega un preflight de https://other.example. ¿Qué responde el gateway?" },
          "options": [
            { "en": "403, like the admin API", "es": "403, como la API de administración" },
            { "en": "204 without access-control headers, so the browser refuses", "es": "204 sin encabezados access-control, así que el navegador rechaza" },
            { "en": "It forwards the preflight to the origin", "es": "Reenvía el preflight al origen" }
          ],
          "correct": 1,
          "explanation": { "en": "CORS is enforced by the browser: the edge only decides whether to grant it.", "es": "CORS lo hace cumplir el navegador: el borde solo decide si lo concede." }
        }
      ],
      "source": "workercontext",
      "experiment": { "en": "Send the same request with different paths and origins, and see which ones reach Spring Boot.", "es": "Mandá el mismo pedido con distintas rutas y orígenes, y mirá cuáles llegan a Spring Boot." },
      "visor": { "en": "GET /api/shipments/R-1043 lights rate limit, KV and the API of Rumbo; the two OPTIONS and /api/admin/users stop at the Worker. It is the drawing of what lab spans prints.", "es": "GET /api/shipments/R-1043 enciende rate limit, KV y la API de Rumbo; los dos OPTIONS y /api/admin/users frenan en el Worker. Es el dibujo de lo que imprime lab spans." },
      "lab": [
        {
          "title": { "en": "A request the Worker forwards", "es": "Un pedido que el Worker reenvía" },
          "text": { "en": "The gateway forwards everything it does not answer itself to the origin.", "es": "El gateway reenvía al origen todo lo que no responde solo." },
          "command": "docker compose run --rm lab get /api/shipments/R-1043",
          "expected": { "en": "HTTP 200 from rumbo-origin with x-rumbo-via: edge and a new x-rumbo-request-id.", "es": "HTTP 200 de rumbo-origin con x-rumbo-via: edge y un x-rumbo-request-id nuevo." },
          "checks": [{ "contains": "x-rumbo-via: edge" }]
        },
        {
          "title": { "en": "A preflight from the shop", "es": "Un preflight de la tienda" },
          "text": { "en": "options sends a CORS preflight with the Origin header of a page.", "es": "options manda un preflight de CORS con el encabezado Origin de una página." },
          "command": "docker compose run --rm lab options /api/shipments/R-1042 https://shop.example",
          "expected": { "en": "HTTP 204 with access-control-allow-origin: https://shop.example and the methods and headers allowed.", "es": "HTTP 204 con access-control-allow-origin: https://shop.example y los métodos y encabezados permitidos." },
          "checks": [{ "contains": "access-control-allow-origin: https://shop.example" }]
        },
        {
          "title": { "en": "A preflight from another site", "es": "Un preflight de otro sitio" },
          "text": { "en": "The same request from a page that is not the shop.", "es": "El mismo pedido desde una página que no es la tienda." },
          "command": "docker compose run --rm lab options /api/shipments/R-1042 https://other.example",
          "expected": { "en": "HTTP 204 and access-control-allow-origin: (none): a browser on that page will not let its script read the answer.", "es": "HTTP 204 y access-control-allow-origin: (none): un navegador en esa página no deja que su script lea la respuesta." },
          "checks": [{ "contains": "access-control-allow-origin: (none)" }]
        },
        {
          "title": { "en": "A route refused at the edge", "es": "Una ruta rechazada en el borde" },
          "text": { "en": "The admin API is blocked in the gateway.", "es": "La API de administración está bloqueada en el gateway." },
          "command": "docker compose run --rm lab get /api/admin/users",
          "expected": { "en": "HTTP 403 and blocked at the edge.", "es": "HTTP 403 y blocked at the edge." },
          "checks": [{ "contains": "HTTP 403" }]
        },
        {
          "title": { "en": "Read what the edge did", "es": "Leé qué hizo el borde" },
          "text": { "en": "wrangler dev records a span for each request and its operations. spans reads them from the Local Explorer, which only answers on the address of the edge itself: that is why it runs with exec inside the edge.", "es": "wrangler dev registra un span por cada pedido y sus operaciones. spans los lee del Local Explorer, que solo responde en la dirección del propio borde: por eso corre con exec dentro del borde." },
          "command": "docker compose exec edge lab spans 4",
          "expected": { "en": "GET /api/shipments/R-1043 with rate limit, KV get maintenance, fetch origin:8080 and KV put last-request; the two OPTIONS and GET /api/admin/users 403 answered by the Worker alone.", "es": "GET /api/shipments/R-1043 con rate limit, KV get maintenance, fetch origin:8080 y KV put last-request; los dos OPTIONS y GET /api/admin/users 403 respondidos por el Worker solo." },
          "checks": [{ "contains": "GET /api/admin/users 403" }, { "contains": "(answered by the Worker alone)" }]
        },
        {
          "title": { "en": "Read what waitUntil left", "es": "Leé lo que dejó waitUntil" },
          "text": { "en": "After forwarding a request, the gateway writes the last one in KV inside ctx.waitUntil.", "es": "Después de reenviar un pedido, el gateway escribe el último en KV dentro de ctx.waitUntil." },
          "command": "docker compose run --rm lab get /lab/last-request",
          "expected": { "en": "/api/shipments/R-1043 with status 200: the refused and the preflight requests never got that far.", "es": "/api/shipments/R-1043 con status 200: los pedidos rechazados y los preflight nunca llegaron tan lejos." },
          "checks": [{ "contains": "\"path\": \"/api/shipments/R-1043\"" }]
        }
      ]
    },
    {
      "id": 8,
      "unit": 2,
      "slug": "testing-a-worker",
      "title": { "en": "Testing a Worker", "es": "Probar un Worker" },
      "intro": { "en": "The tests run inside workerd, with the bindings simulated, not in Node.", "es": "Las pruebas corren dentro de workerd, con los bindings simulados, no en Node." },
      "visual": "tests",
      "frames": [
        {
          "title": { "en": "The same runtime as production", "es": "El mismo runtime que producción" },
          "text": { "en": "The Workers Vitest integration, the package @cloudflare/vitest-plugin, which replaced vitest-pool-workers, runs each test file inside workerd with the bindings of wrangler.jsonc simulated, as wrangler dev does. A test that passes in Node can fail in workerd, and the other way around, because their APIs differ.", "es": "La integración de Vitest para Workers, el paquete @cloudflare/vitest-plugin, que reemplazó a vitest-pool-workers, corre cada archivo de pruebas dentro de workerd con los bindings de wrangler.jsonc simulados, como hace wrangler dev. Una prueba que pasa en Node puede fallar en workerd, y al revés, porque sus APIs son distintas." },
          "rule": { "en": "Test where the code runs.", "es": "Probá donde corre el código." }
        },
        {
          "title": { "en": "Calling the Worker", "es": "Llamar al Worker" },
          "text": { "en": "exports from cloudflare:workers gives the exports of the main module: exports.default.fetch calls the Worker as a request would; env gives the bindings, so a test can set a KV flag before calling. The storage of the bindings is shared by the tests of one file, so a test that writes cleans up after itself.", "es": "exports de cloudflare:workers da los exports del módulo principal: exports.default.fetch llama al Worker como lo haría un pedido; env da los bindings, así que una prueba puede poner una flag de KV antes de llamar. El almacenamiento de los bindings lo comparten las pruebas de un archivo, así que una prueba que escribe limpia después." },
          "rule": { "en": "A test owns the state it creates.", "es": "Una prueba es dueña del estado que crea." }
        },
        {
          "title": { "en": "Fakes for what is outside", "es": "Reemplazos para lo que está afuera" },
          "text": { "en": "The origin is not part of the test: vi.spyOn replaces the global fetch, to answer as the origin would or to fail as a dead one. The fake answer must be built inside the request: Workers do not let a request read a body created in the context of another one, and the test file is another one.", "es": "El origen no es parte de la prueba: vi.spyOn reemplaza el fetch global, para responder como lo haría el origen o fallar como uno caído. La respuesta falsa se tiene que construir dentro del pedido: Workers no deja que un pedido lea un cuerpo creado en el contexto de otro, y el archivo de pruebas es otro." },
          "rule": { "en": "Replace the network, not the runtime.", "es": "Reemplazá la red, no el runtime." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Where do the tests of the Worker run?", "es": "¿Dónde corren las pruebas del Worker?" },
          "options": [
            { "en": "In Node, with the bindings mocked by hand", "es": "En Node, con los bindings simulados a mano" },
            { "en": "In workerd, with the bindings simulated", "es": "En workerd, con los bindings simulados" },
            { "en": "On the account, against the deployed Worker", "es": "En la cuenta, contra el Worker desplegado" }
          ],
          "correct": 1,
          "explanation": { "en": "The integration runs the test file in the same runtime as production.", "es": "La integración corre el archivo de pruebas en el mismo runtime que producción." }
        },
        {
          "question": { "en": "Why does the maintenance test delete its flag?", "es": "¿Por qué la prueba de mantenimiento borra su flag?" },
          "options": [
            { "en": "Because the tests of one file share the storage", "es": "Porque las pruebas de un archivo comparten el almacenamiento" },
            { "en": "Because KV flags expire after a test", "es": "Porque las flags de KV vencen después de una prueba" },
            { "en": "Because Vitest runs the tests on the account", "es": "Porque Vitest corre las pruebas en la cuenta" }
          ],
          "correct": 0,
          "explanation": { "en": "Without it, the next test would get 503 instead of reaching the fake origin.", "es": "Sin eso, la prueba siguiente recibiría 503 en lugar de llegar al origen falso." }
        },
        {
          "question": { "en": "Why is the fake response built inside mockImplementation?", "es": "¿Por qué la respuesta falsa se construye dentro de mockImplementation?" },
          "options": [
            { "en": "Because a body made in another request cannot be read", "es": "Porque un cuerpo hecho en otro pedido no se puede leer" },
            { "en": "Because fetch must be called twice", "es": "Porque fetch se tiene que llamar dos veces" },
            { "en": "Because Vitest requires a function", "es": "Porque Vitest pide una función" }
          ],
          "correct": 0,
          "explanation": { "en": "Workers isolate I/O per request; the test is another request.", "es": "Workers aísla la E/S por pedido; la prueba es otro pedido." }
        }
      ],
      "source": "vitest",
      "experiment": { "en": "Turn the fake origin on and off and see which tests still pass.", "es": "Prendé y apagá el origen falso y mirá qué pruebas siguen pasando." },
      "visor": { "en": "Nothing appears: vitest runs the Worker in a workerd of its own, not in the wrangler dev that the viewer reads.", "es": "No aparece nada: vitest corre el Worker en un workerd propio, no en el wrangler dev que lee el visor." },
      "lab": [
        {
          "title": { "en": "Run the tests", "es": "Corré las pruebas" },
          "text": { "en": "The tests of the gateway live in edge/test, mounted from your folder, so you can edit them and run again.", "es": "Las pruebas del gateway viven en edge/test, montadas desde tu carpeta, así que las podés editar y correr de nuevo." },
          "command": "docker compose exec edge npx vitest run",
          "expected": { "en": "Vitest 5.1.0, 1 file and 6 passed, in about a second and a half.", "es": "Vitest 5.1.0, 1 archivo y 6 passed, en un segundo y medio, más o menos." },
          "checks": [{ "contains": "6 passed" }]
        },
        {
          "title": { "en": "Read their names", "es": "Leé sus nombres" },
          "text": { "en": "The verbose reporter prints each test.", "es": "El reporter verbose imprime cada prueba." },
          "command": "docker compose exec edge npx vitest run --reporter verbose",
          "expected": { "en": "health, the admin API blocked, CORS, maintenance, the forward to the origin and the 502 of a dead origin. The first line may say Using secrets defined in .dev.vars, the file of lesson 06.", "es": "health, la API de administración bloqueada, CORS, mantenimiento, el reenvío al origen y el 502 de un origen caído. La primera línea puede decir Using secrets defined in .dev.vars, el archivo de la lección 06." },
          "checks": [{ "contains": "blocks the admin API before it reaches the origin" }]
        },
        {
          "title": { "en": "Run one test", "es": "Corré una prueba" },
          "text": { "en": "-t filters by name.", "es": "-t filtra por nombre." },
          "command": "docker compose exec edge npx vitest run -t \"maintenance\"",
          "expected": { "en": "1 passed and 5 skipped.", "es": "1 passed y 5 skipped." },
          "checks": [{ "contains": "1 passed" }]
        },
        {
          "title": { "en": "See how the origin is replaced", "es": "Mirá cómo se reemplaza el origen" },
          "text": { "en": "grep shows the lines that replace fetch.", "es": "grep muestra las líneas que reemplazan fetch." },
          "command": "docker compose exec edge grep -n \"spyOn\" test/gateway.test.ts",
          "expected": { "en": "Two lines: one fake that answers R-1042 inside the request, and one that rejects with Network connection lost.", "es": "Dos líneas: un reemplazo que responde R-1042 dentro del pedido, y uno que rechaza con Network connection lost." },
          "checks": [{ "contains": "mockImplementation" }, { "contains": "mockRejectedValue" }]
        }
      ]
    },
    {
      "id": 9,
      "unit": 2,
      "slug": "deploy-and-observe",
      "title": { "en": "Deploy and observe", "es": "Desplegar y observar" },
      "intro": { "en": "A version is uploaded; a deployment decides which versions take the traffic.", "es": "Una versión se sube; un despliegue decide qué versiones se llevan el tráfico." },
      "visual": "versions",
      "frames": [
        {
          "title": { "en": "Versions and deployments", "es": "Versiones y despliegues" },
          "text": { "en": "A version is the code and configuration of a Worker, uploaded and kept. A deployment says which versions serve requests, and in what share. wrangler deploy does both at once: it uploads a version and deploys it to 100%. A Worker on workers.dev answers at <name>.<your subdomain>.workers.dev, with no zone of your own.", "es": "Una versión es el código y la configuración de un Worker, subidos y guardados. Un despliegue dice qué versiones atienden pedidos, y en qué proporción. wrangler deploy hace las dos cosas: sube una versión y la despliega al 100 %. Un Worker en workers.dev responde en <nombre>.<tu subdominio>.workers.dev, sin zona propia." },
          "rule": { "en": "Upload is not release.", "es": "Subir no es liberar." }
        },
        {
          "title": { "en": "A gradual deployment", "es": "Un despliegue gradual" },
          "text": { "en": "wrangler versions upload creates a version without serving it; wrangler versions deploy splits the traffic between versions by percentage, and running it again moves the split, or rolls back. Each request is routed on its own, so one user can see both versions, unless version affinity keeps a key on one. A deployment can use only the last 100 uploaded versions.", "es": "wrangler versions upload crea una versión sin servirla; wrangler versions deploy reparte el tráfico entre versiones por porcentaje, y correrlo de nuevo mueve el reparto, o vuelve atrás. Cada pedido se rutea por su cuenta, así que un usuario puede ver las dos versiones, salvo que version affinity mantenga una clave en una. Un despliegue puede usar solo las últimas 100 versiones subidas." },
          "rule": { "en": "Move traffic in steps you can undo.", "es": "Mové el tráfico en pasos que puedas deshacer." }
        },
        {
          "title": { "en": "The Worker for your account", "es": "El Worker para tu cuenta" },
          "text": { "en": "The kit has a second Worker in edge/deploy: rumbo-edge-demo, with no bindings, so it fits the free plan, and Workers Cache in front, lesson 10. These steps need labs/.env with your account id and an API token that can edit Workers; they are optional. wrangler tail streams the logs of the deployed Worker live.", "es": "El kit tiene un segundo Worker en edge/deploy: rumbo-edge-demo, sin bindings, así que entra en el plan gratuito, y con Workers Cache delante, lección 10. Estos pasos necesitan labs/.env con el id de tu cuenta y un token de API que pueda editar Workers; son opcionales. wrangler tail muestra los logs del Worker desplegado en vivo." },
          "rule": { "en": "Deploy something small first.", "es": "Desplegá algo chico primero." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "What does wrangler versions upload do?", "es": "¿Qué hace wrangler versions upload?" },
          "options": [
            { "en": "Uploads a version without sending it traffic", "es": "Sube una versión sin mandarle tráfico" },
            { "en": "Deploys a version to 100%", "es": "Despliega una versión al 100 %" },
            { "en": "Rolls back to the previous version", "es": "Vuelve a la versión anterior" }
          ],
          "correct": 0,
          "explanation": { "en": "Traffic moves only with versions deploy.", "es": "El tráfico se mueve solo con versions deploy." }
        },
        {
          "question": { "en": "With 90% for v1 and 10% for v2, what does one user see?", "es": "Con 90 % para v1 y 10 % para v2, ¿qué ve un usuario?" },
          "options": [
            { "en": "Always v1, because the user was there first", "es": "Siempre v1, porque el usuario estaba antes" },
            { "en": "Either, request by request, unless version affinity is set", "es": "Cualquiera de las dos, pedido por pedido, salvo que haya version affinity" },
            { "en": "Always v2 after the first request", "es": "Siempre v2 después del primer pedido" }
          ],
          "correct": 1,
          "explanation": { "en": "Each request is routed on its own by default.", "es": "Por defecto, cada pedido se rutea por su cuenta." }
        },
        {
          "question": { "en": "Why has the Worker of edge/deploy no bindings?", "es": "¿Por qué el Worker de edge/deploy no tiene bindings?" },
          "options": [
            { "en": "Because bindings cannot be deployed", "es": "Porque los bindings no se pueden desplegar" },
            { "en": "Because Workers Cache forbids them", "es": "Porque Workers Cache los prohíbe" },
            { "en": "So it fits the free plan with nothing else to create", "es": "Para que entre en el plan gratuito sin crear nada más" }
          ],
          "correct": 2,
          "explanation": { "en": "Its lessons are about versions and the cache, not storage.", "es": "Sus lecciones son sobre versiones y la cache, no sobre almacenamiento." }
        }
      ],
      "source": "gradual",
      "experiment": { "en": "Move the slider between two versions and count which one answers.", "es": "Mové el control entre dos versiones y contá cuál responde." },
      "visor": { "en": "The dry run calls no Worker. The steps on your account run on Cloudflare, not in the kit, so the viewer does not see them.", "es": "El simulacro no llama a ningún Worker. Los pasos de tu cuenta corren en Cloudflare, no en el kit, así que el visor no los ve." },
      "lab": [
        {
          "title": { "en": "Check the Worker without uploading it", "es": "Revisá el Worker sin subirlo" },
          "text": { "en": "--dry-run builds the Worker and lists its bindings without uploading anything. It runs inside the edge, with no account.", "es": "--dry-run construye el Worker y lista sus bindings sin subir nada. Corre dentro del borde, sin cuenta." },
          "command": "docker compose exec edge npx wrangler deploy --dry-run --config deploy/wrangler.jsonc",
          "expected": { "en": "Total Upload: 1.50 KiB, one binding, env.VERSION (\"v1\"), and --dry-run: exiting now.", "es": "Total Upload: 1.50 KiB, un binding, env.VERSION (\"v1\"), y --dry-run: exiting now." },
          "checks": [{ "contains": "env.VERSION (\"v1\")" }, { "contains": "--dry-run: exiting now" }]
        },
        {
          "title": { "en": "Check your account", "es": "Verificá tu cuenta" },
          "text": { "en": "Copy .env.example to .env and fill CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN, from a token made with the Edit Cloudflare Workers template. account checks the token and the workers.dev subdomain; it never prints either.", "es": "Copiá .env.example a .env y completá CLOUDFLARE_ACCOUNT_ID y CLOUDFLARE_API_TOKEN, de un token hecho con la plantilla Edit Cloudflare Workers. account verifica el token y el subdominio de workers.dev; nunca imprime ninguno." },
          "command": "docker compose run --rm lab account",
          "expected": { "en": "token: active and workers.dev subdomain: set.", "es": "token: active y workers.dev subdomain: set." },
          "checks": [{ "contains": "token: active" }],
          "optional": true
        },
        {
          "title": { "en": "Deploy version v1", "es": "Desplegá la versión v1" },
          "text": { "en": "lab wrangler runs Wrangler on edge/deploy with the credentials of .env.", "es": "lab wrangler corre Wrangler sobre edge/deploy con las credenciales de .env." },
          "command": "docker compose run --rm lab wrangler deploy --tag v1",
          "expected": { "en": "The URL of rumbo-edge-demo on workers.dev and a Current Version ID.", "es": "La URL de rumbo-edge-demo en workers.dev y un Current Version ID." },
          "checks": [{ "contains": "workers.dev" }],
          "optional": true
        },
        {
          "title": { "en": "Upload v2 without serving it", "es": "Subí v2 sin servirla" },
          "text": { "en": "The same code with VERSION=v2.", "es": "El mismo código con VERSION=v2." },
          "command": "docker compose run --rm lab wrangler versions upload --tag v2 --var VERSION:v2",
          "expected": { "en": "A Worker Version ID and the reminder that the version is not deployed yet.", "es": "Un Worker Version ID y el aviso de que la versión todavía no está desplegada." },
          "checks": [{ "contains": "Version ID" }],
          "optional": true
        },
        {
          "title": { "en": "Send 10% to v2", "es": "Mandale el 10 % a v2" },
          "text": { "en": "Split the traffic between the two tags.", "es": "Repartí el tráfico entre las dos etiquetas." },
          "command": "docker compose run --rm lab wrangler versions deploy --version-tag v1@90% --version-tag v2@10% -y",
          "expected": { "en": "A deployment with two versions, 90% and 10%.", "es": "Un despliegue con dos versiones, 90 % y 10 %." },
          "checks": [{ "contains": "90%" }],
          "optional": true
        },
        {
          "title": { "en": "Count who answers", "es": "Contá quién responde" },
          "text": { "en": "split makes 40 requests to /version and counts the x-rumbo-version header.", "es": "split hace 40 pedidos a /version y cuenta el encabezado x-rumbo-version." },
          "command": "docker compose run --rm lab split /version 40",
          "expected": { "en": "Most requests from v1 and a few from v2; the exact count changes on every run.", "es": "La mayoría de los pedidos de v1 y algunos de v2; la cuenta exacta cambia en cada corrida." },
          "checks": [{ "contains": "version v1" }],
          "optional": true
        }
      ]
    },
    {
      "id": 10,
      "unit": 3,
      "slug": "what-the-edge-keeps",
      "title": { "en": "What the edge keeps", "es": "Qué guarda el borde" },
      "intro": { "en": "Two caches you can put in front: the one of the zone and the one of the Worker.", "es": "Dos caches que podés poner delante: la de la zona y la del Worker." },
      "visual": "cachedefault",
      "frames": [
        {
          "title": { "en": "The cache of a zone", "es": "La cache de una zona" },
          "text": { "en": "For a proxied zone, Cloudflare caches by file extension, not by MIME type: CSS, JS, images, PDF and a long list more. HTML and JSON are not cached by default. It does not cache when Cache-Control says private, no-store, no-cache or max-age=0, when the response has Set-Cookie, or when the method is not GET. A cache rule can make more content eligible. When a Worker runs on a route, its fetch to the origin goes through this cache.", "es": "En una zona con proxy, Cloudflare guarda por extensión de archivo, no por tipo MIME: CSS, JS, imágenes, PDF y una lista larga más. HTML y JSON no se guardan por defecto. No guarda cuando Cache-Control dice private, no-store, no-cache o max-age=0, cuando la respuesta tiene Set-Cookie, o cuando el método no es GET. Una regla de cache puede volver elegible más contenido. Cuando un Worker corre en una ruta, su fetch al origen pasa por esta cache." },
          "rule": { "en": "By default the edge keeps files, not pages.", "es": "Por defecto el borde guarda archivos, no páginas." }
        },
        {
          "title": { "en": "A cache in front of the Worker", "es": "Una cache delante del Worker" },
          "text": { "en": "Workers Cache puts a cache in front of the Worker itself: \"cache\": {\"enabled\": true} in wrangler.jsonc, on workers.dev too. It follows the Cache-Control of the responses of the Worker, and a hit does not run the Worker, so it uses no CPU. It has no price of its own, but every request still counts as a Worker request, hit or not. A 200 with no Cache-Control is kept for 7,200 seconds by heuristic; private, no-store and Set-Cookie bypass it; the version of the Worker is part of the key, so each deployment starts empty.", "es": "Workers Cache pone una cache delante del propio Worker: \"cache\": {\"enabled\": true} en wrangler.jsonc, también en workers.dev. Sigue el Cache-Control de las respuestas del Worker, y un acierto no ejecuta el Worker, así que no usa CPU. No tiene precio propio, pero cada pedido sigue contando como pedido del Worker, acierto o no. Un 200 sin Cache-Control se guarda 7.200 segundos por heurística; private, no-store y Set-Cookie la saltean; la versión del Worker es parte de la clave, así que cada despliegue arranca vacío." },
          "rule": { "en": "A response with no Cache-Control is a decision too.", "es": "Una respuesta sin Cache-Control también es una decisión." }
        },
        {
          "title": { "en": "Reading cf-cache-status", "es": "Leer cf-cache-status" },
          "text": { "en": "The header says what the cache did: MISS, not there, now stored; HIT, served from it; EXPIRED, REVALIDATED, UPDATING and STALE, the lifecycle of a stored copy; BYPASS, the response said not to keep it; DYNAMIC, in a zone, not eligible at all. The kit cannot show this part: wrangler dev does not run Workers Cache, so these steps use your account.", "es": "El encabezado dice qué hizo la cache: MISS, no estaba, ahora quedó guardada; HIT, salió de ahí; EXPIRED, REVALIDATED, UPDATING y STALE, el ciclo de vida de una copia guardada; BYPASS, la respuesta dijo que no se guarde; DYNAMIC, en una zona, no era elegible. El kit no puede mostrar esta parte: wrangler dev no corre Workers Cache, así que estos pasos usan tu cuenta." },
          "rule": { "en": "Read cf-cache-status twice: the second request tells the truth.", "es": "Leé cf-cache-status dos veces: el segundo pedido dice la verdad." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "By default, does the cache of a zone keep a JSON response of your API?", "es": "Por defecto, ¿la cache de una zona guarda una respuesta JSON de tu API?" },
          "options": [
            { "en": "Yes, if it is a GET", "es": "Sí, si es un GET" },
            { "en": "Only for the free plan", "es": "Solo en el plan gratuito" },
            { "en": "No: by default it keeps by extension, and JSON is not on the list", "es": "No: por defecto guarda por extensión, y JSON no está en la lista" }
          ],
          "correct": 2,
          "explanation": { "en": "A cache rule can change that; the default does not.", "es": "Una regla de cache lo puede cambiar; el valor por defecto, no." }
        },
        {
          "question": { "en": "With Workers Cache on, what happens on a HIT?", "es": "Con Workers Cache prendida, ¿qué pasa en un HIT?" },
          "options": [
            { "en": "The origin is asked whether the copy is still valid", "es": "Se le pregunta al origen si la copia sigue valiendo" },
            { "en": "The Worker runs and its answer is compared with the copy", "es": "El Worker corre y su respuesta se compara con la copia" },
            { "en": "The edge answers from the cache and the Worker does not run", "es": "El borde responde desde la cache y el Worker no corre" }
          ],
          "correct": 2,
          "explanation": { "en": "That is the point: no CPU on a hit. The request is still billed as a request.", "es": "Ese es el punto: no hay CPU en un acierto. El pedido igual se cobra como pedido." }
        },
        {
          "question": { "en": "A Worker returns 200 without Cache-Control, behind Workers Cache. What happens?", "es": "Un Worker devuelve 200 sin Cache-Control, detrás de Workers Cache. ¿Qué pasa?" },
          "options": [
            { "en": "Nothing is kept, because there is no header", "es": "No se guarda nada, porque no hay encabezado" },
            { "en": "It is kept for 7,200 seconds by heuristic", "es": "Se guarda 7.200 segundos por heurística" },
            { "en": "It is kept until the next deployment only", "es": "Se guarda solo hasta el próximo despliegue" }
          ],
          "correct": 1,
          "explanation": { "en": "Say what you mean: no-store for answers that must not be kept.", "es": "Decí lo que querés: no-store para respuestas que no se tienen que guardar." }
        }
      ],
      "source": "workerscache",
      "experiment": { "en": "Change the Cache-Control of a response and ask twice: see what the edge keeps.", "es": "Cambiá el Cache-Control de una respuesta y pedí dos veces: mirá qué guarda el borde." },
      "visor": { "en": "/track/R-1042 and /api/shipments/R-1042 cross the Worker to the origin every time: in the kit there is no Workers Cache, the hatched piece.", "es": "/track/R-1042 y /api/shipments/R-1042 cruzan el Worker hasta el origen cada vez: en el kit no hay Workers Cache, la pieza rayada." },
      "lab": [
        {
          "title": { "en": "A page the origin marks public", "es": "Una página que el origen marca pública" },
          "text": { "en": "The public tracking page is the same for everyone, so the origin allows a shared cache to keep it for 60 seconds.", "es": "La página pública de seguimiento es la misma para todos, así que el origen deja que una cache compartida la guarde 60 segundos." },
          "command": "docker compose run --rm lab get /track/R-1042",
          "expected": { "en": "cache-control: max-age=60, public and an HTML body. A zone would still not keep it by default, because it is HTML; Workers Cache would.", "es": "cache-control: max-age=60, public y un cuerpo HTML. Una zona igual no la guardaría por defecto, porque es HTML; Workers Cache sí." },
          "checks": [{ "contains": "cache-control: max-age=60, public" }]
        },
        {
          "title": { "en": "An answer the origin marks no-store", "es": "Una respuesta que el origen marca no-store" },
          "text": { "en": "The API says that a shipment must not be kept.", "es": "La API dice que un envío no se tiene que guardar." },
          "command": "docker compose run --rm lab get /api/shipments/R-1042",
          "expected": { "en": "cache-control: no-store: no cache on the way may keep it.", "es": "cache-control: no-store: ninguna cache en el camino la puede guardar." },
          "checks": [{ "contains": "cache-control: no-store" }]
        },
        {
          "title": { "en": "Ask a public route twice on your account", "es": "Pedí dos veces una ruta pública en tu cuenta" },
          "text": { "en": "This uses rumbo-edge-demo, deployed in lesson 09, with Workers Cache on. remote prints the status and cf-cache-status of each request.", "es": "Usa rumbo-edge-demo, desplegado en la lección 09, con Workers Cache prendida. remote imprime el estado y cf-cache-status de cada pedido." },
          "command": "docker compose run --rm lab remote /c/public 2",
          "expected": { "en": "MISS, then HIT. The validation of this step with an account is recorded in docs/VALIDATION.md.", "es": "MISS y después HIT. La validación de este paso con una cuenta queda registrada en docs/VALIDATION.md." },
          "checks": [{ "contains": "HIT" }],
          "optional": true
        },
        {
          "title": { "en": "A response with Set-Cookie", "es": "Una respuesta con Set-Cookie" },
          "text": { "en": "The same Cache-Control, plus a cookie.", "es": "El mismo Cache-Control, más una cookie." },
          "command": "docker compose run --rm lab remote /c/cookie 2",
          "expected": { "en": "No HIT: a response with Set-Cookie bypasses the cache.", "es": "Ningún HIT: una respuesta con Set-Cookie se saltea la cache." },
          "checks": [{ "absent": "HIT" }],
          "optional": true
        },
        {
          "title": { "en": "A response that says nothing", "es": "Una respuesta que no dice nada" },
          "text": { "en": "/c/silent returns 200 with no Cache-Control.", "es": "/c/silent devuelve 200 sin Cache-Control." },
          "command": "docker compose run --rm lab remote /c/silent 2",
          "expected": { "en": "MISS, then HIT: kept by heuristic, for up to two hours.", "es": "MISS y después HIT: guardada por heurística, hasta dos horas." },
          "checks": [{ "contains": "HIT" }],
          "optional": true
        }
      ]
    },
    {
      "id": 11,
      "unit": 3,
      "slug": "cache-key-traps",
      "title": { "en": "The cache key and its traps", "es": "La clave de cache y sus trampas" },
      "intro": { "en": "Two people ask the same URL: the cache cannot tell them apart unless you do.", "es": "Dos personas piden la misma URL: la cache no las distingue salvo que vos lo hagas." },
      "visual": "cachekey",
      "frames": [
        {
          "title": { "en": "What the key is made of", "es": "De qué está hecha la clave" },
          "text": { "en": "The default cache key of a zone is the scheme, the host and the path with its query string, plus a few headers such as Origin. It is not the user: two people asking the same URL get the same stored entry. Cache rules can change the key; options such as headers, cookies or the user in the key are Enterprise only, while ignoring or sorting the query string is on every plan.", "es": "La clave de cache por defecto de una zona es el esquema, el host y la ruta con su query string, más unos pocos encabezados como Origin. No es el usuario: dos personas que piden la misma URL reciben la misma entrada guardada. Las reglas de cache pueden cambiar la clave; opciones como encabezados, cookies o el usuario en la clave son solo de Enterprise, mientras que ignorar u ordenar la query string está en todos los planes." },
          "rule": { "en": "The cache answers the URL, not the person.", "es": "La cache responde a la URL, no a la persona." }
        },
        {
          "title": { "en": "The trap", "es": "La trampa" },
          "text": { "en": "A response built for one user and marked public is stored under a key that does not include that user. The next person who asks the same URL gets it: their address, their orders, their name. The fix is in the response, not in the cache: private or no-store for anything personal, and public only for what is the same for everyone.", "es": "Una respuesta armada para un usuario y marcada como pública se guarda bajo una clave que no incluye a ese usuario. La próxima persona que pide la misma URL la recibe: su dirección, sus pedidos, su nombre. El arreglo está en la respuesta, no en la cache: private o no-store para todo lo personal, y public solo para lo que es igual para todos." },
          "rule": { "en": "Never mark personal data public.", "es": "Nunca marques como públicos datos personales." }
        },
        {
          "title": { "en": "Purge", "es": "Purgar" },
          "text": { "en": "Purging removes stored copies. Every plan, the free one included, can purge by URL, by hostname, by tag, by prefix and everything; the free plan allows 800 URLs per second, and 5 requests per minute for the other kinds. Purging fixes the past; only a correct Cache-Control fixes the future.", "es": "Purgar saca copias guardadas. Todos los planes, el gratuito incluido, pueden purgar por URL, por hostname, por tag, por prefijo y todo; el plan gratuito permite 800 URLs por segundo, y 5 pedidos por minuto para los otros tipos. Purgar arregla el pasado; solo un Cache-Control correcto arregla el futuro." },
          "rule": { "en": "Purge, then fix the header, or it comes back.", "es": "Purgá, y después arreglá el encabezado, o vuelve." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "What is in the default cache key of a zone?", "es": "¿Qué hay en la clave de cache por defecto de una zona?" },
          "options": [
            { "en": "The scheme, host, path and query string", "es": "El esquema, el host, la ruta y la query string" },
            { "en": "The URL and the IP of the visitor", "es": "La URL y la IP del visitante" },
            { "en": "The URL and the cookie of the session", "es": "La URL y la cookie de la sesión" }
          ],
          "correct": 0,
          "explanation": { "en": "No user in it, which is the whole trap.", "es": "Sin usuario, que es toda la trampa." }
        },
        {
          "question": { "en": "Beto receives the profile of Ana. Where is the bug?", "es": "Beto recibe el perfil de Ana. ¿Dónde está el error?" },
          "options": [
            { "en": "In the browser of Beto", "es": "En el navegador de Beto" },
            { "en": "In the cache, which should know the users", "es": "En la cache, que debería conocer a los usuarios" },
            { "en": "In the Cache-Control of a personal response marked public", "es": "En el Cache-Control de una respuesta personal marcada pública" }
          ],
          "correct": 2,
          "explanation": { "en": "The response allowed a shared cache to keep it.", "es": "La respuesta le permitió a una cache compartida guardarla." }
        },
        {
          "question": { "en": "Which purge does the free plan allow?", "es": "¿Qué purga permite el plan gratuito?" },
          "options": [
            { "en": "Only purge everything", "es": "Solo purgar todo" },
            { "en": "URL, hostname, tag, prefix and everything", "es": "URL, hostname, tag, prefijo y todo" },
            { "en": "None: purge is a paid feature", "es": "Ninguna: purgar es de pago" }
          ],
          "correct": 1,
          "explanation": { "en": "All methods are on every plan, with lower rates on the free one.", "es": "Todos los métodos están en todos los planes, con tasas más bajas en el gratuito." }
        }
      ],
      "source": "cachekeys",
      "experiment": { "en": "Put the user in and out of the key, and see who gets whose profile.", "es": "Poné y sacá al usuario de la clave, y mirá quién recibe el perfil de quién." },
      "visor": { "en": "Each /lab/cache/profile shows cache match on the Cache API and, on a miss, cache put; the request of Beto finds the copy of Ana. The safe route answers without touching the cache.", "es": "Cada /lab/cache/profile muestra cache match en la Cache API y, si no encuentra, cache put; el pedido de Beto encuentra la copia de Ana. La ruta segura responde sin tocar la cache." },
      "lab": [
        {
          "title": { "en": "Ana asks for her profile", "es": "Ana pide su perfil" },
          "text": { "en": "/lab/cache/profile builds a profile for the user in the x-user header and marks it public, max-age=300, the trap. It uses the Cache API with the URL as key, as a shared cache would.", "es": "/lab/cache/profile arma un perfil para el usuario del encabezado x-user y lo marca public, max-age=300, la trampa. Usa la Cache API con la URL como clave, como haría una cache compartida." },
          "command": "docker compose run --rm lab get /lab/cache/profile -H x-user:ana",
          "expected": { "en": "x-rumbo-from: worker and the profile of ana, now stored.", "es": "x-rumbo-from: worker y el perfil de ana, ahora guardado." },
          "checks": [{ "contains": "\"user\": \"ana\"" }]
        },
        {
          "title": { "en": "Beto asks for his", "es": "Beto pide el suyo" },
          "text": { "en": "Same URL, another user.", "es": "La misma URL, otro usuario." },
          "command": "docker compose run --rm lab get /lab/cache/profile -H x-user:beto",
          "expected": { "en": "x-rumbo-from: cache, cf-cache-status: HIT and user: ana, with her address. Beto got Ana.", "es": "x-rumbo-from: cache, cf-cache-status: HIT y user: ana, con su dirección. Beto recibió a Ana." },
          "checks": [{ "contains": "x-rumbo-from: cache" }, { "contains": "\"user\": \"ana\"" }]
        },
        {
          "title": { "en": "The corrected route for Ana", "es": "La ruta corregida para Ana" },
          "text": { "en": "/lab/cache/profile-safe marks the profile private, no-store, and does not store it.", "es": "/lab/cache/profile-safe marca el perfil private, no-store, y no lo guarda." },
          "command": "docker compose run --rm lab get /lab/cache/profile-safe -H x-user:ana",
          "expected": { "en": "cache-control: private, no-store and the profile of ana.", "es": "cache-control: private, no-store y el perfil de ana." },
          "checks": [{ "contains": "cache-control: private, no-store" }]
        },
        {
          "title": { "en": "The corrected route for Beto", "es": "La ruta corregida para Beto" },
          "text": { "en": "Same URL, another user, again.", "es": "La misma URL, otro usuario, de nuevo." },
          "command": "docker compose run --rm lab get /lab/cache/profile-safe -H x-user:beto",
          "expected": { "en": "x-rumbo-from: worker and user: beto: each person gets their own answer.", "es": "x-rumbo-from: worker y user: beto: cada persona recibe su propia respuesta." },
          "checks": [{ "contains": "\"user\": \"beto\"" }, { "contains": "x-rumbo-from: worker" }]
        }
      ]
    },
    {
      "id": 12,
      "unit": 3,
      "slug": "cache-from-a-worker",
      "title": { "en": "Cache from a Worker", "es": "Cache desde un Worker" },
      "intro": { "en": "The Cache API stores and purges from code, one data center at a time.", "es": "La Cache API guarda y purga desde el código, de a un data center por vez." },
      "visual": "cacheapi",
      "frames": [
        {
          "title": { "en": "match, put, delete", "es": "match, put, delete" },
          "text": { "en": "caches.default is the Cache API: match looks for a stored Response for a Request, put stores one and delete removes it. put refuses a response whose Cache-Control says not to keep it. In Rumbo, /lab/cache/rate keeps the rate of a zone for 60 seconds with the zone in the key.", "es": "caches.default es la Cache API: match busca un Response guardado para un Request, put guarda uno y delete lo saca. put rechaza una respuesta cuyo Cache-Control dice que no se guarde. En Rumbo, /lab/cache/rate guarda la tarifa de una zona 60 segundos con la zona en la clave." },
          "rule": { "en": "The key is the Request you choose.", "es": "La clave es el Request que elegís." }
        },
        {
          "title": { "en": "One data center at a time", "es": "De a un data center por vez" },
          "text": { "en": "The contents of the Cache API do not replicate outside the data center where they were stored, and cache.delete purges only that data center. It is independent of Workers Cache, which runs in front of the Worker, and of the cache that the fetch of a Worker goes through. It works on custom domains; dashboard previews do nothing with it, and it is not available for Workers behind Access.", "es": "El contenido de la Cache API no se replica fuera del data center donde se guardó, y cache.delete purga solo ese data center. Es independiente de Workers Cache, que corre delante del Worker, y de la cache por la que pasa el fetch de un Worker. Funciona en dominios propios; las vistas previas del panel no hacen nada con ella, y no está disponible para Workers detrás de Access." },
          "rule": { "en": "A delete from code is a local purge.", "es": "Un delete desde el código es una purga local." }
        },
        {
          "title": { "en": "When to use it", "es": "Cuándo usarla" },
          "text": { "en": "Use it for results you compute at the edge and can rebuild, such as a rate, a rendered fragment or an answer of a slow API, when you need a key of your own. For a purge that must reach every data center, use the purge of the zone or Workers Cache purge by tag. Locally there is one data center, so local and global look the same.", "es": "Usala para resultados que calculás en el borde y podés reconstruir, como una tarifa, un fragmento renderizado o la respuesta de una API lenta, cuando necesitás una clave propia. Para una purga que tiene que llegar a todos los data centers, usá la purga de la zona o la purga por tag de Workers Cache. En local hay un solo data center, así que local y global se ven iguales." },
          "rule": { "en": "Cache what you can rebuild.", "es": "Guardá lo que podés reconstruir." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "A Worker stores a response with cache.put in Madrid. A request arrives in Dublin. What does match find there?", "es": "Un Worker guarda una respuesta con cache.put en Madrid. Llega un pedido a Dublín. ¿Qué encuentra match ahí?" },
          "options": [
            { "en": "The copy of Madrid, replicated", "es": "La copia de Madrid, replicada" },
            { "en": "Nothing: the Cache API does not replicate", "es": "Nada: la Cache API no se replica" },
            { "en": "The copy, after one minute", "es": "La copia, después de un minuto" }
          ],
          "correct": 1,
          "explanation": { "en": "Each data center has its own Cache API contents.", "es": "Cada data center tiene su propio contenido de Cache API." }
        },
        {
          "question": { "en": "What does cache.delete purge?", "es": "¿Qué purga cache.delete?" },
          "options": [
            { "en": "The copies of Workers Cache too", "es": "También las copias de Workers Cache" },
            { "en": "Every copy of that URL in the world", "es": "Todas las copias de esa URL en el mundo" },
            { "en": "The copy in the data center where the Worker ran", "es": "La copia del data center donde corrió el Worker" }
          ],
          "correct": 2,
          "explanation": { "en": "For a global purge use the zone or Workers Cache.", "es": "Para una purga global usá la zona o Workers Cache." }
        },
        {
          "question": { "en": "Is the Cache API the same thing as Workers Cache?", "es": "¿La Cache API es lo mismo que Workers Cache?" },
          "options": [
            { "en": "No: they are independent mechanisms", "es": "No: son mecanismos independientes" },
            { "en": "Yes, but Workers Cache is the paid one", "es": "Sí, pero Workers Cache es la de pago" },
            { "en": "Yes, two names for one cache", "es": "Sí, dos nombres para una cache" }
          ],
          "correct": 0,
          "explanation": { "en": "Workers Cache sits in front of the Worker; the Cache API is called by its code.", "es": "Workers Cache se pone delante del Worker; la Cache API la llama su código." }
        }
      ],
      "source": "cacheapi",
      "experiment": { "en": "Store a rate in one data center and ask for it from another.", "es": "Guardá una tarifa en un data center y pedila desde otro." },
      "visor": { "en": "The rate of DUB: cache match and cache put the first time, match alone the second, cache delete on the purge, and put again after it.", "es": "La tarifa de DUB: cache match y cache put la primera vez, match solo la segunda, cache delete en la purga, y put otra vez después." },
      "lab": [
        {
          "title": { "en": "The first request computes the rate", "es": "El primer pedido calcula la tarifa" },
          "text": { "en": "Quote the URL: in zsh, an unquoted ? is a pattern.", "es": "Poné la URL entre comillas: en zsh, un ? sin comillas es un patrón." },
          "command": "docker compose run --rm lab get \"/lab/cache/rate?zone=dub\"",
          "expected": { "en": "x-rumbo-from: worker and a generated time.", "es": "x-rumbo-from: worker y una hora de generación." },
          "checks": [{ "contains": "x-rumbo-from: worker" }]
        },
        {
          "title": { "en": "The second comes from the cache", "es": "El segundo sale de la cache" },
          "text": { "en": "Same key, within 60 seconds.", "es": "La misma clave, dentro de los 60 segundos." },
          "command": "docker compose run --rm lab get \"/lab/cache/rate?zone=dub\"",
          "expected": { "en": "x-rumbo-from: cache, cf-cache-status: HIT, which the local Cache API adds to a match, and the same generated time.", "es": "x-rumbo-from: cache, cf-cache-status: HIT, que la Cache API local agrega a un match, y la misma hora de generación." },
          "checks": [{ "contains": "x-rumbo-from: cache" }]
        },
        {
          "title": { "en": "Purge it from code", "es": "Purgala desde el código" },
          "text": { "en": "/lab/cache/purge calls cache.delete with the same key.", "es": "/lab/cache/purge llama a cache.delete con la misma clave." },
          "command": "docker compose run --rm lab get \"/lab/cache/purge?zone=dub\"",
          "expected": { "en": "purged: true and the note: this data center only.", "es": "purged: true y la nota: solo este data center." },
          "checks": [{ "contains": "\"purged\": true" }]
        },
        {
          "title": { "en": "Ask again", "es": "Pedí de nuevo" },
          "text": { "en": "The key is empty again here.", "es": "Acá la clave quedó vacía de nuevo." },
          "command": "docker compose run --rm lab get \"/lab/cache/rate?zone=dub\"",
          "expected": { "en": "x-rumbo-from: worker and a new generated time.", "es": "x-rumbo-from: worker y una hora de generación nueva." },
          "checks": [{ "contains": "x-rumbo-from: worker" }]
        },
        {
          "title": { "en": "Read the operations", "es": "Leé las operaciones" },
          "text": { "en": "The spans show each operation of the Cache API.", "es": "Los spans muestran cada operación de la Cache API." },
          "command": "docker compose exec edge lab spans 4",
          "expected": { "en": "cache match and cache put on the first request, cache match alone on the second, cache delete on the purge.", "es": "cache match y cache put en el primer pedido, cache match solo en el segundo, cache delete en la purga." },
          "checks": [{ "contains": "cache delete" }, { "contains": "cache put" }]
        }
      ]
    },
    {
      "id": 13,
      "unit": 4,
      "slug": "waf-rules",
      "title": { "en": "WAF: rules on the request", "es": "WAF: reglas sobre el pedido" },
      "intro": { "en": "Rules that look at each request and stop it before your code, in a fixed order.", "es": "Reglas que miran cada pedido y lo frenan antes de tu código, en un orden fijo." },
      "visual": "waf",
      "frames": [
        {
          "title": { "en": "Managed and custom rules", "es": "Reglas administradas y propias" },
          "text": { "en": "The WAF of a zone runs rules on each request. Managed rules are written by Cloudflare against known attacks; the free plan gets the Free Managed Ruleset. Custom rules are yours, with an expression of the Rules language, such as starts_with(http.request.uri.path, \"/api/admin\"), and an action such as Block, Managed Challenge or Skip: 5 on the free plan, with every action except Log.", "es": "El WAF de una zona corre reglas sobre cada pedido. Las reglas administradas las escribe Cloudflare contra ataques conocidos; el plan gratuito recibe el Free Managed Ruleset. Las reglas propias son tuyas, con una expresión del lenguaje de Rules, como starts_with(http.request.uri.path, \"/api/admin\"), y una acción como Block, Managed Challenge o Skip: 5 en el plan gratuito, con todas las acciones salvo Log." },
          "rule": { "en": "A rule is an expression and an action.", "es": "Una regla es una expresión y una acción." }
        },
        {
          "title": { "en": "In a fixed order", "es": "En un orden fijo" },
          "text": { "en": "The security phases run in sequence: DDoS protection, custom rules, rate limiting rules, managed rules, Super Bot Fight Mode. A terminating action, such as Block, ends the request: later phases and your Worker never see it. Before the rules, URL normalization can make /%68ello and /hello the same path; letter case is not part of what the documentation says it changes.", "es": "Las fases de seguridad corren en secuencia: protección DDoS, reglas propias, reglas de rate limiting, reglas administradas, Super Bot Fight Mode. Una acción que termina, como Block, corta el pedido: las fases siguientes y tu Worker no lo ven. Antes de las reglas, la normalización de URL puede hacer que /%68ello y /hello sean la misma ruta; las mayúsculas no están entre lo que la documentación dice que cambia." },
          "rule": { "en": "A rule compares text: normalize what it compares, lower() included.", "es": "Una regla compara texto: normalizá lo que compara, lower() incluido." }
        },
        {
          "title": { "en": "The rule in code, and its event", "es": "La regla en código, y su evento" },
          "text": { "en": "The kit has no zone, so the gateway plays the custom rule: a path that starts with /api/admin gets 403 before the origin. A WAF block is also recorded as a security event with its Ray ID; events are sampled, so a missing one does not prove nothing happened. A rule in the zone runs before any Worker; a rule in code runs only where your Worker runs.", "es": "El kit no tiene zona, así que el gateway hace de regla propia: una ruta que empieza con /api/admin recibe 403 antes del origen. Un bloqueo del WAF además queda como evento de seguridad con su Ray ID; los eventos son muestras, así que si falta uno no prueba que no pasó nada. Una regla en la zona corre antes de cualquier Worker; una regla en código corre solo donde corre tu Worker." },
          "rule": { "en": "Block in the zone what no code should ever see.", "es": "Bloqueá en la zona lo que ningún código debería ver." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Of these three, which runs first on a request?", "es": "De estas tres, ¿cuál corre primero sobre un pedido?" },
          "options": [
            { "en": "Managed rules", "es": "Las reglas administradas" },
            { "en": "Custom rules", "es": "Las reglas propias" },
            { "en": "Your Worker", "es": "Tu Worker" }
          ],
          "correct": 1,
          "explanation": { "en": "Custom rules, then rate limiting rules, then managed rules; a block ends it there.", "es": "Reglas propias, después rate limiting, después administradas; un bloqueo lo corta ahí." }
        },
        {
          "question": { "en": "/API/admin/users reached the origin while /api/admin/users was blocked. Why?", "es": "/API/admin/users llegó al origen mientras /api/admin/users quedaba bloqueado. ¿Por qué?" },
          "options": [
            { "en": "The rule compares text, and the case differs", "es": "La regla compara texto, y las mayúsculas difieren" },
            { "en": "The WAF only checks GET requests", "es": "El WAF solo revisa pedidos GET" },
            { "en": "The cache answered the second request", "es": "La cache respondió el segundo pedido" }
          ],
          "correct": 0,
          "explanation": { "en": "Compare lower(http.request.uri.path), or normalize in code.", "es": "Compará lower(http.request.uri.path), o normalizá en el código." }
        },
        {
          "question": { "en": "You search the security events for a Ray ID and find nothing. What does it prove?", "es": "Buscás un Ray ID en los eventos de seguridad y no encontrás nada. ¿Qué prueba?" },
          "options": [
            { "en": "That no rule matched the request", "es": "Que ninguna regla coincidió con el pedido" },
            { "en": "That the request never reached Cloudflare", "es": "Que el pedido nunca llegó a Cloudflare" },
            { "en": "Nothing for sure: events are sampled", "es": "Nada seguro: los eventos son muestras" }
          ],
          "correct": 2,
          "explanation": { "en": "Sampling can leave an event out.", "es": "El muestreo puede dejar un evento afuera." }
        }
      ],
      "source": "customrules",
      "experiment": { "en": "Write a path in another case and see which rule still matches.", "es": "Escribí una ruta con otras mayúsculas y mirá qué regla sigue coincidiendo." },
      "visor": { "en": "/api/admin/users ends at the Worker; /API/admin/users goes on to the origin, which answers 404: the rule in code missed the case.", "es": "/api/admin/users termina en el Worker; /API/admin/users sigue hasta el origen, que responde 404: la regla en código no vio las mayúsculas." },
      "lab": [
        {
          "title": { "en": "The rule blocks the admin API", "es": "La regla bloquea la API de administración" },
          "text": { "en": "In the kit, the rule is in the gateway.", "es": "En el kit, la regla está en el gateway." },
          "command": "docker compose run --rm lab get /api/admin/users",
          "expected": { "en": "HTTP 403, blocked at the edge.", "es": "HTTP 403, blocked at the edge." },
          "checks": [{ "contains": "HTTP 403" }]
        },
        {
          "title": { "en": "The same path in capitals", "es": "La misma ruta en mayúsculas" },
          "text": { "en": "startsWith compares text, as an expression of the WAF without lower() would.", "es": "startsWith compara texto, como lo haría una expresión del WAF sin lower()." },
          "command": "docker compose run --rm lab get /API/admin/users",
          "expected": { "en": "HTTP 404 from Spring Boot, with x-rumbo-via: edge: the request passed the rule and reached the origin, which happens to have no such route.", "es": "HTTP 404 de Spring Boot, con x-rumbo-via: edge: el pedido pasó la regla y llegó al origen, que justo no tiene esa ruta." },
          "checks": [{ "contains": "HTTP 404" }, { "contains": "x-rumbo-via: edge" }]
        },
        {
          "title": { "en": "See both in the spans", "es": "Mirá los dos en los spans" },
          "text": { "en": "One was answered by the Worker; the other went to the origin.", "es": "Uno lo respondió el Worker; el otro fue al origen." },
          "command": "docker compose exec edge lab spans 2",
          "expected": { "en": "GET /api/admin/users 403 answered by the Worker alone, and GET /API/admin/users 404 with fetch origin:8080/API/admin/users.", "es": "GET /api/admin/users 403 respondido por el Worker solo, y GET /API/admin/users 404 con fetch origin:8080/API/admin/users." },
          "checks": [{ "contains": "fetch origin:8080/API/admin/users" }]
        },
        {
          "title": { "en": "Read the rule", "es": "Leé la regla" },
          "text": { "en": "The rule of the kit, in the code of the gateway.", "es": "La regla del kit, en el código del gateway." },
          "command": "docker compose exec edge grep -n \"api/admin\" src/gateway.ts",
          "expected": { "en": "url.pathname.startsWith(\"/api/admin\"): exact text, case included. As a WAF expression that ignores case: starts_with(lower(http.request.uri.path), \"/api/admin\").", "es": "url.pathname.startsWith(\"/api/admin\"): texto exacto, mayúsculas incluidas. Como expresión del WAF que ignora mayúsculas: starts_with(lower(http.request.uri.path), \"/api/admin\")." },
          "checks": [{ "contains": "startsWith(\"/api/admin\")" }]
        }
      ]
    },
    {
      "id": 14,
      "unit": 4,
      "slug": "rate-limiting",
      "title": { "en": "Rate limiting", "es": "Rate limiting" },
      "intro": { "en": "Count requests by something stable, in a window, and answer 429 past the limit.", "es": "Contá pedidos por algo estable, en una ventana, y respondé 429 pasado el límite." },
      "visual": "ratelimit",
      "frames": [
        {
          "title": { "en": "Count by what, in which window", "es": "Contar por qué, en qué ventana" },
          "text": { "en": "A rate limit counts requests that share a characteristic, in a window, and acts past a threshold. The binding of Workers counts by the key your code gives, any string: an API key, a user, a tenant, a path. The documentation advises against the IP address, because many users can share one. The window is 10 or 60 seconds.", "es": "Un rate limit cuenta pedidos que comparten una característica, en una ventana, y actúa pasado un umbral. El binding de Workers cuenta por la clave que da tu código, cualquier texto: una API key, un usuario, un tenant, una ruta. La documentación desaconseja la dirección IP, porque muchos usuarios pueden compartir una. La ventana es de 10 o 60 segundos." },
          "rule": { "en": "Count what identifies a client, not where it connects from.", "es": "Contá lo que identifica a un cliente, no desde dónde se conecta." }
        },
        {
          "title": { "en": "Approximate, per location", "es": "Aproximado, por lugar" },
          "text": { "en": "The binding counts separately in each Cloudflare location and the counts are eventually consistent, so requests can go over the limit before the counters agree. A call that returns success: false does not add to the count. For a strict limit across all locations, the documentation points to Durable Objects, lesson 19.", "es": "El binding cuenta por separado en cada lugar de Cloudflare y las cuentas son eventualmente consistentes, así que los pedidos pueden pasar el límite antes de que los contadores se pongan de acuerdo. Una llamada que devuelve success: false no suma a la cuenta. Para un límite estricto en todos los lugares, la documentación remite a Durable Objects, lección 19." },
          "rule": { "en": "A rate limit protects capacity; it is not an exact quota.", "es": "Un rate limit protege capacidad; no es una cuota exacta." }
        },
        {
          "title": { "en": "In the zone or in the Worker", "es": "En la zona o en el Worker" },
          "text": { "en": "Rate limiting rules of the WAF run in their own phase, before managed rules and before any Worker; the free plan includes one such rule. The binding runs inside your Worker, where it knows things a rule cannot, such as the tenant behind an API key. In Rumbo, the gateway allows 5 requests per 10 seconds per x-api-key and answers 429 with retry-after: 10. Locally the windows are fixed, aligned every 10 seconds.", "es": "Las reglas de rate limiting del WAF corren en su propia fase, antes de las administradas y antes de cualquier Worker; el plan gratuito incluye una regla así. El binding corre dentro de tu Worker, donde sabe cosas que una regla no, como el tenant detrás de una API key. En Rumbo, el gateway permite 5 pedidos cada 10 segundos por x-api-key y responde 429 con retry-after: 10. En local las ventanas son fijas, alineadas cada 10 segundos." },
          "rule": { "en": "Limit in the zone what is anonymous; in code, what has a name.", "es": "Limitá en la zona lo anónimo; en el código, lo que tiene nombre." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Why not use the IP address as the key?", "es": "¿Por qué no usar la dirección IP como clave?" },
          "options": [
            { "en": "Because many users can share one", "es": "Porque muchos usuarios pueden compartir una" },
            { "en": "Because IP addresses change every request", "es": "Porque las direcciones IP cambian en cada pedido" },
            { "en": "Because the binding cannot read it", "es": "Porque el binding no la puede leer" }
          ],
          "correct": 0,
          "explanation": { "en": "An office or a carrier network behind one address would share a budget.", "es": "Una oficina o una red móvil detrás de una dirección compartirían un presupuesto." }
        },
        {
          "question": { "en": "Is the limit of the binding exact across the world?", "es": "¿El límite del binding es exacto en todo el mundo?" },
          "options": [
            { "en": "Yes: one counter per key worldwide", "es": "Sí: un contador por clave en todo el mundo" },
            { "en": "No: it is per location and eventually consistent", "es": "No: es por lugar y eventualmente consistente" },
            { "en": "Yes, on the paid plan", "es": "Sí, en el plan pago" }
          ],
          "correct": 1,
          "explanation": { "en": "For a strict global limit, a Durable Object holds the counter.", "es": "Para un límite global estricto, un Durable Object tiene el contador." }
        },
        {
          "question": { "en": "Key k1 got 429 and key k2 got 200 in the same second. Why?", "es": "La clave k1 recibió 429 y la clave k2 recibió 200 en el mismo segundo. ¿Por qué?" },
          "options": [
            { "en": "Because each key has its own count", "es": "Porque cada clave tiene su propia cuenta" },
            { "en": "Because k2 is a newer key", "es": "Porque k2 es una clave más nueva" },
            { "en": "Because the window had just restarted for everyone", "es": "Porque la ventana se acababa de reiniciar para todos" }
          ],
          "correct": 0,
          "explanation": { "en": "The budget belongs to the key.", "es": "El presupuesto es de la clave." }
        }
      ],
      "source": "ratelimit",
      "experiment": { "en": "Send a burst with one key and with two, and watch the window fill.", "es": "Mandá una ráfaga con una clave y con dos, y mirá cómo se llena la ventana." },
      "visor": { "en": "Every request of the burst goes through rate limit first; the 429 answers stop there, before KV and the origin.", "es": "Cada pedido de la ráfaga pasa primero por rate limit; las respuestas 429 frenan ahí, antes de KV y del origen." },
      "lab": [
        {
          "title": { "en": "A burst with one key", "es": "Una ráfaga con una clave" },
          "text": { "en": "limit sends 7 requests with x-api-key k1, starting inside one window.", "es": "limit manda 7 pedidos con x-api-key k1, empezando dentro de una ventana." },
          "command": "docker compose run --rm lab limit k1",
          "expected": { "en": "key k1: 200 200 200 200 200 429 429: five allowed, then refused.", "es": "key k1: 200 200 200 200 200 429 429: cinco permitidos y después rechazados." },
          "checks": [{ "contains": "429" }]
        },
        {
          "title": { "en": "Another key in the same window", "es": "Otra clave en la misma ventana" },
          "text": { "en": "Three requests with k2.", "es": "Tres pedidos con k2." },
          "command": "docker compose run --rm lab limit k2 3",
          "expected": { "en": "key k2: 200 200 200: k2 has its own budget.", "es": "key k2: 200 200 200: k2 tiene su propio presupuesto." },
          "checks": [{ "contains": "key k2: 200 200 200" }]
        },
        {
          "title": { "en": "Read the configuration", "es": "Leé la configuración" },
          "text": { "en": "The binding is declared in wrangler.jsonc.", "es": "El binding está declarado en wrangler.jsonc." },
          "command": "docker compose exec edge grep -n \"ratelimits\" wrangler.jsonc",
          "expected": { "en": "LIMITER, namespace_id 1001 and simple: limit 5, period 10.", "es": "LIMITER, namespace_id 1001 y simple: limit 5, period 10." },
          "checks": [{ "contains": "\"limit\": 5, \"period\": 10" }]
        },
        {
          "title": { "en": "See the limit in the spans", "es": "Mirá el límite en los spans" },
          "text": { "en": "The binding is one more operation of the request.", "es": "El binding es una operación más del pedido." },
          "command": "docker compose exec edge lab spans 2",
          "expected": { "en": "Requests to /api/shipments/R-1042 with rate limit first, then KV get maintenance and the fetch to the origin.", "es": "Pedidos a /api/shipments/R-1042 con rate limit primero, después KV get maintenance y el fetch al origen." },
          "checks": [{ "contains": "rate limit" }]
        }
      ]
    },
    {
      "id": 15,
      "unit": 4,
      "slug": "access-identity",
      "title": { "en": "Access: identity before the origin", "es": "Access: identidad antes del origen" },
      "intro": { "en": "The edge asks who you are; the origin still checks the proof it receives.", "es": "El borde pregunta quién sos; el origen igual verifica la prueba que recibe." },
      "visual": "access",
      "frames": [
        {
          "title": { "en": "Identity at the edge", "es": "Identidad en el borde" },
          "text": { "en": "Cloudflare Access puts a login in front of an application: a hostname of your zone, or a Worker with its workers.dev name and previews. A person signs in with an identity provider, a policy decides, and the edge adds a signed JWT to the requests that pass, in the Cf-Access-Jwt-Assertion header and the CF_Authorization cookie. Cloudflare Zero Trust, which includes Access, is free for up to 50 users.", "es": "Cloudflare Access pone un login delante de una aplicación: un hostname de tu zona, o un Worker con su nombre de workers.dev y sus vistas previas. Una persona entra con un proveedor de identidad, una política decide, y el borde agrega un JWT firmado a los pedidos que pasan, en el encabezado Cf-Access-Jwt-Assertion y en la cookie CF_Authorization. Cloudflare Zero Trust, que incluye Access, es gratis hasta 50 usuarios." },
          "rule": { "en": "Access decides at the edge; it does not close your origin.", "es": "Access decide en el borde; no cierra tu origen." }
        },
        {
          "title": { "en": "The origin validates", "es": "El origen valida" },
          "text": { "en": "An origin that trusts the header without checking it lets in anyone who sends one. It validates the signature with the public keys of the team at https://<team>.cloudflareaccess.com/cdn-cgi/access/certs, the aud claim against the AUD tag of the application, the iss against the team domain, and the expiry. The keys rotate about every six weeks, so they are fetched, not copied. For a Worker behind Access, ctx.access gives the identity directly.", "es": "Un origen que confía en el encabezado sin verificarlo deja entrar a cualquiera que mande uno. Valida la firma con las claves públicas del equipo en https://<equipo>.cloudflareaccess.com/cdn-cgi/access/certs, el claim aud contra el AUD tag de la aplicación, el iss contra el dominio del equipo, y el vencimiento. Las claves rotan cada seis semanas más o menos, así que se traen, no se copian. Para un Worker detrás de Access, ctx.access da la identidad directamente." },
          "rule": { "en": "Check signature, audience, issuer and expiry, every time.", "es": "Verificá firma, audiencia, emisor y vencimiento, siempre." }
        },
        {
          "title": { "en": "The test issuer of the kit", "es": "El emisor de prueba del kit" },
          "text": { "en": "The kit has no Access: the edge serves a test issuer of the course, with its own ES256 key, its certs and tokens with the same claims as Access. The origin uses Spring Security as a resource server, reading the token from the Cf-Access-Jwt-Assertion header, and checks the same four things. With Access, only three values change: the certs URL, the issuer and the audience.", "es": "El kit no tiene Access: el borde sirve un emisor de prueba del curso, con su propia clave ES256, sus certs y tokens con los mismos claims que Access. El origen usa Spring Security como resource server, lee el token del encabezado Cf-Access-Jwt-Assertion y verifica las mismas cuatro cosas. Con Access cambian solo tres valores: la URL de los certs, el emisor y la audiencia." },
          "rule": { "en": "Test the checks with tokens that should fail.", "es": "Probá las verificaciones con tokens que tienen que fallar." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Where does Access put the identity for the origin?", "es": "¿Dónde pone Access la identidad para el origen?" },
          "options": [
            { "en": "In a query parameter called user", "es": "En un parámetro de la URL llamado user" },
            { "en": "In the IP address of the request", "es": "En la dirección IP del pedido" },
            { "en": "In a signed JWT, in Cf-Access-Jwt-Assertion", "es": "En un JWT firmado, en Cf-Access-Jwt-Assertion" }
          ],
          "correct": 2,
          "explanation": { "en": "Also in the CF_Authorization cookie, for browsers.", "es": "También en la cookie CF_Authorization, para navegadores." }
        },
        {
          "question": { "en": "A token of another application reaches the panel. Which check refuses it?", "es": "Un token de otra aplicación llega al panel. ¿Qué verificación lo rechaza?" },
          "options": [
            { "en": "The audience", "es": "La audiencia" },
            { "en": "The signature", "es": "La firma" },
            { "en": "The expiry", "es": "El vencimiento" }
          ],
          "correct": 0,
          "explanation": { "en": "Same team, same keys, valid signature: aud is what says which application it is for.", "es": "Mismo equipo, mismas claves, firma válida: aud es lo que dice para qué aplicación es." }
        },
        {
          "question": { "en": "Why fetch the certs instead of copying the key into the origin?", "es": "¿Por qué traer los certs en lugar de copiar la clave en el origen?" },
          "options": [
            { "en": "Because the certs URL is faster", "es": "Porque la URL de los certs es más rápida" },
            { "en": "Because the keys rotate", "es": "Porque las claves rotan" },
            { "en": "Because the key is secret", "es": "Porque la clave es secreta" }
          ],
          "correct": 1,
          "explanation": { "en": "About every six weeks; a copied key stops working.", "es": "Cada seis semanas más o menos; una clave copiada deja de andar." }
        }
      ],
      "source": "accessjwt",
      "experiment": { "en": "Break one claim of the token at a time and see which check of the origin refuses it.", "es": "Rompé un claim del token por vez y mirá qué verificación del origen lo rechaza." },
      "visor": { "en": "lab panel asks the test issuer for a token when it needs one, then calls /panel, which the Worker forwards to the origin: the token is checked there. panel --direct leaves nothing, because it skips the edge.", "es": "lab panel le pide un token al emisor de prueba cuando lo necesita y después llama a /panel, que el Worker pasa al origen: el token se verifica allá. panel --direct no deja nada, porque saltea el borde." },
      "lab": [
        {
          "title": { "en": "The panel without a token", "es": "El panel sin token" },
          "text": { "en": "panel calls /panel of the origin through the edge.", "es": "panel llama a /panel del origen a través del borde." },
          "command": "docker compose run --rm lab panel",
          "expected": { "en": "HTTP 401: the origin asks for a token.", "es": "HTTP 401: el origen pide un token." },
          "checks": [{ "contains": "HTTP 401" }]
        },
        {
          "title": { "en": "Ask the test issuer for a token", "es": "Pedile un token al emisor de prueba" },
          "text": { "en": "token prints the claims and only the beginning of the token.", "es": "token imprime los claims y solo el principio del token." },
          "command": "docker compose run --rm lab token",
          "expected": { "en": "iss http://test-issuer.local, aud rumbo-panel, the email of ana, iat, nbf and exp five minutes later, and the note: test issuer of the course, not Cloudflare Access.", "es": "iss http://test-issuer.local, aud rumbo-panel, el email de ana, iat, nbf y exp cinco minutos después, y la nota: test issuer of the course, not Cloudflare Access." },
          "checks": [{ "contains": "\"aud\": [" }, { "contains": "not Cloudflare Access" }]
        },
        {
          "title": { "en": "The panel with a valid token", "es": "El panel con un token válido" },
          "text": { "en": "The token goes in Cf-Access-Jwt-Assertion, as Access would send it.", "es": "El token va en Cf-Access-Jwt-Assertion, como lo mandaría Access." },
          "command": "docker compose run --rm lab panel --token",
          "expected": { "en": "HTTP 200 with the email, the issuer and the audience the origin validated.", "es": "HTTP 200 con el email, el emisor y la audiencia que validó el origen." },
          "checks": [{ "contains": "HTTP 200" }, { "contains": "ana@rumbo.example" }]
        },
        {
          "title": { "en": "A token for another application", "es": "Un token para otra aplicación" },
          "text": { "en": "Same issuer, same key, audience other-app.", "es": "Mismo emisor, misma clave, audiencia other-app." },
          "command": "docker compose run --rm lab panel --aud other-app",
          "expected": { "en": "HTTP 401 and why: audience is not rumbo-panel.", "es": "HTTP 401 y why: audience is not rumbo-panel." },
          "checks": [{ "contains": "audience is not rumbo-panel" }]
        },
        {
          "title": { "en": "An expired token", "es": "Un token vencido" },
          "text": { "en": "Issued ten minutes ago, valid for five.", "es": "Emitido hace diez minutos, válido por cinco." },
          "command": "docker compose run --rm lab panel --expired",
          "expected": { "en": "HTTP 401 and why: Jwt expired at, with the time.", "es": "HTTP 401 y why: Jwt expired at, con la hora." },
          "checks": [{ "contains": "Jwt expired" }]
        },
        {
          "title": { "en": "A token changed after signing", "es": "Un token cambiado después de firmarse" },
          "text": { "en": "The email is changed to intruder@rumbo.example and the signature kept.", "es": "El email se cambia a intruder@rumbo.example y se deja la firma." },
          "command": "docker compose run --rm lab panel --tampered",
          "expected": { "en": "HTTP 401 and why: Signed JWT rejected: Invalid signature.", "es": "HTTP 401 y why: Signed JWT rejected: Invalid signature." },
          "checks": [{ "contains": "Invalid signature" }]
        },
        {
          "title": { "en": "Straight to the origin", "es": "Directo al origen" },
          "text": { "en": "Skipping the edge, as someone who found the origin would.", "es": "Salteando el borde, como haría alguien que encontró el origen." },
          "command": "docker compose run --rm lab panel --direct",
          "expected": { "en": "HTTP 401 again: the origin asks for proof whoever calls, so skipping the edge does not skip the check.", "es": "HTTP 401 de nuevo: el origen pide prueba llame quien llame, así que saltear el borde no saltea la verificación." },
          "checks": [{ "contains": "straight to the origin" }, { "contains": "HTTP 401" }]
        }
      ]
    },
    {
      "id": 16,
      "unit": 5,
      "slug": "kv",
      "title": { "en": "KV: fast reads, eventual writes", "es": "KV: leer rápido, escribir eventual" },
      "intro": { "en": "A key-value store cached close to every reader, where a write takes time to arrive.", "es": "Un almacén de clave y valor guardado cerca de cada lector, donde una escritura tarda en llegar." },
      "visual": "kv",
      "frames": [
        {
          "title": { "en": "Central stores, local copies", "es": "Almacenes centrales, copias locales" },
          "text": { "en": "Workers KV writes to a small number of central data centers and caches the values in the data centers that read them; popular values stay cached where they are asked for. What it is for: data read much more than written, such as configuration, feature flags, allow and deny lists, user preferences. Rumbo keeps its maintenance flag and the key of its test issuer there.", "es": "Workers KV escribe en unos pocos data centers centrales y guarda copias de los valores en los data centers que los leen; los valores populares quedan en cache donde se los pide. Para qué sirve: datos que se leen mucho más de lo que se escriben, como configuración, feature flags, listas de permitidos y bloqueados, preferencias. Rumbo guarda ahí su flag de mantenimiento y la clave de su emisor de prueba." },
          "rule": { "en": "KV is for reading a lot and writing a little.", "es": "KV es para leer mucho y escribir poco." }
        },
        {
          "title": { "en": "Eventual means later", "es": "Eventual quiere decir después" },
          "text": { "en": "KV is eventually consistent: a write is usually visible at once where it was made, and can take up to 60 seconds or more to be visible elsewhere. A missing key is cached too, so a new key can take as long to appear. cacheTtl, 60 seconds by default, sets how long a read keeps its copy. The free plan gives 100,000 reads and 1,000 writes per day.", "es": "KV es eventualmente consistente: una escritura en general se ve enseguida donde se hizo, y puede tardar 60 segundos o más en verse en otros lugares. Una clave que falta también queda en cache, así que una clave nueva puede tardar lo mismo en aparecer. cacheTtl, 60 segundos por defecto, fija cuánto guarda su copia una lectura. El plan gratuito da 100.000 lecturas y 1.000 escrituras por día." },
          "rule": { "en": "Design as if the next reader sees the old value.", "es": "Diseñá como si el próximo lector viera el valor viejo." }
        },
        {
          "title": { "en": "Not a counter", "es": "No es un contador" },
          "text": { "en": "KV has no atomic operations: read a number, add one and write it back from 50 requests at once, and most increments are lost, because each request read the same old value. The documentation also warns against writing the same key tens or hundreds of times per second, and points to Durable Objects for this. Locally there is one store, so what the lab loses comes from reading and writing in parallel; on Cloudflare, eventual consistency adds to it.", "es": "KV no tiene operaciones atómicas: leé un número, sumale uno y escribilo de vuelta desde 50 pedidos a la vez, y se pierden casi todos los incrementos, porque cada pedido leyó el mismo valor viejo. La documentación además advierte contra escribir la misma clave decenas o cientos de veces por segundo, y remite a Durable Objects para esto. En local hay un solo almacén, así que lo que pierde el lab sale de leer y escribir en paralelo; en Cloudflare, la consistencia eventual suma." },
          "rule": { "en": "Read-modify-write needs one place that decides.", "es": "Leer, modificar y escribir necesita un lugar que decida." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Which is a good fit for KV?", "es": "¿Qué encaja bien en KV?" },
          "options": [
            { "en": "A counter of page views", "es": "Un contador de visitas" },
            { "en": "The stock of a product during a sale", "es": "El stock de un producto durante una oferta" },
            { "en": "A flag that turns maintenance on", "es": "Una flag que prende el mantenimiento" }
          ],
          "correct": 2,
          "explanation": { "en": "Read on every request, written once in a while: what KV is for.", "es": "Se lee en cada pedido y se escribe cada tanto: para eso es KV." }
        },
        {
          "question": { "en": "You change a value in KV. When will a reader on another continent see it?", "es": "Cambiás un valor en KV. ¿Cuándo lo ve un lector en otro continente?" },
          "options": [
            { "en": "At once, because KV writes everywhere", "es": "Enseguida, porque KV escribe en todos lados" },
            { "en": "Usually within 60 seconds, sometimes more", "es": "En general dentro de 60 segundos, a veces más" },
            { "en": "Never, until the key is deleted", "es": "Nunca, hasta que se borre la clave" }
          ],
          "correct": 1,
          "explanation": { "en": "Eventual consistency: no promise of when, only that it will.", "es": "Consistencia eventual: no hay promesa de cuándo, solo de que va a pasar." }
        },
        {
          "question": { "en": "50 parallel increments in KV ended at 1. Why?", "es": "50 incrementos en paralelo en KV terminaron en 1. ¿Por qué?" },
          "options": [
            { "en": "The free plan allows one write per test", "es": "El plan gratuito permite una escritura por prueba" },
            { "en": "KV rejected 49 of them as duplicates", "es": "KV rechazó 49 como duplicados" },
            { "en": "They all read the same old value and wrote over each other", "es": "Todos leyeron el mismo valor viejo y se pisaron" }
          ],
          "correct": 2,
          "explanation": { "en": "No atomic increment: each one wrote 0 + 1.", "es": "No hay incremento atómico: cada uno escribió 0 + 1." }
        }
      ],
      "source": "howkv",
      "experiment": { "en": "Write a flag in one data center and read it from another before and after a minute.", "es": "Escribí una flag en un data center y leela desde otro antes y después de un minuto." },
      "visor": { "en": "With the maintenance flag on, the request shows KV get maintenance and a 503 with no call to the origin. lab race kv is one request whose fifty increments each read and write KV.", "es": "Con la flag de mantenimiento puesta, el pedido muestra KV get maintenance y un 503 sin llamar al origen. lab race kv es un solo pedido cuyos cincuenta incrementos leen y escriben KV." },
      "lab": [
        {
          "title": { "en": "Turn maintenance on", "es": "Prendé el mantenimiento" },
          "text": { "en": "wrangler kv key put writes to the local store with --local, the same store wrangler dev reads. The binding name is enough to find the namespace.", "es": "wrangler kv key put escribe en el almacén local con --local, el mismo que lee wrangler dev. Alcanza el nombre del binding para encontrar el namespace." },
          "command": "docker compose exec edge npx wrangler kv key put maintenance on --binding FLAGS --local",
          "expected": { "en": "Writing the value \"on\" to key \"maintenance\" on namespace binding: \"FLAGS\".", "es": "Writing the value \"on\" to key \"maintenance\" on namespace binding: \"FLAGS\"." },
          "checks": [{ "contains": "Writing the value \"on\"" }]
        },
        {
          "title": { "en": "The gateway reads the flag", "es": "El gateway lee la flag" },
          "text": { "en": "Every API request reads it.", "es": "Cada pedido a la API la lee." },
          "command": "docker compose run --rm lab get /api/shipments/R-1042",
          "expected": { "en": "HTTP 503, maintenance, try again later: the origin was not called.", "es": "HTTP 503, maintenance, try again later: no se llamó al origen." },
          "checks": [{ "contains": "HTTP 503" }]
        },
        {
          "title": { "en": "Turn it off", "es": "Apagalo" },
          "text": { "en": "Delete the key.", "es": "Borrá la clave." },
          "command": "docker compose exec edge npx wrangler kv key delete maintenance --binding FLAGS --local\ndocker compose run --rm lab get /api/shipments/R-1042",
          "expected": { "en": "Deleting the key \"maintenance\", then HTTP 200 from the origin. Locally the change is seen at once; on Cloudflare, other data centers could take up to a minute or more.", "es": "Deleting the key \"maintenance\", y después HTTP 200 del origen. En local el cambio se ve enseguida; en Cloudflare, otros data centers podrían tardar hasta un minuto o más." },
          "checks": [{ "contains": "HTTP 200" }]
        },
        {
          "title": { "en": "Fifty increments at once", "es": "Cincuenta incrementos a la vez" },
          "text": { "en": "/lab/race/kv sets race to 0 and runs 50 read-add-write in parallel.", "es": "/lab/race/kv pone race en 0 y corre 50 leer, sumar y escribir en paralelo." },
          "command": "docker compose run --rm lab race kv",
          "expected": { "en": "increments: 50 and final: 1, or a number far below 50.", "es": "increments: 50 y final: 1, o un número muy por debajo de 50." },
          "checks": [{ "absent": "\"final\": 50" }]
        },
        {
          "title": { "en": "List the keys", "es": "Listá las claves" },
          "text": { "en": "Everything the Worker wrote in this namespace.", "es": "Todo lo que el Worker escribió en este namespace." },
          "command": "docker compose exec edge npx wrangler kv key list --binding FLAGS --local",
          "expected": { "en": "last-request from lesson 07, race, test-issuer:key and the others: KV is one namespace of strings for many uses.", "es": "last-request de la lección 07, race, test-issuer:key y las demás: KV es un namespace de textos para muchos usos." },
          "checks": [{ "contains": "last-request" }]
        }
      ]
    },
    {
      "id": 17,
      "unit": 5,
      "slug": "d1",
      "title": { "en": "D1: SQLite at the edge", "es": "D1: SQLite en el borde" },
      "intro": { "en": "A managed SQL database with migrations, read by the Worker through a binding.", "es": "Una base SQL administrada con migraciones, que el Worker lee por un binding." },
      "visual": "d1",
      "frames": [
        {
          "title": { "en": "A database per binding", "es": "Una base por binding" },
          "text": { "en": "D1 is a managed, serverless database with the SQL of SQLite. The Worker uses prepared statements with bind, and gets rows back. Rumbo keeps its zones and quotes there: what the edge computes and records without asking the origin. The free plan allows 10 databases, 5 GB in total, 5 million rows read and 100,000 rows written per day.", "es": "D1 es una base administrada y serverless con el SQL de SQLite. El Worker usa sentencias preparadas con bind y recibe filas. Rumbo guarda ahí sus zonas y cotizaciones: lo que el borde calcula y registra sin preguntarle al origen. El plan gratuito permite 10 bases, 5 GB en total, 5 millones de filas leídas y 100.000 filas escritas por día." },
          "rule": { "en": "Always bind values; never build SQL with strings.", "es": "Siempre usá bind para los valores; nunca armes SQL con textos." }
        },
        {
          "title": { "en": "Migrations", "es": "Migraciones" },
          "text": { "en": "The schema changes with numbered SQL files in migrations, applied with wrangler d1 migrations apply, locally with --local and on the account with --remote. D1 records the applied ones in the d1_migrations table, so applying twice does nothing. The kit applies them every time the edge starts.", "es": "El esquema cambia con archivos SQL numerados en migrations, que se aplican con wrangler d1 migrations apply, en local con --local y en la cuenta con --remote. D1 registra las aplicadas en la tabla d1_migrations, así que aplicar dos veces no hace nada. El kit las aplica cada vez que arranca el borde." },
          "rule": { "en": "The schema is code: versioned, reviewed and applied in order.", "es": "El esquema es código: versionado, revisado y aplicado en orden." }
        },
        {
          "title": { "en": "One primary, read replicas", "es": "Una principal, réplicas de lectura" },
          "text": { "en": "A D1 database has a primary that takes the writes. Read replication, in beta, adds copies in other regions for reads; the Sessions API, with a bookmark, lets a request read at least what an earlier one wrote. The Local Explorer of wrangler dev, at /cdn-cgi/local/explorer on the port of the edge, shows and edits the local tables.", "es": "Una base D1 tiene una principal que recibe las escrituras. La replicación de lectura, en beta, agrega copias en otras regiones para leer; la Sessions API, con un bookmark, deja que un pedido lea por lo menos lo que escribió uno anterior. El Local Explorer de wrangler dev, en /cdn-cgi/local/explorer en el puerto del borde, muestra y edita las tablas locales." },
          "rule": { "en": "Replicas are for reads; a bookmark is for reading your own writes.", "es": "Las réplicas son para leer; un bookmark es para leer lo que escribiste." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "What does D1 record in d1_migrations?", "es": "¿Qué registra D1 en d1_migrations?" },
          "options": [
            { "en": "Every query the Worker ran", "es": "Cada consulta que corrió el Worker" },
            { "en": "The migrations already applied", "es": "Las migraciones ya aplicadas" },
            { "en": "The replicas of the database", "es": "Las réplicas de la base" }
          ],
          "correct": 1,
          "explanation": { "en": "That is why applying again says there is nothing to apply.", "es": "Por eso aplicar de nuevo dice que no hay nada que aplicar." }
        },
        {
          "question": { "en": "A request writes a quote and the next one, routed to a replica, does not see it. What fixes it?", "es": "Un pedido escribe una cotización y el siguiente, ruteado a una réplica, no la ve. ¿Qué lo arregla?" },
          "options": [
            { "en": "Writing to the replica", "es": "Escribir en la réplica" },
            { "en": "Running the migration again", "es": "Correr la migración de nuevo" },
            { "en": "A session with the bookmark of the write", "es": "Una sesión con el bookmark de la escritura" }
          ],
          "correct": 2,
          "explanation": { "en": "The bookmark makes the replica wait until it has at least that write.", "es": "El bookmark hace que la réplica espere hasta tener por lo menos esa escritura." }
        },
        {
          "question": { "en": "Why bind the zone instead of putting it inside the SQL text?", "es": "¿Por qué usar bind para la zona en lugar de ponerla dentro del texto SQL?" },
          "options": [
            { "en": "Because a value written into SQL can change the query", "es": "Porque un valor escrito dentro del SQL puede cambiar la consulta" },
            { "en": "Because bind is faster to write", "es": "Porque bind es más rápido de escribir" },
            { "en": "Because D1 rejects literals", "es": "Porque D1 rechaza literales" }
          ],
          "correct": 0,
          "explanation": { "en": "SQL injection: the value must never become code.", "es": "Inyección de SQL: el valor nunca se tiene que volver código." }
        }
      ],
      "source": "d1",
      "experiment": { "en": "Write a quote through the primary and read it through a replica, with and without a bookmark.", "es": "Escribí una cotización por la principal y leela por una réplica, con y sin bookmark." },
      "visor": { "en": "lab quote shows D1 first for the zone and D1 run for the quote; the zone XYZ stops after D1 first, with a 404.", "es": "lab quote muestra D1 first para la zona y D1 run para la cotización; la zona XYZ frena después de D1 first, con un 404." },
      "lab": [
        {
          "title": { "en": "See the migrations", "es": "Mirá las migraciones" },
          "text": { "en": "The edge applied them when it started.", "es": "El borde las aplicó cuando arrancó." },
          "command": "docker compose exec edge npx wrangler d1 migrations list rumbo-edge --local",
          "expected": { "en": "No migrations to apply: 0001_zones.sql and 0002_quotes.sql are already in d1_migrations.", "es": "No migrations to apply: 0001_zones.sql y 0002_quotes.sql ya están en d1_migrations." },
          "checks": [{ "contains": "No migrations to apply" }]
        },
        {
          "title": { "en": "Ask for a quote", "es": "Pedí una cotización" },
          "text": { "en": "/quotes reads the zone, computes base plus price per kilo and inserts the quote.", "es": "/quotes lee la zona, calcula base más precio por kilo e inserta la cotización." },
          "command": "docker compose run --rm lab quote MAD 2.5",
          "expected": { "en": "Madrid, 3 days, 2.5 kg, total_eur: 16 (12.0 + 1.6 x 2.5) and the id of the new quote.", "es": "Madrid, 3 días, 2,5 kg, total_eur: 16 (12,0 + 1,6 x 2,5) y el id de la cotización nueva." },
          "checks": [{ "contains": "\"total_eur\": 16" }]
        },
        {
          "title": { "en": "Read the table with SQL", "es": "Leé la tabla con SQL" },
          "text": { "en": "wrangler d1 execute runs SQL on the local database.", "es": "wrangler d1 execute corre SQL sobre la base local." },
          "command": "docker compose exec edge npx wrangler d1 execute rumbo-edge --local --command \"SELECT zone, kg, total_eur FROM quotes\"",
          "expected": { "en": "The row MAD, 2.5, 16.", "es": "La fila MAD, 2.5, 16." },
          "checks": [{ "contains": "\"zone\": \"MAD\"" }]
        },
        {
          "title": { "en": "List the tables", "es": "Listá las tablas" },
          "text": { "en": "Single quotes go inside the double quotes, never the other way around, so the command works in PowerShell too.", "es": "Las comillas simples van dentro de las dobles, nunca al revés, así el comando anda también en PowerShell." },
          "command": "docker compose exec edge npx wrangler d1 execute rumbo-edge --local --command \"SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name\"",
          "expected": { "en": "d1_migrations, quotes, sqlite_sequence and zones.", "es": "d1_migrations, quotes, sqlite_sequence y zones." },
          "checks": [{ "contains": "\"name\": \"d1_migrations\"" }]
        },
        {
          "title": { "en": "An unknown zone", "es": "Una zona desconocida" },
          "text": { "en": "The Worker answers 404 when the zone is not in the table, and lab exits with an error.", "es": "El Worker responde 404 cuando la zona no está en la tabla, y lab termina con error." },
          "command": "docker compose run --rm lab quote XYZ 1",
          "expected": { "en": "unknown zone, XYZ, and exit code 1.", "es": "unknown zone, XYZ, y código de salida 1." },
          "checks": [{ "contains": "unknown zone" }],
          "exit": 1
        }
      ]
    },
    {
      "id": 18,
      "unit": 5,
      "slug": "r2",
      "title": { "en": "R2: objects without egress fees", "es": "R2: objetos sin costo de salida" },
      "intro": { "en": "Store files by key and serve them from the edge, with no egress fees.", "es": "Guardá archivos por clave y servilos desde el borde, sin costo de salida." },
      "visual": "r2",
      "frames": [
        {
          "title": { "en": "Objects in buckets", "es": "Objetos en buckets" },
          "text": { "en": "R2 is object storage: buckets with objects addressed by key, each with metadata and an etag. A Worker reaches it through a binding, and other programs through an API compatible with S3. Rumbo stores the proofs of delivery there, under proofs/<shipment>.txt.", "es": "R2 es almacenamiento de objetos: buckets con objetos direccionados por clave, cada uno con metadatos y un etag. Un Worker llega por un binding, y otros programas por una API compatible con S3. Rumbo guarda ahí los comprobantes de entrega, bajo proofs/<envío>.txt." },
          "rule": { "en": "A key is a name, not a folder.", "es": "Una clave es un nombre, no una carpeta." }
        },
        {
          "title": { "en": "No egress fees", "es": "Sin costo de salida" },
          "text": { "en": "Reading data out of R2 has no egress charge; the charges are storage and operations. The free tier, for Standard storage, gives 10 GB-month of storage, 1 million Class A operations, such as writes, and 10 million Class B operations, such as reads, per month. Enabling R2 on an account asks for a payment method: NOT VERIFIED in the documentation, it comes from a status incident.", "es": "Sacar datos de R2 no tiene cargo de salida; se cobra el almacenamiento y las operaciones. El nivel gratuito, para almacenamiento Standard, da 10 GB-mes de almacenamiento, 1 millón de operaciones Clase A, como escrituras, y 10 millones de Clase B, como lecturas, por mes. Habilitar R2 en una cuenta pide un medio de pago: NO VERIFICADO en la documentación, surge de un incidente de estado." },
          "rule": { "en": "With R2, reading is cheap; count the operations.", "es": "Con R2, leer es barato; contá las operaciones." }
        },
        {
          "title": { "en": "From the Worker", "es": "Desde el Worker" },
          "text": { "en": "The binding has put, get, head, list and delete, and the bodies are streams: a Worker can pass a request body to put and an object body to a Response without loading it in memory. writeHttpMetadata copies the stored content type to the response. A bucket can also be public, through a custom domain, and notify a queue when objects change, configured on the account.", "es": "El binding tiene put, get, head, list y delete, y los cuerpos son streams: un Worker puede pasarle el cuerpo de un pedido a put y el cuerpo de un objeto a un Response sin cargarlo en memoria. writeHttpMetadata copia el tipo de contenido guardado a la respuesta. Un bucket también puede ser público, por un dominio propio, y avisarle a una cola cuando cambian objetos, configurado en la cuenta." },
          "rule": { "en": "Stream bodies; do not buffer them.", "es": "Pasá los cuerpos como stream; no los cargues enteros." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "What does R2 not charge for?", "es": "¿Qué no cobra R2?" },
          "options": [
            { "en": "Egress, reading the data out", "es": "La salida, sacar los datos" },
            { "en": "Storage", "es": "El almacenamiento" },
            { "en": "Class A operations", "es": "Las operaciones Clase A" }
          ],
          "correct": 0,
          "explanation": { "en": "Storage and operations are charged past the free tier; egress is not.", "es": "El almacenamiento y las operaciones se cobran pasado el nivel gratuito; la salida no." }
        },
        {
          "question": { "en": "A proof is stored under proofs/R-1043.txt. What is proofs/?", "es": "Un comprobante se guarda bajo proofs/R-1043.txt. ¿Qué es proofs/?" },
          "options": [
            { "en": "Part of the name of the key", "es": "Parte del nombre de la clave" },
            { "en": "Another bucket", "es": "Otro bucket" },
            { "en": "A folder that must be created first", "es": "Una carpeta que hay que crear primero" }
          ],
          "correct": 0,
          "explanation": { "en": "Object storage has keys; slashes are a convention for listing by prefix.", "es": "El almacenamiento de objetos tiene claves; las barras son una convención para listar por prefijo." }
        },
        {
          "question": { "en": "How does the Worker of Rumbo return a stored proof?", "es": "¿Cómo devuelve el Worker de Rumbo un comprobante guardado?" },
          "options": [
            { "en": "It redirects to a public URL of the bucket", "es": "Redirige a una URL pública del bucket" },
            { "en": "It reads it into a string and returns it", "es": "Lo lee a un texto y lo devuelve" },
            { "en": "It passes the object body to the Response as a stream", "es": "Le pasa el cuerpo del objeto al Response como stream" }
          ],
          "correct": 2,
          "explanation": { "en": "No buffering: the bytes flow from R2 to the client.", "es": "Sin cargar todo: los bytes van de R2 al cliente." }
        }
      ],
      "source": "r2",
      "experiment": { "en": "Upload a proof, read it a thousand times and count what each operation costs.", "es": "Subí un comprobante, leelo mil veces y contá lo que cuesta cada operación." },
      "visor": { "en": "The proof shows R2 put, then R2 get; the proof that does not exist is an R2 get that finds nothing, and a 404.", "es": "El comprobante muestra R2 put y después R2 get; el que no existe es un R2 get que no encuentra nada, y un 404." },
      "lab": [
        {
          "title": { "en": "Upload a proof", "es": "Subí un comprobante" },
          "text": { "en": "proof put sends a PUT to /proofs/R-1043 with the text.", "es": "proof put manda un PUT a /proofs/R-1043 con el texto." },
          "command": "docker compose run --rm lab proof put R-1043 signed by Ana",
          "expected": { "en": "HTTP 201, stored: proofs/R-1043.txt, size: 13 and an etag.", "es": "HTTP 201, stored: proofs/R-1043.txt, size: 13 y un etag." },
          "checks": [{ "contains": "\"stored\": \"proofs/R-1043.txt\"" }]
        },
        {
          "title": { "en": "Read it through the edge", "es": "Leelo a través del borde" },
          "text": { "en": "proof get returns the object with its metadata.", "es": "proof get devuelve el objeto con sus metadatos." },
          "command": "docker compose run --rm lab proof get R-1043",
          "expected": { "en": "HTTP 200, the same etag, x-rumbo-via: edge, r2 and signed by Ana.", "es": "HTTP 200, el mismo etag, x-rumbo-via: edge, r2 y signed by Ana." },
          "checks": [{ "contains": "signed by Ana" }, { "contains": "x-rumbo-via: edge, r2" }]
        },
        {
          "title": { "en": "Read it with Wrangler", "es": "Leelo con Wrangler" },
          "text": { "en": "The same local bucket, without the Worker.", "es": "El mismo bucket local, sin el Worker." },
          "command": "docker compose exec edge npx wrangler r2 object get rumbo-proofs/proofs/R-1043.txt --local --pipe",
          "expected": { "en": "signed by Ana.", "es": "signed by Ana." },
          "checks": [{ "contains": "signed by Ana" }]
        },
        {
          "title": { "en": "A proof that does not exist", "es": "Un comprobante que no existe" },
          "text": { "en": "get returns null for a missing key, and the Worker answers 404.", "es": "get devuelve null para una clave que falta, y el Worker responde 404." },
          "command": "docker compose run --rm lab proof get R-1044",
          "expected": { "en": "HTTP 404 and no proof for this shipment.", "es": "HTTP 404 y no proof for this shipment." },
          "checks": [{ "contains": "HTTP 404" }]
        },
        {
          "title": { "en": "Read the operations", "es": "Leé las operaciones" },
          "text": { "en": "Each request did one R2 operation.", "es": "Cada pedido hizo una operación de R2." },
          "command": "docker compose exec edge lab spans 3",
          "expected": { "en": "PUT /proofs/R-1043 with R2 put, then GET /proofs/R-1043 and GET /proofs/R-1044 with R2 get each.", "es": "PUT /proofs/R-1043 con R2 put, después GET /proofs/R-1043 y GET /proofs/R-1044 con R2 get cada uno." },
          "checks": [{ "contains": "R2 put" }, { "contains": "R2 get" }]
        }
      ]
    },
    {
      "id": 19,
      "unit": 5,
      "slug": "durable-objects",
      "title": { "en": "Durable Objects: one place per thing", "es": "Durable Objects: un lugar por cosa" },
      "intro": { "en": "An object with an id, in one place, that handles its requests one at a time.", "es": "Un objeto con un id, en un lugar, que atiende sus pedidos de a uno." },
      "visual": "do",
      "frames": [
        {
          "title": { "en": "One object per id", "es": "Un objeto por id" },
          "text": { "en": "A Durable Object is a class you write; each instance has a unique id or name and lives in one place. Every request for that id, from any data center, reaches the same instance. It handles them one at a time, so code that reads, changes and writes its own state does not race with itself. In Rumbo there is one object per shipment, and one per counter.", "es": "Un Durable Object es una clase que escribís; cada instancia tiene un id o nombre único y vive en un lugar. Todo pedido para ese id, desde cualquier data center, llega a la misma instancia. Los atiende de a uno, así que el código que lee, cambia y escribe su propio estado no compite consigo mismo. En Rumbo hay un objeto por envío, y uno por contador." },
          "rule": { "en": "One id, one instance, one decision at a time.", "es": "Un id, una instancia, una decisión por vez." }
        },
        {
          "title": { "en": "Storage that is consistent", "es": "Almacenamiento consistente" },
          "text": { "en": "Each object has its own storage, strongly consistent: after a write, every later read of that object sees it. On the free plan only the SQLite backend is available, with 5 GB in total for the account. The same 50 increments that KV lost, the object keeps, because they arrive one after the other.", "es": "Cada objeto tiene su propio almacenamiento, fuertemente consistente: después de una escritura, toda lectura posterior de ese objeto la ve. En el plan gratuito solo está el backend de SQLite, con 5 GB en total para la cuenta. Los mismos 50 incrementos que KV perdió, el objeto los conserva, porque llegan uno después del otro." },
          "rule": { "en": "Coordination needs a single owner.", "es": "La coordinación necesita un solo dueño." }
        },
        {
          "title": { "en": "What it is not for", "es": "Para qué no sirve" },
          "text": { "en": "One object is one place: a soft limit of 1,000 requests per second each, and every caller waits its turn. For more load, split the state into more objects, one per shipment, per room, per user. Use them for coordination and per-entity state: counters, locks, live sessions, strict rate limits; not as one global table everyone writes to.", "es": "Un objeto es un lugar: un límite blando de 1.000 pedidos por segundo cada uno, y cada llamada espera su turno. Para más carga, dividí el estado en más objetos, uno por envío, por sala, por usuario. Usalos para coordinación y estado por entidad: contadores, locks, sesiones en vivo, rate limits estrictos; no como una tabla global en la que escriben todos." },
          "rule": { "en": "Many small objects scale; one big object queues.", "es": "Muchos objetos chicos escalan; un objeto grande hace cola." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Two requests for the same shipment arrive in Lima and Madrid. Which instance answers each?", "es": "Llegan dos pedidos para el mismo envío, en Lima y en Madrid. ¿Qué instancia atiende cada uno?" },
          "options": [
            { "en": "One instance in each city", "es": "Una instancia en cada ciudad" },
            { "en": "The same instance, wherever it lives", "es": "La misma instancia, viva donde viva" },
            { "en": "Whichever answers first", "es": "La que responda primero" }
          ],
          "correct": 1,
          "explanation": { "en": "One id, one object: both requests travel to it.", "es": "Un id, un objeto: los dos pedidos viajan hasta él." }
        },
        {
          "question": { "en": "Why did the object keep all 50 increments?", "es": "¿Por qué el objeto conservó los 50 incrementos?" },
          "options": [
            { "en": "Because it handles its calls one at a time", "es": "Porque atiende sus llamadas de a una" },
            { "en": "Because it retries lost writes", "es": "Porque reintenta las escrituras perdidas" },
            { "en": "Because it caches the counter", "es": "Porque guarda el contador en cache" }
          ],
          "correct": 0,
          "explanation": { "en": "Each read sees the previous write; nothing interleaves.", "es": "Cada lectura ve la escritura anterior; nada se intercala." }
        },
        {
          "question": { "en": "One object receives every request of the app and slows down. What is the fix?", "es": "Un objeto recibe todos los pedidos de la app y se pone lento. ¿Cuál es el arreglo?" },
          "options": [
            { "en": "Move it to KV", "es": "Pasarlo a KV" },
            { "en": "Raise its memory", "es": "Subirle la memoria" },
            { "en": "Split the state into one object per entity", "es": "Dividir el estado en un objeto por entidad" }
          ],
          "correct": 2,
          "explanation": { "en": "Each object is a queue of one; more objects, more queues.", "es": "Cada objeto es una cola de uno; más objetos, más colas." }
        }
      ],
      "source": "durableobjects",
      "experiment": { "en": "Send the same increments to KV and to one object, and compare the results.", "es": "Mandá los mismos incrementos a KV y a un objeto, y compará los resultados." },
      "visor": { "en": "lab race do is one request with fifty calls to the same Durable Object; the state of a shipment is one call to its object.", "es": "lab race do es un solo pedido con cincuenta llamadas al mismo Durable Object; el estado de un envío es una llamada a su objeto." },
      "lab": [
        {
          "title": { "en": "Fifty increments in one object", "es": "Cincuenta incrementos en un objeto" },
          "text": { "en": "/lab/race/do sends 50 increments in parallel to a new Counter object.", "es": "/lab/race/do manda 50 incrementos en paralelo a un objeto Counter nuevo." },
          "command": "docker compose run --rm lab race do",
          "expected": { "en": "increments: 50 and final: 50.", "es": "increments: 50 y final: 50." },
          "checks": [{ "contains": "\"final\": 50" }]
        },
        {
          "title": { "en": "The same race in KV", "es": "La misma carrera en KV" },
          "text": { "en": "The race of lesson 16, again, for the comparison.", "es": "La carrera de la lección 16, de nuevo, para comparar." },
          "command": "docker compose run --rm lab race kv",
          "expected": { "en": "final: 1, or far below 50.", "es": "final: 1, o muy por debajo de 50." },
          "checks": [{ "absent": "\"final\": 50" }]
        },
        {
          "title": { "en": "Two hundred increments", "es": "Doscientos incrementos" },
          "text": { "en": "More calls, same object, same answer.", "es": "Más llamadas, mismo objeto, misma respuesta." },
          "command": "docker compose run --rm lab race do 200",
          "expected": { "en": "increments: 200 and final: 200.", "es": "increments: 200 y final: 200." },
          "checks": [{ "contains": "\"final\": 200" }]
        },
        {
          "title": { "en": "The object of a shipment", "es": "El objeto de un envío" },
          "text": { "en": "/shipments/R-1043/state asks the Shipment object named R-1043 for its state.", "es": "/shipments/R-1043/state le pide su estado al objeto Shipment llamado R-1043." },
          "command": "docker compose run --rm lab get /shipments/R-1043/state",
          "expected": { "en": "An object that exists because it was asked for: shipment R-1043, status no movements yet, delayed false and watchers 0. Lesson 20 gives one of them movements.", "es": "Un objeto que existe porque se lo pidió: shipment R-1043, status no movements yet, delayed false y watchers 0. La lección 20 le da movimientos a uno de ellos." },
          "checks": [{ "contains": "\"shipment\": \"R-1043\"" }, { "contains": "\"watchers\": 0" }]
        },
        {
          "title": { "en": "The calls in the spans", "es": "Las llamadas en los spans" },
          "text": { "en": "Each call to an object is a span of the request.", "es": "Cada llamada a un objeto es un span del pedido." },
          "command": "docker compose exec edge lab spans 1",
          "expected": { "en": "GET /shipments/R-1043/state with one Durable Object call.", "es": "GET /shipments/R-1043/state con una llamada a Durable Object." },
          "checks": [{ "contains": "Durable Object" }]
        }
      ]
    },
    {
      "id": 20,
      "unit": 5,
      "slug": "do-alarms-websockets",
      "title": { "en": "Durable Objects over time", "es": "Durable Objects en el tiempo" },
      "intro": { "en": "An object that wakes itself up and keeps sockets open while it sleeps.", "es": "Un objeto que se despierta solo y mantiene sockets abiertos mientras duerme." },
      "visual": "live",
      "frames": [
        {
          "title": { "en": "An alarm per object", "es": "Una alarma por objeto" },
          "text": { "en": "A Durable Object can schedule one alarm at a time with setAlarm; a new call replaces the pending one, and deleteAlarm cancels it. When the time comes, its alarm handler runs, at least once, never twice at the same time. If it throws, it is retried with exponential backoff from 2 seconds, up to 6 times.", "es": "Un Durable Object puede programar una alarma por vez con setAlarm; una llamada nueva reemplaza a la pendiente, y deleteAlarm la cancela. Cuando llega la hora, corre su handler alarm, por lo menos una vez, nunca dos a la vez. Si tira un error, se reintenta con backoff exponencial desde 2 segundos, hasta 6 veces." },
          "rule": { "en": "An alarm is a promise to look again later.", "es": "Una alarma es una promesa de volver a mirar más tarde." }
        },
        {
          "title": { "en": "Sockets that outlive the object in memory", "es": "Sockets que viven más que el objeto en memoria" },
          "text": { "en": "With the WebSocket Hibernation API, the object accepts sockets with ctx.acceptWebSocket. When it is idle it is evicted from memory while the clients stay connected to the Cloudflare network; a message wakes it in webSocketMessage. Billable duration does not accrue while it hibernates. The standard WebSocket API prevents hibernation.", "es": "Con la WebSocket Hibernation API, el objeto acepta sockets con ctx.acceptWebSocket. Cuando está inactivo se lo saca de memoria mientras los clientes siguen conectados a la red de Cloudflare; un mensaje lo despierta en webSocketMessage. La duración facturable no se acumula mientras hiberna. La API estándar de WebSocket impide la hibernación." },
          "rule": { "en": "Hibernate between messages; pay for the work, not the wait.", "es": "Hiberná entre mensajes; pagá el trabajo, no la espera." }
        },
        {
          "title": { "en": "A live shipment", "es": "Un envío en vivo" },
          "text": { "en": "In Rumbo each shipment object holds the live status, pushes every change to the browsers watching it and sets an alarm: if no movement arrives in 8 seconds, it marks itself delayed and tells them. A final status, delivered or returned, cancels the alarm. In production the wait would be hours; in the kit it is seconds so the lab can see it.", "es": "En Rumbo cada objeto de envío tiene el estado en vivo, le manda cada cambio a los navegadores que lo miran y programa una alarma: si no llega un movimiento en 8 segundos, se marca demorado y les avisa. Un estado final, delivered o returned, cancela la alarma. En producción la espera sería de horas; en el kit son segundos para que el lab lo vea." },
          "rule": { "en": "Let the object notice the silence.", "es": "Dejá que el objeto note el silencio." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "A shipment object calls setAlarm twice. How many alarms are pending?", "es": "Un objeto de envío llama dos veces a setAlarm. ¿Cuántas alarmas quedan pendientes?" },
          "options": [
            { "en": "Two, in the order they were set", "es": "Dos, en el orden en que se programaron" },
            { "en": "None, the second cancels both", "es": "Ninguna, la segunda cancela las dos" },
            { "en": "One: the second replaces the first", "es": "Una: la segunda reemplaza a la primera" }
          ],
          "correct": 2,
          "explanation": { "en": "One alarm per object at a time.", "es": "Una alarma por objeto por vez." }
        },
        {
          "question": { "en": "What keeps the clients connected while the object hibernates?", "es": "¿Qué mantiene conectados a los clientes mientras el objeto hiberna?" },
          "options": [
            { "en": "A loop that pings every second", "es": "Un loop que hace ping cada segundo" },
            { "en": "The alarm of the object", "es": "La alarma del objeto" },
            { "en": "The Cloudflare network, holding the sockets", "es": "La red de Cloudflare, que sostiene los sockets" }
          ],
          "correct": 2,
          "explanation": { "en": "The object leaves memory; the sockets do not close.", "es": "El objeto sale de memoria; los sockets no se cierran." }
        },
        {
          "question": { "en": "Why does delivered cancel the alarm?", "es": "¿Por qué delivered cancela la alarma?" },
          "options": [
            { "en": "Because alarms cannot run after a write", "es": "Porque las alarmas no pueden correr después de una escritura" },
            { "en": "Because after a final status no more movements are expected", "es": "Porque después de un estado final no se esperan más movimientos" },
            { "en": "Because the free plan allows one alarm per day", "es": "Porque el plan gratuito permite una alarma por día" }
          ],
          "correct": 1,
          "explanation": { "en": "A delivered shipment cannot be late.", "es": "Un envío entregado no puede estar demorado." }
        }
      ],
      "source": "doalarms",
      "experiment": { "en": "Report a movement and then nothing: watch the alarm fire and the watchers learn it.", "es": "Reportá un movimiento y después nada: mirá cómo salta la alarma y se enteran los que miran." },
      "visor": { "en": "The movement that lab live reports goes through the queue to the object, and the alarm of the object shows on its own about eight seconds later, with no request in front. The WebSocket request appears when it closes.", "es": "El movimiento que avisa lab live pasa por la cola hasta el objeto, y la alarma del objeto aparece sola unos ocho segundos después, sin un pedido delante. El pedido del WebSocket aparece cuando se cierra." },
      "lab": [
        {
          "title": { "en": "Watch a shipment live", "es": "Mirá un envío en vivo" },
          "text": { "en": "live opens a WebSocket to the object of R-1044, reports one movement half a second later and waits for the alarm.", "es": "live abre un WebSocket al objeto de R-1044, reporta un movimiento medio segundo después y espera la alarma." },
          "command": "docker compose run --rm lab live R-1044",
          "expected": { "en": "snapshot with no movements yet and watchers 1; update with out for delivery about two seconds later, when the queue delivered it; update with delayed true eight seconds after that, sent by the alarm.", "es": "snapshot con no movements yet y watchers 1; update con out for delivery unos dos segundos después, cuando lo entregó la cola; update con delayed true ocho segundos después, mandado por la alarma." },
          "checks": [{ "contains": "delayed true" }]
        },
        {
          "title": { "en": "The state after the socket closed", "es": "El estado después de cerrar el socket" },
          "text": { "en": "The object kept the state in its storage.", "es": "El objeto guardó el estado en su almacenamiento." },
          "command": "docker compose run --rm lab get /shipments/R-1044/state",
          "expected": { "en": "out for delivery, delayed true and watchers 0.", "es": "out for delivery, delayed true y watchers 0." },
          "checks": [{ "contains": "\"delayed\": true" }, { "contains": "\"watchers\": 0" }]
        },
        {
          "title": { "en": "The carrier delivers it", "es": "El transportista lo entrega" },
          "text": { "en": "webhook queues a movement and waits for the consumer, lesson 22.", "es": "webhook encola un movimiento y espera al consumidor, lección 22." },
          "command": "docker compose run --rm lab webhook w-1 R-1044 delivered",
          "expected": { "en": "HTTP 202, attempts: 1 and saved at the origin.", "es": "HTTP 202, attempts: 1 y saved at the origin." },
          "checks": [{ "contains": "saved at the origin" }]
        },
        {
          "title": { "en": "No alarm after a final status", "es": "Sin alarma después de un estado final" },
          "text": { "en": "delivered cleared delayed and cancelled the alarm.", "es": "delivered limpió delayed y canceló la alarma." },
          "command": "docker compose run --rm lab get /shipments/R-1044/state",
          "expected": { "en": "delivered and delayed false; it stays like that.", "es": "delivered y delayed false; queda así." },
          "checks": [{ "contains": "\"status\": \"delivered\"" }, { "contains": "\"delayed\": false" }]
        },
        {
          "title": { "en": "Find the alarm in the spans", "es": "Encontrá la alarma en los spans" },
          "text": { "en": "An alarm is an invocation of its own, with no request behind it.", "es": "Una alarma es una invocación propia, sin un pedido detrás." },
          "command": "docker compose exec edge lab spans 8",
          "expected": { "en": "Among them, Durable Object alarm, and queue consumer of movements for each movement.", "es": "Entre ellos, Durable Object alarm, y queue consumer of movements por cada movimiento." },
          "checks": [{ "contains": "Durable Object alarm" }]
        }
      ]
    },
    {
      "id": 21,
      "unit": 5,
      "slug": "hyperdrive",
      "title": { "en": "Hyperdrive: your Postgres from the edge", "es": "Hyperdrive: tu Postgres desde el borde" },
      "intro": { "en": "A pool of connections near your database and a cache of read queries, behind a connection string.", "es": "Un pool de conexiones cerca de tu base y una cache de consultas de lectura, detrás de un connection string." },
      "visual": "hyperdrive",
      "frames": [
        {
          "title": { "en": "A connection string that goes through Cloudflare", "es": "Un connection string que pasa por Cloudflare" },
          "text": { "en": "Hyperdrive sits between Workers and a PostgreSQL or MySQL database you already run. The Worker uses an ordinary driver, postgres.js in Rumbo, with env.PG.connectionString. The connection setup happens at the edge, close to the Worker, and the pool of database connections lives in the regions closest to your database. The free plan gives 100,000 queries per day.", "es": "Hyperdrive se pone entre Workers y una base PostgreSQL o MySQL que ya tenés. El Worker usa un driver común, postgres.js en Rumbo, con env.PG.connectionString. El armado de la conexión pasa en el borde, cerca del Worker, y el pool de conexiones a la base vive en las regiones más cercanas a tu base. El plan gratuito da 100.000 consultas por día." },
          "rule": { "en": "Many Workers, few connections to your database.", "es": "Muchos Workers, pocas conexiones a tu base." }
        },
        {
          "title": { "en": "Cached reads, and what they cost", "es": "Lecturas en cache, y lo que cuestan" },
          "text": { "en": "Hyperdrive caches the results of read queries for a configured max_age. It does not invalidate them when your application writes, so a read right after a write can return the old row. It does not move or replicate your data: every query that is not cached reaches your server.", "es": "Hyperdrive guarda en cache los resultados de consultas de lectura por un max_age configurado. No los invalida cuando tu aplicación escribe, así que una lectura justo después de una escritura puede devolver la fila vieja. No mueve ni replica tus datos: toda consulta que no está en cache llega a tu servidor." },
          "rule": { "en": "A cached query is a promise to accept old data.", "es": "Una consulta en cache es una promesa de aceptar datos viejos." }
        },
        {
          "title": { "en": "In the kit, and for a private database", "es": "En el kit, y para una base privada" },
          "text": { "en": "Locally there is no pool and no cache: Hyperdrive connects straight to the database with localConnectionString, or the variable CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_<BINDING>. What the kit shows is the path, not the speed. A database without a public address is reached through a Tunnel; the documentation now recommends Workers VPC, in beta.", "es": "En local no hay pool ni cache: Hyperdrive se conecta directo a la base con localConnectionString, o con la variable CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_<BINDING>. Lo que muestra el kit es el camino, no la velocidad. A una base sin dirección pública se llega por un Tunnel; la documentación ahora recomienda Workers VPC, en beta." },
          "rule": { "en": "The kit proves the code path; the account proves the speed.", "es": "El kit prueba el camino del código; la cuenta prueba la velocidad." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Where does the pool of database connections of Hyperdrive live?", "es": "¿Dónde vive el pool de conexiones a la base de Hyperdrive?" },
          "options": [
            { "en": "In every data center that runs your Worker", "es": "En cada data center que corre tu Worker" },
            { "en": "Inside your database server", "es": "Dentro de tu servidor de base de datos" },
            { "en": "In the regions closest to your database", "es": "En las regiones más cercanas a tu base" }
          ],
          "correct": 2,
          "explanation": { "en": "The connection setup happens near the Worker; the pool near the database.", "es": "El armado de la conexión pasa cerca del Worker; el pool, cerca de la base." }
        },
        {
          "question": { "en": "The panel updates a shipment and the next read through Hyperdrive shows the old status. Why?", "es": "El panel actualiza un envío y la lectura siguiente por Hyperdrive muestra el estado viejo. ¿Por qué?" },
          "options": [
            { "en": "Hyperdrive does not invalidate cached reads on writes", "es": "Hyperdrive no invalida las lecturas en cache cuando hay escrituras" },
            { "en": "The write went to a replica", "es": "La escritura fue a una réplica" },
            { "en": "PostgreSQL delays its writes", "es": "PostgreSQL demora sus escrituras" }
          ],
          "correct": 0,
          "explanation": { "en": "Until max_age passes, the cached result stays.", "es": "Hasta que pasa el max_age, el resultado en cache queda." }
        },
        {
          "question": { "en": "What does the kit not show about Hyperdrive?", "es": "¿Qué no muestra el kit de Hyperdrive?" },
          "options": [
            { "en": "The binding and its connection string", "es": "El binding y su connection string" },
            { "en": "The pool and the cache", "es": "El pool y la cache" },
            { "en": "A query reaching PostgreSQL", "es": "Una consulta que llega a PostgreSQL" }
          ],
          "correct": 1,
          "explanation": { "en": "Locally it connects directly: the path is real, the acceleration is not there.", "es": "En local se conecta directo: el camino es real, la aceleración no está." }
        }
      ],
      "source": "hyperdrive",
      "experiment": { "en": "Ask for the same shipment twice through Hyperdrive, with and without its cache.", "es": "Pedí el mismo envío dos veces por Hyperdrive, con y sin su cache." },
      "visor": { "en": "/direct/shipments/R-1044 lights Hyperdrive and PostgreSQL; /api/shipments/R-1044 reaches the same data through the API of Rumbo.", "es": "/direct/shipments/R-1044 enciende Hyperdrive y PostgreSQL; /api/shipments/R-1044 llega a los mismos datos por la API de Rumbo." },
      "lab": [
        {
          "title": { "en": "Read a shipment through Hyperdrive", "es": "Leé un envío por Hyperdrive" },
          "text": { "en": "/direct/shipments/R-1044 queries PostgreSQL from the Worker, without the origin.", "es": "/direct/shipments/R-1044 consulta PostgreSQL desde el Worker, sin el origen." },
          "command": "docker compose run --rm lab get /direct/shipments/R-1044",
          "expected": { "en": "x-rumbo-via: edge, hyperdrive and the row of R-1044, without servedBy: Spring Boot was not involved.", "es": "x-rumbo-via: edge, hyperdrive y la fila de R-1044, sin servedBy: Spring Boot no participó." },
          "checks": [{ "contains": "x-rumbo-via: edge, hyperdrive" }]
        },
        {
          "title": { "en": "The same shipment through the origin", "es": "El mismo envío por el origen" },
          "text": { "en": "The usual path: the gateway and Spring Boot.", "es": "El camino de siempre: el gateway y Spring Boot." },
          "command": "docker compose run --rm lab get /api/shipments/R-1044",
          "expected": { "en": "The same status, with servedBy: rumbo-origin.", "es": "El mismo estado, con servedBy: rumbo-origin." },
          "checks": [{ "contains": "\"servedBy\": \"rumbo-origin\"" }]
        },
        {
          "title": { "en": "Compare the two in the spans", "es": "Compará los dos en los spans" },
          "text": { "en": "One went to the database, the other to the API.", "es": "Uno fue a la base, el otro a la API." },
          "command": "docker compose exec edge lab spans 2",
          "expected": { "en": "GET /direct/shipments/R-1044 with Hyperdrive; GET /api/shipments/R-1044 with fetch origin:8080.", "es": "GET /direct/shipments/R-1044 con Hyperdrive; GET /api/shipments/R-1044 con fetch origin:8080." },
          "checks": [{ "contains": "Hyperdrive" }, { "contains": "fetch origin:8080/api/shipments/R-1044" }]
        },
        {
          "title": { "en": "Read the binding", "es": "Leé el binding" },
          "text": { "en": "The configuration says where to connect locally.", "es": "La configuración dice adónde conectarse en local." },
          "command": "docker compose exec edge grep -n \"localConnectionString\" wrangler.jsonc",
          "expected": { "en": "localConnectionString postgres://rumbo:rumbo@db:5432/rumbo: the database of the kit, inside the Compose network.", "es": "localConnectionString postgres://rumbo:rumbo@db:5432/rumbo: la base del kit, dentro de la red de Compose." },
          "checks": [{ "contains": "postgres://rumbo:rumbo@db:5432/rumbo" }]
        },
        {
          "title": { "en": "Ask PostgreSQL itself", "es": "Preguntale a PostgreSQL" },
          "text": { "en": "psql runs inside the db container.", "es": "psql corre dentro del contenedor db." },
          "command": "docker compose exec db psql -U rumbo -d rumbo -c \"SELECT id, status FROM shipments ORDER BY id\"",
          "expected": { "en": "Three rows; R-1044 delivered, from lesson 20.", "es": "Tres filas; R-1044 delivered, de la lección 20." },
          "checks": [{ "contains": "R-1044" }, { "contains": "(3 rows)" }]
        }
      ]
    },
    {
      "id": 22,
      "unit": 6,
      "slug": "queues",
      "title": { "en": "Queues: at least once", "es": "Queues: al menos una vez" },
      "intro": { "en": "Answer the carrier at once and do the work later, ready for a message that comes twice.", "es": "Respondele al transportista enseguida y hacé el trabajo después, preparado para un mensaje que llega dos veces." },
      "visual": "queue",
      "frames": [
        {
          "title": { "en": "Producer, queue, consumer", "es": "Productor, cola, consumidor" },
          "text": { "en": "A Worker sends a message to a queue through its binding and answers right away; a consumer Worker receives the messages in batches, by default up to 10 messages or 5 seconds, whichever comes first, with maximums of 100 and 60 seconds. Each message can be acknowledged with ack or sent back with retry, on its own, and carries attempts, the number of deliveries so far. The free plan includes 10,000 operations per day, with messages kept 24 hours.", "es": "Un Worker manda un mensaje a una cola por su binding y responde enseguida; un Worker consumidor recibe los mensajes en lotes, por defecto hasta 10 mensajes o 5 segundos, lo que llegue primero, con máximos de 100 y 60 segundos. Cada mensaje se puede confirmar con ack o devolver con retry, por separado, y trae attempts, la cantidad de entregas hasta ahora. El plan gratuito incluye 10.000 operaciones por día, con mensajes guardados 24 horas." },
          "rule": { "en": "Answer now; work later; acknowledge each message.", "es": "Respondé ahora; trabajá después; confirmá cada mensaje." }
        },
        {
          "title": { "en": "At least once", "es": "Al menos una vez" },
          "text": { "en": "Queues delivers each message at least once and, on rare occasions, more than once. The consumer must therefore be idempotent: the same message twice must leave the same result as once. The documentation suggests a unique id per message used as a primary key or as an idempotency key; in Rumbo, the event id of the carrier is the primary key of the movements table at the origin.", "es": "Queues entrega cada mensaje por lo menos una vez y, en raras ocasiones, más de una. Por eso el consumidor tiene que ser idempotente: el mismo mensaje dos veces tiene que dejar el mismo resultado que una. La documentación sugiere un id único por mensaje usado como clave primaria o como clave de idempotencia; en Rumbo, el id de evento del transportista es la clave primaria de la tabla de movimientos en el origen." },
          "rule": { "en": "Expect every message twice; store it once.", "es": "Esperá cada mensaje dos veces; guardalo una." }
        },
        {
          "title": { "en": "Retries and the dead letter queue", "es": "Reintentos y la cola de mensajes muertos" },
          "text": { "en": "A message that is retried comes back in a later batch, up to max_retries, 3 by default; then it is deleted, or written to a dead letter queue if one is configured. A message can be delayed up to 24 hours. The kit uses max_retries 2 and a batch timeout of 2 seconds so the lab sees it in seconds: a status the origin rejects is tried three times and ends in movements-dead.", "es": "Un mensaje que se reintenta vuelve en un lote posterior, hasta max_retries, 3 por defecto; después se borra, o se escribe en una cola de mensajes muertos si hay una configurada. Un mensaje se puede demorar hasta 24 horas. El kit usa max_retries 2 y un timeout de lote de 2 segundos para que el lab lo vea en segundos: un estado que el origen rechaza se intenta tres veces y termina en movements-dead." },
          "rule": { "en": "A dead letter queue is where you look, not where you forget.", "es": "La cola de mensajes muertos es donde mirás, no donde te olvidás." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "What does at least once mean for the consumer?", "es": "¿Qué quiere decir al menos una vez para el consumidor?" },
          "options": [
            { "en": "It must handle the same message twice without harm", "es": "Tiene que soportar el mismo mensaje dos veces sin daño" },
            { "en": "It will never see a message twice", "es": "Nunca va a ver un mensaje dos veces" },
            { "en": "It must acknowledge each message at least once", "es": "Tiene que confirmar cada mensaje por lo menos una vez" }
          ],
          "correct": 0,
          "explanation": { "en": "Rare, but possible: make the effect idempotent.", "es": "Raro, pero posible: hacé idempotente el efecto." }
        },
        {
          "question": { "en": "The same event arrived twice and the origin has one movement. What made it so?", "es": "El mismo evento llegó dos veces y el origen tiene un movimiento. ¿Qué lo logró?" },
          "options": [
            { "en": "The queue noticed the duplicate", "es": "La cola notó el duplicado" },
            { "en": "The event id is the primary key at the origin", "es": "El id del evento es la clave primaria en el origen" },
            { "en": "The batch merged both messages", "es": "El lote juntó los dos mensajes" }
          ],
          "correct": 1,
          "explanation": { "en": "INSERT ... ON CONFLICT DO NOTHING: the second insert changes nothing.", "es": "INSERT ... ON CONFLICT DO NOTHING: el segundo insert no cambia nada." }
        },
        {
          "question": { "en": "With max_retries 2, how many times is a failing message tried?", "es": "Con max_retries 2, ¿cuántas veces se intenta un mensaje que falla?" },
          "options": [
            { "en": "Two", "es": "Dos" },
            { "en": "Three: the first delivery and two retries", "es": "Tres: la primera entrega y dos reintentos" },
            { "en": "Until it succeeds", "es": "Hasta que salga bien" }
          ],
          "correct": 1,
          "explanation": { "en": "Then it goes to the dead letter queue, or is deleted without one.", "es": "Después va a la cola de mensajes muertos, o se borra si no hay una." }
        }
      ],
      "source": "queues",
      "experiment": { "en": "Send a good movement, a duplicate and a bad one, and follow each through the retries.", "es": "Mandá un movimiento bueno, un duplicado y uno malo, y seguí cada uno por los reintentos." },
      "visor": { "en": "Each webhook is two events: the POST that answers 202 after queue send, and the consumer that calls the origin. m-2 shows three consumer events, one per attempt, and then the consumer of movements-dead.", "es": "Cada webhook son dos eventos: el POST que responde 202 después de queue send, y el consumidor que llama al origen. m-2 muestra tres eventos del consumidor, uno por intento, y después el consumidor de movements-dead." },
      "lab": [
        {
          "title": { "en": "A carrier reports a movement", "es": "Un transportista reporta un movimiento" },
          "text": { "en": "webhook posts the movement, prints the 202 of the webhook and then waits for the last word of the consumer on that event.", "es": "webhook manda el movimiento, imprime el 202 del webhook y después espera la última palabra del consumidor sobre ese evento." },
          "command": "docker compose run --rm lab webhook m-1 R-1042 delivered",
          "expected": { "en": "HTTP 202, attempts: 1, saved at the origin, no dead letter queue and 1 movement of R-1042 at the origin.", "es": "HTTP 202, attempts: 1, saved at the origin, sin cola de mensajes muertos y 1 movimiento de R-1042 en el origen." },
          "checks": [{ "contains": "outcome: saved at the origin" }]
        },
        {
          "title": { "en": "The same event again", "es": "El mismo evento de nuevo" },
          "text": { "en": "A carrier that sends the same event twice, as a retry of its own would.", "es": "Un transportista que manda el mismo evento dos veces, como haría un reintento propio." },
          "command": "docker compose run --rm lab webhook m-1 R-1042 delivered",
          "expected": { "en": "already saved: not saved again, and still 1 movement of R-1042.", "es": "already saved: not saved again, y sigue 1 movimiento de R-1042." },
          "checks": [{ "contains": "already saved" }, { "contains": "movements of R-1042 at the origin: 1" }]
        },
        {
          "title": { "en": "A status the origin rejects", "es": "Un estado que el origen rechaza" },
          "text": { "en": "lost in space is not a status the origin knows: it answers 422 and the consumer calls retry.", "es": "lost in space no es un estado que conozca el origen: responde 422 y el consumidor llama a retry." },
          "command": "docker compose run --rm lab webhook m-2 R-1042 lost in space",
          "expected": { "en": "attempts: 3, rejected by the origin (422) and dead letter queue: yes, after about eight seconds.", "es": "attempts: 3, rejected by the origin (422) y dead letter queue: yes, después de unos ocho segundos." },
          "checks": [{ "contains": "attempts: 3" }, { "contains": "dead letter queue: yes" }]
        },
        {
          "title": { "en": "Read the dead letter queue", "es": "Leé la cola de mensajes muertos" },
          "text": { "en": "The consumer of movements-dead keeps each message in KV, so you can see it.", "es": "El consumidor de movements-dead guarda cada mensaje en KV, para que lo puedas ver." },
          "command": "docker compose run --rm lab dead",
          "expected": { "en": "m-2 with its shipment, its status, 3 attempts and the outcome.", "es": "m-2 con su envío, su estado, 3 intentos y el resultado." },
          "checks": [{ "contains": "\"event\": \"m-2\"" }]
        },
        {
          "title": { "en": "Ask the origin", "es": "Preguntale al origen" },
          "text": { "en": "movements reads the table of the origin directly.", "es": "movements lee la tabla del origen directamente." },
          "command": "docker compose run --rm lab movements R-1042",
          "expected": { "en": "count: 1, the movement m-1: neither the duplicate nor the rejected one were stored.", "es": "count: 1, el movimiento m-1: ni el duplicado ni el rechazado se guardaron." },
          "checks": [{ "contains": "\"count\": 1" }]
        },
        {
          "title": { "en": "Read the configuration", "es": "Leé la configuración" },
          "text": { "en": "The producer and the two consumers are declared in wrangler.jsonc.", "es": "El productor y los dos consumidores están declarados en wrangler.jsonc." },
          "command": "docker compose exec edge grep -n \"movements\" wrangler.jsonc",
          "expected": { "en": "The producer MOVES, the consumer of movements with max_batch_size 10, max_batch_timeout 2, max_retries 2 and dead_letter_queue movements-dead, and the consumer of movements-dead.", "es": "El productor MOVES, el consumidor de movements con max_batch_size 10, max_batch_timeout 2, max_retries 2 y dead_letter_queue movements-dead, y el consumidor de movements-dead." },
          "checks": [{ "contains": "\"dead_letter_queue\": \"movements-dead\"" }]
        }
      ]
    },
    {
      "id": 23,
      "unit": 6,
      "slug": "workflows",
      "title": { "en": "Workflows: steps that survive", "es": "Workflows: pasos que sobreviven" },
      "intro": { "en": "A process of many steps, each retried on its own, that can wait days for a person.", "es": "Un proceso de muchos pasos, cada uno reintentado por su cuenta, que puede esperar días a una persona." },
      "visual": "workflow",
      "frames": [
        {
          "title": { "en": "Steps with memory", "es": "Pasos con memoria" },
          "text": { "en": "A Workflow is a class with a run method that receives an event and a step object. Each step.do is a unit of work: its result is stored, so when the workflow resumes after a failure or a wait, finished steps are not run again. A failing step is retried on its own, by default up to 5 times, with a delay that starts at 10 seconds and grows exponentially, each try with a timeout of 10 minutes; NonRetryableError stops it.", "es": "Un Workflow es una clase con un método run que recibe un evento y un objeto step. Cada step.do es una unidad de trabajo: su resultado se guarda, así que cuando el workflow sigue después de una falla o una espera, los pasos terminados no corren de nuevo. Un paso que falla se reintenta por su cuenta, por defecto hasta 5 veces, con una espera que arranca en 10 segundos y crece de forma exponencial, cada intento con un timeout de 10 minutos; NonRetryableError lo corta." },
          "rule": { "en": "Retry the step, not the process.", "es": "Reintentá el paso, no el proceso." }
        },
        {
          "title": { "en": "Waiting is a step", "es": "Esperar es un paso" },
          "text": { "en": "step.sleep and step.sleepUntil wait a time or until a date; step.waitForEvent waits for an event of a type, with a timeout, sent from outside with instance.sendEvent. While a workflow waits nothing runs and nothing is lost. In Rumbo, a return is registered, waits for the approval of a person, then refunds and notifies; the refund fails on purpose the first time.", "es": "step.sleep y step.sleepUntil esperan un tiempo o hasta una fecha; step.waitForEvent espera un evento de un tipo, con timeout, que se manda desde afuera con instance.sendEvent. Mientras un workflow espera no corre nada y no se pierde nada. En Rumbo, una devolución se registra, espera la aprobación de una persona, después reintegra y avisa; el reintegro falla a propósito la primera vez." },
          "rule": { "en": "Let the platform hold the wait.", "es": "Dejá que la plataforma sostenga la espera." }
        },
        {
          "title": { "en": "Instances and limits", "es": "Instancias y límites" },
          "text": { "en": "Each run is an instance with an id; creating one with an id that exists is refused, which makes a duplicate request harmless. The free plan shares the 100,000 daily requests of Workers and adds 3,000 steps per day and 1 GB-month of storage. Locally the status of an instance that waits for an event shows running.", "es": "Cada corrida es una instancia con un id; crear una con un id que ya existe se rechaza, lo que vuelve inofensivo un pedido duplicado. El plan gratuito comparte los 100.000 pedidos diarios de Workers y agrega 3.000 pasos por día y 1 GB-mes de almacenamiento. En local, el estado de una instancia que espera un evento se ve como running." },
          "rule": { "en": "An id per process makes starting it idempotent.", "es": "Un id por proceso vuelve idempotente el arranque." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "The refund step failed on its first try. What runs again?", "es": "El paso de reintegro falló en su primer intento. ¿Qué corre de nuevo?" },
          "options": [
            { "en": "The whole workflow from the start", "es": "Todo el workflow desde el principio" },
            { "en": "The refund step and the registration before it", "es": "El reintegro y el registro anterior" },
            { "en": "Only the refund step", "es": "Solo el paso de reintegro" }
          ],
          "correct": 2,
          "explanation": { "en": "The registration is stored; only the failing step is retried.", "es": "El registro quedó guardado; solo se reintenta el paso que falla." }
        },
        {
          "question": { "en": "How does the approval reach a waiting workflow?", "es": "¿Cómo le llega la aprobación a un workflow que espera?" },
          "options": [
            { "en": "The workflow polls a KV key every minute", "es": "El workflow consulta una clave de KV cada minuto" },
            { "en": "An event sent to the instance with sendEvent", "es": "Un evento que se le manda a la instancia con sendEvent" },
            { "en": "A cron trigger restarts it", "es": "Un cron trigger lo reinicia" }
          ],
          "correct": 1,
          "explanation": { "en": "waitForEvent returns the payload of that event.", "es": "waitForEvent devuelve el payload de ese evento." }
        },
        {
          "question": { "en": "What happens if you start r-1 again?", "es": "¿Qué pasa si arrancás r-1 de nuevo?" },
          "options": [
            { "en": "It is refused: an instance with that id exists", "es": "Se rechaza: ya existe una instancia con ese id" },
            { "en": "A second instance r-1 runs in parallel", "es": "Corre una segunda instancia r-1 en paralelo" },
            { "en": "The first instance restarts", "es": "La primera instancia vuelve a arrancar" }
          ],
          "correct": 0,
          "explanation": { "en": "The id makes a repeated start harmless.", "es": "El id vuelve inofensivo un arranque repetido." }
        }
      ],
      "source": "workflows",
      "experiment": { "en": "Start a return, make the refund fail and approve it later: see which steps run again.", "es": "Arrancá una devolución, hacé fallar el reintegro y aprobala después: mirá qué pasos corren de nuevo." },
      "visor": { "en": "The requests that start, ask for and approve the return light the Workflow. Its steps run inside the engine of Workflows, which the viewer draws as one piece.", "es": "Los pedidos que inician, consultan y aprueban la devolución encienden el Workflow. Sus pasos corren dentro del motor de Workflows, que el visor dibuja como una sola pieza." },
      "lab": [
        {
          "title": { "en": "Start a return", "es": "Arrancá una devolución" },
          "text": { "en": "return start creates the instance r-1 of the workflow returns for R-1043 and reads its status a moment later.", "es": "return start crea la instancia r-1 del workflow returns para R-1043 y lee su estado un momento después." },
          "command": "docker compose run --rm lab return start r-1 R-1043",
          "expected": { "en": "status: running and output: null: registered, now waiting for approval.", "es": "status: running y output: null: registrada, ahora esperando la aprobación." },
          "checks": [{ "contains": "\"status\": \"running\"" }]
        },
        {
          "title": { "en": "It is still waiting", "es": "Sigue esperando" },
          "text": { "en": "Nothing runs while it waits.", "es": "No corre nada mientras espera." },
          "command": "docker compose run --rm lab return status r-1",
          "expected": { "en": "The same: running, output null.", "es": "Lo mismo: running, output null." },
          "checks": [{ "contains": "\"output\": null" }]
        },
        {
          "title": { "en": "Approve it", "es": "Aprobala" },
          "text": { "en": "return approve sends the event approved with the name of the approver, and waits until the instance finishes.", "es": "return approve manda el evento approved con el nombre de quien aprueba, y espera a que la instancia termine." },
          "command": "docker compose run --rm lab return approve r-1 ana",
          "expected": { "en": "complete, with registered, refund with attempts: 2, the first one failed on purpose, by: ana, and notified.", "es": "complete, con registered, refund con attempts: 2, el primero falló a propósito, by: ana, y notified." },
          "checks": [{ "contains": "\"status\": \"complete\"" }, { "contains": "\"attempts\": 2" }]
        },
        {
          "title": { "en": "Start the same return again", "es": "Arrancá la misma devolución de nuevo" },
          "text": { "en": "Same id, as a duplicate request would do.", "es": "El mismo id, como haría un pedido duplicado." },
          "command": "docker compose run --rm lab return start r-1 R-1043",
          "expected": { "en": "could not start return r-1: instance.already_exists, and exit code 1.", "es": "could not start return r-1: instance.already_exists, y código de salida 1." },
          "checks": [{ "contains": "already_exists" }],
          "exit": 1
        }
      ]
    },
    {
      "id": 24,
      "unit": 6,
      "slug": "cron-and-events",
      "title": { "en": "Cron and platform events", "es": "Cron y eventos de la plataforma" },
      "intro": { "en": "Work that starts at a time, or when the platform says something changed.", "es": "Trabajo que arranca a una hora, o cuando la plataforma dice que algo cambió." },
      "visual": "cron",
      "frames": [
        {
          "title": { "en": "Cron Triggers", "es": "Cron Triggers" },
          "text": { "en": "A Cron Trigger runs the scheduled handler of a Worker on a cron expression, in UTC, declared in triggers.crons of the configuration. The free plan allows 5 Cron Triggers per account, the paid plan 250. After a change, the new schedule can take up to 15 minutes to reach the whole network, and runs can be missed until then. In Rumbo, 0 3 * * * computes the daily close: shipments by status, stored in KV.", "es": "Un Cron Trigger corre el handler scheduled de un Worker según una expresión cron, en UTC, declarada en triggers.crons de la configuración. El plan gratuito permite 5 Cron Triggers por cuenta, el pago 250. Después de un cambio, el horario nuevo puede tardar hasta 15 minutos en llegar a toda la red, y hasta entonces se pueden perder corridas. En Rumbo, 0 3 * * * calcula el cierre diario: envíos por estado, guardado en KV." },
          "rule": { "en": "Cron runs in UTC: write the time down in UTC.", "es": "Cron corre en UTC: anotá la hora en UTC." }
        },
        {
          "title": { "en": "Running it locally", "es": "Correrlo en local" },
          "text": { "en": "wrangler dev does not fire Cron Triggers by itself. It offers two ways to run the handler: the Local Explorer, with a POST to /cdn-cgi/local/explorer/api/local/scheduled?worker=<name>, and a request to /cdn-cgi/local/scheduled, with optional cron and time. Both answer only on the address of the edge itself, which is why the lab runs them inside it.", "es": "wrangler dev no dispara los Cron Triggers solo. Ofrece dos formas de correr el handler: el Local Explorer, con un POST a /cdn-cgi/local/explorer/api/local/scheduled?worker=<nombre>, y un pedido a /cdn-cgi/local/scheduled, con cron y time opcionales. Las dos responden solo en la dirección del propio borde, por eso el lab las corre adentro." },
          "rule": { "en": "Test the scheduled handler on demand.", "es": "Probá el handler scheduled a pedido." }
        },
        {
          "title": { "en": "Events from the platform", "es": "Eventos de la plataforma" },
          "text": { "en": "Some changes are announced by Cloudflare itself. R2 event notifications send a message to a queue when objects are created or deleted in a bucket; they are configured on the account with wrangler r2 bucket notification, not in wrangler.jsonc, and the kit does not simulate them. A consumer then reacts as in lesson 22, at least once.", "es": "Algunos cambios los anuncia Cloudflare. Las notificaciones de eventos de R2 mandan un mensaje a una cola cuando se crean o borran objetos en un bucket; se configuran en la cuenta con wrangler r2 bucket notification, no en wrangler.jsonc, y el kit no las simula. Después un consumidor reacciona como en la lección 22, al menos una vez." },
          "rule": { "en": "Prefer an event to a polling loop.", "es": "Preferí un evento a un loop que consulta." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "0 3 * * * runs at what time?", "es": "¿A qué hora corre 0 3 * * *?" },
          "options": [
            { "en": "At 3:00 UTC", "es": "A las 3:00 UTC" },
            { "en": "At 3:00 in each data center", "es": "A las 3:00 en cada data center" },
            { "en": "At 3:00 in the time zone of the account", "es": "A las 3:00 en la zona horaria de la cuenta" }
          ],
          "correct": 0,
          "explanation": { "en": "Cron Triggers execute on UTC time.", "es": "Los Cron Triggers corren en hora UTC." }
        },
        {
          "question": { "en": "You changed a cron and the next run did not happen. A likely reason?", "es": "Cambiaste un cron y la corrida siguiente no pasó. ¿Una razón probable?" },
          "options": [
            { "en": "Cron Triggers run once a day at most", "es": "Los Cron Triggers corren como mucho una vez por día" },
            { "en": "The change was still propagating, up to 15 minutes", "es": "El cambio todavía se estaba propagando, hasta 15 minutos" },
            { "en": "The free plan pauses crons after a change", "es": "El plan gratuito pausa los cron después de un cambio" }
          ],
          "correct": 1,
          "explanation": { "en": "Runs can be missed until propagation completes.", "es": "Se pueden perder corridas hasta que termina la propagación." }
        },
        {
          "question": { "en": "Where are R2 event notifications configured?", "es": "¿Dónde se configuran las notificaciones de eventos de R2?" },
          "options": [
            { "en": "In triggers of wrangler.jsonc", "es": "En triggers de wrangler.jsonc" },
            { "en": "In the scheduled handler", "es": "En el handler scheduled" },
            { "en": "On the account, with wrangler r2 bucket notification", "es": "En la cuenta, con wrangler r2 bucket notification" }
          ],
          "correct": 2,
          "explanation": { "en": "That is also why the kit cannot simulate them.", "es": "Por eso también el kit no las puede simular." }
        }
      ],
      "source": "cron",
      "experiment": { "en": "Move the clock and see when the close runs, in UTC and in your time zone.", "es": "Mové el reloj y mirá cuándo corre el cierre, en UTC y en tu zona horaria." },
      "visor": { "en": "lab cron shows a cron event with Hyperdrive and KV and no request before it, then the GET /lab/close that reads the result. The cron that curl fires shows under the previous lab command: only lab commands mark the viewer.", "es": "lab cron muestra un evento de cron con Hyperdrive y KV y sin un pedido antes, y después el GET /lab/close que lee el resultado. El cron que dispara curl aparece bajo el comando de lab anterior: solo los comandos de lab marcan el visor." },
      "lab": [
        {
          "title": { "en": "Read the schedule", "es": "Leé el horario" },
          "text": { "en": "The trigger is in wrangler.jsonc.", "es": "El trigger está en wrangler.jsonc." },
          "command": "docker compose exec edge grep -n \"crons\" wrangler.jsonc",
          "expected": { "en": "\"triggers\": { \"crons\": [\"0 3 * * *\"] }.", "es": "\"triggers\": { \"crons\": [\"0 3 * * *\"] }." },
          "checks": [{ "contains": "0 3 * * *" }]
        },
        {
          "title": { "en": "Run the close now", "es": "Corré el cierre ahora" },
          "text": { "en": "cron runs inside the edge and asks the Local Explorer to dispatch one scheduled invocation, then reads the result.", "es": "cron corre dentro del borde y le pide al Local Explorer que despache una invocación scheduled, y después lee el resultado." },
          "command": "docker compose exec edge lab cron",
          "expected": { "en": "scheduled handler, cron \"0 3 * * *\": ok and a close with the time and the shipments by status, read from PostgreSQL through Hyperdrive.", "es": "scheduled handler, cron \"0 3 * * *\": ok y un cierre con la hora y los envíos por estado, leídos de PostgreSQL por Hyperdrive." },
          "checks": [{ "contains": ": ok" }, { "contains": "byStatus" }]
        },
        {
          "title": { "en": "Run it with a plain request", "es": "Corrélo con un pedido simple" },
          "text": { "en": "The other local way: /cdn-cgi/local/scheduled, from inside the edge.", "es": "La otra forma local: /cdn-cgi/local/scheduled, desde dentro del borde." },
          "command": "docker compose exec edge curl -s \"http://127.0.0.1:8787/cdn-cgi/local/scheduled?cron=0+3+*+*+*\"",
          "expected": { "en": "ok.", "es": "ok." },
          "checks": [{ "matches": "^ok" }]
        },
        {
          "title": { "en": "Find both runs in the spans", "es": "Encontrá las dos corridas en los spans" },
          "text": { "en": "A scheduled run is an invocation with no request behind it.", "es": "Una corrida scheduled es una invocación sin un pedido detrás." },
          "command": "docker compose exec edge lab spans 3",
          "expected": { "en": "The two cron invocations, each with Hyperdrive and KV put close:last, and between them GET /lab/close, the read of lab cron.", "es": "Las dos invocaciones cron, cada una con Hyperdrive y KV put close:last, y entre las dos GET /lab/close, la lectura de lab cron." },
          "checks": [{ "contains": "cron (ok" }, { "contains": "KV put close:last" }]
        }
      ]
    },
    {
      "id": 25,
      "unit": 7,
      "slug": "capstone",
      "title": { "en": "An edge you can defend", "es": "Un borde que se puede defender" },
      "intro": { "en": "Rumbo, decided piece by piece, with a command behind each decision.", "es": "Rumbo, decidido pieza por pieza, con un comando detrás de cada decisión." },
      "visual": "capstone",
      "frames": [
        {
          "title": { "en": "What is cached, and why", "es": "Qué se guarda, y por qué" },
          "text": { "en": "The public tracking page is the same for everyone: public, max-age=60. The API answers per shipment and changes: no-store. A profile is personal: private, no-store, never public, whatever the key. The rate of a zone is computed at the edge and kept per data center with the Cache API. Each decision is a header you can read.", "es": "La página pública de seguimiento es igual para todos: public, max-age=60. La API responde por envío y cambia: no-store. Un perfil es personal: private, no-store, nunca public, sea cual sea la clave. La tarifa de una zona se calcula en el borde y se guarda por data center con la Cache API. Cada decisión es un encabezado que se puede leer." },
          "rule": { "en": "Every cached answer has a reason written in its headers.", "es": "Cada respuesta guardada tiene una razón escrita en sus encabezados." }
        },
        {
          "title": { "en": "What protects what", "es": "Qué protege qué" },
          "text": { "en": "The origin listens on no public port: a tunnel is its way in. The admin API is refused at the edge, as a custom rule would. The API is limited by API key. The panel needs identity at the edge and a token the origin validates itself, so reaching the origin directly does not skip the check. TLS to the origin is Full (strict).", "es": "El origen no escucha en ningún puerto público: un túnel es su entrada. La API de administración se rechaza en el borde, como lo haría una regla propia. La API se limita por API key. El panel necesita identidad en el borde y un token que el origen valida solo, así que llegar directo al origen no saltea la verificación. El TLS hacia el origen es Full (strict)." },
          "rule": { "en": "Defend in layers; each layer assumes the one before failed.", "es": "Defendé en capas; cada capa supone que falló la anterior." }
        },
        {
          "title": { "en": "What each store guarantees", "es": "Qué garantiza cada almacenamiento" },
          "text": { "en": "KV for flags: read everywhere, eventual. A Durable Object per shipment and per counter: one place, one call at a time. D1 for quotes, with migrations. R2 for proofs, with no egress fees. A queue for movements, at least once, with an idempotent consumer and a dead letter queue. A workflow for returns, which wait for people. All of it fits the free plan for a small load, except what the zone needs, and R2 asks for a payment method.", "es": "KV para flags: se lee en todos lados, eventual. Un Durable Object por envío y por contador: un lugar, una llamada por vez. D1 para cotizaciones, con migraciones. R2 para comprobantes, sin costo de salida. Una cola para movimientos, al menos una vez, con un consumidor idempotente y una cola de mensajes muertos. Un workflow para devoluciones, que esperan a personas. Todo entra en el plan gratuito para una carga chica, salvo lo que necesita la zona, y R2 pide un medio de pago." },
          "rule": { "en": "Choose the store by its guarantee, not by its speed.", "es": "Elegí el almacenamiento por su garantía, no por su velocidad." }
        }
      ],
      "quiz": [
        {
          "question": { "en": "Someone calls the panel at the origin, skipping the edge. What stops them?", "es": "Alguien llama al panel en el origen, salteando el borde. ¿Qué lo frena?" },
          "options": [
            { "en": "Access, because it sees every request", "es": "Access, porque ve todos los pedidos" },
            { "en": "The WAF of the zone", "es": "El WAF de la zona" },
            { "en": "The origin validating the token itself", "es": "El origen validando el token por su cuenta" }
          ],
          "correct": 2,
          "explanation": { "en": "A layer at the origin covers the requests that never met the edge.", "es": "Una capa en el origen cubre los pedidos que nunca pasaron por el borde." }
        },
        {
          "question": { "en": "Which store for the live status of each shipment?", "es": "¿Qué almacenamiento para el estado en vivo de cada envío?" },
          "options": [
            { "en": "A Durable Object per shipment", "es": "Un Durable Object por envío" },
            { "en": "A KV key per shipment", "es": "Una clave de KV por envío" },
            { "en": "A row in D1 read by every Worker", "es": "Una fila en D1 que leen todos los Workers" }
          ],
          "correct": 0,
          "explanation": { "en": "One owner, consistent storage, sockets and an alarm.", "es": "Un dueño, almacenamiento consistente, sockets y una alarma." }
        },
        {
          "question": { "en": "Why is the consumer of movements safe against duplicates?", "es": "¿Por qué el consumidor de movimientos está a salvo de los duplicados?" },
          "options": [
            { "en": "Because the queue delivers each message once", "es": "Porque la cola entrega cada mensaje una vez" },
            { "en": "Because the event id is the primary key at the origin", "es": "Porque el id del evento es la clave primaria en el origen" },
            { "en": "Because the consumer keeps a list in memory", "es": "Porque el consumidor guarda una lista en memoria" }
          ],
          "correct": 1,
          "explanation": { "en": "Idempotency lives where the effect is stored.", "es": "La idempotencia vive donde se guarda el efecto." }
        }
      ],
      "source": "pricing",
      "experiment": { "en": "Walk through the rubric and point each line to the lesson and the command that proves it.", "es": "Recorré la rúbrica y apuntá cada línea a la lección y al comando que la prueban." },
      "visor": { "en": "The whole course at once: the refused request, the two webhooks with their consumers, and the race in the object; panel --direct leaves nothing.", "es": "Todo el curso junto: el pedido rechazado, los dos webhooks con sus consumidores, y la carrera en el objeto; panel --direct no deja nada." },
      "lab": [
        {
          "title": { "en": "The admin API, refused", "es": "La API de administración, rechazada" },
          "text": { "en": "Rubric 1: what no code should see is refused before the origin.", "es": "Rúbrica 1: lo que ningún código debería ver se rechaza antes del origen." },
          "command": "docker compose run --rm lab get /api/admin/users",
          "expected": { "en": "HTTP 403, blocked at the edge.", "es": "HTTP 403, blocked at the edge." },
          "checks": [{ "contains": "HTTP 403" }]
        },
        {
          "title": { "en": "The panel, straight to the origin", "es": "El panel, directo al origen" },
          "text": { "en": "Rubric 2: skipping the edge does not skip the identity check.", "es": "Rúbrica 2: saltear el borde no saltea la verificación de identidad." },
          "command": "docker compose run --rm lab panel --direct",
          "expected": { "en": "HTTP 401 from the origin.", "es": "HTTP 401 del origen." },
          "checks": [{ "contains": "HTTP 401" }]
        },
        {
          "title": { "en": "A movement twice", "es": "Un movimiento dos veces" },
          "text": { "en": "Rubric 3: the consumer is idempotent.", "es": "Rúbrica 3: el consumidor es idempotente." },
          "command": "docker compose run --rm lab webhook c-1 R-1043 delivered\ndocker compose run --rm lab webhook c-1 R-1043 delivered",
          "expected": { "en": "saved at the origin, then already saved: not saved again.", "es": "saved at the origin, y después already saved: not saved again." },
          "checks": [{ "contains": "already saved" }]
        },
        {
          "title": { "en": "A counter that does not lose", "es": "Un contador que no pierde" },
          "text": { "en": "Rubric 4: coordination lives in one place.", "es": "Rúbrica 4: la coordinación vive en un lugar." },
          "command": "docker compose run --rm lab race do",
          "expected": { "en": "final: 50.", "es": "final: 50." },
          "checks": [{ "contains": "\"final\": 50" }]
        },
        {
          "title": { "en": "What the edge did", "es": "Lo que hizo el borde" },
          "text": { "en": "Rubric 5: every claim has a trace.", "es": "Rúbrica 5: cada afirmación tiene una traza." },
          "command": "docker compose exec edge lab spans 6",
          "expected": { "en": "The refused request answered by the Worker alone, the webhooks with queue send, the consumers with fetch to the origin and the Durable Object, and the race.", "es": "El pedido rechazado respondido por el Worker solo, los webhooks con queue send, los consumidores con fetch al origen y el Durable Object, y la carrera." },
          "checks": [{ "contains": "queue send" }]
        },
        {
          "title": { "en": "Stop the kit", "es": "Pará el kit" },
          "text": { "en": "down stops and removes the containers and keeps the volumes, so the data of the course is there next time. The profiles name the optional services too.", "es": "down para y saca los contenedores y conserva los volúmenes, así los datos del curso están la próxima vez. Los perfiles nombran también los servicios opcionales." },
          "command": "docker compose --profile tls --profile tunnel down",
          "expected": { "en": "Each container Removed, and the network.", "es": "Cada contenedor Removed, y la red." },
          "checks": [{ "contains": "Removed" }]
        }
      ]
    }
  ]
};
