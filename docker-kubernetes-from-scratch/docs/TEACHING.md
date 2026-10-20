# Enseñanza y edición

La unidad de aprendizaje sigue cuatro pasos: ver un mecanismo, formular una predicción, ejecutar un experimento y explicar su límite. Es el ciclo de Prumathe, con escenarios propios de contenedores y orquestación. Signal mantiene fija la aplicación para que las diferencias de plataforma sean observables.

Cada lección contiene tres escenas, una manipulación del modelo, cuatro pasos reales y tres preguntas con distractores plausibles. La posición de la respuesta correcta no sigue un patrón (`check.mjs` lo verifica). El control evalúa comprensión; no detecta si se ejecutó la terminal. El avance del lab es una declaración de quien cursa.

## Fuentes de verdad

| Hecho | Archivo dueño |
| --- | --- |
| Texto EN/ES, versión, fecha, recorrido, comandos y expectativas | `assets/curriculum.js` |
| Fuentes oficiales y glosario | `assets/reference.js` |
| Modelos, controles y paletas | `assets/visuals.js` |
| Navegación, progreso y lectura | `assets/app.js` |
| Apariencias y respuesta a tamaños de pantalla | `assets/course.css` y `assets/theme.js` |
| Aplicación, imagen base fijada por digest y recursos reales | `labs/` (el digest del `Dockerfile` y el de la lección 11 tienen que coincidir; `check.mjs` lo verifica) |
| Visor en vivo | `labs/visor/` (lectura y página) y el campo `visor` de cada lección en `assets/curriculum.js` (qué seguir en el visor) |
| Evidencia ejecutada y limitaciones | `docs/VALIDATION.md` |

La versión también figura en `package.json` y en la etiqueta de la imagen `prumathe-visor` de `labs/compose.yaml`; `npm run check` exige coincidencia. Cambiar contenido requiere `npm run build`: genera HTML por lección, apuntes, kit ZIP y `dist/` (portada, lecciones, assets, apuntes, kit, `_headers` y 404; los documentos de `docs/` y este README no se publican). No edites a mano los apuntes o páginas generadas. El curso tiene cero dependencias de npm. `check.mjs` también rechaza guiones largos y medios, doble codificación UTF-8, comillas dobles dentro de comillas simples en los comandos (fallan en Windows PowerShell 5.1) y menciones a otros cursos, herramientas o productos de la máquina de validación.

## La página "Qué son Docker y Kubernetes"

Fuera de la numeración de lecciones, `what-docker-and-kubernetes-are.html` responde qué son, de dónde salieron, dónde encajan y dónde no, y cómo decidir, en cinco minutos de lectura. Su texto vive en `assets/about.js` (bilingüe, con sus fuentes oficiales y la fecha de verificación del curso); `app.js` la dibuja con el modelo de la lección 15 como única pieza interactiva; `build.mjs` genera la página y la pone al frente de los apuntes; `check.mjs` exige cada cadena en los dos idiomas, seis hitos en la línea de tiempo, tres columnas en la tabla y fuentes https. Se llega desde el botón de la portada, el diálogo de ayuda y las referencias de la lección 00. La sección "dónde no encaja" es criterio del curso y lo dice; el resto se contrasta con las fuentes listadas al pie.

## La discusión de cada lección

Cada lección cierra su pestaña Profundizá con una discusión: un hilo por lección en GitHub Discussions del repositorio de Prumathe, mostrado con giscus (giscus.app), un widget open source sin anuncios ni seguimiento. El widget se carga solo cuando el lector aprieta el botón, y solo en el sitio publicado (http o https); una copia local muestra el enlace a la lista de hilos, así que el curso sigue funcionando sin conexión y sin scripts externos hasta que el lector pide el foro. Leer es abierto; publicar pide una cuenta de GitHub. `assets/forum.js` nombra el repositorio, la categoría del curso y el prefijo del término; el título del hilo es `<carpeta del curso>/<slug de la lección>` con coincidencia estricta, así sobrevive a un cambio de dominio o de ruta. `_headers` permite `https://giscus.app` en `script-src` y `frame-src`. `check.mjs` verifica la configuración, que las páginas carguen `forum.js` y que la CSP permita giscus. Preparación en GitHub: repositorio público con Discussions activado, la app de giscus instalada y una categoría de tipo Announcement por curso; los identificadores salen del configurador de giscus.

## El visor en vivo

Los modelos de las lecciones ilustran; el visor en vivo muestra lo que el curso creó de verdad, en dos planos. La lección 01 lo levanta (`docker compose up -d --wait visor`, http://127.0.0.1:18091) y la 13 lo conecta a la red `kind` para que lea el clúster. Cada lección desde la 01 dice, en su pestaña de laboratorio, qué seguir en el visor: el campo `visor` de `curriculum.js`, que dibuja `visorNote()` en `app.js` y que `build.mjs` escribe en los apuntes. Usalo para que el experimento se vea: el contenedor que vive menos de un segundo, el health check que falla con el proceso corriendo, el ReplicaSet que sube mientras el anterior baja, el endpoint que sale cuando su Pod deja de estar listo.

Vive en `labs/visor/`: `visor.py` (el servidor HTTP, la lectura cada medio segundo, `/api/state` y los archivos estáticos), `docker_watch.py` (Docker por el socket, con el stream de eventos en un hilo propio para que no se pierdan los contenedores de menos de un segundo), `kube_watch.py` (el API server por la red kind, con el kubeconfig del curso montado en solo lectura) y la página en `static/`. Su imagen, `prumathe-visor`, usa la misma base fijada por digest que la app (`check.mjs` lo verifica) y solo la biblioteca estándar de Python. Hace pedidos GET a una lista cerrada de rutas y pide los Secrets como metadatos, sin anotaciones: `kubectl apply` guarda en una el manifiesto completo, datos incluidos. El socket y el kubeconfig le permitirían cualquier cosa; lo que garantiza que solo lee es su código. `check.mjs` controla que los módulos de lectura solo emitan GET, y la suite `visor` de `scripts/test-labs.mjs` comprueba contra Docker y el clúster reales que en una ventana quieta no cambia nada, que los Secrets llegan solo por nombre y que, sin la red kind, conserva la última lectura buena marcada como vieja.

Los textos del panel de detalle (qué es cada objeto, para qué sirve, qué muestra ahora y qué se puede hacer) están en `static/visor.js`, en los dos idiomas. `LESSONS` relaciona cada número de lección con su título y `CMDS` guarda cada comando que ofrece el panel con su lección; `check.mjs` exige que los títulos coincidan con el currículo y que cada comando sea una línea de la práctica de esa lección. La página no escribe estilos en línea porque la CSP los bloquea, y `check.mjs` también lo controla.

Límites: muestra solo lo del curso (proyecto Compose y clúster `prumathe-dk`, imágenes `prumathe-signal`, namespace `dk-lab`); los contenedores de otros proyectos solo se cuentan. Si se recrea su contenedor, pierde la red kind y hay que conectarlo de nuevo. En Linux con Docker Engine necesita el grupo dueño del socket (`DOCKER_GID`), vía que todavía no se ejecutó.

## Criterio editorial

Usá voseo en español: mirá, ejecutá, comprobá. Conservá comandos, estados, nombres de objetos y propiedades. Definí el término cuando aparece por primera vez y vinculalo al glosario. Ambos idiomas deben enseñar la misma distinción y el mismo límite. Evitá presentar un modelo determinista como medición de tiempos reales.

Los controles alteran una variable por vez: identidad, estado, réplicas, endpoints listos, consumo pedido, etapa de rollout o verbo autorizado. Los colores provienen de cuatro paletas coherentes con la apariencia elegida. Los objetos se pueden inspeccionar con mouse o teclado; las lecciones ofrecen expansión del modelo. Lectura reúne escenas, pasos y control en un documento continuo.

No prometas alta disponibilidad a partir de dos nodos kind sobre un host. No confundas persistencia con respaldo, aceptación de API con convergencia, reinicio con reemplazo, readiness con liveness ni rollback de plantilla con reversión de datos externos.

## Editar prácticas

Los comandos viven una sola vez en el contenido. `scripts/test-labs.mjs` lee esos mismos comandos, los ejecuta sin pasar por el shell del host (por eso `check.mjs` controla las comillas aparte) y aplica las comprobaciones declaradas en `checks`. Los shells necesarios corren dentro del contenedor. Los códigos de salida no cero se admiten solo donde la lección los espera. Las esperas son acotadas y deben explicarse a quien cursa.

Usá nombres propios del curso y contexto explícito. Ninguna práctica usa `prune`, el namespace default ni la configuración habitual de kubectl. El alumno puede leer todos los manifiestos incluidos. Mantené kubeconfig, resultados privados y cachés fuera de los ZIP.

Antes de editar versiones, verificá fuentes oficiales, compatibilidad y disponibilidad del artefacto: la base de Kubernetes es una imagen de nodo publicada en el release de kind (con su digest), kubectl va en la misma serie, y la imagen de Python se fija por digest a una etiqueta vigente. La versión del curso vive en `curriculum.js` y `package.json`; las etiquetas `prumathe-signal:1.0.0` y `:1.1.0` son versiones de la aplicación didáctica (el rollout de la lección 22 va de una a otra) y no cambian con la del curso. Después, construí, ejecutá los controles estáticos, corré las prácticas afectadas y revisá la interfaz en ambos idiomas. No conviertas una limitación no ejecutada en un resultado supuesto. Anotá la historia en el CHANGELOG raíz y cualquier pendiente con dueño en el tablero.
