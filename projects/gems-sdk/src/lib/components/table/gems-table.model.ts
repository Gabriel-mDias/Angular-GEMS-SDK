/** Linha de dados da tabela — mapa de campo → valor. */
export type GemsTableRow = Record<string, any>;

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
