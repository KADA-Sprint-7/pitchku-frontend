## Context

The PitchKu frontend is dark-mode only (Tailwind v4 with `@tailwindcss/vite`, Base UI/shadcn, Plus Jakarta Sans font). The dashboard route (`/dashboard`) is a simple `h1` placeholder and `ProtectedLayout.jsx` is currently empty. Backend APIs are not yet finalized, so all dashboard presentation items, token counters, and user session values must use client-side mock data conforming to expected future schemas.

## Goals / Non-Goals

**Goals:**
- Provide a responsive Canva-style sidebar with Proyek, Templat, and user avatar popover (Pengaturan & Keluar).
- Build modular subcomponents in `src/components/DashboardPage/`.
- Present workspace header with `● RUANG KERJA UMKM`, title, description, and `+ Buat Presentasi Baru` CTA.
- Display 2 metric cards: Total Presentasi and Kuota Token AI.
- Implement filter controls (Semua, Selesai, Draft) and instantaneous client search.
- Display rich project cards with 16:9 preview, slide count, aspect ratio, title, summary, and estimated AI cost ($).

**Non-Goals:**
- Actual server-side Supabase authentication or REST API integration (deferred until backend repo exposes endpoints).
- Real slide PPTX generation/export from dashboard.
- Cloud storage meter or sync button.

## Decisions

### 1. Canva-style Sidebar vs Horizontal Topbar
- **Decision**: Left-docked fixed rail sidebar (`w-64` on desktop, collapsible/sliding on smaller viewports) with icon + text navigation items.
- **Rationale**: Matches Canva and modern presentation design tools, providing dedicated space for deck management and template discovery.
- **Alternatives Considered**: Simple topbar navbar. Rejected because user specifically requested a Canva-style left sidebar.

### 2. Avatar Popover Menu
- **Decision**: Clickable avatar button at the bottom of the sidebar with an anchored dropdown card providing "Pengaturan" and "Keluar" actions.
- **Rationale**: Keeps the sidebar tidy and avoids unnecessary clashing with navigation tabs. Clicking outside or selecting an item closes the popover.

### 3. Metric Cards Scope
- **Decision**: Strictly render 2 metric cards: "Total Presentasi" and "Kuota Token AI".
- **Rationale**: Removes visual clutter ("AI Slop") and removes non-actionable elements like cloud storage or sync triggers that aren't hooked up.

### 4. Mock Data Structure (`src/lib/mockProjects.js`)
- **Decision**: Store structured mock decks:
  ```js
  {
    id: "proj-1",
    title: "Company Profile – Kopi Nusantara",
    description: "Profil lengkap profil usaha kopi specialty, kapasitas roasting 2 ton/bulan...",
    status: "selesai", // 'selesai' | 'draft'
    slideCount: 8,
    ratio: "16:9",
    templateName: "Company Profile",
    estimatedCost: "$0.038",
    updatedAt: "2 jam lalu",
    previewImage: "/assets/mock-previews/coffee-deck.png" // or fallback gradient mockup
  }
  ```

## Risks / Trade-offs

- **[Risk]** Missing thumbnail image assets causing broken cards.
  → **Mitigation**: Render stylized presentation mock slides (with title, mock visual blocks, and gradients) matching the dark theme if no external image exists.
- **[Risk]** Backend endpoint schema divergence later.
  → **Mitigation**: Keep mock data isolated in `src/lib/mockProjects.js` so mapping to future REST endpoints requires touching only one adapter file.
