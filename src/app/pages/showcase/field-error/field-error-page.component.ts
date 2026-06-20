import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  GemsFieldErrorComponent,
  GemsFormCardComponent,
  GemsInputTextComponent,
} from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-field-error-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GemsFormCardComponent,
    GemsInputTextComponent,
    GemsFieldErrorComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './field-error-page.component.html',
})
export class FieldErrorPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly form: FormGroup;

  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Adicione gems-field-error logo abaixo do input -->
<gems-input-text label="E-mail" type="email" formControlName="email">
</gems-input-text>
<gems-field-error
  [control]="form.get('email')"
  [messages]="{ email: 'Informe um e-mail válido.' }">
</gems-field-error>

<!-- Mensagens padrão PT-BR já incluídas:
  required, email, minlength, maxlength, min, max, pattern -->`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsFieldErrorComponent } from '@gabriel-mdias/angular-gems-sdk';

form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
});`,
    },
  ];

  // ── Construtor ────────────────────────────────────────────────────
  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  onSubmit(): void {
    this.form.markAllAsTouched();
  }
}
