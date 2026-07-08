/** Representa uma opção individual do componente gems-select. */
export interface GemsSelectOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
}

/** Função de comparação para determinar a opção selecionada (valores objeto). */
export type GemsSelectCompareWith<T = unknown> = (a: T, b: T) => boolean;
