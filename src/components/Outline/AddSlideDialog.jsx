import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CANONICAL_LAYOUTS } from '@/lib/mockOutlineGenerator';
import { PlusCircle } from 'lucide-react';

export default function AddSlideDialog({ open, onOpenChange, onAddSlide }) {
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [layoutId, setLayoutId] = useState('two_column');

  const selectedLayout =
    CANONICAL_LAYOUTS.find((l) => l.id === layoutId) || CANONICAL_LAYOUTS[1];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddSlide({
      id: `slide-${Date.now()}`,
      title: title.trim(),
      objective: objective.trim() || 'Rincian materi slide kustom',
      suggestedLayout: selectedLayout.badge,
      layoutType: selectedLayout.id,
      isEdited: true,
    });

    setTitle('');
    setObjective('');
    setLayoutId('two_column');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100 sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                <PlusCircle className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-white">
                  Tambah Bab / Slide Baru
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400">
                  Sisipkan slide baru ke dalam struktur presentasi Anda.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            {/* Input Judul */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Judul Slide <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                maxLength={60}
                placeholder="Contoh: Analisis Kompetitor & Keunggulan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-950/80 border-slate-700/80 text-white text-xs h-10 placeholder:text-slate-600 focus-visible:border-sky-500"
                required
              />
              <div className="flex justify-end">
                <span className="text-[10px] font-mono text-slate-500">
                  {title.length}/60
                </span>
              </div>
            </div>

            {/* Input Objektif */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Objektif / Ringkasan Isi
              </label>
              <Input
                type="text"
                placeholder="Contoh: Membandingkan fitur utama dengan 3 kompetitor"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="bg-slate-950/80 border-slate-700/80 text-white text-xs h-10 placeholder:text-slate-600 focus-visible:border-sky-500"
              />
            </div>

            {/* Rekomendasi Layout */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Rekomendasi Layout
              </label>
              <Select value={layoutId} onValueChange={setLayoutId}>
                <SelectTrigger className="w-full bg-slate-950/80 border-slate-700/80 text-white text-xs h-10 px-3 cursor-pointer">
                  <SelectValue placeholder="Pilih Layout" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
                  {CANONICAL_LAYOUTS.map((layout) => (
                    <SelectItem key={layout.id} value={layout.id} className="text-xs">
                      {layout.badge} ({layout.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!title.trim()}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
            >
              Tambahkan Slide
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
