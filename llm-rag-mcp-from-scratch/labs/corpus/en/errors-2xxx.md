# Cauce error codes 2xxx: connectors

Codes in the 2xxx family come from a connector, the component that moves messages between Cauce and an external system. They are fixed in the connector, not in the message.

## CAU-2001

The connector credentials expired. The connector stops and keeps its position. Renew the credentials in the secret store and restart the connector; it resumes where it stopped. Do not retry the messages by hand. Severity: high.

## CAU-2002

The connector credentials were rejected: they exist but lack a permission. Ask the owner of the external system for the missing permission. Restarting does not help until the permission changes. Severity: high.

## CAU-2011

The connector configuration is invalid after a change. Cauce keeps the previous configuration running. Fix the change and apply it again. Severity: low.

## CAU-2012

Two connectors claim the same source. The second one stays idle. Remove the duplicate connector. Severity: low.

## CAU-2021

The connector lost its position file and cannot know where to resume. It stops instead of guessing. Restore the position from the last checkpoint, or ask the platform team to set it; never restart from the beginning without deciding it. Severity: high.

## CAU-2022

The connector is paused by an operator. Nothing is lost while it is paused. Resume it when the operator confirms. Severity: low.
