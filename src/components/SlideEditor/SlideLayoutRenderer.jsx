import React from 'react';
import { cn } from '@/lib/utils';
import { ImageOff, Image as ImageIcon } from 'lucide-react';
import { hexToRgba } from '@/lib/colorUtils';

/**
 * InlineField — a contenteditable-like input that sits inline on the canvas.
 * Displays a real-time Character Counter badge when active to strictly enforce Anti-Overflow limits.
 */
function InlineField({
  value = '',
  onChange,
  onCommit,
  isActive,
  placeholder,
  maxLength,
  multiline = false,
  className,
  style,
}) {
  const currentLength = (value || '').length;
  const isNearLimit = maxLength && currentLength >= maxLength * 0.85;
  const isAtLimit = maxLength && currentLength >= maxLength;

  if (isActive) {
    return (
      <div className="relative group/field inline-block w-full">
        {multiline ? (
          <textarea
            rows={2}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onCommit}
            maxLength={maxLength}
            placeholder={placeholder}
            autoFocus
            className={cn(
              'bg-slate-900/95 border border-sky-400 rounded-lg px-2.5 py-1.5 outline-none resize-none w-full text-inherit font-inherit leading-inherit placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400/50 shadow-xl text-white z-30 relative',
              className
            )}
            style={style}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onCommit}
            maxLength={maxLength}
            placeholder={placeholder}
            autoFocus
            className={cn(
              'bg-slate-900/95 border border-sky-400 rounded-lg px-2.5 py-1 outline-none w-full text-inherit font-inherit leading-inherit placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400/50 shadow-xl text-white z-30 relative',
              className
            )}
            style={style}
          />
        )}

        {/* Real-time Character Counter Indicator Badge */}
        {maxLength && (
          <div
            className={cn(
              'absolute -top-3.5 right-2 z-40 px-1.5 py-0.5 text-[9px] font-bold rounded-full border shadow-md transition-all select-none',
              isAtLimit
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : isNearLimit
                ? 'bg-amber-500 text-white border-amber-400'
                : 'bg-slate-800 text-sky-300 border-sky-500/50'
            )}
          >
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
    );
  }

  return (
    <span
      title={`Klik untuk menyunting${maxLength ? ` (Maksimal ${maxLength} karakter)` : ''}`}
      onClick={onCommit}
      className={cn(
        'cursor-text hover:bg-white/10 hover:ring-1 hover:ring-sky-400/50 rounded px-1 py-0.5 transition-all duration-150 relative group/hover inline-block',
        className
      )}
      style={{ color: 'inherit', ...style }}
    >
      {value || <span className="opacity-40 italic">{placeholder}</span>}
    </span>
  );
}

/**
 * SlideLayoutRenderer
 * Renders 6 canonical layouts with Brand Kit styling, real-time character counting, and media picker modal triggers.
 *
 * NOTE ON SIZING: This renderer targets a fixed 960x540 "paper" canvas — both in
 * the editor (SlideCanvas, scaled visually via `transform: scale()`) and in
 * export (SlideExportCanvas, always literally 960px wide). Because of that,
 * NO Tailwind responsive breakpoints (sm:, md:, etc.) are used anywhere below.
 * Those breakpoints react to the browser viewport width, not this container's
 * width, so on a narrow browser window the editor would silently drop to the
 * un-prefixed (smaller) size while export — always 960px — would keep the
 * sm: (larger) size. That mismatch was the source of editor vs export drift.
 * All sizes here are fixed and chosen to match what export was already
 * rendering (i.e. the previous sm: values), so visuals don't shift.
 */
export default function SlideLayoutRenderer({
  slide,
  brandKit,
  editingField,
  onFieldClick,
  onFieldChange,
  onFieldCommit,
  onImageClick,
}) {
  if (!slide) return null;

  const primary = brandKit?.primaryColor || '#0F4C81';
  const accent = brandKit?.accentColor || '#F2A007';
  const fontFamily = brandKit?.fontFamily || 'Inter, sans-serif';

  const isEditingField = (name, sub) =>
    editingField?.fieldName === name && (sub === undefined || editingField?.subIndex === sub);

  // Shared field props factory
  const fieldProps = (fieldName, subIndex) => ({
    isActive: isEditingField(fieldName, subIndex),
    onCommit: isEditingField(fieldName, subIndex)
      ? onFieldCommit
      : () => onFieldClick(fieldName, subIndex),
  });

  // ── LAYOUT 1: title_slide (Cover) ──────────────────────────────────────
  if (slide.layout === 'title_slide') {
    return (
      <div
        className="w-full h-full flex relative overflow-hidden select-none bg-[#070C15]"
        style={{ fontFamily }}
      >
        {/* Content Area */}
        <div className="relative z-10 flex flex-col justify-center px-10 py-6 flex-1 max-w-[62%]">
          {/* Accent bar */}
          <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: accent }} />

          {/* Title (Max 60 chars) */}
          <InlineField
            {...fieldProps('title')}
            value={slide.title}
            onChange={(v) => onFieldChange('title', v)}
            placeholder="Judul Utama Slide"
            maxLength={60}
            className="text-3xl font-black text-white leading-tight block w-full"
          />

          {/* Subtitle (Max 120 chars) */}
          {slide.subtitle !== undefined && (
            <InlineField
              {...fieldProps('subtitle')}
              value={slide.subtitle || ''}
              onChange={(v) => onFieldChange('subtitle', v)}
              placeholder="Subjudul atau tagline singkat..."
              maxLength={120}
              multiline
              className="mt-3 text-sm leading-relaxed block"
              style={{ color: '#CBD5E1' }}
            />
          )}
        </div>

        {/* Right image area */}
        <div
          onClick={onImageClick}
          className="absolute right-0 top-0 bottom-0 w-[38%] overflow-hidden cursor-pointer group/img border-l border-slate-800"
          title="Klik untuk ganti gambar stok / unggah foto"
        >
          {slide.imageUrl ? (
            <>
              <img
                src={slide.imageUrl}
                alt="Slide visual"
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
              <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-xs font-semibold text-white bg-slate-900 px-3 py-1.5 rounded-full border border-sky-400 flex items-center gap-1.5 shadow-lg">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> Ganti Gambar
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-[#0B1326] flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-sky-300 hover:bg-slate-900 transition-all">
              <ImageOff className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight px-2">
                Klik untuk tambah gambar
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LAYOUT 2: title_bullets (Poin Penjelasan) ───────────────────────────
  if (slide.layout === 'title_bullets') {
    const bullets = slide.bullets || [];
    return (
      <div className="w-full h-full flex flex-col px-10 py-5 relative bg-[#070C15]" style={{ fontFamily }}>
        <div className="relative z-10 flex gap-6 h-full items-center">
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="w-8 h-0.5 rounded mb-3" style={{ backgroundColor: accent }} />
            <InlineField
              {...fieldProps('title')}
              value={slide.title}
              onChange={(v) => onFieldChange('title', v)}
              placeholder="Judul Slide"
              maxLength={60}
              className="text-2xl font-bold text-white leading-snug block"
            />
            {slide.subtitle !== undefined && (
              <InlineField
                {...fieldProps('subtitle')}
                value={slide.subtitle || ''}
                onChange={(v) => onFieldChange('subtitle', v)}
                placeholder="Subjudul singkat..."
                maxLength={120}
                className="mt-1 text-xs text-slate-400 leading-relaxed block"
              />
            )}

            {/* Bullets */}
            <ul className="mt-3.5 space-y-2.5">
              {(bullets.length > 0 ? bullets : ['', '', '']).slice(0, 5).map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: accent }}
                  />
                  <InlineField
                    {...fieldProps('bullets', idx)}
                    value={bullet}
                    onChange={(v) => onFieldChange('bullets', v, idx)}
                    placeholder={`Poin ${idx + 1} (maks 90 char)...`}
                    maxLength={90}
                    className="text-xs text-slate-200 leading-relaxed flex-1"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Right image area */}
          <div
            onClick={onImageClick}
            className="w-48 h-[85%] rounded-xl overflow-hidden shrink-0 relative cursor-pointer group/img border border-slate-800 bg-[#0F1A2E]"
            title="Klik untuk ganti gambar stok / unggah foto"
          >
            {slide.imageUrl ? (
              <>
                <img src={slide.imageUrl} alt="" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-[10px] font-semibold text-white bg-slate-900 px-2 py-1 rounded-full border border-sky-400 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-sky-400" /> Ganti Foto
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-[#0F1A2E] flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-sky-300 hover:bg-slate-900 transition-all">
                <ImageOff className="w-5 h-5" />
                <span className="text-[9px]">Pilih Foto</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── LAYOUT 3: two_column (Komparasi) ───────────────────────────────────
  if (slide.layout === 'two_column') {
    const cards = slide.cards || [{}, {}];
    return (
      <div className="w-full h-full flex flex-col px-10 py-5 relative bg-[#070C15]" style={{ fontFamily }}>
        <div className="relative z-10 flex flex-col h-full justify-center">
          {/* Title */}
          <div className="mb-3">
            <div className="w-8 h-0.5 rounded mb-2" style={{ backgroundColor: accent }} />
            <InlineField
              {...fieldProps('title')}
              value={slide.title}
              onChange={(v) => onFieldChange('title', v)}
              placeholder="Judul Slide"
              maxLength={60}
              className="text-xl font-bold text-white block"
            />
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((colIdx) => {
              const card = cards[colIdx] || {};
              const colBarColor = colIdx === 0 ? primary : accent;
              return (
                <div
                  key={colIdx}
                  className="rounded-xl p-4 flex flex-col gap-2 border border-slate-800 bg-[#0F1A2E]"
                >
                  <div className="w-6 h-0.5 rounded" style={{ backgroundColor: colBarColor }} />
                  <InlineField
                    {...fieldProps('cards', colIdx * 2)}
                    value={card.header || ''}
                    onChange={(v) => onFieldChange('cards', v, colIdx * 2)}
                    placeholder="Judul Kolom"
                    maxLength={30}
                    className="text-sm font-semibold text-white block"
                  />
                  <InlineField
                    {...fieldProps('cards', colIdx * 2 + 1)}
                    value={card.description || ''}
                    onChange={(v) => onFieldChange('cards', v, colIdx * 2 + 1)}
                    placeholder="Deskripsi kolom ini (maks 80 char)..."
                    maxLength={80}
                    multiline
                    className="text-xs text-slate-300 leading-relaxed block"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── LAYOUT 4: metrics_grid (Metrik) ────────────────────────────────────
  if (slide.layout === 'metrics_grid') {
    const cards = slide.cards || [{}, {}, {}, {}];
    return (
      <div className="w-full h-full flex flex-col px-10 py-5 relative bg-[#070C15]" style={{ fontFamily }}>
        <div className="relative z-10 flex flex-col h-full justify-center">
          <div className="mb-3">
            <div className="w-8 h-0.5 rounded mb-1.5" style={{ backgroundColor: accent }} />
            <InlineField
              {...fieldProps('title')}
              value={slide.title}
              onChange={(v) => onFieldChange('title', v)}
              placeholder="Judul Slide"
              maxLength={60}
              className="text-xl font-bold text-white block"
            />
          </div>

          {/* Metrics 2x2 grid */}
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((idx) => {
              const card = cards[idx] || {};
              const isFirst = idx === 0;
              const badgeColor = isFirst ? accent : primary;
              return (
                <div
                  key={idx}
                  className={cn(
                    'rounded-xl p-3.5 flex flex-col gap-0.5 bg-[#0F1A2E] border',
                    isFirst ? 'border-amber-400/60' : 'border-slate-800'
                  )}
                >
                  <div
                    className="text-[9px] font-bold tracking-widest uppercase"
                    style={{ color: badgeColor }}
                  >
                    {`METRIK ${idx + 1}`}
                  </div>
                  <InlineField
                    {...fieldProps('cards', idx * 2)}
                    value={card.header || ''}
                    onChange={(v) => onFieldChange('cards', v, idx * 2)}
                    placeholder="+00%"
                    maxLength={30}
                    className="text-2xl font-black text-white block"
                  />
                  <InlineField
                    {...fieldProps('cards', idx * 2 + 1)}
                    value={card.description || ''}
                    onChange={(v) => onFieldChange('cards', v, idx * 2 + 1)}
                    placeholder="Label Metrik (maks 80 char)"
                    maxLength={80}
                    className="text-[11px] text-slate-300 block"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── LAYOUT 5: card_grid (Bento Cards) ──────────────────────────────────
  if (slide.layout === 'card_grid') {
    const cards = slide.cards || [{}, {}, {}, {}];
    return (
      <div className="w-full h-full flex flex-col px-10 py-5 relative bg-[#070C15]" style={{ fontFamily }}>
        <div className="relative z-10 flex flex-col h-full justify-center">
          <div className="mb-2.5">
            <div className="w-8 h-0.5 rounded mb-1.5" style={{ backgroundColor: accent }} />
            <InlineField
              {...fieldProps('title')}
              value={slide.title}
              onChange={(v) => onFieldChange('title', v)}
              placeholder="Judul Slide"
              maxLength={60}
              className="text-xl font-bold text-white block"
            />
          </div>

          {/* 2x2 card grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[0, 1, 2, 3].map((idx) => {
              const card = cards[idx] || {};
              return (
                <div
                  key={idx}
                  className="rounded-xl p-3 border border-slate-800 bg-[#0F1A2E] flex flex-col gap-1"
                >
                  <div className="w-4 h-0.5 rounded" style={{ backgroundColor: accent }} />
                  <InlineField
                    {...fieldProps('cards', idx * 2)}
                    value={card.header || ''}
                    onChange={(v) => onFieldChange('cards', v, idx * 2)}
                    placeholder="Judul Kartu"
                    maxLength={30}
                    className="text-xs font-semibold text-white block"
                  />
                  <InlineField
                    {...fieldProps('cards', idx * 2 + 1)}
                    value={card.description || ''}
                    onChange={(v) => onFieldChange('cards', v, idx * 2 + 1)}
                    placeholder="Deskripsi kartu (maks 80 char)..."
                    maxLength={80}
                    multiline
                    className="text-[11px] text-slate-300 leading-relaxed block flex-1"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── LAYOUT 6: contact_closing (Penutup & Kontak) ────────────────────────
  if (slide.layout === 'contact_closing') {
    const cards = slide.cards || [{}, {}, {}, {}];
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-10 py-5 relative text-center bg-[#070C15]" style={{ fontFamily }}>
        <div className="relative z-10 w-full max-w-lg">
          <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ backgroundColor: accent }} />
          <InlineField
            {...fieldProps('title')}
            value={slide.title}
            onChange={(v) => onFieldChange('title', v)}
            placeholder="Judul Penutup"
            maxLength={60}
            className="text-2xl font-black text-white block text-center w-full"
          />
          {slide.subtitle !== undefined && (
            <InlineField
              {...fieldProps('subtitle')}
              value={slide.subtitle || ''}
              onChange={(v) => onFieldChange('subtitle', v)}
              placeholder="Tagline penutup atau CTA..."
              maxLength={120}
              multiline
              className="mt-1.5 text-xs text-slate-300 leading-relaxed block text-center w-full"
            />
          )}

          {/* Contact cards */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {[0, 1, 2, 3].map((idx) => {
              const card = cards[idx] || {};
              return (
                <div
                  key={idx}
                  className="rounded-xl p-2.5 border border-slate-800 bg-[#0F1A2E] text-left"
                >
                  <InlineField
                    {...fieldProps('cards', idx * 2)}
                    value={card.header || ''}
                    onChange={(v) => onFieldChange('cards', v, idx * 2)}
                    placeholder="Label"
                    maxLength={30}
                    className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide block"
                  />
                  <InlineField
                    {...fieldProps('cards', idx * 2 + 1)}
                    value={card.description || ''}
                    onChange={(v) => onFieldChange('cards', v, idx * 2 + 1)}
                    placeholder="Informasi..."
                    maxLength={80}
                    className="text-xs text-white font-medium block mt-0.5"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
      Layout tidak dikenal: <code className="ml-2 text-xs bg-slate-800 px-2 py-0.5 rounded">{slide.layout}</code>
    </div>
  );
}