import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { GemsErrorMessages } from './gems-field-error.model';

/** Mensagens padrão em PT-BR para os validadores nativos do Angular. */
const DEFAULT_MESSAGES: GemsErrorMessages = {
  required: 'Este campo é obrigatório.',
  email: 'Informe um e-mail válido.',
  minlength: 'Valor muito curto.',
  maxlength: 'Valor muito longo.',
  min: 'Valor abaixo do mínimo permitido.',
  max: 'Valor acima do máximo permitido.',
  pattern: 'Formato inválido.',
};

/**
 * Exibe a primeira mensagem de erro de um AbstractControl quando inválido e tocado/sujo.
 *
 * Uso:
 * ```html
 * <gems-input-text formControlName="email" label="E-mail"></gems-input-text>
 * <gems-field-error [control]="form.get('email')"></gems-field-error>
 * ```
 */
@Component({
  selector: 'gems-field-error',
  standalone: true,
  imports: [],
  templateUrl: './gems-field-error.component.html',
  styleUrls: ['./gems-field-error.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsFieldErrorComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly control = input<AbstractControl | null>(null);
  readonly messages = input<GemsErrorMessages>({});

  // ── Estado derivado ───────────────────────────────────────────────
  protected readonly errorMessage = computed<string>(() => {
    const ctrl = this.control();
    if (!ctrl || !ctrl.errors || !(ctrl.touched || ctrl.dirty)) {
      return '';
    }
    const firstKey = Object.keys(ctrl.errors)[0];
    const merged = { ...DEFAULT_MESSAGES, ...this.messages() };
    return merged[firstKey] ?? `Erro: ${firstKey}`;
  });
}
