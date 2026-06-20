import { Component } from '@angular/core';

import { GemsFormCardComponent, GemsTab, GemsTabsComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-tabs-page',
  standalone: true,
  imports: [GemsFormCardComponent, GemsTabsComponent, CodeSnippetComponent],
  templateUrl: './tabs-page.component.html',
})
export class TabsPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  activeTab = 'dados';

  readonly tabs: GemsTab[] = [
    { id: 'dados', label: 'Dados Pessoais', icon: 'fa-solid fa-user' },
    { id: 'endereco', label: 'Endereço', icon: 'fa-solid fa-location-dot' },
    { id: 'config', label: 'Configurações', icon: 'fa-solid fa-gear' },
  ];

  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<gems-tabs [tabs]="tabs" [(activeId)]="activeTab">
  <!-- Conteúdo gerenciado pelo consumidor via @if -->
  @if (activeTab === 'dados') {
    <div role="tabpanel" id="panel-dados" aria-labelledby="tab-dados">
      <!-- ... conteúdo da aba ... -->
    </div>
  }
  @if (activeTab === 'config') {
    <app-config-tab></app-config-tab>
  }
</gems-tabs>`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsTabsComponent, GemsTab } from '@gabriel-mdias/angular-gems-sdk';

export class MinhaPagina {
  activeTab = 'dados';

  readonly tabs: GemsTab[] = [
    { id: 'dados', label: 'Dados', icon: 'fa-solid fa-user' },
    { id: 'config', label: 'Config', icon: 'fa-solid fa-gear', disabled: true },
  ];
}`,
    },
  ];
}
