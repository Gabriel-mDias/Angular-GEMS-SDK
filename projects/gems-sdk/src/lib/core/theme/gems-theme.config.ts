/**
 * Interface de configuração do tema GEMS.
 *
 * O consumidor da SDK passa essas cores no `provideGemsTheme()` e a SDK
 * gera automaticamente variações (50-900) via manipulação HSL para cada cor.
 */
export interface GemsThemeConfig {
  /** Cor primária — fontes, ícones, botões de ação principal */
  primary: string;
  /** Cor secundária — cards, tabelas, cabeçalhos, fundo alternativo */
  secondary: string;
  /** Cor terciária — terceira opção de botões e destaques */
  tertiary: string;
  /** Cor de fundo da aplicação */
  background: string;
  /** Cor de alerta/erro (opcional, default: #dc2626) */
  danger?: string;
  /** Cor de sucesso (opcional, default: #16a34a) */
  success?: string;
  /** Cor de aviso (opcional, default: #f59e0b) */
  warning?: string;
  /** Cor de informação (opcional, default: #3b82f6) */
  info?: string;
}

/**
 * Tema padrão caso o consumidor não configure nenhum.
 */
export const GEMS_DEFAULT_THEME: GemsThemeConfig = {
  primary: '#111827',
  secondary: '#e17827',
  tertiary: '#3b82f6',
  background: '#f8f9fa',
  danger: '#dc2626',
  success: '#16a34a',
  warning: '#f59e0b',
  info: '#3b82f6',
};
