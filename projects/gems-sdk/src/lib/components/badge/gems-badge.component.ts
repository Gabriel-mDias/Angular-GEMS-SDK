import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { GemsBadgeVariant } from './gems-badge.model';

/**
 * Indicador de status inline (badge/tag).
 *
 * Uso:
 * ```html
 * <gems-badge label="Ativo" variant="success" icon="fa-solid fa-check"></gems-badge>
 * <gems-badge label="Pendente" variant="warning"></gems-badge>
 * ```
 */
@Component({
  selector: 'gems-badge',
  standalone: true,
  imports: [],
  templateUrl: './gems-badge.component.html',
  styleUrls: ['./gems-badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsBadgeComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('');
  readonly variant = input<GemsBadgeVariant>('neutral');
  readonly icon = input<string>('');
}
