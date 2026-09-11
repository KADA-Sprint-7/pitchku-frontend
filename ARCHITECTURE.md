# PitchKu — Architecture Overview

## System shape

Two separate repositories, no shared codebase:

```
┌─────────────────────┐         REST API          ┌──────────────────────┐
│   Frontend (this)   │ ────────────────────────► │  Backend (separate)  │
│  Vite + React        │ ◄──────────────────────── │  owns: auth, LLM      │
│  React Router         │      JSON over HTTP       │  pipeline, Supabase, │
│  Tailwind v4 + shadcn │                            │  PPTX/PDF export,    │
└─────────────────────┘                            │  storage, logging     │
                                                     └──────────────────────┘
```

There is no shared TypeScript schema between repos (frontend is plain JS). The slide JSON contract (layouts, character limits) is defined by the backend and must be mirrored manually in frontend validation — keep this in sync by hand, since there's no compile-time guarantee across repos.

## Team & ownership

| Person | Owns |
|---|---|
| Frontend dev (you) | Wizard (template select, business form), slide renderer, in-place editor, dashboard, all client-side validation |
| AI dev | LLM Stage 1 (outline generation) + Stage 2 (structured slide JSON), schema validation, retry logic, image-query extraction |
| Backend dev | Supabase (auth, DB, RLS), PPTX export engine (pptxgenjs), PDF export, brand kit storage, stock photo API integration, generation/cost logging |

This split follows the FRD's module boundaries (FR-02 through FR-06) but was restructured from the original 2-person plan to 3 people, since the original AI+export bundling on one person was a bottleneck.

## User flow (frontend-visible)

```
Landing → Register/Login
  → Dashboard (project list with search, status filters & metrics)
    → New Project Wizard (/new)
      Step 1: Template select (4 templates: company_profile, penawaran_produk, proposal_kerjasama, laporan_ringkas)
      Step 2: Business context form (dynamic fields, number validation, 50-2000 char free text) + Brand Kit Visual (logo, colors, typography)
      → [AI Stage 1: outline generation — backend call]
    → Outline Review (/outline/:projectId)
      - Review AI-generated slide structure (8-10 slides)
      - Inline edit slide titles (<= 60 chars) & objectives
      - Reorder slides (drag & drop / grip handle)
      - Add, delete, duplicate, reset to default structure
      → [AI Stage 2: full slide JSON generation — backend call]
    → Slide Editor (/editor/:projectId)
      - 16:9 renderer, 6 canonical layouts (title_slide, title_bullets, two_column, metrics_grid, card_grid, contact_closing)
      - in-place text editing with character counters
      - sidebar thumbnails, reorder/delete slides
      - image swap (stock photo search or manual upload)
      - Brand Kit (logo, primary/accent color) applied throughout
      → Export: Download PPTX
```

## Canonical slide layouts

Frontend renderer and backend PPTX export must visually match for each of:

1. `title_slide` — cover slide
2. `title_bullets` — title + bullet list
3. `two_column` — side-by-side comparison
4. `metrics_grid` — 3-4 stat callouts
5. `card_grid` — product/team cards
6. `contact_closing` — closing/contact info

## Timeline

- **Coding:** [start date] through Sept 16 (8 days, weekends included, team agreed to work weekends)
- **Sept 17:** testing
- **Sept 18:** presentation/demo

Given the compressed timeline vs. the original 14-day FRD scope, first candidates for cutting if time runs short (not yet decided, needs team confirmation):
- PDF export (PPTX is the priority)
- Dashboard duplicate/reopen-draft convenience features
- Reducing from 4 templates to fewer, fully-polished ones
- 5-person UAT (already deferred, not a hard blocker)

## Deployment

- Frontend: Vercel
- Backend: separate service, deployment TBD by backend dev (may hit serverless timeout constraints on PPTX generation — worth revisiting if backend also targets Vercel)

## Non-functional targets (from FRD, for reference)

- End-to-end flow (form → outline → slide ready in editor): < 5 minutes
- PPTX/PDF render + download: fast enough per-slide to not feel broken (exact target depends on backend's platform choice)
- Zero visual defects (text overflow/overlap) when exported PPTX is opened in MS PowerPoint and Google Slides