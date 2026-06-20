export type GemsToastType = 'success' | 'error' | 'info' | 'warning';

/** Representa uma notificação na fila de toasts. */
export interface GemsToast {
  id: string;
  type: GemsToastType;
  message: string;
  duration: number;
}
