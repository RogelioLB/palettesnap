/**
 * Convierte valores RGB a string HEX.
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(v => Math.round(v).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convierte valores RGB a HSL.
 */
export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function colorDistance([r1, g1, b1], [r2, g2, b2]) {
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
}

function kMeans(pixels, k, iterations = 12) {
  let centroids = Array.from({ length: k }, (_, i) => {
    return [...pixels[Math.floor(i * pixels.length / k)]];
  });

  for (let iter = 0; iter < iterations; iter++) {
    const clusters = Array.from({ length: k }, () => []);

    for (const pixel of pixels) {
      let minDist = Infinity;
      let closest = 0;
      for (let i = 0; i < k; i++) {
        const d = colorDistance(pixel, centroids[i]);
        if (d < minDist) { minDist = d; closest = i; }
      }
      clusters[closest].push(pixel);
    }

    const newCentroids = centroids.map((centroid, i) => {
      if (clusters[i].length === 0) return centroid;
      return [
        Math.round(clusters[i].reduce((s, p) => s + p[0], 0) / clusters[i].length),
        Math.round(clusters[i].reduce((s, p) => s + p[1], 0) / clusters[i].length),
        Math.round(clusters[i].reduce((s, p) => s + p[2], 0) / clusters[i].length),
      ];
    });

    centroids = newCentroids;
  }

  return centroids;
}

/**
 * Extrae los colores dominantes de un ImageData usando k-means.
 */
export function extractColors(imageData, k = 5) {
  const pixels = [];
  for (let i = 0; i < imageData.data.length; i += 4 * 5) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    if (a > 128) pixels.push([r, g, b]);
  }

  if (pixels.length === 0) return [];

  const centroids = kMeans(pixels, k);

  return centroids.map(([r, g, b]) => ({
    r, g, b,
    hex: rgbToHex(r, g, b),
    hsl: rgbToHsl(r, g, b),
  }));
}
