import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChange,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  EmailValidator,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { gemsUniqueId } from '../../core/utils/gems-unique-id.util';
import {
  GEMS_PASSWORD_MINIMUM_LENGTH,
  GEMS_PASSWORD_SPECIAL_CHARACTER_PATTERN,
  GemsPasswordCriterion,
  GemsPasswordIdentityErrors,
  GemsPasswordPolicyErrors,
} from './gems-input-password.model';

/**
 * Input de senha com botão de visibilidade, política de senha e conferência de repetição.
 *
 * Implementa `ControlValueAccessor` e `Validator` — a política vem do próprio componente,
 * e não de um validador que cada consumidor precise reescrever. Os erros publicados são
 * `passwordPolicy`, `passwordEqualsIdentity` e `passwordMismatch`.
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
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GemsInputPasswordComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsInputPasswordComponent implements ControlValueAccessor, Validator, OnChanges {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('Senha');
  readonly placeholder = input<string>('Digite sua senha');
  readonly id = input<string>(gemsUniqueId('password'));
  readonly required = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  /** Aplica tamanho, letras, caractere especial, espaços e identidade. */
  readonly enforcePolicy = input<boolean, boolean | string>(true, { transform: booleanAttribute });
  /** Lista, em tempo real, somente os critérios ainda pendentes. */
  readonly showCriteria = input<boolean, boolean | string>(true, { transform: booleanAttribute });
  /** Quando informado, a senha não pode ser igual ao usuário, sem distinção de caixa. */
  readonly username = input<string | null | undefined>(null);
  /** Quando informado, a senha não pode ser igual ao e-mail, sem distinção de caixa. */
  readonly email = input<string | null | undefined>(null);
  /** Campo original, no campo de repetição: publica `passwordMismatch` e revalida junto. */
  readonly matchControl = input<AbstractControl<string | null> | null>(null);

  // ── Outputs ───────────────────────────────────────────────────────
  readonly valueChange = output<string>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly value = signal<string>('');
  protected readonly showPassword = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);

  // ── Estado derivado ───────────────────────────────────────────────
  protected readonly inputId = computed(() => this.id());
  protected readonly criteriaId = computed(() => `${this.id()}-criteria`);

  private readonly policy = computed(() => {
    const value = this.value();
    const normalized = value.toLocaleLowerCase();
    const username = this.username()?.toLocaleLowerCase();
    const email = this.email()?.toLocaleLowerCase();

    return {
      minLength: value.length >= GEMS_PASSWORD_MINIMUM_LENGTH,
      lowercase: /\p{Ll}/u.test(value),
      uppercase: /\p{Lu}/u.test(value),
      specialCharacter: GEMS_PASSWORD_SPECIAL_CHARACTER_PATTERN.test(value),
      noWhitespace: !/\s/u.test(value),
      differentFromUsername: !username || normalized !== username,
      differentFromEmail: !email || normalized !== email,
    };
  });

  protected readonly unmetCriteria = computed<GemsPasswordCriterion[]>(() => {
    const policy = this.policy();
    const criteria: GemsPasswordCriterion[] = [
      {
        key: 'minLength',
        message: `Use pelo menos ${GEMS_PASSWORD_MINIMUM_LENGTH} caracteres.`,
        valid: policy.minLength,
      },
      { key: 'lowercase', message: 'Inclua uma letra minúscula.', valid: policy.lowercase },
      { key: 'uppercase', message: 'Inclua uma letra maiúscula.', valid: policy.uppercase },
      {
        key: 'specialCharacter',
        message: 'Inclua um caractere especial: @ # $ % ^ & + = !.',
        valid: policy.specialCharacter,
      },
      { key: 'noWhitespace', message: 'Não use espaços.', valid: policy.noWhitespace },
    ];

    if (this.username()) {
      criteria.push({
        key: 'differentFromUsername',
        message: 'Use uma senha diferente do usuário.',
        valid: policy.differentFromUsername,
      });
    }
    if (this.email()) {
      criteria.push({
        key: 'differentFromEmail',
        message: 'Use uma senha diferente do e-mail.',
        valid: policy.differentFromEmail,
      });
    }

    return criteria.filter(criterion => !criterion.valid);
  });

  protected readonly shouldShowCriteria = computed(
    () => this.enforcePolicy() && this.showCriteria() && this.value().length > 0,
  );

  // ── ControlValueAccessor / Validator ──────────────────────────────
  private onChange: (value: string) => void = () => {};
  private onTouch: () => void = () => {};
  private onValidatorChange: () => void = () => {};
  private readonly angularEmailValidator = inject(EmailValidator, { self: true, optional: true });

  constructor() {
    effect(onCleanup => {
      this.required();
      this.enforcePolicy();
      this.username();
      this.email();
      // `[email]` também ativa o EmailValidator do ReactiveFormsModule no mesmo host. O valor
      // pertence à política de identidade e não deve validar a senha como endereço de e-mail.
      if (this.angularEmailValidator) {
        const previous = this.angularEmailValidator.email;
        this.angularEmailValidator.email = false;
        this.angularEmailValidator.ngOnChanges({
          email: new SimpleChange(previous, false, false),
        });
      }
      const matchControl = this.matchControl();
      this.onValidatorChange();

      if (!matchControl) return;
      const subscription = matchControl.valueChanges.subscribe(() => this.onValidatorChange());
      onCleanup(() => subscription.unsubscribe());
    });
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  markTouched(): void {
    this.onTouch();
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

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  ngOnChanges(): void {
    this.onValidatorChange();
  }

  validate(): ValidationErrors | null {
    const value = this.value();
    const errors: ValidationErrors = {};

    if (this.required() && value.length === 0) errors['required'] = true;

    if (this.enforcePolicy() && value.length > 0) {
      const policy = this.policy();
      const passwordPolicy: GemsPasswordPolicyErrors = {};
      if (!policy.minLength) passwordPolicy.minLength = true;
      if (!policy.lowercase) passwordPolicy.lowercase = true;
      if (!policy.uppercase) passwordPolicy.uppercase = true;
      if (!policy.specialCharacter) passwordPolicy.specialCharacter = true;
      if (!policy.noWhitespace) passwordPolicy.noWhitespace = true;
      if (Object.keys(passwordPolicy).length > 0) errors['passwordPolicy'] = passwordPolicy;

      const identity: GemsPasswordIdentityErrors = {};
      if (!policy.differentFromUsername) identity.username = true;
      if (!policy.differentFromEmail) identity.email = true;
      if (Object.keys(identity).length > 0) errors['passwordEqualsIdentity'] = identity;
    }

    const matchControl = this.matchControl();
    if (matchControl && value !== (matchControl.value ?? '')) errors['passwordMismatch'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }
}
