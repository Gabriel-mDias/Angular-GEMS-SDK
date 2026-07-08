import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { gemsUniqueId } from '../../core/utils/gems-unique-id.util';

/**
 * Input de senha com botão de visibilidade toggle.
 * Implementa ControlValueAccessor — compatível com Reactive Forms e Template Forms.
 */
@Component({
  selector: 'gems-input-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gems-input-password.component.html',
  styleUrls: ['./gems-input-password.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputPasswordComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsInputPasswordComponent implements ControlValueAccessor {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('Senha');
  readonly placeholder = input<string>('Digite sua senha');
  readonly id = input<string>(gemsUniqueId('password'));
  readonly required = input<boolean, boolean | string>(false, { transform: booleanAttribute });

  // ── Outputs ───────────────────────────────────────────────────────
  readonly valueChange = output<string>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly value = signal<string>('');
  protected readonly showPassword = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);

  // ── Estado derivado ───────────────────────────────────────────────
  protected readonly inputId = computed(() => this.id());

  // ── ControlValueAccessor ──────────────────────────────────────────
  private onChange: (value: string) => void = () => {};
  private onTouch: () => void = () => {};

  // ── Métodos públicos ──────────────────────────────────────────────
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

  writeValue(val: string | null | undefined): void {
    this.value.set(val ?? '');
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
}
