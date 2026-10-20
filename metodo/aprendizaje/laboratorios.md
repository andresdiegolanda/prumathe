# Laboratorios

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
