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

/**
 * Input de seleção booleana com dois modos: switch (padrão) e checkbox clássico.
 * Implementa ControlValueAccessor — compatível com Reactive Forms e Template Forms.
 */
@Component({
  selector: 'gems-input-checkbox',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gems-input-checkbox.component.html',
  styleUrls: ['./gems-input-checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsInputCheckboxComponent),
      multi: true,
    },
  ],
})
export class GemsInputCheckboxComponent implements ControlValueAccessor {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('');
  readonly topLabel = input<string>('');
  readonly alignWithInputs = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  readonly isSwitch = input<boolean, boolean | string>(true, { transform: booleanAttribute });

  // ── Outputs ───────────────────────────────────────────────────────
  readonly valueChange = output<boolean>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly disabled = signal<boolean>(false);
  protected readonly value = signal<boolean>(false);

  // ── Estado derivado ───────────────────────────────────────────────
  private readonly uniqueId = 'gems-checkbox-' + crypto.randomUUID();
  protected readonly inputId = computed(() => this.uniqueId);

  // ── ControlValueAccessor ──────────────────────────────────────────
  private onChange: (value: boolean) => void = () => {};
  private onTouch: () => void = () => {};

  // ── Métodos públicos ──────────────────────────────────────────────
  toggleValue(event: Event): void {
    if (this.disabled()) return;
    const checked = (event.target as HTMLInputElement).checked;
    this.value.set(checked);
    this.valueChange.emit(checked);
    this.onChange(checked);
    this.onTouch();
  }

  writeValue(value: boolean | null | undefined): void {
    this.value.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
