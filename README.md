# Angular GEMS SDK

Este repositório contém a **GEMS SDK**, uma biblioteca Angular 20 unificada, moderna e orientada a design para os projetos G&Ms (meduc-frontend, admin, etc).

## 🚀 Objetivos

- **Visualmente Responsiva:** Focada em PWA com bordas arredondadas, animações fluidas e interações premium.
- **Standalone e Signals:** Código 100% migrado para os paradigmas modernos do Angular 20 (`standalone: true`, `input()`, `output()`, `computed()`).
- **Design Tokens Nativos:** Sistema de Theming baseado inteiramente em CSS Custom Properties (`var(--gems-*)`), sem dependência de SCSS.

## 📦 Como Usar

A biblioteca é publicada via GitHub Packages.

1. Autentique-se no NPM via GitHub:
\`\`\`bash
npm login --scope=@gabriel-mdias --registry=https://npm.pkg.github.com
\`\`\`

2. Instale o pacote:
\`\`\`bash
npm install @gabriel-mdias/angular-gems-sdk --legacy-peer-deps
\`\`\`

3. Configure o Theming no seu `styles.css`:
\`\`\`css
@import "@gabriel-mdias/angular-gems-sdk/core/tokens/gems-design-tokens.css";
@import "@gabriel-mdias/angular-gems-sdk/core/tokens/gems-utilities.css";
@import "@gabriel-mdias/angular-gems-sdk/core/tokens/gems-animations.css";
\`\`\`

## 📂 Estrutura do Repositório

- `projects/gems-sdk/`: Código fonte da biblioteca Angular que será gerada como pacote npm.
- `src/`: Showcase App. Uma aplicação que demonstra e serve como documentação viva de todos os componentes da SDK.

## 🛠 Desenvolvimento Local

Para contribuir com componentes:

1. Clone e instale:
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

2. Rode o App Showcase para testar seus componentes:
\`\`\`bash
npm start
\`\`\`

3. Para dar build na biblioteca (verificar se compila):
\`\`\`bash
npm run build gems-sdk
\`\`\`

## 📚 Migração
Se você está migrando o projeto \`meduc-frontend\` ou outro repositório legado, leia o [Guia de Migração (MIGRATION.md)](./MIGRATION.md).
