import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
      <div>
        {/* Title and description */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dasbor Proyek Presentasi
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Kelola, sunting, dan unduh materi presentasi bisnis terstandarisasi investor & mitra korporasi.
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="flex items-center gap-3">
        <Link to="/new">
          <Button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all duration-150 hover:scale-[1.02]">
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Buat Presentasi Baru</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
