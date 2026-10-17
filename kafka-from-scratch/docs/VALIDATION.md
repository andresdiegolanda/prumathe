# Validation / Validación

Two layers of evidence: what the Docker suites proved on the platform, and what the static checks and browser passes proved on the website. Each entry says when it ran and against which version, and unexecuted checks are listed as such.

Dos capas de evidencia: lo que las suites Docker probaron sobre la plataforma, y lo que las verificaciones estáticas y las pasadas de navegador probaron sobre el sitio. Cada entrada dice cuándo corrió y contra qué versión, y las verificaciones no ejecutadas figuran como tales.

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
