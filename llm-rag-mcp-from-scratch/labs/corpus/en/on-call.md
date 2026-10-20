# On-call and incidents

## Rotation

On-call engineers rotate every Monday at 09:00. The outgoing engineer hands over the open incidents in the operations channel and the incoming one confirms that they read them.

## Severity

- SEV1: payments or orders are not flowing. Acknowledge within 5 minutes and page the second on-call engineer.
- SEV2: a channel is degraded but messages still flow. Acknowledge within 15 minutes.
- SEV3: one connector or one team is affected. Acknowledge within the working day.

## Incident states

An incident moves through four states: open, mitigated, resolved and closed. Mitigated means the impact stopped but the cause is still there. Resolved means the cause was fixed. Only the incident owner closes it, after the review.

## What the assistant may do

The operations assistant can read incidents and runbooks. It cannot close, reassign or escalate an incident: those actions belong to the on-call engineer.
