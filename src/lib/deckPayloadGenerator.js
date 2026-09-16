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

function getStoredUserEmail() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth-token') || key.includes('sb-'))) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed?.user?.email) return parsed.user.email;
          if (parsed?.currentSession?.user?.email) return parsed.currentSession.user.email;
        }
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function mockContentForLayout(layoutType, title, structuredData = {}, templateId = 'company_profile') {
  // Info dasar bisnis selalu diambil dari structuredData (tersedia di semua template)
  const company = structuredData.companyName || structuredData.productName || 'Usaha Anda';
  const industry = structuredData.industry || 'Bisnis Indonesia';
  const year = structuredData.yearFounded || '2021';
  const team = structuredData.teamSize ? `${structuredData.teamSize} Orang` : '10+ Tim Core';

  // Info spesifik template
  const moq = structuredData.moq ? `${structuredData.moq} pcs` : '100 pcs';
  const margin = structuredData.margin ? `${structuredData.margin}%` : structuredData.profitMargin ? `${structuredData.profitMargin}%` : '25%';
  const investment = structuredData.investmentValue ? `Rp ${Number(structuredData.investmentValue).toLocaleString('id-ID')}` : 'Rp 100 Juta';
  const revenue = structuredData.revenue ? `Rp ${Number(structuredData.revenue).toLocaleString('id-ID')}` : 'Rp 250 Juta';
  const profit = structuredData.profitLoss ? `Rp ${Number(structuredData.profitLoss).toLocaleString('id-ID')}` : structuredData.profit ? `Rp ${structuredData.profit}` : 'Rp 65 Juta';
  const target = structuredData.partnerTarget || structuredData.industry || 'Calon Mitra / Klien';

  // Baris info dasar yang muncul di semua slide (untuk footer/subtitle)
  const companyBasicInfo = `${company}${year !== '2021' ? ` · Est. ${year}` : ''}${industry ? ` · ${industry}` : ''}`;

  if (templateId === 'proposal_kerjasama') {
    switch (layoutType) {
      case 'title_slide':
        return {
          subtitle: `Proposal Kemitraan Strategis & Investasi — ${company}`,
          imageQuery: 'business partnership handshake meeting',
        };
      case 'metrics_grid':
        return {
          subtitle: `Rincian Kebutuhan Modal & Proyeksi Kemitraan ${company}`,
          cards: [
            { header: investment, description: 'Total Nilai Investasi / Modal' },
            { header: margin, description: 'Estimasi Pengembalian (ROI)' },
            { header: profit, description: 'Proyeksi Bagi Hasil / Bulan' },
            { header: team, description: 'Kapasitas Tim Eksekusi Proyek' },
          ],
        };
      case 'two_column':
        return {
          subtitle: `Skema Kolaborasi & Pembagian Hak Mitra`,
          cards: [
            {
              header: 'Hak & Keuntungan Investor',
              description: `Menerima porsi dividen berkala dengan potensi profit bulanan hingga ${profit}.`,
            },
            {
              header: 'Tanggung Jawab Pengelola',
              description: `Dikelola langsung oleh ${company} (didirikan sejak ${year}) secara profesional.`,
            },
          ],
        };
      case 'card_grid':
        return {
          subtitle: `Alokasi Pendanaan & Mitigasi Risiko`,
          cards: [
            { header: 'Modal Kerja & Inventaris', description: 'Pengadaan bahan baku, alat produksi, dan operasional awal.' },
            { header: 'Ekspansi & Pemasaran', description: `Penetrasi pasar untuk menjangkau target ${target}.` },
            { header: 'Manajemen Operasional', description: `Dijalankan oleh ${team} teruji dengan SOP terstandar.` },
            { header: 'Mitigasi Risiko', description: 'Jaminan transparansi laporan keuangan periodik dan legalitas lengkap.' },
          ],
        };
    }
  }

  if (templateId === 'penawaran_produk') {
    switch (layoutType) {
      case 'title_slide':
        return {
          subtitle: `Katalog Resmi & Penawaran Harga Spesial — ${company}`,
          imageQuery: 'product catalog retail showcase',
        };
      case 'metrics_grid':
        return {
          subtitle: `Struktur Harga & Diskon Grosir ${company}`,
          cards: [
            { header: moq, description: 'Minimum Order Quantity (MOQ)' },
            { header: margin, description: 'Diskon / Margin Reseller' },
            { header: profit, description: 'Potensi Profit Mitra / Bulan' },
            { header: '24 Jam', description: 'Kecepatan Proses Pemesanan' },
          ],
        };
      case 'two_column':
        return {
          subtitle: `Spesifikasi Produk & Fasilitas Reseller`,
          cards: [
            {
              header: 'Spesifikasi & Jaminan Mutu',
              description: 'Bahan baku kualitas terbaik dengan kemasan higienis siap edar.',
            },
            {
              header: 'Dukungan Marketing',
              description: 'Gratis materi promosi digital, foto produk HD, dan banner toko.',
            },
          ],
        };
    }
  }

  if (templateId === 'laporan_ringkas') {
    // Format periode laporan dari date range input
    const periodText = (() => {
      const start = structuredData.reportStartDate;
      const end = structuredData.reportEndDate;
      if (start && end) {
        const fmt = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        return `${fmt(start)} s.d. ${fmt(end)}`;
      }
      if (start) return `Mulai ${new Date(start).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
      return 'Periode Laporan';
    })();

    switch (layoutType) {
      case 'title_slide':
        return {
          subtitle: `Laporan Kinerja ${company} \u2014 ${periodText}`,
          imageQuery: 'financial report charts analytics',
        };
      case 'metrics_grid':
        return {
          subtitle: `Rangkuman Kinerja Finansial ${company} \u2014 ${periodText}`,
          cards: [
            { header: revenue, description: 'Total Omzet Kotor' },
            { header: profit, description: 'Laba Bersih Operasional' },
            { header: margin, description: 'Margin Keuntungan Bersih' },
            { header: `Est. ${year}`, description: `Industri: ${industry}` },
          ],
        };
    }
  }

  // Fallback ke Company Profile / General
  switch (layoutType) {
    case 'title_slide':
      return {
        subtitle: `Slide Presentasi Profesional — ${company}`,
        imageQuery: 'professional business team meeting premium',
      };

    case 'title_bullets':
      return {
        subtitle: `Poin-poin strategis dan pencapaian utama ${company}`,
        bullets: [
          `Target pertumbuhan omzet kumulatif mencapai ${revenue} per periode.`,
          `Estimasi profitabilitas bersih usaha berada di kisaran ${margin}.`,
          `Didukung oleh ${team} berdedikasi sejak didirikan tahun ${year}.`,
          `Skema kemitraan terbuka untuk segmen target: ${target}.`,
          `Kapasitas pasokan dan efisiensi operasional skala menengah-besar.`,
        ],
        imageQuery: 'business growth analytics chart premium dark',
      };

    case 'two_column':
      return {
        subtitle: `Perbandingan strategis dua dimensi utama ${company}`,
        cards: [
          {
            header: 'Keunggulan Operasional',
            description:
              `Didirikan sejak ${year} dengan dukungan ${team}, menjamin kualitas standar produksi usaha.`,
          },
          {
            header: 'Skema Kemitraan & Nilai',
            description:
              `Menawarkan margin keuntungan hingga ${margin} untuk mendukung percepatan pertumbuhan mitra.`,
          },
        ],
        imageQuery: 'business comparison strategy professional',
      };

    case 'metrics_grid':
      return {
        subtitle: `Angka-angka utama yang mencerminkan kinerja ${company}`,
        cards: [
          { header: margin, description: 'Margin Keuntungan Mitra' },
          { header: moq, description: 'Minimum Order Quantity (MOQ)' },
          { header: revenue, description: 'Target / Capaian Omzet' },
          { header: investment, description: 'Proyeksi / Kebutuhan Modal' },
        ],
      };

    case 'card_grid':
      return {
        subtitle: `Rangkuman keunggulan produk dan unit bisnis ${company}`,
        cards: [
          {
            header: 'Standar Mutu & Kualitas',
            description: `Diproduksi secara terukur untuk memenuhi ekspektasi ${target}.`,
          },
          {
            header: 'Diferensiasi Produk',
            description: 'Memiliki keunggulan kompetitif unik yang membedakan dari pesaing pasar.',
          },
          {
            header: 'Skala & Kapasitas',
            description: `Mampu melayani order dengan MOQ mulai dari ${moq} secara konsisten.`,
          },
          {
            header: 'Prospek Pertumbuhan',
            description: `Diproyeksikan menghasilkan potensi profit bulanan hingga ${profit}.`,
          },
        ],
        imageQuery: 'premium product showcase business',
      };

    case 'contact_closing': {
      const userEmail = structuredData.userEmail || getStoredUserEmail() || 'kontak@usahamitra.id';
      return {
        subtitle: `Hubungi tim ${company} untuk kemitraan, pemesanan, atau informasi lebih lanjut`,
        cards: [
          { header: 'Email Usaha', description: userEmail },
          { header: 'Telepon / WhatsApp', description: '+62 812-3456-7890' },
          { header: company, description: `${industry} · Est. ${year}` },
          { header: 'Target Mitra', description: target },
        ],
      };
    }

    default:
      return {
        subtitle: `Isi konten slide di sini — ${companyBasicInfo}`,
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
    'Presentasi Tanpa Judul';

  const templateId = project?.template || 'company_profile';

  const slides = confirmedOutline.map((outlineItem, idx) => {
    const mockContent = mockContentForLayout(
      outlineItem.layoutType,
      outlineItem.title,
      project?.structuredData || {},
      templateId
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
