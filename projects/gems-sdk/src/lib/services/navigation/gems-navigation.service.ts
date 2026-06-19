import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GemsSessionService } from '../session/gems-session.service';

@Injectable({
  providedIn: 'root'
})
export class GemsNavigationService {
  private readonly HISTORY_KEY = 'gems_route_history';
  private readonly NEXT_ROUTE_DATA_KEY = 'gems_next_route_data';

  constructor(
    private readonly router: Router,
    private readonly sessionService: GemsSessionService
  ) {
    this.initHistoryTracker();
  }

  private initHistoryTracker(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const history = this.getHistory();
      if (history.length === 0 || history[history.length - 1] !== event.urlAfterRedirects) {
        history.push(event.urlAfterRedirects);
        this.sessionService.setItem(this.HISTORY_KEY, history);
      }
    });
  }

  getHistory(): string[] {
    return this.sessionService.getItem<string[]>(this.HISTORY_KEY) || [];
  }

  getPreviousRoute(): string | null {
    const history = this.getHistory();
    if (history.length > 1) {
      return history[history.length - 2];
    }
    return null;
  }

  clearHistory(): void {
    this.sessionService.removeItem(this.HISTORY_KEY);
  }

  setNextRouteData(data: any): void {
    this.sessionService.setItem(this.NEXT_ROUTE_DATA_KEY, data);
  }

  consumeRouteData<T>(): T | null {
    const data = this.sessionService.getItem<T>(this.NEXT_ROUTE_DATA_KEY);
    this.sessionService.removeItem(this.NEXT_ROUTE_DATA_KEY);
    return data;
  }

  navigateWithData(commands: any[], data: any): Promise<boolean> {
    this.setNextRouteData(data);
    return this.router.navigate(commands);
  }

  navigate(commands: any[]): Promise<boolean> {
    return this.router.navigate(commands);
  }

  back(): void {
    const previousRoute = this.getPreviousRoute();
    if (previousRoute) {
      const history = this.getHistory();
      if (history.length > 1) {
        history.pop();
        history.pop();
        this.sessionService.setItem(this.HISTORY_KEY, history);
      }
      this.router.navigateByUrl(previousRoute);
    } else {
      this.router.navigate(['/']);
    }
  }
}
