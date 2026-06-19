import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GemsWizardStep {
  label: string;
  icon?: string;
  isValid?: boolean; // Optional flag if the parent wants to indicate validity
}

@Component({
  selector: 'gems-wizard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gems-wizard-container">
      <div class="gems-wizard-header">
        <div class="gems-wizard-stepper">
          <ng-container *ngFor="let step of steps(); let i = index">
            
            <!-- Step Item -->
            <div class="gems-step-item" 
                 [class.gems-active]="currentStep() === i"
                 [class.gems-completed]="currentStep() > i"
                 (click)="onStepClick(i)">
              
              <div class="gems-step-circle">
                <i *ngIf="currentStep() > i" class="fa-solid fa-check"></i>
                <i *ngIf="currentStep() <= i && step.icon" [class]="step.icon"></i>
                <span *ngIf="currentStep() <= i && !step.icon">{{ i + 1 }}</span>
              </div>
              
              <span class="gems-step-label">{{ step.label }}</span>
            </div>

            <!-- Connector Line -->
            <div class="gems-step-connector" 
                 *ngIf="i < steps().length - 1"
                 [class.gems-active]="currentStep() > i">
            </div>

          </ng-container>
        </div>
      </div>

      <div class="gems-wizard-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./gems-wizard.component.css']
})
export class GemsWizardComponent {
  steps = input<GemsWizardStep[]>([]);
  currentStep = input<number>(0);
  
  stepChange = output<number>();

  onStepClick(index: number) {
    // Optional: allow clicking on previous steps to go back
    if (index < this.currentStep()) {
      this.stepChange.emit(index);
    }
  }
}
