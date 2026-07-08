import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GemsLoadingService {
  private activeRequests = 0;
  /**
   * "Geração" atual do contador. É incrementada por `forceHide()` para que
   * chamadas de `hide()` de requisições antigas não interfiram no estado de
   * requisições iniciadas depois do reset.
   */
  private generation = 0;
  private readonly isLoadingSignal = signal<boolean>(false);

  /**
   * Signal reactivo contendo o estado atual do loading global (Full-page).
   */
  readonly isLoading = this.isLoadingSignal.asReadonly();

  /**
   * Registra o início de um processo de carregamento (ex: requisição HTTP).
   * Retorna a geração corrente, que deve ser repassada ao `hide()`.
   */
  show(): number {
    this.activeRequests++;
    this.setLoading(true);
    return this.generation;
  }

  /**
   * Registra o fim de um processo de carregamento. Ignora chamadas cuja
   * geração já expirou (após um `forceHide()`).
   */
  hide(generation?: number): void {
    if (generation !== undefined && generation !== this.generation) {
      return;
    }
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.setLoading(false);
    }
  }

  /**
   * Força a ocultação do loading, zerando o contador e invalidando as
   * requisições em voo da geração anterior.
   */
  forceHide(): void {
    this.generation++;
    this.activeRequests = 0;
    this.setLoading(false);
  }

  private setLoading(value: boolean): void {
    if (this.isLoadingSignal() !== value) {
      this.isLoadingSignal.set(value);
    }
  }
}
