import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GemsLoadingService {
  private activeRequests = 0;
  private readonly isLoadingSignal = signal<boolean>(false);

  /**
   * Signal reactivo contendo o estado atual do loading global (Full-page)
   */
  readonly isLoading = this.isLoadingSignal.asReadonly();

  /**
   * Registra o início de um processo de carregamento (ex: requisição HTTP).
   * Mostra o loading se ainda não estiver visível.
   */
  show(): void {
    this.activeRequests++;
    if (!this.isLoadingSignal()) {
      this.isLoadingSignal.set(true);
    }
  }

  /**
   * Registra o fim de um processo de carregamento.
   * Esconde o loading quando todos os processos ativos terminarem.
   */
  hide(): void {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Força a ocultação do loading, zerando o contador.
   */
  forceHide(): void {
    this.activeRequests = 0;
    this.isLoadingSignal.set(false);
  }
}
