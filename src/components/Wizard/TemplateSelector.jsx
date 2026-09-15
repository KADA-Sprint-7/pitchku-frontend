import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  ShoppingBag,
  Handshake,
  FileBarChart,
  Check,
  Sparkles,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { diagnoseTemplate } from '@/lib/aiService';
import { toast } from 'sonner';

// Four standard business templates per FR-02.1
const TEMPLATES = [
  {
    id: 'company_profile',
    name: 'Company Profile',
    description:
      'Profil lengkap usaha UMKM — visi, misi, tim, portofolio, dan pencapaian utama.',
    icon: Building2,
    gradient: 'from-amber-500/20 via-amber-900/10 to-transparent',
    iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    accentRing: 'ring-amber-400/60',
    accentBorder: 'border-amber-500/40',
  },
  {
    id: 'penawaran_produk',
    name: 'Penawaran Produk',
    description:
      'Template penawaran produk & SKU — spesifikasi, harga, minimum order, dan margin reseller.',
    icon: ShoppingBag,
    gradient: 'from-orange-500/20 via-orange-900/10 to-transparent',
    iconBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    accentRing: 'ring-orange-400/60',
    accentBorder: 'border-orange-500/40',
  },
  {
    id: 'proposal_kerjasama',
    name: 'Proposal Kerjasama',
    description:
      'Usulan kerja sama & bagi hasil — skema investasi, proyeksi ROI, dan perjanjian mitra.',
    icon: Handshake,
    gradient: 'from-emerald-500/20 via-emerald-900/10 to-transparent',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    accentRing: 'ring-emerald-400/60',
    accentBorder: 'border-emerald-500/40',
  },
  {
    id: 'laporan_ringkas',
    name: 'Laporan Ringkas',
    description:
      'Laporan keuangan & akuntabilitas — ringkasan omzet, laba-rugi, dan indikator performa.',
    icon: FileBarChart,
    gradient: 'from-sky-500/20 via-sky-900/10 to-transparent',
    iconBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    accentRing: 'ring-sky-400/60',
    accentBorder: 'border-sky-500/40',
  },
];

export { TEMPLATES };

export default function TemplateSelector({ selectedId, onSelect }) {
  const [needText, setNeedText] = useState('');
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const handleDiagnose = async (e) => {
    e?.preventDefault();
    if (!needText.trim()) return;

    try {
      setDiagnosing(true);
      const result = await diagnoseTemplate(needText.trim());
      setDiagnosisResult(result);
      if (result.recommended) {
        onSelect(result.recommended);
        toast.success('Rekomendasi templat ditemukan!', {
          description: result.reason,
        });
      }
    } catch {
      toast.error('Gagal mendapatkan rekomendasi AI');
    } finally {
      setDiagnosing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
          LANGKAH PERTAMA
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Pilih Template Pitch Deck
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Mulai dengan memilih jenis template yang paling sesuai dengan kebutuhan bisnis Anda.
        </p>
      </div>

      {/* AI Template Diagnosis Box */}
      <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Belum tahu template mana yang pas? Tanya AI PitchKu
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cukup tulis 1 kalimat tentang apa yang sedang Anda butuhkan (contoh: <em>"aku pengen keripikku bisa masuk ke kafe-kafe"</em>).
              </p>
            </div>

            <form onSubmit={handleDiagnose} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Tulis kebutuhanmu di sini..."
                value={needText}
                onChange={(e) => setNeedText(e.target.value)}
                className="bg-slate-950/70 border-slate-700/80 text-white text-xs h-10 focus-visible:border-amber-400"
              />
              <Button
                type="submit"
                disabled={diagnosing || !needText.trim()}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs h-10 px-5 shrink-0 gap-2 disabled:opacity-50"
              >
                {diagnosing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Dapatkan Rekomendasi</span>
                  </>
                )}
              </Button>
            </form>

            {/* AI Diagnosis Recommendation Result */}
            {diagnosisResult && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/40 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Rekomendasi AI: {diagnosisResult.recommended?.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    Otomatis Dipilihkan
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {diagnosisResult.reason}
                </p>
                {diagnosisResult.askFor && diagnosisResult.askFor.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300 block mb-1">
                      Yang perlu Anda siapkan pada langkah berikutnya:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                      {diagnosisResult.askFor.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Cards Grid — 2x2 on md+, 1 col on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {TEMPLATES.map((tpl) => {
          const Icon = tpl.icon;
          const isSelected = selectedId === tpl.id;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              className="text-left focus:outline-none group"
            >
              <Card
                className={`
                  relative overflow-hidden transition-all duration-300 cursor-pointer
                  bg-[#0B111E]/80 border
                  ${
                    isSelected
                      ? `${tpl.accentBorder} ring-2 ${tpl.accentRing} shadow-lg`
                      : 'border-slate-800/90 hover:border-slate-700/80 shadow-xl'
                  }
                  hover:scale-[1.02] active:scale-[0.99]
                `}
              >
                {/* 16:9 aspect-ratio visual preview area */}
                <div className="relative aspect-video overflow-hidden rounded-t-xl">
                  {/* Gradient background per template */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tpl.gradient}`}
                  />

                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${tpl.iconBg}`}
                    >
                      <Icon className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Selected check indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-in zoom-in-50 duration-200">
                        <Check className="w-4 h-4 text-slate-950" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <CardContent className="p-5 space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Action indicator */}
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-xs font-medium transition-colors ${
                        isSelected ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ Terpilih' : 'Klik untuk memilih'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
