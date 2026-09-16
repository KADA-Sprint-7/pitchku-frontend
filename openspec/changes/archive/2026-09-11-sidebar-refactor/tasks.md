## 1. Create New AppSidebar Component

- [x] 1.1 Create `src/components/layout/AppSidebar.jsx` as a narrow (~72px) icon-rail sidebar with icon + label stacked vertically for each nav item — no wordmark/logo text.
- [x] 1.2 Implement active state on nav items (highlighted pill/block for current route).
- [x] 1.3 Implement bottom user avatar button with click-outside-aware popover containing "Pengaturan" and "Keluar" (navigates to `/login`).

## 2. Wire Dashboard to New Sidebar & Cleanup

- [x] 2.1 Update `src/pages/DashboardPage/index.jsx` to import `AppSidebar` from `@/components/layout/AppSidebar` instead of `DashboardSidebar`.
- [x] 2.2 Delete `src/components/DashboardPage/DashboardSidebar.jsx`.
- [x] 2.3 Run `npm run build` to verify zero compilation errors.
