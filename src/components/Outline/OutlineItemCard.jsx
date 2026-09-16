import React, { useState } from 'react';
import { GripVertical, Copy, Trash2, Check, Edit3, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OutlineItemCard({
  item,
  index,
  totalSlides,
  onTitleChange,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  isDragging,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const slideNumStr = String(item.slideNumber || index + 1).padStart(2, '0');
  const titleLength = (item.title || '').length;
  const isOverLimit = titleLength > 60;

  return (
    <div
      data-outline-index={index}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      onTouchStart={() => onTouchStart?.(index)}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`group relative flex items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-all ${
        isDragging
          ? 'opacity-40 border-dashed border-sky-400 bg-slate-900/50 scale-[0.99]'
          : isFocused
          ? 'bg-[#0F172A] border-sky-500/70 ring-1 ring-sky-500/30 shadow-lg'
          : 'bg-[#0B111E]/90 border-slate-800 hover:border-slate-700/90 hover:bg-slate-900/70 shadow-sm'
      }`}
    >
      {/* Left: Drag Handle, Quick Move Arrows & Number Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <div
          title="Tarik untuk memindahkan urutan slide"
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-500 hover:text-sky-400 transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Quick Move Up/Down buttons for mobile touch convenience */}
        <div className="flex flex-col gap-0.5 sm:hidden">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMoveUp?.(index)}
            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-sky-400 disabled:opacity-20 transition-colors"
            title="Pindahkan Ke Atas"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === totalSlides - 1}
            onClick={() => onMoveDown?.(index)}
            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-sky-400 disabled:opacity-20 transition-colors"
            title="Pindahkan Ke Bawah"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-bold text-sky-400 font-mono tracking-wider shrink-0">
          <span>{slideNumStr}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-sans truncate max-w-[120px] hidden sm:inline">
            {item.suggestedLayout || 'Slide'}
          </span>
        </div>
      </div>

      {/* Center: Title Inline Input */}
      <div className="flex-1 min-w-0 relative">
        <input
          type="text"
          value={item.title || ''}
          maxLength={70}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onTitleChange(item.id, e.target.value)}
          placeholder="Tuliskan judul slide ini..."
          className={`w-full bg-transparent text-sm sm:text-base font-semibold text-white placeholder:text-slate-600 outline-none px-2.5 py-1.5 rounded-lg transition-colors ${
            isFocused
              ? 'bg-slate-950/60 border border-slate-700 ring-1 ring-sky-500/30'
              : 'border border-transparent hover:border-slate-700/60 hover:bg-slate-950/30'
          } ${isOverLimit ? 'text-red-400' : ''}`}
        />

        {/* Character limit counter on focus */}
        {isFocused && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono pointer-events-none">
            {isOverLimit && <AlertCircle className="w-3 h-3 text-red-400" />}
            <span className={isOverLimit ? 'text-red-400 font-bold' : 'text-slate-500'}>
              {titleLength}/60
            </span>
          </div>
        )}
      </div>

      {/* Right: Layout Recommendation Badge & Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Canonical Layout Tag Badge */}
        <div className="hidden md:flex items-center px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-300">
          {item.suggestedLayout || 'Hero Cover'}
        </div>

        {/* Duplicate Action */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDuplicate(item.id)}
          title="Duplikasi slide ini"
          className="h-8 w-8 p-0 text-slate-400 hover:text-sky-300 hover:bg-sky-500/10 cursor-pointer transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>

        {/* Delete Action */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={totalSlides <= 3}
          onClick={() => onDelete(item.id)}
          title={
            totalSlides <= 3
              ? 'Minimal 3 slide dalam presentasi'
              : 'Hapus slide ini'
          }
          className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
