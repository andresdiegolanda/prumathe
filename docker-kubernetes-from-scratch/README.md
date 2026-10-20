# Docker & Kubernetes from scratch / Docker y Kubernetes desde cero

A standalone visual course in **English and Rioplatense Spanish**, version 1.4.0: follow one small HTTP application from a process to a Kubernetes deployment. Open [index.html](index.html?lang=en) or start with [00, Before you start](lessons/before-you-start.html?lang=en); if you do not know what the two are yet, read [What Docker and Kubernetes are](what-docker-and-kubernetes-are.html?lang=en) first. The site can be copied and opened without a server or a connection; it needs no account, telemetry or external resources, except the discussion of a lesson when you open it on the published site. The official links and the first download of tools and images do need internet.

Un curso visual independiente en **inglés y español rioplatense**, versión 1.4.0: seguí una aplicación HTTP pequeña desde su proceso hasta un despliegue en Kubernetes. Abrí [index.html](index.html?lang=es) o empezá por [00, Antes de empezar](lessons/before-you-start.html?lang=es); si todavía no sabés qué son, leé antes [Qué son Docker y Kubernetes](what-docker-and-kubernetes-are.html?lang=es). El sitio se puede copiar y abrir sin servidor ni conexión; no requiere cuenta, telemetría ni recursos externos, salvo la discusión de una lección cuando la abrís en el sitio publicado. Los enlaces oficiales y la primera descarga de herramientas e imágenes sí necesitan internet.

## What is included / Qué incluye

- 25 lessons in 7 units, including the initial orientation. / 25 lecciones en 7 unidades, incluida la orientación inicial.
- A five minute "What Docker and Kubernetes are" page: what they are, where they came from, where they fit and where they do not, with its sources. / Una página de cinco minutos, "Qué son Docker y Kubernetes": qué son, de dónde salieron, dónde encajan y dónde no, con sus fuentes.
- A discussion per lesson, in the Go deeper tab: threads on GitHub Discussions, loaded only when you open them on the published site; reading is open, posting needs a GitHub account. / Una discusión por lección, en la pestaña Profundizá: hilos en GitHub Discussions, cargados solo cuando los abrís en el sitio publicado; leer es abierto, publicar pide una cuenta de GitHub.
- 75 scenes with interactive SVG models, 75 questions with explanations and 102 lab steps. / 75 escenas con modelos SVG interactivos, 75 preguntas con explicación y 102 pasos de laboratorio.
- A live viewer at http://127.0.0.1:18091 (lesson 01, connected to the cluster in lesson 13): the images, containers, volume and networks of the course, and then the nodes, Deployments, Pods, Services and configuration of `dk-lab`, drawn as the practices change them. / Un visor en vivo en http://127.0.0.1:18091 (lección 01, conectado al clúster en la lección 13): las imágenes, contenedores, volumen y redes del curso, y después los nodos, Deployments, Pods, Services y configuración de `dk-lab`, dibujados a medida que las prácticas los cambian.
- English and Rioplatense Spanish, a 40-term glossary and downloadable notes. / Inglés y español rioplatense, glosario de 40 términos y apuntes descargables.
- Classic, Dark, Reading and Projector skins. Local progress, independent from other courses. / Apariencias Clásico, Oscuro, Lectura y Proyector. Avance local independiente de otros cursos.
- Dockerfile, Compose, a dependency-free Python application and Kubernetes manifests included. / Dockerfile, Compose, aplicación Python sin dependencias y manifiestos Kubernetes incluidos.

## Learning path / Recorrido

| Lessons / Lecciones | Unit / Unidad | Question it answers / Pregunta que responde |
| --- | --- | --- |
| 00 | Start here / Antes de empezar | What does each part of the course prove? / ¿Qué prueba cada parte del curso? |
| 01 to 04 | Inside a container / Dentro de un contenedor | What do I run and what do I build? / ¿Qué ejecuto y qué construyo? |
| 05 to 08 | Data and connections / Datos y conexiones | Where does data live and how does a request travel? / ¿Dónde viven los datos y por dónde viaja un pedido? |
| 09 to 12 | Ship and operate / Distribuir y operar | How do I configure, identify and diagnose an application? / ¿Cómo configuro, identifico y diagnostico una aplicación? |
| 13 to 16 | Enter Kubernetes / Entrar a Kubernetes | Who turns what I declared into processes? / ¿Quién transforma lo declarado en procesos? |
| 17 to 20 | Connect and configure / Conectar y configurar | How do Pods receive traffic, configuration and data? / ¿Cómo reciben tráfico, configuración y datos los Pods? |
| 21 to 24 | Operate with evidence / Operar con evidencia | How do I explain capacity, changes, permissions and recovery? / ¿Cómo explico capacidad, cambios, permisos y recuperación? |

## Labs / Laboratorios

Use Docker with Linux containers and Compose v2. The second half needs kind 0.33.0 and kubectl 1.37.x; the pinned base is Kubernetes 1.37.0, the default node image of that kind release. The [kit guide](labs/README.md) covers installation, versions, where each command runs and cleanup. Python does not need to be installed on the host.

Usá Docker con contenedores Linux y Compose v2. La segunda mitad necesita kind 0.33.0 y kubectl 1.37.x; la base fijada es Kubernetes 1.37.0, la imagen de nodo predeterminada de esa versión de kind. La [guía del kit](labs/README.md) explica instalación, versiones, dónde corre cada comando y limpieza. No necesitás Python instalado en el host.

The models illustrate mechanisms. The tests that were executed, the platform and the limits of that evidence live in [docs/VALIDATION.md](docs/VALIDATION.md). The course does not cover a complete production deployment: it leaves out ingress configuration, external TLS, HPA, NetworkPolicy, operating distributed databases and production backups.

Los modelos ilustran mecanismos. Las pruebas ejecutadas, la plataforma y los límites de esa evidencia viven en [docs/VALIDATION.md](docs/VALIDATION.md). El curso no cubre un despliegue productivo completo: deja fuera configuración de ingress, TLS externo, HPA, NetworkPolicy, operación de bases distribuidas y respaldos productivos.

## Edit and package / Editar y empaquetar

With Node.js 18 or later and no packages to install: / Con Node.js 18 o superior, sin instalar paquetes:

```text
npm run build
npm run check
npm run preview
npm run release
```

The local preview uses `http://127.0.0.1:4175`. `release/` holds the portable course and the ZIP of the static site. For the real tests, read the scope in [VALIDATION.md](docs/VALIDATION.md) first: `npm run test:labs -- all` creates and modifies practice resources and leaves the Compose project and the kind cluster running when it finishes; clean up with the two commands at the end of the [kit guide](labs/README.md). `npm run test:labs -- visor` checks the live viewer against the same resources.

La vista local usa `http://127.0.0.1:4175`. `release/` contiene el curso portable y el ZIP del sitio estático. Para las pruebas reales, leé primero el alcance en [VALIDATION.md](docs/VALIDATION.md): `npm run test:labs -- all` crea y modifica recursos de práctica y deja levantados el proyecto Compose y el clúster kind al terminar; limpiá con los dos comandos del final de la [guía del kit](labs/README.md). `npm run test:labs -- visor` prueba el visor en vivo contra los mismos recursos.

Content and method: [TEACHING.md](docs/TEACHING.md). Static publication: [DEPLOYMENT.md](docs/DEPLOYMENT.md). License [MIT](LICENSE). The course carries its own copies of assets and scripts; it does not depend on other folders of the repository.

Contenido y método: [TEACHING.md](docs/TEACHING.md). Publicación estática: [DEPLOYMENT.md](docs/DEPLOYMENT.md). Licencia [MIT](LICENSE). El curso lleva sus propias copias de assets y scripts; no depende de otras carpetas del repositorio.
