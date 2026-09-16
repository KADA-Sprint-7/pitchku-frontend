# Technical Design: PitchKu UX & Auth Fixes

## Context
PitchKu Frontend membutuhkan penyesuaian pada alur autentikasi session, navigasi Halaman FAQ, formulir Wizard (input date range & basic business info), serta manajemen draf otomatis di local store.

## Goals / Non-Goals

**Goals:**
- Reset scroll otomatis saat membuka FAQ.
- Auto-redirect pengguna ber-session aktif ke `/dashboard`.
- Mengubah `reportPeriod` pada template `laporan_ringkas` menjadi Date Range input (Date Start & Date End).
- Menjamin field basic perusahaan (`companyName`, `yearFounded`, `industry`) selalu tersedia dan dipakai di semua template slide.
- Menyimpan draf proyek secara otomatis saat memilih template/mengisi wizard, serta mengarahkan draf yang belum lengkap ke Wizard.

**Non-Goals:**
- Mengubah arsitektur utama Supabase Auth atau backend REST.
- Membuat endpoint backend PPTX / PDF baru.

## Decisions
1. **FAQ Scroll Reset**: Gunakan `useEffect` dengan `window.scrollTo(0, 0)` pada mount `FAQPage`.
2. **Auth Session Redirect**: Tambahkan check session di `AuthLayout` atau halaman `/login` dan `/register` untuk mengalihkan ke `/dashboard` jika `user` ada.
3. **Date Range Picker**: Update `TEMPLATE_FIELDS.laporan_ringkas` di `BusinessContextForm.jsx` agar menggunakan dua field tanggal (`startDate` & `endDate`) atau custom date range input.
4. **Basic Info Normalization**: Update `TEMPLATE_FIELDS` agar `companyName`, `industry`, dan `yearFounded` menjadi field umum yang disertakan di `mockContentForLayout` dan `deckPayloadGenerator`.
5. **Draft Auto-Save**: Di `WizardPage`, panggil `projectStore.createProjectDraft` / `updateProjectData` saat template dipilih, dan atur judul fallback `"Untitled Deck"` bila `companyName` belum diisi.

## Risks / Trade-offs
- **[Risk]** Data draf menumpuk di local storage → **Mitigasi**: Batasi penciptaan draf baru dan timpa draf aktif berdasarkan `projectId`.
