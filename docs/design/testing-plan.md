# Testing Plan

**Status:** Draft
**Date:** 2026-10-19
**Related:** ADR 0006 (Vitest and Supertest), `docs/design/backend-structure.md`, `docs/api/openapi.yaml`

## 1. Goals
- Business rules work (preset ownership, session preset check, login)
- Every endpoint returns the status codes defined in the OpenAPI spec
- Users can only see and change their own presets and sessions

## 2. Tools
| Purpose | Tool |
|---|---|
| Test runner | Vitest |
| Sending requests to the app | Supertest |
| Test database | A separate Postgres database used only for tests |

## 3. Test Levels

| Level | What it checks | Layers involved | Database |
|---|---|---|---|
| Unit | One rule in isolation | Services | Mocked repository |
| Integration | A real request through the app | Routes, middleware, controllers, services, repositories | Real separate test database |

## 4. Test Data & Setup
- Unit tests: mocked repositories return data set up inside each test.
- Integration tests: seed the test database with known data (two users, each with their own presets and sessions) so ownership cases can be tested.
- The test database is reset between tests so they don't affect each other.
- The test database connection and the JWT signing secret come from environment variables (a separate test config, never committed).

## 5. Test Cases

### Unit tests
| Function | Scenario | Expected |
|---|---|---|
| Preset service (update/delete) | preset belongs to the user | allowed |
| Preset service (update/delete) | preset belongs to another user | reports not found |
| Preset service (update/delete) | preset doesn't exist | reports not found |
| Session service (create) | `preset_id` belongs to the user | allowed |
| Session service (create) | `preset_id` belongs to another user | reports invalid input |
| Session service (create) | `preset_id` doesn't exist | reports invalid input |
| Session service (create) | no `preset_id` (one-off session) | allowed |
| Auth service (login) | correct password | returns a token |
| Auth service (login) | wrong password | reports failure |
| Auth service (login) | email not registered | reports failure (same as wrong password) |

### Integration tests
| Endpoint | Scenario | Expected |
|---|---|---|
| `POST /users` | valid body | `201`, response has no password |
| `POST /users` | invalid body | `400` |
| `POST /users` | email already registered | `409` |
| `POST /login` | correct credentials | `200` and a token |
| `POST /login` | wrong password | `401` |
| `GET /users/me` | valid token | `200` and the user's info |
| `GET /users/me` | no token | `401` |
| `GET /presets` | valid token | `200`, only that user's presets |
| `POST /presets` | valid body + valid token | `201` and the created preset |
| `POST /presets` | no token | `401` |
| `POST /presets` | invalid body (e.g. 0 rounds) | `400` |
| `PUT /presets/{id}` | own preset, valid body | `200` and the updated preset |
| `PUT /presets/{id}` | another user's preset | `404` |
| `PUT /presets/{id}` | invalid body | `400` |
| `DELETE /presets/{id}` | own preset | `204` |
| `DELETE /presets/{id}` | another user's preset | `404` |
| `POST /sessions` | valid body | `201` and the created session |
| `POST /sessions` | `preset_id` of another user's preset | `400` |
| `GET /sessions` | valid token | `200`, only that user's sessions |
| `GET /sessions/{id}` | own session | `200` |
| `GET /sessions/{id}` | another user's session | `404` |

**General rule:** every protected endpoint returns `401` without a valid token, so each endpoint's integration tests include a no-token case.


## 6. Folder Structure & Naming
```
tests/
  unit/
  integration/
```
- Files are named after what they test, e.g. `presetService.test.ts`, `presets.test.ts`.

## 7. Running Tests
- `npm test` runs all tests.
- Run them before each commit; automate on every push to GitHub later.

## 8. Open Questions
- How exactly the test database is reset between tests (clear all tables, or wrap each test in a transaction)?
- Add a coverage target, or skip for the MVP?