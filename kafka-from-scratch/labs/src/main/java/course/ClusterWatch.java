package course;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.Config;
import org.apache.kafka.clients.admin.ConsumerGroupDescription;
import org.apache.kafka.clients.admin.GroupListing;
import org.apache.kafka.clients.admin.ListConsumerGroupOffsetsSpec;
import org.apache.kafka.clients.admin.ListGroupsOptions;
import org.apache.kafka.clients.admin.ListOffsetsResult;
import org.apache.kafka.clients.admin.ListTopicsOptions;
import org.apache.kafka.clients.admin.MemberDescription;
import org.apache.kafka.clients.admin.OffsetSpec;
import org.apache.kafka.clients.admin.TopicDescription;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.Node;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.TopicPartitionInfo;
import org.apache.kafka.common.config.ConfigResource;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.common.serialization.ByteArrayDeserializer;

/**
 * Reads the state of the course cluster for the live viewer and turns the difference between two
 * readings into events. It only reads: Admin API calls that describe and list, and a consumer
 * without group.id that is assigned partitions by hand, so it never joins a group, creates a topic
 * or commits an offset. What the lab commands print is the same with the viewer running or not.
 */
final class ClusterWatch implements AutoCloseable {
  /** Records kept per partition: the last ones before the end of the log. */
  static final int WINDOW = 7;

  private static final int MAX_EVENTS = 60;
  private static final int MAX_TEXT = 4000;
  private static final long CONFIG_EVERY_MS = 5000;
  private static final List<String> CONFIG_KEYS =
      List.of("cleanup.policy", "retention.ms", "min.insync.replicas");

  private final Admin admin;
  private final KafkaConsumer<byte[], byte[]> consumer;

  private final Map<Integer, String> brokerHosts = new TreeMap<>();
  private final Map<TopicPartition, long[]> windows = new HashMap<>();
  private final Map<TopicPartition, List<Rec>> records = new HashMap<>();
  private final Map<String, Map<String, String>> configs = new HashMap<>();
  private final Deque<String> events = new ArrayDeque<>();
  private long lastConfigRead;
  private long eventSeq;
  private Snapshot previous;

  ClusterWatch(String bootstrap) {
    Properties a = new Properties();
    a.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrap);
    a.put(AdminClientConfig.CLIENT_ID_CONFIG, "course-visor-admin");
    a.put(AdminClientConfig.REQUEST_TIMEOUT_MS_CONFIG, 3000);
    a.put(AdminClientConfig.DEFAULT_API_TIMEOUT_MS_CONFIG, 4000);
    admin = Admin.create(a);
    Properties c = new Properties();
    c.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrap);
    c.put(ConsumerConfig.CLIENT_ID_CONFIG, "course-visor-reader");
    c.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
    c.put(ConsumerConfig.ISOLATION_LEVEL_CONFIG, "read_uncommitted");
    c.put(ConsumerConfig.FETCH_MAX_WAIT_MS_CONFIG, 50);
    c.put(ConsumerConfig.REQUEST_TIMEOUT_MS_CONFIG, 3000);
    c.put(ConsumerConfig.DEFAULT_API_TIMEOUT_MS_CONFIG, 4000);
    consumer = new KafkaConsumer<>(c, new ByteArrayDeserializer(), new ByteArrayDeserializer());
  }

  @Override
  public void close() {
    consumer.close(Duration.ofSeconds(2));
    admin.close(Duration.ofSeconds(2));
  }

  /** One reading of the cluster. On failure it keeps the last good reading and says why. */
  String read(long version) {
    long now = System.currentTimeMillis();
    Snapshot s = new Snapshot();
    try {
      for (Node n : admin.describeCluster().nodes().get(4, TimeUnit.SECONDS)) {
        s.up.add(n.id());
        brokerHosts.put(n.id(), n.host() + ":" + n.port());
      }
      try {
        s.controller = admin.describeMetadataQuorum().quorumInfo().get(4, TimeUnit.SECONDS).leaderId();
      } catch (Exception e) {
        s.controller = previous == null ? -1 : previous.controller;
      }
      Set<String> names =
          admin.listTopics(new ListTopicsOptions().listInternal(true)).names().get(4, TimeUnit.SECONDS);
      Map<String, TopicDescription> described =
          names.isEmpty() ? Map.of() : admin.describeTopics(names).allTopicNames().get(4, TimeUnit.SECONDS);
      readTopics(s, new TreeMap<>(described), now);
      readGroups(s);
      s.ok = true;
    } catch (Exception e) {
      Throwable root = e.getCause() == null ? e : e.getCause();
      if (previous != null) {
        Snapshot last = previous;
        last.ok = false;
        last.error = root.getClass().getSimpleName();
        last.readAt = now;
        return last.json(version, brokerHosts, events);
      }
      s.ok = false;
      s.error = root.getClass().getSimpleName();
    }
    s.readAt = now;
    if (s.ok) {
      if (previous == null) {
        event(now, "{\"code\":\"start\",\"brokers\":" + s.up.size() + ",\"topics\":" + s.lessonTopics() + "}");
      } else {
        diff(previous, s, now);
      }
      previous = s;
    }
    return s.json(version, brokerHosts, events);
  }

  private void readTopics(Snapshot s, Map<String, TopicDescription> described, long now)
      throws Exception {
    Map<TopicPartition, OffsetSpec> earliest = new HashMap<>();
    Map<TopicPartition, OffsetSpec> latest = new HashMap<>();
    for (TopicDescription d : described.values()) {
      Topic t = new Topic(d.name(), d.isInternal());
      for (TopicPartitionInfo p : d.partitions()) {
        Part part = new Part(p.partition());
        part.leader = p.leader() == null || p.leader().isEmpty() ? -1 : p.leader().id();
        for (Node r : p.replicas()) {
          part.replicas.add(r.id());
          brokerHosts.putIfAbsent(r.id(), "");
        }
        for (Node r : p.isr()) {
          part.isr.add(r.id());
        }
        t.parts.add(part);
        TopicPartition tp = new TopicPartition(d.name(), p.partition());
        if (part.leader >= 0) {
          earliest.put(tp, OffsetSpec.earliest());
          latest.put(tp, OffsetSpec.latest());
        }
      }
      s.topics.put(t.name, t);
    }
    Map<TopicPartition, Long> starts = offsets(earliest);
    Map<TopicPartition, Long> ends = offsets(latest);
    List<TopicPartition> stale = new ArrayList<>();
    for (Topic t : s.topics.values()) {
      for (Part p : t.parts) {
        TopicPartition tp = new TopicPartition(t.name, p.id);
        Part before = previous == null ? null : previous.part(tp);
        p.start = starts.getOrDefault(tp, before == null ? -1 : before.start);
        p.end = ends.getOrDefault(tp, before == null ? -1 : before.end);
        if (!t.internal && p.end >= 0) {
          long[] w = windows.get(tp);
          if (w == null || w[0] != p.start || w[1] != p.end) {
            stale.add(tp);
          }
        }
      }
    }
    windows.keySet().removeIf(tp -> !s.topics.containsKey(tp.topic()));
    records.keySet().removeIf(tp -> !s.topics.containsKey(tp.topic()));
    configs.keySet().removeIf(name -> !s.topics.containsKey(name));
    fetch(s, stale);
    boolean newTopic = s.topics.keySet().stream().anyMatch(n -> !configs.containsKey(n));
    if (newTopic || now - lastConfigRead > CONFIG_EVERY_MS) {
      readConfigs(s.topics.keySet());
      lastConfigRead = now;
    }
  }

  private Map<TopicPartition, Long> offsets(Map<TopicPartition, OffsetSpec> specs) {
    Map<TopicPartition, Long> out = new HashMap<>();
    if (specs.isEmpty()) {
      return out;
    }
    ListOffsetsResult r = admin.listOffsets(specs);
    for (TopicPartition tp : specs.keySet()) {
      try {
        out.put(tp, r.partitionResult(tp).get(4, TimeUnit.SECONDS).offset());
      } catch (Exception e) {
        // A partition without a reachable leader keeps its last known offsets.
      }
    }
    return out;
  }

  /** Reads again the last records of every partition whose start or end moved. */
  private void fetch(Snapshot s, List<TopicPartition> stale) {
    if (stale.isEmpty()) {
      return;
    }
    Map<TopicPartition, Long> until = new HashMap<>();
    Map<TopicPartition, List<Rec>> fresh = new HashMap<>();
    for (TopicPartition tp : stale) {
      Part p = s.part(tp);
      until.put(tp, p.end);
      fresh.put(tp, new ArrayList<>());
    }
    try {
      consumer.assign(stale);
      for (TopicPartition tp : stale) {
        Part p = s.part(tp);
        consumer.seek(tp, Math.max(p.start, p.end - WINDOW));
      }
      long deadline = System.currentTimeMillis() + 1500;
      Set<TopicPartition> pending = new HashSet<>(stale);
      pending.removeIf(tp -> s.part(tp).end <= Math.max(s.part(tp).start, 0));
      while (!pending.isEmpty() && System.currentTimeMillis() < deadline) {
        for (ConsumerRecord<byte[], byte[]> r : consumer.poll(Duration.ofMillis(100))) {
          TopicPartition tp = new TopicPartition(r.topic(), r.partition());
          if (fresh.containsKey(tp) && r.offset() < until.get(tp)) {
            fresh.get(tp).add(Rec.of(r));
          }
        }
        pending.removeIf(tp -> consumer.position(tp, Duration.ofSeconds(2)) >= until.get(tp));
      }
      for (TopicPartition tp : stale) {
        if (pending.contains(tp)) {
          continue;
        }
        List<Rec> list = fresh.get(tp);
        if (list.size() > WINDOW) {
          list = new ArrayList<>(list.subList(list.size() - WINDOW, list.size()));
        }
        records.put(tp, list);
        Part p = s.part(tp);
        windows.put(tp, new long[] {p.start, p.end});
      }
    } catch (Exception e) {
      // Leave those partitions for the next reading.
    } finally {
      consumer.assign(List.of());
    }
  }

  private void readConfigs(Collection<String> names) {
    if (names.isEmpty()) {
      return;
    }
    List<ConfigResource> resources =
        names.stream().map(n -> new ConfigResource(ConfigResource.Type.TOPIC, n)).toList();
    try {
      Map<ConfigResource, Config> all = admin.describeConfigs(resources).all().get(4, TimeUnit.SECONDS);
      for (var e : all.entrySet()) {
        Map<String, String> kept = new LinkedHashMap<>();
        for (String key : CONFIG_KEYS) {
          var entry = e.getValue().get(key);
          if (entry != null && entry.value() != null) {
            kept.put(key, entry.value());
          }
        }
        configs.put(e.getKey().name(), kept);
      }
    } catch (Exception e) {
      // Keep the previous values; they are only shown in the detail panel.
    }
  }

  private void readGroups(Snapshot s) throws Exception {
    Collection<GroupListing> listed =
        admin.listGroups(ListGroupsOptions.forConsumerGroups()).all().get(4, TimeUnit.SECONDS);
    List<String> ids = listed.stream().map(GroupListing::groupId).sorted().toList();
    if (ids.isEmpty()) {
      return;
    }
    Map<String, ConsumerGroupDescription> described =
        admin.describeConsumerGroups(ids).all().get(4, TimeUnit.SECONDS);
    Map<String, ListConsumerGroupOffsetsSpec> specs = new LinkedHashMap<>();
    ids.forEach(id -> specs.put(id, new ListConsumerGroupOffsetsSpec()));
    Map<String, Map<TopicPartition, OffsetAndMetadata>> committed =
        admin.listConsumerGroupOffsets(specs).all().get(4, TimeUnit.SECONDS);
    for (String id : ids) {
      ConsumerGroupDescription d = described.get(id);
      if (d == null) {
        continue;
      }
      Group g = new Group(id);
      g.state = d.groupState() == null ? "Unknown" : d.groupState().toString();
      g.type = d.type() == null ? "" : d.type().toString();
      g.epoch = d.groupEpoch().orElse(-1);
      for (MemberDescription m : d.members()) {
        Member member = new Member(m.consumerId(), m.clientId(), m.host());
        for (TopicPartition tp : m.assignment().topicPartitions()) {
          member.assigned.add(tp);
        }
        g.members.add(member);
      }
      g.members.sort((x, y) -> x.client.compareTo(y.client));
      committed.getOrDefault(id, Map.of()).entrySet().stream()
          .filter(x -> x.getValue() != null)
          .sorted(
              Comparator.comparing((Map.Entry<TopicPartition, OffsetAndMetadata> x) -> x.getKey().topic())
                  .thenComparingInt(x -> x.getKey().partition()))
          .forEach(x -> g.offsets.put(x.getKey(), x.getValue().offset()));
      s.groups.put(id, g);
    }
  }

  // ---------------------------------------------------------------- events

  private void event(long now, String body) {
    eventSeq++;
    events.addFirst("{\"seq\":" + eventSeq + ",\"t\":" + now + "," + body.substring(1));
    while (events.size() > MAX_EVENTS) {
      events.removeLast();
    }
  }

  private void diff(Snapshot a, Snapshot b, long now) {
    for (int id : brokerHosts.keySet()) {
      boolean was = a.up.contains(id), is = b.up.contains(id);
      if (was && !is) {
        event(now, "{\"code\":\"brokerDown\",\"broker\":" + id + "}");
      } else if (!was && is) {
        event(now, "{\"code\":\"brokerUp\",\"broker\":" + id + "}");
      }
    }
    if (a.controller != b.controller && b.controller >= 0) {
      event(now, "{\"code\":\"controller\",\"from\":" + a.controller + ",\"to\":" + b.controller + "}");
    }
    for (Topic t : b.topics.values()) {
      Topic old = a.topics.get(t.name);
      if (old == null) {
        int rf = t.parts.isEmpty() ? 0 : t.parts.get(0).replicas.size();
        event(now, "{\"code\":\"topicCreated\",\"topic\":" + q(t.name) + ",\"partitions\":" + t.parts.size() + ",\"rf\":" + rf + ",\"internal\":" + t.internal + "}");
        continue;
      }
      if (t.parts.size() > old.parts.size()) {
        event(now, "{\"code\":\"partitionsAdded\",\"topic\":" + q(t.name) + ",\"from\":" + old.parts.size() + ",\"to\":" + t.parts.size() + "}");
      }
      List<String> added = new ArrayList<>();
      int total = 0;
      int leaders = 0;
      int isrs = 0;
      for (Part p : t.parts) {
        Part o = old.part(p.id);
        if (o == null) {
          continue;
        }
        if (o.end >= 0 && p.end > o.end) {
          // New records, not offsets: transaction markers also take an offset.
          List<Rec> cached = records.get(new TopicPartition(t.name, p.id));
          long fresh =
              cached == null || p.end - o.end > WINDOW
                  ? p.end - o.end
                  : cached.stream().filter(r -> r.offset >= o.end).count();
          if (fresh > 0) {
            added.add("[" + p.id + "," + fresh + "]");
            total += (int) fresh;
          }
        }
        if (o.start >= 0 && p.start > o.start && !t.internal) {
          event(now, "{\"code\":\"startMoved\",\"topic\":" + q(t.name) + ",\"p\":" + p.id + ",\"from\":" + o.start + ",\"to\":" + p.start + "}");
        }
        boolean leaderMoved = o.leader != p.leader;
        boolean isrMoved = !new TreeSet<>(o.isr).equals(new TreeSet<>(p.isr));
        if (t.internal) {
          leaders += leaderMoved ? 1 : 0;
          isrs += isrMoved ? 1 : 0;
          continue;
        }
        if (leaderMoved) {
          event(now, "{\"code\":\"leader\",\"topic\":" + q(t.name) + ",\"p\":" + p.id + ",\"from\":" + o.leader + ",\"to\":" + p.leader + "}");
        }
        if (isrMoved) {
          event(now, "{\"code\":\"isr\",\"topic\":" + q(t.name) + ",\"p\":" + p.id + ",\"from\":" + ints(o.isr) + ",\"to\":" + ints(p.isr) + "}");
        }
      }
      if (leaders + isrs > 0) {
        // Internal topics have dozens of partitions: one line per topic instead of one per partition.
        event(now, "{\"code\":\"internalMoved\",\"topic\":" + q(t.name) + ",\"leaders\":" + leaders + ",\"isr\":" + isrs + "}");
      }
      if (total > 0 && !t.internal) {
        event(now, "{\"code\":\"records\",\"topic\":" + q(t.name) + ",\"count\":" + total + ",\"parts\":[" + String.join(",", added) + "]}");
      }
    }
    for (String name : a.topics.keySet()) {
      if (!b.topics.containsKey(name)) {
        event(now, "{\"code\":\"topicDeleted\",\"topic\":" + q(name) + "}");
      }
    }
    for (Group g : b.groups.values()) {
      Group old = a.groups.get(g.id);
      if (old == null) {
        event(now, "{\"code\":\"groupCreated\",\"group\":" + q(g.id) + "}");
        old = new Group(g.id);
        old.state = "";
      } else if (!Objects.equals(old.state, g.state)) {
        event(now, "{\"code\":\"groupState\",\"group\":" + q(g.id) + ",\"from\":" + q(old.state) + ",\"to\":" + q(g.state) + "}");
      }
      if (!assignment(old).equals(assignment(g))) {
        event(now, "{\"code\":\"assignment\",\"group\":" + q(g.id) + ",\"members\":" + g.members.size() + ",\"before\":" + old.members.size() + "}");
      }
      Map<String, List<String>> moved = new TreeMap<>();
      for (var e : g.offsets.entrySet()) {
        Long was = old.offsets.get(e.getKey());
        if (was == null || !was.equals(e.getValue())) {
          moved.computeIfAbsent(e.getKey().topic(), k -> new ArrayList<>())
              .add("[" + e.getKey().partition() + "," + (was == null ? -1 : was) + "," + e.getValue() + "]");
        }
      }
      for (var e : moved.entrySet()) {
        event(now, "{\"code\":\"commit\",\"group\":" + q(g.id) + ",\"topic\":" + q(e.getKey()) + ",\"parts\":[" + String.join(",", e.getValue()) + "]}");
      }
    }
    for (String id : a.groups.keySet()) {
      if (!b.groups.containsKey(id)) {
        event(now, "{\"code\":\"groupDeleted\",\"group\":" + q(id) + "}");
      }
    }
  }

  private static Map<String, Set<TopicPartition>> assignment(Group g) {
    Map<String, Set<TopicPartition>> out = new TreeMap<>();
    for (Member m : g.members) {
      out.put(m.id, new HashSet<>(m.assigned));
    }
    return out;
  }

  // ---------------------------------------------------------------- model and JSON

  static final class Rec {
    long offset;
    long timestamp;
    String key;
    String value;
    int keyBytes;
    int valueBytes;
    List<String[]> headers = new ArrayList<>();

    static Rec of(ConsumerRecord<byte[], byte[]> r) {
      Rec x = new Rec();
      x.offset = r.offset();
      x.timestamp = r.timestamp();
      x.key = text(r.key());
      x.value = text(r.value());
      x.keyBytes = r.key() == null ? -1 : r.key().length;
      x.valueBytes = r.value() == null ? -1 : r.value().length;
      for (Header h : r.headers()) {
        x.headers.add(new String[] {h.key(), text(h.value())});
      }
      return x;
    }

    /** Text as written when it is UTF-8; otherwise the first bytes in hexadecimal. */
    static String text(byte[] b) {
      if (b == null) {
        return null;
      }
      try {
        CharBuffer cb =
            StandardCharsets.UTF_8.newDecoder()
                .onMalformedInput(CodingErrorAction.REPORT)
                .onUnmappableCharacter(CodingErrorAction.REPORT)
                .decode(ByteBuffer.wrap(b));
        String s = cb.toString();
        boolean control = s.chars().anyMatch(c -> c < 0x20 && c != '\n' && c != '\r' && c != '\t');
        if (!control) {
          return s.length() > MAX_TEXT ? s.substring(0, MAX_TEXT) + "…" : s;
        }
      } catch (CharacterCodingException e) {
        // Binary: fall through to hexadecimal.
      }
      StringBuilder hex = new StringBuilder("0x");
      for (int i = 0; i < Math.min(b.length, 48); i++) {
        hex.append(String.format("%02x", b[i]));
      }
      return hex.append(b.length > 48 ? "…" : "").toString();
    }
  }

  static final class Part {
    final int id;
    int leader = -1;
    long start = -1;
    long end = -1;
    final List<Integer> replicas = new ArrayList<>();
    final List<Integer> isr = new ArrayList<>();

    Part(int id) {
      this.id = id;
    }
  }

  static final class Topic {
    final String name;
    final boolean internal;
    final List<Part> parts = new ArrayList<>();

    Topic(String name, boolean internal) {
      this.name = name;
      this.internal = internal;
    }

    Part part(int id) {
      return parts.stream().filter(p -> p.id == id).findFirst().orElse(null);
    }
  }

  static final class Member {
    final String id;
    final String client;
    final String host;
    final List<TopicPartition> assigned = new ArrayList<>();

    Member(String id, String client, String host) {
      this.id = id;
      this.client = client;
      this.host = host;
    }
  }

  static final class Group {
    final String id;
    String state = "Unknown";
    String type = "";
    int epoch = -1;
    final List<Member> members = new ArrayList<>();
    final Map<TopicPartition, Long> offsets = new LinkedHashMap<>();

    Group(String id) {
      this.id = id;
    }
  }

  final class Snapshot {
    boolean ok;
    String error;
    long readAt;
    int controller = -1;
    final Set<Integer> up = new TreeSet<>();
    final Map<String, Topic> topics = new TreeMap<>();
    final Map<String, Group> groups = new TreeMap<>();

    Part part(TopicPartition tp) {
      Topic t = topics.get(tp.topic());
      return t == null ? null : t.part(tp.partition());
    }

    long lessonTopics() {
      return topics.values().stream().filter(t -> t.name.matches("lab\\d+")).count();
    }

    String json(long version, Map<Integer, String> hosts, Collection<String> evs) {
      StringBuilder j = new StringBuilder(4096);
      j.append("{\"version\":").append(version)
          .append(",\"ok\":").append(ok)
          .append(",\"error\":").append(error == null ? "null" : q(error))
          .append(",\"readAt\":").append(readAt)
          .append(",\"window\":").append(WINDOW)
          .append(",\"controller\":").append(controller)
          .append(",\"brokers\":[");
      boolean first = true;
      for (var e : hosts.entrySet()) {
        j.append(first ? "" : ",").append("{\"id\":").append(e.getKey())
            .append(",\"address\":").append(q(e.getValue()))
            .append(",\"up\":").append(up.contains(e.getKey())).append('}');
        first = false;
      }
      j.append("],\"topics\":[");
      first = true;
      for (Topic t : topics.values()) {
        j.append(first ? "" : ",").append("{\"name\":").append(q(t.name))
            .append(",\"internal\":").append(t.internal)
            .append(",\"config\":{");
        boolean f2 = true;
        for (var c : configs.getOrDefault(t.name, Map.of()).entrySet()) {
          j.append(f2 ? "" : ",").append(q(c.getKey())).append(':').append(q(c.getValue()));
          f2 = false;
        }
        j.append("},\"partitions\":[");
        f2 = true;
        for (Part p : t.parts) {
          j.append(f2 ? "" : ",").append("{\"p\":").append(p.id)
              .append(",\"leader\":").append(p.leader)
              .append(",\"replicas\":").append(ints(p.replicas))
              .append(",\"isr\":").append(ints(p.isr))
              .append(",\"start\":").append(p.start)
              .append(",\"end\":").append(p.end)
              .append(",\"records\":[");
          boolean f3 = true;
          for (Rec r : records.getOrDefault(new TopicPartition(t.name, p.id), List.of())) {
            j.append(f3 ? "" : ",").append("{\"o\":").append(r.offset)
                .append(",\"ts\":").append(r.timestamp)
                .append(",\"k\":").append(r.key == null ? "null" : q(r.key))
                .append(",\"v\":").append(r.value == null ? "null" : q(r.value))
                .append(",\"kb\":").append(r.keyBytes)
                .append(",\"vb\":").append(r.valueBytes)
                .append(",\"h\":[");
            boolean f4 = true;
            for (String[] h : r.headers) {
              j.append(f4 ? "" : ",").append('[').append(q(h[0])).append(',')
                  .append(h[1] == null ? "null" : q(h[1])).append(']');
              f4 = false;
            }
            j.append("]}");
            f3 = false;
          }
          j.append("]}");
          f2 = false;
        }
        j.append("]}");
        first = false;
      }
      j.append("],\"groups\":[");
      first = true;
      for (Group g : groups.values()) {
        j.append(first ? "" : ",").append("{\"id\":").append(q(g.id))
            .append(",\"state\":").append(q(g.state))
            .append(",\"type\":").append(q(g.type))
            .append(",\"epoch\":").append(g.epoch)
            .append(",\"members\":[");
        boolean f2 = true;
        for (Member m : g.members) {
          j.append(f2 ? "" : ",").append("{\"id\":").append(q(m.id))
              .append(",\"client\":").append(q(m.client))
              .append(",\"host\":").append(q(m.host))
              .append(",\"assigned\":[");
          boolean f3 = true;
          for (TopicPartition tp : m.assigned) {
            j.append(f3 ? "" : ",").append('[').append(q(tp.topic())).append(',').append(tp.partition()).append(']');
            f3 = false;
          }
          j.append("]}");
          f2 = false;
        }
        j.append("],\"offsets\":[");
        f2 = true;
        for (var e : g.offsets.entrySet()) {
          j.append(f2 ? "" : ",").append('[').append(q(e.getKey().topic())).append(',')
              .append(e.getKey().partition()).append(',').append(e.getValue()).append(']');
          f2 = false;
        }
        j.append("]}");
        first = false;
      }
      j.append("],\"events\":[").append(String.join(",", evs)).append("]}");
      return j.toString();
    }
  }

  static String ints(Collection<Integer> xs) {
    return xs.stream().map(String::valueOf).collect(Collectors.joining(",", "[", "]"));
  }

  /** A JSON string literal. */
  static String q(String s) {
    StringBuilder b = new StringBuilder(s.length() + 2).append('"');
    for (int i = 0; i < s.length(); i++) {
      char c = s.charAt(i);
      switch (c) {
        case '"' -> b.append("\\\"");
        case '\\' -> b.append("\\\\");
        case '\n' -> b.append("\\n");
        case '\r' -> b.append("\\r");
        case '\t' -> b.append("\\t");
        default -> {
          if (c < 0x20 || c == ' ' || c == ' ' || c == '<' || c == '>' || c == '&') {
            b.append(String.format("\\u%04x", (int) c));
          } else {
            b.append(c);
          }
        }
      }
    }
    return b.append('"').toString();
  }
}
