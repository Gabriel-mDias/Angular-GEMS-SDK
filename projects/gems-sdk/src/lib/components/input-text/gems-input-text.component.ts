import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GemsInputTextType } from './gems-input-text.model';

/**
 * Campo de entrada de texto genérico com suporte a ControlValueAccessor (Reactive Forms e Template-Driven).
 *
 * Uso:
 * ```html
 * <gems-input-text label="Nome" formControlName="nome" placeholder="Digite seu nome"></gems-input-text>
 * ```
 */
@Component({
  selector: 'gems-input-text',
  standalone: true,
  imports: [],
  templateUrl: './gems-input-text.component.html',
  styleUrls: ['./gems-input-text.component.css'],
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
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<GemsInputTextType>('text');
  readonly icon = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly maxlength = input<number | null>(null);
  readonly hint = input<string>('');

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly inputId = crypto.randomUUID();
  protected value = '';

  // ── CVA ───────────────────────────────────────────────────────────
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  // ── Métodos públicos (CVA) ────────────────────────────────────────
  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {}

  // ── Métodos públicos ──────────────────────────────────────────────
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }
}
