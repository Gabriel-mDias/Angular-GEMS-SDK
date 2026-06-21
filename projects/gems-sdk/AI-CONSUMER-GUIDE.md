# GEMS SDK — AI Consumer Guide

> **STOP.** If you are an AI (Claude, Copilot, Cursor, Gemini, or any other model)
> and you are reading this file from `node_modules/@gabriel-mdias/angular-gems-sdk/`,
> this project **consumes the GEMS SDK**. You MUST use the SDK's components, services,
> and patterns described below. Do NOT use raw HTML inputs, Bootstrap, Angular Material,
> PrimeNG, or any other UI library unless the human explicitly requests it.

---

## Mandatory Code Standards

| Rule | Do | Don't |
|---|---|---|
| Components | `standalone: true` | `NgModule` |
| Dependency injection | `constructor(private svc: MyService)` | `inject()` |
| Component API | `input<T>()`, `output<T>()`, `model<T>()` | `@Input()`, `@Output()` |
| Templates & styles | Separate `.html`/`.css` files (if > 5 lines) | Giant inline templates |
| Colors | `var(--gems-primary-500)` | Hardcoded hex `#3b82f6` |
| Form fields | `<gems-input-text>`, `<gems-select>`, etc. | `<input>`, `<select>` |
| Forms approach | Reactive Forms (`[formGroup]`) | Template-driven `[(ngModel)]` |
| Buttons | `<gems-button>` or CSS classes `btn-primary`, `btn-save` | Custom `.my-btn` |
| Cards | `<gems-form-card>` | Custom card markup |
| Icons | Font Awesome 6 (`fa-solid fa-user`) | Material Icons |

---

## Quick Import

```typescript
import {
  // Form components
  GemsInputTextComponent,
  GemsInputDateComponent,
  GemsInputMaskComponent,
  GemsInputDocumentComponent,
  GemsInputPasswordComponent,
  GemsInputCheckboxComponent,
  GemsInputRangeComponent,
  GemsSelectComponent,
  GemsTextareaComponent,
  GemsFieldErrorComponent,

  // Layout
  GemsFormCardComponent,
  GemsSideMenuComponent,
  GemsTabsComponent,
  GemsWizardComponent,

  // Data display
  GemsTableComponent,
  GemsBadgeComponent,
  GemsEmptyStateComponent,
  GemsCardListSelectComponent,

  // Feedback
  GemsButtonComponent,
  GemsModalComponent,
  GemsLoadingComponent,
  GemsToastContainerComponent,

  // Services
  GemsAlertService,
  GemsToastService,
  GemsLoadingService,
  GemsNavigationService,
  GemsSessionService,

  // HTTP
  GemsBaseStore,
  GEMS_API_URL,

  // Auth
  GemsHasRoleDirective,
  gemsRoleGuard,

  // Theme
  provideGemsTheme,

  // Models (import only what you need)
  GemsSelectOption,
  GemsTableColumn,
  GemsTableAction,
  GemsPageable,
  GemsSideMenuConfig,
  GemsSideMenuItem,
  GemsTab,
  GemsWizardStep,
  GemsBadgeVariant,
  GemsRangeValue,
  GemsModalSize,
} from '@gabriel-mdias/angular-gems-sdk';
```

---

## Form Fields — Reference Card

Every form field implements `ControlValueAccessor`. Use with `formControlName`.
**Always** add `<gems-field-error>` after fields with validators.

| Component | Selector | Value Type | Key Inputs |
|---|---|---|---|
| Input Text | `<gems-input-text>` | `string` | `label`, `type`, `icon`, `placeholder`, `required`, `maxlength`, `hint` |
| Input Password | `<gems-input-password>` | `string` | `label`, `placeholder`, `required` |
| Input Date | `<gems-input-date>` | `string` (ISO) | `label`, `formato` (diaMesAno\|fullData\|mesAno\|ano), `required` |
| Input Mask | `<gems-input-mask>` | `string` (raw) | `label`, `maskType` (cep\|telefone\|rg\|email), `icon`, `required` |
| Input Document | `<gems-input-document>` | `string` (raw) | `label`, `documentType` (auto\|cpf\|cnpj), `icon`, `required` |
| Select | `<gems-select>` | `unknown` | `label`, `options: GemsSelectOption[]`, `placeholder`, `required` |
| Textarea | `<gems-textarea>` | `string` | `label`, `rows`, `maxlength`, `autoResize`, `required` |
| Checkbox | `<gems-input-checkbox>` | `boolean` | `label`, `topLabel`, `isSwitch` (default true), `alignWithInputs` |
| Range | `<gems-input-range>` | `GemsRangeValue` | `type` (number\|date), `placeholderMin`, `placeholderMax`, `separator` |
| Field Error | `<gems-field-error>` | — | `control: AbstractControl`, `messages: Record<string, string>` |

### Validation feedback
All input components automatically turn **red** (border + label) via `:host.ng-invalid.ng-touched`.
Default error messages are in **PT-BR**: required, email, minlength, maxlength, min, max, pattern.

---

## Layout Components

### gems-form-card
Wrap forms and content in structured cards. Slots: `[gems-form-card-actions]`, `[gems-form-card-footer]`, default body.
```html
<gems-form-card title="Título" icon="fa-solid fa-file" [isLoading]="loading">
  <!-- body -->
  <div gems-form-card-footer>
    <button class="btn-cancel">Cancelar</button>
    <button class="btn-save">Salvar</button>
  </div>
</gems-form-card>
```

### gems-modal
Two-way `[(open)]`. Sizes: `sm`, `md`, `lg`, `xl`. Auto-closes on ESC.
```html
<gems-modal [(open)]="showModal" title="Confirmar" size="sm">
  <p>Conteúdo</p>
  <div gems-modal-footer>
    <button class="btn-cancel" (click)="showModal = false">Cancelar</button>
    <button class="btn-save" (click)="confirm()">OK</button>
  </div>
</gems-modal>
```

---

## Data Display

### gems-table
Server-side paginated table with sorting, badge columns, skeleton loading, and row actions.
```html
<gems-table [columns]="cols" [data]="rows" [actions]="actions"
  [totalRecords]="total" [page]="page" [size]="size" [isLoading]="loading"
  (pageChange)="onPage($event)" (actionClick)="onAction($event)">
</gems-table>
```

### gems-badge
Inline status indicator. Variants: `neutral`, `success`, `warning`, `danger`, `info`, `primary`.

### gems-empty-state
Empty-list placeholder with optional action button.

---

## Services

| Service | Methods | Purpose |
|---|---|---|
| `GemsAlertService` | `success()`, `error()`, `errorFromApi()`, `warning()`, `info()`, `confirm()` | SweetAlert2 modals |
| `GemsToastService` | `success()`, `error()`, `info()`, `warning()` | Inline toast notifications |
| `GemsLoadingService` | `show()`, `hide()`, `forceHide()` | Full-page loading overlay |
| `GemsNavigationService` | `navigate()`, `navigateWithData()`, `consumeRouteData()`, `back()` | Session-based routing |
| `GemsSessionService` | `setItem()`, `getItem()`, `removeItem()`, `clear()` | SSR-safe sessionStorage |

---

## HTTP (GemsBaseStore)

Extend `GemsBaseStore` for API services. Auto-injects Keycloak Bearer token.

```typescript
@Injectable({ providedIn: 'root' })
export class UserStore extends GemsBaseStore {
  constructor() { super('users'); }

  findAll(p: GemsPageable) { return this.get<Page<User>>('', { pageable: p }); }
  findById(id: number)     { return this.get<User>(`${id}`); }
  create(u: User)          { return this.post<User, User>('', u); }
  update(id: number, u: User) { return this.put<User, User>(`${id}`, u); }
  remove(id: number)       { return this.delete<void>(`${id}`); }
}
```

Provide the API base URL:
```typescript
{ provide: GEMS_API_URL, useValue: 'https://api.example.com' }
```

---

## Auth (Keycloak)

- **Route guard:** `canActivate: [gemsRoleGuard]` with `data: { roles: ['ADMIN'] }`
- **Template directive:** `*gemsHasRole="'ADMIN'"` or `*gemsHasRole="['EDITOR','ADMIN']"`

---

## Theming Setup

1. `provideGemsTheme({ primary, secondary, tertiary, background })` in `app.config.ts`
2. Import CSS tokens in `styles.css`:
   ```css
   @import "@gabriel-mdias/angular-gems-sdk/src/lib/styles/gems-global.css";
   ```

---

## Full Form Example (copy-paste ready)

```html
<gems-form-card title="Cadastro" icon="fa-solid fa-user-plus">
  <form [formGroup]="form">
    <gems-input-text label="Nome" formControlName="name" [required]="true"></gems-input-text>
    <gems-field-error [control]="form.get('name')"></gems-field-error>

    <gems-input-text label="E-mail" formControlName="email" type="email" [required]="true"></gems-input-text>
    <gems-field-error [control]="form.get('email')"></gems-field-error>

    <gems-input-date label="Nascimento" formControlName="birthDate" formato="diaMesAno"></gems-input-date>

    <gems-input-mask label="Telefone" formControlName="phone" maskType="telefone" [required]="true"></gems-input-mask>
    <gems-field-error [control]="form.get('phone')"></gems-field-error>

    <gems-input-document label="CPF/CNPJ" formControlName="doc" [required]="true"></gems-input-document>
    <gems-field-error [control]="form.get('doc')"></gems-field-error>

    <gems-select label="Status" formControlName="status" [options]="statusOpts" [required]="true"></gems-select>
    <gems-field-error [control]="form.get('status')"></gems-field-error>

    <gems-textarea label="Obs" formControlName="notes" [rows]="4" [maxlength]="500"></gems-textarea>

    <gems-input-checkbox label="Ativo" formControlName="active"></gems-input-checkbox>
  </form>

  <div gems-form-card-footer>
    <button class="btn-cancel">Cancelar</button>
    <gems-button label="Salvar" variant="primary" (click)="save()"></gems-button>
  </div>
</gems-form-card>
```
