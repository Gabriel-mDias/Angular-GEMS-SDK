# Consumindo a GEMS SDK

Este manual detalha o processo para aplicações Angular consumirem a GEMS SDK (`@gabriel-mdias/angular-gems-sdk`).

## 1. Configuração do Registry (GitHub Packages)

A SDK é distribuída através do GitHub Packages, não pelo repositório público do npm. Para instalá-la, você precisa configurar o escopo `@gabriel-mdias` para apontar para o GitHub.

No diretório raiz do seu projeto consumidor, crie ou edite o arquivo `.npmrc`:

```ini
@gabriel-mdias:registry=https://npm.pkg.github.com
```

Você também precisará estar autenticado no npm com sua conta do GitHub (com permissões de leitura nos pacotes). Execute:

```bash
npm login --scope=@gabriel-mdias --registry=https://npm.pkg.github.com
```
*(Utilize seu username do GitHub e um Personal Access Token (classic) com o escopo `read:packages` como senha).*

## 2. Instalação do Pacote

Instale o pacote com a flag `--legacy-peer-deps` (necessário devido à resolução estrita de pacotes pares do Angular 20):

```bash
npm install @gabriel-mdias/angular-gems-sdk --legacy-peer-deps
```

## 3. Configuração de Estilos e Theming

A GEMS SDK utiliza CSS puro para as variáveis de design tokens, evitando dependências como SCSS ou pré-compiladores complexos. 

### Importação dos Estilos Globais
No arquivo de estilos globais da sua aplicação (ex: `src/styles.css` ou `src/styles.scss`), importe os tokens e utilitários básicos da SDK:

```css
/* src/styles.css */
@import "@gabriel-mdias/angular-gems-sdk/core/tokens/gems-design-tokens.css";
@import "@gabriel-mdias/angular-gems-sdk/core/tokens/gems-utilities.css";
@import "@gabriel-mdias/angular-gems-sdk/core/tokens/gems-animations.css";
```

### Inicialização do Tema
O sistema de temas da SDK requer que o tema base seja injetado no momento de bootstrap da aplicação. O `provideGemsTheme` gera uma paleta completa dinamicamente e a injeta nas variáveis CSS (`--gems-*`).

No arquivo `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideGemsTheme } from '@gabriel-mdias/angular-gems-sdk/core/theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGemsTheme({
      primary: '#0B5FFF', // Sua cor primária
      secondary: '#4A5568', // Sua cor secundária
      tertiary: '#E2E8F0',
      background: '#F7FAFC'
      // Cores de status opcionais: success, danger, warning, info
    }),
    // ... outros providers (router, http, etc)
  ]
};
```

## 4. Consumindo Componentes

Uma vez instalado e configurado, a SDK é baseada em componentes Standalone. Importe os componentes que for utilizar diretamente no array `imports` do seu componente alvo:

```typescript
import { Component } from '@angular/core';
import { GemsButtonComponent } from '@gabriel-mdias/angular-gems-sdk/components';

@Component({
  selector: 'app-meu-componente',
  standalone: true,
  imports: [GemsButtonComponent],
  template: `
    <gems-button variant="primary" (actionClick)="salvar()">
      Salvar Alterações
    </gems-button>
  `
})
export class MeuComponente {
  salvar() {
    console.log('Botão clicado!');
  }
}
```

A SDK também exporta serviços na rota `@gabriel-mdias/angular-gems-sdk/services` e estrutura base HTTP na rota `@gabriel-mdias/angular-gems-sdk/http`.
Consulte a aplicação Showcase localmente neste repositório para ver todos os componentes e guias de uso na prática.

## 5. Integração com IAs e Assistentes de Código

Se você utiliza ferramentas como Cursor, Copilot ou Claude no seu projeto, você pode ensinar essas IAs a usarem a SDK automaticamente.
Basta criar (ou editar) o arquivo `.cursorrules` (ou equivalente da sua IA) na raiz do seu repositório consumidor e colar o seguinte snippet:

```md
# Integração GEMS SDK
Este projeto consome a biblioteca de componentes GEMS SDK. 
Antes de criar formulários, tabelas ou interfaces, LEIA OBRIGATORIAMENTE o guia de uso nativo da biblioteca disponível no seu próprio node_modules:
Caminho: \`node_modules/@gabriel-mdias/angular-gems-sdk/AI-CONSUMER-GUIDE.md\`

Utilize as regras contidas lá como verdade absoluta para a construção de telas e lógica neste projeto.
```
