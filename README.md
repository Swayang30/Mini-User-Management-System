# PurpleMerit — Fullstack (Backend + Frontend)

PurpleMerit is a small fullstack project with separate **backend** (Express + MongoDB) and **frontend** (React + Vite) packages.

This README describes how to run and configure both parts locally, and provides common troubleshooting tips.

---

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Backend](#backend)
  - [Quick start](#quick-start-1)
  - [Configuration / Env vars](#configuration--env-vars)
  - [Scripts](#scripts)
  - [Notes](#notes)
- [Frontend](#frontend)
  - [Quick start](#quick-start)
  - [Configuration / Env vars](#configuration--env-vars-1)
  - [Scripts](#scripts-1)
- [Development workflow](#development-workflow)
- [Common issues & troubleshooting](#common-issues--troubleshooting)
- [Contributing](#contributing)
- [License & author](#license--author)

---

## Overview

- Backend: Express API with authentication, MongoDB via Mongoose, and a few routes under `/api`.
- Frontend: React app built with Vite; talks to the backend API via Axios and uses `VITE_API_BASE_URL`.

---

## Prerequisites

- Node.js 18+ (or current LTS)
- npm (or yarn / pnpm)
- A running MongoDB instance (local or cloud)

---

## Backend

### Quick start

```bash
# from repo root
cd backend
npm install
# start in dev mode (restarts on change)
npm run dev
# or run production start
npm run Start
```

By default the server listens on `PORT` env var or `4000`.

### Configuration / Env vars

Create a `.env` file in the `backend/` folder with at least the following:

```env
# MongoDB connection string (required)
MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net

# Optional
PORT=4000
ADMIN_EMAIL=admin@example.com
ADMIN_NAME=Admin User
ADMIN_PASSWORD=Admin123!
JWT_SECRET=your_jwt_secret_here
```

- `MONGO_URI` is required — the app will fail to start without it.
- A default admin user will be created on startup using `ADMIN_*` vars if not already present.

### Scripts

- `npm run dev` — development (uses `nodemon` and loads `.env`)
- `npm run Start` — production start (loads `.env`)

> Note: The `Start` script is capitalized in `package.json`.

### Notes

- API endpoints are mounted under `/api`:
  - `/api/auth` — authentication routes (login/signup)
  - `/api/users` — user management
- The DB name is `purpleMeritDB` by default (configured in `backend/src/constants.js`).

---

## Frontend

### Quick start

```bash
cd frontend
npm install
npm run dev
# visit http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

Lint code:

```bash
npm run lint
```

### Configuration / Env vars

Create a `.env` (or `.env.local`) in `frontend/`:

```env
# API base URL used by the frontend (falls back to http://localhost:4000/api)
VITE_API_BASE_URL=http://localhost:4000/api
```

The frontend's API client is `src/services/api.js` and will use the `VITE_API_BASE_URL` value.

### Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — create a production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

---

## Development workflow

- Run backend and frontend concurrently (two terminals) while developing.
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`
- Use `VITE_API_BASE_URL` to point the frontend to your backend host when not running both locally.

---

## Common issues & troubleshooting ⚠️

- "CORS" errors: Ensure backend CORS is enabled (it is in this app) and the frontend origin is allowed.
- "API unreachable": Verify backend is running and `VITE_API_BASE_URL` is correct.
- DB connection errors: Check `MONGO_URI` and that your MongoDB user/cluster allow connections from your IP.
- Lint errors: Run `npm run lint` in each package and fix reported issues.

---

## Contributing

- Open issues for bugs or feature requests.
- Fork and submit PRs against the `main` branch.
- Please run linters and add tests (if applicable) before opening PRs.

---

## License & author

- Author: Swayang Batabyal
- License: ISC (as set in `backend/package.json`) — add or change to your preferred license if needed.

---

If you'd like, I can also:
- Add example `.env` files to `backend/` and `frontend/` (with `.env.example`),
- Add a short section explaining how to deploy to Vercel/Netlify (frontend) + Heroku/Azure (backend),
- Commit these README changes and open a branch/PR for review.

Do you want me to apply the README update now? (yes / no)
