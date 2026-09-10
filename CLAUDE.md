# CLAUDE.md

Context file for Claude (or any AI assistant) working in this repo. Read this before making changes.

## Project

**PitchKu** — AI presentation generator for Indonesian SMEs (UMKM). This repo is the **frontend only**. Backend (auth, LLM pipeline, PPTX/PDF export, Supabase, storage) lives in a **separate repo** and is consumed here purely as a REST API.

## Stack

- **Vite + React** (JavaScript, not TypeScript)
- **React Router** (`react-router-dom` v7) — router setup lives in `main.jsx` (`<BrowserRouter>`), route map lives in `App.jsx` (`<Routes>`/`<Route>`)
- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin, not the old PostCSS/CLI setup. Global styles: `src/index.css`
- **shadcn/ui** primitives (using `@base-ui/react`, `class-variance-authority`, `cn`, `tw-animate-css`) — added incrementally as needed.
- **Vitest + React Testing Library** — test runner, shares Vite's config (`test-setup.js`)
- **Dark theme only** — forced via `class="dark"` on `<html>` in `index.html`. No toggle, no theme provider, no persisted preference. Do not add light mode or a toggle unless explicitly asked.
- **State management** — React Context + `useState`/`useReducer` only. No Zustand/Redux unless a specific, felt problem (e.g. real re-render performance issues in the slide editor) justifies introducing one. Don't add state libraries preemptively.

## Repo structure

```
src/
  assets/         # static assets (logos, images, etc.)
  components/     # shared/reusable UI pieces & page-specific subcomponents
    LandingPage/  # HeroSection, AdvantageSection, HowItWorks, TemplateCatalogue, BottomCTA
    LoginPage/    # LoginForm
    RegisterPage/ # RegisterForm
    layout/       # Navbar, Footer
    ui/           # shadcn primitives (accordion, button, card, input)
  hooks/          # custom React hooks (e.g., usePageTitle)
  layouts/        # layout wrappers (PublicLayout, AuthLayout, ProtectedLayout)
  pages/          # page components per route
    DashboardPage/
    EditorPage/
    FAQPage/
    LandingPage/
    LoginPage/
    NotFoundPage/
    OutlinePage/
    RegisterPage/
    TermsPage/
    WizardPage/
  lib/            # API client, constants, helpers (utils.js)
  App.jsx         # route map
  main.jsx        # entry point, router provider
  index.css       # Tailwind import + theme definitions + typography
  test-setup.js   # Vitest / testing-library setup
```

## Routes

| Path | Page | Layout | Status |
|---|---|---|---|
| `/` | LandingPage | `PublicLayout` | Implemented (Hero, Keunggulan, Cara Kerja, Pilihan Templat, CTA, Footer) |
| `/faq` | FAQPage | `PublicLayout` | Implemented (Accordion FAQ + CTA + Footer) |
| `/terms` | TermsPage | None (standalone header/footer) | Implemented (10 legal terms, navigation back) |
| `/login` | LoginPage | `AuthLayout` | Implemented (Marketing preview + `LoginForm` component) |
| `/register` | RegisterPage | `AuthLayout` | Implemented (Marketing preview + `RegisterForm` component) |
| `/dashboard` | DashboardPage | Standalone / Pending ProtectedLayout | Placeholder (`h1`) |
| `/new` | WizardPage | Standalone / Pending ProtectedLayout | Placeholder (`h1`) |
| `/outline/:projectId` | OutlinePage | Standalone / Pending ProtectedLayout | Placeholder (`h1`) |
| `/editor/:projectId` | EditorPage | Standalone / Pending ProtectedLayout | Placeholder (`h1`) |
| `*` | NotFoundPage | None | Implemented (404 screen) |

---

## Current State of the Codebase

### What is currently implemented (In the Codebase now):
1. **Public & Marketing Pages**:
   - **LandingPage** (`/`): Fully built with `HeroSection`, `AdvantageSection` (metrics & benefits), `HowItWorks` (3 steps), `TemplateCatalogue` (4 curated templates with interactive live card previews), and `BottomCTA`.
   - **FAQPage** (`/faq`): Fully built with interactive accordion covering 10 detailed UMKM Q&As.
   - **TermsPage** (`/terms`): Standalone legal page covering 10 service & data privacy clauses.
   - **NotFoundPage** (`*`): 404 handler with return links.
2. **Authentication Flow (UI & Client-Side)**:
   - **`AuthLayout`**: Shared 2-column layout (left marketing showcase with dynamic mock pitch deck card, stats, trust badges; right form panel with `/login` vs `/register` tab switcher).
   - **`LoginForm`** (`src/components/LoginPage/LoginForm.jsx`): Login form, email/password validation, show/hide password, remember me, and mock redirect to `/dashboard`.
   - **`RegisterForm`** (`src/components/RegisterPage/RegisterForm.jsx`): Registration form, full name, company name, email, password confirmation, terms agreement validation, mock redirect to `/login`.
3. **Layout & Navigation Components**:
   - **`Navbar`** (`src/components/layout/Navbar.jsx`): Responsive header with section observer smooth scrolling, mobile sidebar drawer, and CTA buttons.
   - **`Footer`** (`src/components/layout/Footer.jsx`): Global footer with branding, anchor links, template categories, and copyright.
   - **`PublicLayout`** (`src/layouts/PublicLayout.jsx`): Layout wrapper for public pages with sticky Navbar and `<Outlet />`.
4. **Design System & UI Components**:
   - Palette tailored for dark theme (`#070C15`, PitchKu amber, slate variants).
   - Base UI + shadcn primitives: `accordion.jsx`, `button.jsx`, `card.jsx`, `input.jsx`.
   - Typography loaded: `@fontsource-variable/plus-jakarta-sans` and `@fontsource-variable/geist`.
   - Utility hook `usePageTitle.js` for dynamic document title updates.

---

### What has NOT been implemented yet (Pending in the Codebase):
1. **Core Product & App Flow (Currently Placeholders)**:
   - **`DashboardPage`** (`/dashboard`): Project listing, project card status, search/filter, "Buat Pitch Deck Baru" button, duplicate/delete actions.
   - **`WizardPage`** (`/new`): Step 1 (Template selection among 4 templates) and Step 2 (Dynamic business context form with 50–2000 character limits and template-specific guidance).
   - **`OutlinePage`** (`/outline/:projectId`): Reviewing AI-generated slide outlines, editing slide titles, adding/reordering/deleting slides, triggering Stage 2 generation.
   - **`EditorPage`** (`/editor/:projectId`):
     - 16:9 canvas renderer for the 6 canonical slide layouts (`title_slide`, `title_bullets`, `two_column`, `metrics_grid`, `card_grid`, `contact_closing`).
     - In-place text editing with character counters.
     - Slide sidebar thumbnails, reorder, delete, and add slides.
     - Image swap (stock search or manual upload).
     - Brand kit controls (logo upload, primary/accent color picker).
     - Export trigger buttons (PPTX / PDF download).
2. **State & Architecture Wiring**:
   - **`ProtectedLayout.jsx`**: Currently an empty file (needs auth session check and navigation guard for `/dashboard`, `/new`, `/outline/:id`, `/editor/:id`).
   - **State Management / Context**: Slide deck project state context, wizard draft context, or editor state reducer.
3. **Backend API Integration & Client**:
   - API client / fetch wrapper in `src/lib/` (consuming `VITE_API_BASE_URL`).
   - Auth endpoints integration (session token handling, login, register, logout).
   - Outline generation API call (Stage 1 LLM).
   - Full slide generation API call (Stage 2 LLM).
   - Export API integration (initiating PPTX/PDF generation and download stream).
4. **Validation Rules Enforcement**:
   - Strict character limit counters and validation matching the backend schema:
     - `title` ≤ 60 chars
     - `subtitle`/`lead` ≤ 120 chars
     - `bullets` ≤ 5 per slide, each ≤ 90 chars
     - `card_text` ≤ 80 chars per card
     - Business description: 50–2000 chars

---

## Backend contract

- All backend communication is via REST, base URL from `VITE_API_BASE_URL` env var (see `.env.example`)
- **Auth is fully backend-owned.** This frontend does not talk to Supabase directly and does not hold auth logic beyond: collecting form input, client-side validation, sending credentials to the backend API, and storing/using whatever token/session the backend returns. (TBD)
- Character limits enforced by the backend schema (mirror these in frontend validation):
  - `title` ≤ 60 chars
  - `subtitle`/`lead` ≤ 120 chars
  - `bullets` ≤ 5 per slide, each ≤ 90 chars
  - `card_text` ≤ 80 chars per card
  - free-text business input: 50–2000 chars
- 6 canonical slide layouts the editor/renderer must support: `title_slide`, `title_bullets`, `two_column`, `metrics_grid`, `card_grid`, `contact_closing`

## Working conventions

- **No over-engineering.** Don't add abstraction, config, or dependencies beyond what the current task actually needs. If you're tempted to add a library "for later," don't — flag it as a suggestion instead.
- **Ask before assuming** on anything ambiguous (new routes, new dependencies, architectural changes).
- Match whatever the approved mockup shows — don't redesign screens while implementing them.
- Timeline: Coding through Sept 16, testing Sept 17, presentation Sept 18. Prioritize shipping working screens over polish.

## Known open items (not yet decided as of this writing)

- Exact backend API endpoint contract (paths, request/response shapes) — still pending from backend dev
- Whether PDF export, dashboard duplicate-project, and full 4-template support survive the deadline crunch, or get cut