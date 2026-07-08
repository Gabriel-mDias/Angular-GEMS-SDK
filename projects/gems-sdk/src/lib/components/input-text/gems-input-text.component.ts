import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { gemsUniqueId } from '../../core/utils/gems-unique-id.util';
import { GemsInputTextType } from './gems-input-text.model';

/**
 * @description
 * Campo de entrada de texto genérico com suporte a ControlValueAccessor (Reactive Forms e Template-Driven).
 *
 * @example
 * ```html
 * <gems-input-text label="Nome" formControlName="nome" placeholder="Digite seu nome"></gems-input-text>
 * ```
 *
 * @ai_context
 * SEMPRE utilize este componente ou os componentes irmãos (input-date, input-password) para campos de formulário.
 * NUNCA utilize inputs nativos do HTML. Este componente já gerencia estado, acessibilidade e erros de validação (através do :host.ng-invalid) de forma automatizada.
 */
@Component({
  selector: 'gems-input-text',
  standalone: true,
  imports: [],
  templateUrl: './gems-input-text.component.html',
  styleUrls: ['./gems-input-text.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputTextComponent),
      multi: true,
    },
  ],
})
export class GemsInputTextComponent implements ControlValueAccessor {
  // ── Inputs ────────────────────────────────────────────────────────

  /**
   * Rótulo de texto renderizado acima do campo.
   * Ele obedecerá à tipografia global (font-weight: 700).
   */
  readonly label = input<string>('');

  /** Placeholder exibido quando o campo está vazio. */
  readonly placeholder = input<string>('');

  /**
   * Tipo do input nativo.
   * Use gems-input-password ou gems-input-date para casos especializados.
   */
  readonly type = input<GemsInputTextType>('text');
  readonly icon = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly maxlength = input<number | null>(null);
  readonly hint = input<string>('');

  // ── Outputs ───────────────────────────────────────────────────────
  readonly valueChange = output<string>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly inputId = gemsUniqueId('input');
  protected readonly value = signal('');
  /** Desabilitado via ControlValueAccessor (ex.: `control.disable()`). */
  private readonly disabledByForm = signal(false);
  /** Estado efetivo: input `disabled` OU desabilitado pelo formulário. */
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledByForm());

  // ── CVA ───────────────────────────────────────────────────────────
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  // ── Métodos públicos (CVA) ────────────────────────────────────────
  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.onChange(input.value);
    this.valueChange.emit(input.value);
  }
}
