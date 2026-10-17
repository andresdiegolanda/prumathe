# GitHub and Cloudflare Pages / GitHub y Cloudflare Pages

This course is one folder of a repository that holds several courses; the folder is self-contained and can also be copied out and published on its own. The two situations differ only in the root directory you point the tools at.

Este curso es una carpeta de un repositorio que contiene varios cursos; la carpeta es autocontenida y también se puede copiar aparte y publicar sola. Las dos situaciones solo difieren en el directorio raíz que le indicás a las herramientas.

## Validate locally / Verificá localmente

```sh
npm run build
npm run check
npm run preview
```

Open the preview address printed by the last command. Check EN/ES, a skin or two, navigation, a checkpoint and the lab download. The runtime is entirely static; Node is a packaging tool only.

Abrí la dirección que imprime el último comando. Probá EN/ES, alguna apariencia, navegación, un control y la descarga del laboratorio. El sitio es estático; Node solo empaqueta.

## GitHub / GitHub

GitHub runs only the workflows in `.github/workflows/` at the repository root. In the courses repository, that root workflow builds and checks this course with `working-directory: kafka-from-scratch`. The copy in this folder, `.github/workflows/validate.yml`, is the same workflow for a standalone copy of the course: it becomes active only when this folder is itself the repository root. Both build the website, check the bilingual curriculum and links, compile the Java client and the Spring example, and validate Compose. Neither runs the complete Docker suites on every push.

GitHub ejecuta solo los workflows de `.github/workflows/` de la raíz del repositorio. En el repositorio de cursos, ese workflow de la raíz construye y verifica este curso con `working-directory: kafka-from-scratch`. La copia de esta carpeta, `.github/workflows/validate.yml`, es el mismo workflow para una copia independiente del curso: se activa solo cuando esta carpeta es la raíz del repositorio. Los dos construyen el sitio, verifican programa y enlaces, compilan el cliente Java y el ejemplo Spring y validan Compose. Ninguno ejecuta las suites Docker completas en cada push.

To publish a standalone copy / Para publicar una copia independiente:

```sh
git init -b main
git add .
git commit -m "Kafka from scratch"
```

Create an empty GitHub repository, add its URL as `origin` and push `main`.

Creá un repositorio GitHub vacío, agregá su URL como `origin` y subí `main`.

## Cloudflare Pages Git integration / Integración Git

1. In Cloudflare, create a **Pages** project and connect the repository / Creá un proyecto **Pages** y conectá el repositorio.
2. Production branch / Rama productiva: `main`.
3. Framework preset / Framework: **None**.
4. Build command / Comando: `npm run build && npm run check`.
5. Output directory / Directorio de salida: `dist`.
6. Root directory / Raíz: `kafka-from-scratch` in the courses repository; blank for a standalone copy / `kafka-from-scratch` en el repositorio de cursos; vacío para una copia independiente.
7. Set `NODE_VERSION` to `22` if the build environment needs an explicit version / Fijá `NODE_VERSION=22` si hace falta.
8. Deploy, then test the returned URL, a direct lesson URL, a skin via `?theme=dark` and `downloads/kafka-labs.zip` / Publicá y probá la URL, una lección directa, una apariencia con `?theme=dark` y la descarga.

Pages serves the static site. Docker labs run on the learner's computer; they do not run inside Cloudflare. No credentials, environment secrets, database or paid server are required for the website. `_headers` adds the content security policy and download behavior. No SPA catch-all rewrite is needed because every lesson has a real HTML file; `404.html` is self-contained and links to the site root.

Pages sirve el sitio estático. Los laboratorios Docker corren en la computadora del estudiante, no en Cloudflare. El sitio no necesita credenciales, secretos, base de datos ni servidor pago. `_headers` agrega política de contenido y comportamiento de descargas. No hace falta una reescritura general de SPA: cada lección tiene su HTML real; `404.html` es autocontenida y enlaza a la raíz del sitio.

## Direct Upload alternative / Alternativa de carga directa

Run the build and checks, then upload the contents of `dist/` using Cloudflare Pages Direct Upload. Choose Git integration at creation if you want future automatic Git deployments; Cloudflare distinguishes project creation methods.

Ejecutá build y checks y cargá el contenido de `dist/` mediante Direct Upload. Si querés despliegues automáticos futuros desde Git, elegí integración Git al crear el proyecto; Cloudflare distingue esos métodos de creación.

Official references checked 15 October 2026 / Referencias oficiales verificadas el 15 de octubre de 2026:

- [Static HTML on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)

## Release checklist / Antes de publicar

- Rebuild after editing curriculum, lab source, configuration or README / Reconstruí después de editar.
- Run `npm run check` and rebuild the lab image if Java or Compose changed / Verificá y reconstruí la imagen si cambió Java o Compose.
- Run relevant integration suites from the root: `node scripts/test-labs.mjs core`, `failures`, `integrations`, `spring` / Ejecutá las suites relevantes.
- Read `docs/VALIDATION.md`; do not label unexecuted tests as passed / No marques como aprobadas pruebas sin ejecutar.
- Keep compiled targets, caches and credentials out of the repository / Dejá fuera binarios, cachés y credenciales.
