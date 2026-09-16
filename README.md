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

This repo is the **frontend SPA** for **PitchKu**, built with Vite + React, Tailwind CSS v4, shadcn/ui, Supabase Auth, and REST API integration.

> Looking for AI-assistant working context? See [`CLAUDE.md`](./CLAUDE.md).
> Looking for system architecture & data contracts? See [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in VITE_API_BASE_URL and Supabase keys
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
| `VITE_API_BASE_URL` | Base URL of the backend REST API (default: `http://localhost:8000/api`) |

See `.env.example` for the template. `.env.local` is gitignored.

## Project structure

```
src/
  components/     # shared UI, page-specific subcomponents, SlideEditor, Wizard, Outline, LoginPage, RegisterPage
  context/        # AuthContext.jsx
  hooks/          # React custom hooks (usePageTitle)
  layouts/        # PublicLayout, AuthLayout
  pages/          # DashboardPage, EditorPage, FAQPage, LandingPage, LoginPage, NotFoundPage, OutlinePage, RegisterPage, TermsPage, WizardPage
  lib/            # api.js, aiService.js, colorUtils.js, deckPayloadGenerator.js, mockOutlineGenerator.js, projectStore.js, supabase.js, utils.js
  App.jsx         # route map
  main.jsx        # entry point, router provider
  index.css       # Tailwind import + theme definitions
```

## Routes

| Path | Layout | Page | Description |
|---|---|---|---|
| `/` | PublicLayout | Landing | Hero, Keunggulan, Cara Kerja, Pilihan Templat, CTA, Footer |
| `/faq` | PublicLayout | FAQ | Interactive accordion covering UMKM Q&As |
| `/terms` | None | Terms | Standalone legal & data privacy terms |
| `/login` | AuthLayout | Login | Email/password login, Google OAuth, and **Forgot Password modal** |
| `/register` | AuthLayout | Register | User registration with full_name & company_name |
| `/dashboard` | AppSidebar | Dashboard | Metrics, search, filter tabs, project grid, delete project |
| `/new` | AppSidebar | Wizard | Step 1 Template selector + AI diagnose, Step 2 Business context & Brand Kit |
| `/outline/:projectId` | AppSidebar | Outline | AI outline review, title editing, reordering, layout badges |
| `/editor/:projectId` | AppSidebar | Slide Editor | 16:9 canvas, 6 canonical layouts, inline edit, image picker, PPTX & PDF export |
| `*` | None | 404 | Not Found screen |

## Backend & API Integration

- **Auth:** Client-side Supabase Auth (`src/lib/supabase.js`).
- **REST Endpoints:** Consumed via `fetchApi` wrapper in `src/lib/api.js` (`POST /api/generate/diagnose`, `POST /api/generate/outline`, `POST /api/generate/slides`, `POST /api/export/pptx`).
- **Export Fallback:** Client-side `pptxgenjs` engine guarantees valid `.pptx` downloads with BrandKit logo & images even when backend is offline.