## Why

The backend PPTX renderer uses a visual template that does not match the canonical editor canvas. Users see a different cover structure, colors, and missing slide image after download, which undermines the editor preview.

## What Changes

- Route PPTX export through the existing frontend native renderer that mirrors the six editor layouts.
- Ensure all exportable slide images and brand assets are embedded or referenced by the native renderer.
- Preserve editable PowerPoint text and shapes while matching the editor's cover, headers, footer, colors, sizing, and layout composition.

## Capabilities

### New Capabilities

### Modified Capabilities

- `slide-editor`: PPTX export will reproduce the editor's canonical visual layouts rather than a separately-rendered backend template.

## Impact

- Affects `ExportPresentationModal.jsx`, its PPTX export tests, and the backend export path used by the UI.
- Does not require changing the backend API contract; the frontend will no longer rely on its renderer for visual fidelity.
