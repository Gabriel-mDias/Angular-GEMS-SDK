import { Component, input, output, forwardRef, signal, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface GemsRangeValue {
  min: string | number | null;
  max: string | number | null;
}

@Component({
  selector: 'gems-input-range',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gems-input-range-container">
      <div class="gems-input-group">
        <input
          [type]="type()"
          class="gems-input"
          [ngModel]="value().min"
          (ngModelChange)="onMinChange($event)"
          (blur)="onTouched()"
          [placeholder]="placeholderMin()"
          [disabled]="disabled()"
        />
      </div>
      <span class="gems-separator">até</span>
      <div class="gems-input-group">
        <input
          [type]="type()"
          class="gems-input"
          [ngModel]="value().max"
          (ngModelChange)="onMaxChange($event)"
          (blur)="onTouched()"
          [placeholder]="placeholderMax()"
          [disabled]="disabled()"
        />
      </div>
    </div>
  `,
  styleUrls: ['./gems-input-range.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputRangeComponent),
      multi: true
    }
  ]
})
export class GemsInputRangeComponent implements ControlValueAccessor {
  type = input<'number' | 'date'>('number');
  placeholderMin = input<string>('Mínimo');
  placeholderMax = input<string>('Máximo');
  
  value = signal<GemsRangeValue>({ min: null, max: null });
  disabled = signal<boolean>(false);

  valueChange = output<GemsRangeValue>();

  onChange = (val: any) => {};
  onTouched = () => {};

  writeValue(val: any): void {
    if (val) {
      this.value.set({
        min: val.min !== undefined ? val.min : null,
        max: val.max !== undefined ? val.max : null
      });
    } else {
      this.value.set({ min: null, max: null });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onMinChange(newMin: any) {
    const current = this.value();
    const updated = { ...current, min: newMin };
    this.value.set(updated);
    this.onChange(updated);
    this.valueChange.emit(updated);
  }

  onMaxChange(newMax: any) {
    const current = this.value();
    const updated = { ...current, max: newMax };
    this.value.set(updated);
    this.onChange(updated);
    this.valueChange.emit(updated);
  }
}
