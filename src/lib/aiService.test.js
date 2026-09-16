import { describe, expect, it } from 'vitest';
import { sanitizeDeckPayload } from './aiService';

const validDeckId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

describe('PPTX export payload', () => {
  it('preserves the UUID belonging to the editor deck', () => {
    const payload = sanitizeDeckPayload({
      deckId: validDeckId,
      template: 'company_profile',
      businessName: 'Kopi Nusantara',
      slides: [],
    });

    expect(payload.deckId).toBe(validDeckId);
  });

  it('rejects a legacy non-UUID deck ID instead of substituting a sample ID', () => {
    expect(() => sanitizeDeckPayload({ deckId: 'proj_1234', slides: [] }))
      .toThrow('ID deck tidak valid');
  });
});
