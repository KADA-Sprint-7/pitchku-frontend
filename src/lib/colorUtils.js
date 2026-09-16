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

  let width;
  let height;

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
 * Calculates exact source pixel crop rectangle for PptxGenJS { type: 'crop', x, y, w, h }
 * to mimic CSS object-fit: cover inside a target box (targetW x targetH).
 * @param {number} naturalWidth
 * @param {number} naturalHeight
 * @param {number} targetW - target box width in inches
 * @param {number} targetH - target box height in inches
 * @returns {{ type: 'crop', x: number, y: number, w: number, h: number } | null}
 */
export function coverCropDimensions(naturalWidth, naturalHeight, targetW, targetH) {
  if (!naturalWidth || !naturalHeight || naturalWidth <= 0 || naturalHeight <= 0 || !targetW || !targetH) {
    return null;
  }
  const imageAspect = naturalWidth / naturalHeight;
  const boxAspect = targetW / targetH;

  if (imageAspect > boxAspect) {
    // Image is wider than target box -> crop left & right
    const cropW = Math.round(naturalHeight * boxAspect);
    const cropH = naturalHeight;
    const cropX = Math.round((naturalWidth - cropW) / 2);
    const cropY = 0;
    return { type: 'crop', x: cropX, y: cropY, w: cropW, h: cropH };
  } else {
    // Image is taller than target box -> crop top & bottom
    const cropW = naturalWidth;
    const cropH = Math.round(naturalWidth / boxAspect);
    const cropX = 0;
    const cropY = Math.round((naturalHeight - cropH) / 2);
    return { type: 'crop', x: cropX, y: cropY, w: cropW, h: cropH };
  }
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
    // Cache-buster to bypass non-CORS cached response in Chrome
    const targetUrl = (url.startsWith('http://') || url.startsWith('https://'))
      ? `${url}${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`
      : url;

    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width || 100,
        height: img.naturalHeight || img.height || 100,
      });
    };
    img.onerror = () => {
      // Fallback without crossOrigin if CORS failed
      const imgFallback = new Image();
      imgFallback.onload = () => {
        resolve({
          width: imgFallback.naturalWidth || imgFallback.width || 100,
          height: imgFallback.naturalHeight || imgFallback.height || 100,
        });
      };
      imgFallback.onerror = () => resolve(null);
      imgFallback.src = url;
    };
    img.src = targetUrl;
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

  // 1. Try standard fetch blob -> base64
  try {
    const fetchUrl = (url.startsWith('http://') || url.startsWith('https://'))
      ? `${url}${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`
      : url;
    const res = await fetch(fetchUrl, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
            resolve(reader.result);
          } else {
            resolve(null);
          }
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }
  } catch {
    /* proceed to fallback */
  }

  // 2. Try Image + Canvas fallback with crossOrigin
  try {
    const dataUrl = await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const targetUrl = (url.startsWith('http://') || url.startsWith('https://'))
        ? `${url}${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`
        : url;

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width || 100;
          canvas.height = img.naturalHeight || img.height || 100;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = targetUrl;
    });

    if (dataUrl) return dataUrl;
  } catch {
    /* proceed */
  }

  return null;
}
