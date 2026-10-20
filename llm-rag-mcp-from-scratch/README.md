# LLMs, RAG and MCP from scratch / LLMs, RAG y MCP desde cero

A standalone visual course in **English and Rioplatense Spanish**, version 1.0.0: see what a language model does, one token at a time, then build retrieval with sources and MCP tools on top of one, with a real model running on your machine. Open [index.html](index.html?lang=en) or start with [00, Before you start](lessons/before-you-start.html?lang=en); if you do not know what the three are yet, read [What LLMs, RAG and MCP are](what-llms-rag-and-mcp-are.html?lang=en) first. The site can be copied and opened without a server or a connection; it needs no account, telemetry or external resources, except the discussion of a lesson when you open it on the published site. The official links and the first download of the models and images do need internet.

Un curso visual independiente en **inglés y español rioplatense**, versión 1.0.0: mirá qué hace un modelo de lenguaje, de a un token por vez, y después construí recuperación con fuentes y tools MCP encima de uno, con un modelo real corriendo en tu máquina. Abrí [index.html](index.html?lang=es) o empezá por [00, Antes de empezar](lessons/before-you-start.html?lang=es); si todavía no sabés qué son los tres, leé antes [Qué son los LLMs, RAG y MCP](what-llms-rag-and-mcp-are.html?lang=es). El sitio se puede copiar y abrir sin servidor ni conexión; no requiere cuenta, telemetría ni recursos externos, salvo la discusión de una lección cuando la abrís en el sitio publicado. Los enlaces oficiales y la primera descarga de los modelos y las imágenes sí necesitan internet.

## What is included / Qué incluye

- 26 lessons in 8 units, including the initial orientation. / 26 lecciones en 8 unidades, incluida la orientación inicial.
- A five minute "What LLMs, RAG and MCP are" page: what they are, where they came from, where they fit and where they do not, with its sources. / Una página de cinco minutos, "Qué son los LLMs, RAG y MCP": qué son, de dónde salieron, dónde encajan y dónde no, con sus fuentes.
- A discussion per lesson, in the Go deeper tab: threads on GitHub Discussions, loaded only when you open them on the published site; reading is open, posting needs a GitHub account. / Una discusión por lección, en la pestaña Profundizá: hilos en GitHub Discussions, cargados solo cuando los abrís en el sitio publicado; leer es abierto, publicar pide una cuenta de GitHub.
- 78 scenes with interactive SVG models, 78 questions with explanations and 129 lab steps. / 78 escenas con modelos SVG interactivos, 78 preguntas con explicación y 129 pasos de laboratorio.
- English and Rioplatense Spanish, a 61-term glossary and downloadable notes. / Inglés y español rioplatense, glosario de 61 términos y apuntes descargables.
- Classic, Dark, Reading and Projector skins. Local progress, independent from other courses. / Apariencias Clásico, Oscuro, Lectura y Proyector. Avance local independiente de otros cursos.
- A Docker Compose kit: llama.cpp with three open models, PostgreSQL with pgvector, a Java client that shows the exact HTTP requests, a Spring AI application, MCP servers in Spring and in TypeScript, and the MCP Inspector. / Un kit de Docker Compose: llama.cpp con tres modelos abiertos, PostgreSQL con pgvector, un cliente Java que muestra los pedidos HTTP exactos, una aplicación Spring AI, servidores MCP en Spring y en TypeScript, y el MCP Inspector.
- A live viewer at http://127.0.0.1:18093, open from lesson 01: what each command sent to the models, what it retrieved, the tool calls and every MCP message, with their headers. It only reads. / Un visor en vivo en http://127.0.0.1:18093, abierto desde la lección 01: lo que cada comando mandó a los modelos, lo que recuperó, las llamadas a tools y cada mensaje MCP, con sus encabezados. Solo lee.

## Learning path / Recorrido

| Lessons / Lecciones | Unit / Unidad | Question it answers / Pregunta que responde |
| --- | --- | --- |
| 00 | Start here / Antes de empezar | What does each part of the course prove? / ¿Qué prueba cada parte del curso? |
| 01 to 04 | What a model does / Qué hace un modelo | How does a model write, and what does it remember? / ¿Cómo escribe un modelo, y qué recuerda? |
| 05 to 08 | Inside the model / Por dentro | What are meaning, attention, an assistant and a size in bits? / ¿Qué son el significado, la atención, un asistente y un tamaño en bits? |
| 09 to 12 | From an application / Desde una aplicación | What travels in the request, and how does code control the answer? / ¿Qué viaja en el pedido, y cómo controla la respuesta el código? |
| 13 to 16 | RAG | How does the model answer from documents it was not trained on? / ¿Cómo responde el modelo a partir de documentos con los que no se entrenó? |
| 17 to 19 | RAG with evidence / RAG con evidencia | How do I know retrieval and answers are good, and what can a document make it do? / ¿Cómo sé que la recuperación y las respuestas son buenas, y qué le puede hacer hacer un documento? |
| 20 to 24 | MCP | How does a model use tools of other programs, and who decides? / ¿Cómo usa un modelo tools de otros programas, y quién decide? |
| 25 | Capstone / Integradora | Which claims about my assistant can I back with a command? / ¿Qué afirmaciones sobre mi asistente puedo respaldar con un comando? |

## Labs / Laboratorios

Use Docker with Linux containers and Compose v2, about 6 GB of free memory and about 9 GB of disk. The models run on the CPU on Windows, macOS and Linux; an API key is optional and never required. The [kit guide](labs/README.md) covers the first run, what each service is, the threads, the optional key, the live viewer, how to undo what the labs change and cleanup.

Usá Docker con contenedores Linux y Compose v2, unos 6 GB de memoria libre y unos 9 GB de disco. Los modelos corren en la CPU en Windows, macOS y Linux; una clave de API es opcional y nunca necesaria. La [guía del kit](labs/README.md) explica la primera ejecución, qué es cada servicio, los hilos, la clave opcional, el visor en vivo, cómo deshacer lo que cambian los labs y la limpieza.

The models illustrate mechanisms; the labs answer with a real model, and a small one: its answers in the lessons are the ones measured on the course laptop, and yours may differ. The tests that were executed, the platform and the limits of that evidence live in [docs/VALIDATION.md](docs/VALIDATION.md). The course does not cover training or fine-tuning, GPUs, serving models in production, or MCP authorization in practice.

Los modelos ilustran mecanismos; los labs responden con un modelo real, y chico: sus respuestas en las lecciones son las medidas en la laptop del curso, y las tuyas pueden ser otras. Las pruebas ejecutadas, la plataforma y los límites de esa evidencia viven en [docs/VALIDATION.md](docs/VALIDATION.md). El curso no cubre entrenamiento ni fine-tuning, GPUs, servir modelos en producción, ni la autorización de MCP en la práctica.

## Edit and package / Editar y empaquetar

With Node.js 18 or later and no packages to install: / Con Node.js 18 o superior, sin instalar paquetes:

```text
npm run build
npm run check
npm run preview
npm run release
```

The local preview uses `http://127.0.0.1:4176`. `release/` holds the portable course and the ZIP of the static site. `npm run test:labs` runs the commands of the lessons against the kit and checks what each step says to look for; it changes the state of the kit, as the lessons do, and leaves the services running. Read the scope in [VALIDATION.md](docs/VALIDATION.md) first. After it, `npm run test:visor` checks that the live viewer only reads, answers only to this computer and holds an event for every step of `lab` and `app`.

La vista local usa `http://127.0.0.1:4176`. `release/` contiene el curso portable y el ZIP del sitio estático. `npm run test:labs` ejecuta los comandos de las lecciones contra el kit y comprueba lo que cada paso dice que hay que mirar; cambia el estado del kit, como las lecciones, y deja los servicios corriendo. Leé antes el alcance en [VALIDATION.md](docs/VALIDATION.md). Después, `npm run test:visor` comprueba que el visor en vivo solo lee, responde solo a esta computadora y tiene un evento por cada paso de `lab` y de `app`.

Content and method: [TEACHING.md](docs/TEACHING.md). Static publication: [DEPLOYMENT.md](docs/DEPLOYMENT.md). License [MIT](LICENSE). The course carries its own copies of assets and scripts; it does not depend on other folders of the repository.

Contenido y método: [TEACHING.md](docs/TEACHING.md). Publicación estática: [DEPLOYMENT.md](docs/DEPLOYMENT.md). Licencia [MIT](LICENSE). El curso lleva sus propias copias de assets y scripts; no depende de otras carpetas del repositorio.
