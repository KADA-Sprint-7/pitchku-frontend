import React from 'react';

// 3 wizard steps matching the HowItWorks.jsx style from landing page
const WIZARD_STEPS = [
  {
    number: '01',
    title: 'Input Konteks & Brand Kit',
    numberStyle: {
      active: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
      done: 'bg-amber-500 border-amber-500 text-slate-950',
      upcoming: 'bg-slate-800/60 border-slate-700/50 text-slate-500',
    },
    lineColor: {
      done: 'bg-amber-500/60',
      upcoming: 'bg-slate-700/50',
    },
  },
  {
    number: '02',
    title: 'Konfirmasi Outline',
    numberStyle: {
      active: 'bg-sky-500/20 border-sky-500/50 text-sky-400',
      done: 'bg-sky-500 border-sky-500 text-slate-950',
      upcoming: 'bg-slate-800/60 border-slate-700/50 text-slate-500',
    },
    lineColor: {
      done: 'bg-sky-500/60',
      upcoming: 'bg-slate-700/50',
    },
  },
  {
    number: '03',
    title: 'Edit & Unduh PPTX',
    numberStyle: {
      active: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
      done: 'bg-emerald-500 border-emerald-500 text-slate-950',
      upcoming: 'bg-slate-800/60 border-slate-700/50 text-slate-500',
    },
    lineColor: {
      done: 'bg-emerald-500/60',
      upcoming: 'bg-slate-700/50',
    },
  },
];

/**
 * WizardStepper — 3-point horizontal progress indicator.
 * @param {number} currentStep - The active step index (0-based).
 */
export default function WizardStepper({ currentStep = 0 }) {
  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="flex items-center">
        {WIZARD_STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === WIZARD_STEPS.length - 1;

          // Determine style key
          const styleKey = isDone ? 'done' : isActive ? 'active' : 'upcoming';

          return (
            <React.Fragment key={index}>
              {/* Step node */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                {/* Number badge */}
                <div
                  className={`
                    w-10 h-10 rounded-xl border flex items-center justify-center
                    text-sm font-bold transition-all duration-300
                    ${step.numberStyle[styleKey]}
                  `}
                >
                  {isDone ? (
                    <svg
                      className="w-4.5 h-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                {/* Title */}
                <span
                  className={`
                    text-[10px] sm:text-xs font-semibold text-center leading-tight max-w-[100px]
                    transition-colors duration-300
                    ${isDone || isActive ? 'text-white' : 'text-slate-500'}
                  `}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-3 mb-6">
                  <div
                    className={`
                      h-[2px] rounded-full transition-all duration-500
                      ${isDone ? step.lineColor.done : step.lineColor.upcoming}
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
