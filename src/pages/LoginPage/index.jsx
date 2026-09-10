import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Shield,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckSquare,
  TrendingUp,
  BadgeCheck,
  Download,
  ArrowRight,
} from "lucide-react";

function LoginPage() {
  usePageTitle("Masuk – PitchKu");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }
    // No backend – go straight to dashboard
    navigate("/dashboard");
  };

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
          <p className="text-slate-400 text-sm xl:text-base max-w-md leading-relaxed mb-8">
            Bantu lebih dari <span className="text-white font-semibold">15.000+ UMKM</span> di
            Indonesia menghasilkan slide deck profesional berstandar kurasi perbankan, KUR, dan
            investor B2B.
          </p>

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

          {/* Testimonial */}
          <div className="flex items-start gap-3 max-w-lg">
            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">99</div>
            <div>
              <p className="text-slate-300 text-sm italic leading-relaxed">
                "Pitch deck dari PitchKu meloloskan proposal supply kopi kami ke 50 gerai mitra dalam sekali presentasi."
              </p>
              <p className="text-slate-500 text-xs mt-1.5">
                <span className="text-white font-medium">Hendra Wijaya</span> — Owner, Roastery Malang
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-6 mt-8">
          {[
            { icon: <BadgeCheck className="w-4 h-4" />, label: "Standar OJK & KUR" },
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

      {/* ── Right panel: Form ── */}
      <div className="flex flex-col justify-center w-full lg:w-[45%] px-6 py-10 sm:px-10 xl:px-14 bg-slate-900/40 border-l border-slate-800/60">
        {/* Tab switcher */}
        <div className="flex rounded-lg overflow-hidden border border-slate-700/60 mb-8 max-w-md w-full mx-auto">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-amber-500 text-black"
          >
            <LogIn className="w-4 h-4" /> Masuk (Login)
          </button>
          <Link
            to="/register"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Daftar Akun Baru
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-white mb-1">Selamat Datang Kembali</h2>
          <p className="text-slate-400 text-sm mb-7">Masuk untuk mengelola dan mengunduh deck presentasi usaha Anda.</p>

          {/* Google button */}
          <button className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-white text-sm font-medium hover:bg-slate-700/60 transition-colors mb-5">
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.4 29.2 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 45c4.8 0 9.2-1.8 12.5-4.8l-5.8-4.9C28.9 36.9 26.6 38 24 38c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 41 16.2 45 24 45z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l5.8 4.9C40 35.5 44 31 44 25c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          <div className="relative flex items-center mb-5">
            <div className="flex-grow border-t border-slate-700/60" />
            <span className="mx-3 text-xs text-slate-500">atau masuk dengan email usaha</span>
            <div className="flex-grow border-t border-slate-700/60" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-slate-300">Email Usaha / Akun</label>
                <span className="text-xs text-slate-500">Format resmi</span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="nama@tokousaha.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-10 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-amber-400"
                />
                <span className="text-sm text-slate-400">Ingat saya di perangkat ini</span>
              </label>
              <button type="button" className="text-sm text-amber-400 hover:underline">
                Lupa Kata Sandi?
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors"
            >
              Masuk ke Dasbor PitchKu <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Belum punya akun?{" "}
            <Link to="/register" className="text-amber-400 font-semibold hover:underline">
              Daftar Sekarang (Gratis 1 Deck)
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-600">
            <Shield className="w-3.5 h-3.5" />
            <span>Dilindungi Enkripsi Supabase Auth 256-bit &amp; SSL TLS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
