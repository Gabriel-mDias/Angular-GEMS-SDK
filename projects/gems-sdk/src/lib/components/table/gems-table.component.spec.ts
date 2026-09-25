import { TestBed } from '@angular/core/testing';

import { GemsTableComponent } from './gems-table.component';

describe('GemsTableComponent accessibility', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [GemsTableComponent] }));

  it('keeps aria-sort on the column header and puts sorting on a native button', () => {
    const fixture = TestBed.createComponent(GemsTableComponent);
    fixture.componentRef.setInput('columns', [
      { field: 'name', header: 'Nome', sortable: true },
      { field: 'actions', header: 'Ações', type: 'actions', sortable: false },
    ]);
    fixture.componentRef.setInput('sortField', 'name');
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll(
      'th',
    ) as NodeListOf<HTMLTableCellElement>;
    const sortButton = headers[0].querySelector('button') as HTMLButtonElement;

    expect(headers[0].getAttribute('role')).toBeNull();
    expect(headers[0].getAttribute('aria-sort')).toBe('ascending');
    expect(sortButton.type).toBe('button');
    expect(sortButton.textContent).toContain('Nome');
    expect(headers[1].getAttribute('aria-sort')).toBeNull();
    expect(headers[1].querySelector('button')).toBeNull();

    const changes: unknown[] = [];
    fixture.componentInstance.pageChange.subscribe(change => changes.push(change));
    sortButton.click();
    expect(changes).toEqual([{ page: 0, size: 10, sort: ['name,desc'] }]);
  });
});
