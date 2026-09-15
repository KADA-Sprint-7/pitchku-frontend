# PitchKu — Architecture Overview

## System shape

Two separate repositories communicating over REST:

```
┌─────────────────────┐         REST API          ┌──────────────────────┐
│   Frontend (this)   │ ────────────────────────► │  Backend (separate)  │
│  Vite + React       │ ◄──────────────────────── │  owns: LLM pipeline, │
│  React Router v7    │      JSON over HTTP       │  PPTX export engine, │
│  Tailwind v4        │                           │  Supabase DB & RLS   │
└─────────────────────┘                           │  storage, logging    │
          │                                       └──────────────────────┘
          ▼
  Supabase Auth Client
  (direct OAuth / session)
```

The frontend uses client-side Supabase Auth (`src/lib/supabase.js`) and sends bearer tokens for backend endpoints (`/api/generate/*`, `/api/export/pptx`, `/api/projects`).

## Team & ownership

| Person | Owns |
|---|---|
| Frontend dev (you) | Wizard (template select, business form), Brand Kit selector, AI outline review, 16:9 canvas slide editor, client-side validation, Supabase Auth integration, PPTX & PDF export UI |
| AI dev | LLM Stage 1 (outline generation) + Stage 2 (structured slide JSON), schema validation, retry logic, image-query extraction |
| Backend dev | Backend API server, Supabase DB & RLS, PPTX export engine (`/api/export/pptx`), stock photo API integration, generation/cost logging |

## User flow (frontend-visible)

```
Landing → Register/Login (Supabase Auth / Google OAuth / Forgot Password)
  → Dashboard (project list with search, status filters & metrics)
    → New Project Wizard (/new)
      Step 1: Template select (4 templates: company_profile, penawaran_produk, proposal_kerjasama, laporan_ringkas) + AI Diagnose
      Step 2: Business context form (numeric validations, 50-2000 char free text) + Brand Kit Visual (logo, colors, typography)
      → [AI Stage 1: /api/generate/outline]
    → Outline Review (/outline/:projectId)
      - Review AI-generated slide structure (8-10 slides)
      - Inline edit slide titles (<= 60 chars) & objectives
      - Reorder slides & change suggested layout badges
      - Add, delete, duplicate, reset to default structure
      → [AI Stage 2: /api/generate/slides]
    → Slide Editor (/editor/:projectId)
      - 16:9 canvas viewport rendering 6 canonical layouts
      - In-place text editing with real-time character counters
      - Sidebar thumbnails, reorder/delete slides, add custom slide layout
      - Image swap (stock photo search or manual upload)
      - Brand Kit (logo, primary/accent color) applied throughout
      → Export: Download PPTX (REST POST /api/export/pptx + pptxgenjs fallback) or PDF
```

## Canonical slide layouts

Frontend renderer and backend PPTX export visually mirror 6 canonical layouts:

1. `title_slide` — cover slide with right panel image
2. `title_bullets` — title + subhead + 5 bullet list callouts
3. `two_column` — side-by-side comparison cards
4. `metrics_grid` — 4 metric stat callouts
5. `card_grid` — 4 bento cards
6. `contact_closing` — closing CTA + 4 contact cards

## Export REST API Payload Contract (`POST /api/export/pptx`)

```json
{
  "deckId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "template": "penawaran_produk",
  "businessName": "PitchKu Presentasi",
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

## Deployment

- Frontend: Vercel / Netlify / Vite SPA static host
- Backend: REST API Server (`VITE_API_BASE_URL`) + Supabase Auth & Database