# PaletteSnap

Extractor de paleta de colores dominantes de imágenes. Sube, arrastra o pega cualquier imagen y obtén al instante los colores dominantes en formato HEX, RGB, HSL y con nombre en español.

**[Ver demo →](https://github.com/RogelioLB/palettesnap)**

## Características

- **Drag & drop** — arrastra tu imagen directamente a la zona de carga
- **Ctrl+V** — pega capturas de pantalla sin guardar el archivo
- **K-Means clustering** — algoritmo de extracción de colores preciso
- **3 a 8 colores** — cantidad configurable con slider
- **HEX, RGB, HSL y nombre** — todos los formatos + nombre en español
- **Exportar CSS** — variables CSS listas para copiar en tu proyecto
- **Exportar PNG** — imagen de la paleta para documentación
- **100% privado** — todo el procesamiento ocurre en el navegador, ninguna imagen sale de tu equipo
- **Sin registro** — gratis y sin cuenta

## Stack

- [Astro 5](https://astro.build) — framework estático con SEO built-in
- [TailwindCSS 4](https://tailwindcss.com) — estilos
- Vanilla JS — sin frameworks frontend
- Canvas API — extracción de colores
- Vitest — tests unitarios

## Estructura del proyecto

```
src/
├── pages/
│   ├── index.astro                          # Herramienta principal
│   └── blog/
│       └── extractor-paleta-colores.astro   # Blog post SEO/AEO
├── components/
│   ├── ImageUploader.astro                  # Zona de carga
│   └── PaletteDisplay.astro                 # Grid de colores + exportación
├── layouts/
│   ├── MainLayout.astro                     # Layout con JSON-LD SoftwareApplication
│   └── BlogLayout.astro                     # Layout con JSON-LD Article + FAQ
└── lib/
    ├── colorExtractor.js                    # Canvas API + K-Means
    ├── colorNamer.js                        # Nombres en español (~60 colores)
    └── exporters.js                         # PNG y CSS variables
```

## Comandos

| Comando           | Acción                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Instala dependencias                        |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321`  |
| `npm run build`   | Build de producción en `./dist/`            |
| `npm run preview` | Preview del build de producción             |
| `npm test`        | Ejecuta los tests unitarios con Vitest      |

## Tests

```bash
npm test
```

13 tests unitarios cubriendo:
- `colorExtractor.js` — rgbToHex, rgbToHsl (7 tests)
- `colorNamer.js` — getColorName (4 tests)
- `exporters.js` — generateCssVariables (2 tests)

## Deploy

El proyecto genera un sitio estático en `dist/`. Compatible con cualquier hosting estático:

- [Netlify](https://netlify.com) — conecta el repo y despliega automáticamente
- [Vercel](https://vercel.com) — igual de simple
- [GitHub Pages](https://pages.github.com) — configura el output a `dist/`

## SEO / AEO

- `SoftwareApplication` JSON-LD en la página principal
- `Article` + `FAQPage` + `BreadcrumbList` JSON-LD en el blog
- Meta tags completos (Open Graph, Twitter Card, canonical)
- Blog post optimizado para motores de búsqueda y asistentes de IA

## Licencia

MIT
