import { Component, input, output, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export type GemsDocumentType = 'cpf' | 'cnpj' | 'auto';

@Component({
  selector: 'gems-input-document',
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
          type="text"
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
  styleUrls: ['../input-mask/gems-input-mask.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputDocumentComponent),
      multi: true
    }
  ]
})
export class GemsInputDocumentComponent implements ControlValueAccessor {
  label = input<string>('Documento');
  placeholder = input<string>('CPF ou CNPJ');
  id = input<string>('doc-input-' + Math.random().toString(36).substring(2, 9));
  required = input<boolean>(false);
  documentType = input<GemsDocumentType>('auto');
  icon = input<string>('fa-regular fa-id-card');

  valueChange = output<string>();

  displayValue = signal<string>('');
  value = signal<string>('');
  disabled = signal<boolean>(false);

  inputId = computed(() => this.id());

  onChange: any = () => {};
  onTouch: any = () => {};

  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    let rawValue = inputEl.value.replace(/\D/g, ''); 

    // Max length is 14 for CNPJ
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

  private applyMaskLogic(rawValue: string): void {
    if (!rawValue) {
      this.displayValue.set('');
      return;
    }

    let masked = '';
    const type = this.documentType();
    
    if (type === 'cpf' || (type === 'auto' && rawValue.length <= 11)) {
      // CPF: 000.000.000-00
      rawValue = rawValue.substring(0, 11);
      masked = rawValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ: 00.000.000/0000-00
      rawValue = rawValue.substring(0, 14);
      masked = rawValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
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
