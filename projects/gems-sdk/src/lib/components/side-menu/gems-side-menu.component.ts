import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GemsSideMenuConfig, GemsSideMenuItem } from './gems-side-menu.config';

@Component({
  selector: 'gems-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="gems-side-menu" [class.gems-collapsed]="isCollapsed()">
      
      <div class="gems-side-menu-header">
        <div class="gems-logo-container" *ngIf="!isCollapsed()">
          <img *ngIf="config()?.headerLogoUrl" [src]="config()?.headerLogoUrl" alt="Logo" class="gems-logo-img">
          <h2 *ngIf="config()?.headerTitle" class="gems-logo-title">{{ config()?.headerTitle }}</h2>
        </div>
        
        <button class="gems-toggle-btn" (click)="toggleCollapse()" title="Alternar Menu">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>

      <nav class="gems-side-menu-nav">
        <ul class="gems-menu-list">
          <ng-container *ngFor="let item of config()?.items">
            <li class="gems-menu-item" [class.gems-has-children]="item.children?.length">
              
              <!-- Item without children -->
              <a *ngIf="!item.children?.length" 
                 [routerLink]="item.route" 
                 routerLinkActive="gems-active" 
                 class="gems-menu-link" 
                 [title]="isCollapsed() ? item.label : ''"
                 (click)="onItemClick(item)">
                <i *ngIf="item.icon" [class]="item.icon + ' gems-menu-icon'"></i>
                <span class="gems-menu-label" *ngIf="!isCollapsed()">{{ item.label }}</span>
              </a>

              <!-- Item with children -->
              <div *ngIf="item.children?.length" 
                   class="gems-menu-link gems-menu-parent" 
                   (click)="toggleExpand(item)"
                   [class.gems-parent-expanded]="item.isExpanded && !isCollapsed()"
                   [title]="isCollapsed() ? item.label : ''">
                <i *ngIf="item.icon" [class]="item.icon + ' gems-menu-icon'"></i>
                <span class="gems-menu-label" *ngIf="!isCollapsed()">{{ item.label }}</span>
                <i class="fa-solid fa-chevron-down gems-chevron" *ngIf="!isCollapsed()"></i>
              </div>

              <!-- Children list -->
              <ul class="gems-submenu-list" 
                  *ngIf="item.children?.length && !isCollapsed()" 
                  [@expandCollapse]="item.isExpanded ? 'expanded' : 'collapsed'">
                <li class="gems-submenu-item" *ngFor="let child of item.children">
                  <a [routerLink]="child.route" 
                     routerLinkActive="gems-active" 
                     class="gems-submenu-link"
                     (click)="onItemClick(child)">
                    <i *ngIf="child.icon" [class]="child.icon + ' gems-menu-icon'"></i>
                    <span class="gems-menu-label">{{ child.label }}</span>
                  </a>
                </li>
              </ul>

            </li>
          </ng-container>
        </ul>
      </nav>
      
      <div class="gems-side-menu-footer">
        <ng-content select="[footer]"></ng-content>
      </div>

    </aside>
  `,
  styleUrls: ['./gems-side-menu.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', animate('250ms ease-in-out'))
    ])
  ]
})
export class GemsSideMenuComponent {
  config = input<GemsSideMenuConfig>();
  isCollapsed = signal<boolean>(false);
  
  menuClick = output<GemsSideMenuItem>();

  constructor(private router: Router) {}

  toggleCollapse() {
    this.isCollapsed.update(c => !c);
  }

  toggleExpand(item: GemsSideMenuItem) {
    if (this.isCollapsed()) {
      // If expanding a parent while collapsed, open the menu first
      this.isCollapsed.set(false);
      item.isExpanded = true;
    } else {
      item.isExpanded = !item.isExpanded;
    }
  }

  onItemClick(item: GemsSideMenuItem) {
    this.menuClick.emit(item);
    
    // Optionally close menu on mobile (would need viewport detection, skipping for now)
  }
}
