## Context

Aplikasi PitchKu membutuhkan antarmuka Slide Editor visual (FR-04) setelah tahapan Wizard & Konfirmasi Outline selesai. Editor ini menyajikan tata letak 16:9 widescreen (basis 1920x1080) yang responsif, penyuntingan teks langsung dengan character counter anti-overflow, sidebar thumbnail di sebelah kiri yang mendukung pemindahan urutan slide (drag & drop / arrow buttons), penambahan & penghapusan slide, pengelolaan media (pencarian gambar stok & unggah foto produk), integrasi warna Brand Kit & logo otomatis, serta ekspor PPTX/PDF.

## Goals / Non-Goals

**Goals:**
- Mengimplementasikan `src/pages/EditorPage/index.jsx` sebagai parent page editor.
- Membangun komponen antarmuka modular di `src/components/SlideEditor/` berbasis shadcn UI:
  - `EditorHeader.jsx`: Top navigation, rename judul deck, auto-save status, trigger export, avatar, fullscreen, dan tombol back ke `/dashboard`.
  - `SlideThumbnailRail.jsx`: Left vertical sidebar panel untuk navigasi slide, urutan slide (reorder up/down/drag), tambah slide, hapus slide, dan highlight slide aktif.
  - `SlideFormatToolbar.jsx`: Contextual formatting bar (Indikator slide aktif & `✨ AI Rewrite`).
  - `SlideCanvas.jsx`: Viewport 16:9 (1920x1080 basis) yang membungkus `SlideLayoutRenderer` dengan logo otomatis di pojok slide non-sampul.
  - `SlideLayoutRenderer.jsx`: Renderer komponen 6 layout kanonikal (`title_slide`, `title_bullets`, `two_column`, `metrics_grid`, `card_grid`, `contact_closing`) dengan in-place text edit dan `CharacterCounter` real-time.
  - `MediaPickerModal.jsx`: Modal pencarian gambar stok bebas lisensi (Unsplash/Pexels) & upload gambar lokal.
  - `ExportPresentationModal.jsx`: Dialog ekspor PPTX (`pptxgenjs`) & PDF 16:9.
- Mengelola state editor (`activeSlideIndex`, `deckPayload`, `isSaving`, `isMediaPickerOpen`) dan disinkronkan ke `projectStore` / Supabase `deck_versions`.

**Non-Goals:**
- Drag-and-drop elemen bebas koordinat XY ala Canva (PitchKu tetap menggunakan 6 layout kanonikal terstruktur anti-overflow).
- Format styling rich text inline seperti Bold/Italic/Underline/Font-size custom yang berpotensi merusak tata letak kanonikal.

## Decisions

### 1. Left Sidebar Vertical Thumbnail Rail & Reorder
- **Pilihan**: Relokasi thumbnail rail dari bagian bawah ke panel sebelah kiri (vertical sidebar), menggantikan sidebar rail statis.
- **Rasional**: Memaksimalkan area tinggi canvas 16:9 dan memudahkan penyuntingan urutan slide menggunakan tombol panah Naik/Turun atau drag-and-drop.

### 2. Direct In-Place Text Editing & Character Counter
- **Pilihan**: Menggunakan `contentEditable` / `<textarea>` terspesialisasi dengan indikator batas karakter real-time (`title`: 60, `subtitle`: 120, `bullets`: 90, `cards`: 80).
- **Rasional**: Mencegah teks meluber (*text overflow*) secara ketat dan menjamin *zero visual defect* saat diekspor ke PPTX.

### 3. Media Picker & Local Upload
- **Pilihan**: Wadah gambar pada slide (seperti pada layout `two_column`, `card_grid`, dll) dapat diklik untuk membuka `MediaPickerModal`.
- **Rasional**: Memungkinkan pengguna mencari gambar stok yang sesuai atau mengunggah foto produk sendiri.

### 4. Brand Kit & Automatic Logo Placement
- **Pilihan**: Warna primer dan aksen disuntikkan langsung ke CSS variables / inline styles elemen judul, kartu, dan bentuk shape. Logo disajikan otomatis di pojok slide non-sampul.
- **Rasional**: Memastikan konsistensi identitas merek pengguna tanpa perlu penataan manual per slide.

## Risks / Trade-offs

- **[Risk]** Text overflow pada layar kecil.
  → **Mitigasi**: Menerapkan anti-overflow character limits (`maxLength`) pada masing-masing field teks (judul max 60 char, subtitle max 120 char, bullets max 90 char, cards max 80 char).
- **[Risk]** Gambar lokal ukuran besar memperlambat state localStorage.
  → **Mitigasi**: Konversi file unggahan lokal menggunakan Data URL / object URL terkompresi.
