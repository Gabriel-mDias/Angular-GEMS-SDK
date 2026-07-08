import { Injectable, signal } from '@angular/core';

import { gemsUniqueId } from '../core/utils/gems-unique-id.util';
import { GemsToast, GemsToastType } from '../components/toast/gems-toast.model';

/**
 * Serviço de notificações leves (toast).
 * Coexiste com GemsAlertService (SweetAlert2) — use para feedbacks inline rápidos.
 *
 * Uso:
 * ```typescript
 * this.toastService.success('Salvo com sucesso!');
 * this.toastService.error('Erro ao processar.', { duration: 6000 });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class GemsToastService {
  // ── Estado interno ────────────────────────────────────────────────
  readonly toasts = signal<GemsToast[]>([]);

  // ── Métodos públicos ──────────────────────────────────────────────
  success(message: string, opts?: { duration?: number }): void {
    this.add('success', message, opts?.duration);
  }

  error(message: string, opts?: { duration?: number }): void {
    this.add('error', message, opts?.duration ?? 6000);
  }

  info(message: string, opts?: { duration?: number }): void {
    this.add('info', message, opts?.duration);
  }

  warning(message: string, opts?: { duration?: number }): void {
    this.add('warning', message, opts?.duration);
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  // ── Métodos privados ──────────────────────────────────────────────
  private add(type: GemsToastType, message: string, duration = 4000): void {
    const id = gemsUniqueId('toast');
    const toast: GemsToast = { id, type, message, duration };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.dismiss(id), duration);
  }
}
