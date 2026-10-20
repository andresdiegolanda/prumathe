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
