# 0007 — Host on Render, Neon, and Vercel

**Status:** Accepted
**Date:** 2026-10-19

## Context
- The project needs a live deployed version that can be shown in a portfolio, at little or no cost.
- The backend is an Express app that needs to stay running, and the database is Postgres.
- The React frontend needs static hosting, and I have used Vercel before.
- A database that pauses or disappears while no one is using it would break the demo.

## Decision
- Host the backend on Render.
- Host the Postgres database on Neon.
- Host the frontend on Vercel.

## Alternatives Considered
- **Supabase (database)** — free projects pause after a week of inactivity and have to be restored manually.
- **Render's Postgres** — free databases expire after a limited time.
- **Railway** — usage-based billing after a small monthly credit, so costs could grow.

## Consequences

**Good:**
- Free tiers for all three services
- No weekly database pause that needs manual restoring
- Each part is hosted separately, so any one can be swapped later
- I already know Vercel

**Bad / risks:**
- Render's free service sleeps when idle, so the first request after a quiet period is slow
- Neon's free database may also be slow on the first request after being idle
- Three services to configure, including environment variables and CORS
- Free tier limits and prices can change, so they need rechecking