import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  GemsFormCardComponent,
  GemsLoadingComponent,
  GemsLoadingService
} from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-loading-full-page',
  standalone: true,
  imports: [CommonModule, FormsModule, GemsFormCardComponent, GemsLoadingComponent, CodeSnippetComponent],
  templateUrl: './loading-full-page.component.html',
  styleUrls: ['./loading-full-page.component.css']
})
export class LoadingFullPageComponent {
  private loadingService = inject(GemsLoadingService);
  
  durationSeconds = 3;

  codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Adicione o componente de loading uma única vez, preferencialmente na raiz (ex: app.component.html) -->
<gems-loading></gems-loading>

<!-- Outros componentes da sua aplicação -->
<router-outlet></router-outlet>`
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { Component } from '@angular/core';
import { GemsLoadingService } from '@gabriel-mdias/angular-gems-sdk';

@Component({
  selector: 'meu-componente',
  template: \`
    <button (click)="salvarDados()">Salvar com Loading</button>
  \`
})
export class MeuComponente {
  constructor(private loadingService: GemsLoadingService) {}

  salvarDados() {
    // Caso não queira usar o Interceptor, pode controlar manualmente
    this.loadingService.show();

    // Simulando uma requisição HTTP
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }
}`
    },
    {
      name: 'Configuração (Interceptor)',
      language: 'typescript',
      code: `import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { gemsLoadingInterceptor } from '@gabriel-mdias/angular-gems-sdk';

export const appConfig: ApplicationConfig = {
  providers: [
    // Registra o interceptor globalmente. Toda requisição HTTP
    // irá disparar o GemsLoadingService automaticamente.
    provideHttpClient(
      withInterceptors([gemsLoadingInterceptor])
    )
  ]
};`
    }
  ];

  triggerLoading() {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, this.durationSeconds * 1000);
  }
}
