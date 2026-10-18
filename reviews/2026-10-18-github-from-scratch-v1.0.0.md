# Review: GitHub from scratch v1.0.0

Estado: aplicada el mismo día en la versión 1.1.0 del curso (secciones 3 y 4 completas, 6.2 a 6.6 salvo el cosmético 6.7, y 7.4); el detalle está en [`CHANGELOG.md`](../CHANGELOG.md) y en `docs/VALIDATION.md` del curso. La validación de las seis actividades en una cuenta de GitHub sigue con card en [`tablero.md`](../tablero.md). El texto de abajo describe la 1.0.0 tal como estaba.

Fecha: 2026-10-18. Objeto: [`github-from-scratch/`](../github-from-scratch/) tal como está en el árbol de trabajo antes de su primer commit (versión 1.0.0, validación del 18/10 en [`docs/VALIDATION.md`](../github-from-scratch/docs/VALIDATION.md)).

Cada hallazgo dice cómo se estableció:

- **[LEÍDO]**: surge de leer el archivo citado; cualquiera lo reproduce abriendo ese archivo.
- **[EJECUTADO]**: se corrió algo en esta revisión (build, check, los experimentos del kit, un render, un conteo).
- **[FUENTE]**: se contrastó con documentación o anuncios oficiales, con la fecha.
- **[NO VERIFICADO]**: sospecha razonable que no se pudo confirmar; se dice por qué.

## 1. Veredicto

El curso está bien hecho y es publicable con pocos arreglos. Las 20 lecciones se leyeron completas en los dos idiomas y no apareció ninguna afirmación falsa sobre Git ni sobre GitHub: index contra working tree, ramas como punteros, fast-forward contra merge commit, conflictos y resolución, remote-tracking branches, fetch sin integrar, rechazo de push divergente, forks, borradores de PR, aprobación propia prohibida, squash y rebase-and-merge de GitHub, revert contra reset, tags y releases, `.gitignore` sobre archivos ya seguidos y qué hacer ante un secreto expuesto. Las 60 preguntas tienen la respuesta correcta correcta, distractores claramente incorrectos y explicación acorde. Los 14 experimentos de `lab.mjs` hacen exactamente lo que las lecciones describen y pasan en Windows y en Linux. El hilo narrativo de Faro (una guía con horarios) sostiene el curso sin pedir programación y a la vez le sirve a la audiencia del repositorio.

Lo que hay que resolver antes de publicar son dos textos de `docs/` que cuentan cómo se produjo el curso o nombran otro curso (sección 3). Después vienen los defectos de la sección 4, de los cuales pesan tres: las actions de ejemplo corren sobre un runtime que GitHub ya retiró, el mínimo de Git declarado no cubre la garantía de aislamiento del kit, y dos huecos en la secuencia de actividades de GitHub.

## 2. Qué se revisó

- Todo el árbol salvo `.qa/`, `dist/` y `labs/runs/` (generados, fuera de Git): README, `docs/`, `assets/curriculum.js` (las 20 lecciones, campo por campo, EN y ES), `assets/reference.js` (18 fuentes, 9 complementarias, 37 términos), `assets/app.js`, `assets/visuals.js`, `assets/course.css`, `labs/` completo (`lab.mjs`, README, CAPSTONE, WORKSHEET, `examples/`), `scripts/` (build, check, serve), `_headers`, `404.html`, `.gitattributes`, `.gitignore`, `package.json`, `LICENSE` y los dos workflows (el de la carpeta y [`validate-github.yml`](../.github/workflows/validate-github.yml) en la raíz). [LEÍDO]
- `npm run build` y `npm run check` en la laptop de validación (Windows, Node 24.11.0): pasan. `node labs/lab.mjs all` en Windows (Git 2.51.0.windows.1): 14 experimentos, 41 aserciones, PASS. El mismo kit en Linux (Git 2.43.0, Node 22.22.0): 41 de 41, PASS; build y check también. Los conteos que declara el README (20 lecciones, 6 unidades, 60 escenas, 60 preguntas, 80 pasos, 14 experimentos, 41 aserciones, 6 actividades de GitHub, 37 términos) coinciden con el contenido y con la salida de `check.mjs`. [EJECUTADO]
- Las 42 páginas (portada y 20 lecciones, en los dos idiomas) renderizadas en un navegador sin interfaz a 1280 px: cero errores de consola, cero desbordes horizontales. Capturas de la portada y de una lección en las cuatro apariencias y a 390 px. [EJECUTADO]
- Las 27 URL de `reference.js` abiertas: todas responden y tratan el tema; una redirige (4.9). [EJECUTADO]
- Las afirmaciones sobre Git y GitHub contrastadas con `git-scm.com/docs`, el libro Pro Git y `docs.github.com` (sección 6.1). Las versiones de las actions y el retiro de Node 20 contra el changelog de GitHub y los `action.yml` de cada major (sección 5). [FUENTE]
- Fines de línea, BOM, guiones y palabras prohibidas sobre todos los archivos de texto: todo LF, UTF-8 sin BOM, cero guiones largos o medios, ninguna mención a herramientas, modelos ni al curso de Kafka dentro de lecciones, labs, README ni assets. [EJECUTADO]

## 3. Antes de publicar

### 3.1 `docs/VALIDATION.md` describe la herramienta con la que se revisó la interfaz [LEÍDO]

Sección "Interfaz en navegador": "Se recorrieron las veinte páginas en el navegador integrado", "La revisión usó un panel de aproximadamente 806 px de ancho", "el navegador automatizado no permite ese protocolo". Son detalles del entorno de producción del curso, no evidencia reproducible, y el README raíz enlaza este documento como evidencia pública.

Qué hacer: dejar en VALIDATION lo que cualquiera puede repetir (comandos, versiones, conteos, qué se probó y qué no) y sacar el navegador integrado, el automatizado y el ancho del panel. "La apertura por `file://` no se probó" alcanza.

### 3.2 `docs/TEACHING.md` nombra otro curso [LEÍDO]

"El curso adapta el ciclo del curso de Kafka: intuición, regla, predicción, experimento y explicación del límite." El material no menciona otros cursos; además, `check.mjs` (línea 69) solo controla `kafka|docker|broker` en `assets/`, `lessons/` y `downloads/`, así que `docs/` queda sin red.

Qué hacer: "El curso usa el ciclo de Prumathe: intuición, regla, predicción, experimento y explicación del límite", y extender ese control de `check.mjs` a `docs/`, `labs/` y la raíz de la carpeta. El README del curso dice "inspirado en el método visual de Prumathe", que está bien.

## 4. Defectos

### 4.1 Las actions de ejemplo corren sobre Node 20, retirado de los runners [FUENTE]

[`labs/examples/hours.yml`](../github-from-scratch/labs/examples/hours.yml), [`.github/workflows/validate.yml`](../github-from-scratch/.github/workflows/validate.yml) y el workflow raíz [`validate-github.yml`](../.github/workflows/validate-github.yml) usan `actions/checkout@v4` y `actions/setup-node@v4`. Los `action.yml` de esas majors declaran `runs.using: node20`; desde `v5` declaran `node24`. GitHub anunció que los runners usan Node 24 por defecto desde el 16/06/2026 y que Node 20 se quitó de los runners el 23/09/2026, con la recomendación de pasar a las versiones de las actions que corren en Node 24 (changelog del 17/03/2026, actualizado el 25/08/2026). Las majors vigentes al 18/10/2026 son `checkout` v7 (v7.0.1, 20/07/2026) y `setup-node` v7. La lección 15 (paso 1 y 2) y VALIDATION citan estas versiones como revisadas el 18/10, y eso no se sostiene.

Qué hacer: pasar a `actions/checkout@v5` y `actions/setup-node@v5` como mínimo (o a v7, las vigentes) en los tres archivos y en los enlaces de VALIDATION. `persist-credentials: false` sigue existiendo; `node-version: '22'` y `ubuntu-latest` (Ubuntu 24.04) siguen siendo válidos. `setup-node` v5 o posterior activa caché automática solo si `package.json` declara `packageManager`; el repositorio de práctica no tiene `package.json`, así que no cambia nada. Si no se ejecuta un workflow real para confirmarlo, no hay evidencia de que `v4` falle hoy, solo de que corre sobre un runtime que GitHub ya no soporta. [NO VERIFICADO]

### 4.2 "Git 2.28 o posterior" no cubre el aislamiento que promete el kit [FUENTE]

`lab.mjs` (línea 23) aísla la configuración con `GIT_CONFIG_GLOBAL`, variable que existe desde Git 2.32 (notas de la 2.32.0). Con Git 2.28 a 2.31 se ignora y el kit lee el `~/.gitconfig` real (`merge.conflictStyle`, `rerere.enabled`, `color.ui`, etc.), contra lo que dicen `labs/README.md` ("usa identidad ficticia y configuración propia") y la lección 00. `git switch` (2.23) y `--initial-branch` (2.28) sí existen desde el mínimo declarado, así que lo más probable es que el kit funcione igual, pero la promesa de configuración propia vale desde 2.32. El mínimo aparece en cuatro lugares: lección 00 escena 3, README, `labs/README.md` y el texto del paso 2 en `app.js`.

Qué hacer: declarar "Git 2.32 o posterior" en los cuatro, o mantener 2.28 y aclarar que el aislamiento de la configuración global requiere 2.32.

### 4.3 El README de `main` nunca dice 09:00 [LEÍDO]

Lección 10, paso 1: se crea `faro-practice` con el README que genera GitHub (solo el título). Paso 2: el issue debe decir "actual 09:00, esperado 10:00, afecta README". Lección 11, paso 2: se edita el README en `winter-hours` para que diga 10:00 y se espera que "main conserve la guía anterior"; paso 3: "el diff contiene solo el cambio de horario". Nada de eso es observable: el issue describe un 09:00 que no existe en el repositorio y el diff de la 11 es una línea agregada, no un cambio de 09:00 a 10:00 como en todo el hilo local. Recién en la lección 15 (paso 2) aparece un README con 09:00, y en una rama.

Qué hacer: en la lección 10, paso 1, agregar "En `main`, editá el README para que diga Open at 09:00, como la guía de los experimentos locales" (EN: "On main, edit the README so it says Open at 09:00, like the guide in the local experiments").

### 4.4 Lección 16, paso 3 pide comparar un estado que ya pasó [LEÍDO]

"On its PR, compare integration eligibility while the check fails and after it passes." La lección 15, paso 4, deja ese PR en verde ("Leave the green PR open for the rules lesson"), así que al llegar el control ya pasa y el bloqueo no se ve.

Qué hacer: "Volvé a poner 09:00 para ver el bloqueo y después 10:00 para ver que se habilita" (EN: "Push 09:00 again to see the blocked state, then 10:00 to see the gate open").

### 4.5 Terminología en español: merge [LEÍDO]

Las unidades 1 y 2 dicen "commit de integración" e "integrar" (lección 02 escena 2, lección 05 título y escena 2, lección 06, glosario "Merge commit / Commit de integración", "Merge base / Base de integración"), y la unidad 3 dice "merge commit" y "Merge conserva la forma" (lección 13 escena 1 y control 1). El mismo concepto cambia de nombre a mitad del curso y la regla del repositorio es dejar en inglés lo que así se usa en la práctica.

Qué hacer: "merge" como término ("merge commit", "hacer merge") en las 20 lecciones y en el glosario; "integrar" solo como explicación llana.

### 4.6 Terminología en español: fetch [LEÍDO]

Lección 07 (paso 1 "antes de obtener novedades", control 3 "quizá necesites obtener novedades") y lección 08 (título "Obtener, integrar, publicar") alternan con "fetch" en la misma lección ("Fetch obtiene objetos", "después de fetch", "fetch deja el archivo intacto") y en el glosario. Qué hacer: "fetch" en todas; título sugerido para la 08: "Fetch, integrar, publicar".

### 4.7 Ortografía en español, lección 12 paso 1 [LEÍDO]

"¿hay respaldo para el horario? ¿los demás avisos son coherentes?": mayúscula después del cierre de interrogación. El inglés tiene una sola pregunta compuesta; sugerido "¿Hay respaldo para el horario y los demás avisos son coherentes?".

### 4.8 `labs/README.md` ya no describe la validación real [LEÍDO] [EJECUTADO]

"La validación ejecutada usa Git 2.51.0 y Node 24.11.0 en Windows; otras plataformas quedan sin verificar." En esta revisión el kit pasó completo en Linux (Git 2.43.0, Node 22.22.0). Además, es una frase sobre el proceso de validación dentro del material que viaja en el ZIP al estudiante. Qué hacer: dejar en `labs/README.md` solo los requisitos y llevar la evidencia (Windows y Linux) a `docs/VALIDATION.md`.

### 4.9 Fuente complementaria con URL redirigida [EJECUTADO]

`reference.js`, `more.actions`: `.../security-for-github-actions/security-guides/security-hardening-for-github-actions` responde por redirección a `https://docs.github.com/en/actions/reference/security/secure-use`. Funciona hoy; conviene apuntar al destino.

### 4.10 `404.html` mínimo y relativo [LEÍDO]

Es una sola línea sin estilos, con `href="./index.html"`. En Kafka la 404 es una página propia, con estilos y enlace a la raíz del host, porque el host la sirve para cualquier ruta inexistente y no sabe desde dónde. Con `./index.html`, una ruta inexistente bajo `lessons/` manda a `lessons/index.html`, que no existe. Qué hacer: copiar la 404 de Kafka con los textos de este curso.

## 5. Vigencia de las versiones

### 5.1 Actions [FUENTE]

Ver 4.1: `checkout` y `setup-node` pasan de v4 a v5 como mínimo; v7 es la vigente en las dos. `ubuntu-latest` es Ubuntu 24.04. Node 22 sigue en soporte (LTS hasta abril de 2027).

### 5.2 Git y Node [FUENTE] [EJECUTADO]

El kit no fija versiones, declara mínimos. Comandos usados: `git init --initial-branch` (2.28), `git switch` (2.23), `GIT_CONFIG_GLOBAL` (2.32, ver 4.2), `node --test` (estable desde Node 20). Ejecutado con Git 2.51.0 y 2.43.0, Node 24.11.0 y 22.22.0.

### 5.3 GitHub como servicio [FUENTE]

Lo que el curso afirma del servicio está vigente al 18/10/2026: borradores de PR disponibles en todos los repositorios desde mayo de 2025; el autor no puede aprobar su propio PR; la aprobación se descarta con un commit nuevo si está activado el descarte; rulesets en repositorios públicos con GitHub Free y en públicos y privados con los planes pagos; squash merge como un commit; rebase and merge de GitHub reescribe committer y SHA; los secretos (salvo `GITHUB_TOKEN`) no llegan a workflows disparados desde forks. El curso declara que GitHub no es una versión fijable y que las actividades dependen de plan y permisos, que es la forma correcta de decirlo.

## 6. Pedagogía y contenido

### 6.1 Lo que está bien y conviene no perder [LEÍDO] [FUENTE]

Cada lección repite el ciclo (modelo, predicción, experimento o actividad, control) y el experimento prueba exactamente la distinción de la escena: `diff` contra `diff --cached` en la 03, `%P` con dos padres en la 05, los marcadores de conflicto y la resolución a 10:30 con dos padres en la 06, `origin/main` desactualizado en la 07, el `rejected` real sin alterar el remoto en la 08, árboles idénticos con 2/1/1 padres en la 13, `revert` contra `reset --soft` en la 14, el tag quieto mientras `main` avanza en la 17, `ls-files` después del `.gitignore` en la 18. Las tres clases de evidencia (modelo, Git local, GitHub o caso de estudio) están separadas en el texto, en el cuaderno y en la rúbrica, y el avance nunca se presenta como ejecución detectada. Las afirmaciones del servicio se contrastaron una por una con `docs.github.com` y están bien (ver 5.3).

### 6.2 Tags anotados y ligeros [FUENTE]

El experimento de la 17 crea un tag anotado (`git tag -a v1.0 -m ...`) y lo desreferencia con `v1.0^{}`, pero ninguna escena ni el glosario distinguen tag anotado de ligero. Una frase en la escena 1 o en el glosario ("un tag anotado es un objeto con autor, fecha y mensaje; uno ligero es solo un nombre", `git tag` en git-scm.com) evita la duda al leer la salida.

### 6.3 Los comandos impresos por el kit no se pueden pegar [EJECUTADO]

`lab.mjs` (línea 40) imprime `$ git commit -m Record the original opening hours` y `$ git tag -a v1.0 -m Original public schedule`, sin comillas. Las lecciones dicen que el asistente imprime cada operación como referencia; esas líneas no corren tal cual ni en bash ni en PowerShell. Qué hacer: envolver entre comillas los argumentos con espacios al imprimir.

### 6.4 Visibilidad del repositorio de práctica [FUENTE]

Lección 10, paso 1 pide "elegir la visibilidad conscientemente" sin decir qué cambia: en un repositorio público con GitHub Free hay rulesets y los minutos de Actions no se consumen; en uno privado con Free no hay rulesets ni protección de ramas, y las lecciones 15 y 16 dependen de eso (`about-rulesets` en docs.github.com). Una frase en ese paso le ahorra al estudiante llegar a la 16 sin la función.

### 6.5 PRs que quedan abiertos [LEÍDO]

El PR `winter-hours` (lección 11) y el PR de práctica (lección 15) quedan abiertos y tocan la misma línea del README; la 19 abre un tercero. Indicar en la 19 qué hacer con los anteriores (cerrarlos con una nota o integrar el de 10:00 como parte de la entrega).

### 6.6 Español [LEÍDO]

- "Señalador" (lección 04 intro y paso 4, lección 14 paso 3) es un marcapáginas en rioplatense; para la audiencia el término es "puntero".
- "Rebasar" (lección 13 control 3) significa exceder; en la práctica se dice "hacer rebase".
- Lección 16 escena 3: "afectan la aplicación" (por "affect enforcement") se lee como software; "afectan el cumplimiento de la regla". Paso 3: "actores con excepción" por "bypass actors"; la interfaz de GitHub muestra "Bypass list", mejor "quién está en la lista de bypass" (también en `visuals.js`).
- Interfaz (`app.js`): la pestaña "Activity" aparece como "Laboratorio" en dos lugares y "Actividad" en otros; "Descargar labs" en infinitivo cuando todo lo demás usa voseo ("Descargá los labs").
- Glosario: "Diff" apunta a la lección 03 pero se introduce y se evalúa en la 02 (regla "a diff compares snapshots", control 1).
- Lección 09 control 3 ("¿qué es upstream?"): en Git "upstream" también nombra la rama remota que sigue una rama local (`push -u`, `@{upstream}`); la respuesta es defendible en contexto de forks, una nota en la explicación evita confundir a quien ya usa `-u`.

### 6.7 Modelos visuales [EJECUTADO]

Los modelos dibujan un rectángulo relleno dentro del área punteada y repiten el título de la lección adentro ("FARO / UNA GUÍA COMPARTIDA / Pull requests: proponer una diferencia"), a diferencia de Kafka y Docker, donde el dibujo ocupa toda el área con un rótulo breve. Se nota en Lectura y en 390 px (dos bandas vacías arriba y abajo). Cosmético; conviene alinear con los otros dos cursos. En 390 px el botón de reinicio del modelo cae a una segunda línea debajo del de expandir.

## 7. Repositorio y empaquetado

### 7.1 Workflows [LEÍDO]

El workflow raíz [`validate-github.yml`](../.github/workflows/validate-github.yml) y la copia dentro de la carpeta siguen el patrón de Kafka (la copia sirve para una publicación independiente y es inerte en el repositorio). Los dos necesitan el cambio de versiones de 4.1. El raíz declara `permissions: contents: read` y `persist-credentials: false`; el de Docker no (ver la review de ese curso).

### 7.2 Fines de línea, BOM, guiones, `.qa/` [EJECUTADO]

Todo LF y UTF-8 sin BOM, cero guiones largos o medios, como en Kafka. `check.mjs` y `.gitattributes` imponen LF; la convención del repositorio es LF en la práctica y así debe quedar escrita en `claude/arranque.md` cuando exista. `.qa/` está ignorado y `check.mjs` escribe ahí sus pruebas del ejemplo de horas; en Kafka esa carpeta se movió a `tmp/_obsoleto/` y las pruebas no dejan rastro. Conviene que `check.mjs` use una carpeta temporal del sistema o `tmp/`.

### 7.3 Lo que publica `dist/` [LEÍDO]

`dist/` lleva portada, lecciones, assets, apuntes, kit, `_headers` y 404, igual que Kafka, y no lleva `docs/` ni README. Bien.

### 7.4 Tablero y CHANGELOG [LEÍDO]

La card "GitHub desde cero, v1.0.0" en Hecho tiene dueño "**Codex**": los dueños son personas y ese nombre cuenta cómo se produjo el curso. Pasa a **Andrés**. La entrada del CHANGELOG está completa; conviene sumarle la review y, cuando se apliquen, los cambios de la 1.0.1.

### 7.5 Cosas que están bien y conviene no perder

`lab.mjs` está muy bien hecho: repositorios nuevos por corrida, `cwd` comprobado, sin shell, identidad ficticia, hooks y plantillas en blanco, solo protocolo `file`, sin limpieza destructiva fuera de la carpeta nueva. `check.mjs` prueba que los controles del modelo no sean inertes, que el ZIP no lleve `runs/`, y que el ejemplo de Actions falle con 09:00 y pase con 10:00. README y `labs/README.md` son bilingües como en Kafka. `_headers` con CSP sin `unsafe-inline` para scripts.

## 8. Prioridad sugerida

1. Antes de publicar: 3.1 y 3.2 (dos párrafos de `docs/`), 4.1 (actions a v5 o v7 en tres archivos), 4.3 y 4.4 (dos frases en las actividades de GitHub), 7.4 (dueño de la card). Un día.
2. Misma versión si entra: 4.2 (mínimo de Git), 4.5 a 4.7 (terminología y ortografía), 4.8, 4.10 (404), 6.3 (comillas al imprimir).
3. Siguiente versión: 6.2, 6.4 a 6.7, 4.9, 7.2 (pruebas fuera de `.qa/`). La validación de las seis actividades en una cuenta real ya tiene card en el tablero.
