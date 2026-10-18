# Spring Boot + Kafka / Spring Boot + Kafka

A complete Java 21 / Spring Boot 3.5.16 application that writes and reads `spring-orders`. Docker builds it; no local Java or Maven installation is required. Boot manages its compatible Spring Kafka and Kafka client versions; the broker is Kafka 4.1.2. Client and broker versions do not have to be identical.

Spring Boot 3.5.16 is the last open-source release of the 3.5 line, whose open-source support ended on 30 June 2026; the current line is Spring Boot 4.x. The example stays on 3.5.16 because that is the version the course validated; everything it uses (`KafkaTemplate`, `@KafkaListener`, `TopicBuilder`, `CommonContainerStoppingErrorHandler`, `JsonSerializer`) exists unchanged in Spring Kafka 4, and moving the lesson to Boot 4.x is planned.

Una aplicación completa con Java 21 y Spring Boot 3.5.16 que escribe y lee `spring-orders`. Docker la compila; no necesitás instalar Java ni Maven. Boot administra las versiones compatibles de Spring Kafka y su cliente Kafka; el broker es Kafka 4.1.2. Cliente y broker no necesitan tener la misma versión.

Spring Boot 3.5.16 es la última versión open source de la línea 3.5, cuyo soporte open source terminó el 30 de junio de 2026; la línea actual es Spring Boot 4.x. El ejemplo sigue en 3.5.16 porque es la versión que el curso validó; todo lo que usa (`KafkaTemplate`, `@KafkaListener`, `TopicBuilder`, `CommonContainerStoppingErrorHandler`, `JsonSerializer`) existe sin cambios en Spring Kafka 4, y pasar la lección a Boot 4.x está planificado.

Course kit 1.2.0; image `kafka-course-spring:1.2.0`.

Kit del curso 1.2.0; imagen `kafka-course-spring:1.2.0`.

## Run it / Ejecutalo

Run these commands from the parent `labs` folder, after lesson 00. Port 18080 must be free. The application creates its topic automatically through the `NewTopic` bean; it preserves existing messages and group offsets on later starts.

Ejecutá desde la carpeta padre `labs`, después de la lección 00. El puerto 18080 tiene que estar libre. La aplicación crea el tópico mediante el bean `NewTopic`; en los siguientes arranques conserva mensajes y offsets existentes.

```sh
docker compose up -d --wait
docker compose --profile spring up -d --build --wait spring
docker compose run --rm http --fail-with-body -i -X POST http://spring:8080/orders/order-42 -H Content-Type:application/json --data-binary @/requests/order.json
docker compose run --rm http --fail-with-body http://spring:8080/received
docker compose logs --tail 20 spring
```

The first HTTP response is `202` with `topic`, `partition`, `offset` and `eventId`. `/received` eventually includes the consumed event. Retry the GET after a second if the listener has not caught up. The `http` container runs curl and mounts the supplied JSON file, so the commands work unchanged in PowerShell, bash and zsh.

La primera respuesta es `202` con `topic`, `partition`, `offset` y `eventId`. `/received` muestra el evento cuando el listener lo consume. Si todavía no aparece, repetí el GET tras un segundo. El contenedor `http` usa curl y monta el JSON incluido: los comandos funcionan igual en PowerShell, bash y zsh.

## Follow the code / Seguí el código

| File / Archivo | Role / Función |
|---|---|
| `src/main/java/course/spring/OrderPlaced.java` | Java record for the JSON event and input validation / Record Java para el evento JSON y validación de entrada |
| `OrderController.java` in the same folder / en la misma carpeta | HTTP input and observation endpoint / Entrada HTTP y punto de observación |
| `OrderProducer.java` | Write through `KafkaTemplate` / Escribir con `KafkaTemplate` |
| `OrderConsumer.java` | Read through `@KafkaListener` / Leer con `@KafkaListener` |
| `KafkaConfig.java` | Topic declaration and stop-on-error policy / Declaración del tópico y política de detener ante error |
| `src/main/resources/application.yml` | Serializers, group, offsets and acknowledgments / Serializadores, grupo, offsets y confirmaciones |

The essential producer call / La llamada esencial del productor:

```java
template.send(KafkaConfig.ORDERS, orderId, event)
    .thenApply(result -> result.getRecordMetadata());
```

The future completes when the write is acknowledged or fails. This example waits for that result before returning HTTP 202. A send failure is not reported as success. A timeout can leave the final write outcome uncertain; retrying an HTTP request requires a deliberate business idempotency policy.

El future termina cuando la escritura se confirma o falla. El ejemplo espera ese resultado antes de responder HTTP 202. Una falla de envío no se informa como éxito. Un timeout puede dejar incierto el resultado de la escritura; reintentar HTTP necesita una política explícita de idempotencia de negocio.

The listener / El listener:

```java
@KafkaListener(topics = KafkaConfig.ORDERS, groupId = "spring-kitchen")
public void onOrder(ConsumerRecord<String, OrderPlaced> record) {
    // Your processing uses record.key(), record.value(), record.partition(), record.offset().
    // Tu procesamiento usa record.key(), record.value(), record.partition(), record.offset().
}
```

The complete source records the event in a bounded observation list and logs it. `enable-auto-commit=false` and `ack-mode=record` let the Spring container commit the next offset after the listener returns normally. The included error handler stops the listener on failure and leaves the failed record uncommitted. `/ready` then returns 503. Diagnose and fix the error before restarting; this example deliberately does not silently discard failed records. It does not implement a retry topic or DLT.

El código completo registra el evento en una lista acotada y en el log. `enable-auto-commit=false` y `ack-mode=record` hacen que el contenedor de Spring confirme el próximo offset cuando el listener termina normalmente. Ante una falla, el manejador detiene el listener y deja el mensaje fallido sin confirmar. `/ready` devuelve 503. Diagnosticá y corregí antes de reiniciar; el ejemplo no descarta silenciosamente mensajes fallidos. No implementa tópicos de reintento ni DLT.

## Three experiments / Tres experimentos

1. **Repeat the POST / Repetí el POST.** The same key and event ID create a second record with a different offset. Producer idempotence deduplicates protocol retries, not separate calls. / La misma clave e ID crean otro mensaje con otro offset. La idempotencia del productor deduplica reintentos del protocolo, no llamadas separadas.
2. **Inspect group progress / Inspeccioná el avance.** Run the command below and wait for `LAG 0` on the populated partition. Empty partitions can show `-` for an absent committed offset and zero log-end offset. / Ejecutá lo siguiente y esperá `LAG 0` en la partición con datos. Las vacías pueden mostrar `-` para un offset no confirmado y cero como fin del log.

```sh
docker compose exec kafka1 /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka1:9092 --group spring-kitchen --describe
```

3. **Restart / Reiniciá.** The in-memory list clears; committed group offsets stay in Kafka. `earliest` only applies without a valid committed position. / La lista en memoria se vacía; los offsets confirmados quedan en Kafka. `earliest` solo se aplica sin una posición confirmada válida.

```sh
docker compose restart spring
docker compose --profile spring up -d --wait spring
docker compose run --rm http --fail-with-body http://spring:8080/received
```

Expected: `[]`. Publish again and confirm the new event appears. The list contains at most the last 200 observations and is not a database or durable deduplication store. A crash after a business effect but before the offset commit can repeat that effect. Use durable, atomic event-ID deduplication for external effects; Kafka transactions alone do not include arbitrary database or HTTP calls.

Esperado: `[]`. Publicá otra vez y verificá que aparezca el nuevo evento. La lista guarda como máximo las últimas 200 observaciones; no es una base ni un registro durable para deduplicar. Una caída entre el efecto de negocio y el commit puede repetir el efecto. Para efectos externos, usá deduplicación durable y atómica por ID; las transacciones Kafka no incluyen llamadas arbitrarias a bases o HTTP.

## Pause or replay / Pausá o reprocesá

```sh
docker compose --profile spring stop spring
```

To deliberately replay, stop the application first and reset only its inactive group. This reprocesses retained messages; it does not undo effects. / Para reprocesar a propósito, detené primero la aplicación y reiniciá solo su grupo inactivo. Esto relee mensajes retenidos; no deshace efectos.

```sh
docker compose exec kafka1 /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka1:9092 --group spring-kitchen --topic spring-orders --reset-offsets --to-earliest --execute
docker compose --profile spring up -d --wait spring
```

The HTTP port binds only to localhost. This is an unauthenticated local teaching application, not an internet deployment. Use authenticated TLS connections, validated contracts and a deliberate failure/retry policy for a production application.

El puerto HTTP se publica solo en localhost. Es una aplicación didáctica local sin autenticación, no un despliegue público. Para producción usá conexiones autenticadas con TLS, contratos validados y una política explícita de fallas y reintentos.

Primary references / Referencias oficiales: [Spring Boot Kafka integration](https://docs.spring.io/spring-boot/3.5/reference/messaging/kafka.html), [sending messages](https://docs.spring.io/spring-kafka/reference/kafka/sending-messages.html), [listener containers and offset commits](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/message-listener-container.html).
