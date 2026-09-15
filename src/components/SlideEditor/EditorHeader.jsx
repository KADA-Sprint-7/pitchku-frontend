import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Check,
  CheckCircle2,
  Loader2,
  Download,
  Maximize2,
  LayoutPanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';

/**
 * EditorHeader
 * Top navigation bar for the Slide Editor page.
 *
 * Props:
 * - deckTitle:        string  — displayed deck title
 * - status:           string  — 'draft' | 'selesai'
 * - onStatusToggle:   fn      — toggles project status
 * - isSaving:         boolean — shows saving/saved indicator
 * - onOpenExport:     fn      — opens the export/download modal
 * - onRenameTitle:    fn(newTitle) — called when the title is confirmed
 */
export default function EditorHeader({
  deckTitle,
  status = 'draft',
  onStatusToggle,
  isSaving,
  onOpenExport,
  onRenameTitle,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(deckTitle);
  const inputRef = useRef(null);

  const isCompleted = status === 'selesai';

  // User display metadata & initials matching AppSidebar
  const displayName = useMemo(() => {
    return (
      user?.user_metadata?.full_name ||
      user?.user_metadata?.company_name ||
      user?.email?.split('@')[0] ||
      'Pengguna'
    );
  }, [user]);

  const initials = useMemo(() => {
    if (!displayName) return 'PK';
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [displayName]);

  // Sync external title changes
  useEffect(() => {
    setDraftTitle(deckTitle);
  }, [deckTitle]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleConfirmRename = () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== deckTitle) {
      onRenameTitle(trimmed);
    } else {
      setDraftTitle(deckTitle); // reset if empty/unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirmRename();
    if (e.key === 'Escape') {
      setDraftTitle(deckTitle);
      setIsEditing(false);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <header className="h-14 flex items-center justify-between px-4 gap-3 bg-[#0B111E] border-b border-slate-800/80 flex-shrink-0 z-40">
        {/* LEFT — Brand + badge + back */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800 w-8 h-8 shrink-0 cursor-pointer"
                onClick={() => navigate("/dashboard")}
                aria-label="Kembali"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Kembali</TooltipContent>
          </Tooltip>

          {/* Logo + Editor badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <LayoutPanelLeft className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-bold text-white hidden sm:block">PitchKu</span>
            </div>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 tracking-wide uppercase hidden sm:block">
              Editor
            </span>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-slate-700/60 shrink-0" />

          {/* Deck title — inline editable */}
          <div className="flex items-center gap-1.5 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  ref={inputRef}
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onBlur={handleConfirmRename}
                  onKeyDown={handleKeyDown}
                  maxLength={80}
                  className="text-sm font-medium text-white bg-slate-800 border border-sky-500/60 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-sky-500 w-52 sm:w-72"
                  aria-label="Judul deck"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleConfirmRename}
                  className="w-7 h-7 text-sky-400 hover:bg-sky-500/10 cursor-pointer shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 group min-w-0 cursor-pointer"
                aria-label="Edit judul deck"
              >
                <span className="text-sm font-medium text-slate-200 truncate max-w-[160px] sm:max-w-xs group-hover:text-white transition-colors">
                  {deckTitle}
                </span>
                <Pencil className="w-3 h-3 text-slate-500 group-hover:text-sky-400 shrink-0 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* CENTER — auto-save status & project status */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Status Badge Toggle */}
          <button
            type="button"
            onClick={onStatusToggle}
            title={isCompleted ? "Klik untuk ubah status ke Draf" : "Klik untuk tandai proyek Selesai"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer hover:scale-105 select-none ${
              isCompleted
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25"
                : "bg-amber-500/15 text-amber-400 border-amber-500/40 hover:bg-amber-500/25"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isCompleted ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
              }`}
            />
            <span>{isCompleted ? "Selesai" : "Draf"}</span>
          </button>

          {/* Autosave status indicator */}
          <div className="flex items-center gap-1.5 hidden md:flex">
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-xs text-amber-400">Menyimpan...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Tersimpan otomatis</span>
              </>
            )}
          </div>
        </div>

        {/* RIGHT — actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Export / Download button */}
          <Button
            id="editor-export-btn"
            onClick={onOpenExport}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs h-8 px-3 gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02]"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Unduh PPTX</span>
          </Button>

          {/* Fullscreen toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800 w-8 h-8 cursor-pointer"
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen?.();
                  } else {
                    document.exitFullscreen?.();
                  }
                }}
                aria-label="Mode layar penuh"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Layar Penuh</TooltipContent>
          </Tooltip>

          {/* User Avatar with Initials matching Dashboard Sidebar */}
          <div
            title={displayName}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-[1.5px] shadow-md shadow-amber-500/10 shrink-0 select-none"
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-[10px] font-bold text-amber-400 leading-none">
                {initials}
              </span>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
