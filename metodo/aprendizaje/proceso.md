# Proceso

Revisiones citadas: [Kafka](../../reviews/2026-10-17-kafka-from-scratch-v1.0.0.md), [Docker y Kubernetes](../../reviews/2026-10-18-docker-kubernetes-from-scratch-v1.0.0.md) y [GitHub](../../reviews/2026-10-18-github-from-scratch-v1.0.0.md), todas sobre la 1.0.0 de cada curso.

### Una revisión a fondo antes de publicar

Cada hallazgo dice cómo se estableció ([LEÍDO], [EJECUTADO], [FUENTE], [NO VERIFICADO]); la revisión sigue el mismo orden (veredicto, qué se revisó, antes de publicar, defectos, vigencia, pedagogía, empaquetado, prioridad). Se aplica lo prioritario y lo que queda pasa al tablero.

Origen: los tres cursos pasaron por una antes del primer commit o del primer push, y las tres encontraron algo que bloqueaba la publicación ([`reviews/`](../../reviews/)).
Control: ningún curso nuevo se publica sin su revisión en `reviews/`.

### El material no cuenta cómo se hizo, y un control lo vigila en toda la carpeta

Ni herramientas, ni entorno de producción, ni la máquina de validación, ni otros cursos: tampoco en `docs/`, en `labs/` ni en el tablero.

Origen: un caso por curso: "the user's visual guides" en el README de Kafka (§3.1), la marca del antivirus y la máquina dentro del kit de Docker y Kubernetes (§3.4), el navegador de la revisión y el ancho de su panel en el VALIDATION de GitHub (§3.1), referencias al curso de Kafka en los otros dos (GitHub §3.2, Docker y Kubernetes §3.4), y un dueño de card que nombraba una herramienta (GitHub §7.4).
Control: `check.mjs` rechaza palabras prohibidas en toda la carpeta del curso, `docs/` y `labs/` incluidos.

### Los problemas de la máquina no se convierten en instrucciones

Lo que le pasa a la máquina de validación queda en VALIDATION como condición, sin nombres de productos. Si quien cursa puede encontrarse lo mismo, el kit da un consejo genérico de dos líneas.

Origen: el `labs/README.md` de Docker y Kubernetes convertía la interceptación TLS de la máquina en una sección para el estudiante (§3.4).
Control: revisión de lectura del kit.

### VALIDATION separa lo ejecutado de lo no ejecutado, con antes y después

Plataforma, versiones y fecha; lo que se midió, con el antes y el después cuando es una corrección; lo que no se ejecutó y por qué. Sin anécdotas del entorno.

Origen: las tres revisiones lo piden; las correcciones del 19/10 registraron la escala del glosario antes y después por tamaño, apariencia e idioma.
Control: revisión de VALIDATION en cada versión.

### El README y el de `labs/`, en los dos idiomas

No solo las lecciones: el README del curso y el de `labs/` son lo primero que se lee, y el de `labs/` viaja en el kit.

Origen: Docker y Kubernetes 1.0.0 tenía README y documentos solo en español (§3.5); la 1.1.0 dejó bilingües el README y el de `labs/`.
Control: revisión de lectura de los dos README.

### Primero la idea, después el diseño, después el código

Para una función nueva que se ve (una herramienta, una página): propuesta con su viabilidad y sus alternativas, después un mockup de la pantalla, después la implementación.

Origen: el visor de Kafka 1.5.0 siguió ese orden; el contenido al pasar el mouse y el panel de detalle se definieron sobre el mockup.
Control: no se escribe código de interfaz sin mockup aprobado.

### Un commit por cambio, cada uno construido y controlado por su cuenta

Correcciones y funciones nuevas van en commits separados aunque se hayan trabajado juntas, y cada commit se puede construir y controlar solo.

Origen: el 19/10, las correcciones (Kafka 1.4.1, Docker y Kubernetes 1.3.1, GitHub 1.3.1) y el visor (Kafka 1.5.0) se commitearon por separado; el primero se comprobó exportando su árbol y corriendo build y check sobre él.
Control: `git archive` del árbol del commit (con `-c core.autocrlf=false -c core.eol=lf`), build y check.

### La licencia y su titular se deciden antes del primer push público

Origen: el LICENSE de Kafka decía "Kafka from scratch contributors" antes de existir un repositorio público (§3.3).
Control: revisión antes de publicar.

### Los dueños de los pendientes son personas

Origen: una card del tablero tenía como dueño una herramienta (GitHub §7.4).
Control: revisión del tablero.

### El trabajo que lleva un cambio depende de su tamaño

Una corrección lleva su entrada en el CHANGELOG; una función nueva, además, su card y su evidencia; un curso o una regla nueva, una propuesta aprobada antes de escribir. La tabla está en [`arranque.md`](../arranque.md).

Origen: revisión de la forma de trabajo del 18/11/2026: la lista de cierre era la misma para una corrección y para un curso nuevo, y lo chico se juntaba hasta ser grande.
Control: el tamaño se dice al empezar la tarea y, si es mediano o grande, queda en su card.

### Commit y push se autorizan por tarea

El responsable los autoriza al empezar, y con eso se hacen al terminar cada parte, sin volver a pedirlos.

Origen: hasta el 18/11/2026 cada commit esperaba un pedido propio al final, aunque la tarea ya estuviera aprobada; un trabajo en varias partes no podía dejar un commit por parte sin una vuelta más por cada una.
Control: la autorización figura en la card en curso; sin ella no hay commit ni push.

### Lo temporal tiene un lugar que se puede vaciar

`tmp/` es para lo que se puede volver a armar; lo que se retira del repositorio va aparte, en `tmp/_obsoleto/`, y no se borra.

Origen: el 18/11/2026 `tmp/` tenía 13.295 archivos y unos 5 GB, casi todos de la copia de estudio de un curso, mezclados con lo retirado del repositorio.
Control: revisión de `tmp/` al cerrar un trabajo grande.

### Las reglas de trabajo viven en el repositorio

Lo que una sesión tiene que cumplir está en [`arranque.md`](../arranque.md). Las instrucciones de fuera del repositorio solo mandan a leerlo.

Origen: el 18/11/2026, dos reglas (no commitear sin autorización y aprobar el índice antes de escribir un curso) estaban solo en las instrucciones que una sesión recibe fuera del repositorio.
Control: al cambiar una regla, se cambia en `arranque.md` y se revisa que esas instrucciones no la repitan.

### Lo que cruza cursos lo controla un programa de la raíz

Cada curso controla lo suyo con su `check.mjs`. Lo que ninguno puede controlar de sí mismo (los documentos de la raíz y sus enlaces, el motor común, los puertos, lo que la portada repite de cada curso, el tablero) lo controla [`scripts/check.mjs`](../../scripts/check.mjs), que además avisa cuando un dato aparece en más de un documento vigente.

Origen: el 18/11/2026, tres cards del tablero nombraban versiones viejas de sus cursos y la lista de revisiones del README no tenía las dos últimas; la igualdad del motor común y los puertos se comparaban a mano.
Control: `node scripts/check.mjs` antes de cerrar un cambio, y el workflow [`validate-repo.yml`](../../.github/workflows/validate-repo.yml) en cada push.
