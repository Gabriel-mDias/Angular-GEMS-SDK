import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GemsSideMenuComponent, GemsSideMenuConfig } from '@gabriel-mdias/angular-gems-sdk';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GemsSideMenuComponent],
  template: `
    <div class="showcase-layout">
      <gems-side-menu [config]="menuConfig"></gems-side-menu>
      
      <main class="showcase-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  menuConfig: GemsSideMenuConfig = {
    headerTitle: 'GEMS SDK',
    items: [
      {
        label: 'Formulários',
        icon: 'fa-solid fa-keyboard',
        route: '/showcase/forms'
      },
      {
        label: 'Busca e Listagem',
        icon: 'fa-solid fa-table-list',
        route: '/showcase/search'
      },
      {
        label: 'Fluxo Wizard',
        icon: 'fa-solid fa-wand-magic-sparkles',
        route: '/showcase/wizard'
      },
      {
        label: 'Alertas e Notificações',
        icon: 'fa-solid fa-bell',
        route: '/showcase/alerts'
      }
    ]
  };
}
