import { GemsDocumentPipe } from './gems-document.pipe';

describe('GemsDocumentPipe', () => {
  let pipe: GemsDocumentPipe;

  beforeEach(() => {
    pipe = new GemsDocumentPipe();
  });

  it('deve criar a instância', () => {
    expect(pipe).toBeTruthy();
  });

  describe('CPF', () => {
    it('deve formatar CPF com 11 dígitos', () => {
      expect(pipe.transform('12345678901', 'CPF')).toBe('123.456.789-01');
    });

    it('deve usar CPF como tipo padrão', () => {
      expect(pipe.transform('12345678901')).toBe('123.456.789-01');
    });

    it('deve retornar o valor original se CPF não tiver 11 dígitos', () => {
      expect(pipe.transform('123456', 'CPF')).toBe('123456');
    });
  });

  describe('CNPJ', () => {
    it('deve formatar CNPJ com 14 dígitos', () => {
      expect(pipe.transform('12345678000195', 'CNPJ')).toBe('12.345.678/0001-95');
    });

    it('deve retornar o valor original se CNPJ não tiver 14 dígitos', () => {
      expect(pipe.transform('1234567', 'CNPJ')).toBe('1234567');
    });
  });

  describe('Valores nulos e vazios', () => {
    it('deve retornar string vazia para null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('deve retornar string vazia para undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('deve retornar string vazia para string vazia', () => {
      expect(pipe.transform('')).toBe('');
    });
  });

  describe('Input como número', () => {
    it('deve aceitar número como input e formatar CPF', () => {
      expect(pipe.transform(12345678901, 'CPF')).toBe('123.456.789-01');
    });
  });
});
