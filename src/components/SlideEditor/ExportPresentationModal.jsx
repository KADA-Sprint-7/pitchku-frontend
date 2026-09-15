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
import { exportPptxApi } from '@/lib/aiService';
import {
  toSolidHex,
  fitDimensions,
  getImageNaturalDimensions,
  urlToDataUrl,
  hexToRgba,
} from '@/lib/colorUtils';

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
 * Generates real PPTX presentation via backend /api/export/pptx or pptxgenjs, or 16:9 high-res PDF via html2canvas & jsPDF.
 *
 * Props:
 * - open:            boolean
 * - onOpenChange:    fn(open)
 * - deckTitle:       string
 * - deckPayload:     PitchKuDeckPayload object
 * - onExportSuccess: fn() - called when export successfully completes
 */
export default function ExportPresentationModal({
  open,
  onOpenChange,
  deckTitle,
  deckPayload,
  onExportSuccess,
}) {
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

  // ── Color Conversion Utilities ─────────────────────────────────────────────
  //
  // html2canvas v1 and pptxgenjs cannot parse modern CSS color functions like
  // oklch(), oklab(), color-mix(), lab(), lch(). The strategy here is to let
  // the *browser* resolve these functions to rgb()/rgba() via getComputedStyle,
  // then convert the resulting rgb string to a #RRGGBB hex that both libraries
  // can handle.

  /**
   * Convert any CSS color string to #RRGGBB hex using the browser as the resolver.
   * Works for oklch(), oklab(), color-mix(), lab(), lch(), hsl(), rgb(), named colors…
   * Falls back to '#000000' if the browser rejects the value.
   */
  const resolveColorToHex = (() => {
    // Reuse a single hidden probe element across all conversions (performance)
    let probe = null;
    const getProbe = () => {
      if (!probe || !document.body.contains(probe)) {
        probe = document.createElement('div');
        probe.style.cssText = 'position:fixed;left:-99999px;top:-99999px;width:1px;height:1px;opacity:0;pointer-events:none;';
        document.body.appendChild(probe);
      }
      return probe;
    };

    return (colorValue) => {
      if (!colorValue || typeof colorValue !== 'string') return '#000000';
      const clean = colorValue.trim();
      // 3 or 6 hex digits are safe
      if (/^#[0-9a-f]{3}$/i.test(clean) || /^#[0-9a-f]{6}$/i.test(clean)) {
        return clean;
      }
      // 8 hex digits #RRGGBBAA -> convert to 6 digits solid hex
      if (/^#[0-9a-f]{8}$/i.test(clean)) {
        return `#${clean.slice(1, 7)}`;
      }

      try {
        const el = getProbe();
        // Reset first so stale value doesn't leak
        el.style.color = 'rgb(0,0,0)';
        el.style.color = colorValue;
        const computed = window.getComputedStyle(el).color; // Always resolves to rgb(a)
        if (!computed || computed === 'rgba(0, 0, 0, 0)' || computed === '') {
          // If the browser returned transparent or empty, the color was invalid
          return '#000000';
        }
        // Parse "rgb(r, g, b)" or "rgba(r, g, b, a)"
        const parts = computed.match(/[\d.]+/g);
        if (!parts || parts.length < 3) return '#000000';
        const r = Math.round(parseFloat(parts[0]));
        const g = Math.round(parseFloat(parts[1]));
        const b = Math.round(parseFloat(parts[2]));
        const a = parts[4] !== undefined ? parseFloat(parts[4]) : (parts[3] !== undefined ? parseFloat(parts[3]) : 1);
        if (a < 0.01) return 'transparent'; // Fully transparent — keep as-is
        // Blend alpha with dark canvas background #070C15 (r:7, g:12, b:21) for hex output
        const toHex = (ch, bgCh) => {
          const blended = Math.round(ch * a + bgCh * (1 - a));
          return Math.min(255, Math.max(0, blended)).toString(16).padStart(2, '0');
        };
        return `#${toHex(r, 7)}${toHex(g, 12)}${toHex(b, 21)}`;
      } catch {
        return '#000000';
      }
    };
  })();

  /**
   * Detect whether a CSS value string contains an unsupported modern color function.
   */
  const MODERN_COLOR_FNS = ['oklch(', 'oklab(', 'color-mix(', 'lab(', 'lch('];
  const hasModernColor = (val) =>
    typeof val === 'string' && MODERN_COLOR_FNS.some((fn) => val.includes(fn));

  /**
   * Replace all modern color function occurrences in a CSS text string with their
   * resolved HEX equivalent. Handles both property-value pairs in stylesheets
   * ("color: oklch(...)") and standalone values ("oklch(...)").
   */
  const convertModernColorsInText = (cssText) => {
    if (!hasModernColor(cssText)) return cssText;
    // Match the full color function call including nested parens (color-mix has nested values)
    return cssText.replace(
      /\b(oklch|oklab|color-mix|lab|lch)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gi,
      (match) => resolveColorToHex(match)
    );
  };

  /**
   * Deep-sanitize a cloned document before passing it to html2canvas.
   * Converts all modern CSS color functions → HEX in:
   *   1. <style> tag text content
   *   2. Inline style= attributes on every element
   *   3. Live CSSStyleSheet rules (Tailwind v4 output injected at runtime)
   *   4. Known CSS custom properties (--border, --ring, etc.) on :root / elements
   */
  const sanitizeClonedDoc = (clonedDoc) => {
    // 1. Patch <style> tag text
    clonedDoc.querySelectorAll('style').forEach((tag) => {
      if (hasModernColor(tag.textContent)) {
        tag.textContent = convertModernColorsInText(tag.textContent);
      }
    });

    // 2. Patch live CSSOM rules (Tailwind v4 injects styles via CSSStyleSheet at runtime)
    Array.from(clonedDoc.styleSheets || []).forEach((sheet) => {
      try {
        Array.from(sheet.cssRules || sheet.rules || []).forEach((rule) => {
          try {
            if (!rule.style) return;
            Array.from(rule.style).forEach((prop) => {
              const val = rule.style.getPropertyValue(prop);
              if (hasModernColor(val)) {
                const hex = resolveColorToHex(val);
                rule.style.setProperty(prop, hex, rule.style.getPropertyPriority(prop));
              }
            });
          } catch { /* read-only / cross-origin rule — skip */ }
        });
      } catch { /* cross-origin stylesheet — skip */ }
    });

    // 3. Patch inline style= attributes and known CSS custom properties on every element
    const TAILWIND_COLOR_VARS = [
      '--background', '--foreground', '--card', '--card-foreground',
      '--popover', '--popover-foreground', '--primary', '--primary-foreground',
      '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
      '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
      '--border', '--input', '--ring',
      '--sidebar', '--sidebar-foreground', '--sidebar-primary', '--sidebar-primary-foreground',
      '--sidebar-accent', '--sidebar-accent-foreground', '--sidebar-border', '--sidebar-ring',
    ];

    clonedDoc.querySelectorAll('*').forEach((el) => {
      try {
        // Patch inline style attribute
        const styleAttr = el.getAttribute('style');
        if (styleAttr && hasModernColor(styleAttr)) {
          el.setAttribute('style', convertModernColorsInText(styleAttr));
        }

        // Patch known CSS custom property values set directly on this element
        const elStyle = el.style;
        if (elStyle) {
          TAILWIND_COLOR_VARS.forEach((varName) => {
            const val = elStyle.getPropertyValue(varName);
            if (hasModernColor(val)) {
              elStyle.setProperty(varName, resolveColorToHex(val));
            }
          });
        }
      } catch { /* ignore */ }
    });

    // 4. Make the hidden export container fully visible in the cloned snapshot
    const container = clonedDoc.getElementById('pitchku-export-hidden-container');
    if (container) {
      container.style.cssText = [
        container.getAttribute('style') || '',
        'position: static !important; left: 0 !important; top: 0 !important;',
        'opacity: 1 !important; z-index: 1 !important; pointer-events: auto !important;',
      ].join(' ');
    }
  };


  // ── Native pptxgenjs PPTX Builder (editable text, consistent colors) ──────
  //
  // Instead of screenshotting the DOM with html2canvas (which produces a flat,
  // non-editable PNG image and is sensitive to CSS colour parsing bugs),
  // we build the PPTX *programmatically* from deckPayload data using the
  // pptxgenjs native API.  Every text box, background, and shape is an actual
  // PPTX object — fully editable in PowerPoint / LibreOffice.
  //
  // Layout mapping (pptxgenjs units: inches, 10"×5.625"):
  //   W = 10 inches,  H = 5.625 inches

  const PW = 10;    // Slide width  (inches)
  const PH = 5.625; // Slide height (inches)

  /** Strip alpha hex channels so pptxgenjs always receives a clean #RRGGBB */
  const toSolidHex = (hex) => {
    if (!hex || typeof hex !== 'string') return '070C15';
    const clean = hex.replace('#', '');
    // 8-char RRGGBBAA → take first 6
    return clean.length >= 6 ? clean.slice(0, 6).toUpperCase() : clean.toUpperCase();
  };

  /**
   * Add a full-slide solid background shape.
   * Matches the clean flat dark theme (#070C15).
   */
  const addSlideBackground = (pptSlide) => {
    pptSlide.addShape('rect', {
      x: 0, y: 0, w: PW, h: PH,
      fill: { color: '070C15' },
      line: { color: '070C15' },
    });
  };

  /** Accent bar — thin coloured horizontal rule */
  const addAccentBar = (pptSlide, x, y, w, accent) => {
    pptSlide.addShape('rect', {
      x, y, w, h: 0.05,
      fill: { color: toSolidHex(accent) },
      line: { color: toSolidHex(accent) },
    });
  };

  /** Helper: add an editable text object with sensible defaults */
  const addText = (pptSlide, text, opts) => {
    if (!text && text !== 0) return;
    pptSlide.addText(String(text), {
      fontFace: 'Inter',
      color: 'FFFFFF',
      wrap: true,
      valign: 'top',
      ...opts,
    });
  };

  /** Build one PPTX slide from a PitchKu slide data object */
  const buildPptxSlide = (
    pptx,
    slideData,
    brandKit,
    slideNum,
    totalSlides,
    deckTitle,
    logoDim,
    logoDataUrl,
    slideImageDataUrl
  ) => {
    const primary = toSolidHex(brandKit?.primaryColor || '#0F4C81');
    const accent  = toSolidHex(brandKit?.accentColor  || '#F2A007');
    const font    = brandKit?.fontFamily || 'Inter';
    const logoUrl = brandKit?.logoUrl;

    const pptSlide = pptx.addSlide();

    // ── Background ──────────────────────────────────────────────────────────
    addSlideBackground(pptSlide);

    // ── Header row (bab label + logo) ───────────────────────────────────────
    const LAYOUT_LABELS = {
      title_slide: 'Cover', title_bullets: 'Penjelasan', two_column: 'Komparasi',
      metrics_grid: 'Metrik', card_grid: 'Konten', contact_closing: 'Penutup',
    };
    const babLabel = `BAB ${String(slideNum).padStart(2, '0')} • ${(LAYOUT_LABELS[slideData.layout] || 'Slide').toUpperCase()}`;

    // Bab badge
    pptSlide.addShape('roundRect', {
      x: 0.4, y: 0.2, w: 2.2, h: 0.32, rectRadius: 0.16,
      fill: { color: '0F1A2E' },
      line: { color: accent, width: 1 },
    });
    addText(pptSlide, babLabel, {
      x: 0.4, y: 0.2, w: 2.2, h: 0.32,
      fontSize: 7, bold: true, color: accent, fontFace: font,
      align: 'center', valign: 'middle',
    });

    // Logo (top-right, skip on title_slide)
    if (slideData.layout !== 'title_slide') {
      const hasLogo = !!logoDataUrl || !!logoUrl;
      if (hasLogo) {
        try {
          const maxW = 1.6;
          const maxH = 0.4;
          let w = maxW;
          let h = maxH;
          let yOffset = 0;
          let xOffset = 0;

          if (logoDim && logoDim.width && logoDim.height) {
            const fitted = fitDimensions(logoDim.width, logoDim.height, maxW, maxH);
            w = fitted.width;
            h = fitted.height;
            yOffset = fitted.yOffset;
            xOffset = maxW - w; // Right-aligned within the container
          }

          const imgOpts = {
            x: PW - 0.4 - maxW + xOffset,
            y: 0.15 + yOffset,
            w: w,
            h: h,
          };

          if (logoDataUrl) {
            pptSlide.addImage({ ...imgOpts, data: logoDataUrl });
          } else if (logoUrl && !logoUrl.startsWith('blob:')) {
            pptSlide.addImage({ ...imgOpts, path: logoUrl });
          }
        } catch { /* skip if image fails */ }
      }
    }

    // ── Footer ──────────────────────────────────────────────────────────────
    pptSlide.addShape('rect', {
      x: 0, y: PH - 0.38, w: PW, h: 0.38,
      fill: { color: '050A14' },
      line: { color: '1E293B' },
    });
    addText(pptSlide, deckTitle || 'PitchKu Presentasi', {
      x: 0.35, y: PH - 0.38, w: 5, h: 0.38,
      fontSize: 8, color: '94A3B8', fontFace: font, valign: 'middle',
    });
    addText(pptSlide, `${String(slideNum).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`, {
      x: PW - 1.2, y: PH - 0.38, w: 0.9, h: 0.38,
      fontSize: 8, color: '94A3B8', fontFace: font, align: 'right', valign: 'middle',
    });

    // ── Content area Y start (below header) ─────────────────────────────────
    const CY = 0.65;  // content top
    const CH = PH - CY - 0.45; // content height

    // ── Layout-specific content ──────────────────────────────────────────────

    if (slideData.layout === 'title_slide') {
      // Right image
      const hasCoverImage = !!slideImageDataUrl || !!slideData.imageUrl;
      if (hasCoverImage) {
        try {
          const imgOpts = {
            x: PW * 0.62,
            y: 0,
            w: PW * 0.38,
            h: PH,
            sizing: { type: 'cover', w: PW * 0.38, h: PH },
          };
          if (slideImageDataUrl) {
            pptSlide.addImage({ ...imgOpts, data: slideImageDataUrl });
          } else if (slideData.imageUrl && !slideData.imageUrl.startsWith('blob:')) {
            pptSlide.addImage({ ...imgOpts, path: slideData.imageUrl });
          }
        } catch { /* skip */ }
      }
      addAccentBar(pptSlide, 0.55, CY + 0.3, 0.5, '#' + accent);
      addText(pptSlide, slideData.title, {
        x: 0.55, y: CY + 0.5, w: PW * 0.58, h: 1.4,
        fontSize: 26, bold: true, color: 'FFFFFF', fontFace: font,
      });
      if (slideData.subtitle) {
        addText(pptSlide, slideData.subtitle, {
          x: 0.55, y: CY + 2.0, w: PW * 0.56, h: 1.2,
          fontSize: 11, color: 'CBD5E1', fontFace: font,
        });
      }
    }

    else if (slideData.layout === 'title_bullets') {
      const hasImage = !!slideImageDataUrl || !!slideData.imageUrl;
      const contentW = hasImage ? PW * 0.58 : PW - 0.8;

      if (hasImage) {
        try {
          const imgOpts = {
            x: PW * 0.62,
            y: CY,
            w: PW * 0.35,
            h: CH,
            sizing: { type: 'cover', w: PW * 0.35, h: CH },
          };
          if (slideImageDataUrl) {
            pptSlide.addImage({ ...imgOpts, data: slideImageDataUrl });
          } else if (slideData.imageUrl && !slideData.imageUrl.startsWith('blob:')) {
            pptSlide.addImage({ ...imgOpts, path: slideData.imageUrl });
          }
        } catch { /* skip */ }
      }

      addAccentBar(pptSlide, 0.45, CY, 0.4, '#' + accent);
      addText(pptSlide, slideData.title, {
        x: 0.45, y: CY + 0.15, w: contentW, h: 0.7,
        fontSize: 18, bold: true, color: 'FFFFFF', fontFace: font,
      });
      if (slideData.subtitle) {
        addText(pptSlide, slideData.subtitle, {
          x: 0.45, y: CY + 0.9, w: contentW, h: 0.45,
          fontSize: 10, color: '94A3B8', fontFace: font,
        });
      }

      const bullets = (slideData.bullets || []).slice(0, 5);
      bullets.forEach((bullet, idx) => {
        if (!bullet) return;
        const by = CY + 1.45 + idx * 0.52;
        pptSlide.addShape('ellipse', {
          x: 0.45, y: by + 0.07, w: 0.1, h: 0.1,
          fill: { color: accent }, line: { color: accent },
        });
        addText(pptSlide, bullet, {
          x: 0.65, y: by, w: contentW - 0.25, h: 0.45,
          fontSize: 10, color: 'E2E8F0', fontFace: font,
        });
      });
    }

    else if (slideData.layout === 'two_column') {
      addAccentBar(pptSlide, 0.45, CY, 0.4, '#' + accent);
      addText(pptSlide, slideData.title, {
        x: 0.45, y: CY + 0.12, w: PW - 0.9, h: 0.65,
        fontSize: 18, bold: true, color: 'FFFFFF', fontFace: font,
      });

      const cards = slideData.cards || [{}, {}];
      const colW = (PW - 1.0) / 2;
      [0, 1].forEach((ci) => {
        const card = cards[ci] || {};
        const cx = 0.45 + ci * (colW + 0.1);
        const cy = CY + 0.95;
        const colAccent = ci === 0 ? primary : accent;

        pptSlide.addShape('roundRect', {
          x: cx, y: cy, w: colW, h: CH - 1.05, rectRadius: 0.1,
          fill: { color: '0F1A2E' },
          line: { color: '24344D', width: 1 },
        });
        pptSlide.addShape('rect', { x: cx + 0.15, y: cy + 0.15, w: 0.35, h: 0.04, fill: { color: colAccent }, line: { color: colAccent } });
        addText(pptSlide, card.header, { x: cx + 0.15, y: cy + 0.25, w: colW - 0.3, h: 0.5, fontSize: 12, bold: true, color: 'FFFFFF', fontFace: font });
        addText(pptSlide, card.description, { x: cx + 0.15, y: cy + 0.8, w: colW - 0.3, h: CH - 2.1, fontSize: 9, color: 'CBD5E1', fontFace: font });
      });
    }

    else if (slideData.layout === 'metrics_grid') {
      addAccentBar(pptSlide, 0.45, CY, 0.4, '#' + accent);
      addText(pptSlide, slideData.title, {
        x: 0.45, y: CY + 0.12, w: PW - 0.9, h: 0.65,
        fontSize: 18, bold: true, color: 'FFFFFF', fontFace: font,
      });

      const cards = slideData.cards || [];
      const metW = (PW - 1.0) / 2;
      const metH = (CH - 1.05) / 2;
      [0, 1, 2, 3].forEach((idx) => {
        const card = cards[idx] || {};
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const mx = 0.45 + col * (metW + 0.1);
        const my = CY + 0.95 + row * (metH + 0.1);
        const isFirst = idx === 0;
        const metAccent = isFirst ? accent : primary;

        pptSlide.addShape('roundRect', {
          x: mx, y: my, w: metW, h: metH, rectRadius: 0.1,
          fill: { color: '0F1A2E' },
          line: { color: isFirst ? accent : '24344D', width: 1 },
        });
        addText(pptSlide, `METRIK ${idx + 1}`, { x: mx + 0.15, y: my + 0.1, w: metW - 0.3, h: 0.2, fontSize: 7, bold: true, color: metAccent, fontFace: font });
        addText(pptSlide, card.header, { x: mx + 0.15, y: my + 0.32, w: metW - 0.3, h: 0.5, fontSize: 20, bold: true, color: 'FFFFFF', fontFace: font });
        addText(pptSlide, card.description, { x: mx + 0.15, y: my + 0.85, w: metW - 0.3, h: 0.4, fontSize: 9, color: 'CBD5E1', fontFace: font });
      });
    }

    else if (slideData.layout === 'card_grid') {
      addAccentBar(pptSlide, 0.45, CY, 0.4, '#' + accent);
      addText(pptSlide, slideData.title, {
        x: 0.45, y: CY + 0.12, w: PW - 0.9, h: 0.65,
        fontSize: 18, bold: true, color: 'FFFFFF', fontFace: font,
      });

      const cards = slideData.cards || [];
      const cW = (PW - 1.0) / 2;
      const cH = (CH - 1.05) / 2;
      [0, 1, 2, 3].forEach((idx) => {
        const card = cards[idx] || {};
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = 0.45 + col * (cW + 0.1);
        const cy = CY + 0.95 + row * (cH + 0.1);

        pptSlide.addShape('roundRect', {
          x: cx, y: cy, w: cW, h: cH, rectRadius: 0.1,
          fill: { color: '0F1A2E' },
          line: { color: '24344D', width: 1 },
        });
        pptSlide.addShape('rect', { x: cx + 0.15, y: cy + 0.12, w: 0.25, h: 0.04, fill: { color: accent }, line: { color: accent } });
        addText(pptSlide, card.header, { x: cx + 0.15, y: cy + 0.22, w: cW - 0.3, h: 0.4, fontSize: 11, bold: true, color: 'FFFFFF', fontFace: font });
        addText(pptSlide, card.description, { x: cx + 0.15, y: cy + 0.65, w: cW - 0.3, h: cH - 0.75, fontSize: 9, color: 'CBD5E1', fontFace: font });
      });
    }

    else if (slideData.layout === 'contact_closing') {
      addAccentBar(pptSlide, PW / 2 - 0.3, CY + 0.15, 0.6, '#' + accent);
      addText(pptSlide, slideData.title, {
        x: 0.5, y: CY + 0.35, w: PW - 1.0, h: 1.0,
        fontSize: 24, bold: true, color: 'FFFFFF', fontFace: font, align: 'center',
      });
      if (slideData.subtitle) {
        addText(pptSlide, slideData.subtitle, {
          x: 0.8, y: CY + 1.5, w: PW - 1.6, h: 0.6,
          fontSize: 11, color: 'CBD5E1', fontFace: font, align: 'center',
        });
      }

      const cards = slideData.cards || [];
      const ccW = (PW - 1.2) / 2;
      const ccH = 0.85;
      [0, 1, 2, 3].forEach((idx) => {
        const card = cards[idx] || {};
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = 0.55 + col * (ccW + 0.1);
        const cy = CY + 2.25 + row * (ccH + 0.1);

        pptSlide.addShape('roundRect', {
          x: cx, y: cy, w: ccW, h: ccH, rectRadius: 0.08,
          fill: { color: '0F1A2E' },
          line: { color: '24344D', width: 1 },
        });
        addText(pptSlide, card.header, { x: cx + 0.12, y: cy + 0.08, w: ccW - 0.24, h: 0.25, fontSize: 8, bold: true, color: '94A3B8', fontFace: font });
        addText(pptSlide, card.description, { x: cx + 0.12, y: cy + 0.35, w: ccW - 0.24, h: 0.4, fontSize: 10, color: 'FFFFFF', fontFace: font });
      });
    }

    return pptSlide;
  };

  // ── Main PPTX Generator — Menggunakan Backend API Endpoint ──────────────────
  const generatePPTX = async (trimmedName) => {
    if (!deckPayload) {
      throw new Error('Tidak ada data deck untuk diekspor.');
    }

    // Panggil endpoint backend POST /api/export/pptx
    const res = await exportPptxApi(deckPayload, trimmedName);

    if (res && (res.success || res.downloadUrl)) {
      if (onExportSuccess) onExportSuccess();
      return;
    }

    // Jika endpoint mengembalikan respon tidak dikenali, lempar error
    throw new Error('Server gagal menghasilkan file PPTX. Silakan coba lagi.');
  };


  // ── Real Multi-Page PDF Generation using html2canvas & jsPDF ────────────
  const generatePDF = async (trimmedName) => {
    const slides = deckPayload?.slides || [];
    if (slides.length === 0) {
      throw new Error('Tidak ada slide untuk diekspor.');
    }

    // Ensure all web fonts are completely loaded before capturing
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    let pdf = null;

    for (let index = 0; index < slides.length; index++) {
      const slideElement = document.getElementById(`pitchku-export-slide-${index}`);
      if (!slideElement) continue;

      const canvas = await html2canvas(slideElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#070C15',
        logging: false,
        width: 960,
        height: 540,
        onclone: sanitizeClonedDoc,
      });

      const imgData = canvas.toDataURL('image/png');

      if (!pdf) {
        pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [1920, 1080],
        });
      } else {
        pdf.addPage([1920, 1080], 'landscape');
      }

      pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080);
    }

    if (pdf) {
      pdf.save(`${trimmedName}.pdf`);
      if (onExportSuccess) onExportSuccess();
    }
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

