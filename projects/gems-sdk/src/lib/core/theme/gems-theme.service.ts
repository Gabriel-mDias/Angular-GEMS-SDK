import { Injectable, Inject, DOCUMENT, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InjectionToken } from '@angular/core';
import { GemsThemeConfig, GEMS_DEFAULT_THEME } from './gems-theme.config';
import {
  generatePalette,
  generateBackgroundPalette,
  generateTextPalette,
} from './gems-palette.util';

/**
 * Token de injeção para a configuração do tema.
 * Provido via `provideGemsTheme()`.
 */
export const GEMS_THEME_CONFIG = new InjectionToken<GemsThemeConfig>('GEMS_THEME_CONFIG', {
  providedIn: 'root',
  factory: () => GEMS_DEFAULT_THEME,
});

/**
 * Serviço responsável por aplicar o tema GEMS no DOM.
 *
 * Lê a configuração injetada via `GEMS_THEME_CONFIG` e aplica as
 * variáveis CSS no `:root` do documento. Também permite trocar o tema
 * em tempo de execução.
 */
@Injectable({
  providedIn: 'root',
})
export class GemsThemeService {
  private currentTheme: GemsThemeConfig;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(GEMS_THEME_CONFIG) private readonly config: GemsThemeConfig,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    this.currentTheme = this.config;
  }

  /**
   * Aplica o tema no DOM. Chamado automaticamente via APP_INITIALIZER
   * quando o consumidor usa `provideGemsTheme()`.
   */
  applyTheme(theme?: GemsThemeConfig): void {
    if (theme) {
      this.currentTheme = theme;
    }

    const root = this.document.documentElement;
    if (!root) return;

    const t = this.currentTheme;

    // Gera e aplica paletas para cada cor
    const palettes: Record<string, string> = {
      ...generatePalette('gems-primary', t.primary),
      ...generatePalette('gems-secondary', t.secondary),
      ...generatePalette('gems-tertiary', t.tertiary),
      ...generatePalette('gems-danger', t.danger ?? '#dc2626'),
      ...generatePalette('gems-success', t.success ?? '#16a34a'),
      ...generatePalette('gems-warning', t.warning ?? '#f59e0b'),
      ...generatePalette('gems-info', t.info ?? '#3b82f6'),
      ...generateBackgroundPalette(t.background),
      ...generateTextPalette(t.background),
    };

    // Aplica cada variável no :root
    for (const [prop, value] of Object.entries(palettes)) {
      root.style.setProperty(prop, value);
    }
  }

  /** Retorna a configuração do tema ativo. */
  getTheme(): GemsThemeConfig {
    return { ...this.currentTheme };
  }

  /** Retorna o valor de uma CSS variable do tema (vazio em SSR). */
  getCssVariable(name: string): string {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }
    return getComputedStyle(this.document.documentElement).getPropertyValue(name).trim();
  }
}
