# Review: Docker y Kubernetes desde cero v1.0.0

Estado: aplicada el mismo día en la versión 1.1.0 del curso (secciones 3, 4 y 5 completas, más 6.4 y parte de 6.5), con la base en Kubernetes 1.37.0 y las 100 prácticas ejecutadas de nuevo sobre ella; el detalle está en [`CHANGELOG.md`](../CHANGELOG.md) y en `docs/VALIDATION.md` del curso. Queda con card en [`tablero.md`](../tablero.md) lo que necesita otra máquina (3.2, la ruta de host) y lo de 6.2 y 6.3 para una versión siguiente. El texto de abajo describe la 1.0.0 tal como estaba.

Fecha: 2026-10-18. Objeto: [`docker-kubernetes-from-scratch/`](../docker-kubernetes-from-scratch/) tal como está en el árbol de trabajo antes de su primer commit (versión 1.0.0, validación del 18/10 en [`docs/VALIDATION.md`](../docker-kubernetes-from-scratch/docs/VALIDATION.md)).

Cada hallazgo dice cómo se estableció:

- **[LEÍDO]**: surge de leer el archivo citado; cualquiera lo reproduce abriendo ese archivo.
- **[EJECUTADO]**: se corrió algo en esta revisión (build, check, las suites de laboratorio, un comando suelto, un render, un conteo).
- **[FUENTE]**: se contrastó con documentación o anuncios oficiales, con la fecha.
- **[NO VERIFICADO]**: sospecha razonable que no se pudo confirmar; se dice por qué.

## 1. Veredicto

El curso está bien construido y el contenido técnico es sólido: las 75 escenas se leyeron completas en los dos idiomas y no apareció ninguna afirmación falsa sobre Docker, Compose, Kubernetes ni kind; los manifiestos, la aplicación y lo que cada paso espera observar coinciden entre sí y con las salidas reales; las 75 preguntas tienen una sola respuesta correcta; la paridad EN/ES es completa y el voseo consistente. Las 100 prácticas pasan, y la aplicación Signal, los manifiestos y la suite están hechos con criterio (sección 7.4). La audiencia del repositorio sale de acá entendiendo qué hace cada capa, que es lo que el curso promete.

Lo que hay que resolver antes de publicar está en la sección 3 y es más que en los otros dos cursos: un script de construcción con la codificación rota que ensucia las 26 páginas, los apuntes y la 404; la ruta que enseñan las 48 prácticas de Kubernetes nunca ejecutada tal cual; un comando que falla en Windows PowerShell; textos que cuentan dónde y cómo se produjo el curso (la marca del antivirus y la máquina de validación, dentro del kit que descarga el estudiante); y un README y documentos solo en español cuando la regla y los otros dos cursos son bilingües. Después vienen los defectos de la sección 4 (una observación esperada que no ocurre, terminología en español que cambia de significado a mitad del curso, un patrón previsible en las respuestas, borrados que tardan 30 segundos sin aviso) y la vigencia de la sección 5, que acá pesa: la base de Kubernetes elegida deja de recibir parches nueve días después de esta review.

## 2. Qué se revisó

- Todo el árbol salvo `.qa/`, `dist/`, `release/` y `labs/kubeconfig` (generados o privados, fuera de Git): README, `docs/`, `assets/curriculum.js` (las 25 lecciones, campo por campo, EN y ES), `assets/reference.js` (fuentes y 40 términos), `assets/app.js`, `assets/visuals.js`, `assets/course.css`, `labs/` completo (`compose.yaml`, `kind.yaml`, la aplicación Python, los ocho manifiestos), `scripts/` (build, check, package, serve, test-labs), `_headers`, `404.html`, `.gitattributes`, `.gitignore`, `package.json`, `LICENSE` y el workflow raíz [`validate-docker-kubernetes.yml`](../.github/workflows/validate-docker-kubernetes.yml). [LEÍDO]
- `npm run build` y `npm run check` en la laptop de validación (Windows 11, PowerShell 5.1, Node 24.11.0, Docker Engine 29.1.3, Compose v2.40.3, kind 0.33.0, kubectl 1.34.1): pasan. Los conteos del README (25 lecciones, 7 unidades, 75 escenas, 75 preguntas, 100 pasos, 40 términos, 1200 renderizados) coinciden. [EJECUTADO]
- Las 100 prácticas, en la misma laptop: `npm run test:labs -- all` ejecutó las lecciones 00 a 12 (52 pasos) y la comprobación HTTP desde el host, todo PASS, y falló en 13.4 con `x509: certificate signed by unknown authority` desde kubectl de Windows; `npm run test:labs -- all --in-node --from=13` ejecutó las lecciones 13 a 24 (48 pasos) dentro del nodo de control, todo PASS. Es decir: los 100 pasos pasan, pero los 48 de Kubernetes solo por la ruta alternativa, igual que en la validación original (ver 3.2). [EJECUTADO]
- El certificado que presenta el endpoint `127.0.0.1:<puerto>` del clúster, leído con una conexión TLS directa: sujeto `CN=kube-apiserver`, emisor: la autoridad raíz del antivirus de la máquina, no la CA del clúster. Confirma la interceptación que describe VALIDATION; no es un defecto del curso, pero sí la razón de 3.2. [EJECUTADO]
- Las 52 páginas (portada y 25 lecciones, en los dos idiomas) renderizadas en un navegador sin interfaz a 1280 px: cero errores de consola, cero desbordes horizontales. Capturas de la portada y de una lección en las cuatro apariencias y a 390 px. [EJECUTADO]
- Un comando de las lecciones ejecutado a mano en Windows PowerShell 5.1 para comprobar la promesa de compatibilidad (ver 3.3). [EJECUTADO]
- Fines de línea, BOM, guiones, doble codificación y palabras prohibidas sobre todos los archivos de texto. [EJECUTADO]
- Versiones fijadas contra el release de kind 0.33.0, el calendario de parches de Kubernetes, Docker Hub y el changelog de GitHub (sección 5). [FUENTE]
- Las afirmaciones sobre Docker, Compose y Kubernetes contrastadas con `docs.docker.com`, `kubernetes.io/docs` y `kind.sigs.k8s.io` (sección 6). [FUENTE]

## 3. Antes de publicar

### 3.1 `scripts/build.mjs` está guardado con doble codificación UTF-8 [EJECUTADO]

El archivo contiene `Â·`, `estÃ¡n`, `TambiÃ©n podÃ©s`, `espaÃ±ol`, `ObservÃ¡` y `â†’` donde debería decir `·`, `están`, `También podés`, `español`, `Observá` y `→`. Como `build.mjs` genera todo lo demás, el defecto se propaga: las 25 páginas de `lessons/` tienen el separador roto en `<title>` (en la pestaña del navegador hasta que corre el script, y en cualquier vista previa de enlace), y esas 25 más `index.html` tienen roto el párrafo en español del `<noscript>` y el separador entre los enlaces a los apuntes; los apuntes `downloads/course-notes-*.txt` tienen `â†’` en cada regla y `ObservÃ¡` en cada paso; `404.html` tiene `pÃ¡gina`, `estÃ¡`, `VolvÃ©` y `â†’`. `check.mjs` no lo detecta porque los bytes son UTF-8 válido. El resto de los archivos (curriculum, app, visuals, reference, labs, docs) está bien.

Qué hacer: reescribir las seis cadenas en `build.mjs` y los cuatro textos de `404.html`, volver a construir, y agregar a `check.mjs` un control de doble codificación (que ningún archivo contenga `Ã`, `Â` ni `â€`).

### 3.2 La ruta que enseñan las lecciones no se ejecutó nunca [LEÍDO] [EJECUTADO]

Las 48 prácticas de Kubernetes están escritas con `kubectl --kubeconfig kubeconfig --context kind-prumathe-dk` desde el host. VALIDATION lo dice con honestidad: ese acceso falló en la máquina de validación por la interceptación TLS, y los 48 pasos se ejecutaron reemplazando el prefijo por `docker exec prumathe-dk-control-plane kubectl ...`. En esta revisión pasó exactamente lo mismo. O sea que la versión 1.0.0 sale sin que nadie haya corrido los comandos tal como los va a tipear el estudiante. Es probable que funcionen (son los mismos argumentos y el mismo API server, y kind documenta ese flujo), pero no hay evidencia, y el curso se define por tenerla.

Qué hacer: correr `npm run test:labs -- kubernetes` en una máquina sin interceptación (o en la misma con la protección web del antivirus pausada durante la corrida) antes de publicar, y anotarlo en VALIDATION. La card del tablero ya lo pide; conviene que sea condición de la 1.0.0 y no una ampliación futura.

### 3.3 La lección 06, paso 2 falla en Windows PowerShell [EJECUTADO]

El comando es `docker compose run --rm --no-deps --entrypoint python toolbox -c 'import socket; print(socket.gethostbyname("app"))'`. En Windows PowerShell 5.1 (el shell de la máquina de validación y el de la mayoría de los Windows) las comillas dobles embebidas se pierden al pasar el argumento a un ejecutable nativo, y Python recibe `gethostbyname(app)`: `NameError: name 'app' is not defined`, código de salida 1. En bash funciona (y en PowerShell 7.3 o posterior debería, por el cambio en el paso de argumentos a ejecutables nativos; no se probó, la máquina no tiene `pwsh`). La suite no lo detectó porque `test-labs.mjs` tokeniza las líneas y llama a `spawnSync` sin pasar por ningún shell, así que la promesa "comillas simples compatibles con PowerShell, bash y zsh" (`labs/README.md`, texto del laboratorio en `app.js`) nunca se ejecuta de verdad. Es el único comando de los 100 con comillas anidadas.

Qué hacer: invertir las comillas (`-c "import socket; print(socket.gethostbyname('app'))"`), que funciona en los dos shells, y hacer que la suite ejecute al menos una vez cada comando a través del shell real (`powershell -Command` en Windows, `sh -c` en el resto) o que `check.mjs` rechace comillas anidadas.

### 3.4 Textos que cuentan cómo y dónde se produjo el curso [LEÍDO]

La regla es que el material no menciona cómo se produjo ni la máquina en la que se validó. Hay varios lugares:

- [`labs/README.md`](../docker-kubernetes-from-scratch/labs/README.md): "En la máquina de validación, Norton sustituye el certificado del endpoint local", y la sección entera "Alternativa local si el endpoint de Windows está interceptado", que es un problema de la máquina del autor convertido en instrucción para el estudiante. Este archivo viaja en el ZIP del kit.
- [`docs/VALIDATION.md`](../docker-kubernetes-from-scratch/docs/VALIDATION.md): "Norton Web/Mail Shield Untrusted Root", "no se modificó Norton", "El navegador integrado bloquea el protocolo `file:`", "prueba automatizada".
- [`README.md`](../docker-kubernetes-from-scratch/README.md) y [`docs/TEACHING.md`](../docker-kubernetes-from-scratch/docs/TEACHING.md): "Inspirado en el método y la identidad visual del curso de Kafka, con contenido, modelos y laboratorios propios"; "El formato y la identidad de Prumathe se inspiran en Kafka".
- `404.html`: "Esta página no está en el log" es el chiste de la 404 de Kafka; acá no significa nada, y además quedó solo en español cuando el título está en inglés.
- [`tablero.md`](../tablero.md): la card "Ampliar la validación de Docker y Kubernetes" nombra la marca del antivirus y el endpoint de Windows.

Qué hacer: en `labs/README.md` reducir la alternativa a dos líneas neutras en "Repetir y diagnosticar" ("si un proxy o antivirus local intercepta TLS y kubectl falla con `x509`, podés ejecutar los mismos comandos dentro del nodo de control con `docker exec ...`; no desactives la verificación") y sacar la marca; en VALIDATION decir "interceptación TLS local del endpoint" sin nombre de producto y sin el navegador; en README y TEACHING hablar del método de Prumathe sin nombrar al otro curso; en la 404 un texto propio bilingüe; en el tablero "en una máquina sin interceptación TLS local".

### 3.5 El README y los documentos del curso están solo en español [LEÍDO]

README, `labs/README.md` (salvo un "English quick start" al final), TEACHING, DEPLOYMENT y VALIDATION están en español. La regla del repositorio es que cada pieza existe en los dos idiomas con el mismo contenido, y los otros dos cursos la cumplen: el README y el `labs/README.md` de Kafka y de GitHub alternan párrafo en inglés y párrafo en español, y los `docs/` de Kafka están en inglés con título bilingüe. Además `build.mjs` copia `README.md` a `dist/`, así que el README es parte del sitio publicado.

Qué hacer: README y `labs/README.md` bilingües con el formato de Kafka (el inglés primero, como allá, o alternado); `docs/` con el mismo criterio que Kafka.

## 4. Defectos

### 4.1 `dist/` publica `docs/`, README y LICENSE [LEÍDO]

`build.mjs` copia a `dist/` también `docs/` (con VALIDATION y `validation-results.json`), `README.md` y `LICENSE`. Kafka y GitHub publican portada, lecciones, assets, apuntes, kit, `_headers` y 404, nada más. Con 3.4 y 3.5 resueltos deja de ser grave, pero conviene alinear: la evidencia de validación es del repositorio, no del sitio.

### 4.2 El workflow raíz sin `permissions` [LEÍDO]

[`validate-docker-kubernetes.yml`](../.github/workflows/validate-docker-kubernetes.yml) no declara `permissions: contents: read` ni `persist-credentials: false` en el checkout; el de GitHub sí. Sube un artefacto `dist` con `upload-artifact@v4` (ver 5.3). `docker compose -f labs/compose.yaml config --quiet` como validación estática está bien.

### 4.3 La suite no limpia y VALIDATION no lo dice en el README [LEÍDO] [EJECUTADO]

`test:labs` deja levantados el clúster de dos nodos, el proyecto Compose y las imágenes; VALIDATION lo declara ("conserva los recursos al terminar") y el README del curso solo remite a VALIDATION ("crean y modifican recursos de práctica"). Después de esta revisión quedaron corriendo `prumathe-dk-control-plane`, `prumathe-dk-worker` y `prumathe-dk-app-1`. Una línea en el README, junto a "Para las pruebas reales", diciendo que quedan levantados y con los dos comandos de limpieza del kit.

### 4.4 Etiquetas de la práctica en los apuntes y en las páginas [LEÍDO]

`build.mjs` rotula la práctica de todas las lecciones como "DOCKER ACTIVITY / ACTIVIDAD DOCKER" en los apuntes, y la descripción de cada página dice "a step-by-step Docker lab" también en las doce lecciones de Kubernetes. Cambiar a "LAB / LABORATORIO" y "a step-by-step lab".

### 4.5 `kind` fuera del PATH en la máquina de validación [EJECUTADO]

No es del curso, pero afecta a quien repita la validación: `kind.exe` quedó en `tmp/docker-kubernetes-tools/` y no está en el PATH del usuario, así que `kind version` falla en una terminal nueva. La guía del kit pide agregarlo al PATH; en esa máquina no se hizo.

### 4.6 Lección 08, paso 1: lo esperado no se puede observar [EJECUTADO]

El paso corre `docker compose config` y espera ver "app, toolbox, the named volume and loopback port mapping". `toolbox` tiene `profiles: [tools]` y Compose omite de `config` los servicios de perfiles inactivos: la salida real (en la laptop y en la salida que guardó la propia validación en `.qa/labs-all.json`) muestra solo `app`, el volumen, el secreto y el puerto. Qué hacer: cambiar lo esperado a "app, el volumen `signal-data`, el secreto y el puerto `127.0.0.1:18080`; toolbox no aparece porque su perfil `tools` está inactivo" (es una buena oportunidad para explicar perfiles) o correr `docker compose --profile tools config`.

### 4.7 Lección 00, paso 1 remite a un archivo que el kit no trae [LEÍDO]

"Use Compose v2 with support for up --wait; the verified versions are in docs/VALIDATION.md." El ZIP del kit lleva solo `labs/`, así que quien lo sigue desde la carpeta descomprimida no encuentra ese archivo; `labs/README.md` ya lista las versiones. Remitir ahí.

### 4.8 Borrar un Pod tarda 30 segundos y nadie lo anticipa [EJECUTADO]

En las lecciones 14 (paso 4), 16 (paso 3), 19 (paso 3), 20 (paso 4) y 24 (paso 3) el `delete` tarda unos 31 a 33 segundos (medido en esta revisión: 32,6 s; y en los tiempos de la validación original). Es el período de gracia por defecto de Kubernetes: `server.py` corre como PID 1 sin manejar SIGTERM, la señal se descarta y el kubelet espera 30 segundos antes de SIGKILL. Con `docker stop` pasa algo análogo: el contenedor termina con código 137 (matado). El texto no dice nada y quien cursa puede creer que el comando se colgó. Qué hacer: manejar SIGTERM en `server.py` (dos líneas con `signal.signal` y `sys.exit`), que además vuelve observable la escena de la lección 02 sobre recibir una señal y terminar, y mencionar el período de gracia en la lección 14. Mientras tanto, una frase en esos pasos ("tarda unos 30 segundos: el servidor no atiende SIGTERM y Kubernetes espera el período de gracia").

### 4.9 Lección 19, paso 2: `fsGroup` no es lo que permite escribir [FUENTE]

"fsGroup grants appropriate group access / fsGroup da acceso de grupo apropiado". El StorageClass `standard` de kind usa `rancher.io/local-path` con volúmenes hostPath y su script crea el directorio con `mkdir -m 0777`, así que el usuario 10001 escribe por el modo 0777, no por `fsGroup` (fuente: `pkg/build/nodeimage/const_storage.go` en el repositorio de kind). Qué hacer: "El usuario 10001 puede escribir porque el provisioner de kind crea el directorio con permisos abiertos; `fsGroup` importa con tipos de volumen que admiten cambio de propietario". El efecto exacto de `fsGroup` sobre hostPath no se verificó en ejecución. [NO VERIFICADO]

### 4.10 Las respuestas correctas siguen un patrón previsible [EJECUTADO]

En las 25 lecciones la posición de la respuesta correcta es `0,1,2` en las lecciones 0, 3, 6, ...; `1,2,0` en las 1, 4, 7, ...; `2,0,1` en las 2, 5, 8, ... (`correct` de cada `quiz` en `curriculum.js`), y `app.js` no mezcla las opciones. TEACHING dice "la respuesta correcta rota de posición", pero rotar con período tres es predecible: quien lo nota responde sin leer. Qué hacer: romper el patrón en `curriculum.js` (el curso de GitHub no lo tiene) o mezclar al renderizar con una semilla por lección.

### 4.11 Terminología en español que cambia de significado [LEÍDO]

- "Disponibilidad" por readiness en las lecciones 08 (escena 2 y control 2), 15 (control 1 y paso 3), 17 (escena 2 y control 2) y 20 (explicación del control 1). Disponibilidad es availability, que el curso usa con ese sentido en la 16 y la 24; la 20 y el glosario dejan "readiness". Unificar en "readiness".
- "Etiqueta" para Docker tag (lecciones 02, 03, 04, 05, 09, 11 entera, 13, 20, 24, glosario) y también para Kubernetes label (16 escena 1, 17 escena 1 y control 1). Quien llega a la 16 viene de once lecciones donde "etiqueta" era tag. "Tag" para imágenes y "label" para Kubernetes, como el curso ya hace con digest, rollout y readiness.
- "Asignación" por scheduling (14 intro, escena 1 y control 1; 15 escena 2; 21 escena 1, regla 2, control 2 y paso 3 "Leé la causa de asignación", cuando el paso busca por qué no se asigna; glosario Request). El curso dice "scheduler" y "FailedScheduling"; "scheduling" o "planificación", y el paso 3 de la 21 pasa a "Leé el motivo del FailedScheduling".
- "Circuito" por loop (15 escena 2 y explicación del control 2): "bucle de control" o "loop".
- "Proveedor local" por provisioner (19 escena 1 y paso 1): se lee como vendor; "provisioner" o "aprovisionador".
- "Saludable" en la 08 (escena 2 "Corriendo versus saludable", regla) y en `visuals.js`, cuando todas las salidas y la lección 10 dicen "healthy": unificar en "healthy", que es el estado literal que imprime Docker.

### 4.12 Lección 16: la escena dice borrar una instancia y el paso borra todas [LEÍDO]

Escena 2 "Delete one instance / Borrá una instancia" y el experimento "Remove one instance"; el paso 3 borra todos los Pods `app=signal` y lo dice ("This deliberately deletes all app=signal Pods"). Titular "Borrá las instancias" o borrar un solo Pod, que se parece más a una falla real.

### 4.13 Detalles de texto [LEÍDO]

- `app.js`: el `aria-label` de la práctica es "Hands-on activity / Actividad Docker" también en las lecciones de Kubernetes; "Actividad práctica".
- Apóstrofos tipográficos (U+2019) en la lección 21 control 2 ("yesterday’s"), `app.js` ("That’s") y `visuals.js` ("caller’s"); el resto del material usa puntuación ASCII.
- Glosario, paridad: "DNS" en español pierde "de nombres y de red"; "Namespace (Kubernetes)" pierde "con namespace". Lección 00 escena 2: "las primeras descargas necesitan internet" omite "de imágenes"; regla 2 imperativa en inglés y declarativa en español.
- `reference.js`: la fuente `secret` (Secrets de Kubernetes) no la usa ninguna lección; la 18 enlaza solo `configmap`. La 11 (tags, digests, `kind load`) enlaza el quick start de kind en vez de una página sobre tags o digests; la 10 enlaza límites de recursos y nada sobre `HEALTHCHECK`; la 00 enlaza kind sin relación con el método. Permitir dos fuentes por lección o elegir la más afín.

## 5. Vigencia de las versiones

### 5.1 Kubernetes 1.34 llega a fin de vida el 27/10/2026 [FUENTE]

El curso fija `kindest/node:v1.34.11` con kind 0.33.0. El release de kind 0.33.0 (26/08/2026) trae imágenes para 1.37.0 (la predeterminada), 1.36.4, 1.35.8 y 1.34.11; el curso eligió la más vieja de las cuatro. Según el calendario de parches de Kubernetes, 1.34 entró en mantenimiento el 27/08/2026, su último parche es 1.34.12 (15/09/2026) y el fin de vida es el 27/10/2026, nueve días después de esta review. "La base es Kubernetes 1.34.11; no se presenta como la versión más reciente" (README) se queda corto: para la audiencia del repositorio, publicar un curso sobre una versión que deja de recibir parches la semana siguiente es un problema.

Qué hacer: pasar la base a 1.36.4 o a 1.37.0 (las dos vienen en el mismo kind 0.33.0, con digest publicado), kubectl de la misma serie, y volver a correr las suites; ninguna de las APIs que usa el curso (apps/v1, v1, rbac.authorization.k8s.io/v1, EndpointSlices discovery.k8s.io/v1) cambia entre esas versiones, así que el contenido no debería moverse. Si se mantiene 1.34 por alguna razón, decir en README y VALIDATION la fecha de fin de vida.

### 5.2 La imagen base de Python es de agosto de 2025 [FUENTE]

`python:3.13.7-alpine3.22@sha256:9ba6d8cb...`: el digest coincide con el que publica Docker Hub para esa etiqueta (bien fijado), pero la etiqueta se publicó el 18/08/2025. Hoy existen `3.13.16-alpine3.24` y `3.14.8-alpine3.24` (04/10/2026) y `3.15.0-alpine3.24` (17/10/2026). Fijar por digest es correcto; fijar un digest de hace catorce meses deja al estudiante construyendo sobre una base sin los parches de seguridad de Python y de Alpine de todo ese período, y el curso lo presenta como práctica recomendada ("imagen base fijada por digest", lección 11 paso 3).

Qué hacer: subir a `python:3.13.16-alpine3.24` (o 3.14) con su digest, actualizar el Dockerfile, la lección 11 paso 3, `labs/README.md` y VALIDATION, y reconstruir. `server.py` y `probe.py` usan solo la biblioteca estándar.

### 5.3 Actions sobre Node 20 [FUENTE]

El workflow raíz usa `actions/checkout@v4`, `actions/setup-node@v4` y `actions/upload-artifact@v4`, cuyos `action.yml` declaran `runs.using: node20`. GitHub quitó Node 20 de los runners el 23/09/2026 y recomienda pasar a las versiones que corren en Node 24: `checkout` y `setup-node` desde v5 (vigente v7), `upload-artifact` desde v6. Mismo hallazgo en la review del curso de GitHub.

### 5.4 Docker, Compose, kind y kubectl [FUENTE] [EJECUTADO]

Docker Engine 29.1.3, Compose v2.40.3 y Docker Desktop 4.55.0 son las versiones ejecutadas, no fijaciones; está bien dicho. `docker compose up --wait` y `--force-recreate` existen en Compose v2 desde hace años; `mem_limit` y `cpus` son atributos válidos del Compose Specification y el curso los lee bien (134217728 bytes y 500000000 NanoCpus). kind 0.33.0 es la versión vigente. kubectl 1.34.1 en el host frente a 1.34.11 en el servidor respeta la política de desfase; si la base pasa a 1.36 o 1.37 (5.1) hay que subir kubectl a la misma serie.

## 6. Pedagogía y contenido

### 6.1 Lo que está bien y conviene no perder [LEÍDO] [FUENTE]

Las afirmaciones de fondo se contrastaron una por una con la documentación oficial y están bien: `up --wait` y `--force-recreate` (CLI de Compose); los servicios con perfil arrancan con `run` aunque el perfil esté inactivo (perfiles de Compose); los secretos de Compose se montan como archivo en `/run/secrets/`; la copia inicial de contenido a un volumen nuevo y la dependencia de los bind mounts del host; la publicación en `127.0.0.1` visible solo desde el host; `HEALTHCHECK` que vuelve a healthy al primer éxito y a unhealthy tras los reintentos; las tres sondas y la retirada del endpoint cuando falla readiness; `ReadWriteOnce` por nodo, no por Pod, y el reclaim policy `Delete` de los volúmenes dinámicos; Secrets sin cifrar en etcd por defecto; ConfigMaps en variables de entorno que no se actualizan solos y `subPath` que no recibe actualizaciones; RBAC puramente aditivo; `kubectl auth can-i` con salida 1 cuando la respuesta es `no`; el StorageClass `standard` de kind con `WaitForFirstConsumer`. Cada escena termina con una regla que nombra el límite ("aceptación de API no es convergencia", "reinicio no es reemplazo", "readiness no es liveness", "rollback de plantilla no es reversión de datos"), que es la marca de la casa. Las prácticas limpian lo que ensucian (las marcas `/tmp/fail-live` y `/tmp/not-ready` se quitan en el mismo paso, la 15 vuelve a dos réplicas, la 18 quita la variable, la 22 vuelve a 1.0.0, la 20 y la 21 borran sus objetos).

### 6.2 Prácticas repetidas [LEÍDO]

La lección 03 (imágenes), pasos 3 y 4, repite la demostración de la 01 (escribir en la capa temporal y ver que no está en una instancia nueva) con otro nombre de archivo. Algo propio de imágenes: `docker diff` sobre un contenedor detenido, o comparar `{{json .RootFS.Layers}}` entre 1.0.0 y 1.1.0 para ver las capas compartidas. La 24 (integradora) repite la 16 (borrar Pods, `rollout status`, sonda). Como cierre podría pedir evidencia nueva: los UID antes y después, los endpoints con `terminating: true` durante el borrado, y que el estudiante escriba las tres afirmaciones de la escena 2 (qué controlador actuó, qué identidad cambió, qué datos no se conservaron) con la salida como prueba.

### 6.3 El Secret que nunca se consume [LEÍDO]

La lección 18 crea e inspecciona el Secret `demo-token` pero ningún Pod lo usa, y `server.py` expone el campo `secret_mounted` justamente para eso. Montarlo en `/run/secrets/demo_token` y verificar `secret_mounted: true` cierra la escena 3 ("el modo de entrega cambia el comportamiento") con un experimento real.

### 6.4 Orden entre la 16 y la 17 [LEÍDO]

La 16, paso 4, usa el Service (`http://signal`) y dice "request the Service from a replacement" una lección antes de que la 17 lo presente. Una frase ("el Service `signal` lo creó `base.yaml`; se explica en la lección 17") o mover esa verificación a la 17.

### 6.5 Más evidencia con lo que ya hay [LEÍDO]

- Lección 06: además de arreglar 3.3, mostrar que el nombre `app` no resuelve desde el host (probar `http://app:8080` en el navegador y comparar) es exactamente la distinción de la escena 1.
- Lección 02 y `labs/README.md`: documentar el código de salida después de `docker stop` (0 si el proceso atendió SIGTERM, 137 si hubo SIGKILL) le da al estudiante una observación concreta para la regla "recibir una señal no equivale a terminar el trabajo" (ver 4.8).
- Lección 10, escena 2 en español dice "0,5 CPU" y el paso 2 imprime `500000000` NanoCpus; una frase que una los dos números.
- Lección 11, paso 3: `docker image inspect python:3.13.7-alpine3.22@sha256:...` depende de que la imagen base haya quedado en el almacén local del daemon; con un builder `docker-container` o después de limpiar imágenes falla con "No such image". Una nota breve. [NO VERIFICADO con otro builder]

### 6.6 Modelos visuales [EJECUTADO]

Los modelos siguen el estilo de Kafka (área punteada, objetos inspeccionables, un control por escena, cuatro paletas) y renderizan sin errores en las 1200 combinaciones de `check.mjs` y en las capturas de esta revisión. La portada y las lecciones se ven bien en las cuatro apariencias y a 390 px.

## 7. Repositorio y empaquetado

### 7.1 Estructura [LEÍDO]

La carpeta sigue el patrón de Kafka: `assets/`, `labs/`, `scripts/` (incluidos `package.mjs` y `test-labs.mjs`), `docs/`, `_headers`, `404.html`, `.gitattributes`, `.gitignore`, `package.json`, `LICENSE` (MIT a nombre de Andrés Landa, como corresponde). No trae workflow propio dentro de la carpeta; Kafka y GitHub sí (copia para publicación independiente). Decidir si se agrega por consistencia.

### 7.2 Fines de línea, BOM, guiones, `.qa/` [EJECUTADO]

Todo LF y UTF-8 sin BOM (`.gitattributes` lo impone), cero guiones largos o medios en todo el árbol. `.qa/` está ignorado y guarda los informes de la suite; en Kafka esa carpeta se movió a `tmp/_obsoleto/`. `release/` y `labs/kubeconfig` están ignorados y excluidos de los ZIP, bien. `check.mjs` no controla palabras prohibidas (otros cursos, herramientas, marcas); conviene agregarlo como en GitHub y extenderlo a `docs/` y `labs/`.

### 7.3 Tablero, CHANGELOG y README raíz [LEÍDO]

- La card del tablero en Backlog nombra la marca del antivirus (3.4). La card en Hecho tiene dueño Andrés, bien.
- La entrada del CHANGELOG describe el curso y remite a VALIDATION por "la particularidad del acceso TLS local"; cuando se apliquen las correcciones conviene decir en el CHANGELOG que la 1.0.0 no ejecutó la ruta de host (3.2).
- El README raíz cambió en la misma entrega: la frase de la audiencia ("desarrolladores y arquitectos que trabajan en sistemas orientados a eventos, Java y Spring e integración empresarial") se cortó en "desarrolladores y arquitectos", y el punto "Se prueba con las manos" se reescribió para admitir actividades sin aserciones. Son cambios a la misión del repositorio, no al curso; se revisan aparte y, si no se quieren, se restauran antes del commit.

### 7.4 Cosas que están bien y conviene no perder

La aplicación Signal (un archivo, sin dependencias, usuario 10001, health check, interruptores de falla en `/tmp`) es exactamente del tamaño justo para que se vea la plataforma. Los manifiestos tienen `automountServiceAccountToken: false`, `runAsNonRoot`, requests y limits, las tres sondas, `imagePullPolicy: Never` con `kind load`, un namespace propio y contexto explícito en cada comando. La suite ejecuta los mismos comandos que ve el estudiante, admite códigos de salida distintos de cero solo donde la lección lo espera (RBAC) y no usa `prune` ni el kubeconfig del usuario. VALIDATION distingue lo ejecutado de lo no ejecutado y registra la duración de cada paso.

## 8. Prioridad sugerida

1. Antes de publicar: 3.1 (codificación de `build.mjs` y 404, reconstruir), 3.3 (comillas de la lección 06), 3.4 (textos sobre la máquina y el antivirus, el otro curso, la 404 y la card del tablero), 3.5 (README y docs bilingües), 4.6 y 4.7 (dos textos), 4.1 (no publicar `docs/`), 7.3 (README raíz y dueño de cards). Uno o dos días de trabajo de texto, más la traducción.
2. Antes de publicar pero con máquina: 3.2, correr `npm run test:labs -- kubernetes` por la ruta de host en una máquina sin interceptación y anotarlo en VALIDATION; junto con 5.1 y 5.2 (base 1.36 o 1.37, kubectl de la serie, imagen Python actual), porque cambiar la base obliga a correr las suites de nuevo y conviene hacerlo una sola vez.
3. Misma versión si entra: 4.8 (SIGTERM en `server.py`), 4.9 a 4.13, 4.2 a 4.5, 5.3 (actions).
4. Siguiente versión: 6.2 a 6.5.
