import React from 'react';
import { Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TEMPLATES = [
  {
    badge: 'Tersering Dipakai',
    badgeStyle: 'bg-sky-500/90 text-white font-bold',
    title: '1. Company Profile',
    description:
      'Profil legalitas usaha, rekam jejak sertifikasi, kapasitas pabrik, visi kepemimpinan pendiri.',
    slidesCount: '10 Slide',
    tag: 'Kurasi BUMN',
    previewBg: 'bg-slate-950 border-slate-800',
    // Custom JSX placeholder graphic matching template 1
    renderGraphic: () => (
      <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-b from-slate-900 to-slate-950 text-white font-sans select-none">
        <div className="flex items-center justify-between text-[8px] text-slate-400 border-b border-slate-800 pb-1">
          <span className="font-bold text-sky-400">PITCHKU • DEMO</span>
          <span>Company Profile</span>
        </div>
        <div className="text-center py-2">
          <div className="inline-block px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[7px] rounded mb-1">
            UTAMA DELIGHTS
          </div>
          <div className="text-[10px] font-extrabold text-white">Company Profile</div>
          <div className="text-[7px] text-slate-400 max-w-[140px] mx-auto mt-0.5">
            Produsen Olahan Pangan Nusantara High-Quality
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 pt-1">
          <div className="bg-slate-800/80 rounded p-1 text-center">
            <div className="text-[8px] font-bold text-amber-400">100%</div>
            <div className="text-[6px] text-slate-400">Organik</div>
          </div>
          <div className="bg-slate-800/80 rounded p-1 text-center">
            <div className="text-[8px] font-bold text-sky-400">BPOM</div>
            <div className="text-[6px] text-slate-400">Terdaftar</div>
          </div>
          <div className="bg-slate-800/80 rounded p-1 text-center">
            <div className="text-[8px] font-bold text-emerald-400">20+</div>
            <div className="text-[6px] text-slate-400">Mitra</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    badge: 'Penjualan',
    badgeStyle: 'bg-amber-500 text-slate-950 font-bold',
    title: '2. Penawaran Produk',
    description:
      'Katalog SKU lengkap, simulasi margin reseller, ketentuan minimal pembelian (MOQ), dan logistik.',
    slidesCount: '8 Slide',
    tag: 'Ritel & Distributor',
    previewBg: 'bg-slate-100 border-slate-300',
    renderGraphic: () => (
      <div className="w-full h-full flex flex-col justify-between p-3 bg-slate-100 text-slate-900 font-sans select-none">
        <div className="flex items-center justify-between text-[8px] text-slate-500 border-b border-slate-200 pb-1">
          <span className="font-bold text-amber-600">KATALOG SKU</span>
          <span>Kopi Senja Premium</span>
        </div>
        <div className="flex items-center gap-2 py-1">
          <div className="w-10 h-10 bg-amber-200 rounded flex items-center justify-center text-amber-800 font-bold text-[8px]">
            KOPI
          </div>
          <div className="flex-1">
            <div className="text-[9px] font-bold text-slate-900">Varian Premium Cold Brew</div>
            <div className="text-[7px] text-slate-500 mt-0.5">MOQ: 100 Botol • Margin Reseller 35%</div>
            <div className="text-[8px] font-extrabold text-amber-600 mt-1">Rp 18.000 / Botol</div>
          </div>
        </div>
        <div className="bg-slate-200/80 rounded p-1.5 flex justify-between items-center text-[7px]">
          <span className="text-slate-600 font-medium">Estimasi Pengiriman: Jawa &amp; Bali</span>
          <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">Siap Order</span>
        </div>
      </div>
    ),
  },
  {
    badge: 'Investasi',
    badgeStyle: 'bg-emerald-500 text-slate-950 font-bold',
    title: '3. Proposal Kerja Sama',
    description:
      'Struktur bagi hasil, rencana belanja modal (Capex), pembagian risiko, serta klausal operasional.',
    slidesCount: '12 Slide',
    tag: 'B2B & Venture',
    previewBg: 'bg-slate-100 border-slate-300',
    renderGraphic: () => (
      <div className="w-full h-full flex flex-col justify-between p-3 bg-slate-50 text-slate-900 font-sans select-none">
        <div className="flex items-center justify-between text-[8px] text-slate-500 border-b border-slate-200 pb-1">
          <span className="font-bold text-emerald-600">INVESTASI</span>
          <span>Hospitality Partnership</span>
        </div>
        <div className="py-1">
          <div className="text-[9px] font-bold text-slate-900">Proyeksi Bagi Hasil (ROI 24 Bulan)</div>
          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
            <div className="bg-emerald-50 border border-emerald-200 rounded p-1">
              <div className="text-[7px] text-emerald-700 font-semibold">Investor (60%)</div>
              <div className="text-[8px] font-bold text-emerald-900">Rp 120 Juta / Thn</div>
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded p-1">
              <div className="text-[7px] text-slate-600 font-semibold">Pengelola (40%)</div>
              <div className="text-[8px] font-bold text-slate-900">Rp 80 Juta / Thn</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[7px] text-slate-500 pt-1">
          <span>Target Capex: Rp 350M</span>
          <span className="text-emerald-600 font-bold">Risk Protection 80%</span>
        </div>
      </div>
    ),
  },
  {
    badge: 'Akuntabilitas',
    badgeStyle: 'bg-sky-500 text-slate-950 font-bold',
    title: '4. Laporan Ringkas',
    description:
      'Ringkasan omzet bulanan, unit ekonomi, efisiensi bahan baku, dan target kuartal berikutnya.',
    slidesCount: '6 Slide',
    tag: 'KPI & Perbankan',
    previewBg: 'bg-slate-100 border-slate-300',
    renderGraphic: () => (
      <div className="w-full h-full flex flex-col justify-between p-3 bg-slate-900 text-white font-sans select-none">
        <div className="flex items-center justify-between text-[8px] text-slate-400 border-b border-slate-800 pb-1">
          <span className="font-bold text-sky-400">FINANCIAL REPORT</span>
          <span>Kuartal IV 2025</span>
        </div>
        <div className="grid grid-cols-3 gap-1 py-1">
          <div className="bg-slate-800 p-1 rounded text-center">
            <div className="text-[6px] text-slate-400">Omzet</div>
            <div className="text-[8px] font-bold text-emerald-400">Rp 1.45M</div>
            <div className="text-[5px] text-emerald-300">↑ +22.5%</div>
          </div>
          <div className="bg-slate-800 p-1 rounded text-center">
            <div className="text-[6px] text-slate-400">Margin Net</div>
            <div className="text-[8px] font-bold text-sky-400">22.5%</div>
            <div className="text-[5px] text-sky-300">↑ Stable</div>
          </div>
          <div className="bg-slate-800 p-1 rounded text-center">
            <div className="text-[6px] text-slate-400">EBITDA</div>
            <div className="text-[8px] font-bold text-amber-400">Rp 480M</div>
            <div className="text-[5px] text-amber-300">↑ +14%</div>
          </div>
        </div>
        <div className="flex items-end justify-between gap-1 h-6 pt-1">
          <div className="w-full bg-sky-500 h-3 rounded-t"></div>
          <div className="w-full bg-sky-500 h-4 rounded-t"></div>
          <div className="w-full bg-sky-500 h-5 rounded-t"></div>
          <div className="w-full bg-emerald-400 h-6 rounded-t"></div>
        </div>
      </div>
    ),
  },
];

export default function TemplateCatalogue() {
  return (
    <section
      id="pilihan-templat"
      className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Hidden anchor element for katalog-template link from HeroSection */}
      <div id="katalog-template" className="absolute -top-24 left-0" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-3">
            KATALOG TERKURASI
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            4 Template Khusus Kebutuhan Riil UMKM
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Format telah disesuaikan dengan formulir evaluasi perbankan, inkubator BUMN, hingga proposal ritel minimarket modern.
          </p>
        </div>

        {/* Replaced top right action label */}
        <div className="shrink-0">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400">
            <span>4 Template Siap Pakai</span>
          </span>
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEMPLATES.map((item, index) => (
          <Card
            key={index}
            className="bg-[#0B111E]/80 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-xl flex flex-col justify-between group"
          >
            <CardContent className="p-4 space-y-4 flex-1 flex flex-col justify-between">
              {/* Top Graphic Placeholder Container */}
              <div className={`relative h-44 rounded-xl border overflow-hidden ${item.previewBg}`}>
                {/* Category Badge on Top Left of Preview */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] tracking-wide uppercase shadow-md ${item.badgeStyle}`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Graphic render */}
                <div className="w-full h-full pt-6">
                  {item.renderGraphic()}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 pt-1 flex-1">
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-sky-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Footer Info */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>{item.slidesCount}</span>
                </div>
                <span className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded-md font-medium">
                  {item.tag}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
