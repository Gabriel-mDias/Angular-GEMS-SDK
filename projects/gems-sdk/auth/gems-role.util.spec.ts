import { gemsHasRequiredRoles } from './gems-role.util';

describe('gemsHasRequiredRoles (C2)', () => {
  it('nega quando a lista de papéis exigidos está vazia', () => {
    expect(gemsHasRequiredRoles(['ADMIN'], [])).toBe(false);
  });

  it('nega quando a lista de papéis exigidos não foi informada', () => {
    expect(gemsHasRequiredRoles(['ADMIN'], undefined as unknown as readonly string[])).toBe(false);
  });

  it('libera no modo any quando o usuário possui ao menos um dos papéis', () => {
    expect(gemsHasRequiredRoles(['EDITOR'], ['ADMIN', 'EDITOR'])).toBe(true);
  });

  it('nega no modo any quando o usuário não possui nenhum dos papéis', () => {
    expect(gemsHasRequiredRoles(['LEITOR'], ['ADMIN', 'EDITOR'])).toBe(false);
  });

  it('libera no modo all somente quando o usuário possui todos os papéis', () => {
    expect(gemsHasRequiredRoles(['ADMIN', 'EDITOR'], ['ADMIN', 'EDITOR'], 'all')).toBe(true);
    expect(gemsHasRequiredRoles(['ADMIN'], ['ADMIN', 'EDITOR'], 'all')).toBe(false);
  });

  it('nega a lista vazia também no modo all — o fail-closed não depende do modo', () => {
    expect(gemsHasRequiredRoles(['ADMIN'], [], 'all')).toBe(false);
  });
});
