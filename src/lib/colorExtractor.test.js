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
