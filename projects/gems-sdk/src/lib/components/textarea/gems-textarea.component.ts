import { Component, ElementRef, ViewChild, booleanAttribute, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  // ── ViewChild ─────────────────────────────────────────────────────
  @ViewChild('textareaRef') private readonly textareaRef!: ElementRef<HTMLTextAreaElement>;

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly textareaId = crypto.randomUUID();
  protected value = '';

  // ── CVA ───────────────────────────────────────────────────────────
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  // ── Métodos públicos (CVA) ────────────────────────────────────────
  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {}

  // ── Métodos públicos ──────────────────────────────────────────────
  onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.value = el.value;
    this.onChange(this.value);

    if (this.autoResize()) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }
}
