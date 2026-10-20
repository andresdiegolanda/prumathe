package course;

import static course.Kafka.BOOT;
import static course.Kafka.producerProps;
import static course.Kafka.send;
import static course.Kafka.topic;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;

/**
 * Experiments that only write: sample data, batching, duplicates, skew and controlled timestamps.
 */
final class Producing {
  private Producing() {}

  /**
   * Fictional café orders. Topics 3, 6, 8, 27 and 28 choose each partition explicitly (six records);
   * the others let the default partitioner route three records by key.
   */
  static void seed(int n) throws Exception {
    boolean explicit = Set.of(3, 6, 8, 27, 28).contains(n);
    int count = explicit ? 6 : 3;
    try (KafkaProducer<String, String> p = new KafkaProducer<>(producerProps(BOOT))) {
      for (int i = 0; i < count; i++) {
        String key = explicit ? "order-" + (i % 3) : "order-" + (i % 2 + 1);
        String value =
            "{\"eventId\":\"E"
                + (i + 1)
                + "\",\"orderId\":\""
                + key
                + "\",\"type\":\"OrderPlaced\",\"amount\":"
                + (100 + i * 20)
                + "}";
        send(p, topic(n), explicit ? i % 3 : null, null, key, value);
      }
    }
  }

  static void put(int n, String key, String value) throws Exception {
    try (KafkaProducer<String, String> p = new KafkaProducer<>(producerProps(BOOT))) {
      send(p, topic(n), null, null, key, value);
    }
  }

  /**
   * 2,000 records with the given linger and batch size; prints the producer's own batching metrics.
   */
  static void benchmark(int n, int linger, int size) throws Exception {
    var props = producerProps(BOOT);
    props.put("linger.ms", "" + linger);
    props.put("batch.size", "" + size);
    props.put("compression.type", "lz4");
    long start = System.nanoTime();
    try (KafkaProducer<String, String> p = new KafkaProducer<>(props)) {
      List<Future<RecordMetadata>> sent = new ArrayList<>();
      for (int i = 0; i < 2000; i++) {
        sent.add(p.send(new ProducerRecord<>(topic(n), "key-" + (i % 20), "x".repeat(300))));
      }
      for (var f : sent) {
        f.get(30, TimeUnit.SECONDS);
      }
      System.out.printf("ACKNOWLEDGED 2000 elapsed_ms=%.1f%n", (System.nanoTime() - start) / 1e6);
      p.metrics()
          .forEach(
              (key, value) -> {
                if (Set.of(
                        "batch-size-avg",
                        "records-per-request-avg",
                        "record-retry-total",
                        "record-error-total")
                    .contains(key.name())) {
                  System.out.println(key.name() + "=" + value.metricValue());
                }
              });
    }
  }

  /** Two separate send calls with the same key and value: two logical records. */
  static void duplicate(int n) throws Exception {
    try (KafkaProducer<String, String> p = new KafkaProducer<>(producerProps(BOOT))) {
      for (int i = 0; i < 2; i++) {
        send(p, topic(n), null, null, "order-42", "event-E42");
      }
    }
  }

  /** A changing table: A=10, B=20, A=30 and a tombstone for B (null value). */
  static void compactSeed(int n) throws Exception {
    try (KafkaProducer<String, String> p = new KafkaProducer<>(producerProps(BOOT))) {
      String name = topic(n);
      send(p, name, null, null, "A", "10");
      send(p, name, null, null, "B", "20");
      send(p, name, null, null, "A", "30");
      send(p, name, null, null, "B", null);
    }
  }

  /** 90 of 100 records share one key; prints how many landed on each partition. */
  static void skew(int n) throws Exception {
    try (KafkaProducer<String, String> p = new KafkaProducer<>(producerProps(BOOT))) {
      Map<Integer, Integer> counts = new TreeMap<>();
      for (int i = 0; i < 100; i++) {
        var m =
            p.send(new ProducerRecord<>(topic(n), i < 90 ? "hot-key" : "key-" + i, "event-" + i))
                .get(25, TimeUnit.SECONDS);
        counts.merge(m.partition(), 1, Integer::sum);
      }
      System.out.println("PARTITION COUNTS " + counts);
    }
  }

  /**
   * Records with chosen timestamps (t=1s, 12s, 4s, 30s, 2s) on one partition, for the windows
   * lesson.
   */
  static void windowSeed(int n) throws Exception {
    long baseTime = (System.currentTimeMillis() / 10000) * 10000;
    try (KafkaProducer<String, String> p = new KafkaProducer<>(producerProps(BOOT))) {
      for (int seconds : new int[] {1, 12, 4, 30, 2}) {
        send(p, topic(n), 0, baseTime + seconds * 1000, "A", "t=" + seconds);
      }
      System.out.println(
          "Base timestamp="
              + baseTime
              + ". Interpret windows relative to this 10-second boundary.");
    }
  }
}
