import { Component } from '@angular/core';

import { GemsEmptyStateComponent, GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-empty-state-page',
  standalone: true,
  imports: [GemsFormCardComponent, GemsEmptyStateComponent, CodeSnippetComponent],
  templateUrl: './empty-state-page.component.html',
  styleUrls: ['./empty-state-page.component.css'],
})
export class EmptyStatePageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Com botão de ação -->
<gems-empty-state
  icon="fa-solid fa-users"
  title="Nenhum usuário encontrado"
  description="Adicione o primeiro usuário para começar."
  actionLabel="Adicionar Usuário"
  (actionClick)="onCreate()">
</gems-empty-state>

<!-- Apenas informativo, sem ação -->
<gems-empty-state
  icon="fa-solid fa-magnifying-glass"
  title="Sem resultados"
  description="Tente ajustar os filtros de busca.">
</gems-empty-state>

<!-- Uso típico: condicional em listas -->
@if (items.length === 0) {
  <gems-empty-state icon="fa-solid fa-inbox" title="Nenhum item" ...>
  </gems-empty-state>
}`,
    },
  ];

  // ── Métodos públicos ──────────────────────────────────────────────
  onAddUser(): void {
    console.log('Adicionar usuário');
  }
}
