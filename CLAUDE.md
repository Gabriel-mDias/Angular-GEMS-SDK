# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Angular 20 CLI **monorepo** with two projects (defined in `angular.json`):

- **`gems-sdk`** (`projects/gems-sdk/`) — the publishable component library, `@gabriel-mdias/angular-gems-sdk`. This is the product.
- **`gems-showcase`** (`src/`) — a demo/documentation SPA that consumes the library locally and renders one page per feature. Use it to exercise and visually verify components.

## Commands

```bash
npm start              # serve the showcase app (dev config) at localhost:4200
npm run build:lib      # build the library (production, ng-packagr) -> dist/gems-sdk
npm run build          # build the showcase app
npm run watch          # rebuild on change (development config)
npm test               # run Karma/Jasmine tests
npm run lint           # eslint (angular-eslint) over both projects
npm run lint:fix       # eslint with --fix
npm run format         # prettier --write over the repo
```

Single test: `ng test gems-sdk --include='**/<name>.spec.ts'`.

Note: **no `.spec.ts` files exist yet** — the Karma config is in place but the suite is empty.

A Husky `pre-commit` hook runs `lint-staged`, which applies `eslint --fix` + `prettier` to staged `.ts`/`.html` and `prettier` to staged `.css`. Don't bypass it (`--no-verify`) unless asked.

## Architecture

### Library layout (`projects/gems-sdk/src/`)

- `lib/core/theme/` — theming engine (palette generation, theme service/provider)
- `lib/core/tokens/` — design-token CSS (`gems-design-tokens.css`, `gems-animations.css`, `gems-utilities.css`)
- `lib/components/` — standalone UI components (table, wizard, inputs, file-upload, side-menu, loading, …)
- `lib/services/` — utility services (alert, navigation, session, s3, loading) + pipes
- `lib/http/` — HTTP base store, API URL token, pageable, interceptors
- `lib/auth/` — optional Keycloak role guard + `*HasRole` directive

### Public API convention

The root entry point is `projects/gems-sdk/src/public-api.ts`, which re-exports from organizational barrels: `src/components/public-api.ts`, `src/services/public-api.ts`, `src/http/public-api.ts`, `src/auth/public-api.ts`.

**When adding a new export, add it to the relevant barrel** (and it flows through the root automatically).

Only one `ng-package.json` exists (the root), so the package currently ships a **single entry point**. The `@gabriel-mdias/angular-gems-sdk/components`-style secondary-entry-point imports shown in the library `README.md` are **not yet wired** in ng-packagr — everything resolves from the package root today.

## Theming system

The SDK is themed entirely through CSS custom properties. Consumers call `provideGemsTheme(config)` (in `app.config.ts`), passing a few hex colors (`primary`, `secondary`, `tertiary`, `background`, plus optional `danger`/`success`/`warning`/`info`). This registers an `APP_INITIALIZER` that runs `GemsThemeService.applyTheme()`, which generates 50–900 HSL palettes per color (`gems-palette.util.ts`) and writes them as CSS variables on `:root`. Themes can also be swapped at runtime via `applyTheme(theme)`.

Consumers must also `@import` the token CSS files from `lib/core/tokens/` into their global stylesheet. Component styles reference these `--gems-*` variables — never hardcode colors in components.

## HTTP / data layer

`GemsBaseStore` (`lib/http/gems-base-store.ts`) is an **abstract class subclassed per backend controller** — pass the controller path to `super('my-controller')`. It provides protected `get/post/put/patch/delete` helpers that:

- build URLs from the injected `GEMS_API_URL` token + controller path + endpoint;
- inject `KeycloakService` **optionally** (`{ optional: true }`) — when present and logged in, it refreshes the token and attaches `Authorization: Bearer …`;
- support pagination via `GemsPageable` (`page`/`size`/`sort`) on request options.

Loading state uses `GemsLoadingService` (signal-based, ref-counted: `show()`/`hide()`/`forceHide()`) driven by `gemsLoadingInterceptor`. Register the interceptor and the `GemsLoadingComponent` to get a global spinner.

## Project rules (mandatory)

Coding standards live in [`rules/CODING-STANDARDS.md`](rules/CODING-STANDARDS.md) and are **hard constraints**, not suggestions. Key ones: fixed section order in `.ts` files; templates always in separate `.html` (no inline `template:`); **constructor injection** over `inject()` (except functional interceptors/guards, which must use `inject()`); strong typing with generics instead of `any`; export all public types via the barrels; new control flow (`@if`/`@for`) + signals; mobile-friendly `@media` in every component. Read that file before editing or creating code. The active refactoring roadmap is in [`docs/SDK-IMPROVEMENT-PLAN.md`](docs/SDK-IMPROVEMENT-PLAN.md).

## Conventions

- **Standalone components only**, with Angular signal APIs: `input()`, `output()`, `computed()`, `signal()` (see `lib/components/table/gems-table.component.ts`).
- Selector/prefix `gems` for the library, `app` for the showcase.
- Auth/Keycloak is **optional** — `keycloak-angular` is an optional peer/optionalDependency; never assume it is present.
- Library peer deps: Angular 20, rxjs 7.8, sweetalert2 11 (used by `GemsAlertService`). Consumers install with `--legacy-peer-deps`.
- Doc comments in the library are written in Portuguese; match that style when editing existing files.
