/*
 * Public API Surface of @gems/angular-sdk (raiz)
 *
 * Re-exporta TUDO para conveniência. Consumidores que preferem
 * tree-shaking mais granular devem usar os secondary entry points:
 *   @gems/angular-sdk/components
 *   @gems/angular-sdk/services
 *   @gems/angular-sdk/http
 *   @gems/angular-sdk/auth
 */

// Core — Theming
export { GemsThemeConfig, GEMS_DEFAULT_THEME } from './lib/core/theme/gems-theme.config';
export { GemsThemeService, GEMS_THEME_CONFIG } from './lib/core/theme/gems-theme.service';
export { provideGemsTheme } from './lib/core/theme/gems-theme.provider';
export {
  hexToRgb,
  rgbToHsl,
  hexToHsl,
  hslToString,
  generatePalette,
  generateBackgroundPalette,
} from './lib/core/theme/gems-palette.util';

// Re-export Components
export * from './components/public-api';

// Re-export Services
export * from './services/public-api';

// Re-export HTTP
export * from './http/public-api';

// Re-export Auth
export * from './auth/public-api';
