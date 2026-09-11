import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PlusCircle,
  LayoutTemplate,
  ListOrdered,
  Columns2,
  Grid2X2,
  LayoutGrid,
  PhoneCall,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const CANONICAL_LAYOUT_OPTIONS = [
  {
    id: 'title_slide',
    name: 'Cover / Judul Utama',
    shortName: 'Cover',
    icon: LayoutTemplate,
    description: 'Slide pembuka dengan judul besar, subjudul, dan gambar utama.',
    color: 'amber',
  },
  {
    id: 'title_bullets',
    name: 'Poin Penjelasan & Visual',
    shortName: 'Poin',
    icon: ListOrdered,
    description: 'Daftar bullet point strategis disertai foto/ilustrasi pendukung.',
    color: 'sky',
  },
  {
    id: 'two_column',
    name: 'Komparasi 2 Kolom',
    shortName: '2 Kolom',
    icon: Columns2,
    description: 'Perbandingan dua pilar utama, keunggulan, atau sisi strategis.',
    color: 'emerald',
  },
  {
    id: 'metrics_grid',
    name: 'Grid 4 Metrik',
    shortName: 'Metrik',
    icon: Grid2X2,
    description: 'Empat kotak statistik angka pertumbuhan, omzet, atau KPI utama.',
    color: 'violet',
  },
  {
    id: 'card_grid',
    name: 'Bento / Kartu Grid',
    shortName: 'Kartu',
    icon: LayoutGrid,
    description: 'Empat kartu modular untuk katalog produk, layanan, atau tim.',
    color: 'orange',
  },
  {
    id: 'contact_closing',
    name: 'Penutup & Kontak',
    shortName: 'Kontak',
    icon: PhoneCall,
    description: 'Slide penutup dengan ajakan bertindak (CTA) dan kontak resmi.',
    color: 'rose',
  },
];

export default function AddSlideModal({ open, onOpenChange, onAddSlide, brandKit }) {
  const [selectedLayoutId, setSelectedLayoutId] = useState('title_bullets');
  const [customTitle, setCustomTitle] = useState('');

  const primary = brandKit?.primaryColor || '#0F4C81';
  const accent = brandKit?.accentColor || '#F2A007';

  const handleConfirm = (e) => {
    e?.preventDefault();
    onAddSlide(selectedLayoutId, customTitle.trim() || undefined);
    setCustomTitle('');
    setSelectedLayoutId('title_bullets');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-[#0B1220] border border-slate-700/70 text-slate-100 shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleConfirm}>
          <DialogHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white tracking-tight">
                  Pilih Template Layout Slide Baru
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400">
                  Pilih satu dari 6 template layout kanonikal standar PitchKu 16:9.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Grid of 6 layout options */}
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CANONICAL_LAYOUT_OPTIONS.map((layout) => {
                const isSelected = selectedLayoutId === layout.id;
                const Icon = layout.icon;

                return (
                  <div
                    key={layout.id}
                    onClick={() => setSelectedLayoutId(layout.id)}
                    className={cn(
                      'relative flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none text-left',
                      isSelected
                        ? 'bg-sky-950/40 border-sky-400 ring-2 ring-sky-400/40 shadow-lg shadow-sky-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center border',
                            isSelected
                              ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{layout.name}</p>
                          <span className="text-[10px] text-slate-500 font-mono uppercase">
                            {layout.id}
                          </span>
                        </div>
                      </div>

                      {/* Selected check indicator */}
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Mini layout schematic preview */}
                    <div
                      className="w-full h-14 rounded-lg my-2.5 p-1.5 flex flex-col justify-between relative overflow-hidden border border-slate-700/40 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, ${primary}33 0%, #050A14 100%)`,
                      }}
                    >
                      <div className="w-5 h-0.5 rounded-full" style={{ background: accent }} />
                      <div className="h-1 bg-white/70 rounded-full w-2/3" />

                      {layout.id === 'title_slide' && (
                        <div className="absolute right-1 top-1 bottom-1 w-1/3 bg-white/10 rounded border border-white/15" />
                      )}
                      {layout.id === 'title_bullets' && (
                        <div className="flex flex-col gap-0.5">
                          <div className="h-0.5 bg-white/30 rounded w-1/2" />
                          <div className="h-0.5 bg-white/30 rounded w-1/3" />
                        </div>
                      )}
                      {layout.id === 'two_column' && (
                        <div className="flex gap-1 h-5">
                          <div className="flex-1 bg-white/10 rounded" />
                          <div className="flex-1 bg-white/10 rounded" />
                        </div>
                      )}
                      {layout.id === 'metrics_grid' && (
                        <div className="grid grid-cols-2 gap-1 h-6">
                          <div className="bg-white/15 rounded flex items-center justify-center text-[7px] text-amber-400 font-bold">+00%</div>
                          <div className="bg-white/10 rounded" />
                        </div>
                      )}
                      {layout.id === 'card_grid' && (
                        <div className="grid grid-cols-2 gap-1 h-6">
                          <div className="bg-white/10 rounded" />
                          <div className="bg-white/10 rounded" />
                        </div>
                      )}
                      {layout.id === 'contact_closing' && (
                        <div className="flex justify-center gap-1">
                          <div className="h-2 w-10 bg-white/20 rounded" />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {layout.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Optional Title Input */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                Judul Slide (Opsional)
              </label>
              <Input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                maxLength={60}
                placeholder="Contoh: Rencana Strategis & Target Q3 (Opsional)"
                className="bg-slate-950/80 border-slate-700/80 text-white text-xs h-9 placeholder:text-slate-500 focus:border-sky-400"
              />
              <p className="text-[10px] text-slate-500">
                Jika dikosongkan, judul bawaan template akan digunakan dan dapat diedit kapan saja.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4"
            >
              Sisipkan Slide
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
