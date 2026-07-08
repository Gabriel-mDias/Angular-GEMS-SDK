/** Modo de verificação de papéis: 'any' = possui qualquer um; 'all' = possui todos. */
export type GemsRoleMode = 'any' | 'all';

/**
 * Verifica se o conjunto de papéis do usuário satisfaz os papéis exigidos.
 *
 * @param userRoles - papéis que o usuário possui
 * @param requiredRoles - papéis exigidos pela rota/elemento
 * @param mode - 'any' (padrão) exige ao menos um; 'all' exige todos
 */
export function gemsHasRequiredRoles(
  userRoles: readonly string[],
  requiredRoles: readonly string[],
  mode: GemsRoleMode = 'any',
): boolean {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  return mode === 'all'
    ? requiredRoles.every(role => userRoles.includes(role))
    : requiredRoles.some(role => userRoles.includes(role));
}
