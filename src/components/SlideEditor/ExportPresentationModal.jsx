import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDown, FileText, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import pptxgen from 'pptxgenjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FORMAT_OPTIONS = [
  {
    id: 'pptx',
    label: 'PowerPoint',
    ext: '.pptx',
    icon: FileDown,
    description: 'Format presentasi native Microsoft PowerPoint (.pptx)',
    color: 'sky',
  },
  {
    id: 'pdf',
    label: 'Dokumen PDF',
    ext: '.pdf',
    icon: FileText,
    description: 'Format dokumen universal 16:9 resolusi tinggi (.pdf)',
    color: 'violet',
  },
];

/**
 * ExportPresentationModal
 * Generates real PPTX presentation via pptxgenjs or 16:9 high-res PDF via html2canvas & jsPDF.
 *
 * Props:
 * - open:         boolean
 * - onOpenChange: fn(open)
 * - deckTitle:    string
 * - deckPayload:  PitchKuDeckPayload object
 */
export default function ExportPresentationModal({ open, onOpenChange, deckTitle, deckPayload }) {
  const [fileName, setFileName] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('pptx');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (open) {
      setFileName(deckTitle || 'PitchKu Presentasi');
      setSelectedFormat('pptx');
      setIsDownloading(false);
    }
  }, [open, deckTitle]);

  // ── High-Fidelity PPTX Generation using pptxgenjs ────────────────────────
  const generatePPTX = async (trimmedName) => {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = trimmedName;

    const brandKit = deckPayload?.brandKit || {};
    const primaryHex = (brandKit.primaryColor || '#0F4C81').replace('#', '');
    const accentHex = (brandKit.accentColor || '#F2A007').replace('#', '');
    const logoUrl = brandKit.logoUrl;

    const slides = deckPayload?.slides || [];

    slides.forEach((slideItem, index) => {
      const pptSlide = pptx.addSlide();

      // Deep Midnight Canvas Background
      pptSlide.background = { color: '070C15' };

      // Top-left brand badge & chapter
      pptSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.6,
        y: 0.4,
        w: 1.6,
        h: 0.28,
        fill: { color: primaryHex, transparency: 60 },
        line: { color: accentHex, width: 1 },
      });
      pptSlide.addText(`SLIDE ${String(index + 1).padStart(2, '0')}`, {
        x: 0.6,
        y: 0.4,
        w: 1.6,
        h: 0.28,
        fontSize: 8.5,
        bold: true,
        color: accentHex,
        align: 'center',
        valign: 'middle',
      });

      // Accent color decorative bar under badge
      pptSlide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6,
        y: 0.78,
        w: 0.8,
        h: 0.05,
        fill: { color: accentHex },
        line: { color: accentHex },
      });

      // Slide Title
      if (slideItem.title) {
        pptSlide.addText(slideItem.title, {
          x: 0.6,
          y: 0.9,
          w: slideItem.layout === 'title_slide' ? 8.8 : slideItem.imageUrl ? 5.4 : 8.8,
          h: 0.85,
          fontSize: slideItem.layout === 'title_slide' ? 32 : 24,
          bold: true,
          color: 'FFFFFF',
          fontFace: 'Arial',
        });
      }

      // Slide Subtitle
      if (slideItem.subtitle) {
        pptSlide.addText(slideItem.subtitle, {
          x: 0.6,
          y: 1.8,
          w: slideItem.imageUrl ? 5.4 : 8.8,
          h: 0.65,
          fontSize: 14,
          color: '94A3B8',
          fontFace: 'Arial',
        });
      }

      // Layout specific rendering:
      const layout = slideItem.layout || 'title_bullets';

      if (layout === 'title_bullets') {
        const hasImg = !!slideItem.imageUrl;
        const textWidth = hasImg ? 5.2 : 8.8;

        if (slideItem.bullets && slideItem.bullets.length > 0) {
          const bulletObjects = slideItem.bullets.map((b) => ({
            text: b,
            options: {
              fontSize: 13,
              color: 'E2E8F0',
              bullet: { code: '25C6', color: accentHex },
              breakLine: true,
            },
          }));
          pptSlide.addText(bulletObjects, {
            x: 0.6,
            y: 2.5,
            w: textWidth,
            h: 3.8,
            fontFace: 'Arial',
          });
        }

        if (hasImg) {
          try {
            pptSlide.addImage({
              path: slideItem.imageUrl,
              x: 6.2,
              y: 1.8,
              w: 3.2,
              h: 4.2,
              rounding: true,
            });
          } catch (e) {
            // Fallback image placeholder shape
            pptSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
              x: 6.2,
              y: 1.8,
              w: 3.2,
              h: 4.2,
              fill: { color: primaryHex, transparency: 70 },
              line: { color: '334155', width: 1 },
            });
          }
        }
      } else if (layout === 'two_column') {
        const cards = slideItem.cards || [];
        cards.slice(0, 2).forEach((card, cIdx) => {
          const xPos = 0.6 + cIdx * 4.4;
          const yPos = 2.6;

          // Card Background
          pptSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: xPos,
            y: yPos,
            w: 4.1,
            h: 3.6,
            fill: { color: primaryHex, transparency: 85 },
            line: { color: cIdx === 0 ? accentHex : '334155', width: 1.5 },
          });

          if (card.header) {
            pptSlide.addText(card.header, {
              x: xPos + 0.3,
              y: yPos + 0.3,
              w: 3.5,
              h: 0.5,
              fontSize: 16,
              bold: true,
              color: 'FFFFFF',
              fontFace: 'Arial',
            });
          }

          if (card.description) {
            pptSlide.addText(card.description, {
              x: xPos + 0.3,
              y: yPos + 0.9,
              w: 3.5,
              h: 2.3,
              fontSize: 12.5,
              color: 'CBD5E1',
              fontFace: 'Arial',
            });
          }
        });
      } else if (layout === 'metrics_grid') {
        const cards = slideItem.cards || [];
        cards.slice(0, 4).forEach((card, cIdx) => {
          const col = cIdx % 2;
          const row = Math.floor(cIdx / 2);
          const xPos = 0.6 + col * 4.4;
          const yPos = 2.5 + row * 1.9;

          pptSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: xPos,
            y: yPos,
            w: 4.1,
            h: 1.7,
            fill: { color: primaryHex, transparency: 80 },
            line: { color: '334155', width: 1 },
          });

          if (card.header) {
            pptSlide.addText(card.header, {
              x: xPos + 0.3,
              y: yPos + 0.2,
              w: 3.5,
              h: 0.6,
              fontSize: 22,
              bold: true,
              color: accentHex,
              fontFace: 'Arial',
            });
          }

          if (card.description) {
            pptSlide.addText(card.description, {
              x: xPos + 0.3,
              y: yPos + 0.85,
              w: 3.5,
              h: 0.65,
              fontSize: 11,
              color: 'CBD5E1',
              fontFace: 'Arial',
            });
          }
        });
      } else if (layout === 'card_grid') {
        const cards = slideItem.cards || [];
        cards.slice(0, 4).forEach((card, cIdx) => {
          const col = cIdx % 2;
          const row = Math.floor(cIdx / 2);
          const xPos = 0.6 + col * 4.4;
          const yPos = 2.5 + row * 1.9;

          pptSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: xPos,
            y: yPos,
            w: 4.1,
            h: 1.7,
            fill: { color: '0F172A' },
            line: { color: '1E293B', width: 1 },
          });

          if (card.header) {
            pptSlide.addText(card.header, {
              x: xPos + 0.25,
              y: yPos + 0.2,
              w: 3.6,
              h: 0.45,
              fontSize: 14,
              bold: true,
              color: 'FFFFFF',
              fontFace: 'Arial',
            });
          }

          if (card.description) {
            pptSlide.addText(card.description, {
              x: xPos + 0.25,
              y: yPos + 0.7,
              w: 3.6,
              h: 0.85,
              fontSize: 11,
              color: '94A3B8',
              fontFace: 'Arial',
            });
          }
        });
      } else if (layout === 'contact_closing') {
        const cards = slideItem.cards || [];
        cards.slice(0, 4).forEach((card, cIdx) => {
          const col = cIdx % 2;
          const row = Math.floor(cIdx / 2);
          const xPos = 0.6 + col * 4.4;
          const yPos = 2.5 + row * 1.9;

          pptSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: xPos,
            y: yPos,
            w: 4.1,
            h: 1.7,
            fill: { color: primaryHex, transparency: 85 },
            line: { color: accentHex, width: 1 },
          });

          if (card.header) {
            pptSlide.addText(card.header, {
              x: xPos + 0.3,
              y: yPos + 0.2,
              w: 3.5,
              h: 0.4,
              fontSize: 12,
              bold: true,
              color: accentHex,
              fontFace: 'Arial',
            });
          }

          if (card.description) {
            pptSlide.addText(card.description, {
              x: xPos + 0.3,
              y: yPos + 0.65,
              w: 3.5,
              h: 0.8,
              fontSize: 13,
              bold: true,
              color: 'FFFFFF',
              fontFace: 'Arial',
            });
          }
        });
      }

      // Slide Footer (branding and page number)
      pptSlide.addText(`${trimmedName} • PitchKu 16:9`, {
        x: 0.6,
        y: 6.8,
        w: 6.0,
        h: 0.3,
        fontSize: 9,
        color: '475569',
        fontFace: 'Arial',
      });
      pptSlide.addText(`${index + 1} / ${slides.length}`, {
        x: 8.0,
        y: 6.8,
        w: 1.4,
        h: 0.3,
        fontSize: 9,
        color: '475569',
        align: 'right',
        fontFace: 'Arial',
      });
    });

    await pptx.writeFile({ fileName: `${trimmedName}.pptx` });
  };

  // ── Real Multi-Page PDF Generation using html2canvas & jsPDF ────────────
  const generatePDF = async (trimmedName) => {
    // Target the main slide canvas viewport container
    const canvasElement = document.querySelector('#slide-canvas-main') || document.querySelector('[style*="aspect-ratio"]');
    if (!canvasElement) {
      throw new Error('Canvas slide tidak ditemukan.');
    }

    const canvas = await html2canvas(canvasElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#070C15',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${trimmedName}.pdf`);
  };

  const handleDownload = async () => {
    const trimmedName = fileName.trim();
    if (!trimmedName) {
      toast.error('Nama file tidak boleh kosong');
      return;
    }

    setIsDownloading(true);
    const format = FORMAT_OPTIONS.find((f) => f.id === selectedFormat);

    toast.loading(`Membuat file ${format?.label}...`, { id: 'export-toast' });

    try {
      if (selectedFormat === 'pptx') {
        await generatePPTX(trimmedName);
      } else {
        await generatePDF(trimmedName);
      }

      setIsDownloading(false);
      toast.success(`Berhasil mengunduh ${format?.label}!`, {
        id: 'export-toast',
        description: `File valid disimpan sebagai "${trimmedName}${format?.ext}"`,
      });
      onOpenChange(false);
    } catch (err) {
      console.error('Export error:', err);
      setIsDownloading(false);
      toast.error(`Gagal membuat file ${format?.label}`, {
        id: 'export-toast',
        description: err?.message || 'Terjadi kesalahan saat memproses ekspor.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="export-modal"
        className="sm:max-w-md bg-[#0D1525] border border-slate-700/60 text-slate-100 shadow-2xl shadow-black/60"
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <FileDown className="w-5 h-5 text-amber-400" />
            Unduh Presentasi Native
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            Pilih format dan nama file untuk mengunduh slide deck Anda secara penuh.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* File name input */}
          <div className="space-y-1.5">
            <Label htmlFor="export-filename" className="text-sm font-medium text-slate-300">
              Nama File
            </Label>
            <Input
              id="export-filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Contoh: Kopi Nusantara 2025"
              maxLength={120}
              className="bg-slate-800/60 border-slate-700/60 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500/20"
            />
            <p className="text-[10px] text-slate-500">
              Ekstensi format (.pptx / .pdf) akan ditambahkan secara otomatis.
            </p>
          </div>

          {/* Format selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Format Unduhan</Label>
            <div className="grid grid-cols-2 gap-3">
              {FORMAT_OPTIONS.map(({ id, label, ext, icon: Icon, description, color }) => {
                const isSelected = selectedFormat === id;
                return (
                  <button
                    key={id}
                    id={`export-format-${id}`}
                    onClick={() => setSelectedFormat(id)}
                    className={cn(
                      'flex flex-col items-start gap-2 p-3.5 rounded-xl border transition-all cursor-pointer text-left',
                      isSelected
                        ? color === 'sky'
                          ? 'border-sky-500/60 bg-sky-500/10 ring-1 ring-sky-500/30'
                          : 'border-violet-500/60 bg-violet-500/10 ring-1 ring-violet-500/30'
                        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/60'
                    )}
                    aria-pressed={isSelected}
                    aria-label={`Format ${label}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={cn(
                          'w-4 h-4',
                          isSelected
                            ? color === 'sky'
                              ? 'text-sky-400'
                              : 'text-violet-400'
                            : 'text-slate-400'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          isSelected ? 'text-white' : 'text-slate-300'
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-[10px] leading-tight',
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      )}
                    >
                      {description}
                    </span>
                    <code
                      className={cn(
                        'text-[9px] font-mono px-1.5 py-0.5 rounded',
                        isSelected
                          ? color === 'sky'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-violet-500/20 text-violet-300'
                          : 'bg-slate-700/50 text-slate-400'
                      )}
                    >
                      {ext}
                    </code>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDownloading}
            className="flex-1 bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
          >
            Batal
          </Button>
          <Button
            id="export-confirm-btn"
            onClick={handleDownload}
            disabled={isDownloading || !fileName.trim()}
            className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold cursor-pointer shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Mengunduh...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 mr-2" />
                Unduh Sekarang
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

