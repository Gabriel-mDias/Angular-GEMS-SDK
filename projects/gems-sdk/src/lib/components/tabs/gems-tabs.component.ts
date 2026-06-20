import { Component, input, model } from '@angular/core';

import { GemsTab } from './gems-tabs.model';

/**
 * Navegação por abas acessível com navegação por teclado (setas).
 * O conteúdo de cada aba é gerenciado pelo consumidor com `@if (activeId === 'id')`.
 *
 * Uso:
 * ```html
 * <gems-tabs [tabs]="tabs" [(activeId)]="activeTab">
 *   @if (activeTab === 'dados') { <app-dados /> }
 *   @if (activeTab === 'config') { <app-config /> }
 * </gems-tabs>
 * ```
 */
@Component({
  selector: 'gems-tabs',
  standalone: true,
  imports: [],
  templateUrl: './gems-tabs.component.html',
  styleUrls: ['./gems-tabs.component.css'],
})
export class GemsTabsComponent {
  // ── Inputs / two-way ─────────────────────────────────────────────
  readonly tabs = input<GemsTab[]>([]);
  readonly activeId = model<string>('');
  readonly ariaLabel = input<string>('');

  // ── Métodos públicos ──────────────────────────────────────────────
  selectTab(tab: GemsTab): void {
    if (!tab.disabled) {
      this.activeId.set(tab.id);
    }
  }

  onKeyDown(event: KeyboardEvent, tab: GemsTab): void {
    const tabs = this.tabs().filter(t => !t.disabled);
    const currentIndex = tabs.findIndex(t => t.id === tab.id);

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const next = tabs[(currentIndex + 1) % tabs.length];
      this.activeId.set(next.id);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
      this.activeId.set(prev.id);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.activeId.set(tabs[0].id);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.activeId.set(tabs[tabs.length - 1].id);
    }
  }
}
