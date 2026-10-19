# Deployment Plan

**Status:** Draft
**Date:** 2026-10-19
**Related:** ADR 0004 (Express + TypeScript), ADR 0005 (bcrypt + JWT), `docs/design/backend-structure.md`

## 1. Goals
- A live URL that can be shown in a portfolio, with the API docs page working.
- Free or very low cost.
- Simple enough to set up and understand as a student.

## 2. What Needs Hosting
| Component | Needs | Options to consider |
|---|---|---|
| Backend (Express + TypeScript) | A Node process that stays running | Render, Railway, Fly.io |
| Database (Postgres) | Managed Postgres | Neon, Supabase, the backend host's own Postgres |
| Frontend (React) | Static file hosting | Vercel, Netlify, Cloudflare Pages |

## 3. Decision 
- Backend host: Render
- Database host: Neon
- Frontend host: Vercel

Changes recorded in ADR # 0007

## 4. Configuration and Secrets
Environment variables:
- `DATABASE_URL` (connection to the production database)
- `JWT_SECRET` (signing key for tokens)
- `JWT_EXPIRES_IN` (1 hour, per ADR 0005)
- `PORT`
- `CORS_ORIGIN` (the deployed frontend's URL, so the browser allows its requests)

Rules:
- Never commit secrets. `.env` goes in `.gitignore`.
- Commit a `.env.example` listing the variable names without values.
- Set the real values in the host's dashboard.
- Production and tests use different values and different databases.

## 5. Deployment Process
1. Push to the `main` branch on GitHub.
2. The host builds the project (`npm run build`) and starts it (`npm start`).
3. Run the database schema setup against the production database.
4. Check that `/api-docs` loads and a request to the API works.

## 6. Automation (stretch goal)
- A GitHub Actions workflow that lints the OpenAPI spec and runs the tests on every push.
- Deploy only if everything passes.

## 7. Security
- HTTPS only, since tokens travel in request headers (provided by the host).
- CORS restricted to the deployed frontend.

## 8. Open Questions
- Does the backend host sleep when idle, and is a slow first request acceptable for a demo?
- How will the production database schema be created and updated?
- Does the production database need backups?
- Add a simple health-check endpoint?