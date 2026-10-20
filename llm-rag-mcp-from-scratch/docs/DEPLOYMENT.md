# Distribuir el curso

El sitio es HTML, CSS y JavaScript local sin backend, fuentes remotas, analítica ni secretos. No necesita Node.js para cursar. Abrí `index.html` directamente o serví la carpeta con un servidor estático. Conservá la estructura de directorios.

## Construcción

Con Node.js 18 o superior, desde la carpeta del curso:

```text
npm run build
npm run check
npm run release
```

`dist/` contiene el sitio estático (portada, página de presentación, lecciones, assets, apuntes, 404 y `_headers`) y las fuentes públicas de los laboratorios; no incluye `docs/` ni este README. La discusión de cada lección es el único contenido de terceros: giscus (giscus.app) sobre GitHub Discussions, cargado a pedido, permitido por `_headers` en `script-src` y `frame-src`; el repositorio tiene que ser público con Discussions activado y la app de giscus instalada, y `assets/forum.js` guarda los identificadores (ver TEACHING). `release/llm-rag-mcp-from-scratch.zip` contiene la carpeta portable completa. `release/cloudflare-pages.zip` contiene solo el sitio listo para un host estático. `downloads/llm-rag-mcp-labs.zip` contiene la carpeta `labs/` y sus instrucciones. Los ZIP excluyen `labs/.env`, la evidencia local y la salida de compilación; los modelos no viajan en ningún ZIP: el kit los descarga de su origen y verifica su SHA256.

## Como carpeta de Prumathe

Configurá el directorio raíz del build como `llm-rag-mcp-from-scratch`, el comando como `npm run build` y la salida como `dist`. Si la plataforma construye desde la raíz del repositorio, ejecutá `npm --prefix llm-rag-mcp-from-scratch run build` y elegí `llm-rag-mcp-from-scratch/dist`.

El workflow de validación de la raíz construye el sitio y valida estructura y modelos. No publica ni ejecuta modelos. Las suites de laboratorios requieren una máquina con Docker, la memoria y el disco que indica el kit.

## Como copia independiente

Copiá toda esta carpeta o descomprimí el ZIP portable. Todas las rutas de contenido son relativas. La página 404 supone que la raíz del host es la raíz del curso. Si lo servís bajo un prefijo, configurá la página de error del host acorde con ese prefijo.

La publicación externa es un paso separado. Esta entrega crea y verifica artefactos locales; no registra servicios, publica dominios ni envía credenciales. El progreso queda en el navegador y depende del origen desde el que se abre el sitio; cambiar de host no migra automáticamente ese estado.
