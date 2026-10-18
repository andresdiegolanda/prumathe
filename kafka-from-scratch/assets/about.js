/* The "What Kafka is" page: what it is, where it came from, where it fits and where it does
   not. Read once, before lesson 00. Bilingual like the curriculum; scripts/build.mjs puts it
   in what-kafka-is.html and in the course notes, scripts/check.mjs verifies it. Product facts
   come from the sources listed at the end; the "where it does not fit" part is the course's
   own judgment and says so. */
window.KAFKA_ABOUT = (() => {
  const B = (en, es) => ({ en, es });
  return {
    eyebrow: B('A FIVE MINUTE READ', 'CINCO MINUTOS DE LECTURA'),
    title: B('What Kafka is', 'Qué es Kafka'),
    lead: B(
      'What it is, where it came from, where it fits and where it does not. Read it once; the lessons do the rest.',
      'Qué es, de dónde salió, dónde encaja y dónde no. Se lee una vez; el resto lo hacen las lecciones.',
    ),
    what: {
      title: B('A log that many read at their own pace', 'Un log que muchos leen a su ritmo'),
      text: [
        B(
          'Kafka is an event streaming platform: a service that stores events in order, keeps them for as long as you decide, and lets any number of programs read them, each at its own pace. The unit is the record: a key, a value and a timestamp, appended to a partition of a topic and never modified.',
          'Kafka es una plataforma de event streaming: un servicio que guarda eventos en orden, los conserva el tiempo que decidas y deja que cualquier cantidad de programas los lea, cada uno a su ritmo. La unidad es el registro: una clave, un valor y una marca de tiempo, agregados al final de una partición de un tópico y nunca modificados.',
        ),
        B(
          'That is the difference from a queue. In a queue a message is consumed and disappears; in Kafka reading moves a bookmark, the offset, and the event stays. Two teams can read the same history for different reasons, a new system can start from the beginning, and a bug can be fixed by reprocessing.',
          'Esa es la diferencia con una cola. En una cola el mensaje se consume y desaparece; en Kafka leer mueve un señalador, el offset, y el evento queda. Dos equipos pueden leer la misma historia por motivos distintos, un sistema nuevo puede empezar desde el principio y un error se corrige reprocesando.',
        ),
      ],
      rule: B('A message is consumed; an event is read.', 'Un mensaje se consume; un evento se lee.'),
      modelNote: B(
        'The model from lesson 02. Select a shape to inspect it; the arrows read, the log keeps.',
        'El modelo de la lección 02. Seleccioná una figura para inspeccionarla; las flechas leen, el log conserva.',
      ),
    },
    origin: {
      title: B('Where it came from', 'De dónde salió'),
      text: [
        B(
          'Kafka was built at LinkedIn to absorb the stream of activity events from its website, page views and searches among them, which the message brokers of the time could not take at that volume without slowing down or losing the ability to scale out. The design bet was to put the ordered, append-only log at the center of the architecture instead of connecting every system to every other one.',
          'Kafka nació en LinkedIn para absorber el flujo de eventos de actividad de su sitio, vistas de página y búsquedas entre otros, que los brokers de mensajes de la época no soportaban a ese volumen sin frenarse ni perder la capacidad de crecer en horizontal. La apuesta de diseño fue poner el log ordenado, de solo agregar, en el centro de la arquitectura, en lugar de conectar cada sistema con todos los demás.',
        ),
        B(
          'LinkedIn released it as open source in January 2011; it entered the Apache Incubator in July 2011 and became a top level Apache project in October 2012. Its creators, Jay Kreps, Neha Narkhede and Jun Rao, later founded Confluent, the company built around it. Since then the changes that matter most to how it is used are the ones on the timeline.',
          'LinkedIn lo liberó como open source en enero de 2011; entró a la incubadora de Apache en julio de 2011 y fue proyecto Apache de primer nivel en octubre de 2012. Sus creadores, Jay Kreps, Neha Narkhede y Jun Rao, fundaron después Confluent, la empresa construida alrededor de Kafka. Desde entonces, los cambios que más pesan en cómo se usa son los de la línea de tiempo.',
        ),
      ],
      timeline: [
        {
          year: '2011',
          label: B('Open source', 'Open source'),
          text: B(
            'LinkedIn publishes Kafka in January; Apache Incubator in July.',
            'LinkedIn publica Kafka en enero; incubadora de Apache en julio.',
          ),
        },
        {
          year: '2012',
          label: B('Apache project', 'Proyecto Apache'),
          text: B('Top level project since October.', 'Proyecto de primer nivel desde octubre.'),
        },
        {
          year: '2017',
          label: B('Transactions', 'Transacciones'),
          text: B(
            'Version 0.11: idempotent producer and transactions, the basis of exactly once processing.',
            'Versión 0.11: productor idempotente y transacciones, la base del procesamiento exactly once.',
          ),
        },
        {
          year: '2022',
          label: B('KRaft', 'KRaft'),
          text: B(
            'Version 3.3 marks KRaft, the metadata quorum without ZooKeeper, as production ready.',
            'La versión 3.3 marca KRaft, el quórum de metadatos sin ZooKeeper, como production ready.',
          ),
        },
        {
          year: '2025',
          label: B('Kafka 4.0', 'Kafka 4.0'),
          text: B(
            'First major release without ZooKeeper; the new consumer rebalance protocol is generally available; early access to queues (share groups).',
            'Primera versión mayor sin ZooKeeper; el nuevo protocolo de rebalanceo de consumidores queda disponible en general; acceso anticipado a las colas (share groups).',
          ),
        },
        {
          year: '2026',
          label: B('Share groups', 'Share groups'),
          text: B(
            'Version 4.2 makes share groups production ready: acquisition and acknowledgment per record, the queue pattern inside Kafka.',
            'La versión 4.2 deja los share groups production ready: adquisición y confirmación por registro, el patrón de cola dentro de Kafka.',
          ),
        },
      ],
    },
    fits: {
      title: B('Where it fits', 'Dónde encaja'),
      intro: B(
        'The official documentation lists its use cases. These are the ones you will meet in event driven systems and enterprise integration.',
        'La documentación oficial enumera sus casos de uso. Estos son los que vas a encontrar en sistemas orientados a eventos e integración empresarial.',
      ),
      items: [
        {
          title: B('Integration between systems that must not know each other', 'Integración entre sistemas que no deben conocerse'),
          text: B(
            'A producer publishes a fact once; any number of consumers subscribe, today or next year, without the producer changing.',
            'Un productor publica un hecho una vez; cualquier cantidad de consumidores se suscribe, hoy o el año que viene, sin que el productor cambie.',
          ),
        },
        {
          title: B('Replayable history', 'Historia reproducible'),
          text: B(
            'Reprocess after a bug, audit what happened and in what order, feed a new system with the past.',
            'Reprocesar después de un error, auditar qué pasó y en qué orden, alimentar un sistema nuevo con el pasado.',
          ),
        },
        {
          title: B('High volume ingestion', 'Ingesta de alto volumen'),
          text: B(
            'Activity tracking, metrics and log aggregation: many writers, sustained throughput, consumers that fall behind without losing data.',
            'Seguimiento de actividad, métricas y agregación de logs: muchos escritores, caudal sostenido, consumidores que se atrasan sin perder datos.',
          ),
        },
        {
          title: B('Change data capture and outbox', 'Captura de cambios y outbox'),
          text: B(
            'Turn database changes into events other systems can react to, with the atomicity the business change needs.',
            'Convertir cambios de una base en eventos a los que otros sistemas reaccionan, con la atomicidad que el cambio de negocio necesita.',
          ),
        },
        {
          title: B('Stream processing', 'Procesamiento de flujos'),
          text: B(
            'Transform, join and aggregate events as they arrive, with state that survives restarts (Kafka Streams).',
            'Transformar, unir y agregar eventos a medida que llegan, con estado que sobrevive a los reinicios (Kafka Streams).',
          ),
        },
        {
          title: B('Event sourcing and commit log', 'Event sourcing y log de confirmación'),
          text: B(
            'Record state changes as an ordered sequence of events and rebuild state from it; replicate state between the nodes of a distributed system.',
            'Registrar los cambios de estado como una secuencia ordenada de eventos y reconstruir el estado desde ahí; replicar estado entre los nodos de un sistema distribuido.',
          ),
        },
      ],
    },
    misfits: {
      title: B('Where it does not fit', 'Dónde no encaja'),
      intro: B(
        'This part is the course’s judgment, not official documentation. Each row says what to use instead.',
        'Esta parte es criterio del curso, no documentación oficial. Cada fila dice qué usar en su lugar.',
      ),
      headers: [B('The case', 'El caso'), B('Why not', 'Por qué no'), B('Use instead', 'Usá en su lugar')],
      items: [
        {
          title: B('Request and response', 'Petición y respuesta'),
          why: B(
            'A caller that needs an answer now gains nothing from a durable log in between and pays with latency and complexity.',
            'Quien necesita una respuesta ahora no gana nada con un log durable en el medio y paga con latencia y complejidad.',
          ),
          instead: B('An HTTP or gRPC API.', 'Una API HTTP o gRPC.'),
        },
        {
          title: B('Task queues with priorities, delays or per message discard', 'Colas de tareas con prioridades, retrasos o descarte por mensaje'),
          why: B(
            'A partition is an ordered log: no priority, no scheduled delivery, no deleting one message. Share groups add acknowledgment per record, not priority or delay.',
            'Una partición es un log ordenado: sin prioridad, sin entrega programada, sin borrar un mensaje. Los share groups agregan confirmación por registro, no prioridad ni retraso.',
          ),
          instead: B(
            'A task queue such as RabbitMQ or SQS, or a table with a worker.',
            'Una cola de tareas como RabbitMQ o SQS, o una tabla con un worker.',
          ),
        },
        {
          title: B('A database to query', 'Una base de datos para consultar'),
          why: B(
            'Kafka stores and delivers; it does not search, index or answer “what is the current value of x” without a consumer that builds that view.',
            'Kafka guarda y entrega; no busca, no indexa ni responde «cuál es el valor actual de x» sin un consumidor que arme esa vista.',
          ),
          instead: B(
            'A relational or document database, fed from Kafka if you want.',
            'Una base relacional o de documentos, alimentada desde Kafka si querés.',
          ),
        },
        {
          title: B('Large payloads', 'Contenidos grandes'),
          why: B(
            'Images, PDFs and videos inflate the log and the network for every consumer; the default record limit is about 1 MB for a reason.',
            'Imágenes, PDF y videos inflan el log y la red para cada consumidor; el límite por defecto de un registro ronda 1 MB por algo.',
          ),
          instead: B(
            'Object storage for the bytes and an event with the reference.',
            'Almacenamiento de objetos para los bytes y un evento con la referencia.',
          ),
        },
        {
          title: B('Global order across different keys', 'Orden global entre claves distintas'),
          why: B(
            'Order is guaranteed within a partition. One partition gives global order and no parallelism; several give parallelism and order per key only.',
            'El orden se garantiza dentro de una partición. Una sola partición da orden global y nada de paralelismo; varias dan paralelismo y orden solo por clave.',
          ),
          instead: B(
            'Design around keys, or a single writer with a sequence number if the volume allows it.',
            'Diseñar alrededor de las claves, o un único escritor con un número de secuencia si el volumen lo permite.',
          ),
        },
        {
          title: B('A small system', 'Un sistema chico'),
          why: B(
            'Two services and a few thousand events a day do not pay for a cluster that someone has to operate, upgrade and watch.',
            'Dos servicios y unos miles de eventos por día no pagan un clúster que alguien tiene que operar, actualizar y vigilar.',
          ),
          instead: B(
            'A table, a transactional outbox or the queue your cloud already gives you; Kafka later, if the volume or the number of consumers grows.',
            'Una tabla, un outbox transaccional o la cola que ya te da tu nube; Kafka después, si crece el volumen o la cantidad de consumidores.',
          ),
        },
      ],
    },
    decide: {
      title: B('How to decide', 'Cómo decidir'),
      questions: [
        B('Will more than one consumer need the same fact, now or later?', '¿Más de un consumidor va a necesitar el mismo hecho, ahora o después?'),
        B('Will you need to go back: replay, audit, rebuild?', '¿Vas a necesitar volver atrás: reprocesar, auditar, reconstruir?'),
        B('Does order per key matter?', '¿Importa el orden por clave?'),
        B('Does the volume, or the number of producers and consumers, justify a cluster?', '¿El volumen, o la cantidad de productores y consumidores, justifica un clúster?'),
        B('Who will operate it, and do they know it will not run itself?', '¿Quién lo va a operar, y sabe que no se opera solo?'),
      ],
      closing: B(
        'Three yes answers and you are in the right place. Lesson 00 shows how the course works and leaves Docker ready.',
        'Tres síes y estás en el lugar correcto. La lección 00 muestra cómo funciona el curso y deja Docker listo.',
      ),
      start: B('Start with lesson 00', 'Empezá por la lección 00'),
      back: B('Back to the course', 'Volver al inicio'),
    },
    sources: {
      title: B('Sources', 'Fuentes'),
      intro: B('Official pages, checked on', 'Páginas oficiales, contrastadas el'),
      items: [
        ['Apache Kafka · Introduction', 'https://kafka.apache.org/intro'],
        ['Apache Kafka · Use cases', 'https://kafka.apache.org/uses'],
        ['LinkedIn · Open-sourcing Kafka (January 2011)', 'https://blog.linkedin.com/2011/01/11/open-source-linkedin-kafka'],
        ['Apache Incubator · Kafka (July 2011 to October 2012)', 'https://incubator.apache.org/projects/kafka.html'],
        ['LinkedIn Engineering · The Log (December 2013)', 'https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying'],
        ['Apache Kafka · Downloads and release notes (3.3.1, 4.0.0)', 'https://kafka.apache.org/community/downloads/'],
        ['Apache · Release registry, Kafka 0.11.0.0 (June 2017)', 'https://releases.apache.org/api/cle/release/kafka/0.11.0.0'],
        ['Apache Kafka · 4.0.0 release announcement', 'https://kafka.apache.org/blog/2025/03/18/apache-kafka-4.0.0-release-announcement/'],
        ['Apache Kafka · 4.2.0 release announcement', 'https://kafka.apache.org/blog/2026/02/17/apache-kafka-4.2.0-release-announcement/'],
      ],
    },
  };
})();
