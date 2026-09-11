import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';

// Dynamic fields per template type based on spec (FR-02.2)
const TEMPLATE_FIELDS = {
  company_profile: [
    { key: 'companyName', label: 'Nama Perusahaan / Usaha', type: 'text', placeholder: 'PT Kopi Nusantara Indonesia' },
    { key: 'industry', label: 'Industri / Sektor', type: 'text', placeholder: 'F&B, Manufaktur, Retail, dll.' },
    { key: 'yearFounded', label: 'Tahun Berdiri', type: 'text', placeholder: '2019' },
    { key: 'teamSize', label: 'Jumlah Karyawan', type: 'text', placeholder: '15 orang' },
  ],
  penawaran_produk: [
    { key: 'productName', label: 'Nama Produk / SKU', type: 'text', placeholder: 'Kopi Arabika Gayo Premium 250g' },
    { key: 'price', label: 'Harga Satuan (Rp)', type: 'text', placeholder: 'Rp 85.000' },
    { key: 'moq', label: 'Minimum Order (MOQ)', type: 'text', placeholder: '100 pcs' },
    { key: 'margin', label: 'Margin Reseller (%)', type: 'text', placeholder: '25%' },
  ],
  proposal_kerjasama: [
    { key: 'partnerTarget', label: 'Target Mitra / Lembaga', type: 'text', placeholder: 'PT Bank Mandiri, Alfamart, dll.' },
    { key: 'investmentValue', label: 'Nilai Investasi / Kerjasama', type: 'text', placeholder: 'Rp 500.000.000' },
    { key: 'roiProjection', label: 'Proyeksi ROI (%)', type: 'text', placeholder: '35% per tahun' },
    { key: 'cooperationScheme', label: 'Skema Kerja Sama', type: 'text', placeholder: 'Bagi hasil 60:40, Franchise, dll.' },
  ],
  laporan_ringkas: [
    { key: 'reportPeriod', label: 'Periode Laporan', type: 'text', placeholder: 'Q1 2026 (Jan - Mar)' },
    { key: 'revenue', label: 'Total Omzet (Rp)', type: 'text', placeholder: 'Rp 1.200.000.000' },
    { key: 'profitLoss', label: 'Laba / Rugi Bersih', type: 'text', placeholder: 'Rp 180.000.000' },
    { key: 'kpiHighlight', label: 'KPI Highlight', type: 'text', placeholder: 'Customer retention 92%, Growth 15% MoM' },
  ],
};

const RAW_TEXT_MIN = 50;
const RAW_TEXT_MAX = 2000;

export default function BusinessContextForm({
  templateId,
  formData,
  onFormDataChange,
  rawText,
  onRawTextChange,
}) {
  const fields = TEMPLATE_FIELDS[templateId] || [];
  const rawLen = (rawText || '').length;

  const isRawTooShort = rawLen > 0 && rawLen < RAW_TEXT_MIN;
  const isRawValid = rawLen >= RAW_TEXT_MIN && rawLen <= RAW_TEXT_MAX;
  const isRawTooLong = rawLen > RAW_TEXT_MAX;

  const getCounterColor = () => {
    if (isRawTooShort || isRawTooLong) return 'text-red-400';
    if (isRawValid) return 'text-emerald-400';
    return 'text-slate-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
          LANGKAH KEDUA
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Isi Konteks Bisnis
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Lengkapi informasi spesifik sesuai template yang Anda pilih.
          AI akan menggunakan data ini untuk menyusun pitch deck yang relevan.
        </p>
      </div>

      {/* Dynamic Form Fields */}
      <Card className="bg-[#0B111E]/80 border border-slate-800/90 max-w-3xl mx-auto">
        <CardContent className="p-6 space-y-5">
          {/* Section label */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-sm font-semibold text-white">
              Detail Template
            </span>
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label
                  htmlFor={`wizard-${field.key}`}
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  {field.label}
                </label>
                <Input
                  id={`wizard-${field.key}`}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ''}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      [field.key]: e.target.value,
                    })
                  }
                  className="bg-slate-900/60 border-slate-700/60 text-white placeholder:text-slate-600 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Raw Text Material Area */}
      <Card className="bg-[#0B111E]/80 border border-slate-800/90 max-w-3xl mx-auto">
        <CardContent className="p-6 space-y-4">
          {/* Section label */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-sm font-semibold text-white">
              Materi Mentah
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Tulis narasi, catatan, atau deskripsi usaha Anda dengan bahasa kasual.
            AI akan memformatnya menjadi konten pitch deck yang terstruktur.
          </p>

          <div className="relative">
            <textarea
              id="wizard-raw-text"
              rows={8}
              value={rawText || ''}
              onChange={(e) => onRawTextChange(e.target.value)}
              placeholder="Contoh: Usaha kami bergerak di bidang kopi specialty. Kami memproses biji kopi dari petani langsung di Aceh Gayo dengan sistem fair trade. Target market kami adalah kafe premium di Jakarta dan ekspor ke Singapura..."
              className="w-full rounded-lg border bg-slate-900/60 border-slate-700/60 text-white placeholder:text-slate-600 text-sm leading-relaxed p-4 resize-none outline-none transition-colors focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
            />

            {/* Character counter */}
            <div className="flex items-center justify-between mt-2">
              {/* Validation messages */}
              <div className="flex items-center gap-1.5">
                {isRawTooShort && (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs text-red-400">
                      Minimal {RAW_TEXT_MIN} karakter diperlukan
                    </span>
                  </>
                )}
                {isRawTooLong && (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs text-red-400">
                      Maksimal {RAW_TEXT_MAX} karakter
                    </span>
                  </>
                )}
                {isRawValid && (
                  <span className="text-xs text-emerald-400">✓ Panjang teks sesuai</span>
                )}
              </div>

              {/* Counter */}
              <span className={`text-xs font-mono tabular-nums ${getCounterColor()}`}>
                {rawLen} / {RAW_TEXT_MAX}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
