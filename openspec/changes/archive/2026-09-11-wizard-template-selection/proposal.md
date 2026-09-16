## Why

Pengguna PitchKu memerlukan alur Wizard UI yang intuitif untuk membuat pitch deck baru mulai dari pemilihan template bisnis hingga pengisian konteks bisnis secara dinamis. Saat ini, halaman `/new` (`WizardPage`) hanya berisi placeholder teks dasar.

## What Changes

- Mengimplementasikan alur UI Wizard pada `/new` yang terintegrasi dengan layout `AppSidebar` di sisi kiri.
- **Step 1 (Pemilihan Template)**: Menampilkan 4 card template standar (`company_profile`, `penawaran_produk`, `proposal_kerjasama`, `laporan_ringkas`) dengan aspek rasio proporsional, preview visual, dan badge kategori.
- **Step 2 (Form Konteks Bisnis Dinamis)**: Progress bar 3-point dimuat di bagian atas. Formulir menampilkan input khusus sesuai template terpilih serta area *free-text* materi mentah dengan validasi 50–2.000 karakter.
- Menggunakan komponen UI berbasis shadcn (`Card`, `Button`, `Input`, `Textarea`, `Label`) dan styling Tailwind/CSS token dari `src/index.css`.
- Menyediakan mock state lokal agar wizard dapat dicoba secara offline tanpa ketergantungan pada backend endpoint.

## Capabilities

### New Capabilities
- `wizard-flow`: Kemampuan memilih 4 template standar bisnis, mengisi form konteks bisnis dinamis, serta menginput materi mentah 50-2000 karakter dalam alur wizard 3-point.

### Modified Capabilities
- Tidak ada.

## Impact

- `src/pages/WizardPage/index.jsx`: Mengganti placeholder dengan alur utama Wizard.
- `src/components/Wizard/`: Folder baru berisi komponen modular Wizard (`TemplateSelector.jsx`, `BusinessContextForm.jsx`, `WizardStepper.jsx`, `WizardFooterBar.jsx`).
- `src/layouts/`: Memastikan layout wrapper menyertakan `AppSidebar`.
