# Cauce error codes 1xxx: message content

Codes in the 1xxx family mean the message itself is wrong. Retrying sends the same wrong message again, so these errors are never retried: the producer has to be fixed.

## CAU-1001

The message is not valid JSON. Cauce could not parse it at all. Do not retry. Find the producer in the message headers, fix its serializer and send the message again. Severity: medium.

## CAU-1002

The message is valid JSON but has no event type. Cauce cannot route it. Do not retry. Add the eventType field in the producer. Severity: medium.

## CAU-1011

The message does not match its registered schema. A field has the wrong type or an unknown name. Do not retry. Compare the message with the schema version in its header and fix the producer. Severity: high when it affects payments, medium otherwise.

## CAU-1012

A required field of the schema is missing. Do not retry. The error detail names the missing field; add it in the producer. Severity: medium.

## CAU-1021

The message is larger than the 1 MB limit of a Cauce channel. Do not retry. Split the message, or store the large part elsewhere and send a reference. Severity: low.

## CAU-1022

The event type is not registered in the channel. Do not retry. Register the event type with the platform team before producing it. Severity: low.
