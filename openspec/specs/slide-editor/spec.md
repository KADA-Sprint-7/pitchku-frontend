# slide-editor Specification

## Purpose
TBD - created by archiving change create-slide-editor. Update Purpose after archive.
## Requirements
### Requirement: Slide Editor Navigation & Canvas 16:9 Rendering
The system SHALL provide a full-screen interactive slide editor at `/editor/:projectId` rendering slides on a widescreen 16:9 ratio (basis 1920x1080) with automatic Brand Kit primary/accent colors applied to titles, shapes, and cards, and automatic logo placement on non-cover slides.

#### Scenario: User opens editor from outline confirmation
- **WHEN** user clicks "Lanjut: Buat Isi Slide & Masuk Editor" on `/outline/:projectId`
- **THEN** system redirects to `/editor/:projectId`, loads the project payload (`PitchKuDeckPayload`), sets the active slide to the first slide (index 0), renders the 16:9 canvas with Brand Kit primary/accent colors, and positions the business logo on non-cover slides.

---

### Requirement: Direct In-Place Text Editing & Real-Time Character Counter
The system SHALL allow users to directly click and edit text elements on the slide canvas with real-time character counters adhering to Anti-Overflow constraints.

#### Scenario: User edits slide title or subtitle
- **WHEN** user types in title (max 60 chars) or subtitle (max 120 chars) field
- **THEN** system displays live character count (e.g., "45/60") and prevents text input exceeding the maximum character limit.

#### Scenario: User edits bullets or cards
- **WHEN** user edits bullet points (max 5 items, max 90 chars each) or card descriptions (max 4 cards, max 80 chars each)
- **THEN** system updates the payload item instantly while showing character counts per editable field.

---

### Requirement: Left Sidebar Thumbnail Rail & Slide Management
The system SHALL display the slide thumbnails on the left side of the editor layout with capabilities for switching active slide, reordering slides via drag-and-drop or up/down arrow buttons, adding new slides, and deleting slides with a confirmation step.

#### Scenario: User reorders slide using up/down buttons
- **WHEN** user clicks the "Move Up" or "Move Down" arrow button on a slide thumbnail in the left sidebar rail
- **THEN** system swaps the position of the slide with its neighboring slide in the deck payload and preserves the active slide context.

#### Scenario: User adds or deletes slide
- **WHEN** user clicks "Tambah Slide" or clicks delete on a thumbnail
- **THEN** system appends a new canonical slide or opens a confirmation dialog before removing the slide from the payload.

---

### Requirement: Media & Image Management Modal
The system SHALL allow users to click any image placeholder on a slide canvas to open a Media Picker modal supporting royalty-free stock image search (Unsplash/Pexels) by keywords and local product image upload.

#### Scenario: User selects a stock image
- **WHEN** user searches for a keyword in the Media Picker modal and selects an image
- **THEN** system updates `slide.imageUrl` with the selected image URL and updates the canvas immediately.

---

### Requirement: Project Export & Auto-Save
The system SHALL support native PowerPoint (.pptx) export via `pptxgenjs` backend, high-resolution 16:9 PDF export, and auto-saving snapshot JSON to Supabase (`deck_versions`).

#### Scenario: User exports to PPTX or PDF
- **WHEN** user chooses PPTX or PDF in the export dialog and clicks download
- **THEN** system triggers presentation file generation with zero visual overflow and native editable elements.

