import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsPageable } from '../../http/gems-pageable';
import { GemsDocumentPipe } from '../../pipes/gems-document.pipe';

export interface GemsTableColumn {
  field: string;
  header: string;
  type?: 'text' | 'badge' | 'actions' | 'document';
  sortable?: boolean;
  sortParam?: string;
  docTypeField?: string; 
  badgeColors?: { [key: string]: { bg: string; text: string } };
}

export interface GemsTableAction {
  icon: string;      
  tooltip: string;
  colorClass?: string; 
  actionName: string;
  visible?: (row: any) => boolean; 
}

@Component({
  selector: 'gems-table',
  standalone: true,
  imports: [CommonModule, GemsDocumentPipe],
  templateUrl: './gems-table.component.html',
  styleUrls: ['./gems-table.component.css']
})
export class GemsTableComponent {
  columns = input<GemsTableColumn[]>([]);
  data = input<any[]>([]);
  actions = input<GemsTableAction[]>([]);
  emptyMessage = input<string>('Nenhum registro encontrado.');

  totalRecords = input<number>(0);
  page = input<number>(0);
  size = input<number>(10);
  sortField = input<string | undefined>(undefined);
  sortDirection = input<'asc' | 'desc'>('asc');

  actionClick = output<{ action: string; row: any }>();
  pageChange = output<GemsPageable>();

  totalPages = computed(() => {
    return Math.ceil(this.totalRecords() / this.size());
  });

  hasPreviousPage = computed(() => {
    return this.page() > 0;
  });

  hasNextPage = computed(() => {
    return this.page() < this.totalPages() - 1;
  });

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.emitPageChange(newPage, this.size(), this.sortField(), this.sortDirection());
    }
  }

  changeSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newSize = Number(target.value);
    this.emitPageChange(0, newSize, this.sortField(), this.sortDirection());
  }

  sortBy(field: string): void {
    const col = this.columns().find(c => c.field === field);
    if (!col || col.sortable === false || col.type === 'actions') return;

    const actualSortField = col.sortParam || col.field;
    let newDirection: 'asc' | 'desc' = 'asc';
    let newField = actualSortField;

    if (this.sortField() === actualSortField) {
      newDirection = this.sortDirection() === 'asc' ? 'desc' : 'asc';
    }

    this.emitPageChange(this.page(), this.size(), newField, newDirection);
  }

  private emitPageChange(p: number, s: number, field: string | undefined, dir: 'asc' | 'desc'): void {
    const sort = field ? [`${field},${dir}`] : undefined;
    this.pageChange.emit({
      page: p,
      size: s,
      sort
    });
  }

  onActionClick(actionName: string, row: any): void {
    this.actionClick.emit({ action: actionName, row });
  }

  getBadgeStyle(col: GemsTableColumn, value: string): any {
    if (col.badgeColors && col.badgeColors[value]) {
      return { 
        'background-color': col.badgeColors[value].bg, 
        'color': col.badgeColors[value].text 
      };
    }
    return {};
  }
}
