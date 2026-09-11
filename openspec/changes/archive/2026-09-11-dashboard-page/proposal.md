## Why

The PitchKu frontend currently has a blank placeholder for `/dashboard`, leaving logged-in users with no interface to view, filter, or manage their presentation decks. Implementing the Dashboard page provides the core workspace where users can inspect deck metrics, filter drafts and completed presentations, view estimated AI usage costs, and initiate new presentation decks.

## What Changes

- **Canva-Style Left Rail Sidebar**:
  - Logo branding at top.
  - Navigation links for "Proyek" (active, pointing to dashboard) and "Templat" (pointing to `/new` wizard as a blank/starting template flow).
  - Bottom user avatar trigger displaying a popover menu with "Pengaturan" (Settings) and "Keluar" (Logout, returning to `/login`).
- **Dashboard Workspace Header**:
  - `● RUANG KERJA UMKM` amber badge indicator.
  - Page title "Dasbor Proyek Presentasi" and contextual tagline.
  - Primary "+ Buat Presentasi Baru" button (linking to `/new`).
  - Strict omission of unnecessary AI slop / "Sinkronisasi" controls.
- **Metric Stat Cards (Strictly 2 Cards)**:
  - Total Presentasi / Proyek count with trend indication.
  - Kuota Token AI (e.g. `24.5k / 50k kata`) with usage bar.
- **Filtering & Search**:
  - Tabs for `Semua Proyek`, `Selesai`, and `Draft` with corresponding counts.
  - Live search input filtering decks by title and description.
- **Project Card & Grid**:
  - 16:9 responsive preview presentation cards.
  - Badges for status (`● DRAFT` in amber, `● SELESAI` in emerald), aspect ratio (`Rasio 16:9`), and slide count (`N Slide`).
  - Presentation title, business summary, and estimated AI cost in USD (e.g. `Est. AI: $0.038`).
  - Action buttons routing to editor (`/editor/:projectId`) for completed decks or wizard/outline (`/outline/:projectId`) for drafts.
- **Component Organization**:
  - Component code created strictly within `src/components/DashboardPage/`.
  - Mock dataset defined in `src/lib/mockProjects.js`.
  - Route navigation wired in `src/pages/DashboardPage/index.jsx` and auth forms.

## Capabilities

### New Capabilities
- `dashboard-workspace`: Covers the user workspace dashboard including Canva-style sidebar with avatar popover (settings/logout), summary metric cards (total projects and AI token quota), search and status filter tabs, and presentation cards displaying estimated AI costs.

### Modified Capabilities
<!-- None: No existing specs exist yet -->

## Impact

- **Affected Code**:
  - `src/pages/DashboardPage/index.jsx`: Converted from placeholder to full workspace view.
  - `src/components/DashboardPage/*`: New subcomponents (`DashboardSidebar.jsx`, `DashboardHeader.jsx`, `DashboardMetrics.jsx`, `DashboardFilterBar.jsx`, `ProjectCard.jsx`, `ProjectGrid.jsx`).
  - `src/lib/mockProjects.js`: New mock data source.
  - `src/components/RegisterPage/RegisterForm.jsx`: Redirect route consistency.
- **Dependencies**: Uses existing Lucide icons, shadcn card/button/input primitives, and dark-theme Tailwind variables.
- **APIs**: Client-side mock data until backend REST contracts are finalized.
