# Cloudflare from scratch / Cloudflare desde cero

A standalone visual course in **English and Rioplatense Spanish**, version 1.3.0: follow one request from DNS to your origin, decide what the edge caches, blocks and lets through, and run code and keep state next to the user with Workers, on your machine and with no account. Open [index.html](index.html?lang=en) or start with [00, Before you start](lessons/before-you-start.html?lang=en); if you do not know what Cloudflare is yet, read [What Cloudflare is](what-cloudflare-is.html?lang=en) first, and keep [the big picture](big-picture.html?lang=en) at hand. The site can be copied and opened without a server or a connection; it needs no account, telemetry or external resources, except the discussion of a lesson when you open it on the published site. The official links and the first download of the images do need internet.

Un curso visual independiente en **inglés y español rioplatense**, versión 1.3.0: seguí un pedido desde el DNS hasta tu origen, decidí qué guarda, bloquea y deja pasar el borde, y corré código y guardá estado cerca del usuario con Workers, en tu máquina y sin cuenta. Abrí [index.html](index.html?lang=es) o empezá por [00, Antes de empezar](lessons/before-you-start.html?lang=es); si todavía no sabés qué es Cloudflare, leé antes [Qué es Cloudflare](what-cloudflare-is.html?lang=es), y tené a mano [el panorama](big-picture.html?lang=es). El sitio se puede copiar y abrir sin servidor ni conexión; no requiere cuenta, telemetría ni recursos externos, salvo la discusión de una lección cuando la abrís en el sitio publicado. Los enlaces oficiales y la primera descarga de las imágenes sí necesitan internet.

## What is included / Qué incluye

- 26 lessons in 8 units, including the initial orientation. / 26 lecciones en 8 unidades, incluida la orientación inicial.
- A big picture, from a button on the home page: every piece of the course on one scene, from who asks and how a request finds the edge to the Worker with its bindings and your origin, a card per area, a card per piece that says what it is, what it is for, what it does not do, what the free plan gives and how the kit runs it, and 14 journeys with 108 stops (through the edge, around it, TLS, a Worker in front, deploy, cache, rules and budgets, identity, KV and Durable Objects, data, a webhook, a return, the daily close, the capstone) and a text version. / Un panorama, desde un botón de la portada: todas las piezas del curso en una escena, desde quien pide y cómo un pedido encuentra el borde hasta el Worker con sus bindings y tu origen, una ficha por zona, una ficha por pieza que dice qué es, para qué sirve, qué no hace, qué da el plan gratuito y cómo la corre el kit, y 14 recorridos con 108 paradas (a través del borde, por fuera, TLS, un Worker adelante, despliegue, cache, reglas y presupuestos, identidad, KV y Durable Objects, datos, un webhook, una devolución, el cierre diario, la integradora) y una versión en texto.
- A five minute "What Cloudflare is" page: what it is, where it came from, where it fits and where it does not, with its sources. / Una página de cinco minutos, "Qué es Cloudflare": qué es, de dónde salió, dónde encaja y dónde no, con sus fuentes.
- A discussion per lesson, in the Go deeper tab: threads on GitHub Discussions, loaded only when you open them on the published site. / Una discusión por lección, en la pestaña Profundizá: hilos en GitHub Discussions, cargados solo cuando los abrís en el sitio publicado.
- 78 scenes with interactive SVG models, 78 questions with explanations and 129 lab steps, 8 of them optional, on a free Cloudflare account. / 78 escenas con modelos SVG interactivos, 78 preguntas con explicación y 129 pasos de laboratorio, 8 de ellos opcionales, en una cuenta gratuita de Cloudflare.
- English and Rioplatense Spanish, a 51-term glossary and downloadable notes. / Inglés y español rioplatense, glosario de 51 términos y apuntes descargables.
- Classic, Dark, Reading and Projector skins. Local progress, independent from other courses. / Apariencias Clásico, Oscuro, Lectura y Proyector. Avance local independiente de otros cursos.
- A live viewer at http://127.0.0.1:18098 that draws every request, queue message, alarm and cron that reaches the edge, over the pieces of the kit, with the lesson step that caused it. / Un visor en vivo en http://127.0.0.1:18098 que dibuja cada pedido, mensaje de la cola, alarma y cron que llega al borde, sobre las piezas del kit, con el paso de la lección que lo causó.
- A Docker Compose kit: the Worker of Rumbo, a fictional shipment tracking platform, on wrangler dev with KV, D1, R2, Durable Objects, Queues, Workflows, Hyperdrive and rate limiting simulated; its Spring Boot origin with PostgreSQL; cloudflared for a quick tunnel; and a lab command that prints what matters. / Un kit de Docker Compose: el Worker de Rumbo, una plataforma ficticia de seguimiento de envíos, en wrangler dev con KV, D1, R2, Durable Objects, Queues, Workflows, Hyperdrive y rate limiting simulados; su origen de Spring Boot con PostgreSQL; cloudflared para un túnel rápido; y un comando lab que imprime lo que importa.

## Learning path / Recorrido

| Lessons / Lecciones | Unit / Unidad | Question it answers / Pregunta que responde |
| --- | --- | --- |
| 00 | Start here / Antes de empezar | What does each part of the course prove, and where? / ¿Qué prueba cada parte del curso, y dónde? |
| 01 to 04 | The network in front of your app / La red delante de tu aplicación | How does a request reach the edge, and how does the edge reach my origin? / ¿Cómo llega un pedido al borde, y cómo llega el borde a mi origen? |
| 05 to 09 | Workers | Where does my code run, what can it reach, and how do I test and ship it? / ¿Dónde corre mi código, a qué llega, y cómo lo pruebo y lo publico? |
| 10 to 12 | Cache | What does the edge keep, under which key, and for whom? / ¿Qué guarda el borde, bajo qué clave, y para quién? |
| 13 to 15 | Security at the edge / Seguridad en el borde | What is stopped before my code, and how does my origin know who is calling? / ¿Qué se frena antes de mi código, y cómo sabe mi origen quién llama? |
| 16 to 21 | State at the edge / Estado en el borde | Which store guarantees what? / ¿Qué almacenamiento garantiza qué? |
| 22 to 24 | Events / Eventos | How does work happen later, at least once, and on a schedule? / ¿Cómo pasa el trabajo después, al menos una vez, y con horario? |
| 25 | Capstone / Integradora | Which claims about my edge can I back with a command? / ¿Qué afirmaciones sobre mi borde puedo respaldar con un comando? |

## Labs / Laboratorios

Use Docker with Linux containers and Compose v2, about 1 GB of free memory and about 3 GB of disk for the images, the one that builds the origin included. Nothing else is installed on your machine. Every step says what kind of evidence it gives: local, in the kit, with no account; account, optional, on a free Cloudflare account with a token in `labs/.env`; and zone, a domain of your own, shown as a case study. The [kit guide](labs/README.md) covers the first run, what each service is, the optional account, what the kit does not simulate and cleanup.

Usá Docker con contenedores Linux y Compose v2, alrededor de 1 GB de memoria libre y unos 3 GB de disco para las imágenes, incluida la que construye el origen. No se instala nada más en tu máquina. Cada paso dice qué clase de evidencia da: local, en el kit, sin cuenta; cuenta, opcional, en una cuenta gratuita de Cloudflare con un token en `labs/.env`; y zona, un dominio propio, mostrado como caso de estudio. La [guía del kit](labs/README.md) explica la primera ejecución, qué es cada servicio, la cuenta opcional, lo que el kit no simula y la limpieza.

The models illustrate mechanisms; the kit runs the real runtime of Workers, workerd, with its bindings simulated, and is one place, not a network: no anycast, no zone, no Workers Cache, and Hyperdrive without its pool. The tests that were executed, the platform and the limits of that evidence live in [docs/VALIDATION.md](docs/VALIDATION.md). The course does not cover Containers or Load Balancing, which are paid, Workers AI and Vectorize, Workers VPC, Gateway, WARP and private networks, Email, Images, Stream, Registrar or Terraform.

Los modelos ilustran mecanismos; el kit corre el runtime real de Workers, workerd, con sus bindings simulados, y es un lugar, no una red: sin anycast, sin zona, sin Workers Cache, e Hyperdrive sin su pool. Las pruebas ejecutadas, la plataforma y los límites de esa evidencia viven en [docs/VALIDATION.md](docs/VALIDATION.md). El curso no cubre Containers ni Load Balancing, que son pagos, Workers AI ni Vectorize, Workers VPC, Gateway, WARP ni redes privadas, Email, Images, Stream, Registrar ni Terraform.

## Edit and package / Editar y empaquetar

With Node.js 18 or later and no packages to install: / Con Node.js 18 o superior, sin instalar paquetes:

```text
npm run build
npm run check
npm run preview
npm run release
```

The local preview uses `http://127.0.0.1:4176`. `release/` holds the portable course and the ZIP of the static site. `npm run test:labs -- --fresh` removes the containers and volumes of the kit, then runs the commands of the lessons in order and checks what each step says to look for; with `--account` and a `labs/.env`, it also runs the optional steps. Read the scope in [VALIDATION.md](docs/VALIDATION.md) first.

La vista local usa `http://127.0.0.1:4176`. `release/` contiene el curso portable y el ZIP del sitio estático. `npm run test:labs -- --fresh` saca los contenedores y volúmenes del kit, y después ejecuta los comandos de las lecciones en orden y comprueba lo que cada paso dice que hay que mirar; con `--account` y un `labs/.env`, corre también los pasos opcionales. Leé antes el alcance en [VALIDATION.md](docs/VALIDATION.md).

Content and method: [TEACHING.md](docs/TEACHING.md). Static publication: [DEPLOYMENT.md](docs/DEPLOYMENT.md). License [MIT](LICENSE). The course carries its own copies of assets and scripts; it does not depend on other folders of the repository.

Contenido y método: [TEACHING.md](docs/TEACHING.md). Publicación estática: [DEPLOYMENT.md](docs/DEPLOYMENT.md). Licencia [MIT](LICENSE). El curso lleva sus propias copias de assets y scripts; no depende de otras carpetas del repositorio.
