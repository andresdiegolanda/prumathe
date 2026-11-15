# Validación

Este documento registra evidencia ejecutada y límites por versión; los modelos del navegador siguen siendo ilustrativos. Cada sección dice qué se ejecutó, en qué plataforma y qué quedó fuera.

## Versión 1.2.0, 15 de noviembre de 2026

Fichas de zona en el panorama: cada una de las 5 zonas abre su ficha con un clic en su nombre o en su espacio libre, o con Enter: qué es, qué no hace, qué hay adentro, lecciones y los recorridos que la cruzan, en inglés y español. El motor común es el de Microsoft Entra 1.4.0; `npm run check` valida los dos textos de cada ficha en los dos idiomas y sus lecciones.

Pasada de navegador en Chromium con la CSP de `_headers`: cada zona abierta con un clic en su espacio libre en 1440x900 (Clásica, español), 1366x768 (Oscura, inglés), 390x844 (Clásica, español), 1920x1080 (Proyector, inglés) y 1440x900 (Lectura, inglés). En cada una: la URL y la zona marcada siguen a la ficha, la ficha no desborda el panel, un arrastre que empieza en una zona no abre nada, Enter abre una zona con el foco, y el primer botón de «Qué hay adentro» y el primer recorrido de cada ficha funcionan, sin errores de consola. Cada parada de cada recorrido, otra vez con el teclado en 1440x900 (Clásica, inglés), 1366x768 (Oscura, español), 390x844 (Clásica, español) y 1920x1080 (Proyector, inglés), sin problemas ni errores de consola, y cada rótulo dentro de su caja con los cuatro estilos en los dos idiomas.

No ejecutado: el laboratorio. Las fichas de zona no corren ningún comando ni cambian el kit; `lessons.json` y `pieces.json` del visor llevan la versión del curso, y las imágenes del kit conservan la etiqueta 1.0.0.

## Versión 1.1.0, 14 de noviembre de 2026

El mapa de Cloudflare pasa a ser el panorama del curso, con el motor común a los demás cursos: `big-picture.html`, que se abre con un botón de la portada y con el enlace del encabezado. 29 piezas, 29 líneas, 8 elementos, 14 recorridos y 108 paradas, en inglés y español; las fichas de las piezas son las del mapa, con el mismo texto, y `pieces.json` del visor se genera ahora desde ellas, sin cambios. El consumidor de la cola, la alarma de un objeto, el panel interno y el panel de Cloudflare dejan de ser piezas propias: el consumidor es el handler queue del Worker, la alarma un handler del Durable Object y el panel una ruta del origen, y el panel de Cloudflare lo cubren las paradas de cuenta y de zona. `assets/map.js` y `cloudflare-map.html` salen del curso. `npm run check` valida los datos con el motor (ids, geometría, los dos idiomas, lecciones, recorridos que solo se mueven por líneas), encuentra cada comando que muestra entre los comandos de las lecciones y compara `pieces.json` con las fichas.

Pasada de navegador en Chromium con la CSP de `_headers`: cada parada de cada recorrido con el teclado en 1440x900 (Clásica, inglés), 1366x768 (Oscura, español), 390x844 (Clásica, español) y 1920x1080 (Proyector, inglés). En cada una: el panel nombra la parada, la pieza actual queda marcada, la burbuja queda dentro de la escena y no tapa la pieza de la parada (en un teléfono la burbuja le deja el lugar al panel), sin errores de consola ni desborde horizontal. Cada rótulo medido dentro de su caja en los dos idiomas y en las cuatro apariencias; en 1440x900 la escena se dibuja a 0,76, los nombres a 11,3 px.

No ejecutado: el laboratorio. El panorama no corre ningún comando ni cambia el kit; los números de las paradas son los de las lecciones, medidos en la corrida de la 1.0.0, y las imágenes del kit conservan la etiqueta 1.0.0.

## Versión 1.0.0, 14 de noviembre de 2026

### Resultado

De los **129 pasos de las 26 lecciones**, 121 pasaron en una corrida secuencial de `node scripts/test-labs.mjs --fresh`, de la lección 00 a la 25, sin fallas. Los 8 que faltan son los opcionales de cuenta, 09.2 a 09.6 y 10.3 a 10.5: necesitan una cuenta de Cloudflare y un token en `labs/.env`, y no se corrieron. El resumen por paso está en [validation-results.json](validation-results.json); el informe completo, con la salida de cada paso, queda en `.qa/labs.json`, que no se versiona.

`--fresh` quiere decir que antes del primer paso se bajaron los servicios del proyecto Compose `prumathe-cf` con sus volúmenes, así que la lección 00 levantó el kit con la base, el estado local de wrangler, KV, D1, R2, los Durable Objects y las colas vacías, como los encuentra quien cursa. Las imágenes ya estaban construidas: el paso 00.2 tardó 16,7 s y la corrida entera 3 minutos 46 segundos. La primera construcción, con la descarga de las imágenes y Maven, no se midió en esta corrida.

Antes de esta, la suite completa corrió seis veces desde cero: tres pasaron enteras y tres fallaron, y cada falla cambió el kit:

- En el 22.2, `lab webhook` leía el registro de la entrega anterior del mismo evento y daba por terminada la segunda antes de que el consumidor la procesara. Ahora marca cada envío con un valor propio (`sent`) y espera el registro de ese envío.
- En el 13.3, `lab spans` no mostró el último pedido: su span quedó guardado con un `start_ms` 2,2 s anterior al del pedido previo. La causa no se aisló. `lab spans` ordena ahora los pedidos por el orden en que el explorador los guardó (`rowid`), y las llamadas de cada pedido por `start_ms`.
- En el 04.3, el nombre del túnel rápido no respondió en 50 s, cuando en las corridas anteriores había respondido en unos 14 s. Medido después con otro túnel, el borde lo enrutó a los 37 s y los servidores de DNS de trycloudflare.com lo publicaron a los 73 s. `lab tunnel` manda ahora el pedido a la dirección de trycloudflare.com con el nombre nuevo, sin esperar al DNS, y la lección 04 lo explica.

### Plataforma y versiones

| Componente | Versión ejecutada |
| --- | --- |
| Host | Windows 11 Pro 10.0.26200, PowerShell 5.1.26100 |
| Hardware | Intel Core Ultra 9 275HX, 127,5 GB de RAM; la máquina virtual de Docker con 24 CPU y unos 62,5 GiB |
| Docker Desktop | 4.55.0 (213807), Engine 29.1.3, Compose 2.40.3-desktop.1, contenedores Linux amd64 |
| Node.js en el host | v24.11.0, solo para la suite y el build del sitio |
| Borde | `node:26.13.1-bookworm-slim` fijada por digest; wrangler 4.162.0, workerd 1.20261113.1 y miniflare 5.20261113.0-beta según `labs/edge/package-lock.json`; `@cloudflare/vitest-plugin` 1.8.2 con vitest 5.1.0; `postgres` 4.1.1 |
| Origen | Spring Boot 4.1.2 sobre Java 25, construido con Maven 3.9.16 y corriendo en `eclipse-temurin:25.0.5_8-jre-noble`, las dos fijadas por digest |
| Base | PostgreSQL 18.7, imagen fijada por digest |
| Túnel | cloudflared 2026.11.0, imagen fijada por digest |
| Visor en vivo | `labs/visor/`, sobre el Node 26.13.1 de la imagen del borde, sin dependencias |
| Navegador de las verificaciones | Chromium 141.0.7390.37 sin interfaz |

Durante las corridas había en la misma máquina otros contenedores ajenos al curso, con carga baja. Son versiones fijadas para reproducir el curso, no una afirmación de que sean las más nuevas.

### Qué se observó

| Lecciones | Evidencia |
| --- | --- |
| 00 | Docker 29.1.3; el kit construido y levantado; `docker compose ps` con el borde en 127.0.0.1:18097, su visor en 127.0.0.1:18098 y el origen y la base sin puerto en el host; R-1042 a través del borde con `x-rumbo-via: edge`. |
| 01 a 04 | `/cdn-cgi/trace` de www.cloudflare.com con `colo=LHR`, HTTP/2 y TLS 1.3, y la dirección pública marcada como presente sin imprimirla; `cf-ray` terminado en `-LHR` y `cf-cache-status: HIT`; `request.cf` del borde local con `colo` LHR y `country` IE; el origen viendo los encabezados que agrega el borde, y sin ellos cuando se le pide directo. www.cloudflare.com resolvió a 104.16.123.96 y 104.16.124.96, dentro de los rangos que publica Cloudflare, y github.com a una dirección fuera de ellos. Flexible sin cifrado entre borde y origen; Full aceptando al impostor autofirmado; Full (strict) aceptando al origen con la CA del kit y rechazando al impostor con `DEPTH_ZERO_SELF_SIGNED_CERT`. El origen sin puerto publicado (`:0`) y un túnel rápido que lo sirvió con HTTP 200 y `cf-cache-status: DYNAMIC`: `lab tunnel` mandó el pedido a la dirección de trycloudflare.com con el nombre nuevo, y el borde respondió 37,8 s después de empezar el paso. |
| 05 a 09 | El mismo isolate en dos pedidos seguidos (`hits` 1 y 2) y otro distinto después de reiniciar el borde; las variables y el secreto `RUMBO_TOKEN`, ausente hasta escribirlo en `.dev.vars` y reiniciar; los tipos generados con cada binding; el Worker delante de la API: 200, el preflight de CORS solo para `https://shop.example` y 403 para `/api/admin/users`; los spans de esos pedidos; las 6 pruebas de vitest, una sola por nombre y los dos dobles de `fetch`; `wrangler deploy --dry-run` con 1,50 KiB y `env.VERSION ("v1")`. |
| 10 a 12 | La página pública con `max-age=60, public` y el JSON con `no-store`; la Cache API con `cf-cache-status: HIT` en la segunda respuesta pública y sin guardar la privada (`private, no-store`), con cada usuario viendo la suya; la tarifa por zona servida desde la cache, borrada con `cache.delete` en este data center y vuelta a pedir al Worker; `cache match`, `cache put` y `cache delete` en los spans. |
| 13 a 15 | 403 en el borde para `/api/admin/users` y 404 del origen para `/API/admin/users`, que la regla no vio; rate limiting con la clave k1 en `200 200 200 200 200 429 429` y k2 con su propio presupuesto, `200 200 200`; el panel con 401 sin token, 200 con un token para la audiencia `rumbo-panel` del emisor de prueba, y 401 por audiencia, por vencido y por firma inválida, cada uno con su motivo; el origen directo, sin token, también 401. |
| 16 a 21 | La flag de mantenimiento en KV con 503 y de nuevo 200 al borrarla; 50 incrementos concurrentes en KV con resultado final 1, y en un Durable Object con 50 y con 200; D1 con las migraciones aplicadas, una cotización de 2,5 kg a MAD por 16 EUR y la zona desconocida rechazada; R2 con un comprobante subido (201 y su `etag`), leído por el borde y con Wrangler, y 404 para uno que no existe; la alarma de un Durable Object avisando por WebSocket `delayed true` después del silencio, y un movimiento entregado volviendo a `delayed false`; Hyperdrive y el origen devolviendo el mismo envío. |
| 22 a 25 | Un webhook con 202, guardado una vez en el origen; el mismo evento otra vez, `already saved: not saved again`, con un solo movimiento en el origen; un mensaje rechazado con 422, tres intentos y en la cola de mensajes muertos en 7,6 s; un Workflow `running` mientras espera la aprobación y `complete` después, con el reembolso en 2 intentos, y el mismo id rechazado; el handler `scheduled` con el cron `0 3 * * *` y su resumen por estado; la integradora con el bloqueo, el origen cerrado, el duplicado sin efecto y la carrera en el Durable Object. |

Medido aparte, para afirmaciones puntuales de las lecciones:

- Memoria con `docker stats`, con el kit levantado otra vez después de la corrida: el borde, con el visor, 454,7 MiB; el origen 299,5 MiB y PostgreSQL 26,4 MiB. Antes de que existiera el visor, con el kit recién levantado: borde 405,5 MiB, origen 329,2 MiB y PostgreSQL 42,6 MiB.
- Disco con `docker image ls`: borde 996 MB, origen 483 MB, PostgreSQL 656 MB, cloudflared 98,6 MB y la imagen de Maven que construye el origen 694 MB.
- Rate limiting: los contadores locales se reinician en ventanas fijas alineadas con el reloj (múltiplos del período desde el epoch), así que una ráfaga que cruza el borde de la ventana reparte sus pedidos entre dos. El comando `lab limit` espera a tener al menos 3 segundos de ventana antes de mandar la ráfaga.
- La alarma: en el kit se programa a 8 segundos del último movimiento; el paso 20.1, con el arranque del contenedor del lab, el WebSocket, el movimiento y esa espera, tardó 14,5 s.

### Lo que el kit no simula

El kit corre workerd, el runtime de Workers, con los bindings que simula wrangler dev. Es un lugar, no una red, y las lecciones lo dicen donde corresponde:

- No hay anycast ni otros data centers: la Cache API y la consistencia eventual de KV se comportan como en un solo data center, y `cache.delete` no tiene otros lugares que purgar.
- No hay zona: el DNS con proxy, los modos de cifrado, las reglas de cache, las reglas del WAF y Access sobre un dominio se muestran como casos de estudio con la documentación oficial. El gateway del Worker hace de regla propia en código y un emisor de prueba hace de Access.
- Workers Cache no corre en wrangler dev; la lección 10 lo muestra con la documentación y, en una cuenta, con sus pasos opcionales.
- Hyperdrive se conecta directo a la base, sin pool ni cache.
- `request.cf` se trae una vez de Cloudflare cuando arranca wrangler; describe la conexión de la máquina que corre el kit, no la de cada pedido.
- Las notificaciones de eventos de R2 se configuran solo en una cuenta.

### El visor en vivo

Después de la corrida, con el kit levantado otra vez (`docker compose up -d --wait`), `npm run test:visor` pasó sus 11 controles: la página con su CSP y `nosniff`; solo sus archivos, con 404 para el resto; 405 para POST, PUT y DELETE; 403 para otro Host; el visor leyendo el borde; pedidos, mensajes de la cola, alarmas y cron; cada evento con el comando de lab y el paso de la lección que lo causó; cada pieza del kit encendida al menos una vez; el mensaje que falla, con tres intentos y la cola de mensajes muertos; la alarma de la lección 20 sin un pedido delante, y ningún secreto en lo que sirve. El visor leyó 93 eventos de los spans que la corrida dejó en el volumen `edge-state`, en 21 lecciones, y los 93 nombraron su paso. La evidencia queda en `.qa/visor.json`, que no se versiona.

En Chromium sin interfaz, con el visor sirviendo eventos de otro wrangler dev con el mismo Worker, se eligieron 192 eventos y las 20 piezas en los dos idiomas, en claro y en oscuro, a 1280 por 900 y a 390 por 844: sin errores ni avisos en la consola y sin desborde horizontal. En la máquina de validación, el visor se abrió en un navegador con los 93 eventos de la corrida.

### Verificaciones estáticas e interfaz

`npm run build` genera las 26 páginas de lecciones, la portada, la página "Qué es Cloudflare", el mapa, los apuntes en los dos idiomas, el ZIP del kit (49 archivos, sin `.env`, `.dev.vars`, dependencias ni estado local de wrangler) y `dist/`. `npm run check` recorre lecciones, escenas, preguntas, pasos y controles, dibuja los modelos en las cuatro apariencias y los dos idiomas, controla el mapa (siete escenarios, cada parada sobre una pieza que existe, una ficha bilingüe por pieza), los pasos de cuenta marcados como opcionales, el visor (su puerto, su carpeta en solo lectura, la CSP, solo GET y sus datos al día con las lecciones y el mapa), imágenes fijadas por digest, puertos solo en 127.0.0.1, el contenido del ZIP, enlaces, codificación y estilo.

En un navegador Chromium sin interfaz se cargaron las 29 páginas (portada, "Qué es Cloudflare", el mapa y las 26 lecciones), en los dos idiomas, a 1280 por 900 y a 390 por 844: sin errores ni avisos en la consola, sin excepciones y sin desborde horizontal, cada una con su título y el idioma pedido. En las 26 lecciones, en los dos idiomas y a 1280 px, se recorrieron las tres escenas, las cuatro pestañas y las tres preguntas del control respondidas bien, con el puntaje 3 / 3 al final. En el mapa se recorrieron los siete escenarios parada por parada, en los dos idiomas y en los dos tamaños, 180 paradas en total. Los 26 modelos se dibujaron además en cada escena y en cada valor de sus controles, en los dos idiomas, midiendo en el navegador que cada texto quede dentro de su caja y del dibujo. La portada, el mapa y seis lecciones se revisaron también en capturas, en las cuatro apariencias y a 390 px.

### Reproducir

Desde la carpeta del curso, con Docker y Compose v2:

```text
npm run build
npm run check
node scripts/test-labs.mjs --fresh
cd labs
docker compose up -d --wait
cd ..
npm run test:visor
```

La suite toca solo el proyecto Compose `prumathe-cf`, corre los comandos de cada lección en orden y escribe su informe en `.qa/labs.json`. `--fresh` saca antes los contenedores y volúmenes de ese proyecto; `--from=N` retoma desde una lección, suponiendo hechas las anteriores; `--only=N` corre una sola. Repetida sobre el mismo kit, una lección puede encontrar hecho lo que hizo la primera vez: un movimiento ya guardado se informa como tal, y su control falla. Los pasos opcionales corren solo con `--account` y un `labs/.env` con la cuenta y el token. Los pasos de las lecciones 01, 02 y 04 consultan sitios públicos de Cloudflare y el DNS público, así que necesitan salida a internet. `npm run test:visor` lee los eventos que dejó la corrida en el volumen del borde, así que va después de ella y con el kit levantado; no corre comandos de las lecciones. La limpieza y sus efectos sobre los datos están en [labs/README.md](../labs/README.md).

### Fuera de esta evidencia

No se ejecutaron los 8 pasos opcionales de cuenta ni ningún paso sobre una zona: los datos de la plataforma y del plan gratuito que citan las lecciones salen de la documentación oficial, verificada el 14 de noviembre de 2026, y no de una cuenta. Que R2 pida un medio de pago para activarse en el plan gratuito no se pudo verificar en la documentación. No se ejecutaron macOS ni Linux como host ni ARM64. La interfaz se probó en Chromium; no en Firefox ni en Safari. Los tiempos y los valores de `colo` y `country` valen para esta máquina y esta conexión; en otra pueden ser otros, y las lecciones lo dicen. El workflow de GitHub del curso se entrega como configuración y no se ejecutó en GitHub; no se publicó el sitio con este curso.
