/**
 * Utilitário para geração automática de paletas de cores via manipulação HSL.
 *
 * Recebe uma cor HEX e gera variações de 50 (mais claro) a 900 (mais escuro),
 * além de estados semânticos (hover, disabled, focus-ring).
 */

/** Converte HEX (#rrggbb ou #rgb) para componentes RGB [0-255]. */
export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Converte RGB [0-255] para HSL [h: 0-360, s: 0-100, l: 0-100]. */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return [0, 0, Math.round(l * 100)];
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/** Converte HSL para string CSS. */
export function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/** Converte HEX para HSL. */
export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/**
 * Mapeamento de lightness para cada nível da paleta.
 * Inspirado no Material Design: 50 é o mais claro, 900 o mais escuro.
 */
const PALETTE_LIGHTNESS_MAP: Record<number, number> = {
  50: 95,
  100: 88,
  200: 75,
  300: 62,
  400: 48,
  500: 35, // Cor base (ajustada pelo input)
  600: 28,
  700: 21,
  800: 14,
  900: 7,
};

/**
 * Gera um mapa de variações CSS para uma determinada cor.
 *
 * @param prefix - Nome da variável CSS (ex: 'gems-primary')
 * @param hex - Cor HEX de entrada (ex: '#111827')
 * @returns Mapa de variáveis CSS { '--gems-primary-50': 'hsl(...)', ... }
 */
export function generatePalette(prefix: string, hex: string): Record<string, string> {
  const [h, s] = hexToHsl(hex);
  const vars: Record<string, string> = {};

  // Gera variações 50-900
  for (const [level, lightness] of Object.entries(PALETTE_LIGHTNESS_MAP)) {
    vars[`--${prefix}-${level}`] = hslToString(h, s, lightness);
  }

  // Cor base original (sem modificação de lightness)
  vars[`--${prefix}`] = hex;

  // Estados semânticos
  const [, , baseLightness] = hexToHsl(hex);
  vars[`--${prefix}-hover`] = hslToString(h, s, Math.min(baseLightness + 8, 95));
  vars[`--${prefix}-active`] = hslToString(h, s, Math.max(baseLightness - 5, 5));
  vars[`--${prefix}-disabled`] = hslToString(h, Math.max(s - 20, 0), Math.min(baseLightness + 20, 90));
  vars[`--${prefix}-focus-ring`] = `hsla(${h}, ${s}%, ${baseLightness}%, 0.3)`;

  // Variações de texto (para contraste sobre a cor)
  vars[`--${prefix}-contrast`] = baseLightness > 55 ? '#111827' : '#ffffff';

  return vars;
}

/**
 * Gera variáveis CSS de cor de fundo com variações sutis.
 */
export function generateBackgroundPalette(hex: string): Record<string, string> {
  const [h, s] = hexToHsl(hex);
  return {
    '--gems-bg': hex,
    '--gems-bg-subtle': hslToString(h, s, 97),
    '--gems-bg-muted': hslToString(h, s, 93),
    '--gems-bg-emphasis': hslToString(h, s, 88),
    '--gems-bg-inverse': hslToString(h, s, 10),
  };
}
