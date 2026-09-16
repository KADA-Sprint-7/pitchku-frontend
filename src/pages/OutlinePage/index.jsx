import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import AppSidebar from '@/components/layout/AppSidebar';
import WizardStepper from '@/components/Wizard/WizardStepper';
import OutlineReviewer from '@/components/Outline/OutlineReviewer';
import { projectStore } from '@/lib/projectStore';
import { generateMockOutline } from '@/lib/mockOutlineGenerator';
import { generateSlidesAi, saveProjectDeckApi } from '@/lib/aiService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function OutlinePage() {
  usePageTitle('Konfirmasi & Atur Urutan Slide — PitchKu');
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [outlineList, setOutlineList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load project from store
  useEffect(() => {
    if (!projectId) return;
    const loaded = projectStore.getProject(projectId);
    setProject(loaded);
    setOutlineList(loaded.outlines || []);
  }, [projectId]);

  // Handle reset to default AI outline
  const handleResetDefault = () => {
    if (!project) return;
    const defaultOutlines = generateMockOutline(
      project.template,
      project.structuredData,
      project.rawContext
    );
    setOutlineList(defaultOutlines);
    projectStore.updateOutline(projectId, defaultOutlines);

    toast.success('Susunan slide direset ke default', {
      description: 'Daftar slide telah dikembalikan ke rekomendasi awal AI.',
    });
  };

  // Handle outline updates
  const handleOutlineChange = (newOutlines) => {
    setOutlineList(newOutlines);
    projectStore.updateOutline(projectId, newOutlines);
  };

  // Back button (kembali ke Step 2 Wizard)
  const handleBack = () => {
    navigate('/new', { state: { step: 2, projectId } });
  };

  // Next / Submit button to editor
  const handleProceedToEditor = async () => {
    if (!outlineList || outlineList.length < 3) {
      toast.error('Gagal melanjutkan', {
        description: 'Minimal harus ada 3 slide dalam struktur presentasi.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      projectStore.saveConfirmedOutline(projectId, outlineList);

      toast.info('AI sedang menyusun konten lengkap tiap slide...', {
        description: 'Memvalidasi struktur skema dan teks konten.',
      });

      // Siapkan context untuk AI generation
      const businessName =
        project?.structuredData?.companyName ||
        project?.structuredData?.productName ||
        project?.title ||
        'Usaha Anda';
      const audience =
        project?.structuredData?.partnerTarget ||
        project?.structuredData?.industry ||
        'Calon Mitra / Klien / Investor';

      const context = {
        template: project?.template || 'penawaran_produk',
        businessName,
        audience,
        brief: project?.rawContext || '',
      };

      // 1. Generate slides (via API / Fallback)
      const deckPayload = await generateSlidesAi({
        context,
        outline: outlineList,
        project,
      });

      // 2. Simpan lokal di projectStore
      projectStore.saveDeckPayload(projectId, deckPayload);

      // 3. Sync / POST ke Backend endpoint /api/projects
      await saveProjectDeckApi(deckPayload);

      toast.success('Slide presentasi berhasil dibuat!', {
        description: 'Membuka canvas Slide Editor PitchKu...',
      });

      navigate(`/editor/${projectId}`);
    } catch (err) {
      console.error('Error saat membuat slides:', err);
      toast.error('Gagal menyusun slide presentasi', {
        description: 'Terjadi gangguan saat memproses slide. Silakan coba klik tombol Lanjutkan sekali lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return (
      <div className="flex min-h-screen bg-[#070C15] text-slate-100 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
          <span>Memuat kerangka slide...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#070C15] text-slate-100 selection:bg-sky-400 selection:text-slate-950">
      {/* Canva-style narrow icon-rail sidebar */}
      <AppSidebar />

      {/* Main workspace container */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto px-6 py-8 space-y-8">
            {/* Stepper (02 Konfirmasi Outline is active => index 1) */}
            <WizardStepper currentStep={1} />

            {/* Outline Reviewer Component */}
            <OutlineReviewer
              templateId={project.template}
              outlineList={outlineList}
              onOutlineChange={handleOutlineChange}
              onResetDefault={handleResetDefault}
            />
          </div>
        </main>

        {/* Sticky Bottom Navigation Bar */}
        <div className="sticky bottom-16 md:bottom-0 z-40 bg-[#0B111E]/95 backdrop-blur-md border-t border-slate-800/90 py-3 sm:py-4 px-4 sm:px-6 shadow-2xl">
          <div className="max-w-4xl w-full mx-auto flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white font-medium text-xs sm:text-sm h-10 px-4 gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>

            <Button
              type="button"
              disabled={isSubmitting || outlineList.length < 3}
              onClick={handleProceedToEditor}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm h-10 px-5 gap-2 cursor-pointer shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses Isi Slide...
                </>
              ) : (
                <>
                  Lanjut: Buat Isi Slide & Masuk Editor
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutlinePage;