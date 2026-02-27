# PaletteSnap — Diseño de la Aplicación
**Fecha:** 2026-02-26

## Resumen
Micro-herramienta web de un solo propósito: extraer paletas de colores dominantes de cualquier imagen. Monetizable con anuncios. Público objetivo: diseñadores, marketers y cualquier persona sin conocimientos técnicos.

## Stack
- **Framework:** Astro (output estático)
- **Estilos:** TailwindCSS
- **JS:** Vanilla (sin frameworks frontend)
- **Deploy:** Netlify o Vercel (gratuito)

## Estructura de Archivos
```
src/
├── pages/
│   ├── index.astro
│   └── blog/
│       └── extractor-paleta-colores.astro
├── components/
│   ├── ImageUploader.astro
│   ├── PaletteDisplay.astro
│   ├── ColorCard.astro
│   └── BlogPost.astro
├── lib/
│   ├── colorExtractor.js   # Canvas API + k-means
│   ├── colorNamer.js       # ntc.js para nombres de color
│   └── exporters.js        # Exportar PNG y CSS variables
└── layouts/
    ├── MainLayout.astro    # Layout base con meta tags + JSON-LD
    └── BlogLayout.astro    # Layout artículo con Article schema
```

## Funcionalidades

### Entrada de imagen
- Drag & drop
- Click para subir archivo
- Ctrl+V para pegar desde portapapeles (ideal para capturas)

### Extracción de colores
- Algoritmo: K-means clustering sobre píxeles del canvas
- Colores configurables: slider de 3 a 8, default en 5

### Información por color
- HEX
- RGB
- HSL
- Nombre del color (via ntc.js)
- Click en tarjeta para copiar HEX al portapapeles

### Exportación
- Copiar color individual al portapapeles
- Exportar paleta completa como imagen PNG
- Exportar paleta como variables CSS

## Diseño Visual
- Estilo: Neutral profesional
- Paleta UI: gray-50 fondo, white tarjetas, indigo-600 acento
- Layout: columna centrada, max-width 768px
- Tipografía: sans-serif del sistema

### Layout principal
```
Header (logo + nav Blog)
Banner Ad 728x90
H1 + subtítulo
Drop zone (drag & drop + Ctrl+V)
Slider de cantidad de colores
Grid de ColorCards (HEX, RGB, HSL, Nombre)
Botones: [Copiar CSS] [Exportar PNG]
Banner Ad 728x90
Footer
```

## SEO / AEO

### index.astro
- JSON-LD: `SoftwareApplication`
- Meta title, description, Open Graph
- Canonical URL

### Blog post
- URL: `/blog/extractor-paleta-colores`
- Título: "Extractores de Paleta de Colores: Qué Son, Para Qué Sirven y Cuál Usar"
- JSON-LD: `Article` + `FAQPage` + `BreadcrumbList`
- Párrafo intro con respuesta directa en <40 palabras (AEO)
- Sección comparativa de herramientas (Coolors, Adobe Color, etc.)
- FAQ con 4 preguntas frecuentes
- CTA natural hacia PaletteSnap

## Monetización
- Google AdSense (banners 728x90 arriba y abajo del tool)
- Sin paywalls, sin registro requerido
