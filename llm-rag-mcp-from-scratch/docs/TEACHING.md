# Enseñanza y edición

La unidad de aprendizaje sigue cuatro pasos: ver un mecanismo, formular una predicción, ejecutar un experimento y explicar su límite. Es el ciclo de Prumathe, con un modelo de lenguaje real en el lugar del experimento. Cauce, una plataforma de integración ficticia con códigos de error, runbooks en inglés y en español e incidentes, queda fija de punta a punta, así las diferencias entre una técnica y otra se pueden observar sobre los mismos datos.

Cada lección contiene tres escenas, una manipulación del modelo, al menos cuatro pasos reales y tres preguntas con distractores plausibles. La posición de la respuesta correcta no sigue un patrón (`check.mjs` lo verifica). El control evalúa comprensión; no detecta si se ejecutó la terminal. El avance del lab es una declaración de quien cursa.

## Lo determinista y lo generativo

El curso separa dos clases de resultado. Lo determinista se afirma con números exactos y se controla con exactitud: tokens, embeddings, posiciones de la búsqueda, el hit rate y el MRR de la evaluación, los mensajes MCP. Lo generativo depende del modelo, del prompt y de la máquina: el texto lo cuenta como la corrida del curso, con sus defectos a la vista (reglas repetidas en voz alta, idiomas mezclados, afirmaciones de acciones que no ocurrieron), y los controles del laboratorio miran solo su estructura: una cita, una tool llamada, un encabezado de la salida. Todos los pedidos usan temperatura 0 y la semilla 42, salvo los de muestreo de la lección 03, que varían temperatura y semilla a propósito; todos apagan `cache_prompt`, porque el README de llama.cpp avisa que reusar el prompt puede cambiar el resultado. Aun así, la lección 03 muestra que 0 no garantiza lo mismo en otra máquina. Tampoco en la misma si dos pedidos llegan juntos: el servidor los procesa en el mismo lote y cambia la respuesta de los dos (medido en [VALIDATION.md](VALIDATION.md)), así que la suite manda un pedido por vez y los textos de las lecciones salen de esa corrida.

Un número del texto sale de una medición en el kit o se marca como ilustrativo. Los modelos del navegador son ilustrativos salvo donde dicen "medido"; sus datos medidos viven en `assets/visuals.js` junto al dibujo.

## Fuentes de verdad

| Hecho | Archivo dueño |
| --- | --- |
| Texto EN/ES, versión, fecha, recorrido, comandos, controles y expectativas | `assets/curriculum.js` |
| Fuentes oficiales y glosario | `assets/reference.js` |
| Modelos, controles, paletas y datos medidos de los dibujos | `assets/visuals.js` |
| La página "Qué son los LLMs, RAG y MCP" | `assets/about.js` |
| Navegación, progreso y lectura | `assets/app.js` |
| Apariencias y respuesta a tamaños de pantalla | `assets/course.css` y `assets/theme.js` |
| Servicios, imágenes fijadas por digest y modelos fijados por commit y SHA256 | `labs/compose.yaml` y `labs/models/manifest.txt` |
| Runbooks, incidentes, notas plantadas y preguntas de evaluación | `labs/corpus/` y `labs/eval/questions.json` |
| Código de los laboratorios | `labs/lab/` (Java sin framework), `labs/app/` (Spring AI), `labs/mcp-modern/` (SDK de TypeScript) |
| Evidencia ejecutada y limitaciones | `docs/VALIDATION.md` |

La versión vive en `package.json` y en `curriculum.js`; `npm run check` exige coincidencia. Cambiar contenido requiere `npm run build`: genera el HTML de cada lección, la portada, la página de presentación, los apuntes, el ZIP del kit y `dist/` (los documentos de `docs/` y este README no se publican). No edites a mano los apuntes ni las páginas generadas. El curso tiene cero dependencias de npm. `check.mjs` también rechaza guiones largos, doble codificación UTF-8, comillas dobles dentro de comillas simples en los comandos (fallan en Windows PowerShell 5.1), comandos fuera del kit, imágenes sin digest, puertos publicados fuera de 127.0.0.1, un `.env` dentro del ZIP y nombres de herramientas que produjeron el material o de otros cursos. Los nombres de proveedores de modelos sí aparecen donde enseñan algo, como la API compatible con la de OpenAI.

## La página "Qué son los LLMs, RAG y MCP"

Fuera de la numeración de lecciones, `what-llms-rag-and-mcp-are.html` responde qué son, de dónde salieron, dónde encajan y dónde no, y cómo decidir, en cinco minutos de lectura. Su texto vive en `assets/about.js`, bilingüe, con sus fuentes; `build.mjs` genera la página y la pone al frente de los apuntes; `check.mjs` exige cada cadena en los dos idiomas, seis hitos en la línea de tiempo, tres columnas en la tabla, cinco preguntas para decidir y fuentes https. La sección "dónde no encaja" es criterio del curso y lo dice; el resto se contrasta con las fuentes listadas al pie.

## La discusión de cada lección

Cada lección cierra su pestaña Profundizá con una discusión: un hilo por lección en GitHub Discussions del repositorio de Prumathe, mostrado con giscus (giscus.app), un widget open source sin anuncios ni seguimiento. El widget se carga solo cuando el lector aprieta el botón, y solo en el sitio publicado (http o https); una copia local muestra el enlace a la lista de hilos. `assets/forum.js` nombra el repositorio, la categoría del curso y el prefijo del término, `llm-rag-mcp-from-scratch`; el título del hilo es `<carpeta del curso>/<slug de la lección>` con coincidencia estricta. `_headers` permite `https://giscus.app` en `script-src` y `frame-src`. La discusión queda apagada (`enabled: false`) hasta que existan la categoría en GitHub y sus identificadores; `check.mjs` exige los identificadores si se la enciende.

## Criterio editorial

Usá voseo en español: mirá, ejecutá, comprobá. Conservá en inglés los términos técnicos que se usan así (token, prompt, chunk, reranker, tool, embedding), los comandos, los nombres de campos y las salidas de los programas. Definí el término cuando aparece por primera vez y vinculalo al glosario. Ambos idiomas deben enseñar la misma distinción y el mismo límite.

No presentes un modelo chico como si fuera uno grande, ni un resultado del modelo como una propiedad de la técnica. No confundas recuperar con responder, un puntaje del reranker con una probabilidad, una regla en el prompt con un control, la respuesta del modelo con el registro de llamadas, ni una anotación de una tool con una garantía. Cuando una mitigación falla en la medición, el texto lo dice.

## Editar prácticas

Los comandos viven una sola vez en el contenido. `scripts/test-labs.mjs` lee esos mismos comandos, los ejecuta sin pasar por el shell del host (por eso `check.mjs` controla las comillas aparte), les pasa la entrada declarada en `input` (el no de una aprobación) y aplica las comprobaciones de `checks`: `contains`, `absent`, `matches` y `sameLines`. Los códigos de salida no cero se admiten solo donde la lección los espera (`exit`). Los pasos `optional` usan una clave de API y corren solo con `--remote` y un `labs/.env`.

Ninguna práctica usa `down -v` ni `prune`. Lo que una lección cambia lo deshace la misma lección o la siguiente: `reset` reabre los incidentes cerrados e `index` restaura los chunks por defecto. Los servidores de modelos, la base y los servidores MCP no publican puertos en el host.

Antes de editar versiones, verificá fuentes oficiales, compatibilidad y disponibilidad del artefacto: las imágenes se fijan por digest y los modelos por commit del repositorio y SHA256, porque descargar por nombre no fija revisión. Después, construí, ejecutá los controles estáticos, corré las prácticas afectadas con `npm run test:labs -- --only=N` y revisá la interfaz en ambos idiomas. Si cambia una salida generativa, actualizá el texto que la cita. No conviertas una limitación no ejecutada en un resultado supuesto. Anotá la historia en el CHANGELOG raíz y cualquier pendiente con dueño en el tablero.
