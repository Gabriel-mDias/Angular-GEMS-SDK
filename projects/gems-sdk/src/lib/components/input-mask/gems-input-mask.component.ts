import {
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GemsMaskType } from './gems-input-mask.model';

/**
 * Input com máscara automática para CEP, telefone, RG ou e-mail.
 * O valor emitido é sempre o dado limpo (sem formatação), mas exibe com máscara.
 */
@Component({
  selector: 'gems-input-mask',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gems-input-mask.component.html',
  styleUrls: ['./gems-input-mask.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputMaskComponent),
      multi: true,
    },
  ],
})
export class GemsInputMaskComponent implements ControlValueAccessor {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly id = input<string>('mask-' + crypto.randomUUID());
  readonly required = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  readonly maskType = input<GemsMaskType>('cep');
  readonly icon = input<string>();

  // ── Outputs ───────────────────────────────────────────────────────
  readonly valueChange = output<string>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly displayValue = signal<string>('');
  protected readonly value = signal<string>('');
  protected readonly disabled = signal<boolean>(false);

  // ── Estado derivado ───────────────────────────────────────────────
  protected readonly inputId = computed(() => this.id());

  // ── ControlValueAccessor ──────────────────────────────────────────
  private onChange: (value: string) => void = () => {};
  private onTouch: () => void = () => {};

  // ── Métodos públicos ──────────────────────────────────────────────
  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    let rawValue = inputEl.value;

    if (this.maskType() !== 'email') {
      rawValue = rawValue.replace(/\D/g, '');
    }

    this.applyMaskLogic(rawValue);
    inputEl.value = this.displayValue();

    this.value.set(rawValue);
    this.onChange(this.value());
    this.valueChange.emit(this.value());
  }

  onBlur(): void {
    this.onTouch();
  }

  writeValue(val: string | null | undefined): void {
    const newVal = val ?? '';
    this.value.set(newVal);
    this.applyMaskLogic(newVal);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // ── Métodos privados ──────────────────────────────────────────────
  private applyMaskLogic(rawValue: string): void {
    if (!rawValue) {
      this.displayValue.set('');
      return;
    }

    let masked = '';
    switch (this.maskType()) {
      case 'cep':
        rawValue = rawValue.substring(0, 8);
        masked = rawValue.replace(/(\d{5})(\d)/, '$1-$2');
        break;
      case 'telefone':
        rawValue = rawValue.substring(0, 11);
        if (rawValue.length > 10) {
          masked = rawValue.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (rawValue.length > 6) {
          masked = rawValue.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (rawValue.length > 2) {
          masked = rawValue.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else {
          masked = rawValue;
        }
        break;
      case 'rg':
        rawValue = rawValue.substring(0, 9);
        masked = rawValue
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        break;
      case 'email':
        masked = rawValue;
        break;
    }
    this.displayValue.set(masked);
  }
}
