import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#070C15] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand Info Column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-2">
              <div className="text-xl font-bold text-white tracking-tight">
                Pitch<span className="text-pitchku-amber">Ku</span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform pembuatan pitch deck otomatis berbasis AI khusus untuk UMKM Indonesia. Solusi cepat presentasi usaha siap kurasi BUMN, perbankan, dan mitra ritel.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Format Asli .PPTX &amp; 100% Editable</span>
            </div>
          </div>

          {/* Navigasi Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#keunggulan" className="hover:text-amber-400 transition-colors">
                  Keunggulan
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-amber-400 transition-colors">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#pilihan-templat" className="hover:text-amber-400 transition-colors">
                  Pilihan Templat
                </a>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-400 transition-colors">
                  FAQ &amp; Bantuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Solusi Template Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Solusi Pitch Deck</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>Company Profile UMKM</li>
              <li>Proposal Penawaran Produk &amp; SKU</li>
              <li>Proposal Kerja Sama &amp; Bagi Hasil</li>
              <li>Laporan Keuangan &amp; Akuntabilitas</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} PitchKu. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </div>
    </footer>
  );
}
