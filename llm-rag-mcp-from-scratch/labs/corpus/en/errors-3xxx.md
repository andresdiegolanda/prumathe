# Cauce error codes 3xxx: channels and consumers

Codes in the 3xxx family come from the channels that store messages and from the consumers that read them. Most of them clear by themselves; retry after the condition ends.

## CAU-3001

A consumer group is rebalancing: its members are being reassigned. Reads pause for a few seconds. Retry after the rebalance ends; no action is needed if it ends within a minute. Severity: low.

## CAU-3002

A consumer group rebalances again and again. A member is probably too slow and leaves the group by timeout. Find the slow member in the group metrics before retrying. Severity: medium.

## CAU-3011

The leader of a channel partition changed. Writes wait for the new leader. Retry after a few seconds. Severity: low.

## CAU-3012

A channel partition has no leader. Writes to that partition fail until one is elected. Do not retry in a loop: page the platform team. Severity: high.

## CAU-3021

A consumer is too far behind: its lag is above the alert threshold. Messages are not lost, but they arrive late. Add consumers or find what slows them down. Severity: medium.

## CAU-3022

A consumer committed a position beyond the end of the channel. Cauce rejects the commit. Check the consumer code that computes positions. Severity: medium.
