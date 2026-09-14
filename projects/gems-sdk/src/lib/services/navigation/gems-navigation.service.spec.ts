import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

import { GemsNavigationService } from './gems-navigation.service';

describe('GemsNavigationService (K-03)', () => {
  let service: GemsNavigationService;
  let events: Subject<NavigationEnd>;
  let router: { events: Subject<NavigationEnd>; navigate: () => void; navigateByUrl: () => void };

  const navegar = (url: string) => events.next(new NavigationEnd(1, url, url));

  beforeEach(() => {
    sessionStorage.clear();
    events = new Subject<NavigationEnd>();
    router = { events, navigate: vi.fn(), navigateByUrl: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] });
    service = TestBed.inject(GemsNavigationService);
  });

  it('limita o histórico a MAX_HISTORY entradas, mantendo as mais recentes', () => {
    for (let i = 1; i <= 60; i++) navegar(`/rota/${i}`);

    const history = service.getHistory();
    expect(history.length).toBe(GemsNavigationService.MAX_HISTORY);
    expect(history[0]).toBe('/rota/11');
    expect(history[history.length - 1]).toBe('/rota/60');
  });

  it('volta à rota anterior depois do corte', () => {
    for (let i = 1; i <= 60; i++) navegar(`/rota/${i}`);

    service.back();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/rota/59');
    expect(service.getHistory().length).toBe(GemsNavigationService.MAX_HISTORY - 2);
  });
});
