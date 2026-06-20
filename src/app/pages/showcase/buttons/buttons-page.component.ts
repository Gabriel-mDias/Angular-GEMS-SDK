import { Component } from '@angular/core';

import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-buttons-page',
  standalone: true,
  imports: [GemsFormCardComponent, CodeSnippetComponent],
  templateUrl: './buttons-page.component.html',
  styleUrls: ['./buttons-page.component.css'],
})
export class ButtonsPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Classes disponíveis via gems-global.css (importado automaticamente) -->

<!-- Ações primárias -->
<button class="btn-save">Salvar <i class="fa-solid fa-check"></i></button>
<button class="btn-primary">Adicionar <i class="fa-solid fa-plus"></i></button>

<!-- Ações secundárias -->
<button class="btn-cancel"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
<button class="btn-secondary">Ações <i class="fa-solid fa-caret-down"></i></button>

<!-- Risco / alertas -->
<button class="btn-danger"><i class="fa-solid fa-trash"></i> Excluir</button>
<button class="btn-warning"><i class="fa-solid fa-triangle-exclamation"></i> Suspender</button>
<button class="btn-info"><i class="fa-solid fa-circle-info"></i> Visualizar</button>

<!-- Estado desabilitado (funciona em todas as classes) -->
<button class="btn-save" disabled>Salvar</button>`,
    },
  ];
}
