package course.spring;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.web.bind.annotation.*;

@RestController
public class OrderController {
    private final OrderProducer producer;
    private final OrderConsumer consumer;
    private final KafkaListenerEndpointRegistry registry;

    public OrderController(OrderProducer producer, OrderConsumer consumer, KafkaListenerEndpointRegistry registry) {
        this.producer = producer;
        this.consumer = consumer;
        this.registry = registry;
    }

    @PostMapping("/orders/{orderId}")
    public CompletableFuture<ResponseEntity<OrderProducer.Published>> publish(
        @PathVariable String orderId, @Valid @RequestBody OrderPlaced event) {
        // 202 means the broker acknowledged the write; it does not mean the kitchen processed it.
        return producer.publish(orderId, event).thenApply(result -> ResponseEntity.accepted().body(result));
    }

    @GetMapping("/received")
    public List<OrderConsumer.Received> received() { return consumer.snapshot(); }

    @GetMapping("/ready")
    public ResponseEntity<Map<String, String>> ready() {
        var listener = registry.getListenerContainer("kitchen");
        boolean running = listener != null && listener.isRunning();
        return ResponseEntity.status(running ? 200 : 503).body(Map.of("listener", running ? "running" : "stopped"));
    }
}
