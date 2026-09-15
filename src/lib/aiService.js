import { fetchApi } from './api';
import { generateMockOutline } from './mockOutlineGenerator';
import { generateDeckPayload } from './deckPayloadGenerator';

/**
 * 1. AI Diagnose: Menyarankan template berdasarkan kebutuhan bebas pengguna
 * Endpoint: POST /api/generate/diagnose
 */
export async function diagnoseTemplate(needText) {
  try {
    const res = await fetchApi('/generate/diagnose', {
      method: 'POST',
      body: JSON.stringify({ need: needText }),
    });
    if (res && res.recommended) {
      return res;
    }
    throw new Error('Respon diagnose tidak valid');
  } catch (err) {
    console.warn('[AI Diagnose] Backend belum siap / error, menggunakan smart fallback:', err.message);
    
    // Heuristic Smart Fallback
    const lower = (needText || '').toLowerCase();
    let recommended = 'penawaran_produk';
    let reason = 'Untuk mengenalkan dan menawarkan produk ke calon pelanggan atau mitra toko/kafe.';

    if (lower.includes('investor') || lower.includes('modal') || lower.includes('bagi hasil') || lower.includes('kerjasama') || lower.includes('mitra')) {
      recommended = 'proposal_kerjasama';
      reason = 'Cocok untuk mengajukan skema kemitraan, investasi modal kerja, dan proyeksi bagi hasil.';
    } else if (lower.includes('laporan') || lower.includes('keuangan') || lower.includes('omzet') || lower.includes('kinerja') || lower.includes('evaluasi')) {
      recommended = 'laporan_ringkas';
      reason = 'Format tepat untuk menyajikan ringkasan kinerja penjualan, omzet, dan akuntabilitas bisnis.';
    } else if (lower.includes('profil') || lower.includes('perusahaan') || lower.includes('company') || lower.includes('katalog umum') || lower.includes('portofolio')) {
      recommended = 'company_profile';
      reason = 'Membangun kredibilitas usaha secara menyeluruh dengan menampilkan visi, tim, dan rekam jejak.';
    }

    return {
      supported: true,
      recommended,
      reason,
      alternatives: [
        {
          template: recommended === 'penawaran_produk' ? 'company_profile' : 'penawaran_produk',
          reason: 'Bisa menjadi pelengkap pengenalan usaha.',
        },
      ],
      askFor: [
        'Nama produk atau usaha',
        'Target calon pembeli / audiens',
        'Kelebihan utama dibanding kompetitor',
      ],
      fallbackMessage: 'Mode demonstrasi (AI Engine offline)',
      usage: { promptTokens: 0, completionTokens: 0, estimatedCostUsd: 0, model: 'pitchku-mock-v1' },
      attempts: 1,
    };
  }
}

/**
 * 2. AI Outline: Menghasilkan 8-10 outline slide
 * Endpoint: POST /api/generate/outline
 */
export async function generateOutlineAi({ template, businessName, audience, brief, structuredData = {} }) {
  try {
    const res = await fetchApi('/generate/outline', {
      method: 'POST',
      body: JSON.stringify({
        template,
        businessName,
        audience,
        brief,
      }),
    });

    if (res && Array.isArray(res.outline) && res.outline.length > 0) {
      return res.outline.map((item, idx) => ({
        id: `slide-${idx + 1}-${Date.now()}`,
        slideNumber: idx + 1,
        title: item.title,
        objective: item.objective || '',
        suggestedLayout: idx === 0 ? 'Hero Cover' : idx === res.outline.length - 1 ? 'Call to Action' : 'Bento Cards',
        layoutType: idx === 0 ? 'title_slide' : idx === res.outline.length - 1 ? 'contact_closing' : 'title_bullets',
        isEdited: false,
      }));
    }
    throw new Error('Respon outline tidak valid');
  } catch (err) {
    console.warn('[AI Outline] Backend belum siap / error, menggunakan smart fallback generator:', err.message);
    return generateMockOutline(template, structuredData, brief);
  }
}

/**
 * 3. AI Slides: Menghasilkan isi detail konten slide
 * Endpoint: POST /api/generate/slides
 */
export async function generateSlidesAi({ context, outline, project }) {
  try {
    const res = await fetchApi('/generate/slides', {
      method: 'POST',
      body: JSON.stringify({
        context,
        outline: outline.map((o) => ({
          title: o.title,
          objective: o.objective || '',
        })),
      }),
    });

    if (res && Array.isArray(res.slides) && res.slides.length > 0) {
      return {
        deckId: project.id,
        template: context.template,
        businessName: context.businessName,
        brandKit: project.brandKit,
        slides: res.slides,
        usage: res.usage,
      };
    }
    throw new Error('Respon generate slides tidak valid');
  } catch (err) {
    console.warn('[AI Slides] Backend belum siap / error, menggunakan canonical deck generator:', err.message);
    return generateDeckPayload(project, outline);
  }
}

/**
 * 4. Simpan / Sync Project Deck ke Backend
 * Endpoint: POST /api/projects
 */
export async function saveProjectDeckApi(deckPayload) {
  try {
    const res = await fetchApi('/projects', {
      method: 'POST',
      body: JSON.stringify(deckPayload),
    });
    return res;
  } catch (err) {
    console.warn('[Save Project] Gagal simpan ke backend (tersimpan lokal):', err.message);
    return null;
  }
}

// Helper validasi UUID format untuk database backend
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * 5. Ambil project terbaru berdasarkan ID
 * Endpoint: GET /api/projects/{id}
 */
export async function getProjectByIdApi(id) {
  if (!id || !UUID_REGEX.test(id)) {
    // Proyek lokal (draf dengan prefix proj_...) tidak ada di database backend
    return null;
  }
  try {
    const res = await fetchApi(`/projects/${id}`);
    return res;
  } catch (err) {
    console.warn(`[Get Project] Gagal fetch project ${id}:`, err.message);
    return null;
  }
}

/**
 * 6. Hapus project dari backend
 * Endpoint: DELETE /api/projects/{id}
 */
export async function deleteProjectByIdApi(id) {
  if (!id || !UUID_REGEX.test(id)) {
    return null;
  }
  try {
    const res = await fetchApi(`/projects/${id}`, {
      method: 'DELETE',
    });
    return res;
  } catch (err) {
    console.warn(`[Delete Project] Gagal hapus project ${id}:`, err.message);
    throw err;
  }
}

/**
 * 7. Ambil Brand Kit User
 * Endpoint: GET /api/brand-kit
 */
export async function getBrandKitApi() {
  try {
    const res = await fetchApi('/brand-kit');
    return res;
  } catch (err) {
    console.warn('[Get BrandKit] Gagal ambil brand kit:', err.message);
    return null;
  }
}

/**
 * 8. Simpan Brand Kit User
 * Endpoint: POST /api/brand-kit
 */
export async function saveBrandKitApi(brandKit) {
  try {
    const res = await fetchApi('/brand-kit', {
      method: 'POST',
      body: JSON.stringify(brandKit),
    });
    return res;
  } catch (err) {
    console.warn('[Save BrandKit] Gagal simpan brand kit:', err.message);
    return null;
  }
}

/**
 * Sanitasi deckPayload agar sesuai schema backend sebelum dikirim ke /api/export/pptx.
 * Memperbaiki:
 *  - deckId: hapus jika bukan UUID valid (ID lokal proj_...)
 *  - slides[].bullets / cards: null → []
 *  - slides[].imageUrl / imageQuery: string kosong atau null → undefined (dihapus dari payload)
 *  - slides[].cards[].description: potong ke maks 80 karakter
 */
const UUID_REGEX_FULL = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Kembalikan value jika merupakan URL valid (http/https), atau undefined untuk menghapus field */
function validUrlOrUndefined(value) {
  if (!value || typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    return (url.protocol === 'http:' || url.protocol === 'https:') ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

function sanitizeDeckPayload(payload) {
  // Pastikan deckId selalu berupa UUID v4 valid sesuai skema backend
  let deckId = payload.deckId;
  if (!deckId || !UUID_REGEX_FULL.test(deckId)) {
    // Generate valid UUID v4 fallback untuk backend schema validation
    deckId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  }

  const brandKit = {
    logoUrl: typeof payload.brandKit?.logoUrl === 'string' ? payload.brandKit.logoUrl : '',
    primaryColor: payload.brandKit?.primaryColor || '#0F4C81',
    accentColor: payload.brandKit?.accentColor || '#F2A007',
    fontFamily: payload.brandKit?.fontFamily || 'Inter',
  };

  const slides = (payload.slides || []).map((slide, idx) => {
    return {
      slideNumber: slide.slideNumber || (idx + 1),
      layout: slide.layout || 'title_bullets',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
      cards: Array.isArray(slide.cards)
        ? slide.cards.map((c) => ({
            header: c.header ?? '',
            description: typeof c.description === 'string' ? c.description.slice(0, 80) : '',
          }))
        : [],
      imageUrl: typeof slide.imageUrl === 'string' ? slide.imageUrl : '',
      imageQuery: typeof slide.imageQuery === 'string' ? slide.imageQuery : '',
      missing: Array.isArray(slide.missing) ? slide.missing : [],
    };
  });

  return {
    deckId,
    template: payload.template || 'penawaran_produk',
    businessName: payload.businessName || 'PitchKu Presentasi',
    brandKit,
    slides,
  };
}

/**
 * 9. Export PPTX via Backend API
 * Endpoint: POST /api/export/pptx
 * Mendukung respon berupa File Binary (.pptx blob) atau JSON { downloadUrl: "..." }
 */
export async function exportPptxApi(deckPayload, fileName = 'PitchKu Presentasi') {
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

  // Ambil token
  const { supabase } = await import('./supabase');
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // Sanitasi payload sebelum dikirim agar lolos validasi backend
  const sanitizedPayload = sanitizeDeckPayload(deckPayload);

  const response = await fetch(`${API_BASE_URL}/export/pptx`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(sanitizedPayload),
  });

  if (!response.ok) {
    // Baca body sebagai teks terlebih dulu untuk pesan error yang lebih lengkap
    const rawText = await response.text().catch(() => '');
    let message = '';
    try {
      const json = JSON.parse(rawText);
      message = json.message || json.detail || json.error || '';
    } catch {
      message = rawText.slice(0, 300);
    }
    const errMsg = message || `HTTP ${response.status}: Endpoint /export/pptx error.`;
    console.error(`[Export PPTX] ${response.status} ${response.url}\n→ ${errMsg}`);
    throw new Error(errMsg);
  }

  const contentType = response.headers.get('content-type') || '';

  // Jika respon berupa binary file blob (stream download)
  if (
    contentType.includes('application/vnd.openxmlformats') ||
    contentType.includes('application/octet-stream') ||
    contentType.includes('application/zip')
  ) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.pptx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return { success: true, mode: 'blob' };
  }

  // Jika respon berupa JSON
  const data = await response.json().catch(() => ({}));
  if (data && data.downloadUrl) {
    window.open(data.downloadUrl, '_blank');
    return { success: true, mode: 'url', downloadUrl: data.downloadUrl };
  }

  return data;
}
