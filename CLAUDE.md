# CLAUDE.md

Context file for Claude (or any AI assistant) working in this repo. Read this before making changes.

## Project

**PitchKu** — AI presentation generator for Indonesian SMEs (UMKM). This repo is the **frontend only**. Backend (auth, LLM pipeline, PPTX export, Supabase, storage) lives in a **separate repo** and is consumed here via REST API (`VITE_API_BASE_URL`).

## Stack

- **Vite + React** (JavaScript, not TypeScript)
- **React Router** (`react-router-dom` v7) — router setup lives in `main.jsx` (`<BrowserRouter>`), route map lives in `App.jsx` (`<Routes>`/`<Route>`)
- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin. Global styles: `src/index.css`
- **shadcn/ui** primitives (using `@base-ui/react`, `class-variance-authority`, `cn`, `tw-animate-css`) — added incrementally as needed.
- **Supabase Auth** — client-side authentication via `@supabase/supabase-js` (`src/lib/supabase.js` and `src/context/AuthContext.jsx`).
- **Export Engines** — REST endpoint `POST /api/export/pptx` + client-side `pptxgenjs` fallback engine, `html2canvas` + `jsPDF` for PDF export.
- **Dark theme only** — forced via `class="dark"` on `<html>` in `index.html`. No light mode toggle.
- **State management** — React Context + `useState`/`useReducer` + `projectStore.js` (localStorage draft cache simulating DB state).

## Repo structure

```
src/
  assets/         # static assets (logos, images, etc.)
  components/     # shared/reusable UI pieces & page-specific subcomponents
    LandingPage/  # HeroSection, AdvantageSection, HowItWorks, TemplateCatalogue, BottomCTA
    LoginPage/    # LoginForm (with Supabase Auth & Forgot Password modal)
    RegisterPage/ # RegisterForm (with Supabase Auth registration)
    Outline/      # OutlineReviewer (AI outline editor, reorder, title limit counters)
    SlideEditor/  # EditorHeader, SlideCanvas, SlideFormatToolbar, SlideThumbnailRail, ExportPresentationModal, MediaPickerModal, AddSlideModal, SlideExportCanvas
    Wizard/       # TemplateSelector, BusinessContextForm, BrandKitSelector, WizardStepper, WizardFooterBar
    layout/       # AppSidebar, Navbar, Footer
    ui/           # shadcn primitives (accordion, button, card, dialog, input, select, sonner)
  context/        # AuthContext.jsx
  hooks/          # custom React hooks (e.g., usePageTitle)
  layouts/        # PublicLayout, AuthLayout
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
  lib/            # api.js, aiService.js, colorUtils.js, deckPayloadGenerator.js, mockOutlineGenerator.js, projectStore.js, supabase.js, utils.js
  App.jsx         # route map
  main.jsx        # entry point, router provider
  index.css       # Tailwind import + theme definitions + typography
```

## Routes

| Path | Page | Layout | Status |
|---|---|---|---|
| `/` | LandingPage | `PublicLayout` | Implemented (Hero, Keunggulan, Cara Kerja, Pilihan Templat, CTA, Footer) |
| `/faq` | FAQPage | `PublicLayout` | Implemented (Accordion FAQ + CTA + Footer) |
| `/terms` | TermsPage | None (standalone header/footer) | Implemented (10 legal terms, navigation back) |
| `/login` | LoginPage | `AuthLayout` | Implemented (Supabase Auth login, Google OAuth, Forgot Password modal) |
| `/register` | RegisterPage | `AuthLayout` | Implemented (Supabase Auth register with full_name & company_name) |
| `/dashboard` | DashboardPage | Standalone with `AppSidebar` | Implemented (Header, Metrics, Filter/Search, ProjectGrid, Delete project) |
| `/new` | WizardPage | Standalone with `AppSidebar` | Implemented (Step 1: TemplateSelector + AI Diagnose, Step 2: BusinessContextForm + BrandKitSelector) |
| `/outline/:projectId` | OutlinePage | Standalone with `AppSidebar` | Implemented (AI Outline review, reorder, edit titles, add/delete slide) |
| `/editor/:projectId` | EditorPage | Standalone with `AppSidebar` | Implemented (16:9 Canvas renderer, 6 layouts, inline edit, image picker, PPTX & PDF export) |
| `*` | NotFoundPage | None | Implemented (404 screen) |

---

## Current State of the Codebase

### What is currently implemented:
1. **Public & Marketing Pages**:
   - `LandingPage`, `FAQPage`, `TermsPage`, `NotFoundPage` fully operational.
2. **Authentication Flow**:
   - Integrated Supabase Auth (`src/lib/supabase.js`) in `AuthContext.jsx`.
   - `LoginForm`: Email + Password login, Google OAuth, and **Forgot Password modal** (`supabase.auth.resetPasswordForEmail`).
   - `RegisterForm`: Registration with metadata (`full_name`, `company_name`).
3. **App Workspace & Wizard Flow**:
   - `DashboardPage` (`/dashboard`): Metrics, project list, filter tabs (Semua, Selesai, Draft), and deletion handler.
   - `WizardPage` (`/new`): Step 1 template selection (4 templates: `company_profile`, `penawaran_produk`, `proposal_kerjasama`, `laporan_ringkas`) + AI Diagnose, Step 2 business context numeric validation + Brand Kit selector.
4. **AI Stage 1 Outline Review**:
   - `OutlinePage` (`/outline/:projectId`): Displays 8-10 slides with suggested layout badges, inline title editing (max 60 chars), slide reordering, adding/deleting slides, and resetting to AI defaults.
5. **Slide Editor & Export Canvas**:
   - `EditorPage` (`/editor/:projectId`): Fixed 16:9 canvas viewport rendering 6 canonical layouts (`title_slide`, `title_bullets`, `two_column`, `metrics_grid`, `card_grid`, `contact_closing`).
   - Real-time inline field editing with character limit counters.
   - Media & stock image picker modal (`MediaPickerModal.jsx`).
   - Add slide layout selection modal (`AddSlideModal.jsx`).
   - Export modal (`ExportPresentationModal.jsx`): API integration to `POST /api/export/pptx` + client-side `pptxgenjs` fallback with BrandKit logo & cover image rendering, and PDF export.

---

## Backend contract

- All backend communication is via REST, base URL from `VITE_API_BASE_URL` env var (see `.env.example`)
- Auth uses Supabase Auth client-side (`src/lib/supabase.js`).
- PPTX export API payload schema (`POST /api/export/pptx`):
  ```json
  {
    "deckId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "template": "penawaran_produk",
    "businessName": "string",
    "brandKit": {
      "logoUrl": "string",
      "primaryColor": "#0F4C81",
      "accentColor": "#F2A007",
      "fontFamily": "Inter"
    },
    "slides": [
      {
        "slideNumber": 1,
        "layout": "title_bullets",
        "title": "string",
        "subtitle": "string",
        "bullets": ["string"],
        "cards": [{"header": "string", "description": "string"}],
        "imageUrl": "string",
        "imageQuery": "string",
        "missing": ["string"]
      }
    ]
  }
  ```
- Character limits enforced:
  - `title` ≤ 60 chars
  - `subtitle` ≤ 120 chars
  - `bullets` ≤ 5 per slide, each ≤ 90 chars
  - `card.description` ≤ 80 chars per card
  - business description: 50–2000 chars
- 6 canonical slide layouts: `title_slide`, `title_bullets`, `two_column`, `metrics_grid`, `card_grid`, `contact_closing`

## Working conventions

- **No over-engineering.** Keep components focused and modular.
- **Match approved mockups.** Maintain dark theme aesthetics (`#070C15`, `#0B111E`, PitchKu amber, slate variants).
- Prioritize shipping working screens and clean API integration.port survive the deadline crunch, or get cut