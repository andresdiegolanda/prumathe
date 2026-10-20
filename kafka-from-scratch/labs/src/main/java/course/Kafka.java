package course;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.StringJoiner;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.errors.TopicExistsException;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;

/**
 * Shared pieces of every experiment: addresses, client settings, lesson topic names, the ACK line
 * that every write prints and the record line that every read prints.
 */
final class Kafka {
  /** Upper bound for metadata and offset lookups. */
  static final Duration WAIT = Duration.ofSeconds(30);

  /** Internal Docker addresses unless the environment says otherwise. */
  static final String BOOT =
      System.getenv().getOrDefault("BOOTSTRAP_SERVERS", "kafka1:9092,kafka2:9092,kafka3:9092");

  private Kafka() {}

  /**
   * Lesson topics are named lab1 to lab28; the setup lesson and the Spring lesson have none. The
   * number is the topic's, not the displayed lesson's: lab28 belongs to the console lesson (25).
   */
  static String topic(int n) {
    if (n < 1 || n > 28) {
      throw new IllegalArgumentException("Lesson ID must be 1..28");
    }
    return "lab" + n;
  }

  static Properties base(String bootstrap) {
    Properties p = new Properties();
    p.put("bootstrap.servers", bootstrap);
    p.put("request.timeout.ms", "10000");
    p.put("default.api.timeout.ms", "30000");
    return p;
  }

  static Admin admin() {
    return Admin.create(base(BOOT));
  }

  /**
   * acks=all plus idempotence, with bounded delivery so a refused write fails instead of hanging.
   */
  static Properties producerProps(String bootstrap) {
    Properties p = base(bootstrap);
    p.put("key.serializer", StringSerializer.class.getName());
    p.put("value.serializer", StringSerializer.class.getName());
    p.put("acks", "all");
    p.put("enable.idempotence", "true");
    p.put("delivery.timeout.ms", "15000");
    p.put("max.block.ms", "15000");
    return p;
  }

  /** Manual commits, earliest when the group has no bookmark, classic group protocol. */
  static Properties consumerProps(String bootstrap, String group, String isolation) {
    Properties p = base(bootstrap);
    p.put("key.deserializer", StringDeserializer.class.getName());
    p.put("value.deserializer", StringDeserializer.class.getName());
    p.put("group.id", group);
    p.put("enable.auto.commit", "false");
    p.put("auto.offset.reset", "earliest");
    p.put("isolation.level", isolation);
    p.put("group.protocol", "classic");
    p.put("max.poll.records", "500");
    return p;
  }

  /** Sends one record, waits for the broker result and prints its address. */
  static void send(
      KafkaProducer<String, String> p,
      String name,
      Integer partition,
      Long timestamp,
      String key,
      String value)
      throws Exception {
    ProducerRecord<String, String> r = new ProducerRecord<>(name, partition, timestamp, key, value);
    r.headers().add("event-type", "OrderPlaced".getBytes(StandardCharsets.UTF_8));
    r.headers().add("trace-id", "course-demo".getBytes(StandardCharsets.UTF_8));
    RecordMetadata m = p.send(r).get(25, TimeUnit.SECONDS);
    System.out.printf(
        "ACK topic=%s partition=%d offset=%d key=%s%n", m.topic(), m.partition(), m.offset(), key);
  }

  /** Creates a topic, or leaves an existing one untouched. */
  static void ensure(
      Admin a, String name, int partitions, short replicas, Map<String, String> config)
      throws Exception {
    try {
      a.createTopics(List.of(new NewTopic(name, partitions, replicas).configs(config)))
          .all()
          .get(30, TimeUnit.SECONDS);
    } catch (ExecutionException ex) {
      if (!(ex.getCause() instanceof TopicExistsException)) {
        throw ex;
      }
    }
  }

  static List<TopicPartition> partitions(KafkaConsumer<String, String> c, String name) {
    return c.partitionsFor(name, WAIT).stream()
        .map(p -> new TopicPartition(name, p.partition()))
        .toList();
  }

  /** One line per record: address, timestamp, key, value and headers. */
  static void print(ConsumerRecord<String, String> r) {
    StringJoiner h = new StringJoiner(",");
    for (Header x : r.headers()) {
      h.add(
          x.key()
              + "="
              + (x.value() == null ? "<null>" : new String(x.value(), StandardCharsets.UTF_8)));
    }
    System.out.printf(
        "%s P%d offset=%d timestamp=%d key=%s value=%s headers=[%s]%n",
        r.topic(),
        r.partition(),
        r.offset(),
        r.timestamp(),
        r.key(),
        r.value() == null ? "<null>" : r.value(),
        h);
  }
}
