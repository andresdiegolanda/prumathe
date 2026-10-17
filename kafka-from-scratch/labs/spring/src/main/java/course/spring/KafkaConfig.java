package course.spring;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.config.TopicConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.listener.CommonContainerStoppingErrorHandler;

@Configuration
public class KafkaConfig {
    public static final String ORDERS = "spring-orders";

    @Bean
    NewTopic ordersTopic() {
        return TopicBuilder.name(ORDERS).partitions(3).replicas(3)
            .config(TopicConfig.MIN_IN_SYNC_REPLICAS_CONFIG, "2").build();
    }

    @Bean
    CommonContainerStoppingErrorHandler stopOnFailure() {
        // Keep a failed record uncommitted and stop the listener visibly.
        // A production retry/DLT policy is a separate design decision.
        return new CommonContainerStoppingErrorHandler();
    }
}
