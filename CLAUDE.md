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
| `/dashboard` | DashboardPage | Standalone with `AppSidebar` | Implemented (Header, Metrics, Filter/Search, ProjectGrid) |
| `/new` | WizardPage | Standalone with `AppSidebar` | Implemented (Step 1: TemplateSelector, Step 2: BusinessContextForm + BrandKitSelector, 3-point Stepper) |
| `/outline/:projectId` | OutlinePage | Standalone with `AppSidebar` | In Progress / Next Up (AI Outline Review, reordering, title editing) |
| `/editor/:projectId` | EditorPage | Standalone with `AppSidebar` | Pending (16:9 Canvas renderer, 6 layouts, in-place edit, PPTX export) |
| `*` | NotFoundPage | None | Implemented (404 screen) |

---

## Current State of the Codebase

### What is currently implemented (In the Codebase now):
1. **Public & Marketing Pages**:
   - **LandingPage** (`/`): Fully built with `HeroSection`, `AdvantageSection`, `HowItWorks`, `TemplateCatalogue`, and `BottomCTA`.
   - **FAQPage** (`/faq`): Fully built with interactive accordion covering 10 detailed UMKM Q&As.
   - **TermsPage** (`/terms`): Standalone legal page covering 10 service & data privacy clauses.
   - **NotFoundPage** (`*`): 404 handler with return links.
2. **Authentication Flow (UI & Client-Side)**:
   - **`AuthLayout`**: Shared 2-column layout (marketing showcase + form panel with `/login` vs `/register` tab switcher).
   - **`LoginForm`** (`src/components/LoginPage/LoginForm.jsx`): Login form with mock redirect to `/dashboard`.
   - **`RegisterForm`** (`src/components/RegisterPage/RegisterForm.jsx`): Registration form with mock redirect to `/login`.
3. **Layout & Navigation Components**:
   - **`AppSidebar`** (`src/components/layout/AppSidebar.jsx`): Canva-style narrow icon-rail sidebar (72px) with stacked icon+label, active state highlight, and bottom profile avatar popover (Pengaturan & Keluar).
   - **`Navbar`** (`src/components/layout/Navbar.jsx`) & **`Footer`** (`src/components/layout/Footer.jsx`): Public navigation and footer.
   - **`PublicLayout`** (`src/layouts/PublicLayout.jsx`): Layout wrapper for public marketing pages.
4. **App Workspace & Wizard Flow**:
   - **`DashboardPage`** (`/dashboard`): Workspace dashboard with metrics (Total Presentasi & Kuota AI), search & status filter tabs (Semua, Selesai, Draft), and responsive project card grid.
   - **`WizardPage`** (`/new`): 
     - Step 1: `TemplateSelector` (4 templates with 16:9 visual preview).
     - Step 2: `BusinessContextForm` (numeric validations for year/team/price/moq/margin/investment/revenue/profit + shadcn Select for report period + 50-2000 char raw text area) + `BrandKitSelector` (logo upload <=2MB, 4 color presets, custom HEX pickers, font selector).
     - `WizardStepper` (3-point stepper) & `WizardFooterBar` (sticky navigation).
     - Sonner toast confirmation on step completion.
5. **Design System & UI Components**:
   - Palette tailored for dark theme (`#070C15`, `#0B111E`, PitchKu amber, slate variants).
   - Base UI + shadcn primitives: `accordion.jsx`, `button.jsx`, `card.jsx`, `dialog.jsx`, `input.jsx`, `select.jsx`, `sonner.jsx`.
   - Typography: `@fontsource-variable/plus-jakarta-sans` and `@fontsource-variable/geist`.
   - Utility hooks: `usePageTitle.js`.

---

### What has NOT been implemented yet (Pending in the Codebase):
1. **Core Product & App Flow (Pending)**:
   - **`OutlinePage`** (`/outline/:projectId`): Reviewing AI-generated slide outlines, editing slide titles (max 60 chars), adding/reordering/deleting/duplicating slides, triggering Stage 2 full deck generation.
   - **`EditorPage`** (`/editor/:projectId`):
     - 16:9 canvas renderer for the 6 canonical slide layouts (`title_slide`, `title_bullets`, `two_column`, `metrics_grid`, `card_grid`, `contact_closing`).
     - In-place text editing with character counters.
     - Slide sidebar thumbnails, reorder, delete, and add slides.
     - Image swap (stock search or manual upload).
     - Export trigger buttons (PPTX download).
2. **State & Architecture Wiring**:
   - Slide deck project state / storage (mock store / Context) connecting `/new` -> `/outline/:projectId` -> `/editor/:projectId`.
   - Protected layout / auth session guard.
3. **Backend API Integration & Client**:
   - API client wrapper in `src/lib/` (consuming `VITE_API_BASE_URL`).
   - Auth endpoints, Stage 1 LLM outline generation, Stage 2 LLM slide generation, and PPTX export stream.
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