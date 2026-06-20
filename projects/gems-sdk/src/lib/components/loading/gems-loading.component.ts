import { Component } from '@angular/core';

import { GemsLoadingService } from '../../services/gems-loading.service';

/**
 * Overlay de loading full-page, controlado pelo GemsLoadingService.
 * Adicione <gems-loading> na raiz do app; o interceptor gemsLoadingInterceptor
 * aciona show()/hide() automaticamente em cada requisição HTTP.
 */
@Component({
  selector: 'gems-loading',
  standalone: true,
  imports: [],
  templateUrl: './gems-loading.component.html',
  styleUrls: ['./gems-loading.component.css'],
})
export class GemsLoadingComponent {
  // ── Construtor ────────────────────────────────────────────────────
  constructor(private readonly loadingService: GemsLoadingService) {}

  // ── Estado derivado (exposto ao template) ─────────────────────────
  protected get isLoading() {
    return this.loadingService.isLoading;
  }
}
