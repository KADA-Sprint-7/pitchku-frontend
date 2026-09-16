# Proposal: Fix PitchKu Frontend Issues and Improve User Experience

## Intent
Memperbaiki 5 masalah utama UX, alur autentikasi session, validasi form wizard, dan manajemen draf proyek pada PitchKu Frontend serta menyelaraskan penanganan endpoint API backend.

## Scope & Impact
1. **FAQ Scroll Reset**: Menjamin navigasi ke halaman FAQ selalu mereset posisi scroll layar ke paling atas.
2. **Auth Session Auto-Redirect**: Pengguna yang memiliki sesi Supabase aktif tidak perlu login ulang dan otomatis dialihkan dari `/login` / `/register` ke `/dashboard`.
3. **Kontekstualisasi Slide & Info Dasar Perusahaan**: Menjamin field Nama Usaha, Tahun Berdiri, dan Industri selalu ada dan terintegrasi ke seluruh template slide.
4. **Input Periode Laporan (Range Date)**: Mengubah dropdown statistik periode laporan pada template `laporan_ringkas` menjadi Date Range input (Tanggal Mulai s/d Tanggal Selesai).
5. **Auto-Save Draf Proyek & Navigasi**: Menyimpan otomatis draf proyek ("Untitled Slide") saat pengguna memilih template atau berpindah halaman di Wizard, serta mengarahkan pembukaan draf yang belum lengkap kembali ke langkah Wizard yang sesuai.
6. **Integrasi Endpoint REST Backend**: Menyesuaikan dan menjaga konsistensi panggilan REST API backend sesuai skema `CLAUDE.md` / `ARCHITECTURE.md`.
