import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { GEMS_API_URL } from './gems-api-url.token';

/**
 * Provê a URL base da API para os `GemsBaseStore` da SDK.
 *
 * Deve ser chamado no `app.config.ts` do projeto consumidor:
 *
 * ```typescript
 * import { provideGemsHttp } from '@gabriel-mdias/angular-gems-sdk';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideGemsHttp('https://api.seuprojeto.com'),
 *   ],
 * };
 * ```
 */
export function provideGemsHttp(baseUrl: string): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: GEMS_API_URL, useValue: baseUrl }]);
}
