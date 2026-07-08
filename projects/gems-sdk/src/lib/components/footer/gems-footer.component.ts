import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

import { GemsFooterLink } from './gems-footer.model';

/**
 * Rodapé padrão da aplicação.
 * Exibe copyright e links configuráveis via inputs.
 */
@Component({
  selector: 'gems-footer',
  standalone: true,
  imports: [],
  templateUrl: './gems-footer.component.html',
  styleUrls: ['./gems-footer.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsFooterComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly copyright = input<string>();
  readonly links = input<GemsFooterLink[]>([]);

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly currentYear = new Date().getFullYear();
}
