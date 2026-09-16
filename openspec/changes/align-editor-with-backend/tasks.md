## 1. Backend-aligned editor canvas

- [x] 1.1 Translate backend render constants and the title-slide layout into the frontend canvas and thumbnail renderer.
- [x] 1.2 Translate title-bullets, two-column, metrics-grid, card-grid, and closing layouts into the frontend renderer.
- [x] 1.3 Remove empty image regions and outlines while retaining image rendering for persisted `imageUrl` values.

## 2. Payload limits and dashboard desktop shell

- [x] 2.1 Enforce all backend schema text limits in editor fields, including editable image-query and missing-item controls where applicable.
- [x] 2.2 Move the Dashboard desktop sidebar avatar/profile section to the bottom without changing mobile presentation.

## 3. Verification

- [x] 3.1 Add or update layout and input-limit tests for the backend-aligned editor.
- [x] 3.2 Run relevant tests, lint/build checks, and visually compare all canonical editor layouts to the supplied backend renderer.
