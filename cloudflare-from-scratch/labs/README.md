# Cloudflare kit / Kit de Cloudflare

Version 1.0.0. Open a terminal in this folder before running the lesson commands. Commands keep their technical names in both languages and use quoting that works in PowerShell, bash and zsh. Everything runs in containers: you do not need Node.js, Wrangler, Java or PostgreSQL on your machine.

Versión 1.0.0. Abrí una terminal en esta carpeta antes de ejecutar los comandos de las lecciones. Los comandos conservan los nombres técnicos en ambos idiomas y usan comillas que funcionan en PowerShell, bash y zsh. Todo corre en contenedores: no necesitás Node.js, Wrangler, Java ni PostgreSQL en tu máquina.

## First run / Primera ejecución

1. Install [Docker Desktop](https://docs.docker.com/desktop/) or [Docker Engine](https://docs.docker.com/engine/install/) with [Compose v2](https://docs.docker.com/compose/install/), with Linux containers. / Instalá [Docker Desktop](https://docs.docker.com/desktop/) o [Docker Engine](https://docs.docker.com/engine/install/) con [Compose v2](https://docs.docker.com/compose/install/), con contenedores Linux.
2. Start the kit: `docker compose up -d --build --wait`. The first time it builds the edge and the origin, which takes a few minutes, most of it Maven. / Levantá el kit: `docker compose up -d --build --wait`. La primera vez construye el borde y el origen, lo que tarda unos minutos, casi todo Maven.
3. Ask the origin through the edge: `docker compose run --rm lab get /api/shipments/R-1042`. / Pedile al origen a través del borde: `docker compose run --rm lab get /api/shipments/R-1042`.

## What runs where / Qué corre dónde

| Service / Servicio | What it is / Qué es | On your machine / En tu máquina |
| --- | --- | --- |
| `edge` | The Worker of Rumbo on wrangler dev 4.162.0, with every binding simulated; its local data lives in the `edge-state` volume; next to it runs the live viewer / El Worker de Rumbo en wrangler dev 4.162.0, con todos los bindings simulados; sus datos locales viven en el volumen `edge-state`; al lado corre el visor en vivo | 127.0.0.1:18097, and the viewer on 127.0.0.1:18098 / y el visor en 127.0.0.1:18098 |
| `origin` | The API of Rumbo: Spring Boot 4.1.2 on Java 25, HTTP on 8080 and HTTPS on 8443 / La API de Rumbo: Spring Boot 4.1.2 sobre Java 25, HTTP en 8080 y HTTPS en 8443 | no port / sin puerto |
| `db` | PostgreSQL 18.7: shipments and movements / PostgreSQL 18.7: envíos y movimientos | no port / sin puerto |
| `lab` | The command of the lessons, in the image of the edge: `docker compose run --rm lab help` / El comando de las lecciones, en la imagen del borde: `docker compose run --rm lab help` | none / ninguno |
| `impostor` | Profile `tls`, lesson 03: the origin with a self-signed certificate / Perfil `tls`, lección 03: el origen con un certificado autofirmado | no port / sin puerto |
| `tunnel` | Profile `tunnel`, lesson 04: cloudflared 2026.11.0, a quick tunnel to the origin / Perfil `tunnel`, lección 04: cloudflared 2026.11.0, un túnel rápido al origen | none, outbound only / ninguno, solo saliente |

The local tools of wrangler dev, such as the Local Explorer, answer at http://127.0.0.1:18097/cdn-cgi/local/explorer in your browser. They check the Host header, so from the lab container they are used inside the edge: `docker compose exec edge lab spans` and `docker compose exec edge lab cron`.

Las herramientas locales de wrangler dev, como el Local Explorer, responden en http://127.0.0.1:18097/cdn-cgi/local/explorer en tu navegador. Verifican el encabezado Host, así que desde el contenedor del lab se usan dentro del borde: `docker compose exec edge lab spans` y `docker compose exec edge lab cron`.

## The live viewer / El visor en vivo

Open http://127.0.0.1:18098 while you run the lessons. Every request, queue message, alarm and cron that reaches the edge appears as an event, drawn over the pieces of the kit with its calls and their times, and with the lab command and the lesson step that caused it; each piece has its card, the same as in the map of the course. It runs inside the edge container, next to wrangler dev, and reads the spans that wrangler dev records, the same ones that `lab spans` prints. It only reads: it answers GET and only to requests addressed to your machine. Pieces that do not run in the kit, such as Workers Cache and the zone, appear hatched. An event that no lab command caused, such as a curl or your browser, shows under the last lab command.

Abrí http://127.0.0.1:18098 mientras hacés las lecciones. Cada pedido, mensaje de la cola, alarma y cron que llega al borde aparece como un evento, dibujado sobre las piezas del kit con sus llamadas y sus tiempos, y con el comando de lab y el paso de la lección que lo causó; cada pieza tiene su ficha, la misma del mapa del curso. Corre dentro del contenedor del borde, al lado de wrangler dev, y lee los spans que registra wrangler dev, los mismos que imprime `lab spans`. Solo lee: responde GET y solo a pedidos dirigidos a tu máquina. Las piezas que no corren en el kit, como Workers Cache y la zona, aparecen rayadas. Un evento que no causó ningún comando de lab, como un curl o tu navegador, aparece bajo el último comando de lab.

## Your account, optional / Tu cuenta, opcional

Steps marked account use a free Cloudflare account and are optional. Copy `.env.example` to `.env` and fill `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`, with a token made from the Edit Cloudflare Workers template. `.env` stays in this folder: it is not printed, packaged or committed. These steps deploy `rumbo-edge-demo`, the Worker of `edge/deploy`, to your workers.dev subdomain; it has no bindings, so it fits the free plan. To remove it later: `docker compose run --rm lab wrangler delete`.

Los pasos marcados como cuenta usan una cuenta gratuita de Cloudflare y son opcionales. Copiá `.env.example` a `.env` y completá `CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_API_TOKEN`, con un token hecho con la plantilla Edit Cloudflare Workers. `.env` queda en esta carpeta: no se imprime, no se empaqueta ni se versiona. Estos pasos despliegan `rumbo-edge-demo`, el Worker de `edge/deploy`, en tu subdominio de workers.dev; no tiene bindings, así que entra en el plan gratuito. Para sacarlo después: `docker compose run --rm lab wrangler delete`.

## What the kit does not simulate / Lo que el kit no simula

The kit is one place, not a network: no anycast and no other data centers, so the Cache API and the eventual consistency of KV behave as in one data center. There is no zone: DNS, encryption modes, cache rules and the WAF are shown as case studies, and the gateway plays a custom rule in code. Workers Cache does not run under wrangler dev. Hyperdrive connects straight to the database, with no pool and no cache. R2 event notifications are configured on an account only. request.cf is fetched once from Cloudflare when wrangler starts.

El kit es un lugar, no una red: sin anycast ni otros data centers, así que la Cache API y la consistencia eventual de KV se comportan como en un data center. No hay zona: el DNS, los modos de cifrado, las reglas de cache y el WAF se muestran como casos de estudio, y el gateway hace de regla propia en código. Workers Cache no corre en wrangler dev. Hyperdrive se conecta directo a la base, sin pool ni cache. Las notificaciones de eventos de R2 se configuran solo en una cuenta. request.cf se trae una vez de Cloudflare cuando arranca wrangler.

## Undo and clean up / Deshacer y limpiar

The lessons undo what they change: the maintenance flag is deleted in lesson 16, the impostor and the tunnel are stopped in the lessons that start them. `docker compose --profile tls --profile tunnel down` stops everything and keeps the volumes. To start over from nothing, remove the volumes too: `docker compose --profile tls --profile tunnel down -v`. A secret written in lesson 06 lives inside the edge container and goes away when the container is recreated.

Las lecciones deshacen lo que cambian: la flag de mantenimiento se borra en la lección 16, el impostor y el túnel se paran en las lecciones que los levantan. `docker compose --profile tls --profile tunnel down` para todo y conserva los volúmenes. Para empezar de nuevo desde cero, sacá también los volúmenes: `docker compose --profile tls --profile tunnel down -v`. Un secreto escrito en la lección 06 vive dentro del contenedor del borde y desaparece cuando se recrea el contenedor.
