# SQL vs NoSql Database Decision

Status: Accepted Date: [2026-09-28]

## Context

- The entities Presets, Sessions and Coaches are distinct and all have fixed fields
- The entities have clear relationships with each other


## Decision

- The decision is to use a Relational SQL database.
- We have decided ot go with Postgres database.

## Alternatives Considered

What else did we look at, and why didn't we pick it?

MongoDB — The data is not unscrutured so we do not need a NoSql based database.

## Consequences

### Bad / risks:

- Less flexible if in the future we need to add unsctructured data to an entity. 
- For example, if we decided to add preset timers for different sports like Muay Thai, Jiu-Jitsu 
they could have different fight/rest periods.