# 0003 — Use REST for the API

**Status:** Accepted
**Date:** 2026-10-14

## Context
- The React frontend needs to talk to the backend.
- Our user stories are mostly create, view, edit, and delete on a few entities (users, presets, sessions).

## Decision
- Use a REST API.

## Alternatives Considered
- **GraphQL** — more flexibility than we need for a few simple resources.
- **RPC** — less standard, and our actions map cleanly to resources anyway.

## Consequences

**Good:**
- Simple and widely known
- Maps directly to our create/view/edit/delete stories
- Easy to document with OpenAPI later

**Bad / risks:**
- May need multiple requests to fetch related data if the app grows