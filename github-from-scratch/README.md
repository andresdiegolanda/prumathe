# GitHub from scratch / GitHub desde cero

Un curso para **entender qué cambia, dónde y para quién**, inspirado en el método visual de Prumathe. Los comandos sirven para experimentar y consultar; ningún control pide recordar su sintaxis.

A course for **understanding what changes, where and for whom**, following Prumathe’s visual method. Commands are tools for experiments and reference; no checkpoint tests syntax recall.

Abrí [index.html](index.html?lang=es) o empezá por [Antes de empezar](lessons/before-you-start.html?lang=es). El sitio es estático, independiente y funciona sin servidor, cuenta ni conexión. El idioma inicial es español rioplatense; el selector ofrece inglés con el mismo contenido.

Open [index.html](index.html?lang=en) or start with [Before you start](lessons/before-you-start.html?lang=en). The static, self-contained site works without a server, account or connection. The default language is Rioplatense Spanish; the selector offers English with equivalent content.

## Incluye / Includes

- 20 lecciones en 6 unidades, con 60 escenas y modelos interactivos. / 20 lessons in 6 units, with 60 scenes and interactive models.
- 60 preguntas sobre predicción, explicación y límites, con distractores plausibles y devolución. / 60 questions about prediction, explanation and limits, with plausible distractors and feedback.
- 14 experimentos locales con Git real y 41 aserciones. / 14 local experiments using real Git with 41 assertions.
- 6 actividades de GitHub, cada una con alternativa de caso de estudio sin cuenta. / 6 GitHub activities, each with an account-free case-study alternative.
- 80 pasos de actividad, cuaderno de predicción y rúbrica final. / 80 activity steps, a prediction worksheet and a final rubric.
- Glosario visual de 37 términos, apuntes completos en ambos idiomas y kit ZIP. / A 37-term visual glossary, complete notes in both languages and a ZIP kit.
- Apariencias Clásico, Oscuro, Lectura y Proyector; navegación por teclado y avance local. / Classic, Dark, Reading and Projector skins; keyboard navigation and local progress.

## Recorrido / Learning path

| Unidad / Unit | Lecciones / Lessons | Pregunta central / Central question |
| --- | --- | --- |
| 00. Cómo aprender / How to learn | 00 | ¿Qué cuenta como evidencia? / What counts as evidence? |
| 01. Recordar un proyecto / Remember a project | 01 a 04 | ¿Qué guardé y qué historia seleccioné? / What did I record and which history did I select? |
| 02. Trabajar en paralelo / Work in parallel | 05 a 09 | ¿Cómo se relacionan estas historias y copias? / How do these histories and copies relate? |
| 03. Acordar un cambio / Agree on a change | 10 a 13 | ¿Qué proponemos y por qué aceptarlo? / What are we proposing and why accept it? |
| 04. Confiar en un cambio / Trust a change | 14 a 16 | ¿Qué evidencia exigimos y cómo corregimos? / What evidence do we require and how do we recover? |
| 05. Entregar con contexto / Deliver with context | 17 a 19 | ¿Qué versión entregamos y qué podemos afirmar? / Which version did we deliver and what can we claim? |

La guía de una biblioteca ficticia, Faro, conecta todas las lecciones. Los cambios de horario permiten razonar sobre contenido, intención y desacuerdos sin necesitar conocimientos de programación. El curso diferencia explícitamente Git de GitHub, commit de publicación, rama de clon y fork, fetch de integración, PR de pull y tag de release y despliegue.

The fictional Faro library guide connects the lessons. Schedule changes let you reason about content, intention and disagreement without programming knowledge. The course explicitly distinguishes Git from GitHub, commit from publication, branch from clone and fork, fetch from integration, PR from pull, and tag from release and deployment.

## Experimentos / Experiments

El kit local necesita Git 2.32 o posterior y Node.js 22 o posterior. Desde `labs`, ejecutá el experimento de la lección, por ejemplo `node lab.mjs staging`. No instala dependencias ni usa red. Crea repositorios nuevos en `labs/runs/` y conserva los anteriores. Leé [labs/README.md](labs/README.md) para preparación, mapa de experimentos y límites.

The local kit needs Git 2.32 or later and Node.js 22 or later. From `labs`, run the lesson experiment, for example `node lab.mjs staging`. It installs no dependencies and uses no network. It creates new repositories in `labs/runs/` and retains previous runs. See [labs/README.md](labs/README.md) for setup, the experiment map and limits.

Las actividades en GitHub necesitan una cuenta, un repositorio propio de práctica y los permisos correspondientes. Revisión independiente requiere otra persona. Actions y reglas dependen de disponibilidad y configuración. La alternativa sin cuenta es un caso de estudio y se identifica como tal. Marcar una actividad como completa es una declaración del estudiante, no detección de ejecución.

GitHub activities need an account, your own practice repository and appropriate permissions. Independent review needs another person. Actions and rules depend on availability and configuration. The account-free alternative is a labeled case study. Marking an activity complete is a learner declaration, not execution detection.

## Edición y evidencia / Editing and evidence

Versión del curso: **1.1.0**, 18/10/2026. Referencias oficiales revisadas en esa fecha. GitHub es un servicio, no una versión fijable del kit. La plataforma ejecutada y los límites de validación están en [docs/VALIDATION.md](docs/VALIDATION.md). No se declara ejecutada ninguna actividad en una cuenta de GitHub.

Course version: **1.1.0**, 18 October 2026. Official references were reviewed on that date. GitHub is a service, not a pinnable kit version. The executed platform and validation limits are in [docs/VALIDATION.md](docs/VALIDATION.md). No activity in a GitHub account is claimed as executed.

```text
npm run build
npm run check
npm run test:labs
npm run preview
```

`build` genera páginas, apuntes, ZIP y `dist/`. `check` verifica contenido y artefactos, dibuja 1584 variantes de modelos y prueba el ejemplo de horarios con un caso que falla y otro que pasa. `test:labs` ejecuta los 14 experimentos. `preview` sirve en localhost:4174. No se necesita Node para abrir el curso ya generado.

`build` generates pages, notes, ZIP and `dist/`. `check` verifies content and artifacts, renders 1584 model variants and tests the hours example with failing and passing cases. `test:labs` executes all 14 experiments. `preview` serves localhost:4174. Node is not needed to open the already generated course.

El método y contrato de edición están en [TEACHING.md](docs/TEACHING.md); publicación estática y copia independiente, en [DEPLOYMENT.md](docs/DEPLOYMENT.md). Quedan fuera del alcance operaciones avanzadas de Git, administración de organizaciones, implementación completa de CI/CD y respuesta exhaustiva a incidentes de secretos. Las lecciones nombran esos límites y enlazan fuentes oficiales.

The teaching and editing contract is in [TEACHING.md](docs/TEACHING.md); static publication and standalone copying are in [DEPLOYMENT.md](docs/DEPLOYMENT.md). Advanced Git operations, organization administration, full CI/CD implementation and comprehensive credential incident response are outside scope. Lessons name those boundaries and link official references.

Licencia MIT. Contenido y modelos originales; fuentes primarias enlazadas por lección. / MIT license. Original content and models; primary references linked per lesson.
