/**
 * deckPayloadGenerator.js
 * Converts a confirmed outline (array of SlideItem from OutlinePage)
 * into a full PitchKuDeckPayload with rich mock content per canonical layout.
 *
 * Called when the user confirms the outline and navigates to /editor/:projectId
 */

// ---------------------------------------------------------------------------
// Mock content generators per layout
// ---------------------------------------------------------------------------

export function mockContentForLayout(layoutType, title, structuredData = {}) {
  const company = structuredData.companyName || structuredData.productName || 'Usaha Anda';

  switch (layoutType) {
    case 'title_slide':
      return {
        subtitle: `Slide Presentasi Profesional — ${company}`,
        imageQuery: 'professional business team meeting premium',
      };

    case 'title_bullets':
      return {
        subtitle: 'Poin-poin strategis dan pencapaian utama bisnis',
        bullets: [
          'Pertumbuhan revenue YoY sebesar +40% dalam 12 bulan terakhir',
          'Ekspansi ke 3 kota baru dengan margin profitabilitas 28%',
          'Efisiensi biaya operasional turun 18% pasca-digitalisasi proses',
          'Tim inti berpengalaman 5+ tahun di industri terkait',
          'Pipeline proyek baru bernilai 2,5× dari target awal',
        ],
        imageQuery: 'business growth analytics chart premium dark',
      };

    case 'two_column':
      return {
        subtitle: 'Perbandingan strategis dua dimensi utama',
        cards: [
          {
            header: 'Kolom Kiri',
            description:
              'Uraian detail terkait aspek pertama yang mendukung nilai proposisi bisnis secara keseluruhan.',
          },
          {
            header: 'Kolom Kanan',
            description:
              'Penjelasan komplementer aspek kedua yang memperkuat diferensiasi dan keunggulan kompetitif.',
          },
        ],
        imageQuery: 'business comparison strategy professional',
      };

    case 'metrics_grid':
      return {
        subtitle: 'Angka-angka utama yang mencerminkan skala dan pertumbuhan bisnis',
        cards: [
          { header: '+45% YoY', description: 'Pertumbuhan Revenue Tahunan' },
          { header: '120+ Klien', description: 'Portofolio Aktif & Tersertifikasi' },
          { header: 'Rp 2,4 M', description: 'Total Omzet Kumulatif' },
          { header: '98%', description: 'Tingkat Kepuasan Pelanggan' },
        ],
      };

    case 'card_grid':
      return {
        subtitle: 'Rangkuman produk, layanan, atau unit bisnis unggulan',
        cards: [
          {
            header: 'Produk / Layanan 1',
            description: 'Deskripsi singkat fitur utama dan nilai tambah yang ditawarkan kepada pelanggan.',
          },
          {
            header: 'Produk / Layanan 2',
            description: 'Keunggulan kompetitif dan spesifikasi teknis yang membedakan dari kompetitor.',
          },
          {
            header: 'Produk / Layanan 3',
            description: 'Target segmen pasar dan hasil nyata yang dicapai oleh pengguna awal.',
          },
          {
            header: 'Produk / Layanan 4',
            description: 'Rencana pengembangan dan roadmap ekspansi ke segmen pasar baru.',
          },
        ],
        imageQuery: 'premium product showcase business',
      };

    case 'contact_closing':
      return {
        subtitle: 'Hubungi kami untuk kemitraan, pemesanan, atau informasi lebih lanjut',
        cards: [
          { header: 'Email', description: 'hello@pitchku.id' },
          { header: 'Telepon / WhatsApp', description: '+62 812-xxxx-xxxx' },
          { header: 'Website', description: 'www.pitchku.id' },
          { header: 'Alamat', description: 'Jakarta Selatan, DKI Jakarta, Indonesia' },
        ],
      };

    default:
      return {
        subtitle: 'Isi konten slide di sini',
        bullets: ['Poin utama pertama', 'Poin utama kedua', 'Poin utama ketiga'],
      };
  }
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

/**
 * Generates a PitchKuDeckPayload from a confirmed outline and project data.
 *
 * @param {Object} project - The project object from projectStore
 * @param {Array}  confirmedOutline - The confirmed outline array (SlideItem[])
 * @returns {Object} PitchKuDeckPayload
 */
export function generateDeckPayload(project, confirmedOutline) {
  const businessName =
    project?.structuredData?.companyName ||
    project?.structuredData?.productName ||
    project?.title ||
    'Usaha Anda';

  const slides = confirmedOutline.map((outlineItem, idx) => {
    const mockContent = mockContentForLayout(
      outlineItem.layoutType,
      outlineItem.title,
      project.structuredData
    );

    return {
      slideNumber: idx + 1,
      layout: outlineItem.layoutType || 'title_bullets',
      title: outlineItem.title || `Slide ${idx + 1}`,
      subtitle: mockContent.subtitle || null,
      bullets: mockContent.bullets || null,
      cards: mockContent.cards || null,
      imageUrl: null, // Will be resolved later by image search / upload
      imageQuery: mockContent.imageQuery || null,
      missing: [],
    };
  });

  return {
    deckId: project.id,
    template: project.template || 'company_profile',
    businessName,
    brandKit: {
      logoUrl: project.brandKit?.logoUrl || null,
      primaryColor: project.brandKit?.primaryColor || '#0F4C81',
      accentColor: project.brandKit?.accentColor || '#F2A007',
      fontFamily: project.brandKit?.fontFamily || 'Inter',
    },
    slides,
  };
}
