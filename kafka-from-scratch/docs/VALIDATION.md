# Validation / Validación

Two layers of evidence: what the Docker suites proved on the platform, and what the static checks and browser passes proved on the website. Each entry says when it ran and against which version, and unexecuted checks are listed as such.

Dos capas de evidencia: lo que las suites Docker probaron sobre la plataforma, y lo que las verificaciones estáticas y las pasadas de navegador probaron sobre el sitio. Cada entrada dice cuándo corrió y contra qué versión, y las verificaciones no ejecutadas figuran como tales.

## 1.6.0, 20 October 2026 / 1.6.0, 20 de octubre de 2026

Lesson 25, Looking is not touching: Kafbat UI as the optional `kafbat` service of `labs/compose.yaml` (image `ghcr.io/kafbat/kafka-ui:v1.5.0` pinned by digest `sha256:7cda86a3...6fd1`, read-only, 127.0.0.1:18081, `JAVA_OPTS=-Xmx256m`), a new `console` model, five lab steps on topic `lab28` with the group `console`, three questions and the source `kafbat`. Lessons 25 to 29 became 26 to 30; unit 6 has five lessons, declared in `unitStarts`; the glossary entries of mirroring and share groups, the live viewer's lesson table and the progress migration of 1.1 (now by slug) follow the new numbering. The Java client accepts topic 28 (three partitions, six records spread by hand, known group `console`). Image tags, `package.json` and both `pom.xml` move to 1.6.0: 31 lessons, 93 scenes, 140 steps, 93 questions.

Product facts, checked on 20 October 2026: Kafbat UI is Apache-2.0; v1.5.0 (20 April 2026) is its latest release; the digest is the one ghcr.io serves for that tag; `KAFKA_CLUSTERS_0_READONLY` enables read-only mode (configuration properties page); the mode is enforced by the console's own API filter, which refuses every non-GET request to a read-only cluster except message filtering and analysis (`ReadOnlyModeFilter.java`); the documented minimum ACLs for read-only use are READ and DESCRIBE_CONFIGS on topics, DESCRIBE on groups, DESCRIBE and DESCRIBE_CONFIGS on the cluster. Version 1.5.0 is built on Spring Boot 3.5.13 with Confluent 7.9.5 clients (the Apache Kafka 3.9 line) and its image runs Java 25.

Executed on Linux against the three-node KRaft 4.1.2 test cluster, with the lab client built from these sources and Kafbat UI v1.5.0 from its release jar: `prepare 28`, `seed 28` and `reset 28 console` print what lesson 25 expects; the console reports cluster `course` ONLINE, three brokers, controller KRAFT, `readOnly` true; the group `console` shows EMPTY and total lag 6 (2 per partition); creating a topic, resetting the group's offsets and deleting `lab28` through its API return 405; browsing `lab28` streams six records. In a headless browser the console shows no button to add a topic, Delete selected topics and Produce Message disabled, and Consumers with State EMPTY and Total lag 6. Lesson 25 renders in the four skins and both languages at 1440 by 900, and in Classic and Reading at 390 by 844, with the model toggle, no console errors and no horizontal overflow. `npm run build` and `npm run check` pass.

Executed on the course laptop (Windows 11, Docker Desktop 4.55.0, Compose v2.40.3) on 20 October 2026: before writing the lesson, the image ran against the course cluster in read-only mode (version 4.1-IV1, three brokers, 38 topics; a topic creation returned 405; browsing `lab6` left the nine consumer groups unchanged; about 570 MiB without a heap limit). Then `docker compose build lab` built `kafka-course-lab:1.6.0`, `docker compose up -d visor` restarted the viewer on it, and the new `kafbat` suite of `scripts/test-labs.mjs` passed (9 operations: the same lag in the console and in `kafka-consumer-groups.sh`, three writes refused with 405, six records browsed, the groups and the bookmark unchanged). With `-Xmx256m` the console used about 330 to 350 MiB.

Not executed: the `core`, `failures`, `integrations`, `spring` and `visor` suites on 1.6.0. The Java change only widens the topic range to 28 and adds that topic's settings, and the lab commands of the other lessons did not change; the image is new, so those suites remain the evidence of 1.5.0.

Lección 25, Mirar no es tocar: Kafbat UI como el servicio opcional `kafbat` de `labs/compose.yaml` (imagen `ghcr.io/kafbat/kafka-ui:v1.5.0` fijada por el digest `sha256:7cda86a3...6fd1`, solo lectura, 127.0.0.1:18081, `JAVA_OPTS=-Xmx256m`), un modelo nuevo `console`, cinco pasos sobre el tópico `lab28` con el grupo `console`, tres preguntas y la fuente `kafbat`. Las lecciones 25 a 29 pasaron a ser 26 a 30; la unidad 6 tiene cinco lecciones, declaradas en `unitStarts`; las entradas del glosario de mirroring y share groups, la tabla de lecciones del visor en vivo y la migración del avance de la 1.1 (ahora por slug) siguen la numeración nueva. El cliente Java acepta el tópico 28 (tres particiones, seis registros repartidos a mano, grupo conocido `console`). Las etiquetas de imagen, `package.json` y los dos `pom.xml` pasan a 1.6.0: 31 lecciones, 93 escenas, 140 pasos y 93 preguntas.

Hechos de producto, verificados el 20 de octubre de 2026: Kafbat UI es Apache-2.0; v1.5.0 (20 de abril de 2026) es su última versión publicada; el digest es el que ghcr.io sirve para esa etiqueta; `KAFKA_CLUSTERS_0_READONLY` activa el modo de solo lectura (página de propiedades de configuración); ese modo lo aplica el filtro de la API de la propia consola, que rechaza todo pedido que no sea GET a un clúster de solo lectura, salvo el filtrado y el análisis de mensajes (`ReadOnlyModeFilter.java`); los ACL mínimos documentados para usarla en solo lectura son READ y DESCRIBE_CONFIGS sobre tópicos, DESCRIBE sobre grupos, DESCRIBE y DESCRIBE_CONFIGS sobre el clúster. La versión 1.5.0 está hecha sobre Spring Boot 3.5.13 con clientes de Confluent 7.9.5 (la línea 3.9 de Apache Kafka) y su imagen corre Java 25.

Ejecutado en Linux contra el clúster de prueba KRaft 4.1.2 de tres nodos, con el cliente del laboratorio construido desde estas fuentes y Kafbat UI v1.5.0 desde el jar de su versión: `prepare 28`, `seed 28` y `reset 28 console` imprimen lo que espera la lección 25; la consola informa el clúster `course` ONLINE, tres brokers, controlador KRAFT y `readOnly` en true; el grupo `console` aparece EMPTY con lag total 6 (2 por partición); crear un tópico, reiniciar los offsets del grupo y borrar `lab28` por su API devuelven 405; mirar `lab28` trae seis registros. En un navegador sin interfaz la consola no muestra el botón para agregar un tópico, muestra Delete selected topics y Produce Message deshabilitados, y Consumers con State EMPTY y Total lag 6. La lección 25 se dibuja en las cuatro apariencias y los dos idiomas a 1440 por 900, y en Clásico y Lectura a 390 por 844, con el botón del modelo, sin errores de consola ni desborde horizontal. `npm run build` y `npm run check` pasan.

Ejecutado en la laptop del curso (Windows 11, Docker Desktop 4.55.0, Compose v2.40.3) el 20 de octubre de 2026: antes de escribir la lección, la imagen corrió contra el clúster del curso en solo lectura (versión 4.1-IV1, tres brokers, 38 tópicos; crear un tópico devolvió 405; mirar `lab6` dejó iguales los nueve grupos de consumidores; unos 570 MiB sin límite de heap). Después, `docker compose build lab` construyó `kafka-course-lab:1.6.0`, `docker compose up -d visor` reinició el visor sobre ella, y la suite nueva `kafbat` de `scripts/test-labs.mjs` pasó (9 operaciones: el mismo lag en la consola y en `kafka-consumer-groups.sh`, tres escrituras rechazadas con 405, seis registros vistos, los grupos y el señalador sin cambios). Con `-Xmx256m` la consola usó unos 330 a 350 MiB.

No ejecutado: las suites `core`, `failures`, `integrations`, `spring` y `visor` sobre la 1.6.0. El cambio en Java solo amplía el rango de tópicos a 28 y agrega la configuración de ese tópico, y los comandos de las demás lecciones no cambiaron; la imagen es nueva, así que esas suites siguen siendo la evidencia de la 1.5.0.

## 1.5.0, 19 October 2026 / 1.5.0, 19 de octubre de 2026

Live viewer: the `visor` service of `labs/compose.yaml` (the same `kafka-course-lab` image with the `visor` command, published on 127.0.0.1:18090), the Java classes `Visor` and `ClusterWatch`, and the page in `labs/src/main/resources/visor/`. Lesson 01 gains the step that opens it (135 steps in total) and every lesson with a practice topic names, in its lab tab, which `labN` to follow. Image tags, `package.json` and both `pom.xml` move to 1.5.0.

Executed on Linux, against a three-node KRaft cluster of Kafka 4.1.2 with the broker settings of `compose.yaml`, with the lab client and the viewer built by Maven from these sources. With the viewer running, these lesson steps ran and the viewer reported each change: `prepare 6`, `seed 6`, `consume 6 kitchen` and `watch 6 billing` (records with their headers, two groups with their bookmarks and states); `prepare 9`, `seed 9`, stopping node 1 (broker down, leader of lab9 P0 from 1 to 2, in-sync replicas without 1, active controller from 1 to 2, and the notice that with min.insync.replicas 2 writes with acks=all are still accepted) and its return (in-sync replicas complete again); `prepare 12` and two `seed 12` (the start of the log moved twice by retention); `prepare 13`, `compact-seed 13` and `put 13 A 40` (offsets 0 and 1 removed by compaction, a tombstone with a null value); `prepare 16` and `transactions 16` (both values, read as read_uncommitted, with the offset gaps of the transaction markers); all three nodes stopped and started again (the page says the cluster does not answer, keeps the last reading, and fills in again by itself). The groups listed by the Admin API were only the lessons' ones: the viewer created no group or topic. It completed a reading every 500 ms. In a headless browser at 1440 by 1000, 1280 by 760 and 390 by 844, in both languages: hovering or focusing a record shows its content, a click on each kind of object (broker, topic, partition, replica, record, end of the log, bookmark, group) fills the detail panel, pause stops the redrawing, with no console errors and no horizontal overflow.

Executed on the course laptop (Windows 11, Docker Desktop 4.55.0, Compose v2.40.3): `docker compose build lab` built `kafka-course-lab:1.5.0`, and `docker compose up -d visor` started the viewer without naming its profile. It read the running course cluster (3 brokers, 38 topics, 9 groups) every 500 ms using about 170 MiB, and that state rendered in the browser without errors.

Executed on the same laptop the same day, with the viewer open and in this order: the `core` suite (86 operations), `failures` (25 operations) and `visor` (12 operations: the page, read-only HTTP, brokers and controller, records with headers, group bookmarks, no groups or topics of its own, broker failure, leader change and recovery). All three passed against `kafka-course-lab:1.5.0`, so the lab commands print what the lessons expect with the viewer open; the viewer was started again afterwards. Once, while `failures` had a node stopped, a reading showed the cluster as not answering and the following ones recovered by themselves; how long it lasted was not measured.

Then, on the same laptop and with the viewer still open, `integrations` (50 operations, starting and stopping the optional services it uses) and `spring` (10 operations, after building `kafka-course-spring:1.5.0`) passed as well. All five Docker suites have therefore passed on 1.5.0.

Visor en vivo: el servicio `visor` de `labs/compose.yaml` (la misma imagen `kafka-course-lab` con el comando `visor`, publicado en 127.0.0.1:18090), las clases Java `Visor` y `ClusterWatch` y la página en `labs/src/main/resources/visor/`. La lección 01 suma el paso que lo abre (135 pasos en total) y cada lección con tópico de práctica dice, en su pestaña de laboratorio, qué `labN` seguir. Las etiquetas de imagen, `package.json` y los dos `pom.xml` pasan a 1.5.0.

Ejecutado en Linux, contra un clúster KRaft de tres nodos con Kafka 4.1.2 y la configuración de brokers de `compose.yaml`, con el cliente del laboratorio y el visor construidos con Maven desde estas fuentes. Con el visor corriendo se ejecutaron estos pasos de las lecciones, y el visor informó cada cambio: `prepare 6`, `seed 6`, `consume 6 kitchen` y `watch 6 billing` (registros con sus encabezados, dos grupos con sus señaladores y estados); `prepare 9`, `seed 9`, la detención del nodo 1 (broker caído, líder de lab9 P0 de 1 a 2, ISR sin el 1, controlador activo de 1 a 2, y el aviso de que con min.insync.replicas 2 todavía se aceptan escrituras con acks=all) y su vuelta (ISR completo otra vez); `prepare 12` y dos `seed 12` (el inicio del log se movió dos veces por retención); `prepare 13`, `compact-seed 13` y `put 13 A 40` (offsets 0 y 1 quitados por la compactación, un tombstone con valor null); `prepare 16` y `transactions 16` (los dos valores, leídos como read_uncommitted, con los huecos de offsets de las marcas de transacción); los tres nodos detenidos y vueltos a levantar (la página dice que el clúster no responde, conserva la última lectura y se completa sola otra vez). Los grupos que lista la Admin API fueron solo los de las lecciones: el visor no creó grupos ni tópicos. Completó una lectura cada 500 ms. En un navegador sin interfaz a 1440 por 1000, 1280 por 760 y 390 por 844, en los dos idiomas: pasar el mouse o el foco por un registro muestra su contenido, el clic en cada clase de objeto (broker, tópico, partición, réplica, registro, fin del log, señalador, grupo) completa el panel de detalle, la pausa detiene el redibujo, sin errores de consola ni desborde horizontal.

Ejecutado en la laptop del curso (Windows 11, Docker Desktop 4.55.0, Compose v2.40.3): `docker compose build lab` construyó `kafka-course-lab:1.5.0`, y `docker compose up -d visor` levantó el visor sin nombrar su perfil. Leyó el clúster del curso en marcha (3 brokers, 38 tópicos, 9 grupos) cada 500 ms con unos 170 MiB, y ese estado se dibujó en el navegador sin errores.

Ejecutado en la misma laptop el mismo día, con el visor abierto y en este orden: la suite `core` (86 operaciones), `failures` (25 operaciones) y `visor` (12 operaciones: la página, HTTP de solo lectura, brokers y controlador, registros con encabezados, señaladores de grupo, ningún grupo ni tópico propio, caída de un broker, cambio de líder y recuperación). Las tres pasaron sobre `kafka-course-lab:1.5.0`, así que los comandos del laboratorio imprimen lo que esperan las lecciones con el visor abierto; después se volvió a levantar el visor. Una vez, mientras `failures` tenía un nodo detenido, una lectura mostró el clúster sin respuesta y las siguientes se recuperaron solas; no se midió cuánto duró.

Después, en la misma laptop y con el visor todavía abierto, pasaron también `integrations` (50 operaciones, levantando y deteniendo los servicios opcionales que usa) y `spring` (10 operaciones, después de construir `kafka-course-spring:1.5.0`). Las cinco suites Docker pasaron entonces sobre la 1.5.0.

## 1.4.1, 19 October 2026 / 1.4.1, 19 de octubre de 2026

The visual glossary showed the model of each term in a box 130 px high, so a drawing of 760 by 460 units was scaled to about 28 % and its labels could not be read. The glossary now opens in a dialog 880 px wide and draws the model at its own proportion, as tall as the viewport allows once the term, the definition and the buttons fit (`assets/course.css`, `assets/app.js`). Image tags, `package.json` and the two `pom.xml` move to 1.4.1 by convention; lab content did not change. Executed: `npm run build` and `npm run check`; in a headless browser, the drawing went from 28 % to 100 % at 1920 by 1080, 93 % at 1440 by 900 and 65 % at 1366 by 768 (Classic and Dark; Reading and Projector between 52 % and 84 % at the two smaller sizes, to leave room for their larger text), without scrolling the dialog at those three sizes, in the four skins and both languages, for each of the 46 terms; at 390 px wide it goes from 28 % to 40 %, limited by the width of the screen. The help dialog keeps its width and the expanded model its own; no console errors.

The Checkpoint tab could not be scrolled: the panel had a vertical auto margin, so it took the height of its content instead of the height of its row, and with the page itself fixed, the last question and the completion buttons stayed below the window, more so as the explanations opened. The panel now keeps auto margins only on the sides (`assets/course.css`). Executed in a headless browser, answering the three questions of each lesson and scrolling the panel as a reader would: before the change the last element of the checkpoint was out of reach in all 30 lessons at 1920 by 950 and at 1366 by 768; after it, the last answer and the completion buttons of the checkpoint, and the last card of Go deeper, can be brought into view in all 30 lessons at 1920 by 950, 1366 by 768, 1280 by 720 and 390 by 844, in the four skins.

El glosario visual mostraba el modelo de cada término en una caja de 130 px de alto, así que un dibujo de 760 por 460 unidades quedaba a cerca del 28 % y sus rótulos no se podían leer. Ahora el glosario abre en un diálogo de 880 px de ancho y dibuja el modelo en su propia proporción, tan alto como lo permite la pantalla una vez que entran el término, la definición y los botones (`assets/course.css`, `assets/app.js`). Las etiquetas de imagen, `package.json` y los dos `pom.xml` pasan a 1.4.1 por convención; el contenido del lab no cambió. Ejecutado: `npm run build` y `npm run check`; en un navegador sin interfaz, el dibujo pasó del 28 % al 100 % en 1920 por 1080, al 93 % en 1440 por 900 y al 65 % en 1366 por 768 (Clásico y Oscuro; Lectura y Proyector entre 52 % y 84 % en los dos tamaños menores, para dejar lugar a su texto más grande), sin desplazar el diálogo en esos tres tamaños, en las cuatro apariencias y los dos idiomas, para cada uno de los 46 términos; a 390 px de ancho pasa del 28 % al 40 %, limitado por el ancho de la pantalla. El diálogo de ayuda conserva su ancho y el modelo ampliado el suyo; sin errores de consola.

La pestaña Control no se podía desplazar: el panel tenía margen automático vertical, así que tomaba el alto de su contenido en lugar del de su fila y, con la página fija, la última pregunta y los botones de cierre quedaban debajo de la ventana, más todavía a medida que se abrían las explicaciones. Ahora el panel conserva los márgenes automáticos solo a los costados (`assets/course.css`). Ejecutado en un navegador sin interfaz, respondiendo las tres preguntas de cada lección y desplazando el panel como lo haría un lector: antes del cambio el último elemento del control quedaba fuera de alcance en las 30 lecciones a 1920 por 950 y a 1366 por 768; después, la última respuesta y los botones de cierre del control, y la última tarjeta de Profundizá, se pueden traer a la vista en las 30 lecciones a 1920 por 950, 1366 por 768, 1280 por 720 y 390 por 844, en las cuatro apariencias.

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
