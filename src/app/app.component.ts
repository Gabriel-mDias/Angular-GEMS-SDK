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
        label: 'Componentes',
        icon: 'fa-solid fa-puzzle-piece',
        route: '/components'
      }
    ]
  };
}
