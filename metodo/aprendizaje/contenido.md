# Contenido y didáctica

Revisiones citadas: [Kafka](../../reviews/2026-10-17-kafka-from-scratch-v1.0.0.md), [Docker y Kubernetes](../../reviews/2026-10-18-docker-kubernetes-from-scratch-v1.0.0.md) y [GitHub](../../reviews/2026-10-18-github-from-scratch-v1.0.0.md), todas sobre la 1.0.0 de cada curso.

### Cada lección repite el mismo ciclo y cada escena nombra su límite

Modelo, predicción, experimento real, explicación y control, igual en todas las lecciones, para que quien cursa sepa qué hacer sin instrucciones nuevas. Cada escena cierra con una regla que dice qué no implica lo que se vio ("aceptación de API no es convergencia", "readiness no es liveness").

Origen: las tres revisiones lo señalan como lo que sostiene a cada curso (Kafka §1, Docker y Kubernetes §6.1, GitHub §6.1).
Control: revisión de lectura.

### Una lección 00 separa la puesta a punto del primer concepto

La 00 presenta el método y deja la máquina lista sin crear nada de práctica; la 01 ya enseña. El avance guardado se indexa por slug, no por posición, para que insertar una lección no reasigne el progreso de nadie.

Origen: Kafka 1.2.0 agregó la 00 después de publicado y tuvo que migrar las claves numéricas del avance a slugs y desplazar los 46 índices del glosario ([CHANGELOG](../../CHANGELOG.md), 2026-10-18).
Control: `check.mjs` verifica la unidad de cada lección y la numeración generada; después de insertar una lección, revisar los índices del glosario.

### Una página "Qué es" de cinco minutos, fuera de la numeración

Qué es, de dónde salió (línea de tiempo con fechas contrastadas), dónde encaja según la documentación oficial, dónde no según el criterio del curso (dicho como criterio), cinco preguntas para decidir y las fuentes. Se llega desde la portada, la ayuda y la lección 00, y abre los apuntes.

Origen: Kafka 1.3.0; Docker y Kubernetes 1.2.0 y GitHub 1.2.0 repitieron el patrón.
Control: `check.mjs` exige cada cadena en los dos idiomas, los hitos, las columnas de la tabla y fuentes https.

### Tres preguntas por lección, con distractores que son errores reales

La primera nombra la distinción central; las otras dos la prueban desde otro ángulo (una configuración, una falla, un número). Un distractor tiene que poder defenderlo alguien que leyó mal la lección, nunca un chiste. La explicación aparece acierte o no.

Origen: Kafka tenía un control por lección y distractores que no distraían, como "From the browser cache"; con dos opciones reales la recuperación es casi nula (Kafka §6.2).
Control: revisión de lectura de cada distractor.

### La posición de la respuesta correcta no sigue un patrón

Ni fija ni rotando: una rotación se descubre y se responde sin leer.

Origen: Docker y Kubernetes rotaba la respuesta correcta con período tres en las 25 lecciones (§4.10).
Control: el `check.mjs` de Docker y Kubernetes rechaza un patrón; llevar ese control a cada curso nuevo.

### Un concepto, un nombre, en todo el curso

Cada concepto tiene un solo nombre en español desde la primera lección hasta el glosario. Si en la práctica se dice en inglés (merge, fetch, readiness, tag, label, scheduling, healthy), queda en inglés. Nunca la misma palabra en español para dos conceptos.

Origen: "etiqueta" para tag y para label, "disponibilidad" para readiness y availability, "integrar" y "merge" alternando a mitad del curso (Docker y Kubernetes §4.11, GitHub §4.5 y §4.6).
Control: el glosario se arma antes que las lecciones, y cada término se revisa contra él.

### Los nombres del código no se traducen

Eventos, propiedades, clases y salidas quedan como los imprime la herramienta, también en español.

Origen: la lección 02 de Kafka en español traducía `OrderPlaced` mientras el laboratorio lo imprimía en inglés (Kafka §4.4).
Control: revisión de lectura contra las salidas del laboratorio.

### Lo esperado tiene que verse en la salida real

Cada paso dice qué va a observar quien cursa, y eso tiene que estar en lo que el comando imprime, no en lo que hace por dentro.

Origen: un caso en cada curso: un `<null>` que el comando no imprime (Kafka §4.1), un servicio que `docker compose config` omite por su perfil (Docker y Kubernetes §4.6), un README con 09:00 que ninguna actividad había creado (GitHub §4.3).
Control: la suite compara cada salida esperada con la real; lo que no se puede comparar se ejecuta a mano y se mira.

### Las actividades encadenadas se recorren enteras y en orden

Si una actividad depende del estado que dejó otra, se recorre la cadena completa: un paso no puede pedir observar algo que otro ya resolvió, y lo que una lección deja abierto se cierra en alguna.

Origen: GitHub pedía ver un bloqueo en un PR que la lección anterior dejaba en verde, y acumulaba PR abiertos sobre la misma línea (§4.4 y §6.5).
Control: un recorrido completo, en orden, antes de publicar.

### Ningún concepto se usa antes de presentarlo

Origen: Docker y Kubernetes usaba el Service una lección antes de presentarlo (§6.4).
Control: revisión de lectura en orden.

### Cada práctica deja evidencia nueva y cierra lo que abre

Una práctica que repite la demostración de otra no agrega nada; un objeto que se crea se usa y se observa.

Origen: Docker y Kubernetes repetía en imágenes la demostración de la lección 01 y en la integradora la de la 16, y creaba un Secret que ningún Pod consumía (§6.2 y §6.3).
Control: revisión de lectura de las prácticas, una contra otra.

### Cuando un laboratorio se aparta de lo que enseña, lo dice

Si una práctica desactiva algo que el curso recomienda, o elige una configuración distinta, el texto del paso explica por qué; esa razón suele ser contenido en sí misma.

Origen: Kafka desactivaba la idempotencia en la lección de ACL sin decirlo, mientras otras lecciones enseñaban a dejarla activada (§6.8).
Control: revisión de lectura del código del laboratorio contra el texto.

### La integradora es una revisión de un sistema, no un comando exitoso

Pide justificar decisiones con la salida como prueba: qué se eligió, qué límite tiene, qué pasa con los efectos externos.

Origen: la integradora de Kafka (su `docs/TEACHING.md`) y la de Docker y Kubernetes, que repetía una práctica en vez de pedir evidencia nueva (§6.2).
Control: rúbrica de la integradora.

### Lo que requiere una cuenta tiene alternativa, y la evidencia se distingue

Tres clases de evidencia, separadas en el texto: modelo ilustrativo, experimento local con aserciones, y actividad en el servicio (con un caso de estudio si no hay cuenta o función). El avance es una declaración de quien cursa, no una detección.

Origen: GitHub 1.0.0, donde seis actividades dependen de una cuenta y de su plan (§6.1 y su `docs/TEACHING.md`).
Control: revisión de lectura; nada se presenta como ejecutado sin aserción.

### No se publican tiempos estimados sin medirlos

Origen: criterio del curso de GitHub; la medición de tiempos por lección sigue como card del [`tablero.md`](../../tablero.md).
Control: revisión de lectura.
