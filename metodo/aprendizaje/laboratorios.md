# Laboratorios

### Un emisor de credenciales de prueba no verifica autenticación real

Un laboratorio que fabrica tokens puede probar los validadores, permisos y consultas del recurso, pero no el inicio de sesión, el consentimiento ni las políticas del proveedor. La interfaz, el kit y la evidencia nombran esa separación. El modo real cambia explícitamente la raíz de confianza y nunca vuelve al emisor local como alternativa a una falla.

Origen: Microsoft Entra 1.0.0, con un emisor local para casos negativos y un recorrido de tenant separado ([VALIDATION](../../entra-from-scratch/docs/VALIDATION.md)).
Control: la suite local se niega a correr en modo Entra; el recorrido de tenant comprueba que una credencial local siga rechazada.

Revisiones citadas: [Kafka](../../reviews/2026-10-17-kafka-from-scratch-v1.0.0.md), [Docker y Kubernetes](../../reviews/2026-10-18-docker-kubernetes-from-scratch-v1.0.0.md) y [GitHub](../../reviews/2026-10-18-github-from-scratch-v1.0.0.md), todas sobre la 1.0.0 de cada curso.

### Los comandos viven una sola vez y la suite ejecuta esos mismos

El texto de la lección es la fuente: la suite lee los comandos de ahí, los ejecuta y compara lo esperado. No hay una copia aparte para las pruebas.

Origen: así se hizo en Docker y Kubernetes (su `docs/TEACHING.md`); en Kafka, `check.mjs` cruza cada comando del currículo con su implementación.
Control: `check.mjs` y la suite del curso.

### Cada comando se prueba en el shell que va a usar quien cursa

Una suite que llama a los ejecutables sin shell no prueba las comillas. Comillas dobles dentro de simples fallan en Windows PowerShell 5.1.

Origen: el paso 2 de la lección 06 de Docker y Kubernetes fallaba en PowerShell y la suite no lo vio (§3.3).
Control: `check.mjs` rechaza comillas anidadas; mejor todavía, que la suite corra cada comando una vez por `powershell -Command` y por `sh -c`.

### Lo que imprime el kit se puede copiar y pegar

Origen: `lab.mjs`, del curso de GitHub, imprimía argumentos con espacios sin comillas, que no corrían tal cual en ningún shell (§6.3).
Control: la suite pega y ejecuta al menos una línea impresa.

### Rehacer una lección no toca las demás

Cada lección tiene un paso que borra y recrea solo lo suyo (`prepare N`), se niega si hay consumidores activos y no borra lo opcional. Empezar de cero es aparte y explícito (`down --volumes` del proyecto del curso).

Origen: Kafka (§7.5, entre lo que conviene no perder); `labs/README.md` del curso lo documenta.
Control: suite `core`.

### Todo con nombre propio y acotado al curso

Proyecto Compose con nombre fijo, puertos en 127.0.0.1, prefijos en los recursos, namespace y contexto explícitos, sin `prune` ni la configuración habitual del usuario, sin identidad real.

Origen: las tres revisiones lo marcan entre lo que conviene no perder (Kafka §7.5, Docker y Kubernetes §7.4, GitHub §7.5).
Control: `check.mjs` y revisión de los comandos.

### Las esperas se anticipan, y las artificiales se evitan

Si un paso tarda, el texto dice cuánto y por qué. Si la espera la provoca la aplicación de práctica, se corrige la aplicación.

Origen: en Docker y Kubernetes, borrar un Pod tardaba 30 segundos sin aviso porque la aplicación no atendía SIGTERM y Kubernetes esperaba el período de gracia (§4.8); la 1.1.0 la hizo atender la señal.
Control: tiempos por paso en la evidencia de la suite.

### Sin ruido en la salida ni carga de más en la máquina

Cada línea que imprime un comando es algo que hay que interpretar; cada health check permanente es carga en la laptop de quien cursa.

Origen: Kafka imprimía "Picked up JAVA_TOOL_OPTIONS" antes de cada salida, y el health check de cada broker arrancaba una JVM cada 10 segundos para siempre (§4.7 y §4.8).
Control: mirar la salida completa de cada comando y el consumo del entorno en reposo.

### El mínimo de versión declarado cubre todo lo que el kit promete

Origen: el curso de GitHub declaraba Git 2.28, pero el aislamiento de la configuración que prometía usa `GIT_CONFIG_GLOBAL`, de Git 2.32 (§4.2).
Control: para cada garantía del kit, la versión en que aparece lo que la sostiene, con su fuente.

### El kit descargable es autosuficiente

Lo que viaja en el ZIP no remite a archivos que no trae ni habla de cómo se validó.

Origen: la lección 00 de Docker y Kubernetes remitía a `docs/VALIDATION.md`, que el ZIP no lleva (§4.7); el `labs/README.md` de GitHub contaba la validación (§4.8).
Control: abrir el ZIP en una carpeta vacía y seguir la lección 00 desde ahí.

### Se valida la ruta que enseña la lección, no una alternativa

Si la ruta de quien cursa no se puede ejecutar en la máquina disponible, lo ejecutado por otra ruta se registra como tal y queda una card para ejecutar la real.

Origen: las 48 prácticas de Kubernetes solo pasaron dentro del nodo kind, porque la máquina intercepta TLS en el endpoint local (Docker y Kubernetes §3.2; card en el [`tablero.md`](../../tablero.md)).
Control: VALIDATION dice por qué ruta pasó cada parte.

### Las suites dicen qué dejan levantado y qué reinician

Origen: la suite de Docker y Kubernetes deja el clúster y el proyecto levantados (§4.3); las de Kafka reinician los tópicos de práctica, así que no se corren sobre un clúster en uso sin decidirlo.
Control: el README del curso y el de `labs/` lo dicen junto a cómo se corren.

### La evidencia de las pruebas no ensucia el árbol

Las suites escriben en una carpeta ignorada (`.qa/`) y los controles hacen sus pruebas en la carpeta temporal del sistema.

Origen: `check.mjs` de GitHub escribía en `.qa/` (§7.2); Kafka traía en `.qa/` scripts y una copia vieja del curso (§7.2), que pasaron a `tmp/_obsoleto/`.
Control: `git status` limpio después de build, check y suites.

### El código que el curso manda a leer tiene que ser legible

Origen: Kafka invitaba a leer `Lab.java`, de 327 líneas con una de 708 caracteres (§6.1); la 1.1.0 lo partió en una clase por tema y lo formateó.
Control: formateador antes de cada commit.

### Una herramienta de terceros se prueba antes de escribir su lección

Se corre la versión que se va a fijar contra el sistema del curso, y se contesta con evidencia lo que la documentación no dice: compatibilidad, qué bloquea, qué deja en el sistema, cuánta memoria usa. Lo que la lección espera observar nombra rótulos de esa interfaz, que pueden cambiar en la próxima versión: el `docs/TEACHING.md` del curso dice cómo revisarlos al actualizar.

Origen: Kafbat UI en Kafka 1.6.0. La documentación no decía qué bloquea el modo de solo lectura ni si mirar mensajes crea grupos; se contestó leyendo su código (el filtro de la API) y corriendo la imagen contra el clúster del curso (405 en las escrituras, ningún grupo nuevo). La misma prueba mostró que su versión vigente se apoya en Spring Boot 3.5 y clientes de la línea 3.9, y quedó dicho en VALIDATION.
Control: la suite de la lección, y una pasada a mano por la interfaz cada vez que cambia la versión fijada.

### Cada servicio publicado tiene un puerto que ningún otro curso usa

Quien cursa puede tener dos cursos levantados. Antes de publicar un puerto, se mira cuáles usan los demás.

Origen: el 20/10, el puerto elegido para Kafbat UI (18091) ya lo usaba el visor del curso de Docker y Kubernetes, y la app de ese curso y la de Spring del de Kafka comparten 18080 (card en el [`tablero.md`](../../tablero.md)).
Control: la lista de puertos en uso de esa card, hasta que exista un control automático.

### Una herramienta en vivo muestra el sistema real con el dibujo del curso

Un visor local que lee el sistema cada medio segundo hace visible lo que el experimento cambia, con las mismas formas y palabras que los modelos. Lo sirve la imagen del laboratorio en 127.0.0.1, se abre en la lección 01 y cada lección dice qué seguir. Al pasar el mouse muestra el contenido, y al hacer clic, qué es el objeto, para qué sirve, qué muestra ahora y qué acciones soporta, con el comando y la lección (todo comando nombrado existe en una lección). Si el sistema no responde, muestra la última lectura buena marcada como vieja.

Origen: visor de Kafka 1.5.0; el panel de detalle y el contenido al pasar el mouse se definieron sobre el mockup, antes del código.
Control: `check.mjs` compara su tabla de lecciones con el currículo; la suite `visor` lo prueba contra el clúster real.

### Una herramienta de observación demuestra que no cambia lo observado

Que solo lee se prueba, no se afirma: la suite comprueba que no aparece nada propio de la herramienta, y las demás suites pasan con ella abierta.

Origen: visor de Kafka 1.5.0: lee sin `group.id` ni commits, y `core`, `failures`, `integrations` y `spring` pasaron con el visor abierto ([`VALIDATION.md`](../../kafka-from-scratch/docs/VALIDATION.md), entrada 1.5.0).
Control: suite propia y el resto de las suites con la herramienta levantada.

### Cada rótulo dice lo que se midió

Una vista cuenta lo que realmente mide. Donde la compactación o las transacciones dejan huecos, "6 registros" es falso y "6 offsets entre inicio y fin" es cierto.

Origen: visor de Kafka 1.5.0, corregido durante la validación con temas compactados y transaccionales.
Control: validar cada vista con los casos que rompen la intuición (borrados, huecos, sistema caído).

### Lo generativo se escribe después de medirlo

El texto de una lección con un modelo de lenguaje cita la salida medida en el kit, con sus defectos, y el control de la práctica mira su estructura (una cita, una tool, un encabezado). Lo que se supuso antes de medir se reescribe con lo medido.

Origen: LLMs, RAG y MCP 1.0.0: la lección 19 suponía que una nota plantada haría llamar a `close_incident`; medido, el modelo solo repitió la orden. La llamada apareció en la lección 24, con la orden en el resultado de una tool ([`docs/VALIDATION.md`](../../llm-rag-mcp-from-scratch/docs/VALIDATION.md)).
Control: cada número o salida del texto tiene su sección en un log de medición; la suite controla la estructura.

### Un agente con tools lleva un presupuesto de llamadas

Un host que ofrece tools a un modelo corta la corrida después de un número de llamadas y lo dice. Sin eso, un modelo al que le falta la tool que necesita repite las otras hasta llenar el contexto.

Origen: LLMs, RAG y MCP 1.0.0, lección 23: con `--allow` y sin `close_incident`, el modelo alternó dos tools durante más de cinco minutos hasta que se cortó a mano; `Guard.java` corta ahora en 6 llamadas (`--max-steps`).
Control: el paso de la lección 23 con `--allow`, en la suite.

### El kit cumple lo obligatorio de la especificación que enseña

Antes de enseñar una regla de seguridad de un protocolo, se prueba que los servidores del kit la cumplen; si el framework no la trae, el kit la agrega y la lección lo dice.

Origen: LLMs, RAG y MCP 1.0.0: con la configuración del kit, el servidor de Spring AI 2.0.1 respondía 200 a un `Origin` ajeno, que la especificación de MCP manda rechazar con 403; se agregó `OriginFilter.java` y la lección 24 lo muestra con `mcp-wire --origin`.
Control: el paso de la lección 24 en la suite.

### Lo que publica un framework se lee en el cable

Una anotación no dice todo lo que el framework genera: se lista lo publicado (`tools/list`, `prompts/get`) antes de escribir la lección.

Origen: LLMs, RAG y MCP 1.0.0: un `@McpPrompt` que devolvía un `String` salía como mensaje de rol `assistant`, no `user`; ahora devuelve un `GetPromptResult` con rol `user` y la lección 22 lo explica.
Control: el paso de `prompts/get` de la lección 22 comprueba el rol.

### En PowerShell 5.1, la salida redirigida se decodifica con la página de códigos de la consola

Los argumentos con acentos llegan bien a los contenedores, pero la salida que pasa por un pipe o una variable sale rota si la consola no está en UTF-8. La guía del kit da la línea que lo arregla, y los scripts de medición la ponen al principio; además, un `.ps1` sin BOM se lee en ANSI, así que sus acentos van con códigos de carácter.

Origen: medición de LLMs, RAG y MCP 1.0.0 en la laptop, con `lab tokens "¿Qué pasa?"` bajo la página 850 y bajo UTF-8.
Control: [`labs/README.md`](../../llm-rag-mcp-from-scratch/labs/README.md) del curso.

### Lo generado se mide con un pedido por vez

Los textos que citan una salida del modelo salen de una corrida secuencial de la suite, con los hilos que dice el documento de validación. Temperatura 0 y semilla fija no alcanzan: dos pedidos al mismo tiempo comparten lote en el servidor y cambian la respuesta de los dos.

Origen: LLMs, RAG y MCP 1.0.0: dos textos esperados (pasos 18.5 y 19.2) describían respuestas de una corrida de medición fuera de la suite, que no garantizaba un pedido por vez; las dos corridas secuenciales de la suite dieron otras, idénticas entre sí, y un servidor de prueba confirmó el efecto del lote ([`docs/VALIDATION.md`](../../llm-rag-mcp-from-scratch/docs/VALIDATION.md)).
Control: la suite corre un paso por vez; antes de escribir una salida generada, se comparan dos corridas.

### Un número que informa el framework se cruza con el servidor

Un contador que entrega una biblioteca puede sumar varios pedidos; antes de explicarlo en una lección, se compara con el registro del servidor.

Origen: LLMs, RAG y MCP 1.0.0: los 974 y 1399 tokens de prompt que informa Spring AI en el ciclo de tools eran la suma de dos pedidos (443 y 531, 652 y 747), y las lecciones 12 y 23 los presentaban como uno ([revisión](../../reviews/2026-10-20-llm-rag-mcp-from-scratch-v1.0.0.md), 3.3).
Control: el registro del servidor de chat por pedido, en la medición que cita VALIDATION.
