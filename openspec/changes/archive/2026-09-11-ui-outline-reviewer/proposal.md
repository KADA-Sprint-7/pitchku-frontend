## Why

Setelah pengguna memilih template dan mengisi konteks bisnis & brand kit pada alur Wizard (Stage 1), pengguna memerlukan antarmuka **Outline Reviewer** untuk meninjau, mengedit judul slide, mengatur ulang urutan slide, serta menambah/menghapus slide hasil rumusan AI sebelum melangkah ke proses pembuatan isi slide lengkap (Stage 2 LLM) dan masuk ke Slide Editor.

## What Changes

- Mengimplementasikan halaman **Outline Reviewer** pada rute `/outline/:projectId` dengan layout `AppSidebar` di sisi kiri.
- **Visual AI Deck Structuring Header**:
  - Menampilkan badge total slide terstruktur (misal: "● Total: 8 Slide Terstruktur") dan badge kategori template.
  - Tombol aksi `↺ Reset Susunan Default` untuk mengembalikan susunan awal dari AI.
  - Tombol aksi `+ Tambah Bab Baru` untuk menambahkan slide kustom baru.
- **Daftar Slide Interaktif (Slide Outline List)**:
  - Setiap kartu slide menampilkan grip handle (`GripVertical`), nomor & label bab (misal: `01 - Cover`), input teks judul yang dapat diedit langsung (*inline editing* dengan validasi max 60 karakter), badge rekomendasi canonical layout (misal: `Hero Cover`, `Dua Kolom`, `Grid 4 Metrik`, `Bento Cards`, dll.), tombol duplikasi slide (copy), dan tombol hapus slide (trash).
  - Mekanisme drag-and-drop / reordering untuk menata ulang urutan alur presentasi secara intuitif (otomatis merenumber `slideNumber` 1..N).
- **Navigation Footer Bar**:
  - Tombol `← Kembali` ke alur wizard sebelumnya.
  - Tombol aksi utama CTA `Lanjut: Buat Isi Slide & Masuk Editor →` yang memvalidasi outline dan mengarahkan ke `/editor/:projectId`.
- **Client Mock Data Engine & Local Draft Store**:
  - Menyediakan `mockOutlineGenerator.js` untuk menghasilkan kerangka 8-10 slide dinamis berdasarkan template terpilih dan input konteks pengguna.
  - Menyediakan `projectStore.js` berbasis `localStorage` untuk menyimpan state draf proyek (outline, template, brandKit, rawContext) agar persist dan siap disambungkan ke REST API backend.

## Capabilities

### New Capabilities
- `outline-reviewer`: Antarmuka peninjauan dan penyesuaian kerangka slide hasil AI (edit judul inline, drag-and-drop reorder, duplicate, delete, add section, reset default) serta persiapan payload Stage 2.

### Modified Capabilities
- Tidak ada.

## Impact

- `src/pages/OutlinePage/index.jsx`: Mengganti placeholder dengan halaman Outline Reviewer lengkap.
- `src/components/Outline/` atau `src/components/Wizard/`: Komponen modular (`OutlineReviewer.jsx`, `OutlineItemCard.jsx`, `AddSlideDialog.jsx`, `OutlineHeader.jsx`).
- `src/lib/mockOutlineGenerator.js`: Generator kerangka slide mock realistis per template.
- `src/lib/projectStore.js`: Utilitas penyimpanan draft lokal client-side.
- Rute & Navigasi: Menghubungkan tombol "Lanjutkan" dari `WizardPage` (`/new`) ke `/outline/:projectId`.
