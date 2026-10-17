package course;

import static course.Kafka.BOOT;
import static course.Kafka.consumerProps;
import static course.Kafka.producerProps;
import static course.Kafka.send;
import static course.Kafka.topic;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.common.TopicPartition;

/**
 * Delivery guarantees: the crash between two actions, transactions, read-process-write and its
 * proof.
 */
final class Transactions {
  private Transactions() {}

  /**
   * Writes an effect per input record to lab14-effects, then commits the input offsets. With crash,
   * it exits right after the first effect and before any commit, so the restart repeats that
   * effect.
   */
  static void delivery(boolean crash) throws Exception {
    try (KafkaConsumer<String, String> c =
            new KafkaConsumer<>(consumerProps(BOOT, "delivery-demo", "read_committed"));
        KafkaProducer<String, String> p = new KafkaProducer<>(producerProps(BOOT))) {
      var records = Consuming.snapshot(c, "lab14", true);
      for (var r : records) {
        send(p, "lab14-effects", null, null, r.key(), r.value());
        System.out.println("EFFECT WRITTEN");
        if (crash) {
          throw new IllegalStateException(
              "INTENTIONAL CRASH before input offset commit. Run delivery resume.");
        }
      }
      c.commitSync();
      System.out.println("COMMITTED input progress after effects.");
    }
  }

  /** One committed transaction and one that is flushed to the log and then aborted. */
  static void transactions(int n) throws Exception {
    var props = producerProps(BOOT);
    props.put("transactional.id", "course-tx-" + n);
    try (KafkaProducer<String, String> p = new KafkaProducer<>(props)) {
      p.initTransactions();
      p.beginTransaction();
      send(p, topic(n), null, null, "committed", "COMMITTED");
      p.commitTransaction();
      p.beginTransaction();
      send(p, topic(n), null, null, "aborted", "ABORTED");
      p.flush();
      p.abortTransaction();
      System.out.println("One committed transaction and one flushed then aborted transaction.");
    }
  }

  /**
   * Read-process-write: output records and the next input offsets commit in one transaction. With
   * abort, both are discarded together.
   */
  static void eos(int n, boolean abort) throws Exception {
    if (n != 16 && n != 27) {
      throw new IllegalArgumentException("eos supports lessons 16 and 27 only");
    }
    var props = producerProps(BOOT);
    props.put("transactional.id", "course-eos-" + n);
    try (KafkaProducer<String, String> p = new KafkaProducer<>(props);
        KafkaConsumer<String, String> c =
            new KafkaConsumer<>(consumerProps(BOOT, "eos-" + n, "read_committed"))) {
      p.initTransactions();
      var rows = Consuming.snapshot(c, topic(n), true);
      if (rows.isEmpty()) {
        System.out.println("NO REMAINING INPUT");
        return;
      }
      p.beginTransaction();
      try {
        for (var r : rows) {
          send(p, topic(n) + "-output", null, null, r.key(), "ready:" + r.value());
        }
        Map<TopicPartition, OffsetAndMetadata> next = new HashMap<>();
        for (var tp : c.assignment()) {
          next.put(tp, new OffsetAndMetadata(c.position(tp)));
        }
        // The business boundary: output records AND input progress in one Kafka transaction.
        p.sendOffsetsToTransaction(next, c.groupMetadata());
        if (abort) {
          p.flush();
          p.abortTransaction();
          System.out.println("ABORTED output and input progress together.");
        } else {
          p.commitTransaction();
          System.out.println(
              "COMMITTED " + rows.size() + " output records AND input offsets: " + next);
        }
      } catch (Exception ex) {
        try {
          p.abortTransaction();
        } catch (Exception ignored) {
          // The original failure is the one worth reporting.
        }
        throw ex;
      }
    }
  }

  /** The capstone proof: six inputs, one committed output per input, no lag left for the group. */
  static void verify(int n) throws Exception {
    var input = Consuming.read(topic(n), "read_committed");
    var out = Consuming.read(topic(n) + "-output", "read_committed");
    Map<String, Long> expected =
        input.stream()
            .collect(Collectors.groupingBy(r -> "ready:" + r.value(), Collectors.counting()));
    Map<String, Long> observed =
        out.stream().collect(Collectors.groupingBy(ConsumerRecord::value, Collectors.counting()));
    long backlog = Consuming.lag(n, "eos-" + n);
    if (input.size() != 6
        || !expected.equals(observed)
        || observed.values().stream().anyMatch(x -> x != 1)
        || backlog != 0) {
      throw new IllegalStateException(
          "VERIFY FAILED input="
              + input.size()
              + " output="
              + out.size()
              + " lag="
              + backlog
              + ". Prepare and run the complete capstone sequence.");
    }
    System.out.println("PASS: six unique committed outputs, exact input/output match, zero lag.");
  }
}
