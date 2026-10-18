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

## Alcance y mantenimiento

Las lecciones iniciales construyen el modelo de Git necesario para entender GitHub. Las finales trabajan propuestas, evidencia y autoridad. Autenticación y autorización se distinguen, pero no se configura SSH ni tokens: las actividades de GitHub se pueden recorrer por la web. El historial compartido se corrige con contexto; no se propone forzar como receta universal.

Cambiar contenido requiere reconstruir, verificar y documentar evidencia. Un cambio de un escenario requiere ejecutarlo. Uno de interfaz requiere inspección en navegador. Los controles locales no sustituyen la validación de permisos, planes, revisión o ejecución alojada. Actualizá la fecha de fuentes cuando realmente las revises, y registrá pendientes con dueño en el tablero del repositorio.
