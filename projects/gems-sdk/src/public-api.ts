/*
 * Public API Surface of @gabriel-mdias/angular-gems-sdk (raiz)
 *
 * Re-exporta componentes, serviços, HTTP e theming. A autenticação (Keycloak)
 * fica no secondary entry point `@gabriel-mdias/angular-gems-sdk/auth`, para que
 * o `keycloak-angular` só seja carregado por quem realmente usa auth.
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
  generateTextPalette,
} from './lib/core/theme/gems-palette.util';

// Core — Utils
export { gemsUniqueId } from './lib/core/utils/gems-unique-id.util';

// Re-export Components
export * from './components/public-api';

// Re-export Services
export * from './services/public-api';

// Re-export HTTP
export * from './http/public-api';
