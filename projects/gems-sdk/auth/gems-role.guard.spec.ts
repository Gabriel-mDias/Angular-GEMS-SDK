import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { vi } from 'vitest';

import { gemsRoleGuard } from './gems-role.guard';

const rota = (data: Record<string, unknown>): ActivatedRouteSnapshot =>
  ({ data }) as unknown as ActivatedRouteSnapshot;

const estado = (url: string): RouterStateSnapshot => ({ url }) as RouterStateSnapshot;

const keycloakFalso = (overrides: Partial<Record<string, unknown>> = {}): KeycloakService =>
  ({
    isLoggedIn: () => true,
    getUserRoles: () => ['ADMIN'],
    login: vi.fn(),
    ...overrides,
  }) as unknown as KeycloakService;

const executar = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot = estado('/admin'),
): Promise<boolean | unknown> =>
  TestBed.runInInjectionContext(() => gemsRoleGuard(route, state) as Promise<boolean | unknown>);

describe('gemsRoleGuard (C2)', () => {
  it('nega quando o KeycloakService não está disponível', async () => {
    TestBed.configureTestingModule({});

    await expect(executar(rota({ roles: ['ADMIN'] }))).resolves.toBe(false);
  });

  it('libera quando o usuário logado satisfaz os papéis exigidos', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: KeycloakService, useValue: keycloakFalso() }],
    });

    await expect(executar(rota({ roles: ['ADMIN'] }))).resolves.toBe(true);
  });

  it('nega quando o usuário logado não satisfaz os papéis exigidos', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: KeycloakService, useValue: keycloakFalso({ getUserRoles: () => ['LEITOR'] }) },
      ],
    });

    await expect(executar(rota({ roles: ['ADMIN'] }))).resolves.toBe(false);
  });

  it('nega a rota que escreveu `role` no lugar de `roles` — o caminho do erro de digitação', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: KeycloakService, useValue: keycloakFalso() }],
    });

    await expect(executar(rota({ role: ['ADMIN'] }))).resolves.toBe(false);
  });

  it('encaminha para o login e nega quando o usuário não está autenticado', async () => {
    const login = vi.fn().mockResolvedValue(undefined);
    TestBed.configureTestingModule({
      providers: [
        { provide: KeycloakService, useValue: keycloakFalso({ isLoggedIn: () => false, login }) },
      ],
    });

    await expect(executar(rota({ roles: ['ADMIN'] }), estado('/admin'))).resolves.toBe(false);
    expect(login).toHaveBeenCalledTimes(1);
    expect(login.mock.calls[0][0].redirectUri).toContain('/admin');
  });
});
