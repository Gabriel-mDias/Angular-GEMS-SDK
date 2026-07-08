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

/** Limita um número ao intervalo [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Offsets de lightness (em pontos percentuais) de cada nível em relação ao
 * nível 500. O 500 é ancorado na lightness real da cor de entrada, de modo que
 * `--{prefix}-500` corresponda à cor de marca informada pelo consumidor.
 * Inspirado no Material Design: 50 é o mais claro, 900 o mais escuro.
 */
const PALETTE_OFFSET_MAP: Record<number, number> = {
  50: 60,
  100: 53,
  200: 40,
  300: 27,
  400: 13,
  500: 0, // Cor base (ancorada no input)
  600: -7,
  700: -14,
  800: -21,
  900: -28,
};

/**
 * Gera um mapa de variações CSS para uma determinada cor.
 *
 * @param prefix - Nome da variável CSS (ex: 'gems-primary')
 * @param hex - Cor HEX de entrada (ex: '#111827')
 * @returns Mapa de variáveis CSS { '--gems-primary-50': 'hsl(...)', ... }
 */
export function generatePalette(prefix: string, hex: string): Record<string, string> {
  const [h, s, baseLightness] = hexToHsl(hex);
  const vars: Record<string, string> = {};

  // Ancoramos o nível 500 na lightness real da cor de entrada (com clamp para
  // manter uma escala utilizável), preservando hue e saturation. Assim
  // `--{prefix}-500` fica visualmente próximo do hex de marca informado.
  const anchor = clamp(baseLightness, 25, 55);

  // Gera variações 50-900 a partir do offset relativo ao 500
  for (const [level, offset] of Object.entries(PALETTE_OFFSET_MAP)) {
    vars[`--${prefix}-${level}`] = hslToString(h, s, clamp(anchor + offset, 4, 97));
  }

  // Cor base original (sem modificação de lightness)
  vars[`--${prefix}`] = hex;

  // Estados semânticos
  vars[`--${prefix}-hover`] = hslToString(h, s, clamp(baseLightness + 8, 5, 95));
  vars[`--${prefix}-active`] = hslToString(h, s, clamp(baseLightness - 5, 5, 95));
  vars[`--${prefix}-disabled`] = hslToString(
    h,
    Math.max(s - 20, 0),
    clamp(baseLightness + 20, 5, 90),
  );
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

/**
 * Gera as cores de texto (`--gems-text-main` / `--gems-text-muted`) com
 * contraste adequado em relação ao fundo. Consumidas pela maioria dos
 * componentes; derivadas da lightness do `background` para funcionar tanto em
 * temas claros quanto escuros.
 */
export function generateTextPalette(backgroundHex: string): Record<string, string> {
  const [, , lightness] = hexToHsl(backgroundHex);
  const isLightBackground = lightness > 50;
  return {
    '--gems-text-main': isLightBackground ? '#1e293b' : '#f1f5f9',
    '--gems-text-muted': isLightBackground ? '#64748b' : '#94a3b8',
  };
}
