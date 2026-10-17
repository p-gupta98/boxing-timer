# 0005 — Use bcrypt and JWT for authentication

**Status:** Accepted
**Date:** 2026-10-16

## Context
- Users log in with an email and password, and the API needs to know who is making each request.
- Passwords must never be stored in plain text.
- The server keeps no memory between requests, so the client must prove who it is each time.

## Decision
- Hash passwords with bcrypt (which adds a random salt automatically) and store only the hash.
- On a successful login, return a signed JWT containing the user id and an expiry time (1 hour).
- The client sends the token in the `Authorization: Bearer` header on every request.
- The server reads the user id from the verified token, so clients never send a `user_id`.
- Serve the API over HTTPS in production.

## Alternatives Considered
- **Encrypting passwords** — encryption is reversible, so a stolen key would expose every password.
- **Server-side sessions** — the server would have to store session data and look it up on every request.
- **Argon2** — also a strong choice for hashing, but bcrypt is more widely used and documented.

## Consequences

**Good:**
- A stolen database does not reveal passwords
- No session storage on the server
- Users can only access their own data, since the id comes from the signed token

**Bad / risks:**
- A stolen token works until it expires, and it is hard to cancel early
- A short expiry means users have to log in again
- The signing secret must be kept safe (in an environment variable, never in the repo)