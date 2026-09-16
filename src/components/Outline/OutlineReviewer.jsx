import React, { useState } from 'react';
import { Info } from 'lucide-react';
import OutlineHeader from './OutlineHeader';
import OutlineItemCard from './OutlineItemCard';
import AddSlideDialog from './AddSlideDialog';
import { toast } from 'sonner';

export default function OutlineReviewer({
  templateId,
  outlineList,
  onOutlineChange,
  onResetDefault,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Helper untuk renumber slide 1..N
  const renumberSlides = (slides) => {
    return slides.map((slide, idx) => ({
      ...slide,
      slideNumber: idx + 1,
    }));
  };

  const touchStartIdxRef = React.useRef(null);
  const targetDropIdxRef = React.useRef(null);

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const updated = [...outlineList];
    const [item] = updated.splice(index, 1);
    updated.splice(index - 1, 0, item);
    onOutlineChange(renumberSlides(updated));
  };

  const handleMoveDown = (index) => {
    if (index >= outlineList.length - 1) return;
    const updated = [...outlineList];
    const [item] = updated.splice(index, 1);
    updated.splice(index + 1, 0, item);
    onOutlineChange(renumberSlides(updated));
  };

  // Drag and drop handlers (Native HTML5 API)
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', index.toString());
    } catch {}
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updated = [...outlineList];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    const reordered = renumberSlides(updated);
    onOutlineChange(reordered);
    setDraggedIndex(null);

    toast.info('Urutan slide diperbarui', {
      description: `Slide "${movedItem.title}" dipindahkan ke posisi #${dropIndex + 1}`,
    });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Touch Drag & Drop Handlers for Mobile
  const handleTouchStart = (index) => {
    touchStartIdxRef.current = index;
    targetDropIdxRef.current = index;
    setDraggedIndex(index);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const handleTouchMove = (e) => {
    if (draggedIndex === null) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = el?.closest('[data-outline-index]');
    if (card && card.dataset.outlineIndex !== undefined) {
      const idx = parseInt(card.dataset.outlineIndex, 10);
      if (!isNaN(idx)) {
        targetDropIdxRef.current = idx;
      }
    }
  };

  const handleTouchEnd = () => {
    if (draggedIndex !== null && targetDropIdxRef.current !== null && draggedIndex !== targetDropIdxRef.current) {
      const dropIndex = targetDropIdxRef.current;
      const updated = [...outlineList];
      const [movedItem] = updated.splice(draggedIndex, 1);
      updated.splice(dropIndex, 0, movedItem);

      const reordered = renumberSlides(updated);
      onOutlineChange(reordered);
      toast.info('Urutan slide diperbarui', {
        description: `Slide "${movedItem.title}" dipindahkan ke posisi #${dropIndex + 1}`,
      });
    }
    setDraggedIndex(null);
    touchStartIdxRef.current = null;
    targetDropIdxRef.current = null;
  };

  // Inline title change handler
  const handleTitleChange = (id, newTitle) => {
    const updated = outlineList.map((slide) => {
      if (slide.id === id) {
        return {
          ...slide,
          title: newTitle,
          isEdited: true,
        };
      }
      return slide;
    });
    onOutlineChange(updated);
  };

  // Duplicate slide handler
  const handleDuplicate = (id) => {
    const targetIdx = outlineList.findIndex((s) => s.id === id);
    if (targetIdx === -1) return;

    const targetSlide = outlineList[targetIdx];
    const duplicateSlide = {
      ...targetSlide,
      id: `slide-dup-${Date.now()}`,
      title: `${targetSlide.title} (Salinan)`,
      isEdited: true,
    };

    const updated = [...outlineList];
    updated.splice(targetIdx + 1, 0, duplicateSlide);
    const renumbered = renumberSlides(updated);
    onOutlineChange(renumbered);

    toast.success('Slide berhasil disalin', {
      description: `Disisipkan pada slide #${targetIdx + 2}`,
    });
  };

  // Delete slide handler
  const handleDelete = (id) => {
    if (outlineList.length <= 3) {
      toast.error('Batas minimal slide tercapai', {
        description: 'Presentasi membutuhkan minimal 3 slide.',
      });
      return;
    }

    const targetSlide = outlineList.find((s) => s.id === id);
    const updated = outlineList.filter((s) => s.id !== id);
    const renumbered = renumberSlides(updated);
    onOutlineChange(renumbered);

    toast.info('Slide dihapus', {
      description: `Slide "${targetSlide?.title || ''}" telah dihapus.`,
    });
  };

  // Add slide handler
  const handleAddSlide = (newSlide) => {
    const updated = [...outlineList, newSlide];
    const renumbered = renumberSlides(updated);
    onOutlineChange(renumbered);

    toast.success('Slide baru ditambahkan', {
      description: `Slide #${renumbered.length} berhasil dibuat.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <OutlineHeader
        totalSlides={outlineList.length}
        templateId={templateId}
        onResetDefault={onResetDefault}
        onOpenAddSlide={() => setIsAddDialogOpen(true)}
      />

      {/* List of Slide Outline Cards */}
      <div className="space-y-3">
        {outlineList.map((item, index) => (
          <OutlineItemCard
            key={item.id}
            item={item}
            index={index}
            totalSlides={outlineList.length}
            onTitleChange={handleTitleChange}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            isDragging={draggedIndex === index}
          />
        ))}
      </div>

      {/* Helper Info Footer */}
      <div className="flex items-center gap-2 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
        <Info className="w-4 h-4 text-sky-400 shrink-0" />
        <span>
          Klik langsung pada teks judul untuk mengedit, atau seret ikon grip{' '}
          <strong className="text-slate-200">⠿</strong> untuk memindahkan susunan alur presentasi.
        </span>
      </div>

      {/* Add Slide Dialog */}
      <AddSlideDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddSlide={handleAddSlide}
      />
    </div>
  );
}
