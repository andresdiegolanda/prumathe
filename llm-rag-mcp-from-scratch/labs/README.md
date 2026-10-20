# LLM, RAG and MCP kit / Kit de LLM, RAG y MCP

Version 1.0.0. Open a terminal in this folder before running the lesson commands. Commands keep their technical names in both languages and use quoting that works in PowerShell, bash and zsh. Everything runs in containers: you do not need Java, Node.js, Python or a model runtime on your machine.

Versión 1.0.0. Abrí una terminal en esta carpeta antes de ejecutar los comandos de las lecciones. Los comandos conservan los nombres técnicos en ambos idiomas y usan comillas que funcionan en PowerShell, bash y zsh. Todo corre en contenedores: no necesitás Java, Node.js, Python ni un runtime de modelos en tu máquina.

## Tools and first run / Herramientas y primera ejecución

1. Install [Docker Desktop](https://docs.docker.com/desktop/) or [Docker Engine](https://docs.docker.com/engine/install/) with [Compose v2](https://docs.docker.com/compose/install/). Choose Linux containers and check `docker version` and `docker compose version`. You need `docker compose up --wait`. / Instalá [Docker Desktop](https://docs.docker.com/desktop/) o [Docker Engine](https://docs.docker.com/engine/install/) con [Compose v2](https://docs.docker.com/compose/install/). Elegí contenedores Linux y verificá `docker version` y `docker compose version`. Necesitás `docker compose up --wait`.
2. Reserve about 6 GB of free memory for the containers (16 GB of RAM is a comfortable machine) and about 9 GB of disk: 3.5 GB for the three models and about 5 GB for the images. / Reservá unos 6 GB de memoria libre para los contenedores (16 GB de RAM es una máquina cómoda) y unos 9 GB de disco: 3,5 GB para los tres modelos y unos 5 GB para las imágenes.
3. Download and check the models, once: `docker compose run --rm models`. It prints one OK line per model with its SHA256. An interrupted download resumes where it stopped. / Descargá y verificá los modelos, una sola vez: `docker compose run --rm models`. Imprime una línea OK por modelo con su SHA256. Una descarga interrumpida sigue donde quedó.
4. Start the language model and ask for a first answer: `docker compose up -d --wait chat`, then `docker compose run --rm lab hello`. The first command that uses `lab` or `app` builds its image with Maven, which takes some minutes once. / Levantá el modelo de lenguaje y pedí una primera respuesta: `docker compose up -d --wait chat`, después `docker compose run --rm lab hello`. El primer comando que usa `lab` o `app` construye su imagen con Maven, lo que tarda unos minutos una sola vez.

The models run on the CPU, on Windows, macOS and Linux alike: containers do not reach the GPU of a Mac, so the course does not use one anywhere. The speeds in lesson 08 come from a laptop with 4 threads per server; the other runs quoted in the lessons used 8 (LLM_THREADS=8). Yours will differ, and each lab prints them.

Los modelos corren en la CPU, igual en Windows, macOS y Linux: los contenedores no llegan a la GPU de una Mac, así que el curso no usa ninguna en ningún lado. Las velocidades de la lección 08 salen de una laptop con 4 hilos por servidor; las demás corridas que citan las lecciones usaron 8 (LLM_THREADS=8). Las tuyas van a ser otras, y cada lab las imprime.

## What runs where / Qué corre dónde

| Service / Servicio | What it is / Qué es | Lessons / Lecciones |
| --- | --- | --- |
| `models` | Downloads the models into the `models` volume and checks their SHA256 / Descarga los modelos al volumen `models` y verifica su SHA256 | 00 |
| `chat` | llama.cpp server b11749 with Granite 4.2 3B, 8192 tokens of context / llama.cpp server b11749 con Granite 4.2 3B, 8192 tokens de contexto | 00 to 25 / 00 a 25 |
| `embed` | llama.cpp with Qwen3-Embedding 0.6B, vectors of 1024 numbers / llama.cpp con Qwen3-Embedding 0.6B, vectores de 1024 números | 05, 14 to 25 / 05, 14 a 25 |
| `rerank` | llama.cpp with Qwen3-Reranker 0.6B / llama.cpp con Qwen3-Reranker 0.6B | 17 to 25 / 17 a 25 |
| `db` | PostgreSQL 18 with pgvector 0.8.7, the vector store / PostgreSQL 18 con pgvector 0.8.7, el almacén de vectores | 14 to 25 / 14 a 25 |
| `lab` | Java client without a framework: the exact HTTP requests / Cliente Java sin framework: los pedidos HTTP exactos | 00 to 11, 21, 24 / 00 a 11, 21, 24 |
| `app` | Spring Boot 4.1.1 with Spring AI 2.0.1 | 12 to 25 / 12 a 25 |
| `mcp`, `mcp-stdio` | The MCP server of the course (Spring AI), over HTTP and over stdio / El servidor MCP del curso (Spring AI), por HTTP y por stdio | 20 to 25 / 20 a 25 |
| `mcp-modern`, `mcp-poisoned` | The same tools with the TypeScript SDK v2, and a poisoned variant / Las mismas tools con el SDK de TypeScript v2, y una variante envenenada | 21, 24 |
| `inspector` | MCP Inspector 2.11.0, command-line mode / MCP Inspector 2.11.0, modo línea de comandos | 20 to 22 / 20 a 22 |
| `visor` | The live viewer: shows at http://127.0.0.1:18093 the requests, retrievals, tool calls and MCP messages that the commands write to the `events` volume / El visor en vivo: muestra en http://127.0.0.1:18093 los pedidos, recuperaciones, llamadas a tools y mensajes MCP que los comandos escriben en el volumen `events` | 01 to 25 / 01 a 25 |

No model server, database or MCP server publishes a port on your machine: they talk inside the Compose network, and the commands reach them through `lab`, `app` and `inspector`. The viewer is the only service with a port, 18093, and only on 127.0.0.1. The images are pinned by digest and the models by commit and SHA256 (`models/manifest.txt`).

Ningún servidor de modelos, base ni servidor MCP publica un puerto en tu máquina: hablan dentro de la red de Compose, y los comandos llegan a ellos por `lab`, `app` e `inspector`. El visor es el único servicio con un puerto, el 18093, y solo en 127.0.0.1. Las imágenes están fijadas por digest y los modelos por commit y SHA256 (`models/manifest.txt`).

## Settings, threads and the optional key / Configuración, hilos y la clave opcional

Copy `.env.example` to `.env` to change what it lists. `LLM_THREADS` sets the CPU threads of each model server (4 by default); more threads than free cores make generation slower, not faster. After a change, recreate the servers with `docker compose up -d --wait --force-recreate chat embed rerank`.

Copiá `.env.example` a `.env` para cambiar lo que lista. `LLM_THREADS` fija los hilos de CPU de cada servidor de modelos (4 por defecto); más hilos que núcleos libres hacen la generación más lenta, no más rápida. Después de un cambio, recreá los servidores con `docker compose up -d --wait --force-recreate chat embed rerank`.

No lesson needs an API key. Only the optional last step of lesson 09 compares the same request against a hosted provider with an OpenAI-compatible chat API, with `LLM_BASE_URL`, `LLM_API_KEY` and `LLM_MODEL` in `.env`. That file stays on your machine: it is in `.gitignore` and the course ZIP never includes it.

Ninguna lección necesita una clave de API. Solo el último paso opcional de la lección 09 compara el mismo pedido contra un proveedor alojado con una API de chat compatible con la de OpenAI, con `LLM_BASE_URL`, `LLM_API_KEY` y `LLM_MODEL` en `.env`. Ese archivo queda en tu máquina: está en `.gitignore` y el ZIP del curso nunca lo incluye.

## The live viewer / El visor en vivo

`docker compose up -d --wait visor` starts it (lesson 01); open http://127.0.0.1:18093 beside the terminal. Each `lab` and `app` command writes one event to the `events` volume when it ends: its command line, what it printed and every HTTP request it made, with headers and bodies; the MCP servers add one line per message they receive and send. The viewer only reads that volume: it answers GET and nothing else, only to requests addressed to localhost or 127.0.0.1, and never talks to the models. Authorization headers, API keys and cookies are not recorded, bodies are cut at 64 KB, an event keeps its first 120 requests and embedding vectors keep their first eight numbers. The commands write their events whether or not the viewer is running. To start the log from zero without stopping anything: `docker compose run --rm --user root --entrypoint sh lab -c "rm -f /events/*"`.

`docker compose up -d --wait visor` lo levanta (lección 01); abrí http://127.0.0.1:18093 al lado de la terminal. Cada comando de `lab` y de `app` escribe un evento en el volumen `events` cuando termina: su línea de comando, lo que imprimió y cada pedido HTTP que hizo, con encabezados y cuerpos; los servidores MCP suman una línea por cada mensaje que reciben y mandan. El visor solo lee ese volumen: responde GET y nada más, solo a pedidos dirigidos a localhost o 127.0.0.1, y nunca habla con los modelos. Los encabezados de autorización, las claves de API y las cookies no se registran, los cuerpos se cortan en 64 KB, un evento guarda sus primeros 120 pedidos y los vectores de embeddings conservan sus primeros ocho números. Los comandos escriben sus eventos esté o no corriendo el visor. Para empezar el registro de cero sin detener nada: `docker compose run --rm --user root --entrypoint sh lab -c "rm -f /events/*"`.

## State and reset / Estado y vuelta atrás

The incidents of Cauce live in `corpus/incidents.json`; what the labs close is kept in the `cauce-state` volume, shared by `app` and `mcp`. `docker compose run --rm app reset` reopens what the labs closed. The vector store keeps the last `index`: lesson 19 indexes two planted notes with `--extra` and indexes the runbooks back at the end; `docker compose run --rm app index` restores the default chunks at any time.

Los incidentes de Cauce viven en `corpus/incidents.json`; lo que cierran los labs se guarda en el volumen `cauce-state`, compartido por `app` y `mcp`. `docker compose run --rm app reset` reabre lo que cerraron los labs. El almacén de vectores conserva el último `index`: la lección 19 indexa dos notas plantadas con `--extra` y vuelve a indexar los runbooks al final; `docker compose run --rm app index` restaura los chunks por defecto en cualquier momento.

## Windows and accents / Windows y acentos

The commands with Spanish text, such as `¿Qué hago si una entrega falla con CAU-4021?`, work as printed in Windows PowerShell 5.1: the arguments reach the containers intact. If you pipe the output of a command (to `Select-String`, `Out-File` or a variable), PowerShell 5.1 decodes it with the console code page and the accents come out garbled. Run this once in the session first:

Los comandos con texto en español, como `¿Qué hago si una entrega falla con CAU-4021?`, funcionan tal como están impresos en Windows PowerShell 5.1: los argumentos llegan intactos a los contenedores. Si redirigís la salida de un comando (a `Select-String`, `Out-File` o una variable), PowerShell 5.1 la decodifica con la página de códigos de la consola y los acentos salen rotos. Ejecutá esto una vez en la sesión antes:

```text
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
```

## Clean up / Limpieza

`docker compose --profile "*" down` stops and removes every container of the course, including the services that start only when named, such as `mcp-poisoned`, and keeps its volumes, so the models are not downloaded again. Adding `-v` also deletes the volumes: the 3.5 GB of models, the vector store, the state of the incidents and the events of the viewer. Neither touches other Compose projects.

`docker compose --profile "*" down` detiene y borra todos los contenedores del curso, incluidos los servicios que arrancan solo si se los nombra, como `mcp-poisoned`, y conserva sus volúmenes, así los modelos no se descargan de nuevo. Agregar `-v` además borra los volúmenes: los 3,5 GB de modelos, el almacén de vectores, el estado de los incidentes y los eventos del visor. Ninguno de los dos toca otros proyectos de Compose.
