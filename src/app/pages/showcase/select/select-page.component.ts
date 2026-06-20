import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  GemsFormCardComponent,
  GemsSelectComponent,
  GemsSelectOption,
} from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [ReactiveFormsModule, GemsFormCardComponent, GemsSelectComponent, CodeSnippetComponent],
  templateUrl: './select-page.component.html',
})
export class SelectPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly form: FormGroup;

  readonly estadoOptions: GemsSelectOption[] = [
    { label: 'São Paulo', value: 'SP' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Bahia', value: 'BA' },
  ];

  readonly situacaoOptions: GemsSelectOption[] = [
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' },
    { label: 'Suspenso', value: 'suspenso', disabled: true },
  ];

  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<gems-select
  label="Estado"
  placeholder="Selecione um estado"
  [options]="estadoOptions"
  formControlName="estado"
  [required]="true">
</gems-select>`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsSelectComponent, GemsSelectOption } from '@gabriel-mdias/angular-gems-sdk';

// ...
readonly estadoOptions: GemsSelectOption[] = [
  { label: 'São Paulo', value: 'SP' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  // option desabilitada:
  { label: 'Opção bloqueada', value: 'X', disabled: true },
];`,
    },
  ];

  // ── Construtor ────────────────────────────────────────────────────
  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      estado: [null],
      situacao: ['ativo'],
      disabled: [{ value: 'SP', disabled: true }],
    });
  }
}
