# 💎 Angular GEMS SDK

> **Status:** Estável (v1.0.1)  
> **Framework:** Angular 22+ (Standalone & Signals)

Bem-vindo à **GEMS SDK**, a biblioteca front-end definitiva para os ecossistemas corporativos G&Ms (meduc-frontend, admin, etc).
Construída com as mais recentes funcionalidades do Angular, a SDK entrega componentes visuais unificados, serviços essenciais e um sistema de temas dinâmico focado em performance, acessibilidade e beleza.

---

## 🌟 Documentação Visual (Showcase)

Para visualizar todos os componentes funcionando na prática e acessar a documentação detalhada da SDK, acesse nosso portal público:

👉 **[Acessar a Documentação Online (GitHub Pages)](https://gabriel-mdias.github.io/Angular-GEMS-SDK/)**

A página de documentação demonstra formulários, data-display (tabelas, badges), feedback (modais, alertas) e manuais interativos de integração.

---

## 🚀 Propósito e Recursos

- **Design Premium e PWA:** Foco absoluto em um visual corporativo moderno (bordas arredondadas, animações fluidas e micro-interações).
- **Angular 22 "Strict":** Código 100% migrado para paradigma moderno: `standalone: true`, `input()`, `output()`, `computed()` e injeção por construtor. Não utilizamos NgModules nem bibliotecas UI terceiras vazadas.
- **Formulários Padronizados:** Todos os campos estendem `ControlValueAccessor` (CVA), suportam Reactive Forms (`[formGroup]`) nativamente e possuem validação interativa (ex: `<gems-field-error>`).
- **Theming Dinâmico:** Sistema de Cores configurável em tempo de execução (`provideGemsTheme`) apoiado exclusivamente por CSS Variables (`var(--gems-primary-500)`).
- **Serviços Utilitários:** Tratamento de HTTP unificado (`GemsBaseStore`), alertas elegantes com SweetAlert2, notificações Toast, interceptador de Loading e navegação session-based.

---

## 📦 Como Instalar (Para Desenvolvedores)

Adicionar a SDK no seu projeto Angular é extremamente simples. O pacote é versionado via **GitHub Packages**.

### 1. Configure o Registry

No seu projeto Angular, crie ou edite o arquivo `.npmrc` na raiz e aponte o namespace para o GitHub:

```ini
@gabriel-mdias:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<SEU TOKEN NO GITHUB COM PERMISSÃO DE LEITURA DE PACOTES>
```

_Nota: Tenha certeza de que você possui permissão/token do GitHub para ler pacotes._

### 2. Instalação

A linha 2.x exige Angular 22. O gerenciador deve validar normalmente os `peerDependencies` publicados.

```bash
npm install @gabriel-mdias/angular-gems-sdk
```

### 3. Setup de CSS

Importe os tokens globais no seu arquivo principal `styles.css` (ou `styles.scss`):

```css
@import '@gabriel-mdias/angular-gems-sdk/core/tokens/gems-design-tokens.css';
@import '@gabriel-mdias/angular-gems-sdk/core/tokens/gems-utilities.css';
@import '@gabriel-mdias/angular-gems-sdk/core/tokens/gems-animations.css';
```

### 4. Setup do Theming

No seu `app.config.ts`, inicialize as paletas primárias e secundárias do seu cliente fornecendo o `provideGemsTheme`:

```typescript
import { provideGemsTheme } from '@gabriel-mdias/angular-gems-sdk/core/theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGemsTheme({
      primary: '#0B5FFF', // Azul principal
      secondary: '#4A5568', // Cinza chumbo
      tertiary: '#E2E8F0', // Fundo de cards
      background: '#F7FAFC', // Fundo principal
    }),
  ],
};
```

Pronto! Basta importar os componentes (ex: `GemsInputTextComponent`, `GemsFormCardComponent`) onde for necessário.

---

## 🤖 Uso para IAs (Claude, Cursor, Copilot, Gemini)

Construímos um ambiente extremamente amigável para modelos de inteligência artificial gerarem código seguro e aderente ao padrão GEMS.

Se você está usando uma IA no seu projeto consumidor ou se você é uma IA lendo isso, **leia os seguintes documentos**:

- `docs/llms.txt`: Contém todo o Contexto de IA com as "Regras de Ouro", assinaturas exatas dos componentes, outputs e APIs completas.
- `node_modules/@gabriel-mdias/angular-gems-sdk/AI-CONSUMER-GUIDE.md`: Um guia condensado, prático e focado nos `imports` e regras de template.

**A IA deve sempre:**

1. Consultar a sintaxe no `llms.txt`.
2. Usar **somente** Standalone Components.
3. Importar a SDK usando o barrel principal: `import { ... } from '@gabriel-mdias/angular-gems-sdk';`

---

## 🛠 Desenvolvimento Local do Repositório

Para modificar o código da SDK ou testar o Showcase:

```bash
# Instalar exatamente o lock versionado
npm ci

# Iniciar o Showcase App (Documentação visual)
npm start

# Executar os gates locais
npm run verify:versions
npm run format:check
npm run lint
npm test -- --watch=false
npm run build:lib
```

### Release

O merge na `main` apenas valida e atualiza o showcase. A publicação exige aprovação humana e uma
tag imutável que corresponda aos dois manifests, por exemplo `v2.2.0`. O workflow da tag repete os
gates, rejeita versão já existente, publica no GitHub Packages e cria o GitHub Release. Tags não
devem ser movidas; uma correção posterior recebe nova versão patch.

---

_GEMS SDK - Elevando o padrão de qualidade dos front-ends._
