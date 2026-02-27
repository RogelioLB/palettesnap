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
    expect(css).toContain('}');
  });
});
