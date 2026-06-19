import { Component, input, output, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export type GemsMaskType = 'cep' | 'telefone' | 'rg' | 'email';

@Component({
  selector: 'gems-input-mask',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gems-input-container">
      <label *ngIf="label()" [for]="inputId()" class="gems-label" [class.gems-required]="required()">
        {{ label() }}
      </label>
      <div class="gems-input-wrapper">
        <i *ngIf="icon()" [class]="icon() + ' gems-input-icon'"></i>
        <input 
          [type]="maskType() === 'email' ? 'email' : 'text'" 
          [id]="inputId()"
          class="gems-input"
          [class.gems-with-icon]="icon()"
          [placeholder]="placeholder()"
          [value]="displayValue()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          [disabled]="disabled()"
          [required]="required()"
        >
      </div>
    </div>
  `,
  styleUrls: ['./gems-input-mask.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputMaskComponent),
      multi: true
    }
  ]
})
export class GemsInputMaskComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  id = input<string>('mask-input-' + Math.random().toString(36).substring(2, 9));
  required = input<boolean>(false);
  maskType = input<GemsMaskType>('cep');
  icon = input<string>();

  valueChange = output<string>();

  displayValue = signal<string>('');
  value = signal<string>('');
  disabled = signal<boolean>(false);

  inputId = computed(() => this.id());

  onChange: any = () => {};
  onTouch: any = () => {};

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

  writeValue(val: any): void {
    const newVal = val || '';
    this.value.set(newVal);
    this.applyMaskLogic(newVal);
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouch = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }
}
