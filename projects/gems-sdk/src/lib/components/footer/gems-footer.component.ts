import { Component, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gems-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="gems-footer">
      <div class="gems-footer-content">
        <ng-content></ng-content>
      </div>
      <div class="gems-footer-bottom">
        <p class="gems-footer-copyright" *ngIf="copyright()">
          &copy; {{ currentYear }} {{ copyright() }}
        </p>
        <div class="gems-footer-links" *ngIf="links()?.length">
          <a *ngFor="let link of links()" [href]="link.url" [target]="link.target || '_self'">
            {{ link.label }}
          </a>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./gems-footer.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class GemsFooterComponent {
  copyright = input<string>();
  links = input<{label: string, url: string, target?: string}[]>([]);
  
  currentYear = new Date().getFullYear();
}
