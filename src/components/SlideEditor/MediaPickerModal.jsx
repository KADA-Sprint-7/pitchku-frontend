import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Upload, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Curated royalty-free stock images with keyword tags
const MOCK_STOCK_IMAGES = [
  {
    id: '1',
    keywords: 'bisnis modern kantor teknologi kerja',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    title: 'Ruang Kerja Modern',
  },
  {
    id: '2',
    keywords: 'tim diskusi rapat meeting startup',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    title: 'Diskusi Tim Startup',
  },
  {
    id: '3',
    keywords: 'presentasi grafik pertumbuhan data analisis',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    title: 'Analisis Pertumbuhan Data',
  },
  {
    id: '4',
    keywords: 'produk makanan kuliner kopi cafe toko',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    title: 'Interior Cafe & Produk',
  },
  {
    id: '5',
    keywords: 'teknologi laptop koding dev software',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    title: 'Pengembangan Teknologi',
  },
  {
    id: '6',
    keywords: 'penjualan retail toko toko fisik usaha',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    title: 'Toko Retail & Fashion',
  },
];

/**
 * MediaPickerModal
 * Dialog for selecting royalty-free stock images or uploading local images.
 *
 * Props:
 * - open:         boolean
 * - onOpenChange: fn(boolean)
 * - onSelectImage: fn(imageUrl)
 */
export default function MediaPickerModal({ open, onOpenChange, onSelectImage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('stock');
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const filteredImages = MOCK_STOCK_IMAGES.filter((img) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return img.keywords.toLowerCase().includes(q) || img.title.toLowerCase().includes(q);
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran berkas terlalu besar', {
        description: 'Maksimal ukuran foto adalah 5MB.',
      });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedUrl(event.target.result);
      setUploading(false);
      toast.success('Foto lokal berhasil diunggah');
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (!selectedUrl) return;
    onSelectImage?.(selectedUrl);
    onOpenChange?.(false);
    setSelectedUrl(null);
    toast.success('Gambar slide berhasil diganti');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0B1220] text-slate-100 border-slate-800 sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-100 flex items-center gap-2 text-lg font-bold">
            <ImageIcon className="w-5 h-5 text-sky-400" /> Pengelolaan Gambar & Media
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Pilih gambar stok bebas lisensi atau unggah foto produk/usaha Anda sendiri.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 mt-2">
          <TabsList className="bg-slate-900 border border-slate-800 text-slate-400 grid grid-cols-2">
            <TabsTrigger value="stock" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-300 text-xs">
              Pencarian Stok Gambar (Unsplash/Pexels)
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-300 text-xs">
              Unggah Foto Sendiri
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Stock Images */}
          <TabsContent value="stock" className="flex-1 flex flex-col min-h-0 space-y-3 mt-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci (misal: bisnis, koding, produk, kopi)..."
                className="pl-9 bg-slate-900 border-slate-700 text-slate-100 text-xs focus-visible:ring-sky-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 pr-1 max-h-[300px] scrollbar-thin scrollbar-thumb-slate-700">
              {filteredImages.map((img) => {
                const isSelected = selectedUrl === img.url;
                return (
                  <div
                    key={img.id}
                    onClick={() => setSelectedUrl(img.url)}
                    className={`group relative rounded-xl overflow-hidden border cursor-pointer aspect-video transition-all ${
                      isSelected
                        ? 'border-sky-400 ring-2 ring-sky-400/50 scale-[1.02]'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-2 flex flex-col justify-end">
                      <span className="text-[10px] font-semibold text-white truncate">{img.title}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-sky-500 text-white rounded-full p-1 shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredImages.length === 0 && (
                <div className="col-span-3 py-10 text-center text-slate-500 text-xs">
                  Tidak ada gambar stok yang cocok dengan kata kunci "{searchQuery}".
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Upload Own Image */}
          <TabsContent value="upload" className="flex-1 flex flex-col justify-center items-center py-6 border border-dashed border-slate-700 rounded-xl bg-slate-900/30 mt-3">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                <span>Memproses unggahan foto...</span>
              </div>
            ) : selectedUrl && activeTab === 'upload' ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-48 h-28 rounded-lg overflow-hidden border border-sky-400 ring-2 ring-sky-400/30">
                  <img src={selectedUrl} alt="Preview Upload" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-sky-300 font-medium">Foto siap diterapkan</span>
                <label className="cursor-pointer text-[11px] text-slate-400 hover:text-slate-200 underline">
                  Ganti Berkas Lain
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer p-6 w-full text-center">
                <Upload className="w-8 h-8 text-sky-400 mb-2" />
                <span className="text-xs font-semibold text-slate-200">Klik untuk Unggah Foto dari Perangkat</span>
                <span className="text-[10px] text-slate-500 mt-1">Format PNG, JPG, WEBP (Maksimal 5MB)</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800/80">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
          >
            Batal
          </Button>
          <Button
            disabled={!selectedUrl}
            onClick={handleApply}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs disabled:opacity-40"
          >
            Terapkan ke Slide
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
