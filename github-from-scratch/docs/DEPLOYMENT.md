# Publicación y portabilidad

## Uso local

Abrí `index.html` directamente. No usa CDN, módulos remotos ni solicitudes a un servidor. JavaScript está incluido. Sin JavaScript, cada página ofrece los apuntes completos en texto. El almacenamiento de progreso depende del navegador; al usar archivos locales puede variar su alcance entre navegadores. No hay cuenta de curso ni sincronización de avance.

Para una vista previa con un origen estable, ejecutá `npm run preview` y abrí `http://127.0.0.1:4174/`. Sirve solo en loopback; no expone `.git`, `labs/runs` ni carpetas de pruebas. Detené el proceso cuando no lo necesites.

## Sitio estático

Desde `github-from-scratch`, ejecutá `npm run build` y `npm run check`. Publicá el contenido de `dist/` con cualquier alojamiento estático que respete rutas relativas. No hay backend, credenciales ni pasos de configuración del servicio. El archivo `_headers` contiene las cabeceras para proveedores que reconozcan ese formato; otros hosts necesitan su configuración equivalente.

Como carpeta de Prumathe, usá `github-from-scratch` como directorio de trabajo y `dist` como salida. Para copiar el curso a un repositorio independiente, copiá la carpeta entera. Su workflow `.github/workflows/validate.yml` funciona desde esa raíz; el del repositorio de cursos vive en `/.github/workflows/validate-github.yml`.

El workflow construye, verifica y ejecuta los experimentos con Node.js 22 en Ubuntu. Es configuración para futuras ejecuciones: no constituye evidencia de una ejecución alojada hasta observar su resultado. Los experimentos quedan excluidos del sitio y del ZIP. El directorio `dist/` contiene solo el curso publicado y el kit de actividades.

No se publica ni se crea un repositorio remoto como parte de construir el curso local. La evidencia de despliegue, si se realiza, debe registrar URL, revisión y resultado en `VALIDATION.md`.
