import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';

@Component({
  selector: 'app-side-menu-page',
  standalone: true,
  imports: [CommonModule, GemsFormCardComponent],
  templateUrl: './side-menu-page.component.html'
})
export class SideMenuPageComponent {}
