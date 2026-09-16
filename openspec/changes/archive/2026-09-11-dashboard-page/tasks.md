## 1. Foundation & Mock Data

- [x] 1.1 Create `src/lib/mockProjects.js` containing mock presentations (Kopi Nusantara, Keripik Pedas, Catering Mandiri, etc.) with statuses (`selesai`, `draft`), slide counts, templates, estimated AI costs, and summary metrics.
- [x] 1.2 Update `src/components/RegisterPage/RegisterForm.jsx` and auth routes to route directly to `/dashboard` upon submission.

## 2. Dashboard Components (`src/components/DashboardPage/`)

- [x] 2.1 Implement `DashboardSidebar.jsx` with Canva-like vertical layout: PitchKu logo, Proyek (active) and Templat (blank wizard link) navigation items, and bottom user avatar popover menu (Pengaturan, Keluar).
- [x] 2.2 Implement `DashboardHeader.jsx` with amber workspace badge, page title, contextual description, and "+ Buat Presentasi Baru" button linking to `/new`.
- [x] 2.3 Implement `DashboardMetrics.jsx` displaying strictly 2 cards: "Total Presentasi" (count + trend) and "Kuota Token AI" (words used + progress bar).
- [x] 2.4 Implement `DashboardFilterBar.jsx` with status tabs ("Semua Proyek", "Selesai", "Draft") showing item counts, plus live search input.
- [x] 2.5 Implement `ProjectCard.jsx` and `ProjectGrid.jsx` with 16:9 thumbnail preview, ratio and template badges, status badge (`● Selesai` / `● Draft`), estimated AI cost ($), and action buttons.

## 3. Page Assembly & Verification

- [x] 3.1 Integrate components into `src/pages/DashboardPage/index.jsx` with responsive grid layout and active filter/search state.
- [x] 3.2 Verify layout rendering, filter state behavior, avatar popover interactions, and navigation links.
