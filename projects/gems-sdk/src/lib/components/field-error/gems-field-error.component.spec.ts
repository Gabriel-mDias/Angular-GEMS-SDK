import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { GemsFieldErrorComponent } from './gems-field-error.component';

@Component({
  imports: [ReactiveFormsModule, GemsFieldErrorComponent],
  template: `
    <gems-field-error
      [control]="email"
      [messages]="{ email: 'Informe um e-mail corporativo.' }"
    ></gems-field-error>
  `,
})
class HostComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
}

describe('GemsFieldErrorComponent (C1)', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  const texto = (fixture: { nativeElement: HTMLElement }): string =>
    fixture.nativeElement.querySelector('.gems-field-error')?.textContent?.trim() ?? '';

  it('não exibe nada enquanto o campo está intocado', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(texto(fixture)).toBe('');
  });

  it('exibe a mensagem quando o campo fica inválido e tocado depois da vinculação', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const { email } = fixture.componentInstance;
    email.markAsTouched();
    fixture.detectChanges();

    expect(texto(fixture)).toBe('Este campo é obrigatório.');
  });

  it('acompanha a troca de erro sem nova vinculação do controle', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const { email } = fixture.componentInstance;
    email.markAsTouched();
    fixture.detectChanges();
    expect(texto(fixture)).toBe('Este campo é obrigatório.');

    email.setValue('nao-e-email');
    fixture.detectChanges();
    expect(texto(fixture)).toBe('Informe um e-mail corporativo.');

    email.setValue('pessoa@gems.com.br');
    fixture.detectChanges();
    expect(texto(fixture)).toBe('');
  });

  it('não exibe nada quando o controle não é vinculado', () => {
    const fixture = TestBed.createComponent(GemsFieldErrorComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.gems-field-error')).toBeNull();
  });

  it('cai na chave crua quando não há mensagem declarada para o erro', () => {
    const fixture = TestBed.createComponent(GemsFieldErrorComponent);
    const controle = new FormControl('');
    controle.setErrors({ passwordMismatch: true });
    controle.markAsDirty();
    fixture.componentRef.setInput('control', controle);
    fixture.detectChanges();

    expect(texto(fixture)).toBe('Erro: passwordMismatch');
  });
});
