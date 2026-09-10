import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Building2,
  ArrowRight,
} from "lucide-react";

function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.companyName || !form.email || !form.password || !form.confirmPassword) {
      setError("Semua field wajib diisi");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }
    if (!agreed) {
      setError("Kamu harus menyetujui syarat dan ketentuan");
      return;
    }
    // No backend – redirect to login
    navigate("/login");
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-1">Buat Akun PitchKu</h2>
      <p className="text-slate-400 text-sm mb-7">Gratis 1 Deck untuk percobaan. Tidak perlu kartu kredit.</p>

      {/* Google button */}
      <button className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-white text-sm font-medium hover:bg-slate-700/60 transition-colors mb-5">
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.4 29.2 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 45c4.8 0 9.2-1.8 12.5-4.8l-5.8-4.9C28.9 36.9 26.6 38 24 38c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 41 16.2 45 24 45z"/>
          <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l5.8 4.9C40 35.5 44 31 44 25c0-1.3-.1-2.6-.4-3.9z"/>
        </svg>
        Daftar dengan Google
      </button>

      <div className="relative flex items-center mb-5">
        <div className="flex-grow border-t border-slate-700/60" />
        <span className="mx-3 text-xs text-slate-500">atau daftar dengan email usaha</span>
        <div className="flex-grow border-t border-slate-700/60" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}

        {/* Full name */}
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              name="fullName"
              placeholder="Nama sesuai KTP / akta"
              value={form.fullName}
              onChange={handleChange}
              className="pl-9 h-10 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-600"
              required
            />
          </div>
        </div>

        {/* Company name */}
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">Nama Usaha</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              name="companyName"
              placeholder="Toko / CV / UD / PT Anda"
              value={form.companyName}
              onChange={handleChange}
              className="pl-9 h-10 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-600"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm text-slate-300">Email Usaha / Akun</label>
            <span className="text-xs text-slate-500">Format resmi</span>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type="email"
              name="email"
              placeholder="nama@tokousaha.id"
              value={form.email}
              onChange={handleChange}
              className="pl-9 h-10 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-600"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">Kata Sandi</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Min. 8 karakter"
              value={form.password}
              onChange={handleChange}
              className="pl-9 pr-10 h-10 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-600"
              required
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

        {/* Confirm password */}
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">Konfirmasi Kata Sandi</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Ulangi kata sandi"
              value={form.confirmPassword}
              onChange={handleChange}
              className="pl-9 pr-10 h-10 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terms checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-amber-400"
          />
          <span className="text-sm text-slate-400">
            Saya menyetujui{" "}
            <Link to="/terms" className="text-amber-400 hover:underline">
              Syarat &amp; Ketentuan
            </Link>{" "}
            PitchKu
          </span>
        </label>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors"
        >
          Buat Akun Sekarang <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-amber-400 font-semibold hover:underline">
          Masuk ke Dasbor
        </Link>
      </p>

      <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-600">
        <Shield className="w-3.5 h-3.5" />
        <span>Dilindungi Enkripsi Supabase Auth 256-bit &amp; SSL TLS</span>
      </div>
    </>
  );
}

export default RegisterForm;
