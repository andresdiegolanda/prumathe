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
Control: la misma lista en cada VALIDATION.

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
