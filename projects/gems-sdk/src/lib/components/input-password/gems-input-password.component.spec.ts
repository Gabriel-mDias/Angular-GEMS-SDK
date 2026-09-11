import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { GemsInputPasswordComponent } from './gems-input-password.component';

@Component({
  imports: [ReactiveFormsModule, GemsInputPasswordComponent],
  template: `
    <gems-input-password
      id="senha"
      [formControl]="senha"
      [required]="true"
      [username]="username()"
      [email]="email()"
    ></gems-input-password>
    <gems-input-password
      id="confirmacao"
      [formControl]="confirmacao"
      [required]="true"
      [enforcePolicy]="false"
      [showCriteria]="false"
      [matchControl]="senha"
    ></gems-input-password>
  `,
})
class HostComponent {
  readonly senha = new FormControl('');
  readonly confirmacao = new FormControl('');
  readonly username = signal('gestor');
  readonly email = signal('gestor@gems.com.br');
}

describe('GemsInputPasswordComponent (C3)', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  const montar = () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('reprova a senha fraca pela política do próprio componente', () => {
    const fixture = montar();
    const { senha } = fixture.componentInstance;

    senha.setValue('curta');
    fixture.detectChanges();

    expect(senha.errors?.['passwordPolicy']).toEqual({
      minLength: true,
      uppercase: true,
      specialCharacter: true,
    });
  });

  it('aprova a senha que atende a todos os critérios', () => {
    const fixture = montar();
    const { senha } = fixture.componentInstance;

    senha.setValue('SenhaForte@2026');
    fixture.detectChanges();

    expect(senha.errors).toBeNull();
  });

  it('reprova espaço em branco e senha igual ao usuário ou ao e-mail', () => {
    const fixture = montar();
    const { senha } = fixture.componentInstance;

    senha.setValue('Senha Forte@2026');
    fixture.detectChanges();
    expect(senha.errors?.['passwordPolicy']).toEqual({ noWhitespace: true });

    senha.setValue('Gestor@Gems.com.br');
    fixture.detectChanges();
    expect(senha.errors?.['passwordEqualsIdentity']).toEqual({ email: true });
  });

  it('publica passwordMismatch no campo de repetição e o retira quando os valores coincidem', () => {
    const fixture = montar();
    const { senha, confirmacao } = fixture.componentInstance;

    senha.setValue('SenhaForte@2026');
    confirmacao.setValue('Outra@Senha2026');
    fixture.detectChanges();
    expect(confirmacao.errors?.['passwordMismatch']).toBe(true);

    confirmacao.setValue('SenhaForte@2026');
    fixture.detectChanges();
    expect(confirmacao.errors).toBeNull();
  });

  it('revalida a repetição quando o campo original muda depois dela', () => {
    const fixture = montar();
    const { senha, confirmacao } = fixture.componentInstance;

    senha.setValue('SenhaForte@2026');
    confirmacao.setValue('SenhaForte@2026');
    fixture.detectChanges();
    expect(confirmacao.errors).toBeNull();

    senha.setValue('SenhaForte@2027');
    fixture.detectChanges();
    expect(confirmacao.errors?.['passwordMismatch']).toBe(true);
  });

  it('exige preenchimento e não aplica a política ao campo de repetição', () => {
    const fixture = montar();
    const { senha, confirmacao } = fixture.componentInstance;

    expect(senha.errors?.['required']).toBe(true);

    senha.setValue('ab');
    confirmacao.setValue('ab');
    fixture.detectChanges();
    expect(confirmacao.errors).toBeNull();
    expect(senha.errors?.['passwordPolicy']).toBeDefined();
  });

  it('lista apenas os critérios pendentes, e só onde a política é aplicada', () => {
    const fixture = montar();
    const { senha } = fixture.componentInstance;

    senha.setValue('senhamuitolonga');
    fixture.detectChanges();

    const listas = fixture.nativeElement.querySelectorAll('.gems-password-criteria');
    expect(listas.length).toBe(1);
    expect(listas[0].id).toBe('senha-criteria');
    const itens = [...listas[0].querySelectorAll('li')].map((li: HTMLElement) =>
      li.textContent?.trim(),
    );
    expect(itens).toEqual([
      'Inclua uma letra maiúscula.',
      'Inclua um caractere especial: @ # $ % ^ & + = !.',
    ]);

    // `id` é input do componente e atributo do host: a busca precisa ser pelo próprio <input>.
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toBe('senha-criteria');
  });

  it('mantém o CVA: escrita, digitação, touched e alternância de visibilidade', () => {
    const fixture = montar();
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    const { senha } = fixture.componentInstance;

    senha.setValue('SenhaForte@2026');
    fixture.detectChanges();
    expect(inputs[0].value).toBe('SenhaForte@2026');
    expect(inputs[0].type).toBe('password');

    inputs[0].value = 'OutraSenha@2026';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[0].dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(senha.value).toBe('OutraSenha@2026');
    expect(senha.touched).toBe(true);

    (fixture.nativeElement.querySelector('.gems-toggle-btn') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(inputs[0].type).toBe('text');
  });
});
