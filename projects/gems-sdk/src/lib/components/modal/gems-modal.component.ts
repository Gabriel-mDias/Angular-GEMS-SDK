import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
  ViewChild,
  booleanAttribute,
  effect,
  input,
  model,
  output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { GemsModalSize } from './gems-modal.model';

/**
 * Pilha global de modais abertos. Garante que o ESC feche apenas o modal do
 * topo e que o scroll lock só seja liberado quando não houver mais modais.
 */
const openModals: GemsModalComponent[] = [];

/**
 * Diálogo modal com fechamento por ESC/backdrop, foco automático (com trap
 * básico), restauração de foco e trava de scroll do body.
 *
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsModalComponent {
  // ── Inputs / two-way ─────────────────────────────────────────────
  readonly open = model<boolean>(false);
  readonly title = input<string>('');
  readonly size = input<GemsModalSize>('md');
  readonly closeOnBackdrop = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  /** Permite (ou não) fechar via tecla ESC. */
  readonly closeOnEsc = input<boolean, boolean | string>(true, { transform: booleanAttribute });

  // ── Outputs ───────────────────────────────────────────────────────
  readonly confirm = output<void>();
  readonly closeEvent = output<void>();

  // ── ViewChild ─────────────────────────────────────────────────────
  @ViewChild('modalRef') private readonly modalRef?: ElementRef<HTMLElement>;

  private previouslyFocused: HTMLElement | null = null;
  private readonly isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Reage à abertura/fechamento: registra na pilha, trava scroll e move o foco.
    effect(() => {
      const isOpen = this.open();
      if (!this.isBrowser) return;

      if (isOpen) {
        this.onOpened();
      } else {
        this.onClosed();
      }
    });
  }

  // ── Estado de abertura ────────────────────────────────────────────
  private onOpened(): void {
    if (openModals.includes(this)) return;
    this.previouslyFocused = this.document.activeElement as HTMLElement | null;
    openModals.push(this);
    this.document.body.style.overflow = 'hidden';
    // Foca o diálogo após o render do @if.
    queueMicrotask(() => this.modalRef?.nativeElement.focus());
  }

  private onClosed(): void {
    const index = openModals.indexOf(this);
    if (index !== -1) {
      openModals.splice(index, 1);
    }
    if (openModals.length === 0) {
      this.document.body.style.overflow = '';
    }
    this.previouslyFocused?.focus?.();
    this.previouslyFocused = null;
  }

  /** true se este modal é o do topo da pilha. */
  private isTopmost(): boolean {
    return openModals[openModals.length - 1] === this;
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
    if (this.open() && this.closeOnEsc() && this.isTopmost()) {
      this.closeModal();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
