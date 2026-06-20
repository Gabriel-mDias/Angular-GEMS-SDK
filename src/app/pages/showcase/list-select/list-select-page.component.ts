import { Component } from '@angular/core';

import { GemsFormCardComponent, GemsCardListSelectComponent, GemsSelectItem } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-list-select-page',
  standalone: true,
  imports: [GemsFormCardComponent, GemsCardListSelectComponent, CodeSnippetComponent],
  templateUrl: './list-select-page.component.html',
})
export class ListSelectPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  selectedPlan: string | null = 'pro';

  readonly planItems: GemsSelectItem[] = [
    { value: 'basic', title: 'Básico', description: 'Ideal para iniciantes e pequenos projetos.' },
    { value: 'pro', title: 'Profissional', description: 'Recursos avançados para equipes em crescimento.' },
    { value: 'enterprise', title: 'Corporativo', description: 'Solução completa com suporte dedicado.' },
  ];

  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<gems-card-list-select
  [items]="planItems"
  [selectedId]="selectedPlan"
  (selectedIdChange)="selectedPlan = $event"
  idKey="value"
  titleKey="title"
  subtitleKey="description"
  icon="fa-solid fa-layer-group">
</gems-card-list-select>

<!-- Seleção múltipla -->
<gems-card-list-select
  [items]="planItems"
  [selectedIds]="selectedPlans"
  (selectedIdsChange)="selectedPlans = $event"
  [multiple]="true"
  idKey="value"
  titleKey="title">
</gems-card-list-select>`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsSelectItem } from '@gabriel-mdias/angular-gems-sdk';

export class MinhaPagina {
  selectedPlan = 'pro';

  // GemsSelectItem = Record<string, unknown>
  planItems: GemsSelectItem[] = [
    { value: 'basic', title: 'Básico', description: 'Ideal para iniciantes.' },
    { value: 'pro', title: 'Profissional', description: 'Recursos avançados.' },
  ];
}`,
    },
  ];
}
