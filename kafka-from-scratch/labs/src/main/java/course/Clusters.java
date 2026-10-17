package course;

import static course.Kafka.base;
import static course.Kafka.consumerProps;
import static course.Kafka.ensure;
import static course.Kafka.producerProps;
import static course.Kafka.send;

import java.time.Duration;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.AlterConfigOp;
import org.apache.kafka.clients.admin.ConfigEntry;
import org.apache.kafka.clients.consumer.AcknowledgeType;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.KafkaShareConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.config.ConfigResource;
import org.apache.kafka.common.serialization.StringDeserializer;

/** The optional single-node clusters: the mirror destination and the share-group preview broker. */
final class Clusters {
  private Clusters() {}

  /**
   * A naive one-shot copy of lab25 into a destination that already holds a record, so source and
   * destination offsets visibly differ. Repeating it duplicates records on purpose.
   */
  static void mirror() throws Exception {
    String target = "lab25-copy";
    try (Admin a = Admin.create(base("mirror:9092"))) {
      ensure(a, target, 1, (short) 1, Map.of());
    }
    try (KafkaProducer<String, String> p = new KafkaProducer<>(producerProps("mirror:9092"));
        KafkaConsumer<String, String> c =
            new KafkaConsumer<>(
                consumerProps("mirror:9092", "mirror-inspect", "read_uncommitted"))) {
      var ps = Kafka.partitions(c, target);
      if (c.endOffsets(ps).values().stream().allMatch(x -> x == 0)) {
        send(p, target, 0, null, "existing", "Destination already has this record");
      }
      for (var r : Consuming.read("lab25", "read_committed")) {
        var m = p.send(new ProducerRecord<>(target, r.key(), r.value())).get(25, TimeUnit.SECONDS);
        System.out.printf(
            "SOURCE P%d offset=%d -> TARGET P%d offset=%d key=%s%n",
            r.partition(), r.offset(), m.partition(), m.offset(), r.key());
      }
    }
  }

  /**
   * Share groups on the preview broker: six records on one partition, the first delivery is
   * released, every later delivery is accepted, and the released record comes back.
   */
  static void share() throws Exception {
    String name = "lab26-" + System.currentTimeMillis();
    String group = "share-" + System.currentTimeMillis();
    try (Admin a = Admin.create(base("share:9092"))) {
      ensure(a, name, 1, (short) 1, Map.of());
      var config = new ConfigResource(ConfigResource.Type.GROUP, group);
      a.incrementalAlterConfigs(
              Map.of(
                  config,
                  List.of(
                      new AlterConfigOp(
                          new ConfigEntry("share.auto.offset.reset", "earliest"),
                          AlterConfigOp.OpType.SET))))
          .all()
          .get(30, TimeUnit.SECONDS);
    }
    try (KafkaProducer<String, String> p = new KafkaProducer<>(producerProps("share:9092"))) {
      for (int i = 0; i < 6; i++) {
        send(p, name, 0, null, "job-" + i, "work-" + i);
      }
    }
    var p = base("share:9092");
    p.put("group.id", group);
    p.put("key.deserializer", StringDeserializer.class.getName());
    p.put("value.deserializer", StringDeserializer.class.getName());
    p.put("share.acknowledgement.mode", "explicit");
    Set<Long> accepted = new HashSet<>();
    boolean released = false;
    long deadline = System.nanoTime() + Duration.ofSeconds(60).toNanos();
    try (KafkaShareConsumer<String, String> c = new KafkaShareConsumer<>(p)) {
      c.subscribe(List.of(name));
      while (accepted.size() < 6 && System.nanoTime() < deadline) {
        for (var r : c.poll(Duration.ofSeconds(1))) {
          if (!released) {
            c.acknowledge(r, AcknowledgeType.RELEASE);
            released = true;
            System.out.println("RELEASE " + r.offset());
          } else {
            c.acknowledge(r, AcknowledgeType.ACCEPT);
            accepted.add(r.offset());
            System.out.println("ACCEPT " + r.offset());
          }
        }
        var result = c.commitSync();
        for (var resultEntry : result.entrySet()) {
          if (resultEntry.getValue().isPresent()) {
            throw resultEntry.getValue().get();
          }
        }
      }
      if (accepted.size() != 6) {
        throw new TimeoutException(
            "Expected six accepted records including a redelivery; got " + accepted.size());
      }
      System.out.println("PASS: released once, accepted all six offsets.");
    }
  }
}
