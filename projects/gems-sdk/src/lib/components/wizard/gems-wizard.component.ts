import { Component, input, output } from '@angular/core';

import { GemsWizardStep } from './gems-wizard.model';

/**
 * Barra de progresso para formulários multi-passo.
 * Exibe o estado (pendente, ativo, concluído) de cada step e permite
 * navegação para steps anteriores via click.
 */
@Component({
  selector: 'gems-wizard',
  standalone: true,
  imports: [],
  templateUrl: './gems-wizard.component.html',
  styleUrls: ['./gems-wizard.component.css'],
})
export class GemsWizardComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly steps = input<GemsWizardStep[]>([]);
  readonly currentStep = input<number>(1);

  // ── Outputs ───────────────────────────────────────────────────────
  readonly stepChange = output<number>();

  // ── Métodos públicos ──────────────────────────────────────────────
  onStepClick(index: number): void {
    if (index < this.currentStep()) {
      this.stepChange.emit(index);
    }
  }
}
