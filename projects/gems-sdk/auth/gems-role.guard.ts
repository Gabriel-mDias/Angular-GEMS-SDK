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
 * Fail-**closed**: sem `KeycloakService` disponível, o guard **nega**. A mesma condição cobria
 * "aplicação sem autenticação" e "aplicação com autenticação cuja injeção falhou", e liberar
 * atendia à primeira à custa da segunda. Aplicação sem autenticação não põe o guard na rota —
 * não há opção de compatibilidade, e isso é deliberado.
 */
export const gemsRoleGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean | UrlTree> => {
  const keycloak = inject(KeycloakService, { optional: true });
  const document = inject(DOCUMENT);

  if (!keycloak) {
    return false; // Sem Keycloak disponível não há como decidir: nega.
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
