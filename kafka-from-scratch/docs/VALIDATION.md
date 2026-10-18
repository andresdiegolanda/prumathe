# Validation / Validación

Two layers of evidence: what the Docker suites proved on the platform, and what the static checks and browser passes proved on the website. Each entry says when it ran and against which version, and unexecuted checks are listed as such.

Dos capas de evidencia: lo que las suites Docker probaron sobre la plataforma, y lo que las verificaciones estáticas y las pasadas de navegador probaron sobre el sitio. Cada entrada dice cuándo corrió y contra qué versión, y las verificaciones no ejecutadas figuran como tales.

## 1.4.0, 18 October 2026 / 1.4.0, 18 de octubre de 2026

A discussion per lesson (GitHub Discussions through giscus) at the end of the Go deeper tab, loaded only on demand on the published site; configuration in `assets/forum.js`, CSP in `_headers`. Image tags, `package.json` and the two `pom.xml` move to 1.4.0 by convention; lab content did not change, so the Docker evidence of 1.0.0 still applies and the suites were not rerun. Executed: `npm run build` and `npm run check` with the new forum checks; the card and the fallback link rendered in both languages in a headless browser without console errors; with the identifiers of the public repository and of the category "Kafka from scratch" in `assets/forum.js`, the button loaded the real widget over https in a headless browser (frame from giscus.app, 0 comments, sign in with GitHub) for lesson 14. Not executed: posting a comment, which needs a GitHub session; the thread of each lesson is created by giscus with the first comment.

Una discusión por lección (GitHub Discussions a través de giscus) al final de la pestaña Profundizá, cargada solo a pedido en el sitio publicado; configuración en `assets/forum.js`, CSP en `_headers`. Las etiquetas de imagen, `package.json` y los dos `pom.xml` pasan a 1.4.0 por convención; el contenido del lab no cambió, así que la evidencia Docker de la 1.0.0 sigue valiendo y las suites no se repitieron. Ejecutado: `npm run build` y `npm run check` con los controles nuevos del foro; la tarjeta y el enlace alternativo renderizados en los dos idiomas en un navegador sin interfaz, sin errores de consola; con los identificadores del repositorio público y de la categoría "Kafka from scratch" en `assets/forum.js`, el botón cargó el widget real por https en un navegador sin interfaz (marco de giscus.app, 0 comentarios, iniciar sesión con GitHub) en la lección 14. No ejecutado: publicar un comentario, que necesita una sesión de GitHub; el hilo de cada lección lo crea giscus con el primer comentario.

## 1.3.0, 18 October 2026 / 1.3.0, 18 de octubre de 2026

New page `what-kafka-is.html`, outside the lesson count: what Kafka is, where it came from, where it fits and where it does not, and how to decide; reached from the home page, the help dialog and the references of lesson 00, and opening the course notes. Course version and both local image tags move to 1.3.0; labs, lessons and Kafka 4.1.2 are unchanged.

Página nueva `what-kafka-is.html`, fuera de la numeración: qué es Kafka, de dónde salió, dónde encaja y dónde no, y cómo decidir; se llega desde la portada, el diálogo de ayuda y las referencias de la lección 00, y abre los apuntes. La versión del curso y las dos etiquetas de imagen locales pasan a 1.3.0; labs, lecciones y Kafka 4.1.2 no cambian.

### Executed / Ejecutado

- Build and static check: PASS, including every string of the page in both languages without dashes, its sources with URLs, the embedded log model in the four skins and the local links of the new page.
- Browser: the page in Classic, Dark, Reading and Projector, in both languages, at 1280 px and at 390 px; the home page with its new button; no console errors.
- Sources opened on 18 October 2026: the Apache Kafka introduction and use cases pages; the LinkedIn announcement of 11 January 2011; the Apache Incubator record (entered 4 July 2011, graduated 23 October 2012); the LinkedIn Engineering article of 16 December 2013; the Apache Kafka downloads page (3.3.1 released 3 October 2022 with KIP-833, 4.0.0 released 18 March 2025); the 4.0.0 announcement (first major release without ZooKeeper, KIP-848 generally available, early access to KIP-932); the 4.2.0 announcement of 17 February 2026 (share groups production ready); the 0.11.0.0 release notes (KIP-98 transactions) and the Apache release registry entry for 0.11.0.0 (released 28 June 2017, https://releases.apache.org/api/cle/release/kafka/0.11.0.0). Confluent names Jay Kreps, Jun Rao and Neha Narkhede as co-founders on its site; the page gives no founding year because no official page states it.

- Construcción y control estático: PASS, incluidas todas las cadenas de la página en los dos idiomas sin guiones, sus fuentes con URL, el modelo de log incluido en las cuatro apariencias y los enlaces locales de la página nueva.
- Navegador: la página en Clásico, Oscuro, Lectura y Proyector, en los dos idiomas, a 1280 px y a 390 px; la portada con su botón nuevo; sin errores de consola.
- Fuentes abiertas el 18 de octubre de 2026: las páginas de introducción y casos de uso de Apache Kafka; el anuncio de LinkedIn del 11 de enero de 2011; el registro de la incubadora de Apache (entró el 4 de julio de 2011, graduó el 23 de octubre de 2012); el artículo de LinkedIn Engineering del 16 de diciembre de 2013; la página de descargas de Apache Kafka (3.3.1 publicada el 3 de octubre de 2022 con KIP-833, 4.0.0 publicada el 18 de marzo de 2025); el anuncio de 4.0.0 (primera versión mayor sin ZooKeeper, KIP-848 disponible en general, acceso anticipado a KIP-932); el anuncio de 4.2.0 del 17 de febrero de 2026 (share groups production ready); las notas de la versión 0.11.0.0 (transacciones, KIP-98) y el registro de versiones de Apache para 0.11.0.0 (publicada el 28 de junio de 2017, https://releases.apache.org/api/cle/release/kafka/0.11.0.0). Confluent nombra en su sitio a Jay Kreps, Jun Rao y Neha Narkhede como cofundadores; la página no da año de fundación porque ninguna página oficial lo afirma.

### Not executed / No ejecutado

The Docker suites were not rerun; the lab content did not change in 1.3.0, only the image tags. Everything pending for 1.2.0 below remains pending.

Las suites Docker no se repitieron; el contenido del lab no cambió en 1.3.0, solo las etiquetas de imagen. Todo lo pendiente de la 1.2.0 sigue pendiente.

## 1.2.0, 18 October 2026 / 1.2.0, 18 de octubre de 2026

Lesson 00 adds the course method and Docker setup in a new initial unit. The course now has 30 lessons, 9 units, 90 scenes, 134 lab steps and 90 checkpoint questions. Existing lesson numbers and Java lab arguments are preserved. Course versions and both local image tags are 1.2.0; Kafka stays at 4.1.2.

La lección 00 agrega el método del curso y la puesta a punto de Docker en una unidad inicial. El curso tiene 30 lecciones, 9 unidades, 90 escenas, 134 pasos de lab y 90 preguntas. Se conservan los números de lección existentes y los argumentos del cliente Java. Las versiones del curso y ambas etiquetas locales son 1.2.0; Kafka sigue en 4.1.2.

### Executed / Ejecutado

- Build and static check: PASS. The check includes all models in four appearances and two languages, local links, lab command coverage including the literal `case "help"`, full version agreement with both POM files, distinct options in both languages and generated numbering.
- Browser: lesson 00 in all eight language and appearance combinations, its three model steps, four lab steps, three questions, footer 00, map 00 and 01, and navigation to lesson 01 with footer 01. The cycle marker, scene and lab position survive language and appearance changes. An incorrect answer can be retried; three correct answers show 3 / 3 while the lab stays unmarked. Home shows nine units. No console errors were observed.
- Glossary: followed Event to 02 / event-log, Broker to 01 / start and Share group to 27 / share-groups in the browser. All 46 entries were compared with their previous destination slugs.
- Progress: all 29 old numeric keys map to their original lessons, never to 00. Repeated migration, mixed numeric and slug entries, malformed storage and blocked writes were checked. Slugs avoid shifting progress on future insertions.
- Original lesson content was compared with the previous version: only the shared preparation reference, the image tag printed in lesson 01 and the setup reference in lesson 29 changed.
- Docker: all four lesson 00 steps passed using the ZIP downloaded through the course button and extracted locally. Windows, Docker Desktop 4.55.0, Compose v2.40.3-desktop.1, Engine 29.1.3, Linux amd64 containers. Compose configuration passed. The cluster reused existing named volumes; this was not a fresh installation. The missing lab image was built, including Maven packaging, and help exited successfully.
- Changed text files were read back as UTF-8 without BOM, with LF endings; no en or em dashes. Git whitespace check passed.

- Construcción y control estático: PASS. El control incluye todos los modelos en cuatro apariencias y dos idiomas, enlaces locales, comandos del lab con el `case "help"` literal, versión completa coherente con ambos POM, opciones distintas en ambos idiomas y numeración generada.
- Navegador: lección 00 en las ocho combinaciones de idioma y apariencia, sus tres pasos del modelo, cuatro pasos del lab, tres preguntas, pie 00, mapa 00 y 01, y navegación a la lección 01 con pie 01. El señalador del circuito, la escena y el paso del lab se conservan al cambiar idioma y apariencia. Una respuesta incorrecta se puede reintentar; tres aciertos muestran 3 / 3 y el lab sigue sin marcarse. La portada muestra nueve unidades. No se observaron errores de consola.
- Glosario: se siguieron Evento a 02 / event-log, Broker a 01 / start y Share group a 27 / share-groups en el navegador. Se compararon las 46 entradas con sus slugs de destino anteriores.
- Avance: las 29 claves numéricas anteriores corresponden a sus lecciones originales, nunca a la 00. Se comprobaron migración repetida, claves numéricas y slugs mezclados, almacenamiento inválido y escrituras bloqueadas. Los slugs evitan desplazar el avance ante futuras inserciones.
- Se comparó el contenido de las lecciones anteriores: solo cambiaron la referencia compartida de preparación, la etiqueta de imagen impresa en la lección 01 y la referencia de puesta a punto en la lección 29.
- Docker: pasaron los cuatro pasos de la 00 con el ZIP descargado desde el botón del curso y descomprimido localmente. Windows, Docker Desktop 4.55.0, Compose v2.40.3-desktop.1, Engine 29.1.3, contenedores Linux amd64. Pasó la configuración de Compose. El clúster reutilizó volúmenes con nombre existentes; no fue una instalación limpia. Se construyó la imagen lab faltante, incluido el empaquetado Maven, y help terminó correctamente.
- Se releyeron los textos modificados como UTF-8 sin BOM, con finales LF y sin guiones largos ni cortos. Pasó la comprobación de espacios de Git.

Final build and check lines / Últimas líneas de build y check:

```text
Built 30 independent lesson pages, bilingual text notes, a 32-file lab ZIP, and dist/ for Cloudflare Pages.
PASS: 30 pages, 90 bilingual scenes, 134 bilingual lab steps, 90 checkpoint questions, all diagram variants in 4 skins, local links, real Murmur2 vectors, lab command coverage and version consistency.
```

Observed lab output, relevant excerpts / Salida observada del lab, fragmentos relevantes:

```text
1. docker compose version
Docker Compose version v2.40.3-desktop.1

   docker version
Server: Docker Desktop 4.55.0 (213807)
 Engine:
  Version:          29.1.3
  OS/Arch:          linux/amd64

2. Download ZIP, extract, cd labs / Descargar ZIP, descomprimir, cd labs
Path
----
D:\_claude\prumathe\tmp\lesson00-kit-2026-10-18\labs
Test-Path compose.yaml: True

3. docker compose up -d --wait
 Container kafka-from-scratch-kafka1-1  Healthy
 Container kafka-from-scratch-kafka2-1  Healthy
 Container kafka-from-scratch-kafka3-1  Healthy

4. docker compose run --rm lab help
#18 naming to docker.io/library/kafka-course-lab:1.2.0 done
Kafka course lab / Laboratorio Kafka
Commands: cluster, prepare N, seed N, describe N, read N [read_committed], read-topic NAME [isolation], put N KEY VALUE, offsets N, expand N COUNT, consume N GROUP, watch N GROUP, reset N GROUP, lag N GROUP, describe-group GROUP, benchmark N LINGER BATCH, compact-seed N, table N, delivery crash|resume, duplicate N, dedup N, transactions N, eos N [abort], verify 27, schema compatible|incompatible, connect-status, outbox create|crash|relay, streams 20, windows 21, window-seed 21, acl setup|writer|reader, skew N, mirror, share.
Run prepare only after stopping this lesson's consumers. It resets only that lesson's topics.
```

Compose first attempted to pull the local image name and reported pull access denied, then built the included source successfully. This matches the documented behavior of a service with both build and image and no explicit pull policy.

Compose intentó primero descargar el nombre de imagen local e informó pull access denied; después construyó correctamente el código incluido. Coincide con el comportamiento documentado de un servicio con build e image sin una política explícita de descarga.

### Official sources opened / Fuentes oficiales abiertas

The Docker source in reference.js points to [Docker · Compose](https://docs.docker.com/compose/). The following details were checked on 18 October 2026.

La fuente Docker en reference.js apunta a [Docker · Compose](https://docs.docker.com/compose/). Los siguientes detalles se contrastaron el 18 de octubre de 2026.

- Engine 25 or newer for start interval / Engine 25 o superior para start interval: [HEALTHCHECK](https://docs.docker.com/reference/dockerfile/#healthcheck).
- Compose 2.20.2 or newer for start_interval / Compose 2.20.2 o superior para start_interval: [Compose healthcheck](https://docs.docker.com/reference/compose-file/services/#healthcheck).
- Wait for running or healthy services / Esperar servicios en ejecución o saludables: [docker compose up](https://docs.docker.com/reference/cli/docker/compose/up/).
- Compose version is distinct from Server Engine version / La versión de Compose se distingue de la versión del Engine en Server: [docker compose version](https://docs.docker.com/reference/cli/docker/compose/version/) and / y [docker version](https://docs.docker.com/reference/cli/docker/version/).
- Pull first, then build the missing image / Intentar descargar primero y construir la imagen faltante después: [Compose build and image](https://docs.docker.com/reference/compose-file/build/#using-build-and-image).

### Not executed / No ejecutado

The complete Docker suites core, failures, integrations and spring were not rerun for 1.2.0. The Spring image was not rebuilt. Native ARM, a clean Docker installation with empty volumes, remote GitHub Actions and Cloudflare deployment remain unverified. Lesson duration and cluster memory with and without optional services were not measured; the repository board has an owned measurement card. The new scene gives no duration or memory figures.

Las suites Docker completas core, failures, integrations y spring no se repitieron para 1.2.0. No se reconstruyó la imagen Spring. Quedan sin verificar ARM nativo, una instalación Docker limpia con volúmenes vacíos, GitHub Actions remoto y el despliegue Cloudflare. No se midieron duración por lección ni memoria con y sin servicios opcionales; el tablero tiene una card de medición con dueño. La escena nueva no da cifras de tiempo ni memoria.

## 1.1.0, 17 October 2026 / 1.1.0, 17 de octubre de 2026

Changes in this version: four skins (Classic, Dark, Reading, Projector); three checkpoint questions per lesson; the Java client split into one class per subject and formatted; JVM options moved from `JAVA_TOOL_OPTIONS` into the Dockerfiles; broker health checks every 30 s after start; Java release 21 in the lab client; text corrections (lesson 14 step 1, lesson 2 scene 1 in Spanish, lesson 6 question, lesson 23 step 3, lesson 27 scene 3); version and date read from `curriculum.js`; image tags `:1.1`.

Cambios de esta versión: cuatro apariencias (Clásico, Oscuro, Lectura, Proyector); tres preguntas de control por lección; el cliente Java separado en una clase por tema y formateado; opciones de JVM movidas de `JAVA_TOOL_OPTIONS` a los Dockerfile; health checks de los brokers cada 30 s después del arranque; Java release 21 en el cliente; correcciones de texto (lección 14 paso 1, lección 2 escena 1 en español, pregunta de la lección 6, lección 23 paso 3, lección 27 escena 3); versión y fecha leídas de `curriculum.js`; etiquetas de imagen `:1.1`.

Executed / Ejecutado:

- `npm run build` and `npm run check`: 29 pages, 87 scenes, 130 lab steps, 87 checkpoint questions, every model rendered in 4 skins and 2 languages, local links, Murmur2 vectors, lab command coverage, version consistency and the no-dash rule. PASS.
- The lab client compiled and packaged with Maven (Java 21, `kafka-clients` and `kafka-streams` 4.1.2); `java -jar course-lab.jar help` runs. The split moved code without changing it: every command keeps its arguments, settings and output lines.
- Browser pass at 1280 × 720: lesson 08 in the four skins (scenes, lab, checkpoint), lesson 28 checkpoint with three questions, skin picker persistence (saved choice, address updated), home page in Dark. Reading skin: scrolling document with sticky header, model with scene dots, all steps, checkpoint answered with scroll position kept. Narrow screen at 390 × 844: Classic lab view and Reading header fit without horizontal overflow. No console errors.

Not executed in this version / No ejecutado en esta versión:

- The Docker suites (`core`, `failures`, `integrations`, `spring`) have not been rerun since the client was split, the Dockerfiles changed and the health checks changed. Until they pass again on a rebuilt `kafka-course-lab:1.1`, the platform evidence below belongs to 1.0.0. Run, from the course root with the cluster up: `docker compose build lab`, then the four suites in order.
- Native ARM execution, remote GitHub Actions and a live Cloudflare deployment, as in 1.0.0.

Las suites Docker (`core`, `failures`, `integrations`, `spring`) no se volvieron a ejecutar desde que se separó el cliente y cambiaron los Dockerfile y los health checks. Hasta que vuelvan a pasar sobre una imagen `kafka-course-lab:1.1` reconstruida, la evidencia de plataforma de abajo pertenece a 1.0.0. Ejecutá, desde la raíz del curso con el clúster levantado: `docker compose build lab` y después las cuatro suites en orden. Tampoco se verificaron ejecución ARM nativa, GitHub Actions remoto ni un despliegue Cloudflare real, como en 1.0.0.

## 1.0.0, 15 October 2026 / 1.0.0, 15 de octubre de 2026

Executed with Linux x86 containers on Windows Docker Desktop. Apache Kafka broker and client baseline: 4.1.2. Native client and Spring application built inside the supplied Maven and Java 21 images. Spring Boot: 3.5.16.

Ejecutado con contenedores Linux x86 en Docker Desktop para Windows. Base de Kafka: 4.1.2. El cliente Java y la aplicación Spring compilaron con las imágenes Maven y Java 21 incluidas. Spring Boot: 3.5.16.

### Real Docker experiments / Experimentos Docker reales

| Suite | Result / Resultado | Evidence checked / Evidencia verificada |
|---|---|---|
| `core` | PASS, 86 operations / operaciones | Records, headers, replay, keys and partition expansion, 4,000 batched writes, committed offsets and lag, table reconstruction, duplicate effects, producer idempotence boundaries, committed/aborted visibility, transactional read-process-write, Avro compatibility, skew and six-order capstone / Mensajes, cabeceras, replay, claves, lotes, offsets, lag, tablas, duplicados, transacciones, Avro y actividad integradora |
| `failures` | PASS, 29 operations / operaciones | Reads after broker loss, rejection below required ISR, controller quorum surviving one loss, recovery, asynchronous retention and two-member rebalance / Lecturas tras una caída, rechazo por ISR insuficiente, quórum, recuperación, retención y rebalanceo |
| `integrations` | PASS, 51 operations / operaciones | File source Connect task, PostgreSQL outbox crash and duplicate, Streams counts and fresh-container state restoration, event-time windows, writer ACL allowed and reader denied, independent-cluster copy, share-group release/redelivery/accept / Connect, outbox con caída y duplicado, restauración Streams, ventanas, ACL, copia entre clústeres y consumo compartido |
| `spring` | PASS, 10 Compose operations plus HTTP assertions / operaciones y verificaciones HTTP | Typed JSON publication and consumption, key preservation, HTTP 202 broker metadata, two logical sends with different offsets, committed progress, empty observation list after restart, new consumption after restart and HTTP 400 for invalid quantity / JSON tipado, clave, metadatos, duplicados, avance confirmado, reinicio, consumo posterior y validación de entrada |

Reproduce from the course root after building `labs` and starting the cluster:

Reproducí desde la raíz del curso, después de construir los clientes y levantar el clúster:

```sh
node scripts/test-labs.mjs core
node scripts/test-labs.mjs failures
node scripts/test-labs.mjs integrations
node scripts/test-labs.mjs spring
```

Run `core` before `failures`; the latter verifies the capstone output prepared by the former. Suites reset named course topics, launch short-lived course containers and intentionally cause lab failures. Each writes detailed local evidence to ignored `.qa/labs-<suite>.json`. Results are not guarantees about production performance or a different architecture.

Ejecutá `core` antes de `failures`: la segunda verifica la salida integradora preparada por la primera. Las suites reinician tópicos del curso, levantan contenedores temporales y provocan fallas intencionales. Guardan evidencia local en `.qa/labs-<suite>.json`, fuera de Git. Los resultados no garantizan rendimiento productivo ni otra arquitectura.

### Website / Sitio

- Build and static validation passed for 29 lesson pages, 87 paired teaching scenes, 130 paired lab steps and 29 checkpoints. Every lesson has a Docker activity, a source reference and a rendered model. Local HTML asset references and Java command coverage passed.
- English and Spanish scenes were traversed in a browser at 1280 × 720. All Spanish lab steps and all Spring steps in both languages were checked for explanation-panel overflow. No overflow was found at that size.
- Narrow-screen checks at 390 × 844 covered home pagination, visual/explanation switching, activity steps and the Spring deep link. The document stayed fixed to the viewport. Very short viewports or high zoom can scroll bounded content panels to preserve access.
- Language switching, wrong and correct checkpoint feedback, glossary search, expanded-diagram inspection and lab navigation were exercised. Progress is a local learner declaration; it is never presented as automated Docker verification.
- Copy-button success feedback was checked in the page; the operating-system clipboard contents were not asserted.
- Diagram calculations include known Kafka Java-compatible Murmur2 test vectors. Visual simulations are explicitly separate from real lab execution.

- Build y validación estática aprobados: 29 páginas, 87 escenas, 130 pasos y 29 controles en ambos idiomas. Cada lección tiene actividad Docker, fuente y modelo.
- Se recorrieron escenas en inglés y español a 1280 × 720. Se revisaron todos los pasos en español y los de Spring en ambos idiomas: no hubo desborde del panel de explicación a ese tamaño.
- Se probaron índice, cambio de superficie, pasos y enlace directo de Spring a 390 × 844. El documento quedó fijo al viewport; con poco alto o mucho zoom los paneles internos mantienen accesible el contenido.
- Se ejercitaron idioma, respuestas correctas e incorrectas, búsqueda del glosario, inspección ampliada y navegación. El progreso es una declaración local del estudiante.
- Se comprobó la confirmación del botón Copiar en la página; no se verificó el contenido del portapapeles del sistema operativo.
- Se verificó Murmur2 con vectores compatibles con Java. Los modelos visuales están identificados como simulaciones.

## Explicit limits / Límites explícitos

The ACL lab uses isolated SASL/PLAIN without TLS. The schema lab uses Avro compatibility checks, not a running schema registry. The outbox lab uses a polling relay, not Debezium. The mirror lab uses a one-shot copy client, not MirrorMaker 2. Share groups are an isolated Kafka 4.1 preview (production-ready since Kafka 4.2). The Spring observation list is transient and is not a durable business sink. Combined broker and controller roles keep the course small. None of these is presented as a production deployment template.

El laboratorio ACL usa SASL/PLAIN aislado sin TLS. Esquemas usa validación Avro, sin servidor de registro. Outbox usa polling, no Debezium. El espejo usa copia de una pasada, no MirrorMaker 2. Share groups es una preview aislada de Kafka 4.1 (production-ready desde Kafka 4.2). La lista Spring es transitoria, no un destino durable de negocio. Los roles combinados achican el laboratorio. Ninguno se presenta como plantilla productiva.
