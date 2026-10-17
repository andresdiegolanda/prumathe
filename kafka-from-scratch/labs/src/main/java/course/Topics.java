package course;

import static course.Kafka.WAIT;
import static course.Kafka.admin;
import static course.Kafka.ensure;
import static course.Kafka.topic;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.ConsumerGroupDescription;
import org.apache.kafka.clients.admin.ConsumerGroupListing;
import org.apache.kafka.clients.admin.NewPartitions;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.config.ConfigResource;

/** Lesson topics: preparation, description, offsets and partition changes. */
final class Topics {
  private Topics() {}

  /** The consumer groups a lesson creates, so preparation can reset them when they are idle. */
  static Set<String> knownGroups(int n) {
    return switch (n) {
      case 6 -> Set.of("kitchen", "billing");
      case 7 -> Set.of("bookmarks");
      case 8 -> Set.of("team");
      case 14 -> Set.of("delivery-demo");
      case 16, 27 -> Set.of("eos-" + n);
      case 20 -> Set.of("course-count-20");
      case 21 -> Set.of("course-window-21");
      case 23 -> Set.of("ops");
      default -> Set.of();
    };
  }

  /**
   * Deletes and recreates only this lesson's topics (labN, labN-*, and its Streams internals) with
   * the configuration the lesson needs. Refuses to run while a known lab group still has members.
   */
  static void prepare(int n) throws Exception {
    String name = topic(n);
    try (Admin a = admin()) {
      Set<String> existingGroups =
          a.listConsumerGroups().all().get(30, TimeUnit.SECONDS).stream()
              .map(ConsumerGroupListing::groupId)
              .collect(Collectors.toSet());
      for (String g : knownGroups(n)) {
        if (existingGroups.contains(g)) {
          ConsumerGroupDescription d =
              a.describeConsumerGroups(List.of(g)).all().get(30, TimeUnit.SECONDS).get(g);
          if (!d.members().isEmpty()) {
            throw new IllegalStateException(
                "Stop all members of " + g + " before preparing this lesson.");
          }
          a.deleteConsumerGroups(List.of(g)).all().get(30, TimeUnit.SECONDS);
        }
      }
      Set<String> all = a.listTopics().names().get(30, TimeUnit.SECONDS);
      List<String> remove =
          all.stream()
              .filter(
                  x ->
                      x.equals(name)
                          || x.startsWith(name + "-")
                          || (n == 20 && x.startsWith("course-count-20-"))
                          || (n == 21 && x.startsWith("course-window-21-")))
              .toList();
      if (!remove.isEmpty()) {
        a.deleteTopics(remove).all().get(30, TimeUnit.SECONDS);
        long end = System.nanoTime() + WAIT.toNanos();
        while (!Collections.disjoint(a.listTopics().names().get(30, TimeUnit.SECONDS), remove)) {
          if (System.nanoTime() > end) {
            throw new TimeoutException("Wait for topic deletion, then repeat prepare.");
          }
          Thread.sleep(250);
        }
      }
      int count = Set.of(3, 4, 6, 8, 23, 24, 27).contains(n) ? 3 : 1;
      Map<String, String> config = new HashMap<>();
      config.put("min.insync.replicas", n == 10 ? "3" : "2");
      if (n == 12) {
        config.put("retention.ms", "10000");
        config.put("segment.ms", "1000");
        config.put("file.delete.delay.ms", "1000");
      }
      if (n == 13) {
        config.put("cleanup.policy", "compact");
        config.put("segment.ms", "1000");
        config.put("min.cleanable.dirty.ratio", "0.01");
        config.put("max.compaction.lag.ms", "10000");
        config.put("delete.retention.ms", "60000");
      }
      if (n == 9) {
        // Explicit placement so the lesson knows which broker starts as leader.
        a.createTopics(List.of(new NewTopic(name, Map.of(0, List.of(1, 2, 3))).configs(config)))
            .all()
            .get(30, TimeUnit.SECONDS);
      } else {
        ensure(a, name, count, (short) 3, config);
      }
      if (n == 14) {
        ensure(a, "lab14-effects", 1, (short) 3, Map.of("min.insync.replicas", "2"));
      }
      if (n == 16 || n == 27) {
        ensure(a, name + "-output", count, (short) 3, Map.of("min.insync.replicas", "2"));
      }
      if (n == 20) {
        ensure(
            a,
            "lab20-counts",
            1,
            (short) 3,
            Map.of("cleanup.policy", "compact", "min.insync.replicas", "2"));
      }
      if (n == 21) {
        ensure(a, "lab21-windows", 1, (short) 3, Map.of("min.insync.replicas", "2"));
      }
      System.out.println(
          "READY "
              + name
              + " partitions="
              + count
              + " replicas=3. Only this lesson's Kafka data was reset.");
    }
  }

  /**
   * Partitions, leaders, replicas and ISR, plus the four configuration keys the lessons discuss.
   */
  static void describe(int n) throws Exception {
    try (Admin a = admin()) {
      for (var d :
          a.describeTopics(List.of(topic(n))).allTopicNames().get(30, TimeUnit.SECONDS).values()) {
        System.out.println(d);
        var cr = new ConfigResource(ConfigResource.Type.TOPIC, d.name());
        System.out.println(
            a
                .describeConfigs(List.of(cr))
                .all()
                .get(30, TimeUnit.SECONDS)
                .get(cr)
                .entries()
                .stream()
                .filter(
                    x ->
                        Set.of(
                                "min.insync.replicas",
                                "cleanup.policy",
                                "retention.ms",
                                "segment.ms")
                            .contains(x.name()))
                .toList());
      }
    }
  }

  static void expand(int n, int partitions) throws Exception {
    try (Admin a = admin()) {
      a.createPartitions(Map.of(topic(n), NewPartitions.increaseTo(partitions)))
          .all()
          .get(30, TimeUnit.SECONDS);
      System.out.println("EXPANDED");
    }
  }

  /** The KRaft lesson creates a topic while one controller is down. */
  static void createExtra(int n) throws Exception {
    if (n != 11) {
      throw new IllegalArgumentException("Only lab11-extra is supported");
    }
    try (Admin a = admin()) {
      ensure(a, "lab11-extra", 1, (short) 3, Map.of("min.insync.replicas", "2"));
      System.out.println("CREATED lab11-extra");
    }
  }

  static void cluster() throws Exception {
    try (Admin a = admin()) {
      System.out.println("CLUSTER " + a.describeCluster().clusterId().get(30, TimeUnit.SECONDS));
      System.out.println("BROKERS " + a.describeCluster().nodes().get(30, TimeUnit.SECONDS));
    }
  }
}
