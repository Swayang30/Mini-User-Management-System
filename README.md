# PurpleMerit — Frontend (React + Vite) 🔮

A lightweight React frontend built with Vite. Includes routing, toast notifications, and a small API service configured via environment variables.

## 🚀 Features
- React 19 + Vite (rolldown)
- Axios-based API service with global error handling
- Client-side routing with `react-router-dom`
- Toast notifications via `react-toastify`
- ESLint configuration and lint script

## 🧰 Tech stack
- React 19
- Vite (rolldown-vite)
- Axios
- React Router
- React Toastify
- ESLint

## Prerequisites
- Node.js 18+ (or current LTS)
- npm (or yarn / pnpm)

## Quick start

Clone the repo and install dependencies:

```bash
cd frontend
npm install
```

Start dev server:

```bash
npm run dev
# default: http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Lint the codebase:

```bash
npm run lint
```

---

## Configuration

The frontend uses Vite environment variables. Create a `.env` (or `.env.local`) in the `frontend` folder:

```env
# Example
VITE_API_BASE_URL=http://localhost:4000/api
```

The application falls back to `http://localhost:4000/api` if `VITE_API_BASE_URL` is not provided. The API client is in `src/services/api.js`.

---

## Project structure (important parts)

- `src/`
  - `components/` — small UI components and shared elements
  - `pages/` — route pages (Login, Signup, Profile, AdminDashboard)
  - `services/api.js` — axios client and global error handling
  - `context/AuthContext.jsx` — auth state & provider
  - `main.jsx` — app entry

---

## Environment-specific notes 💡

- Use `VITE_` prefix for env variables that need to be available in the browser.
- When deploying (Netlify, Vercel, etc.), set `VITE_API_BASE_URL` in the deployment environment.

---

## Common issues & troubleshooting ⚠️

- "CORS" errors: Ensure backend allows requests from the frontend origin.
- "API unreachable": Check `VITE_API_BASE_URL` and backend server status.
- Lint errors: Run `npm run lint` and follow ESLint suggestions.

---

## Contributing

- Open issues for bugs or feature requests.
- Submit PRs against `main` or the preferred branch; ensure linting passes.

---

## License & author

Add your license and author details here (e.g., MIT) if you want them included.
