import { InjectionToken } from '@angular/core';

/**
 * Token com a URL base da API consumida pelos `GemsBaseStore`.
 *
 * Deve ser provido pelo consumidor via `provideGemsHttp(url)` (ou
 * `{ provide: GEMS_API_URL, useValue: '...' }`). Caso não seja provido, a
 * `factory` lança um erro descritivo em vez do genérico `NullInjectorError`.
 */
export const GEMS_API_URL = new InjectionToken<string>('GEMS_API_URL', {
  providedIn: 'root',
  factory: () => {
    throw new Error(
      'GEMS_API_URL não foi provido. Adicione `provideGemsHttp("https://sua-api.com")` ' +
        'aos providers do app (app.config.ts) antes de usar componentes/serviços que ' +
        'estendem GemsBaseStore.',
    );
  },
});
