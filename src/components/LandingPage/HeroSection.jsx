import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, Layers, CheckCircle2, Sparkles, Download } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

export default function HeroSection() {
    return (
        <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            {/* Subtle background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[600px] h-96 bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Solusi Pitch Deck AI Resmi UMKM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
                Buat Presentasi Usaha{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400">
                    Professional
                </span>{' '}
                dalam 5 Menit
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                Transformasi deskripsi usaha Anda menjadi{" "}
                <em className="font-medium text-slate-200">slide PPTX</em> asli yang dapat
                disunting secara penuh. Khusus untuk UMKM Indonesia, siap kurasi dan{" "}
                <em className="font-medium text-pitchku-amber">pitching</em>.
            </p>

            {/* Action Buttons */}
            <div className="mb-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Button
                    asChild
                    className="
                        h-auto w-full rounded-xl border-0
                        bg-gradient-to-r from-amber-400 to-amber-500
                        px-6 py-3.5
                        text-sm font-bold text-slate-950
                        shadow-lg shadow-amber-500/20
                        transition-all
                        hover:from-amber-300 hover:to-amber-400
                        active:scale-98
                        sm:w-auto
                        "
                >
                    <Link
                        to="/register"
                        className="flex items-center justify-center gap-2"
                    >
                        <Zap className="h-4 w-4 shrink-0 fill-current text-slate-950" />
                        <span>Buat Presentasi Gratis</span>
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="outline"
                    className="
                        h-auto w-full rounded-xl
                        border border-slate-700
                        bg-slate-900/80
                        px-5 py-3.5
                        text-sm font-medium text-slate-200
                        transition-all
                        hover:bg-slate-800
                        sm:w-auto
                    "
                >
                    <a
                        href="#katalog-template"
                        className="flex items-center justify-center gap-2"
                    >
                        <Layers className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>Lihat Contoh Template</span>
                    </a>
                </Button>
            </div>

            {/* Trust Proof Points */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 mb-12 md:mb-16">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Format Asli .PPTX</span>
                </div>
                <span className="text-slate-700 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Bahasa Indonesia Natural</span>
                </div>
                <span className="text-slate-700 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Tanpa Perlu Skill Desain</span>
                </div>
            </div>

            {/* Editor Workspace Preview Mockup */}
            <div className="relative mx-auto max-w-6xl text-left">
                {/* Subtle background ambient glow for the editor */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-amber-500/20 blur-xl opacity-70 pointer-events-none" />

                <Card className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0B111E]/95 shadow-2xl backdrop-blur-xl p-3 sm:p-4 md:p-5">
                    {/* Window Titlebar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 px-3.5 py-2.5 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500/90" />
                                <div className="h-3 w-3 rounded-full bg-amber-500/90" />
                                <div className="h-3 w-3 rounded-full bg-emerald-500/90" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-slate-300">
                                PitchKu Editor Workspace — 16:9 Deck Proyek
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="rounded-md border border-slate-700/80 bg-slate-900/90 px-2.5 py-1 text-[11px] font-medium text-sky-400">
                                Judul: 42/60 Karakter
                            </span>
                            <span className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-950/50 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Auto-Fit Proteksi Aktif
                            </span>
                        </div>
                    </div>

                    {/* Window Main Grid Content */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                        {/* Left Panel: Slide List */}
                        <div className="hidden space-y-3 sm:flex sm:flex-col lg:col-span-2">
                            {/* Slide 01 Active */}
                            <div className="group cursor-pointer">
                                <div className="flex h-20 w-full flex-col items-center justify-center rounded-xl border-2 border-sky-500 bg-sky-600/20 p-2 shadow-lg shadow-sky-500/10 transition-all">
                                    <span className="text-sm font-bold text-white">Slide 01</span>
                                </div>
                                <span className="mt-1.5 block text-center text-xs font-semibold text-sky-400">
                                    Company Profile
                                </span>
                            </div>

                            {/* Slide 02 */}
                            <div className="group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex h-20 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                                    <span className="text-xs font-bold text-slate-500">Slide 02</span>
                                </div>
                                <span className="mt-1.5 block text-center text-xs font-medium text-slate-500">
                                    Katalog Produk
                                </span>
                            </div>

                            {/* Slide 03 */}
                            <div className="group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex h-20 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                                    <span className="text-xs font-bold text-slate-500">Slide 03</span>
                                </div>
                                <span className="mt-1.5 block text-center text-xs font-medium text-slate-500">
                                    Model Finansial
                                </span>
                            </div>
                        </div>

                        {/* Center Canvas: Active Slide View */}
                        <Card className="flex flex-col justify-between rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950 p-5 sm:p-6 lg:col-span-7">
                            <CardContent className="p-0 space-y-5">
                                {/* Top Banner of Slide Canvas */}
                                <div className="flex items-start justify-between gap-4">
                                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                                        PROFIL PERUSAHAAN UMKM
                                    </span>
                                    <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-sky-500 font-extrabold text-slate-950 shadow-md shadow-sky-500/30 text-xs">
                                        KNS
                                    </div>
                                </div>

                                {/* Slide Content Headline & Subtitle */}
                                <div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                        Kopi Nusantara Sejahtera
                                    </h3>
                                    <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                                        Produsen biji kopi arabika olahan fermentasi dingin ramah lingkungan dari petani lereng Ijen.
                                    </p>
                                </div>

                                {/* Metric Cards Row */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                                    <div className="rounded-lg border border-slate-800/80 bg-slate-900/80 p-3">
                                        <span className="text-[11px] font-medium text-slate-400 block">Kapasitas Produksi</span>
                                        <span className="text-sm sm:text-base font-bold text-white mt-1 block">12.5 Ton / Bln</span>
                                        <span className="text-[10px] font-semibold text-emerald-400 mt-0.5 block">+24% YoY</span>
                                    </div>

                                    <div className="rounded-lg border border-slate-800/80 bg-slate-900/80 p-3">
                                        <span className="text-[11px] font-medium text-slate-400 block">Jaringan Mitra Toko</span>
                                        <span className="text-sm sm:text-base font-bold text-white mt-1 block">480+ Outlet</span>
                                        <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">Jawa &amp; Bali</span>
                                    </div>

                                    <div className="rounded-lg border border-slate-800/80 bg-slate-900/80 p-3">
                                        <span className="text-[11px] font-medium text-slate-400 block">Sertifikasi Usaha</span>
                                        <span className="text-sm sm:text-base font-bold text-white mt-1 block">BPOM &amp; Halal</span>
                                        <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">Grade Ekspor</span>
                                    </div>
                                </div>
                            </CardContent>

                            {/* Footer of Slide Canvas */}
                            <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-500">
                                <span>Dokumen Pitching Resmi • Kerjasama Ritel 2025</span>
                                <span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-semibold text-slate-300">
                                    Slide 1 dari 10
                                </span>
                            </div>
                        </Card>

                        {/* Right Panel: AI Co-Pilot Slide */}
                        <Card className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 sm:p-5 lg:col-span-3 space-y-4">
                            <CardContent className="p-0 space-y-4">
                                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white">
                                    <Sparkles className="h-4 w-4 text-sky-400" />
                                    <span>AI Co-Pilot Slide</span>
                                </div>

                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Outline ini telah lolos standarisasi template pitching kurasi BUMN dan perbankan syariah.
                                </p>

                                <div className="space-y-2.5 pt-2 text-xs">
                                    <div className="flex items-center justify-between rounded-lg bg-slate-950/50 p-2.5 border border-slate-800/60">
                                        <span className="text-slate-400 font-medium">Font Heading</span>
                                        <span className="font-semibold text-white">Plus Jakarta</span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-slate-950/50 p-2.5 border border-slate-800/60">
                                        <span className="text-slate-400 font-medium">Format Ekspor</span>
                                        <span className="font-semibold text-amber-400">PPTX / PDF</span>
                                    </div>
                                </div>
                            </CardContent>

                            <Button
                                className="w-full h-auto py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 border-0 transition-all active:scale-98"
                            >
                                <Download className="h-4 w-4 shrink-0 stroke-[2.5]" />
                                <span>Unduh PPTX Asli</span>
                            </Button>
                        </Card>
                    </div>
                </Card>
            </div>
        </section>
    );
}
