package course.spring;

import java.util.ArrayList;
import java.util.List;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderConsumer {
    private static final Logger log = LoggerFactory.getLogger(OrderConsumer.class);
    private final List<Received> received = new ArrayList<>();

    @KafkaListener(id = "kitchen", topics = KafkaConfig.ORDERS, groupId = "spring-kitchen")
    public synchronized void onOrder(ConsumerRecord<String, OrderPlaced> record) {
        // This is a visible teaching effect, not durable business storage.
        if (received.size() == 200) received.remove(0);
        received.add(new Received(record.key(), record.value(), record.partition(), record.offset()));
        log.info("RECEIVED key={} eventId={} partition={} offset={}", record.key(),
            record.value().eventId(), record.partition(), record.offset());
        // AckMode.RECORD commits this record's next offset after a normal return.
        // A crash between the effect and that commit can repeat the effect.
    }

    public synchronized List<Received> snapshot() { return List.copyOf(received); }
    public record Received(String key, OrderPlaced event, int partition, long offset) {}
}
