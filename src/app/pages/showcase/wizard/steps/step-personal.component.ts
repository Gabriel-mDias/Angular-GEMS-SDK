import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GemsInputMaskComponent, GemsInputDateComponent } from '@gabriel-mdias/angular-gems-sdk';
import { PatientStateService } from '../patient-state.service';

@Component({
  selector: 'app-step-personal',
  standalone: true,
  imports: [CommonModule, FormsModule, GemsInputMaskComponent, GemsInputDateComponent],
  template: `
    <div class="step-container">
      <h3>Dados Pessoais</h3>
      <p class="gems-text-muted">Preencha os dados de identificação do paciente.</p>
      
      <div class="form-grid">
        <div class="form-field">
          <label>Nome Completo</label>
          <input type="text" class="gems-input" [(ngModel)]="state.nome">
        </div>
        <gems-input-mask label="CPF" mask="000.000.000-00" [(ngModel)]="state.cpf"></gems-input-mask>
        <gems-input-date label="Data de Nascimento" [(ngModel)]="state.dataNascimento"></gems-input-date>
      </div>

      <div class="step-actions">
        <button type="button" class="gems-btn-primary" (click)="onNext()">Próximo Passo <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  `,
  styles: [`
    .step-container { padding: 20px 0; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
    .form-field { display: flex; flex-direction: column; gap: 8px; }
    .form-field label { font-size: 14px; font-weight: 500; }
    .gems-input { padding: 10px; border: 1px solid var(--gems-border-color); border-radius: 8px; }
    .gems-input:focus { outline: none; border-color: var(--gems-primary-500); }
    .step-actions { margin-top: 30px; display: flex; justify-content: flex-end; }
    .gems-btn-primary { background: var(--gems-primary-500); color: #fff; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; }
  `]
})
export class StepPersonalComponent {
  next = output<void>();
  patientService = inject(PatientStateService);
  state = this.patientService.state;

  onNext() {
    this.patientService.updatePersonal(this.state);
    this.next.emit();
  }
}
