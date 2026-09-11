import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, AlertCircle } from 'lucide-react';

// Opsi periode laporan keuangan
export const REPORT_PERIOD_OPTIONS = [
  { value: 'Q1 2026 (Jan - Mar)', label: 'Q1 2026 (Jan - Mar)' },
  { value: 'Q2 2026 (Apr - Jun)', label: 'Q2 2026 (Apr - Jun)' },
  { value: 'Q3 2026 (Jul - Sep)', label: 'Q3 2026 (Jul - Sep)' },
  { value: 'Q4 2026 (Okt - Des)', label: 'Q4 2026 (Okt - Des)' },
  { value: 'Semester 1 2026', label: 'Semester 1 2026' },
  { value: 'Semester 2 2026', label: 'Semester 2 2026' },
  { value: 'Tahun Penuh 2025', label: 'Tahun Penuh 2025' },
  { value: 'Bulanan / Kustom', label: 'Bulanan / Kustom' },
];

// Definisi konfigurasi field per template beserta tipe dan validator
export const TEMPLATE_FIELDS = {
  company_profile: [
    {
      key: 'companyName',
      label: 'Nama Perusahaan / Usaha',
      fieldType: 'text',
      placeholder: 'PT Kopi Nusantara Indonesia',
      required: true,
    },
    {
      key: 'industry',
      label: 'Industri / Sektor',
      fieldType: 'text',
      placeholder: 'F&B, Agrikultur, Retail, dll.',
    },
    {
      key: 'yearFounded',
      label: 'Tahun Berdiri',
      fieldType: 'number',
      placeholder: 'Contoh: 2019',
      helperText: 'Masukkan 4 digit tahun (contoh: 2019)',
      validate: (val) => {
        if (!val) return null;
        const num = Number(val);
        if (isNaN(num) || num < 1900 || num > 2026) {
          return 'Tahun berdiri harus antara 1900 - 2026';
        }
        return null;
      },
    },
    {
      key: 'teamSize',
      label: 'Jumlah Karyawan',
      fieldType: 'number',
      placeholder: 'Contoh: 15',
      helperText: 'Masukkan estimasi jumlah anggota tim/staf',
      validate: (val) => {
        if (!val) return null;
        const num = Number(val);
        if (isNaN(num) || num < 1 || !Number.isInteger(num)) {
          return 'Jumlah karyawan harus angka positif';
        }
        return null;
      },
    },
  ],
  penawaran_produk: [
    {
      key: 'productName',
      label: 'Nama Produk / SKU',
      fieldType: 'text',
      placeholder: 'Kopi Arabika Gayo Premium 250g',
      required: true,
    },
    {
      key: 'price',
      label: 'Harga Satuan (Rp)',
      fieldType: 'number',
      placeholder: 'Contoh: 85000',
      helperText: 'Hanya angka tanpa titik/koma (contoh: 85000)',
      validate: (val) => {
        if (!val) return null;
        const num = Number(val);
        if (isNaN(num) || num < 0) {
          return 'Harga satuan harus berupa nominal angka valid';
        }
        return null;
      },
    },
    {
      key: 'moq',
      label: 'Minimum Order (MOQ)',
      fieldType: 'number',
      placeholder: 'Contoh: 100',
      helperText: 'Jumlah minimum pesanan dalam pcs/unit',
      validate: (val) => {
        if (!val) return null;
        const num = Number(val);
        if (isNaN(num) || num < 1) {
          return 'Minimum order harus lebih dari 0';
        }
        return null;
      },
    },
    {
      key: 'margin',
      label: 'Margin Reseller (%)',
      fieldType: 'number',
      placeholder: 'Contoh: 25',
      helperText: 'Persentase margin (0 - 100)',
      validate: (val) => {
        if (!val) return null;
        const num = Number(val);
        if (isNaN(num) || num < 0 || num > 100) {
          return 'Margin reseller harus antara 0% - 100%';
        }
        return null;
      },
    },
  ],
  proposal_kerjasama: [
    {
      key: 'partnerTarget',
      label: 'Target Mitra / Lembaga',
      fieldType: 'text',
      placeholder: 'PT Bank Mandiri, Alfamart, dll.',
    },
    {
      key: 'investmentValue',
      label: 'Nilai Investasi / Kerjasama (Rp)',
      fieldType: 'number',
      placeholder: 'Contoh: 500000000',
      helperText: 'Hanya angka nominal (contoh: 500000000)',
      validate: (val) => {
        if (!val) return null;
        const num = Number(val);
        if (isNaN(num) || num < 0) {
          return 'Nilai investasi harus berupa angka valid';
        }
        return null;
      },
    },
    {
      key: 'roiProjection',
      label: 'Proyeksi ROI (%)',
      fieldType: 'text',
      placeholder: 'Contoh: 35% per tahun',
    },
    {
      key: 'cooperationScheme',
      label: 'Skema Kerja Sama',
      fieldType: 'text',
      placeholder: 'Bagi hasil 60:40, Franchise, Konsinyasi',
    },
  ],
  laporan_ringkas: [
    {
      key: 'reportPeriod',
      label: 'Periode Laporan',
      fieldType: 'select',
      placeholder: 'Pilih Periode Laporan',
      options: REPORT_PERIOD_OPTIONS,
    },
    {
      key: 'revenue',
      label: 'Total Omzet (Rp)',
      fieldType: 'number',
      placeholder: 'Contoh: 1200000000',
      helperText: 'Hanya angka nominal (contoh: 1200000000)',
      validate: (val) => {
        if (!val) return null;
        const num = Number(val);
        if (isNaN(num) || num < 0) {
          return 'Total omzet harus berupa angka valid';
        }
        return null;
      },
    },
    {
      key: 'profitLoss',
      label: 'Laba / Rugi Bersih (Rp)',
      fieldType: 'number',
      placeholder: 'Contoh: 180000000',
      helperText: 'Bisa angka positif (laba) atau negatif (rugi)',
      validate: (val) => {
        if (!val) return null;
        const num = Number(val);
        if (isNaN(num)) {
          return 'Laba/rugi harus berupa angka valid';
        }
        return null;
      },
    },
    {
      key: 'kpiHighlight',
      label: 'KPI Highlight',
      fieldType: 'text',
      placeholder: 'Customer retention 92%, Growth 15% MoM',
    },
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

  const handleFieldChange = (key, value) => {
    onFormDataChange({
      ...formData,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Form Fields Card */}
      <Card className="bg-[#0B111E]/90 border border-slate-800/90 shadow-xl">
        <CardContent className="p-6 space-y-5">
          {/* Section label */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Detail Konteks Bisnis
              </h3>
              <p className="text-xs text-slate-400">
                Informasi spesifik sesuai template untuk memandu AI menyusun narasi
              </p>
            </div>
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => {
              const value = formData[field.key] || '';
              const errorMsg = field.validate ? field.validate(value) : null;

              if (field.fieldType === 'select') {
                return (
                  <div key={field.key} className="space-y-2">
                    <label
                      htmlFor={`wizard-${field.key}`}
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                    >
                      {field.label}
                    </label>
                    <Select
                      value={value || ''}
                      onValueChange={(val) => handleFieldChange(field.key, val)}
                    >
                      <SelectTrigger
                        id={`wizard-${field.key}`}
                        className="w-full bg-slate-900/90 border-slate-700/80 text-white text-xs h-10 px-3 cursor-pointer"
                      >
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                        {field.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              return (
                <div key={field.key} className="space-y-1.5">
                  <label
                    htmlFor={`wizard-${field.key}`}
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    {field.label}
                  </label>
                  <Input
                    id={`wizard-${field.key}`}
                    type={field.fieldType === 'number' ? 'number' : 'text'}
                    placeholder={field.placeholder}
                    value={value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className={`bg-slate-900/90 text-white placeholder:text-slate-600 text-xs h-10 focus-visible:ring-amber-500/20 ${
                      errorMsg
                        ? 'border-red-500/60 focus-visible:border-red-500'
                        : 'border-slate-700/80 focus-visible:border-amber-500/60'
                    }`}
                  />
                  {errorMsg ? (
                    <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errorMsg}</span>
                    </p>
                  ) : field.helperText ? (
                    <p className="text-[10px] text-slate-500 mt-1">{field.helperText}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Raw Text Material Area */}
      <Card className="bg-[#0B111E]/90 border border-slate-800/90 shadow-xl">
        <CardContent className="p-6 space-y-4">
          {/* Section label */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Materi Mentah & Catatan Usaha
              </h3>
              <p className="text-xs text-slate-400">
                AI akan merangkum dan menstrukturkan poin-poin Anda ke dalam slide
              </p>
            </div>
          </div>

          <div className="relative space-y-2">
            <textarea
              id="wizard-raw-text"
              rows={6}
              value={rawText || ''}
              onChange={(e) => onRawTextChange(e.target.value)}
              placeholder="Tuliskan narasi bisnis Anda secara bebas. Contoh: Usaha kami bergerak di bidang kopi specialty. Kami memproses biji kopi dari petani langsung di Aceh Gayo dengan sistem fair trade. Target market kami adalah kafe premium di Jakarta dan ekspor ke Singapura..."
              className="w-full rounded-xl border bg-slate-900/90 border-slate-700/80 text-white placeholder:text-slate-600 text-xs leading-relaxed p-4 resize-none outline-none transition-colors focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
            />

            {/* Character counter & real-time indicator */}
            <div className="flex items-center justify-between">
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
                  <span className="text-xs text-emerald-400">✓ Panjang teks sesuai ({rawLen} karakter)</span>
                )}
                {rawLen === 0 && (
                  <span className="text-xs text-slate-500">
                    Masukkan minimal {RAW_TEXT_MIN} karakter untuk melanjutkan
                  </span>
                )}
              </div>

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
