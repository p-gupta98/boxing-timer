# Database Design

**Status:** Draft — in progress
**Related ADRs:** SQL vs NoSQL decision (Postgres)

## 1. Relations (from ERD)

**User**(user_id `PK`, user_name, user_email, user_password)

**Preset**(preset_id `PK`, user_id `FK → User`, preset_name, preset_fight_duration, preset_rest_duration, preset_total_rounds, preset_created_date)

**Session**(session_id `PK`, user_id `FK → User`, preset_id `FK → Preset` *(nullable)*, session_name, session_date, fight_duration, rest_duration, total_rounds, rounds_completed, session_completed)

| Relationship | Cardinality | Foreign key |
|---|---|---|
| User creates Preset | 1 : many | `Preset.user_id` |
| User saves Session | 1 : many | `Session.user_id` |
| Preset contains Session | 1 : many (optional) | `Session.preset_id` (nullable) |

**Notes**
- `preset_created_date` moved from the `creates` relationship onto Preset (the "many" side).
- `Session.preset_id` is nullable because a session can be a quick one-off with no saved preset.
- Session has its own `user_id` and duration/rounds columns so it doesn't depend on a preset existing.

## 2. Normalization

All three relations have single-attribute primary keys, atomic values, and no non-key attribute determining another.

**1NF, 2NF, and 3NF are satisfied.** The duration/rounds columns on Session are a snapshot of what was run, not determined by `preset_id`, so the duplication with Preset is intentional, not a violation.