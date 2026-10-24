# MVP Planning

**Status:** Draft — in progress
**Date:** September 28, 2026 (updated October 19, 2026)

## User Stories

1. As a user, I want to be able to see my past timer sessions that I have run. I want to be able to access each day's session so I can review it later.
2. As a user, I want to run a saved preset for my workout by tapping it.
3. As a user, I want to sign up for an account and register my information in the system.
4. As a user, I want to log in and view my account information, so that my data is kept separate from other users' data.
5. As a user, I want to edit a preset if I need to change the timer settings.
6. As a user, I want to create and save a preset.
7. As a user, I want to delete a preset I am unhappy with.
8. As a user, I want to save a session when I run a timer or preset.
9. As a user, I want to log out.
10. As a user, I want to run a timer without a saving a preset first.

## Actors/Roles

### User
- User can create an account, log in, and log out
- User can create, edit, and delete their own presets
- User can save sessions to their account
- User can view their own past sessions

## Out of Scope / Future
- Deleting sessions (decided against for now, can be revisited)
- Admin accounts: an admin dashboard, viewing other accounts, deleting accounts
- AI feature that calls out boxing combos while the fight timer is running
- Features for a specific audience (e.g. coaches or gyms), to be decided after the MVP
- Optional date filter for sessions (or group sessions by date in the frontend)

## Domain Model

### Nouns
- Users
- Presets
- Sessions

### How they relate to each other
- There are many Users
- One User can have many Presets in their account
- One User can have many Sessions in their account
- A Preset belongs to one User (a preset is not shared across users, even if the settings are identical)
- A Session belongs to one User (a session cannot belong to many users)
- A Session can optionally be linked to the Preset it was run from


## Story Coverage

| Story | Endpoint(s) | Tests |
|---|---|---|
| 1. View past sessions | `GET /sessions`, `GET /sessions/{id}` | Integration: list gives `200` with only that user's sessions; own session gives `200`; another user's session gives `404` |
| 2. Run a saved preset | `GET /presets` (the timer runs in the frontend) | Integration: valid token gives `200` with only that user's presets |
| 3. Sign up | `POST /users` | Integration: valid body gives `201` with no password in the response; invalid body gives `400`; duplicate email gives `409` |
| 4a. Log in | `POST /login` | Integration: correct credentials give `200` and a token; wrong password gives `401`. Unit: correct password, wrong password, unknown email |
| 4b. View account | `GET /users/me` | Integration: valid token gives `200`; no token gives `401` |
| 5. Edit a preset | `PUT /presets/{id}` | Integration: own preset gives `200`; another user's gives `404`; invalid body gives `400`. Unit: ownership cases (own, someone else's, doesn't exist) |
| 6. Create and save a preset | `POST /presets` | Integration: valid body gives `201`; no token gives `401`; invalid body gives `400` |
| 7. Delete a preset | `DELETE /presets/{id}` | Integration: own preset gives `204`; another user's gives `404`. Unit: ownership cases |
| 8. Save a session | `POST /sessions` | Integration: valid body gives `201`; another user's `preset_id` gives `400`. Unit: own preset, someone else's, doesn't exist, no preset (one-off session) |
| 9. Logout | None (the frontend discards the token) | None on the backend |
| 10. Run a timer without a saved preset | `POST /sessions` with no `preset_id` (the timer itself runs in the frontend) | Integration: valid body with no `preset_id` gives `201`. Unit: covered in story 8 |

**General rule:** every protected endpoint returns `401` without a valid token, so each endpoint's integration tests include a no-token case.


## Gaps
- Logout is in the roles list but has no story and no endpoint. With tokens, the frontend just discards the token, so either add a story or drop it from the roles - fix: add a story
- The testing plan only checks `401` (no token) for `POST /presets` and `GET /users/me`, but your spec returns `401` on every protected endpoint. Add a no-token case for the rest - fix: add a general point in story coverage
- Story 1 says "each day's session", but `GET /sessions` has no date filter. The frontend could group by date, or you could add an optional date parameter later - fix: Add to out of scope for later
- No story covers running a quick timer without a saved preset, though your database and spec support it (a session with no `preset_id`). Story 8 only covers it in passing - fix: add a story