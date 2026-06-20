import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  GemsFormCardComponent, 
  GemsTableComponent, 
  GemsCardListSelectComponent,
  GemsTableColumn 
} from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule, FormsModule, GemsFormCardComponent, GemsTableComponent, GemsCardListSelectComponent, CodeSnippetComponent],
  templateUrl: './loading-skeleton-page.component.html',
  styleUrls: ['./loading-skeleton-page.component.css']
})
export class LoadingSkeletonPageComponent {
  durationSeconds = 3;
  isSimulating = false;

  mockList = [
    { id: '1', name: 'João Silva', role: 'Administrador' },
    { id: '2', name: 'Maria Souza', role: 'Usuário' },
    { id: '3', name: 'Pedro Santos', role: 'Editor' }
  ];

  tableColumns: GemsTableColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nome' },
    { field: 'status', header: 'Status', type: 'badge', badgeColors: {
      'Ativo': { bg: '#dcfce7', text: '#166534' }
    }}
  ];

  mockData = [
    { id: '100', name: 'Produto Alpha', status: 'Ativo' },
    { id: '101', name: 'Produto Beta', status: 'Ativo' },
    { id: '102', name: 'Produto Gama', status: 'Ativo' }
  ];

  codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Gems Form Card com Skeleton -->
<gems-form-card title="Cadastro" icon="fa-solid fa-user" [isLoading]="isSaving">
  <div class="form-group">
    <label>Nome</label>
    <input type="text" placeholder="Nome completo" />
  </div>
  <div gems-form-card-footer>
    <button>Salvar</button>
  </div>
</gems-form-card>

<!-- Gems Table com Skeleton -->
<gems-table 
  [columns]="tableColumns" 
  [data]="data" 
  [isLoading]="isFetchingData">
</gems-table>

<!-- Gems Card List com Skeleton -->
<gems-card-list-select 
  [items]="list" 
  [isLoading]="isFetchingList"
  titleKey="name">
</gems-card-list-select>`
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { Component, OnInit } from '@angular/core';

@Component({
  // ...
})
export class MeuComponente implements OnInit {
  isFetchingData = true;
  data = [];

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.isFetchingData = true;
    
    // Simulando uma requisição HTTP
    setTimeout(() => {
      this.data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      this.isFetchingData = false;
    }, 2000);
  }
}`
    }
  ];

  triggerSkeleton() {
    this.isSimulating = true;
    setTimeout(() => {
      this.isSimulating = false;
    }, this.durationSeconds * 1000);
  }
}
