## Context

`DashboardSidebar.jsx` is currently `w-64` wide with a logo wordmark, "Menu Utama" section label, and horizontal icon+text nav items — more like a panel sidebar than Canva's icon rail. It lives in `src/components/DashboardPage/` which makes it inaccessible to future protected pages (EditorPage, OutlinePage). See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Create `src/components/layout/AppSidebar.jsx` — ~72px wide, icon + label stacked vertically, centered, no wordmark.
- Canva aesthetic: dark background, each nav item is a pill/block showing just the icon above and a short label below it, the currently active item has a distinct filled highlight.
- Avatar at the very bottom with popover (Pengaturan, Keluar) — same behavior as current sidebar.
- Update `DashboardPage/index.jsx` to import `AppSidebar` from the layout layer.
- Delete `DashboardSidebar.jsx`.

**Non-Goals:**
- Collapsible or hover-to-expand behavior (keep it always-icon-rail for now).
- Mobile drawer/hamburger version (desktop-first, deferred).

## Decisions

### 1. Icon-rail width and item layout
- **Decision**: `w-[72px]` fixed column. Each nav item is a `<Link>` rendered as a flex column (`flex-col items-center`) with icon on top (`w-5 h-5`) and label text below (`text-[10px]`).
- **Rationale**: Exactly matches Canva's pattern — narrow rail so the main content gets maximum real estate. Text label stays below the icon for discoverability without a tooltip.
- **Active state**: Semi-transparent rounded rectangle behind the entire icon+label block (e.g., `bg-slate-700/60 rounded-xl`), similar to Canva's filled pill.

### 2. No "Create" button at top (Canva has one)
- **Decision**: We omit the large purple "Create" button from Canva. The `+ Buat Presentasi Baru` CTA already lives in the Dashboard header.
- **Rationale**: Keeps sidebar minimal. The header CTA is already prominent.

### 3. Component location: `src/components/layout/`
- **Decision**: Place `AppSidebar.jsx` alongside `Navbar.jsx` and `Footer.jsx` in the existing `layout/` directory.
- **Rationale**: Consistent with current project convention — shared layout shells go in `layout/`, page-specific subcomponents go in their named folder.

### 4. Popover implementation (no new library)
- **Decision**: Keep the existing `useState` + click-outside `useEffect` pattern from `DashboardSidebar`. The popover floats above the avatar anchored left, using absolute positioning.
- **Rationale**: No new dependencies, keeps it consistent with existing patterns.

## Risks / Trade-offs

- **[Risk]** Narrow sidebar at 72px may feel cramped on smaller laptops.
  → **Mitigation**: Defer responsive collapse to a later task; the spec explicitly excludes it now.
- **[Risk]** Deleting `DashboardSidebar.jsx` before the new component is wired will break the dev server.
  → **Mitigation**: Create `AppSidebar.jsx` and update `DashboardPage/index.jsx` before deleting the old file.

## Migration Plan

1. Create `src/components/layout/AppSidebar.jsx`.
2. Update `src/pages/DashboardPage/index.jsx` import.
3. Delete `src/components/DashboardPage/DashboardSidebar.jsx`.
4. Build to verify zero errors.
