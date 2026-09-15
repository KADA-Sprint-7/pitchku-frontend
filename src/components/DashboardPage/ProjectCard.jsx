import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  ArrowRight,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  Layers,
} from "lucide-react";

const TEMPLATE_NAMES = {
  penawaran_produk: "Penawaran Produk",
  pitch_deck_investor: "Pitch Deck Investor",
  company_profile: "Company Profile",
  laporan_kinerja: "Laporan Kinerja",
  proposal_kerjasama: "Proposal Kerjasama",
};

export default function ProjectCard({ project, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef(null);

  const isCompleted = project.status === "selesai";
  const isDraft = !isCompleted;

  // Route: all projects go to editor (drafts that have deck payload) or outline page
  const hasDeckPayload = project.slideCount > 0 && project.status !== "draft_outline";
  const actionLink = `/editor/${project.id}`;
  const outlineLink = `/outline/${project.id}`;

  const templateName =
    project.templateName ||
    TEMPLATE_NAMES[project.templateType] ||
    project.templateType ||
    "Templat Bisnis";

  const formattedDate = project.updatedAt
    ? (() => {
        try {
          const date = new Date(project.updatedAt);
          if (isNaN(date.getTime())) return project.updatedAt;
          return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(date);
        } catch {
          return project.updatedAt;
        }
      })()
    : "Baru saja";

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const handleConfirmDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    setConfirmDelete(false);
    if (onDelete) onDelete(project.id);
  };

  const handleCancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <div className="group flex flex-col rounded-2xl bg-[#131B2E] border border-slate-800/90 hover:border-slate-700/80 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
      {/* 16:9 Deck Canvas Thumbnail Preview Container */}
      <div className="relative aspect-video w-full bg-slate-950/90 overflow-hidden border-b border-slate-800/60 flex items-center justify-center p-3">
        <div
          className={`w-full h-full rounded-lg bg-gradient-to-br ${
            project.accentBg || "from-slate-900 via-slate-900 to-slate-950"
          } p-3.5 flex flex-col justify-between border border-white/5 relative group-hover:scale-[1.02] transition-transform duration-300`}
        >
          {/* Top badges inside canvas preview */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onStatusChange) {
                  onStatusChange(project.id, isCompleted ? "draft" : "selesai");
                }
              }}
              title={isCompleted ? "Klik untuk ubah ke Draf" : "Klik untuk tandai Selesai"}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md cursor-pointer transition-all hover:scale-105 ${
                isCompleted
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/80"
                  : "bg-amber-950/60 text-amber-400 border-amber-500/30 hover:bg-amber-900/80"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCompleted ? "bg-emerald-400 animate-none" : "bg-amber-400 animate-pulse"
                }`}
              />
              {isCompleted ? "Selesai" : "Draft"}
            </button>

            {/* Slide count badge with completion indicator */}
            <div className="flex items-center gap-1.5">
              {isCompleted && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-300 bg-slate-900/80 border border-slate-700/60 flex items-center gap-1">
                <Layers className="w-2.5 h-2.5" />
                {project.slideCount || 0} Slide
              </span>
            </div>
          </div>

          {/* Center mock slide title placeholder */}
          <div className="text-center py-2 px-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-0.5">
              {project.category || templateName}
            </span>
            <p className="text-xs font-bold text-slate-200 line-clamp-1">
              {project.title || "Tanpa Judul"}
            </p>
          </div>

          {/* Bottom canvas metadata */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
              Rasio {project.ratio || "16:9"}
            </span>
            <span className="truncate max-w-[130px]">
              Template: {templateName}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors line-clamp-1">
              {project.title || "Tanpa Judul"}
            </h3>

            {/* ── Dropdown Menu ── */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                id={`project-menu-${project.id}`}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-slate-800 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                  setConfirmDelete(false);
                }}
                aria-label="Opsi proyek"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-7 z-50 w-52 rounded-xl bg-[#0D1525] border border-slate-700/70 shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {!confirmDelete ? (
                    <>
                      <Link
                        to={actionLink}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Pencil className="w-3.5 h-3.5 text-sky-400" />
                        Buka Editor
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMenuOpen(false);
                          if (onStatusChange) {
                            onStatusChange(project.id, isCompleted ? "draft" : "selesai");
                          }
                        }}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
                          isCompleted
                            ? "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                            : "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isCompleted ? "Ubah ke Draf" : "Tandai Selesai"}
                      </button>
                      <div className="h-px bg-slate-700/50 mx-3" />
                      <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus Proyek
                      </button>
                    </>
                  ) : (
                    <div className="p-3.5 space-y-2.5">
                      <p className="text-xs text-slate-300 leading-snug">
                        Yakin hapus{" "}
                        <span className="font-semibold text-white">
                          &ldquo;{project.title || "proyek ini"}&rdquo;
                        </span>
                        ? Tindakan ini tidak bisa dibatalkan.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCancelDelete}
                          className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          id={`confirm-delete-${project.id}`}
                          onClick={handleConfirmDelete}
                          className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 font-semibold transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {project.description || `Presentasi dibuat dengan templat ${templateName}.`}
          </p>
        </div>

        {/* Card Footer: Metadata & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            {/* Timestamp */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formattedDate}</span>
            </div>

            {/* Slide progress indicator */}
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md border font-semibold text-[10px] ${
                isCompleted
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Layers className="w-3 h-3" />
              )}
              <span>{isCompleted ? "Lengkap" : `${project.slideCount || 0} slide`}</span>
            </div>
          </div>

          {/* Action button */}
          <Link
            to={actionLink}
            className={`mt-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
              isCompleted
                ? "bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white"
                : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30"
            }`}
          >
            <span>{isCompleted ? "Buka Canvas" : "Lanjutkan di Editor"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
