## Why

The web editor presents a dark visual system while the production backend renderer produces a light, brand-coloured native PPTX. The preview must match the downloaded file so users can trust the editor.

## What Changes

- Rebuild the six frontend editor layouts to mirror the backend `renderPptx` geometry, palette, Arial typography, and component hierarchy.
- Remove every image placeholder/outline from the editor when a slide has no `imageUrl`.
- Enforce backend schema limits in all editable frontend fields, including an 80-character `imageQuery` field.
- Reposition the desktop Dashboard sidebar profile/avatar to its bottom without changing the mobile layout.

## Capabilities

### New Capabilities

### Modified Capabilities

- `slide-editor`: Editor preview, image-empty state, and input validation will match the backend PPTX contract.

## Impact

- Affects SlideCanvas, SlideLayoutRenderer, thumbnails/export canvas, Dashboard sidebar styling, and frontend tests.
- Backend API and PPTX renderer remain unchanged.
