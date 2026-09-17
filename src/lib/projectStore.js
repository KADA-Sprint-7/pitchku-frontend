// Client-side local draft storage for pitch deck projects (simulates database & Supabase cache)
import { generateMockOutline } from './mockOutlineGenerator';
import { syncProjectToBackendApi } from './aiService';

const STORAGE_KEY = 'pitchku_projects_db';

function getAllProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllProjects(projects, activeProjectId = null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    if (activeProjectId && projects[activeProjectId]) {
      syncProjectToBackendApi(projects[activeProjectId]);
    }
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const projectStore = {
  // Ambil semua proyek lokal dalam bentuk array
  getAllProjectsList: () => {
    const all = getAllProjects();
    return Object.values(all).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  },

  // Buat proyek draf baru dari alur Wizard
  createProjectDraft: ({
    template = 'company_profile',
    structuredData = {},
    rawContext = '',
    brandKit = {
      primaryColor: '#0F4C81',
      accentColor: '#F2A007',
      fontFamily: 'Inter',
    },
  }) => {
    const id = generateUUID();
    const outlines = generateMockOutline(template, structuredData, rawContext);

    const project = {
      id,
      title:
        structuredData.companyName ||
        structuredData.productName ||
        'Presentasi Tanpa Judul',
      template,
      structuredData,
      rawContext,
      brandKit,
      outlines,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = getAllProjects();
    all[id] = project;
    saveAllProjects(all, id);

    return project;
  },

  // Simpan/update data proyek langsung ke local storage tanpa sync ulang ke backend (digunakan saat load dari backend API)
  saveProjectDirect: (project) => {
    if (!project || !project.id) return;
    const all = getAllProjects();
    all[project.id] = { ...(all[project.id] || {}), ...project };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  },

  // Ambil draf proyek berdasarkan ID (dengan optional fallback jika direct link dibuka)
  getProject: (projectId, createFallbackIfMissing = true) => {
    const all = getAllProjects();
    if (all[projectId]) {
      return all[projectId];
    }

    if (!createFallbackIfMissing) {
      return null;
    }

    // Fallback default draft untuk kemudahan preview/testing
    const fallbackTemplate = 'company_profile';
    const fallbackOutlines = generateMockOutline(fallbackTemplate, {
      companyName: 'Kopi Nusantara Roastery',
    });

    const fallbackProject = {
      id: projectId,
      title: 'Kopi Nusantara Roastery',
      template: fallbackTemplate,
      structuredData: {
        companyName: 'Kopi Nusantara Roastery',
        industry: 'F&B Specialty Coffee',
        yearFounded: '2020',
        teamSize: '15',
      },
      rawContext:
        'Kopi Nusantara Roastery berfokus pada roasting biji kopi single-origin lereng Bromo dengan standar ekspor dan kemitraan kafe premium.',
      brandKit: {
        logoUrl: null,
        primaryColor: '#0F4C81',
        accentColor: '#F2A007',
        fontFamily: 'Inter',
      },
      outlines: fallbackOutlines,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all[projectId] = fallbackProject;
    saveAllProjects(all);
    return fallbackProject;
  },

  // Update draf outline
  updateOutline: (projectId, outlines) => {
    const all = getAllProjects();
    if (all[projectId]) {
      all[projectId].outlines = outlines;
      all[projectId].updatedAt = new Date().toISOString();
      saveAllProjects(all, projectId);
      return all[projectId];
    }
    return null;
  },

  // Update data input konteks dan brand kit
  updateProjectData: (projectId, { template, structuredData, rawContext, brandKit }) => {
    const all = getAllProjects();
    if (all[projectId]) {
      const existingLogo = all[projectId].brandKit?.logoUrl || all[projectId].deckPayload?.brandKit?.logoUrl;
      const updatedBrandKit = {
        ...(brandKit || {}),
        logoUrl: brandKit?.logoUrl || existingLogo || null,
      };

      all[projectId].template = template;
      all[projectId].structuredData = structuredData;
      all[projectId].rawContext = rawContext;
      all[projectId].brandKit = updatedBrandKit;

      if (all[projectId].deckPayload) {
        all[projectId].deckPayload.brandKit = {
          ...(all[projectId].deckPayload.brandKit || {}),
          ...updatedBrandKit,
        };
      }

      if (structuredData?.companyName || structuredData?.productName) {
        all[projectId].title = structuredData.companyName || structuredData.productName;
      }
      all[projectId].updatedAt = new Date().toISOString();
      saveAllProjects(all, projectId);
      return all[projectId];
    }
    return null;
  },

  // Simpan final outline dan update status
  saveConfirmedOutline: (projectId, confirmedOutline) => {
    const all = getAllProjects();
    if (all[projectId]) {
      all[projectId].outlines = confirmedOutline;
      all[projectId].status = 'outline_confirmed';
      all[projectId].updatedAt = new Date().toISOString();
      saveAllProjects(all, projectId);
      return all[projectId];
    }
    return null;
  },

  // Simpan payload deck lengkap (PitchKuDeckPayload) ke store
  saveDeckPayload: (projectId, deckPayload) => {
    const all = getAllProjects();
    if (all[projectId]) {
      // Synchronize brandKit logoUrl bi-directionally so logo is never lost
      const projectLogo = all[projectId].brandKit?.logoUrl;
      const payloadLogo = deckPayload?.brandKit?.logoUrl;
      const finalLogoUrl = payloadLogo || projectLogo || null;

      const mergedPayload = { ...deckPayload };
      if (deckPayload?.brandKit || finalLogoUrl) {
        mergedPayload.brandKit = {
          ...(deckPayload?.brandKit || {}),
          logoUrl: finalLogoUrl,
        };
      }

      all[projectId].deckPayload = mergedPayload;

      if (finalLogoUrl || deckPayload?.brandKit) {
        all[projectId].brandKit = {
          ...(all[projectId].brandKit || {}),
          ...(deckPayload?.brandKit || {}),
          logoUrl: finalLogoUrl,
        };
      }

      if (deckPayload?.businessName && deckPayload.businessName !== 'Presentasi Tanpa Judul') {
        all[projectId].title = deckPayload.businessName;
      } else if (all[projectId].structuredData?.companyName || all[projectId].structuredData?.productName) {
        all[projectId].title = all[projectId].structuredData.companyName || all[projectId].structuredData.productName;
      }
      // Jangan reset status jika sudah 'selesai'
      if (all[projectId].status !== 'selesai') {
        all[projectId].status = 'draft';
      }
      all[projectId].updatedAt = new Date().toISOString();
      saveAllProjects(all, projectId);
      return all[projectId];
    }
    return null;
  },

  // Update status proyek (e.g. 'draft' | 'selesai')
  updateProjectStatus: (projectId, status) => {
    const all = getAllProjects();
    if (all[projectId]) {
      all[projectId].status = status;
      all[projectId].updatedAt = new Date().toISOString();
      saveAllProjects(all, projectId);
      return all[projectId];
    }
    return null;
  },

  // Baca payload deck dari store
  getDeckPayload: (projectId) => {
    const all = getAllProjects();
    return all[projectId]?.deckPayload || null;
  },

  // Update satu slide di dalam deckPayload berdasarkan slideIndex
  updateSlide: (projectId, slideIndex, updatedSlide) => {
    const all = getAllProjects();
    if (all[projectId]?.deckPayload) {
      const slides = [...all[projectId].deckPayload.slides];
      slides[slideIndex] = { ...slides[slideIndex], ...updatedSlide };
      all[projectId].deckPayload = { ...all[projectId].deckPayload, slides };
      all[projectId].updatedAt = new Date().toISOString();
      saveAllProjects(all, projectId);
      return all[projectId].deckPayload;
    }
    return null;
  },

  // Update judul deck (deckTitle rename inline)
  updateDeckTitle: (projectId, newTitle) => {
    const all = getAllProjects();
    if (all[projectId]) {
      all[projectId].title = newTitle;
      if (all[projectId].deckPayload) {
        // deckPayload tidak menyimpan title terpisah; title tetap ada di project root
      }
      all[projectId].updatedAt = new Date().toISOString();
      saveAllProjects(all, projectId);
      return all[projectId];
    }
    return null;
  },

  // Hapus proyek dari local store
  deleteProject: (projectId) => {
    const all = getAllProjects();
    if (all[projectId]) {
      delete all[projectId];
      saveAllProjects(all);
      return true;
    }
    return false;
  },
};
