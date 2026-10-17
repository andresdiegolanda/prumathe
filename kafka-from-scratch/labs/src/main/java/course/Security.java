package course;

import static course.Kafka.base;
import static course.Kafka.ensure;
import static course.Kafka.producerProps;
import static course.Kafka.send;

import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.common.acl.AccessControlEntry;
import org.apache.kafka.common.acl.AclBinding;
import org.apache.kafka.common.acl.AclOperation;
import org.apache.kafka.common.acl.AclPermissionType;
import org.apache.kafka.common.resource.PatternType;
import org.apache.kafka.common.resource.ResourcePattern;
import org.apache.kafka.common.resource.ResourceType;

/**
 * The ACL sandbox: SASL/PLAIN identities with public demo passwords on the isolated secure broker.
 */
final class Security {
  private Security() {}

  private static Properties secured(String user) {
    var p = base("secure:9092");
    p.put("security.protocol", "SASL_PLAINTEXT");
    p.put("sasl.mechanism", "PLAIN");
    p.put(
        "sasl.jaas.config",
        "org.apache.kafka.common.security.plain.PlainLoginModule required username=\""
            + user
            + "\" password=\""
            + user
            + "-demo\";");
    return p;
  }

  private static AclBinding allow(
      String principal, ResourceType type, String resource, AclOperation op) {
    return new AclBinding(
        new ResourcePattern(type, resource, PatternType.LITERAL),
        new AccessControlEntry("User:" + principal, "*", op, AclPermissionType.ALLOW));
  }

  /**
   * setup: the admin creates the topic and grants WRITE to writer and READ to reader. writer and
   * reader: one write each as that principal; the reader's is expected to be denied.
   */
  static void acl(String mode) throws Exception {
    if (mode.equals("setup")) {
      try (Admin a = Admin.create(secured("admin"))) {
        ensure(a, "lab22-secured", 1, (short) 1, Map.of());
        a.createAcls(
                List.of(
                    allow("writer", ResourceType.TOPIC, "lab22-secured", AclOperation.WRITE),
                    allow(
                        "writer",
                        ResourceType.CLUSTER,
                        "kafka-cluster",
                        AclOperation.IDEMPOTENT_WRITE),
                    allow("reader", ResourceType.TOPIC, "lab22-secured", AclOperation.READ),
                    allow("reader", ResourceType.GROUP, "lab22-readers", AclOperation.READ)))
            .all()
            .get(30, TimeUnit.SECONDS);
        System.out.println("Created writer WRITE and reader READ ACLs.");
      }
    } else if (Set.of("writer", "reader").contains(mode)) {
      var p = producerProps("secure:9092");
      p.putAll(secured(mode));
      // Idempotence is disabled here on purpose. An idempotent producer first asks for a
      // producer id, and that request is authorized by IDEMPOTENT_WRITE on the cluster or by
      // WRITE on some topic, so the reader would fail there with ClusterAuthorizationException.
      // Without idempotence the denied test reaches the TOPIC permission check and shows
      // TopicAuthorizationException, which is the point of the lesson.
      p.put("enable.idempotence", "false");
      try (KafkaProducer<String, String> producer = new KafkaProducer<>(p)) {
        send(producer, "lab22-secured", null, null, "order-42", "ACL test");
      }
    } else {
      throw new IllegalArgumentException("acl setup|writer|reader");
    }
  }
}
