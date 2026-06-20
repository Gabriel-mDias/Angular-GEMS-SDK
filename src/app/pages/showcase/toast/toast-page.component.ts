import { Component } from '@angular/core';

import { GemsFormCardComponent, GemsToastService } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-toast-page',
  standalone: true,
  imports: [GemsFormCardComponent, CodeSnippetComponent],
  templateUrl: './toast-page.component.html',
  styleUrls: ['./toast-page.component.css'],
})
export class ToastPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly codeTabs: CodeTab[] = [
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsToastService } from '@gabriel-mdias/angular-gems-sdk';

export class MinhaPagina {
  constructor(private readonly toastService: GemsToastService) {}

  salvar(): void {
    this.toastService.success('Registro salvo com sucesso!');
  }

  onError(): void {
    // Erros ficam por mais tempo (padrão 6s)
    this.toastService.error('Erro ao processar a requisição.');
  }

  onInfo(): void {
    this.toastService.info('Sincronização iniciada.', { duration: 3000 });
  }
}`,
    },
    {
      name: 'HTML (app.component)',
      language: 'html',
      code: `<!-- Adicione UMA vez no componente raiz -->
<!-- app.component.html -->
<gems-toast-container></gems-toast-container>
<router-outlet></router-outlet>`,
    },
  ];

  // ── Construtor ────────────────────────────────────────────────────
  constructor(private readonly toastService: GemsToastService) {}

  // ── Métodos públicos ──────────────────────────────────────────────
  showSuccess(): void {
    this.toastService.success('Operação realizada com sucesso!');
  }

  showError(): void {
    this.toastService.error('Erro ao processar a requisição. Tente novamente.');
  }

  showInfo(): void {
    this.toastService.info('Suas alterações foram salvas automaticamente.');
  }

  showWarning(): void {
    this.toastService.warning('Atenção: o prazo expira em 2 dias.');
  }
}
