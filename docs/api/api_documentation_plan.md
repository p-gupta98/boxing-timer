# API Documentation Plan

**Status:** Draft
**Date:** 2026-10-19
**Related:** `docs/api/openapi.yaml`, ADR 0003 (REST), `docs/design/testing-plan.md`

## 1. Goal
Interactive API docs that anyone can open in a browser and try, available on the running app at `/api-docs`.

## 2. Source of Truth
- `docs/api/openapi.yaml` is the single source of truth.
- The spec is written first (design-first), and the code follows it.

## 3. Approach
- Serve the spec as a Swagger UI page from the Express app at `/api-docs`, using `swagger-ui-express`.
- The docs page itself is public (no token needed).
- Protected endpoints can be tried by pasting a token into Swagger UI's "Authorize" button (the token comes from `POST /login`).
- Add the production URL to the spec's `servers` list once the app is deployed.

## 4. Keeping the Spec and Code in Sync
- Update the spec in the same commit as any endpoint change.
- Lint the spec before committing: `npx @redocly/cli lint docs/api/openapi.yaml`.
- Integration tests check the status codes defined in the spec (see the testing plan).

## 5. Open Questions
- Keep the docs page available in production? (useful for showing the project)
- Validate requests against the spec automatically, or keep hand-written validation middleware?