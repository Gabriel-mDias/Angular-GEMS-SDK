import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  booleanAttribute,
  computed,
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

import { gemsUniqueId } from '../../core/utils/gems-unique-id.util';
import {
  GemsDateFormat,
  GemsDateFormatInput,
  gemsNormalizeDateFormat,
} from './gems-input-date.model';

/**
 * Input de data com máscara textual e picker nativo oculto.
 * Suporta formatos: dayMonthYear (DD/MM/AAAA), fullDate (DD/MM/AAAA HH:mm),
 * monthYear (MM/AAAA) e year (AAAA).
 * O valor emitido/salvo no form é sempre o formato ISO (AAAA-MM-DD).
 */
@Component({
  selector: 'gems-input-date',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gems-input-date.component.html',
  styleUrls: ['./gems-input-date.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly id = input<string>(gemsUniqueId('date'));
  readonly required = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  /** Formato do campo (EN). Ex.: 'dayMonthYear' | 'fullDate' | 'monthYear' | 'year'. */
  readonly format = input<GemsDateFormatInput>('dayMonthYear');
  /**
   * @deprecated Use `format`. Alias em português mantido por compatibilidade.
   */
  readonly formato = input<GemsDateFormatInput | undefined>(undefined);

  /** Formato canônico (EN), resolvido a partir de `format`/`formato` (legado). */
  protected readonly resolvedFormat = computed<GemsDateFormat>(() =>
    gemsNormalizeDateFormat(this.formato() ?? this.format()),
  );

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
    this.internalPlaceholder.set(this.placeholder() || this.getPlaceholderForFormat());
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  getPlaceholderForFormat(): string {
    switch (this.resolvedFormat()) {
      case 'dayMonthYear':
        return 'DD/MM/AAAA';
      case 'fullDate':
        return 'DD/MM/AAAA HH:mm';
      case 'monthYear':
        return 'MM/AAAA';
      case 'year':
        return 'AAAA';
      default:
        return 'DD/MM/AAAA';
    }
  }

  getNativeType(): string {
    switch (this.resolvedFormat()) {
      case 'dayMonthYear':
        return 'date';
      case 'fullDate':
        return 'datetime-local';
      case 'monthYear':
        return 'month';
      default:
        return 'date';
    }
  }

  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    let rawValue = inputEl.value.replace(/\D/g, '');

    switch (this.resolvedFormat()) {
      case 'dayMonthYear':
        rawValue = rawValue.substring(0, 8);
        break;
      case 'fullDate':
        rawValue = rawValue.substring(0, 12);
        break;
      case 'monthYear':
        rawValue = rawValue.substring(0, 6);
        break;
      case 'year':
        rawValue = rawValue.substring(0, 4);
        break;
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
      // Normaliza para o mesmo formato de backend do caminho de digitação
      // (ex.: fullDate com segundos ':00').
      const normalized = this.normalizeNativeValue(inputEl.value);
      this.value.set(normalized);
      this.displayValue.set(this.convertToDisplayFormat(normalized));
      this.valueChange.emit(normalized);
      this.onChange(normalized);
    }
    this.onTouch();
  }

  onBlur(): void {
    this.onTouch();
  }

  toggleDatePicker(): void {
    if (this.disabled()) return;
    const el = this.nativeInputEl();
    if (!el || this.resolvedFormat() === 'year') return;

    const native = el.nativeElement as HTMLInputElement & { showPicker?: () => void };
    try {
      if (native.showPicker) {
        native.showPicker();
      } else {
        native.click();
      }
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
    const val = control.value as string | null | undefined;
    if (!val) return null;

    // A validação parte do valor do controle (ISO), não do estado de exibição.
    const digits = String(val).replace(/\D/g, '');
    const format = this.resolvedFormat();
    let isComplete = false;

    switch (format) {
      case 'dayMonthYear':
        isComplete = digits.length >= 8;
        break;
      case 'fullDate':
        isComplete = digits.length >= 12;
        break;
      case 'monthYear':
        isComplete = digits.length >= 6;
        break;
      case 'year':
        isComplete = digits.length >= 4;
        break;
    }

    if (!isComplete) return { incompleteDate: true };

    if (format === 'dayMonthYear' || format === 'fullDate') {
      // Valor ISO: AAAA-MM-DD[THH:mm[:ss]] → year(0-4) month(4-6) day(6-8).
      const year = parseInt(digits.substring(0, 4), 10);
      const month = parseInt(digits.substring(4, 6), 10);
      const day = parseInt(digits.substring(6, 8), 10);
      const date = new Date(year, month - 1, day);

      if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        return { invalidDate: true };
      }
    }

    return null;
  }

  // ── Métodos privados ──────────────────────────────────────────────
  /** Garante que o valor do picker nativo tenha segundos em fullDate. */
  private normalizeNativeValue(nativeValue: string): string {
    if (this.resolvedFormat() === 'fullDate') {
      // datetime-local => 'AAAA-MM-DDTHH:mm' (sem segundos)
      return /T\d{2}:\d{2}$/.test(nativeValue) ? `${nativeValue}:00` : nativeValue;
    }
    return nativeValue;
  }

  private validatePartialValue(val: string): string {
    if (!val) return '';
    let validated = val;
    const format = this.resolvedFormat();

    if (format === 'dayMonthYear' || format === 'fullDate') {
      if (val.length >= 2) {
        const day = parseInt(val.substring(0, 2), 10);
        if (day > 31) validated = '31' + val.substring(2);
        if (day === 0 && val.length === 2) validated = '01' + val.substring(2);
      }
      if (val.length >= 4) {
        const month = parseInt(val.substring(2, 4), 10);
        if (month > 12) validated = validated.substring(0, 2) + '12' + val.substring(4);
        if (month === 0 && val.length === 4)
          validated = validated.substring(0, 2) + '01' + val.substring(4);
      }
    } else if (format === 'monthYear') {
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
    const format = this.resolvedFormat();

    if (format === 'dayMonthYear') {
      return val.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
    }
    if (format === 'fullDate') {
      return val
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1 $2')
        .replace(/(\d{2})(\d)/, '$1:$2');
    }
    if (format === 'monthYear') {
      return val.replace(/(\d{2})(\d)/, '$1/$2');
    }
    return val;
  }

  private convertToBackendFormat(rawValue: string): string {
    const format = this.resolvedFormat();

    if (format === 'dayMonthYear' && rawValue.length >= 8) {
      const d = rawValue.substring(0, 2);
      const m = rawValue.substring(2, 4);
      const y = rawValue.substring(4, 8);
      return `${y}-${m}-${d}`;
    }
    if (format === 'fullDate' && rawValue.length >= 12) {
      const d = rawValue.substring(0, 2);
      const m = rawValue.substring(2, 4);
      const y = rawValue.substring(4, 8);
      const h = rawValue.substring(8, 10);
      const min = rawValue.substring(10, 12);
      return `${y}-${m}-${d}T${h}:${min}:00`;
    }
    if (format === 'monthYear' && rawValue.length >= 6) {
      const m = rawValue.substring(0, 2);
      const y = rawValue.substring(2, 6);
      return `${y}-${m}`;
    }

    return rawValue;
  }

  private convertToDisplayFormat(backendValue: string): string {
    if (!backendValue) return '';
    const format = this.resolvedFormat();
    const digits = backendValue.replace(/\D/g, '');

    if (digits.length >= 8 && (format === 'dayMonthYear' || format === 'fullDate')) {
      const y = digits.substring(0, 4);
      const m = digits.substring(4, 6);
      const d = digits.substring(6, 8);

      if (format === 'fullDate' && digits.length >= 12) {
        const h = digits.substring(8, 10);
        const min = digits.substring(10, 12);
        return this.applyMask(`${d}${m}${y}${h}${min}`);
      }
      return this.applyMask(`${d}${m}${y}`);
    }
    if (digits.length >= 6 && format === 'monthYear') {
      const y = digits.substring(0, 4);
      const m = digits.substring(4, 6);
      return this.applyMask(`${m}${y}`);
    }
    if (digits.length >= 4 && format === 'year') {
      return digits.substring(0, 4);
    }

    return this.applyMask(digits);
  }
}
