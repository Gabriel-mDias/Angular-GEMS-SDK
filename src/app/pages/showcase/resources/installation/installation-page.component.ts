import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';

@Component({
  selector: 'app-installation-page',
  standalone: true,
  imports: [CommonModule, GemsFormCardComponent],
  templateUrl: './installation-page.component.html'
})
export class InstallationPageComponent {}
