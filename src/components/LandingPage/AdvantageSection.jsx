import React from 'react'
import { AlignLeft, FileEdit, Image as ImageIcon, Palette } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const ADVANTAGES = [
  {
    icon: AlignLeft,
    iconBg: 'bg-sky-500/10 border border-sky-500/20 text-sky-400',
    title: 'Zero Text Overflow',
    description:
      'Algoritma otomatis membatasi teks agar selalu proporsional dan tidak bertumpuk di layar proyeksi saat presentasi offline.',
  },
  {
    icon: FileEdit,
    iconBg: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
    title: 'PPTX Native Editable',
    description:
      'Setiap kotak teks, shape, dan ikon adalah objek vektor asli. Anda dapat mengubah angka dan kata sesuka hati tanpa kompromi.',
  },
  {
    icon: ImageIcon,
    iconBg: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
    title: 'Free Curated Stock Photos',
    description:
      'Akses foto berkualitas bertema industri Indonesia: dari perkebunan kopi, bengkel manufaktur, kuliner tradisional, hingga busana.',
  },
  {
    icon: Palette,
    iconBg: 'bg-purple-500/10 border border-purple-500/20 text-purple-400',
    title: 'Brand Kit Lock',
    description:
      'Warna primer, warna sekunder, dan logo brand terkunci otomatis di semua slide sehingga identitas bisnis Anda tetap konsisten.',
  },
];

export default function AdvantageSection() {
  return (
    <section id="keunggulan" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-3">
          STANDAR KUALITAS TERTINGGI
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Keunggulan Utama Teknologi Pitch<span className="text-pitchku-amber">Ku</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Mengapa ribuan pegiat usaha lokal meninggalkan cara lama pembuatan slide manual.
        </p>
      </div>

      {/* Advantage Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ADVANTAGES.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="bg-[#0B111E]/80 border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700/80 transition-all duration-300 shadow-lg group"
            >
              <CardContent className="p-0 space-y-4">
                {/* Icon Box */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.iconBg} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
