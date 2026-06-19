import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GemsAlertService {
  private readonly primaryColor = 'var(--gems-primary-500, #3085d6)';
  private readonly errorColor = 'var(--gems-error-500, #d33)';
  private readonly warningColor = 'var(--gems-warning-500, #f8bb86)';
  private readonly infoColor = 'var(--gems-info-500, #3fc3ee)';

  success(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: this.primaryColor
    });
  }

  error(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: this.errorColor
    });
  }

  errorFromApi(apiError: any): Promise<SweetAlertResult> {
    const title = apiError?.error?.errorType || 'Erro';
    const text = apiError?.error?.message || 'Ocorreu um erro inesperado.';

    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: this.errorColor
    });
  }

  warning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: this.warningColor
    });
  }

  info(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: this.infoColor
    });
  }

  confirm(title: string, text: string, confirmButtonText: string = 'Sim', cancelButtonText: string = 'Não'): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: this.primaryColor,
      cancelButtonColor: this.errorColor,
      confirmButtonText,
      cancelButtonText
    });
  }
}
