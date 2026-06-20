import { Component } from '@angular/core';

import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../../components/code-snippet';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [GemsFormCardComponent, CodeSnippetComponent],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css'],
})
export class ServicesPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly navigationTabs: CodeTab[] = [
    {
      name: 'GemsNavigationService',
      language: 'typescript',
      code: `import { GemsNavigationService } from '@gabriel-mdias/angular-gems-sdk';

@Component({ ... })
export class MeuComponente {
  constructor(private nav: GemsNavigationService) {}

  voltar(): void { this.nav.back(); }
  irParaDashboard(): void { this.nav.navigateTo('/dashboard'); }
}`,
    },
  ];

  readonly sessionTabs: CodeTab[] = [
    {
      name: 'GemsSessionService',
      language: 'typescript',
      code: `import { GemsSessionService } from '@gabriel-mdias/angular-gems-sdk';

@Component({ ... })
export class MeuComponente {
  constructor(private session: GemsSessionService) {}

  salvarPreferencia(): void {
    this.session.set('tema', 'escuro');
  }

  lerPreferencia(): string | null {
    return this.session.get('tema');
  }

  limpar(): void {
    this.session.clear();
  }
}`,
    },
  ];

  readonly s3Tabs: CodeTab[] = [
    {
      name: 'GemsS3Service',
      language: 'typescript',
      code: `import { GemsS3Service } from '@gabriel-mdias/angular-gems-sdk';

@Component({ ... })
export class MeuComponente {
  constructor(private s3: GemsS3Service) {}

  uploadArquivo(file: File): void {
    this.s3.upload(file, 'minha-pasta').subscribe(key => {
      console.log('Arquivo enviado:', key);
    });
  }

  obterUrl(key: string): void {
    this.s3.getUrl(key).subscribe(url => {
      window.open(url);
    });
  }
}`,
    },
  ];

  readonly alertTabs: CodeTab[] = [
    {
      name: 'GemsAlertService',
      language: 'typescript',
      code: `// GemsAlertService — diálogos modais via SweetAlert2
import { GemsAlertService } from '@gabriel-mdias/angular-gems-sdk';

constructor(private alert: GemsAlertService) {}

this.alert.success('Salvo!', 'Registro criado com sucesso.');
this.alert.error('Erro', 'Falha ao conectar ao servidor.');
const r = await this.alert.confirm('Excluir?', 'Esta ação é irreversível.');
if (r.isConfirmed) { /* ... */ }`,
    },
    {
      name: 'GemsToastService',
      language: 'typescript',
      code: `// GemsToastService — notificações não-bloqueantes (signal-based)
import { GemsToastService } from '@gabriel-mdias/angular-gems-sdk';

constructor(private toast: GemsToastService) {}

this.toast.success('Salvo com sucesso!');
this.toast.error('Falha ao salvar.', { duration: 6000 });
this.toast.warning('Sessão expirando em 5 min.');
this.toast.info('Nova versão disponível.');

// Requer <gems-toast-container> no layout raiz`,
    },
  ];
}
