## Context

The backend's canonical `renderPptx` defines a 10 × 5.625 inch design: Arial type, light content slides, brand header/heading helpers, and an intentionally simple cover. The frontend renderer currently uses a separate dark 960 × 540 design. The backend contract limits input content by field.

## Goals / Non-Goals

**Goals:**

- Translate backend inches to the existing 960 × 540 editor basis (96 px per inch) and reproduce its six layouts.
- Remove all empty image placeholders; only render an image region when `imageUrl` is present.
- Apply the shared field limits at every editable control.
- Improve only desktop Dashboard sidebar profile placement.

**Non-Goals:**

- Change backend `renderPptx`, its image placeholder behaviour, or API schema.
- Alter Dashboard mobile presentation.

## Decisions

- Treat backend constants and coordinates as canonical. The frontend will translate the layout instead of inventing a separate theme.
- Use `Arial, sans-serif` and equivalent light panel/panel-border tokens across editor canvas, thumbnails, and hidden export canvas.
- Omit image containers rather than rendering outlines when `imageUrl` is missing. This differs from the present backend empty-image fallback by explicit product decision.
- Reuse existing inline field counters and add any missing schema-governed field input without changing stored payload names.
- Use responsive CSS to position the Dashboard profile at the desktop sidebar bottom while preserving its current mobile DOM presentation.

## Risks / Trade-offs

- [The backend still shows an empty-image outline] → Editor intentionally omits it as requested; backend needs a later small change for exact empty-state parity.
- [Coordinate translation drifts] → Use a single 96 px/in conversion and visual regression screenshots for all six layouts.
- [Remote images fail to load] → Omit the image area rather than reserve an empty placeholder.
