# PaletteSnap Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Construir una micro-herramienta web que extrae paletas de colores dominantes de imágenes, con blog SEO/AEO para monetización con anuncios.

**Architecture:** Sitio Astro estático con vanilla JS para toda la interactividad. Extracción de colores via Canvas API + k-means. Sin backend. Blog con JSON-LD para SEO y AEO.

**Tech Stack:** Astro 5, TailwindCSS 4, Vanilla JS, Vitest (unit tests)

---

## Task 1: Inicializar proyecto Astro + Tailwind + Vitest

**Files:**
- Modify: `E:/Proyectos/palettesnap/` (proyecto raíz, ya existe)

**Step 1: Inicializar Astro en el directorio existente**

```bash
cd E:/Proyectos/palettesnap
npm create astro@latest . -- --template minimal --install --no-git
```

Responder en los prompts:
- "How would you like to start?" → `A minimal, empty starter`
- "Install dependencies?" → `Yes`
- "Initialize git repository?" → `No` (ya tenemos la carpeta)

**Step 2: Agregar integración Tailwind**

```bash
npx astro add tailwind --yes
```

**Step 3: Agregar Vitest**

```bash
npm install -D vitest
```

**Step 4: Agregar script de test en package.json**

Abrir `package.json` y agregar en `scripts`:
```json
"test": "vitest run"
```

**Step 5: Verificar que el servidor arranca**

```bash
npm run dev
```
Esperado: Server corriendo en `http://localhost:4321` sin errores.

**Step 6: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Astro + Tailwind + Vitest"
```

---

## Task 2: Crear Layouts (MainLayout + BlogLayout)

**Files:**
- Create: `src/layouts/MainLayout.astro`
- Create: `src/layouts/BlogLayout.astro`

**Step 1: Crear src/layouts/MainLayout.astro**

```astro
---
export interface Props {
  title: string;
  description: string;
  canonical?: string;
}

const { title, description, canonical = Astro.url.href } = Astro.props;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PaletteSnap",
  "description": "Extrae paletas de colores dominantes de cualquier imagen de forma gratuita. Obtén HEX, RGB, HSL y nombre del color.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "url": "https://palettesnap.app"
};
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body class="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" class="font-bold text-xl text-indigo-600 tracking-tight">PaletteSnap</a>
        <nav>
          <a href="/blog/extractor-paleta-colores" class="text-gray-500 hover:text-indigo-600 text-sm transition-colors">
            Blog
          </a>
        </nav>
      </div>
    </header>

    <main class="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
      <slot />
    </main>

    <footer class="text-center text-gray-400 text-sm py-6 border-t border-gray-100">
      © 2026 PaletteSnap — Herramienta gratuita de extracción de paletas de color
    </footer>
  </body>
</html>
```

**Step 2: Crear src/layouts/BlogLayout.astro**

```astro
---
export interface Props {
  title: string;
  description: string;
  publishedDate: string;
}

const { title, description, publishedDate } = Astro.props;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "datePublished": publishedDate,
  "dateModified": publishedDate,
  "author": {
    "@type": "Organization",
    "name": "PaletteSnap"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PaletteSnap",
    "url": "https://palettesnap.app"
  }
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://palettesnap.app" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://palettesnap.app/blog" },
    { "@type": "ListItem", "position": 3, "name": title }
  ]
};
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} | PaletteSnap Blog</title>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="article" />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
    <script type="application/ld+json" set:html={JSON.stringify(breadcrumbLd)} />
  </head>
  <body class="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" class="font-bold text-xl text-indigo-600 tracking-tight">PaletteSnap</a>
        <a href="/" class="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
          Probar herramienta
        </a>
      </div>
    </header>

    <main class="max-w-2xl mx-auto w-full px-4 py-10 flex-1">
      <nav class="text-xs text-gray-400 mb-6">
        <a href="/" class="hover:text-indigo-600">Inicio</a>
        <span class="mx-1">/</span>
        <span>Blog</span>
        <span class="mx-1">/</span>
        <span class="text-gray-600">{title}</span>
      </nav>
      <slot />
    </main>

    <footer class="text-center text-gray-400 text-sm py-6 border-t border-gray-100">
      © 2026 PaletteSnap
    </footer>
  </body>
</html>
```

**Step 3: Verificar build sin errores**

```bash
npm run build
```
Esperado: Build exitoso en `dist/`

**Step 4: Commit**

```bash
git add src/layouts/
git commit -m "feat: add MainLayout and BlogLayout with SEO + JSON-LD"
```

---

## Task 3: Color Extractor con K-Means (TDD)

**Files:**
- Create: `src/lib/colorExtractor.js`
- Create: `src/lib/colorExtractor.test.js`

**Step 1: Escribir tests que fallan**

```js
// src/lib/colorExtractor.test.js
import { describe, it, expect } from 'vitest';
import { rgbToHex, rgbToHsl, extractColors } from './colorExtractor.js';

describe('rgbToHex', () => {
  it('convierte rojo puro', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
  });
  it('convierte negro', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
  });
  it('convierte blanco', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
  });
  it('agrega cero para valores de un dígito', () => {
    expect(rgbToHex(1, 1, 1)).toBe('#010101');
  });
});

describe('rgbToHsl', () => {
  it('convierte rojo puro a HSL correcto', () => {
    const hsl = rgbToHsl(255, 0, 0);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });
  it('convierte blanco a HSL correcto', () => {
    const hsl = rgbToHsl(255, 255, 255);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBe(100);
  });
  it('convierte negro a HSL correcto', () => {
    const hsl = rgbToHsl(0, 0, 0);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBe(0);
  });
});
```

**Step 2: Ejecutar tests para verificar que fallan**

```bash
npm test
```
Esperado: FAIL — "Cannot find module './colorExtractor.js'"

**Step 3: Implementar src/lib/colorExtractor.js**

```js
// src/lib/colorExtractor.js

/**
 * Convierte valores RGB a string HEX.
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @returns {string} Color en formato #rrggbb
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(v => Math.round(v).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convierte valores RGB a HSL.
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @returns {{ h: number, s: number, l: number }}
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
  // Inicializar centroides espaciados uniformemente
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
 * @param {ImageData} imageData - Datos de píxeles del canvas
 * @param {number} k - Número de colores a extraer (3-8)
 * @returns {Array<{r, g, b, hex, hsl}>}
 */
export function extractColors(imageData, k = 5) {
  const pixels = [];
  // Muestrear cada 5to píxel para mejorar rendimiento
  for (let i = 0; i < imageData.data.length; i += 4 * 5) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    if (a > 128) pixels.push([r, g, b]); // ignorar píxeles transparentes
  }

  if (pixels.length === 0) return [];

  const centroids = kMeans(pixels, k);

  return centroids.map(([r, g, b]) => ({
    r, g, b,
    hex: rgbToHex(r, g, b),
    hsl: rgbToHsl(r, g, b),
  }));
}
```

**Step 4: Ejecutar tests para verificar que pasan**

```bash
npm test
```
Esperado: PASS — todos los tests en verde.

**Step 5: Commit**

```bash
git add src/lib/colorExtractor.js src/lib/colorExtractor.test.js
git commit -m "feat: add color extractor with k-means algorithm (TDD)"
```

---

## Task 4: Color Namer en Español (TDD)

**Files:**
- Create: `src/lib/colorNamer.js`
- Create: `src/lib/colorNamer.test.js`

**Step 1: Escribir tests**

```js
// src/lib/colorNamer.test.js
import { describe, it, expect } from 'vitest';
import { getColorName } from './colorNamer.js';

describe('getColorName', () => {
  it('identifica rojo puro', () => {
    expect(getColorName(255, 0, 0)).toBe('Rojo');
  });
  it('identifica negro puro', () => {
    expect(getColorName(0, 0, 0)).toBe('Negro');
  });
  it('identifica blanco puro', () => {
    expect(getColorName(255, 255, 255)).toBe('Blanco');
  });
  it('retorna string no vacío para cualquier color', () => {
    const name = getColorName(123, 45, 200);
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });
});
```

**Step 2: Verificar que fallan**

```bash
npm test
```
Esperado: FAIL

**Step 3: Implementar src/lib/colorNamer.js**

```js
// src/lib/colorNamer.js
// Base de datos de ~60 colores nombrados en español

const COLOR_DB = [
  [0,   0,   0,   'Negro'],
  [255, 255, 255, 'Blanco'],
  [128, 128, 128, 'Gris'],
  [192, 192, 192, 'Gris Claro'],
  [64,  64,  64,  'Gris Oscuro'],
  [255, 0,   0,   'Rojo'],
  [139, 0,   0,   'Rojo Oscuro'],
  [205, 92,  92,  'Rojo Indio'],
  [255, 99,  71,  'Tomate'],
  [255, 127, 80,  'Coral'],
  [255, 69,  0,   'Rojo Naranja'],
  [255, 165, 0,   'Naranja'],
  [255, 140, 0,   'Naranja Oscuro'],
  [255, 215, 0,   'Dorado'],
  [255, 255, 0,   'Amarillo'],
  [240, 230, 140, 'Caqui'],
  [189, 183, 107, 'Caqui Oscuro'],
  [128, 128, 0,   'Oliva'],
  [0,   128, 0,   'Verde'],
  [0,   255, 0,   'Lima'],
  [0,   255, 127, 'Verde Primavera'],
  [0,   128, 128, 'Cerceta'],
  [32,  178, 170, 'Verde Mar Claro'],
  [64,  224, 208, 'Turquesa'],
  [0,   206, 209, 'Turquesa Oscuro'],
  [135, 206, 235, 'Azul Cielo'],
  [0,   191, 255, 'Azul Cielo Profundo'],
  [30,  144, 255, 'Azul Dodger'],
  [0,   0,   255, 'Azul'],
  [0,   0,   205, 'Azul Medio'],
  [0,   0,   139, 'Azul Oscuro'],
  [25,  25,  112, 'Azul Medianoche'],
  [75,  0,   130, 'Índigo'],
  [138, 43,  226, 'Violeta Azul'],
  [148, 0,   211, 'Violeta Oscuro'],
  [153, 50,  204, 'Orquídea Oscura'],
  [186, 85,  211, 'Orquídea Medio'],
  [128, 0,   128, 'Púrpura'],
  [139, 0,   139, 'Magenta Oscuro'],
  [255, 0,   255, 'Magenta'],
  [255, 20,  147, 'Rosa Profundo'],
  [255, 105, 180, 'Rosa'],
  [255, 182, 193, 'Rosa Claro'],
  [255, 192, 203, 'Rosado'],
  [210, 105, 30,  'Chocolate'],
  [139, 69,  19,  'Marrón Silla'],
  [160, 82,  45,  'Siena'],
  [205, 133, 63,  'Perú'],
  [222, 184, 135, 'Bronceado'],
  [245, 222, 179, 'Trigo'],
  [255, 228, 196, 'Bisqué'],
  [255, 235, 205, 'Almendra'],
  [250, 235, 215, 'Blanco Antiguo'],
  [253, 245, 230, 'Encaje Viejo'],
  [240, 248, 255, 'Azul Hielo'],
  [248, 248, 255, 'Blanco Fantasma'],
  [255, 250, 240, 'Floral'],
  [245, 255, 250, 'Crema de Menta'],
  [240, 255, 240, 'Luna de Miel'],
  [224, 255, 255, 'Cian Claro'],
];

function distSq(r1, g1, b1, r2, g2, b2) {
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
}

/**
 * Retorna el nombre más cercano en español para un color RGB.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
export function getColorName(r, g, b) {
  let minDist = Infinity;
  let name = 'Color';

  for (const [cr, cg, cb, cname] of COLOR_DB) {
    const d = distSq(r, g, b, cr, cg, cb);
    if (d < minDist) {
      minDist = d;
      name = cname;
    }
  }

  return name;
}
```

**Step 4: Ejecutar tests**

```bash
npm test
```
Esperado: PASS

**Step 5: Commit**

```bash
git add src/lib/colorNamer.js src/lib/colorNamer.test.js
git commit -m "feat: add Spanish color namer with 60+ color names (TDD)"
```

---

## Task 5: Exportadores (TDD)

**Files:**
- Create: `src/lib/exporters.js`
- Create: `src/lib/exporters.test.js`

**Step 1: Escribir tests**

```js
// src/lib/exporters.test.js
import { describe, it, expect } from 'vitest';
import { generateCssVariables } from './exporters.js';

describe('generateCssVariables', () => {
  it('genera CSS válido para una paleta', () => {
    const colors = [
      { hex: '#ff0000', name: 'Rojo', r: 255, g: 0, b: 0 },
      { hex: '#0000ff', name: 'Azul', r: 0, g: 0, b: 255 },
    ];
    const css = generateCssVariables(colors);
    expect(css).toContain(':root {');
    expect(css).toContain('--color-1: #ff0000');
    expect(css).toContain('--color-2: #0000ff');
    expect(css).toContain('/* Rojo */');
    expect(css).toContain('/* Azul */');
    expect(css).toContain('}');
  });

  it('maneja paleta vacía', () => {
    const css = generateCssVariables([]);
    expect(css).toContain(':root {');
  });
});
```

**Step 2: Verificar que fallan**

```bash
npm test
```
Esperado: FAIL

**Step 3: Implementar src/lib/exporters.js**

```js
// src/lib/exporters.js

/**
 * Genera variables CSS a partir de una paleta de colores.
 * @param {Array<{hex: string, name: string}>} colors
 * @returns {string} Bloque CSS :root { ... }
 */
export function generateCssVariables(colors) {
  const vars = colors
    .map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} */`)
    .join('\n');
  return `:root {\n${vars}\n}`;
}

/**
 * Copia texto al portapapeles del usuario.
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

/**
 * Exporta la paleta como imagen PNG y la descarga.
 * Solo funciona en el browser.
 * @param {Array<{hex: string, name: string}>} colors
 * @param {string} filename
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

  // Fondo blanco
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  colors.forEach((color, i) => {
    const x = i * swatchW;

    // Swatch
    ctx.fillStyle = color.hex;
    ctx.fillRect(x, 0, swatchW, swatchH);

    // Labels
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
```

**Step 4: Ejecutar tests**

```bash
npm test
```
Esperado: PASS

**Step 5: Commit**

```bash
git add src/lib/exporters.js src/lib/exporters.test.js
git commit -m "feat: add CSS variables and PNG exporters (TDD)"
```

---

## Task 6: Componente ImageUploader

**Files:**
- Create: `src/components/ImageUploader.astro`

**Step 1: Crear componente**

```astro
---
// src/components/ImageUploader.astro
// Emite evento personalizado 'imageLoaded' con { imageData, previewSrc }
---

<div
  id="uploader"
  class="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 select-none"
  role="button"
  tabindex="0"
  aria-label="Zona de carga de imagen"
>
  <div class="flex flex-col items-center gap-3 pointer-events-none">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <div>
      <p class="text-gray-600 font-medium text-base">Arrastra tu imagen aquí</p>
      <p class="text-gray-400 text-sm mt-1">o haz click para seleccionar</p>
    </div>
    <p class="text-gray-300 text-xs">
      También puedes pegar con
      <kbd class="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs font-mono">Ctrl+V</kbd>
    </p>
    <p class="text-gray-300 text-xs">PNG, JPG, WEBP, GIF</p>
  </div>
  <input type="file" id="fileInput" accept="image/*" class="hidden" aria-hidden="true" />
</div>

<!-- Preview de la imagen cargada -->
<div id="preview-container" class="hidden mt-4 rounded-xl overflow-hidden border border-gray-200">
  <img id="preview-img" src="" alt="Imagen cargada" class="w-full max-h-64 object-contain bg-gray-100" />
</div>

<!-- Canvas oculto para procesar píxeles -->
<canvas id="processing-canvas" class="hidden" aria-hidden="true"></canvas>

<script>
  const uploader = document.getElementById('uploader');
  const fileInput = document.getElementById('fileInput');
  const canvas = document.getElementById('processing-canvas');
  const previewContainer = document.getElementById('preview-container');
  const previewImg = document.getElementById('preview-img');

  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      const img = new Image();
      img.onload = () => {
        // Limitar resolución para rendimiento
        const maxDim = 800;
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);

        // Mostrar preview
        previewImg.src = src;
        previewContainer.classList.remove('hidden');

        // Emitir evento personalizado
        document.dispatchEvent(new CustomEvent('imageLoaded', {
          detail: { imageData, previewSrc: src }
        }));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  // Click para abrir selector
  uploader.addEventListener('click', () => fileInput.click());
  uploader.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') fileInput.click();
  });

  // Selector de archivo
  fileInput.addEventListener('change', (e) => processFile(e.target.files[0]));

  // Drag & drop
  uploader.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploader.classList.add('border-indigo-400', 'bg-indigo-50');
  });
  uploader.addEventListener('dragleave', (e) => {
    if (!uploader.contains(e.relatedTarget)) {
      uploader.classList.remove('border-indigo-400', 'bg-indigo-50');
    }
  });
  uploader.addEventListener('drop', (e) => {
    e.preventDefault();
    uploader.classList.remove('border-indigo-400', 'bg-indigo-50');
    processFile(e.dataTransfer.files[0]);
  });

  // Pegar con Ctrl+V
  document.addEventListener('paste', (e) => {
    const items = Array.from(e.clipboardData?.items || []);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    if (imageItem) processFile(imageItem.getAsFile());
  });
</script>
```

**Step 2: Verificar en browser**

```bash
npm run dev
```
- Abrir http://localhost:4321
- Verificar que la zona de drop se renderiza
- Verificar hover state (borde indigo)
- No debe haber errores en consola

**Step 3: Commit**

```bash
git add src/components/ImageUploader.astro
git commit -m "feat: add ImageUploader with drag-drop, click, and Ctrl+V"
```

---

## Task 7: Componente ColorCard y PaletteDisplay

**Files:**
- Create: `src/components/PaletteDisplay.astro`

**Step 1: Crear PaletteDisplay.astro con template de tarjeta incluido**

```astro
---
// src/components/PaletteDisplay.astro
---

<!-- Sección oculta hasta que se cargue una imagen -->
<section id="palette-section" class="hidden space-y-5" aria-live="polite">
  <div class="flex items-center justify-between flex-wrap gap-3">
    <h2 class="text-lg font-semibold text-gray-800">Paleta extraída</h2>
    <div class="flex gap-2">
      <button
        id="btn-css"
        class="text-sm bg-white border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg px-3 py-1.5 transition-colors"
        title="Copiar como variables CSS"
      >
        Copiar CSS
      </button>
      <button
        id="btn-png"
        class="text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 transition-colors"
        title="Descargar paleta como imagen PNG"
      >
        Exportar PNG
      </button>
    </div>
  </div>

  <!-- Grid de tarjetas (inyectado por JS) -->
  <div id="palette-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
  </div>

  <!-- Notificación de copiado -->
  <div
    id="copy-toast"
    class="hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg transition-opacity"
    role="alert"
  >
    ¡Copiado!
  </div>
</section>

<!-- Template para tarjeta de color (clonado por JS) -->
<template id="color-card-tpl">
  <article class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div class="color-swatch h-24 w-full"></div>
    <div class="p-3 space-y-0.5">
      <p class="font-mono text-sm font-bold text-gray-900 color-hex"></p>
      <p class="text-xs text-gray-500 color-rgb"></p>
      <p class="text-xs text-gray-500 color-hsl"></p>
      <p class="text-xs text-gray-400 italic color-name"></p>
    </div>
    <div class="px-3 pb-3">
      <button class="copy-hex-btn w-full text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-100 rounded-lg py-1.5 transition-colors">
        Copiar HEX
      </button>
    </div>
  </article>
</template>

<script>
  import { generateCssVariables, copyToClipboard, exportPaletteAsPng } from '../lib/exporters.js';

  const paletteSection = document.getElementById('palette-section');
  const paletteGrid = document.getElementById('palette-grid');
  const template = document.getElementById('color-card-tpl');
  const toast = document.getElementById('copy-toast');

  let currentColors = [];
  let toastTimeout = null;

  function showToast(msg = '¡Copiado!') {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.add('hidden'), 2000);
  }

  function renderPalette(colors) {
    paletteGrid.innerHTML = '';
    paletteSection.classList.remove('hidden');

    colors.forEach((color) => {
      const card = template.content.cloneNode(true);

      card.querySelector('.color-swatch').style.backgroundColor = color.hex;
      card.querySelector('.color-hex').textContent = color.hex;
      card.querySelector('.color-rgb').textContent = `rgb(${color.r}, ${color.g}, ${color.b})`;
      card.querySelector('.color-hsl').textContent = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
      card.querySelector('.color-name').textContent = color.name;

      card.querySelector('.copy-hex-btn').addEventListener('click', async () => {
        await copyToClipboard(color.hex);
        showToast(`Copiado: ${color.hex}`);
      });

      paletteGrid.appendChild(card);
    });
  }

  // Escuchar el evento del ImageUploader (relayed desde index.astro)
  document.addEventListener('paletteReady', (e) => {
    currentColors = e.detail.colors;
    renderPalette(currentColors);
  });

  document.getElementById('btn-css').addEventListener('click', async () => {
    const css = generateCssVariables(currentColors);
    await copyToClipboard(css);
    showToast('CSS copiado al portapapeles');
  });

  document.getElementById('btn-png').addEventListener('click', () => {
    exportPaletteAsPng(currentColors);
  });
</script>
```

**Step 2: Verificar que no hay errores de sintaxis**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/components/PaletteDisplay.astro
git commit -m "feat: add PaletteDisplay with color cards and export buttons"
```

---

## Task 8: Página Principal index.astro

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Reemplazar contenido de index.astro**

```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import ImageUploader from '../components/ImageUploader.astro';
import PaletteDisplay from '../components/PaletteDisplay.astro';
---

<MainLayout
  title="PaletteSnap — Extractor de Paleta de Colores Gratis"
  description="Extrae los colores dominantes de cualquier imagen al instante. Obtén HEX, RGB, HSL y nombre en español. Exporta como CSS o PNG. Gratis, sin registro."
>
  <!-- Banner Ad superior -->
  <div class="bg-gray-100 rounded-xl h-20 flex items-center justify-center text-gray-400 text-xs mb-8 border border-dashed border-gray-200">
    Espacio publicitario
  </div>

  <div class="space-y-8">
    <!-- Hero -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
        Extrae colores de cualquier imagen
      </h1>
      <p class="text-gray-500 text-base">
        Sube, arrastra o pega tu imagen — obtén la paleta al instante
      </p>
    </div>

    <!-- Uploader -->
    <ImageUploader />

    <!-- Slider de cantidad de colores -->
    <div class="flex items-center gap-4 px-1">
      <label for="colorCount" class="text-sm text-gray-600 whitespace-nowrap">
        Número de colores:
      </label>
      <input
        type="range"
        id="colorCount"
        min="3"
        max="8"
        value="5"
        class="flex-1 accent-indigo-600 cursor-pointer"
      />
      <span id="colorCountValue" class="text-sm font-mono text-gray-700 w-4 text-center">5</span>
    </div>

    <!-- Paleta resultante -->
    <PaletteDisplay />
  </div>

  <!-- Banner Ad inferior -->
  <div class="bg-gray-100 rounded-xl h-20 flex items-center justify-center text-gray-400 text-xs mt-10 border border-dashed border-gray-200">
    Espacio publicitario
  </div>
</MainLayout>

<script>
  import { extractColors } from '../lib/colorExtractor.js';
  import { getColorName } from '../lib/colorNamer.js';

  const slider = document.getElementById('colorCount');
  const sliderValue = document.getElementById('colorCountValue');

  slider.addEventListener('input', () => {
    sliderValue.textContent = slider.value;
  });

  document.addEventListener('imageLoaded', (e) => {
    const { imageData } = e.detail;
    const k = parseInt(slider.value);

    const rawColors = extractColors(imageData, k);
    const colors = rawColors.map(c => ({
      ...c,
      name: getColorName(c.r, c.g, c.b),
    }));

    // Pasar paleta al componente PaletteDisplay
    document.dispatchEvent(new CustomEvent('paletteReady', { detail: { colors } }));
  });
</script>
```

**Step 2: Probar flujo completo manualmente**

```bash
npm run dev
```

Checklist en http://localhost:4321:
- [ ] Zona de drag & drop visible
- [ ] Subir imagen con click → paleta aparece con 5 colores
- [ ] Mover slider a 3 → subir imagen de nuevo → 3 colores
- [ ] Ctrl+V con imagen en portapapeles funciona
- [ ] Click en "Copiar HEX" → toast aparece
- [ ] Click en "Copiar CSS" → CSS en portapapeles
- [ ] Click en "Exportar PNG" → descarga el archivo

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire up complete palette extraction flow in index.astro"
```

---

## Task 9: Blog Post SEO + AEO

**Files:**
- Create: `src/pages/blog/extractor-paleta-colores.astro`

**Step 1: Crear el blog post**

```astro
---
import BlogLayout from '../../layouts/BlogLayout.astro';

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es un extractor de paleta de colores?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un extractor de paleta de colores es una herramienta que analiza una imagen y devuelve los colores dominantes en formatos como HEX, RGB o HSL. Se usa para diseño web, branding y marketing visual."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuántos colores debe tener una paleta de diseño?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Una paleta de diseño típicamente tiene entre 3 y 6 colores: un color primario, uno o dos secundarios, un acento y colores neutros. Para identidades de marca se recomienda 5 colores."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es la diferencia entre HEX, RGB y HSL?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "HEX (#ff0000) es el formato más común en web. RGB (255, 0, 0) describe los canales de rojo, verde y azul. HSL (0, 100%, 50%) describe tono, saturación y luminosidad, siendo más intuitivo para los humanos."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo extraer colores de una captura de pantalla?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Con PaletteSnap puedes pegar directamente una captura de pantalla usando Ctrl+V sin necesidad de guardar el archivo primero. La herramienta procesará la imagen al instante."
      }
    }
  ]
};
---

<BlogLayout
  title="Extractores de Paleta de Colores: Qué Son, Para Qué Sirven y Cuál Usar"
  description="Guía completa sobre extractores de paleta de colores: usos, herramientas populares y cómo obtener la paleta perfecta de cualquier imagen gratis."
  publishedDate="2026-02-26"
>
  <script type="application/ld+json" set:html={JSON.stringify(faqLd)} />

  <article class="prose prose-gray max-w-none">
    <h1>Extractores de Paleta de Colores: Guía Completa 2026</h1>

    <p class="lead text-lg text-gray-600">
      Un <strong>extractor de paleta de colores</strong> es una herramienta que analiza una imagen
      y devuelve sus colores dominantes en formatos como HEX, RGB o HSL. Es usado por diseñadores,
      marketers y desarrolladores para crear identidades visuales consistentes.
    </p>

    <h2>¿Para qué se usa un extractor de paleta de colores?</h2>

    <p>
      La consistencia visual es uno de los pilares del diseño profesional. Ya sea que estés
      creando una identidad de marca, diseñando un sitio web o preparando publicaciones para
      redes sociales, necesitas trabajar con colores precisos y reproducibles.
    </p>

    <ul>
      <li><strong>Branding e identidad visual:</strong> Extrae los colores exactos del logo de una marca para usarlos en todos los materiales.</li>
      <li><strong>Diseño web:</strong> Genera variables CSS directamente desde una imagen de referencia.</li>
      <li><strong>Marketing en redes sociales:</strong> Mantén coherencia visual entre publicaciones usando la misma paleta.</li>
      <li><strong>Análisis de competidores:</strong> Descubre qué colores usa tu competencia para diferenciarte.</li>
      <li><strong>Fotografía y arte:</strong> Identifica la paleta de una fotografía para recrear su ambiente.</li>
    </ul>

    <h2>Herramientas más populares para extraer paletas de colores</h2>

    <p>Existen varias herramientas en el mercado. Aquí una comparativa honesta:</p>

    <div class="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Herramienta</th>
            <th>Gratis</th>
            <th>Sin registro</th>
            <th>Formatos</th>
            <th>Exportar PNG</th>
            <th>Exportar CSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>PaletteSnap</strong></td>
            <td>✅</td>
            <td>✅</td>
            <td>HEX, RGB, HSL + nombre</td>
            <td>✅</td>
            <td>✅</td>
          </tr>
          <tr>
            <td>Coolors</td>
            <td>Parcial</td>
            <td>✅</td>
            <td>HEX, RGB</td>
            <td>✅ (Pro)</td>
            <td>✅ (Pro)</td>
          </tr>
          <tr>
            <td>Adobe Color</td>
            <td>✅</td>
            <td>❌ (requiere cuenta)</td>
            <td>HEX, RGB, CMYK</td>
            <td>✅</td>
            <td>❌</td>
          </tr>
          <tr>
            <td>ImageColorPicker</td>
            <td>✅</td>
            <td>✅</td>
            <td>HEX, RGB</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>¿Por qué usar PaletteSnap?</h2>

    <p>
      PaletteSnap fue diseñado con un principio en mente: hacer una sola cosa, pero hacerla bien.
      A diferencia de otras herramientas que requieren registro o limitan sus funciones a usuarios
      de pago, PaletteSnap es completamente gratuito y funciona directamente en tu navegador.
    </p>

    <p>Características que lo hacen único:</p>

    <ul>
      <li><strong>Pega con Ctrl+V:</strong> No necesitas guardar la imagen. Toma una captura de pantalla y pégala directamente.</li>
      <li><strong>Nombres en español:</strong> Cada color viene con su nombre en español, no solo el código técnico.</li>
      <li><strong>Cantidad configurable:</strong> Elige entre 3 y 8 colores según tus necesidades.</li>
      <li><strong>Exporta como CSS:</strong> Copia las variables CSS listas para pegar en tu proyecto.</li>
      <li><strong>100% privado:</strong> Tu imagen nunca sale de tu navegador. Todo el procesamiento es local.</li>
    </ul>

    <h2>Cómo obtener la paleta perfecta de una imagen</h2>

    <ol>
      <li>Sube tu imagen (arrastra, click, o Ctrl+V)</li>
      <li>Ajusta el número de colores con el slider (recomendamos 5 para branding)</li>
      <li>Copia el HEX de cada color individualmente, o exporta todo como CSS variables</li>
      <li>Descarga la paleta como imagen PNG para documentación o presentaciones</li>
    </ol>

    <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-5 my-6">
      <p class="text-indigo-800 font-medium m-0">
        ¿Listo para extraer tu paleta?
        <a href="/" class="underline hover:no-underline">Prueba PaletteSnap ahora →</a>
      </p>
    </div>

    <h2>Preguntas frecuentes</h2>

    <h3>¿Qué es un extractor de paleta de colores?</h3>
    <p>
      Un extractor de paleta de colores es una herramienta que analiza una imagen y devuelve
      los colores dominantes en formatos como HEX, RGB o HSL. Se usa para diseño web, branding
      y marketing visual.
    </p>

    <h3>¿Cuántos colores debe tener una paleta de diseño?</h3>
    <p>
      Una paleta de diseño típicamente tiene entre 3 y 6 colores: un color primario, uno o dos
      secundarios, un acento y colores neutros. Para identidades de marca se recomienda comenzar
      con 5 colores.
    </p>

    <h3>¿Cuál es la diferencia entre HEX, RGB y HSL?</h3>
    <p>
      <strong>HEX</strong> (#ff0000) es el formato más común en desarrollo web.
      <strong>RGB</strong> (255, 0, 0) describe los canales de rojo, verde y azul.
      <strong>HSL</strong> (0, 100%, 50%) describe tono, saturación y luminosidad,
      siendo más intuitivo para ajustes manuales.
    </p>

    <h3>¿Puedo extraer colores de una captura de pantalla?</h3>
    <p>
      Sí. Con PaletteSnap puedes pegar directamente una captura de pantalla usando
      <kbd>Ctrl+V</kbd> sin necesidad de guardar el archivo primero. La herramienta
      procesará la imagen al instante.
    </p>
  </article>
</BlogLayout>
```

**Step 2: Instalar plugin de tipografía de Tailwind**

```bash
npm install -D @tailwindcss/typography
```

Agregar a `tailwind.config.mjs`:
```js
plugins: [require('@tailwindcss/typography')]
```

**Step 3: Verificar build**

```bash
npm run build
```
Esperado: Sin errores. Archivo generado en `dist/blog/extractor-paleta-colores/index.html`

**Step 4: Commit**

```bash
git add src/pages/blog/ tailwind.config.mjs package.json
git commit -m "feat: add SEO/AEO optimized blog post with FAQPage schema"
```

---

## Task 10: Build final y verificación

**Step 1: Ejecutar todos los tests**

```bash
npm test
```
Esperado: Todos los tests pasan.

**Step 2: Build de producción**

```bash
npm run build
```
Esperado: Sin errores, archivos en `dist/`.

**Step 3: Preview de producción**

```bash
npm run preview
```

Checklist final:
- [ ] Página principal carga correctamente
- [ ] Subir imagen → paleta aparece
- [ ] Ctrl+V funciona
- [ ] Slider cambia cantidad de colores
- [ ] Copiar HEX → toast de confirmación
- [ ] Copiar CSS → CSS en portapapeles
- [ ] Exportar PNG → descarga correcta
- [ ] Blog post accesible en /blog/extractor-paleta-colores
- [ ] No hay errores en consola del browser

**Step 4: Commit final**

```bash
git add .
git commit -m "feat: PaletteSnap v1.0 complete"
```
