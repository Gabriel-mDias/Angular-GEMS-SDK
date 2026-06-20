import { TestBed } from '@angular/core/testing';

import { GemsLoadingService } from './gems-loading.service';

describe('GemsLoadingService', () => {
  let service: GemsLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GemsLoadingService);
  });

  it('deve criar o serviço', () => {
    expect(service).toBeTruthy();
  });

  it('deve iniciar com isLoading false', () => {
    expect(service.isLoading()).toBeFalse();
  });

  // ── show() ────────────────────────────────────────────────────────
  describe('show()', () => {
    it('deve ativar o loading após a primeira chamada', () => {
      service.show();
      expect(service.isLoading()).toBeTrue();
    });

    it('deve manter loading ativo com múltiplas chamadas', () => {
      service.show();
      service.show();
      service.show();
      expect(service.isLoading()).toBeTrue();
    });
  });

  // ── hide() ────────────────────────────────────────────────────────
  describe('hide()', () => {
    it('deve desativar o loading quando o contador chegar a zero', () => {
      service.show();
      service.hide();
      expect(service.isLoading()).toBeFalse();
    });

    it('deve manter loading ativo enquanto houver requisições pendentes', () => {
      service.show();
      service.show();
      service.hide(); // contador = 1
      expect(service.isLoading()).toBeTrue();
    });

    it('deve desativar somente quando todas as requisições terminarem', () => {
      service.show();
      service.show();
      service.show();
      service.hide();
      service.hide();
      expect(service.isLoading()).toBeTrue();
      service.hide(); // contador = 0
      expect(service.isLoading()).toBeFalse();
    });

    it('não deve permitir contador negativo ao chamar hide sem show', () => {
      service.hide(); // contador não deve ir abaixo de 0
      expect(service.isLoading()).toBeFalse();
      // Uma chamada posterior de show deve funcionar normalmente
      service.show();
      expect(service.isLoading()).toBeTrue();
    });
  });

  // ── forceHide() ───────────────────────────────────────────────────
  describe('forceHide()', () => {
    it('deve desativar o loading imediatamente', () => {
      service.show();
      service.show();
      service.forceHide();
      expect(service.isLoading()).toBeFalse();
    });

    it('deve zerar o contador para que hide funcione corretamente em seguida', () => {
      service.show();
      service.show();
      service.forceHide();
      // show/hide normais devem funcionar após forceHide
      service.show();
      expect(service.isLoading()).toBeTrue();
      service.hide();
      expect(service.isLoading()).toBeFalse();
    });
  });
});
