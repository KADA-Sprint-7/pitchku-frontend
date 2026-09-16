import React, { useState } from 'react';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * SlideFormatToolbar
 * Contextual toolbar shown above the slide canvas.
 * Focuses on displaying active slide layout context, character limit guidelines, and AI Rewrite helper.
 *
 * Props:
 * - activeSlideIndex: number (0-based)
 * - totalSlides:      number
 * - activeSlide:      SlideItem object of the currently active slide
 * - onAiRewrite:      fn(activeSlide) → triggers AI mock rewrite
 */
export default function SlideFormatToolbar({
  activeSlideIndex,
  totalSlides,
  activeSlide,
  onAiRewrite,
}) {
  const [isRewriting, setIsRewriting] = useState(false);

  const layoutName = activeSlide?.layout?.replace(/_/g, ' ').toUpperCase() ?? 'CANVAS';
  const slideLabel = `SLIDE ${activeSlideIndex + 1} DARI ${totalSlides} • ${layoutName}`;

  const handleAiRewrite = () => {
    if (!activeSlide) return;
    setIsRewriting(true);
    toast.loading('✨ AI sedang menulis ulang konten slide...', { id: 'ai-rewrite' });

    // Simulate AI rewrite with a 1.5s delay
    setTimeout(() => {
      setIsRewriting(false);
      onAiRewrite?.(activeSlide);
      toast.success('Konten slide berhasil diperbarui oleh AI', {
        id: 'ai-rewrite',
        description: 'Teks telah dioptimalkan agar lebih profesional dan persuasif.',
      });
    }, 1500);
  };

  return (
    <div className="h-11 flex items-center justify-between px-4 bg-[#0D1525] border-b border-slate-800/70 shrink-0 select-none">
      {/* Slide number + layout indicator */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-300">
          {slideLabel}
        </span>
        <Separator orientation="vertical" className="h-4 bg-slate-700/60" />
        <span className="text-[10px] text-slate-500 hidden sm:inline flex items-center gap-1">
          <Info className="w-3 h-3 text-sky-400 inline" /> Klik teks di atas canvas untuk edit langsung
        </span>
      </div>

      {/* AI Rewrite action */}
      <Button
        id="editor-ai-rewrite-btn"
        onClick={handleAiRewrite}
        disabled={isRewriting}
        className={cn(
          'h-7 px-3 gap-1.5 text-xs font-semibold cursor-pointer transition-all',
          isRewriting
            ? 'bg-violet-600/20 text-violet-400 border border-violet-500/40'
            : 'bg-violet-600/15 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 hover:border-violet-400/50'
        )}
        variant="ghost"
      >
        {isRewriting ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Menulis ulang...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3" />
            <span>AI Rewrite</span>
          </>
        )}
      </Button>
    </div>
  );
}

