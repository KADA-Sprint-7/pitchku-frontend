## 1. Store & Slide Payload Helper Setup

- [x] 1.1 Buat helper generator payload slide `generateDeckPayload` yang mengonversi outline terkonfirmasi menjadi struktur data kanonikal `PitchKuDeckPayload` lengkap dengan 6 layout.
- [x] 1.2 Update `projectStore.js` untuk mendukung penyimpanan, pembacaan, dan pembaruan `deckPayload` dan status auto-save.

## 2. Komponen Modular SlideEditor (src/components/SlideEditor/)

- [x] 2.1 Buat `EditorHeader.jsx` dengan tombol back ke `/dashboard`, judul deck yang dapat diedit secara inline, auto-save status badge, tombol fullscreen, avatar, dan trigger tombol `Unduh PPTX`.
- [x] 2.2 Reorganisasi `SlideThumbnailRail.jsx` menjadi **Left Vertical Sidebar Rail** untuk menampilkan thumbnail slide, mengganti sidebar kiri lama.
- [x] 2.3 Implementasikan fitur **Reorder Slide** (tombol panah Naik/Turun & drag-and-drop) serta tombol Tambah Slide & Hapus Slide dengan konfirmasi di sidebar thumbnail kiri.
- [x] 2.4 Update `SlideFormatToolbar.jsx` untuk fokus pada indikator slide aktif & trigger `✨ AI Rewrite` (menghapus tombol bold/italic/underline/font-size).
- [x] 2.5 Perbarui `SlideCanvas.jsx` untuk visualisasi rasio 16:9 (basis 1920x1080) dengan penempatan logo bisnis otomatis di pojok slide non-sampul.
- [x] 2.6 Perbarui `SlideLayoutRenderer.jsx` dengan indikator **Character Counter real-time** pada setiap editable text field (Title: 60, Subtitle: 120, Bullets: 90, Cards: 80).
- [x] 2.7 Buat `MediaPickerModal.jsx` untuk dialog pencarian gambar stok bebas lisensi (Unsplash/Pexels API) dan unggah foto lokal dari perangkat.
- [x] 2.8 Buat `ExportPresentationModal.jsx` menggunakan dialog shadcn untuk pemilihan nama file, pilihan format PPTX vs PDF, dan tombol konfirmasi unduh.

## 3. Integrasi Halaman & Alur Pengguna

- [x] 3.1 Integrasikan seluruh komponen baru (Left Sidebar Rail, Character Counter, Media Picker Modal) ke dalam `src/pages/EditorPage/index.jsx`.
- [x] 3.2 Pastikan alur reorder slide, tambah/hapus slide, sunting gambar, dan auto-save ke `projectStore` / Supabase snapshot berjalan lancar.
- [x] 3.3 Lakukan verifikasi visual dan fungsional pada editor 16:9.
