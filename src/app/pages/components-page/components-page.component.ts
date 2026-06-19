import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GemsFormCardComponent,
  GemsInputDateComponent,
  GemsInputMaskComponent,
  GemsInputPasswordComponent,
  GemsInputRangeComponent,
  GemsInputCheckboxComponent,
  GemsSummaryCardComponent,
  GemsCardListSelectComponent,
  GemsTableComponent,
  GemsWizardComponent,
  GemsTableColumn,
  GemsTableAction
} from '@gabriel-mdias/angular-gems-sdk';

@Component({
  selector: 'app-components-page',
  standalone: true,
  imports: [
    CommonModule,
    GemsFormCardComponent,
    GemsInputDateComponent,
    GemsInputMaskComponent,
    GemsInputPasswordComponent,
    GemsInputRangeComponent,
    GemsInputCheckboxComponent,
    GemsSummaryCardComponent,
    GemsCardListSelectComponent,
    GemsTableComponent,
    GemsWizardComponent
  ],
  template: `
    <div class="showcase-page">
      <h1>Catálogo de Componentes GEMS SDK</h1>
      <p class="gems-text-muted">Explore os componentes disponíveis na SDK, construídos com Angular 20 Signals e Standalone Components.</p>
      
      <hr class="divider">

      <section class="component-section">
        <h2>1. Inputs & Formulários</h2>
        <div class="gems-grid-2">
          <gems-form-card title="Inputs Básicos" icon="fa-solid fa-keyboard">
            <div class="form-group">
              <gems-input-mask label="CPF" mask="000.000.000-00"></gems-input-mask>
              <gems-input-date label="Data de Nascimento"></gems-input-date>
              <gems-input-password label="Senha de Acesso"></gems-input-password>
              <label>Volume</label>
              <gems-input-range></gems-input-range>
              <br>
              <gems-input-checkbox label="Aceito os termos e condições"></gems-input-checkbox>
            </div>
          </gems-form-card>
        </div>
      </section>

      <section class="component-section">
        <h2>2. Layout & Cards</h2>
        <div class="gems-grid-2">
          <gems-summary-card title="Resumo do Paciente" icon="fa-solid fa-user-doctor">
            <div summary>João da Silva - 45 anos</div>
            <div details>
              <p>Pressão: 120/80</p>
              <p>Histórico: Hipertenso, acompanhamento regular.</p>
              <p>Última consulta: 10/05/2026</p>
            </div>
          </gems-summary-card>

          <gems-card-list-select 
            [items]="selectionItems" 
            titleKey="name" 
            subtitleKey="role" 
            icon="fa-solid fa-user-nurse"
            [multiple]="true">
          </gems-card-list-select>
        </div>
      </section>

      <section class="component-section">
        <h2>3. Data Display (Tabelas)</h2>
        <gems-table 
          [columns]="tableColumns" 
          [data]="tableData" 
          [actions]="tableActions"
          [totalRecords]="tableData.length"
          (actionClick)="onTableAction($event)">
        </gems-table>
      </section>

      <section class="component-section">
        <h2>4. Wizard Steps</h2>
        <gems-wizard [steps]="wizardSteps" [currentStep]="1"></gems-wizard>
      </section>

    </div>
  `,
  styles: [`
    .divider {
      border: none;
      border-top: 1px solid var(--gems-border-color);
      margin: var(--gems-spacing-xl) 0;
    }
    .component-section {
      margin-bottom: var(--gems-spacing-3xl);
    }
    .component-section h2 {
      font-size: var(--gems-font-size-xl);
      margin-bottom: var(--gems-spacing-lg);
      color: var(--gems-primary-700);
      border-bottom: 2px solid var(--gems-primary-100);
      padding-bottom: var(--gems-spacing-sm);
      display: inline-block;
    }
    .gems-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--gems-spacing-xl);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--gems-spacing-md);
    }
    
    @media (max-width: 768px) {
      .gems-grid-2 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ComponentsPageComponent {
  selectionItems = [
    { id: '1', name: 'Dr. Carlos Souza', role: 'Cardiologista' },
    { id: '2', name: 'Dra. Ana Lima', role: 'Pediatra' },
    { id: '3', name: 'Dr. Marcos Silva', role: 'Ortopedista' },
  ];

  tableColumns: GemsTableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Nome do Paciente', sortable: true },
    {
      field: 'status', header: 'Status', type: 'badge', badgeColors: {
        'Ativo': { bg: '#dcfce7', text: '#166534' },
        'Inativo': { bg: '#fee2e2', text: '#991b1b' }
      }
    },
    { field: 'actions', header: 'Ações', type: 'actions' }
  ];

  tableData = [
    { id: 101, name: 'Roberto Carlos', status: 'Ativo' },
    { id: 102, name: 'Maria da Graça', status: 'Inativo' },
    { id: 103, name: 'José Mendes', status: 'Ativo' },
  ];

  tableActions: GemsTableAction[] = [
    { actionName: 'edit', icon: 'fa-solid fa-pen', tooltip: 'Editar' },
    { actionName: 'delete', icon: 'fa-solid fa-trash', tooltip: 'Excluir', colorClass: 'gems-text-error' }
  ];

  wizardSteps = [
    { label: 'Dados Pessoais', icon: 'fa-solid fa-user' },
    { label: 'Endereço', icon: 'fa-solid fa-map-location-dot' },
    { label: 'Pagamento', icon: 'fa-solid fa-credit-card' },
    { label: 'Confirmação', icon: 'fa-solid fa-check-circle' }
  ];

  onTableAction(event: any) {
    alert(`Ação ${event.action} disparada para o ID ${event.row.id}`);
  }
}
