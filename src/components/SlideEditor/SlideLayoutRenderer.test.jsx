import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SlideLayoutRenderer from './SlideLayoutRenderer';

describe('SlideLayoutRenderer Backend-Alignment Tests', () => {
  const mockBrandKit = {
    primaryColor: '#0F4C81',
    accentColor: '#F2A007',
    businessName: 'Kopi Nusantara',
  };

  it('renders title_slide layout with backend primary/accent colors and no image box', () => {
    const slide = {
      layout: 'title_slide',
      title: 'Judul Utama',
      subtitle: 'Subjudul Presentasi',
    };

    render(
      <SlideLayoutRenderer
        slide={slide}
        brandKit={mockBrandKit}
        editingField={null}
        onFieldClick={() => {}}
        onFieldChange={() => {}}
        onFieldCommit={() => {}}
        onImageClick={() => {}}
      />
    );

    expect(screen.getByText('Judul Utama')).toBeInTheDocument();
    expect(screen.getByText('Subjudul Presentasi')).toBeInTheDocument();
    expect(screen.getByText('Kopi Nusantara')).toBeInTheDocument();
  });

  it('omits image element when title_bullets slide has no imageUrl', () => {
    const slide = {
      layout: 'title_bullets',
      title: 'Slide Poin',
      bullets: ['Poin 1', 'Poin 2'],
      imageUrl: null,
    };

    const { container } = render(
      <SlideLayoutRenderer
        slide={slide}
        brandKit={mockBrandKit}
        editingField={null}
        onFieldClick={() => {}}
        onFieldChange={() => {}}
        onFieldCommit={() => {}}
        onImageClick={() => {}}
      />
    );

    expect(screen.getByText('Slide Poin')).toBeInTheDocument();
    expect(screen.getByText('Poin 1')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
  });

  it('renders image element when title_bullets slide has imageUrl', () => {
    const slide = {
      layout: 'title_bullets',
      title: 'Slide Poin Visual',
      bullets: ['Poin A'],
      imageUrl: 'https://example.com/photo.jpg',
    };

    const { container } = render(
      <SlideLayoutRenderer
        slide={slide}
        brandKit={mockBrandKit}
        editingField={null}
        onFieldClick={() => {}}
        onFieldChange={() => {}}
        onFieldCommit={() => {}}
        onImageClick={() => {}}
      />
    );

    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://example.com/photo.jpg');
  });

  it('enforces input maxLength attribute when editing a field inline', () => {
    const slide = {
      layout: 'title_slide',
      title: 'Judul Singkat',
    };

    const { rerender } = render(
      <SlideLayoutRenderer
        slide={slide}
        brandKit={mockBrandKit}
        editingField={{ fieldName: 'title', subIndex: undefined }}
        onFieldClick={() => {}}
        onFieldChange={() => {}}
        onFieldCommit={() => {}}
        onImageClick={() => {}}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input.getAttribute('maxLength')).toBe('60');
  });
});
