import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Palette, Upload, Image as ImageIcon, Type, Sparkles, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// 4 Preset tema siap pakai
export const COLOR_PRESETS = [
  {
    id: 'corporate_classic',
    name: 'Corporate Classic',
    primary: '#0F4C81',
    primaryLabel: 'Deep Blue',
    accent: '#F2A007',
    accentLabel: 'Amber Gold',
  },
  {
    id: 'emerald_growth',
    name: 'Emerald Growth',
    primary: '#064E3B',
    primaryLabel: 'Forest Green',
    accent: '#10B981',
    accentLabel: 'Emerald',
  },
  {
    id: 'modern_sunset',
    name: 'Modern Sunset',
    primary: '#831843',
    primaryLabel: 'Deep Rose',
    accent: '#F97316',
    accentLabel: 'Vibrant Orange',
  },
  {
    id: 'tech_monochrome',
    name: 'Tech Navy',
    primary: '#0F172A',
    primaryLabel: 'Slate Navy',
    accent: '#38BDF8',
    accentLabel: 'Sky Blue',
  },
];

// Opsi font dasar standar yang aman
export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Rekomendasi Default)' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Geist', label: 'Geist Sans' },
];

const HEX_REGEX = /^#([A-Fa-f0-9]{6})$/;

export default function BrandKitSelector({ brandKit, onBrandKitChange }) {
  const fileInputRef = useRef(null);

  const primaryValid = HEX_REGEX.test(brandKit.primaryColor || '');
  const accentValid = HEX_REGEX.test(brandKit.accentColor || '');

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Ukuran file terlalu besar', {
        description: 'Maksimal ukuran logo adalah 2MB.',
      });
      return;
    }

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak didukung', {
        description: 'Gunakan format PNG, JPG, atau SVG.',
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const sizeInKB = Math.round(file.size / 1024);

    onBrandKitChange({
      ...brandKit,
      logoUrl: objectUrl,
      logoFile: file,
      logoName: file.name,
      logoSize: `${sizeInKB} KB`,
    });

    toast.success('Logo berhasil diunggah', {
      description: `${file.name} (${sizeInKB} KB) siap digunakan.`,
    });
  };

  const handleApplyPreset = (preset) => {
    onBrandKitChange({
      ...brandKit,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      presetId: preset.id,
    });
  };

  return (
    <Card className="bg-[#0B111E]/90 border border-slate-800/90 shadow-xl">
      <CardContent className="p-6 space-y-6">
        {/* Card Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
            <Palette className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Brand Kit Visual
            </h3>
            <p className="text-xs text-slate-400">
              Identitas visual otomatis disematkan ke seluruh slide pitch deck
            </p>
          </div>
        </div>

        {/* ── 1. Unggah Logo Usaha ──────────────────────────────────── */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Logo Perusahaan (PNG Transparan)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleLogoUpload}
            className="hidden"
          />

          {brandKit.logoUrl ? (
            /* Uploaded Logo Box (matching screenshot) */
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 p-1">
                  <img
                    src={brandKit.logoUrl}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {brandKit.logoName || 'logo_usaha.png'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {brandKit.logoSize || '280 KB'} •{' '}
                    <span className="text-emerald-400">Siap dimasukkan ke slide</span>
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
              >
                Ganti Logo
              </Button>
            </div>
          ) : (
            /* Empty Upload Dropzone */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-slate-700/80 hover:border-amber-500/60 bg-slate-900/40 hover:bg-slate-900/60 transition-all cursor-pointer group text-center"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-300">
                Klik untuk unggah logo bisnis
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PNG, JPG, atau SVG (Maks. 2MB)
              </p>
            </div>
          )}
        </div>

        {/* ── 2. Preset Tema Warna ─────────────────────────────────── */}
        <div className="space-y-3 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Preset Tema Cepat
            </label>
            <span className="text-[11px] text-slate-500">4 Pilihan Harmonis</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {COLOR_PRESETS.map((preset) => {
              const isSelected =
                brandKit.primaryColor?.toLowerCase() === preset.primary.toLowerCase() &&
                brandKit.accentColor?.toLowerCase() === preset.accent.toLowerCase();

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-amber-400/80 ring-1 ring-amber-400/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center -space-x-1 shrink-0">
                    <div
                      className="w-4 h-4 rounded-full border border-slate-950 shadow-sm"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-slate-950 shadow-sm"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-slate-200 truncate">
                      {preset.name}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. Pemilih Warna Kustom (Primary & Accent) ───────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Primary Color Card */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Warna Utama Deck
            </label>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <label
                className="w-11 h-11 rounded-lg shrink-0 cursor-pointer shadow-md border border-white/10 relative overflow-hidden transition-transform hover:scale-105"
                style={{ backgroundColor: brandKit.primaryColor || '#0F4C81' }}
                title="Pilih Warna Utama"
              >
                <input
                  type="color"
                  value={primaryValid ? brandKit.primaryColor : '#0F4C81'}
                  onChange={(e) =>
                    onBrandKitChange({
                      ...brandKit,
                      primaryColor: e.target.value.toUpperCase(),
                    })
                  }
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </label>

              <div className="min-w-0 flex-1">
                <Input
                  type="text"
                  maxLength={7}
                  value={brandKit.primaryColor || ''}
                  onChange={(e) =>
                    onBrandKitChange({
                      ...brandKit,
                      primaryColor: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="#0F4C81"
                  className="h-8 font-mono text-xs text-white bg-slate-950/80 border-slate-700/80 uppercase"
                />
                <p className="text-[10px] text-slate-400 mt-1">Judul & elemen dominan</p>
              </div>
            </div>
            {!primaryValid && (
              <p className="text-[10px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Format HEX tidak valid (e.g. #0F4C81)
              </p>
            )}
          </div>

          {/* Accent Color Card */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Warna Aksen / Callout
            </label>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <label
                className="w-11 h-11 rounded-lg shrink-0 cursor-pointer shadow-md border border-white/10 relative overflow-hidden transition-transform hover:scale-105"
                style={{ backgroundColor: brandKit.accentColor || '#F2A007' }}
                title="Pilih Warna Aksen"
              >
                <input
                  type="color"
                  value={accentValid ? brandKit.accentColor : '#F2A007'}
                  onChange={(e) =>
                    onBrandKitChange({
                      ...brandKit,
                      accentColor: e.target.value.toUpperCase(),
                    })
                  }
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </label>

              <div className="min-w-0 flex-1">
                <Input
                  type="text"
                  maxLength={7}
                  value={brandKit.accentColor || ''}
                  onChange={(e) =>
                    onBrandKitChange({
                      ...brandKit,
                      accentColor: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="#F2A007"
                  className="h-8 font-mono text-xs text-white bg-slate-950/80 border-slate-700/80 uppercase"
                />
                <p className="text-[10px] text-slate-400 mt-1">Garis, kartu & highlight</p>
              </div>
            </div>
            {!accentValid && (
              <p className="text-[10px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Format HEX tidak valid (e.g. #F2A007)
              </p>
            )}
          </div>
        </div>

        {/* ── 4. Font Dasar (Typography) ──────────────────────────── */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-sky-400" />
              Font Dasar (Tipografi)
            </label>
            <span className="text-[11px] text-slate-500">Aman di PPTX / Slides</span>
          </div>

          <Select
            value={brandKit.fontFamily || 'Inter'}
            onValueChange={(val) => onBrandKitChange({ ...brandKit, fontFamily: val })}
          >
            <SelectTrigger className="w-full bg-slate-900/90 border-slate-700/80 text-white text-xs h-10 px-3 cursor-pointer">
              <SelectValue placeholder="Pilih Font Dasar" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value} className="text-xs">
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-[11px] text-slate-500 leading-normal">
            Font standar memastikan teks tampil konsisten tanpa tergeser saat dibuka di PowerPoint maupun Google Slides.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
