import { Component } from '@angular/core';

import { GemsToastService } from '../../services/gems-toast.service';
import { GemsToastType } from './gems-toast.model';

/** Ícones por tipo de toast. */
const TOAST_ICONS: Record<GemsToastType, string> = {
  success: 'fa-solid fa-circle-check',
  error: 'fa-solid fa-circle-xmark',
  info: 'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
};

/**
 * Container que renderiza a fila de notificações do GemsToastService.
 * Deve ser adicionado UMA vez no componente raiz da aplicação.
 *
 * ```html
 * <!-- app.component.html -->
 * <gems-toast-container></gems-toast-container>
 * <router-outlet></router-outlet>
 * ```
 */
@Component({
  selector: 'gems-toast-container',
  standalone: true,
  imports: [],
  templateUrl: './gems-toast-container.component.html',
  styleUrls: ['./gems-toast-container.component.css'],
})
export class GemsToastContainerComponent {
  // ── Construtor ────────────────────────────────────────────────────
  constructor(protected readonly toastService: GemsToastService) {}

  // ── Métodos públicos ──────────────────────────────────────────────
  toastIcon(type: GemsToastType): string {
    return TOAST_ICONS[type];
  }
}
