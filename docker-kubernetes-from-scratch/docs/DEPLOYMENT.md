# Distribuir el curso

El sitio es HTML, CSS y JavaScript local sin backend, fuentes remotas, analítica ni secretos. No necesita Node.js para cursar. Abrí `index.html` directamente o serví la carpeta con un servidor estático. Conservá la estructura de directorios.

## Construcción

Con Node.js 18 o superior, desde la carpeta del curso:

```text
npm run build
npm run check
npm run release
```

`dist/` contiene el sitio estático (portada, lecciones, assets, apuntes, 404 y `_headers`) y las fuentes públicas de los laboratorios; no incluye `docs/` ni este README. La discusión de cada lección es el único contenido de terceros: giscus (giscus.app) sobre GitHub Discussions, cargado a pedido, permitido por `_headers` en `script-src` y `frame-src`; el repositorio tiene que ser público con Discussions activado y la app de giscus instalada, y `assets/forum.js` guarda los identificadores (ver TEACHING). `release/docker-kubernetes-from-scratch.zip` contiene la carpeta portable completa. `release/cloudflare-pages.zip` contiene solo el sitio listo para un host estático. `downloads/docker-kubernetes-labs.zip` contiene la carpeta `labs/` y sus instrucciones. Los ZIP excluyen kubeconfig y evidencia local.

## Como carpeta de Prumathe

Configurá el directorio raíz del build como `docker-kubernetes-from-scratch`, el comando como `npm run build` y la salida como `dist`. Si la plataforma construye desde la raíz del repositorio, ejecutá `npm --prefix docker-kubernetes-from-scratch run build` y elegí `docker-kubernetes-from-scratch/dist`.

El workflow de validación de la raíz construye el sitio, valida estructura y modelos y comprueba la configuración Compose. No publica ni ejecuta clústeres reales. Las suites de laboratorios requieren una máquina con Docker y las herramientas indicadas en el kit.

## Como copia independiente

Copiá toda esta carpeta o descomprimí el ZIP portable. Todas las rutas de contenido son relativas. La página 404 supone que la raíz del host es la raíz del curso. Si lo servís bajo un prefijo, configurá la página de error del host acorde con ese prefijo.

La publicación externa es un paso separado. Esta entrega crea y verifica artefactos locales; no registra servicios, publica dominios ni envía credenciales. El progreso queda en el navegador y depende del origen desde el que se abre el sitio; cambiar de host no migra automáticamente ese estado.
