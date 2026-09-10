/** Modo de verificação de papéis: 'any' = possui qualquer um; 'all' = possui todos. */
export type GemsRoleMode = 'any' | 'all';

/**
 * Verifica se o conjunto de papéis do usuário satisfaz os papéis exigidos.
 *
 * Fail-**closed**: lista de papéis exigidos ausente ou vazia **nega**. Até a 1.1.0 ela liberava,
 * e o caminho mais comum para chegar nela era um erro de digitação — `data: { role: [...] }`,
 * singular, liberava a rota para todo mundo sem erro, sem aviso e sem teste vermelho. Elemento
 * que deve ser visível para qualquer um simplesmente não usa esta função.
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
    return false;
  }
  return mode === 'all'
    ? requiredRoles.every(role => userRoles.includes(role))
    : requiredRoles.some(role => userRoles.includes(role));
}
