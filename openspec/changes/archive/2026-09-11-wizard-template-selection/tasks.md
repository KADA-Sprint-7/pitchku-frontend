## 1. Komponen Modular Wizard

- [x] 1.1 Buat komponen `TemplateSelector.jsx` di `src/components/Wizard/` dengan grid 4 template proporsional (16:9), preview visual, dan active state selection.
- [x] 1.2 Buat komponen `BusinessContextForm.jsx` di `src/components/Wizard/` dengan dynamic input per template + raw text area dengan validasi limit 50-2000 karakter.
- [x] 1.3 Buat komponen `WizardStepper.jsx` di `src/components/Wizard/` untuk menampilkan progress bar 3-point.
- [x] 1.2 Buat komponen `WizardFooterBar.jsx` di `src/components/Wizard/` untuk navigasi antar langkah.

## 2. Integrasi Layar & State di WizardPage

- [x] 2.1 Hubungkan state wizard (`step`, `selectedTemplateId`, `formData`, `rawText`) di `src/pages/WizardPage/index.jsx`.
- [x] 2.2 Susun layout `WizardPage` dengan `AppSidebar` di sebelah kiri, area konten scrollable, dan `WizardFooterBar` navigasi di bagian bawah (tanpa Footer global).
- [x] 2.3 Atur kondisi rendering progress bar 3-point hanya saat pengguna telah berpindah dari Step 1 ke Step 2.
