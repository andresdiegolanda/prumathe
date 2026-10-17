# tmp

Trabajo interno del repositorio, fuera de Git salvo este archivo (`.gitignore` de la raíz). Acá van los scripts de una sola vez, las pruebas y lo que sobra: nada se borra, lo que deja de servir se mueve a `_obsoleto/` con la fecha en el nombre.

- `_obsoleto/`: material retirado. `kafka-from-scratch-qa-2026-10-17/` es la carpeta `.qa/` que el curso tenía al entrar al repositorio (scripts de producción, logs y una copia desactualizada del curso). `logo-revisiones-2026-10-18/` son las seis revisiones del logo del 17 y 18/10/2026 anteriores a la marca vigente de `docs/logo/` (la P con brasero y log, la antorcha con la P en el bowl, la antorcha simétrica y la primera P etrusca).
- `regenerar-curriculum.mjs` y `curriculum-patches.mjs`: la migración de `kafka-from-scratch/assets/curriculum.js` a la versión 1.1 (tres preguntas por lección, correcciones de texto, formato de un campo por línea). Ya aplicada; se conserva como registro de qué cambió y cómo.
