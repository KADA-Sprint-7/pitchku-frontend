import { Presentation, Sparkles } from "lucide-react";

export default function DashboardMetrics({ metrics }) {
  const {
    totalProjects = 12,
    monthlyTrend = "+2 bulan ini",
    tokenUsageWords = 24500,
    tokenLimitWords = 50000,
    tokenFormatted = "24.5k",
    tokenLimitFormatted = "50k",
  } = metrics || {};

  const tokenPercentage = Math.min(
    100,
    Math.round((tokenUsageWords / tokenLimitWords) * 100)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
      {/* Metric 1: Total Presentasi */}
      <div className="p-5 rounded-2xl bg-[#131B2E] border border-slate-800/90 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Total Presentasi
          </p>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-white">
              {totalProjects}
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {monthlyTrend}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400">
          <Presentation className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      {/* Metric 2: Kuota Token AI */}
      <div className="p-5 rounded-2xl bg-[#131B2E] border border-slate-800/90 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Kuota Token AI
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-amber-400">
                {tokenFormatted}
              </span>
              <span className="text-xs font-medium text-slate-400">
                / {tokenLimitFormatted} kata
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400/20" />
          </div>
        </div>

        {/* Token quota progress bar */}
        <div className="mt-2">
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${tokenPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Terpakai {tokenPercentage}%</span>
            <span>Tersisa {((tokenLimitWords - tokenUsageWords) / 1000).toFixed(1)}k kata</span>
          </div>
        </div>
      </div>
    </div>
  );
}
