import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  GemsSideMenuComponent,
  GemsSideMenuConfig,
  GemsToastContainerComponent,
} from '@gabriel-mdias/angular-gems-sdk';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GemsSideMenuComponent, GemsToastContainerComponent],
  template: `
    <gems-toast-container></gems-toast-container>
    <div class="showcase-layout" [class.mobile-menu-open]="mobileMenuOpen">
      <gems-side-menu
        [config]="menuConfig"
        [userName]="mockUserName"
        [userEmail]="mockUserEmail"
        [userInitials]="mockUserInitials"
        (logoutClick)="handleLogout()"
      ></gems-side-menu>

      <main class="showcase-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly menuConfig: GemsSideMenuConfig = {
    headerTitle: 'GEMS SDK',
    items: [
      {
        label: 'Início',
        icon: 'fa-solid fa-house',
        route: '/',
      },
      // ── Formulários ───────────────────────────────────────────────
      {
        label: 'Input Text',
        icon: 'fa-solid fa-i-cursor',
        route: '/showcase/input-text',
      },
      {
        label: 'Select',
        icon: 'fa-solid fa-chevron-down',
        route: '/showcase/select',
      },
      {
        label: 'Textarea',
        icon: 'fa-solid fa-align-left',
        route: '/showcase/textarea',
      },
      {
        label: 'Field Error',
        icon: 'fa-solid fa-triangle-exclamation',
        route: '/showcase/field-error',
      },
      {
        label: 'Formulários',
        icon: 'fa-solid fa-keyboard',
        route: '/showcase/forms',
      },
      // ── Botões ────────────────────────────────────────────────────
      {
        label: 'Botões',
        icon: 'fa-solid fa-square-caret-right',
        route: '/showcase/buttons',
      },
      // ── Exibição de dados ─────────────────────────────────────────
      {
        label: 'Tabela',
        icon: 'fa-solid fa-table-list',
        route: '/showcase/search',
      },
      {
        label: 'Card List Select',
        icon: 'fa-solid fa-grip',
        route: '/showcase/list-select',
      },
      {
        label: 'Badge',
        icon: 'fa-solid fa-tag',
        route: '/showcase/badge',
      },
      {
        label: 'Empty State',
        icon: 'fa-solid fa-inbox',
        route: '/showcase/empty-state',
      },
      // ── Feedback ─────────────────────────────────────────────────
      {
        label: 'Alerts',
        icon: 'fa-solid fa-bell',
        route: '/showcase/alerts',
      },
      {
        label: 'Toast',
        icon: 'fa-solid fa-comment-dots',
        route: '/showcase/toast',
      },
      {
        label: 'Modal',
        icon: 'fa-solid fa-window-restore',
        route: '/showcase/modal',
      },
      {
        label: 'Loading: Full Page',
        icon: 'fa-solid fa-spinner',
        route: '/showcase/loading/full-page',
      },
      {
        label: 'Loading: Skeleton',
        icon: 'fa-solid fa-bone',
        route: '/showcase/loading/skeleton',
      },
      // ── Navegação / Layout ────────────────────────────────────────
      {
        label: 'Tabs',
        icon: 'fa-solid fa-folder',
        route: '/showcase/tabs',
      },
      {
        label: 'Wizard',
        icon: 'fa-solid fa-wand-magic-sparkles',
        route: '/showcase/wizard',
      },
      {
        label: 'File Upload',
        icon: 'fa-solid fa-cloud-arrow-up',
        route: '/showcase/file-upload',
      },
      // ── Recursos ─────────────────────────────────────────────────
      {
        label: 'Tema dinâmico',
        icon: 'fa-solid fa-palette',
        route: '/showcase/resources/theming',
      },
      {
        label: 'HTTP / BaseStore',
        icon: 'fa-solid fa-server',
        route: '/showcase/resources/base-store',
      },
      {
        label: 'Loading Interceptor',
        icon: 'fa-solid fa-circle-notch',
        route: '/showcase/resources/http-loading',
      },
      {
        label: 'Serviços',
        icon: 'fa-solid fa-toolbox',
        route: '/showcase/resources/services',
      },
      {
        label: 'Auth & Keycloak',
        icon: 'fa-solid fa-shield-halved',
        route: '/showcase/resources/auth',
      },
      {
        label: 'Integração IA',
        icon: 'fa-solid fa-robot',
        route: '/showcase/resources/ai-integration',
      },
    ],
  };

  mockUserName = 'Administrador Sistema';
  mockUserEmail = 'admin@gems.com';
  mockUserInitials = 'AS';
  mobileMenuOpen = false;

  // ── Métodos públicos ──────────────────────────────────────────────
  handleLogout(): void {
    console.log('Logout clicked');
  }
}
