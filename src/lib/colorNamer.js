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
