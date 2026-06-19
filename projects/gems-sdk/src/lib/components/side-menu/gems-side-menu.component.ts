import { Component, input, output, HostListener, PLATFORM_ID, Inject, OnInit, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GemsSideMenuConfig, GemsSideMenuItem } from './gems-side-menu.config';

@Component({
  selector: 'gems-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gems-side-menu.component.html',
  styleUrls: ['./gems-side-menu.component.css']
})
export class GemsSideMenuComponent implements OnInit, OnChanges {
  config = input<GemsSideMenuConfig>();
  logoFull = input<string>();
  logoCollapsed = input<string>();
  
  // New flexible inputs for user profile
  userName = input<string>('');
  userEmail = input<string>('');
  userInitials = input<string>('');
  showUserProfile = input<boolean>(true);

  collapsedChange = output<boolean>();
  itemClicked = output<void>();
  logoutClick = output<void>();

  filteredItems: GemsSideMenuItem[] = [];
  isCollapsed = false;
  isMobileOpen = false;
  isMobileView = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.filterMenu();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.filterMenu();
    }
  }

  logout(): void {
    this.logoutClick.emit();
  }

  private filterMenu(): void {
    const currentConfig = this.config();
    if (!currentConfig || !currentConfig.items) {
      this.filteredItems = [];
      return;
    }
    // In SDK we don't assume role/claim parsing inside the visual component.
    // We assume the items passed in the config are already filtered, or we let the caller do it.
    // If the config items are passed, we just use them.
    this.filteredItems = JSON.parse(JSON.stringify(currentConfig.items)); 
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      const wasMobile = this.isMobileView;
      this.isMobileView = window.innerWidth <= 768;

      if (this.isMobileView && !wasMobile) {
        if (!this.isCollapsed) {
          this.isCollapsed = true;
          this.collapsedChange.emit(this.isCollapsed);
        }
      }
    }
  }

  toggleCollapse(): void {
    if (this.isMobileView) {
      return;
    }

    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);

    if (this.isCollapsed) {
      this.filteredItems.forEach(item => item.isExpanded = false);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileOpen = !this.isMobileOpen;
  }

  closeMobileMenu(): void {
    this.isMobileOpen = false;
  }

  onItemClick(item: GemsSideMenuItem): void {
    if (this.isCollapsed && !this.isMobileView && item.children && item.children.length > 0) {
      this.isCollapsed = false;
      this.collapsedChange.emit(this.isCollapsed);
      item.isExpanded = true;
      return;
    }

    if (item.children && item.children.length > 0) {
      item.isExpanded = !item.isExpanded;
    } else {
      this.itemClicked.emit();
      if (this.isMobileView) {
        this.closeMobileMenu();
      }
    }
  }

  onSubItemClick(): void {
    this.itemClicked.emit();
    if (this.isMobileView) {
      this.closeMobileMenu();
    }
  }
}
