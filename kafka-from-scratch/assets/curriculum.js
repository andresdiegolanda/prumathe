/* The bilingual curriculum: every lesson's text, model, scenes, Docker steps and checkpoint.
   This file is the content source; lesson pages and notes are generated from it by
   scripts/build.mjs and verified by scripts/check.mjs. No runtime dependency or network request.
   B(en, es) pairs the two languages; the helpers below give each lesson the same shape. */
window.KAFKA_COURSE = (() => {
  const B = (en, es) => ({ en, es });
  const units = [
    B('Start here', 'Antes de empezar'),
    B('The foundations', 'Los cimientos'),
    B('Moving events', 'Mover eventos'),
    B('A resilient cluster', 'Un clúster resistente'),
    B('Time & guarantees', 'Tiempo y garantías'),
    B('Connecting systems', 'Conectar sistemas'),
    B('Processing & operating', 'Procesar y operar'),
    B('Designing for reality', 'Diseñar para la realidad'),
    B('Java with Spring', 'Java con Spring'),
  ];
  const lessons = [];
  // First lesson of each unit. Unit 6 has five lessons since the console lesson (25) joined it.
  const unitStarts = [0, 1, 5, 9, 13, 17, 21, 26, 30];
  const unitOf = (id) => unitStarts.filter((first) => id >= first).length - 1;
  const add = (slug, title, intro, visual, frames, experiment, quiz, lab, source) =>
    lessons.push({ id: lessons.length, unit: unitOf(lessons.length), slug, title, intro, visual, frames, experiment, quiz, lab, source });
  const F = (title, text, rule) => ({ title, text, rule });
  const Q = (question, options, correct, explanation) => ({ question, options, correct, explanation });
  const S = (title, text, command, expected) => ({ title, text, command, expected });
  const run = (s) => 'docker compose run --rm lab ' + s;
  const prep = (n) =>
    S(
      B('Prepare this lab', 'Prepará este laboratorio'),
      B('In a terminal, enter the extracted labs folder. Start the cluster, then prepare this lesson’s own topics. Preparation deletes only this lesson’s previous practice topics.', 'En una terminal, entrá a la carpeta labs descomprimida. Levantá el clúster y prepará los tópicos de esta lección. La preparación borra únicamente los tópicos de práctica de esta lección.'),
      'docker compose up -d --wait\n' + run('prepare ' + n),
      B('Three healthy brokers and READY. Run lesson 00 first if the lab image has not been built.', 'Tres brokers saludables y READY. Hacé primero la lección 00 si todavía no construiste la imagen del laboratorio.'),
    );

  // 00 Before you start
  add(
    'before-you-start',
    B('Before you start', 'Antes de empezar'),
    B('See the idea, test it, name its limit.', 'Mirá la idea, probala y nombrá su límite.'),
    'method',
    [
      F(
        B('Two places, two kinds of evidence', 'Dos lugares, dos tipos de evidencia'),
        B('The browser diagrams simulate a mechanism; the Docker lab runs real Kafka. Moving a shape does not contact a broker. Every claim names the boundary within which it holds: “exactly once” always says exactly once for what.', 'Los diagramas del navegador simulan un mecanismo; el lab de Docker ejecuta Kafka real. Mover una figura no contacta un broker. Cada afirmación nombra el límite dentro del cual vale: «exactamente una vez» siempre dice exactamente una vez de qué.'),
        B('The diagram teaches; the experiment tests.', 'El diagrama enseña; el experimento prueba.'),
      ),
      F(
        B('Follow the learning cycle', 'Seguí el circuito'),
        B('Explore the model and three scenes, run the lab, then answer three checkpoint questions. Progress stays in this browser; you declare the lab done. Passing the checkpoint does not prove a command ran. Change language or appearance whenever you want without losing your place.', 'Explorá el modelo y tres escenas, ejecutá el lab y respondé tres preguntas de control. El avance queda en este navegador; vos declarás el lab hecho. Resolver el control no prueba que corrió un comando. Cambiá idioma o apariencia cuando quieras sin perder tu lugar.'),
        B('Build intuition, state the rule, experiment, then check your understanding.', 'Construí intuición, formulá la regla, experimentá y comprobá qué entendiste.'),
      ),
      F(
        B('Choose a path and prepare your machine', 'Elegí un camino y prepará tu máquina'),
        B('Follow the full course in order or study by unit. Know the basics? Start at Time & guarantees or Java with Spring. Bring Docker Engine 25 or newer for start_interval health checks, a terminal and free memory for three brokers plus optional services. No host Java or Maven needed; both run in containers.', 'Seguí todo en orden o por unidad. ¿Conocés lo básico? Empezá en Tiempo y garantías o Java con Spring. Necesitás Docker Engine 25 o superior para los health checks con start_interval, una terminal y memoria libre para tres brokers y servicios opcionales. Java y Maven corren en contenedores; no necesitás instalarlos.'),
        B('Choose your route; every lab starts from the same kit.', 'Elegí tu recorrido; todos los labs parten del mismo kit.'),
      ),
    ],
    B('Select the browser and Docker planes. Move through the scenes, then move the cycle marker: which parts simulate and which require your terminal?', 'Seleccioná los planos del navegador y Docker. Avanzá las escenas y mové el señalador del circuito: ¿qué partes simulan y cuáles necesitan tu terminal?'),
    [
      Q(
        B('A diagram shows an experiment succeeding. What does that establish?', 'Un diagrama muestra un experimento que sale bien. ¿Qué demuestra?'),
        [B('The mechanism being illustrated, within the stated assumptions', 'El mecanismo ilustrado, dentro de los supuestos declarados'), B('That your local Kafka cluster passed the experiment', 'Que tu clúster local de Kafka pasó el experimento'), B('That the guarantee holds for every external effect', 'Que la garantía vale para cualquier efecto externo')],
        0,
        B('A diagram explains a model. Run the lab to test the mechanism on real Kafka, and name what that experiment does not prove.', 'Un diagrama explica un modelo. Ejecutá el lab para probar el mecanismo en Kafka real y nombrá lo que ese experimento no demuestra.'),
      ),
      Q(
        B('Which topics does a lab preparation step delete?', '¿Qué tópicos borra el paso de preparación de un lab?'),
        [B('All topics in the course cluster', 'Todos los tópicos del clúster del curso'), B('Only that lesson’s practice topics', 'Solo los tópicos de práctica de esa lección'), B('Only topics that no consumer has read yet', 'Solo los tópicos que ningún consumidor leyó todavía')],
        1,
        B('Preparation resets that lesson’s practice topics and known inactive groups; stop its consumers first. It does not clear the whole cluster. Lesson 00 has no preparation step because it creates no topics.', 'La preparación reinicia los tópicos de práctica y grupos inactivos conocidos de esa lección; detené antes sus consumidores. No vacía el clúster entero. La lección 00 no tiene preparación porque no crea tópicos.'),
      ),
      Q(
        B('Where is progress stored, and what does marking a lab done mean?', '¿Dónde se guarda el avance y qué significa marcar un lab como hecho?'),
        [B('In Kafka; the client verified all your commands', 'En Kafka; el cliente verificó todos tus comandos'), B('In a course account; the checkpoint verified the lab', 'En una cuenta del curso; el control verificó el lab'), B('In this browser; you declare that you ran and understood the lab', 'En este navegador; vos declarás que ejecutaste y entendiste el lab')],
        2,
        B('The browser stores your progress locally. The lab mark is your declaration, and checkpoint answers do not detect Docker execution.', 'El navegador guarda tu avance localmente. La marca del lab es tu declaración y las respuestas al control no detectan ejecuciones de Docker.'),
      ),
    ],
    [
      S(
        B('Check Docker', 'Verificá Docker'),
        B('Start Docker with Linux containers. Check Compose, then use docker version to read the Engine version under Server. The kit uses start_interval, which requires Compose 2.20.2 or newer and Engine 25 or newer.', 'Arrancá Docker con contenedores Linux. Verificá Compose y usá docker version para leer la versión del Engine en Server. El kit usa start_interval, que requiere Compose 2.20.2 o superior y Engine 25 o superior.'),
        'docker compose version\ndocker version',
        B('Compose v2, at least 2.20.2, and a Server Engine version of 25 or newer. Compose version alone does not report the Engine; if Server is missing, check that Docker is running.', 'Compose v2, al menos 2.20.2, y una versión de Engine en Server de 25 o superior. La versión de Compose sola no informa la del Engine; si falta Server, comprobá que Docker esté funcionando.'),
      ),
      S(
        B('Get the lab kit', 'Conseguí el kit'),
        B('Use “Download labs” in the course. Extract the ZIP, open a terminal in the extracted directory, then enter labs. That folder contains compose.yaml and the complete client source.', 'Usá «Descargar labs» en el curso. Descomprimí el ZIP, abrí una terminal en el directorio descomprimido y entrá a labs. Esa carpeta contiene compose.yaml y el código completo del cliente.'),
        'cd labs',
        B('Your terminal is in the extracted labs folder, beside compose.yaml.', 'Tu terminal está en la carpeta labs descomprimida, junto a compose.yaml.'),
      ),
      S(
        B('Start the cluster', 'Levantá el clúster'),
        B('Run from labs. Compose starts the services and waits for their health checks. The first run downloads images and takes longer; keep the terminal open until the command finishes.', 'Ejecutá desde labs. Compose levanta los servicios y espera sus health checks. La primera vez descarga imágenes y tarda más; mantené la terminal abierta hasta que termine el comando.'),
        'docker compose up -d --wait',
        B('kafka1, kafka2 and kafka3 are healthy. These are three real Kafka brokers.', 'kafka1, kafka2 y kafka3 están healthy. Son tres brokers de Kafka reales.'),
      ),
      S(
        B('Build and try the client', 'Construí y probá el cliente'),
        B('Run the supplied client’s help command. On first use, Compose builds the missing lab image from the included Dockerfile; that downloads build dependencies. Java and Maven stay in containers. This command lists the experiments without creating topics.', 'Ejecutá la ayuda del cliente incluido. En el primer uso, Compose construye la imagen lab faltante con el Dockerfile incluido; eso descarga dependencias de compilación. Java y Maven quedan en contenedores. Este comando enumera los experimentos sin crear tópicos.'),
        run('help'),
        B('“Kafka course lab / Laboratorio Kafka” and a “Commands:” list including cluster, prepare N and seed N. Help checks the client starts; it does not test a broker connection.', '«Kafka course lab / Laboratorio Kafka» y una lista «Commands:» con cluster, prepare N y seed N. La ayuda comprueba que el cliente arranca; no prueba una conexión al broker.'),
      ),
    ],
    'docker',
  );

  // 01 Your first Kafka cluster
  add(
    'start',
    B('Your first Kafka cluster', 'Tu primer clúster de Kafka'),
    B('A small, real system. A safe place to ask “what if?”', 'Un sistema chico y real. Un lugar para probar «¿qué pasa si…?».'),
    'cluster',
    [
      F(
        B('Give every piece a job', 'Dale un trabajo a cada pieza'),
        B('A producer writes events. A broker stores them. A consumer reads them. Docker runs these programs in isolated containers; a volume keeps broker data when a container restarts.', 'Un productor escribe eventos. Un broker los guarda. Un consumidor los lee. Docker ejecuta estos programas en contenedores aislados; un volumen conserva los datos cuando un contenedor se reinicia.'),
        B('A container is a running program. An image is its recipe.', 'Un contenedor es un programa en ejecución. Una imagen es su receta.'),
      ),
      F(
        B('Connect from the right place', 'Conectate desde el lugar correcto'),
        B('Inside the Compose network, clients use kafka1:9092. From your computer, they use localhost:19092. Bootstrap finds the cluster; advertised listeners tell clients where to connect next.', 'Dentro de la red de Compose, los clientes usan kafka1:9092. Desde tu computadora, usan localhost:19092. Bootstrap encuentra el clúster; los listeners anunciados indican dónde conectarse después.'),
        B('localhost inside a container means that container.', 'localhost dentro de un contenedor es ese mismo contenedor.'),
      ),
      F(
        B('Make the experiment repeatable', 'Hacé que el experimento se pueda repetir'),
        B('This course uses three combined broker/controller nodes, Kafka 4.1.2 and named volumes. Combined roles keep the lab small; production controllers are usually isolated. All sample data is fictional.', 'El curso usa tres nodos con roles de broker y controlador, Kafka 4.1.2 y volúmenes con nombre. Los roles combinados achican el laboratorio; en producción se suelen separar los controladores. Todos los datos de ejemplo son ficticios.'),
        B('Browser diagrams simulate. Docker labs run real Kafka.', 'Los diagramas simulan. Los laboratorios de Docker ejecutan Kafka real.'),
      ),
    ],
    B('Select a node to inspect its role. Advance the scene to trace a connection.', 'Seleccioná un nodo para ver su función. Avanzá la escena para seguir una conexión.'),
    [
      Q(
        B('A client runs inside Docker. Which address does it use?', 'Un cliente corre dentro de Docker. ¿Qué dirección usa?'),
        [B('kafka1:9092', 'kafka1:9092'), B('localhost:19092', 'localhost:19092'), B('localhost:9092', 'localhost:9092')],
        0,
        B('The internal listener advertises names on the Docker network. The published host port is for clients outside that network.', 'El listener interno anuncia nombres de la red de Docker. El puerto publicado es para clientes fuera de esa red.'),
      ),
      Q(
        B('You run docker compose stop and later up -d --wait. What happens to the records in the course topics?', 'Ejecutás docker compose stop y más tarde up -d --wait. ¿Qué pasa con los mensajes de los tópicos del curso?'),
        [B('They are kept: broker data lives in named volumes', 'Se conservan: los datos del broker viven en volúmenes con nombre'), B('They are deleted when the containers stop', 'Se borran cuando los contenedores se detienen'), B('They are kept only if a consumer was running', 'Se conservan solo si había un consumidor funcionando')],
        0,
        B('stop ends the processes; the named volumes survive until you deliberately run down --volumes.', 'stop termina los procesos; los volúmenes con nombre sobreviven hasta que ejecutes down --volumes a propósito.'),
      ),
      Q(
        B('Why does the course run three nodes with both broker and controller roles?', '¿Por qué el curso usa tres nodos con los roles de broker y controlador juntos?'),
        [B('To keep the lab small; production usually isolates controllers', 'Para achicar el laboratorio; en producción se suelen separar los controladores'), B('Because KRaft requires every broker to be a controller', 'Porque KRaft exige que todo broker sea controlador'), B('Because a controller cannot run without also being a broker', 'Porque un controlador no puede correr sin ser también broker')],
        0,
        B('Combined roles are a teaching shortcut. Dedicated controllers isolate metadata work from data traffic and failures.', 'Los roles combinados son un atajo didáctico. Los controladores dedicados aíslan el trabajo de metadatos del tráfico de datos y de las fallas.'),
      ),
    ],
    [
      S(
        B('Get the lab kit', 'Conseguí el kit'),
        B('Use “Download labs” above. Extract the ZIP. Open a terminal in its labs folder. Install Docker Desktop (Windows/macOS) or Docker Engine with Compose v2 (Linux), then start Docker. Allow about 8 GB of Docker memory; optional services need more. First use requires internet to download images.', 'Usá «Descargar labs» arriba. Descomprimí el ZIP y abrí una terminal en su carpeta labs. Instalá Docker Desktop (Windows/macOS) o Docker Engine con Compose v2 (Linux) y arrancá Docker. Asignale unos 8 GB de memoria; los servicios opcionales necesitan más. La primera vez necesitás internet para descargar imágenes.'),
        'docker version\ndocker compose version',
        B('A Server version and Compose v2. If Server is missing, start Docker.', 'Una versión de Server y Compose v2. Si falta Server, arrancá Docker.'),
      ),
      S(
        B('Build the client once', 'Construí el cliente una vez'),
        B('The supplied Java client exposes small, readable experiments. Its entire source is included. No Java installation is needed on your computer.', 'El cliente Java incluido permite ejecutar experimentos chicos y legibles. Viene con todo su código. No necesitás instalar Java en tu computadora.'),
        'docker compose build lab',
        B('The image kafka-course-lab:1.6.0 is built. The first build downloads Maven dependencies.', 'Se construye kafka-course-lab:1.6.0. La primera compilación descarga dependencias de Maven.'),
      ),
      S(
        B('Start three nodes', 'Levantá tres nodos'),
        B('Run from the labs folder. This creates only the course’s named Docker project. Ports 19092, 29092 and 39092 must be free.', 'Ejecutá desde labs. Se crea únicamente el proyecto Docker del curso. Los puertos 19092, 29092 y 39092 tienen que estar libres.'),
        'docker compose up -d --wait',
        B('kafka1, kafka2 and kafka3 are healthy. On a slow machine, rerun after a minute.', 'kafka1, kafka2 y kafka3 están saludables. Si la máquina es lenta, volvé a ejecutar después de un minuto.'),
      ),
      S(
        B('Ask Kafka who is there', 'Preguntale a Kafka quién está'),
        B('The client requests metadata from the broker. It connects through Docker’s internal network.', 'El cliente le pide metadatos al broker. Se conecta por la red interna de Docker.'),
        run('cluster'),
        B('Three broker IDs: 1, 2 and 3. This is your first real response from Kafka.', 'Tres IDs de broker: 1, 2 y 3. Es tu primera respuesta real de Kafka.'),
      ),
      S(
        B('Open the live viewer', 'Abrí el visor en vivo'),
        B('The viewer is a page that reads the cluster every half second and draws brokers, topics, partitions, records and groups as the lessons change them. It only reads: the lab commands print the same with it open. Leave it open in a browser tab for the rest of the course.', 'El visor es una página que lee el clúster cada medio segundo y dibuja brokers, tópicos, particiones, registros y grupos a medida que las lecciones los cambian. Solo lee: los comandos del lab imprimen lo mismo con el visor abierto. Dejalo abierto en una pestaña durante el resto del curso.'),
        'docker compose up -d visor',
        B('Open http://localhost:18090: three brokers, the active controller and no lesson topic yet. Port 18090 must be free.', 'Abrí http://localhost:18090: tres brokers, el controlador activo y todavía ningún tópico de lección. El puerto 18090 tiene que estar libre.'),
      ),
      S(
        B('Pause safely', 'Pausá sin perder datos'),
        B('Stop when you finish; volumes keep the data. Start again with up -d --wait. Use down --volumes only when you deliberately want to erase all course data.', 'Al terminar, detené los servicios; los volúmenes conservan los datos. Volvé con up -d --wait. Usá down --volumes solo cuando quieras borrar todos los datos del curso.'),
        'docker compose stop\ndocker compose up -d --wait',
        B('The same cluster returns. While it is stopped the viewer says the cluster does not answer, then draws it again. Keep both running for the next lesson; docker compose stop visor closes the viewer.', 'Vuelve el mismo clúster. Mientras está detenido, el visor dice que el clúster no responde y después lo vuelve a dibujar. Dejá los dos funcionando para la siguiente lección; docker compose stop visor cierra el visor.'),
      ),
    ],
    'quickstart',
  );

  // 02 An event is a fact
  add(
    'event-log',
    B('An event is a fact', 'Un evento es un hecho'),
    B('Keep what happened. Let each reader decide what to do.', 'Guardá lo que pasó. Dejá que cada lector decida qué hacer.'),
    'log',
    [
      F(
        B('Write the past tense', 'Escribí en pasado'),
        B('OrderPlaced records a fact that already happened. ShipOrder is a command asking someone to act. Our fictional café publishes orders once so billing and the kitchen can react independently.', 'OrderPlaced registra algo que ya pasó. ShipOrder es un comando que pide una acción. Nuestro café ficticio publica cada pedido para que la caja y la cocina reaccionen por separado.'),
        B('A useful event says what happened, to which entity, and when.', 'Un evento útil dice qué pasó, a qué entidad y cuándo.'),
      ),
      F(
        B('Append; do not overwrite', 'Agregá; no sobrescribas'),
        B('A partition is an ordered log. New records go at the end. Reading a record does not remove it, so two applications can read the same history at different speeds.', 'Una partición es un registro ordenado. Los mensajes nuevos van al final. Leer un mensaje no lo elimina: dos aplicaciones pueden leer la misma historia a velocidades distintas.'),
        B('Consumption and deletion are separate decisions.', 'Consumir y borrar son decisiones distintas.'),
      ),
      F(
        B('Replay has a boundary', 'El replay tiene un límite'),
        B('A new reader can replay retained records. It cannot recover records already removed by retention. Replaying a payment event must not charge a customer again: external effects need their own deduplication.', 'Un lector nuevo puede volver a leer los mensajes retenidos. No recupera lo que la retención ya borró. Releer un pago no debería cobrarlo de nuevo: los efectos externos necesitan su propia deduplicación.'),
        B('A log lets you reread history; it does not undo side effects.', 'Un log permite releer la historia; no deshace efectos externos.'),
      ),
    ],
    B('Append an order, then move the reader. Notice that reading leaves the log intact.', 'Agregá un pedido y mové el lector. Fijate que leer deja el log intacto.'),
    [
      Q(
        B('What happens to a record after a consumer reads it?', '¿Qué pasa con un mensaje después de que un consumidor lo lee?'),
        [B('It is deleted immediately', 'Se borra enseguida'), B('It stays until the cleanup policy removes it', 'Queda hasta que la política de limpieza lo elimine'), B('It moves to another topic', 'Se mueve a otro tópico')],
        1,
        B('The broker cleans data according to retention and compaction policies, independently of an ordinary consumer reading it.', 'El broker limpia según las políticas de retención y compactación, independientemente de que un consumidor común lo lea.'),
      ),
      Q(
        B('Which of these names is an event, in the sense this lesson uses?', '¿Cuál de estos nombres es un evento, en el sentido que usa esta lección?'),
        [B('OrderPlaced', 'OrderPlaced'), B('ShipOrder', 'ShipOrder'), B('GetOrderStatus', 'GetOrderStatus')],
        0,
        B('An event states a fact in the past tense. ShipOrder is a command; GetOrderStatus is a query.', 'Un evento afirma un hecho en pasado. ShipOrder es un comando; GetOrderStatus es una consulta.'),
      ),
      Q(
        B('A new consumer group starts reading a topic from the beginning. What can it see?', 'Un grupo de consumidores nuevo empieza a leer un tópico desde el principio. ¿Qué puede ver?'),
        [B('Only the records still retained; what retention removed is gone', 'Solo los mensajes todavía retenidos; lo que la retención borró ya no está'), B('Every record ever written to the topic', 'Todos los mensajes que alguna vez se escribieron en el tópico'), B('Only the records written after the group was created', 'Solo los mensajes escritos después de crear el grupo')],
        0,
        B('Replay reaches back to the earliest retained offset, not to the first record ever written.', 'El replay llega hasta el primer offset retenido, no hasta el primer mensaje que se escribió.'),
      ),
    ],
    [
      prep(1),
      S(
        B('Append three facts', 'Agregá tres hechos'),
        B('Produce three fictional café orders with stable keys.', 'Publicá tres pedidos ficticios del café con claves estables.'),
        run('seed 1'),
        B('Three acknowledged records, with partition and offset.', 'Tres mensajes confirmados, con partición y offset.'),
      ),
      S(
        B('Read the log', 'Leé el log'),
        B('This reader directly assigns partitions and starts at the earliest retained offset. It does not store a group checkpoint.', 'Este lector se asigna las particiones y empieza en el primer offset retenido. No guarda un checkpoint de grupo.'),
        run('read 1'),
        B('Three records appear.', 'Aparecen tres mensajes.'),
      ),
      S(
        B('Read it again', 'Volvé a leerlo'),
        B('Run the identical command. Compare the offsets.', 'Ejecutá el mismo comando. Compará los offsets.'),
        run('read 1'),
        B('The same records and offsets. Reading did not delete anything.', 'Los mismos mensajes y offsets. Leer no borró nada.'),
      ),
    ],
    'design',
  );

  // 03 Inside a record
  add(
    'record',
    B('Inside a record', 'Adentro de un mensaje'),
    B('Key, value, timestamp, headers. Four different jobs.', 'Clave, valor, timestamp y cabeceras. Cuatro trabajos distintos.'),
    'record',
    [
      F(
        B('The envelope and the payload', 'El sobre y el contenido'),
        B('The key often identifies an entity: order-42. The value holds the fact. Kafka stores bytes, not a mandatory JSON structure; a serializer turns application values into those bytes.', 'La clave suele identificar una entidad: order-42. El valor contiene el hecho. Kafka guarda bytes, sin exigir JSON; un serializador convierte los valores de la aplicación en esos bytes.'),
        B('A key is not a unique-record constraint.', 'La clave no impone unicidad de mensajes.'),
      ),
      F(
        B('Context travels with the fact', 'El contexto viaja con el hecho'),
        B('Headers can carry a trace ID or schema version. A timestamp can represent producer creation time or broker append time, depending on topic settings. Event time inside the payload can be different again.', 'Las cabeceras pueden llevar un ID de traza o una versión de esquema. El timestamp puede ser de creación o de ingreso al broker, según la configuración. La hora del hecho dentro del valor puede ser otra.'),
        B('Be explicit about which clock a timestamp describes.', 'Aclarale al lector qué reloj representa cada timestamp.'),
      ),
      F(
        B('The address arrives later', 'La dirección llega después'),
        B('Kafka assigns a partition offset after appending a record. Topic + partition + offset identifies a log position, not a universal business event. The same fact can be republished at another position.', 'Kafka asigna un offset al agregar el mensaje. Tópico + partición + offset identifica una posición del log, no un evento de negocio universal. El mismo hecho puede publicarse otra vez en otra posición.'),
        B('Use a separate event ID when business deduplication matters.', 'Usá un ID de evento propio si necesitás deduplicar hechos de negocio.'),
      ),
    ],
    B('Select each field to inspect its purpose. Advance to reveal the broker-assigned address.', 'Seleccioná cada campo para ver su función. Avanzá para revelar la dirección asignada por el broker.'),
    [
      Q(
        B('Can two records have the same key?', '¿Dos mensajes pueden tener la misma clave?'),
        [B('Yes; a key can identify an entity across many events', 'Sí; puede identificar una entidad a lo largo de varios eventos'), B('No; Kafka rejects the second one', 'No; Kafka rechaza el segundo'), B('Only if their values differ', 'Solo si sus valores difieren')],
        0,
        B('Keys guide partitioning and compaction. They do not reject duplicate writes.', 'Las claves orientan el particionado y la compactación. No rechazan escrituras duplicadas.'),
      ),
      Q(
        B('Where does the offset of a record come from?', '¿De dónde sale el offset de un mensaje?'),
        [B('The broker assigns it when it appends the record to a partition', 'Lo asigna el broker al agregar el mensaje a una partición'), B('The producer chooses it before sending', 'Lo elige el productor antes de enviar'), B('It is derived from the record timestamp', 'Se deriva del timestamp del mensaje')],
        0,
        B('The address arrives after the append. That is why the same fact can be republished at another position.', 'La dirección llega después de agregar. Por eso el mismo hecho puede publicarse otra vez en otra posición.'),
      ),
      Q(
        B('You must recognize the same business fact published twice at different positions. What identifies it?', 'Tenés que reconocer el mismo hecho de negocio publicado dos veces en posiciones distintas. ¿Qué lo identifica?'),
        [B('An event ID inside the record, chosen by the application', 'Un ID de evento dentro del mensaje, elegido por la aplicación'), B('Its topic, partition and offset', 'Su tópico, partición y offset'), B('The broker timestamp', 'El timestamp del broker')],
        0,
        B('Topic, partition and offset identify a log position. Business identity has to travel inside the record.', 'Tópico, partición y offset identifican una posición del log. La identidad de negocio tiene que viajar dentro del mensaje.'),
      ),
    ],
    [
      prep(2),
      S(
        B('Send an envelope', 'Mandá un sobre'),
        B('The sample producer attaches event-type and trace-id headers.', 'El productor de ejemplo agrega cabeceras event-type y trace-id.'),
        run('seed 2'),
        B('Three records acknowledged.', 'Tres mensajes confirmados.'),
      ),
      S(
        B('Inspect every field', 'Inspeccioná cada campo'),
        B('Read the key, value, headers, timestamp, partition and offset together.', 'Leé juntos clave, valor, cabeceras, timestamp, partición y offset.'),
        run('read 2'),
        B('Headers are printed separately from the JSON value.', 'Las cabeceras aparecen separadas del valor JSON.'),
      ),
      S(
        B('Repeat the business key', 'Repetí la clave de negocio'),
        B('Produce the same sample again, then read.', 'Publicá otra vez la misma muestra y leé.'),
        run('seed 2') + '\n' + run('read 2'),
        B('Six records. Repeated keys did not overwrite earlier records.', 'Seis mensajes. Repetir claves no sobrescribió los anteriores.'),
      ),
    ],
    'concepts',
  );

  // 04 One topic, many logs
  add(
    'partitions',
    B('One topic, many logs', 'Un tópico, varios logs'),
    B('A partition is the unit of order and parallel work.', 'La partición es la unidad de orden y trabajo paralelo.'),
    'partitions',
    [
      F(
        B('Name the stream', 'Dale un nombre al flujo'),
        B('A topic is a named stream, such as orders. It is divided into partitions. Each partition has its own sequence of offsets, so offset 4 can exist in partition 0 and partition 1.', 'Un tópico es un flujo con nombre, como orders. Se divide en particiones. Cada una tiene su secuencia de offsets: el offset 4 puede existir en la partición 0 y en la 1.'),
        B('An offset only has meaning inside its partition.', 'Un offset solo tiene sentido dentro de su partición.'),
      ),
      F(
        B('Scale by splitting work', 'Escalá repartiendo el trabajo'),
        B('Different partition leaders can live on different brokers. Clients can read or write several partitions in parallel. More partitions also mean more metadata, files, replication and recovery work.', 'Los líderes de distintas particiones pueden vivir en distintos brokers. Los clientes pueden leer o escribir varias en paralelo. Más particiones también implican más metadatos, archivos, réplicas y trabajo de recuperación.'),
        B('Partition count is a design choice, not a free speed dial.', 'La cantidad de particiones es una decisión de diseño, no velocidad gratis.'),
      ),
      F(
        B('Do not invent a global order', 'No inventes un orden global'),
        B('Kafka preserves the log order within a partition. It does not promise an order across partitions. If two events must stay ordered, design their keys and producer behavior for the same partition.', 'Kafka conserva el orden del log dentro de una partición. No promete orden entre particiones. Si dos eventos tienen que mantener su orden, diseñá las claves y el comportamiento del productor para la misma partición.'),
        B('Partition 0 offset 8 is not “before” partition 1 offset 3.', 'El offset 8 de la partición 0 no es «anterior» al 3 de la partición 1.'),
      ),
    ],
    B('Change the partition count and append records. Each lane counts its own offsets.', 'Cambiá la cantidad de particiones y agregá mensajes. Cada carril cuenta sus propios offsets.'),
    [
      Q(
        B('Which ordering is guaranteed by a partitioned log?', '¿Qué orden garantiza un log particionado?'),
        [B('One total order for the topic', 'Un orden total para el tópico'), B('Order within each partition', 'El orden dentro de cada partición'), B('Order by the customer’s clock', 'El orden del reloj del cliente')],
        1,
        B('The partition is the ordering boundary. Timestamps do not create cross-partition ordering.', 'La partición es el límite del orden. Los timestamps no crean un orden entre particiones.'),
      ),
      Q(
        B('Offset 4 exists in partition 0 and offset 4 exists in partition 1. Are they the same record?', 'El offset 4 existe en la partición 0 y en la partición 1. ¿Son el mismo mensaje?'),
        [B('No: an offset only has meaning inside its partition', 'No: un offset solo tiene sentido dentro de su partición'), B('Yes: offsets are unique across the topic', 'Sí: los offsets son únicos en todo el tópico'), B('Only if both records share the same key', 'Solo si los dos mensajes tienen la misma clave')],
        0,
        B('Each partition counts its own offsets from zero. Two partitions have two independent sequences.', 'Cada partición cuenta sus offsets desde cero. Dos particiones son dos secuencias independientes.'),
      ),
      Q(
        B('What does adding partitions buy, and what does it cost?', '¿Qué se gana agregando particiones, y qué cuesta?'),
        [B('More parallel readers and writers, at the price of more metadata, files and recovery work', 'Más lectores y escritores en paralelo, al precio de más metadatos, archivos y trabajo de recuperación'), B('A total order across the topic, at no cost', 'Un orden total en todo el tópico, sin costo'), B('More copies of each record', 'Más copias de cada mensaje')],
        0,
        B('Partitions divide work; replicas copy it. Neither creates an order across partitions.', 'Las particiones reparten trabajo; las réplicas lo copian. Ninguna crea un orden entre particiones.'),
      ),
    ],
    [
      prep(3),
      S(
        B('Inspect the topic', 'Inspeccioná el tópico'),
        B('Preparation created a topic with three partitions and three replicas per partition.', 'La preparación creó un tópico con tres particiones y tres réplicas por partición.'),
        run('describe 3'),
        B('Partitions 0, 1 and 2, each with a leader and an ISR list.', 'Particiones 0, 1 y 2, cada una con líder y lista de ISR.'),
      ),
      S(
        B('Write to all lanes', 'Escribí en todos los carriles'),
        B('This lesson deliberately chooses each partition to make the addresses obvious.', 'Esta lección elige cada partición explícitamente para que se vean las direcciones.'),
        run('seed 3'),
        B('Records acknowledged in all three partitions.', 'Mensajes confirmados en las tres particiones.'),
      ),
      S(
        B('Compare addresses', 'Compará las direcciones'),
        B('Read and group the output mentally by partition.', 'Leé y agrupá mentalmente la salida por partición.'),
        run('read 3'),
        B('Offset 0 occurs in three partitions. The display order is not a total event order.', 'El offset 0 aparece en tres particiones. El orden de la pantalla no es un orden total de eventos.'),
      ),
    ],
    'design',
  );

  // 05 Keys choose a lane
  add(
    'keys-order',
    B('Keys choose a lane', 'Las claves eligen un carril'),
    B('Keep related facts together without creating a hot spot.', 'Juntá los hechos relacionados sin concentrar toda la carga.'),
    'keys',
    [
      F(
        B('Hash the serialized key', 'Calculá el hash de la clave serializada'),
        B('The standard Java producer hashes a non-null serialized key with Murmur2, takes a positive value, and applies modulo partition count. Identical bytes map to the same partition while that count stays fixed.', 'El productor Java estándar aplica Murmur2 a los bytes de una clave no nula, toma un valor positivo y calcula módulo cantidad de particiones. Los mismos bytes van a la misma partición mientras esa cantidad no cambie.'),
        B('Same key bytes + same partition count = same partition.', 'Mismos bytes de clave + misma cantidad de particiones = misma partición.'),
      ),
      F(
        B('Choose the ordering boundary', 'Elegí el límite del orden'),
        B('An order ID groups one order’s events. A store ID groups a whole store, which can overload one partition. A null key follows the client’s partitioning strategy; do not assume round-robin.', 'Un ID de pedido agrupa los eventos de ese pedido. Un ID de local agrupa todo el local y puede sobrecargar una partición. Una clave nula sigue la estrategia del cliente; no supongas round-robin.'),
        B('Choose the smallest entity whose events need ordering.', 'Elegí la entidad más chica cuyos eventos necesiten orden.'),
      ),
      F(
        B('Adding lanes can move keys', 'Agregar carriles puede mover claves'),
        B('Changing partition count changes the modulo result for many keys. Earlier records remain in their original partitions. A migration may need a new topic and a deliberate cutover.', 'Cambiar la cantidad de particiones cambia el resultado del módulo para muchas claves. Los mensajes anteriores quedan donde estaban. Una migración puede requerir un tópico nuevo y un corte planificado.'),
        B('Adding partitions does not redistribute old records.', 'Agregar particiones no redistribuye mensajes anteriores.'),
      ),
    ],
    B('Type a key and change the partition count. This uses the Java producer’s real Murmur2 calculation.', 'Escribí una clave y cambiá la cantidad de particiones. Se usa el cálculo Murmur2 real del productor Java.'),
    [
      Q(
        B('You add partitions. What happens to existing records?', 'Agregás particiones. ¿Qué pasa con los mensajes existentes?'),
        [B('They are automatically rehashed', 'Se recalcula su hash y se mueven'), B('They stay in their original partitions', 'Quedan en sus particiones originales'), B('They lose their offsets', 'Pierden sus offsets')],
        1,
        B('Only subsequent partition choices use the new count. Old data does not move to preserve key ordering for you.', 'Solo las nuevas decisiones de particionado usan la cantidad nueva. Kafka no mueve los datos viejos para conservarte el orden por clave.'),
      ),
      Q(
        B('Two records with the same key, the same partition count and the same partitioner. Where do they go?', 'Dos mensajes con la misma clave, la misma cantidad de particiones y el mismo particionador. ¿A dónde van?'),
        [B('To the same partition', 'A la misma partición'), B('To consecutive partitions, round-robin', 'A particiones consecutivas, round-robin'), B('To whichever partition has fewer records', 'A la partición que tenga menos mensajes')],
        0,
        B('Same key bytes, same count, same hash, same modulo. The partitioner does not look at load.', 'Mismos bytes de clave, misma cantidad, mismo hash, mismo módulo. El particionador no mira la carga.'),
      ),
      Q(
        B('You want all the events of one order to stay ordered, and you also want to spread load. Which key?', 'Querés que todos los eventos de un pedido mantengan su orden, y también repartir la carga. ¿Qué clave?'),
        [B('The order ID: the smallest entity whose events need ordering', 'El ID del pedido: la entidad más chica cuyos eventos necesitan orden'), B('The store ID: it groups more events together', 'El ID del local: agrupa más eventos'), B('A null key: the client spreads it best', 'Una clave nula: el cliente la reparte mejor')],
        0,
        B('A larger entity concentrates load on one partition; a null key gives up ordering altogether.', 'Una entidad más grande concentra la carga en una partición; una clave nula renuncia al orden.'),
      ),
    ],
    [
      prep(4),
      S(
        B('Observe key routing', 'Observá el ruteo por clave'),
        B('The default Java partitioner routes repeated order keys.', 'El particionador Java por defecto distribuye claves de pedido repetidas.'),
        run('seed 4') + '\n' + run('read 4'),
        B('Repeated keys share a partition.', 'Las claves repetidas comparten partición.'),
      ),
      S(
        B('Add a partition', 'Agregá una partición'),
        B('Increase this lesson topic from three to four partitions.', 'Aumentá de tres a cuatro las particiones del tópico de esta lección.'),
        run('expand 4 4'),
        B('PartitionCount is now 4.', 'PartitionCount ahora es 4.'),
      ),
      S(
        B('Send the same keys again', 'Mandá las mismas claves otra vez'),
        B('Compare new and earlier records; some keys may move.', 'Compará los mensajes nuevos con los anteriores; algunas claves pueden cambiar de partición.'),
        run('seed 4') + '\n' + run('read 4'),
        B('Earlier records remain where they were. The partitioner has not migrated them.', 'Los mensajes anteriores siguen donde estaban. El particionador no los migró.'),
      ),
    ],
    'producer',
  );

  // 06 The producer’s waiting room
  add(
    'producer',
    B('The producer’s waiting room', 'La sala de espera del productor'),
    B('Batching, compression, acknowledgments and timeouts.', 'Lotes, compresión, confirmaciones y tiempos de espera.'),
    'producer',
    [
      F(
        B('Collect a batch', 'Armá un lote'),
        B('send() typically places a record in the producer’s buffer. The producer batches records by destination partition. batch.size and linger.ms influence how full a batch becomes before it is sent.', 'send() suele dejar el mensaje en el buffer del productor. El productor arma lotes por partición de destino. batch.size y linger.ms influyen en cuánto se llena un lote antes del envío.'),
        B('Calling send() is not the same as a successful acknowledgment.', 'Llamar a send() no equivale a recibir una confirmación exitosa.'),
      ),
      F(
        B('Trade latency for efficiency', 'Intercambiá latencia por eficiencia'),
        B('Larger batches and compression can reduce network and disk work. Waiting to fill batches can add latency. Measure with your event size, key distribution and latency budget.', 'Lotes más grandes y compresión pueden reducir trabajo de red y disco. Esperar para llenar lotes puede agregar latencia. Medí con tu tamaño de evento, distribución de claves y presupuesto de latencia.'),
        B('Throughput without a latency target is an incomplete result.', 'El throughput sin un objetivo de latencia es un resultado incompleto.'),
      ),
      F(
        B('Handle success and failure', 'Atendé tanto el éxito como el error'),
        B('Use callbacks or futures to observe completion. acks controls broker confirmation; delivery.timeout.ms bounds delivery attempts. A timeout can leave an uncertain outcome: the write may have reached Kafka.', 'Usá callbacks o futures para observar el resultado. acks controla la confirmación del broker; delivery.timeout.ms limita los intentos. Un timeout puede dejar un resultado incierto: la escritura pudo haber llegado a Kafka.'),
        B('A retry needs a duplicate strategy.', 'Un reintento necesita una estrategia para duplicados.'),
      ),
    ],
    B('Adjust the batch size and watch requests versus records. This is a model, not a benchmark.', 'Ajustá el tamaño del lote y compará pedidos de red con mensajes. Es un modelo, no un benchmark.'),
    [
      Q(
        B('send() returned without an immediate error. What does that guarantee?', '¿Qué garantiza que send() devuelva sin error inmediato?'),
        [B('The record is already replicated', 'Que el mensaje ya está replicado'), B('The consumer processed it', 'Que el consumidor lo procesó'), B('Only that the asynchronous send was accepted; inspect completion', 'Solo que se aceptó el envío asíncrono; hay que mirar su finalización')],
        2,
        B('The returned future or callback carries the broker result. Buffering is not durable delivery.', 'El future o callback trae el resultado del broker. Estar en un buffer no es entrega durable.'),
      ),
      Q(
        B('Which two settings decide how full a batch gets before it is sent?', '¿Qué dos configuraciones deciden cuánto se llena un lote antes del envío?'),
        [B('batch.size and linger.ms', 'batch.size y linger.ms'), B('acks and retries', 'acks y retries'), B('max.poll.records and fetch.min.bytes', 'max.poll.records y fetch.min.bytes')],
        0,
        B('batch.size bounds the bytes per batch; linger.ms is how long the producer waits for more records. The other pairs belong to acknowledgment and to the consumer.', 'batch.size acota los bytes por lote; linger.ms es cuánto espera el productor a que lleguen más mensajes. Los otros pares son de la confirmación y del consumidor.'),
      ),
      Q(
        B('A send fails after delivery.timeout.ms. What do you know about that record?', 'Un envío falla después de delivery.timeout.ms. ¿Qué sabés de ese mensaje?'),
        [B('The outcome is uncertain: it may or may not have reached Kafka', 'El resultado es incierto: pudo haber llegado a Kafka o no'), B('It was certainly not written', 'Seguro no se escribió'), B('It was written exactly once, so a retry would duplicate it', 'Se escribió exactamente una vez, así que un reintento lo duplicaría')],
        0,
        B('A timeout is the absence of an answer, not a negative answer. The retry strategy has to live with duplicates.', 'Un timeout es la ausencia de respuesta, no una respuesta negativa. La estrategia de reintento tiene que convivir con duplicados.'),
      ),
    ],
    [
      prep(5),
      S(
        B('Measure small batches', 'Medí lotes chicos'),
        B('Send 2,000 synthetic records with linger 0 and small batches.', 'Mandá 2.000 mensajes sintéticos con linger 0 y lotes chicos.'),
        run('benchmark 5 0 1024'),
        B('Elapsed time and producer metrics. Save the result.', 'Tiempo transcurrido y métricas del productor. Guardá el resultado.'),
      ),
      S(
        B('Allow batching', 'Permití armar lotes'),
        B('Send the same workload with a short linger and larger batch size.', 'Mandá la misma carga con una espera corta y lotes más grandes.'),
        run('benchmark 5 20 65536'),
        B('Compare batch-size-avg and records-per-request-avg. Results depend on your machine.', 'Compará batch-size-avg y records-per-request-avg. Los resultados dependen de tu máquina.'),
      ),
      S(
        B('Account for all records', 'Contá todos los mensajes'),
        B('Inspect end offsets after both runs. A benchmark that loses records is misleading.', 'Inspeccioná los offsets finales tras las dos corridas. Un benchmark que pierde mensajes engaña.'),
        run('offsets 5'),
        B('The sum of end offsets is 4,000 on the freshly prepared topic.', 'En el tópico recién preparado, la suma de offsets finales es 4.000.'),
      ),
    ],
    'producer',
  );

  // 07 One stream, independent teams
  add(
    'consumer-groups',
    B('One stream, independent teams', 'Un flujo, equipos independientes'),
    B('Share the work within a group. Share the history across groups.', 'Repartí trabajo dentro del grupo. Compartí historia entre grupos.'),
    'groups',
    [
      F(
        B('Give an application a group ID', 'Dale un ID de grupo a la aplicación'),
        B('Consumers with the same group.id cooperate. In an ordinary consumer group, a partition is assigned to at most one member at a time. That member can own several partitions.', 'Los consumidores con el mismo group.id cooperan. En un grupo común, cada partición se asigna a un solo miembro a la vez como máximo. Un miembro puede tener varias particiones.'),
        B('The group is the logical subscriber.', 'El grupo es el suscriptor lógico.'),
      ),
      F(
        B('Parallelism has a ceiling', 'El paralelismo tiene un techo'),
        B('Three partitions can keep at most three group members busy reading them. A fourth member waits without an assignment. This says nothing about threads used after polling; those require careful ordering and commit design.', 'Tres particiones mantienen ocupados como máximo a tres miembros leyéndolas. El cuarto espera sin asignación. Los hilos que procesan después del poll son otro tema: exigen cuidar el orden y los commits.'),
        B('More consumers than partitions does not increase read parallelism.', 'Más consumidores que particiones no aumenta el paralelismo de lectura.'),
      ),
      F(
        B('Let another team join', 'Sumá otro equipo'),
        B('Kitchen and billing use different group IDs. Each group reads all the retained orders independently and stores its own progress. They do not take events away from one another.', 'Cocina y caja usan IDs de grupo distintos. Cada grupo lee los pedidos retenidos por su cuenta y guarda su propio avance. No se sacan eventos entre sí.'),
        B('Same group: divide work. Different groups: independent reads.', 'Mismo grupo: reparten trabajo. Grupos distintos: lecturas independientes.'),
      ),
    ],
    B('Add consumers to a three-partition topic. Watch when a member becomes idle.', 'Agregá consumidores a un tópico de tres particiones. Fijate cuándo queda uno sin trabajo.'),
    [
      Q(
        B('Five consumers in one group read three partitions. How many can have assignments?', 'Cinco consumidores de un grupo leen tres particiones. ¿Cuántos pueden tener asignaciones?'),
        [B('At most three', 'Como máximo tres'), B('All five read every record', 'Los cinco leen todos los mensajes'), B('Exactly one', 'Exactamente uno')],
        0,
        B('Ordinary consumer groups assign whole partitions. The extra members remain idle until the assignment changes.', 'Los grupos comunes asignan particiones enteras. Los miembros extra quedan libres hasta que cambie la asignación.'),
      ),
      Q(
        B('Kitchen and billing both need every order. How do they subscribe?', 'Cocina y caja necesitan todos los pedidos. ¿Cómo se suscriben?'),
        [B('Each with its own group.id, so each reads the whole retained history', 'Cada una con su propio group.id, así cada una lee toda la historia retenida'), B('Both with the same group.id, so the work is shared', 'Las dos con el mismo group.id, así reparten el trabajo'), B('One group, with two partitions assigned to each application', 'Un solo grupo, con dos particiones para cada aplicación')],
        0,
        B('Same group divides work; different groups read independently. Two applications that both need everything are two groups.', 'Mismo grupo reparte trabajo; grupos distintos leen por separado. Dos aplicaciones que necesitan todo son dos grupos.'),
      ),
      Q(
        B('Within one ordinary group, how many members can read the same partition at the same time?', 'Dentro de un grupo común, ¿cuántos miembros pueden leer la misma partición al mismo tiempo?'),
        [B('At most one', 'Como máximo uno'), B('As many as the replication factor', 'Tantos como el factor de replicación'), B('Any number, taking turns', 'Cualquier cantidad, por turnos')],
        0,
        B('Whole-partition assignment is what keeps per-partition order inside a group. Share groups change this rule, with other guarantees.', 'La asignación de particiones enteras es lo que conserva el orden por partición dentro del grupo. Los share groups cambian esta regla, con otras garantías.'),
      ),
    ],
    [
      prep(6),
      S(
        B('Populate the lanes', 'Cargá los carriles'),
        B('Create sample events on all three partitions.', 'Creá eventos de ejemplo en las tres particiones.'),
        run('seed 6'),
        B('Six events across three partitions.', 'Seis eventos en tres particiones.'),
      ),
      S(
        B('Start team A', 'Arrancá el equipo A'),
        B('Keep this terminal running. Open a second terminal in the same labs folder and run the same command. Watch the assignment messages. Stop both with Ctrl+C when done.', 'Dejá esta terminal funcionando. Abrí otra en la misma carpeta labs y ejecutá el mismo comando. Mirá las asignaciones. Al terminar, detené ambas con Ctrl+C.'),
        run('watch 6 kitchen'),
        B('The two members divide the three partitions after a rebalance.', 'Los dos miembros se reparten las tres particiones después del rebalanceo.'),
      ),
      S(
        B('Start an independent team', 'Arrancá un equipo independiente'),
        B('In a third terminal use a different group ID. Stop it with Ctrl+C after observing records.', 'En una tercera terminal usá otro ID de grupo. Detenelo con Ctrl+C después de ver los mensajes.'),
        run('watch 6 billing'),
        B('Billing reads every partition independently of kitchen.', 'Billing lee todas las particiones independientemente de kitchen.'),
      ),
    ],
    'consumer',
  );

  // 08 A bookmark, not a receipt
  add(
    'offsets',
    B('A bookmark, not a receipt', 'Un señalador, no un recibo'),
    B('Position, committed offset and lag are different measurements.', 'Posición, offset confirmado y lag son medidas distintas.'),
    'offsets',
    [
      F(
        B('Track the next record', 'Seguí el próximo mensaje'),
        B('A consumer’s position is the next offset it will fetch. Its committed offset is the durable bookmark used after a restart. Commit 3 means “resume at 3,” not “record 3 is complete.”', 'La posición es el próximo offset que el consumidor va a buscar. El offset confirmado es el señalador durable para reiniciar. Confirmar 3 significa «retomá en 3», no «el mensaje 3 ya terminó».'),
        B('After processing offset n, usually commit n + 1.', 'Después de procesar el offset n, normalmente confirmás n + 1.'),
      ),
      F(
        B('Measure distance', 'Medí la distancia'),
        B('For a simple log, lag is log-end offset minus committed offset. It measures distance in offsets, not seconds or business completion. Gaps from compaction or transactions mean it is not always an exact record count.', 'En un log simple, lag es offset final menos offset confirmado. Mide distancia en offsets, no segundos ni trabajo de negocio terminado. Los huecos por compactación o transacciones impiden que siempre sea un conteo exacto.'),
        B('Low lag can coexist with wrong business results.', 'Puede haber poco lag y resultados de negocio incorrectos.'),
      ),
      F(
        B('Reset with intention', 'Reiniciá la posición con intención'),
        B('auto.offset.reset applies when no valid committed offset exists. It does not override a valid bookmark. To replay a group, stop its members and deliberately reset its offsets.', 'auto.offset.reset se aplica si no hay un offset confirmado válido. No reemplaza un señalador válido. Para releer con un grupo, detené sus miembros y cambiá los offsets deliberadamente.'),
        B('earliest does not mean “start over every time.”', 'earliest no significa «empezá de cero siempre».'),
      ),
    ],
    B('Move the position, then commit it. Compare the two markers and the lag.', 'Mové la posición y después confirmala. Compará los dos marcadores y el lag.'),
    [
      Q(
        B('You processed offsets 0, 1 and 2. What offset should you commit?', 'Procesaste los offsets 0, 1 y 2. ¿Qué offset confirmás?'),
        [B('2', '2'), B('3', '3'), B('Either 2 or 3; both resume correctly', '2 o 3; los dos retoman bien')],
        1,
        B('A committed offset identifies the next record to resume from. Committing 2 would replay record 2.', 'El offset confirmado identifica el próximo mensaje desde el que retomar. Confirmar 2 haría releer el mensaje 2.'),
      ),
      Q(
        B('What does lag measure for an ordinary consumer group?', '¿Qué mide el lag de un grupo de consumidores común?'),
        [B('The distance in offsets between the log end and the committed position', 'La distancia en offsets entre el final del log y la posición confirmada'), B('The seconds since the last commit', 'Los segundos desde el último commit'), B('The exact number of unprocessed business events', 'La cantidad exacta de eventos de negocio sin procesar')],
        0,
        B('Lag counts offsets, and offsets can have gaps from compaction or transaction markers. It is not time and not business completion.', 'El lag cuenta offsets, y los offsets pueden tener huecos por compactación o marcadores de transacción. No es tiempo ni trabajo de negocio terminado.'),
      ),
      Q(
        B('A group has valid committed offsets and auto.offset.reset=earliest. On restart it...', 'Un grupo tiene offsets confirmados válidos y auto.offset.reset=earliest. Al reiniciar...'),
        [B('Resumes from the committed offset; earliest applies only without a valid bookmark', 'Retoma desde el offset confirmado; earliest se aplica solo sin un señalador válido'), B('Starts again from offset 0', 'Empieza otra vez desde el offset 0'), B('Skips to the latest offset', 'Salta al último offset')],
        0,
        B('The reset policy answers "where do I start when there is no bookmark". A valid bookmark wins.', 'La política de reset contesta "dónde empiezo cuando no hay señalador". Un señalador válido manda.'),
      ),
    ],
    [
      prep(7),
      S(
        B('Create a backlog', 'Creá trabajo pendiente'),
        B('Publish the sample events.', 'Publicá los eventos de ejemplo.'),
        run('seed 7'),
        B('Three records in one partition.', 'Tres mensajes en una partición.'),
      ),
      S(
        B('Process and commit', 'Procesá y confirmá'),
        B('The client processes a bounded batch and synchronously commits its next position.', 'El cliente procesa un lote acotado y confirma sincrónicamente su próxima posición.'),
        run('consume 7 bookmarks'),
        B('Three records; committed next offset 3.', 'Tres mensajes; próximo offset confirmado: 3.'),
      ),
      S(
        B('Restart the same group', 'Reiniciá el mismo grupo'),
        B('Run again and inspect lag.', 'Ejecutá otra vez e inspeccioná el lag.'),
        run('consume 7 bookmarks') + '\n' + run('lag 7 bookmarks'),
        B('No old records; lag 0. earliest did not override the commit.', 'No relee mensajes anteriores; lag 0. earliest no reemplazó el commit.'),
      ),
      S(
        B('Replay deliberately', 'Releé a propósito'),
        B('The group must be stopped. Reset only this lab group, then read again.', 'El grupo tiene que estar detenido. Reiniciá solo este grupo de laboratorio y volvé a leer.'),
        run('reset 7 bookmarks') + '\n' + run('consume 7 bookmarks'),
        B('The same three records are processed again.', 'Se procesan otra vez los mismos tres mensajes.'),
      ),
    ],
    'consumer',
  );

  // 09 When the team changes
  add(
    'rebalances',
    B('When the team changes', 'Cuando cambia el equipo'),
    B('Membership, assignment, heartbeats and processing time.', 'Miembros, asignación, latidos y tiempo de procesamiento.'),
    'rebalance',
    [
      F(
        B('Join, leave, reassign', 'Entrar, salir, reasignar'),
        B('When members join or leave, the group redistributes partitions. A coordinator broker manages group membership. Committed offsets let a new owner resume a partition.', 'Cuando entran o salen miembros, el grupo redistribuye particiones. Un broker coordinador administra los miembros. Los offsets confirmados permiten que el nuevo dueño retome una partición.'),
        B('Partition ownership can change while the process is alive.', 'La propiedad de una partición puede cambiar aunque el proceso siga vivo.'),
      ),
      F(
        B('Alive is not the same as progressing', 'Estar vivo no es avanzar'),
        B('Heartbeats show membership liveness. max.poll.interval.ms limits how long a consumer may go between polls. A long processing batch can lose its assignment even if the host is healthy.', 'Los latidos muestran que el miembro sigue presente. max.poll.interval.ms limita el tiempo entre polls. Un lote que tarda demasiado puede perder su asignación aunque la máquina esté sana.'),
        B('Bound processing time and handle partition revocation.', 'Limitá el tiempo de procesamiento y manejá la revocación de particiones.'),
      ),
      F(
        B('Know which protocol you run', 'Sabé qué protocolo usás'),
        B('Kafka 4.x supports the newer consumer group protocol with server-side assignment. Clients must opt in with group.protocol=consumer. Classic cooperative assignment is a separate mechanism; this lab explicitly uses classic.', 'Kafka 4.x permite el protocolo de grupos consumer, con asignación del lado del servidor. El cliente lo elige con group.protocol=consumer. La asignación cooperativa clásica es otro mecanismo; este laboratorio usa classic explícitamente.'),
        B('Check client and broker versions before changing protocols.', 'Verificá versiones de cliente y broker antes de cambiar protocolos.'),
      ),
    ],
    B('Add or remove a member and watch partitions move. The animation is an assignment model.', 'Agregá o quitá un miembro y mirá cómo se mueven las particiones. La animación modela una asignación.'),
    [
      Q(
        B('A consumer processes one batch for too long. What can happen?', 'Un consumidor tarda demasiado en procesar un lote. ¿Qué puede pasar?'),
        [B('Kafka adds partitions automatically', 'Kafka agrega particiones automáticamente'), B('Its assignment can be revoked', 'Puede perder su asignación'), B('Its records are deleted', 'Se borran sus mensajes')],
        1,
        B('Exceeding max.poll.interval.ms can remove a member from active ownership. Work and offset commits must account for that.', 'Superar max.poll.interval.ms puede quitarle la asignación. El procesamiento y los commits tienen que contemplarlo.'),
      ),
      Q(
        B('Who tracks membership and triggers a rebalance for a consumer group?', '¿Quién lleva la lista de miembros y dispara el rebalanceo de un grupo?'),
        [B('The group coordinator, a broker', 'El coordinador del grupo, que es un broker'), B('The producer that writes the topic', 'El productor que escribe el tópico'), B('The consumer with the lowest member ID', 'El consumidor con el ID de miembro más bajo')],
        0,
        B('Each group has a coordinator broker. Members heartbeat to it and it drives reassignment.', 'Cada grupo tiene un broker coordinador. Los miembros le mandan latidos y él conduce la reasignación.'),
      ),
      Q(
        B('The lab sets group.protocol=classic. What does the newer protocol (group.protocol=consumer) change?', 'El laboratorio fija group.protocol=classic. ¿Qué cambia el protocolo nuevo (group.protocol=consumer)?'),
        [B('Assignment moves to the server side; clients opt in explicitly', 'La asignación pasa al lado del servidor; los clientes la eligen explícitamente'), B('Several members of one group can share a partition', 'Varios miembros de un grupo pueden compartir una partición'), B('Offsets stop being committed to Kafka', 'Los offsets dejan de confirmarse en Kafka')],
        0,
        B('The server-side protocol reduces disruptive rebalances. Sharing a partition is what share groups do, a different model.', 'El protocolo del lado del servidor reduce los rebalanceos disruptivos. Compartir una partición es lo que hacen los share groups, otro modelo.'),
      ),
    ],
    [
      prep(8),
      S(
        B('Start member one', 'Arrancá el primer miembro'),
        B('Leave it running in terminal A.', 'Dejalo funcionando en la terminal A.'),
        run('watch 8 team'),
        B('One member is assigned all three partitions.', 'Un miembro recibe las tres particiones.'),
      ),
      S(
        B('Add member two', 'Agregá el segundo miembro'),
        B('In terminal B run the same command. In terminal C produce sample events.', 'En la terminal B ejecutá el mismo comando. En la C publicá eventos de ejemplo.'),
        run('watch 8 team') + '\n' + '# Terminal C' + '\n' + run('seed 8'),
        B('Assignment callbacks report redistribution; events are divided between the members.', 'Los callbacks informan la redistribución; los miembros se reparten los eventos.'),
      ),
      S(
        B('Remove a member', 'Quitá un miembro'),
        B('Press Ctrl+C in terminal B. Observe A, then stop A too.', 'Presioná Ctrl+C en B. Observá A y después detené A también.'),
        run('describe-group team'),
        B('A eventually owns all three partitions again. The group command reports membership while A is running.', 'A vuelve a tener las tres particiones. El comando informa los miembros mientras A sigue funcionando.'),
      ),
    ],
    'rebalance',
  );

  // 10 Copies that follow a leader
  add(
    'replication',
    B('Copies that follow a leader', 'Copias que siguen a un líder'),
    B('A partition can survive the loss of a broker.', 'Una partición puede sobrevivir a la caída de un broker.'),
    'replicas',
    [
      F(
        B('One leader per partition', 'Un líder por partición'),
        B('The leader handles writes for a partition. Follower replicas fetch its log. A replication factor of three means three copies on three brokers, not three partitions.', 'El líder recibe escrituras de una partición. Las réplicas seguidoras copian su log. Un factor de replicación de tres significa tres copias en tres brokers, no tres particiones.'),
        B('Partitioning divides work; replication copies it.', 'Particionar reparte trabajo; replicar lo copia.'),
      ),
      F(
        B('Track the in-sync replicas', 'Seguí las réplicas sincronizadas'),
        B('ISR is the set of replicas considered in sync with the leader. A slow or failed follower can leave it. Replica placement and failure domains determine which failures your copies can survive.', 'ISR es el conjunto de réplicas consideradas sincronizadas con el líder. Una seguidora lenta o caída puede salir. La ubicación de las réplicas y los dominios de falla determinan qué caídas soportás.'),
        B('Three copies on one laptop still share one laptop’s fate.', 'Tres copias en una laptop comparten el destino de esa laptop.'),
      ),
      F(
        B('Promote an eligible replica', 'Promové una réplica elegible'),
        B('When a leader fails, Kafka can elect another eligible replica. Clients refresh metadata and retry. Availability depends on controller quorum and the remaining eligible replicas, not just on a replica count.', 'Si cae el líder, Kafka puede elegir otra réplica elegible. Los clientes actualizan metadatos y reintentan. La disponibilidad depende del quórum de controladores y las réplicas elegibles restantes, no solo de contar copias.'),
        B('Failover is a protocol, not an instantaneous switch.', 'La conmutación es un protocolo, no un cambio instantáneo.'),
      ),
    ],
    B('Fail one broker. Observe the leader and the surviving copies. Restore it before failing another.', 'Hacé caer un broker. Observá el líder y las copias restantes. Recuperalo antes de hacer caer otro.'),
    [
      Q(
        B('Replication factor 3 means…', 'Factor de replicación 3 significa…'),
        [B('Three independent consumer groups', 'Tres grupos independientes'), B('Three copies of each partition', 'Tres copias de cada partición'), B('Three total-order streams', 'Tres flujos con orden total')],
        1,
        B('Replicas are copies of a partition. They do not increase that partition’s consumer parallelism.', 'Las réplicas son copias de una partición. No aumentan su paralelismo de consumo.'),
      ),
      Q(
        B('A follower stops keeping up with the leader. What happens to it?', 'Una seguidora deja de seguirle el ritmo al líder. ¿Qué le pasa?'),
        [B('It leaves the ISR until it catches up', 'Sale del ISR hasta que se pone al día'), B('It becomes leader to relieve the load', 'Pasa a ser líder para aliviar la carga'), B('The partition stops accepting writes at once', 'La partición deja de aceptar escrituras de inmediato')],
        0,
        B('The ISR is the set of replicas considered in sync. Leaving it does not stop writes by itself; min.insync.replicas decides that.', 'El ISR es el conjunto de réplicas consideradas sincronizadas. Salir de él no detiene escrituras por sí solo; eso lo decide min.insync.replicas.'),
      ),
      Q(
        B('Three replicas in three containers on one laptop. Which failure can they survive?', 'Tres réplicas en tres contenedores de una misma laptop. ¿Qué falla soportan?'),
        [B('One container stopping; not the laptop itself', 'Que se detenga un contenedor; no la laptop'), B('Any failure, because there are three copies', 'Cualquier falla, porque hay tres copias'), B('Only a disk failure, not a process failure', 'Solo una falla de disco, no de proceso')],
        0,
        B('Copies protect against the failure domains they do not share. Three copies on one machine share that machine.', 'Las copias protegen contra los dominios de falla que no comparten. Tres copias en una máquina comparten esa máquina.'),
      ),
    ],
    [
      prep(9),
      S(
        B('Locate the leader', 'Ubicá al líder'),
        B('This lab assigns the single partition replicas in order 1,2,3. Check the actual leader before the failure.', 'El laboratorio asigna las réplicas de la única partición en orden 1,2,3. Verificá el líder real antes de la falla.'),
        run('seed 9') + '\n' + run('describe 9'),
        B('Three replicas and three ISR members before failure.', 'Tres réplicas y tres miembros del ISR antes de la falla.'),
      ),
      S(
        B('Stop broker 1', 'Detené el broker 1'),
        B('Stop only this course service. The remaining two controllers still form a majority.', 'Detené solo este servicio del curso. Los otros dos controladores conservan la mayoría.'),
        'docker compose stop kafka1' + '\n' + run('describe 9'),
        B('If 1 was leader, a surviving broker becomes leader. ISR eventually shrinks.', 'Si 1 era líder, lo reemplaza un broker sobreviviente. El ISR se achica después de detectar la falla.'),
      ),
      S(
        B('Read, then restore', 'Leé y recuperá'),
        B('Use the surviving brokers to read, then bring the original node back.', 'Leé mediante los brokers sobrevivientes y después recuperá el nodo original.'),
        run('read 9') + '\n' + 'docker compose up -d --wait' + '\n' + run('describe 9'),
        B('Records remain readable. After catch-up, ISR contains all three again.', 'Los mensajes se pueden leer. Después de ponerse al día, el ISR vuelve a tener tres miembros.'),
      ),
    ],
    'design',
  );

  // 11 What does “saved” mean?
  add(
    'durability',
    B('What does “saved” mean?', '¿Qué significa «guardado»?'),
    B('acks, minimum ISR and the price of staying available.', 'acks, ISR mínimo y el costo de seguir disponible.'),
    'durability',
    [
      F(
        B('Choose the acknowledgment', 'Elegí la confirmación'),
        B('acks=0 waits for no broker response. acks=1 waits for the leader. acks=all waits for the in-sync replicas required by the write protocol. None of these means a consumer processed the event.', 'acks=0 no espera respuesta del broker. acks=1 espera al líder. acks=all espera a las réplicas sincronizadas requeridas por el protocolo. Ninguno significa que un consumidor procesó el evento.'),
        B('Producer acknowledgment is a storage guarantee, not a business receipt.', 'La confirmación al productor habla del almacenamiento, no del resultado de negocio.'),
      ),
      F(
        B('Set a floor for safe writes', 'Fijá un piso para las escrituras'),
        B('With acks=all, min.insync.replicas=2 requires at least two ISR members. If the ISR shrinks below two, writes fail. With acks=1, this setting does not force two replicas to acknowledge.', 'Con acks=all, min.insync.replicas=2 exige al menos dos miembros en el ISR. Si quedan menos, las escrituras fallan. Con acks=1, esta configuración no obliga a confirmar desde dos réplicas.'),
        B('acks=all and min.insync.replicas work together.', 'acks=all y min.insync.replicas trabajan juntos.'),
      ),
      F(
        B('Prefer an explicit failure', 'Preferí un error explícito'),
        B('A replication factor of three and minimum ISR of two can keep accepting writes after one replica loss. Refusing writes under worse conditions protects the chosen durability contract. It is not a substitute for backups or tested recovery.', 'Con tres réplicas e ISR mínimo de dos, se puede seguir escribiendo tras perder una réplica. Rechazar escrituras en condiciones peores protege la durabilidad elegida. No reemplaza backups ni recuperación probada.'),
        B('An unavailable write can be safer than an acknowledged loss.', 'Una escritura rechazada puede ser más segura que una pérdida confirmada como éxito.'),
      ),
    ],
    B('Change the ISR size and acks. See whether the modeled write is accepted.', 'Cambiá el tamaño del ISR y acks. Mirá si el modelo acepta la escritura.'),
    [
      Q(
        B('ISR has one member, min ISR is 2, acks=all. What happens?', 'El ISR tiene un miembro, el mínimo es 2 y acks=all. ¿Qué pasa?'),
        [B('The write succeeds on one copy', 'La escritura funciona con una copia'), B('The write is rejected or retries until timeout', 'La escritura se rechaza o reintenta hasta el timeout'), B('The write succeeds as soon as the leader has it', 'La escritura funciona apenas la recibe el líder')],
        1,
        B('The current ISR cannot meet the configured minimum. The producer must handle the error.', 'El ISR actual no alcanza el mínimo configurado. El productor tiene que manejar el error.'),
      ),
      Q(
        B('acks=1, min.insync.replicas=2 and the ISR has one member. What happens to the write?', 'acks=1, min.insync.replicas=2 y el ISR tiene un miembro. ¿Qué pasa con la escritura?'),
        [B('It is accepted: with acks=1 only the leader has to acknowledge', 'Se acepta: con acks=1 solo tiene que confirmar el líder'), B('It is rejected with NotEnoughReplicas', 'Se rechaza con NotEnoughReplicas'), B('It waits until a second replica joins the ISR', 'Espera a que una segunda réplica entre al ISR')],
        0,
        B('min.insync.replicas is enforced for acks=all writes. With acks=1 the setting does not protect the write.', 'min.insync.replicas se aplica a las escrituras con acks=all. Con acks=1 la configuración no protege la escritura.'),
      ),
      Q(
        B('What does a successful acks=all acknowledgment tell you?', '¿Qué te dice una confirmación exitosa con acks=all?'),
        [B('The required in-sync replicas stored the record', 'Las réplicas sincronizadas requeridas guardaron el mensaje'), B('A consumer processed the record', 'Un consumidor procesó el mensaje'), B('The record can never be lost, whatever happens', 'El mensaje no puede perderse, pase lo que pase')],
        0,
        B('It is a storage guarantee bounded by the ISR and the minimum you configured. Not a business receipt, not an absolute.', 'Es una garantía de almacenamiento acotada por el ISR y el mínimo que configuraste. No es un recibo de negocio ni un absoluto.'),
      ),
    ],
    [
      prep(10),
      S(
        B('Write with all replicas', 'Escribí con todas las réplicas'),
        B('The topic requires min ISR 3 to demonstrate a failure while keeping controller quorum.', 'El tópico exige ISR mínimo 3 para mostrar una falla sin perder el quórum de controladores.'),
        run('seed 10'),
        B('The write succeeds with three ISR members.', 'La escritura funciona con tres miembros del ISR.'),
      ),
      S(
        B('Lose one replica', 'Perdé una réplica'),
        B('Stop kafka3. Wait until describe shows only two ISR members.', 'Detené kafka3. Esperá hasta que describe muestre solo dos miembros en el ISR.'),
        'docker compose stop kafka3' + '\n' + run('describe 10'),
        B('Two live ISR members; the configured minimum remains 3.', 'Dos miembros vivos en el ISR; el mínimo configurado sigue en 3.'),
      ),
      S(
        B('Observe the refusal', 'Observá el rechazo'),
        B('This failure is intentional. The client uses a bounded delivery timeout.', 'Esta falla es intencional. El cliente tiene un timeout de entrega acotado.'),
        run('seed 10'),
        B('A NotEnoughReplicas error or delivery timeout, not a successful acknowledgment.', 'Un error NotEnoughReplicas o un timeout de entrega, sin confirmación exitosa.'),
      ),
      S(
        B('Restore the contract', 'Recuperá las condiciones'),
        B('Bring the third replica back and retry once all three are in ISR.', 'Recuperá la tercera réplica y reintentá cuando las tres estén en el ISR.'),
        'docker compose up -d --wait' + '\n' + run('describe 10') + '\n' + run('seed 10'),
        B('Writes succeed again.', 'Las escrituras vuelven a funcionar.'),
      ),
    ],
    'producer',
  );

  // 12 Who keeps the cluster’s map?
  add(
    'kraft',
    B('Who keeps the cluster’s map?', '¿Quién guarda el mapa del clúster?'),
    B('KRaft controllers agree on metadata; brokers serve event data.', 'Los controladores KRaft acuerdan metadatos; los brokers sirven eventos.'),
    'quorum',
    [
      F(
        B('Separate data from metadata', 'Separá datos de metadatos'),
        B('Brokers store topic partitions. The KRaft metadata log records the cluster’s structure: topics, partition leadership and configuration. A controller quorum replicates this metadata using consensus.', 'Los brokers guardan particiones de tópicos. El log de metadatos KRaft registra la estructura: tópicos, líderes y configuración. Un quórum de controladores replica esos metadatos mediante consenso.'),
        B('The metadata log is not your orders topic.', 'El log de metadatos no es tu tópico de pedidos.'),
      ),
      F(
        B('A majority must agree', 'Tiene que acordar una mayoría'),
        B('Three controllers need two for a majority. Five need three. One lost controller is tolerable in a healthy three-controller quorum; two lost controllers prevent metadata progress.', 'Tres controladores necesitan dos para tener mayoría. Cinco necesitan tres. Un quórum sano de tres soporta perder uno; perder dos impide avanzar con los metadatos.'),
        B('Quorum size and topic replication factor solve different problems.', 'El tamaño del quórum y el factor de replicación resuelven problemas distintos.'),
      ),
      F(
        B('Respect the lab’s shortcut', 'Entendé el atajo del laboratorio'),
        B('Our nodes run both roles, so stopping one removes a broker and a controller. In production, dedicated controllers isolate resource pressure and failures. Existing data operations and metadata operations can behave differently during quorum loss.', 'Nuestros nodos tienen ambos roles: detener uno quita un broker y un controlador. En producción, separar controladores aísla carga y fallas. Las operaciones de datos y metadatos pueden comportarse distinto al perder quórum.'),
        B('Observe each operation; do not call the entire cluster simply “up.”', 'Observá cada operación; no alcanza con decir que el clúster «anda».'),
      ),
    ],
    B('Remove a controller and count the votes. Restore the majority to allow progress.', 'Quitá un controlador y contá los votos. Recuperá la mayoría para poder avanzar.'),
    [
      Q(
        B('How many healthy voters does a three-controller quorum need?', '¿Cuántos votantes sanos necesita un quórum de tres controladores?'),
        [B('One', 'Uno'), B('Two', 'Dos'), B('All three always', 'Siempre los tres')],
        1,
        B('A majority of three is two. This consensus quorum is separate from the ISR of an application topic.', 'La mayoría de tres es dos. Este quórum de consenso es distinto del ISR de un tópico de aplicación.'),
      ),
      Q(
        B('What does the KRaft metadata log contain?', '¿Qué contiene el log de metadatos de KRaft?'),
        [B('The cluster structure: topics, partition leadership, configuration', 'La estructura del clúster: tópicos, líderes de particiones, configuración'), B('The records of every application topic', 'Los mensajes de todos los tópicos de aplicación'), B('Only the committed offsets of consumer groups', 'Solo los offsets confirmados de los grupos')],
        0,
        B('Metadata and data are separate logs. Your orders topic lives on brokers; the map of the cluster lives in the controller quorum.', 'Metadatos y datos son logs distintos. Tu tópico de pedidos vive en los brokers; el mapa del clúster vive en el quórum de controladores.'),
      ),
      Q(
        B('In this lab, stopping kafka3 removes...', 'En este laboratorio, detener kafka3 quita...'),
        [B('A broker and a controller at once, because each node has both roles', 'Un broker y un controlador a la vez, porque cada nodo tiene los dos roles'), B('Only a broker; the controllers run elsewhere', 'Solo un broker; los controladores corren en otro lado'), B('Only a controller; the broker keeps running', 'Solo un controlador; el broker sigue funcionando')],
        0,
        B('That is the lab shortcut to keep in mind: one stop affects both data serving and metadata voting.', 'Ese es el atajo del laboratorio a tener en cuenta: una detención afecta a la vez el servicio de datos y la votación de metadatos.'),
      ),
    ],
    [
      prep(11),
      S(
        B('Inspect the metadata quorum', 'Inspeccioná el quórum'),
        B('Use the native Kafka tool inside a running broker.', 'Usá la herramienta nativa de Kafka dentro de un broker en ejecución.'),
        'docker compose exec kafka1 /opt/kafka/bin/kafka-metadata-quorum.sh --bootstrap-server kafka1:9092 describe --status',
        B('LeaderId, high watermark and current voters are shown.', 'Aparecen LeaderId, high watermark y votantes actuales.'),
      ),
      S(
        B('Remove one voter', 'Quitá un votante'),
        B('Keep kafka1 and kafka2 running.', 'Dejá kafka1 y kafka2 funcionando.'),
        'docker compose stop kafka3' + '\n' + run('create-extra 11'),
        B('A new topic can still be created with the two-controller majority.', 'Con la mayoría de dos controladores todavía se puede crear un tópico.'),
      ),
      S(
        B('Restore the cluster', 'Recuperá el clúster'),
        B('Bring back kafka3 before continuing. Do not leave future labs without quorum.', 'Recuperá kafka3 antes de seguir. No dejes los siguientes laboratorios sin quórum.'),
        'docker compose up -d --wait' + '\n' + run('cluster'),
        B('Three nodes are available again.', 'Vuelven a estar disponibles los tres nodos.'),
      ),
    ],
    'kraft',
  );

  // 13 History has a horizon
  add(
    'retention',
    B('History has a horizon', 'La historia tiene un horizonte'),
    B('Segments, retention time and the earliest readable offset.', 'Segmentos, tiempo de retención y primer offset legible.'),
    'retention',
    [
      F(
        B('Write in segments', 'Escribí en segmentos'),
        B('Kafka appends records to an active log segment. Older segments become eligible for cleanup. Time retention and size retention limit stored history; size limits apply per partition.', 'Kafka agrega mensajes al segmento activo del log. Los segmentos anteriores pueden quedar habilitados para limpieza. La retención por tiempo y tamaño limita la historia; los límites de tamaño se aplican por partición.'),
        B('Deletion works on segments, not on individual record timers.', 'El borrado trabaja con segmentos, no con cronómetros por mensaje.'),
      ),
      F(
        B('Let the beginning move', 'Dejá que el comienzo avance'),
        B('When old segments are deleted, the earliest offset advances. Offsets are not renumbered. A consumer whose bookmark is now too old needs an offset reset policy or a recovery decision.', 'Cuando se borran segmentos viejos, avanza el primer offset disponible. Los offsets no se renumeran. Un consumidor cuyo señalador quedó atrás necesita una política de reset o una decisión de recuperación.'),
        B('A slow consumer does not prevent ordinary retention deletion.', 'Un consumidor lento no impide el borrado por retención común.'),
      ),
      F(
        B('Budget recovery time', 'Presupuestá tiempo para recuperarte'),
        B('Retention must cover outage time, detection time and catch-up time, with room for growth. Tiered storage can extend storage options when configured with a compatible remote storage implementation; it is not an automatic backup.', 'La retención tiene que cubrir caída, detección y puesta al día, con margen de crecimiento. El almacenamiento por niveles amplía opciones si se configura una implementación remota compatible; no es un backup automático.'),
        B('Your recovery plan must finish before the history disappears.', 'La recuperación tiene que terminar antes de que desaparezca la historia.'),
      ),
    ],
    B('Expire the oldest segment. Notice that surviving offsets keep their numbers.', 'Vencé el segmento más viejo. Fijate que los offsets restantes conservan su número.'),
    [
      Q(
        B('A record was deleted by retention. Can resetting to earliest restore it?', 'La retención borró un mensaje. ¿Resetear a earliest lo recupera?'),
        [B('Yes, earliest means offset zero forever', 'Sí, earliest siempre es el offset cero'), B('No, earliest means the first retained offset', 'No, earliest es el primer offset retenido'), B('Only with a new group ID', 'Solo con otro ID de grupo')],
        1,
        B('Resetting changes the reader position. It cannot recreate data the broker has removed.', 'Resetear cambia la posición del lector. No recrea datos que el broker eliminó.'),
      ),
      Q(
        B('Which unit does time retention delete?', '¿Qué unidad borra la retención por tiempo?'),
        [B('Whole log segments, once they are eligible', 'Segmentos enteros del log, cuando quedan habilitados'), B('Individual records, as each one expires', 'Mensajes individuales, a medida que vence cada uno'), B('The whole partition at once', 'La partición entera de una vez')],
        0,
        B('Kafka works on segments. A record is deleted when its segment is, which is why the beginning moves in jumps.', 'Kafka trabaja con segmentos. Un mensaje se borra cuando se borra su segmento; por eso el comienzo avanza a saltos.'),
      ),
      Q(
        B('Old segments were deleted. What happens to the offsets of the surviving records?', 'Se borraron segmentos viejos. ¿Qué pasa con los offsets de los mensajes que quedan?'),
        [B('They keep their numbers; only the earliest offset advances', 'Conservan su número; solo avanza el primer offset'), B('They are renumbered from zero', 'Se renumeran desde cero'), B('They shift down by the number of deleted records', 'Bajan tantos lugares como mensajes borrados')],
        0,
        B('Offsets are stable addresses. A committed bookmark stays meaningful even after retention runs.', 'Los offsets son direcciones estables. Un señalador confirmado sigue teniendo sentido después de la retención.'),
      ),
    ],
    [
      prep(12),
      S(
        B('Create short-lived history', 'Creá historia de vida corta'),
        B('The topic uses retention.ms=10000 and segment.ms=1000. The lab broker checks retention every 5 seconds.', 'El tópico usa retention.ms=10000 y segment.ms=1000. El broker del laboratorio revisa la retención cada 5 segundos.'),
        run('seed 12') + '\n' + run('offsets 12'),
        B('Beginning 0, end 3 on a fresh topic.', 'Inicio 0, fin 3 en un tópico nuevo.'),
      ),
      S(
        B('Roll the segment', 'Rotá el segmento'),
        B('Wait at least 2 seconds, then append again so the previous segment can close.', 'Esperá al menos 2 segundos y publicá otra vez para que pueda cerrarse el segmento anterior.'),
        run('seed 12'),
        B('New records have higher offsets.', 'Los mensajes nuevos tienen offsets mayores.'),
      ),
      S(
        B('Observe cleanup', 'Observá la limpieza'),
        B('Wait 20 to 40 seconds and inspect. Cleanup is asynchronous; repeat if the beginning has not advanced.', 'Esperá entre 20 y 40 segundos e inspeccioná. La limpieza es asíncrona; repetí si el inicio todavía no avanzó.'),
        run('offsets 12') + '\n' + run('read 12'),
        B('The beginning eventually moves above zero. No offset renumbering occurs.', 'El inicio termina avanzando más allá de cero. No se renumeran offsets.'),
      ),
    ],
    'topic',
  );

  // 14 Keep the latest known value
  add(
    'compaction',
    B('Keep the latest known value', 'Conservá el último valor conocido'),
    B('A log can also rebuild a table.', 'Un log también puede reconstruir una tabla.'),
    'compaction',
    [
      F(
        B('Interpret keys as rows', 'Interpretá las claves como filas'),
        B('A compacted topic eventually retains at least the latest value for each key, subject to tombstone handling. Consumers can rebuild current state by applying changes in partition order. Compaction does not happen at write time.', 'Un tópico compactado conserva eventualmente al menos el último valor de cada clave, sujeto al manejo de tombstones. Un consumidor reconstruye estado aplicando cambios en orden de partición. No se compacta al escribir.'),
        B('Compaction is asynchronous cleanup, not an upsert API.', 'La compactación es limpieza asíncrona, no una API de upsert.'),
      ),
      F(
        B('Leave a deletion marker', 'Dejá una marca de borrado'),
        B('A record with a non-null key and a null value is a tombstone. It tells a rebuilding table to remove the key. Tombstones themselves can be removed after delete.retention.ms. The string "null" is not a null value.', 'Un mensaje con clave no nula y valor nulo es un tombstone. Le indica a una tabla en reconstrucción que borre la clave. El propio tombstone puede eliminarse después de delete.retention.ms. El texto "null" no es un valor nulo.'),
        B('A deletion has to travel before its marker disappears.', 'El borrado tiene que viajar antes de que desaparezca su marca.'),
      ),
      F(
        B('Keep the addresses stable', 'Conservá las direcciones'),
        B('Compaction leaves gaps but preserves the order and offsets of surviving records. With cleanup.policy=compact,delete, retention can also remove segments, including the latest value of a key.', 'La compactación deja huecos, pero conserva orden y offsets de los mensajes restantes. Con cleanup.policy=compact,delete, la retención también puede borrar segmentos, incluso el último valor de una clave.'),
        B('A compacted log is a change history with a cleanup policy.', 'Un log compactado es historia de cambios con una política de limpieza.'),
      ),
    ],
    B('Compact repeated keys, then apply a tombstone. Watch the materialized table change.', 'Compactá claves repetidas y aplicá un tombstone. Mirá cómo cambia la tabla materializada.'),
    [
      Q(
        B('Which value represents a tombstone?', '¿Qué valor representa un tombstone?'),
        [B('The JSON text {"deleted":true}', 'El texto JSON {"deleted":true}'), B('A null value with a non-null key', 'Un valor nulo con clave no nula'), B('An empty string on any key', 'Un texto vacío con cualquier clave')],
        1,
        B('Null is a protocol-level missing value, not a JSON string or a conventional deleted field.', 'Null es un valor ausente a nivel de protocolo, no un texto JSON ni un campo deleted convencional.'),
      ),
      Q(
        B('When does compaction remove an older value for a key?', '¿Cuándo elimina la compactación un valor anterior de una clave?'),
        [B('Asynchronously, when the cleaner runs over closed segments', 'De forma asíncrona, cuando el limpiador recorre segmentos cerrados'), B('At write time, as soon as the newer value arrives', 'Al escribir, apenas llega el valor nuevo'), B('When a consumer reads past it', 'Cuando un consumidor lo pasa de largo')],
        0,
        B('Compaction is cleanup, not an upsert. Until it runs, a reader applying the log in order still gets the right table.', 'La compactación es limpieza, no un upsert. Hasta que corra, un lector que aplica el log en orden igual obtiene la tabla correcta.'),
      ),
      Q(
        B('cleanup.policy=compact,delete. Can the latest value of a key disappear?', 'cleanup.policy=compact,delete. ¿Puede desaparecer el último valor de una clave?'),
        [B('Yes: retention can delete segments, including a key’s latest value', 'Sí: la retención puede borrar segmentos, incluso el último valor de una clave'), B('No: compaction always preserves the latest value', 'No: la compactación siempre conserva el último valor'), B('Only if that value is a tombstone', 'Solo si ese valor es un tombstone')],
        0,
        B('With both policies, time or size retention still applies to segments. Compaction alone keeps the latest value; the combination does not promise it.', 'Con las dos políticas, la retención por tiempo o tamaño sigue aplicando a los segmentos. La compactación sola conserva el último valor; la combinación no lo promete.'),
      ),
    ],
    [
      prep(13),
      S(
        B('Write a changing table', 'Escribí una tabla que cambia'),
        B('Write A=10, B=20, A=30, then a tombstone for B.', 'Escribí A=10, B=20, A=30 y después un tombstone para B.'),
        run('compact-seed 13'),
        B('Four ACK lines. The last one is the tombstone for B: its value is null, which read prints as <null> in the next steps.', 'Cuatro líneas ACK. La última es el tombstone de B: su valor es nulo, y read lo muestra como <null> en los pasos siguientes.'),
      ),
      S(
        B('Rebuild the table', 'Reconstruí la tabla'),
        B('Apply all retained records in order to an in-memory map.', 'Aplicá todos los mensajes retenidos en orden a un mapa en memoria.'),
        run('table 13'),
        B('A=30; B is absent, even before the cleaner runs.', 'A=30; B no está, incluso antes de que corra la limpieza.'),
      ),
      S(
        B('Observe asynchronous cleanup', 'Observá la limpieza asíncrona'),
        B('After 2 seconds, append another A value to roll the segment. Inspect again after 30 to 60 seconds. Cleaner timing is not a correctness condition.', 'Después de 2 segundos, agregá otro valor de A para rotar el segmento. Inspeccioná tras 30 a 60 segundos. El momento de la limpieza no define la corrección.'),
        run('put 13 A 40') + '\n' + run('read 13'),
        B('Older versions may disappear after cleaning. Surviving offsets are unchanged. The reconstructed table still has the latest A.', 'Las versiones viejas pueden desaparecer tras la limpieza. Los offsets restantes no cambian. La tabla sigue teniendo el último A.'),
      ),
    ],
    'design',
  );

  // 15 The crash between two actions
  add(
    'delivery',
    B('The crash between two actions', 'La caída entre dos acciones'),
    B('Process, commit, crash. The order changes the guarantee.', 'Procesar, confirmar, caer. El orden cambia la garantía.'),
    'delivery',
    [
      F(
        B('Commit before the effect', 'Confirmá antes del efecto'),
        B('If the application commits the input offset and then crashes before its effect, the restarted consumer skips work. This is the at-most-once risk: a record may be processed zero times.', 'Si la aplicación confirma el offset y cae antes del efecto, al reiniciar saltea trabajo. Es el riesgo de como máximo una vez: un mensaje puede procesarse cero veces.'),
        B('A bookmark ahead of work can lose work.', 'Un señalador adelantado al trabajo puede hacer perder trabajo.'),
      ),
      F(
        B('Commit after the effect', 'Confirmá después del efecto'),
        B('If the effect succeeds and the app crashes before committing, the record is read again. This is the at-least-once tradeoff: duplicates must be safe. Auto-commit is not proof that business work completed.', 'Si el efecto funciona y la app cae antes de confirmar, el mensaje se relee. Es el costo de al menos una vez: los duplicados tienen que ser seguros. Auto-commit no prueba que terminó el trabajo de negocio.'),
        B('An offset commit and a database write are separate transactions.', 'Un commit de offset y una escritura en una base son transacciones distintas.'),
      ),
      F(
        B('Plan for poison events', 'Prepará el manejo de eventos problemáticos'),
        B('Bound retries. A dead-letter topic can preserve failed events with error context, but publishing there and committing input must be coordinated. Routing around one event can break entity ordering; decide deliberately.', 'Acotá los reintentos. Un tópico de fallas puede conservar eventos con contexto del error, pero su publicación y el commit de entrada necesitan coordinación. Saltear un evento puede romper el orden de la entidad; decidilo a propósito.'),
        B('A dead-letter topic needs an owner and a replay procedure.', 'Un tópico de fallas necesita un responsable y un procedimiento de reproceso.'),
      ),
    ],
    B('Choose where the crash happens. Compare the effect count after restart.', 'Elegí dónde ocurre la caída. Compará cuántos efectos quedan después del reinicio.'),
    [
      Q(
        B('An effect succeeds, then the process crashes before committing. What is the risk?', 'El efecto funciona y el proceso cae antes de confirmar. ¿Cuál es el riesgo?'),
        [B('The input may be processed again', 'La entrada puede procesarse otra vez'), B('Kafka deletes the input', 'Kafka borra la entrada'), B('The broker rolls back the external effect', 'El broker revierte el efecto externo')],
        0,
        B('The durable bookmark still points before that record. The external effect is outside Kafka’s offset transaction.', 'El señalador durable sigue antes del mensaje. El efecto externo está fuera de la transacción de offsets de Kafka.'),
      ),
      Q(
        B('The application commits the offset and then crashes before applying the effect. The restart...', 'La aplicación confirma el offset y después cae antes de aplicar el efecto. El reinicio...'),
        [B('Skips that record: at-most-once', 'Saltea ese mensaje: como máximo una vez'), B('Repeats the effect: at-least-once', 'Repite el efecto: al menos una vez'), B('Blocks until the effect is confirmed', 'Se bloquea hasta confirmar el efecto')],
        0,
        B('The bookmark already points past the record, so nobody comes back for it. Committing first trades duplicates for loss.', 'El señalador ya apunta después del mensaje, así que nadie vuelve por él. Confirmar primero cambia duplicados por pérdida.'),
      ),
      Q(
        B('Why is a dead-letter topic not a complete answer to poison events?', '¿Por qué un tópico de fallas no es una respuesta completa a los eventos problemáticos?'),
        [B('Routing around an event can break per-entity ordering, and the topic needs an owner and a replay procedure', 'Saltear un evento puede romper el orden de la entidad, y el tópico necesita un responsable y un procedimiento de reproceso'), B('Kafka cannot write to two topics from one application', 'Kafka no puede escribir en dos tópicos desde una aplicación'), B('Dead-letter topics are not retained', 'Los tópicos de fallas no se retienen')],
        0,
        B('The mechanism is easy; the policy is the work: what to skip, who looks, how it comes back.', 'El mecanismo es fácil; la política es el trabajo: qué se saltea, quién lo mira, cómo vuelve.'),
      ),
    ],
    [
      prep(14),
      S(
        B('Publish the input', 'Publicá la entrada'),
        B('Each event has an event ID to make duplicates recognizable.', 'Cada evento tiene un ID para poder reconocer duplicados.'),
        run('seed 14'),
        B('Three input events.', 'Tres eventos de entrada.'),
      ),
      S(
        B('Fail after the effect', 'Fallá después del efecto'),
        B('The client writes the first result to a separate effects topic, then exits without committing the input. A nonzero exit is intentional.', 'El cliente escribe el primer resultado en otro tópico de efectos y sale sin confirmar la entrada. La salida con error es intencional.'),
        run('delivery crash'),
        B('EFFECT WRITTEN, followed by an intentional failure.', 'EFFECT WRITTEN, seguido de una falla intencional.'),
      ),
      S(
        B('Restart and inspect', 'Reiniciá e inspeccioná'),
        B('Run without the injected crash, then read the output.', 'Ejecutá sin la caída inyectada y leé la salida.'),
        run('delivery resume') + '\n' + run('read-topic lab14-effects'),
        B('The first event ID appears twice. At-least-once delivery needs duplicate handling.', 'El primer ID de evento aparece dos veces. La entrega al menos una vez necesita manejar duplicados.'),
      ),
    ],
    'design',
  );

  // 16 Two different kinds of duplicate
  add(
    'idempotence',
    B('Two different kinds of duplicate', 'Dos clases distintas de duplicado'),
    B('A network retry is not a repeated business request.', 'Reintentar en la red no es lo mismo que repetir un pedido de negocio.'),
    'idempotence',
    [
      F(
        B('Make producer retries safe', 'Hacé seguros los reintentos del productor'),
        B('An idempotent producer uses a producer identity and sequence numbers. Kafka can recognize retrying the same batch and avoid appending it twice within that protocol. It requires compatible acks, retries and in-flight settings.', 'Un productor idempotente usa identidad de productor y números de secuencia. Kafka reconoce el reintento del mismo lote y evita agregarlo dos veces dentro de ese protocolo. Requiere valores compatibles de acks, retries e in-flight.'),
        B('Enable idempotence explicitly when teaching or reviewing a configuration.', 'Explicitá la idempotencia al enseñar o revisar una configuración.'),
      ),
      F(
        B('Two send calls are two writes', 'Dos llamadas a send son dos escrituras'),
        B('Calling send() twice with identical key and value creates two logical records. Restarting an application and resending a business request is also not automatically deduplicated by producer idempotence.', 'Llamar dos veces a send() con la misma clave y valor crea dos mensajes lógicos. Reiniciar la aplicación y reenviar un pedido de negocio tampoco queda deduplicado automáticamente por la idempotencia del productor.'),
        B('Idempotent production is not business deduplication.', 'La producción idempotente no deduplica el negocio.'),
      ),
      F(
        B('Choose a business identity', 'Elegí una identidad de negocio'),
        B('An idempotent sink records a stable event ID together with its effect in one atomic database transaction. A unique constraint can reject reapplication. An in-memory set is only a demo: it disappears on restart.', 'Un destino idempotente guarda un ID estable de evento junto con su efecto en una transacción atómica de base de datos. Una restricción única puede rechazar la reaplicación. Un set en memoria es solo una demo: desaparece al reiniciar.'),
        B('The deduplication record and the effect must succeed together.', 'El registro de deduplicación y el efecto tienen que funcionar juntos.'),
      ),
    ],
    B('Switch between a transport retry and a second application send. Compare the stored records.', 'Alterná entre un reintento de transporte y otro envío de la aplicación. Compará lo almacenado.'),
    [
      Q(
        B('With idempotence enabled, you call send() twice with the same value. How many records?', 'Con idempotencia activada, llamás dos veces a send() con el mismo valor. ¿Cuántos mensajes?'),
        [B('Always one', 'Siempre uno'), B('Two logical records', 'Dos mensajes lógicos'), B('Zero; duplicate keys are rejected', 'Cero; se rechazan claves repetidas')],
        1,
        B('Idempotence recognizes protocol retries, not the semantic equality of two application sends.', 'La idempotencia reconoce reintentos del protocolo, no la igualdad semántica de dos envíos de la aplicación.'),
      ),
      Q(
        B('What does the idempotent producer use to recognize a retried batch?', '¿Qué usa el productor idempotente para reconocer un lote reintentado?'),
        [B('A producer ID and sequence numbers', 'Un ID de productor y números de secuencia'), B('The record key', 'La clave del mensaje'), B('The event ID inside the value', 'El ID de evento dentro del valor')],
        0,
        B('The broker tracks sequences per producer and partition. It never looks inside your payload.', 'El broker lleva las secuencias por productor y partición. Nunca mira dentro de tu contenido.'),
      ),
      Q(
        B('An idempotent sink must...', 'Un destino idempotente tiene que...'),
        [B('Record the event ID and apply the effect in one atomic transaction', 'Guardar el ID del evento y aplicar el efecto en una misma transacción atómica'), B('Keep a set of seen IDs in memory', 'Mantener un set de IDs vistos en memoria'), B('Rely on the producer’s sequence numbers', 'Confiar en los números de secuencia del productor')],
        0,
        B('If the deduplication record and the effect can succeed separately, a crash between them reopens the duplicate.', 'Si el registro de deduplicación y el efecto pueden funcionar por separado, una caída entre ambos reabre el duplicado.'),
      ),
    ],
    [
      prep(15),
      S(
        B('Send the same event twice', 'Mandá el mismo evento dos veces'),
        B('The sample uses enable.idempotence=true and two separate send calls.', 'La muestra usa enable.idempotence=true y dos llamadas separadas a send.'),
        run('duplicate 15'),
        B('Two acknowledgments with different offsets.', 'Dos confirmaciones con offsets distintos.'),
      ),
      S(
        B('Read the evidence', 'Leé la evidencia'),
        B('Inspect both records and their identical event ID.', 'Inspeccioná ambos mensajes y su ID de evento idéntico.'),
        run('read 15'),
        B('Two copies of the same business event.', 'Dos copias del mismo evento de negocio.'),
      ),
      S(
        B('Demonstrate application deduplication', 'Probá deduplicar en la aplicación'),
        B('The client builds a transient set of event IDs. This illustrates the decision; it is not a durable sink implementation.', 'El cliente arma un set transitorio de IDs. Ilustra la decisión; no implementa un destino durable.'),
        run('dedup 15'),
        B('One APPLY and one SKIP. Explain why production needs atomic persistent storage.', 'Un APPLY y un SKIP. Explicá por qué producción necesita almacenamiento persistente y atómico.'),
      ),
    ],
    'producer',
  );

  // 17 Make the boundary atomic
  add(
    'transactions',
    B('Make the boundary atomic', 'Hacé atómico el límite'),
    B('Output records and input offsets can commit together.', 'Los mensajes de salida y offsets de entrada pueden confirmarse juntos.'),
    'transactions',
    [
      F(
        B('Begin, write, commit or abort', 'Abrir, escribir, confirmar o abortar'),
        B('A transactional producer can write to multiple partitions atomically. A stable transactional.id fences an older producer instance using the same identity. Aborted records may exist physically but are hidden from read_committed consumers.', 'Un productor transaccional puede escribir atómicamente en varias particiones. Un transactional.id estable bloquea una instancia anterior con la misma identidad. Los mensajes abortados pueden existir físicamente, pero read_committed los oculta.'),
        B('Physical presence and committed visibility are different.', 'Estar físicamente presente y ser visible como confirmado son cosas distintas.'),
      ),
      F(
        B('Commit progress with output', 'Confirmá avance junto con salida'),
        B('A Kafka-to-Kafka processor writes its output and calls sendOffsetsToTransaction with the next input offsets and group metadata. The transaction commits both, or neither. Disable input auto-commit.', 'Un procesador de Kafka a Kafka escribe la salida y llama a sendOffsetsToTransaction con los próximos offsets de entrada y metadatos del grupo. La transacción confirma ambos o ninguno. Desactivá auto-commit en la entrada.'),
        B('Exactly-once processing requires the whole read-process-write protocol.', 'Procesar exactamente una vez requiere todo el protocolo de lectura, procesamiento y escritura.'),
      ),
      F(
        B('Name what is outside', 'Nombrá lo que queda afuera'),
        B('Kafka transactions do not include an email, a payment API or an arbitrary database transaction. read_committed waits behind open transactions at the last stable offset; this can affect apparent lag and latency.', 'Las transacciones de Kafka no incluyen un correo, una API de pagos ni una transacción de base arbitraria. read_committed espera detrás de transacciones abiertas en el último offset estable; eso afecta lag aparente y latencia.'),
        B('“Exactly once” must always name its boundary.', '«Exactamente una vez» siempre tiene que decir dentro de qué límite.'),
      ),
    ],
    B('Commit or abort a batch. Toggle the isolation level to compare what readers can see.', 'Confirmá o abortá un lote. Alterná el aislamiento para comparar qué ven los lectores.'),
    [
      Q(
        B('What can a Kafka transaction atomically include?', '¿Qué puede incluir atómicamente una transacción de Kafka?'),
        [B('Kafka output records and consumer offsets', 'Mensajes de salida Kafka y offsets de consumo'), B('Any external payment automatically', 'Cualquier pago externo automáticamente'), B('All HTTP calls in the application', 'Todas las llamadas HTTP de la aplicación')],
        0,
        B('External effects require a separate coordination pattern. Kafka’s atomic boundary covers Kafka records and transactional offset commits.', 'Los efectos externos necesitan otro patrón de coordinación. El límite atómico de Kafka cubre mensajes Kafka y commits transaccionales de offsets.'),
      ),
      Q(
        B('A read_committed consumer reaches an open transaction. What does it see?', 'Un consumidor read_committed llega a una transacción abierta. ¿Qué ve?'),
        [B('It stops at the last stable offset until the transaction commits or aborts', 'Se detiene en el último offset estable hasta que la transacción confirme o aborte'), B('The uncommitted records, flagged as pending', 'Los mensajes sin confirmar, marcados como pendientes'), B('Only the aborted records', 'Solo los mensajes abortados')],
        0,
        B('That waiting is why read_committed can show more apparent lag and latency than read_uncommitted.', 'Esa espera es la razón por la que read_committed puede mostrar más lag aparente y latencia que read_uncommitted.'),
      ),
      Q(
        B('What does a stable transactional.id give you across restarts?', '¿Qué te da un transactional.id estable entre reinicios?'),
        [B('Fencing: an older instance with the same ID is rejected', 'Exclusión: una instancia anterior con el mismo ID queda rechazada'), B('Automatic deduplication of business requests', 'Deduplicación automática de pedidos de negocio'), B('Exactly-once delivery to any external system', 'Entrega exactamente una vez a cualquier sistema externo')],
        0,
        B('Fencing protects the Kafka boundary from a zombie writer. Business deduplication and external effects remain your design.', 'La exclusión protege el límite de Kafka de un escritor zombi. La deduplicación de negocio y los efectos externos siguen siendo tu diseño.'),
      ),
    ],
    [
      prep(16),
      S(
        B('Commit and abort', 'Confirmá y abortá'),
        B('One transaction writes COMMITTED, another writes ABORTED then aborts.', 'Una transacción escribe COMMITTED; otra escribe ABORTED y aborta.'),
        run('transactions 16'),
        B('Both writes reach the log; only one transaction commits.', 'Las dos escrituras llegan al log; solo una transacción confirma.'),
      ),
      S(
        B('Compare isolation', 'Compará el aislamiento'),
        B('Read first without transaction filtering, then with read_committed.', 'Leé primero sin filtrar transacciones y después con read_committed.'),
        run('read 16 read_uncommitted') + '\n' + run('read 16 read_committed'),
        B('Uncommitted sees both values. Committed sees only COMMITTED. Offsets may have gaps from control records.', 'Uncommitted ve ambos valores. Committed solo ve COMMITTED. Puede haber huecos de offsets por mensajes de control.'),
      ),
      S(
        B('Process atomically', 'Procesá atómicamente'),
        B('Seed the input, then run the transactional processor twice. It commits its output and input offsets together.', 'Cargá la entrada y ejecutá dos veces el procesador transaccional. Confirma la salida y los offsets de entrada juntos.'),
        run('seed 16') + '\n' + run('eos 16') + '\n' + run('eos 16'),
        B('The second run emits no new output for already committed input. Inspect the source to see sendOffsetsToTransaction.', 'La segunda corrida no genera salida nueva para entradas ya confirmadas. Mirá sendOffsetsToTransaction en el código.'),
      ),
    ],
    'transactions',
  );

  // 18 A contract that can evolve
  add(
    'schemas',
    B('A contract that can evolve', 'Un contrato que puede evolucionar'),
    B('Bytes need an agreed meaning.', 'Los bytes necesitan un significado acordado.'),
    'schema',
    [
      F(
        B('Separate storage from meaning', 'Separá almacenamiento de significado'),
        B('Kafka brokers accept bytes; they do not inherently validate your JSON business fields. A schema defines the contract. A registry stores schema versions and checks compatibility according to configured rules.', 'Los brokers aceptan bytes; no validan por sí solos los campos de negocio de tu JSON. Un esquema define el contrato. Un registro guarda versiones y comprueba compatibilidad según reglas configuradas.'),
        B('A registry is an ecosystem component, not the Kafka broker.', 'Un registro es un componente del ecosistema, no el broker Kafka.'),
      ),
      F(
        B('Ask who must read whose data', 'Preguntá quién tiene que leer qué'),
        B('Backward compatibility means a new reader can read data written with the old schema. Forward compatibility means an old reader can read new data. Full requires both. Transitive modes compare against all prior registered versions.', 'Compatibilidad hacia atrás significa que un lector nuevo puede leer datos del esquema viejo. Hacia adelante significa que un lector viejo puede leer datos nuevos. Full exige ambas. Los modos transitivos comparan contra todas las versiones registradas previas.'),
        B('Compatibility direction is about reader and writer versions.', 'La dirección de compatibilidad depende de las versiones del lector y escritor.'),
      ),
      F(
        B('Evolve deliberately', 'Evolucioná a propósito'),
        B('In Avro, adding a field with a suitable default can let a new reader consume older data. Changing a string field to an incompatible type can fail. Wire framing and schema-ID placement depend on the registry and serializer.', 'En Avro, agregar un campo con un valor por defecto adecuado puede permitir que el lector nuevo lea datos viejos. Cambiar un string a un tipo incompatible puede fallar. El formato y la ubicación del ID dependen del registro y serializador.'),
        B('A compatible schema change can still change business meaning.', 'Un cambio compatible de esquema igual puede cambiar el significado de negocio.'),
      ),
    ],
    B('Switch from an optional field with a default to an incompatible type change. Inspect the reader/writer contract.', 'Pasá de un campo con valor por defecto a un cambio incompatible de tipo. Inspeccioná el contrato entre lector y escritor.'),
    [
      Q(
        B('Backward compatibility asks whether…', 'La compatibilidad hacia atrás pregunta si…'),
        [B('The old reader can read new data', 'El lector viejo puede leer datos nuevos'), B('The new reader can read old data', 'El lector nuevo puede leer datos viejos'), B('The broker can parse JSON', 'El broker puede interpretar JSON')],
        1,
        B('Backward: new reader, old writer data. The lab uses Avro’s compatibility checker directly so no registry account is needed.', 'Hacia atrás: lector nuevo, datos del escritor viejo. El laboratorio usa directamente el verificador de Avro y no necesita una cuenta de registro.'),
      ),
      Q(
        B('You add a field with a default to an Avro record. Can the new reader read old data?', 'Agregás un campo con valor por defecto a un record Avro. ¿El lector nuevo puede leer datos viejos?'),
        [B('Yes: the default fills the missing field, so the change is backward compatible', 'Sí: el valor por defecto completa el campo que falta, así que el cambio es compatible hacia atrás'), B('No: any new field breaks compatibility', 'No: cualquier campo nuevo rompe la compatibilidad'), B('Only if the registry is in FORWARD mode', 'Solo si el registro está en modo FORWARD')],
        0,
        B('That is the classic safe evolution. Removing the default, or changing a type, is where it breaks.', 'Esa es la evolución segura clásica. Sacar el valor por defecto, o cambiar un tipo, es donde se rompe.'),
      ),
      Q(
        B('You produce bytes that do not match the schema straight to a topic. What does the broker do?', 'Publicás bytes que no cumplen el esquema directo en un tópico. ¿Qué hace el broker?'),
        [B('It stores them: enforcement lives in serializers, consumers and governance', 'Los guarda: el control vive en serializadores, consumidores y gobierno'), B('It rejects them with a schema error', 'Los rechaza con un error de esquema'), B('It converts them to the registered schema', 'Los convierte al esquema registrado')],
        0,
        B('The broker stores bytes. A registry and validating serializers are ecosystem components, not the broker.', 'El broker guarda bytes. Un registro y serializadores que validan son componentes del ecosistema, no el broker.'),
      ),
    ],
    [
      prep(17),
      S(
        B('Check the compatible change', 'Verificá el cambio compatible'),
        B('The client tests an Avro v2 reader with a new currency field and default against v1 writer data. Schemas ship with the source.', 'El cliente compara un lector Avro v2 que agrega currency con valor por defecto contra datos del escritor v1. Los esquemas vienen en el código.'),
        run('schema compatible'),
        B('COMPATIBLE. This is the same underlying reader/writer compatibility idea a registry enforces.', 'COMPATIBLE. Es la misma idea de compatibilidad entre lector y escritor que aplica un registro.'),
      ),
      S(
        B('Break the contract', 'Rompé el contrato'),
        B('Change the amount field from string to an incompatible record type in the supplied example.', 'El ejemplo cambia amount de string a un tipo record incompatible.'),
        run('schema incompatible'),
        B('INCOMPATIBLE with a type mismatch explanation.', 'INCOMPATIBLE con una explicación de incompatibilidad de tipos.'),
      ),
      S(
        B('Prove the broker is not the validator', 'Probá que el broker no valida'),
        B('Produce arbitrary bytes as a string into the lesson topic. This deliberately bypasses an Avro serializer.', 'Publicá bytes arbitrarios como texto en el tópico. Esto evita deliberadamente el serializador Avro.'),
        run('put 17 order-1 not-avro') + '\n' + run('read 17'),
        B('Kafka stores the value. Contract enforcement belongs in serializers, consumers and your governance.', 'Kafka guarda el valor. El contrato se hace cumplir en serializadores, consumidores y tus controles.'),
      ),
    ],
    'schema',
  );

  // 19 Move data without a custom loop
  add(
    'connect',
    B('Move data without a custom loop', 'Mové datos sin escribir otro loop'),
    B('Workers run connectors. Connectors create tasks.', 'Los workers ejecutan conectores. Los conectores crean tareas.'),
    'connect',
    [
      F(
        B('Four pieces, four roles', 'Cuatro piezas, cuatro funciones'),
        B('A worker is the runtime. A connector defines a data integration. A task performs a portion of the work. A converter translates Connect’s data representation to or from Kafka bytes. A source imports; a sink exports.', 'Un worker es el entorno de ejecución. Un conector define una integración. Una tarea hace parte del trabajo. Un convertidor traduce entre la representación de Connect y los bytes de Kafka. Un source importa; un sink exporta.'),
        B('The number of tasks depends on what the connector can split.', 'La cantidad de tareas depende de qué puede dividir el conector.'),
      ),
      F(
        B('Keep coordination durable', 'Hacé durable la coordinación'),
        B('Distributed workers use internal Kafka topics for connector configurations, status and source offsets. Sink progress uses consumer-group offsets. Standalone mode uses local configuration and a local source-offset file.', 'Los workers distribuidos usan tópicos internos para configuraciones, estados y posiciones de origen. Un sink usa offsets de grupo consumidor. El modo standalone usa configuración local y un archivo local de posiciones de origen.'),
        B('Source position and Kafka consumer offset are different coordinates.', 'La posición en el origen y el offset de consumo Kafka son coordenadas distintas.'),
      ),
      F(
        B('Inspect the tasks too', 'Inspeccioná también las tareas'),
        B('A connector can show RUNNING while one of its tasks is FAILED. Check task status, error traces, source progress and actual data flow. This small lab uses the bundled file connector in standalone mode.', 'Un conector puede mostrar RUNNING mientras una tarea está FAILED. Revisá tareas, errores, avance del origen y flujo real. Este laboratorio usa el conector de archivos incluido, en modo standalone.'),
        B('A green connector is not proof that records are moving.', 'Un conector en verde no prueba que estén pasando mensajes.'),
      ),
    ],
    B('Inspect worker, connector, task and converter. Fail the task and compare its state with the connector.', 'Inspeccioná worker, conector, tarea y convertidor. Hacé fallar la tarea y compará su estado con el conector.'),
    [
      Q(
        B('The connector status is RUNNING. Is the pipeline healthy?', 'El conector dice RUNNING. ¿La integración está sana?'),
        [B('Always', 'Siempre'), B('Not necessarily; inspect tasks and data progress', 'No necesariamente; revisá tareas y avance'), B('Only if there is one worker', 'Solo si hay un worker')],
        1,
        B('Connector lifecycle and task execution have separate status. Real data progress is the end-to-end check.', 'El ciclo de vida del conector y la ejecución de tareas tienen estados separados. El avance real verifica el flujo completo.'),
      ),
      Q(
        B('Where does a distributed Connect cluster keep connector configurations and source progress?', '¿Dónde guarda un clúster Connect distribuido las configuraciones de conectores y el avance de origen?'),
        [B('In internal Kafka topics', 'En tópicos internos de Kafka'), B('In a local file on each worker', 'En un archivo local de cada worker'), B('In the consumer group of the sink', 'En el grupo de consumidores del sink')],
        0,
        B('Standalone mode uses local files, which is what this lab runs. Distributed workers coordinate through Kafka itself.', 'El modo standalone usa archivos locales, que es lo que corre este laboratorio. Los workers distribuidos se coordinan a través del propio Kafka.'),
      ),
      Q(
        B('What does a converter do?', '¿Qué hace un convertidor?'),
        [B('Translates between Connect’s data representation and Kafka bytes', 'Traduce entre la representación de datos de Connect y los bytes de Kafka'), B('Splits a connector into tasks', 'Divide un conector en tareas'), B('Reads lines from the source file', 'Lee líneas del archivo de origen')],
        0,
        B('Connector, task and converter are three roles. Mixing them up is the usual source of debugging confusion.', 'Conector, tarea y convertidor son tres funciones. Confundirlas es la fuente habitual de confusión al depurar.'),
      ),
    ],
    [
      prep(18),
      S(
        B('Start a file source', 'Arrancá un origen de archivo'),
        B('The optional service runs the official Kafka file connector. Its sample file and offsets live on a dedicated volume.', 'El servicio opcional ejecuta el conector oficial de archivos. El archivo de muestra y sus posiciones viven en un volumen propio.'),
        'docker compose --profile connect up -d connect',
        B('A standalone Connect worker starts on internal port 8083.', 'Arranca un worker Connect standalone en el puerto interno 8083.'),
      ),
      S(
        B('Append a line', 'Agregá una línea'),
        B('The helper appends to the connector’s source file inside the container.', 'El ayudante agrega una línea al archivo de origen dentro del contenedor.'),
        'docker compose exec connect sh /course/connect/append.sh',
        B('A new line is added to the file. The connector publishes it into lab18.', 'Se agrega una línea al archivo. El conector la publica en lab18.'),
      ),
      S(
        B('Inspect task and data', 'Inspeccioná tarea y datos'),
        B('Read the Connect REST status from the client, then read Kafka.', 'Consultá el estado REST de Connect desde el cliente y después leé Kafka.'),
        run('connect-status') + '\n' + run('read 18'),
        B('Connector and task state plus the file line in Kafka. If startup is slow, repeat after a few seconds.', 'Estado de conector y tarea, más la línea en Kafka. Si demora en arrancar, repetí después de unos segundos.'),
      ),
      S(
        B('Stop the optional service', 'Detené el servicio opcional'),
        B('Release memory before continuing. Its offset file remains in the volume.', 'Liberá memoria antes de seguir. El archivo de posiciones queda en el volumen.'),
        'docker compose --profile connect stop connect',
        B('Connect stops; Kafka stays up.', 'Connect se detiene; Kafka sigue funcionando.'),
      ),
    ],
    'connect',
  );

  // 20 From a database to an event
  add(
    'cdc-outbox',
    B('From a database to an event', 'De una base de datos a un evento'),
    B('CDC captures changes. An outbox gives them business intent.', 'CDC captura cambios. Un outbox les da intención de negocio.'),
    'outbox',
    [
      F(
        B('Capture the database’s log', 'Capturá el log de la base'),
        B('Change data capture reads committed database changes, often starting with a snapshot then streaming a transaction log. Inserts, updates and deletes are database facts, not automatically well-designed business events.', 'La captura de cambios lee cambios confirmados, a menudo empezando con un snapshot y siguiendo con el log transaccional. Altas, cambios y bajas son hechos de la base, no automáticamente buenos eventos de negocio.'),
        B('CDC is not the same as event sourcing.', 'CDC no es lo mismo que event sourcing.'),
      ),
      F(
        B('Avoid the dual-write gap', 'Evitá el hueco de la doble escritura'),
        B('Writing a database row and then publishing to Kafka creates a crash window. An outbox writes the business row and an event row in the same database transaction. A relay or CDC connector later publishes the outbox.', 'Escribir una fila y después publicar en Kafka deja una ventana de falla. Un outbox escribe la fila de negocio y la del evento en la misma transacción de base. Un relay o conector CDC publica el outbox después.'),
        B('Atomic creation does not mean duplicate-free relay.', 'Crear atómicamente no significa retransmitir sin duplicados.'),
      ),
      F(
        B('Preserve identity across retries', 'Conservá la identidad al reintentar'),
        B('The outbox event ID survives relay retries. Consumers can deduplicate it. The lab uses PostgreSQL and a small polling relay so the crash boundary is visible; it is not a Debezium deployment.', 'El ID del evento de outbox se conserva en los reintentos. Los consumidores pueden deduplicarlo. El laboratorio usa PostgreSQL y un relay por polling para mostrar el límite de falla; no es un despliegue de Debezium.'),
        B('An outbox solves atomic event creation; delivery still needs a policy.', 'El outbox resuelve crear el evento atómicamente; la entrega sigue necesitando una política.'),
      ),
    ],
    B('Crash between the database commit and publication, then replay the outbox. The event remains recoverable.', 'Caé entre el commit de base y la publicación; después releé el outbox. El evento sigue recuperable.'),
    [
      Q(
        B('What must be in one database transaction for an outbox?', '¿Qué tiene que estar en una misma transacción de base para un outbox?'),
        [B('The business change and the outbox row', 'El cambio de negocio y la fila de outbox'), B('Every downstream consumer', 'Todos los consumidores posteriores'), B('The Kafka broker’s entire log', 'El log completo del broker Kafka')],
        0,
        B('The database commits both rows together. Publication is a separate, retryable stage that can produce duplicates.', 'La base confirma ambas filas juntas. La publicación es otra etapa, reintentable y capaz de duplicar.'),
      ),
      Q(
        B('Why does writing a row and then publishing to Kafka need an outbox?', '¿Por qué escribir una fila y después publicar en Kafka necesita un outbox?'),
        [B('A crash between the two writes loses the event or the row; the outbox makes creation atomic', 'Una caída entre las dos escrituras pierde el evento o la fila; el outbox hace atómica la creación'), B('Kafka cannot be called from a database transaction', 'Kafka no se puede llamar desde una transacción de base'), B('To make publishing faster', 'Para publicar más rápido')],
        0,
        B('The dual-write gap is a crash window. The outbox closes it by making the event a row in the same transaction.', 'El hueco de la doble escritura es una ventana de falla. El outbox lo cierra haciendo del evento una fila de la misma transacción.'),
      ),
      Q(
        B('The relay crashed after Kafka acknowledged and before marking the row sent. What happens next?', 'El relay cayó después de la confirmación de Kafka y antes de marcar la fila como enviada. ¿Qué pasa después?'),
        [B('The retry publishes the event again; consumers deduplicate by event ID', 'El reintento publica el evento otra vez; los consumidores deduplican por ID de evento'), B('Kafka deletes the first copy', 'Kafka borra la primera copia'), B('The database rolls back the order', 'La base revierte el pedido')],
        0,
        B('An outbox solves atomic creation; delivery is still at-least-once and needs a policy on the reading side.', 'El outbox resuelve la creación atómica; la entrega sigue siendo al menos una vez y necesita una política del lado que lee.'),
      ),
    ],
    [
      prep(19),
      S(
        B('Start PostgreSQL', 'Arrancá PostgreSQL'),
        B('The optional database has sample-only credentials and no published host port.', 'La base opcional usa credenciales de ejemplo y no publica un puerto hacia tu computadora.'),
        'docker compose --profile database up -d --wait postgres',
        B('PostgreSQL becomes healthy.', 'PostgreSQL queda saludable.'),
      ),
      S(
        B('Commit the order and outbox', 'Confirmá pedido y outbox'),
        B('The Java client uses one database transaction. Kafka is not called in this step.', 'El cliente Java usa una transacción de base. Este paso no llama a Kafka.'),
        run('outbox create'),
        B('One order and one event row commit together. A repeated run uses the same stable demo ID safely.', 'Se confirman juntos un pedido y una fila de evento. Repetir usa de forma segura el mismo ID de demo.'),
      ),
      S(
        B('Publish, then crash', 'Publicá y caé'),
        B('The relay writes to Kafka and fails before marking the row sent. The nonzero exit is intentional.', 'El relay escribe en Kafka y falla antes de marcar la fila como enviada. La salida con error es intencional.'),
        run('outbox crash'),
        B('The event is in Kafka and still pending in the outbox.', 'El evento está en Kafka y sigue pendiente en el outbox.'),
      ),
      S(
        B('Retry and inspect', 'Reintentá e inspeccioná'),
        B('Retry the relay and inspect stable event IDs. Stop PostgreSQL when done.', 'Reintentá el relay e inspeccioná los IDs estables. Al terminar, detené PostgreSQL.'),
        run('outbox relay') + '\n' + run('read 19') + '\n' + 'docker compose --profile database stop postgres',
        B('Two copies can share one event ID. Explain how an idempotent sink would apply it once.', 'Dos copias pueden compartir un ID. Explicá cómo un destino idempotente lo aplicaría una vez.'),
      ),
    ],
    'cdc',
  );

  // 21 A stream becomes a table
  add(
    'streams',
    B('A stream becomes a table', 'Un flujo se convierte en tabla'),
    B('Kafka Streams is a library inside your application.', 'Kafka Streams es una biblioteca dentro de tu aplicación.'),
    'streams',
    [
      F(
        B('Describe a topology', 'Describí una topología'),
        B('A KStream is a sequence of events. A KTable interprets keyed updates as a changing table. A topology connects operators such as filter, map, groupByKey and count. Kafka Streams runs in your Java process.', 'Un KStream es una secuencia de eventos. Una KTable interpreta actualizaciones por clave como una tabla cambiante. Una topología conecta operadores como filter, map, groupByKey y count. Kafka Streams corre en tu proceso Java.'),
        B('Kafka Streams is not a separate broker service.', 'Kafka Streams no es otro servicio del broker.'),
      ),
      F(
        B('Back up local state', 'Respaldá el estado local'),
        B('Stateful operators use local stores and changelog topics. A task can restore its store from the changelog after losing local state. application.id identifies the application’s group and internal topic namespace.', 'Los operadores con estado usan stores locales y tópicos changelog. Una tarea puede restaurar su store desde el changelog si pierde el estado local. application.id identifica el grupo y el espacio de nombres de tópicos internos.'),
        B('Local state is useful; a changelog makes it recoverable.', 'El estado local es útil; el changelog lo hace recuperable.'),
      ),
      F(
        B('Changing keys changes the plan', 'Cambiar claves cambia el plan'),
        B('A key-changing operation before grouping or joining can require a repartition topic. Partitions determine task parallelism. The lab builds a real keyed count with exactly_once_v2 and a named store.', 'Cambiar claves antes de agrupar o hacer un join puede requerir un tópico de reparticionado. Las particiones determinan el paralelismo de tareas. El laboratorio arma un conteo real por clave con exactly_once_v2 y un store con nombre.'),
        B('Inspect the topology and internal topics, not just the output.', 'Inspeccioná topología y tópicos internos, además de la salida.'),
      ),
    ],
    B('Apply events to a keyed count and rebuild the state from its changelog.', 'Aplicá eventos a un conteo por clave y reconstruí el estado desde su changelog.'),
    [
      Q(
        B('How does a stateful Streams task recover lost local state?', '¿Cómo recupera una tarea Streams el estado local perdido?'),
        [B('From its changelog, when configured for logging', 'Desde su changelog, si tiene logging configurado'), B('From the input topic, by reprocessing everything from offset 0', 'Desde el tópico de entrada, reprocesando todo desde el offset 0'), B('It cannot recover', 'No puede recuperarlo')],
        0,
        B('Changelog topics back the state store. Restore time depends on retained state size and available resources.', 'Los tópicos changelog respaldan el store. El tiempo de restauración depende del estado retenido y los recursos disponibles.'),
      ),
      Q(
        B('Where does Kafka Streams run?', '¿Dónde corre Kafka Streams?'),
        [B('Inside your application process, as a library', 'Dentro del proceso de tu aplicación, como biblioteca'), B('As a separate service on the broker', 'Como un servicio aparte en el broker'), B('Inside Kafka Connect workers', 'Dentro de los workers de Kafka Connect')],
        0,
        B('No cluster to install: the topology, its tasks and their local stores live in your JVM.', 'No hay clúster que instalar: la topología, sus tareas y sus stores locales viven en tu JVM.'),
      ),
      Q(
        B('You change the key before groupByKey. What may the topology need?', 'Cambiás la clave antes de groupByKey. ¿Qué puede necesitar la topología?'),
        [B('A repartition topic', 'Un tópico de reparticionado'), B('A second application.id', 'Un segundo application.id'), B('A larger replication factor', 'Un factor de replicación mayor')],
        0,
        B('Grouping needs records with the same key on the same partition; a key change breaks that, so Streams reshuffles through Kafka.', 'Agrupar necesita que los mensajes de una misma clave estén en la misma partición; cambiar la clave rompe eso, así que Streams los reacomoda a través de Kafka.'),
      ),
    ],
    [
      prep(20),
      S(
        B('Run the topology', 'Ejecutá la topología'),
        B('Keep the process in terminal A. It counts events per key and writes updates to lab20-counts.', 'Dejá el proceso en la terminal A. Cuenta eventos por clave y escribe actualizaciones en lab20-counts.'),
        run('streams 20'),
        B('Topology description and eventually RUNNING.', 'Descripción de topología y, después, RUNNING.'),
      ),
      S(
        B('Feed and inspect', 'Alimentá e inspeccioná'),
        B('In terminal B publish orders and read the output. Cache is disabled for visible updates.', 'En B publicá pedidos y leé la salida. La caché está desactivada para que se vean las actualizaciones.'),
        run('seed 20') + '\n' + run('read-topic lab20-counts read_committed'),
        B('Counts increase for repeated keys. Stop A with Ctrl+C.', 'Los conteos aumentan para claves repetidas. Detené A con Ctrl+C.'),
      ),
      S(
        B('Restore in a fresh container', 'Restaurá en un contenedor nuevo'),
        B('Run the topology again. Its temporary local state is gone, but its Kafka changelog remains. Then seed again from B.', 'Ejecutá otra vez la topología. Su estado local temporal ya no está, pero el changelog sigue en Kafka. Después volvé a publicar desde B.'),
        run('streams 20'),
        B('Counts continue after restoration instead of restarting at zero. Stop the process when done.', 'Los conteos continúan tras restaurar, sin empezar de cero. Al terminar, detené el proceso.'),
      ),
    ],
    'streams',
  );

  // 22 Which minute does it belong to?
  add(
    'time-windows',
    B('Which minute does it belong to?', '¿A qué minuto pertenece?'),
    B('Event time, stream time, grace and joins.', 'Hora del evento, hora del flujo, tolerancia y joins.'),
    'windows',
    [
      F(
        B('Use the event’s clock', 'Usá el reloj del evento'),
        B('Processing time is when your code runs. Event time is when the event happened. Kafka Streams uses record timestamps by default. Its stream time advances with the maximum observed timestamp for the task; wall-clock waiting alone does not advance it.', 'La hora de procesamiento es cuando corre tu código. La del evento es cuando ocurrió el hecho. Streams usa por defecto los timestamps del mensaje. Su hora de flujo avanza con el máximo timestamp observado por la tarea; esperar al reloj de pared no la avanza.'),
        B('Late arrival is measured relative to stream progress.', 'La llegada tardía se mide contra el avance del flujo.'),
      ),
      F(
        B('Give late events a budget', 'Dale un margen a lo tardío'),
        B('A tumbling window puts records into non-overlapping time buckets. Grace allows out-of-order events until the window closes relative to stream time. After that, a late record is dropped from the aggregation.', 'Una ventana fija pone mensajes en intervalos sin solapamiento. La tolerancia permite desorden hasta que cierre la ventana respecto de la hora del flujo. Después, un mensaje tardío se descarta de la agregación.'),
        B('A longer grace period trades result finality for completeness.', 'Más tolerancia intercambia rapidez del resultado final por completitud.'),
      ),
      F(
        B('Join on key and time', 'Hacé joins por clave y tiempo'),
        B('Stream-stream joins need matching keys and a time window. Stream-table joins enrich an event from table state under the chosen semantics. Co-partitioning and compatible key serializers matter. Unbounded waits create unbounded state.', 'Un join entre flujos necesita claves coincidentes y una ventana. Un join flujo-tabla enriquece con el estado de la tabla según la semántica elegida. Importan el coparticionado y serializadores compatibles. Esperar sin límite acumula estado sin límite.'),
        B('A join is a state and time design, not just a SQL word.', 'Un join requiere diseñar estado y tiempo; no alcanza con la palabra SQL.'),
      ),
    ],
    B('Send an on-time, late-but-accepted, or too-late event. Compare the same window’s count.', 'Mandá un evento en hora, uno tardío aceptable o uno demasiado tarde. Compará el conteo de la misma ventana.'),
    [
      Q(
        B('Does waiting one real minute necessarily advance Kafka Streams stream time?', '¿Esperar un minuto real necesariamente avanza la hora del flujo en Streams?'),
        [B('Yes, it uses the wall clock', 'Sí, usa el reloj de pared'), B('No, event timestamps advance stream time', 'No, la avanzan los timestamps de eventos'), B('Only if the consumer keeps polling', 'Solo si el consumidor sigue haciendo poll')],
        1,
        B('Event-time operations progress with observed record timestamps. Wall-clock punctuation is a separate mechanism.', 'Las operaciones por hora de evento avanzan con timestamps observados. La puntuación por reloj de pared es otro mecanismo.'),
      ),
      Q(
        B('Window [0, 10 s) with 5 s grace. Stream time is 12 s and a record with t = 4 s arrives.', 'Ventana [0, 10 s) con 5 s de tolerancia. La hora del flujo es 12 s y llega un mensaje con t = 4 s.'),
        [B('It is accepted and updates the window', 'Se acepta y actualiza la ventana'), B('It is dropped as late', 'Se descarta por tardío'), B('It opens a new window', 'Abre una ventana nueva')],
        0,
        B('The window closes at 10 + 5 = 15 s of stream time. At 12 s it is still open.', 'La ventana cierra a los 10 + 5 = 15 s de hora del flujo. A los 12 s sigue abierta.'),
      ),
      Q(
        B('A stream-stream join needs...', 'Un join entre dos flujos necesita...'),
        [B('Matching keys within a time window, with co-partitioned inputs', 'Claves coincidentes dentro de una ventana de tiempo, con entradas coparticionadas'), B('Only matching keys, at any time', 'Solo claves coincidentes, en cualquier momento'), B('A table on one of the two sides', 'Una tabla de uno de los dos lados')],
        0,
        B('Without a window the state to hold is unbounded. Without co-partitioning the matching records may never meet in the same task.', 'Sin ventana, el estado a guardar no tiene límite. Sin coparticionado, los mensajes que coinciden pueden no encontrarse nunca en la misma tarea.'),
      ),
    ],
    [
      prep(21),
      S(
        B('Start a windowed count', 'Arrancá un conteo por ventana'),
        B('In terminal A, run a real Streams topology with 10-second windows and 5-second grace.', 'En A ejecutá una topología Streams real con ventanas de 10 segundos y tolerancia de 5.'),
        run('windows 21'),
        B('The topology becomes RUNNING.', 'La topología queda RUNNING.'),
      ),
      S(
        B('Send controlled timestamps', 'Mandá timestamps controlados'),
        B('In terminal B send records in the order t=1s, 12s, 4s, 30s, 2s, all on the same partition.', 'En B mandá mensajes en orden t=1s, 12s, 4s, 30s, 2s, todos en la misma partición.'),
        run('window-seed 21'),
        B('t=4s can still update [0,10). After t=30s, t=2s is too late.', 't=4s todavía puede actualizar [0,10). Después de t=30s, t=2s llega demasiado tarde.'),
      ),
      S(
        B('Inspect the window', 'Inspeccioná la ventana'),
        B('Read the windowed output. Updates are intermediate results, not only final results. Stop A when done.', 'Leé la salida por ventana. Las actualizaciones son resultados intermedios, no solo finales. Al terminar, detené A.'),
        run('read-topic lab21-windows read_committed'),
        B('The first window reaches count 2; the final too-late event does not make it 3.', 'La primera ventana llega a 2; el último evento tardío no la lleva a 3.'),
      ),
    ],
    'windows',
  );

  // 23 Identity, permission, privacy
  add(
    'security',
    B('Identity, permission, privacy', 'Identidad, permiso, privacidad'),
    B('Authentication, authorization and encryption answer different questions.', 'Autenticación, autorización y cifrado responden preguntas distintas.'),
    'security',
    [
      F(
        B('Know who is connecting', 'Sabé quién se conecta'),
        B('TLS can encrypt connections and optionally authenticate clients with certificates. SASL authenticates a principal using mechanisms such as SCRAM or OAuth. A password on a plaintext connection is not confidentiality.', 'TLS puede cifrar conexiones y opcionalmente autenticar clientes con certificados. SASL autentica un principal con mecanismos como SCRAM u OAuth. Una contraseña en una conexión sin cifrar no da confidencialidad.'),
        B('Authentication asks “who are you?”', 'La autenticación pregunta «¿quién sos?».'),
      ),
      F(
        B('Grant the smallest useful permission', 'Otorgá el permiso mínimo útil'),
        B('ACLs decide whether a principal can perform an operation on a resource: read a topic, write a topic, use a group. Authentication alone does not authorize those operations.', 'Las ACL deciden si un principal puede operar sobre un recurso: leer un tópico, escribirlo o usar un grupo. Autenticarse no autoriza por sí solo esas operaciones.'),
        B('Authorization asks “what may you do?”', 'La autorización pregunta «¿qué podés hacer?».'),
      ),
      F(
        B('Keep the lab boundary explicit', 'Dejá explícito el límite del laboratorio'),
        B('The main lab uses plaintext on an isolated Docker network and host ports bound to 127.0.0.1. The optional ACL broker uses SASL/PLAIN only on an internal network, with public demo credentials. It teaches authorization, not production security.', 'El laboratorio principal usa plaintext en una red Docker aislada y puertos de host ligados a 127.0.0.1. El broker opcional de ACL usa SASL/PLAIN solo en la red interna, con credenciales públicas de demo. Enseña autorización, no seguridad de producción.'),
        B('Production needs TLS, secret management, rotation and audited least privilege.', 'Producción necesita TLS, gestión y rotación de secretos, y mínimo privilegio auditado.'),
      ),
    ],
    B('Switch from a writer to a reader principal and try a write. Identity stays valid while permission changes.', 'Pasá de un principal escritor a uno lector e intentá escribir. La identidad sigue siendo válida, pero cambia el permiso.'),
    [
      Q(
        B('A client is authenticated. Does that guarantee it can write any topic?', 'Un cliente está autenticado. ¿Eso garantiza que pueda escribir cualquier tópico?'),
        [B('Yes', 'Sí'), B('No; authorization is a separate check', 'No; la autorización es otra verificación'), B('Only for topics it has already read from', 'Solo en los tópicos de los que ya leyó')],
        1,
        B('A valid identity still needs permission for each requested resource and operation.', 'Una identidad válida igual necesita permiso para cada recurso y operación.'),
      ),
      Q(
        B('What does SASL/PLAIN on a plaintext listener give you, and what does it not?', '¿Qué te da SASL/PLAIN en un listener sin cifrar, y qué no?'),
        [B('Authentication, but no confidentiality: credentials travel unencrypted', 'Autenticación, pero no confidencialidad: las credenciales viajan sin cifrar'), B('Both authentication and encryption', 'Autenticación y cifrado a la vez'), B('Authorization for every topic', 'Autorización sobre todos los tópicos')],
        0,
        B('Who you are, what you may do and who can read the wire are three separate questions. Only TLS answers the third.', 'Quién sos, qué podés hacer y quién puede leer el cable son tres preguntas distintas. Solo TLS contesta la tercera.'),
      ),
      Q(
        B('A principal has READ on a topic and no WRITE. It tries to produce.', 'Un principal tiene READ sobre un tópico y no tiene WRITE. Intenta publicar.'),
        [B('TopicAuthorizationException', 'TopicAuthorizationException'), B('The write succeeds: READ implies WRITE', 'La escritura funciona: READ implica WRITE'), B('The broker creates the missing ACL automatically', 'El broker crea la ACL que falta automáticamente')],
        0,
        B('Permissions are per operation and resource. In this lab the client also turns off idempotence so the denial shows at the topic check.', 'Los permisos son por operación y recurso. En este laboratorio el cliente además desactiva la idempotencia para que el rechazo aparezca en el control del tópico.'),
      ),
    ],
    [
      prep(22),
      S(
        B('Start the ACL sandbox', 'Arrancá el entorno de ACL'),
        B('This is a separate single-node broker with no host port. Demo credentials are intentionally public.', 'Es otro broker de un solo nodo, sin puerto publicado. Las credenciales de demo son públicas a propósito.'),
        'docker compose --profile security up -d --wait secure',
        B('The secure service is healthy. It uses authentication plus ACLs, without TLS in this isolated demo.', 'El servicio secure está saludable. Usa autenticación y ACL, sin TLS en esta demo aislada.'),
      ),
      S(
        B('Apply least privilege', 'Aplicá mínimo privilegio'),
        B('The admin creates a topic, grants a writer permission to write, and grants a reader permission to read.', 'El administrador crea un tópico, permite escribir al escritor y leer al lector.'),
        run('acl setup'),
        B('ACLs created for User:writer and User:reader.', 'ACL creadas para User:writer y User:reader.'),
      ),
      S(
        B('Compare authorized and denied', 'Compará permitido y denegado'),
        B('Try one write as each principal. A denied write is the expected result. The client disables producer idempotence for this test on purpose: an idempotent producer first requests a producer id, and that request is authorized by IDEMPOTENT_WRITE on the cluster or WRITE on some topic, so the reader would fail earlier with ClusterAuthorizationException instead of reaching the topic permission check.', 'Probá una escritura con cada principal. El rechazo de una es el resultado esperado. El cliente desactiva la idempotencia del productor en esta prueba a propósito: un productor idempotente primero pide un id de productor, y ese pedido se autoriza con IDEMPOTENT_WRITE sobre el clúster o WRITE sobre algún tópico, así que el lector fallaría antes con ClusterAuthorizationException en vez de llegar al control de permisos del tópico.'),
        run('acl writer') + '\n' + run('acl reader'),
        B('Writer succeeds. Reader gets TopicAuthorizationException. Valid credentials do not imply write permission.', 'Writer puede escribir. Reader recibe TopicAuthorizationException. Credenciales válidas no implican permiso de escritura.'),
      ),
      S(
        B('Stop the sandbox', 'Detené el entorno'),
        B('Release its resources. The main course cluster remains running.', 'Liberá sus recursos. El clúster principal sigue funcionando.'),
        'docker compose --profile security stop secure',
        B('The optional broker stops.', 'El broker opcional se detiene.'),
      ),
    ],
    'security',
  );

  // 24 Observe the system, not one light
  add(
    'operations',
    B('Observe the system, not one light', 'Observá el sistema, no una luz'),
    B('Use metrics, logs and a business-level probe together.', 'Combiná métricas, logs y una prueba de negocio.'),
    'metrics',
    [
      F(
        B('Start with a user-visible question', 'Empezá con una pregunta visible para el usuario'),
        B('“Did this order arrive within our target?” is more useful than “is the process running?” Measure end-to-end latency and correctness, then use broker and client metrics to explain the result.', '«¿Llegó este pedido dentro del objetivo?» sirve más que «¿está vivo el proceso?». Medí latencia de punta a punta y corrección; después usá métricas de brokers y clientes para explicar el resultado.'),
        B('An uptime check is not a delivery check.', 'Verificar disponibilidad no verifica entrega.'),
      ),
      F(
        B('Look at pressure and replication', 'Mirá presión y replicación'),
        B('Track under-replicated partitions, offline partitions, ISR changes, request latency, disk use and controller health. On clients, inspect errors, retries, buffer pressure, poll time and lag trends.', 'Seguí particiones subreplicadas o sin líder, cambios del ISR, latencia de pedidos, disco y salud de controladores. En clientes, mirá errores, reintentos, presión de buffer, tiempo de poll y tendencias del lag.'),
        B('A trend plus a symptom is more actionable than one threshold.', 'Una tendencia junto con un síntoma orienta más que un umbral aislado.'),
      ),
      F(
        B('Diagnose before scaling', 'Diagnosticá antes de escalar'),
        B('Growing lag might come from a slow dependency, a hot partition, repeated failures or insufficient consumer capacity. Adding consumers cannot fix one hot partition or a failing database.', 'El lag creciente puede venir de una dependencia lenta, una partición caliente, errores repetidos o capacidad insuficiente. Agregar consumidores no arregla una única partición caliente ni una base caída.'),
        B('Find the constrained resource before adding more workers.', 'Encontrá el recurso limitado antes de agregar workers.'),
      ),
    ],
    B('Adjust the production and consumption rates. Watch whether the backlog grows or drains.', 'Ajustá las tasas de producción y consumo. Mirá si el trabajo pendiente crece o baja.'),
    [
      Q(
        B('Lag grows on one partition while other partitions are idle. First suspect?', 'El lag crece en una partición y las otras están libres. ¿Qué sospechás primero?'),
        [B('Skewed keys or a partition-specific bottleneck', 'Claves desbalanceadas o un cuello de botella de esa partición'), B('Not enough consumer groups', 'Faltan grupos de consumidores'), B('The replication factor is too low', 'El factor de replicación es bajo')],
        0,
        B('Partition-level evidence matters. More idle consumers cannot split ownership of one ordinary-group partition.', 'Importa la evidencia por partición. Más consumidores libres no dividen la propiedad de una partición en un grupo común.'),
      ),
      Q(
        B('Which question is the better starting point for an alert?', '¿Qué pregunta es mejor punto de partida para una alerta?'),
        [B('Did this order arrive within our target?', '¿Llegó este pedido dentro del objetivo?'), B('Is the consumer process running?', '¿Está corriendo el proceso consumidor?'), B('Is the broker log quiet?', '¿Está tranquilo el log del broker?')],
        0,
        B('Start from what the user sees, then use metrics and logs to explain it. A running process delivers nothing by itself.', 'Partí de lo que ve el usuario y después explicalo con métricas y logs. Un proceso vivo no entrega nada por sí solo.'),
      ),
      Q(
        B('Lag grows on every partition and the consumer waits on a slow database. Adding consumers will...', 'El lag crece en todas las particiones y el consumidor espera a una base lenta. Agregar consumidores va a...'),
        [B('Not help: the constrained resource is the database', 'No ayudar: el recurso limitado es la base'), B('Drain the backlog proportionally', 'Bajar el pendiente en proporción'), B('Reduce the lag on the busiest partition', 'Reducir el lag de la partición más cargada')],
        0,
        B('Find the constraint before scaling. More workers waiting on the same dependency wait together.', 'Encontrá el límite antes de escalar. Más workers esperando a la misma dependencia esperan juntos.'),
      ),
    ],
    [
      prep(23),
      S(
        B('Create observable work', 'Creá trabajo observable'),
        B('Publish the sample and register a group bookmark at the beginning.', 'Publicá la muestra y registrá el señalador del grupo al inicio.'),
        run('seed 23') + '\n' + run('reset 23 ops'),
        B('The group begins behind the log end.', 'El grupo queda detrás del final del log.'),
      ),
      S(
        B('Read the backlog', 'Leé el trabajo pendiente'),
        B('Compare each partition’s committed position, end and lag.', 'Compará por partición posición confirmada, fin y lag.'),
        run('lag 23 ops'),
        B('A positive lag indicates unread positions. It does not measure elapsed seconds.', 'Un lag positivo indica posiciones pendientes. No mide segundos transcurridos.'),
      ),
      S(
        B('Drain and verify', 'Vaciá el pendiente y verificá'),
        B('Process the input, then inspect the metrics again.', 'Procesá la entrada y volvé a inspeccionar las métricas.'),
        run('consume 23 ops') + '\n' + run('lag 23 ops'),
        B('Lag reaches zero. Check actual printed events as well as the numeric result.', 'El lag llega a cero. Verificá los eventos impresos además del número.'),
      ),
      S(
        B('Look at broker logs', 'Mirá los logs del broker'),
        B('Inspect recent broker messages without assuming that every warning is an incident.', 'Inspeccioná mensajes recientes sin suponer que toda advertencia es un incidente.'),
        'docker compose logs --tail 40 kafka1',
        B('Relate messages to operations you performed. A healthy process alone proves little about delivery.', 'Relacioná los mensajes con lo que hiciste. Un proceso sano, solo, prueba poco sobre la entrega.'),
      ),
    ],
    'monitoring',
  );

  // 25 Looking is not touching
  add(
    'admin-console',
    B('Looking is not touching', 'Mirar no es tocar'),
    B('A team console shows the cluster; permissions decide what can change.', 'Una consola de equipo muestra el clúster; los permisos deciden qué puede cambiar.'),
    'console',
    [
      F(
        B('A console for the whole team', 'Una consola para todo el equipo'),
        B('Kafbat UI is an open source web console (Apache 2.0) for managing Kafka clusters. It shows brokers, topics, partitions, consumer groups with their lag, and the messages themselves. It reads them through the same Admin and consumer APIs as the command-line tools: it adds a shared screen, not new information.', 'Kafbat UI es una consola web open source (Apache 2.0) para administrar clústeres de Kafka. Muestra brokers, tópicos, particiones, grupos de consumidores con su lag y los mensajes mismos. Los lee con las mismas APIs de administración y de consumo que las herramientas de línea de comandos: suma una pantalla compartida, no información nueva.'),
        B('A console shows the cluster; it does not replace knowing what each number means.', 'Una consola muestra el clúster; no reemplaza saber qué significa cada número.'),
      ),
      F(
        B('Read-only is a console setting', 'Solo lectura es una opción de la consola'),
        B('With KAFKA_CLUSTERS_0_READONLY=true the console refuses its own write actions: no new topics, no produced messages, no offset resets. The broker never sees that setting. Any client with the same credentials can still write; what protects the cluster is authentication plus ACLs on the broker, as in lesson 23.', 'Con KAFKA_CLUSTERS_0_READONLY=true la consola rechaza sus propias acciones de escritura: no crea tópicos, no publica mensajes, no reinicia offsets. El broker nunca ve esa opción. Cualquier cliente con las mismas credenciales puede seguir escribiendo; lo que protege el clúster es la autenticación con ACL en el broker, como en la lección 23.'),
        B('A read-only console is a convenience; least privilege lives in the broker.', 'Una consola de solo lectura es una comodidad; el mínimo privilegio vive en el broker.'),
      ),
      F(
        B('The same lag through another window', 'El mismo lag por otra ventana'),
        B('The console computes lag as the command-line tool does: log end offset minus the group’s committed offset, per partition, and adds the partitions for a total. It shows a snapshot that refreshes, so between refreshes it can be behind. Browsing messages joins no group and commits nothing: looking moves no bookmark.', 'La consola calcula el lag como la herramienta de línea de comandos: offset de fin del log menos el offset confirmado del grupo, por partición, y suma las particiones para el total. Muestra una foto que se refresca, así que entre refrescos puede estar atrasada. Mirar mensajes no se une a ningún grupo ni confirma nada: mirar no mueve ningún señalador.'),
        B('Two tools agree because they read the same offsets, not because one checks the other.', 'Dos herramientas coinciden porque leen los mismos offsets, no porque una verifique a la otra.'),
      ),
    ],
    B('Switch the request from looking to changing and see where it stops. Then follow the other path: a client with the same credentials that never passes through the console.', 'Cambiá el pedido de mirar a modificar y mirá dónde se frena. Después seguí el otro camino: un cliente con las mismas credenciales que nunca pasa por la consola.'),
    [
      Q(
        B('The team console runs with READONLY=true. What stops a script that uses the console’s credentials from deleting a topic?', 'La consola del equipo corre con READONLY=true. ¿Qué impide que un script con las credenciales de la consola borre un tópico?'),
        [B('The read-only setting, which the broker enforces for those credentials', 'La opción de solo lectura, que el broker aplica a esas credenciales'), B('Nothing, unless the broker denies it with ACLs for that principal', 'Nada, salvo que el broker se lo niegue con ACL para ese principal'), B('The console, which intercepts every connection to the cluster', 'La consola, que intercepta toda conexión al clúster')],
        1,
        B('Read-only lives in the console and filters only the console’s own actions. Authorization is the broker’s job: give the console’s principal read and describe permissions only.', 'El solo lectura vive en la consola y filtra solo sus propias acciones. Autorizar es tarea del broker: dale al principal de la consola solo permisos de lectura y descripción.'),
      ),
      Q(
        B('The console shows total lag 6 for a group; kafka-consumer-groups.sh --describe shows 2, 2 and 2. What does that mean?', 'La consola muestra lag total 6 para un grupo; kafka-consumer-groups.sh --describe muestra 2, 2 y 2. ¿Qué significa?'),
        [B('Both read the same committed offsets and log ends; the console adds the partitions', 'Las dos leen los mismos offsets confirmados y fines de log; la consola suma las particiones'), B('The group is six seconds behind', 'El grupo está seis segundos atrasado'), B('One of them is wrong: lag must be the same number in both', 'Una de las dos está mal: el lag tiene que ser el mismo número en ambas')],
        0,
        B('Lag is counted per partition, in offsets. The total is a sum, and neither tool measures time.', 'El lag se cuenta por partición y en offsets. El total es una suma, y ninguna de las dos mide tiempo.'),
      ),
      Q(
        B('You browse the messages of lab28 in the console. What happens to the committed offsets of the group console?', 'Mirás los mensajes de lab28 en la consola. ¿Qué pasa con los offsets confirmados del grupo console?'),
        [B('They move to the end, because the console read the messages', 'Avanzan al final, porque la consola leyó los mensajes'), B('They go back to the beginning', 'Vuelven al principio'), B('They stay the same: browsing joins no group and commits nothing', 'Quedan iguales: mirar no se une a ningún grupo ni confirma nada')],
        2,
        B('Only a member of a group commits that group’s offsets. Reading to inspect is not consuming on behalf of a team.', 'Solo un miembro del grupo confirma sus offsets. Leer para inspeccionar no es consumir en nombre de un equipo.'),
      ),
    ],
    [
      prep(28),
      S(
        B('Leave a group behind', 'Dejá un grupo atrasado'),
        B('Publish six records, two per partition, and place the bookmark of the group console at the beginning without consuming anything.', 'Publicá seis registros, dos por partición, y poné el señalador del grupo console al principio sin consumir nada.'),
        run('seed 28') + '\n' + run('reset 28 console'),
        B('Six ACK lines across partitions 0, 1 and 2, then RESET console with offset 0 on each partition.', 'Seis líneas ACK en las particiones 0, 1 y 2, y después RESET console con offset 0 en cada partición.'),
      ),
      S(
        B('Open the console in read-only mode', 'Abrí la consola en solo lectura'),
        B('Start Kafbat UI, an optional service of this kit, and open http://localhost:18081. The first start downloads its image.', 'Levantá Kafbat UI, un servicio opcional de este kit, y abrí http://localhost:18081. El primer arranque descarga su imagen.'),
        'docker compose up -d kafbat',
        B('The cluster course is online with three brokers. In Topics there is no button to add a topic and Delete selected topics is disabled; in lab28, Produce Message is disabled. The console is read-only.', 'El clúster course aparece en línea con tres brokers. En Topics no está el botón para agregar un tópico y Delete selected topics está deshabilitado; en lab28, Produce Message también. La consola está en solo lectura.'),
      ),
      S(
        B('Compare the lag through two windows', 'Compará el lag por dos ventanas'),
        B('In the console, open Consumers, then console, and expand lab28. Then ask the broker with the Kafka command-line tool.', 'En la consola, abrí Consumers, después console, y desplegá lab28. Después preguntale al broker con la herramienta de línea de comandos de Kafka.'),
        'docker compose exec kafka1 /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka1:9092 --describe --group console',
        B('The console shows the group EMPTY with total lag 6. The tool says the group has no active members and shows LAG 2 on partitions 0, 1 and 2, with CURRENT-OFFSET 0 and LOG-END-OFFSET 2.', 'La consola muestra el grupo EMPTY con lag total 6. La herramienta dice que el grupo no tiene miembros activos y muestra LAG 2 en las particiones 0, 1 y 2, con CURRENT-OFFSET 0 y LOG-END-OFFSET 2.'),
      ),
      S(
        B('Look, then check that nothing changed', 'Mirá y comprobá que nada cambió'),
        B('In the console, open Topics, then lab28, then Messages, and read the six records. Then list the groups and stop the console.', 'En la consola, abrí Topics, después lab28 y después Messages, y leé los seis registros. Después listá los grupos y detené la consola.'),
        'docker compose exec kafka1 /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka1:9092 --list\ndocker compose stop kafbat',
        B('The list shows console and the groups of other lessons; the console added none. Browsing is not consuming: no group moved.', 'La lista muestra console y los grupos de otras lecciones; la consola no agregó ninguno. Mirar no es consumir: ningún grupo avanzó.'),
      ),
    ],
    'kafbat',
  );

  // 26 Scale the right dimension
  add(
    'scaling',
    B('Scale the right dimension', 'Escalá la dimensión correcta'),
    B('Storage, throughput, partitions and consumers are separate budgets.', 'Almacenamiento, throughput, particiones y consumidores tienen presupuestos propios.'),
    'scaling',
    [
      F(
        B('Estimate before provisioning', 'Estimá antes de asignar recursos'),
        B('A first storage estimate is events per second × average serialized bytes × retention seconds × replication factor. Add indexes, metadata, headroom and uneven distribution; compression changes the actual footprint.', 'Una primera estimación es eventos por segundo × bytes serializados promedio × segundos de retención × factor de replicación. Sumá índices, metadatos, margen y distribución desigual; la compresión cambia el espacio real.'),
        B('Estimate with units, then measure with your own payloads.', 'Estimá con unidades y después medí con tus propios mensajes.'),
      ),
      F(
        B('Find the hottest lane', 'Encontrá el carril más cargado'),
        B('Total topic throughput can hide a hot key. One key stays on one partition under the same partitioner and count. Splitting the key may increase parallelism but weaken the ordering boundary your application relies on.', 'El throughput total puede esconder una clave caliente. Una clave queda en una partición con el mismo particionador y cantidad. Dividir la clave puede aumentar paralelismo, pero debilitar el orden que necesita tu aplicación.'),
        B('A key design is also a capacity design.', 'Diseñar claves también es diseñar capacidad.'),
      ),
      F(
        B('Move replicas deliberately', 'Mové réplicas a propósito'),
        B('Adding a broker does not by itself balance existing partitions onto it. Replica reassignment moves data and consumes network and disk capacity. Use throttling, monitor ISR and plan the rollback before large moves.', 'Agregar un broker no balancea por sí solo las particiones existentes hacia él. Reasignar réplicas mueve datos y consume red y disco. Usá límites de transferencia, observá el ISR y planificá la vuelta atrás.'),
        B('Capacity is usable only when data and work can reach it.', 'La capacidad sirve si los datos y el trabajo pueden llegar a ella.'),
      ),
    ],
    B('Change rate, retention and replica count to estimate raw replicated storage.', 'Cambiá tasa, retención y réplicas para estimar almacenamiento bruto replicado.'),
    [
      Q(
        B('You add a broker. What happens to existing partition placement automatically?', 'Agregás un broker. ¿Qué pasa automáticamente con la ubicación de las particiones existentes?'),
        [B('All partitions balance immediately', 'Todas se balancean enseguida'), B('Nothing guarantees redistribution; plan reassignment', 'Nada garantiza redistribución; planificá la reasignación'), B('All consumer offsets reset', 'Se reinician todos los offsets de consumo')],
        1,
        B('A new broker is capacity, not a completed data migration. Reassignment or an appropriate balancing tool must move replicas.', 'Un broker nuevo aporta capacidad, no una migración terminada. Las réplicas se mueven con reasignación o una herramienta de balanceo adecuada.'),
      ),
      Q(
        B('Rough storage for 1,000 events per second of 1 KB, one day of retention, replication factor 3. Order of magnitude?', 'Almacenamiento aproximado para 1.000 eventos por segundo de 1 KB, un día de retención y factor de replicación 3. ¿Orden de magnitud?'),
        [B('About 260 GB before overhead', 'Unos 260 GB antes de los extras'), B('About 9 GB', 'Unos 9 GB'), B('About 2.6 TB', 'Unos 2,6 TB')],
        0,
        B('1,000 × 1,000 bytes × 86,400 s × 3 is about 259 GB. Indexes, metadata, headroom and compression move the real number.', '1.000 × 1.000 bytes × 86.400 s × 3 da unos 259 GB. Índices, metadatos, margen y compresión mueven el número real.'),
      ),
      Q(
        B('A hot key sends 90% of the traffic to one partition. Doubling the partitions...', 'Una clave caliente manda el 90% del tráfico a una partición. Duplicar las particiones...'),
        [B('Does not split that key: it still lands on one partition', 'No divide esa clave: sigue cayendo en una sola partición'), B('Halves that partition’s load', 'Reduce a la mitad la carga de esa partición'), B('Moves the old records of that key', 'Mueve los mensajes viejos de esa clave')],
        0,
        B('One key maps to one partition under the same partitioner. Changing the key design is a business decision about ordering.', 'Una clave va a una partición con el mismo particionador. Cambiar el diseño de la clave es una decisión de negocio sobre el orden.'),
      ),
    ],
    [
      prep(24),
      S(
        B('Create a hot key', 'Creá una clave caliente'),
        B('Send 90% of events with one key and inspect the partition distribution.', 'Mandá el 90% de los eventos con una clave y mirá la distribución.'),
        run('skew 24'),
        B('One partition receives most records.', 'Una partición recibe la mayoría de los mensajes.'),
      ),
      S(
        B('Inspect the imbalance', 'Inspeccioná el desbalance'),
        B('End offsets reveal the uneven load on a freshly prepared topic.', 'Los offsets finales muestran la carga desigual en el tópico recién preparado.'),
        run('offsets 24'),
        B('Partition counts are far from equal.', 'Los conteos por partición están lejos de ser iguales.'),
      ),
      S(
        B('Increase lanes, keep the key', 'Aumentá carriles, conservá la clave'),
        B('Expand to six partitions and send again. The hot key still maps to only one lane.', 'Ampliá a seis particiones y publicá otra vez. La clave caliente sigue yendo a un solo carril.'),
        run('expand 24 6') + '\n' + run('skew 24') + '\n' + run('offsets 24'),
        B('More partitions did not split the hot key. Explain the business tradeoff before changing that key.', 'Más particiones no dividieron la clave caliente. Explicá el costo de negocio antes de cambiarla.'),
      ),
    ],
    'operations',
  );

  // 27 A second cluster is another system
  add(
    'mirroring',
    B('A second cluster is another system', 'Un segundo clúster es otro sistema'),
    B('Replication across clusters is a recovery design.', 'Replicar entre clústeres requiere diseñar la recuperación.'),
    'mirror',
    [
      F(
        B('Distinguish replicas from mirrors', 'Distinguí réplicas de espejos'),
        B('In-cluster replicas share a partition’s log identity. Cross-cluster replication copies events into another cluster with its own topic metadata and offsets. MirrorMaker 2 uses Kafka Connect to coordinate this work.', 'Las réplicas dentro del clúster comparten la identidad del log. La replicación entre clústeres copia eventos a otro sistema con metadatos y offsets propios. MirrorMaker 2 usa Kafka Connect para coordinarlo.'),
        B('Offset 100 in one cluster need not be offset 100 in another.', 'El offset 100 de un clúster no tiene por qué ser el 100 del otro.'),
      ),
      F(
        B('Choose a recovery contract', 'Elegí un contrato de recuperación'),
        B('RPO is the amount of data loss you can tolerate; RTO is how long recovery may take. Asynchronous replication can lag. Failover must handle client routing, group progress, schemas, permissions and application state.', 'RPO es cuánta pérdida de datos tolerás; RTO es cuánto puede demorar la recuperación. La replicación asíncrona puede atrasarse. La conmutación tiene que resolver ruteo, avance de grupos, esquemas, permisos y estado de aplicaciones.'),
        B('A mirror without a failover drill is an untested assumption.', 'Un espejo sin ensayo de recuperación es una suposición sin probar.'),
      ),
      F(
        B('Make the lab’s limit visible', 'Hacé visible el límite del laboratorio'),
        B('This lab runs a second single-broker cluster and a small one-shot copy client. It demonstrates offset independence and duplicates. It does not implement MirrorMaker 2 checkpoint translation, heartbeats or automatic failover.', 'El laboratorio levanta un segundo clúster de un broker y un cliente de copia de una sola pasada. Muestra offsets independientes y duplicados. No implementa traducción de checkpoints, latidos ni conmutación automática de MirrorMaker 2.'),
        B('Copying records is only one part of disaster recovery.', 'Copiar mensajes es solo una parte de recuperarse de un desastre.'),
      ),
    ],
    B('Copy a log to a destination that already has data. Compare source and destination offsets.', 'Copiá un log a un destino que ya tiene datos. Compará offsets de origen y destino.'),
    [
      Q(
        B('Can you blindly reuse source offsets in another cluster?', '¿Podés reutilizar offsets de origen sin más en otro clúster?'),
        [B('Yes, offsets are global IDs', 'Sí, los offsets son IDs globales'), B('No, positions belong to their cluster’s logs', 'No, las posiciones pertenecen a los logs de su clúster'), B('Yes, if both clusters run the same Kafka version', 'Sí, si los dos clústeres tienen la misma versión de Kafka')],
        1,
        B('Cross-cluster progress requires deliberate translation or replay policy. A copied event may have a different target offset.', 'El avance entre clústeres exige traducción o una política deliberada de replay. Un evento copiado puede tener otro offset de destino.'),
      ),
      Q(
        B('What does MirrorMaker 2 use to run cross-cluster replication?', '¿Qué usa MirrorMaker 2 para replicar entre clústeres?'),
        [B('Kafka Connect', 'Kafka Connect'), B('The in-cluster replica fetchers', 'Los replicadores internos del clúster'), B('Kafka Streams', 'Kafka Streams')],
        0,
        B('Cross-cluster copying is integration work, so it runs as connectors. In-cluster replication is a different mechanism with a shared log identity.', 'Copiar entre clústeres es trabajo de integración, así que corre como conectores. La replicación interna es otro mecanismo, con identidad de log compartida.'),
      ),
      Q(
        B('RPO and RTO are...', 'RPO y RTO son...'),
        [B('How much data loss you tolerate, and how long recovery may take', 'Cuánta pérdida de datos tolerás, y cuánto puede demorar la recuperación'), B('The replication factor and the ISR minimum', 'El factor de replicación y el ISR mínimo'), B('The producer and consumer timeouts', 'Los timeouts del productor y del consumidor')],
        0,
        B('They are business targets, and they are only real once a failover drill has met them.', 'Son objetivos de negocio, y solo son reales cuando un ensayo de conmutación los cumplió.'),
      ),
    ],
    [
      prep(25),
      S(
        B('Start a destination cluster', 'Arrancá un clúster de destino'),
        B('The optional mirror broker is independent and has no host port.', 'El broker opcional mirror es independiente y no publica puerto hacia el host.'),
        'docker compose --profile mirror up -d --wait mirror',
        B('A second cluster is healthy.', 'Un segundo clúster está saludable.'),
      ),
      S(
        B('Prepare source events', 'Prepará eventos de origen'),
        B('Publish three events into the main cluster.', 'Publicá tres eventos en el clúster principal.'),
        run('seed 25'),
        B('Three source events.', 'Tres eventos de origen.'),
      ),
      S(
        B('Copy and compare', 'Copiá y compará'),
        B('The demo pre-seeds one destination record, then copies the source and prints both addresses.', 'La demo agrega primero un mensaje en destino y después copia el origen mostrando ambas direcciones.'),
        run('mirror'),
        B('Source offset 0 maps to destination offset 1 on a fresh destination. IDs, not offsets, connect the same business event.', 'En un destino nuevo, el offset 0 de origen queda en el 1 de destino. Los IDs, no los offsets, conectan el mismo evento.'),
      ),
      S(
        B('Repeat, then stop', 'Repetí y detené'),
        B('Repeat the naive copy to reveal duplicates. This is why production replication needs durable progress.', 'Repetí la copia ingenua para ver duplicados. Por eso producción necesita avance durable.'),
        run('mirror') + '\n' + 'docker compose --profile mirror stop mirror',
        B('The copy adds records again. The demonstration is deliberately at least once.', 'La copia vuelve a agregar mensajes. La demostración es deliberadamente al menos una vez.'),
      ),
    ],
    'mirror',
  );

  // 28 When work sharing is the goal
  add(
    'share-groups',
    B('When work sharing is the goal', 'Cuando el objetivo es repartir tareas'),
    B('Share groups use record acknowledgments instead of partition ownership.', 'Los share groups confirman mensajes en lugar de asignar particiones enteras.'),
    'share',
    [
      F(
        B('Change the unit of assignment', 'Cambiá la unidad de asignación'),
        B('An ordinary consumer group assigns partitions to members. A share group can distribute records from the same partition among multiple consumers, with acquisition locks and acknowledgments.', 'Un grupo común asigna particiones a miembros. Un share group puede repartir mensajes de una misma partición entre varios consumidores, con bloqueos de adquisición y confirmaciones.'),
        B('Sharing a partition’s work changes processing-order assumptions.', 'Repartir el trabajo de una partición cambia los supuestos de orden de procesamiento.'),
      ),
      F(
        B('Accept, release or reject', 'Aceptá, liberá o rechazá'),
        B('A shared record is temporarily acquired. Accept acknowledges completion; release makes it available for redelivery; reject marks it as not to be delivered again to that group. Failed or expired acquisitions can be redelivered.', 'Un mensaje compartido se adquiere temporalmente. Accept confirma su finalización; release lo habilita para reentrega; reject indica que no se entregue de nuevo a ese grupo. Las adquisiciones fallidas o vencidas pueden reentregarse.'),
        B('A lock is not a successful business effect.', 'Un bloqueo no es un efecto de negocio exitoso.'),
      ),
      F(
        B('Respect the version boundary', 'Respetá el límite de versión'),
        B('In Kafka 4.1, the version this course pins, share groups are a preview that must be enabled; since Kafka 4.2 they are production-ready. Use the separate experimental broker; ordinary course labs use consumer groups.', 'En Kafka 4.1, la versión fijada del curso, los share groups son una función preview que hay que habilitar; desde Kafka 4.2 son production-ready. Usá el broker experimental separado; el resto usa grupos comunes.'),
        B('A preview invites you to experiment; check the readiness of the version you run before relying on it.', 'Una preview invita a experimentar; verificá la madurez de la versión que usás antes de apoyarte en ella.'),
      ),
    ],
    B('Acquire one record, then release it for another worker. Compare with whole-partition assignment.', 'Adquirí un mensaje y liberalo para otro worker. Compará con asignar la partición entera.'),
    [
      Q(
        B('Why can a share group use more consumers than partitions?', '¿Por qué un share group puede usar más consumidores que particiones?'),
        [B('It can distribute individual records from a partition', 'Puede repartir mensajes individuales de una partición'), B('It secretly creates new partitions', 'Crea particiones nuevas a escondidas'), B('It removes all ordering and storage', 'Elimina todo orden y almacenamiento')],
        0,
        B('Share groups coordinate record acquisition and acknowledgment. They are a different consumption model from ordinary groups.', 'Los share groups coordinan adquisición y confirmación de mensajes. Son un modelo distinto de los grupos comunes.'),
      ),
      Q(
        B('A share consumer releases a record. What happens?', 'Un consumidor de share group libera un mensaje. ¿Qué pasa?'),
        [B('It becomes available for redelivery', 'Queda disponible para reentrega'), B('It is deleted from the topic', 'Se borra del tópico'), B('It is marked as processed', 'Queda marcado como procesado')],
        0,
        B('Accept finishes it, release returns it to the pool, reject keeps it from coming back to that group.', 'Accept lo termina, release lo devuelve al pozo, reject evita que vuelva a ese grupo.'),
      ),
      Q(
        B('Share groups in this course’s Kafka 4.1 lab are...', 'Los share groups en el laboratorio de Kafka 4.1 de este curso son...'),
        [B('A preview that must be enabled with share.version=1; production-ready since Kafka 4.2', 'Una preview que hay que habilitar con share.version=1; production-ready desde Kafka 4.2'), B('The default consumption model for every topic', 'El modelo de consumo por defecto para todo tópico'), B('Unavailable in any Kafka 4.x', 'No disponibles en ningún Kafka 4.x')],
        0,
        B('The course pins 4.1.2 deliberately. Check the readiness of the version you run before relying on share groups.', 'El curso fija 4.1.2 a propósito. Verificá la madurez de la versión que usás antes de apoyarte en share groups.'),
      ),
    ],
    [
      prep(26),
      S(
        B('Start the experimental broker', 'Arrancá el broker experimental'),
        B('The optional broker isolates preview configuration from the main course cluster.', 'El broker opcional aísla la configuración preview del clúster principal.'),
        'docker compose --profile share up -d --wait share',
        B('The share service is healthy.', 'El servicio share está saludable.'),
      ),
      S(
        B('Enable the feature', 'Habilitá la función'),
        B('Kafka 4.1 requires share.version=1. The command may report it is already enabled on a repeated lab.', 'Kafka 4.1 requiere share.version=1. Al repetir, el comando puede informar que ya está habilitado.'),
        'docker compose exec share /opt/kafka/bin/kafka-features.sh --bootstrap-server share:9092 upgrade --feature share.version=1',
        B('Feature level 1 is enabled.', 'Queda habilitado el nivel 1 de la función.'),
      ),
      S(
        B('Run the shared-consumption experiment', 'Ejecutá el consumo compartido'),
        B('The client creates a fresh single-partition topic, sends six records, releases its first delivery and accepts later deliveries.', 'El cliente crea un tópico nuevo de una partición, manda seis mensajes, libera la primera entrega y acepta las siguientes.'),
        run('share'),
        B('A RELEASE is followed by redelivery and ACCEPT operations. Record acknowledgment is visible.', 'Un RELEASE va seguido de reentrega y operaciones ACCEPT. Se ve la confirmación por mensaje.'),
      ),
      S(
        B('Stop the preview service', 'Detené el servicio preview'),
        B('Keep experiments isolated from later work.', 'Mantené el experimento aislado del trabajo posterior.'),
        'docker compose --profile share stop share',
        B('The experimental broker stops.', 'El broker experimental se detiene.'),
      ),
    ],
    'share',
  );

  // 29 Ship an order. Survive a failure.
  add(
    'capstone',
    B('Ship an order. Survive a failure.', 'Entregá un pedido. Sobreviví a una falla.'),
    B('Bring the pieces together and defend your choices.', 'Juntá las piezas y defendé tus decisiones.'),
    'capstone',
    [
      F(
        B('Start from a contract', 'Empezá por un contrato'),
        B('The café needs every accepted order transformed into one ready-for-kitchen event in Kafka. Order IDs are keys. Input and output have three partitions and replication factor three. External kitchen side effects remain outside the Kafka transaction.', 'El café necesita transformar cada pedido aceptado en un evento listo para cocina en Kafka. Los IDs de pedido son claves. Entrada y salida tienen tres particiones y tres réplicas. Los efectos externos de la cocina quedan fuera de la transacción Kafka.'),
        B('State the ordering, durability and processing boundaries before coding.', 'Definí los límites de orden, durabilidad y procesamiento antes de programar.'),
      ),
      F(
        B('Inject a failure with a prediction', 'Inyectá una falla con una predicción'),
        B('A transactional processor writes output, then aborts before committing input progress. Predict what read_committed will show. Restart the processor, stop one broker, then read the output and inspect ISR.', 'Un procesador transaccional escribe salida y aborta antes de confirmar avance. Predecí qué verá read_committed. Reinicialo, detené un broker, leé la salida e inspeccioná el ISR.'),
        B('A useful experiment starts with an expected observation.', 'Un experimento útil empieza con una observación esperada.'),
      ),
      F(
        B('Explain what the result proves', 'Explicá qué prueba el resultado'),
        B('Verify one committed output per input event ID, no remaining group lag and availability after one broker failure. This demonstrates the stated Kafka boundary on this lab, not universal exactly-once delivery, production capacity or disaster recovery.', 'Verificá una salida confirmada por ID de entrada, ningún lag pendiente y disponibilidad tras la caída de un broker. Esto demuestra el límite Kafka de este laboratorio, no entrega universal exactamente una vez, capacidad productiva ni recuperación de desastres.'),
        B('Good engineers can name both the guarantee and its limit.', 'Un buen diseño puede nombrar tanto la garantía como su límite.'),
      ),
    ],
    B('Trace one order through input, transaction and output. Inject an abort and watch committed visibility.', 'Seguí un pedido por entrada, transacción y salida. Inyectá un aborto y mirá qué queda visible.'),
    [
      Q(
        B('The Kafka output is exactly once. Is an external kitchen API automatically exactly once too?', 'La salida Kafka es exactamente una vez. ¿La API externa de cocina también lo es automáticamente?'),
        [B('Yes, the guarantee crosses every API', 'Sí, la garantía cruza cualquier API'), B('No; that effect needs its own idempotency or coordination', 'No; ese efecto necesita idempotencia o coordinación propia'), B('Only if the API is called inside the Kafka transaction', 'Solo si la API se llama dentro de la transacción Kafka')],
        1,
        B('Kafka’s transaction includes Kafka writes and input offsets. A downstream API is another transaction boundary.', 'La transacción Kafka incluye escrituras Kafka y offsets de entrada. Una API posterior pertenece a otro límite transaccional.'),
      ),
      Q(
        B('The processor writes its output and aborts before committing the input offsets. read_committed shows...', 'El procesador escribe su salida y aborta antes de confirmar los offsets de entrada. read_committed muestra...'),
        [B('None of that run’s output', 'Nada de la salida de esa corrida'), B('The output, marked as aborted', 'La salida, marcada como abortada'), B('Half of the output', 'La mitad de la salida')],
        0,
        B('Aborted records can exist on disk, but a read_committed reader never sees them. The input stays unconsumed for the next run.', 'Los mensajes abortados pueden existir en disco, pero un lector read_committed nunca los ve. La entrada queda sin consumir para la próxima corrida.'),
      ),
      Q(
        B('One broker stops and verify still passes. What did that prove?', 'Un broker se detiene y verify sigue pasando. ¿Qué probó eso?'),
        [B('Committed data and availability survive one broker loss in this lab', 'Los datos confirmados y la disponibilidad sobreviven a la caída de un broker en este laboratorio'), B('The system survives any outage', 'El sistema sobrevive a cualquier caída'), B('Exactly-once delivery to the kitchen API', 'Entrega exactamente una vez a la API de cocina')],
        0,
        B('Name both the guarantee and its limit: three replicas, min ISR 2, one failure, this topology, this laptop.', 'Nombrá la garantía y su límite: tres réplicas, ISR mínimo 2, una falla, esta topología, esta laptop.'),
      ),
    ],
    [
      prep(27),
      S(
        B('Publish a known workload', 'Publicá una carga conocida'),
        B('Send six orders with stable event IDs. Record the expected total before running the processor.', 'Mandá seis pedidos con IDs estables. Anotá el total esperado antes de correr el procesador.'),
        run('seed 27'),
        B('Six acknowledged input records.', 'Seis mensajes de entrada confirmados.'),
      ),
      S(
        B('Abort after producing output', 'Abortá después de producir salida'),
        B('The processor writes inside a transaction, then aborts without committing input offsets.', 'El procesador escribe dentro de una transacción y aborta sin confirmar offsets de entrada.'),
        run('eos 27 abort') + '\n' + run('read-topic lab27-output read_committed'),
        B('Zero committed output records from the aborted run.', 'Cero mensajes de salida confirmados de la corrida abortada.'),
      ),
      S(
        B('Recover and repeat', 'Recuperá y repetí'),
        B('Run normally twice. The second run should find no remaining input.', 'Ejecutá normalmente dos veces. La segunda no debería encontrar entrada pendiente.'),
        run('eos 27') + '\n' + run('eos 27') + '\n' + run('verify 27'),
        B('PASS: six unique committed outputs and zero lag.', 'PASS: seis salidas únicas confirmadas y lag cero.'),
      ),
      S(
        B('Lose one broker', 'Perdé un broker'),
        B('Stop kafka1 and verify through the surviving brokers. Then restore it.', 'Detené kafka1 y verificá desde los sobrevivientes. Después recuperalo.'),
        'docker compose stop kafka1' + '\n' + run('verify 27') + '\n' + 'docker compose up -d --wait',
        B('The same six committed outputs remain readable. All services are restored afterward.', 'Las mismas seis salidas confirmadas siguen legibles. Después quedan recuperados todos los servicios.'),
      ),
      S(
        B('Defend the design', 'Defendé el diseño'),
        B('Explain: why this key, why three replicas, why min ISR 2, why read_committed, what happens if the kitchen API times out, and what evidence would trigger an alert. Mark the lab complete only after you can explain each.', 'Explicá: por qué esa clave, tres réplicas, ISR mínimo 2 y read_committed; qué pasa si la API de cocina da timeout; qué evidencia dispara una alerta. Marcá el laboratorio completo solo cuando puedas explicar cada punto.'),
        run('describe 27') + '\n' + run('lag 27 eos-27'),
        B('Your explanation connects configuration, observed evidence and the limits of the guarantee.', 'Tu explicación conecta configuración, evidencia observada y límites de la garantía.'),
      ),
    ],
    'transactions',
  );

  // 30 Read and write with Spring
  add(
    'spring-java',
    B('Read and write with Spring', 'Leé y escribí con Spring'),
    B('A complete Java application. The same Kafka concepts.', 'Una aplicación Java completa. Los mismos conceptos de Kafka.'),
    'spring',
    [
      F(
        B('Write with KafkaTemplate', 'Escribí con KafkaTemplate'),
        B('POST /orders/order-42 receives a JSON event. OrderProducer calls KafkaTemplate.send(topic, orderId, event). The key is the order ID; JsonSerializer turns the Java record into bytes. The HTTP response waits for the broker acknowledgment and includes partition and offset.', 'POST /orders/order-42 recibe un evento JSON. OrderProducer llama a KafkaTemplate.send(topic, orderId, event). La clave es el ID del pedido; JsonSerializer convierte el record Java en bytes. La respuesta HTTP espera la confirmación del broker e incluye partición y offset.'),
        B('A successful send confirms storage under acks=all, not kitchen processing.', 'Un send exitoso confirma almacenamiento con acks=all, no procesamiento en cocina.'),
      ),
      F(
        B('Read with @KafkaListener', 'Leé con @KafkaListener'),
        B('OrderConsumer receives a ConsumerRecord<String, OrderPlaced>. Spring manages polling and the spring-kitchen group. With auto-commit disabled and AckMode.RECORD, a normal listener return triggers committing the next offset. earliest applies only when the group has no valid committed position.', 'OrderConsumer recibe un ConsumerRecord<String, OrderPlaced>. Spring administra poll y el grupo spring-kitchen. Con auto-commit desactivado y AckMode.RECORD, el retorno normal del listener dispara el commit del próximo offset. earliest se aplica solo si el grupo no tiene una posición confirmada válida.'),
        B('A crash after the effect and before the commit can repeat the effect.', 'Una caída entre el efecto y el commit puede repetir el efecto.'),
      ),
      F(
        B('Connect code to guarantees', 'Conectá código y garantías'),
        B('KafkaConfig declares a NewTopic with three partitions, three replicas and min ISR 2. A second HTTP request is a new send, even with the same event ID. The in-memory /received list is only an observation tool. On a listener error, this example stops the listener without committing the failed record.', 'KafkaConfig declara un NewTopic con tres particiones, tres réplicas e ISR mínimo 2. Otro pedido HTTP es un nuevo send, aunque tenga el mismo ID de evento. La lista /received en memoria solo sirve para observar. Ante un error, este ejemplo detiene el listener sin confirmar el mensaje fallido.'),
        B('Spring simplifies the client code; it does not erase Kafka’s transaction boundaries.', 'Spring simplifica el cliente; no elimina los límites transaccionales de Kafka.'),
      ),
    ],
    B('Select each Java component to see its code. Switch between a broker acknowledgment and a completed listener.', 'Seleccioná cada componente Java para ver su código. Alterná entre confirmación del broker y retorno del listener.'),
    [
      Q(
        B('KafkaTemplate.send succeeds. What does this prove?', 'KafkaTemplate.send funciona. ¿Qué prueba?'),
        [B('The broker acknowledged the write under the producer settings', 'El broker confirmó la escritura según la configuración del productor'), B('Every consumer processed the event', 'Todos los consumidores procesaron el evento'), B('The business event can never be duplicated', 'El evento de negocio nunca puede duplicarse')],
        0,
        B('The producer future describes the write. Consumer processing and business deduplication are separate concerns.', 'El future del productor describe la escritura. Procesamiento y deduplicación de negocio son responsabilidades distintas.'),
      ),
      Q(
        B('With enable-auto-commit=false and AckMode.RECORD, when is the next offset committed?', 'Con enable-auto-commit=false y AckMode.RECORD, ¿cuándo se confirma el próximo offset?'),
        [B('After the listener returns normally for that record', 'Después de que el listener retorna normalmente para ese mensaje'), B('Before the listener runs', 'Antes de que corra el listener'), B('Every five seconds, by the broker', 'Cada cinco segundos, por el broker')],
        0,
        B('The container commits per record on a normal return. A crash between the effect and that commit can repeat the effect.', 'El contenedor confirma por mensaje cuando el retorno es normal. Una caída entre el efecto y ese commit puede repetir el efecto.'),
      ),
      Q(
        B('The listener throws. What does this example do?', 'El listener lanza una excepción. ¿Qué hace este ejemplo?'),
        [B('Stops the listener and leaves the failed record uncommitted', 'Detiene el listener y deja el mensaje fallido sin confirmar'), B('Skips the record and commits', 'Saltea el mensaje y confirma'), B('Sends the record to a dead-letter topic automatically', 'Manda el mensaje a un tópico de fallas automáticamente')],
        0,
        B('CommonContainerStoppingErrorHandler makes the failure visible and keeps the bookmark honest. Retries and a DLT are a separate design decision.', 'CommonContainerStoppingErrorHandler hace visible la falla y mantiene honesto el señalador. Reintentos y DLT son otra decisión de diseño.'),
      ),
    ],
    [
      S(
        B('Build and start the example', 'Construí y arrancá el ejemplo'),
        B('Finish lesson 00 first. From labs, build the included Spring Boot 3.5.16 / Java 21 project and start it beside the cluster. Its NewTopic bean creates spring-orders. Repeating this step keeps existing events and group progress.', 'Hacé primero la lección 00. Desde labs, construí el proyecto incluido de Spring Boot 3.5.16 / Java 21 y levantalo junto al clúster. El bean NewTopic crea spring-orders. Repetir este paso conserva eventos y avance del grupo.'),
        'docker compose up -d --wait\ndocker compose --profile spring up -d --build --wait spring',
        B('spring is healthy. HTTP is available at localhost:18080; Docker clients use spring:8080.', 'spring está saludable. HTTP está en localhost:18080; los clientes Docker usan spring:8080.'),
      ),
      S(
        B('Publish a JSON event', 'Publicá un evento JSON'),
        B('The included request file avoids shell-specific quoting. The path supplies the key order-42. Open spring/src/main/java/course/spring/OrderProducer.java to follow KafkaTemplate.send.', 'El archivo de pedido incluido evita problemas de comillas entre terminales. La ruta aporta la clave order-42. Abrí spring/src/main/java/course/spring/OrderProducer.java para seguir KafkaTemplate.send.'),
        'docker compose run --rm http --fail-with-body -i -X POST http://spring:8080/orders/order-42 -H Content-Type:application/json --data-binary @/requests/order.json',
        B('HTTP 202 and JSON with topic spring-orders, partition, offset and eventId evt-spring-42.', 'HTTP 202 y JSON con topic spring-orders, partition, offset y eventId evt-spring-42.'),
      ),
      S(
        B('Observe the listener', 'Observá el listener'),
        B('Read the bounded in-memory observation list and application logs. If the list is empty, retry after a second. OrderConsumer.java shows @KafkaListener and the consumed key, event and offset.', 'Leé la lista acotada en memoria y los logs. Si está vacía, reintentá tras un segundo. OrderConsumer.java muestra @KafkaListener y la clave, evento y offset consumidos.'),
        'docker compose run --rm http --fail-with-body http://spring:8080/received\ndocker compose logs --tail 15 spring',
        B('The event appears with key order-42. Logs contain RECEIVED and its partition/offset.', 'Aparece el evento con clave order-42. Los logs muestran RECEIVED y su partición/offset.'),
      ),
      S(
        B('Send the same request twice', 'Repetí el mismo pedido'),
        B('Submit the same event again. Idempotent production handles transport retries; it does not deduplicate two HTTP requests. Compare offsets in the observation list.', 'Mandá el mismo evento otra vez. La producción idempotente maneja reintentos de transporte; no deduplica dos pedidos HTTP. Compará los offsets de la lista.'),
        'docker compose run --rm http --fail-with-body -X POST http://spring:8080/orders/order-42 -H Content-Type:application/json --data-binary @/requests/order.json\ndocker compose run --rm http --fail-with-body http://spring:8080/received',
        B('After the listener catches up, two entries share the event ID and key but have different offsets.', 'Cuando el listener se pone al día, dos entradas comparten ID y clave pero tienen offsets distintos.'),
      ),
      S(
        B('Inspect committed progress', 'Inspeccioná el avance confirmado'),
        B('Wait until the populated partition has lag zero before the next step. Inspect application.yml: group-id, auto-offset-reset, enable-auto-commit and ack-mode.', 'Esperá lag cero en la partición con datos antes del siguiente paso. Mirá application.yml: group-id, auto-offset-reset, enable-auto-commit y ack-mode.'),
        'docker compose exec kafka1 /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka1:9092 --group spring-kitchen --describe',
        B('The populated partition has LAG 0. Empty partitions can show “-” (no committed offset). CURRENT-OFFSET is the next record to consume.', 'La partición con datos tiene LAG 0. Las vacías pueden mostrar «-» (sin offset confirmado). CURRENT-OFFSET es el próximo mensaje a consumir.'),
      ),
      S(
        B('Restart the application', 'Reiniciá la aplicación'),
        B('The in-memory observation list clears, but the group’s committed offsets stay in Kafka. earliest does not rewind a group that already has valid offsets.', 'La lista en memoria se vacía, pero los offsets del grupo quedan en Kafka. earliest no rebobina un grupo que ya tiene offsets válidos.'),
        'docker compose restart spring\ndocker compose --profile spring up -d --wait spring\ndocker compose run --rm http --fail-with-body http://spring:8080/received',
        B('The list is [] after the restart: previously committed records are not replayed. Publish a new event to see the listener resume.', 'La lista queda []: los mensajes ya confirmados no se releen. Publicá un evento nuevo para ver que el listener sigue activo.'),
      ),
      S(
        B('Stop and read the source', 'Detené y recorré el código'),
        B('Stop the application when done. The complete project and a bilingual source walkthrough are in labs/spring/README.md. Design durable business deduplication before adding payments or another external effect.', 'Al terminar, detené la aplicación. El proyecto completo y el recorrido bilingüe del código están en labs/spring/README.md. Diseñá deduplicación durable antes de agregar pagos u otro efecto externo.'),
        'docker compose --profile spring stop spring',
        B('The app stops; topic data and committed group offsets remain in the course broker volumes.', 'La app se detiene; los datos del tópico y offsets confirmados quedan en los volúmenes del curso.'),
      ),
    ],
    'spring',
  );

  return { version: '1.6.0', kafka: '4.1.2', date: '2026-10-18', units, lessons, B };
})();
