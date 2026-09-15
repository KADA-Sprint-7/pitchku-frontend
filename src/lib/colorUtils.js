/**
 * Color utility functions for safe rendering across html2canvas, pptxgenjs, and browsers.
 */

/**
 * Convert a 3, 6, or 8-digit HEX or named/RGB color to rgba(r, g, b, a) string
 * @param {string} hex - e.g. '#0F4C81', '#F2A007', '#0F4C8122'
 * @param {number} opacity - fallback opacity (0 to 1) if not embedded in hex
 * @returns {string} - e.g. 'rgba(15, 76, 129, 0.15)'
 */
export function hexToRgba(hex, opacity = 1) {
  if (!hex || typeof hex !== 'string') return `rgba(15, 76, 129, ${opacity})`;
  
  let clean = hex.trim().replace(/^#/, '');

  // 3-digit hex #RGB -> #RRGGBB
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }

  // 8-digit hex #RRGGBBAA
  if (clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16) || 0;
    const g = parseInt(clean.slice(2, 4), 16) || 0;
    const b = parseInt(clean.slice(4, 6), 16) || 0;
    const a = Math.round((parseInt(clean.slice(6, 8), 16) / 255) * 100) / 100;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // 6-digit hex #RRGGBB
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16) || 0;
    const g = parseInt(clean.slice(2, 4), 16) || 0;
    const b = parseInt(clean.slice(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return hex;
}

/**
 * Convert any CSS color into solid 6-digit HEX (#RRGGBB)
 * @param {string} colorValue
 * @returns {string} - e.g. '#0F4C81'
 */
export function toSolidHex(colorValue) {
  if (!colorValue || typeof colorValue !== 'string') return '#0F4C81';
  let clean = colorValue.trim().replace(/^#/, '');

  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }

  if (clean.length >= 6) {
    return `#${clean.slice(0, 6).toUpperCase()}`;
  }

  return `#${clean.toUpperCase()}`;
}

/**
 * Calculates image dimensions while preserving aspect ratio inside a bounding box
 * @param {number} naturalWidth
 * @param {number} naturalHeight
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @returns {{ width: number, height: number, xOffset: number, yOffset: number }}
 */
export function fitDimensions(naturalWidth, naturalHeight, maxWidth, maxHeight) {
  if (!naturalWidth || !naturalHeight || naturalWidth <= 0 || naturalHeight <= 0) {
    return { width: maxWidth, height: maxHeight, xOffset: 0, yOffset: 0 };
  }

  const imageAspect = naturalWidth / naturalHeight;
  const boxAspect = maxWidth / maxHeight;

  let width = maxWidth;
  let height = maxHeight;

  if (imageAspect > boxAspect) {
    // Image is wider than box
    width = maxWidth;
    height = maxWidth / imageAspect;
  } else {
    // Image is taller than box
    height = maxHeight;
    width = maxHeight * imageAspect;
  }

  return {
    width: Math.round(width * 1000) / 1000,
    height: Math.round(height * 1000) / 1000,
    xOffset: Math.round(((maxWidth - width) / 2) * 1000) / 1000,
    yOffset: Math.round(((maxHeight - height) / 2) * 1000) / 1000,
  };
}

/**
 * Asynchronously load an image URL and return natural dimensions
 * @param {string} url
 * @returns {Promise<{ width: number, height: number } | null>}
 */
export function getImageNaturalDimensions(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width || 100,
        height: img.naturalHeight || img.height || 100,
      });
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Convert any image URL (blob:, http:, data:) into a base64 Data URL (data:image/png;base64,...)
 * to prevent pptxgenjs XHR errors on blob URLs.
 * @param {string} url
 * @returns {Promise<string | null>}
 */
export async function urlToDataUrl(url) {
  if (!url) return null;
  if (url.startsWith('data:image/')) return url;

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  } catch {
    try {
      return await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width || 100;
          canvas.height = img.naturalHeight || img.height || 100;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });
    } catch {
      return null;
    }
  }
}
