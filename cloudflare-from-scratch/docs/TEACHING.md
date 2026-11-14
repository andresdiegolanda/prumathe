# Enseñanza y edición

La unidad de aprendizaje sigue cuatro pasos: ver un mecanismo, formular una predicción, ejecutar un experimento y explicar su límite. Es el ciclo de Prumathe, con el runtime real de Workers en el lugar del experimento. Rumbo, una plataforma ficticia de seguimiento de envíos con una API de Spring Boot, una base PostgreSQL, webhooks de transportistas, un panel interno y comprobantes de entrega, queda fija de punta a punta, así cada pieza de Cloudflare se ve sobre los mismos datos.

Cada lección contiene tres escenas, una manipulación del modelo, al menos cuatro pasos reales y tres preguntas con distractores plausibles. La posición de la respuesta correcta no sigue un patrón (`check.mjs` lo verifica). El control evalúa comprensión; no detecta si se ejecutó la terminal. El avance del lab es una declaración de quien cursa.

## Qué es, para qué sirve, qué no hace

Cada pieza se presenta con las mismas tres preguntas: qué es, para qué sirve y qué no hace, y, cuando corresponde, qué da el plan gratuito. Las lecciones lo dicen en la primera escena; el mapa de Cloudflare lo dice en la ficha de cada pieza (`assets/map.js`), con la lección que la enseña y cómo la corre el kit: local, en parte o no está.

## Tres clases de evidencia

Cada paso del laboratorio dice de dónde sale su evidencia:

- local: corre en el kit, sin cuenta. Es la mayoría de los pasos, y la suite los ejecuta todos.
- cuenta: necesita una cuenta gratuita de Cloudflare y un token en `labs/.env`. Son pasos `optional`; la suite los corre solo con `--account`.
- zona: necesita un dominio propio en Cloudflare. El curso los muestra como caso de estudio, en el texto de las escenas, con lo que dice la documentación oficial; ningún paso del laboratorio depende de una zona.

El kit corre workerd, el runtime de Workers, con los bindings simulados por wrangler dev. Es un lugar, no una red: no hay anycast ni otros data centers, Workers Cache no corre, Hyperdrive no tiene pool ni cache y request.cf se trae una vez al arrancar. Cada lección que toca uno de esos límites lo dice en su texto y en lo que hay que observar.

## Fuentes de verdad

| Hecho | Archivo dueño |
| --- | --- |
| Texto EN/ES, versión, fecha, recorrido, comandos, controles y expectativas | `assets/curriculum.js` |
| Fuentes oficiales y glosario | `assets/reference.js` |
| Modelos, controles y paletas de los dibujos | `assets/visuals.js` |
| El mapa de Cloudflare: piezas, fichas y escenarios | `assets/map.js` |
| La página "Qué es Cloudflare" | `assets/about.js` |
| Navegación, progreso y lectura | `assets/app.js` |
| Apariencias y respuesta a tamaños de pantalla | `assets/course.css` y `assets/theme.js` |
| Servicios e imágenes fijadas por digest | `labs/compose.yaml`, `labs/edge/Dockerfile`, `labs/origin/Dockerfile` |
| El Worker de Rumbo, su configuración y sus pruebas | `labs/edge/src/`, `labs/edge/wrangler.jsonc`, `labs/edge/test/` |
| El comando de las lecciones | `labs/edge/lab/lab.mjs` |
| El visor en vivo | `labs/visor/` (sus `lessons.json` y `pieces.json` los escribe `build.mjs`) |
| El Worker para la cuenta | `labs/edge/deploy/` |
| El origen y la base | `labs/origin/`, `labs/db/init.sql` |
| Evidencia ejecutada y limitaciones | `docs/VALIDATION.md` |

La versión vive en `package.json` y en `curriculum.js`; `npm run check` exige coincidencia. Cambiar contenido requiere `npm run build`: genera el HTML de cada lección, la portada, la página de presentación, el mapa, los apuntes, el ZIP del kit y `dist/` (los documentos de `docs/` y este README no se publican). No edites a mano los apuntes ni las páginas generadas. El curso tiene cero dependencias de npm; el kit fija las suyas en `labs/edge/package-lock.json`. `check.mjs` también rechaza guiones largos, doble codificación UTF-8, comillas dobles dentro de comillas simples en los comandos (fallan en Windows PowerShell 5.1), un `?` sin comillas (en zsh es un patrón), comandos fuera del kit, pasos de cuenta que no sean opcionales, imágenes sin digest, puertos publicados fuera de 127.0.0.1, un `.env`, un `.dev.vars` o dependencias dentro del ZIP, y nombres de herramientas que produjeron el material o de otros cursos.

## El mapa de Cloudflare

`cloudflare-map.html` muestra todas las piezas del curso en una escena: quien pide, cómo se encuentra el borde, las etapas del borde en su orden, los bindings, lo que corre después del pedido, tu infraestructura y tu cuenta. Siete escenarios la recorren parada por parada: el mapa por zonas, una página pública, una llamada a la API, un webhook, el panel interno, una devolución que espera aprobación y lo que pasa cuando algo falla. Cada parada nombra una pieza; cada pieza tiene una ficha. Los valores marcados como medidos salen de la corrida del kit registrada en VALIDATION. `check.mjs` exige siete escenarios, que cada parada apunte a una pieza que existe, una ficha bilingüe por pieza con su lección, y que la escena se dibuje en las cuatro apariencias y en los dos idiomas.

## El visor en vivo

`labs/visor/` sirve en http://127.0.0.1:18098 lo que pasa por el borde, evento por evento: cada pedido, mensaje de la cola, alarma y cron, dibujado sobre las piezas del kit con sus llamadas, sus tiempos y la ficha de cada pieza. Corre dentro del contenedor del borde, con la carpeta montada en solo lectura, y lee los spans de wrangler dev en 127.0.0.1:8787, como `lab spans`: solo responde GET, solo a pedidos dirigidos a la máquina, con una CSP sin código en línea. No llama al Worker ni cambia nada.

Cada comando de lab empieza con un pedido a `/health?run=<comando>&poll=lab`. `lab spans` deja afuera lo que termina en `poll=lab`; el visor usa esa marca para decir qué comando y qué paso de la lección causaron lo que sigue, en el orden en que el explorador guardó los spans. Lo que no causó ningún comando de lab aparece bajo el último. `build.mjs` escribe `labs/visor/static/lessons.json` con los comandos de cada paso y `pieces.json` con las fichas del mapa (`assets/map.js`), así cada hecho tiene un solo dueño; `check.mjs` exige que estén al día. Cada lección, desde la 01, dice en el campo `visor` de `curriculum.js` qué mirar en el visor. `npm run test:visor` lo prueba con el kit levantado, después de una corrida completa de los laboratorios.

## La página "Qué es Cloudflare"

Fuera de la numeración de lecciones, `what-cloudflare-is.html` responde qué es, de dónde salió, dónde encaja y dónde no, y cómo decidir, en cinco minutos de lectura. Su texto vive en `assets/about.js`, bilingüe, con sus fuentes; `build.mjs` genera la página y la pone al frente de los apuntes; `check.mjs` exige cada cadena en los dos idiomas, seis hitos, tres columnas en la tabla, cinco preguntas y fuentes https. La sección "dónde no encaja" es criterio del curso y lo dice.

## La discusión de cada lección

Cada lección cierra su pestaña Profundizá con una discusión: un hilo por lección en GitHub Discussions del repositorio de Prumathe, mostrado con giscus. El widget se carga solo cuando el lector aprieta el botón, y solo en el sitio publicado; una copia local muestra el enlace a la lista de hilos. `assets/forum.js` nombra el repositorio, la categoría del curso y el prefijo del término, `cloudflare-from-scratch`. La discusión queda apagada (`enabled: false`) hasta que existan la categoría en GitHub y sus identificadores.

## Criterio editorial

Usá voseo en español: mirá, ejecutá, comprobá. Conservá en inglés los términos técnicos que se usan así (binding, isolate, Worker, cache, rate limiting, webhook, payload), los comandos, los nombres de campos y las salidas de los programas; los datos y las rutas de Rumbo están en inglés en los dos idiomas. Definí el término cuando aparece por primera vez y vinculalo al glosario. Ambos idiomas deben enseñar la misma distinción y el mismo límite.

No presentes el kit como si fuera la red de Cloudflare, ni un comportamiento de la simulación local como una propiedad de la plataforma. No confundas cifrar con autenticar, esconder una dirección con cerrar un puerto, la clave de cache con el usuario, un rate limit aproximado con una cuota exacta, ni al menos una vez con exactamente una vez. Cuando la documentación no dice algo, el texto lo marca como no verificado.

## Editar prácticas

Los comandos viven una sola vez en el contenido. `scripts/test-labs.mjs` lee esos mismos comandos, los ejecuta sin pasar por el shell del host (por eso `check.mjs` controla las comillas aparte) y aplica las comprobaciones de `checks`: `contains`, `absent`, `matches` y `sameLines`. Los códigos de salida no cero se admiten solo donde la lección los espera (`exit`). Con `--fresh` arranca de un kit sin contenedores ni volúmenes, como lo encuentra quien cursa.

Ninguna práctica usa `down -v` ni `prune`. Lo que una lección cambia lo deshace la misma lección: la flag de mantenimiento se borra, el impostor y el túnel se paran. El borde publica solo 127.0.0.1:18097 y, para el visor, 127.0.0.1:18098; el origen y la base no publican puertos. Las herramientas locales de wrangler dev verifican el encabezado Host, así que los comandos que las usan (`spans` y `cron`) corren dentro del borde con `docker compose exec edge lab`.

Antes de cambiar versiones, verificá fuentes oficiales, compatibilidad y disponibilidad del artefacto: las imágenes se fijan por digest y las dependencias del Worker por `package-lock.json`. Después, construí, ejecutá los controles estáticos, corré las prácticas afectadas con `npm run test:labs -- --only=N` y revisá la interfaz en ambos idiomas. Si cambia una salida, actualizá el texto que la cita. No conviertas una limitación no ejecutada en un resultado supuesto. Anotá la historia en el CHANGELOG raíz y cualquier pendiente con dueño en el tablero.
