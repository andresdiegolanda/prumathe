# Arranque

Qué leer al empezar y cómo se trabaja en este repositorio. Las reglas están en el [`README.md`](../README.md) de la raíz; acá va lo que no vive en ningún otro lado: el orden de lectura, las convenciones de trabajo y las particularidades de la máquina. Si algo de esto cambia, se cambia acá y se anota en el [`CHANGELOG.md`](../CHANGELOG.md).

## Orden de lectura

1. [`README.md`](../README.md) de la raíz: misión, estructura y "Reglas del repositorio".
2. [`tablero.md`](../tablero.md): qué está en curso y qué falta.
3. Las entradas recientes de [`CHANGELOG.md`](../CHANGELOG.md).
4. Del curso en el que se trabaja: su `README.md`, `docs/TEACHING.md` (cómo se enseña y cómo se edita), `docs/VALIDATION.md` (qué se ejecutó y qué no) y `labs/README.md`.
5. Si hay una revisión por aplicar, la de [`reviews/`](../reviews/).

## Convenciones de trabajo

- Copia de trabajo en `D:\_claude\prumathe`; remoto `github.com/andresdiegolanda/prumathe`, rama `main`.
- El material de los cursos no menciona cómo se produjo (herramientas, modelos, revisiones, productos de la máquina) ni otros cursos, clientes o sistemas. Los documentos del repositorio se redactan como decisiones u objetivos del proyecto.
- Cada cambio visible para el alumno sube la versión del curso: menor si agrega contenido o funciones, parche si corrige. Se cambia en todos los lugares que la llevan.
- Antes de dar un cambio por terminado: `node scripts/build.mjs` y `node scripts/check.mjs` en el curso, y `node site/scripts/build.mjs` desde la raíz.
- Commits: antes, `git fetch` y `git pull --ff-only`; si el remoto divergió, se para. `git add` con rutas explícitas, nunca `git add -A` ni `git commit -a`. Mensaje en español y sin tildes, como el historial, escrito en un archivo de `tmp/` y pasado con `git commit -F`. Sin líneas de atribución.
- Nunca entran al repositorio: `tmp/` (salvo `tmp/README.md`), `.qa/`, `labs/runs/`, `labs/kubeconfig`, `dist/`, `release/`, `site/dist/` y `.wrangler/`.
- No se borra nada: lo que sobra va a `tmp/_obsoleto/`.

## La máquina

- Windows 11 con PowerShell 5.1, Docker Desktop, Node y Git. Las versiones de cada validación están en el `docs/VALIDATION.md` del curso.
- En PowerShell, rutas absolutas. Git se corre desde PowerShell de Windows: el git de otra máquina sobre la misma carpeta (una máquina virtual que la monta, por ejemplo) puede dejar un `.git/index.lock` trabado.
- Los archivos van en UTF-8 sin BOM y con LF. Después de escribir uno, se relee y se confirma eso y que no tiene guiones largos ni cortos.
- Git tiene `core.autocrlf=true`: el aviso "LF will be replaced by CRLF" es normal y no cambia lo que se commitea. Para exportar un árbol con `git archive`, `-c core.autocrlf=false -c core.eol=lf`; si no, sale con CRLF y los `check.mjs` lo rechazan.
- Las llamadas a PowerShell desde una sesión remota se cortan cerca de los 60 s: cada una, en menos de 50 s; lo largo, en segundo plano con un log que se consulta. `Start-Process` con `-RedirectStandardOutput` deja colgada la llamada; funciona `Start-Process powershell -ArgumentList '-NoProfile','-Command',"<comando> 2>&1 | Out-File -Encoding utf8 '<log>'" -WindowStyle Hidden -PassThru`.
- `git push` escribe en la salida de error y PowerShell lo muestra como error aunque haya salido bien: la línea con `->` lo confirma.
- Un producto de seguridad de la máquina intercepta TLS en el endpoint local de kind; su configuración no se toca. Por eso las prácticas de Kubernetes se ejecutaron dentro del nodo kind (card en el [`tablero.md`](../tablero.md)).
- Suelen quedar corriendo el clúster kind `prumathe-dk`, el Compose del curso de Docker y el clúster del curso de Kafka con su visor en `127.0.0.1:18090`. Las suites reinician tópicos o recursos de práctica: no se corren sobre un clúster en uso sin que lo decida su responsable.

## Trabajo en paralelo

Dos sesiones pueden trabajar a la vez sobre la misma copia de trabajo. Cada una se queda en su carpeta de curso. En los archivos compartidos (`CHANGELOG.md`, `README.md`, `tablero.md`, `site/assets/site.js`) se relee justo antes de editar y se hacen reemplazos chicos y exactos, nunca el archivo entero. Al commitear, solo las rutas propias; si un archivo compartido tiene cambios ajenos sin commitear, no se incluye hasta resolverlo.
