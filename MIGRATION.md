# Guia de Migração (Legacy para @gabriel-mdias/angular-gems-sdk)

Este guia serve para refatorar projetos antigos (ex: `meduc-frontend`) para adotar a nova GEMS SDK unificada.

## 1. Instalação e Remoção do Código Antigo

1. **Remova as pastas legadas:** Apague as pastas `src/app/shared/components`, `src/app/shared/services`, e `projects/gems-sdk` (se houver) locais do seu app que agora estão consolidadas neste pacote.
2. **Instale a biblioteca oficial:**
\`\`\`bash
npm install @gabriel-mdias/angular-gems-sdk --legacy-peer-deps
\`\`\`

## 2. Refatoração de Componentes (O Prefix `gems-`)

Todos os componentes perderam as rotulagens antigas e agora obrigatoriamente iniciam com o prefixo **`gems-`**.
Eles também utilizam as novas APIs de **Signals do Angular 20**.

### O que mudou no template (HTML)?
* Se usava `<lib-table>`, agora é `<gems-table>`.
* Se usava `<lib-input-date>`, agora é `<gems-input-date>`.
* Se usava `<lib-side-menu>`, agora é `<gems-side-menu>`.
* E assim por diante.

### O que mudou no Typescript?
Os imports não apontam mais para caminhos relativos, apontam para o pacote npm:

**Antes:**
\`\`\`typescript
import { TableComponent } from '../../shared/components/table/table.component';
\`\`\`

**Depois:**
\`\`\`typescript
import { GemsTableComponent } from '@gabriel-mdias/angular-gems-sdk/components';
\`\`\`

## 3. Serviços e Core

### HTTP e Stores
O `BaseStore` antigo continha um antipattern com Observables infinitos e Subject vazando.
O novo `GemsBaseStore` foi limpo. Atualize as extensões:

\`\`\`typescript
import { GemsBaseStore } from '@gabriel-mdias/angular-gems-sdk/http';

export class MeuServico extends GemsBaseStore {
  constructor(http: HttpClient) {
    super(http);
  }
}
\`\`\`

### Autenticação / Role Guard
Substitua o antigo Guard baseado em classes para a versão funcional.

**Nas suas rotas (app.routes.ts):**
\`\`\`typescript
import { gemsRoleGuard } from '@gabriel-mdias/angular-gems-sdk/auth';

{ 
  path: 'admin', 
  component: AdminComponent, 
  canActivate: [gemsRoleGuard], 
  data: { roles: ['ADMIN'] } 
}
\`\`\`

## 4. O Sistema de Cores e Estilos CSS

Seu projeto antigo provavelmente usava dezenas de imports SASS (`@import 'colors.scss'`, `@import 'mixins.scss'`). 
A nova GEMS SDK usa **Zero SCSS** em favor das variáveis CSS nativas.

1. **Delete** todos os seus SCSS de configuração globais obsoletos.
2. **Importe** no seu `styles.css` principal:
\`\`\`css
@import "@gabriel-mdias/angular-gems-sdk/core/tokens/gems-design-tokens.css";
@import "@gabriel-mdias/angular-gems-sdk/core/tokens/gems-animations.css";
@import "@gabriel-mdias/angular-gems-sdk/core/tokens/gems-utilities.css";
\`\`\`
3. Use as variáveis em seus componentes:
\`\`\`css
.meu-card {
  background-color: var(--gems-bg);
  border-radius: var(--gems-radius-md);
  color: var(--gems-text-main);
  box-shadow: var(--gems-shadow-sm);
}
\`\`\`
