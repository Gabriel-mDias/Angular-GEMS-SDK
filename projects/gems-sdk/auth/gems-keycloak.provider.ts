import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { KeycloakBearerInterceptor, KeycloakOptions, KeycloakService } from 'keycloak-angular';

/**
 * Provê e inicializa o Keycloak para a aplicação consumidora.
 *
 * Registra o `KeycloakService`, roda `init(options)` no bootstrap e (por padrão)
 * habilita o `KeycloakBearerInterceptor`, que anexa `Authorization: Bearer` às
 * requisições HTTP e faz o refresh do token.
 *
 * Uso (`app.config.ts`):
 * ```typescript
 * import { provideGemsKeycloak } from '@gabriel-mdias/angular-gems-sdk/auth';
 *
 * provideGemsKeycloak({
 *   config: { url: 'https://auth.seuapp.com', realm: 'seu-realm', clientId: 'seu-client' },
 *   initOptions: {
 *     onLoad: 'check-sso',
 *     silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
 *   },
 * });
 * ```
 *
 * Requer `provideHttpClient(withInterceptorsFromDi())` para que o bearer
 * interceptor (baseado em DI) seja aplicado.
 */
export function provideGemsKeycloak(options: KeycloakOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    KeycloakService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
    provideAppInitializer(async () => {
      const keycloak = inject(KeycloakService);
      try {
        await keycloak.init(options);
      } catch (error) {
        console.error('[GEMS] Falha ao inicializar o Keycloak:', error);
      }
    }),
  ]);
}
