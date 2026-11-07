# Database Design

**Status:** Draft — in progress
**Related ADRs:** SQL vs NoSQL decision (Postgres)

## 1. Relations (from ERD)

**users**(id `PK`, name, email, password_hash)

**presets**(id `PK`, user_id `FK → users`, name, date_created, fight_duration, rest_duration, total_rounds)

**sessions**(id `PK`, user_id `FK → users`, preset_id `FK → presets` *(nullable)*, name, session_date, fight_duration, rest_duration, total_rounds, rounds_completed, session_completed)

| Relationship | Cardinality | Foreign key |
|---|---|---|
| User creates Preset | 1 : many | `presets.user_id` |
| User saves Session | 1 : many | `sessions.user_id` |
| Preset contains Session | 1 : many (optional) | `sessions.preset_id` (nullable) |

**Notes**
- `date_created` moved from the `creates` relationship onto presets (the "many" side).
- `sessions.preset_id` is nullable because a session can be a quick one-off with no saved preset.
- Sessions have their own `user_id` and duration/rounds columns so they don't depend on a preset existing.

## 2. Normalization

All three relations have single-attribute primary keys, atomic values, and no non-key attribute determining another.

**1NF, 2NF, and 3NF are satisfied.** The duration/rounds columns on Session are a snapshot of what was run, not determined by `preset_id`, so the duplication with Preset is intentional, not a violation.

## 3. Db Schema: Types and Constraints

**users**
| Field | Type | Constraint | Constraint |
|---|---|---|---|
| id | UUID | Primary Key | Default |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL | Unique |
| password_hash | TEXT | NOT NULL |

**presets**
| Field | Type | Constraint | Constraint | Constraint |
|---|---|---|---|---|
| id | UUID | Primary Key | Default |
| user_id | UUID | NOT NULL | Foreign Key | On Delete Cascade |
| name | TEXT | NOT NULL | 
| date_created | TIMESTAMPTZ | NOT NULL | Default |
| fight_duration | INT | NOT NULL | Check >= 1 |
| rest_duration | INT | NOT NULL | Check >= 1 |
| total_rounds | INT | NOT NULL | Check >= 1 |

**sessions**
| Field | Type | Constraint | Constraint | Constraint |
|---|---|---|---|---|
| id | UUID | Primary Key | Default |
| user_id | UUID | NOT NULL | Foreign Key | On Delete Cascade |
| preset_id | UUID | Foreign Key | On Delete Set Null |
| name | TEXT | NOT NULL |
| session_date | TIMESTAMPTZ | NOT NULL | Default |
| fight_duration | INT | NOT NULL | Check >= 1 |
| rest_duration | INT | NOT NULL | Check >= 1 |
| total_rounds | INT | NOT NULL | Check >= 1 |
| rounds_completed | INT | NOT NULL | Check >= 0 |
| session_completed | BOOLEAN | NOT NULL | 

### Design decisions

- Passwords are stored as bcrypt hashes (ADR 0005).
- Sessions keep their own durations and rounds in the database, so they survive a preset being edited or deleted. The API    lets the client leave them out when it sends a preset_id.
- session_date and date_created are set by the database.
- The CHECK rules repeat the minimums from the OpenAPI spec.