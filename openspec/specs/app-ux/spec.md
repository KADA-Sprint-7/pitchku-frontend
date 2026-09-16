# app-ux Specification

## Purpose
TBD - created by archiving change fix-pitchku-fixes-and-improvements. Update Purpose after archive.
## Requirements
### Requirement: FAQ Page Scroll Reset
The system SHALL reset the browser scroll position to the top of the window (`window.scrollTo(0, 0)`) whenever the user navigates to the FAQ page (`/faq`).

#### Scenario: Navigating to FAQ page
- **WHEN** user clicks on the FAQ link from landing page or navbar
- **THEN** the browser view MUST automatically scroll to top (coordinate Y=0)

### Requirement: Auth Session Auto-Redirect
The system SHALL check for an active Supabase authentication session and automatically redirect authenticated users away from `/login` and `/register` to `/dashboard`.

#### Scenario: Accessing login page while logged in
- **WHEN** an authenticated user with an active session accesses `/login` or `/register`
- **THEN** the system MUST redirect the user to `/dashboard`

### Requirement: Company Basic Info Across All Templates
The system SHALL collect basic business info (company name, year founded, industry) and incorporate this info across slide content generators for all presentation templates.

#### Scenario: Business context setup
- **WHEN** user fills in the business context form for any selected template
- **THEN** company name, year founded, and industry MUST be preserved and injected into slide headers and mock content payload

### Requirement: Report Period Date Range Picker
The system SHALL provide a date range input (Start Date to End Date) instead of a static dropdown for the `reportPeriod` field in the Laporan Ringkas template.

#### Scenario: Specifying report period
- **WHEN** user configures Laporan Ringkas business context
- **THEN** user can select a start date and end date to define the exact report period

### Requirement: Draft Auto-Save and Recovery
The system SHALL automatically create and persist a draft project in local storage when a template is selected or modified in the Wizard, and navigate incomplete drafts back to the Wizard upon opening.

#### Scenario: Auto-saving draft
- **WHEN** user selects a template or inputs context in `/new`
- **THEN** system MUST create or update a draft project record in `projectStore` with default title `"Presentasi Tanpa Judul"` if empty

#### Scenario: Opening incomplete draft
- **WHEN** user opens a draft project from Dashboard that has incomplete slide payload
- **THEN** system MUST navigate the user to `/new` with step state intact instead of breaking

