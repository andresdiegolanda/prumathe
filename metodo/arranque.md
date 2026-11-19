# Arranque

Qué leer al empezar y cómo se trabaja en este repositorio. Las reglas están en el [`README.md`](../README.md) de la raíz; acá va lo que no vive en ningún otro lado: el orden de lectura, cómo empieza y termina una tarea, el tamaño de cada cambio, el dueño de cada hecho, las convenciones de trabajo y las particularidades de la máquina. Si algo de esto cambia, se cambia acá y se anota en el [`CHANGELOG.md`](../CHANGELOG.md).

Este archivo es el único punto de entrada: las instrucciones que una sesión recibe fuera del repositorio solo mandan a leerlo y, si dicen otra cosa, manda el repositorio.

## Orden de lectura

1. [`README.md`](../README.md) de la raíz: misión, estructura y "Reglas del repositorio".
2. [`tablero.md`](../tablero.md): qué está en curso y qué falta. La columna "Hecho" es historia y se lee solo si hace falta.
3. Las entradas recientes de [`CHANGELOG.md`](../CHANGELOG.md).
4. Del curso en el que se trabaja: su `README.md`, `docs/TEACHING.md` (cómo se enseña y cómo se edita), `docs/VALIDATION.md` (qué se ejecutó y qué no) y `labs/README.md`.
5. Si hay una revisión por aplicar, la de [`reviews/`](../reviews/).
6. Antes de proponer un curso nuevo o una función nueva de un curso, [`aprendizaje/`](aprendizaje/README.md): lo que ya se aprendió haciendo cursos.

## Cómo empieza y termina una tarea

- **Al empezar** se dice el tamaño del cambio y si la tarea incluye commit y push al terminar. En un cambio mediano o grande, las dos cosas se anotan en su card de [`tablero.md`](../tablero.md), que pasa a "En curso"; si no tiene card, primero se agrega. Un cambio chico no necesita card.
- **El alcance es lo que la tarea pide.** Lo que convenga sumar se propone y, si se aprueba, es otra card. Una pregunta se contesta y no cambia ningún archivo.
- **Al terminar** se hace lo que pide el tamaño del cambio, se corren los controles de "Convenciones de trabajo" y, si están autorizados, commit y push.

El responsable del proyecto es el dueño que figura en las cards: aprueba las propuestas, autoriza los commits y puede cambiar el tamaño de un cambio.

## El tamaño de cada cambio

| Tamaño | Qué es | Qué lleva |
|---|---|---|
| Chico | Una corrección: un texto, un defecto, un valor. No agrega contenido ni funciones. | Una entrada corta en `CHANGELOG.md`, y build y check de lo que toca. Si lo ve quien cursa, versión de parche. |
| Mediano | Una lección, una función o una herramienta nueva, dentro de lo ya decidido. | Lo del chico, con versión menor si lo ve quien cursa, más su card, la entrada en el `docs/VALIDATION.md` del curso, el mockup aprobado si es algo que se ve y una revisión corta contra [`aprendizaje/`](aprendizaje/README.md). |
| Grande | Un curso nuevo, o un cambio de lo que comparten los cursos o de la forma de trabajo. | Lo del mediano, más una propuesta aprobada antes de escribir: el índice del curso, el diseño de lo común o el texto de la regla. Un curso nuevo lleva además su revisión en [`reviews/`](../reviews/) antes de publicarse. |

## Un dueño por hecho

Es la regla 7 del README, bajada a una tabla. Los demás documentos enlazan al dueño y no repiten el dato.

| Hecho | Dónde vive |
|---|---|
| La versión de un curso, sus conteos (lecciones, escenas, pasos, términos) y las versiones de producto que fija | El curso: `assets/curriculum.js` y su `README.md` |
| Qué se ejecutó, cuándo y sobre qué | El `docs/VALIDATION.md` del curso |
| Cómo se enseña y cómo se edita un curso | Su `docs/TEACHING.md` |
| El estado de un pendiente | Su card en `tablero.md` |
| Qué cambió y cuándo | `CHANGELOG.md` |
| Cómo se trabaja | Este archivo |
| Lo aprendido haciendo cursos | [`aprendizaje/`](aprendizaje/README.md) |

`CHANGELOG.md`, la columna "Hecho" del tablero y [`reviews/`](../reviews/) son historia: cuentan lo que pasó con los datos de su momento y no se corrigen cuando el dato cambia. Por eso el `README.md` de la raíz dice qué es cada curso y dónde mirar, sin versiones ni conteos, y las cards abiertas del tablero tampoco nombran versiones. El control de raíz ([`scripts/check.mjs`](../scripts/check.mjs)) falla si aparece una, compara con cada curso lo que la portada repite de él (lecciones y pasos) y avisa, sin fallar, cuando una versión o un conteo aparece en más de un documento vigente.

## Convenciones de trabajo

- Copia de trabajo en `D:\_claude\prumathe`; remoto `github.com/andresdiegolanda/prumathe`, rama `main`.
- El material de los cursos no menciona cómo se produjo (herramientas, modelos, revisiones, productos de la máquina) ni otros cursos, clientes o sistemas. Los documentos del repositorio se redactan como decisiones u objetivos del proyecto.
- Cada cambio visible para el alumno sube la versión del curso: menor si agrega contenido o funciones, parche si corrige. Se cambia en todos los lugares que la llevan.
- Antes de dar un cambio por terminado: `node scripts/build.mjs` y `node scripts/check.mjs` en el curso, y desde la raíz `node site/scripts/build.mjs` y `node scripts/check.mjs`, el control de lo que cruza cursos. Si el cambio se ve en el navegador, además `node scripts/test-visual.mjs` (o con el nombre de la carpeta, para un solo curso) y una mirada a las capturas que deja en `tmp/capturas/`.
- Commit y push se autorizan por tarea: al empezar, el responsable dice si la tarea los incluye. Con esa autorización se hacen al terminar, sin volver a pedirlos; sin ella, no se hace ningún commit ni push hasta que se pidan.
- Commits: antes, `git fetch` y `git pull --ff-only`; si el remoto divergió, se para. `git add` con rutas explícitas, nunca `git add -A` ni `git commit -a`. Mensaje en español y sin tildes, como el historial, escrito en un archivo de `tmp/` y pasado con `git commit -F`. Sin líneas de atribución.
- Nunca entran al repositorio: `tmp/` (salvo `tmp/README.md`), `.qa/`, `labs/runs/`, `labs/kubeconfig`, `dist/`, `release/`, `site/dist/` y `.wrangler/`.
- Del repositorio no se borra nada: lo que sobra va a `tmp/_obsoleto/`.
- Cuando un trabajo deja algo sobre cómo hacer cursos que habría convenido saber antes, se agrega en [`aprendizaje/`](aprendizaje/README.md) en la misma sesión, con el formato de su README.

## Lo temporal

Todo lo temporal de una sesión va en `tmp/`, en la raíz, que no se versiona: mensajes de commit, registros, capturas, parches, scripts de un solo uso, copias para probar algo y herramientas que se bajan para una prueba.

- `tmp/` se puede vaciar: lo que tiene se puede volver a armar o ya no hace falta. Lo que se aprende o se decide pasa al repositorio.
- La excepción es `tmp/_obsoleto/`, que no se borra: ahí va lo que se retira del repositorio, con la fecha en el nombre.
- Una herramienta que necesita una carpeta temporal propia usa la del sistema y la borra al terminar.

## La máquina

- Windows 11 con PowerShell 5.1, Docker Desktop, Node y Git. Las versiones de cada validación están en el `docs/VALIDATION.md` del curso.
- En PowerShell, rutas absolutas. Git se corre desde PowerShell de Windows: el git de otra máquina sobre la misma carpeta (una máquina virtual que la monta, por ejemplo) puede dejar un `.git/index.lock` trabado.
- Los archivos van en UTF-8 sin BOM y con LF. Después de escribir uno, se relee y se confirma eso y que no tiene guiones largos ni cortos: fuera de los cursos lo confirma el control de raíz, y adentro, el `check.mjs` del curso.
- Git tiene `core.autocrlf=true`: el aviso "LF will be replaced by CRLF" es normal y no cambia lo que se commitea. Para exportar un árbol con `git archive`, `-c core.autocrlf=false -c core.eol=lf`; si no, sale con CRLF y los `check.mjs` lo rechazan.
- Las llamadas a PowerShell desde una sesión remota se cortan cerca de los 60 s: cada una, en menos de 50 s; lo largo, en segundo plano con un log que se consulta. `Start-Process` con `-RedirectStandardOutput` deja colgada la llamada; funciona `Start-Process powershell -ArgumentList '-NoProfile','-Command',"<comando> 2>&1 | Out-File -Encoding utf8 '<log>'" -WindowStyle Hidden -PassThru`.
- `git push` escribe en la salida de error y PowerShell lo muestra como error aunque haya salido bien: la línea con `->` lo confirma.
- Un producto de seguridad de la máquina intercepta TLS en el endpoint local de kind; su configuración no se toca. Por eso las prácticas de Kubernetes se ejecutaron dentro del nodo kind (card en el [`tablero.md`](../tablero.md)).
- El mismo producto vuelve a firmar el HTTPS de salida con un certificado que está en el almacén de Windows y que Node no conoce, así que `npm` queda reintentando sin avisar. Se corre con `$env:NODE_OPTIONS='--use-system-ca'`, que le hace usar también el almacén del sistema ([documentación de Node](https://nodejs.org/api/cli.html#--use-system-ca)); la verificación de TLS no se desactiva.
- `scripts/test-visual.mjs` necesita `puppeteer-core`, que no es parte del repositorio: `npm install --prefix tmp/herramientas-node puppeteer-core`. Usa el Chrome o el Edge de la máquina.
- Suelen quedar corriendo el clúster kind `prumathe-dk`, el Compose del curso de Docker y el clúster del curso de Kafka con su visor en `127.0.0.1:18090`. Las suites reinician tópicos o recursos de práctica: no se corren sobre un clúster en uso sin que lo decida su responsable.

## Trabajo en paralelo

Dos sesiones pueden trabajar a la vez sobre la misma copia de trabajo. Cada una se queda en su carpeta de curso. En los archivos compartidos (`CHANGELOG.md`, `README.md`, `tablero.md`, `site/assets/site.js`) se relee justo antes de editar y se hacen reemplazos chicos y exactos, nunca el archivo entero. Al commitear, solo las rutas propias; si un archivo compartido tiene cambios ajenos sin commitear, no se incluye hasta resolverlo.
