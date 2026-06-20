import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home-page.component').then(m => m.HomePageComponent) },

  // ── Formulários ───────────────────────────────────────────────────
  { path: 'showcase/forms', loadComponent: () => import('./pages/showcase/forms/forms-page.component').then(m => m.FormsPageComponent) },
  { path: 'showcase/input-text', loadComponent: () => import('./pages/showcase/input-text/input-text-page.component').then(m => m.InputTextPageComponent) },
  { path: 'showcase/select', loadComponent: () => import('./pages/showcase/select/select-page.component').then(m => m.SelectPageComponent) },
  { path: 'showcase/textarea', loadComponent: () => import('./pages/showcase/textarea/textarea-page.component').then(m => m.TextareaPageComponent) },
  { path: 'showcase/field-error', loadComponent: () => import('./pages/showcase/field-error/field-error-page.component').then(m => m.FieldErrorPageComponent) },

  // ── Botões ────────────────────────────────────────────────────────
  { path: 'showcase/buttons', loadComponent: () => import('./pages/showcase/buttons/buttons-page.component').then(m => m.ButtonsPageComponent) },

  // ── Exibição de dados ─────────────────────────────────────────────
  { path: 'showcase/search', loadComponent: () => import('./pages/showcase/search/search-page.component').then(m => m.SearchPageComponent) },
  { path: 'showcase/list-select', loadComponent: () => import('./pages/showcase/list-select/list-select-page.component').then(m => m.ListSelectPageComponent) },
  { path: 'showcase/badge', loadComponent: () => import('./pages/showcase/badge/badge-page.component').then(m => m.BadgePageComponent) },
  { path: 'showcase/empty-state', loadComponent: () => import('./pages/showcase/empty-state/empty-state-page.component').then(m => m.EmptyStatePageComponent) },

  // ── Feedback / Overlay ────────────────────────────────────────────
  { path: 'showcase/alerts', loadComponent: () => import('./pages/showcase/alerts/alerts-page.component').then(m => m.AlertsPageComponent) },
  { path: 'showcase/toast', loadComponent: () => import('./pages/showcase/toast/toast-page.component').then(m => m.ToastPageComponent) },
  { path: 'showcase/modal', loadComponent: () => import('./pages/showcase/modal/modal-page.component').then(m => m.ModalPageComponent) },
  { path: 'showcase/loading/full-page', loadComponent: () => import('./pages/showcase/loading-full/loading-full-page.component').then(m => m.LoadingFullPageComponent) },
  { path: 'showcase/loading/skeleton', loadComponent: () => import('./pages/showcase/loading-skeleton/loading-skeleton-page.component').then(m => m.LoadingSkeletonPageComponent) },

  // ── Navegação / Layout ────────────────────────────────────────────
  { path: 'showcase/wizard', loadComponent: () => import('./pages/showcase/wizard/wizard-page.component').then(m => m.WizardPageComponent) },
  { path: 'showcase/tabs', loadComponent: () => import('./pages/showcase/tabs/tabs-page.component').then(m => m.TabsPageComponent) },
  { path: 'showcase/file-upload', loadComponent: () => import('./pages/showcase/file-upload/file-upload-page.component').then(m => m.FileUploadPageComponent) },

  // ── Recursos da SDK ───────────────────────────────────────────────
  { path: 'showcase/resources/theming', loadComponent: () => import('./pages/showcase/resources/theming/theming-page.component').then(m => m.ThemingPageComponent) },
  { path: 'showcase/resources/base-store', loadComponent: () => import('./pages/showcase/resources/base-store/base-store-page.component').then(m => m.BaseStorePageComponent) },
  { path: 'showcase/resources/http-loading', loadComponent: () => import('./pages/showcase/resources/http-loading/http-loading-page.component').then(m => m.HttpLoadingPageComponent) },
  { path: 'showcase/resources/services', loadComponent: () => import('./pages/showcase/resources/services/services-page.component').then(m => m.ServicesPageComponent) },
  { path: 'showcase/resources/auth', loadComponent: () => import('./pages/showcase/resources/auth/auth-page.component').then(m => m.AuthPageComponent) },
];
