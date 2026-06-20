import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GemsSelectOption } from './gems-select.model';

/**
 * Dropdown estilizado com suporte a ControlValueAccessor.
 * Usa `<select>` nativo para máxima acessibilidade.
 *
 * Uso:
 * ```html
 * <gems-select label="Status" [options]="statusOptions" formControlName="status"></gems-select>
 * ```
 */
@Component({
  selector: 'gems-select',
  standalone: true,
  imports: [],
  templateUrl: './gems-select.component.html',
  styleUrls: ['./gems-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsSelectComponent),
      multi: true,
    },
  ],
})
export class GemsSelectComponent implements ControlValueAccessor {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly options = input<GemsSelectOption[]>([]);
  readonly label = input<string>('');
  readonly placeholder = input<string>('Selecione...');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly selectId = crypto.randomUUID();
  protected value: unknown = null;

  // ── CVA ───────────────────────────────────────────────────────────
  private onChange: (value: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  // ── Métodos públicos (CVA) ────────────────────────────────────────
  writeValue(value: unknown): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {}

  // ── Métodos públicos ──────────────────────────────────────────────
  /** Retorna o índice como string para vincular ao option value no template. */
  getOptionIndex(index: number): string {
    return String(index);
  }

  isSelected(option: GemsSelectOption): boolean {
    return option.value === this.value;
  }

  onSelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const index = Number(select.value);
    const selected = this.options()[index];
    if (selected) {
      this.value = selected.value;
      this.onChange(selected.value);
    }
  }
}
