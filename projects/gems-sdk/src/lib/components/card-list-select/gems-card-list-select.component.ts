import { Component, input, output, computed, OnInit, signal, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gems-card-list-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gems-card-list-select-container">
      <div class="gems-selection-grid">
        <div class="gems-selection-card" 
             *ngFor="let item of paginatedItems()" 
             [class.gems-selected]="isSelected(item)"
             [class.gems-readonly]="isReadOnly()" 
             (click)="selectItem(item)">

          <!-- Check/Radio Indicator -->
          <div class="gems-selection-indicator" *ngIf="!isReadOnly()">
            <i class="fa-solid fa-circle-check gems-check-icon-selected" *ngIf="!multiple() && isSelected(item)"></i>
            <i class="fa-regular fa-circle gems-check-icon-empty" *ngIf="!multiple() && !isSelected(item)"></i>
            <i class="fa-solid fa-square-check gems-check-icon-selected" *ngIf="multiple() && isSelected(item)"></i>
            <i class="fa-regular fa-square gems-check-icon-empty" *ngIf="multiple() && !isSelected(item)"></i>
          </div>

          <div class="gems-selection-indicator-readonly" *ngIf="isReadOnly() && isSelected(item)">
            <i class="fa-solid fa-circle-check gems-check-icon-selected" *ngIf="!multiple()"></i>
            <i class="fa-solid fa-square-check gems-check-icon-selected" *ngIf="multiple()"></i>
          </div>

          <i [class]="icon() + ' gems-selection-icon'" *ngIf="icon()"></i>
          <div class="gems-selection-label">{{ getItemTitle(item) }}</div>
          <div class="gems-selection-sublabel" *ngIf="getItemSubtitle(item)">{{ getItemSubtitle(item) }}</div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="gems-pagination-container" *ngIf="hasPagination()">
        <button type="button" class="gems-btn-pagination" [disabled]="currentPage() === 0" (click)="prevPage($event)"
          title="Página Anterior">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <span class="gems-pagination-info">
          Página <strong>{{ currentPage() + 1 }}</strong> de <strong>{{ totalPages() }}</strong>
          <span class="gems-pagination-total-items">({{ items().length }} itens)</span>
        </span>

        <button type="button" class="gems-btn-pagination" [disabled]="currentPage() === totalPages() - 1" (click)="nextPage($event)"
          title="Próxima Página">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./gems-card-list-select.component.css']
})
export class GemsCardListSelectComponent {
  items = input<any[]>([]);
  
  selectedId = input<string | null>(null);
  selectedIdChange = output<string | null>();

  selectedIds = input<string[]>([]);
  selectedIdsChange = output<string[]>();

  multiple = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  
  // Custom properties
  colorSelected = input<string>('var(--gems-primary-50)');
  isReadOnly = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  
  icon = input<string>('');
  titleKey = input<string | ((item: any) => string)>('');
  subtitleKey = input<string | ((item: any) => string)>('');
  pageSize = input<number>(10);
  idKey = input<string>('id');

  page = signal(0);
  currentPage = computed(() => this.page());

  // We should reset pagination when items change, we can do it via a computed or effect,
  // but it's simpler to just bound pagination.
  totalPages = computed(() => {
    const list = this.items();
    if (!list || list.length === 0) return 1;
    return Math.ceil(list.length / this.pageSize());
  });

  paginatedItems = computed(() => {
    const list = this.items();
    if (!list) return [];
    if (list.length <= this.pageSize()) return list;
    
    // Ensure page doesn't exceed bounds
    let p = this.page();
    const maxPage = this.totalPages() - 1;
    if (p > maxPage) p = maxPage;
    if (p < 0) p = 0;

    const start = p * this.pageSize();
    const end = start + this.pageSize();
    return list.slice(start, end);
  });

  hasPagination = computed(() => {
    const list = this.items();
    return list && list.length > this.pageSize();
  });

  prevPage(event: Event): void {
    event.stopPropagation();
    if (this.page() > 0) {
      this.page.update((p: number) => p - 1);
    }
  }

  nextPage(event: Event): void {
    event.stopPropagation();
    if (this.page() < this.totalPages() - 1) {
      this.page.update((p: number) => p + 1);
    }
  }

  getItemId(item: any): string {
    return this.resolveKey(item, this.idKey()) || '';
  }

  getItemTitle(item: any): string {
    const tk = this.titleKey();
    if (typeof tk === 'function') {
      return tk(item);
    }
    return this.resolveKey(item, tk as string) || '';
  }

  getItemSubtitle(item: any): string {
    const sk = this.subtitleKey();
    if (typeof sk === 'function') {
      return sk(item);
    }
    return this.resolveKey(item, sk as string) || '';
  }

  resolveKey(obj: any, path: string): any {
    if (!obj || !path) return '';
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  isSelected(item: any): boolean {
    const id = this.getItemId(item);
    if (this.multiple()) {
      const sIds = this.selectedIds();
      return sIds && sIds.includes(id);
    }
    return this.selectedId() === id;
  }

  selectItem(item: any): void {
    if (this.isReadOnly()) return;
    const id = this.getItemId(item);

    if (this.multiple()) {
      const currentSelected = this.selectedIds() ? [...this.selectedIds()] : [];
      let updated: string[];
      if (currentSelected.includes(id)) {
        updated = currentSelected.filter(x => x !== id);
      } else {
        updated = [...currentSelected, id];
      }
      this.selectedIdsChange.emit(updated);
    } else {
      this.selectedIdChange.emit(id);
    }
  }
}
