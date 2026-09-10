import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const STEPS = [
  {
    number: '01',
    numberStyle: 'bg-amber-500/10 border border-amber-500/30 text-amber-400',
    title: 'Input Deskripsi & Brand Kit',
    description:
      'Ketik narasi usaha dengan bahasa kasual, masukkan logo, dan tentukan skema warna bisnis. PitchKu memformatnya secara terstruktur.',
    feature: 'Otomatis terapkan palet identitas brand',
  },
  {
    number: '02',
    numberStyle: 'bg-sky-500/10 border border-sky-500/30 text-sky-400',
    title: 'Konfirmasi Outline AI (Stage 1)',
    description:
      'AI merumuskan daftar urutan slide yang logis. Anda bebas menambah, mengurangi poin, atau merombak bab sesuai target audiens pitching.',
    feature: 'Penyelarasan logika cerita bisnis UMKM',
  },
  {
    number: '03',
    numberStyle: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
    title: 'Edit & Unduh PPTX Asli (Stage 2)',
    description:
      'Slide siap pakai dibuat dalam hitungan detik. Buka dan sesuaikan teks langsung di PowerPoint atau Google Slides tanpa batas.',
    feature: 'File .pptx murni, bukan sekadar gambar flat',
  },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-3">
          ALUR KERJA SUPER CEPAT
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Presentasi Matang dalam 3 Langkah Mudah
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Dirancang khusus bagi pemilik usaha yang sibuk dan tidak memiliki waktu belajar software desain grafis rumit.
        </p>
      </div>

      {/* Steps Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step, index) => (
          <Card
            key={index}
            className="bg-[#0B111E]/80 border border-slate-800/90 rounded-2xl p-6 sm:p-7 hover:border-slate-700/80 transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <CardContent className="p-0 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Step Number Badge */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${step.numberStyle}`}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="pt-4 mt-auto">
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 px-3.5 py-3 text-xs font-medium text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400 stroke-[2.5]" />
                  <span>{step.feature}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
