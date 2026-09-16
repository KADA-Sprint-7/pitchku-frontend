import { useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Footer from "@/components/layout/Footer";

const FAQ_ITEMS = [
  {
    id: "item-1",
    question: "1. Apa itu PitchKu dan bagaimana cara kerjanya?",
    answer:
      "PitchKu adalah generator presentasi berbasis AI yang dirancang khusus untuk pelaku UMKM dan solopreneur Indonesia. Kamu cukup memasukkan deskripsi bisnis mentah (50–2.000 karakter), memilih template, dan AI akan menyusun kerangka serta isi slide terstruktur dalam waktu kurang dari 5 menit.",
  },
  {
    id: "item-2",
    question: "2. Apakah hasil ekspor PowerPoint (.pptx) benar-benar bisa diedit?",
    answer:
      "Ya, 100% bisa diedit penuh! PitchKu tidak menempelkan slide sebagai gambar statis. Teks, bentuk (shapes), dan kartu dirender sebagai objek native PowerPoint. Selain itu, sistem menerapkan aturan batas karakter (anti-overflow rule) sehingga tidak ada teks bertumpuk atau meluber saat dibuka di MS PowerPoint maupun Google Slides.",
  },
  {
    id: "item-3",
    question: "3. Template bisnis apa saja yang tersedia di PitchKu?",
    answer: (
      <div className="space-y-2">
        <p>
          PitchKu menyediakan 4 template bisnis lokal yang disesuaikan dengan kebutuhan umum UMKM Indonesia:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-300">
          <li>
            <strong className="text-white">Company Profile:</strong> Untuk mengenalkan profil usaha, visi-misi, dan keunggulan bisnis.
          </li>
          <li>
            <strong className="text-white">Penawaran Produk:</strong> Untuk menampilkan katalog produk, harga, MOQ, dan margin reseller.
          </li>
          <li>
            <strong className="text-white">Proposal Kerja Sama:</strong> Untuk penawaran kemitraan B2B, bagi hasil, dan investasi.
          </li>
          <li>
            <strong className="text-white">Laporan Ringkas:</strong> Untuk laporan penjualan bulanan, pencapaian, dan KPI usaha.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "item-4",
    question: "4. Bagaimana cara kerja penyesuaian merek (Brand Kit)?",
    answer:
      "Kamu dapat mengunggah logo usaha (format PNG/JPG/SVG, maks. 2MB) serta memilih warna primer dan warna aksen bisnis menggunakan kode HEX atau preset warna. Identitas merek ini akan otomatis terkunci dan diaplikasikan pada tampilan slide di web maupun pada elemen vektor file PPTX yang diekspor.",
  },
  {
    id: "item-5",
    question: "5. Apakah saya bisa mengubah isi slide yang dibuat oleh AI?",
    answer: (
      <div className="space-y-2">
        <p>
          Sangat bisa. PitchKu memberikan kontrol penuh melalui alur dua tahap (Two-Stage Generation):
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-300">
          <li>
            <strong className="text-white">Tahap 1 (Outline Reviewer):</strong> Kamu bisa mengubah judul, menggeser urutan, atau menghapus kerangka slide sebelum isi lengkap dibuat.
          </li>
          <li>
            <strong className="text-white">Tahap 2 (Web Editor):</strong> Kamu bisa mengedit teks langsung pada slide (in-place edit), mengganti gambar stok dari Unsplash/Pexels, atau mengunggah foto produkmu sendiri.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "item-6",
    question: "6. Berapa lama waktu yang dibutuhkan sampai slide siap diunduh?",
    answer:
      "Seluruh alur utama—mulai dari mengisi formulir, meninjau kerangka, hingga slide siap diedit dan diunduh—dirancang selesai dalam waktu maksimal 5 menit (dengan rata-rata di bawah 60 detik pada koneksi internet stabil).",
  },
  {
    id: "item-7",
    question: "7. Apakah data dan rencana bisnis saya aman di PitchKu?",
    answer:
      "Sangat aman. PitchKu menerapkan sistem keamanan basis data Row Level Security (RLS) pada Supabase. Setiap proyek dan konfigurasi merek diisolasi secara ketat, sehingga hanya kamu yang memiliki hak akses untuk membaca atau mengubah draf presentasimu.",
  },
];

export default function FAQPage() {
  usePageTitle("FAQ Page — PitchKu");

  // Reset scroll ke atas setiap kali halaman FAQ dibuka
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070C15] text-white">
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex-1 w-full">
        {/* Glow ambient background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[600px] h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Header Section */}
        <div className="text-center space-y-4 mb-12 sm:mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Pusat Bantuan &amp; Jawaban</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Pertanyaan yang Sering Diajukan
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Temukan jawaban lengkap seputar cara kerja AI PitchKu, ekspor PowerPoint, penyesuaian merek, hingga keamanan data usahamu.
          </p>
        </div>

        {/* Accordion List Component */}
        <div className="relative z-10">
          <Accordion type="single" collapsible defaultValue="item-1">
            {FAQ_ITEMS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
