import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  CheckCircle2,
} from "lucide-react"

function LoginForm() {
  const navigate = useNavigate()
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true) // Supabase default: session tersimpan di localStorage
  const [error, setError] = useState("")

  // State Lupa Kata Sandi Modal
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await loginWithEmail(email, password)
      toast.success('Berhasil masuk!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan password.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (err) {
      toast.error(err.message || 'Gagal login via Google')
    }
  }

  const handleOpenForgotModal = () => {
    setResetEmail(email || "")
    setResetSuccess(false)
    setIsForgotOpen(true)
  }

  const handleSendResetEmail = async (e) => {
    e.preventDefault()
    if (!resetEmail) {
      toast.error('Masukkan email usaha Anda terlebih dahulu.')
      return
    }

    try {
      setResetLoading(true)
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      })
      if (resetError) throw resetError

      setResetSuccess(true)
      toast.success('Tautan reset password berhasil dikirim!')
    } catch (err) {
      toast.error(err.message || 'Gagal mengirim instruksi reset password.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-1">Selamat Datang Kembali</h2>
      <p className="text-slate-400 text-sm mb-7">Masuk untuk mengelola dan mengunduh deck presentasi usaha Anda.</p>

      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-white text-sm font-medium hover:bg-slate-700/60 transition-colors mb-5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.4 29.2 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 16.3 5 9.7 9 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 45c4.8 0 9.2-1.8 12.5-4.8l-5.8-4.9C28.9 36.9 26.6 38 24 38c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 41 16.2 45 24 45z" />
          <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l5.8 4.9C40 35.5 44 31 44 25c0-1.3-.1-2.6-.4-3.9z" />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
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
          <button
            type="button"
            onClick={handleOpenForgotModal}
            className="text-sm text-amber-400 hover:underline font-medium cursor-pointer"
          >
            Lupa Kata Sandi?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Memproses..." : "Masuk ke Dasbor PitchKu"} <ArrowRight className="w-4 h-4" />
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

      {/* ── Modal Lupa Kata Sandi (Forgot Password) ── */}
      <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
        <DialogContent className="sm:max-w-md bg-[#0D1525] border border-slate-700/60 text-slate-100 shadow-2xl">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              Reset Kata Sandi Akun
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              Masukkan alamat email resmi akun PitchKu Anda. Tautan untuk mengatur ulang kata sandi akan dikirim langsung ke email Anda.
            </DialogDescription>
          </DialogHeader>

          {resetSuccess ? (
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Email Reset Terkirim!</h3>
              <p className="text-slate-300 text-xs leading-relaxed max-w-xs">
                Periksa kotak masuk (atau folder spam) di <strong className="text-amber-400">{resetEmail}</strong> untuk melanjutkan pengaturan ulang password.
              </p>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="mt-4 px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Kembali ke Halaman Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendResetEmail} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Email Akun</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="email"
                    required
                    placeholder="nama@tokousaha.id"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-9 h-10 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-600 focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? "Mengirim Tautan..." : "Kirim Tautan Reset"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LoginForm;
