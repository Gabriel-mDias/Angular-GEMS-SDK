import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';

import { GemsModalSize } from './gems-modal.model';

/**
 * Diálogo modal com suporte a fechamento por ESC, clique no backdrop e foco automático.
 * Usa `model<boolean>()` para two-way binding em `open`.
 *
 * Uso:
 * ```html
 * <gems-modal [(open)]="isOpen" title="Confirmar" size="sm">
 *   <p>Tem certeza?</p>
 *   <div gems-modal-footer>
 *     <button class="btn-cancel" (click)="isOpen = false">Cancelar</button>
 *     <button class="btn-save" (click)="confirm()">Confirmar</button>
 *   </div>
 * </gems-modal>
 * ```
 */
@Component({
  selector: 'gems-modal',
  standalone: true,
  imports: [],
  templateUrl: './gems-modal.component.html',
  styleUrls: ['./gems-modal.component.css'],
})
export class GemsModalComponent implements AfterViewInit {
  // ── Inputs / two-way ─────────────────────────────────────────────
  readonly open = model<boolean>(false);
  readonly title = input<string>('');
  readonly size = input<GemsModalSize>('md');
  readonly closeOnBackdrop = input<boolean, boolean | string>(true, { transform: booleanAttribute });

  // ── Outputs ───────────────────────────────────────────────────────
  readonly confirm = output<void>();
  readonly closeEvent = output<void>();

  // ── ViewChild ─────────────────────────────────────────────────────
  @ViewChild('modalRef') private readonly modalRef!: ElementRef<HTMLElement>;

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngAfterViewInit(): void {
    if (this.open() && this.modalRef?.nativeElement) {
      this.modalRef.nativeElement.focus();
    }
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  closeModal(): void {
    this.open.set(false);
    this.closeEvent.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.closeModal();
    }
  }

  // ── Listeners ────────────────────────────────────────────────────
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.open()) {
      this.closeModal();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
