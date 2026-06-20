import {
  Component,
  ElementRef,
  OnInit,
  booleanAttribute,
  forwardRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { GemsDateFormat } from './gems-input-date.model';

/**
 * Input de data com máscara textual e picker nativo oculto.
 * Suporta formatos: diaMesAno (DD/MM/AAAA), fullData (DD/MM/AAAA HH:mm),
 * mesAno (MM/AAAA) e ano (AAAA).
 * O valor emitido/salvo no form é sempre o formato ISO (AAAA-MM-DD).
 */
@Component({
  selector: 'gems-input-date',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gems-input-date.component.html',
  styleUrls: ['./gems-input-date.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputDateComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GemsInputDateComponent),
      multi: true,
    },
  ],
})
export class GemsInputDateComponent implements ControlValueAccessor, OnInit, Validator {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('Data');
  readonly placeholder = input<string>('');
  readonly id = input<string>('date-' + crypto.randomUUID());
  readonly required = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  readonly formato = input<GemsDateFormat>('diaMesAno');

  // ── Outputs ───────────────────────────────────────────────────────
  readonly valueChange = output<string>();

  // ── View children ─────────────────────────────────────────────────
  protected readonly nativeInputEl = viewChild<ElementRef<HTMLInputElement>>('nativeInput');

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly value = signal<string>('');
  protected readonly displayValue = signal<string>('');
  protected readonly disabled = signal<boolean>(false);
  protected readonly internalPlaceholder = signal<string>('');

  // ── ControlValueAccessor ──────────────────────────────────────────
  private onChange: (value: string) => void = () => {};
  private onTouch: () => void = () => {};

  // ── Ciclo de vida ─────────────────────────────────────────────────
  ngOnInit(): void {
    this.internalPlaceholder.set(
      this.placeholder() || this.getPlaceholderForFormat(),
    );
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  getPlaceholderForFormat(): string {
    switch (this.formato()) {
      case 'diaMesAno': return 'DD/MM/AAAA';
      case 'fullData':  return 'DD/MM/AAAA HH:mm';
      case 'mesAno':    return 'MM/AAAA';
      case 'ano':       return 'AAAA';
      default:          return 'DD/MM/AAAA';
    }
  }

  getNativeType(): string {
    switch (this.formato()) {
      case 'diaMesAno': return 'date';
      case 'fullData':  return 'datetime-local';
      case 'mesAno':    return 'month';
      default:          return 'date';
    }
  }

  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    let rawValue = inputEl.value.replace(/\D/g, '');

    switch (this.formato()) {
      case 'diaMesAno': rawValue = rawValue.substring(0, 8);  break;
      case 'fullData':  rawValue = rawValue.substring(0, 12); break;
      case 'mesAno':    rawValue = rawValue.substring(0, 6);  break;
      case 'ano':       rawValue = rawValue.substring(0, 4);  break;
    }

    rawValue = this.validatePartialValue(rawValue);

    const masked = this.applyMask(rawValue);
    this.displayValue.set(masked);
    inputEl.value = masked;

    const backendFormat = this.convertToBackendFormat(rawValue);
    this.value.set(backendFormat);
    this.valueChange.emit(backendFormat);
    this.onChange(backendFormat);
    this.onTouch();
  }

  onNativeChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.value) {
      this.value.set(inputEl.value);
      this.displayValue.set(this.convertToDisplayFormat(inputEl.value));
      this.valueChange.emit(this.value());
      this.onChange(this.value());
    }
  }

  toggleDatePicker(): void {
    if (this.disabled()) return;
    const el = this.nativeInputEl();
    if (!el || this.formato() === 'ano') return;

    const native = el.nativeElement as HTMLInputElement & { showPicker?: () => void };
    try {
      native.showPicker ? native.showPicker() : native.click();
    } catch {
      native.click();
    }
  }

  writeValue(val: string | null | undefined): void {
    if (val != null) {
      this.value.set(val);
      this.displayValue.set(this.convertToDisplayFormat(val));
    } else {
      this.value.set('');
      this.displayValue.set('');
    }
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

  validate(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (!val) return null;

    const rawValue = this.displayValue().replace(/\D/g, '');
    const format = this.formato();
    let isComplete = false;

    switch (format) {
      case 'diaMesAno': isComplete = rawValue.length === 8;  break;
      case 'fullData':  isComplete = rawValue.length === 12; break;
      case 'mesAno':    isComplete = rawValue.length === 6;  break;
      case 'ano':       isComplete = rawValue.length === 4;  break;
    }

    if (!isComplete) return { incompleteDate: true };

    if (format === 'diaMesAno' || format === 'fullData') {
      const day   = parseInt(rawValue.substring(0, 2), 10);
      const month = parseInt(rawValue.substring(2, 4), 10);
      const year  = parseInt(rawValue.substring(4, 8), 10);
      const date  = new Date(year, month - 1, day);

      if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
      ) {
        return { invalidDate: true };
      }
    }

    return null;
  }

  // ── Métodos privados ──────────────────────────────────────────────
  private validatePartialValue(val: string): string {
    if (!val) return '';
    let validated = val;
    const format = this.formato();

    if (format === 'diaMesAno' || format === 'fullData') {
      if (val.length >= 2) {
        const day = parseInt(val.substring(0, 2), 10);
        if (day > 31) validated = '31' + val.substring(2);
        if (day === 0 && val.length === 2) validated = '01' + val.substring(2);
      }
      if (val.length >= 4) {
        const month = parseInt(val.substring(2, 4), 10);
        if (month > 12) validated = validated.substring(0, 2) + '12' + val.substring(4);
        if (month === 0 && val.length === 4) validated = validated.substring(0, 2) + '01' + val.substring(4);
      }
    } else if (format === 'mesAno') {
      if (val.length >= 2) {
        const month = parseInt(val.substring(0, 2), 10);
        if (month > 12) validated = '12' + val.substring(2);
        if (month === 0 && val.length === 2) validated = '01' + val.substring(2);
      }
    }

    return validated;
  }

  private applyMask(val: string): string {
    if (!val) return '';
    const format = this.formato();

    if (format === 'diaMesAno') {
      return val.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
    }
    if (format === 'fullData') {
      return val
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1 $2')
        .replace(/(\d{2})(\d)/, '$1:$2');
    }
    if (format === 'mesAno') {
      return val.replace(/(\d{2})(\d)/, '$1/$2');
    }
    return val;
  }

  private convertToBackendFormat(rawValue: string): string {
    const format = this.formato();

    if (format === 'diaMesAno' && rawValue.length >= 8) {
      const d = rawValue.substring(0, 2);
      const m = rawValue.substring(2, 4);
      const y = rawValue.substring(4, 8);
      return `${y}-${m}-${d}`;
    }
    if (format === 'fullData' && rawValue.length >= 12) {
      const d   = rawValue.substring(0, 2);
      const m   = rawValue.substring(2, 4);
      const y   = rawValue.substring(4, 8);
      const h   = rawValue.substring(8, 10);
      const min = rawValue.substring(10, 12);
      return `${y}-${m}-${d}T${h}:${min}:00`;
    }
    if (format === 'mesAno' && rawValue.length >= 6) {
      const m = rawValue.substring(0, 2);
      const y = rawValue.substring(2, 6);
      return `${y}-${m}`;
    }

    return rawValue;
  }

  private convertToDisplayFormat(backendValue: string): string {
    if (!backendValue) return '';
    const format = this.formato();
    const digits = backendValue.replace(/\D/g, '');

    if (digits.length >= 8 && (format === 'diaMesAno' || format === 'fullData')) {
      const y = digits.substring(0, 4);
      const m = digits.substring(4, 6);
      const d = digits.substring(6, 8);

      if (format === 'fullData' && digits.length >= 12) {
        const h   = digits.substring(8, 10);
        const min = digits.substring(10, 12);
        return this.applyMask(`${d}${m}${y}${h}${min}`);
      }
      return this.applyMask(`${d}${m}${y}`);
    }
    if (digits.length >= 6 && format === 'mesAno') {
      const y = digits.substring(0, 4);
      const m = digits.substring(4, 6);
      return this.applyMask(`${m}${y}`);
    }
    if (digits.length >= 4 && format === 'ano') {
      return digits.substring(0, 4);
    }

    return this.applyMask(digits);
  }
}
