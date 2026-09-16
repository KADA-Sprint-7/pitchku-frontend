## Context

The editor and the bundled PptxGenJS builder already share six canonical layouts, but the active PPTX action calls the backend endpoint exclusively. The endpoint applies a separate template, so its result cannot be visually identical to the editor.

## Goals / Non-Goals

**Goals:**

- Make the downloadable PPTX use the editor-aligned PptxGenJS layout builder.
- Carry remote Supabase Storage image and logo URLs into the generated PPTX.
- Keep text and shapes editable.

**Non-Goals:**

- Pixel-for-pixel rasterisation of the web canvas.
- Changing the backend endpoint or PDF export.

## Decisions

- Use the existing frontend PptxGenJS builder as the PPTX export path because it already maps the six canonical layouts and supports images, brand colors, and editable objects.
- Pre-resolve external image URLs to data URLs where needed so PPTX generation does not depend on PowerPoint downloading remote assets.
- Preserve the backend endpoint as a separate capability, but do not use it for the editor's visually faithful download.

## Risks / Trade-offs

- [Remote image cannot be fetched due to CORS or expiry] → show a clear export error or omit only that asset with a warning.
- [Frontend generation is slower for large decks] → retain loading feedback and process assets once per slide.
