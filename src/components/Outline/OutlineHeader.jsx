import React from 'react';
import { Sparkles, RotateCcw, Plus, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TEMPLATE_NAMES = {
  company_profile: 'Company Profile',
  penawaran_produk: 'Penawaran Produk',
  proposal_kerjasama: 'Proposal Kerja Sama',
  laporan_ringkas: 'Laporan Ringkas',
};

export default function OutlineHeader({
  totalSlides,
  templateId,
  onResetDefault,
  onOpenAddSlide,
}) {
  const templateName = TEMPLATE_NAMES[templateId] || 'Company Profile';

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Sparkles className="w-3 h-3" />
            AI Deck Structuring
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Konfirmasi & Atur Urutan Slide
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
          Tinjau judul dan susunan slide hasil rumusan AI. Anda dapat mengubah teks judul dan mengatur ulang urutan bab.
        </p>
      </div>

      {/* Toolbar Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-[#0B111E]/80 border border-slate-800/90 shadow-sm">
        {/* Left Stats & Category */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            Total: {totalSlides} Slide Terstruktur
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs">
            <span className="text-slate-500">Kategori:</span>
            <span className="font-semibold text-slate-200">{templateName}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetDefault}
            className="bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white text-xs h-9 px-3 gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Susunan Default
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onOpenAddSlide}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs h-9 px-3.5 gap-1.5 cursor-pointer shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Tambah Bab Baru
          </Button>
        </div>
      </div>
    </div>
  );
}
