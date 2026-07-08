import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { GemsThemeConfig } from './gems-theme.config';
import { GEMS_THEME_CONFIG, GemsThemeService } from './gems-theme.service';

/**
 * Provê a configuração do tema GEMS para a aplicação.
 *
 * Deve ser chamado no `app.config.ts` do projeto consumidor:
 *
 * ```typescript
 * import { provideGemsTheme } from '@gems/angular-sdk';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideGemsTheme({
 *       primary: '#111827',
 *       secondary: '#e17827',
 *       tertiary: '#3b82f6',
 *       background: '#f8f9fa',
 *     }),
 *   ],
 * };
 * ```
 *
 * As cores fornecidas são usadas para gerar paletas automáticas (50-900)
 * via manipulação HSL, aplicadas como CSS custom properties no `:root`.
 */
export function provideGemsTheme(config: GemsThemeConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: GEMS_THEME_CONFIG, useValue: config },
    provideAppInitializer(() => inject(GemsThemeService).applyTheme()),
  ]);
}
