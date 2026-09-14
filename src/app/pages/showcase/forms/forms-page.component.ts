import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  GemsFormCardComponent,
  GemsInputDateComponent,
  GemsInputPasswordComponent,
  GemsInputCheckboxComponent,
  GemsAlertService,
  GemsInputDocumentComponent,
  GemsInputTextComponent,
  GemsFieldErrorComponent,
} from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GemsFormCardComponent,
    GemsInputDateComponent,
    GemsInputPasswordComponent,
    GemsInputCheckboxComponent,
    GemsInputDocumentComponent,
    GemsInputTextComponent,
    GemsFieldErrorComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './forms-page.component.html',
  styleUrls: ['./forms-page.component.css'],
})
export class FormsPageComponent {
  form: FormGroup;

  /** Erros que o `gems-input-password` publica no controle quando `enforcePolicy` está ligado. */
  passwordMessages = {
    passwordPolicy: 'Atenda aos critérios de senha listados.',
    passwordEqualsIdentity: 'A senha não pode repetir o usuário nem o e-mail.',
  };

  /** Erro que o `matchControl` publica no campo de confirmação. */
  confirmationMessages = {
    passwordMismatch: 'As senhas precisam ser iguais.',
  };

  codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Utilizando o gems-form-card para encapsular formulários (formulário reativo) -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <gems-form-card title="Cadastro de Usuário" icon="fa-solid fa-user-plus">
    <div class="form-grid">
      <gems-input-document
        label="CPF"
        documentType="cpf"
        formControlName="cpf"
        required>
      </gems-input-document>

      <gems-input-date
        label="Data de Nascimento"
        formControlName="dataNascimento"
        required>
      </gems-input-date>

      <gems-input-text
        label="E-mail"
        formControlName="email"
        [required]="true">
      </gems-input-text>

      <!-- Política de senha: enforcePolicy e showCriteria são true por padrão. O controle
           recebe \`passwordPolicy\` enquanto os critérios não são atendidos e
           \`passwordEqualsIdentity\` se a senha repetir username ou email. -->
      <gems-input-password
        label="Senha de Acesso"
        formControlName="senha"
        username="usuario.demo"
        [email]="form.controls['email'].value"
        required>
      </gems-input-password>
      <gems-field-error
        [control]="form.controls['senha']"
        [messages]="passwordMessages">
      </gems-field-error>

      <!-- Confirmação: sem política nem critérios (já valem no campo de cima);
           matchControl publica \`passwordMismatch\` enquanto as duas não coincidirem. -->
      <gems-input-password
        label="Confirmação da Senha"
        formControlName="confirmacaoSenha"
        [enforcePolicy]="false"
        [showCriteria]="false"
        [matchControl]="form.controls['senha']"
        required>
      </gems-input-password>
      <gems-field-error
        [control]="form.controls['confirmacaoSenha']"
        [messages]="confirmationMessages">
      </gems-field-error>
    </div>

    <gems-input-checkbox
      label="Aceito os termos de uso e política de privacidade"
      formControlName="aceitoTermos">
    </gems-input-checkbox>

    <!-- Botões de Ação devem ficar dentro do footer-actions -->
    <div gems-form-card-footer class="footer-actions">
      <button type="button" class="gems-btn gems-btn-secondary" (click)="onCancel()">
        Cancelar
      </button>
      <button type="submit" class="gems-btn gems-btn-primary" [disabled]="form.invalid">
        Salvar
      </button>
    </div>
  </gems-form-card>
</form>`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GemsAlertService } from '@gabriel-mdias/angular-gems-sdk';

@Component({
  // ...
})
export class MeuFormularioComponent {
  form: FormGroup;

  // Mensagens dos erros que o gems-input-password publica no controle
  passwordMessages = {
    passwordPolicy: 'Atenda aos critérios de senha listados.',
    passwordEqualsIdentity: 'A senha não pode repetir o usuário nem o e-mail.',
  };
  confirmationMessages = {
    passwordMismatch: 'As senhas precisam ser iguais.',
  };

  constructor(
    private alertService: GemsAlertService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      confirmacaoSenha: ['', Validators.required],
      aceitoTermos: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.alertService.warning('Atenção', 'Preencha os campos obrigatórios e aceite os termos.');
      return;
    }

    // Chamada simulada para API
    this.alertService.success('Sucesso', 'Usuário cadastrado com sucesso!');
  }

  onCancel() {
    this.alertService.info('Cancelado', 'Ação cancelada pelo usuário.');
    this.form.reset({ aceitoTermos: false });
  }
}`,
    },
  ];

  constructor(
    private alertService: GemsAlertService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      confirmacaoSenha: ['', Validators.required],
      aceitoTermos: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.alertService.warning(
        'Atenção',
        'Preencha todos os campos obrigatórios e aceite os termos.',
      );
      return;
    }

    this.alertService.success('Cadastro Realizado', 'Os dados foram salvos com sucesso.');
  }

  onCancel() {
    this.alertService.info('Operação Cancelada', 'O formulário foi limpo.');
    this.form.reset({ aceitoTermos: false });
  }
}
