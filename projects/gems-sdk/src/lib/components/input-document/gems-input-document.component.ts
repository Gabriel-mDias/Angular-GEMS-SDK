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

import { GemsDocumentType } from './gems-input-document.model';

/**
 * Input com máscara automática de CPF/CNPJ.
 * Em modo 'auto', detecta o tipo pelo número de dígitos digitados.
 */
@Component({
  selector: 'gems-input-document',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gems-input-document.component.html',
  styleUrls: ['../input-mask/gems-input-mask.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputDocumentComponent),
      multi: true,
    },
  ],
})
export class GemsInputDocumentComponent implements ControlValueAccessor {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('Documento');
  readonly placeholder = input<string>('CPF ou CNPJ');
  readonly id = input<string>('doc-' + crypto.randomUUID());
  readonly required = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  readonly documentType = input<GemsDocumentType>('auto');
  readonly icon = input<string>('fa-regular fa-id-card');

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
    let rawValue = inputEl.value.replace(/\D/g, '');

    if (rawValue.length > 14) {
      rawValue = rawValue.substring(0, 14);
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

    const type = this.documentType();
    let masked = '';

    if (type === 'cpf' || (type === 'auto' && rawValue.length <= 11)) {
      rawValue = rawValue.substring(0, 11);
      masked = rawValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      rawValue = rawValue.substring(0, 14);
      masked = rawValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }

    this.displayValue.set(masked);
  }
}
