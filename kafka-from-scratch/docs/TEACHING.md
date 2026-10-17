# Teaching and maintenance / Enseñanza y mantenimiento

The course uses a repeated learning cycle: name one idea, inspect a visual model, predict a change, manipulate the model, run an equivalent real experiment, explain the observation, retrieve the distinction in a checkpoint.

El curso repite un ciclo: nombrar una idea, inspeccionar un modelo, predecir un cambio, manipularlo, ejecutar un experimento real, explicar lo observado y recuperar la distinción en un control.

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

- `package.json` (`version`, same major and minor);
- `labs/compose.yaml` (the `apache/kafka` image tag and the `kafka-course-lab` tag);
- `labs/pom.xml` and `labs/spring/pom.xml` (`version`, and the `kafka-clients` and `kafka-streams` versions in the first one);
- `labs/README.md`, `labs/spring/README.md`, `README.md` and `docs/VALIDATION.md`, by hand.

`assets/curriculum.js` declara `version`, `kafka` y `date`; la interfaz, los apuntes y los textos de referencia los leen de ahí. `npm run check` verifica que estos otros lugares coincidan, porque sus herramientas no pueden leer `curriculum.js`:

- `package.json` (`version`, mismos major y minor);
- `labs/compose.yaml` (la etiqueta de la imagen `apache/kafka` y la de `kafka-course-lab`);
- `labs/pom.xml` y `labs/spring/pom.xml` (`version`, y en el primero las versiones de `kafka-clients` y `kafka-streams`);
- `labs/README.md`, `labs/spring/README.md`, `README.md` y `docs/VALIDATION.md`, a mano.

Advanced production topics such as full TLS lifecycle, real Debezium deployment, registry operations, MirrorMaker checkpoint translation, tiered-storage plugins, multi-region failover and large-scale capacity testing require expanded labs beyond these bounded introductory experiments. The lessons identify those boundaries and link to official documentation.

Temas productivos como ciclo completo de TLS, despliegue real de Debezium, operación de un registro, traducción de checkpoints MirrorMaker, plugins de almacenamiento por niveles, recuperación multirregión y capacidad a escala requieren laboratorios adicionales. Las lecciones identifican esos límites y enlazan documentación oficial.
