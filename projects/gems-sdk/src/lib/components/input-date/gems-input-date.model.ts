/** Formato de data (inglês). */
export type GemsDateFormat = 'dayMonthYear' | 'fullDate' | 'monthYear' | 'year';

/**
 * @deprecated Valores em português mantidos por compatibilidade. Use
 * `GemsDateFormat` (dayMonthYear | fullDate | monthYear | year).
 */
export type GemsDateFormatLegacy = 'diaMesAno' | 'fullData' | 'mesAno' | 'ano';

/** Aceita tanto os valores novos (EN) quanto os legados (PT). */
export type GemsDateFormatInput = GemsDateFormat | GemsDateFormatLegacy;

/** Normaliza um valor de formato (PT legado ou EN) para o canônico EN. */
export function gemsNormalizeDateFormat(value: GemsDateFormatInput): GemsDateFormat {
  switch (value) {
    case 'diaMesAno':
      return 'dayMonthYear';
    case 'fullData':
      return 'fullDate';
    case 'mesAno':
      return 'monthYear';
    case 'ano':
      return 'year';
    default:
      return value;
  }
}
