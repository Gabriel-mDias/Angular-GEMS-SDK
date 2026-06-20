import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GemsRangeValue } from './gems-input-range.model';

/**
 * Input duplo para seleção de intervalos (número ou data).
 * Emite um objeto { min, max } e implementa ControlValueAccessor.
 */
@Component({
  selector: 'gems-input-range',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gems-input-range.component.html',
  styleUrls: ['./gems-input-range.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputRangeComponent),
      multi: true,
    },
  ],
})
export class GemsInputRangeComponent implements ControlValueAccessor {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly type = input<'number' | 'date'>('number');
  readonly placeholderMin = input<string>('Mínimo');
  readonly placeholderMax = input<string>('Máximo');
  readonly separator = input<string>('até');

  // ── Outputs ───────────────────────────────────────────────────────
  readonly valueChange = output<GemsRangeValue>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly value = signal<GemsRangeValue>({ min: null, max: null });
  protected readonly disabled = signal<boolean>(false);

  // ── ControlValueAccessor ──────────────────────────────────────────
  private onChange: (value: GemsRangeValue) => void = () => {};
  protected onTouched: () => void = () => {};

  // ── Métodos públicos ──────────────────────────────────────────────
  onMinChange(newMin: string | number | null): void {
    const updated: GemsRangeValue = { ...this.value(), min: newMin };
    this.value.set(updated);
    this.onChange(updated);
    this.valueChange.emit(updated);
  }

  onMaxChange(newMax: string | number | null): void {
    const updated: GemsRangeValue = { ...this.value(), max: newMax };
    this.value.set(updated);
    this.onChange(updated);
    this.valueChange.emit(updated);
  }

  writeValue(val: GemsRangeValue | null | undefined): void {
    if (val) {
      this.value.set({
        min: val.min ?? null,
        max: val.max ?? null,
      });
    } else {
      this.value.set({ min: null, max: null });
    }
  }

  registerOnChange(fn: (value: GemsRangeValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
