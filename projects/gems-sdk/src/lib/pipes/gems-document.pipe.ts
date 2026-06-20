import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gemsDocument',
  standalone: true
})
export class GemsDocumentPipe implements PipeTransform {
  transform(value: string | number | null | undefined, type: string = 'CPF'): string {
    if (!value) return '';
    
    const rawValue = value.toString().replace(/\D/g, '');
    const docType = (type || 'CPF').toUpperCase();

    if (docType === 'CPF') {
      return this.formatCPF(rawValue);
    } else if (docType === 'CNPJ') {
      return this.formatCNPJ(rawValue);
    }

    return rawValue;
  }

  private formatCPF(value: string): string {
    if (value.length !== 11) return value;
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private formatCNPJ(value: string): string {
    if (value.length !== 14) return value;
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}
