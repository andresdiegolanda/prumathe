# The dead letter queue

Every Cauce channel has a dead letter queue. A message lands there after its fifth failed attempt, or right away when its error code says it must not be retried.

## What is kept

The message is kept as it was, with its headers, the last error code, the number of attempts and the time of the last attempt. Nothing in it is changed.

## Reviewing it

The team that owns the channel reviews its dead letter queue every working day. For each message it decides one of three things: send it again after the cause was fixed, send a corrected copy, or discard it with a note that explains why.

## Limits

A dead letter queue keeps messages for 14 days. After that they are deleted, so a message that nobody reviewed in time is lost.
