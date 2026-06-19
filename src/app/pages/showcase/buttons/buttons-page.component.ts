import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-buttons-page',
  standalone: true,
  imports: [CommonModule, GemsFormCardComponent, CodeSnippetComponent],
  template: `
    <div class="showcase-page fade-in">
      <div class="header">
        <div class="header-titles">
          <h2>Botões</h2>
          <p class="subtitle">Guia de classes nativas de botões utilizando o <code>gems-global.css</code>.</p>
        </div>
      </div>
      
      <div class="demo-section">
        <div class="demo-preview">
          <gems-form-card title="Tipos de Botões" icon="fa-solid fa-square-caret-right">
            <div class="buttons-grid">
              
              <div class="btn-group-demo">
                <h3>Ações Primárias</h3>
                <div class="btn-row">
                  <button class="btn-save">Salvar <i class="fa-solid fa-check"></i></button>
                  <button class="btn-primary">Adicionar <i class="fa-solid fa-plus"></i></button>
                </div>
              </div>

              <div class="btn-group-demo">
                <h3>Ações Secundárias</h3>
                <div class="btn-row">
                  <button class="btn-cancel"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
                  <button class="btn-secondary">Ações <i class="fa-solid fa-caret-down"></i></button>
                </div>
              </div>

              <div class="btn-group-demo">
                <h3>Ações de Risco / Alertas</h3>
                <div class="btn-row">
                  <button class="btn-danger"><i class="fa-solid fa-trash"></i> Excluir</button>
                  <button class="btn-warning"><i class="fa-solid fa-triangle-exclamation"></i> Suspender</button>
                </div>
              </div>

              <div class="btn-group-demo">
                <h3>Ações Neutras / Informação</h3>
                <div class="btn-row">
                  <button class="btn-info"><i class="fa-solid fa-circle-info"></i> Visualizar</button>
                </div>
              </div>

            </div>
          </gems-form-card>
        </div>

        <div class="demo-code">
          <app-code-snippet [tabs]="codeTabs"></app-code-snippet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .buttons-grid { display: grid; gap: 2rem; }
    .btn-group-demo h3 { font-size: 0.9rem; color: #64748b; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .btn-row { display: flex; gap: 1rem; flex-wrap: wrap; }
  `]
})
export class ButtonsPageComponent {
  codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- O gems-global.css já fornece as classes de botão. -->

<!-- Botão Primário (Salvar) -->
<button class="btn-save">
  Salvar <i class="fa-solid fa-check"></i>
</button>

<button class="btn-primary">
  Adicionar <i class="fa-solid fa-plus"></i>
</button>

<!-- Botão Secundário (Cancelar / Voltar) -->
<button class="btn-cancel">
  <i class="fa-solid fa-arrow-left"></i> Voltar
</button>

<button class="btn-secondary">
  Ações <i class="fa-solid fa-caret-down"></i>
</button>

<!-- Botões de Alerta -->
<button class="btn-danger">
  <i class="fa-solid fa-trash"></i> Excluir
</button>

<button class="btn-warning">
  <i class="fa-solid fa-triangle-exclamation"></i> Suspender
</button>

<button class="btn-info">
  <i class="fa-solid fa-circle-info"></i> Detalhes
</button>`
    }
  ];
}
