# Cauce error codes 4xxx: delivery to the target

Codes in the 4xxx family mean Cauce could not deliver a message to the target system. Some are retried with exponential backoff; others need a person first.

## CAU-4001

The target system is unreachable: its name does not resolve or the connection is refused. Check the network route and the target address before retrying. Severity: high.

## CAU-4002

The TLS handshake with the target failed: its certificate is expired or not trusted. Do not retry; renew or trust the certificate first. Severity: high.

## CAU-4011

The target answered HTTP 503: it is up but not ready. Retry with exponential backoff, following the retry policy. Severity: medium.

## CAU-4012

The target answered HTTP 429: Cauce is sending too fast. Wait for the time in the Retry-After header, then retry. Do not raise the rate. Severity: low.

## CAU-4021

The downstream queue is full. The target accepts messages into a buffer that has no room left. Wait for the target consumer to catch up, then retry with exponential backoff. Do not add producers. Severity: medium.

## CAU-4022

The downstream queue was paused by its owner. Messages wait in Cauce while it is paused. Do not retry until the owner resumes it. Severity: low.
