import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  gemsLoadingInterceptor,
  provideGemsHttp,
  provideGemsTheme,
} from '@gabriel-mdias/angular-gems-sdk';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),

    // ── GEMS SDK ──────────────────────────────────────────────────────
    // Tema dinâmico (gera as paletas --gems-* no :root).
    provideGemsTheme({
      primary: '#111827',
      secondary: '#e17827',
      tertiary: '#3b82f6',
      background: '#f8f9fa',
    }),
    // HTTP com o interceptor de loading global do SDK.
    provideHttpClient(withInterceptors([gemsLoadingInterceptor])),
    // URL base para os GemsBaseStore (usada nos exemplos de HTTP/BaseStore).
    provideGemsHttp('https://api.exemplo.com'),
  ],
};
