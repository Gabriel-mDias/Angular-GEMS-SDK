import { Component } from '@angular/core';

import { GemsBadgeComponent, GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-badge-page',
  standalone: true,
  imports: [GemsFormCardComponent, GemsBadgeComponent, CodeSnippetComponent],
  templateUrl: './badge-page.component.html',
  styleUrls: ['./badge-page.component.css'],
})
export class BadgePageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Variantes: success | danger | warning | info | primary | neutral -->
<gems-badge label="Ativo" variant="success" icon="fa-solid fa-check"></gems-badge>
<gems-badge label="Pendente" variant="warning"></gems-badge>
<gems-badge label="Erro" variant="danger" icon="fa-solid fa-xmark"></gems-badge>
<gems-badge label="Info" variant="info"></gems-badge>

<!-- Uso dinâmico (ex: em uma tabela) -->
<gems-badge
  [label]="item.status"
  [variant]="getVariant(item.status)">
</gems-badge>`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsBadgeComponent, GemsBadgeVariant } from '@gabriel-mdias/angular-gems-sdk';

getVariant(status: string): GemsBadgeVariant {
  const map: Record<string, GemsBadgeVariant> = {
    ativo: 'success',
    inativo: 'neutral',
    pendente: 'warning',
    erro: 'danger',
  };
  return map[status] ?? 'neutral';
}`,
    },
  ];
}
