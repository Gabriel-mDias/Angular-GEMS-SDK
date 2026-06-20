import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  GemsFormCardComponent,
  GemsInputTextComponent,
} from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-input-text-page',
  standalone: true,
  imports: [ReactiveFormsModule, GemsFormCardComponent, GemsInputTextComponent, CodeSnippetComponent],
  templateUrl: './input-text-page.component.html',
})
export class InputTextPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly form: FormGroup;

  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<gems-input-text
  label="Nome completo"
  placeholder="Digite seu nome"
  formControlName="nome"
  icon="fa-solid fa-user"
  [required]="true">
</gems-input-text>

<!-- Com hint e tipo email -->
<gems-input-text
  label="E-mail"
  type="email"
  placeholder="exemplo@email.com"
  formControlName="email"
  hint="Informe um e-mail válido">
</gems-input-text>`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsInputTextComponent } from '@gabriel-mdias/angular-gems-sdk';

// ...
form = this.fb.group({
  nome: [''],
  email: ['', Validators.email],
});`,
    },
  ];

  // ── Construtor ────────────────────────────────────────────────────
  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      nome: [''],
      email: [''],
      telefone: [''],
      readonly: [{ value: 'Valor fixo', disabled: true }],
    });
  }
}
