import { Component, input, output, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'gems-input-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gems-input-container">
      <label *ngIf="label()" [for]="inputId()" class="gems-label" [class.gems-required]="required()">
        {{ label() }}
      </label>
      <div class="gems-password-wrapper">
        <input 
          [type]="showPassword() ? 'text' : 'password'" 
          [id]="inputId()"
          class="gems-input"
          [placeholder]="placeholder()"
          [value]="value()"
          (input)="onInput($event)"
          [disabled]="disabled()"
          [required]="required()"
        >
        <button type="button" class="gems-toggle-btn" (click)="togglePasswordVisibility()" tabindex="-1">
          <i class="fa-solid" [ngClass]="showPassword() ? 'fa-eye-slash' : 'fa-eye'"></i>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./gems-input-password.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputPasswordComponent),
      multi: true
    }
  ]
})
export class GemsInputPasswordComponent implements ControlValueAccessor {
  label = input<string>('Senha');
  placeholder = input<string>('Digite sua senha');
  id = input<string>('password-input-' + Math.random().toString(36).substring(2, 9));
  required = input<boolean>(false);
  
  valueChange = output<string>();

  value = signal<string>('');
  showPassword = signal<boolean>(false);
  disabled = signal<boolean>(false);

  inputId = computed(() => this.id());

  onChange: any = () => {};
  onTouch: any = () => {};

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.valueChange.emit(val);
    this.onChange(val);
    this.onTouch();
  }

  writeValue(val: any): void {
    if (val !== undefined && val !== null) {
      this.value.set(val);
    } else {
      this.value.set('');
    }
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
