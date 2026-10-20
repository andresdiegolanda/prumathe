# Review: LLMs, RAG and MCP from scratch v1.0.0

Estado: aplicada el mismo día, antes de publicar la 1.0.0. El visor en vivo (3.1) se construyó después de aprobar su diseño y pasó la corrida completa de la suite. El detalle está en [`CHANGELOG.md`](../CHANGELOG.md) y en `docs/VALIDATION.md` del curso. El texto de abajo describe el curso tal como estaba al revisarlo.

Fecha: 2026-10-20. Objeto: [`llm-rag-mcp-from-scratch/`](../llm-rag-mcp-from-scratch/) en el árbol de trabajo antes de su primer commit (versión 1.0.0).

Cada hallazgo dice cómo se estableció:

- **[LEÍDO]**: surge de leer el archivo citado; cualquiera lo reproduce abriendo ese archivo.
- **[EJECUTADO]**: se corrió algo en esta revisión (build, check, la suite del kit, un servidor de prueba, un conteo).
- **[FUENTE]**: se contrastó con documentación oficial o con el código publicado de la versión fijada.
- **[NO VERIFICADO]**: sospecha razonable que no se pudo confirmar; se dice por qué.

## 1. Veredicto

El contenido técnico se sostiene: el orden de los samplers de llama.cpp, la plantilla de chat, el ciclo de tool calling, la recuperación híbrida con RRF y el reranker, la evaluación con controles y juez, y los mensajes de MCP en las revisiones 2025-11-25 y 2026-07-28 (encabezados, -32020, -32022, `server/discover`, validación de Origin, persona en el circuito, anotaciones no confiables) coinciden con las fuentes y con las corridas. Las 78 preguntas tienen la respuesta correcta en una posición sin patrón y explicación acorde, y los números de los dos idiomas coinciden.

Lo que había que resolver antes de publicar eran tres cosas que rompían la entrega (el visor que la lección 01 levanta y no existía, `npm run check` sin pasar y la falta de `docs/VALIDATION.md`) y una afirmación medida mal leída (los tokens de prompt del ciclo de tools). Después vienen textos que contaban una salida del modelo que la corrida secuencial no repite, controles que no probaban lo que su paso afirma y correcciones de español.

## 2. Qué se revisó

- Todo el árbol salvo `.qa/`, `dist/` y `downloads/` (generados): README, `docs/`, `assets/` (las 26 lecciones campo por campo en los dos idiomas, modelos, glosario, fuentes, página de presentación), `labs/` (compose, kit Java, app Spring, servidor MCP de TypeScript, corpus, evaluación), `scripts/` y el workflow de la raíz. [LEÍDO]
- `npm run build` y `npm run check`; la suite completa de laboratorios en orden, desde un estado limpio, y otra vez las lecciones 18 a 25; servidores de chat de prueba con la misma imagen para medir repetibilidad, el registro del servidor durante el ciclo de tools, y velocidad con 16 y 24 hilos. [EJECUTADO]
- Spring AI 2.0.1 y las anotaciones de MCP en el jar que trae la imagen de la app; la especificación de MCP 2026-07-28; las opciones del servidor de llama.cpp b11749 en su `--help`; OWASP Top 10 para aplicaciones con LLM 2025. [FUENTE]
- Las 56 páginas en un navegador sin interfaz a 1280 y 390 px. [EJECUTADO]

## 3. Antes de publicar

### 3.1 El visor en vivo no existe [LEÍDO] [EJECUTADO]

La lección 01 empieza con `docker compose up -d --wait visor`, cada lección trae una nota para el visor en 127.0.0.1:18093, el modelo del kit lo dibuja y `check.mjs` lo exige, pero `labs/compose.yaml` no tiene ese servicio ni existe `labs/visor/`. El paso falla con "no such service" y `check.mjs` termina con un aviso pendiente.

Decisión: se construye el visor después de aprobar su diseño en un mockup, como cualquier función nueva que se ve. Hasta entonces el paso queda fuera de la validación y la card sigue abierta.

### 3.2 `npm run check` no pasa [EJECUTADO]

Faltaban `docs/VALIDATION.md` y `docs/validation-results.json`, que README y TEACHING enlazan; y `check.mjs` escribía los guiones prohibidos como caracteres dentro de su propia expresión regular, así que fallaba su propio control de estilo.

Decisión: los dos documentos se escriben con la evidencia de la suite, y la expresión pasa a `/[\u2013\u2014]/`. Con eso el control recorre todo y solo queda el aviso del visor.

### 3.3 Los tokens de prompt del ciclo de tools son una suma [FUENTE] [EJECUTADO]

La lección 12 decía que 974 tokens de prompt eran los de la pregunta con dos tools, y la 23 que 1399 eran los de una pregunta de una línea con cuatro. El registro del servidor muestra dos pedidos por pregunta, de 443 y 531 tokens en la lección 12 y de 652 y 747 en la 23, y Spring AI informa la suma de los pedidos del ciclo.

Decisión: las dos escenas, el resultado esperado del paso 12.4 y el modelo de la lección 12 dicen que es la suma de los dos pedidos, con las cifras de cada uno.

## 4. Defectos

### 4.1 Textos esperados tomados de corridas que no se repiten [EJECUTADO]

Los pasos 18.5 y 19.2 describían respuestas que llegaban al límite de 600 tokens; en las dos corridas secuenciales de la suite las respuestas cortan antes (74 y 101 tokens) y son idénticas entre sí. Un servidor de prueba mostró por qué: un pedido solo devuelve siempre el mismo texto, pero dos pedidos al mismo tiempo cambian la respuesta de los dos, y con un solo slot cambia igual una de ellas. Las corridas de medición anteriores a la suite no garantizaban un pedido por vez.

Decisión: todo texto de las lecciones que cita una salida del modelo se compara con la corrida secuencial de la suite y se corrige donde no coincide; `docs/VALIDATION.md` registra la medición, y `docs/TEACHING.md` la regla de que la suite manda un pedido por vez. La comparación corrigió las escenas 2 y 3 de la lección 18 (los desacuerdos de la corrida son en-07, en-08, es-03, code-03 y es-08), el paso 18.5, que pasa a code-03, la escena 1 y el paso 2 de la lección 19, la escena 2 de la 16 y su modelo (dos oraciones y una sola cita), el paso 23.4 (las llamadas se repiten sin alternar), los nombres de ejemplo del paso 3.3, los sistemas citados en la escena 1 de la lección 13, los costos de EXPLAIN del modelo de la 15 y la nota de fuentes del modelo de la 16. La memoria del contenedor de chat se midió aparte: 2,09 GiB recién iniciado y 2,32 GiB después de un prompt de 6000 tokens, contra los 3,3 GiB que decía el paso 8.2; el paso, la escena 3 de la lección 08 y su modelo usan esa medición.

### 4.2 Controles que no prueban lo que afirma su paso [LEÍDO] [EJECUTADO]

Varios pasos controlaban solo un encabezado: la búsqueda vectorial e híbrida de CAU-4021 sin probar que la coincidencia exacta queda afuera del top 5 (15.2, 15.4, 17.3), la posición del chunk en español (17.4), las citas de las notas plantadas (19.2, 19.3), la negación de la llamada (23.3), que con `--allow` nada se cierra (23.4, 24.6), la llamada real a `close_incident` que provoca el resultado envenenado (24.3), los resets sin incidentes cerrados (23.5, 24.7) y los cosenos de la lección 05.

Decisión: cada uno suma el control de su afirmación. Los nuevos se probaron contra las salidas guardadas de las dos corridas y pasan en las dos.

### 4.3 La velocidad con 24 hilos no tenía medición [EJECUTADO]

La lección 08 afirmaba que los 24 hilos dejaban la escritura en menos de un token por segundo, sin una corrida que lo registrara. Medido: 0,5 tokens por segundo con 24 hilos, contra 19 con 16.

Decisión: la escena dice medio token por segundo y el modelo usa la cifra medida.

### 4.4 Las corridas citadas usaron 8 hilos, no los 4 del kit [LEÍDO]

`labs/README.md` decía que los números de las lecciones salían de 4 hilos por servidor. Solo las velocidades de la lección 08 se midieron con 4; la suite corrió con `LLM_THREADS=8`.

Decisión: el README del kit lo dice así, y VALIDATION lo registra en la tabla de plataforma.

### 4.5 La búsqueda de la lección 15 y el tokenizador [LEÍDO]

La escena 2 atribuía el mal resultado de la búsqueda vectorial de CAU-4021 a "sus cinco tokens", que son los de Granite (lección 02); la búsqueda usa el modelo de embeddings, con otro tokenizador y una instrucción delante de la consulta.

Decisión: la escena dice que un código suelto lleva poco significado para el modelo de embeddings.

### 4.6 `search_runbooks` filtra por confianza y no se decía [LEÍDO]

`McpTools.java` busca con modo híbrido, reranker y solo los chunks con `trust` runbook, k 4. Las lecciones 20 y 25 la describían como la recuperación de la lección 17 o la mejor configuración de la 18, sin el filtro de la 19.

Decisión: las dos escenas y el texto del paso 20.4 nombran el filtro.

### 4.7 `close_incident` no era una tool de la lección 12 [LEÍDO]

La lección 19 decía que `--tools` ofrecía `close_incident` como una de las tools de la lección 12; esa tool aparece recién con `--tools`.

Decisión: la escena 3 y el paso 19.5 separan las dos tools de la lección 12 de `close_incident`.

### 4.8 "No la niega" dice lo contrario [LEÍDO]

En las lecciones 23 y 24, "la respuesta no la niega" quería decir que contestar que no rechaza la llamada, pero se lee como que la respuesta no la rechaza; el inglés "the answer no denies it" es ambiguo de la misma manera.

Decisión: "con un no, la llamada se rechaza" y "a no denies the call" en las escenas y en el paso 24.5.

## 5. Menores

- Lección 23, escena 3: "Dá" no es la forma del voseo; la regla pasa a "Dale al modelo la menor cantidad de tools, y un límite", y la frase del límite a "un límite que se cambia con --max-steps". [LEÍDO]
- Lección 00, regla en español: "Con un modelo local, cada pedido se ve y repetirlo es gratis". [LEÍDO]
- Lección 04, pregunta 2: "by law" contra "por definición"; el inglés pasa a "by definition". [LEÍDO]
- Lección 05, escena 2: "0 es que no tienen relación". [LEÍDO]
- Lección 21, pregunta 1: en 2025-11-25 la sesión es opcional y el servidor de TypeScript no da ninguna; la pregunta nombra el servidor de Spring. [FUENTE]
- Página de presentación: "Volver al curso" en vez de "Volver al inicio". [LEÍDO]
- `labs/compose.yaml`: el comentario del cliente Java suma la lección 24. [LEÍDO]
- `docs/TEACHING.md`: los pedidos de muestreo de la lección 03 no usan temperatura 0 ni la semilla 42; la frase lo exceptúa. [LEÍDO]
- `dist/` era más viejo que `assets/`; se regenera en cada `npm run build`. [EJECUTADO]

## 6. Comprobado sin observaciones

- Las anotaciones por defecto de `@McpTool` que cita la lección 22 (`destructiveHint` y `openWorldHint` en true), en la clase compilada de `spring-ai-mcp-annotations` 2.0.1. [FUENTE]
- La plantilla de chat con `--think`: los mismos 16 tokens, con `<think>` abierto al final. [EJECUTADO]
- La tokenización de CAU-4022 que dibuja el modelo de la lección 02. [EJECUTADO]
- Estructura, conteos, digests, puertos, manifiesto con SHA256, ZIP sin `.env` y renders de los modelos, con `check.mjs`. [EJECUTADO]
- Sin menciones a clientes, sistemas reales ni a cómo se produjo el material. [LEÍDO]
