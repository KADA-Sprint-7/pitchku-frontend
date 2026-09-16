## Why

Frontend draft identifiers can differ from the UUID format required by the backend export contract. When an invalid identifier is replaced with a shared placeholder during export, the downloaded presentation can be associated with the wrong deck instead of the one open in the editor.

## What Changes

- Generate and preserve a canonical UUID for every frontend project/deck.
- Send that exact UUID as `deckId` to project persistence and PPTX export.
- Remove use of the shared placeholder UUID as an export identity; reject an export that has no valid deck UUID rather than exporting another deck.

## Capabilities

### New Capabilities

### Modified Capabilities

- `slide-editor`: Project export and editor loading will preserve a valid, matching deck identity across the frontend and backend API boundary.

## Impact

- Affects frontend project draft creation, deck payload generation, and sanitisation for `POST /api/export/pptx`.
- No backend API schema change is required; the existing UUID `deckId` contract is used consistently.
