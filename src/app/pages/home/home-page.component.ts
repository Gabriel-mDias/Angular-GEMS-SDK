import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Item de uma categoria no roadmap. */
export interface RoadmapItem {
  label: string;
  description?: string;
  icon: string;
  route: string;
}

/** Grupo de itens do roadmap. */
export interface RoadmapGroup {
  title: string;
  description: string;
  icon: string;
  type?: 'component' | 'resource';
  items: RoadmapItem[];
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly roadmapGroups: RoadmapGroup[] = [
    {
      title: 'Começando',
      description: 'Instalação, tema e tokens de design.',
      icon: 'fa-solid fa-rocket',
      type: 'resource',
      items: [
        { label: 'Tema dinâmico', description: 'provideGemsTheme, paletas e runtime', icon: 'fa-solid fa-palette', route: '/showcase/resources/theming' },
        { label: 'Tokens de design', description: 'Variáveis CSS, espaçamento e tipografia', icon: 'fa-solid fa-code', route: '/showcase/resources/theming' },
      ],
    },
    {
      title: 'Formulários',
      description: 'Campos de entrada, seleção, validação e agrupamento.',
      icon: 'fa-solid fa-pen-to-square',
      type: 'component',
      items: [
        { label: 'Input Text', description: 'Texto, e-mail, número, tel, url', icon: 'fa-solid fa-i-cursor', route: '/showcase/input-text' },
        { label: 'Select', description: 'Dropdown nativo acessível', icon: 'fa-solid fa-chevron-down', route: '/showcase/select' },
        { label: 'Textarea', description: 'Multilinha com auto-resize', icon: 'fa-solid fa-align-left', route: '/showcase/textarea' },
        { label: 'Field Error', description: 'Mensagens de validação PT-BR', icon: 'fa-solid fa-triangle-exclamation', route: '/showcase/field-error' },
        { label: 'Form Card', description: 'Agrupamento e seção de ações', icon: 'fa-solid fa-rectangle-list', route: '/showcase/forms' },
      ],
    },
    {
      title: 'Botões',
      description: 'Classes globais e componente de botão.',
      icon: 'fa-solid fa-hand-pointer',
      type: 'component',
      items: [
        { label: 'Botões', description: 'Classes .btn-* e gems-button', icon: 'fa-solid fa-square-full', route: '/showcase/buttons' },
      ],
    },
    {
      title: 'Exibição de dados',
      description: 'Tabelas, listas, badges e estados vazios.',
      icon: 'fa-solid fa-table',
      type: 'component',
      items: [
        { label: 'Table', description: 'Paginação, ordenação e seleção', icon: 'fa-solid fa-table', route: '/showcase/search' },
        { label: 'Card List Select', description: 'Seleção visual em cards', icon: 'fa-solid fa-grip', route: '/showcase/list-select' },
        { label: 'Badge', description: 'Rótulos de status coloridos', icon: 'fa-solid fa-tag', route: '/showcase/badge' },
        { label: 'Empty State', description: 'Tela vazia com ação opcional', icon: 'fa-solid fa-inbox', route: '/showcase/empty-state' },
      ],
    },
    {
      title: 'Feedback',
      description: 'Alertas, notificações, modais e indicadores de carregamento.',
      icon: 'fa-solid fa-bell',
      type: 'component',
      items: [
        { label: 'Alerts', description: 'Diálogos SweetAlert2', icon: 'fa-solid fa-circle-exclamation', route: '/showcase/alerts' },
        { label: 'Toast', description: 'Notificações temporárias', icon: 'fa-solid fa-comment-dots', route: '/showcase/toast' },
        { label: 'Modal', description: 'Diálogo com backdrop e ESC', icon: 'fa-solid fa-window-restore', route: '/showcase/modal' },
        { label: 'Loading Full', description: 'Spinner de tela cheia', icon: 'fa-solid fa-spinner', route: '/showcase/loading/full-page' },
        { label: 'Loading Skeleton', description: 'Placeholder enquanto carrega', icon: 'fa-solid fa-bars', route: '/showcase/loading/skeleton' },
      ],
    },
    {
      title: 'Navegação & Layout',
      description: 'Menu lateral, abas, wizard e upload.',
      icon: 'fa-solid fa-compass',
      type: 'component',
      items: [
        { label: 'Side Menu', description: 'Menu lateral colapsável', icon: 'fa-solid fa-sidebar', route: '/showcase/forms' },
        { label: 'Tabs', description: 'Navegação por abas acessível', icon: 'fa-solid fa-folder', route: '/showcase/tabs' },
        { label: 'Wizard', description: 'Fluxo passo a passo', icon: 'fa-solid fa-list-check', route: '/showcase/wizard' },
        { label: 'File Upload', description: 'Upload com S3 e preview', icon: 'fa-solid fa-cloud-arrow-up', route: '/showcase/file-upload' },
      ],
    },
    {
      title: 'Recursos da SDK',
      description: 'HTTP, autenticação, serviços e configuração — partes não-visuais da biblioteca.',
      icon: 'fa-solid fa-gear',
      type: 'resource',
      items: [
        { label: 'HTTP / BaseStore', description: 'GemsBaseStore, GEMS_API_URL e Pageable', icon: 'fa-solid fa-server', route: '/showcase/resources/base-store' },
        { label: 'Loading Interceptor', description: 'gemsLoadingInterceptor + GemsLoadingService', icon: 'fa-solid fa-circle-notch', route: '/showcase/resources/http-loading' },
        { label: 'Serviços utilitários', description: 'Navigation, Session, S3, Alert', icon: 'fa-solid fa-toolbox', route: '/showcase/resources/services' },
        { label: 'Auth & Keycloak', description: 'gemsRoleGuard + *HasRole directive', icon: 'fa-solid fa-shield-halved', route: '/showcase/resources/auth' },
      ],
    },
  ];
}
