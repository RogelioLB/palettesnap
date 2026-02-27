/**
 * Genera variables CSS a partir de una paleta de colores.
 */
export function generateCssVariables(colors) {
  const vars = colors
    .map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} */`)
    .join('\n');
  return `:root {\n${vars}\n}`;
}

/**
 * Copia texto al portapapeles del usuario.
 */
export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

/**
 * Exporta la paleta como imagen PNG y la descarga.
 * Solo funciona en el browser (usa Canvas API y document).
 */
export function exportPaletteAsPng(colors, filename = 'paleta.png') {
  const swatchW = 140;
  const swatchH = 120;
  const labelH = 50;
  const padding = 12;
  const width = colors.length * swatchW;
  const height = swatchH + labelH;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  colors.forEach((color, i) => {
    const x = i * swatchW;
    ctx.fillStyle = color.hex;
    ctx.fillRect(x, 0, swatchW, swatchH);
    ctx.fillStyle = '#1f2937';
    ctx.font = `bold 13px sans-serif`;
    ctx.fillText(color.hex, x + padding, swatchH + 18);
    ctx.font = `11px sans-serif`;
    ctx.fillStyle = '#6b7280';
    ctx.fillText(color.name, x + padding, swatchH + 34);
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
