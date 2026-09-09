# CLAUDE.md

Context file for Claude (or any AI assistant) working in this repo. Read this before making changes.

## Project

**PitchKu** — AI presentation generator for Indonesian SMEs (UMKM). This repo is the **frontend only**. Backend (auth, LLM pipeline, PPTX/PDF export, Supabase, storage) lives in a **separate repo** and is consumed here purely as a REST API.

## Stack

- **Vite + React** (JavaScript, not TypeScript)
- **React Router** (`react-router-dom`) — router setup lives in `main.jsx` (`<BrowserRouter>`), route map lives in `App.jsx` (`<Routes>`/`<Route>`)
- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin, not the old PostCSS/CLI setup. Global styles: `src/index.css` (just `@import "tailwindcss";` plus minimal resets)
- **shadcn/ui** — component primitives, added incrementally via `npx shadcn@latest add <component>` as needed. Don't bulk-install components that aren't used yet.
- **Vitest + React Testing Library** — test runner, shares Vite's config (no separate Babel/Jest setup)
- **Dark theme only** — forced via `class="dark"` on `<html>` in `index.html`. No toggle, no theme provider, no persisted preference. Do not add light mode or a toggle unless explicitly asked.
- **State management** — React Context + `useState`/`useReducer` only. No Zustand/Redux unless a specific, felt problem (e.g. real re-render performance issues in the slide editor) justifies introducing one. Don't add state libraries preemptively.

## Repo structure

```
src/
  components/     # shared/reusable UI pieces (incl. shadcn-generated components)
  pages/          # one file per route, matches routes in App.jsx
  lib/            # API client, constants, helpers
  App.jsx         # route map
  main.jsx        # entry point, router provider
  index.css       # Tailwind import + minimal global resets
```

## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | LandingPage | |
| `/login` | LoginPage | |
| `/register` | RegisterPage | |
| `/dashboard` | DashboardPage | project list |
| `/new` | WizardPage | template select + business context form |
| `/outline/:projectId` | OutlinePage | AI-generated outline review/edit |
| `/editor/:projectId` | EditorPage | slide renderer + in-place editor + export |
| `*` | NotFoundPage | |

All pages are currently placeholders (heading only). Build screens into these files based on the approved mockup — don't invent new routes or page structure without confirming first.

## Backend contract

- All backend communication is via REST, base URL from `VITE_API_BASE_URL` env var (see `.env.example`)
- **Auth is fully backend-owned.** This frontend does not talk to Supabase directly and does not hold auth logic beyond: collecting form input, client-side validation, sending credentials to the backend API, and storing/using whatever token/session the backend returns.
- Character limits enforced by the backend schema (mirror these in frontend validation, don't just rely on the backend to catch it after a round trip):
  - `title` ≤ 60 chars
  - `subtitle`/`lead` ≤ 120 chars
  - `bullets` ≤ 5 per slide, each ≤ 90 chars
  - `card_text` ≤ 80 chars per card
  - free-text business input: 50–2000 chars
- 6 canonical slide layouts the editor/renderer must support: `title_slide`, `title_bullets`, `two_column`, `metrics_grid`, `card_grid`, `contact_closing`

## Working conventions

- **No over-engineering.** Don't add abstraction, config, or dependencies beyond what the current task actually needs. If you're tempted to add a library "for later," don't — flag it as a suggestion instead.
- **Ask before assuming** on anything ambiguous (new routes, new dependencies, architectural changes). This is explicitly how the human wants this project run.
- Match whatever the approved mockup shows — don't redesign screens while implementing them.
- This project is on a hard deadline (see `docs/ARCHITECTURE.md` for timeline). Prioritize shipping working screens over polish unless told otherwise.

## Known open items (not yet decided as of this writing)

- Exact backend API endpoint contract (paths, request/response shapes) — still pending from backend dev
- Whether PDF export, dashboard duplicate-project, and full 4-template support survive the deadline crunch, or get cut