# Evidencia de validación

## Versión 1.3.0, 18/10/2026

Una discusión por lección (GitHub Discussions a través de giscus) al final de la pestaña Profundizá, cargada solo a pedido en el sitio publicado; configuración en `assets/forum.js`, CSP en `_headers`. Experimentos, lecciones y requisitos sin cambios respecto de la 1.2.0, así que su evidencia sigue valiendo. Ejecutado: `npm run build` y `npm run check` con los controles nuevos del foro (configuración, `forum.js` en las páginas, CSP que permite giscus); la tarjeta y el enlace alternativo renderizados en los dos idiomas en un navegador sin interfaz, sin errores de consola, y con una configuración de prueba el botón genera el elemento `script` de giscus con el término `github-from-scratch/<slug>`. No ejecutado: el widget incrustado en sí, que necesita el repositorio público, la app de giscus y los identificadores de categoría; hasta que existan, el botón muestra el enlace a la página de Discussions.

## Versión 1.2.0, 18/10/2026

Página nueva "Qué son Git y GitHub" (`what-git-and-github-are.html`, texto en `assets/about.js`), fuera de la numeración de lecciones; experimentos, lecciones y requisitos sin cambios respecto de la 1.1.0, así que su evidencia sigue valiendo. Ejecutado: `npm run build` y `npm run check` con los controles nuevos de la página (cadenas bilingües, seis hitos, tres columnas, fuentes https, página generada y publicada en `dist/`); la página renderizada en un navegador sin interfaz en los dos idiomas, en las cuatro apariencias y a 390 px, sin errores de consola ni desborde horizontal; las fuentes oficiales listadas al pie abiertas y contrastadas en la fecha indicada. No ejecutado: nada nuevo en una cuenta de GitHub.

## Versión 1.1.0, 18/10/2026

Correcciones de la revisión del 18 de octubre de 2026 (carpeta `reviews/` del repositorio de cursos) aplicadas: actions de ejemplo y workflows a v7, mínimo declarado de Git 2.32, textos de las actividades de las lecciones 10, 16 y 19, terminología en español, página 404 propia y controles nuevos en `scripts/check.mjs`.

`npm run build`, `npm run check` y `node labs/lab.mjs all` ejecutados sobre la 1.1.0 en dos plataformas: Windows con PowerShell 5.1, Git 2.51.0.windows.1 y Node v24.11.0, y Linux con Git 2.43.0 y Node v22.22.0. En las dos: 20 páginas construidas, `check` en PASS con sus controles nuevos y 14 experimentos con 41 aserciones aprobadas. Las 42 páginas (portada y lecciones, ambos idiomas) se renderizaron además en un navegador sin interfaz a 1280 px sin errores de consola ni desborde horizontal. Las secciones siguientes describen la 1.0.0 y siguen valiendo para la 1.1.0 en lo que no cambió.

## Versión 1.0.0, 18/10/2026

Plataforma ejecutada: Windows, PowerShell, Git `2.51.0.windows.1`, Node.js `v24.11.0`. Base mínima declarada del kit: Git 2.28 y Node.js 22. Esas versiones mínimas y Linux/macOS no se ejecutaron en esta validación. GitHub se trata como servicio y sus funciones se contrastaron con documentación oficial en la fecha indicada.

| Verificación | Evidencia | Resultado |
| --- | --- | --- |
| Construcción estática | `node scripts/build.mjs` | 20 páginas de lección, portada, dos apuntes, ZIP y `dist/` |
| Contenido y artefactos | `node scripts/check.mjs` | 20 lecciones, 60 escenas, 60 preguntas, 80 pasos, 37 términos; 1584 renderizaciones con controles, ambos idiomas y cuatro apariencias; enlaces locales, sintaxis, versiones y exclusión de ejecuciones del ZIP |
| Experimentos reales | `node labs/lab.mjs all` | 14 experimentos, 41 aserciones aprobadas; [resultado registrado](lab-results.txt) |
| Prueba del ejemplo de Actions, local | Dos ejecuciones de `hours.test.mjs` desde `check` | README con 09:00 falla; con 10:00 pasa. No es una ejecución alojada de Actions |
| Portabilidad del kit | ZIP extraído en una carpeta nueva; `node labs/lab.mjs staging` desde esa copia | 3 aserciones aprobadas sin depender de archivos del curso |

Los escenarios ejecutados prueban instantáneas anteriores, preparación distinta del archivo de trabajo, movimiento de ramas, fast-forward, merge con dos padres, conflicto y resolución, referencia remota desactualizada, fetch sin integración, rechazo de push divergente, topología de copias, igualdad de árboles con distintas historias, revert frente a soft reset, estabilidad del tag y persistencia histórica de un marcador ficticio eliminado.

La ejecución usa carpetas nuevas dentro de `labs/runs/`, configuración aislada y solo protocolo de archivos. No se accedió a remotos del usuario ni a cuentas GitHub. Las salidas completas permanecen como material temporal de trabajo; el resumen de aserciones se conserva en este documento enlazado.

## Interfaz en navegador

Se recorrieron las veinte páginas en los dos idiomas y las cuatro apariencias. Se verificaron portada, modelo de preparación, control oscuro, vista Lectura, cambio del modelo con teclado, inspección de objetos con Enter, cambio de idioma conservando el paso, comando plegado y desplegado, respuesta incorrecta seguida de corrección y búsqueda del glosario con enlace a la lección, sin errores ni advertencias en la consola. Se comprobaron rutas relativas, scripts locales y funcionamiento servido en loopback; la apertura directa por `file://` no se probó. La vista estrecha se revisó a unos 800 px de ancho. No equivale a una matriz de dispositivos ni a una auditoría de accesibilidad.

## Revisión de fuentes

Se consultaron GitHub Docs, el libro Pro Git y manuales oficiales de Git. El mapa por lección vive en [`assets/reference.js`](../assets/reference.js), incluidas las referencias complementarias. Se contrastaron en especial: Git y GitHub, index, ramas, integración y conflictos, remotos, fetch/pull, forks, issues, PR, estrategias de integración, revisiones y autoaprobación, Actions, rulesets, releases y tratamiento de datos sensibles.

El ejemplo usa `actions/checkout@v7` y `actions/setup-node@v7`, con Node 22 para la prueba; se revisaron sus [instrucciones oficiales de checkout](https://github.com/actions/checkout/blob/v7/README.md) y [setup-node](https://github.com/actions/setup-node/blob/v7/README.md). Son etiquetas de versión mayor, no fijaciones a un SHA inmutable. El ejemplo enseña el flujo; no se presenta como una plantilla de endurecimiento de producción.

## Límites

No se ejecutaron las seis actividades en una cuenta GitHub: creación de issue y PR, revisión de otra persona, Actions alojado, reglas y entrega integradora. Sus pasos están contrastados con fuentes y ofrecen alternativa de caso de estudio. Tampoco se publicó el curso ni se verificaron planes de cuenta, navegadores móviles reales o lector de pantalla. No hay mediciones de tiempo con estudiantes. Esos límites no se sustituyen con modelos ni resultados locales.
