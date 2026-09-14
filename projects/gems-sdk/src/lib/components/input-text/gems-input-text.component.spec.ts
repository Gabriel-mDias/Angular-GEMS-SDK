import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { GemsInputTextComponent } from './gems-input-text.component';

@Component({
  imports: [ReactiveFormsModule, GemsInputTextComponent],
  template: `
    <gems-input-text label="Nome" [formControl]="nome" required></gems-input-text>
    <gems-input-text label="Apelido" [formControl]="apelido" [required]="false"></gems-input-text>
  `,
})
class HostComponent {
  readonly nome = new FormControl('');
  readonly apelido = new FormControl('');
}

describe('GemsInputTextComponent (K-02)', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  const montar = () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('torna o campo obrigatório com required sem colchetes', () => {
    const fixture = montar();
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    const asteriscos = fixture.nativeElement.querySelectorAll('.gems-required');

    expect(inputs[0].required).toBe(true);
    expect(asteriscos.length).toBe(1);
  });

  it('mantém o campo opcional com [required]="false"', () => {
    const fixture = montar();
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

    expect(inputs[1].required).toBe(false);
  });
});
