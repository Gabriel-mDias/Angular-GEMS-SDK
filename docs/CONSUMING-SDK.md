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

## 3. Ícones (Font Awesome)

Os componentes da SDK usam classes do Font Awesome 6 (ex.: `fa-solid fa-user`) para os inputs `icon`. Instale o pacote:

```bash
npm install @fortawesome/fontawesome-free
```

E registre o CSS no `angular.json`, no array `styles` do projeto:

```json
"styles": [
  "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
  "src/styles.css"
]
```

Sem esse passo, os ícones não aparecerão. A fonte **Inter** é opcional — carregue-a via Google Fonts ou `@fontsource/inter` caso queira usar a tipografia recomendada pelo design system.

## 4. Configuração de Estilos e Theming

A GEMS SDK utiliza CSS puro para as variáveis de design tokens, evitando dependências como SCSS ou pré-compiladores complexos. 

### Importação dos Estilos Globais
No arquivo de estilos globais da sua aplicação (ex: `src/styles.css` ou `src/styles.scss`), importe os tokens e utilitários básicos da SDK:

```css
/* src/styles.css */
@import "@gabriel-mdias/angular-gems-sdk/styles.css";
```

### Inicialização do Tema
O sistema de temas da SDK requer que o tema base seja injetado no momento de bootstrap da aplicação. O `provideGemsTheme` gera uma paleta completa dinamicamente e a injeta nas variáveis CSS (`--gems-*`).

No arquivo `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideGemsTheme } from '@gabriel-mdias/angular-gems-sdk';

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

## 5. Consumindo Componentes

Uma vez instalado e configurado, a SDK é baseada em componentes Standalone. Importe os componentes que for utilizar diretamente no array `imports` do seu componente alvo.

Botões usam as classes nativas `.btn-*` de `gems-global.css` (`btn-primary`, `btn-save`, `btn-cancel`, `btn-secondary`, `btn-danger`, `btn-info`, `btn-warning`, `btn-success`, `btn-novo`) — não é necessário importar nenhum componente para eles:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-meu-componente',
  standalone: true,
  template: `
    <button class="btn-primary" (click)="salvar()">
      Salvar Alterações
    </button>
  `
})
export class MeuComponente {
  salvar() {
    console.log('Botão clicado!');
  }
}
```

> A SDK também exporta `GemsButtonComponent` (`<gems-button>`) com inputs `label`, `variant`, `icon` e `loading`, útil quando você precisa de estado de carregamento ou ícone embutido. Ele **não possui output próprio** — o `(click)` funciona por bubbling nativo do `<button>` interno. Não misture `<gems-button>` com as classes `.btn-*` na mesma tela.

A SDK possui dois entry points: a raiz do pacote `@gabriel-mdias/angular-gems-sdk` (componentes, serviços, tema e HTTP) e `@gabriel-mdias/angular-gems-sdk/auth` (autenticação Keycloak — ver seção 7).
Consulte a aplicação Showcase localmente neste repositório para ver todos os componentes e guias de uso na prática.

## 6. HTTP (GemsBaseStore)

Serviços que estendem `GemsBaseStore` precisam da URL base da API. Use o helper `provideGemsHttp`, importado da raiz do pacote, no `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideGemsHttp } from '@gabriel-mdias/angular-gems-sdk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGemsHttp('https://api.seuprojeto.com'),
    // ... outros providers
  ]
};
```

Isso equivale a `{ provide: GEMS_API_URL, useValue: '...' }`, mas lança um erro descritivo caso a URL não seja configurada e algum `GemsBaseStore` seja utilizado.

## 7. Auth (Keycloak)

> **Breaking change na v1.1.0:** os recursos de autenticação (`gemsRoleGuard`, `GemsHasRoleDirective`, `provideGemsKeycloak`) foram movidos para um **entry point secundário**, `@gabriel-mdias/angular-gems-sdk/auth`. Isso evita que `keycloak-angular` seja carregado por aplicações que não usam autenticação. Eles **não** são mais exportados pela raiz do pacote.

Configuração no `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideGemsKeycloak } from '@gabriel-mdias/angular-gems-sdk/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideGemsKeycloak({
      config: { url: 'https://auth.seuprojeto.com', realm: 'seu-realm', clientId: 'seu-client' },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      },
    }),
  ]
};
```

O token JWT é anexado automaticamente às requisições pelo interceptor registrado por `provideGemsKeycloak` (por isso `provideHttpClient(withInterceptorsFromDi())` é obrigatório) — isso **não** é mais feito automaticamente pelo `GemsBaseStore`.

Uso do guard de rota e da diretiva estrutural:

```typescript
import { gemsRoleGuard } from '@gabriel-mdias/angular-gems-sdk/auth';

{
  path: 'admin',
  canActivate: [gemsRoleGuard],
  data: { roles: ['ADMIN'], roleMode: 'any' }, // 'any' (padrão) | 'all'
}
```

```html
<button *gemsHasRole="'ADMIN'" class="btn-danger">Excluir</button>
<div *gemsHasRole="['A','B']; mode: 'all'">Só visível com os dois papéis</div>
```

## 8. Integração com IAs e Assistentes de Código

Se você utiliza ferramentas como Cursor, Copilot ou Claude no seu projeto, você pode ensinar essas IAs a usarem a SDK automaticamente.
Basta criar (ou editar) o arquivo `.cursorrules` (ou equivalente da sua IA) na raiz do seu repositório consumidor e colar o seguinte snippet:

```md
# Integração GEMS SDK
Este projeto consome a biblioteca de componentes GEMS SDK. 
Antes de criar formulários, tabelas ou interfaces, LEIA OBRIGATORIAMENTE o guia de uso nativo da biblioteca disponível no seu próprio node_modules:
Caminho: \`node_modules/@gabriel-mdias/angular-gems-sdk/AI-CONSUMER-GUIDE.md\`

Utilize as regras contidas lá como verdade absoluta para a construção de telas e lógica neste projeto.
```
