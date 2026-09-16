## Context

Saat ini `/new` (`WizardPage`) belum mengimplementasikan alur UI Wizard. Pengguna memerlukan alur interaktif untuk memilih 4 template standar dan mengisi formulir konteks bisnis dinamis sebelum nantinya mengirimkan request ke backend LLM Stage 1.

## Goals / Non-Goals

**Goals:**
- Membuat alur Wizard 2-step (Step 1: Pilih Template, Step 2: Form Konteks Bisnis Dinamis).
- Mengintegrasikan `AppSidebar` sebagai navigasi utama sisi kiri tanpa topbar.
- Menampilkan Stepper 3-point (01 Input Konteks, 02 Konfirmasi Outline, 03 Edit PPTX) khusus pada Step 2 ke atas.
- Menggunakan komponen shadcn/ui dan token `src/index.css` (Dark theme luminous midnight).
- Membuat card template dengan rasio 16:9 yang proporsional dan tidak terlalu besar.
- Menyiapkan mock state lokal tanpa ketergantungan pada backend endpoint.

**Non-Goals:**
- Integrasi ke REST API backend LLM Stage 1 (akan dihubungkan saat backend siap).
- Pembuatan layar Slide Editor / Outline Review lengkap (masih berada di tahapan selanjutnya).

## Decisions

1. **Struktur Komponen Modular di `/src/components/Wizard/`**:
   - `TemplateSelector.jsx`: Komponen grid 4 card template proporsional (16:9) dengan indicator ter-select.
   - `BusinessContextForm.jsx`: Dynamic fields berdasarkan template id + textarea raw material (50-2000 chars) + real-time counter.
   - `WizardStepper.jsx`: Progress bar 3-point mengikuti style dari `HowItWorks.jsx`.
   - `WizardFooterBar.jsx`: Bar navigasi bawah untuk memilih "Lanjutkan ke Konteks & Brand Kit" atau "Kembali".

2. **State Management**:
   - Menggunakan state lokal React (`useState`) pada `WizardPage/index.jsx` untuk menyimpan step aktif, templateId terpilih, dynamic form data, dan raw text.

3. **Layouting**:
   - Menggunakan layout wrapper flex h-screen dengan `AppSidebar` di sebelah kiri dan container scrollable di sebelah kanan.

## Risks / Trade-offs

- [Risk] Form fields per template belum ada API schema baku dari backend.
  - *Mitigation*: Buat definisi bidang umum yang fleksibel (seperti MOQ & Margin untuk `penawaran_produk`, Nilai Investasi untuk `proposal_kerjasama`).
