import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { projectStore } from '@/lib/projectStore';
import { generateDeckPayload, mockContentForLayout } from '@/lib/deckPayloadGenerator';
import { saveProjectDeckApi, getProjectByIdApi } from '@/lib/aiService';

// SlideEditor components
import EditorHeader from '@/components/SlideEditor/EditorHeader';
import SlideFormatToolbar from '@/components/SlideEditor/SlideFormatToolbar';
import SlideCanvas from '@/components/SlideEditor/SlideCanvas';
import SlideThumbnailRail from '@/components/SlideEditor/SlideThumbnailRail';
import ExportPresentationModal from '@/components/SlideEditor/ExportPresentationModal';
import MediaPickerModal from '@/components/SlideEditor/MediaPickerModal';
import AddSlideModal from '@/components/SlideEditor/AddSlideModal';
import SlideExportCanvas from '@/components/SlideEditor/SlideExportCanvas';

// Auto-save debounce duration in ms
const AUTO_SAVE_DEBOUNCE = 1000;

function EditorPage() {
  const { projectId } = useParams();
  usePageTitle('Slide Editor — PitchKu');

  // ── Core State ──────────────────────────────────────────────────────────
  const [project, setProject] = useState(null);

  /** @type {[import('@/lib/deckPayloadGenerator').PitchKuDeckPayload, Function]} */
  const [deckPayload, setDeckPayload] = useState(null);

  /** Index of the active slide in deckPayload.slides (0-based) */
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  /**
   * editingField — tracks which field is currently being edited inline.
   * { slideIndex, fieldName, subIndex? }
   */
  const [editingField, setEditingField] = useState(null);

  /** Auto-save indicator */
  const [isSaving, setIsSaving] = useState(false);

  /** Export modal */
  const [isExportOpen, setIsExportOpen] = useState(false);

  /** Media picker modal */
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  /** Add Slide modal */
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);

  // ── Load project & deck payload (Backend API + local store fallback) ──
  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    async function loadProjectData() {
      // 1. Coba ambil dari backend GET /api/projects/{id}
      let serverProject = null;
      try {
        serverProject = await getProjectByIdApi(projectId);
      } catch (err) {
        console.warn('Gagal fetch project dari server:', err.message);
      }

      if (!isMounted) return;

      // 2. Ambil dari local store untuk sinkronisasi logo & fallback
      const loadedProject = projectStore.getProject(projectId);
      const existingPayload = projectStore.getDeckPayload(projectId);

      const preservedLogoUrl =
        serverProject?.brandKit?.logoUrl ||
        existingPayload?.brandKit?.logoUrl ||
        loadedProject?.brandKit?.logoUrl ||
        null;

      if (serverProject && serverProject.slides) {
        const mergedBrandKit = {
          ...(serverProject.brandKit || {}),
          logoUrl: preservedLogoUrl,
        };
        const updatedServerProject = {
          ...serverProject,
          brandKit: mergedBrandKit,
        };
        setProject({
          id: serverProject.deckId || projectId,
          title: serverProject.businessName || 'Pitch Deck',
          template: serverProject.template,
          brandKit: mergedBrandKit,
          status: serverProject.status || 'draft',
        });
        setDeckPayload(updatedServerProject);
        projectStore.saveDeckPayload(projectId, updatedServerProject);
        return;
      }

      // Fallback local store
      const finalBrandKit = {
        ...(loadedProject?.brandKit || {}),
        logoUrl: preservedLogoUrl,
      };

      setProject({
        ...(loadedProject || {}),
        brandKit: finalBrandKit,
      });

      if (existingPayload) {
        const updatedPayload = {
          ...existingPayload,
          brandKit: {
            ...(existingPayload.brandKit || {}),
            logoUrl: preservedLogoUrl,
          },
        };
        setDeckPayload(updatedPayload);
        projectStore.saveDeckPayload(projectId, updatedPayload);
      } else {
        const outlines = loadedProject?.outlines || [];
        const generatedPayload = generateDeckPayload(loadedProject, outlines);
        generatedPayload.brandKit = {
          ...(generatedPayload.brandKit || {}),
          logoUrl: preservedLogoUrl,
        };
        setDeckPayload(generatedPayload);
        projectStore.saveDeckPayload(projectId, generatedPayload);
      }
    }

    loadProjectData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // ── Auto-save (debounced & synced to backend) ─────────────────────────
  const persistPayload = useCallback(
    (payload) => {
      if (!projectId || !payload) return;
      setIsSaving(true);
      const timer = setTimeout(async () => {
        projectStore.saveDeckPayload(projectId, payload);
        try {
          await saveProjectDeckApi(payload);
        } catch (err) {
          console.warn('Gagal autosave ke backend:', err);
        }
        setIsSaving(false);
      }, AUTO_SAVE_DEBOUNCE);
      return () => clearTimeout(timer);
    },
    [projectId]
  );

  // ── Slide Editing Helpers ──────────────────────────────────────────────
  const handleFieldChange = useCallback(
    (fieldName, value, subIndex) => {
      if (!deckPayload) return;

      setDeckPayload((prev) => {
        const slides = prev.slides.map((slide, idx) => {
          if (idx !== activeSlideIndex) return slide;

          // bullets array update
          if (fieldName === 'bullets' && subIndex !== undefined) {
            const newBullets = [...(slide.bullets || [])];
            newBullets[subIndex] = value;
            return { ...slide, bullets: newBullets };
          }

          // cards header/description update (subIndex = cardIdx*2 for header, +1 for description)
          if (fieldName === 'cards' && subIndex !== undefined) {
            const cardIdx = Math.floor(subIndex / 2);
            const isHeader = subIndex % 2 === 0;
            const newCards = [...(slide.cards || [])];
            const card = { ...(newCards[cardIdx] || {}) };
            if (isHeader) card.header = value;
            else card.description = value;
            newCards[cardIdx] = card;
            return { ...slide, cards: newCards };
          }

          // simple field update (title, subtitle)
          return { ...slide, [fieldName]: value };
        });

        const updated = { ...prev, slides };
        persistPayload(updated);
        return updated;
      });
    },
    [deckPayload, activeSlideIndex, persistPayload]
  );

  const handleFieldClick = useCallback(
    (fieldName, subIndex) => {
      setEditingField({ slideIndex: activeSlideIndex, fieldName, subIndex });
    },
    [activeSlideIndex]
  );

  const handleFieldCommit = useCallback(() => {
    setEditingField(null);
  }, []);

  // ── Media Image Selection ──────────────────────────────────────────────
  const handleSelectImage = useCallback(
    (imageUrl) => {
      if (!deckPayload) return;
      setDeckPayload((prev) => {
        const slides = prev.slides.map((slide, idx) => {
          if (idx !== activeSlideIndex) return slide;
          return { ...slide, imageUrl };
        });
        const updated = { ...prev, slides };
        persistPayload(updated);
        return updated;
      });
    },
    [deckPayload, activeSlideIndex, persistPayload]
  );

  // ── Slide Reordering & Deck Management ──────────────────────────────────
  const handleReorderSlides = useCallback(
    (fromIdx, toIdx) => {
      if (!deckPayload) return;
      setDeckPayload((prev) => {
        const newSlides = [...prev.slides];
        const [moved] = newSlides.splice(fromIdx, 1);
        newSlides.splice(toIdx, 0, moved);
        const updated = { ...prev, slides: newSlides };
        persistPayload(updated);
        return updated;
      });
      // Preserve current active slide position if affected
      if (activeSlideIndex === fromIdx) {
        setActiveSlideIndex(toIdx);
      } else if (activeSlideIndex > fromIdx && activeSlideIndex <= toIdx) {
        setActiveSlideIndex((prev) => prev - 1);
      } else if (activeSlideIndex < fromIdx && activeSlideIndex >= toIdx) {
        setActiveSlideIndex((prev) => prev + 1);
      }
      toast.success('Urutan slide berhasil diperbarui');
    },
    [deckPayload, activeSlideIndex, persistPayload]
  );

  const handleAddSlide = useCallback(
    (layoutType = 'title_bullets', customTitle) => {
      if (!deckPayload) return;
      const defaultTitles = {
        title_slide: 'Judul Utama & Pengenalan',
        title_bullets: 'Poin Strategis & Pencapaian',
        two_column: 'Perbandingan Dua Aspek Utama',
        metrics_grid: 'Metrik & Capaian Kinerja Utama',
        card_grid: 'Solusi & Portofolio Layanan',
        contact_closing: 'Penutup & Hubungi Kami',
      };

      const title = customTitle || defaultTitles[layoutType] || `Slide ${deckPayload.slides.length + 1}`;
      const mockContent = mockContentForLayout(layoutType, title, project?.structuredData || {});

      setDeckPayload((prev) => {
        const newSlide = {
          id: `slide-${Date.now()}`,
          slideNumber: prev.slides.length + 1,
          layout: layoutType,
          title,
          subtitle: mockContent.subtitle || null,
          bullets: mockContent.bullets || null,
          cards: mockContent.cards || null,
          imageUrl: null,
          imageQuery: mockContent.imageQuery || null,
        };
        const updated = { ...prev, slides: [...prev.slides, newSlide] };
        persistPayload(updated);
        return updated;
      });
      setActiveSlideIndex(deckPayload.slides.length);
      toast.success('Slide baru berhasil ditambahkan');
    },
    [deckPayload, project, persistPayload]
  );

  const handleDeleteSlide = useCallback(
    (targetIndex) => {
      if (!deckPayload || deckPayload.slides.length <= 1) return;
      setDeckPayload((prev) => {
        const newSlides = prev.slides.filter((_, idx) => idx !== targetIndex);
        const updated = { ...prev, slides: newSlides };
        persistPayload(updated);
        return updated;
      });

      if (activeSlideIndex >= targetIndex && activeSlideIndex > 0) {
        setActiveSlideIndex((prev) => prev - 1);
      }
      toast.success('Slide berhasil dihapus');
    },
    [deckPayload, activeSlideIndex, persistPayload]
  );

  // ── AI Rewrite (mock) ──────────────────────────────────────────────────
  const handleAiRewrite = useCallback(
    (activeSlide) => {
      if (!deckPayload) return;
      const refinedTitle = activeSlide.title
        ? `${activeSlide.title} — Versi Ringkas`
        : activeSlide.title;
      const refinedSubtitle = activeSlide.subtitle
        ? 'Solusi terukur dan berdampak tinggi bagi pertumbuhan bisnis Anda.'
        : activeSlide.subtitle;

      handleFieldChange('title', refinedTitle);
      if (activeSlide.subtitle !== undefined) {
        handleFieldChange('subtitle', refinedSubtitle);
      }
    },
    [deckPayload, handleFieldChange]
  );

  // ── Deck Title Rename ──────────────────────────────────────────────────
  const handleRenameTitle = useCallback(
    (newTitle) => {
      if (!projectId) return;
      projectStore.updateDeckTitle(projectId, newTitle);
      setProject((prev) => ({ ...prev, title: newTitle }));
      toast.success('Judul deck berhasil diperbarui');
    },
    [projectId]
  );

  // ── Toggle Status Project (Draft <-> Selesai) ───────────────────────
  const handleStatusToggle = useCallback(() => {
    if (!project || !projectId) return;
    const newStatus = project.status === 'selesai' ? 'draft' : 'selesai';
    setProject((prev) => ({ ...prev, status: newStatus }));
    projectStore.updateProjectStatus(projectId, newStatus);
    toast.success(
      newStatus === 'selesai'
        ? 'Status proyek ditandai sebagai Selesai!'
        : 'Status proyek diubah kembali ke Draf'
    );
  }, [project, projectId]);

  // Callback saat ekspor berhasil (otomatis tandai selesai jika belum)
  const handleExportSuccess = useCallback(() => {
    if (project && projectId && project.status !== 'selesai') {
      setProject((prev) => ({ ...prev, status: 'selesai' }));
      projectStore.updateProjectStatus(projectId, 'selesai');
    }
  }, [project, projectId]);

  // ── Loading state ──────────────────────────────────────────────────────
  if (!project || !deckPayload) {
    return (
      <div className="flex min-h-screen bg-[#070C15] text-slate-100 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
          <span>Memuat editor slide PitchKu...</span>
        </div>
      </div>
    );
  }

  const activeSlide = deckPayload.slides[activeSlideIndex] || deckPayload.slides[0];
  const totalSlides = deckPayload.slides.length;

  const localEditingField =
    editingField?.slideIndex === activeSlideIndex
      ? { fieldName: editingField.fieldName, subIndex: editingField.subIndex }
      : null;

  return (
    <div className="flex flex-col h-screen bg-[#070C15] text-slate-100 overflow-hidden">
      {/* ── Top Navigation Bar ── */}
      <EditorHeader
        deckTitle={project.title}
        status={project.status || 'draft'}
        onStatusToggle={handleStatusToggle}
        isSaving={isSaving}
        onOpenExport={() => setIsExportOpen(true)}
        onRenameTitle={handleRenameTitle}
      />

      {/* ── Main Editor Layout (Left Sidebar Rail + Canvas Area) ── */}
      <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
        {/* Left vertical thumbnail sidebar rail / Bottombar on mobile */}
        <SlideThumbnailRail
          slides={deckPayload.slides}
          activeSlideIndex={activeSlideIndex}
          brandKit={deckPayload.brandKit}
          onSlideSelect={setActiveSlideIndex}
          onReorderSlides={handleReorderSlides}
          onAddSlide={handleAddSlide}
          onOpenAddSlideModal={() => setIsAddSlideOpen(true)}
          onDeleteSlide={handleDeleteSlide}
        />

        {/* Main Canvas + Contextual Toolbar Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Format & AI Toolbar */}
          <SlideFormatToolbar
            activeSlideIndex={activeSlideIndex}
            totalSlides={totalSlides}
            activeSlide={activeSlide}
            onAiRewrite={handleAiRewrite}
          />

          {/* 16:9 Canvas Viewport */}
          <SlideCanvas
            slide={activeSlide}
            totalSlides={totalSlides}
            deckTitle={project.title}
            brandKit={deckPayload.brandKit}
            editingField={localEditingField}
            onFieldClick={handleFieldClick}
            onFieldChange={handleFieldChange}
            onFieldCommit={handleFieldCommit}
            onImageClick={() => setIsMediaPickerOpen(true)}
          />
        </div>
      </div>

      {/* ── Add Slide Layout Modal ── */}
      <AddSlideModal
        open={isAddSlideOpen}
        onOpenChange={setIsAddSlideOpen}
        onAddSlide={handleAddSlide}
        brandKit={deckPayload.brandKit}
      />

      {/* ── Export PPTX / PDF Modal ── */}
      <ExportPresentationModal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        deckTitle={project.title}
        deckPayload={deckPayload}
        onExportSuccess={handleExportSuccess}
      />

      {/* ── Media & Image Picker Modal ── */}
      <MediaPickerModal
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelectImage={handleSelectImage}
      />

      {/* ── Hidden High-Res Canvas Container for 1:1 PPTX / PDF Export ── */}
      <SlideExportCanvas deckPayload={deckPayload} deckTitle={project.title} />
    </div>
  );
}

export default EditorPage;

