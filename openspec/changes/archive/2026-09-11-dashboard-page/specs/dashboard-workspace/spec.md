## Purpose

Provides a centralized dashboard workspace for Indonesian SME users to manage pitch deck projects, view resource usage, filter decks by status, and navigate between editor, wizard, and profile actions.

## ADDED Requirements

### Requirement: Canva-Style Navigation Sidebar
The system SHALL display a persistent left sidebar containing branding, navigation links, and a user profile avatar with contextual actions.

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

### Requirement: Workspace Summary Metrics
The system SHALL present exactly two primary metric cards reflecting workspace capacity and activity.

#### Scenario: Displaying Workspace Metrics
- **WHEN** the dashboard renders
- **THEN** the system SHALL display "Total Presentasi" indicating project count and month trend
- **THEN** the system SHALL display "Kuota Token AI" showing consumed vs total allocated words with a progress indicator
- **THEN** the system SHALL NOT render redundant storage or synchronization buttons

### Requirement: Project Status and Name Filtering
The system SHALL provide search and tab filters to narrow down displayed presentation projects.

#### Scenario: Filtering by Status Tab
- **WHEN** user clicks "Semua Proyek"
- **THEN** system displays all projects regardless of status
- **WHEN** user clicks "Selesai"
- **THEN** system displays only projects with status `selesai`
- **WHEN** user clicks "Draft"
- **THEN** system displays only projects with status `draft`

#### Scenario: Searching Projects by Query
- **WHEN** user types into the search input
- **THEN** system matches query against project title and business description in real time
- **THEN** system displays empty state if no matching projects are found

### Requirement: Presentation Card Details and Actions
The system SHALL display project cards with 16:9 preview container, metadata tags, and estimated AI cost.

#### Scenario: Viewing Project Details
- **WHEN** project cards are displayed
- **THEN** each card SHALL show slide count, aspect ratio badge (`Rasio 16:9`), template name, project title, summary snippet, and estimated AI cost in USD
- **THEN** completed projects SHALL show status badge `● Selesai` and action button "Buka Canvas →" linking to `/editor/:projectId`
- **THEN** draft projects SHALL show status badge `● Draft` and action button "Lanjutkan Draft →" linking to `/outline/:projectId`
