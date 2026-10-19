# Docker lab kit / Kit de laboratorio Docker

Run all commands from this folder. The course uses **Apache Kafka 4.1.2**. Do not silently replace the pin with `latest`; share-group behavior and CLI/API defaults are version sensitive.

Ejecutá los comandos desde esta carpeta. El curso usa **Apache Kafka 4.1.2**. No cambies silenciosamente la versión por `latest`: el comportamiento de share groups y los valores por defecto dependen de la versión.

## First run / Primera ejecución

Course kit 1.4.1. Lesson 00, Before you start, walks through this setup step by step with the expected output of each command; this is the short version for the kit on its own.

Kit del curso 1.4.1. La lección 00, Antes de empezar, recorre esta puesta a punto paso a paso con la salida esperada de cada comando; esta es la versión corta para usar el kit solo.

```sh
docker compose version
docker version
docker compose up -d --wait
docker compose run --rm lab help
```

Expect Compose v2.20.2 or newer, a Server Engine of 25 or newer, three healthy brokers with IDs 1, 2 and 3, and the client's command list. Docker must use Linux containers; the health checks use `start_interval`. Reserve roughly 8 GB for Docker and more for optional services. The first run downloads official images and Maven dependencies; later runs reuse them. The brokers run as root inside their containers so the named volumes never raise permission questions; that is a teaching shortcut, not a production setting.

Esperá Compose v2.20.2 o superior, un Engine 25 o superior en Server, tres brokers saludables con IDs 1, 2 y 3 y la lista de comandos del cliente. Docker tiene que usar contenedores Linux; los health checks usan `start_interval`. Reservá unos 8 GB y más para servicios opcionales. La primera ejecución descarga imágenes y dependencias de Maven; las siguientes las reutilizan. Los brokers corren como root dentro de sus contenedores para que los volúmenes con nombre nunca den problemas de permisos; es un atajo didáctico, no una configuración de producción.

## Addresses / Direcciones

| Caller / Desde dónde | Bootstrap |
|---|---|
| Lab container / Contenedor lab | `kafka1:9092,kafka2:9092,kafka3:9092` |
| Host computer / Tu computadora | `localhost:19092,localhost:29092,localhost:39092` |

Host ports bind to `127.0.0.1`. The optional Spring HTTP app uses port 18080; other optional services have no published ports. Bootstrap discovers metadata; advertised listeners must then be reachable from the client. The three main nodes combine broker and controller roles for teaching. Their data is in named volumes. Do not use the Compose configuration as a production deployment.

Los puertos de host se ligan a `127.0.0.1`. La app HTTP opcional de Spring usa el puerto 18080; los demás servicios opcionales no publican puertos. Bootstrap descubre metadatos; después el cliente necesita llegar a los listeners anunciados. Los nodos combinan roles para enseñar y guardan datos en volúmenes con nombre. Esta configuración no es un despliegue productivo.

## Lesson IDs / IDs de lección

Lesson 29 uses a separate [complete Spring Boot project](spring/README.md), with `KafkaTemplate`, `@KafkaListener` and its own `spring-orders` topic. It does not use the numbered native-client preparation command.

La lección 29 usa un [proyecto Spring Boot completo](spring/README.md), con `KafkaTemplate`, `@KafkaListener` y su tópico `spring-orders`. No usa el comando numerado de preparación del cliente nativo.

Displayed lessons now run from **00 to 29**. Lessons 00 and 01 create no practice topics. The Java client's topic numbers stay unchanged: lesson 02 uses `prepare 1` and topic `lab1`; displayed lesson 28 uses `prepare 27`. Copy the commands printed on the page.

Las lecciones visibles van de **00 a 29**. Las lecciones 00 y 01 no crean tópicos de práctica. Los números de tópicos del cliente Java no cambian: la lección 02 usa `prepare 1` y `lab1`; la visible 28 usa `prepare 27`. Copiá los comandos de la página.

`prepare N` deletes and recreates only `labN`, its `labN-*` outputs, and that lesson’s Streams internal topics where applicable. It resets the lesson’s known inactive groups and refuses to reset them while active. Stop all `watch`, `streams` and `windows` commands before preparing again. Preparation does not erase optional database volumes, Connect source files, the separate mirror cluster or share-group experiments. Repeating `outbox create` explicitly resets the one demo event’s sent flag.

`prepare N` borra y recrea solo `labN`, sus salidas `labN-*` y los tópicos internos de Streams de esa lección. Reinicia grupos conocidos inactivos y rechaza hacerlo si siguen activos. Detené `watch`, `streams` y `windows` antes. No borra volúmenes de la base, archivos de Connect, el espejo ni experimentos share. Repetir `outbox create` reinicia explícitamente la marca de envío del único evento de demo.

## Optional services / Servicios opcionales

| Profile / Perfil | Purpose / Uso | Memory hint / Memoria orientativa |
|---|---|---|
| `connect` | Real standalone FileStreamSource connector / Conector real de archivos | +0.5 GB |
| `database` | PostgreSQL transactional outbox with a polling relay / Outbox transaccional con relay por polling | +0.5 GB |
| `security` | Separate SASL/PLAIN + ACL broker / Broker separado para autenticación y permisos | +1 GB |
| `mirror` | Independent target cluster and explicit one-shot copy / Clúster de destino y copia de una pasada | +1 GB |
| `share` | Kafka 4.1 share-group preview experiment (production-ready since Kafka 4.2) / Experimento preview de share groups (production-ready desde Kafka 4.2) | +1 GB |

Start only the profile the lesson requests, then stop it afterward. In the ACL lab, SASL/PLAIN is deliberately restricted to the internal Docker network with public demo passwords; there is **no TLS**. Production requires encrypted listeners and managed secrets. The mirror exercise is **not MirrorMaker 2**. The outbox exercise is **not Debezium**. The schema exercise uses real Avro compatibility checking without a registry server. These boundaries are also explicit in the lessons.

Levantá solo el perfil que pida la lección y detenelo después. En ACL, SASL/PLAIN queda dentro de la red Docker con contraseñas públicas de demo; **no hay TLS**. Producción necesita listeners cifrados y secretos administrados. La copia entre clústeres **no es MirrorMaker 2**. El outbox **no usa Debezium**. El ejercicio de esquemas usa validación Avro real sin servidor de registro. Las lecciones también explicitan estos límites.

## Useful native Kafka commands / Comandos nativos útiles

```sh
docker compose exec kafka1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka1:9092 --list
docker compose exec kafka1 /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka1:9092 --describe --topic lab3
docker compose exec kafka1 /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka1:9092 --describe --group bookmarks
docker compose exec kafka1 /opt/kafka/bin/kafka-metadata-quorum.sh --bootstrap-server kafka1:9092 describe --status
docker compose logs --tail 60 kafka1
```

The client source is in `src/main/java/course/`: `Lab.java` dispatches each command, and each experiment lives in the class named after its subject (`Topics`, `Producing`, `Consuming`, `Transactions`, `Integrations`, `Security`, `Clusters`), with the shared settings in `Kafka.java`. `Dockerfile` builds it inside a JDK image and runs the packaged JAR inside a JRE image. No host Java is required. The client waits for acknowledgments, bounds snapshots, checks transaction outcomes and fails with a nonzero status when its expectation is not met. `read` assigns partitions directly and reads a snapshot without committing a group bookmark; `consume` uses group subscription and commits processed progress.

El código del cliente está en `src/main/java/course/`: `Lab.java` deriva cada comando, y cada experimento vive en la clase que lleva el nombre de su tema (`Topics`, `Producing`, `Consuming`, `Transactions`, `Integrations`, `Security`, `Clusters`), con la configuración compartida en `Kafka.java`. El Dockerfile compila con un JDK y ejecuta con un JRE. `read` se asigna particiones y lee una instantánea sin confirmar avance de grupo; `consume` se suscribe con grupo y confirma el avance procesado.

## Troubleshooting / Si algo falla

| Symptom / Síntoma | Action / Qué hacer |
|---|---|
| Cannot connect to Docker / No conecta a Docker | Start Docker Desktop or the engine; check the Server section of `docker version` / Arrancá Docker y verificá Server |
| Port already allocated / Puerto ocupado | Stop the conflicting local service, or consistently change published ports and advertised HOST listeners / Liberá el puerto o ajustá ambos valores |
| `UnknownHostException kafka1` from your host / Desde el host | Use host bootstrap ports, not Docker hostnames / Usá puertos del host |
| Broker startup or a command times out / Timeout | Inspect `docker compose ps` and logs; check memory, then repeat after all brokers are healthy / Revisá estado, logs y memoria |
| `NotEnoughReplicas` in durability lab / En durabilidad | Expected while min ISR 3 has only two live replicas; restore kafka3 and wait for ISR catch-up / Es esperado; recuperá kafka3 y esperá |
| Topic exists or group active / Tópico existente o grupo activo | Stop prior consumers, then rerun that lesson’s preparation / Detené consumidores y repetí la preparación |
| Streams produces no output / Streams no produce salida | Wait for RUNNING, seed from a second terminal, inspect process logs and internal topics / Esperá RUNNING y publicá desde otra terminal |
| Native dependency fails on your architecture / Falla nativa | Check upstream ARM support for RocksDB/images. Use a compatible Linux x86 runtime if needed / Verificá soporte ARM o usá Linux x86 |
| `INTENTIONAL CRASH` / Caída intencional | Follow the next recovery step; this is the experiment / Seguí el paso de recuperación |
| Retention/compaction did not happen yet / Todavía no limpió | Cleanup is asynchronous. Roll the active segment, wait and inspect again / Rotá el segmento, esperá y volvé a mirar |
| Maven TLS trust error / Error de confianza TLS | Use the included Docker build. On a managed network, configure the approved CA in the build environment; do not disable certificate verification / Usá Docker y configurá la CA aprobada sin desactivar validación |

## Cleanup / Limpieza

Stop without deleting data / Detené sin borrar datos:

```sh
docker compose --profile connect --profile database --profile security --profile mirror --profile share --profile spring stop
```

Remove the course containers and network but keep named volumes / Quitá contenedores y red conservando volúmenes:

```sh
docker compose --profile connect --profile database --profile security --profile mirror --profile share --profile spring down
```

**Only when you want to erase all course data**, including outbox, Connect offsets and optional brokers / **Solo cuando quieras borrar todos los datos del curso**:

```sh
docker compose --profile connect --profile database --profile security --profile mirror --profile share --profile spring down --volumes
```

Never substitute a system-wide prune command. These commands are scoped to this named Compose project.

No lo reemplaces por una limpieza global de Docker. Estos comandos se limitan al proyecto Compose del curso.
