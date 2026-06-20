import { Component, input, model } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

/**
 * Card colapsável com cabeçalho clicável e animação de expand/collapse.
 *
 * Slots:
 *   [summary]  — preview exibido quando colapsado
 *   [details]  — conteúdo completo exibido quando expandido
 */
@Component({
  selector: 'gems-summary-card',
  standalone: true,
  imports: [],
  templateUrl: './gems-summary-card.component.html',
  styleUrls: ['./gems-summary-card.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden', padding: '0' })),
      state('expanded', style({ height: '*', opacity: 1, padding: '*' })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class GemsSummaryCardComponent {
  // ── Inputs / Two-way bindings ─────────────────────────────────────
  readonly title = input<string>('');
  readonly icon = input<string>('');
  expanded = model<boolean>(false);

  // ── Métodos públicos ──────────────────────────────────────────────
  toggle(): void {
    this.expanded.update(v => !v);
  }
}
