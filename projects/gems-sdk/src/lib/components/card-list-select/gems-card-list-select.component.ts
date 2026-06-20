import { Component, booleanAttribute, computed, input, output, signal } from '@angular/core';

import { GemsSelectItem } from './gems-card-list-select.model';

/**
 * Grade de cards selecionáveis com paginação client-side.
 * Suporta seleção simples ou múltipla, modo somente leitura e skeleton loading.
 */
@Component({
  selector: 'gems-card-list-select',
  standalone: true,
  imports: [],
  templateUrl: './gems-card-list-select.component.html',
  styleUrls: ['./gems-card-list-select.component.css'],
})
export class GemsCardListSelectComponent {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly items = input<GemsSelectItem[]>([]);
  readonly selectedId = input<string | null>(null);
  readonly selectedIds = input<string[]>([]);
  readonly multiple = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  readonly colorSelected = input<string>('var(--gems-primary-50)');
  readonly isReadOnly = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  readonly icon = input<string>('');
  readonly titleKey = input<string | ((item: GemsSelectItem) => string)>('');
  readonly subtitleKey = input<string | ((item: GemsSelectItem) => string)>('');
  readonly pageSize = input<number>(10);
  readonly idKey = input<string>('id');
  readonly isLoading = input<boolean>(false);

  // ── Outputs ───────────────────────────────────────────────────────
  readonly selectedIdChange = output<string | null>();
  readonly selectedIdsChange = output<string[]>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly page = signal<number>(0);

  // ── Estado derivado ───────────────────────────────────────────────
  protected readonly totalPages = computed(() => {
    const len = this.items().length;
    return len === 0 ? 1 : Math.ceil(len / this.pageSize());
  });

  protected readonly paginatedItems = computed(() => {
    const list = this.items();
    if (list.length <= this.pageSize()) return list;

    const p = Math.min(Math.max(this.page(), 0), this.totalPages() - 1);
    const start = p * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  protected readonly hasPagination = computed(() => this.items().length > this.pageSize());

  // ── Métodos públicos ──────────────────────────────────────────────
  prevPage(event: Event): void {
    event.stopPropagation();
    if (this.page() > 0) this.page.update(p => p - 1);
  }

  nextPage(event: Event): void {
    event.stopPropagation();
    if (this.page() < this.totalPages() - 1) this.page.update(p => p + 1);
  }

  getItemId(item: GemsSelectItem): string {
    return String(this.resolveKey(item, this.idKey()) ?? '');
  }

  getItemTitle(item: GemsSelectItem): string {
    const tk = this.titleKey();
    return typeof tk === 'function' ? tk(item) : String(this.resolveKey(item, tk) ?? '');
  }

  getItemSubtitle(item: GemsSelectItem): string {
    const sk = this.subtitleKey();
    return typeof sk === 'function' ? sk(item) : String(this.resolveKey(item, sk) ?? '');
  }

  isSelected(item: GemsSelectItem): boolean {
    const id = this.getItemId(item);
    return this.multiple() ? this.selectedIds().includes(id) : this.selectedId() === id;
  }

  selectItem(item: GemsSelectItem): void {
    if (this.isReadOnly()) return;
    const id = this.getItemId(item);

    if (this.multiple()) {
      const current = [...(this.selectedIds() ?? [])];
      const updated = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
      this.selectedIdsChange.emit(updated);
    } else {
      this.selectedIdChange.emit(id);
    }
  }

  // ── Métodos privados ──────────────────────────────────────────────
  private resolveKey(obj: GemsSelectItem, path: string): unknown {
    if (!obj || !path) return '';
    return path.split('.').reduce<unknown>((acc, part) => {
      return acc != null && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined;
    }, obj);
  }
}
