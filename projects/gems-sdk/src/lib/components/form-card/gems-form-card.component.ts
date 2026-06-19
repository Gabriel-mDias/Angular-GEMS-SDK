import { Component, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gems-form-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gems-form-card-wrapper">
      <div class="gems-form-card-header">
        <div class="header-content">
          <h2 *ngIf="title(); else titleProjection" class="gems-form-card-title">
            <i *ngIf="icon()" [class]="icon()"></i>
            {{ title() }}
          </h2>
          <ng-template #titleProjection>
            <ng-content select="[gems-form-card-title]"></ng-content>
          </ng-template>
          
          <div class="gems-form-card-subtitle" *ngIf="subtitle()">{{ subtitle() }}</div>
          <ng-content select="[gems-form-card-subtitle]" *ngIf="!subtitle()"></ng-content>
        </div>
        <div class="header-actions">
          <ng-content select="[gems-form-card-actions]"></ng-content>
        </div>
      </div>
      <div class="gems-form-card-content">
        <ng-content></ng-content>
      </div>
      <div class="gems-form-card-footer">
        <ng-content select="[gems-form-card-footer]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./gems-form-card.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class GemsFormCardComponent {
  title = input<string>();
  subtitle = input<string>();
  icon = input<string>();
}
