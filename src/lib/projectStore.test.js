import { describe, it, expect, beforeEach } from 'vitest';
import { projectStore } from '@/lib/projectStore';

describe('projectStore Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('harus membuat draf proyek baru dengan judul fallback "Presentasi Tanpa Judul"', () => {
    const project = projectStore.createProjectDraft({
      template: 'company_profile',
      structuredData: {},
      rawContext: '',
    });

    expect(project).toBeDefined();
    expect(project.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(project.title).toBe('Presentasi Tanpa Judul');
    expect(project.template).toBe('company_profile');
    expect(project.status).toBe('draft');
  });

  it('harus membuat draf proyek dengan judul dari companyName jika diisi', () => {
    const project = projectStore.createProjectDraft({
      template: 'company_profile',
      structuredData: { companyName: 'Kopi Nusantara' },
      rawContext: 'Konteks usaha kopi',
    });

    expect(project.title).toBe('Kopi Nusantara');
  });

  it('harus memperbarui judul proyek di updateProjectData jika companyName diisi', () => {
    const project = projectStore.createProjectDraft({
      template: 'penawaran_produk',
      structuredData: {},
      rawContext: '',
    });

    expect(project.title).toBe('Presentasi Tanpa Judul');

    const updated = projectStore.updateProjectData(project.id, {
      template: 'penawaran_produk',
      structuredData: { companyName: 'CV Maju Bersama', industry: 'F&B' },
      rawContext: 'Detail produk',
      brandKit: project.brandKit,
    });

    expect(updated.title).toBe('CV Maju Bersama');
    expect(updated.structuredData.companyName).toBe('CV Maju Bersama');
  });

  it('harus memperbarui judul proyek di saveDeckPayload jika deckPayload membawa businessName', () => {
    const project = projectStore.createProjectDraft({
      template: 'laporan_ringkas',
      structuredData: {},
      rawContext: '',
    });

    const mockPayload = {
      deckId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      businessName: 'PT Sukses Mandiri',
      slides: [{ slideNumber: 1, layout: 'title_slide', title: 'Judul Slide' }],
    };

    const saved = projectStore.saveDeckPayload(project.id, mockPayload);
    expect(saved.title).toBe('PT Sukses Mandiri');
    expect(saved.deckPayload).toEqual(mockPayload);
  });
});
