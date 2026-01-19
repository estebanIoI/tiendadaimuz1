// Utilidades para manejo de colores y detección de luminancia

/**
 * Convierte un color en formato string (hex o rgb) a un array [R, G, B]
 */
export function parseColorToRgb(color: string): number[] {
  if (!color) return [255, 255, 255];
  color = color.trim();

  if (color.startsWith('rgb')) {
    const nums = color.replace(/rgba?\(|\)/g, '').split(',').map(s => parseInt(s.trim(), 10));
    return [nums[0] || 0, nums[1] || 0, nums[2] || 0];
  }

  // hex
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  return [255, 255, 255];
}

/**
 * Calcula la luminancia relativa de un color RGB (0-1)
 * Usa la fórmula WCAG 2.0
 */
export function getLuminanceFromRgb([r, g, b]: number[]): number {
  const srgb = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/**
 * Busca el color de fondo efectivo de un elemento recorriendo el árbol DOM
 */
export function findEffectiveBackground(el?: HTMLElement | null): string {
  let node: HTMLElement | null = el || null;
  while (node && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    const bg = style.backgroundColor;
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
    node = node.parentElement;
  }
  return window.getComputedStyle(document.body).backgroundColor || '#ffffff';
}

/**
 * Determina si un fondo es claro basado en su luminancia
 */
export function isLightBackground(element?: HTMLElement | null): boolean {
  const bg = findEffectiveBackground(element);
  const rgb = parseColorToRgb(bg);
  const lum = getLuminanceFromRgb(rgb);
  return lum > 0.5;
}
