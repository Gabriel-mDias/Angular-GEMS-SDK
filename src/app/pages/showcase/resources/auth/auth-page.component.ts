import { Component } from '@angular/core';

import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../../components/code-snippet';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [GemsFormCardComponent, CodeSnippetComponent],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css'],
})
export class AuthPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly guardTabs: CodeTab[] = [
    {
      name: 'app.routes.ts',
      language: 'typescript',
      code: `import { gemsRoleGuard } from '@gabriel-mdias/angular-gems-sdk';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [gemsRoleGuard(['ROLE_ADMIN'])],
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
  },
  {
    path: 'relatorios',
    canActivate: [gemsRoleGuard(['ROLE_ADMIN', 'ROLE_GERENTE'])],
    loadComponent: () => import('./relatorios/relatorios.component').then(m => m.RelatoriosComponent),
  },
];`,
    },
  ];

  readonly directiveTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Exibe o botão apenas para usuários com a role especificada -->
<button *hasRole="'ROLE_ADMIN'" class="btn-danger" (click)="excluir()">
  <i class="fa-solid fa-trash"></i> Excluir
</button>

<!-- Múltiplas roles (qualquer uma delas) -->
<div *hasRole="['ROLE_ADMIN', 'ROLE_GERENTE']">
  Conteúdo restrito
</div>`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsHasRoleDirective } from '@gabriel-mdias/angular-gems-sdk';

@Component({
  imports: [GemsHasRoleDirective],
  // ...
})
export class MeuComponente {}

// Requer keycloak-angular instalado como peer dependency:
// npm install keycloak-angular keycloak-js --legacy-peer-deps`,
    },
  ];

  readonly setupTabs: CodeTab[] = [
    {
      name: 'app.config.ts',
      language: 'typescript',
      code: `import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init({
    config: {
      url: 'https://auth.meuapp.com',
      realm: 'meu-realm',
      clientId: 'meu-client',
    },
    initOptions: { onLoad: 'login-required' },
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
  ],
};`,
    },
  ];
}
