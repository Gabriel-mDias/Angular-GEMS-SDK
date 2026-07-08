/*
 * Public API — @gabriel-mdias/angular-gems-sdk/auth
 *
 * Recursos de autenticação e autorização com Keycloak (keycloak-angular).
 * Este é um secondary entry point: o `keycloak-angular` só é carregado quando
 * a aplicação importa deste caminho.
 */

export { gemsRoleGuard } from './gems-role.guard';
export { GemsHasRoleDirective } from './gems-has-role.directive';
export { provideGemsKeycloak } from './gems-keycloak.provider';
export { GemsRoleMode, gemsHasRequiredRoles } from './gems-role.util';
