// Client-side local draft storage for pitch deck projects (simulates database & Supabase cache)
import { generateMockOutline } from './mockOutlineGenerator';

const STORAGE_KEY = 'pitchku_projects_db';

function getAllProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
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
    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
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
    saveAllProjects(all);

    return project;
  },

  // Ambil draf proyek berdasarkan ID (dengan fallback jika direct link dibuka)
  getProject: (projectId) => {
    const all = getAllProjects();
    if (all[projectId]) {
      return all[projectId];
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
      saveAllProjects(all);
      return all[projectId];
    }
    return null;
  },

  // Update data input konteks dan brand kit
  updateProjectData: (projectId, { template, structuredData, rawContext, brandKit }) => {
    const all = getAllProjects();
    if (all[projectId]) {
      all[projectId].template = template;
      all[projectId].structuredData = structuredData;
      all[projectId].rawContext = rawContext;
      all[projectId].brandKit = brandKit;
      if (structuredData?.companyName || structuredData?.productName) {
        all[projectId].title = structuredData.companyName || structuredData.productName;
      }
      all[projectId].updatedAt = new Date().toISOString();
      saveAllProjects(all);
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
      saveAllProjects(all);
      return all[projectId];
    }
    return null;
  },

  // Simpan payload deck lengkap (PitchKuDeckPayload) ke store
  saveDeckPayload: (projectId, deckPayload) => {
    const all = getAllProjects();
    if (all[projectId]) {
      all[projectId].deckPayload = deckPayload;
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
      saveAllProjects(all);
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
      saveAllProjects(all);
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
      saveAllProjects(all);
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
      saveAllProjects(all);
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
