# Backend Structure

**Status:** Draft
**Date:** 2026-10-16
**Related:** `docs/api/openapi.yaml`, ADR 0004 (Express + TypeScript), ADR 0005 (bcrypt + JWT)

## 1. Layers

Each layer has one job.

| Layer | Responsibility | Example in this project |
|---|---|---|
| Routes | Match URL + method and hand off | `POST /presets` → `createPreset` |
| Middleware | Checks shared by many endpoints, run before the controller | verify the token, validate the body |
| Controllers | Read the request, call a service, send the response | `presetController.createPreset` |
| Services | Business rules | "a preset must exist and belong to the user" |
| Repositories | Talk to the database, nothing else | `presetRepository.update(...)` |

## 2. Folder Structure

```
src/
  routes/
  middleware/
  controllers/
  services/
  repositories/
  types/
  app.ts
  server.ts
```

## 3. Request Flows

### POST /presets
1. **Route:** receives the request and hands it off
2. **Middleware (auth):** verifies the token signature, sends `401` if missing or invalid
3. **Middleware (validation):** checks the body against the rules, sends `400` if invalid
4. **Controller:** reads the user id from the verified token and calls the service
5. **Service:** passes the data on (thin for this endpoint, no extra rules)
6. **Repository:** stores the preset with the user id, the database generates the preset id
7. **Controller:** sends the created preset as JSON with `201`

### PUT /presets/{id}
1. **Route:** receives the request (preset id in the URL, JSON body, token) and hands it off
2. **Middleware (auth):** verifies the token signature, sends `401` if missing or invalid
3. **Middleware (validation):** checks the body against the rules, sends `400` if invalid
4. **Controller:** reads the user id from the token and the preset id from the URL, calls the service
5. **Service:** confirms the preset exists and belongs to this user, otherwise reports not found (`404`)
6. **Repository:** updates the preset in the database
7. **Controller:** sends the updated preset as JSON with `200`

### POST /login
1. **Route:** receives the request (email and password in the JSON body) and hands it off, with no auth middleware since the user isn't logged in yet
2. **Middleware (validation):** checks that the body has an email and password, sends `400` if invalid
3. **Controller:** passes the email and password to the service
4. **Service:** asks the repository for the user with that email
5. **Repository:** looks up the user by email and returns it (or nothing)
6. **Service:** compares the typed password with the stored hash using bcrypt. If there's no user or the password doesn't match, it reports failure (`401`, with the same message either way so it doesn't reveal which emails exist). If it matches, it creates a signed JWT containing the user id and expiry
7. **Controller:** sends the token as JSON with `200`, or the `401` error

### POST /sessions
1. **Route:** receives the request and hands it off
2. **Middleware (auth):** verifies the token signature, sends `401` if missing or invalid
3. **Middleware (validation):** checks the body against the rules, sends `400` if invalid
4. **Controller:** reads the user id from the verified token and calls the service
5. **Service:** if a `preset_id` was sent, checks that the preset exists and belongs to this user, otherwise reports invalid input (`400`)
6. **Repository:** stores the session with the user id, the database generates the session id
7. **Controller:** sends the created session as JSON with `201`

## 4. Rules
- Controllers never talk to the database directly.
- Repositories contain no business logic.
- Services know nothing about HTTP (no request or response objects).
- Checks shared across endpoints (auth, validation) live in middleware.
- The user id always comes from the verified token, never from the request body or URL.

## 5. Open Questions
- Should a session's durations default to the preset's values when the client leaves them out? (would change the OpenAPI spec)
- Validation: hand-written checks or a validation library?