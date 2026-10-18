# Kafka from scratch / Kafka desde cero

A standalone visual course in **English and Rioplatense Spanish**. Open `index.html` in a browser. No server, account, CDN, framework or installation is needed to explore the lessons.

Un curso visual independiente en **inglés y español rioplatense**. Abrí `index.html` en un navegador. No necesitás servidor, cuenta, CDN, framework ni instalación para recorrer las lecciones.

## What is included / Qué incluye

- 30 individual HTML lessons in 9 ordered units; 90 visual teaching scenes.
- Interactive SVG models, clickable objects, keyboard navigation and an expandable canvas.
- 30 Docker activities with 134 individually paginated steps, copyable commands and expected observations.
- 90 checkpoint questions, three per lesson, each with an explanation; a 46-term visual glossary.
- Four skins: Classic, Dark, Reading (each lesson as one scrolling page with larger type) and Projector (for a classroom screen). The choice is kept on the browser and travels in the page address.
- A language button that preserves the current lesson, scene, lab step and model state.
- Local progress: completing a lab is a learner declaration, not automatic Docker detection.
- Complete text notes in both languages, a downloadable lab ZIP and the complete Java source.
- An isolated three-node KRaft cluster plus optional Connect, PostgreSQL, ACL, mirror, share-group and Spring Boot services.
- Static Cloudflare Pages output and a GitHub validation workflow.

Cada lección combina modelo visual, explicación, laboratorio y control. El español usa voseo rioplatense. Los términos de configuración y las salidas de Kafka se conservan tal como aparecen en las herramientas reales.

## Start learning / Empezá

1. Open `index.html` / Abrí `index.html`.
2. Choose EN or ES, and a skin if you want one / Elegí EN o ES, y una apariencia si querés.
3. Start with [lesson 00, Before you start](lessons/before-you-start.html?lang=en) / Empezá por la [lección 00, Antes de empezar](lessons/before-you-start.html?lang=es).
4. Predict the outcome, manipulate the visual model, then run the Docker activity / Predecí el resultado, probá el modelo y después ejecutá la actividad Docker.
5. Explain your checkpoint answers aloud / Explicá en voz alta tus respuestas al control.

In the Classic, Dark and Projector skins the workspace fits the screen and does not scroll; on narrow screens, use the Visual / Explanation switch. The Reading skin turns each lesson into a scrolling page: model, the three scenes, every lab step, the checkpoint and the references, in reading order. Reduced-motion preferences are respected.

En Clásico, Oscuro y Proyector el espacio de trabajo entra en la pantalla y no se desplaza; en pantallas angostas, alterná entre Modelo visual y Explicación. Lectura convierte cada lección en una página que se desplaza: modelo, las tres escenas, todos los pasos del laboratorio, el control y las referencias, en orden de lectura. Se respeta la preferencia de movimiento reducido.

## Run the labs / Ejecutá los laboratorios

Prerequisites: Docker Desktop or Docker Engine 25 or newer with Compose v2.20.2 or newer, Linux containers, roughly 8 GB available to Docker for the main lab (allow more for optional services), several GB of free disk and internet for the first image and dependency downloads. No host Java or Maven installation is required. Native ARM and x86 support depends on the pinned upstream images; the executed validation used Linux x86 containers on Windows Docker Desktop.

Requisitos: Docker Desktop o Docker Engine 25 o posterior con Compose v2.20.2 o superior, contenedores Linux, unos 8 GB disponibles para Docker en el laboratorio principal (reservá más para los opcionales), varios GB de disco e internet para la primera descarga. No necesitás instalar Java ni Maven en el host. La validación ejecutada usó contenedores Linux x86 en Docker Desktop para Windows.

```sh
docker compose version
docker version
cd labs
docker compose up -d --wait
docker compose run --rm lab help
```

Lesson 00 covers setup without creating topics. Each later lab provides its own commands. Where present, its first preparation step resets only that lesson's practice topics and known inactive groups. Stop the previous lesson's long-running consumers first. Later lessons can be run independently after lesson 00; conceptual prerequisites still follow the course order.

La lección 00 cubre la puesta a punto sin crear tópicos. Cada lab posterior trae sus comandos. Cuando hay un paso de preparación, reinicia solo los tópicos de práctica y grupos inactivos conocidos de esa lección. Antes, detené los consumidores que hayan quedado funcionando. Después de la lección 00 podés ejecutar cualquier laboratorio por separado; los prerrequisitos conceptuales siguen el orden del curso.

```sh
# Pause without deleting data / Pausá sin borrar datos
docker compose --profile connect --profile database --profile security --profile mirror --profile share --profile spring stop

# Resume the main cluster / Retomá el clúster principal
docker compose up -d --wait
```

See [the lab guide](labs/README.md) for troubleshooting, resource boundaries and cleanup. All examples are fictional. These configurations teach mechanisms; they are not production deployment templates.

The complete [Spring Boot example](labs/spring/README.md) accompanies [lesson 29](lessons/spring-java.html): `KafkaTemplate`, `@KafkaListener`, typed JSON events, group offsets and repeatable HTTP requests.

El [ejemplo completo de Spring Boot](labs/spring/README.md) acompaña la [lección 29](lessons/spring-java.html): publicación, consumo, JSON tipado, offsets y pedidos HTTP repetibles.

## Learning sequence / Secuencia

| Unit / Unidad | Lessons / Lecciones | Outcome / Resultado |
|---|---|---|
| 0. Start here / Antes de empezar | 00 | Distinguish simulation from execution and prepare the lab / Distinguir simulación de ejecución y preparar el lab |
| 1. Foundations / Cimientos | 01 to 04 | Run a cluster; distinguish records, topics, partitions and offsets / Levantar un clúster y distinguir sus piezas |
| 2. Moving events / Mover eventos | 05 to 08 | Choose keys; explain batching, groups and bookmarks / Elegir claves y explicar lotes, grupos y señaladores |
| 3. Resilience / Resistencia | 09 to 12 | Observe rebalances, replication, ISR and metadata quorum / Observar rebalanceo, réplicas, ISR y quórum |
| 4. Time and guarantees / Tiempo y garantías | 13 to 16 | Explain cleanup, replay, duplicate effects and idempotence / Explicar limpieza, replay, duplicados e idempotencia |
| 5. Connecting systems / Conectar sistemas | 17 to 20 | Bound transactions; evolve contracts; connect systems; use an outbox / Delimitar transacciones, evolucionar contratos y usar Connect y outbox |
| 6. Processing and operating / Procesar y operar | 21 to 24 | Restore state, handle late events, enforce ACLs and observe lag / Restaurar estado, manejar tardíos, aplicar ACL y observar lag |
| 7. Reality / La realidad | 25 to 28 | Diagnose skew; compare cluster positions; explore share groups; survive an incident / Diagnosticar desbalance, copiar entre clústeres y resolver una falla |
| 8. Java with Spring / Java con Spring | 29 | Publish typed JSON, consume with a listener and verify committed progress / Publicar JSON tipado, consumir con un listener y verificar avance |

Allow several sessions. Repeat experiments and write down predictions rather than racing through the pages. Completion is not a professional certification.

Reservá varias sesiones. Repetí experimentos y anotá predicciones en vez de correr por las páginas. Completar el curso no equivale a una certificación profesional.

## Versions / Versiones

Course 1.2.0. The course pins **Apache Kafka 4.1.2** (brokers and clients) and **Spring Boot 3.5.16** on Java 21, and its text describes those versions. Kafka 4.2 made share groups production-ready and 4.3 is the current line; lesson 27 says so where it matters, and the whole course is reviewed against a newer baseline as a deliberate step, never by changing the pin in silence. Spring Boot 3.5.16 is the last open-source release of the 3.5 line, whose open-source support ended on 30 June 2026; moving the Spring lesson to Boot 4.x is planned.

Curso 1.2.0. El curso fija **Apache Kafka 4.1.2** (brokers y clientes) y **Spring Boot 3.5.16** sobre Java 21, y su texto describe esas versiones. Kafka 4.2 dejó los share groups production-ready y 4.3 es la línea actual; la lección 27 lo dice donde importa, y la revisión de todo el curso contra una base más nueva es un paso deliberado, nunca un cambio silencioso de la versión fijada. Spring Boot 3.5.16 es la última versión open source de la línea 3.5, cuyo soporte open source terminó el 30 de junio de 2026; pasar la lección de Spring a Boot 4.x está planificado.

## Develop and publish / Editá y publicá

Node.js 18+ is only needed for maintenance and packaging. The published site has no server runtime.

Node.js 18+ solo se usa para mantenimiento y empaquetado. El sitio publicado no necesita un backend.

```sh
npm run build
npm run check
npm run preview
```

Preview: `http://127.0.0.1:4173`. `build` regenerates all lesson shells, bilingual notes, lab ZIP and `dist/`. Keep `assets/curriculum.js` as the curriculum source; lesson HTML is generated. No `npm install` is needed.

La vista previa abre en `http://127.0.0.1:4173`. `build` regenera páginas, apuntes bilingües, ZIP y `dist/`. La fuente del programa está en `assets/curriculum.js`. No hace falta `npm install`.

`npm run release` also creates `release/kafka-from-scratch.zip` (the complete portable course and source) and `release/cloudflare-pages.zip` (the deployable static website). Archives exclude caches, build targets and local test evidence.

`npm run release` también crea `release/kafka-from-scratch.zip` (curso portátil completo y código) y `release/cloudflare-pages.zip` (sitio estático publicable). Los archivos excluyen cachés, compilados y evidencia local de pruebas.

See [deployment instructions](docs/DEPLOYMENT.md), [teaching and maintenance notes](docs/TEACHING.md) (including how skins work and the version checklist), and [validation evidence](docs/VALIDATION.md).

## Folder independence / Independencia

Copy this entire folder to any location. All runtime paths are relative, with one exception: `404.html`, which the host serves for any missing address and therefore links to the site root. `dist/`, `release/` and `labs/**/target/` are generated local artifacts excluded from Git.

Copiá esta carpeta completa a cualquier ubicación. Todas las rutas de ejecución son relativas, con una excepción: `404.html`, que el servidor entrega para cualquier dirección inexistente y por eso enlaza a la raíz del sitio. `dist/`, `release/` y `labs/**/target/` son resultados locales excluidos de Git.

## License / Licencia

Course code and content by Andrés Landa, MIT license (see `LICENSE`). Apache Kafka, Apache Avro, PostgreSQL, Spring and the included dependencies retain their own licenses and trademarks. This is an independent educational project, not an Apache Software Foundation product.

Código y contenido del curso por Andrés Landa, licencia MIT (ver `LICENSE`). Apache Kafka, Apache Avro, PostgreSQL, Spring y las dependencias incluidas conservan sus propias licencias y marcas. Es un proyecto educativo independiente, no un producto de la Apache Software Foundation.
