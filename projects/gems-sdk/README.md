# @gabriel-mdias/angular-gems-sdk

Kit de desenvolvimento Angular para os projetos G&Ms. 
Oferece componentes visuais modernos, utilitários HTTP, guards, serviços e um sistema de theming completo por CSS.

## Instalação

```bash
npm install @gabriel-mdias/angular-gems-sdk --legacy-peer-deps
```

## Ícones (Font Awesome)

Os componentes da SDK usam classes do Font Awesome 6 (ex: `fa-solid fa-user`) nos inputs de ícone. Instale o pacote:

```bash
npm install @fortawesome/fontawesome-free
```

E registre o CSS no `angular.json` (array `styles` do projeto):

```json
"styles": [
  "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
  "src/styles.css"
]
```

A fonte **Inter** é opcional — carregue-a via Google Fonts ou `@fontsource/inter` se desejar usar a tipografia recomendada.

## Configuração Básica

Importe o sistema de temas globais no seu `styles.css`:

```css
@import "@gabriel-mdias/angular-gems-sdk/styles.css";
```

Adicione o provedor global do tema no seu `app.config.ts`:

```typescript
import { provideGemsTheme } from '@gabriel-mdias/angular-gems-sdk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGemsTheme({
      primary: '#2563eb',
      secondary: '#4A5568',
      tertiary: '#E2E8F0',
      background: '#F7FAFC'
      // Cores de status opcionais: success, danger, warning, info
    })
  ]
};
```

## HTTP

Configure a URL base da API usada pelos `GemsBaseStore` com o helper `provideGemsHttp` (também importado da raiz do pacote):

```typescript
import { provideGemsHttp } from '@gabriel-mdias/angular-gems-sdk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGemsHttp('https://api.seuprojeto.com'),
  ]
};
```
Se essa URL não for configurada, um erro descritivo é lançado ao chamar os métodos do `GemsBaseStore`.

## Auth (Keycloak) — opcional

Recursos de autenticação (`gemsRoleGuard`, `GemsHasRoleDirective`, `provideGemsKeycloak`) ficam em um **entry point secundário**, para que `keycloak-angular` só seja carregado por quem usa auth:

```typescript
import { provideGemsKeycloak } from '@gabriel-mdias/angular-gems-sdk/auth';
```

## Componentes

A SDK possui dois entry points: a raiz do pacote (componentes, serviços, HTTP e tema) e `/auth` (autenticação Keycloak). Importe o restante — componentes, serviços e estrutura HTTP — diretamente de `@gabriel-mdias/angular-gems-sdk`:

```typescript
import { GemsTableComponent } from '@gabriel-mdias/angular-gems-sdk';
```

Para mais informações, consulte a [Documentação de Componentes (Showcase App)](https://github.com/Gabriel-mDias/Angular-GEMS-SDK).
