# What Cauce is

Cauce is the integration platform of the company. It moves events between systems: an order service publishes an order event, and Cauce delivers it to billing, stock and notifications.

## Parts

- Channels store messages in order, split into partitions.
- Producers write messages to a channel; consumers read them, in consumer groups.
- Connectors move messages between Cauce and external systems.
- The schema registry keeps the schema of each event type.
- Every channel has a dead letter queue for messages that could not be delivered.

## Error codes

Every failure carries a code with the form CAU- and four digits. The first digit names the family: 1 message content, 2 connectors, 3 channels and consumers, 4 delivery to the target. Each code has its own runbook section with the cause, the action and whether it can be retried.
