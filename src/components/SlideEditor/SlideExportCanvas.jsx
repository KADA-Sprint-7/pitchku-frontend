import React from 'react';
import SlideLayoutRenderer from './SlideLayoutRenderer';
import { hexToRgba } from '@/lib/colorUtils';

/**
 * SlideExportCanvas
 * Hidden pure DOM container used specifically to render all slides
 * with exact web CSS styles (gradients, layout, shadows, typography, image cropping)
 * for pristine 1:1 image/PDF/PPTX capture.
 */
export default function SlideExportCanvas({ deckPayload, deckTitle }) {
  if (!deckPayload || !deckPayload.slides) return null;

  const brandKit = deckPayload.brandKit || {};
  const totalSlides = deckPayload.slides.length;
  const accent = brandKit.accentColor || '#F2A007';
  const logoUrl = brandKit.logoUrl;
  const selectedFont = brandKit.fontFamily || 'Inter';
  const safeFontFamily = `"${selectedFont}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

  const LAYOUT_LABELS = {
    title_slide: 'Cover',
    title_bullets: 'Penjelasan',
    two_column: 'Komparasi',
    metrics_grid: 'Metrik',
    card_grid: 'Konten',
    contact_closing: 'Penutup',
  };

  return (
    <div
      id="pitchku-export-hidden-container"
      style={{
        position: 'fixed',
        left: '-99999px',
        top: '0',
        zIndex: -100,
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      {deckPayload.slides.map((slide, index) => {
        const slideNum = index + 1;
        const isTitleSlide = slide.layout === 'title_slide';
        const layoutLabel = LAYOUT_LABELS[slide.layout] || 'Slide';
        const babLabel = `BAB ${String(slideNum).padStart(2, '0')} • ${layoutLabel.toUpperCase()}`;

        return (
          <div
            key={slide.id || index}
            id={`pitchku-export-slide-${index}`}
            style={{
              width: '960px',
              height: '540px',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              fontFamily: 'Arial, sans-serif',
              boxSizing: 'border-box',
              marginBottom: '40px',
            }}
          >
            {/* Top Header Row */}
            <div className="hidden"
              style={{
                position: 'absolute',
                top: '14px',
                left: '24px',
                right: '24px',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '2px 10px',
                  borderRadius: '9999px',
                  border: `1px solid ${hexToRgba(accent, 0.4)}`,
                  color: accent,
                  backgroundColor: hexToRgba(accent, 0.15),
                }}
              >
                {babLabel}
              </span>

              {!isTitleSlide && (
                <div>
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      style={{
                        height: '22px',
                        width: 'auto',
                        objectFit: 'contain',
                        maxWidth: '90px',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'monospace',
                        color: '#64748B',
                        padding: '2px 8px',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        borderRadius: '4px',
                        border: '1px solid #1E293B',
                      }}
                    >
                      LOGO
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Footer Bar */}
            <div className="hidden"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 20,
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(0,0,0,0.4)',
                color: '#94A3B8',
                fontSize: '9px',
                fontWeight: 500,
              }}
            >
              <span>{deckTitle || 'PitchKu Presentasi'}</span>
              <span style={{ fontFamily: 'monospace' }}>
                {String(slideNum).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
              </span>
            </div>

            {/* Main Content Area (Exact 960x540 viewport) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                paddingTop: 0,
                paddingBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                width: '960px',
                height: '540px',
                boxSizing: 'border-box',
              }}
            >
              <SlideLayoutRenderer
                slide={slide}
                brandKit={brandKit}
                editingField={null}
                onFieldClick={() => {}}
                onFieldChange={() => {}}
                onFieldCommit={() => {}}
                onImageClick={() => {}}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
