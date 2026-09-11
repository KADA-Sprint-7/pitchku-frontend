## Why

The current `DashboardSidebar` is wide (`w-64`), logo-heavy, and buried inside a page-specific component folder (`src/components/DashboardPage/`). As the app grows to include Editor and Outline views, every protected page needs the same sidebar — it must live in the shared layout layer. The visual style also needs to match Canva's signature look: a narrow icon-only rail where icons and their labels are stacked vertically, no branding wordmark, ultra-minimal, with the avatar at the very bottom.

## What Changes

- **[NEW] `src/components/layout/AppSidebar.jsx`**: A narrow (~72px wide) icon-rail sidebar replacing `DashboardSidebar.jsx`. Each nav item is icon + short label stacked vertically, Canva-style. No logo or branding wordmark. Bottom avatar opens popover (Pengaturan, Keluar).
- **[DELETE] `src/components/DashboardPage/DashboardSidebar.jsx`**: Old wide sidebar removed once `AppSidebar` is in place.
- **[MODIFY] `src/pages/DashboardPage/index.jsx`**: Import `AppSidebar` from layout layer instead of the deleted component.
- **[MODIFY] `src/components/layout/` exports**: New `AppSidebar` becomes a sibling of `Navbar` and `Footer` in the layout directory.

## Capabilities

### New Capabilities

- `layout/app-sidebar`: Minimalist Canva-style icon-rail sidebar for all protected app pages — narrow fixed rail, icon + label stacked vertically, no branding wordmark, bottom user avatar popover.

### Modified Capabilities

- `dashboard-workspace`: Dashboard layout switches from the wide sidebar to the new narrow icon-rail `AppSidebar` from the shared layout layer.

## Impact

- **Affected Files**:
  - `src/components/layout/AppSidebar.jsx` — [NEW]
  - `src/components/DashboardPage/DashboardSidebar.jsx` — [DELETE]
  - `src/pages/DashboardPage/index.jsx` — import path update
- **Dependencies**: Existing Lucide icons, React Router `useLocation`/`useNavigate`, dark CSS variables.
- **Future**: Any new protected page (`EditorPage`, `OutlinePage`) will import `AppSidebar` from layout rather than creating a new sidebar per page.
