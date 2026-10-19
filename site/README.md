# Prumathe home page / Portada de Prumathe

The pages that present Prumathe and link to the courses: what the project is, how a course works, the three courses with their entry points, and where the name comes from. One page in **English and Rioplatense Spanish** (switch at the top), light and dark appearance, no server, account, framework or external resource. Open [index.html](index.html) directly from the repository: the course links point to the sibling folders.

Las páginas que presentan Prumathe y enlazan a los cursos: qué es el proyecto, cómo funciona un curso, los tres cursos con sus puntos de entrada y de dónde viene el nombre. Una página en **inglés y español rioplatense** (selector arriba), apariencia clara y oscura, sin servidor, cuenta, framework ni recursos externos. Abrí [index.html](index.html) directamente desde el repositorio: los enlaces a los cursos apuntan a las carpetas vecinas.

## Files / Archivos

- `index.html`, `assets/site.js`, `assets/site.css`, `assets/theme.js`: the page, its bilingual text and its styles, with the courses' palette and type. / La página, su texto bilingüe y sus estilos, con la paleta y la tipografía de los cursos.
- `assets/favicon.svg`: the Prumathe mark, as in the courses. / La marca de Prumathe, como en los cursos.
- `404.html`, `_headers`: error page and headers for a static host; the CSP allows giscus, which shows the discussion of each lesson. / Página de error y cabeceras para un host estático; la CSP permite giscus, que muestra la discusión de cada lección.
- `scripts/build.mjs`: assembles the complete publishable site in `dist/` (ignored by Git). / Arma el sitio publicable completo en `dist/` (fuera de Git).

## Publish / Publicar

`node site/scripts/build.mjs`, from the repository root, builds every course folder that has a `scripts/build.mjs` and writes `site/dist/`: this home page at the root and each course under its own name (`kafka-from-scratch/`, `docker-kubernetes-from-scratch/`, `github-from-scratch/`), with one `_headers` file for the whole site. On Cloudflare it is published as a Worker with static assets and no Worker code: the `wrangler.jsonc` at the repository root points to `site/dist` and serves `404.html` for unknown paths; in the dashboard, connect the repository with `node site/scripts/build.mjs` as build command and `npx wrangler deploy` as deploy command (Pages, the older product, would take the same build with `site/dist` as output directory). The site is published at https://prumathe.com, a domain associated with the Worker in the Cloudflare dashboard (not in `wrangler.jsonc`); it also answers at https://prumathe.andresdiegolanda.workers.dev. A new course only needs its folder beside this one.

`node site/scripts/build.mjs`, desde la raíz del repositorio, construye cada carpeta de curso que tenga `scripts/build.mjs` y escribe `site/dist/`: esta portada en la raíz y cada curso bajo su nombre (`kafka-from-scratch/`, `docker-kubernetes-from-scratch/`, `github-from-scratch/`), con un solo `_headers` para todo el sitio. En Cloudflare se publica como un Worker con archivos estáticos y sin código de Worker: el `wrangler.jsonc` de la raíz del repositorio apunta a `site/dist` y sirve `404.html` para las rutas desconocidas; en el panel, conectá el repositorio con `node site/scripts/build.mjs` como comando de build y `npx wrangler deploy` como comando de deploy (Pages, el producto anterior, tomaría el mismo build con `site/dist` como directorio de salida). El sitio está publicado en https://prumathe.com, un dominio asociado al Worker en el panel de Cloudflare (no en `wrangler.jsonc`); también responde en https://prumathe.andresdiegolanda.workers.dev. Un curso nuevo solo necesita su carpeta al lado de esta.

The course links carry the chosen language (`?lang=en` or `?lang=es`); each course keeps its own appearance and progress. The text of the cards (lesson and lab counts, requirements) is maintained by hand in `assets/site.js` when a course changes.

Los enlaces a los cursos llevan el idioma elegido (`?lang=en` o `?lang=es`); cada curso conserva su propia apariencia y su avance. El texto de las tarjetas (cantidad de lecciones y pasos, requisitos) se mantiene a mano en `assets/site.js` cuando un curso cambia.
