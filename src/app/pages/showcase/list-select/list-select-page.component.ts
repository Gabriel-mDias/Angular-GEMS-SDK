import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GemsFormCardComponent, GemsCardListSelectComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-list-select-page',
  standalone: true,
  imports: [CommonModule, FormsModule, GemsFormCardComponent, GemsCardListSelectComponent, CodeSnippetComponent],
  template: `
    <div class="showcase-page fade-in">
      <div class="header">
        <div class="header-titles">
          <h2>Card List Select</h2>
          <p class="subtitle">Componente para seleção visual de opções em formato de cards.</p>
        </div>
      </div>
      
      <div class="demo-section">
        <div class="demo-preview">
          <gems-form-card title="Seleção de Plano" icon="fa-solid fa-list-check">
            <div style="padding-bottom: 2rem;">
              <gems-card-list-select
                [items]="planItems"
                [(selectedId)]="selectedPlan"
                idKey="value"
                titleKey="title"
                subtitleKey="description"
                icon="fa-solid fa-layer-group"
              ></gems-card-list-select>
            </div>

            <div gems-form-card-footer *ngIf="selectedPlan">
              Plano Selecionado: <strong>{{ selectedPlan }}</strong>
            </div>
          </gems-form-card>
        </div>

        <div class="demo-code">
          <app-code-snippet [tabs]="codeTabs"></app-code-snippet>
        </div>
      </div>
    </div>
  `
})
export class ListSelectPageComponent {
  selectedPlan: string = 'pro';

  planItems: any[] = [
    {
      value: 'basic',
      icon: 'fa-solid fa-paper-plane',
      title: 'Básico',
      description: 'Ideal para iniciantes e pequenos projetos.'
    },
    {
      value: 'pro',
      icon: 'fa-solid fa-rocket',
      title: 'Profissional',
      description: 'Recursos avançados para equipes em crescimento.'
    },
    {
      value: 'enterprise',
      icon: 'fa-solid fa-building',
      title: 'Corporativo',
      description: 'Solução completa com suporte dedicado.'
    }
  ];

  codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<gems-card-list-select
  [items]="planItems"
  [(selectedId)]="selectedPlan"
  idKey="value"
  titleKey="title"
  subtitleKey="description"
  icon="fa-solid fa-layer-group">
</gems-card-list-select>`
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `export class MinhaPagina {
  selectedPlan: string = 'pro';

  planItems = [
    {
      value: 'basic',
      icon: 'fa-solid fa-paper-plane',
      title: 'Básico',
      description: 'Ideal para iniciantes.'
    },
    {
      value: 'pro',
      icon: 'fa-solid fa-rocket',
      title: 'Profissional',
      description: 'Recursos avançados.'
    }
  ];
}`
    }
  ];
}
