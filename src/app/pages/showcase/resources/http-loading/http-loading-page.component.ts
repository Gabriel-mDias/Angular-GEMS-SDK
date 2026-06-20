import { Component } from '@angular/core';

import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../../components/code-snippet';

@Component({
  selector: 'app-http-loading-page',
  standalone: true,
  imports: [GemsFormCardComponent, CodeSnippetComponent],
  templateUrl: './http-loading-page.component.html',
  styleUrls: ['./http-loading-page.component.css'],
})
export class HttpLoadingPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly codeTabs: CodeTab[] = [
    {
      name: 'app.config.ts',
      language: 'typescript',
      code: `import {
  provideGemsTheme,
  gemsLoadingInterceptor,
} from '@gabriel-mdias/angular-gems-sdk';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([gemsLoadingInterceptor]),
    ),
    provideGemsTheme({ /* ... */ }),
  ],
};`,
    },
    {
      name: 'app.component.html',
      language: 'html',
      code: `<!-- Adicionar o container do loading no layout raiz -->
<gems-loading></gems-loading>
<router-outlet></router-outlet>`,
    },
    {
      name: 'Manual',
      language: 'typescript',
      code: `import { GemsLoadingService } from '@gabriel-mdias/angular-gems-sdk';

@Component({ ... })
export class MeuComponente {
  constructor(private loadingService: GemsLoadingService) {}

  async salvar(): Promise<void> {
    this.loadingService.show();
    try {
      await this.meuStore.salvar(dados).toPromise();
    } finally {
      this.loadingService.hide();
    }
  }

  // Verificar estado atual
  get carregando(): boolean {
    return this.loadingService.isLoading();
  }
}`,
    },
  ];
}
