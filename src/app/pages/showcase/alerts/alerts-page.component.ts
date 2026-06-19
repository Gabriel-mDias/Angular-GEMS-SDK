import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsFormCardComponent, GemsAlertService } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule, GemsFormCardComponent, CodeSnippetComponent],
  templateUrl: './alerts-page.component.html',
  styleUrls: ['./alerts-page.component.css']
})
export class AlertsPageComponent {
  constructor(private alertService: GemsAlertService) {}

  codeTabs: CodeTab[] = [
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { Component, inject } from '@angular/core';
import { GemsAlertService } from 'gems-sdk';

@Component({ ... })
export class MeuComponente {
  constructor(private alertService: GemsAlertService) {}

  showSuccess() {
    this.alertService.success('Operação Concluída', 'Registro salvo com sucesso no banco de dados.');
  }

  showError() {
    this.alertService.error('Falha de Sistema', 'Não foi possível conectar ao servidor. Tente novamente mais tarde.');
  }

  showWarning() {
    this.alertService.warning('Sessão Expirando', 'Sua sessão irá expirar em 5 minutos.');
  }

  showInfo() {
    this.alertService.info('Nova Atualização', 'Uma nova versão do sistema está disponível.');
  }

  async askConfirmation() {
    const result = await this.alertService.confirm(
      'Excluir Registro', 
      'Tem certeza que deseja excluir o paciente? Esta ação não pode ser desfeita.'
    );
    
    if (result.isConfirmed) {
      this.alertService.success('Excluído', 'O paciente foi excluído.');
    } else {
      this.alertService.info('Cancelado', 'A exclusão foi cancelada.');
    }
  }

  handleApiError() {
    // Simula um erro vindo de um HttpInterceptor ou chamada HTTP
    const apiError = {
      error: {
        message: 'O CPF informado já está em uso por outro usuário.'
      }
    };
    this.alertService.errorFromApi(apiError);
  }
}`
    }
  ];

  showSuccess() {
    this.alertService.success('Operação Concluída', 'Registro salvo com sucesso no banco de dados.');
  }

  showError() {
    this.alertService.error('Falha de Sistema', 'Não foi possível conectar ao servidor. Tente novamente mais tarde.');
  }

  showWarning() {
    this.alertService.warning('Sessão Expirando', 'Sua sessão irá expirar em 5 minutos.');
  }

  showInfo() {
    this.alertService.info('Nova Atualização', 'Uma nova versão do sistema está disponível.');
  }

  async askConfirmation() {
    const result = await this.alertService.confirm('Excluir Registro', 'Tem certeza que deseja excluir o paciente? Esta ação não pode ser desfeita.');
    if (result.isConfirmed) {
      this.alertService.success('Excluído', 'O paciente foi excluído.');
    } else {
      this.alertService.info('Cancelado', 'A exclusão foi cancelada.');
    }
  }

  handleApiError() {
    const apiError = {
      error: {
        message: 'O CPF informado já está em uso por outro usuário.'
      }
    };
    this.alertService.errorFromApi(apiError);
  }
}
