# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Production server
npm run dev      # Development server with --watch (auto-reload)
```

No build step, no test runner, no linter configured. The server runs on port 3000 by default.

**Database:** Connects via `DATABASE_URL` (or several fallback env var names). Auto-initializes schema on first run. Default local: `postgresql://postgres:postgres@localhost:5432/jobfair`.

**Required env vars:** `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`.

## Architecture

**NQU Career Fair System** — a Node.js/Express + PostgreSQL app for employer booth registration at National Quemoy University's annual career fair. No frontend framework or build toolchain; pure HTML/CSS/JS served statically.

### Backend (`server.js`, `db.js`, `routes/`, `middleware/`)

- `server.js` — Express app, middleware setup, route mounting, Vercel serverless export
- `db.js` — PostgreSQL pool, schema creation, `ALTER TABLE IF NOT EXISTS` migrations, default admin seeding
- `middleware/auth.js` — `requireEmployer` / `requireAdmin` session guards
- `routes/auth.js` — Login/register for both roles, session management, rate-limited (10 req/15 min)
- `routes/submissions.js` — Employer CRUD on their own submissions; locked when rejected
- `routes/admin.js` — All-submission views, status/booth patching, CSV export, employer management, stats
- `routes/announcements.js` — Admin-managed public announcements with pinning and priority

**Two roles:** `employer` and `admin`, distinguished by session. Sessions stored in PostgreSQL via `connect-pg-simple`.

### Database Schema (5 tables)

| Table | Purpose |
|-------|---------|
| `employers` | Employer accounts |
| `admins` | Admin accounts (seeded: `admin` / `nqu2025`) |
| `submissions` | Booth registration forms (~35 fields, logo as base64) |
| `announcements` | Site-wide notices |
| `session` | Express session store |

**Submission lifecycle:** `pending` → `approved` / `rejected`. Employers can edit/delete only while `pending`.

### Frontend (`public/`)

Static files served by Express. No framework, no bundler.

- `public/js/api.js` — Global fetch wrapper
- `public/js/app.js` — Modal/toast UI utilities  
- `public/js/i18n.js` — All UI strings in English + Traditional Chinese (client-side switching)
- `public/employer/` — Employer portal (login, register, dashboard, submit)
- `public/admin/` — Admin portal (login, dashboard)

### File Uploads

Multer uses **memory storage** (no disk writes — Vercel-compatible). Images only, 5 MB limit. Stored as base64 data URLs in PostgreSQL.

### Deployment

Vercel serverless: `vercel.json` routes all traffic through `server.js`. The app handles SSL/TLS edge cases for Supabase/Neon via `NODE_TLS_REJECT_UNAUTHORIZED`.
