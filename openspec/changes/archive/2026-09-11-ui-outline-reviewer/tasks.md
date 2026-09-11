## 1. Engine Mock & State Store

- [x] 1.1 Buat utilitas `src/lib/mockOutlineGenerator.js` untuk menghasilkan 8-10 outline slide cerdas berdasarkan template (`company_profile`, `penawaran_produk`, `proposal_kerjasama`, `laporan_ringkas`), data kontekstual, dan rekomendasi canonical layout.
- [x] 1.2 Buat modul penyimpanan lokal `src/lib/projectStore.js` (`createProject`, `getProject`, `updateOutline`, `saveConfirmedProject`) berbasis `localStorage` dengan auto-fallback.

## 2. Komponen Modular Outline

- [x] 2.1 Buat komponen `OutlineHeader.jsx` di `src/components/Outline/` berisi badge total slide, badge kategori template, tombol `↺ Reset Susunan Default`, dan tombol `+ Tambah Bab Baru`.
- [x] 2.2 Buat komponen `OutlineItemCard.jsx` di `src/components/Outline/` berisi drag handle grip, badge nomor bab, input teks judul inline (validasi max 60 chars), badge layout kanonikal, tombol duplikasi, dan tombol hapus.
- [x] 2.3 Buat komponen `AddSlideDialog.jsx` di `src/components/Outline/` menggunakan shadcn `Dialog` untuk memilih tipe layout dan memasukkan judul bab baru.
- [x] 2.4 Buat komponen utama `OutlineReviewer.jsx` di `src/components/Outline/` yang mengatur list kartu, drag-and-drop HTML5 reordering, renumbering urutan slide 1..N, serta helper info footer.

## 3. Integrasi Layar Outline & Navigasi Alur

- [x] 3.1 Bangun layout lengkap di `src/pages/OutlinePage/index.jsx` dengan `AppSidebar`, `WizardStepper` (tahap 02 aktif), container `OutlineReviewer`, dan footer bar navigasi.
- [x] 3.2 Hubungkan navigasi dari `WizardPage` (`/new`) saat user mengklik "Lanjutkan" pada Step 2 agar menginisialisasi draf proyek dan redirect ke `/outline/:projectId`.
- [x] 3.3 Hubungkan tombol CTA `Lanjut: Buat Isi Slide & Masuk Editor` pada `OutlinePage` untuk menyimpan confirmed outline dan redirect ke `/editor/:projectId`.
