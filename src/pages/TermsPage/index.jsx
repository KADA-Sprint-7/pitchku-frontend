import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Shield, ArrowLeft } from "lucide-react";

const TERMS = [
  {
    title: "1. Penerimaan Syarat",
    body: `Dengan mendaftar atau menggunakan layanan PitchKu, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, harap jangan menggunakan layanan kami.`,
  },
  {
    title: "2. Deskripsi Layanan",
    body: `PitchKu adalah platform generator presentasi bisnis berbasis kecerdasan buatan (AI) yang dirancang khusus untuk pelaku usaha mikro, kecil, dan menengah (UMKM) di Indonesia. Layanan mencakup pembuatan kerangka slide, pengisian konten otomatis, dan ekspor file dalam format .pptx yang dapat diedit penuh.`,
  },
  {
    title: "3. Akun Pengguna",
    body: `Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun (email dan kata sandi) Anda. Anda juga bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda. Segera beritahukan kami jika Anda mencurigai adanya penggunaan akun yang tidak sah.`,
  },
  {
    title: "4. Penggunaan yang Diizinkan",
    body: `Anda setuju untuk menggunakan layanan PitchKu hanya untuk tujuan yang sah dan sesuai hukum. Anda dilarang menggunakan layanan untuk: (a) menyebarkan konten palsu, menyesatkan, atau melanggar hukum; (b) menyalin, mendistribusikan ulang, atau menjual layanan tanpa izin tertulis dari PitchKu; (c) upaya pembobolan sistem atau pengujian keamanan tanpa izin.`,
  },
  {
    title: "5. Konten Pengguna",
    body: `Anda memiliki hak atas semua data dan deskripsi bisnis yang Anda masukkan ke dalam PitchKu. Dengan menggunakan layanan kami, Anda memberikan izin terbatas kepada PitchKu untuk memproses konten tersebut semata-mata untuk keperluan menghasilkan presentasi yang Anda minta. Kami tidak akan menggunakan konten bisnis Anda untuk tujuan pelatihan model AI tanpa persetujuan eksplisit Anda.`,
  },
  {
    title: "6. Privasi dan Keamanan Data",
    body: `PitchKu menerapkan Row Level Security (RLS) pada basis data dan enkripsi AES-256-bit serta SSL TLS pada seluruh transmisi data. Setiap proyek presentasi diisolasi sehingga hanya Anda yang dapat mengaksesnya. Kami tidak menjual data pribadi Anda kepada pihak ketiga.`,
  },
  {
    title: "7. Pembatasan Tanggung Jawab",
    body: `Layanan PitchKu disediakan "sebagaimana adanya" tanpa jaminan apa pun. PitchKu tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami, termasuk namun tidak terbatas pada kehilangan data, pendapatan, atau peluang bisnis.`,
  },
  {
    title: "8. Hak Kekayaan Intelektual",
    body: `Seluruh elemen desain, kode sumber, merek dagang, dan konten platform PitchKu adalah milik eksklusif PitchKu dan dilindungi oleh hukum kekayaan intelektual yang berlaku di Indonesia. Presentasi yang Anda hasilkan menggunakan layanan kami sepenuhnya menjadi milik Anda.`,
  },
  {
    title: "9. Perubahan Layanan dan Ketentuan",
    body: `PitchKu berhak mengubah, menangguhkan, atau menghentikan layanan atau bagian mana pun dari layanan kapan saja. Kami juga berhak memperbarui ketentuan ini sewaktu-waktu. Perubahan material akan diberitahukan melalui email atau pemberitahuan dalam aplikasi. Penggunaan berkelanjutan setelah perubahan berlaku merupakan penerimaan Anda atas ketentuan yang telah diperbarui.`,
  },
  {
    title: "10. Hukum yang Berlaku",
    body: `Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul dari atau sehubungan dengan ketentuan ini akan diselesaikan melalui mediasi terlebih dahulu sebelum dibawa ke pengadilan yang berwenang di Indonesia.`,
  },
];

function TermsPage() {
  usePageTitle("Syarat & Ketentuan – PitchKu");

  return (
    <div className="min-h-screen bg-[#070C15] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070C15]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold">
            Pitch<span className="text-amber-400">Ku</span>
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Pendaftaran
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Page title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Dokumen Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Syarat &amp; Ketentuan Penggunaan
          </h1>
          <p className="text-slate-400 text-sm">
            Terakhir diperbarui: <span className="text-slate-300">10 September 2026</span>
          </p>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-2xl">
            Dokumen ini mengatur hubungan antara Anda (pengguna) dan PitchKu sebagai penyedia layanan generator presentasi bisnis AI untuk UMKM Indonesia. Harap baca dengan saksama sebelum menggunakan layanan kami.
          </p>
        </div>

        {/* Terms sections */}
        <div className="space-y-8">
          {TERMS.map(({ title, body }) => (
            <section key={title} className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-6">
              <h2 className="text-base font-bold text-white mb-3">{title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors"
          >
            Saya Setuju – Buat Akun Sekarang
          </Link>
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            Kembali ke Beranda
          </Link>
        </div>

        {/* Footer note */}
        <div className="mt-10 flex items-center gap-2 text-xs text-slate-600">
          <Shield className="w-3.5 h-3.5" />
          <span>Dilindungi Enkripsi Supabase Auth 256-bit &amp; SSL TLS · © {new Date().getFullYear()} PitchKu</span>
        </div>
      </main>
    </div>
  );
}

export default TermsPage;
