import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Estado vazio para listas, tabelas ou seções sem dados.
 *
 * Uso:
 * ```html
 * <gems-empty-state
 *   icon="fa-solid fa-inbox"
 *   title="Nenhum resultado"
 *   description="Tente ajustar os filtros ou adicione novos itens."
 *   actionLabel="Adicionar"
 *   (actionClick)="onCreate()">
 * </gems-empty-state>
 * ```
 */
@Component({
  selector: 'gems-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './gems-empty-state.component.html',
  styleUrls: ['./gems-empty-state.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsEmptyStateComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly icon = input<string>('');
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly actionLabel = input<string>('');

  // ── Outputs ───────────────────────────────────────────────────────
  readonly actionClick = output<void>();
}
