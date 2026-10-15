# 0004 — Use Express with Typescript for the Backend

**Status:** Accepted
**Date:** 2026-10-14

## Context
- I have used Express before, so I can focus on learning TypeScript and finish the MVP sooner.
- TypeScript adds type safety to the project.

## Decision
- Use Express with TypeScript for the backend.

## Alternatives Considered
- **NestJS** — has a steeper learning curve (modules, decorators, dependency injection) on top of learning TypeScript, which would slow down the MVP.
- **JavaScript** — no extra setup, but offers less type safety.

## Consequences

**Good:**
- Familiar framework, so the MVP stays on track
- Type safety catches errors earlier

**Bad / risks:**
- I'm new to TypeScript, so progress will be slower at first
- Extra setup compared to plain JavaScript