## ADDED Requirements

### Requirement: FR-02.1 Pemilihan Template Bisnis
Sistem MUST mengharuskan pengguna memilih satu dari 4 template standar (`company_profile`, `penawaran_produk`, `proposal_kerjasama`, `laporan_ringkas`) sebelum dapat beralih ke form konteks bisnis.

#### Scenario: Menampilkan 4 pilihan template proporsional
- **WHEN** pengguna membuka halaman `/new` (Wizard Step 1)
- **THEN** sistem menampilkan 4 kartu template dengan aspek rasio proporsional 16:9, label judul, deskripsi singkat, dan tombol konfirmasi template.

#### Scenario: Memilih salah satu template
- **WHEN** pengguna mengklik salah satu template
- **THEN** template terpilih akan ditandai dengan border highlight/active state dan memungkinkan navigasi ke Step 2 (Form Konteks Bisnis).

### Requirement: FR-02.2 Formulir Konteks Bisnis Dinamis
Sistem MUST menyediakan formulir dengan panduan input yang menyesuaikan secara dinamis berdasarkan template terpilih, serta area input *free-text* materi mentah dengan batasan panjang teks 50 hingga 2.000 karakter.

#### Scenario: Form dinamis sesuai template
- **WHEN** pengguna berada di Step 2 dengan template `penawaran_produk`
- **THEN** formulir menampilkan bidang input spesifik seperti Harga, Minimum Order (MOQ), dan Margin Reseller.

#### Scenario: Validasi batas karakter materi mentah (terlalu pendek)
- **WHEN** pengguna menginput materi mentah kurang dari 50 karakter
- **THEN** sistem menampilkan pesan validasi error dan memblokir pengiriman formulir.

#### Scenario: Validasi batas karakter materi mentah (sesuai kriteria)
- **WHEN** pengguna menginput materi mentah antara 50 dan 2.000 karakter
- **THEN** indikator counter karakter berwarna hijau dan tombol submit form dapat diaktifkan.

### Requirement: Wizard Stepper Integration
Sistem MUST menampilkan progress bar 3-point hanya pada alur utama (Step 2 ke atas).

#### Scenario: Navigasi alur Wizard 3-point
- **WHEN** pengguna berada pada Step 2 dan seterusnya
- **THEN** progress bar 3-point (01 Input Konteks & Brand Kit, 02 Konfirmasi Outline, 03 Edit & Unduh PPTX) ditampilkan dengan penanda langkah aktif.
