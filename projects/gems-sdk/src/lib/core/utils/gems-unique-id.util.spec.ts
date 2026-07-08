import { gemsUniqueId } from './gems-unique-id.util';

describe('gemsUniqueId', () => {
  it('deve gerar um id com o prefixo informado', () => {
    expect(gemsUniqueId('campo')).toMatch(/^campo-/);
  });

  it('deve usar o prefixo padrão "gems"', () => {
    expect(gemsUniqueId()).toMatch(/^gems-/);
  });

  it('deve gerar ids únicos em chamadas consecutivas', () => {
    const ids = new Set(Array.from({ length: 100 }, () => gemsUniqueId('x')));
    expect(ids.size).toBe(100);
  });
});
