# Cómo se enseña y se edita

## Contrato didáctico

El objetivo es poder predecir un cambio de estado, justificar una decisión y nombrar qué evidencia la sostiene. La sintaxis no es un objetivo de evaluación. Cada lección tiene tres escenas, un modelo manipulable, cuatro pasos de actividad y tres preguntas. Las opciones incorrectas representan confusiones reales: guardar equivale a publicar, origin/main es una ventana en vivo o un control verde prueba todo.

El curso usa el ciclo de Prumathe: intuición, regla, predicción, experimento y explicación del límite. Conserva las cuatro apariencias y la identidad Prumathe. El caso Faro conecta conceptos sin exigir programación; una contradicción entre horarios sirve para distinguir conflicto textual y conflicto de significado.

Antes de ejecutar, pedí una predicción y su motivo. Después, pedí una evidencia observable y una explicación sin nombres de comandos. Al día siguiente, repetí el dibujo del antes y el después sin releer. El [cuaderno](../labs/WORKSHEET.txt) y la [rúbrica](../labs/CAPSTONE.md) sostienen ese método. No se asignan tiempos estimados sin medirlos con estudiantes.

## Tres clases de evidencia

1. Modelo del navegador: ilustrativo, determinista y sin llamadas a Git ni a GitHub.
2. Experimento local: Git real, repositorios aislados nuevos y aserciones sobre contenido y relaciones. Los remotos son rutas de disco y no comprueban permisos del servicio.
3. Actividad de GitHub: observación manual en un repositorio propio. Sin cuenta o sin funciones disponibles, se hace un caso de estudio explícito. Esa alternativa enseña razonamiento y no demuestra ejecución en línea.

Los pasos empiezan por la predicción y no por un comando. El comando se abre a demanda; los pasos de reflexión y de interfaz no se presentan como texto ejecutable. `PASS` corresponde a una aserción del asistente, nunca a conocimiento del estudiante. El avance local combina respuestas correctas y declaración de actividad, sin certificar que se ejecutó.

## Fuente única y edición

- `assets/curriculum.js`: versión, fecha, unidades y contenido bilingüe. Cada lección tiene un slug estable, unidad explícita, `mode` (`local` o `github`), tres escenas, tres preguntas y cuatro pasos.
- `assets/reference.js`: fuentes primarias, referencias complementarias y glosario con índice de lección. Al insertar una lección, revisá esos índices.
- `assets/visuals.js`: modelos SVG, controles y paletas. Las flechas entre commits apuntan al padre; las flechas de transferencia indican flujo de información. Los IDs alfabéticos son ilustrativos.
- `assets/app.js`: navegación, apariencias, comandos desplegables, glosario y progreso con claves `github-course-*`, independientes de otros cursos.
- `labs/lab.mjs`: escenarios que ejecutan Git. No debe usar repositorios del usuario, remotos de red, identidad real ni configuración global. Conservá un `cwd` comprobado dentro de la carpeta nueva y los argumentos estructurados, sin shell.
- `scripts/build.mjs`: páginas, apuntes y ZIP, excluyendo `labs/runs/`. La carpeta completa funciona sin depender del nivel superior.

Español rioplatense con voseo e inglés equivalente. Explicá el término técnico al presentarlo y conservá nombres reales de herramientas. No uses guiones largos ni cortos tipográficos. Archivos UTF-8 sin BOM con finales LF. El selector de idioma conserva escena, paso y estado del modelo durante la sesión; las direcciones conservan lección, apariencia, vista, escena y paso de actividad. El modelo se reinicia al recargar.

## La página "Qué son Git y GitHub"

Fuera de la numeración de lecciones, `what-git-and-github-are.html` responde qué son, de dónde salieron, dónde encajan y dónde no, y cómo decidir, en cinco minutos de lectura. Su texto vive en `assets/about.js` (bilingüe, con sus fuentes oficiales y la fecha de verificación del curso); `app.js` la dibuja con el modelo de la lección 01 como única pieza interactiva; `build.mjs` genera la página y la pone al frente de los apuntes; `check.mjs` exige cada cadena en los dos idiomas, seis hitos en la línea de tiempo, tres columnas en la tabla y fuentes https. Se llega desde el botón de la portada, el diálogo de ayuda y las referencias de la lección 00. La sección "dónde no encaja" es criterio del curso y lo dice; el resto se contrasta con las fuentes listadas al pie.

## La discusión de cada lección

Cada lección cierra su pestaña Profundizá con una discusión: un hilo por lección en GitHub Discussions del repositorio de Prumathe, mostrado con giscus (giscus.app), un widget open source sin anuncios ni seguimiento. El widget se carga solo cuando el lector aprieta el botón, y solo en el sitio publicado (http o https); una copia local muestra el enlace a la lista de hilos, así que el curso sigue funcionando sin conexión y sin scripts externos hasta que el lector pide el foro. Leer es abierto; publicar pide una cuenta de GitHub. `assets/forum.js` nombra el repositorio, la categoría del curso y el prefijo del término; el título del hilo es `<carpeta del curso>/<slug de la lección>` con coincidencia estricta, así sobrevive a un cambio de dominio o de ruta. `_headers` permite `https://giscus.app` en `script-src` y `frame-src`. `check.mjs` verifica la configuración, que las páginas carguen `forum.js` y que la CSP permita giscus. Preparación en GitHub: repositorio público con Discussions activado, la app de giscus instalada y una categoría de tipo Announcement por curso; los identificadores salen del configurador de giscus.

## Alcance y mantenimiento

Las lecciones iniciales construyen el modelo de Git necesario para entender GitHub. Las finales trabajan propuestas, evidencia y autoridad. Autenticación y autorización se distinguen, pero no se configura SSH ni tokens: las actividades de GitHub se pueden recorrer por la web. El historial compartido se corrige con contexto; no se propone forzar como receta universal.

Cambiar contenido requiere reconstruir, verificar y documentar evidencia. Un cambio de un escenario requiere ejecutarlo. Uno de interfaz requiere inspección en navegador. Los controles locales no sustituyen la validación de permisos, planes, revisión o ejecución alojada. Actualizá la fecha de fuentes cuando realmente las revises, y registrá pendientes con dueño en el tablero del repositorio.
