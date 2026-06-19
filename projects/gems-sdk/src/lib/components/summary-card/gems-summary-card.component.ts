import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'gems-summary-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gems-summary-card-container" [class.gems-is-expanded]="expanded()">
      <div class="gems-summary-card-header" (click)="toggle()">
        <div class="gems-header-main">
          <div class="gems-icon-wrapper" *ngIf="icon()">
            <i [class]="icon()"></i>
          </div>
          <div class="gems-title-wrapper">
            <h3 class="gems-card-title">{{ title() }}</h3>
            <div class="gems-summary-preview" *ngIf="!expanded()">
              <ng-content select="[summary]"></ng-content>
            </div>
          </div>
        </div>
        <div class="gems-header-actions">
          <i class="fa-solid" [ngClass]="expanded() ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </div>
      </div>

      <div class="gems-summary-card-details" [@expandCollapse]="expanded() ? 'expanded' : 'collapsed'">
        <div class="gems-details-inner">
          <ng-content select="[details]"></ng-content>
          <ng-content *ngIf="!expanded()"></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./gems-summary-card.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden', padding: '0' })),
      state('expanded', style({ height: '*', opacity: 1, padding: '*' })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class GemsSummaryCardComponent {
  title = input<string>('');
  icon = input<string>('');
  expanded = model<boolean>(false);

  toggle(): void {
    this.expanded.update(v => !v);
  }
}
