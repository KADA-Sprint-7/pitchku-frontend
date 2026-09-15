import React, { useState } from 'react';
import SlideLayoutRenderer from './SlideLayoutRenderer';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SlideCanvas({
  slide,
  totalSlides,
  deckTitle,
  brandKit,
  editingField,
  onFieldClick,
  onFieldChange,
  onFieldCommit,
  onImageClick,
}) {
  const [zoomScale, setZoomScale] = useState(1);

  const accent = brandKit?.accentColor || '#F2A007';
  const logoUrl = brandKit?.logoUrl;
  const slideNum = slide?.slideNumber ?? 1;
  const isTitleSlide = slide?.layout === 'title_slide';

  const LAYOUT_LABELS = {
    title_slide: 'Cover',
    title_bullets: 'Penjelasan',
    two_column: 'Komparasi',
    metrics_grid: 'Metrik',
    card_grid: 'Konten',
    contact_closing: 'Penutup',
  };
  const layoutLabel = LAYOUT_LABELS[slide?.layout] || 'Slide';
  const babLabel = `BAB ${String(slideNum).padStart(2, '0')} • ${layoutLabel.toUpperCase()}`;

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.15, 0.6));
  const handleZoomReset = () => setZoomScale(1);

  return (
    <div className="flex-1 overflow-hidden flex flex-col items-center justify-center bg-[#070C15] p-3 md:p-6 relative select-none">
      {/* Zoom Control Floating Bar */}
      <div className="absolute top-3 right-4 z-30 flex items-center gap-1 bg-[#0D1525]/90 border border-slate-700/80 backdrop-blur-md px-2 py-1 rounded-full shadow-lg text-slate-300 select-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoomScale <= 0.6}
          className="w-6 h-6 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full cursor-pointer"
          title="Zoom Out (-15%)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <span className="text-[10px] font-semibold w-9 text-center font-mono">
          {Math.round(zoomScale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoomScale >= 1.6}
          className="w-6 h-6 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full cursor-pointer"
          title="Zoom In (+15%)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>

        {zoomScale !== 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomReset}
            className="w-6 h-6 text-sky-400 hover:bg-slate-800 rounded-full ml-0.5 cursor-pointer"
            title="Reset Zoom 100%"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* ── 16:9 Canvas Viewport Container ── */}
      {/* Strictly constrained to 16:9 widescreen ratio in both width & height so it never distorts or overflows */}
      <div className="w-full h-full flex items-center justify-center p-2 overflow-auto">
        <div
          id="pitchku-active-slide-canvas"
          className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-slate-700/60 transition-transform duration-200 origin-center shrink-0"
          style={{
            aspectRatio: '16 / 9',
            width: 'min(960px, 94vw, calc((100vh - 160px) * 16 / 9))',
            transform: `scale(${zoomScale})`,
          }}
        >
          {/* Top Header Row — Bab label (top-left) & Logo (top-right) */}
          <div className="absolute top-3.5 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
            {/* Bab Badge */}
            <span
              className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-xs"
              style={{
                color: accent,
                borderColor: `${accent}40`,
                background: `${accent}15`,
              }}
            >
              {babLabel}
            </span>

            {/* Logo placement on non-cover slides */}
            {!isTitleSlide && (
              <div>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-[22px] w-auto object-contain max-w-[90px] filter drop-shadow"
                  />
                ) : (
                  <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase px-2 py-0.5 rounded bg-black/30 border border-slate-800">
                    LOGO
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom Footer Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-7 flex items-center justify-between px-6 border-t border-white/5 bg-black/40 backdrop-blur-xs select-none pointer-events-none">
            <span className="text-[9px] text-slate-400 truncate max-w-[65%] font-medium">
              {deckTitle || 'PitchKu Presentasi'}
            </span>
            <span className="text-[9px] text-slate-400 shrink-0 font-mono font-medium">
              {String(slideNum).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
          </div>

          {/* Main Slide Layout Content Area */}
          <div className="absolute inset-0 pt-8 pb-7">
            <SlideLayoutRenderer
              slide={slide}
              brandKit={brandKit}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldChange={onFieldChange}
              onFieldCommit={onFieldCommit}
              onImageClick={onImageClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
