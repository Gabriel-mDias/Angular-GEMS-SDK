import { Component, computed, input, output } from '@angular/core';
import { NgStyle } from '@angular/common';

import { GemsDocumentPipe } from '../../pipes/gems-document.pipe';
import { GemsPageable } from '../../http/gems-pageable';
import { GemsTableAction, GemsTableColumn, GemsTableRow } from './gems-table.model';

/**
 * Tabela de dados com ordenação, paginação server-side, skeleton loading,
 * badges de status e ações por linha configuráveis.
 *
 * Uso básico:
 * ```html
 * <gems-table [columns]="cols" [data]="rows" [totalRecords]="total"
 *             (pageChange)="onPage($event)" (actionClick)="onAction($event)">
 * </gems-table>
 * ```
 */
@Component({
  selector: 'gems-table',
  standalone: true,
  imports: [NgStyle, GemsDocumentPipe],
  templateUrl: './gems-table.component.html',
  styleUrls: ['./gems-table.component.css'],
})
export class GemsTableComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly columns = input<GemsTableColumn[]>([]);
  readonly data = input<GemsTableRow[]>([]);
  readonly actions = input<GemsTableAction[]>([]);
  readonly emptyMessage = input<string>('Nenhum registro encontrado.');
  readonly isLoading = input<boolean>(false);

  readonly totalRecords = input<number>(0);
  readonly page = input<number>(0);
  readonly size = input<number>(10);
  readonly sortField = input<string | undefined>(undefined);
  readonly sortDirection = input<'asc' | 'desc'>('asc');

  // ── Outputs ───────────────────────────────────────────────────────
  readonly actionClick = output<{ action: string; row: GemsTableRow }>();
  readonly pageChange = output<GemsPageable>();

  // ── Estado derivado ───────────────────────────────────────────────
  protected readonly totalPages = computed(() =>
    Math.ceil(this.totalRecords() / this.size()),
  );
  protected readonly hasPreviousPage = computed(() => this.page() > 0);
  protected readonly hasNextPage = computed(() => this.page() < this.totalPages() - 1);

  /** Linhas de placeholder para o skeleton de loading (5 linhas fixas). */
  protected readonly skeletonRows = [1, 2, 3, 4, 5];

  // ── Métodos públicos ──────────────────────────────────────────────
  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.emitPageChange(newPage, this.size(), this.sortField(), this.sortDirection());
    }
  }

  changeSize(event: Event): void {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.emitPageChange(0, newSize, this.sortField(), this.sortDirection());
  }

  sortBy(field: string): void {
    const col = this.columns().find(c => c.field === field);
    if (!col || col.sortable === false || col.type === 'actions') return;

    const actualSortField = col.sortParam ?? col.field;
    const newDirection: 'asc' | 'desc' =
      this.sortField() === actualSortField && this.sortDirection() === 'asc' ? 'desc' : 'asc';

    this.emitPageChange(this.page(), this.size(), actualSortField, newDirection);
  }

  onActionClick(actionName: string, row: GemsTableRow): void {
    this.actionClick.emit({ action: actionName, row });
  }

  getBadgeStyle(col: GemsTableColumn, value: any): Record<string, string> {
    return col.badgeColors?.[value]
      ? { 'background-color': col.badgeColors[value].bg, color: col.badgeColors[value].text }
      : {};
  }

  // ── Métodos privados ──────────────────────────────────────────────
  private emitPageChange(
    p: number,
    s: number,
    field: string | undefined,
    dir: 'asc' | 'desc',
  ): void {
    const sort = field ? [`${field},${dir}`] : undefined;
    this.pageChange.emit({ page: p, size: s, sort });
  }
}
