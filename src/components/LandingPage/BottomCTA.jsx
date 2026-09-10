import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BottomCTA() {
  const navigate = useNavigate();

  const handleAction = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (token) {
      navigate('/new');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* Background glow ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[700px] h-96 bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto space-y-6">
        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
          Siap Hadirkan Presentasi Kelas Korporat untuk Usaha Anda?
        </h2>

        {/* Subtitle */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Mulai susun deck proposal pembiayaan atau kemitraan usaha Anda sekarang. Gratis 1 deck pertama tanpa syarat kartu kredit.
        </p>

        {/* Action Button */}
        <div className="pt-4 pb-2">
          <Button
            onClick={handleAction}
            className="
              h-auto w-full sm:w-auto
              px-8 py-4 rounded-xl border-0
              bg-amber-500 hover:bg-amber-400
              text-slate-950 font-bold text-base sm:text-lg
              shadow-xl shadow-amber-500/25
              transition-all duration-200
              active:scale-98
              inline-flex items-center justify-center gap-3
            "
          >
            <Rocket className="w-5 h-5 text-slate-950 fill-current" />
            <span>Generate Deck Pertama Sekarang</span>
          </Button>
        </div>

        {/* Subtext */}
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Dibuat dengan bangga untuk UMKM Indonesia • Membantu pertumbuhan ekonomi lokal
        </p>
      </div>
    </section>
  );
}
