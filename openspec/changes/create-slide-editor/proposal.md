## Why

Setelah pengguna menentukan template dan mengonfirmasi susunan outline di Langkah 2 Wizard, pengguna membutuhkan antarmuka Slide Editor interaktif (FR-04) untuk melihat pratinjau slide secara visual pada rasio 16:9, melakukan penyuntingan langsung (in-place text editing) dengan pembatas karakter (character counter), mengelola urutan slide di sidebar kiri, mengelola media/gambar, serta mengekspor hasil akhir ke PowerPoint (.pptx) maupun PDF (.pdf).

## What Changes

- **Canvas Visual & Render Slide (16:9)**: Canvas utama menampilkan slide secara responsif pada rasio Widescreen 16:9 (basis 1920x1080) dengan integrasi Brand Kit otomatis (warna primer & aksen) serta penempatan logo bisnis otomatis di pojok slide non-sampul.
- **Penyuntingan Teks Langsung (In-Place Text Editing)**: Menyunting judul, subjudul, bullet points, atau kartu secara langsung dengan indikator batas karakter real-time (Title: 60, Subtitle: 120, Bullets: 5 items @ 90 chars, Cards: 4 items @ 80 chars).
- **Sidebar Thumbnail Left Panel & Slide Reordering**: Slide Thumbnail Rail disajikan secara vertikal di panel sebelah kiri untuk menavigasi, mengubah urutan slide (drag-and-drop / tombol panah up & down), serta menambah dan menghapus slide dengan dialog konfirmasi.
- **Pengelolaan Gambar & Media**: Wadah gambar interaktif yang dapat diklik untuk membuka modal pencarian gambar stok bebas lisensi (Unsplash/Pexels) atau mengunggah foto produk/usaha lokal.
- **Aksi Ekspor & Auto-Save**: Memicu backend export PowerPoint (.pptx via pptxgenjs) & PDF (16:9 high-res) serta auto-save snapshot JSON ke Supabase `deck_versions`.

## Capabilities

### New Capabilities
- `slide-editor`: Antarmuka editor visual slide presentasi kanonikal PitchKu dengan left sidebar thumbnail rail, direct editing & character counter, media picker modal, logo auto-placement, dan export PPTX/PDF.

### Modified Capabilities
<!-- None -->

## Impact

- **Affected Code**: `src/pages/EditorPage/index.jsx`, `src/components/SlideEditor/*`, `src/lib/projectStore.js`, `src/lib/deckPayloadGenerator.js`.
- **Dependencies**: Komponen UI shadcn (`Button`, `Dialog`, `Input`, `DropdownMenu`, `Tooltip`, `Badge`), `lucide-react`, `sonner`.
