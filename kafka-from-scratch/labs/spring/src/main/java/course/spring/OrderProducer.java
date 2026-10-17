package course.spring;

import java.util.concurrent.CompletableFuture;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderProducer {
    private final KafkaTemplate<String, OrderPlaced> template;

    public OrderProducer(KafkaTemplate<String, OrderPlaced> template) {
        this.template = template;
    }

    public CompletableFuture<Published> publish(String orderId, OrderPlaced event) {
        // orderId is the Kafka key: repeated IDs route to the same partition
        // while the partition count and partitioner stay unchanged.
        return template.send(KafkaConfig.ORDERS, orderId, event).thenApply(result -> {
            var metadata = result.getRecordMetadata();
            return new Published(metadata.topic(), metadata.partition(), metadata.offset(), event.eventId());
        });
    }

    public record Published(String topic, int partition, long offset, String eventId) {}
}
