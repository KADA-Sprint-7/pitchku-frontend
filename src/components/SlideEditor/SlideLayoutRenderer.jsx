import React from 'react';

const PANEL_BG = '#F5F7FA';
const PANEL_BORDER = '#E2E6EB';
const INK_DARK = '#1A1A1A';
const MUTED_TEXT = '#6B6B6B';

function Field({
  value = '',
  onChange,
  onCommit,
  active,
  maxLength,
  className = '',
  style,
  multiline = false,
  placeholder = '',
}) {
  if (active) {
    const Tag = multiline ? 'textarea' : 'input';
    return (
      <Tag
        autoFocus
        rows={multiline ? 2 : undefined}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        className={`w-full resize-none rounded border border-sky-400 bg-white px-1 font-sans text-inherit outline-none focus:ring-2 focus:ring-sky-400/30 ${className}`}
        style={style}
      />
    );
  }
  return (
    <span
      onClick={onCommit}
      className={`cursor-text hover:outline-dashed hover:outline-1 hover:outline-sky-400/50 rounded px-0.5 transition-all ${className}`}
      style={style}
    >
      {value || placeholder}
    </span>
  );
}

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
  const businessName = brandKit?.businessName || '';

  const createFieldProps = (fieldName, subIndex, maxLength, extra = {}) => {
    let val = '';
    if (subIndex === undefined) {
      val = slide[fieldName] || '';
    } else if (fieldName === 'bullets') {
      val = slide.bullets?.[subIndex] || '';
    } else if (fieldName === 'cards') {
      const cardIdx = Math.floor(subIndex / 2);
      const isHeader = subIndex % 2 === 0;
      val = slide.cards?.[cardIdx]?.[isHeader ? 'header' : 'description'] || '';
    }

    const isActive =
      editingField?.fieldName === fieldName && editingField?.subIndex === subIndex;

    return {
      value: val,
      maxLength,
      active: isActive,
      onChange: (v) => onFieldChange(fieldName, v, subIndex),
      onCommit: isActive ? onFieldCommit : () => onFieldClick(fieldName, subIndex),
      ...extra,
    };
  };

  const Header = () => (
    <>
      <div className="absolute left-[53px] top-[26px] flex items-center gap-3">
        <i className="h-4 w-4 rounded-sm" style={{ background: primary }} />
        <span className="text-[11px] text-[#6B6B6B] font-bold tracking-wide uppercase">
          {businessName}
        </span>
      </div>
      <div className="absolute left-[53px] top-[69px] right-[53px]">
        <Field
          {...createFieldProps('title', undefined, 60)}
          className="block text-[26px] font-bold leading-tight"
          style={{ color: primary }}
          placeholder="Judul Slide"
        />
        <i className="mt-4 block h-1 w-[72px]" style={{ background: accent }} />
      </div>
    </>
  );

  const Cards = ({ mode = 'cols' }) => {
    const cardList = slide.cards || [];
    const limit = mode === 'cols' ? 2 : mode === 'metrics' ? 4 : 4;
    const cardsToRender = cardList.slice(0, limit);

    if (mode === 'cols') {
      return (
        <div className="absolute left-[53px] top-[168px] flex w-[854px] gap-6 h-[250px]">
          {cardsToRender.map((_, i) => (
            <div
              key={i}
              className="relative flex-1 border border-[#E2E6EB] p-5 rounded-sm"
              style={{ background: PANEL_BG }}
            >
              <i
                className="absolute left-0 top-0 h-1 w-full"
                style={{ background: i === 0 ? primary : accent }}
              />
              <Field
                {...createFieldProps('cards', i * 2, 30)}
                className="block text-[15px] font-bold"
                style={{ color: primary }}
                placeholder="Header Kolom"
              />
              <Field
                {...createFieldProps('cards', i * 2 + 1, 80, { multiline: true })}
                className="mt-3 block text-[12px] leading-relaxed"
                style={{ color: INK_DARK }}
                placeholder="Deskripsi..."
              />
            </div>
          ))}
        </div>
      );
    }

    if (mode === 'metrics') {
      return (
        <div className="absolute left-[53px] top-[168px] grid grid-cols-2 gap-4 w-[854px] h-[226px]">
          {cardsToRender.map((_, i) => (
            <div
              key={i}
              className="relative border border-[#E2E6EB] p-4 rounded-sm flex flex-col justify-center"
              style={{ background: PANEL_BG }}
            >
              <i
                className="absolute left-0 top-0 h-1 w-full"
                style={{ background: i === 0 ? accent : primary }}
              />
              <Field
                {...createFieldProps('cards', i * 2, 30)}
                className="block text-[24px] font-bold"
                style={{ color: accent }}
                placeholder="Angka Metrik"
              />
              <Field
                {...createFieldProps('cards', i * 2 + 1, 80, { multiline: true })}
                className="mt-1 block text-[11px] leading-snug"
                style={{ color: INK_DARK }}
                placeholder="Penjelasan Metrik..."
              />
            </div>
          ))}
        </div>
      );
    }

    if (mode === 'grid') {
      return (
        <div className="absolute left-[53px] top-[168px] grid grid-cols-2 gap-4 w-[854px] h-[250px]">
          {cardsToRender.map((_, i) => (
            <div
              key={i}
              className="relative border border-[#E2E6EB] p-4 bg-white rounded-sm"
            >
              <i
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ background: accent }}
              />
              <div className="pl-2">
                <Field
                  {...createFieldProps('cards', i * 2, 30)}
                  className="block text-[14px] font-bold"
                  style={{ color: primary }}
                  placeholder="Header Kartu"
                />
                <Field
                  {...createFieldProps('cards', i * 2 + 1, 80, { multiline: true })}
                  className="mt-2 block text-[11px] leading-relaxed"
                  style={{ color: INK_DARK }}
                  placeholder="Keterangan..."
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // 1. Cover / Title Slide
  if (slide.layout === 'title_slide') {
    return (
      <div
        className="relative h-full w-full select-none"
        style={{ background: primary, fontFamily: 'Arial, sans-serif' }}
      >
        <i className="absolute top-0 h-2 w-full" style={{ background: accent }} />
        <div className="absolute top-[72px] left-1/2 -translate-x-1/2 flex gap-3 items-center">
          <i className="h-[22px] w-[22px] rounded" style={{ background: accent }} />
          <span className="text-[12px] text-white font-bold tracking-wide">
            {businessName}
          </span>
        </div>
        <div className="absolute inset-x-24 top-[197px] text-center">
          <Field
            {...createFieldProps('title', undefined, 60)}
            className="block text-[34px] font-bold text-white leading-tight"
            placeholder="Judul Presentasi Utama"
          />
          <Field
            {...createFieldProps('subtitle', undefined, 120, { multiline: true })}
            className="mt-6 block text-[15px] text-slate-200"
            placeholder="Subjudul atau Deskripsi Ringkas"
          />
        </div>
      </div>
    );
  }

  // 2. Title + Bullets
  if (slide.layout === 'title_bullets') {
    const hasImage = !!slide.imageUrl;
    const contentWidth = hasImage ? 480 : 854;

    return (
      <div
        className="relative h-full w-full bg-white select-none"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <Header />
        <div
          className="absolute left-[53px] top-[168px] space-y-3"
          style={{ width: contentWidth }}
        >
          {(slide.bullets || []).slice(0, 5).map((_, i) => (
            <div className="flex gap-3 text-[14px]" key={i}>
              <b style={{ color: accent }}>•</b>
              <Field
                {...createFieldProps('bullets', i, 90)}
                placeholder="Poin penjelasan..."
              />
            </div>
          ))}
        </div>
        {hasImage && (
          <img
            onClick={onImageClick}
            src={slide.imageUrl}
            className="absolute left-[576px] top-[132px] h-[315px] w-[331px] object-cover rounded border border-[#E2E6EB] cursor-pointer hover:opacity-95 transition-opacity"
            alt="Slide asset"
          />
        )}
      </div>
    );
  }

  // 3. Two Column
  if (slide.layout === 'two_column') {
    return (
      <div
        className="relative h-full w-full bg-white select-none"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <Header />
        <Cards mode="cols" />
      </div>
    );
  }

  // 4. Metrics Grid
  if (slide.layout === 'metrics_grid') {
    return (
      <div
        className="relative h-full w-full bg-white select-none"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <Header />
        <Cards mode="metrics" />
        <Field
          {...createFieldProps('subtitle', undefined, 120)}
          className="absolute left-[53px] top-[427px] text-[11px]"
          style={{ color: MUTED_TEXT }}
          placeholder="Catatan metrik..."
        />
      </div>
    );
  }

  // 5. Card Grid
  if (slide.layout === 'card_grid') {
    return (
      <div
        className="relative h-full w-full bg-white select-none"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <Header />
        <Cards mode="grid" />
      </div>
    );
  }

  // 6. Contact & Closing Slide
  return (
    <div
      className="relative h-full w-full bg-[#F4F7FA] text-center select-none"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <i className="absolute bottom-0 h-2 w-full" style={{ background: accent }} />
      <div className="absolute inset-x-24 top-[149px]">
        <Field
          {...createFieldProps('title', undefined, 60)}
          className="block text-[28px] font-bold"
          style={{ color: primary }}
          placeholder="Judul Penutup"
        />
        <Field
          {...createFieldProps('subtitle', undefined, 120)}
          className="mt-6 block text-[14px]"
          style={{ color: '#4A4A4A' }}
          placeholder="Pesan Penutup"
        />
        {(slide.bullets || [businessName]).slice(0, 5).map((_, i) => (
          <Field
            key={i}
            {...createFieldProps('bullets', i, 90)}
            className="mt-4 block text-[14px]"
            style={{ color: '#2B2B2B' }}
            placeholder="Kontak / Catatan tambahan..."
          />
        ))}
      </div>
    </div>
  );
}

