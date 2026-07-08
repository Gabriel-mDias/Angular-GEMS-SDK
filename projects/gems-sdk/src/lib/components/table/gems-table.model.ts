/** Linha de dados da tabela — mapa de campo → valor. */
export type GemsTableRow = Record<string, unknown>;

/** Rótulos configuráveis da tabela (i18n). Defaults em pt-BR. */
export interface GemsTableLabels {
  /** "Mostrando {from} até {to} de {total} registros" */
  showing?: (from: number, to: number, total: number) => string;
  perPage?: string;
  page?: (current: number, total: number) => string;
  previous?: string;
  next?: string;
}

export interface GemsTableColumn {
  field: string;
  header: string;
  type?: 'text' | 'badge' | 'actions' | 'document';
  sortable?: boolean;
  sortParam?: string;
  docTypeField?: string;
  badgeColors?: Record<string, { bg: string; text: string }>;
}

export interface GemsTableAction {
  icon: string;
  tooltip: string;
  colorClass?: string;
  actionName: string;
  visible?: (row: GemsTableRow) => boolean;
}
