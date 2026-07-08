import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GemsFormCardComponent,
  GemsTableComponent,
  GemsTableColumn,
  GemsTableAction,
  GemsTableRow,
  GemsAlertService,
  GemsPageable,
} from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

interface Matricula {
  idMatricula: string;
  instituicaoNomeFantasia: string;
  alunoNome: string;
  situacaoDesc: string;
}

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [FormsModule, GemsFormCardComponent, GemsTableComponent, CodeSnippetComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent {
  constructor(private alertService: GemsAlertService) {}

  filterParams = {
    nome: '',
    situacao: '',
  };

  situacaoOptions = ['Ativa', 'Suspensa', 'Cancelada'];

  tableColumns: GemsTableColumn[] = [
    { field: 'idMatricula', header: 'ID Matrícula', sortable: true },
    { field: 'instituicaoNomeFantasia', header: 'Nome Fantasia', sortable: true },
    { field: 'alunoNome', header: 'Aluno', sortable: true },
    {
      field: 'situacaoDesc',
      header: 'Situação',
      sortable: true,
      sortParam: 'situacao',
      type: 'badge',
      badgeColors: {
        Ativa: { bg: '#dcfce7', text: '#166534' },
        Suspensa: { bg: '#fef9c3', text: '#854d0e' },
        Cancelada: { bg: '#fee2e2', text: '#991b1b' },
      },
    },
    { field: 'actions', header: '', type: 'actions', sortable: false },
  ];

  tableActions: GemsTableAction[] = [
    {
      actionName: 'view',
      icon: 'fa-solid fa-eye',
      tooltip: 'Visualizar',
      colorClass: 'btn-info',
      visible: () => true,
    },
    {
      actionName: 'suspend',
      icon: 'fa-solid fa-pause',
      tooltip: 'Suspender',
      colorClass: 'btn-warning',
      visible: (row: GemsTableRow) => (row as unknown as Matricula).situacaoDesc === 'Ativa',
    },
    {
      actionName: 'cancel',
      icon: 'fa-solid fa-ban',
      tooltip: 'Cancelar',
      colorClass: 'btn-danger',
      visible: (row: GemsTableRow) => (row as unknown as Matricula).situacaoDesc !== 'Cancelada',
    },
  ];

  allData = [
    {
      idMatricula: '1001',
      instituicaoNomeFantasia: 'Escola Esperança',
      alunoNome: 'João da Silva',
      situacaoDesc: 'Ativa',
    },
    {
      idMatricula: '1002',
      instituicaoNomeFantasia: 'Escola Esperança',
      alunoNome: 'Maria Joaquina',
      situacaoDesc: 'Ativa',
    },
    {
      idMatricula: '1003',
      instituicaoNomeFantasia: 'Colégio Futuro',
      alunoNome: 'Pedro Alves',
      situacaoDesc: 'Suspensa',
    },
    {
      idMatricula: '1004',
      instituicaoNomeFantasia: 'Instituto Luz',
      alunoNome: 'Ana Souza',
      situacaoDesc: 'Cancelada',
    },
    {
      idMatricula: '1005',
      instituicaoNomeFantasia: 'Escola Esperança',
      alunoNome: 'Marcos Paulo',
      situacaoDesc: 'Ativa',
    },
  ];

  tableData = [...this.allData];
  totalRecords = this.allData.length;

  codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<gems-form-card title="Filtros de Busca" icon="fa-solid fa-filter">
  <div class="filter-grid">
    <div class="filter-field">
      <label>Nome do Aluno</label>
      <input type="text" [(ngModel)]="filterParams.nome" class="gems-input">
    </div>
    <div class="filter-field">
      <label>Situação</label>
      <select [(ngModel)]="filterParams.situacao" class="gems-input">
        <option value="">Todas</option>
        <option *ngFor="let opt of situacaoOptions" [value]="opt">{{ opt }}</option>
      </select>
    </div>
  </div>
  <div class="filter-actions">
    <button class="btn-secondary" (click)="clearFilters()">Limpar</button>
    <button class="btn-primary" (click)="search()">Buscar</button>
  </div>
</gems-form-card>

<gems-table 
  [columns]="tableColumns" 
  [data]="tableData" 
  [actions]="tableActions"
  [totalRecords]="totalRecords"
  (actionClick)="handleAction($event)"
  (pageChange)="onPageChange($event)">
</gems-table>`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `import { GemsTableColumn, GemsTableAction } from 'gems-sdk';

export class MatriculaListComponent {
  tableColumns: GemsTableColumn[] = [
    { field: 'alunoNome', header: 'Aluno', sortable: true },
    { 
      field: 'situacao', 
      header: 'Situação', 
      type: 'badge',
      badgeColors: {
        'Ativa': { bg: '#dcfce7', text: '#166534' },     
        'Cancelada': { bg: '#fee2e2', text: '#991b1b' }  
      }
    },
    { field: 'actions', header: '', type: 'actions' }
  ];

  tableActions: GemsTableAction[] = [
    { 
      actionName: 'suspend', 
      icon: 'fa-solid fa-pause', 
      tooltip: 'Suspender', 
      colorClass: 'gems-text-warning',
      visible: (row) => row.situacao === 'Ativa'
    }
  ];

  handleAction(event: { action: string; row: any }) {
    if (event.action === 'suspend') {
      this.alertService.confirm('Suspender', 'Deseja suspender a matrícula?');
    }
  }
}`,
    },
  ];

  search() {
    this.tableData = this.allData.filter(item => {
      const matchNome = item.alunoNome.toLowerCase().includes(this.filterParams.nome.toLowerCase());
      const matchSituacao = this.filterParams.situacao
        ? item.situacaoDesc === this.filterParams.situacao
        : true;
      return matchNome && matchSituacao;
    });
    this.totalRecords = this.tableData.length;
  }

  clearFilters() {
    this.filterParams = { nome: '', situacao: '' };
    this.search();
  }

  handleAction(event: { action: string; row: GemsTableRow }) {
    const row = event.row as unknown as Matricula;
    if (event.action === 'view') {
      this.alertService.info('Visualizar', `Visualizando matrícula ${row.idMatricula}`);
    } else if (event.action === 'suspend') {
      this.alertService
        .confirm('Suspender', `Tem certeza que deseja suspender a matrícula ${row.idMatricula}?`)
        .then(res => {
          if (res.isConfirmed) {
            row.situacaoDesc = 'Suspensa';
            this.alertService.success('Sucesso', 'Matrícula suspensa.');
          }
        });
    } else if (event.action === 'cancel') {
      this.alertService
        .confirm('Cancelar', `Tem certeza que deseja cancelar a matrícula ${row.idMatricula}?`)
        .then(res => {
          if (res.isConfirmed) {
            row.situacaoDesc = 'Cancelada';
            this.alertService.success('Sucesso', 'Matrícula cancelada.');
          }
        });
    }
  }

  onPageChange(pageable: GemsPageable) {
    this.alertService.success(
      'Paginação',
      `Mudou para página ${pageable.page} tamanho ${pageable.size}`,
    );
  }
}
