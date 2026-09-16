## MODIFIED Requirements

### Requirement: Slide Editor Navigation & Canvas 16:9 Rendering
The system SHALL provide a full-screen interactive slide editor at `/editor/:projectId` rendering slides on a widescreen 16:9 ratio using the backend PPTX renderer's canonical visual rules: Arial typography, the supplied Brand Kit primary/accent colors, a branded cover, and light content-slide panels and borders. The editor SHALL render a slide image region only when the slide has an `imageUrl`; it MUST NOT display an image placeholder or outline when no image exists.

#### Scenario: User opens editor from outline confirmation
- **WHEN** user clicks "Lanjut: Buat Isi Slide & Masuk Editor" on `/outline/:projectId`
- **THEN** system redirects to `/editor/:projectId`, loads the project payload (`PitchKuDeckPayload`), sets the active slide to the first slide (index 0), and renders the canonical backend-aligned 16:9 canvas.

#### Scenario: Slide has no image
- **WHEN** a title-bullets slide has no `imageUrl`
- **THEN** the editor MUST omit the image region and its outline while retaining the content layout.

### Requirement: Direct In-Place Text Editing & Real-Time Character Counter
The system SHALL allow users to directly click and edit text elements on the slide canvas with real-time character counters adhering to the backend payload constraints: title 60, subtitle 120, bullet 90 with at most 5 items, card header 30, card description 80 with at most 4 cards, image query 80, and missing-item text 120 with at most 4 items.

#### Scenario: User edits a schema-constrained field
- **WHEN** a user types in an editable slide field
- **THEN** the editor SHALL show the backend schema's matching maximum and prevent input exceeding it.
