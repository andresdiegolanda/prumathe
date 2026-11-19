# Interfaz y publicación

Revisiones citadas: [Kafka](../../reviews/2026-10-17-kafka-from-scratch-v1.0.0.md), [Docker y Kubernetes](../../reviews/2026-10-18-docker-kubernetes-from-scratch-v1.0.0.md) y [GitHub](../../reviews/2026-10-18-github-from-scratch-v1.0.0.md), todas sobre la 1.0.0 de cada curso.

### Lo que tiene texto se mide renderizado

Un dibujo con rótulos se comprueba por la escala a la que se ve, no por el archivo.

Origen: el glosario de los tres cursos mostraba cada modelo al 28 % de su tamaño y no se leía. Kafka 1.4.1, Docker y Kubernetes 1.3.1 y GitHub 1.3.1 lo corrigieron; en Kafka pasó a 100 % en 1920 por 1080 y a 65 % en 1366 por 768, y las medidas de cada curso están en su VALIDATION ([CHANGELOG](../../CHANGELOG.md), 2026-10-19).
Control: pasada de navegador que mide la escala del dibujo en varios tamaños de pantalla, en las cuatro apariencias y los dos idiomas.

### Todo panel se prueba con el contenido expandido y en pantallas bajas

Un panel que crece (explicaciones que se abren) tiene que poder desplazarse hasta el último botón. En una grilla, un margen automático vertical hace que el ítem tome el alto de su contenido y deje de desplazarse: los márgenes automáticos van solo a los lados.

Origen: la pestaña Control de los tres cursos no se desplazaba y la última pregunta quedaba fuera de la ventana al abrir las explicaciones (mismas versiones).
Control: pasada de navegador que abre todo y comprueba que el último elemento se alcanza.

### Cuatro apariencias desde el principio

Colores como variables, tamaños en `rem`, una paleta por apariencia también para los SVG. Lectura es la única que cambia la estructura, y ahí el contenedor de scroll es el viewport, no `body`, o la cabecera fija deja de fijarse.

Origen: Kafka 1.1.0 las agregó después de escrito el curso (su `docs/TEACHING.md`, sección de apariencias).
Control: `check.mjs` dibuja cada modelo en cada apariencia e idioma.

### Cada pasada de navegador cubre lo mismo

Los dos idiomas, las cuatro apariencias, 390 px de ancho, el teclado, cero errores de consola y cero desborde horizontal.

Origen: es lo que midieron las revisiones de Docker y Kubernetes y de GitHub sobre todas sus páginas (§2 de cada una).
Control: [`scripts/test-visual.mjs`](../../scripts/test-visual.mjs) abre todas las páginas en los dos idiomas, en escritorio y en teléfono, y falla por errores de consola o desborde horizontal; el teclado y las apariencias Lectura y Proyector de las lecciones siguen en la pasada que registra cada VALIDATION.

### Redibujar no puede disparar otro redibujo

En una página que se redibuja sola, reemplazar el HTML dispara eventos de foco que pueden volver a redibujar sin fin. Una guarda de render, `requestAnimationFrame` y tooltips que se insertan sin redibujar todo.

Origen: el visor de Kafka 1.5.0 llegó a "Maximum call stack size exceeded" durante la validación.
Control: pasada de navegador con mouse y teclado mientras los datos cambian.

### Sin scripts externos; lo externo, a pedido y solo en el sitio publicado

CSP sin código en línea. Un servicio externo (el foro de cada lección) se carga cuando el lector lo pide y solo en http o https; una copia local muestra un enlace. El hilo de cada lección se identifica por curso y slug, para que sobreviva a un cambio de dominio.

Origen: la discusión por lección de Kafka 1.4.0, Docker y Kubernetes 1.3.0 y GitHub 1.3.0.
Control: `check.mjs` verifica la configuración, la carga y la CSP.

### Una herramienta local no se incrusta en el sitio publicado

Una página pública que llama a localhost dispara el permiso de red local del navegador. Lo que corre en la máquina de quien cursa se abre en localhost, en su propia pestaña.

Origen: decisión de diseño del visor de Kafka 1.5.0.
Control: revisión de diseño.

### La 404 es autocontenida y funciona desde cualquier ruta

Con estilos propios, en los dos idiomas, sin rutas absolutas ni relativas a una carpeta, porque el servidor la devuelve para cualquier ruta.

Origen: las tres 1.0.0 tenían un problema distinto: rutas absolutas (Kafka §4.6), `./index.html` que desde `lessons/` no existe (GitHub §4.10), un texto de otro curso y solo en español (Docker y Kubernetes §3.4).
Control: pedir una ruta inexistente en la raíz y dentro de una subcarpeta del sitio publicado.

### `dist/` publica solo el sitio

Portada, lecciones, assets, apuntes, kit, `_headers` y 404; los documentos y la evidencia son del repositorio.

Origen: Docker y Kubernetes publicaba `docs/`, README y LICENSE (§4.1).
Control: listar `dist/` después del build.

### El build no puede romper la codificación

Origen: el `build.mjs` de Docker y Kubernetes estaba guardado con doble codificación UTF-8 y rompió las 26 páginas, los apuntes y la 404; `check.mjs` no lo vio porque los bytes eran UTF-8 válido (§3.1).
Control: `check.mjs` rechaza las secuencias de doble codificación en todos los archivos.

### Después de publicar, se mira el sitio publicado

Que sirva la versión nueva, la CSP, la 404, las descargas como adjunto y las redirecciones.

Origen: la publicación en Cloudflare del 18/10 y los despliegues del 19/10 se comprobaron así.
Control: pedir al sitio publicado un archivo que cambió y buscar la versión.

### Cada texto de un dibujo se mide dentro de su caja, en cada estado

Los modelos se dibujan en cada escena y en cada valor de sus controles, en los dos idiomas, y en el navegador se comprueba que cada texto quede dentro de su caja y del dibujo. El español suele ser más largo, y un estado que nadie capturó es el que se desborda.

Origen: Cloudflare 1.0.0: en las capturas, `movements-dead` se salía de su caja, una leyenda quedaba fuera de su panel y el mapa cortaba el subtítulo del WAF; la medición de todos los estados encontró una caja más ([VALIDATION](../../cloudflare-from-scratch/docs/VALIDATION.md)).
Control: [`scripts/test-visual.mjs`](../../scripts/test-visual.mjs) mide que cada texto quede dentro del dibujo en el estado inicial de cada modelo; cada escena y cada valor de los controles siguen en la pasada de navegador que registra VALIDATION.

### El panorama de un curso usa el motor común y se valida con él

Las piezas, las líneas y los recorridos son datos del curso (`assets/big-picture-data.js`); el motor que los dibuja (`assets/big-picture.js` y `big-picture.css`) es el mismo archivo en todos los cursos, y `check.mjs` valida los datos con ese motor: ids, cada pieza dentro de su zona y separada de las otras, ninguna línea que cruce una pieza, los dos idiomas, lecciones, recorridos que solo se mueven por líneas y cada comando entre los de las lecciones.

Origen: el panorama de los seis cursos; el mapa de Cloudflare 1.0.0 tenía motor propio y en la 1.1.0 pasó al común, con las mismas fichas ([CHANGELOG](../../CHANGELOG.md), 2026-11-14).
Control: `check.mjs` de cada curso; que las copias del motor sean iguales lo controla [`scripts/check.mjs`](../../scripts/check.mjs), el control de raíz.

### Los rótulos de zona y las burbujas no tapan lo que explican

Un rótulo de zona no toca líneas ni piezas, y la burbuja de una parada no tapa la pieza ni el carril de esa parada; si no entra, el rótulo se mueve o se acorta, y en un teléfono la burbuja le deja el lugar al panel.

Origen: en LLMs, RAG y MCP 1.1.0 y Cloudflare 1.1.0 la medición encontró rótulos de zona cruzados por líneas y textos fuera de su caja; se corrigieron moviendo rótulos, ensanchando piezas y acortando subtítulos ([VALIDATION de LLMs, RAG y MCP](../../llm-rag-mcp-from-scratch/docs/VALIDATION.md), [de Cloudflare](../../cloudflare-from-scratch/docs/VALIDATION.md)).
Control: [`scripts/test-visual.mjs`](../../scripts/test-visual.mjs) mide, en los dos idiomas, que cada texto de una pieza quede en su caja, que ninguna pieza pise a otra y que cada rótulo de zona quede dentro de su zona y fuera de las piezas. Las burbujas de cada parada y los rótulos contra las líneas siguen en la pasada de navegador.

### Una fila de botones se prueba con un botón más

Toda fila de botones lleva `flex-wrap`, porque el próximo botón que se sume la desborda en un teléfono.

Origen: el botón del panorama desbordó en 390 px la fila de la portada de los cursos que no tenían `flex-wrap` en `.home-actions` (todos menos Cloudflare).
Control: [`scripts/test-visual.mjs`](../../scripts/test-visual.mjs) abre cada página en 390 px de ancho y falla si desborda.

### Lo que se puede medir en el navegador lo mide un programa, y lo demás se mira en capturas

La pasada de navegador que se repite igual en cada versión (abrir cada página, buscar errores de consola y desbordes, medir los textos del panorama contra sus cajas) la hace [`scripts/test-visual.mjs`](../../scripts/test-visual.mjs) en un Chrome sin interfaz. Lo que no se puede medir, que el dibujo se entienda, se mira en las capturas que deja en `tmp/capturas/`: el panorama y la portada en teléfono de cada curso, y cada página con un problema.

Origen: hasta el 19/11/2026 cada versión repetía esa pasada a mano y la contaba en su VALIDATION. La primera corrida abrió las 179 páginas de los seis cursos y la portada sin encontrar problemas, y se comprobó que falla cuando debe: con las cajas 30 px más chicas y con una pantalla de 150 px.
Control: `node scripts/test-visual.mjs` antes de cerrar un cambio que se ve, y el workflow [`suites.yml`](../../.github/workflows/suites.yml) de noche y a demanda.

### Un dibujo con cajas de tamaño fijo depende de la fuente de quien lo mira

Las cajas del panorama y de los modelos tienen el ancho que se les dio, y el texto, el que le da la fuente. La hoja de estilos pide primero Segoe UI, que viene con Windows; con otra fuente el mismo texto puede no entrar. Medir en una sola máquina no alcanza: se mide también con las fuentes de otro sistema.

Origen: el 19/11/2026, el control visual pasó sin problemas en la laptop y encontró 54 en un runner de Linux: textos fuera de su caja en el panorama de Docker y Kubernetes, de Microsoft Entra, de Kafka y de LLMs, RAG y MCP, y en un modelo de la página de presentación de este último.
Control: `scripts/test-visual.mjs` en el runner de `suites.yml`, que hoy puede fallar sin cortar la corrida hasta que se resuelva su card del [`tablero.md`](../../tablero.md).
