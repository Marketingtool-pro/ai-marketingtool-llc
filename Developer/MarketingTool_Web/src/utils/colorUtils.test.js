import { describe, it, expect } from 'vitest';
import { hexToRgbChannel, extendPaletteWithChannels } from './colorUtils';

describe('hexToRgbChannel', () => {
  it('converts 6-digit hex to RGB channels', () => {
    expect(hexToRgbChannel('#C8FAD6')).toBe('200 250 214');
  });

  it('converts 3-digit shorthand hex', () => {
    expect(hexToRgbChannel('#FFF')).toBe('255 255 255');
  });

  it('converts black', () => {
    expect(hexToRgbChannel('#000000')).toBe('0 0 0');
  });

  it('handles 8-digit hex (with alpha)', () => {
    expect(hexToRgbChannel('#FF00FFAA')).toBe('255 0 255');
  });

  it('throws on invalid length hex', () => {
    expect(() => hexToRgbChannel('#12')).toThrow('Invalid hex color');
  });
});

describe('extendPaletteWithChannels', () => {
  it('adds Channel variants for hex values', () => {
    const palette = { main: '#805AF5', light: '#B39AF8' };
    const result = extendPaletteWithChannels(palette);
    expect(result.mainChannel).toBe('128 90 245');
    expect(result.lightChannel).toBe('179 154 248');
  });

  it('handles nested objects', () => {
    const palette = { primary: { main: '#805AF5' } };
    const result = extendPaletteWithChannels(palette);
    expect(result.primary.mainChannel).toBe('128 90 245');
  });

  it('skips non-hex values', () => {
    const palette = { mode: 'dark', main: '#805AF5' };
    const result = extendPaletteWithChannels(palette);
    expect(result.modeChannel).toBeUndefined();
    expect(result.mainChannel).toBe('128 90 245');
  });
});
