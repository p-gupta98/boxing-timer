# 0006 — Use Vitest and Supertest for testing

**Status:** Accepted
**Date:** 2026-10-19

## Context
- The backend needs unit tests for rules like the preset ownership check, and integration tests that send real requests through the API.
- The project uses TypeScript.
- I want to learn a testing tool I haven't used before.

## Decision
- Use Vitest as the test runner.
- Use Supertest to send requests to the Express app in integration tests.

## Alternatives Considered
- **Jest** — more widely used and has more tutorials, but needs extra configuration to work with TypeScript.

## Consequences

**Good:**
- Works with TypeScript with little setup
- The API is very similar to Jest's, so the skills transfer
- Supertest works with Vitest, so it's an easy pairing for Express

**Bad / risks:**
- Smaller community, so fewer tutorials and answers online than Jest
- I'm new to Vitest, so there is a learning curve at first