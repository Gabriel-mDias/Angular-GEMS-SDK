import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';

@Component({
  selector: 'app-ai-integration-page',
  standalone: true,
  imports: [CommonModule, GemsFormCardComponent],
  templateUrl: './ai-integration-page.component.html'
})
export class AiIntegrationPageComponent {}
