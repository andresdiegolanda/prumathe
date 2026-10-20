# Experimentos de Git / Git experiments

Primero predecí qué estado cambia; después ejecutá y explicá el resultado. No se evalúa memoria de comandos. Los modelos del navegador no ejecutan este kit.

First predict which state changes; then run and explain the result. Command recall is not assessed. Browser models do not execute this kit.

## Preparación / Setup

Instalá [Git](https://git-scm.com/downloads) 2.32 o posterior y [Node.js](https://nodejs.org/en/download) 22 o posterior. Descomprimí el ZIP y abrí una terminal en la carpeta `labs`, junto a `lab.mjs`. No requiere npm install, contenedores, cuenta ni conexión después de instalar esas herramientas.

Install Git 2.32 or later and Node.js 22 or later. Extract the ZIP and open a terminal in `labs`, beside `lab.mjs`. No npm install, containers, account or network is required after installing these tools.

```text
git --version
node --version
node lab.mjs help
node lab.mjs staging
```

Cada ejecución crea una carpeta nueva `runs/faro-*`. El asistente imprime los comandos reales de Git y comprueba relaciones, contenido y referencias con aserciones. `PASS` significa que esas aserciones pasaron; la explicación la aportás vos. Copiá la ruta impresa y abrila en tu editor para inspeccionar archivos. Podés repetir cualquier experimento, en cualquier orden. Las carpetas anteriores se conservan para inspección y no entran en el ZIP ni en el sitio publicado.

Every run creates a new `runs/faro-*` folder. The helper prints actual Git commands and asserts relationships, content and references. `PASS` means those assertions passed; you supply the explanation. Open the printed path in your editor to inspect the files. Repeat any experiment in any order. Previous runs remain available for inspection and are excluded from the ZIP and published site.

| Lección / Lesson | Experimento / Experiment | Distinción / Distinction |
| --- | --- | --- |
| 00 | `setup` | Repositorio local sin remoto / Local repository without a remote |
| 01 | `local` | Registrar y compartir / Recording and sharing |
| 02 | `snapshots` | Instantánea y comparación / Snapshot and comparison |
| 03 | `staging` | Archivo, index y commit / File, index and commit |
| 04 | `branches` | Puntero y contenido / Pointer and content |
| 05 | `merge` | Fast-forward y dos padres / Fast-forward and two parents |
| 06 | `conflict` | Ambigüedad y acuerdo / Ambiguity and agreement |
| 07 | `remotes` | Remoto y observación local / Remote and local observation |
| 08 | `sync` | Fetch, integración y publicación / Fetch, integration and publication |
| 09 | `forks` | Repositorios separados / Separate repositories |
| 13 | `strategies` | Contenido igual, historia distinta / Same content, different history |
| 14 | `undo` | Corrección y movimiento de referencia / Correction and reference movement |
| 17 | `tags` | Tag estable y rama móvil / Stable tag and moving branch |
| 18 | `secrets` | Borrar ahora y conservar historia / Delete now and retain history |

`node lab.mjs all` ejecuta los 14 experimentos. Los remotos usan rutas locales y solo se permite el protocolo de archivos. El asistente descarta variables Git heredadas, usa identidad ficticia y configuración propia, y deshabilita hooks externos. No modifica configuración global ni repositorios existentes. Los ejemplos de reset y eliminación se limitan a los repositorios nuevos del experimento. No contiene credenciales reales.

`node lab.mjs all` runs all 14 experiments. Remotes use local paths and only the file protocol is allowed. The helper ignores inherited Git variables, uses a fictional identity and its own configuration, and disables external hooks. It does not modify global configuration or existing repositories. Reset and deletion examples affect only newly created experiment repositories. No real credentials are included.

## Visor en vivo / Live viewer

```text
node lab.mjs visor
```

Levanta una página en http://127.0.0.1:18092 que lee cada medio segundo los repositorios de `runs/` y dibuja la corrida más nueva: la historia de cada repositorio con sus ramas, HEAD, remotos y tags (las flechas apuntan al padre), los tres lugares de cada archivo (último commit, index y archivo de trabajo), los remotos que unen los repositorios de la corrida y un registro de lo que cambió. Al hacer clic en un commit, una rama, HEAD, un archivo o un repositorio, explica qué es, para qué sirve y qué muestra ahora. Dejalo abierto en una terminal y, en otra, corré el experimento con `--step` para que frene antes de cada operación:

Starts a page at http://127.0.0.1:18092 that reads the repositories in `runs/` every half second and draws the newest run: the history of each repository with its branches, HEAD, remotes and tags (arrows point to the parent), the three places of each file (last commit, index and working file), the remotes that link the repositories of the run, and a feed of what changed. Clicking a commit, a branch, HEAD, a file or a repository explains what it is, what it is for and what it shows now. Leave it running in one terminal and, in another, run the experiment with `--step` so that it stops before each operation:

```text
node lab.mjs staging --step
```

Con `--step`, el asistente muestra la próxima operación y espera Enter; el visor la muestra también, para que predigas qué cambia antes de verlo. El asistente deja su avance en `progress.json`, dentro de la carpeta de la corrida. Sin `--step`, el experimento termina en menos de un segundo y el visor muestra el resultado. El visor solo lee: usa comandos de Git que consultan, sin tomar el lock del index, y no escribe en `runs/` ni en otro lado. Atiende solo en 127.0.0.1 y solo pedidos GET y HEAD. No ve GitHub: las actividades en línea no aparecen. Se cierra con Ctrl+C.

With `--step`, the helper shows the next operation and waits for Enter; the viewer shows it too, so you predict what changes before you see it. The helper keeps its progress in `progress.json`, inside the run folder. Without `--step`, the experiment ends in less than a second and the viewer shows the result. The viewer only reads: it uses Git commands that query, without taking the index lock, and it writes nothing in `runs/` or anywhere else. It answers only on 127.0.0.1 and only GET and HEAD requests. It does not see GitHub: the online activities do not appear. Stop it with Ctrl+C.

## GitHub / GitHub

Las lecciones 10, 11, 12, 15, 16 y 19 tienen actividades en tu propio repositorio `faro-practice`. Siguen ese orden y pueden hacerse por la interfaz web. Las lecciones 10 a 12 no requieren usar la terminal ni autenticar Git localmente. Cada una ofrece un caso de estudio sin cuenta, que debe quedar identificado como tal en el cuaderno. No es una ejecución de GitHub.

Lessons 10, 11, 12, 15, 16 and 19 use your own `faro-practice` repository, in that order, through the web interface. Lessons 10 to 12 require no terminal or local Git authentication. Each offers an account-free case study that must remain labeled as such in your notebook. It is not a GitHub execution.

Para Actions, copiá `examples/hours.yml` a `.github/workflows/hours.yml` y `examples/hours.test.mjs` a `tests/hours.test.mjs` del repositorio de práctica. Necesitás Actions habilitado y uso disponible en tu cuenta. Las reglas disponibles dependen de plan, visibilidad y permisos. Para una aprobación independiente necesitás otra persona; el autor no puede aprobar su propio PR. Si esos recursos no están disponibles, usá el caso de estudio.

For Actions, copy `examples/hours.yml` to `.github/workflows/hours.yml` and `examples/hours.test.mjs` to `tests/hours.test.mjs` in the practice repository. Actions must be enabled with available account usage. Available rules depend on plan, visibility and permissions. Independent approval needs another person; authors cannot approve their own PRs. Use the case study when those resources are unavailable.

## Cuaderno / Notebook

Copiá [WORKSHEET.txt](WORKSHEET.txt) por actividad. La [rúbrica final](CAPSTONE.md) evalúa explicación, evidencia y límites. Se registra por separado si ejecutaste Git local, observaste GitHub o razonaste un caso.

Copy [WORKSHEET.txt](WORKSHEET.txt) per activity. The [final rubric](CAPSTONE.md) assesses explanation, evidence and limits. Separately record whether you executed local Git, observed GitHub or reasoned through a case study.
