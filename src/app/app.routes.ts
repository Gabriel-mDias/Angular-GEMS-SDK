import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'components', pathMatch: 'full' },
  { 
    path: 'components', 
    loadComponent: () => import('./pages/components-page/components-page.component').then(m => m.ComponentsPageComponent) 
  }
];
