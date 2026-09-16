import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * WizardFooterBar — bottom navigation bar for wizard step transitions.
 * @param {number} step - Current step (1-based: 1=Template, 2=Context form)
 * @param {function} onBack - Go back handler
 * @param {function} onNext - Go next handler
 * @param {boolean} canProceed - Whether the "next" action is enabled
 * @param {string} nextLabel - Custom label for the next button
 */
export default function WizardFooterBar({
  step = 1,
  onBack,
  onNext,
  canProceed = false,
  nextLabel,
}) {
  const showBack = step > 1;
  const defaultNextLabel =
    step === 1
      ? 'Lanjutkan ke Konteks & Brand Kit'
      : 'Lanjutkan';

  return (
    <div className="sticky bottom-16 md:bottom-0 z-40 border-t border-slate-800/60 bg-[#070C15]/95 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Back button */}
        {showBack ? (
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-600 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        ) : (
          <div /> /* spacer */
        )}

        {/* Next / CTA button */}
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            gap-2 px-5 font-semibold transition-all duration-200
            ${
              canProceed
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {nextLabel || defaultNextLabel}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
