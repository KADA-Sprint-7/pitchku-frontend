## MODIFIED Requirements

### Requirement: Project Export & Auto-Save
The system SHALL support native PowerPoint (.pptx) export via `pptxgenjs` backend, high-resolution 16:9 PDF export, and auto-saving snapshot JSON to Supabase (`deck_versions`). Every frontend project SHALL have a canonical UUID, and the editor SHALL preserve that same UUID as `deckPayload.deckId` for autosave and PPTX export. The system MUST NOT substitute a shared or sample UUID when the deck identity is invalid.

#### Scenario: User exports to PPTX or PDF
- **WHEN** user chooses PPTX or PDF in the export dialog and clicks download
- **THEN** system triggers presentation file generation with zero visual overflow and native editable elements.

#### Scenario: PPTX export uses the editor deck identity
- **WHEN** the user exports an editor deck whose `deckPayload.deckId` is a valid UUID
- **THEN** the request to `POST /api/export/pptx` contains that exact UUID as `deckId`.

#### Scenario: PPTX export has no valid deck identity
- **WHEN** the user exports a deck whose `deckPayload.deckId` is absent or not a UUID
- **THEN** the frontend MUST stop the PPTX export and show an error without sending a request with a substitute deck ID.
