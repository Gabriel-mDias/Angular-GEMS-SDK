import {
  generateBackgroundPalette,
  generatePalette,
  generateTextPalette,
  hexToHsl,
  hexToRgb,
  hslToString,
  rgbToHsl,
} from './gems-palette.util';

function cssHslToRgb(color: string): [number, number, number] {
  const [, hueText, saturationText, lightnessText] = color.match(/hsl\((\d+), (\d+)%, (\d+)%\)/)!;
  const hue = Number(hueText) / 360;
  const saturation = Number(saturationText) / 100;
  const lightness = Number(lightnessText) / 100;
  const channel = (offset: number): number => {
    const k = (offset + hue * 12) % 12;
    const a = saturation * Math.min(lightness, 1 - lightness);
    return Math.round(255 * (lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return [channel(0), channel(8), channel(4)];
}

function contrastRatio(first: [number, number, number], second: [number, number, number]): number {
  const luminance = ([r, g, b]: [number, number, number]): number => {
    const linear = [r, g, b].map(channel => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe('gems-palette.util', () => {
  // ── hexToRgb ─────────────────────────────────────────────────────
  describe('hexToRgb', () => {
    it('deve converter hex longo para RGB', () => {
      expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
      expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
      expect(hexToRgb('#3b82f6')).toEqual([59, 130, 246]);
    });

    it('deve converter hex curto (#rgb) para RGB', () => {
      expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
      expect(hexToRgb('#000')).toEqual([0, 0, 0]);
    });
  });

  // ── rgbToHsl ─────────────────────────────────────────────────────
  describe('rgbToHsl', () => {
    it('deve converter branco para H=0, S=0, L=100', () => {
      expect(rgbToHsl(255, 255, 255)).toEqual([0, 0, 100]);
    });

    it('deve converter preto para H=0, S=0, L=0', () => {
      expect(rgbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
    });

    it('deve converter vermelho puro', () => {
      const [h, s, l] = rgbToHsl(255, 0, 0);
      expect(h).toBe(0);
      expect(s).toBe(100);
      expect(l).toBe(50);
    });
  });

  // ── hslToString ──────────────────────────────────────────────────
  describe('hslToString', () => {
    it('deve gerar string CSS válida', () => {
      expect(hslToString(220, 90, 50)).toBe('hsl(220, 90%, 50%)');
      expect(hslToString(0, 0, 100)).toBe('hsl(0, 0%, 100%)');
    });
  });

  // ── hexToHsl ─────────────────────────────────────────────────────
  describe('hexToHsl', () => {
    it('deve converter branco', () => {
      expect(hexToHsl('#ffffff')).toEqual([0, 0, 100]);
    });

    it('deve converter preto', () => {
      expect(hexToHsl('#000000')).toEqual([0, 0, 0]);
    });
  });

  // ── generatePalette ──────────────────────────────────────────────
  describe('generatePalette', () => {
    let palette: Record<string, string>;

    beforeEach(() => {
      palette = generatePalette('gems-primary', '#3b82f6');
    });

    it('deve gerar variações 50-900', () => {
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(level => {
        expect(palette[`--gems-primary-${level}`]).toBeDefined();
        expect(palette[`--gems-primary-${level}`]).toMatch(/^hsl\(/);
      });
    });

    it('deve incluir a cor base original', () => {
      expect(palette['--gems-primary']).toBe('#3b82f6');
    });

    it('deve incluir estados semânticos', () => {
      expect(palette['--gems-primary-hover']).toBeDefined();
      expect(palette['--gems-primary-active']).toBeDefined();
      expect(palette['--gems-primary-disabled']).toBeDefined();
      expect(palette['--gems-primary-focus-ring']).toBeDefined();
      expect(palette['--gems-primary-contrast']).toBeDefined();
    });

    it('deve definir contrast como branco para cores escuras', () => {
      const darkPalette = generatePalette('gems-dark', '#111827');
      expect(darkPalette['--gems-dark-contrast']).toBe('#ffffff');
    });

    it('deve definir contrast como escuro para cores claras', () => {
      const lightPalette = generatePalette('gems-light', '#fef9c3');
      expect(lightPalette['--gems-light-contrast']).toBe('#111827');
    });
  });

  // ── generateBackgroundPalette ────────────────────────────────────
  describe('generateBackgroundPalette', () => {
    it('deve gerar variações de fundo', () => {
      const bg = generateBackgroundPalette('#f8f9fa');
      expect(bg['--gems-bg']).toBe('#f8f9fa');
      expect(bg['--gems-bg-subtle']).toMatch(/^hsl\(/);
      expect(bg['--gems-bg-muted']).toMatch(/^hsl\(/);
      expect(bg['--gems-bg-emphasis']).toMatch(/^hsl\(/);
      expect(bg['--gems-bg-inverse']).toMatch(/^hsl\(/);
    });

    it('mantém contraste de texto contra o fundo sutil em temas claros e escuros', () => {
      for (const background of ['#ffffff', '#101820', '#1452d7']) {
        const palette = generateBackgroundPalette(background);
        const textPalette = generateTextPalette(background);
        const subtleBackground = cssHslToRgb(palette['--gems-bg-subtle']);
        const inverseText = cssHslToRgb(palette['--gems-bg-inverse']);
        const generatedMainText = hexToRgb(textPalette['--gems-text-main']);

        expect(contrastRatio(inverseText, subtleBackground)).toBeGreaterThanOrEqual(4.5);
        if (background === '#101820') {
          expect(contrastRatio(generatedMainText, subtleBackground)).toBeLessThan(4.5);
        }
      }
    });
  });
});
