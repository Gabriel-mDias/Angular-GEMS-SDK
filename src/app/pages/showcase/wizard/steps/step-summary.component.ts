import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsSummaryCardComponent, GemsFormCardComponent, GemsAlertService } from '@gabriel-mdias/angular-gems-sdk';
import { PatientStateService } from '../patient-state.service';

@Component({
  selector: 'app-step-summary',
  standalone: true,
  imports: [CommonModule, GemsSummaryCardComponent, GemsFormCardComponent],
  templateUrl: './step-summary.component.html',
  styles: [`
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
  `]
})
export class StepSummaryComponent {
  prev = output<void>();
  finish = output<void>();
  
  state: any;

  constructor(
    private patientService: PatientStateService,
    private alertService: GemsAlertService
  ) {
    this.state = this.patientService.state;
  }

  onPrev() {
    this.prev.emit();
  }

  onFinish() {
    this.alertService.success('Cadastro Finalizado', 'Paciente cadastrado com sucesso!');
    this.finish.emit();
  }
}
