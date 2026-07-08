/** Tipo de máscara (inglês). */
export type GemsMaskType = 'cep' | 'phone' | 'rg' | 'email';

/**
 * @deprecated Use `GemsMaskType`. Alias em português (`telefone`) mantido por
 * compatibilidade.
 */
export type GemsMaskTypeLegacy = 'cep' | 'telefone' | 'rg' | 'email';

/** Aceita tanto o valor novo (EN) quanto o legado (PT). */
export type GemsMaskTypeInput = GemsMaskType | GemsMaskTypeLegacy;

/** Normaliza o tipo de máscara (legado PT ou EN) para o canônico EN. */
export function gemsNormalizeMaskType(value: GemsMaskTypeInput): GemsMaskType {
  return value === 'telefone' ? 'phone' : value;
}
