# Validación

Este documento registra evidencia ejecutada y límites por versión; los modelos del navegador siguen siendo ilustrativos. Cada sección dice qué se ejecutó, en qué plataforma y qué quedó fuera.

## Versión 1.0.0, 20 de octubre de 2026

### Resultado

De los **129 pasos de las 26 lecciones**, 128 pasaron en una corrida secuencial de `scripts/test-labs.mjs`, de la lección 00 a la 25, que arrancó de un estado limpio y con el visor en vivo registrando cada comando. El que falta es opcional y no se corrió: el paso de la lección 09 que manda el mismo pedido a un proveedor remoto, porque necesita una clave en `labs/.env`. El resumen por paso está en [validation-results.json](validation-results.json); el informe completo, con la salida de cada paso, queda en `.qa/labs.json`, que no se versiona.

Estado limpio quiere decir: antes de la corrida se bajaron todos los servicios del proyecto con `docker compose --profile "*" down` y se borraron los volúmenes de la base, del estado de los incidentes, del lab y de los eventos del visor; se conservó solo el de los modelos. Así la lección 01 levantó el visor con el saludo de la lección 00 ya registrado, la 13 corrió sin la base levantada, como la encuentra quien sigue el curso, y la 14 creó el índice desde cero.

Antes de que existiera el visor, el curso ya había corrido entero en orden (`labs-only-0.json`, `labs-lesson-01-without-visor.json` y `labs-from-2.json`) y las lecciones 18 a 25 otra vez en una corrida secuencial completa (`labs-from-18.json`, 47 pasos aprobados), con salidas del modelo idénticas en las dos: las respuestas, las llamadas a tools, los veredictos del juez y las tablas de la evaluación. La corrida de esta validación repitió esas salidas salvo en dos pasos: el 18.5, cuyo comando cambió después de esas corridas (ahora pregunta por CAU-3012, la pregunta code-03 de la evaluación), y el 12.4, que se explica en la sección siguiente. En todo lo demás solo cambiaron los identificadores de sesión de MCP, los horarios y los mensajes de estado de los contenedores.

### Plataforma y versiones

| Componente | Versión ejecutada |
| --- | --- |
| Host | Windows 11 Pro 10.0.26200, PowerShell 5.1.26100 |
| Hardware | Intel Core Ultra 9 275HX, 24 núcleos y 24 hilos, 127,5 GB de RAM; la máquina virtual de Docker con 24 CPU y unos 62,5 GiB |
| Docker Desktop | 4.55.0 (213807), Engine 29.1.3, Compose 2.40.3-desktop.1, contenedores Linux amd64 |
| Node.js | v24.11.0 |
| Servidor de modelos | llama.cpp server b11749, imagen fijada por digest, solo CPU |
| Modelos | `granite-4.2-3b-Q4_K_M.gguf`, `Qwen3-Embedding-0.6B-Q8_0.gguf` y `qwen3-reranker-0.6b-q8_0.gguf`, con el SHA256 de `labs/models/manifest.txt` verificado al descargar |
| Base vectorial | pgvector 0.8.7 sobre PostgreSQL 18 |
| Aplicación | Java 25 (Temurin 25.0.4.1), Spring Boot 4.1.1, Spring AI 2.0.1, SDK Java de MCP 2.0.0 |
| Servidor MCP moderno | SDK de TypeScript de MCP, `@modelcontextprotocol/server` 2.3.1 y `@modelcontextprotocol/node` 2.1.1, sobre Node 24.22.0 |
| Visor | Node 24.22.0 sobre Alpine (`node:24.22.0-alpine`, fijada por digest), sin dependencias; la página se probó en Microsoft Edge 155 sin interfaz |
| Inspector | MCP Inspector 2.11.0, imagen fijada por digest |
| Hilos | `LLM_THREADS=8` en las corridas de la suite; las velocidades de la lección 08 se midieron aparte con 4, el valor por defecto del kit |

Durante las corridas había en la misma máquina otros contenedores ajenos al curso, con carga baja. Son versiones fijadas para reproducir el curso, no una afirmación de que sean las más nuevas.

### Qué tan repetible es lo generado

Todos los pedidos de la suite usan temperatura 0 y semilla 42, salvo los de muestreo de la lección 03, y apagan `cache_prompt`. Con eso, las corridas secuenciales dieron el mismo texto palabra por palabra, con una excepción que se cuenta al final de esta sección. Se midió aparte, contra un servidor de chat con la misma imagen, el mismo modelo y 8 hilos:

- El mismo pedido, solo o después de otros pedidos distintos (cuatro series de 7 a 10 pedidos, cada una con el servidor recién iniciado, con 4 slots o con uno), devolvió siempre el mismo texto.
- Dos pedidos al mismo tiempo cambiaron la respuesta de los dos: el servidor los procesa en el mismo lote, y la aritmética de ese lote no es la de cada pedido solo. Con un solo slot (`-np 1`) cambió igual una de las dos respuestas, así que la configuración de slots no lo evita.

Por eso la suite manda un pedido por vez, y los textos de las lecciones que citan salidas del modelo se compararon con la corrida secuencial. Con otro procesador, con otra cantidad de hilos o con pedidos en paralelo, las respuestas largas pueden ser otras; las lecciones las presentan como la corrida del curso y los controles miran su estructura, no su texto.

La excepción: en la corrida de esta validación, la tercera secuencial, el paso 12.4 dijo con otras palabras lo mismo que en las dos anteriores (`It was last updated on 2026-10-19 at 14:05 UTC. The owner is billing-on-call.` en lugar de `It was last updated on 2026-10-19T14:05:00Z by the billing-on-call owner.`), con un prompt del mismo tamaño, 974 tokens. Las llamadas a tools llevan un identificador que cambia en cada corrida, pero la plantilla de chat no lo incluye en el texto que lee el modelo, así que no explica la diferencia. Repetido después, solo y detrás del paso 12.3, el paso devolvió el texto de las corridas anteriores. La causa no se aisló. El control del paso mira la llamada a la tool y no el texto, y la lección no cita esa respuesta.

### Qué se observó

| Lecciones | Evidencia |
| --- | --- |
| 00 a 04 | Modelos verificados por SHA256 y primer saludo; el visor levantado, con ese saludo ya registrado; la distribución del token siguiente y el bucle de generación; tokens de inglés, español y del código CAU-4021; muestreo con semilla 42 en tres líneas iguales y con temperatura 0; un pedido de 9209 tokens rechazado contra un contexto de 8192. |
| 05 a 08 | Coseno 0,60 entre una oración y su traducción contra 0,39 para otra sin relación, y 0,92 para la negación contra 0,81 para una paráfrasis; el token siguiente de una oración sobre un banco, según su contexto; la plantilla de chat con 16 tokens, con y sin `<think>` abierto; `props` del servidor, memoria de los contenedores y velocidad de lectura y escritura. |
| 09 a 12 | El pedido HTTP de chat con sus roles y `finish_reason`; los eventos del streaming; salida estructurada con y sin schema; el ciclo de tool calling; la memoria de conversación en Spring AI (42 contra 119 tokens de prompt). |
| 13 a 17 | Respuestas sin contexto y con el archivo entero; 16 archivos, 86 chunks (43 por idioma); búsqueda vectorial, por palabras e híbrida para CAU-4021, con la coincidencia exacta fuera del top 5 en la vectorial y en la híbrida; respuestas con citas; el reranker sobre la búsqueda híbrida, con los dos chunks de CAU-4021 primero y segundo, y sobre la vectorial sola, que no recupera lo que esa búsqueda no trajo; para la pregunta en español, el chunk de CAU-4021 tercero y citado en la respuesta. |
| 18 a 19 | Hit rate 16/18, 18/18, 18/18 y 18/18 y MRR 0,75, 0,94, 0,87 y 0,96 para vectorial, palabras, híbrida e híbrida con reranker, iguales en las tres corridas; respuestas 20/20 según los controles y 15/20 según el juez, con los mismos cinco desacuerdos en las tres corridas; las notas plantadas (18 archivos, 88 chunks) dentro del top 4, la orden repetida aun con la regla de la lección y el filtro por confianza que la saca. |
| 20 a 22 | tools/list con las cuatro tools y sus anotaciones, tools/call con `structuredContent`, recursos, template y prompt con rol `user`; la revisión 2025-11-25 con sesión y la 2026-07-28 sin sesión, los errores -32020 y -32022, el servidor de Spring rechazando el pedido moderno y el Inspector en modo moderno terminando con código 1; el mismo servidor por stdio con tres respuestas para cuatro mensajes. |
| 23 a 25 | El agente con las tools de MCP; la llamada que cambia datos negada con `--approve`; con `--allow` y sin `close_incident`, el host cortando la corrida a las 6 llamadas; la descripción envenenada y la orden en el resultado que consigue un `close_incident` real sobre INC-2041; la afirmación falsa de cierre con `--allow`; el 403 para un Origin ajeno; la tarea en inglés y en español del asistente final, y `reset` sin incidentes para reabrir. |

Medido aparte, para afirmaciones puntuales de las lecciones:

- Tokens de prompt del ciclo de tools: el registro del servidor muestra dos pedidos por pregunta, de 443 y 531 tokens con las dos tools de la lección 12 (974 en total) y de 652 y 747 con las cuatro tools de MCP de la lección 23 (1399 en total). Spring AI informa la suma de los pedidos del ciclo.
- Memoria del contenedor de chat con `docker stats`: 2,09 GiB recién iniciado y 2,32 GiB después de un prompt de 6000 tokens; en el paso 8.2 de la corrida, 2,14 GiB.
- Velocidad de escritura por hilos, con el mismo pedido de 89 tokens: unos 10 tokens por segundo con 4 hilos, 13 con 6, 15 con 8, 18 con 12, 19 con 16 y 0,5 con 24; la lectura de un prompt de 1721 tokens fue de unos 73 tokens por segundo con 4 hilos y 139 con 16. Con 24 hilos el proceso ocupó toda la CPU disponible mientras escribía medio token por segundo.
- Las anotaciones por defecto de `@McpTool` en `spring-ai-mcp-annotations` 2.0.1, leídas en la clase compilada que trae la imagen de la app: `readOnlyHint` false, `destructiveHint` true, `idempotentHint` false y `openWorldHint` true.
- `lab tokens "CAU-4022"`: cinco tokens, `CA`, `U`, `-`, `40` y `22`, los del modelo de la lección 02.

### El visor en vivo

Con los eventos de la corrida, `npm run test:visor` pasó sus 17 controles: la página con su CSP y `nosniff`; 405 para POST, PUT y DELETE; 403 para un Host ajeno; 404 para `server.mjs` y para un identificador inválido; todos los eventos se cargan; hay eventos del lab y de la app, sesiones MCP por HTTP y por stdio, y mensajes MCP unidos a los comandos que los mandaron (el agente y `mcp-wire`); cada paso de `lab` o `app`, salvo el opcional con `--remote`, dejó un evento con su misma línea de comando, y ningún encabezado secreto quedó registrado. El control de que la clave de `labs/.env` no aparezca en ningún evento corre solo cuando ese archivo tiene una clave, y en esta corrida no la tenía. El registro quedó con 113 eventos en 3,8 MB: 103 comandos (51 del lab y 52 de la app, tres de ellos de repetir los pasos 12.3 y 12.4) y 10 sesiones MCP que no coinciden con un comando del lab o de la app (9 por HTTP y 1 por stdio). La evidencia queda en `.qa/visor.json`, que no se versiona.

El volumen de eventos funciona lo cree quien lo cree: se probó creado por el visor, que lo monta en solo lectura, y creado por el lab; en los dos casos los comandos escriben y el visor lee.

El comando para empezar el registro de cero (`docker compose run --rm --user root --entrypoint sh lab -c "rm -f /events/*"`) se probó sobre el volumen de otro proyecto de Compose, para no borrar esta evidencia: borra los eventos que escribe el usuario del lab, termina con código 0 aunque no haya nada que borrar y deja el directorio con sus permisos. Que el visor suelte los eventos borrados y que los servidores MCP vuelvan a crear su archivo en el mensaje siguiente se leyó en el código, sin ejecutarlo.

En Edge sin interfaz, por el protocolo de depuración, se eligió cada uno de los 113 eventos en los dos idiomas, a 1280 por 900 y a 390 por 844: 452 vistas sin excepciones, sin errores ni avisos en la consola, sin desborde horizontal y con el idioma pedido. Se revisaron además capturas del agente con el servidor envenenado de la lección 24, con el esquema oscuro y a 390 px, y de la comparación fijada entre la lección 21 legacy y la moderna.

### Verificaciones estáticas e interfaz

`npm run build` genera las 26 páginas de lecciones, los apuntes en los dos idiomas, la tabla de comandos del visor (`labs/visor/static/lessons.json`), el ZIP del kit (72 archivos, sin `.env`, kubeconfig, modelos ni compilados) y `dist/`. `npm run check` recorre lecciones, escenas, preguntas, pasos y controles, renderiza los modelos en las cuatro apariencias y los dos idiomas, y controla imágenes fijadas por digest, puertos solo en 127.0.0.1, el manifiesto de modelos, el visor (el servicio, el volumen de eventos en cada servicio que escribe, solo GET, el control de Host, la CSP, la página sin código en línea y la tabla de comandos al día con los pasos), enlaces, codificación y estilo, y termina sin avisos.

Las 56 páginas (portada, la página de presentación y las 26 lecciones, en los dos idiomas) se cargaron en un navegador Chromium sin interfaz a 1280 por 900 y a 390 por 844: sin errores ni excepciones del curso en la consola y sin desborde horizontal; cada página con su título y el idioma pedido. En las 26 lecciones, en los dos idiomas y a 1280 px, se recorrieron además las tres escenas, las cuatro pestañas y las tres preguntas del control respondidas bien, con el puntaje 3 / 3 al final y sin errores ni desborde. La portada, tres lecciones y la página de presentación se revisaron también en capturas a 1280 px.

### Reproducir

Desde la carpeta del curso, con Docker y Compose v2:

```text
npm run build
npm run check
node scripts/test-labs.mjs
npm run test:visor
```

La suite toca solo el proyecto Compose `prumathe-llm`, corre los comandos de cada lección en orden y escribe su informe en `.qa/`. `--from=N` retoma desde una lección, suponiendo hechas las anteriores; `--only=N` corre una sola. Los pasos opcionales corren solo con `--remote` y un `labs/.env` con clave. `npm run test:visor` necesita el visor levantado (`docker compose up -d --wait visor`, como en la lección 01) y los eventos de una corrida completa, y escribe `.qa/visor.json`. La limpieza y sus efectos sobre los datos están en [labs/README.md](../labs/README.md).

### Fuera de esta evidencia

No se ejecutaron macOS ni Linux como host, ARM64, una GPU ni el paso opcional contra un proveedor remoto. El visor se probó solo en Edge, un navegador Chromium; no en Firefox ni en Safari. Las velocidades y los textos generados valen para esta máquina y esta cantidad de hilos; en otra pueden ser otros, y las lecciones lo dicen. El workflow de GitHub del curso se entrega como configuración y no se ejecutó en GitHub; no se publicó el sitio con este curso.
