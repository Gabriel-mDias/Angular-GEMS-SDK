import { Component, input, output, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'gems-input-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gems-input-checkbox.component.html',
  styleUrls: ['./gems-input-checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputCheckboxComponent),
      multi: true
    }
  ]
})
export class GemsInputCheckboxComponent implements ControlValueAccessor {
  label = input<string>('');
  topLabel = input<string>('');
  alignWithInputs = input<boolean>(false);
  isSwitch = input<boolean>(true);
  
  // Use signal for internal state
  disabled = signal<boolean>(false);
  value = signal<boolean>(false);

  valueChange = output<boolean>();

  private uniqueId = 'gems-checkbox-' + Math.random().toString(36).substring(2, 9);
  
  inputId = computed(() => this.uniqueId);

  onChange: any = () => {};
  onTouch: any = () => {};

  toggleValue(event: Event) {
    if (this.disabled()) return;
    
    const inputEl = event.target as HTMLInputElement;
    this.value.set(inputEl.checked);
    
    this.valueChange.emit(this.value());
    this.onChange(this.value());
    this.onTouch();
  }

  writeValue(value: any): void {
    this.value.set(!!value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
