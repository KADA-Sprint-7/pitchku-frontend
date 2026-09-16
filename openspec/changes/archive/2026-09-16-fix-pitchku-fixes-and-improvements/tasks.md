# Tasks: PitchKu UX, Auth Session, Form Wizard & Draft Fixes

- [x] 1. Reset Scroll Position di FAQ Page (`src/pages/FAQPage/index.jsx`) <!-- id: 0 -->
  - Tambahkan `useEffect` untuk `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })` saat komponen dimuat.

- [x] 2. Autentikasi Session Auto-Redirect (`src/components/LoginPage/LoginForm.jsx` & `src/pages/LoginPage/index.jsx`) <!-- id: 1 -->
  - Cek jika `user` ber-session aktif di `AuthContext`, langsung lakukan navigate ke `/dashboard`.
  - Pastikan checkbox "Ingat saya di perangkat ini" di `LoginForm.jsx` bekerja secara konsisten dengan session Supabase.

- [x] 3. Basic Business Info untuk Semua Template Slide (`src/components/Wizard/BusinessContextForm.jsx` & `src/lib/deckPayloadGenerator.js`) <!-- id: 2 -->
  - Pastikan input `companyName`, `yearFounded`, dan `industry` disertakan/dipertahankan di setiap template (`company_profile`, `penawaran_produk`, `proposal_kerjasama`, `laporan_ringkas`).
  - Update generator konten mock agar nama perusahaan, tahun berdiri, dan bidang usaha ter-inject ke dalam header/subheader/card di semua slide layout.

- [x] 4. Date Range Input untuk Periode Laporan (`src/components/Wizard/BusinessContextForm.jsx`) <!-- id: 3 -->
  - Ganti field `select` periode laporan pada template `laporan_ringkas` menjadi Range Date Picker (Tanggal Mulai s/d Tanggal Selesai).

- [x] 5. Auto-Save Draft Proyek, Judul Proyek & Navigasi Wizard Step 1 (`src/pages/WizardPage/index.jsx`, `src/lib/projectStore.js`, & `src/components/DashboardPage/ProjectCard.jsx`) <!-- id: 4 -->
  - Auto-save draf proyek dengan judul fallback `"Presentasi Tanpa Judul"` saat user memilih template di `/new`.
  - Pastikan judul proyek di `projectStore` otomatis diperbarui sesuai `companyName` / `productName` begitu pengguna mengisi konteks bisnis dan masuk ke Editor.
  - Jika draf baru dibuat dari pemilihan template (belum lengkap), pastikan navigasi kembali dari Dashboard / Sidebar mengarahkan ke Wizard Step 1 (`/new` dengan `step: 1`).


