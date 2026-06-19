import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsSummaryCardComponent, GemsAlertService } from '@gabriel-mdias/angular-gems-sdk';
import { PatientStateService } from '../patient-state.service';

@Component({
  selector: 'app-step-summary',
  standalone: true,
  imports: [CommonModule, GemsSummaryCardComponent],
  template: `
    <div class="step-container">
      <h3>Resumo do Cadastro</h3>
      <p class="gems-text-muted">Revise os dados antes de finalizar o cadastro.</p>
      
      <div class="summary-grid">
        <gems-summary-card title="Dados Pessoais" icon="fa-solid fa-user">
          <div summary>{{ state.nome || 'Não informado' }}</div>
          <div details>
            <p><strong>CPF:</strong> {{ state.cpf || 'Não informado' }}</p>
            <p><strong>Data de Nasc.:</strong> {{ state.dataNascimento || 'Não informado' }}</p>
          </div>
        </gems-summary-card>

        <gems-summary-card title="Endereço" icon="fa-solid fa-map-location-dot">
          <div summary>{{ state.logradouro ? state.logradouro + ', ' + state.numero : 'Não informado' }}</div>
          <div details>
            <p><strong>CEP:</strong> {{ state.cep || 'Não informado' }}</p>
          </div>
        </gems-summary-card>
      </div>

      <div class="step-actions">
        <button type="button" class="gems-btn-secondary" (click)="onPrev()"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
        <button type="button" class="gems-btn-primary" (click)="onFinish()"><i class="fa-solid fa-check"></i> Finalizar Cadastro</button>
      </div>
    </div>
  `,
  styles: [`
    .step-container { padding: 20px 0; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
    .step-actions { margin-top: 30px; display: flex; justify-content: space-between; }
    .gems-btn-primary { background: var(--gems-primary-500); color: #fff; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; }
    .gems-btn-secondary { background: #fff; color: var(--gems-text-color); border: 1px solid var(--gems-border-color); padding: 10px 20px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; }
  `]
})
export class StepSummaryComponent {
  prev = output<void>();
  finish = output<void>();
  
  patientService = inject(PatientStateService);
  alertService = inject(GemsAlertService);
  state = this.patientService.state;

  onPrev() {
    this.prev.emit();
  }

  onFinish() {
    this.alertService.success('Cadastro Finalizado', 'Paciente cadastrado com sucesso!');
    this.finish.emit();
  }
}
