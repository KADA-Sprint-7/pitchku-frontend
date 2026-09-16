import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardFilterBar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}) {
  const tabs = [
    { id: "all", label: "Semua Proyek", count: counts.all },
    { id: "selesai", label: "Selesai", count: counts.selesai },
    { id: "draft", label: "Draft", count: counts.draft },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
      {/* Filter Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800/80 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? tab.id === "selesai"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : tab.id === "draft"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-slate-700 text-slate-200"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          placeholder="Cari proyek berdasarkan nama..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 bg-[#131B2E] border-slate-800 text-sm text-white placeholder:text-slate-500 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
        />
      </div>
    </div>
  );
}
