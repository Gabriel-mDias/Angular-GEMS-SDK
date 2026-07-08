# @gabriel-mdias/angular-gems-sdk

Kit de desenvolvimento Angular para os projetos G&Ms. 
Oferece componentes visuais modernos, utilitários HTTP, guards, serviços e um sistema de theming completo por CSS.

## Instalação

\`\`\`bash
npm install @gabriel-mdias/angular-gems-sdk --legacy-peer-deps
\`\`\`

## Configuração Básica

Importe o sistema de temas globais no seu `styles.css`:

\`\`\`css
@import "@gabriel-mdias/angular-gems-sdk/src/lib/styles/gems-global.css";
\`\`\`

Adicione o provedor global do tema no seu `app.config.ts`:

\`\`\`typescript
import { provideGemsTheme } from '@gabriel-mdias/angular-gems-sdk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGemsTheme({ primaryColorHex: '#2563eb' })
  ]
};
\`\`\`

## Componentes

Importe diretamente dos secondary entry-points para melhor performance (Tree Shaking):

\`\`\`typescript
import { GemsTableComponent } from '@gabriel-mdias/angular-gems-sdk/components';
\`\`\`

Para mais informações, consulte a [Documentação de Componentes (Showcase App)](https://github.com/Gabriel-mDias/Angular-GEMS-SDK).
