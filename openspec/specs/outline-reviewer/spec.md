# outline-reviewer Specification

## Purpose
TBD - created by archiving change ui-outline-reviewer. Update Purpose after archive.
## Requirements
### Requirement: FR-03.1 Peninjauan Kerangka Slide AI
Sistem MUST menampilkan daftar kerangka slide hasil rumusan AI (8–10 slide) lengkap dengan nomor urut bab, teks judul slide, objektif singkat isi slide, dan badge rekomendasi layout kanonikal.

#### Scenario: Menampilkan Kerangka Slide Awal
- **WHEN** pengguna diarahkan ke `/outline/:projectId` setelah menyelesaikan form konteks bisnis
- **THEN** sistem merender daftar kartu slide terstruktur lengkap dengan header metrik jumlah slide dan kategori template terpilih

### Requirement: FR-03.2 Pengeditan Teks Judul Slide Inline
Sistem MUST mengizinkan pengguna untuk mengedit judul slide secara langsung (*inline editing*) dengan batasan maksimal 60 karakter.

#### Scenario: Mengubah Teks Judul Slide
- **WHEN** pengguna mengetikkan teks baru pada kolom judul kartu slide
- **THEN** teks judul diperbarui secara real-time dan ditandai flag `isEdited: true` jika berbeda dari judul default AI
- **WHEN** pengguna memasukkan judul lebih dari 60 karakter
- **THEN** sistem membatasi input atau menampilkan indikator peringatan panjang karakter

### Requirement: FR-03.3 Pengaturan Urutan Slide (Reordering)
Sistem MUST menyediakan kemampuan memindahkan posisi atau urutan slide menggunakan drag-and-drop handle (`GripVertical`) dan secara otomatis memperbarui penomoran slide 1..N.

#### Scenario: Menyeret Kartu Slide untuk Mengubah Urutan
- **WHEN** pengguna menyeret kartu slide ke posisi baru
- **THEN** susunan array slide diperbarui dan penomoran bab (`01 - Cover`, `02 - ...`) disesuaikan secara berurutan

### Requirement: FR-03.4 Manajemen Kartu Slide (Tambah, Duplikasi, Hapus, Reset)
Sistem MUST menyediakan aksi penambahan slide baru, duplikasi slide yang sudah ada, penghapusan slide (dengan batas minimal 3 slide), serta reset ke susunan awal AI.

#### Scenario: Menambah Slide Baru
- **WHEN** pengguna mengklik tombol `+ Tambah Bab Baru`
- **THEN** dialog input muncul untuk menentukan judul dan tipe bab, lalu menyisipkannya ke akhir daftar slide

#### Scenario: Menduplikasi Slide
- **WHEN** pengguna mengklik ikon salin/duplikasi pada salah satu kartu slide
- **THEN** slide baru disisipkan tepat setelah slide tersebut dengan teks `(Salinan)`

#### Scenario: Menghapus Slide
- **WHEN** pengguna mengklik ikon tong sampah pada kartu slide dan total slide > 3
- **THEN** slide tersebut dihapus dan penomoran slide yang tersisa dihitung ulang

#### Scenario: Reset Susunan Default
- **WHEN** pengguna mengklik tombol `↺ Reset Susunan Default`
- **THEN** susunan slide dikembalikan ke daftar kerangka awal yang dirumuskan oleh AI

### Requirement: FR-03.5 Finalisasi Kerangka dan Transisi ke Editor
Sistem MUST memvalidasi kerangka slide yang telah disetujui pengguna, menyimpan draf proyek terkonfirmasi, dan menavigasi ke Slide Editor (`/editor/:projectId`).

#### Scenario: Menyetujui Kerangka Slide
- **WHEN** pengguna mengklik tombol `Lanjut: Buat Isi Slide & Masuk Editor`
- **THEN** payload draf terkonfirmasi disimpan ke `projectStore` dan pengguna diarahkan ke `/editor/:projectId`

