import { Component } from '@angular/core';

import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../../components/code-snippet';

@Component({
  selector: 'app-theming-page',
  standalone: true,
  imports: [GemsFormCardComponent, CodeSnippetComponent],
  templateUrl: './theming-page.component.html',
  styleUrls: ['./theming-page.component.css'],
})
export class ThemingPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly codeTabs: CodeTab[] = [
    {
      name: 'app.config.ts',
      language: 'typescript',
      code: `import { provideGemsTheme } from '@gabriel-mdias/angular-gems-sdk';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideGemsTheme({
      primary: '#2563eb',
      secondary: '#7c3aed',
      tertiary: '#0891b2',
      background: '#f8fafc',
      danger: '#dc2626',   // opcional
      success: '#16a34a',  // opcional
      warning: '#d97706',  // opcional
      info: '#0284c7',     // opcional
    }),
  ],
};`,
    },
    {
      name: 'styles.css',
      language: 'css',
      code: `/* Importar os tokens de design da SDK */
@import '@gabriel-mdias/angular-gems-sdk/styles/gems-design-tokens.css';
@import '@gabriel-mdias/angular-gems-sdk/styles/gems-animations.css';
@import '@gabriel-mdias/angular-gems-sdk/styles/gems-utilities.css';
@import '@gabriel-mdias/angular-gems-sdk/styles/gems-global.css';`,
    },
    {
      name: 'Runtime',
      language: 'typescript',
      code: `import { GemsThemeService, GemsThemeConfig } from '@gabriel-mdias/angular-gems-sdk';

@Component({ ... })
export class MeuComponente {
  constructor(private themeService: GemsThemeService) {}

  trocarTema(): void {
    const novoTema: GemsThemeConfig = {
      primary: '#7c3aed',
      secondary: '#2563eb',
      tertiary: '#0891b2',
      background: '#fafafa',
    };
    this.themeService.applyTheme(novoTema);
  }
}`,
    },
  ];
}
