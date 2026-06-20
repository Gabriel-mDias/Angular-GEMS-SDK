import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const gemsRoleGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const keycloak = inject(KeycloakService, { optional: true });

  if (!keycloak) {
    console.warn('GemsRoleGuard: KeycloakService não está configurado.');
    return true; // Permitimos por padrão se não há Keycloak
  }

  const isLoggedIn = await keycloak.isLoggedIn();
  if (!isLoggedIn) {
    await keycloak.login({
      redirectUri: window.location.origin + state.url,
    });
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRoles = keycloak.getUserRoles();
  const tokenParsed = keycloak.getKeycloakInstance().tokenParsed;

  const hasRole = requiredRoles.every(role => {
    const hasAsRole = userRoles.includes(role);
    const hasAsClaim = tokenParsed && (tokenParsed[role] === true || tokenParsed[role] === 'true' || tokenParsed[role] === role);
    return hasAsRole || hasAsClaim;
  });

  if (hasRole) {
    return true;
  }

  return false;
};
