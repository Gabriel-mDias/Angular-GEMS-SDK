import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'showcase/forms', pathMatch: 'full' },
  { 
    path: 'showcase/forms', 
    loadComponent: () => import('./pages/showcase/forms/forms-page.component').then(m => m.FormsPageComponent) 
  },
  { 
    path: 'showcase/search', 
    loadComponent: () => import('./pages/showcase/search/search-page.component').then(m => m.SearchPageComponent) 
  },
  { 
    path: 'showcase/wizard', 
    loadComponent: () => import('./pages/showcase/wizard/wizard-page.component').then(m => m.WizardPageComponent) 
  },
  { 
    path: 'showcase/alerts', 
    loadComponent: () => import('./pages/showcase/alerts/alerts-page.component').then(m => m.AlertsPageComponent) 
  },
  { 
    path: 'showcase/buttons', 
    loadComponent: () => import('./pages/showcase/buttons/buttons-page.component').then(m => m.ButtonsPageComponent) 
  },
  { 
    path: 'showcase/list-select', 
    loadComponent: () => import('./pages/showcase/list-select/list-select-page.component').then(m => m.ListSelectPageComponent) 
  },
  { 
    path: 'showcase/file-upload', 
    loadComponent: () => import('./pages/showcase/file-upload/file-upload-page.component').then(m => m.FileUploadPageComponent) 
  }
];
