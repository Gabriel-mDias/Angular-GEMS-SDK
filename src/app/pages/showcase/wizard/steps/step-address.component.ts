import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GemsInputMaskComponent } from '@gabriel-mdias/angular-gems-sdk';
import { PatientStateService } from '../patient-state.service';

@Component({
  selector: 'app-step-address',
  standalone: true,
  imports: [CommonModule, FormsModule, GemsInputMaskComponent],
  template: `
    <div class="step-container">
      <h3>Endereço</h3>
      <p class="gems-text-muted">Preencha o endereço de residência.</p>
      
      <div class="form-grid">
        <gems-input-mask label="CEP" mask="00000-000" [(ngModel)]="state.cep"></gems-input-mask>
        <div class="form-field span-2">
          <label>Logradouro</label>
          <input type="text" class="gems-input" [(ngModel)]="state.logradouro">
        </div>
        <div class="form-field">
          <label>Número</label>
          <input type="text" class="gems-input" [(ngModel)]="state.numero">
        </div>
      </div>

      <div class="step-actions">
        <button type="button" class="gems-btn-secondary" (click)="onPrev()"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
        <button type="button" class="gems-btn-primary" (click)="onNext()">Próximo Passo <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  `,
  styles: [`
    .step-container { padding: 20px 0; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px; }
    .span-2 { grid-column: span 2; }
    .form-field { display: flex; flex-direction: column; gap: 8px; }
    .form-field label { font-size: 14px; font-weight: 500; }
    .gems-input { padding: 10px; border: 1px solid var(--gems-border-color); border-radius: 8px; }
    .gems-input:focus { outline: none; border-color: var(--gems-primary-500); }
    .step-actions { margin-top: 30px; display: flex; justify-content: space-between; }
    .gems-btn-primary { background: var(--gems-primary-500); color: #fff; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; }
    .gems-btn-secondary { background: #fff; color: var(--gems-text-color); border: 1px solid var(--gems-border-color); padding: 10px 20px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; }
    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .span-2 { grid-column: span 1; }
    }
  `]
})
export class StepAddressComponent {
  next = output<void>();
  prev = output<void>();
  patientService = inject(PatientStateService);
  state = this.patientService.state;

  onNext() {
    this.patientService.updateAddress(this.state);
    this.next.emit();
  }

  onPrev() {
    this.patientService.updateAddress(this.state);
    this.prev.emit();
  }
}
