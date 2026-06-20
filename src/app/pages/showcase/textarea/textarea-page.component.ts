import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { GemsFormCardComponent, GemsTextareaComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-textarea-page',
  standalone: true,
  imports: [ReactiveFormsModule, GemsFormCardComponent, GemsTextareaComponent, CodeSnippetComponent],
  templateUrl: './textarea-page.component.html',
})
export class TextareaPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly form: FormGroup;

  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Básico com limite de caracteres -->
<gems-textarea
  label="Observações"
  placeholder="Digite suas observações..."
  formControlName="obs"
  [rows]="4"
  [maxlength]="300">
</gems-textarea>

<!-- Auto-resize (cresce com o conteúdo) -->
<gems-textarea
  label="Descrição"
  formControlName="descricao"
  [autoResize]="true">
</gems-textarea>`,
    },
  ];

  // ── Construtor ────────────────────────────────────────────────────
  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      obs: [''],
      descricao: [''],
    });
  }
}
