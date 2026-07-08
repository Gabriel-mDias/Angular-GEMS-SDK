import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  input,
  output,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GemsSideMenuConfig, GemsSideMenuItem } from './gems-side-menu.config';

/**
 * Menu lateral responsivo com suporte a collapse (desktop) e drawer (mobile).
 * Recebe a configuração de itens via input e delega autenticação/roles ao chamador.
 */
@Component({
  selector: 'gems-side-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './gems-side-menu.component.html',
  styleUrls: ['./gems-side-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsSideMenuComponent implements OnInit, OnChanges {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly config = input<GemsSideMenuConfig>();
  readonly logoFull = input<string>();
  readonly logoCollapsed = input<string>();
  readonly userName = input<string>('');
  readonly userEmail = input<string>('');
  readonly userInitials = input<string>('');
  readonly showUserProfile = input<boolean>(true);
  readonly logoutLabel = input<string>('Sair');
  readonly logoutTitle = input<string>('Sair do Sistema');
  readonly openMenuLabel = input<string>('Abrir menu');
  readonly appName = input<string>('G&Ms SDK');

  // ── Outputs ───────────────────────────────────────────────────────
  readonly collapsedChange = output<boolean>();
  readonly itemClicked = output<void>();
  readonly logoutClick = output<void>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly isCollapsed = signal<boolean>(false);
  protected readonly isMobileOpen = signal<boolean>(false);
  protected readonly isMobileView = signal<boolean>(false);
  protected readonly filteredItems = signal<GemsSideMenuItem[]>([]);

  // ── Construtor ────────────────────────────────────────────────────
  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    this.updateScreenSize();
  }

  // ── Ciclo de vida ─────────────────────────────────────────────────
  ngOnInit(): void {
    this.filterMenu();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.filterMenu();
    }
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  logout(): void {
    this.logoutClick.emit();
  }

  toggleCollapse(): void {
    if (this.isMobileView()) return;

    this.isCollapsed.update(v => !v);
    this.collapsedChange.emit(this.isCollapsed());

    if (this.isCollapsed()) {
      this.filteredItems.update(items => items.map(item => ({ ...item, isExpanded: false })));
    }
  }

  toggleMobileMenu(): void {
    this.isMobileOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileOpen.set(false);
  }

  onItemClick(item: GemsSideMenuItem): void {
    if (this.isCollapsed() && !this.isMobileView() && item.children?.length) {
      this.isCollapsed.set(false);
      this.collapsedChange.emit(false);
      this.filteredItems.update(items =>
        items.map(i => (i === item ? { ...i, isExpanded: true } : i)),
      );
      return;
    }

    if (item.children?.length) {
      this.filteredItems.update(items =>
        items.map(i => (i === item ? { ...i, isExpanded: !i.isExpanded } : i)),
      );
    } else {
      this.itemClicked.emit();
      if (this.isMobileView()) this.closeMobileMenu();
    }
  }

  onSubItemClick(): void {
    this.itemClicked.emit();
    if (this.isMobileView()) this.closeMobileMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateScreenSize();
  }

  // ── Métodos privados ──────────────────────────────────────────────
  private filterMenu(): void {
    const currentConfig = this.config();
    if (!currentConfig?.items) {
      this.filteredItems.set([]);
      return;
    }
    this.filteredItems.set(structuredClone(currentConfig.items));
  }

  private updateScreenSize(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const wasMobile = this.isMobileView();
    const nowMobile = window.innerWidth <= 768;
    this.isMobileView.set(nowMobile);

    if (nowMobile && !wasMobile && !this.isCollapsed()) {
      this.isCollapsed.set(true);
      this.collapsedChange.emit(true);
    }
  }
}
