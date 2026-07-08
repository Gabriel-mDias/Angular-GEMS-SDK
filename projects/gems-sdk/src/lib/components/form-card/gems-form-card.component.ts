import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

/**
 * Card estruturado com cabeçalho (título, subtítulo, ações), área de
 * conteúdo com skeleton loading integrado e rodapé projetado via slots.
 *
 * Slots disponíveis:
 *   [gems-form-card-title]   — título customizado (substitui o input title)
 *   [gems-form-card-subtitle]— subtítulo customizado
 *   [gems-form-card-actions] — botões de ação no cabeçalho
 *   [gems-form-card-footer]  — rodapé do card
 *   (conteúdo padrão)        — corpo do formulário
 */
@Component({
  selector: 'gems-form-card',
  standalone: true,
  imports: [],
  templateUrl: './gems-form-card.component.html',
  styleUrls: ['./gems-form-card.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsFormCardComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly icon = input<string>();
  readonly isLoading = input<boolean>(false);
}
