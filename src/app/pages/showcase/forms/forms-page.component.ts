import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GemsFormCardComponent,
  GemsInputDateComponent,
  GemsInputMaskComponent,
  GemsInputPasswordComponent,
  GemsInputCheckboxComponent,
  GemsAlertService
} from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-forms-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    GemsFormCardComponent,
    GemsInputDateComponent,
    GemsInputMaskComponent,
    GemsInputPasswordComponent,
    GemsInputCheckboxComponent,
    CodeSnippetComponent
  ],
  templateUrl: './forms-page.component.html',
  styleUrls: ['./forms-page.component.css']
})
export class FormsPageComponent {
  formData = {
    cpf: '',
    dataNascimento: '',
    senha: '',
    aceitoTermos: false
  };

  codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Utilizando o gems-form-card para encapsular formulários -->
<gems-form-card title="Cadastro de Usuário" icon="fa-solid fa-user-plus">
  <form (ngSubmit)="onSubmit()">
    <div class="form-grid">
      <gems-input-mask 
        label="CPF" 
        mask="000.000.000-00"
        [(ngModel)]="formData.cpf"
        name="cpf"
        required>
      </gems-input-mask>

      <gems-input-date 
        label="Data de Nascimento"
        [(ngModel)]="formData.dataNascimento"
        name="dataNascimento"
        required>
      </gems-input-date>

      <gems-input-password 
        label="Senha de Acesso"
        [(ngModel)]="formData.senha"
        name="senha"
        required>
      </gems-input-password>
    </div>

    <gems-input-checkbox 
      label="Aceito os termos de uso e política de privacidade"
      [(ngModel)]="formData.aceitoTermos"
      name="termos">
    </gems-input-checkbox>

    <!-- Botões de Ação devem ficar dentro do footer-actions -->
    <div class="footer-actions">
      <button type="button" class="gems-btn gems-btn-secondary" (click)="onCancel()">
        Cancelar
      </button>
      <button type="submit" class="gems-btn gems-btn-primary" [disabled]="!formData.aceitoTermos">
        Salvar
      </button>
    </div>
  </form>
</gems-form-card>`
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { Component, inject } from '@angular/core';
import { GemsAlertService } from '@gabriel-mdias/angular-gems-sdk';

@Component({
  // ...
})
export class MeuFormularioComponent {
  private alertService = inject(GemsAlertService);

  formData = {
    cpf: '',
    dataNascimento: '',
    senha: '',
    aceitoTermos: false
  };

  onSubmit() {
    if (!this.formData.cpf || !this.formData.dataNascimento) {
      this.alertService.warning('Atenção', 'Preencha os campos obrigatórios.');
      return;
    }
    
    // Chamada simulada para API
    this.alertService.success('Sucesso', 'Usuário cadastrado com sucesso!');
  }

  onCancel() {
    this.alertService.info('Cancelado', 'Ação cancelada pelo usuário.');
  }
}`
    }
  ];

  constructor(private alertService: GemsAlertService) {}

  onSubmit() {
    if (!this.formData.cpf || !this.formData.dataNascimento || !this.formData.senha) {
      this.alertService.warning('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    this.alertService.success('Cadastro Realizado', 'Os dados foram salvos com sucesso.');
  }

  onCancel() {
    this.alertService.info('Operação Cancelada', 'O formulário foi limpo.');
    this.formData = {
      cpf: '',
      dataNascimento: '',
      senha: '',
      aceitoTermos: false
    };
  }
}
