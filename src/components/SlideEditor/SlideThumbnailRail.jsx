import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Plus, Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * ThumbnailMiniCanvas — Renders a mini visual preview of a slide for the rail.
 */
function ThumbnailMiniCanvas({ slide, brandKit }) {
  const primary = brandKit?.primaryColor || '#0F4C81';
  const accent = brandKit?.accentColor || '#F2A007';

  return (
    <div
      className="w-full h-full rounded overflow-hidden flex flex-col relative pointer-events-none select-none bg-[#070C15] border border-slate-800"
    >
      {/* Accent bar */}
      <div className="w-4 h-0.5 rounded-full mt-1.5 ml-1.5" style={{ background: accent }} />

      {/* Title lines mock */}
      <div className="flex flex-col gap-0.5 px-1.5 mt-1">
        <div
          className="h-1 rounded-full opacity-90"
          style={{
            background: 'rgba(255,255,255,0.8)',
            width: '75%',
          }}
        />
        <div
          className="h-0.5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.3)',
            width: '55%',
          }}
        />
      </div>

      {/* Content area mock — varies by layout */}
      {(slide?.layout === 'metrics_grid' || slide?.layout === 'card_grid') && (
        <div className="flex-1 flex flex-wrap gap-0.5 px-1.5 mt-1 pb-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded"
              style={{
                width: 'calc(50% - 2px)',
                height: '28%',
                background: 'rgba(255,255,255,0.08)',
              }}
            />
          ))}
        </div>
      )}

      {slide?.layout === 'two_column' && (
        <div className="flex-1 flex gap-0.5 px-1.5 mt-1 pb-1">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex-1 rounded"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />
          ))}
        </div>
      )}

      {slide?.layout === 'title_bullets' && (
        <div className="flex-1 flex flex-col gap-0.5 px-1.5 mt-1 pb-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-0.5">
              <div className="w-0.5 h-0.5 rounded-full shrink-0" style={{ background: accent }} />
              <div
                className="h-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.25)', width: `${65 - i * 10}%` }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const LAYOUT_LABELS = {
  title_slide: 'Hero Cover',
  title_bullets: 'Poin Penjelasan',
  two_column: 'Komparasi 2 Kolom',
  metrics_grid: 'Grid 4 Metrik',
  card_grid: 'Bento Cards',
  contact_closing: 'Penutup & Kontak',
};

/**
 * SlideThumbnailRail — Vertical sidebar panel on the left side of the editor layout
 */
export default function SlideThumbnailRail({
  slides = [],
  activeSlideIndex = 0,
  brandKit,
  onSlideSelect,
  onReorderSlides,
  onOpenAddSlideModal,
  onDeleteSlide,
}) {
  const railRef = useRef(null);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const touchTimerRef = useRef(null);
  const touchStartPosRef = useRef({ x: 0, y: 0 });

  // Auto-scroll so active thumbnail is visible in vertical rail
  useEffect(() => {
    if (!railRef.current) return;
    const activeEl = railRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSlideIndex]);

  const handleMoveUp = (e, index) => {
    e.stopPropagation();
    if (index <= 0) return;
    onReorderSlides?.(index, index - 1);
  };

  const handleMoveDown = (e, index) => {
    e.stopPropagation();
    if (index >= slides.length - 1) return;
    onReorderSlides?.(index, index + 1);
  };

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', index.toString());
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    onReorderSlides?.(draggedIdx, targetIdx);
    setDraggedIdx(null);
  };

  // ── Touch Drag & Drop Reorder Handlers for Mobile ──
  const touchStartIdxRef = useRef(null);
  const targetDropIdxRef = useRef(null);

  const handleTouchStart = (index, e) => {
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    touchStartIdxRef.current = index;
    targetDropIdxRef.current = index;

    touchTimerRef.current = setTimeout(() => {
      setDraggedIdx(index);
      if (navigator.vibrate) navigator.vibrate(40);
    }, 250); // 250ms long-press activates drag state
  };

  const handleTouchMove = (index, e) => {
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);

    if (draggedIdx === null) {
      if (dx > 10 || dy > 10) {
        clearTimeout(touchTimerRef.current);
      }
    } else {
      // Find element under touch finger location
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const slideCard = el?.closest('[data-slide-index]');
      if (slideCard && slideCard.dataset.slideIndex !== undefined) {
        const targetIdx = parseInt(slideCard.dataset.slideIndex, 10);
        if (!isNaN(targetIdx)) {
          targetDropIdxRef.current = targetIdx;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimerRef.current);
    if (draggedIdx !== null && targetDropIdxRef.current !== null && draggedIdx !== targetDropIdxRef.current) {
      onReorderSlides?.(draggedIdx, targetDropIdxRef.current);
    }
    setDraggedIdx(null);
    touchStartIdxRef.current = null;
    targetDropIdxRef.current = null;
  };

  const confirmDelete = () => {
    if (slideToDelete !== null) {
      onDeleteSlide?.(slideToDelete);
      setSlideToDelete(null);
    }
  };

  const targetSlideObj = slideToDelete !== null ? slides[slideToDelete] : null;

  return (
    <aside className="w-full md:w-[210px] h-[80px] sm:h-[88px] md:h-full bg-[#060B17] border-t md:border-t-0 md:border-r border-slate-800/80 flex flex-row md:flex-col shrink-0 overflow-hidden select-none z-20">
      {/* Header section (Desktop Vertical Header / Mobile Compact Left Action) */}
      <div className="hidden md:flex p-3 border-b border-slate-800/80 items-center justify-between shrink-0 bg-[#080E1C]">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Slide
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-sky-400 font-bold border border-slate-700">
            {slides.length}
          </span>
        </div>

        <button
          onClick={onOpenAddSlideModal}
          className="flex items-center gap-1 text-[11px] font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 px-2.5 py-1 rounded-lg transition-all shadow-sm shadow-sky-500/20 cursor-pointer hover:scale-105 active:scale-95"
          title="Tambah Slide Baru (Pilih Layout)"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Mobile Add Slide Button (Sticky Left on Mobile Bottombar - Only '+' Icon without text) */}
      <div className="flex md:hidden items-center px-2 py-1 border-r border-slate-800 shrink-0 bg-[#080E1C]">
        <button
          onClick={onOpenAddSlideModal}
          className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
          title="Tambah Slide Baru"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* List of thumbnails */}
      <div
        ref={railRef}
        className="flex-1 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto px-2 py-1.5 md:p-2.5 flex flex-row md:flex-col gap-2.5 md:gap-2.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent items-center md:items-stretch snap-x md:snap-none"
        role="tablist"
        aria-label="Daftar slide"
      >
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;
          const layoutName = LAYOUT_LABELS[slide.layout] || 'Slide';

          return (
            <div
              key={slide.id || idx}
              id={`slide-thumb-${idx}`}
              data-active={isActive}
              data-slide-index={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onTouchStart={(e) => handleTouchStart(idx, e)}
              onTouchMove={(e) => handleTouchMove(idx, e)}
              onTouchEnd={handleTouchEnd}
              onClick={() => onSlideSelect?.(idx)}
              className={cn(
                'group relative flex items-center gap-2 p-1.5 md:p-2 rounded-xl border transition-all duration-200 cursor-pointer outline-none shrink-0 snap-center',
                isActive
                  ? 'bg-sky-950/60 border-sky-400 ring-1 ring-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50',
                draggedIdx === idx && 'opacity-40 scale-95 ring-2 ring-amber-400'
              )}
            >
              {/* Drag handle (Desktop) */}
              <div className="hidden md:block text-slate-600 group-hover:text-slate-400 cursor-grab active:cursor-grabbing shrink-0">
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              {/* Number indicator */}
              <span
                className={cn(
                  'text-[11px] font-bold font-mono shrink-0 w-4 text-center',
                  isActive ? 'text-sky-400' : 'text-slate-500'
                )}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Thumbnail canvas preview (Enlarged on mobile: 88px x 49.5px) */}
              <div
                className={cn(
                  'w-[88px] sm:w-[96px] md:w-[82px] h-[49.5px] sm:h-[54px] md:h-[48px] rounded overflow-hidden border shrink-0 transition-all relative',
                  isActive
                    ? 'border-sky-400/80 shadow-sm shadow-sky-400/30'
                    : 'border-slate-700/50 group-hover:border-slate-600'
                )}
              >
                <ThumbnailMiniCanvas slide={slide} brandKit={brandKit} />
              </div>

              {/* Slide Meta Label (Desktop) */}
              <div className="hidden md:flex flex-col min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-200 truncate leading-tight">
                  {slide.title || `Slide ${idx + 1}`}
                </p>
                <span className="text-[9px] text-slate-500 font-medium truncate mt-0.5">
                  {layoutName}
                </span>
              </div>

              {/* Hover action buttons (Move Up, Move Down, Delete) - Desktop Only to prevent accidental mobile touch jumps */}
              <div className="hidden md:group-hover:flex absolute right-0.5 top-0.5 bottom-0.5 opacity-0 group-hover:opacity-100 flex-col justify-between bg-[#080E1C]/95 backdrop-blur-xs p-0.5 rounded border border-slate-700/70 transition-opacity z-10">
                <button
                  disabled={idx === 0}
                  onClick={(e) => handleMoveUp(e, idx)}
                  className="text-slate-400 hover:text-sky-400 disabled:opacity-30 disabled:hover:text-slate-400 p-0.5 cursor-pointer"
                  title="Naikkan Urutan"
                >
                  <ArrowUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </button>
                <button
                  disabled={idx === slides.length - 1}
                  onClick={(e) => handleMoveDown(e, idx)}
                  className="text-slate-400 hover:text-sky-400 disabled:opacity-30 disabled:hover:text-slate-400 p-0.5 cursor-pointer"
                  title="Turunkan Urutan"
                >
                  <ArrowDown className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </button>
                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideToDelete(idx);
                    }}
                    className="text-slate-400 hover:text-red-400 p-0.5 cursor-pointer"
                    title="Hapus Slide"
                  >
                    <Trash2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Polished Delete Confirmation Dialog ── */}
      <Dialog open={slideToDelete !== null} onOpenChange={(open) => !open && setSlideToDelete(null)}>
        <DialogContent className="bg-[#0D1525] text-slate-100 border border-slate-700/80 sm:max-w-md shadow-2xl shadow-black/80">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-white">
                  Hapus Slide {slideToDelete !== null ? `#${slideToDelete + 1}` : ''}?
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400">
                  Tindakan ini akan menghapus slide dari presentasi secara permanen.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Slide Preview Card */}
          {targetSlideObj && (
            <div className="my-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <div className="w-16 h-10 rounded overflow-hidden border border-slate-700 shrink-0">
                <ThumbnailMiniCanvas slide={targetSlideObj} brandKit={brandKit} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-sky-400">
                    Slide {slideToDelete + 1}
                  </span>
                  <span className="text-[10px] text-slate-500">•</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {LAYOUT_LABELS[targetSlideObj.layout] || targetSlideObj.layout}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white truncate mt-0.5">
                  {targetSlideObj.title || 'Slide Tanpa Judul'}
                </p>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            Urutan dan penomoran slide yang tersisa akan otomatis disesuaikan.
          </p>

          <DialogFooter className="gap-2 sm:gap-0 mt-4 border-t border-slate-800 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSlideToDelete(null)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs gap-1.5 shadow-lg shadow-red-600/20 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Slide
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
