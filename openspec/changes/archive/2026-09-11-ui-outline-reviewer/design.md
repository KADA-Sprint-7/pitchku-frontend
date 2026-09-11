## Context

Setelah pengguna menyelesaikan input pada alur Wizard (Stage 1: Template, Konteks Bisnis, Brand Kit), sistem mengarahkan pengguna ke halaman `/outline/:projectId` (Stage 2: Outline Review). Halaman ini bertindak sebagai jembatan peninjauan struktur presentasi sebelum AI menghasilkan isi slide lengkap untuk Slide Editor (`/editor/:projectId`).

## Goals / Non-Goals

**Goals:**
- Mengimplementasikan halaman `OutlinePage` (`/outline/:projectId`) lengkap dengan layout `AppSidebar` (Canva-style narrow icon rail) dan `WizardStepper` (tahap 02 aktif).
- Menyediakan UI kartu outline interaktif yang mencakup:
  - Nomor & label bab (misal: `01 - Cover`, `02 - Masalah & Peluang`).
  - Input judul slide inline dengan validasi batas maksimal 60 karakter.
  - Badge rekomendasi layout kanonikal (*Hero Cover, Dua Kolom, Grid 4 Metrik, Bento Cards, Compliance Matrix, Team Grid, Grafik Finansial, Call to Action*).
  - Grip handle (`GripVertical`) untuk drag-and-drop reordering.
  - Tombol aksi: Duplikasi slide, Hapus slide (min 3 slide).
- Menyediakan aksi header: Badge total slide & kategori template, tombol `↺ Reset Susunan Default`, dan `+ Tambah Bab Baru`.
- Menyediakan utilitas mock:
  - `src/lib/mockOutlineGenerator.js`: Menghasilkan kerangka 8-10 slide realistis sesuai template terpilih.
  - `src/lib/projectStore.js`: Menyimpan draft proyek lokal di `localStorage` agar persist saat navigasi.
- Menghubungkan alur: Wizard (`/new`) ➔ Outline (`/outline/:projectId`) ➔ Editor (`/editor/:projectId`).

**Non-Goals:**
- Pemanggilan REST API backend sungguhan (akan dihubungkan saat backend dev siap).
- Pembuatan canvas render slide editor (merupakan cakupan tahap `editor-page` berikutnya).

## Decisions

1. **Komponen Modular di `/src/components/Outline/`**:
   - `OutlineReviewer.jsx`: Container utama outline list & kontrol.
   - `OutlineItemCard.jsx`: Kartu per-slide dengan drag handle, inline title edit, layout badge, duplicate, delete.
   - `AddSlideDialog.jsx`: Modal shadcn Dialog untuk menambahkan bab baru.
   - `OutlineHeader.jsx`: Header visual metrik, tombol reset default, dan tombol tambah bab.

2. **Drag & Drop Reordering Pattern**:
   - Menggunakan HTML5 Drag and Drop API native (ringan, 0 dependensi tambahan, ramah performa) dengan event `onDragStart`, `onDragOver`, `onDrop`.
   - Otomatis merenumber `slideNumber` 1..N setelah reorder.

3. **Client-Side Draft Storage (`src/lib/projectStore.js`)**:
   - Menggunakan `localStorage` dengan schema terstruktur:
     ```javascript
     {
       id: "proj-uuid",
       template: "company_profile",
       structuredData: { ... },
       rawContext: "...",
       brandKit: { logoUrl, primaryColor, accentColor, fontFamily },
       outlines: [ { id, slideNumber, title, objective, suggestedLayout, isEdited } ],
       updatedAt: Date.now()
     }
     ```
   - Memastikan saat pengguna me-refresh halaman `/outline/:projectId` data tidak hilang.

## Risks / Trade-offs

- [Risk] Inkonsistensi data ketika ID proyek tidak ditemukan di `projectStore`.
  - *Mitigation*: Jika `projectId` tidak ditemukan di `localStorage` (misal direct access dari URL), generate default fallback project berdasarkan template default `company_profile` sehingga halaman tetap dapat dicoba secara offline tanpa blank page.
