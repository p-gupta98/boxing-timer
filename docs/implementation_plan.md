# Implementation Plan

**Status:** Draft
**Date:** 2026-10-19

- [ ] **0. Project setup:** backend folder, TypeScript, Express, Vitest + Supertest, `.gitignore`, `.env.example`, folder structure from the backend doc, and one passing test on a simple health-check endpoint
- [ ] **1. Deploy the skeleton:** put the health-check app on Render so the deployment pipeline works from the start
- [ ] **2. Database:** create the Neon databases (dev and test), write the schema as SQL for the three tables, and add the connection code
- [ ] **3. Auth:** `POST /users`, `POST /login`, auth middleware, `GET /users/me`, with unit and integration tests
- [ ] **4. Presets:** `GET`, `POST`, `PUT`, `DELETE` on `/presets`, with the ownership rule and tests
- [ ] **5. Sessions:** `POST /sessions`, `GET /sessions`, `GET /sessions/{id}`, with the preset check and tests
- [ ] **6. API docs:** serve Swagger UI at `/api-docs` and lint the spec
- [ ] **7. Connect the frontend:** hook the React app to the API (sign up, log in, presets, run the timer, save a session, history) and deploy it on Vercel
- [ ] **8. Polish:** README, GitHub Actions to run the tests and lint on every push, and a final check of every story