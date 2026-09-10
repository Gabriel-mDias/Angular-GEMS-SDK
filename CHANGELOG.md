# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-09-10

Guia de migração: [`utils/upgrade-versions/1.1.0-to-2.0.0.md`](utils/upgrade-versions/1.1.0-to-2.0.0.md).

> **A faixa 1.x está encerrada, sem manutenção.** Não haverá correções, nem de segurança, para a 1.1.0 ou anterior. Quem depende da SDK sobe para a 2.0.0.

### BREAKING

Duas razões, e nenhuma delas é cosmética:

1. **Salto de plataforma.** Os `peerDependencies` passam a exigir `@angular/* ^22.0.0`. Um projeto em Angular 20 ou 21 não instala esta versão. TypeScript sobe para 6.0 e `ng-packagr` para 22.
2. **Dois caminhos fail-open foram fechados na autorização.** Rota ou elemento que hoje aparece por causa de um desses caminhos passa a ser negado — que é o ponto:
   - `gemsRoleGuard` sem `KeycloakService` disponível agora **nega** em vez de liberar. A mesma condição cobria "aplicação sem autenticação" e "aplicação com autenticação cuja injeção falhou"; liberar atendia à primeira à custa da segunda. Aplicação sem autenticação não põe o guard na rota — não há opção de compatibilidade, e isso é deliberado.
   - `gemsHasRequiredRoles` com lista de papéis ausente ou vazia agora **nega**. O caminho mais comum para chegar nela era um erro de digitação: `data: { role: [...] }`, no singular, liberava a rota para todo mundo sem erro, sem aviso e sem teste vermelho.

### Added

- `gems-input-password` ganha a política de senha e a validação `passwordMismatch`, promovidas do `shared/forms/password-input` do Meduc. Novas entradas: `enforcePolicy`, `showCriteria`, `username`, `email`, `matchControl`.
- Exports novos em `/components`: `GemsPasswordPolicyErrors`, `GemsPasswordIdentityErrors`, `GemsPasswordCriterion`, `GEMS_PASSWORD_MINIMUM_LENGTH` (12), `GEMS_PASSWORD_SPECIAL_CHARACTER_PATTERN`.
- `package-lock.json` passa a ser versionado — `npm ci` depende dele.

### Changed

- Plataforma: `@angular/*` 20 → 22.1.5, TypeScript 5.8 → 6.0, ESLint 9 → 10, `ng-packagr` 22.
- Testes migrados de Karma/Jasmine para **Vitest**, pelo construtor `@angular/build:unit-test`. Os 4 specs existentes migraram sem perda (38 de 38 casos).
- `@angular-devkit/build-angular` → `@angular/build` em todos os alvos.
- `overrides` relaxa os peers de Angular do `keycloak-angular` 16, o que torna a instalação possível **sem `--legacy-peer-deps`** — sem mexer na API pública de `/auth`.
- Publicação idempotente para versão já publicada.

### Fixed

- **`gems-field-error` voltou a exibir a mensagem.** O `computed()` da 1.1.0 só reavaliava quando `control()` mudava — uma vez, na vinculação, com o campo intocado — e memorizava `''` para sempre. A derivação passa a depender de um sinal incrementado pelos eventos do próprio controle.
- **Os testes de `auth/` não eram executados, e a suíte reportava verde.** A opção `include` do construtor de teste é relativa ao `sourceRoot`, e `projects/gems-sdk/auth` fica fora dele. Corrigido; a suíte sai de 38 provas em 4 arquivos para 62 em 8.

### Removed

- Karma, Jasmine e `@types/jasmine`.
- `baseUrl` e `downlevelIteration` do `tsconfig` (erro TS5101 no TypeScript 6).

---

## [1.1.0] - 2026-07-08

### Added

- `provideGemsHttp(baseUrl)` helper for configuring the HTTP layer.
- `gemsUniqueId()` utility.
- Secondary entry point `@gabriel-mdias/angular-gems-sdk/auth` exposing `gemsRoleGuard`, `GemsHasRoleDirective`, and `provideGemsKeycloak`.
- `generateTextPalette` export.
- Font Awesome declared as an optional peer dependency (`@fortawesome/fontawesome-free`).
- `sweetalert2` is now a regular dependency, installed automatically with the package.
- MIT license.

### Changed

- Auth moved to the `/auth` entry point; Keycloak is no longer bundled in the package root.
- `provideGemsTheme` now uses `provideAppInitializer` (Angular 20) instead of the deprecated `APP_INITIALIZER`.
- Role guard/directive unified to "any role" semantics, with an optional `mode: 'all'`.

### Fixed

- `GEMS_API_URL` now throws a descriptive error when not provided, instead of a `NullInjectorError`.
- `crypto.randomUUID` replaced by an SSR/insecure-context-safe id generator.
- Loading service ref-count no longer hides prematurely after `forceHide()`.
- `getCssVariable` guarded for SSR.

### BREAKING

- The JWT bearer token is now attached by the Keycloak bearer interceptor from `/auth` (via `provideGemsKeycloak`), instead of automatically by `GemsBaseStore`.
- `gemsRoleGuard` and `GemsHasRoleDirective` now import from `@gabriel-mdias/angular-gems-sdk/auth`.
