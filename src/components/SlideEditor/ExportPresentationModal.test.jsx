import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExportPresentationModal from './ExportPresentationModal';

// Mock pptxgenjs
const mockAddSlide = vi.fn().mockReturnValue({
  addShape: vi.fn(),
  addText: vi.fn(),
  addImage: vi.fn(),
});
const mockWriteFile = vi.fn().mockResolvedValue(true);

vi.mock('pptxgenjs', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      this.layout = '';
      this.addSlide = mockAddSlide;
      this.writeFile = mockWriteFile;
    }),
  };
});

// Mock aiService
vi.mock('@/lib/aiService', () => ({
  exportPptxApi: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock colorUtils image resolvers
vi.mock('@/lib/colorUtils', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    urlToDataUrl: vi.fn().mockImplementation(async (url) => (url ? `data:image/png;base64,mock_${url}` : null)),
    getImageNaturalDimensions: vi.fn().mockResolvedValue({ width: 800, height: 600 }),
  };
});

describe('ExportPresentationModal Component', () => {
  const mockDeckPayload = {
    deckTitle: 'Test Presentation',
    brandKit: {
      primaryColor: '#0F4C81',
      accentColor: '#F2A007',
      fontFamily: 'Inter',
      logoUrl: 'https://example.com/logo.png',
    },
    slides: [
      {
        id: 'slide-1',
        layout: 'title_slide',
        title: 'Title Slide Header',
        subtitle: 'Title Subtitle',
        imageUrl: 'https://example.com/cover.png',
      },
      {
        id: 'slide-2',
        layout: 'title_bullets',
        title: 'Bullets Slide',
        subtitle: 'Bullets Subtitle',
        bullets: ['Point 1', 'Point 2'],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open is true', () => {
    render(
      <ExportPresentationModal
        open={true}
        onOpenChange={() => {}}
        deckTitle="Test Presentation"
        deckPayload={mockDeckPayload}
      />
    );

    expect(screen.getByText('Unduh Presentasi Native')).toBeInTheDocument();
  });

  it('triggers PptxGenJS native export on PPTX download with cover image and logo pre-resolution', async () => {
    const handleSuccess = vi.fn();
    render(
      <ExportPresentationModal
        open={true}
        onOpenChange={() => {}}
        deckTitle="Test Presentation"
        deckPayload={mockDeckPayload}
        onExportSuccess={handleSuccess}
      />
    );

    const downloadBtn = screen.getByRole('button', { name: /Unduh Sekarang/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(mockAddSlide).toHaveBeenCalledTimes(2);
      expect(mockWriteFile).toHaveBeenCalledWith({ fileName: 'Test Presentation.pptx' });
      expect(handleSuccess).toHaveBeenCalled();
    });
  });
});
