import React from 'react';
import { Monitor, List, Settings2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const RAIL_ITEMS = [
  { id: 'canvas', label: 'Slide Canvas', icon: Monitor },
  { id: 'outline', label: 'Outline View', icon: List },
  { id: 'settings', label: 'Deck Settings', icon: Settings2 },
];

/**
 * EditorSidebarRail
 * Narrow icon-rail on the left side of the editor layout.
 *
 * Props:
 * - activeView: 'canvas' | 'outline' | 'settings'
 * - onViewChange: fn(id)
 */
export default function EditorSidebarRail({ activeView = 'canvas', onViewChange }) {
  return (
    <TooltipProvider delayDuration={300}>
      <aside className="w-14 flex flex-col items-center py-4 gap-1 bg-[#080D1A] border-r border-slate-800/80 shrink-0">
        {/* Section label */}
        <span className="text-[8px] font-semibold uppercase tracking-widest text-slate-600 mb-2 select-none">
          Slide
        </span>

        {RAIL_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <button
                  id={`editor-rail-${id}`}
                  onClick={() => onViewChange?.(id)}
                  className={cn(
                    'w-10 h-10 flex flex-col items-center justify-center rounded-xl gap-0.5 transition-all duration-150 cursor-pointer group',
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/40'
                      : 'text-slate-500 hover:bg-slate-800/60 hover:text-slate-300'
                  )}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </aside>
    </TooltipProvider>
  );
}
