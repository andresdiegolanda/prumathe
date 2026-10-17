# Review: Kafka from scratch v1.0.0

Estado: aplicada el mismo día en la versión 1.1.0 del curso (prioridades 1 y 2 de la §8 completas, más las apariencias); lo que quedó para versiones siguientes (6.3 a 6.7, Spring Boot 4.x, la revisión sobre Kafka 4.2 o 4.3, los brokers sin root) tiene card en [`tablero.md`](../tablero.md). El detalle está en [`CHANGELOG.md`](../CHANGELOG.md); el texto de abajo describe la 1.0.0 tal como estaba.

Fecha: 2026-10-17. Objeto: [`kafka-from-scratch/`](../kafka-from-scratch/) tal como está antes de la primera subida a GitHub (versión 1.0.0, validación del 15/10 en [`docs/VALIDATION.md`](../kafka-from-scratch/docs/VALIDATION.md)).

Cada hallazgo dice cómo se estableció:

- **[LEÍDO]**: surge de leer el archivo citado; cualquiera lo reproduce abriendo ese archivo.
- **[EJECUTADO]**: se corrió algo en esta revisión (un cálculo, un conteo, una búsqueda sobre los archivos).
- **[FUENTE]**: se contrastó con documentación o anuncios oficiales, con la fecha.
- **[NO VERIFICADO]**: requiere levantar la plataforma Docker; no se hizo en esta revisión, que no ejecutó los laboratorios. Para el comportamiento en ejecución la referencia sigue siendo `docs/VALIDATION.md`.

## 1. Veredicto

El curso está bien construido y es publicable con pocos arreglos. Las cosas que lo sostienen: cada lección repite el mismo ciclo (modelo, predicción, experimento real, control), cada afirmación de garantía nombra su límite, los laboratorios tienen aserciones ejecutadas y evidencia, la plataforma Compose está acotada a un proyecto con nombre y puertos en `127.0.0.1`, y el español rioplatense es consistente. Los conceptos revisados uno por uno (particionado por Murmur2, ISR y `min.insync.replicas`, quórum KRaft, retención por segmentos, tombstones, idempotencia del productor contra deduplicación de negocio, transacciones y `read_committed`, compatibilidad Avro, outbox, changelog de Streams, hora del flujo y tolerancia, ACL, share groups en 4.1) están explicados sin errores de fondo.

Lo que hay que resolver antes de hacerlo público son tres cosas de la sección 3: textos que hablan de cómo se produjo el curso, guiones largos y cortos en el contenido, y el titular de la licencia. Después vienen dos defectos chicos de la sección 4 y la vigencia de las versiones de la sección 5, que para la audiencia del repositorio (arquitectos Java y Spring) pesa más que en un curso genérico.

## 2. Qué se revisó

- Todo el árbol salvo `.qa/`, `dist/` y `release/` (generados, fuera de Git): README y `docs/`, `assets/curriculum.js` (las 29 lecciones, 87 escenas, 130 pasos y 29 controles), `assets/app.js`, `assets/visuals.js`, `assets/reference.js`, `labs/` completo (`compose.yaml`, `Lab.java`, Connect, seguridad, el proyecto Spring), `scripts/` (build, check, package, serve, test-labs), `_headers`, `404.html`, `.gitattributes`, `.gitignore`, `package.json`, `LICENSE` y el workflow. [LEÍDO]
- Los conteos que el README declara: 29 lecciones en 8 unidades, 87 escenas, 130 pasos, 29 controles, 46 términos del glosario. Coinciden. [EJECUTADO]
- La implementación de Murmur2 de `visuals.js` contra los vectores de prueba del propio Kafka (`UtilsTest`: `21`, `foobar`, `a-little-bit-long-string`, `a-little-bit-longer-string`, `lkjh234lh9fiuh90y23oiuhsafujhadof229phr9h19h89h8`, `abc`) y los dos vectores que usa `check.mjs` (`''` y `hello`). Los ocho coinciden. [EJECUTADO]
- Fines de línea de los archivos que viajan a contenedores Linux (`start.sh`, `append.sh`, `compose.yaml`, los Dockerfile): todos LF, sin ningún CR. [EJECUTADO]
- Versiones fijadas contra los anuncios oficiales de Apache Kafka y Spring (sección 5). [FUENTE]

## 3. Antes de publicar

### 3.1 Textos que cuentan cómo se produjo el curso [LEÍDO]

La regla del repositorio es que el material no menciona cómo se produjo. Hay frases que lo hacen, y además le resultan raras a un lector externo porque hablan de un contexto que no conoce:

- [`README.md`](../kafka-from-scratch/README.md), Credits: "The interaction approach was inspired by the user's visual guides" (¿qué usuario?), "No source-guide datasets, screenshots, text blocks or dependencies were copied".
- [`README.md`](../kafka-from-scratch/README.md), Folder independence: "It contains no references to the source inspiration folder or to private project data".
- [`docs/DEPLOYMENT.md`](../kafka-from-scratch/docs/DEPLOYMENT.md): "ready to be moved into its own repository", "Publish the course folder only, not its parent workspace", "The parent workspace may already be a different repository".
- [`docs/VALIDATION.md`](../kafka-from-scratch/docs/VALIDATION.md): "The host Maven installation had a certificate trust problem", "The browser automation virtual clipboard is separate from the website clipboard", "no public repository or site was created in this delivery".

Qué hacer: reescribir Credits como una atribución normal (autor, licencia, marcas de Apache); borrar las frases de independencia respecto de otra carpeta; en DEPLOYMENT describir la situación real (el curso es una carpeta de este repositorio, ver 7.2); en VALIDATION dejar los resultados y las condiciones (plataforma, versiones, fecha) y sacar las anécdotas del entorno de producción y de la herramienta de navegación.

### 3.2 Guiones largos y cortos en el contenido [EJECUTADO]

La regla del proyecto es sin guiones largos en ningún archivo. Hoy hay: `README.md` del curso 7 guiones cortos (los rangos de lecciones de la tabla, 01 a 04 y similares), `curriculum.js` 3 cortos (los rangos de segundos de espera de las lecciones 13 y 14), `app.js` 3 largos (el título de la página, entre el nombre del curso y "A visual field guide", y el rango de lecciones de la portada, entre "01" y "29"), `visuals.js` 2 largos, `index.html` 2 largos (título y descripción, generados por `build.mjs`), y los apuntes descargables heredan los de arriba. Las 29 páginas de `lessons/` se regeneran con `npm run build`, así que basta corregir las fuentes.

Qué hacer: decidir si el contenido en inglés queda exento (el guion corto para rangos es convención tipográfica en inglés) o si la regla es total; en cualquier caso los largos del título y de `app.js` se reemplazan por dos puntos o punto. La regla 8 del [README del repositorio](../README.md) hoy acota "sin guiones largos" a los documentos del repositorio; hay que alinearla con la decisión.

### 3.3 Titular de la licencia [LEÍDO]

[`LICENSE`](../kafka-from-scratch/LICENSE) dice "Copyright (c) 2026 Kafka from scratch contributors". Antes de que exista un repositorio público conviene decidir el titular (nombre propio u organización); después es más incómodo cambiarlo.

## 4. Defectos

### 4.1 Lección 14 (compactación), paso 1: lo esperado no se puede observar [LEÍDO]

El paso dice "Four acknowledged records; the last has value <null>", pero `compact-seed` imprime con `send()`, que escribe `ACK topic=... partition=... offset=... key=...` sin el valor ([`Lab.java`](../kafka-from-scratch/labs/src/main/java/course/Lab.java), método `send`). El `<null>` recién se ve en `read 13` (paso 3) o en `table`. Corregir el texto esperado ("cuatro ACK; el último es el tombstone de B, que vas a ver como `<null>` al leer") o agregar el valor a la línea ACK.

### 4.2 Botón "Siguiente lección" ausente al terminar la lección 28 [LEÍDO]

En [`app.js`](../kafka-from-scratch/assets/app.js), `quizView` muestra el botón de siguiente lección solo si `lesson.id<27`. La lección integradora tiene `id` 27 y sí tiene siguiente (Spring, `id` 28). Es un resto de cuando el curso tenía 28 lecciones. Cambiar a `lesson.id<course.lessons.length-1`, como ya hace el pie de página.

### 4.3 La versión y la fecha viven en cinco lugares [LEÍDO]

`curriculum.js` exporta `{version:'1.0', kafka:'4.1.2', date:'2026-10-15'}`, pero `build.mjs` escribe "Apache Kafka 4.1.2 | 2026-10-15" a mano en los apuntes, `app.js` escribe "APACHE KAFKA 4.1.2" en la cabecera y "checked on 15 October 2026" en Profundizá, y los README repiten ambas. En la próxima actualización de Kafka se va a desfasar alguno. Que `build.mjs` y `app.js` lean los valores de `curriculum.js`; los README quedan como únicos textos a mano.

### 4.4 Lección 02, escena 1 en español: nombres de eventos traducidos [LEÍDO]

El texto dice "PedidoCreado registra algo que ya pasó. PrepararPedido es un comando", pero el laboratorio emite `"type":"OrderPlaced"` y la cabecera `event-type=OrderPlaced`. Contradice la propia regla del curso de conservar los nombres tal como aparecen en las herramientas. Dejar `OrderPlaced` y `ShipOrder` en español también, explicados.

### 4.5 Redacción del control de la lección 06 [LEÍDO]

"What does a successful send() method return immediately guarantee?" no es una oración correcta. Por ejemplo: "send() returned without an immediate error. What does that guarantee?".

### 4.6 `404.html` con rutas absolutas [LEÍDO]

Usa `/assets/course.css` y `/index.html`. Funciona en la raíz de Cloudflare Pages y en ningún otro lado: ni abierto localmente ni publicado bajo un subdirectorio. Es la única página del curso que no es relocalizable. Bajo impacto, pero contradice "all runtime paths are relative".

### 4.7 Ruido en cada comando del laboratorio [LEÍDO] [NO VERIFICADO]

`JAVA_TOOL_OPTIONS` en el servicio `lab` de [`compose.yaml`](../kafka-from-scratch/labs/compose.yaml) hace que la JVM imprima "Picked up JAVA_TOOL_OPTIONS: ..." al arrancar cada comando. Es una línea de ruido antes de cada salida que el estudiante tiene que interpretar. Mover `-Xmx512m` y el nivel de log al `ENTRYPOINT` del Dockerfile. Confirmar en una corrida que la línea desaparece.

### 4.8 Healthcheck caro de forma permanente [LEÍDO]

Los tres brokers ejecutan `kafka-topics.sh --list` cada 10 segundos para siempre: tres arranques de JVM cada 10 segundos en la laptop del estudiante, también cuando ya está todo sano. Alargar `interval` (30 a 60 segundos) una vez pasado `start_period`, o usar una comprobación más liviana. Esto también aplica al broker `secure`.

### 4.9 Brokers como root [LEÍDO] [NO VERIFICADO]

`user: "0:0"` en el ancla `x-broker`. La imagen `apache/kafka` corre como `appuser` y un volumen con nombre nuevo hereda los permisos del directorio de la imagen, así que probablemente no haga falta. Si al sacarlo los volúmenes dan error de permisos, documentar por qué se deja; si no, sacarlo, porque enseña un hábito que después hay que desaprender.

## 5. Vigencia de las versiones

### 5.1 Kafka 4.1.2 y los share groups [FUENTE]

Kafka 4.1.2 salió el 17/03/2026 como corrección de la línea 4.1. Antes, el 17/02/2026, 4.2.0 declaró "Kafka Queues (Share Groups) is now production-ready"; después salieron 4.3.0 (22/05/2026), 4.3.1 (25/06/2026) y 4.2.2 (29/09/2026). Fuentes: [anuncio de 4.1.2](https://kafka.apache.org/blog/2026/03/17/apache-kafka-4.1.2-release-announcement/), [anuncio de 4.2.0](https://kafka.apache.org/blog/2026/02/17/apache-kafka-4.2.0-release-announcement/), [índice del blog](https://kafka.apache.org/blog/).

El curso fija 4.1.2 a propósito y lo dice; eso está bien y no hay que cambiarlo en silencio. El problema es la lección 27: enseña que los share groups son "preview functionality" que "must be enabled" como si fuera el estado actual, y el glosario repite "preview". Un estudiante que termine el curso en 2026 se lleva un dato vencido. Qué hacer ahora: una frase en la escena 3 y en el glosario ("preview en 4.1, la versión de este curso; production-ready desde 4.2"). Qué planificar: una revisión del curso sobre la línea 4.2 o 4.3, que además trae argumentos de CLI estandarizados (KIP-1147) que cambian comandos de las lecciones.

### 5.2 Spring Boot 3.5.16 [FUENTE]

3.5.16 salió el 25/06/2026 y es la última versión open source de la línea 3.5, cuyo soporte open source terminó el 30/06/2026; la línea vigente es Spring Boot 4.x. Fuentes: [Spring Boot 3.5.16 available now](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/), [fin de soporte de 3.5](https://www.herodevs.com/blog-posts/spring-boot-3-5-is-officially-end-of-life-here-is-what-that-means-for-teams-still-running-it).

Para la audiencia de este repositorio, una lección de Spring sobre una línea sin soporte open source es lo primero que le van a observar. El ejemplo usa `KafkaTemplate`, `@KafkaListener`, `TopicBuilder`, `CommonContainerStoppingErrorHandler` y `JsonSerializer`, todo presente en Spring Kafka 4; la migración debería ser chica. Qué hacer: pasar la lección 29 a Boot 4.x en la próxima versión; mientras tanto, decir en `labs/spring/README.md` que 3.5.16 es la última 3.5 open source y por qué se mantiene.

### 5.3 Java 21 contra `release` 17 [LEÍDO]

[`labs/pom.xml`](../kafka-from-scratch/labs/pom.xml) compila con `maven.compiler.release=17` dentro de una imagen JDK 21, y los documentos hablan de Java 21. No es un error, pero es una decisión sin explicar: o se sube a 21 o se anota por qué 17.

## 6. Pedagogía y contenido

### 6.1 El código que el curso manda a leer no es legible [EJECUTADO]

El README promete "readable Java client" y "small, readable experiments", y la pestaña Profundizá invita a leer `Lab.java`. Medido: `Lab.java` tiene 327 líneas, 36 de más de 200 caracteres y una de 708; `app.js` 59 líneas con una de 2.659 caracteres; `visuals.js` 66 líneas de más de 200; `curriculum.js` 152. Es código escrito para ocupar poco, no para enseñar. Es el cambio de mantenimiento más valioso del curso: pasar un formateador (google-java-format o el de Eclipse; Prettier para los `.js` y `.mjs`) y partir `Lab.java` en una clase por tema (productor, consumidor, transacciones, Streams, seguridad, outbox) con un `main` que despache. Ninguna aserción de `check.mjs` depende del formato.

### 6.2 Controles débiles [LEÍDO]

Un control por lección con tres opciones, y varios distractores que no distraen: "The HTML language setting", "Only if the language is English", "From the browser cache", "Only when the browser is open", "Kafka creates a new broker". Con dos opciones reales la recuperación es casi nula. Sugerencia: tres controles por lección, cada uno con distractores que sean errores reales de alguien que aprende (por ejemplo, para offsets: "confirmar 2" contra "confirmar 3"; para ISR: "acks=1 con min ISR 2 rechaza la escritura").

### 6.3 Falta la CLI nativa de Kafka [LEÍDO]

El estudiante opera casi todo a través del cliente `lab`. Solo cuatro pasos usan herramientas de Kafka (`kafka-metadata-quorum.sh`, `kafka-features.sh`, `kafka-consumer-groups.sh`). Al salir del curso no sabe usar `kafka-console-producer.sh`, `kafka-console-consumer.sh --from-beginning --property print.key=true`, `kafka-consumer-groups.sh --reset-offsets`, `kafka-configs.sh --alter` ni `kafka-topics.sh --alter --partitions`, que es lo que va a encontrar en cualquier equipo. Un bloque "con la CLI de Kafka" por lección, con el comando equivalente, cerraría la brecha sin tocar los experimentos.

### 6.4 La unidad de Spring es una lección [LEÍDO]

Para arquitectos Java y Spring, lo que hoy no está: manejo de errores (`DefaultErrorHandler` con reintentos y backoff, DLT, `@RetryableTopic`), transacciones (`KafkaTransactionManager`, `@Transactional` con base de datos, outbox con Spring), concurrencia del listener y orden por partición, y pruebas (Testcontainers con el mismo `compose.yaml`, `EmbeddedKafka`). Propuesta: unidad 8 con lecciones 30 a 33 sobre el mismo proyecto `labs/spring`.

### 6.5 La lección de operación no muestra métricas [LEÍDO]

La lección 24 habla de particiones subreplicadas, latencia de pedidos y presión de buffer, pero el laboratorio solo ofrece `lag` del cliente y `docker compose logs`. No hay JMX expuesto ni exportador. Un perfil `metrics` (exportador JMX más Prometheus, o como mínimo `JMX_PORT` y una lectura con `kafka-run-class.sh kafka.tools.JmxTool`) haría ejecutable lo que hoy es lectura.

### 6.6 Temas de 4.x que faltan o quedan implícitos [LEÍDO]

- ELR (KIP-966): aparece en la salida de `describe` como `elr=` (el propio `test-labs.mjs` la usa para parsear el ISR) y ninguna lección lo explica.
- El protocolo de grupos de KIP-848: la lección 09 lo menciona y el laboratorio fija `classic`; un paso que repita `watch` con `group.protocol=consumer` costaría poco y mostraría la diferencia en los callbacks.
- Almacenamiento por niveles y cuotas: mencionados como límites; está bien dejarlos fuera, pero conviene decirlo en el README como alcance.

### 6.7 La limpieza por compactación no está asegurada por ninguna suite [LEÍDO]

La suite `core` comprueba `table 13` igual a `{A=30}`; que el cleaner efectivamente borre `A=10` y `B=20` no lo comprueba nadie, y el paso 3 lo dice con "may disappear". Es honesto, pero el estudiante puede esperar 60 segundos y no ver nada. Una variante determinista (rotar el segmento con un segundo `put`, esperar el `max.compaction.lag.ms` de 10 segundos y comparar `offsets` o leer con `kafka-dump-log.sh`) haría la observación confiable.

### 6.8 La lección 23 desactiva la idempotencia sin decirlo [LEÍDO]

`acl writer` y `acl reader` ponen `enable.idempotence=false` (comentario en `Lab.java`: para que el rechazo llegue al permiso del tópico) mientras las lecciones 16 y 29 enseñan a dejarla activada. La razón es un contenido en sí mismo (desde KIP-679, `InitProducerId` exige `IDEMPOTENT_WRITE` en el clúster o `WRITE` en algún tópico, y el lector fallaría antes con `ClusterAuthorizationException`): decirlo en el texto del paso.

### 6.9 Español [LEÍDO]

Voseo consistente en las 29 lecciones y en la interfaz; buenas elecciones de vocabulario ("señalador" por bookmark, "tolerancia" por grace, "hora del flujo" por stream time, "carril" por lane). Los términos de configuración quedan en inglés como pide la regla. Nada que corregir salvo 4.4.

## 7. Repositorio y empaquetado

### 7.1 Workflow y guía de publicación

Ya tienen card en [`tablero.md`](../tablero.md): el workflow vive dentro de la carpeta del curso y GitHub solo corre los de la raíz; `DEPLOYMENT.md` supone que la carpeta del curso es el repositorio.

### 7.2 `.qa/` [EJECUTADO]

Está ignorada por Git, pero contiene scripts de producción (`add-spring-ui.mjs`, `refine-*.mjs`, `final-polish.mjs`), logs y una copia completa y ya desactualizada del curso en `portable/`. La regla del repositorio es que lo que sobra va a `tmp/_obsoleto/`; moverla ahí deja el árbol del curso igual al que se publica.

### 7.3 Fines de línea [EJECUTADO]

Todo el curso está en LF, incluidos los `.sh` que corren dentro de contenedores, y `.gitattributes` lo protege (`* text=auto` más `eol=lf` para scripts, HTML, JS, YAML y properties). Es lo correcto para este material. La convención de fin de línea del repositorio (LF o CRLF) tiene que quedar escrita en `claude/arranque.md` cuando exista, para que ninguna sesión la cambie.

### 7.4 Números de versión repartidos [LEÍDO]

`curriculum.js` (`version:'1.0'`), `package.json` (`1.0.0`), las etiquetas de imagen `kafka-course-lab:1.0` y `kafka-course-spring:1.0` y los `pom.xml` (`1.0.0`) se actualizan a mano por separado. Anotar en `docs/TEACHING.md` la lista de lugares que se tocan al versionar, o derivarlos de `package.json`.

### 7.5 Cosas que están bien y conviene no perder

Proyecto Compose con nombre fijo y limpieza acotada a él; `prepare N` que borra solo lo de esa lección y se niega si el grupo sigue activo; aserciones con salida distinta de cero cuando la expectativa no se cumple; ZIP y empaquetado sin dependencias; `check.mjs` que cruza los comandos del currículo con los `case` de `Lab.java`; CSP sin scripts externos; `_headers` con descargas como adjunto; accesibilidad básica (tabs con ARIA, `skip-link`, `aria-live`, objetos del SVG focalizables).

## 8. Prioridad sugerida

1. Antes del primer push público: 3.1, 3.2 (al menos los guiones largos del título), 3.3, 4.1, 4.2 y la frase de 5.1 sobre share groups.
2. Versión 1.1: 4.3 a 4.9, 5.2, 5.3, 6.1, 6.2, 6.8, 7.2, 7.4.
3. Versión 2 o curso siguiente: 6.3 a 6.7 y la revisión sobre Kafka 4.2 o 4.3 de 5.1.
