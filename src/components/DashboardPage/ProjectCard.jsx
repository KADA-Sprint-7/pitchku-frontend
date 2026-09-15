import { Link } from "react-router-dom";
import { Clock, ArrowRight, DollarSign, MoreVertical } from "lucide-react";

const TEMPLATE_NAMES = {
  penawaran_produk: "Penawaran Produk",
  pitch_deck_investor: "Pitch Deck Investor",
  company_profile: "Company Profile",
  laporan_kinerja: "Laporan Kinerja",
};

export default function ProjectCard({ project }) {
  const isCompleted = project.status === "selesai";
  const actionLink = isCompleted
    ? `/editor/${project.id}`
    : `/outline/${project.id}`;

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

  return (
    <div className="group flex flex-col rounded-2xl bg-[#131B2E] border border-slate-800/90 hover:border-slate-700/80 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
      {/* 16:9 Deck Canvas Thumbnail Preview Container */}
      <div className="relative aspect-video w-full bg-slate-950/90 overflow-hidden border-b border-slate-800/60 flex items-center justify-center p-3">
        {/* Subtle decorative slide canvas preview */}
        <div
          className={`w-full h-full rounded-lg bg-gradient-to-br ${
            project.accentBg || "from-slate-900 via-slate-900 to-slate-950"
          } p-3.5 flex flex-col justify-between border border-white/5 relative group-hover:scale-[1.02] transition-transform duration-300`}
        >
          {/* Top badges inside canvas preview */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${
                isCompleted
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-950/60 text-amber-400 border-amber-500/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCompleted ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              {isCompleted ? "Selesai" : "Draft"}
            </span>

            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-300 bg-slate-900/80 border border-slate-700/60">
              {project.slideCount || 8} Slide
            </span>
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
            <button
              type="button"
              className="text-slate-500 hover:text-slate-300 p-1 rounded-md transition-colors"
              onClick={(e) => {
                e.preventDefault();
                alert(`Opsi untuk: ${project.title}`);
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {project.description || `Presentasi dibuat dengan templat ${templateName}.`}
          </p>
        </div>

        {/* Card Footer: Metadata, AI Cost & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            {/* Timestamp */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formattedDate}</span>
            </div>

            {/* Estimated AI Cost */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
              <DollarSign className="w-3 h-3 text-amber-400 stroke-[2.5]" />
              <span>Est. AI: {project.estimatedCost || "Gratis"}</span>
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
            <span>{isCompleted ? "Buka Canvas" : "Lanjutkan Draft"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
