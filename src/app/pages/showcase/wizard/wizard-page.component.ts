import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsWizardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { StepPersonalComponent } from './steps/step-personal.component';
import { StepAddressComponent } from './steps/step-address.component';
import { StepSummaryComponent } from './steps/step-summary.component';
import { PatientStateService } from './patient-state.service';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-wizard-page',
  standalone: true,
  imports: [
    CommonModule, 
    GemsWizardComponent,
    StepPersonalComponent,
    StepAddressComponent,
    StepSummaryComponent,
    CodeSnippetComponent
  ],
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css']
})
export class WizardPageComponent {
  patientService = inject(PatientStateService);
  
  currentStep = 1;

  steps = [
    { label: 'Dados Pessoais', icon: 'fa-solid fa-user' },
    { label: 'Endereço', icon: 'fa-solid fa-map-location-dot' },
    { label: 'Resumo', icon: 'fa-solid fa-check-circle' }
  ];

  codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Utilizamos o gems-wizard para gerenciar o cabeçalho de progresso -->
<gems-wizard [steps]="steps" [currentStep]="currentStep"></gems-wizard>

<!-- Cada step é renderizado independentemente com a sua lógica -->
<div class="wizard-content">
  <app-step-personal 
    *ngIf="currentStep === 1" 
    (next)="goToStep(2)">
  </app-step-personal>

  <app-step-address 
    *ngIf="currentStep === 2" 
    (prev)="goToStep(1)" 
    (next)="goToStep(3)">
  </app-step-address>

  <app-step-summary 
    *ngIf="currentStep === 3" 
    (prev)="goToStep(2)" 
    (finish)="finishFlow()">
  </app-step-summary>
</div>`
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { Component } from '@angular/core';

@Component({
  // ...
})
export class WizardPageComponent {
  currentStep = 1;

  steps = [
    { label: 'Dados Pessoais', icon: 'fa-solid fa-user' },
    { label: 'Endereço', icon: 'fa-solid fa-map-location-dot' },
    { label: 'Resumo', icon: 'fa-solid fa-check-circle' }
  ];

  goToStep(step: number) {
    this.currentStep = step;
  }

  finishFlow() {
    // Redireciona para listagem após finalizar
    this.currentStep = 1;
    this.patientService.clear();
  }
}`
    }
  ];

  goToStep(step: number) {
    this.currentStep = step;
  }

  finishFlow() {
    this.currentStep = 1;
    this.patientService.clear();
  }
}
