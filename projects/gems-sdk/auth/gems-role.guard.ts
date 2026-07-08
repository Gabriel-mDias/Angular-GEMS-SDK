import { DOCUMENT, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { GemsRoleMode, gemsHasRequiredRoles } from './gems-role.util';

/**
 * Guard de rota baseado em papéis do Keycloak.
 *
 * Configuração na rota:
 * ```typescript
 * {
 *   path: 'admin',
 *   canActivate: [gemsRoleGuard],
 *   data: { roles: ['ADMIN'], roleMode: 'any' } // 'any' (padrão) | 'all'
 * }
 * ```
 *
 * Quando o `KeycloakService` não está configurado, o guard libera o acesso
 * (fail-open) assumindo que a aplicação não usa autenticação.
 */
export const gemsRoleGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean | UrlTree> => {
  const keycloak = inject(KeycloakService, { optional: true });
  const document = inject(DOCUMENT);

  if (!keycloak) {
    return true; // Sem Keycloak configurado: aplicação sem auth.
  }

  if (!keycloak.isLoggedIn()) {
    const origin = document.defaultView?.location.origin ?? '';
    await keycloak.login({ redirectUri: origin + state.url });
    return false;
  }

  const requiredRoles = (route.data['roles'] as string[] | undefined) ?? [];
  const mode = (route.data['roleMode'] as GemsRoleMode | undefined) ?? 'any';

  return gemsHasRequiredRoles(keycloak.getUserRoles(), requiredRoles, mode);
};
