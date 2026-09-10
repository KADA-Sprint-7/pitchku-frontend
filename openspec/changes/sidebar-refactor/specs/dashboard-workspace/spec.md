## MODIFIED Requirements

### Requirement: Canva-Style Navigation Sidebar
The dashboard workspace SHALL use the shared `AppSidebar` component from `src/components/layout/` rather than a page-specific sidebar component. The sidebar displayed on the dashboard SHALL conform to the narrow icon-rail design defined by `layout/app-sidebar`.

#### Scenario: Dashboard Renders with Shared Sidebar
- **WHEN** user visits `/dashboard`
- **THEN** the layout SHALL render the shared `AppSidebar` on the left
- **THEN** the main content area SHALL occupy the remaining width beside the sidebar

#### Scenario: Sidebar Navigation Active State on Dashboard
- **WHEN** the current path is `/dashboard`
- **THEN** the "Proyek" navigation item in `AppSidebar` SHALL be in active/highlighted state
