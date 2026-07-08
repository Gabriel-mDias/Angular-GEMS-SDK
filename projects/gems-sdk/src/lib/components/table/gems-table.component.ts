import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgStyle } from '@angular/common';

import { GemsDocumentPipe } from '../../pipes/gems-document.pipe';
import { GemsPageable } from '../../http/gems-pageable';
import {
  GemsTableAction,
  GemsTableColumn,
  GemsTableLabels,
  GemsTableRow,
} from './gems-table.model';

/** Rótulos padrão (pt-BR) da tabela. */
const DEFAULT_TABLE_LABELS: Required<GemsTableLabels> = {
  showing: (from, to, total) => `Mostrando ${from} até ${to} de ${total} registros`,
  perPage: 'Itens por página:',
  page: (current, total) => `Página ${current} de ${total}`,
  previous: 'Página Anterior',
  next: 'Próxima Página',
};

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsTableComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly columns = input<GemsTableColumn[]>([]);
  readonly data = input<GemsTableRow[]>([]);
  readonly actions = input<GemsTableAction[]>([]);
  readonly emptyMessage = input<string>('Nenhum registro encontrado.');
  readonly isLoading = input<boolean>(false);
  /** Campo que identifica unicamente a linha (usado no trackBy). Ex.: 'id'. */
  readonly rowId = input<string>('id');
  /** Rótulos configuráveis (i18n). */
  readonly labels = input<GemsTableLabels>({});

  readonly totalRecords = input<number>(0);
  readonly page = input<number>(0);
  readonly size = input<number>(10);
  readonly sortField = input<string | undefined>(undefined);
  readonly sortDirection = input<'asc' | 'desc'>('asc');

  // ── Outputs ───────────────────────────────────────────────────────
  readonly actionClick = output<{ action: string; row: GemsTableRow }>();
  readonly pageChange = output<GemsPageable>();

  // ── Estado derivado ───────────────────────────────────────────────
  protected readonly totalPages = computed(() => Math.ceil(this.totalRecords() / this.size()));
  protected readonly hasPreviousPage = computed(() => this.page() > 0);
  protected readonly hasNextPage = computed(() => this.page() < this.totalPages() - 1);
  /** Rótulos efetivos (defaults pt-BR mesclados com os overrides). */
  protected readonly resolvedLabels = computed<Required<GemsTableLabels>>(() => ({
    ...DEFAULT_TABLE_LABELS,
    ...this.labels(),
  }));

  /** Linhas de placeholder para o skeleton de loading (5 linhas fixas). */
  protected readonly skeletonRows = [1, 2, 3, 4, 5];

  // ── trackBy ───────────────────────────────────────────────────────
  protected trackRow = (index: number, row: GemsTableRow): unknown => {
    const key = this.rowId();
    return row[key] ?? index;
  };

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

  getBadgeStyle(col: GemsTableColumn, value: unknown): Record<string, string> {
    const key = String(value);
    const badge = col.badgeColors?.[key];
    return badge ? { 'background-color': badge.bg, color: badge.text } : {};
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
