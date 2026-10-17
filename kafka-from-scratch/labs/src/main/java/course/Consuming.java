package course;

import static course.Kafka.BOOT;
import static course.Kafka.WAIT;
import static course.Kafka.admin;
import static course.Kafka.consumerProps;
import static course.Kafka.partitions;
import static course.Kafka.print;
import static course.Kafka.topic;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicBoolean;
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.consumer.ConsumerRebalanceListener;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.errors.WakeupException;

/**
 * Reads: bounded snapshots, group consumption with commits, long-running members, lag and resets.
 */
final class Consuming {
  private Consuming() {}

  private static boolean reached(KafkaConsumer<String, String> c, Map<TopicPartition, Long> ends) {
    return !ends.isEmpty()
        && ends.entrySet().stream().allMatch(e -> c.position(e.getKey()) >= e.getValue());
  }

  /**
   * Reads everything up to the end offsets observed when the consumer first got its assignment.
   * Grouped reads subscribe (the group's bookmark decides where to start); plain reads assign every
   * partition and start at the beginning without touching any group.
   */
  static List<ConsumerRecord<String, String>> snapshot(
      KafkaConsumer<String, String> c, String name, boolean grouped) throws Exception {
    if (grouped) {
      c.subscribe(List.of(name));
    } else {
      List<TopicPartition> ps = partitions(c, name);
      c.assign(ps);
      c.seekToBeginning(ps);
    }
    List<ConsumerRecord<String, String>> records = new ArrayList<>();
    Map<TopicPartition, Long> ends = null;
    long deadline = System.nanoTime() + Duration.ofSeconds(45).toNanos();
    while (System.nanoTime() < deadline) {
      ConsumerRecords<String, String> batch = c.poll(Duration.ofMillis(500));
      if (ends == null && !c.assignment().isEmpty()) {
        ends = c.endOffsets(c.assignment(), WAIT);
      }
      for (var r : batch) {
        if (ends != null
            && r.offset()
                < ends.getOrDefault(new TopicPartition(r.topic(), r.partition()), Long.MAX_VALUE)) {
          records.add(r);
        }
      }
      if (ends != null && reached(c, ends)) {
        return records;
      }
    }
    throw new TimeoutException(
        "Snapshot did not reach its end offsets. Check brokers, leader/ISR and any open"
            + " transactions.");
  }

  /** A read that leaves no bookmark behind. */
  static List<ConsumerRecord<String, String>> read(String name, String isolation) throws Exception {
    try (KafkaConsumer<String, String> c =
        new KafkaConsumer<>(consumerProps(BOOT, "course-inspect", isolation))) {
      return snapshot(c, name, false);
    }
  }

  static void readAndPrint(String name, String isolation) throws Exception {
    var records = read(name, isolation);
    records.forEach(Kafka::print);
    System.out.println("RECORDS " + records.size());
  }

  static void offsets(int n) {
    try (KafkaConsumer<String, String> c =
        new KafkaConsumer<>(consumerProps(BOOT, "inspect", "read_uncommitted"))) {
      var ps = partitions(c, topic(n));
      var starts = c.beginningOffsets(ps, WAIT);
      var ends = c.endOffsets(ps, WAIT);
      for (var p : ps) {
        System.out.printf("P%d beginning=%d end=%d%n", p.partition(), starts.get(p), ends.get(p));
      }
    }
  }

  /** Committed position, log end and their difference, per partition; returns the total. */
  static long lag(int n, String group) throws Exception {
    try (Admin a = admin();
        KafkaConsumer<String, String> c =
            new KafkaConsumer<>(consumerProps(BOOT, "inspect", "read_committed"))) {
      var ps = partitions(c, topic(n));
      var ends = c.endOffsets(ps, WAIT);
      var starts = c.beginningOffsets(ps, WAIT);
      var committed =
          a.listConsumerGroupOffsets(group)
              .partitionsToOffsetAndMetadata()
              .get(30, TimeUnit.SECONDS);
      long sum = 0;
      for (var tp : ps) {
        var off = committed.get(tp);
        long position = off == null ? starts.get(tp) : off.offset();
        long gap = ends.get(tp) - position;
        sum += gap;
        System.out.printf(
            "%s P%d committed=%s end=%d lag=%d%n",
            group,
            tp.partition(),
            off == null ? "UNSET (using earliest for estimate)" : position,
            ends.get(tp),
            gap);
      }
      return sum;
    }
  }

  /** Moves an idle group's bookmark back to the beginning of each partition. */
  static void reset(int n, String group) throws Exception {
    try (Admin a = admin();
        KafkaConsumer<String, String> c =
            new KafkaConsumer<>(consumerProps(BOOT, "inspect", "read_uncommitted"))) {
      // The broker also refuses altering offsets of an active group.
      var ps = partitions(c, topic(n));
      var starts = c.beginningOffsets(ps, WAIT);
      Map<TopicPartition, OffsetAndMetadata> next = new HashMap<>();
      starts.forEach((p, o) -> next.put(p, new OffsetAndMetadata(o)));
      a.alterConsumerGroupOffsets(group, next).all().get(30, TimeUnit.SECONDS);
      System.out.println("RESET " + group + " " + next);
    }
  }

  /** Processes what the group has not seen yet and commits the next positions synchronously. */
  static void consume(int n, String group) throws Exception {
    try (KafkaConsumer<String, String> c =
        new KafkaConsumer<>(consumerProps(BOOT, group, "read_committed"))) {
      var records = snapshot(c, topic(n), true);
      records.forEach(Kafka::print);
      c.commitSync();
      System.out.println(
          "PROCESSED "
              + records.size()
              + "; committed next positions: "
              + c.committed(c.assignment()));
    }
  }

  /** A long-running member that prints assignments and records until Ctrl+C. */
  static void watch(int n, String group) {
    KafkaConsumer<String, String> c =
        new KafkaConsumer<>(consumerProps(BOOT, group, "read_committed"));
    AtomicBoolean closing = new AtomicBoolean();
    Thread hook =
        new Thread(
            () -> {
              closing.set(true);
              c.wakeup();
            });
    Runtime.getRuntime().addShutdownHook(hook);
    try (c) {
      c.subscribe(
          List.of(topic(n)),
          new ConsumerRebalanceListener() {
            public void onPartitionsRevoked(Collection<TopicPartition> p) {
              System.out.println("REVOKED " + p);
            }

            public void onPartitionsAssigned(Collection<TopicPartition> p) {
              System.out.println("ASSIGNED " + p);
            }
          });
      while (!closing.get()) {
        var rows = c.poll(Duration.ofSeconds(1));
        for (var r : rows) {
          print(r);
        }
        if (!rows.isEmpty()) {
          c.commitSync();
        }
      }
    } catch (WakeupException ex) {
      if (!closing.get()) {
        throw ex;
      }
    }
  }

  static void describeGroup(String group) throws Exception {
    try (Admin a = admin()) {
      System.out.println(a.describeConsumerGroups(List.of(group)).all().get(30, TimeUnit.SECONDS));
    }
  }

  /** Rebuilds a table from a compacted log: latest value per key, tombstones remove the key. */
  static void table(int n) throws Exception {
    Map<String, String> table = new LinkedHashMap<>();
    for (var r : read(topic(n), "read_committed")) {
      if (r.value() == null) {
        table.remove(r.key());
      } else {
        table.put(r.key(), r.value());
      }
    }
    System.out.println("TABLE " + table);
  }

  /** Application-level deduplication with an in-memory set: a demonstration, not a durable sink. */
  static void dedup(int n) throws Exception {
    Set<String> seen = new HashSet<>();
    for (var r : read(topic(n), "read_committed")) {
      System.out.println((seen.add(r.value()) ? "APPLY " : "SKIP ") + r.value());
    }
    System.out.println("DEMO ONLY: the deduplication set is in memory, not a durable sink.");
  }
}
