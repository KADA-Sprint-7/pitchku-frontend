import { describe, it, expect } from 'vitest';
import { generateDeckPayload, mockContentForLayout } from './deckPayloadGenerator';

describe('deckPayloadGenerator Unit Tests', () => {
  it('harus menghasilkan mockContentForLayout dengan info dasar perusahaan di semua template', () => {
    const structuredData = {
      companyName: 'PT Kopi Sangker',
      industry: 'Roastery',
      yearFounded: '2020',
    };

    const content = mockContentForLayout('contact_closing', 'Hubungi Kami', structuredData, 'company_profile');
    
    expect(content.subtitle).toContain('PT Kopi Sangker');
    expect(content.cards).toBeDefined();
    const companyCard = content.cards.find(c => c.header === 'PT Kopi Sangker');
    expect(companyCard).toBeDefined();
    expect(companyCard.description).toContain('Roastery');
  });

  it('harus memproses periode laporan dari reportStartDate dan reportEndDate pada template laporan_ringkas', () => {
    const structuredData = {
      companyName: 'Kedai Berkah',
      reportStartDate: '2026-01-01',
      reportEndDate: '2026-06-30',
    };

    const content = mockContentForLayout('title_slide', 'Laporan Kinerja', structuredData, 'laporan_ringkas');
    expect(content.subtitle).toContain('1 Januari 2026 s.d. 30 Juni 2026');
  });

  it('harus menghasilkan generateDeckPayload dari outline yang diberikan', () => {
    const project = {
      id: 'proj_123',
      title: 'Toko Segar',
      template: 'penawaran_produk',
      structuredData: { companyName: 'Toko Segar' },
    };

    const outline = [
      { id: 's1', layoutType: 'title_slide', title: 'Hero Cover' },
      { id: 's2', layoutType: 'contact_closing', title: 'Penutup' },
    ];

    const payload = generateDeckPayload(project, outline);

    expect(payload).toBeDefined();
    expect(payload.businessName).toBe('Toko Segar');
    expect(payload.slides).toHaveLength(2);
    expect(payload.slides[0].layout).toBe('title_slide');
    expect(payload.slides[1].layout).toBe('contact_closing');
  });
});
