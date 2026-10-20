# Cauce retry policy

Cauce retries a delivery only when the error code says it can be retried. Message content errors (1xxx) are never retried.

## Exponential backoff

The first retry waits 2 seconds, and each next wait doubles: 2, 4, 8 and 16 seconds. Each wait adds a random jitter of up to 20 percent, so that many senders do not retry at the same moment.

## Attempts

Cauce makes five attempts in total: the first delivery and four retries. After the fifth failure the message goes to the dead letter queue of its channel and is not retried again automatically.

## Who changes the policy

The policy is the same for every channel. A team that needs other values asks the platform team; changing it in a connector configuration is not allowed, because a faster retry can overload the target that is already failing.
