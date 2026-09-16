## Context

The editor stores a project locally and passes its identity through `deckPayload.deckId` to project sync and PPTX export. The backend contract requires a UUID. Export sanitisation currently substitutes a fixed sample UUID when the value is invalid, which makes an invalid local identity indistinguishable from the sample deck.

## Goals / Non-Goals

**Goals:**

- Maintain one canonical UUID per project from draft creation through export.
- Prevent a PPTX request from being sent with a substituted or unrelated deck identity.
- Keep existing UUID-backed projects compatible.

**Non-Goals:**

- Migrate legacy persisted project IDs without a UUID.
- Change backend endpoints, storage URLs, or PPTX layout rendering.

## Decisions

- Use the browser UUID generator already used by the project store as the canonical project ID. It produces the backend-compatible RFC 4122 UUID representation and avoids a separate deck-ID mapping.
- Validate `deckId` at the export boundary and fail explicitly when it is not a UUID. This preserves data integrity; using a deterministic or sample fallback could export a different deck.
- Keep the payload shape unchanged. The backend receives the same `deckId` field, now guaranteed to refer to the editor's deck.

## Risks / Trade-offs

- [Legacy non-UUID projects cannot export] → Present an actionable error instead of silently exporting with a different identity; a separate migration can be planned if legacy data exists.
- [Browser UUID API unavailable] → Retain the existing UUID-compatible fallback generator in the project store.
