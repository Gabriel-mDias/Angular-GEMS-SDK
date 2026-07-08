import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { gemsUniqueId } from '../../core/utils/gems-unique-id.util';
import { GemsSelectCompareWith, GemsSelectOption } from './gems-select.model';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  /** Comparador usado para casar o valor do formulário com uma opção (valores objeto). */
  readonly compareWith = input<GemsSelectCompareWith>((a, b) => a === b);

  // ── Outputs ───────────────────────────────────────────────────────
  readonly valueChange = output<unknown>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly selectId = gemsUniqueId('select');
  protected readonly value = signal<unknown>(null);
  private readonly disabledByForm = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledByForm());
  /** true quando nenhum valor real está selecionado (placeholder visível). */
  protected readonly isEmpty = computed(() => this.value() === null || this.value() === undefined);

  // ── CVA ───────────────────────────────────────────────────────────
  private onChange: (value: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  // ── Métodos públicos (CVA) ────────────────────────────────────────
  writeValue(value: unknown): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  /** Retorna o índice como string para vincular ao option value no template. */
  getOptionIndex(index: number): string {
    return String(index);
  }

  isSelected(option: GemsSelectOption): boolean {
    const current = this.value();
    if (current === null || current === undefined) {
      return false;
    }
    return this.compareWith()(option.value, current);
  }

  onSelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const index = Number(select.value);
    const selected = this.options()[index];
    if (selected) {
      this.value.set(selected.value);
      this.onChange(selected.value);
      this.valueChange.emit(selected.value);
    }
  }
}
