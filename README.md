<div align="center">

# PitchKu — Frontend

AI presentation generator for Indonesian SMEs (UMKM)

<a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
<a href="https://react.dev"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
<a href="https://reactrouter.com"><img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" /></a>
<a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
<a href="https://ui.shadcn.com"><img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" /></a>
<a href="https://vitest.dev"><img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" /></a>

</div>

This repo is the **frontend only** — a Vite + React SPA that talks to a separate backend service over REST.

> Looking for AI-assistant working context? See [`CLAUDE.md`](./CLAUDE.md).
> Looking for system architecture / team split / timeline? See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the real API base URL
npm run dev
```

App runs at `http://localhost:5173` by default.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests with Vitest |
| `npm run lint` | Run ESLint |

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend REST API |

See `.env.example` for the template. `.env.local` is gitignored — never commit real values.

## Project structure

```
src/
  components/     # shared/reusable UI (incl. shadcn-generated components)
  hooks/          # React hooks
  layouts/        # PublicLayout, AuthLayout, ProtectedLayout — shared page shells
  pages/          # one file per route
  lib/            # API client, constants, helpers
  services/       # API service
  App.jsx         # route map
  main.jsx        # entry point, router provider
  index.css       # Tailwind import + minimal global resets
docs/
  ARCHITECTURE.md # system design, team ownership, timeline
```

## Routes

| Path | Layout | Page | Access |
|---|---|---|---|
| `/` | PublicLayout | Landing | Public |
| `/faq` | PublicLayout | FAQ | Public |
| `/login` | AuthLayout | Login | Public |
| `/register` | AuthLayout | Register | Public |
| `/dashboard` | ProtectedLayout | Dashboard | Authenticated |
| `/new` | ProtectedLayout | Wizard (template + business form) | Authenticated |
| `/outline/:projectId` | ProtectedLayout | Outline review | Authenticated |
| `/editor/:projectId` | ProtectedLayout | Slide editor + export | Authenticated |
| `*` | — | 404 | Public |

Protected routes and their auth-guard logic are not yet implemented — see open items below.

## Backend

Auth, LLM pipeline, PPTX/PDF export, storage, and logging all live in a **separate backend repo**, consumed here purely via REST (`VITE_API_BASE_URL`). This frontend does not talk to Supabase or any provider directly — see `CLAUDE.md` for the full contract.