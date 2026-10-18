# Validación

Este documento registra evidencia ejecutada y límites por versión; los modelos del navegador siguen siendo ilustrativos. Cada sección dice qué se ejecutó, en qué plataforma y qué quedó fuera.

## Versión 1.3.0, 18 de octubre de 2026

Una discusión por lección (GitHub Discussions a través de giscus) al final de la pestaña Profundizá, cargada solo a pedido en el sitio publicado; configuración en `assets/forum.js`, CSP en `_headers`. Labs, lecciones y versiones fijadas sin cambios respecto de la 1.2.0, así que su evidencia de plataforma sigue valiendo. Ejecutado: `npm run build` y `npm run check` con los controles nuevos del foro (configuración, `forum.js` en las páginas, CSP que permite giscus); la tarjeta y el enlace alternativo renderizados en los dos idiomas en un navegador sin interfaz, sin errores de consola, y con los identificadores del repositorio público y de la categoría "Docker & Kubernetes from scratch" en `assets/forum.js`, el botón cargó el widget real por https en un navegador sin interfaz (marco de giscus.app con el término `docker-kubernetes-from-scratch/compose`, 0 comentarios, iniciar sesión con GitHub) en la lección 08. No ejecutado: publicar un comentario, que necesita una sesión de GitHub; el hilo de cada lección lo crea giscus con el primer comentario.

## Versión 1.2.0, 18 de octubre de 2026

Página nueva "Qué son Docker y Kubernetes" (`what-docker-and-kubernetes-are.html`, texto en `assets/about.js`), fuera de la numeración de lecciones; labs, lecciones y versiones fijadas sin cambios respecto de la 1.1.0, así que su evidencia de plataforma sigue valiendo. Ejecutado: `npm run build` y `npm run check` con los controles nuevos de la página (cadenas bilingües, seis hitos, tres columnas, fuentes https, página generada y publicada en `dist/`); la página renderizada en un navegador sin interfaz en los dos idiomas, en las cuatro apariencias y a 390 px, sin errores de consola ni desborde horizontal; las fuentes oficiales listadas al pie abiertas y contrastadas en la fecha indicada. No ejecutado: las suites de laboratorio (no cambió nada que las toque).

## Versión 1.1.0, 18 de octubre de 2026

Correcciones de la revisión del 18 de octubre de 2026 (carpeta `reviews/` del repositorio de cursos) aplicadas: base Kubernetes 1.37.0 (imagen de nodo predeterminada de kind 0.33.0) y kubectl 1.37.x; imagen base `python:3.14.8-alpine3.24` fijada por digest; `server.py` atiende SIGTERM; `scripts/build.mjs` con la codificación corregida; el comando de la lección 06 sin comillas anidadas; textos de las lecciones 00, 02, 08, 10, 11, 14, 16, 19 y 21; terminología en español (readiness, tag y label, scheduling, bucle, provisioner, healthy); posiciones de las respuestas sin patrón; README y guía del kit bilingües; `dist/` sin `docs/`; controles nuevos en `check.mjs`.

### Resultado

Los **100 pasos de las 25 lecciones** se ejecutaron sobre la 1.1.0 en la misma plataforma de la 1.0.0 (Windows, PowerShell 5.1, Docker Desktop 4.55.0 con Engine 29.1.3 y Compose v2.40.3, Node v24.11.0, kind v0.33.0), consolidados de tres corridas de `npm run test:labs`: lecciones 00 a 10 y 11 a 13.3 por la ruta de host, y lecciones 13 a 24 dentro del nodo (`--in-node --from=13`), más la comprobación HTTP desde el host. El clúster se creó de cero con `kindest/node:v1.37.0` y los dos nodos quedaron Ready en v1.37.0; la imagen `prumathe-signal` se reconstruyó sobre `python:3.14.8-alpine3.24`, descargada por digest. Los informes quedan en `.qa/labs-all.json`, `.qa/labs-all-from-11.json` y `.qa/labs-all-from-13.json`.

Observaciones nuevas respecto de la 1.0.0: con `server.py` atendiendo SIGTERM, `docker stop` termina el contenedor con código 0 (lección 02, paso 2, `exited 0`) y los borrados de Pods de las lecciones 14, 16, 19, 20 y 24 tardan entre 2 y 4 segundos en vez de los 30 del período de gracia. La lección 11 descarga la imagen base por digest antes de inspeccionarla, porque un build con el almacén de imágenes de containerd puede dejar la base solo en la caché de BuildKit (así falló el primer intento de esta corrida). El acceso directo con kubectl desde el host volvió a fallar por la interceptación TLS del endpoint local, igual que en la 1.0.0: los 48 pasos de Kubernetes siguen ejecutados solo dentro del nodo, y esa ruta queda pendiente de otra máquina (card en el tablero del repositorio). El kubectl del host sigue en 1.34.1, por fuera de la política de desfase respecto de 1.37.0; para la ruta de host hay que instalar kubectl 1.37.x.

Las verificaciones estáticas pasaron con los controles nuevos: 25 páginas, 75 escenas, 75 preguntas sin patrón en las respuestas, 100 pasos sin comillas anidadas, 1200 renderizados, digest del `Dockerfile` presente en la lección 11, versión de Kubernetes fijada en la 13, sin doble codificación ni palabras prohibidas. Las 52 páginas (portada y 25 lecciones, ambos idiomas) se renderizaron en un navegador sin interfaz a 1280 px sin errores de consola ni desborde horizontal, y la portada y una lección en las cuatro apariencias y a 390 px.

### Plataforma y versiones

| Componente | Versión ejecutada |
| --- | --- |
| Host | Windows, PowerShell 5.1 |
| Docker Desktop | 4.55.0, contenedores Linux amd64 sobre WSL2; Engine 29.1.3; Compose v2.40.3 |
| Node.js | v24.11.0 |
| kind | v0.33.0 |
| Kubernetes | v1.37.0 (`kindest/node:v1.37.0`, digest del release de kind 0.33.0); un control-plane y un worker |
| kubectl de los labs Kubernetes | v1.37.0 dentro del nodo kind, por `docker exec` |
| Aplicación | Python 3.14.8, Alpine 3.24, imagen base fijada por digest |

### Fuera de esta evidencia

Lo mismo que en la 1.0.0 (abajo), más la ruta de host de los comandos de Kubernetes tal como los imprimen las lecciones.

## Versión 1.0.0, 18 de octubre de 2026

### Resultado

Los **100 pasos de las 25 lecciones** se ejecutaron satisfactoriamente en su versión final, más una comprobación HTTP desde el host. La cobertura se consolidó de dos corridas: lecciones 00 a 19 completas, y repetición focalizada de 20 a 24 después de corregir la práctica de sondas. No se presenta como una única corrida sin fallas intermedias. El [resumen por paso](validation-results.json) registra duración observada y comprobaciones de la ejecución final utilizada para cada paso.

Las verificaciones estáticas pasaron: 25 páginas, 75 escenas, 75 preguntas, 100 pasos, 40 términos, 1200 renderizados SVG combinando escenas, idiomas, apariencias y estados; sintaxis de los scripts, numeración, enlaces de HTML, UTF-8 sin BOM y saltos LF. La construcción genera apuntes EN/ES, el kit y `dist/`.

### Plataforma y versiones

| Componente | Versión ejecutada |
| --- | --- |
| Host | Windows, PowerShell 5.1 |
| Docker Desktop | 4.55.0 (213807), contenedores Linux amd64 sobre WSL2 |
| Docker Engine | 29.1.3 |
| Docker Compose | v2.40.3-desktop.1 |
| Node.js | v24.11.0 |
| kind | v0.33.0; binario Windows amd64 verificado con SHA256 oficial |
| Kubernetes | v1.34.11; un control-plane y un worker |
| kubectl del host | v1.34.1, solo versión comprobada y diagnóstico de acceso |
| kubectl de los labs Kubernetes | v1.34.11 dentro del nodo kind, por `docker exec` |
| Aplicación | Python 3.13.7, Alpine 3.22, imagen base fijada por digest |

El digest de Python se verificó al descargar la imagen. El nodo de Kubernetes usa el digest publicado en el [release de kind 0.33.0](https://github.com/kubernetes-sigs/kind/releases/tag/v0.33.0). Son versiones fijadas para reproducir el curso, no una afirmación de que sean las más nuevas.

### Límite del acceso desde el host

El clúster se creó realmente con `kind create cluster`, configuración de dos nodos y un kubeconfig exclusivo. El acceso directo con kubectl desde el host falló por `x509: certificate signed by unknown authority`: el endpoint de loopback presentaba una cadena de certificados emitida por un producto de seguridad local que intercepta TLS, distinta de la del API server. La conexión interna y la cadena del API server validaron correctamente.

Se ejecutaron los mismos argumentos operativos de las lecciones dentro del nodo `prumathe-dk-control-plane`, usando `/etc/kubernetes/admin.conf`, contexto `kubernetes-admin@prumathe-dk` y los manifiestos copiados a `/course-k8s/`. No se desactivó TLS ni se importó una autoridad nueva al sistema. Los comandos de acceso directo desde el host, tal como los imprimen las lecciones, quedan pendientes de una máquina sin esa interceptación; la alternativa y sus cambios de prefijo están en [labs/README.md](../labs/README.md).

### Qué se observó

| Lecciones | Evidencia |
| --- | --- |
| 00 a 04 | Build, sonda HTTP, UID 10001, aislamiento de archivos, stop/start con conservación de capa, borrado de instancia, historia y defaults de imagen, caché y dos versiones. |
| 05 a 08 | Marcador conservado en volumen tras recrear app, DNS de la red Compose, petición interna, enlace explícito `127.0.0.1:18080`, configuración resuelta, logs y recuperación tras restart. |
| 09 a 12 | Reemplazo de variable de entorno, montaje del secreto falso sin imprimirlo, límites de CPU/memoria, transición unhealthy/healthy sin reinicio, identidad compartida por tags, digest y HTTP 503 esperado. |
| 13 a 16 | Clúster real, importación de imagen, dos nodos Ready, Pod suelto y su borrado, cambio de réplicas, reaplicación declarativa y reemplazo por controlador. |
| 17 a 19 | Service y EndpointSlices, respuesta por DNS, referencias a ConfigMap en entorno, rollout y mensaje esperado, PVC Bound y marcador conservado al reemplazar writer. |
| 20 a 21 | Readiness falsa y verdadera en un Pod dedicado, retirada y recuperación del endpoint, HTTP por su Service y FailedScheduling por CPU insuficiente. |
| 22 a 24 | Versión 1.1.0, rollback a 1.0.0, permiso de lectura de Pods, denegación de delete y lectura de Secrets, borrado/reemplazo de instancias y respuesta final comprobada. |

La sonda de aplicación exige estado HTTP y texto, con reintentos acotados cuando el lab espera propagación de endpoints. Las denegaciones RBAC exigen `no` y código 1; no se ignoran errores indiscriminadamente. Las pruebas no miden ausencia de interrupciones durante los cambios.

La ejecución permitió corregir tres diferencias relevantes: `up --wait` puede fallar mientras persiste un estado unhealthy anterior; un rollout terminado no elimina instantáneamente todos los efectos de propagación de endpoints; y esperar por etiquetas durante una reducción de réplicas puede incluir Pods que están terminando. La práctica de sondas tiene Pod y Service dedicados, con nombres distintos para evitar que el hostname del Pod tape el nombre corto del Service.

### Interfaz

Se recorrieron las **200 combinaciones** de 25 lecciones, dos idiomas y cuatro apariencias, sin errores de consola ni desbordamiento horizontal del documento en la vista de escritorio. Se probaron cambios de escena, rango del modelo, inspección de objetos con teclado y clic, expansión de lectura, copia de comandos, respuesta incorrecta y corrección del control, avance persistido tras recargar y búsqueda de glosario.

Se revisaron además dos vistas de 390 píxeles: Service en español/Clásico y rollout en inglés/Proyector. Las pestañas admiten desplazamiento horizontal cuando no entran. Esto no constituye una auditoría exhaustiva de accesibilidad o de todos los dispositivos. La apertura directa por `file:` no se probó; el sitio conserva scripts clásicos, rutas relativas y recursos incluidos, sin solicitudes a servicios externos, y la navegación por HTTP local sí fue ejecutada.

### Reproducir

Desde la carpeta del curso, con Docker, kind y kubectl disponibles:

```text
npm run build
npm run check
npm run test:labs -- all
```

La suite crea o reutiliza **solo** `prumathe-dk`, modifica sus objetos de práctica y el proyecto Compose del mismo nombre, y conserva los recursos al terminar para inspeccionarlos. No usa `prune` ni el contexto habitual del host. En una máquina con interceptación TLS del endpoint local se usa:

```text
npm run test:labs -- all --in-node
npm run test:labs -- all --in-node --from=20
```

También se puede elegir `docker` o `kubernetes` en vez de `all`. `--from` retoma desde una lección, pero supone completados sus prerrequisitos. Los informes detallados se escriben en `.qa/` y se excluyen de los paquetes. La limpieza y sus efectos sobre datos están en la guía del kit.

### Fuera de esta evidencia

No se ejecutaron macOS, Linux como host nativo, ARM64, Kubernetes administrado, ingreso público, TLS de aplicación, HPA, aplicación de NetworkPolicy, pérdida física del host, backups ni carga sostenida. Liveness y startup se configuraron y estuvieron activas; la falla provocada en Kubernetes fue de readiness, no una prueba de reinicio por liveness. El workflow de GitHub se entrega como configuración, pero no se ejecutó en GitHub ni se publicó el sitio.
