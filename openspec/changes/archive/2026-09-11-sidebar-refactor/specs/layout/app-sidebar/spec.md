## Purpose

Provides a minimalist Canva-style narrow icon-rail sidebar for all protected app pages, displaying icon and label stacked vertically, no logo wordmark, with a bottom avatar popover for user actions. Lives in the shared layout layer so every protected view can reuse it.

## ADDED Requirements

### Requirement: Narrow Icon-Rail Sidebar Shape
The sidebar SHALL render as a fixed narrow column (approximately 72px wide) visible on all protected app pages, stacked vertically with no horizontal brand wordmark or logo text.

#### Scenario: Sidebar is Icon-Rail Width
- **WHEN** any protected page renders
- **THEN** the sidebar SHALL display only icons with their labels stacked directly below each icon, not in a horizontal row with text beside the icon
- **THEN** the sidebar SHALL NOT display the PitchKu wordmark or any branding text

### Requirement: Navigation Items Icon + Label Stack
The sidebar SHALL display navigation items as icon and label stacked vertically, centered, with active state highlighting only the icon+label block.

#### Scenario: Active Navigation Item
- **WHEN** a navigation item's route matches the current URL
- **THEN** the icon+label block SHALL be visually highlighted (e.g., contrasting background pill or indicator)
- **THEN** clicking a nav item SHALL navigate to its associated route

#### Scenario: Inactive Navigation Item Hover
- **WHEN** user hovers an inactive navigation item
- **THEN** the icon+label block SHALL show a subtle hover state without a full-width bar highlight

### Requirement: Bottom User Avatar Popover
The sidebar SHALL render a user avatar at the very bottom of the rail that triggers a floating popover containing Pengaturan and Keluar actions.

#### Scenario: Opening the Avatar Popover
- **WHEN** user clicks the avatar at the bottom of the sidebar
- **THEN** a popover SHALL appear floating above the avatar with "Pengaturan" and "Keluar" menu items
- **WHEN** user clicks anywhere outside the popover
- **THEN** the popover SHALL close

#### Scenario: Logout via Avatar Popover
- **WHEN** user clicks "Keluar" in the avatar popover
- **THEN** the system SHALL navigate the user to `/login`

## MODIFIED Requirements

### Requirement: Canva-Style Navigation Sidebar
The system SHALL display a persistent narrow icon-rail sidebar on all protected pages. The sidebar SHALL reside in the shared layout component layer (`src/components/layout/`) so it can be reused across Dashboard, Editor, and Outline pages without duplication. The sidebar SHALL NOT display a branding wordmark or logo text — navigation items SHALL be icon + label stacked vertically in a narrow column, matching the Canva icon-rail aesthetic.

#### Scenario: Navigating to Projects and Templates
- **WHEN** user clicks the "Proyek" navigation item
- **THEN** system SHALL maintain the active project dashboard view
- **WHEN** user clicks the "Templat" navigation item
- **THEN** system SHALL route the user to the presentation creation wizard at `/new`

#### Scenario: Accessing Profile Options
- **WHEN** user clicks the profile avatar at the bottom of the sidebar
- **THEN** system SHALL display a popover menu containing "Pengaturan" and "Keluar" options
- **WHEN** user clicks "Keluar"
- **THEN** system SHALL clear user session state and navigate to `/login`
