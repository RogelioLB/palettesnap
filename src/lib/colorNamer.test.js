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
