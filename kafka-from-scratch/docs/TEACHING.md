# Teaching and maintenance / Enseñanza y mantenimiento

The course uses a repeated learning cycle: name one idea, inspect a visual model, predict a change, manipulate the model, run an equivalent real experiment, explain the observation, retrieve the distinction in a checkpoint.

El curso repite un ciclo: nombrar una idea, inspeccionar un modelo, predecir un cambio, manipularlo, ejecutar un experimento real, explicar lo observado y recuperar la distinción en un control.

## Entry point and numbering / Entrada y numeración

Lesson 00, Before you start, introduces the method and sets up Docker without creating topics. Its unit is 0, Start here. Existing lessons remain 01 to 29 in units 1 to 8. Each lesson carries its unit; navigation groups by that field. The lesson id is also its displayed number; Java lab arguments retain their original topic numbers.

La lección 00, Antes de empezar, presenta el método y prepara Docker sin crear tópicos. Su unidad es 0, Antes de empezar. Las lecciones existentes siguen como 01 a 29 en las unidades 1 a 8. Cada lección lleva su unidad; la navegación agrupa por ese campo. El id de lección también es su número visible; los argumentos del cliente Java conservan sus números de tópico originales.

Progress uses lesson slugs in browser storage. Version 1.2.0 migrates the old numeric keys 0 to 28 to the corresponding original lessons, preserving existing slug entries if both occur. Lesson 00 starts without credit. Keep those slugs stable; new insertions must not reassign saved progress. The glossary still uses lesson indices; update and verify every link after an insertion.

El avance usa slugs de lección en el almacenamiento del navegador. La versión 1.2.0 migra las claves numéricas anteriores 0 a 28 a las lecciones originales correspondientes y conserva las entradas por slug si coexisten. La 00 empieza sin avance. Mantené estables esos slugs; una inserción nueva no debe reasignar avance guardado. El glosario todavía usa índices de lección; actualizá y comprobá todos los enlaces después de una inserción.

The method model has three scenes and uses only the active palette. Its two planes distinguish browser simulation from Docker execution; its cycle connects intuition, rule, experiment and checkpoint.

El modelo del método tiene tres escenas y usa solo la paleta activa. Sus dos planos distinguen simulación en el navegador de ejecución en Docker; su circuito conecta intuición, regla, experimento y control.

## The "What Kafka is" page / La página "Qué es Kafka"

`what-kafka-is.html` is a reading page outside the lesson count: what Kafka is, where it came from, where it fits and where it does not, and how to decide. Its text lives in `assets/about.js`, bilingual like the curriculum; `scripts/build.mjs` generates the page and opens the course notes with it; `scripts/check.mjs` verifies every string in both languages, the sources and the embedded log model. It is reached from the home page button, from the help dialog and from the references of lesson 00. The "where it does not fit" table is the course’s judgment and says so in its own text; the product facts (origin, dates, use cases, defaults) come from the sources listed at the end of the page. When you change a fact, change its source too.

`what-kafka-is.html` es una página de lectura fuera de la numeración: qué es Kafka, de dónde salió, dónde encaja y dónde no, y cómo decidir. Su texto vive en `assets/about.js`, bilingüe como el currículo; `scripts/build.mjs` genera la página y abre los apuntes con ella; `scripts/check.mjs` verifica cada cadena en los dos idiomas, las fuentes y el modelo de log que incluye. Se llega desde el botón de la portada, desde el diálogo de ayuda y desde las referencias de la lección 00. La tabla "dónde no encaja" es criterio del curso y lo dice en su propio texto; los hechos de producto (origen, fechas, casos de uso, valores por defecto) salen de las fuentes listadas al final de la página. Cuando cambies un hecho, cambiá también su fuente.

## The discussion of each lesson / La discusión de cada lección

Every lesson ends its Go deeper tab with a discussion: a thread per lesson in GitHub Discussions of the Prumathe repository, shown through giscus (giscus.app), an open source widget with no ads or tracking. The widget loads only when the reader presses the button, and only on the published site (http or https); a local copy shows the link to the thread list instead, so the course still works offline and without external scripts until the reader asks for the forum. Reading is open; posting needs a GitHub account. `assets/forum.js` names the repository, the category of the course and the term prefix; the thread title is `<course folder>/<lesson slug>` with strict matching, so it survives a change of domain or path. `_headers` allows `https://giscus.app` in `script-src` and `frame-src`. `check.mjs` verifies the configuration, that pages load `forum.js` and that the CSP allows giscus. Setup on GitHub: a public repository with Discussions enabled, the giscus app installed and one category of type Announcement per course; the identifiers come from the giscus configurator.

Cada lección cierra su pestaña Profundizá con una discusión: un hilo por lección en GitHub Discussions del repositorio de Prumathe, mostrado con giscus (giscus.app), un widget open source sin anuncios ni seguimiento. El widget se carga solo cuando el lector aprieta el botón, y solo en el sitio publicado (http o https); una copia local muestra el enlace a la lista de hilos, así que el curso sigue funcionando sin conexión y sin scripts externos hasta que el lector pide el foro. Leer es abierto; publicar pide una cuenta de GitHub. `assets/forum.js` nombra el repositorio, la categoría del curso y el prefijo del término; el título del hilo es `<carpeta del curso>/<slug de la lección>` con coincidencia estricta, así sobrevive a un cambio de dominio o de ruta. `_headers` permite `https://giscus.app` en `script-src` y `frame-src`. `check.mjs` verifica la configuración, que las páginas carguen `forum.js` y que la CSP permita giscus. Preparación en GitHub: repositorio público con Discussions activado, la app de giscus instalada y una categoría de tipo Announcement por curso; los identificadores salen del configurador de giscus.

## Session structure / Estructura de sesión

Work through one unit at a time. Ask the learner to record four lines for each activity: prediction, observation, explanation, limit. Have them teach one concept back without using the wording from the page. On a later day, rerun an experiment before rereading the explanation. The Projector skin (header picker) enlarges the interface for a shared screen and hides the sidebar; the Reading skin is the one to hand out for self-study away from a terminal.

Trabajá una unidad por vez. Pedile al estudiante cuatro líneas por actividad: predicción, observación, explicación y límite. Que explique un concepto con sus palabras, sin repetir la página. Otro día, que repita el experimento antes de releer la explicación. La apariencia Proyector (selector de la cabecera) agranda la interfaz para una pantalla compartida y oculta la barra lateral; Lectura es la indicada para estudiar solo, lejos de una terminal.

The capstone activity (lesson 28) is a small system review, not just a successful command. Require a defensible key choice, ordering boundary, replication/ISR configuration, transaction boundary and an explanation of external side effects.

La actividad integradora (lección 28) es una revisión de un sistema chico, no solo un comando exitoso. Pedí justificar claves, límite de orden, réplicas e ISR, límite transaccional y efectos externos.

## Checkpoints / Controles

Each lesson has three questions. The first names the lesson's central distinction; the other two test it from a different angle (a configuration, a failure, a number). Distractors are errors a learner would actually make, never jokes: a wrong option should be defensible by someone who misread the lesson. A wrong answer can be retried, and the explanation appears either way; the point is the explanation, not the score.

Cada lección tiene tres preguntas. La primera nombra la distinción central de la lección; las otras dos la prueban desde otro ángulo (una configuración, una falla, un número). Los distractores son errores que un estudiante cometería de verdad, nunca chistes: una opción incorrecta tiene que poder defenderla alguien que leyó mal la lección. Una respuesta incorrecta se puede volver a intentar, y la explicación aparece igual; lo que importa es la explicación, no el puntaje.

## Editing / Edición

`assets/curriculum.js` contains paired `{en, es}` strings for every lesson title, explanation, takeaway, question, lab action and expected observation, one field per line. `assets/visuals.js` contains deterministic SVG models, real Murmur2 routing and one color palette per skin. `assets/reference.js` contains primary-source links and glossary entries. `assets/app.js` handles navigation, the skin picker, the reading layout and local progress. `assets/theme.js` applies the chosen skin before the stylesheet paints. `assets/course.css` controls the layout; every color is a variable in `:root`, redefined per skin at the end of the file.

Los mismos archivos contienen las dos versiones; no mantengas dos sitios separados. Conservá el voseo: «abrí», «ejecutá», «compará», «fijate», «probá». No traduzcas nombres de propiedades, comandos, clases de API ni nombres de eventos del código (`OrderPlaced` queda `OrderPlaced`). Explicá cada término técnico cuando aparece por primera vez. Sin guiones largos ni cortos en ningún texto; `npm run check` lo verifica.

One generated file per lesson makes direct links, static hosting and offline opening straightforward. Build after any content change so the text notes and lab download remain synchronized.

Cada lección tiene un HTML generado para facilitar enlaces directos, hosting estático y apertura sin conexión. Reconstruí tras cualquier cambio para mantener apuntes y descarga sincronizados.

## Skins / Apariencias

A skin is a value of `html[data-theme]`: `light` (Classic), `dark`, `reading` and `projector`. `theme.js` chooses it from `?theme=` in the address, then the choice saved on the browser, then the system color scheme, before the stylesheet applies, so there is no flash. `app.js` shows the picker and keeps the value in links and in the address.

- Colors: redefine the `:root` variables under `html[data-theme='x']` in `course.css`, and give `visuals.js` a palette with the same keys for the SVG models and the home illustration.
- Type scale: every font size is in `rem`, so `html { font-size }` under the skin scales the whole interface (Projector uses 20px, Reading 18px).
- Layout: Reading is the only skin that changes the page structure. `app.js` renders `documentView()` instead of the tabs when the skin is `reading`, and the `html[data-theme='reading']` rules let the document scroll (the viewport must be the scroll container, not `body`, or the sticky header stops sticking).
- Checks: `npm run check` renders every model in every skin and language. A new skin needs an entry in the `THEMES` list of `theme.js` and `app.js`, a palette in `visuals.js`, and a browser pass over a lesson, the home page and the glossary.

Una apariencia es un valor de `html[data-theme]`: `light` (Clásico), `dark`, `reading` y `projector`. `theme.js` la elige a partir de `?theme=` en la dirección, después de la elección guardada en el navegador y después del esquema de color del sistema, antes de que se aplique la hoja de estilos, así no parpadea. `app.js` muestra el selector y conserva el valor en los enlaces y en la dirección.

- Colores: redefiní las variables de `:root` bajo `html[data-theme='x']` en `course.css`, y dale a `visuals.js` una paleta con las mismas claves para los modelos SVG y la ilustración de la portada.
- Escala tipográfica: todos los tamaños de letra están en `rem`, así que `html { font-size }` bajo la apariencia escala toda la interfaz (Proyector usa 20px, Lectura 18px).
- Layout: Lectura es la única que cambia la estructura de la página. `app.js` dibuja `documentView()` en lugar de las pestañas cuando la apariencia es `reading`, y las reglas `html[data-theme='reading']` dejan que el documento se desplace (el contenedor de scroll tiene que ser el viewport, no `body`, o la cabecera fija deja de fijarse).
- Controles: `npm run check` dibuja cada modelo en cada apariencia e idioma. Una apariencia nueva necesita una entrada en la lista `THEMES` de `theme.js` y `app.js`, una paleta en `visuals.js` y una pasada de navegador por una lección, la portada y el glosario.

## Lab client / Cliente del laboratorio

`labs/src/main/java/course/Lab.java` is only the dispatcher: one `case` per command. Each experiment lives in the class named after its subject (`Topics`, `Producing`, `Consuming`, `Transactions`, `Integrations`, `Security`, `Clusters`), and `Kafka.java` holds what they share (addresses, client settings, the ACK and record lines). `npm run check` verifies that every command the lessons use has a `case` in `Lab.java`. Keep the output lines (`ACK`, `RECORDS n`, `PROCESSED n`, `PASS: ...`, `INTENTIONAL CRASH`) stable: the lessons and `scripts/test-labs.mjs` match them. Format with google-java-format before committing.

`labs/src/main/java/course/Lab.java` es solo el despachador: un `case` por comando. Cada experimento vive en la clase que lleva el nombre de su tema (`Topics`, `Producing`, `Consuming`, `Transactions`, `Integrations`, `Security`, `Clusters`), y `Kafka.java` tiene lo que comparten (direcciones, configuración de clientes, las líneas ACK y de mensaje). `npm run check` verifica que todo comando que usan las lecciones tenga un `case` en `Lab.java`. Mantené estables las líneas de salida (`ACK`, `RECORDS n`, `PROCESSED n`, `PASS: ...`, `INTENTIONAL CRASH`): las lecciones y `scripts/test-labs.mjs` las buscan. Formateá con google-java-format antes de confirmar.

## Evidence and version discipline / Evidencia y versiones

Diagrams are explicitly illustrative. Commands exercise real Kafka and related libraries. Do not imply that a browser animation contacted a broker. Do not turn an unexecuted command into a “verified” lab. Keep the topic prefix, unique Compose project and localhost binding boundaries.

Los diagramas son ilustrativos. Los comandos usan Kafka y bibliotecas reales. No sugieras que una animación se conectó al broker ni marques como verificado un comando sin ejecutar. Conservá los prefijos de tópicos, el proyecto Compose y los límites de localhost.

On a Kafka upgrade, review producer defaults, consumer protocols, share-group status, internal-topic replication, KRaft settings, Connect plugin filenames and Java API compatibility. Rebuild all images and rerun every suite. The course deliberately pins 4.1.2; “newer exists” is not permission to change a teaching baseline silently.

Al actualizar Kafka, revisá defaults, protocolos, share groups, réplicas internas, KRaft, nombres de plugins y compatibilidad Java. Reconstruí imágenes y repetí todas las suites. Que exista una versión nueva no justifica cambiar silenciosamente la base didáctica.

### Where the version lives / Dónde vive la versión

`assets/curriculum.js` declares `version`, `kafka` and `date`; the interface, the notes and the reference texts read them from there. `npm run check` verifies that these other places agree, because their tools cannot read `curriculum.js`:

- `package.json` (`version`, the complete course version);
- `labs/compose.yaml` (the `apache/kafka` image tag and the `kafka-course-lab` and `kafka-course-spring` tags, which since 1.2.0 carry the complete course version, for example `kafka-course-lab:1.2.0`; lesson 01 prints that tag);
- `labs/pom.xml` and `labs/spring/pom.xml` (`version`, and the `kafka-clients` and `kafka-streams` versions in the first one);
- `labs/README.md`, `labs/spring/README.md`, `README.md` and `docs/VALIDATION.md`, by hand.

`assets/curriculum.js` declara `version`, `kafka` y `date`; la interfaz, los apuntes y los textos de referencia los leen de ahí. `npm run check` verifica que estos otros lugares coincidan, porque sus herramientas no pueden leer `curriculum.js`:

- `package.json` (`version`, la versión completa del curso);
- `labs/compose.yaml` (la etiqueta de la imagen `apache/kafka` y las de `kafka-course-lab` y `kafka-course-spring`, que desde 1.2.0 llevan la versión completa del curso, por ejemplo `kafka-course-lab:1.2.0`; la lección 01 imprime esa etiqueta);
- `labs/pom.xml` y `labs/spring/pom.xml` (`version`, y en el primero las versiones de `kafka-clients` y `kafka-streams`);
- `labs/README.md`, `labs/spring/README.md`, `README.md` y `docs/VALIDATION.md`, a mano.

For each release, update the date and all course versions above, including image tags printed in lesson text. Keep product pins unless the release changes the baseline. Rebuild the pages, notes, ZIP and dist, run the checks, exercise the affected pages in both languages and all four skins, and record executed and unexecuted checks in VALIDATION.md. Update the root course summary, changelog and owned backlog cards. Read every changed text file back as UTF-8 without BOM and LF line endings.

Para cada versión, actualizá la fecha y todas las versiones del curso de arriba, incluidas las etiquetas de imagen impresas en las lecciones. Conservá las versiones de productos salvo que cambie la base. Reconstruí páginas, apuntes, ZIP y dist, ejecutá los controles, recorré las páginas afectadas en ambos idiomas y las cuatro apariencias, y registrá lo ejecutado y lo pendiente en VALIDATION.md. Actualizá el resumen del curso en la raíz, el changelog y las cards con dueño. Releé cada archivo de texto cambiado como UTF-8 sin BOM y con finales LF.

Advanced production topics such as full TLS lifecycle, real Debezium deployment, registry operations, MirrorMaker checkpoint translation, tiered-storage plugins, multi-region failover and large-scale capacity testing require expanded labs beyond these bounded introductory experiments. The lessons identify those boundaries and link to official documentation.

Temas productivos como ciclo completo de TLS, despliegue real de Debezium, operación de un registro, traducción de checkpoints MirrorMaker, plugins de almacenamiento por niveles, recuperación multirregión y capacidad a escala requieren laboratorios adicionales. Las lecciones identifican esos límites y enlazan documentación oficial.
