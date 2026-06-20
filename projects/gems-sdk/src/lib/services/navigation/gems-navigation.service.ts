import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { GemsSessionService } from '../session/gems-session.service';

/**
 * Serviço de navegação com histórico de rotas e passagem de dados entre telas.
 * Armazena o histórico na session e permite voltar para a tela anterior sem
 * depender do histórico do browser.
 */
@Injectable({
  providedIn: 'root',
})
export class GemsNavigationService {
  // ── Estado interno ────────────────────────────────────────────────
  private readonly HISTORY_KEY = 'gems_route_history';
  private readonly NEXT_ROUTE_DATA_KEY = 'gems_next_route_data';

  // ── Construtor ────────────────────────────────────────────────────
  constructor(
    private readonly router: Router,
    private readonly sessionService: GemsSessionService,
  ) {
    this.initHistoryTracker();
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  getHistory(): string[] {
    return this.sessionService.getItem<string[]>(this.HISTORY_KEY) ?? [];
  }

  getPreviousRoute(): string | null {
    const history = this.getHistory();
    return history.length > 1 ? history[history.length - 2] : null;
  }

  clearHistory(): void {
    this.sessionService.removeItem(this.HISTORY_KEY);
  }

  setNextRouteData(data: unknown): void {
    this.sessionService.setItem(this.NEXT_ROUTE_DATA_KEY, data);
  }

  consumeRouteData<T>(): T | null {
    const data = this.sessionService.getItem<T>(this.NEXT_ROUTE_DATA_KEY);
    this.sessionService.removeItem(this.NEXT_ROUTE_DATA_KEY);
    return data;
  }

  navigateWithData(commands: unknown[], data: unknown): Promise<boolean> {
    this.setNextRouteData(data);
    return this.router.navigate(commands as string[]);
  }

  navigate(commands: unknown[]): Promise<boolean> {
    return this.router.navigate(commands as string[]);
  }

  back(): void {
    const previousRoute = this.getPreviousRoute();
    if (previousRoute) {
      const history = this.getHistory();
      history.pop();
      history.pop();
      this.sessionService.setItem(this.HISTORY_KEY, history);
      this.router.navigateByUrl(previousRoute);
    } else {
      this.router.navigate(['/']);
    }
  }

  // ── Métodos privados ──────────────────────────────────────────────
  private initHistoryTracker(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const history = this.getHistory();
        const url = (event as NavigationEnd).urlAfterRedirects;
        if (history.length === 0 || history[history.length - 1] !== url) {
          history.push(url);
          this.sessionService.setItem(this.HISTORY_KEY, history);
        }
      });
  }
}
