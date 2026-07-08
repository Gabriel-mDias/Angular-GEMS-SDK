import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { gemsUniqueId } from '../../core/utils/gems-unique-id.util';

/**
 * Área de texto com suporte a ControlValueAccessor e auto-resize opcional.
 *
 * Uso:
 * ```html
 * <gems-textarea label="Observações" formControlName="obs" [rows]="5" [maxlength]="500"></gems-textarea>
 * ```
 */
@Component({
  selector: 'gems-textarea',
  standalone: true,
  imports: [],
  templateUrl: './gems-textarea.component.html',
  styleUrls: ['./gems-textarea.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GemsTextareaComponent),
      multi: true,
    },
  ],
})
export class GemsTextareaComponent implements ControlValueAccessor {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly rows = input<number>(4);
  readonly maxlength = input<number | null>(null);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly autoResize = input<boolean, boolean | string>(false, { transform: booleanAttribute });

  // ── Outputs ───────────────────────────────────────────────────────
  readonly valueChange = output<string>();

  // ── ViewChild ─────────────────────────────────────────────────────
  @ViewChild('textareaRef') private readonly textareaRef!: ElementRef<HTMLTextAreaElement>;

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly textareaId = gemsUniqueId('textarea');
  protected readonly value = signal('');
  private readonly disabledByForm = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledByForm());

  // ── CVA ───────────────────────────────────────────────────────────
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  // ── Métodos públicos (CVA) ────────────────────────────────────────
  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.value.set(el.value);
    this.onChange(el.value);
    this.valueChange.emit(el.value);

    if (this.autoResize()) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }
}
