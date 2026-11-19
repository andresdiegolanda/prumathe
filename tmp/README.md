# tmp

Trabajo temporal del repositorio, fuera de Git salvo este archivo (`.gitignore` de la raíz). Acá van los scripts de una sola vez, las pruebas, los registros y las copias para probar algo. Se puede vaciar cuando lo que tiene ya no hace falta, salvo `_obsoleto/`: ahí queda lo que se retira del repositorio, con la fecha en el nombre, y no se borra ([`metodo/arranque.md`](../metodo/arranque.md), "Lo temporal").

- `_obsoleto/`: lo que no se borra.
  - `kafka-from-scratch-qa-2026-10-17/` es la carpeta `.qa/` que el curso tenía al entrar al repositorio (scripts de producción, logs y una copia desactualizada del curso).
  - `logo-revisiones-2026-10-18/` son las seis revisiones del logo del 17 y 18/10/2026 anteriores a la marca vigente de `docs/logo/` (la P con brasero y log, la antorcha con la P en el bowl, la antorcha simétrica y la primera P etrusca).
  - `cloudflare-from-scratch/` es el mapa del curso de Cloudflare (`cloudflare-map.html` y `map.js`), que el panorama reemplazó el 14/11/2026.
  - `entra-zip-snippet.txt` es un escritor de ZIP sin dependencias, guardado el 29/10/2026 al armar el curso de Microsoft Entra.
  - `trabajo-de-tmp-2026-11-19/` es lo que había en `tmp/` cuando se vació el 19/11/2026 y podía ser la única copia de un registro: los registros y los scripts de medición del armado de los cursos de LLMs, Cloudflare y Microsoft Entra y del visor, los dos ZIP con los que se revisaron Docker y Kubernetes y GitHub en su primera versión, con los logs de esa revisión (`review-2026-10-18/`), y los scripts de una sola vez, entre ellos la migración del `curriculum.js` de Kafka (`regenerar-curriculum.mjs` y `curriculum-patches.mjs`).
- `docker-kubernetes-tools/`: `kind.exe` con su checksum, usado por las prácticas de Kubernetes; no está en el PATH del usuario. Si se vacía, se vuelve a bajar.
- `herramientas-node/`: `puppeteer-core`, que usa [`scripts/test-visual.mjs`](../scripts/test-visual.mjs). Se vuelve a instalar con `npm install --prefix tmp/herramientas-node puppeteer-core`.
- `capturas/`: las capturas de la última corrida de `scripts/test-visual.mjs`.
