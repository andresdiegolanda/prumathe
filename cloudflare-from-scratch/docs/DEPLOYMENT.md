# Distribuir el curso

El sitio es HTML, CSS y JavaScript local sin backend, fuentes remotas, analítica ni secretos. No necesita Node.js para cursar. Abrí `index.html` directamente o serví la carpeta con un servidor estático. Conservá la estructura de directorios.

## Construcción

Con Node.js 18 o superior, desde la carpeta del curso:

```text
npm run build
npm run check
npm run release
```

`dist/` contiene el sitio estático (portada, página de presentación, mapa, lecciones, assets, apuntes, 404 y `_headers`) y las fuentes públicas de los laboratorios; no incluye `docs/` ni este README. La discusión de cada lección es el único contenido de terceros: giscus sobre GitHub Discussions, cargado a pedido, permitido por `_headers` en `script-src` y `frame-src`. `release/cloudflare-from-scratch.zip` contiene la carpeta portable completa. `release/cloudflare-pages.zip` contiene solo el sitio listo para un host estático. `downloads/cloudflare-labs.zip` contiene la carpeta `labs/` y sus instrucciones. Los ZIP excluyen `labs/.env`, `.dev.vars`, `node_modules`, el estado local de wrangler, la evidencia local y la salida de compilación.

## Como carpeta de Prumathe

Configurá el directorio raíz del build como `cloudflare-from-scratch`, el comando como `npm run build` y la salida como `dist`. Si la plataforma construye desde la raíz del repositorio, ejecutá `npm --prefix cloudflare-from-scratch run build` y elegí `cloudflare-from-scratch/dist`.

El workflow de validación de la raíz construye el sitio y valida estructura, modelos y mapa. No levanta el kit. La suite de laboratorios requiere una máquina con Docker.

## Como copia independiente

Copiá toda esta carpeta o descomprimí el ZIP portable. Todas las rutas de contenido son relativas. La página 404 supone que la raíz del host es la raíz del curso. Si lo servís bajo un prefijo, configurá la página de error del host acorde con ese prefijo.

La publicación externa es un paso separado. Esta entrega crea y verifica artefactos locales; no registra servicios, publica dominios ni envía credenciales. El progreso queda en el navegador y depende del origen desde el que se abre el sitio; cambiar de host no migra automáticamente ese estado.
