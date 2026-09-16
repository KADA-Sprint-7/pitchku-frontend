## MODIFIED Requirements

### Requirement: Project Export & Auto-Save
The system SHALL support native PowerPoint (.pptx) export via an editable PptxGenJS presentation, high-resolution 16:9 PDF export, and auto-saving snapshot JSON to Supabase (`deck_versions`). The PPTX export SHALL use the same canonical layout definitions, brand colors, header/footer structure, and slide image composition as the editor canvas.

#### Scenario: User exports to PPTX or PDF
- **WHEN** user chooses PPTX or PDF in the export dialog and clicks download
- **THEN** system triggers presentation file generation with zero visual overflow and native editable elements.

#### Scenario: User exports a cover with a slide image
- **WHEN** a title-slide canvas displays a persisted slide image
- **THEN** the downloaded PPTX cover SHALL place that image in the same right-side cover region as the editor.

#### Scenario: User exports branded slides
- **WHEN** a deck has brand-kit primary and accent colors
- **THEN** the PPTX SHALL apply those colors to the same canonical slide elements rendered in the editor.
