# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
