import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  LogIn,
  UserPlus,
  TrendingUp,
  BadgeCheck,
  Download,
} from "lucide-react";

function AuthLayout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const isLoginPage = location.pathname === "/login";

  // Jika sudah login dan masih ada session aktif, redirect ke dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#070C15] flex">
      {/* ── Left panel: Marketing ── */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] p-10 xl:p-14 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-sky-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-amber-500/8 blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-10">
            <span>⚡</span>
            <span>AI Slide Deck Generator UMKM Indonesia</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] mb-4 max-w-lg">
            Siapkan Presentasi Bisnis UMKM{" "}
            <span className="text-amber-400">Anda dalam Hitungan Menit</span>
          </h1>

          {/* Pitch deck preview card */}
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm mb-6 max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <span className="text-sky-400 text-xs">☕</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Pitch Deck Kurasi KUR &amp; B2B</p>
                  <p className="text-sm font-bold text-white">Toko Kopi Nusantara</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium px-2.5 py-1 rounded-full">
                <BadgeCheck className="w-3 h-3" />
                Format Valid PPTX Asli
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/60 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Jangkauan Distribusi</p>
                <p className="text-2xl font-bold text-white">480+</p>
                <p className="text-xs text-slate-400">Mitra Toko</p>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +34% Semester Ini
                </p>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Kapasitas Produksi</p>
                <p className="text-2xl font-bold text-white">12.5</p>
                <p className="text-xs text-slate-400">Ton / Bln</p>
                <p className="text-[11px] text-slate-500 mt-1">Bean Robusta &amp; Arabika</p>
              </div>
            </div>

            {/* Mini bar chart */}
            <div className="flex items-end gap-1.5 h-16 mb-2">
              {[40, 55, 65, 70, 78, 90, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background: i >= 5 ? "#f59e0b" : i >= 3 ? "#0ea5e9" : "#334155",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
              <span>Q1 '25</span><span className="text-amber-400">Q2 '25</span><span className="text-amber-400">(Est.)</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] text-slate-500">• Diverifikasi AI PitchKu Engine v4.2</p>
              <p className="text-[11px] text-slate-500">Slide 04 / 12</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-6 mt-8">
          {[
            { icon: <Download className="w-4 h-4" />, label: "100% PPTX Native" },
            { icon: <Shield className="w-4 h-4" />, label: "Data Terenkripsi Aman" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-slate-400 text-xs">
              <span className="text-amber-400">{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel: Form Container ── */}
      <div className="flex flex-col justify-center w-full lg:w-[45%] px-6 py-10 sm:px-10 xl:px-14 bg-slate-900/40 border-l border-slate-800/60 overflow-y-auto">
        {/* Tab switcher */}
        <div className="flex rounded-lg overflow-hidden border border-slate-700/60 mb-8 max-w-md w-full mx-auto">
          {isLoginPage ? (
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-amber-500 text-black cursor-default"
            >
              <LogIn className="w-4 h-4" /> Masuk (Login)
            </button>
          ) : (
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4" /> Masuk (Login)
            </Link>
          )}

          {!isLoginPage ? (
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-amber-500 text-black cursor-default"
            >
              <UserPlus className="w-4 h-4" /> Daftar Akun Baru
            </button>
          ) : (
            <Link
              to="/register"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <UserPlus className="w-4 h-4" /> Daftar Akun Baru
            </Link>
          )}
        </div>

        <div className="max-w-md w-full mx-auto">
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
