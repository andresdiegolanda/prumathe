# Aprendizaje

Lo que el proyecto aprendió haciendo cursos y vale para el próximo. No trata de Kafka, de Docker ni de Git, sino de cómo se arma, se valida y se publica un curso de Prumathe. Cada entrada es una regla, con el hecho que la originó y cómo se controla.

## Cuándo se lee

- Antes de proponer el índice de un curso nuevo: todo.
- Antes de agregar una función a un curso (una página, una herramienta, un tipo de práctica): el archivo del tema.
- Antes de una revisión: como lista de lo que ya falló alguna vez.

## Cuándo se actualiza

Cada vez que un trabajo deja algo que habría convenido saber antes: un defecto que encontró una revisión, una corrección, una prueba que falló, una decisión que costó. Se agrega en la misma sesión, en el archivo del tema (o en uno nuevo si no encaja, sumado a la lista de abajo), y se anota en el [`CHANGELOG.md`](../../CHANGELOG.md). Si el aprendizaje se automatiza (un control de `check.mjs`, una suite), la entrada lo dice. Si una entrada deja de valer, no se borra: se marca como superada y se dice por qué.

## Formato de una entrada

```
### La regla, en una línea

Qué hacer, en una o dos oraciones.

Origen: qué pasó, en qué curso y versión, con enlace a la revisión, al CHANGELOG o a VALIDATION.
Control: cómo se verifica (check.mjs, una suite, una pasada de navegador, una revisión).
```

## Archivos

- [`contenido.md`](contenido.md): lecciones, controles, terminología y secuencia.
- [`laboratorios.md`](laboratorios.md): prácticas ejecutables, suites y herramientas en vivo.
- [`interfaz.md`](interfaz.md): lo que se ve en el navegador, cómo se prueba y cómo se publica.
- [`versiones-y-fuentes.md`](versiones-y-fuentes.md): qué se fija, cuándo vence y contra qué se verifica.
- [`proceso.md`](proceso.md): revisión, evidencia, commits y lo que el material no dice.
