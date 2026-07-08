import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

/**
 * Serviço de alertas e confirmações baseado em SweetAlert2.
 * As cores dos botões seguem a paleta do tema GEMS (--gems-*-500).
 */
@Injectable({
  providedIn: 'root',
})
export class GemsAlertService {
  // ── Estado interno ────────────────────────────────────────────────
  private readonly primaryColor = 'var(--gems-primary-500, #3085d6)';
  private readonly dangerColor = 'var(--gems-danger-500, #dc2626)';
  private readonly warningColor = 'var(--gems-warning-500, #f59e0b)';
  private readonly infoColor = 'var(--gems-info-500, #3b82f6)';

  // ── Métodos públicos ──────────────────────────────────────────────
  success(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({ icon: 'success', title, text, confirmButtonColor: this.primaryColor });
  }

  error(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({ icon: 'error', title, text, confirmButtonColor: this.dangerColor });
  }

  errorFromApi(
    apiError: { error?: { errorType?: string; message?: string } },
    opts?: { title?: string; fallback?: string },
  ): Promise<SweetAlertResult> {
    const title = apiError?.error?.errorType ?? opts?.title ?? 'Erro';
    const text = apiError?.error?.message ?? opts?.fallback ?? 'Ocorreu um erro inesperado.';
    return Swal.fire({ icon: 'error', title, text, confirmButtonColor: this.dangerColor });
  }

  warning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({ icon: 'warning', title, text, confirmButtonColor: this.warningColor });
  }

  info(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({ icon: 'info', title, text, confirmButtonColor: this.infoColor });
  }

  confirm(
    title: string,
    text: string,
    confirmButtonText = 'Sim',
    cancelButtonText = 'Não',
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: this.primaryColor,
      cancelButtonColor: this.dangerColor,
      confirmButtonText,
      cancelButtonText,
    });
  }
}
