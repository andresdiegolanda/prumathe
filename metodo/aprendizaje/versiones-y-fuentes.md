# Versiones y fuentes

Revisiones citadas: [Kafka](../../reviews/2026-10-17-kafka-from-scratch-v1.0.0.md), [Docker y Kubernetes](../../reviews/2026-10-18-docker-kubernetes-from-scratch-v1.0.0.md) y [GitHub](../../reviews/2026-10-18-github-from-scratch-v1.0.0.md), todas sobre la 1.0.0 de cada curso.

### Fijar versiones, sí; fijar algo vencido, no

Al fijar una versión se mira su fin de soporte y cuál es la línea vigente. Si se fija algo que vence pronto, se dice con la fecha.

Origen: Docker y Kubernetes fijaba Kubernetes 1.34, con fin de vida nueve días después de la revisión, y una imagen de Python de catorce meses (§5.1 y §5.2); Kafka usaba Spring Boot 3.5.16, la última versión open source de una línea cuyo soporte open source ya había terminado (§5.2).
Control: en cada revisión, la fecha de fin de soporte de cada versión fijada, con su fuente.

### Lo que el curso dice de un producto vale para su versión, y lo aclara

Si algo cambió después de la versión fijada, la lección lo dice en una frase: lo que vale en la versión del curso y desde cuándo es distinto.

Origen: Kafka enseñaba los share groups como preview, que lo son en 4.1 (la versión del curso), cuando desde 4.2 son production-ready (§5.1).
Control: en cada revisión, las novedades de las versiones posteriores a la fijada.

### Las dependencias de los ejemplos y de los workflows también vencen

Origen: las actions de los workflows y de un ejemplo del curso de GitHub corrían sobre Node 20, ya retirado de los runners (GitHub §4.1, Docker y Kubernetes §5.3).
Control: en cada versión del curso, revisar las versiones de los workflows y de los ejemplos.

### La versión del curso se declara en un lugar y el resto se controla

Un archivo la declara (con la fecha y las versiones de producto) y la interfaz y los apuntes la leen de ahí. Los archivos que no pueden leerla (`package.json`, etiquetas de imagen, `pom.xml`) se controlan con `check.mjs`, y la lista de lugares queda en el `docs/TEACHING.md` del curso.

Origen: en Kafka, la versión y la fecha vivían en cinco lugares escritos a mano (§4.3 y §7.4).
Control: `check.mjs`.

### Cada lección enlaza la fuente que trata su tema

Una fuente por lección, la más afín, y todas las URL abiertas antes de publicar; las redirigidas se reemplazan por su destino.

Origen: lecciones de Docker y Kubernetes enlazadas a páginas que no trataban su tema (§4.13) y una URL redirigida en GitHub (§4.9).
Control: abrir todas las URL de `reference.js` en cada revisión.

### Una decisión técnica sin explicar se explica o se cambia

Origen: en Kafka, compilar para Java 17 dentro de una imagen de Java 21 y los brokers como root, sin una línea que dijera por qué (§5.3 y §4.9).
Control: revisión de lectura de Dockerfile, compose y build.

### Si el framework va una revisión atrás del protocolo, se practica con el framework y se mira la vigente en el cable

Cuando la especificación vigente todavía no está en el framework del público, las prácticas usan la revisión que el framework implementa, lo dicen, y una lección compara las dos en el cable con un servidor que hable la vigente.

Origen: LLMs, RAG y MCP 1.0.0: MCP 2026-07-28 vigente, Spring AI 2.0.1 en 2025-11-25; la lección 21 compara las dos con un servidor del SDK de TypeScript v2.
Control: la lección de revisiones y la revisión de versiones de cada entrega.
