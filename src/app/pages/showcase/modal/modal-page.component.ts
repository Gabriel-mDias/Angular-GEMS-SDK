import { Component } from '@angular/core';

import {
  GemsFormCardComponent,
  GemsInputTextComponent,
  GemsModalComponent,
} from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-modal-page',
  standalone: true,
  imports: [GemsFormCardComponent, GemsModalComponent, GemsInputTextComponent, CodeSnippetComponent],
  templateUrl: './modal-page.component.html',
})
export class ModalPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  openSmall = false;
  openMedium = false;
  openConfirm = false;

  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Two-way binding em open -->
<button class="btn-save" (click)="isOpen = true">Abrir Modal</button>

<gems-modal [(open)]="isOpen" title="Título" size="md">
  <!-- Corpo do modal via ng-content -->
  <p>Conteúdo do modal aqui.</p>

  <!-- Rodapé via slot [gems-modal-footer] -->
  <div gems-modal-footer>
    <button class="btn-cancel" (click)="isOpen = false">Cancelar</button>
    <button class="btn-save" (click)="onConfirm()">Confirmar</button>
  </div>
</gems-modal>

<!-- Tamanhos: size="sm" | "md" | "lg" -->
<!-- [closeOnBackdrop]="false" para confirmações críticas -->`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsModalComponent } from '@gabriel-mdias/angular-gems-sdk';

export class MinhaPagina {
  isOpen = false;

  onConfirm(): void {
    // lógica de confirmação
    this.isOpen = false;
  }
}`,
    },
  ];

  // ── Métodos públicos ──────────────────────────────────────────────
  onConfirmDelete(): void {
    console.log('Item excluído');
    this.openConfirm = false;
  }
}
