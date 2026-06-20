import { Component, booleanAttribute, computed, input } from '@angular/core';

import { GemsButtonVariant } from './gems-button.model';

/**
 * Botão padrão da SDK com variantes visuais, estado de loading e suporte a ícones.
 *
 * Variantes: primary (padrão) | secondary | tertiary | danger | ghost | link
 *
 * Uso:
 * ```html
 * <gems-button label="Salvar" variant="primary" [loading]="saving" />
 * <gems-button label="Excluir" variant="danger" icon="fa-solid fa-trash" />
 * <gems-button icon="fa-solid fa-plus" ariaLabel="Adicionar item" />
 * ```
 */
@Component({
  selector: 'gems-button',
  standalone: true,
  imports: [],
  templateUrl: './gems-button.component.html',
  styleUrls: ['./gems-button.component.css'],
})
export class GemsButtonComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('');
  readonly variant = input<GemsButtonVariant>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly icon = input<string>('');
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly loading = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  readonly disabled = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>('');

  // ── Estado derivado ───────────────────────────────────────────────
  protected readonly variantClass = computed(() => `gems-btn--${this.variant()}`);
}
