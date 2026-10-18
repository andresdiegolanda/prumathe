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
| Evidencia ejecutada y limitaciones | `docs/VALIDATION.md` |

La versión también figura en `package.json`; `npm run check` exige coincidencia. Cambiar contenido requiere `npm run build`: genera HTML por lección, apuntes, kit ZIP y `dist/` (portada, lecciones, assets, apuntes, kit, `_headers` y 404; los documentos de `docs/` y este README no se publican). No edites a mano los apuntes o páginas generadas. El curso tiene cero dependencias de npm. `check.mjs` también rechaza guiones largos y medios, doble codificación UTF-8, comillas dobles dentro de comillas simples en los comandos (fallan en Windows PowerShell 5.1) y menciones a otros cursos, herramientas o productos de la máquina de validación.

## La página "Qué son Docker y Kubernetes"

Fuera de la numeración de lecciones, `what-docker-and-kubernetes-are.html` responde qué son, de dónde salieron, dónde encajan y dónde no, y cómo decidir, en cinco minutos de lectura. Su texto vive en `assets/about.js` (bilingüe, con sus fuentes oficiales y la fecha de verificación del curso); `app.js` la dibuja con el modelo de la lección 15 como única pieza interactiva; `build.mjs` genera la página y la pone al frente de los apuntes; `check.mjs` exige cada cadena en los dos idiomas, seis hitos en la línea de tiempo, tres columnas en la tabla y fuentes https. Se llega desde el botón de la portada, el diálogo de ayuda y las referencias de la lección 00. La sección "dónde no encaja" es criterio del curso y lo dice; el resto se contrasta con las fuentes listadas al pie.

## Criterio editorial

Usá voseo en español: mirá, ejecutá, comprobá. Conservá comandos, estados, nombres de objetos y propiedades. Definí el término cuando aparece por primera vez y vinculalo al glosario. Ambos idiomas deben enseñar la misma distinción y el mismo límite. Evitá presentar un modelo determinista como medición de tiempos reales.

Los controles alteran una variable por vez: identidad, estado, réplicas, endpoints listos, consumo pedido, etapa de rollout o verbo autorizado. Los colores provienen de cuatro paletas coherentes con la apariencia elegida. Los objetos se pueden inspeccionar con mouse o teclado; las lecciones ofrecen expansión del modelo. Lectura reúne escenas, pasos y control en un documento continuo.

No prometas alta disponibilidad a partir de dos nodos kind sobre un host. No confundas persistencia con respaldo, aceptación de API con convergencia, reinicio con reemplazo, readiness con liveness ni rollback de plantilla con reversión de datos externos.

## Editar prácticas

Los comandos viven una sola vez en el contenido. `scripts/test-labs.mjs` lee esos mismos comandos, los ejecuta sin pasar por el shell del host (por eso `check.mjs` controla las comillas aparte) y aplica las comprobaciones declaradas en `checks`. Los shells necesarios corren dentro del contenedor. Los códigos de salida no cero se admiten solo donde la lección los espera. Las esperas son acotadas y deben explicarse a quien cursa.

Usá nombres propios del curso y contexto explícito. Ninguna práctica usa `prune`, el namespace default ni la configuración habitual de kubectl. El alumno puede leer todos los manifiestos incluidos. Mantené kubeconfig, resultados privados y cachés fuera de los ZIP.

Antes de editar versiones, verificá fuentes oficiales, compatibilidad y disponibilidad del artefacto: la base de Kubernetes es una imagen de nodo publicada en el release de kind (con su digest), kubectl va en la misma serie, y la imagen de Python se fija por digest a una etiqueta vigente. La versión del curso vive en `curriculum.js` y `package.json`; las etiquetas `prumathe-signal:1.0.0` y `:1.1.0` son versiones de la aplicación didáctica (el rollout de la lección 22 va de una a otra) y no cambian con la del curso. Después, construí, ejecutá los controles estáticos, corré las prácticas afectadas y revisá la interfaz en ambos idiomas. No conviertas una limitación no ejecutada en un resultado supuesto. Anotá la historia en el CHANGELOG raíz y cualquier pendiente con dueño en el tablero.
