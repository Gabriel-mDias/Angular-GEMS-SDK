import { Directive, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Classe base para os passos de um formulário multi-step (Wizard).
 * Responsável por gerenciar a validação, salvar os dados na sessão e navegar para o próximo passo.
 */
@Directive()
export abstract class GemsBaseStepComponent<T = any> implements OnInit {
  /**
   * O formulário reativo deste passo.
   */
  abstract formGroup: FormGroup;

  /**
   * O índice ou identificador deste passo.
   */
  abstract stepIndex: number;

  ngOnInit(): void {
    this.createForm();
    this.loadFromSession();
  }

  /**
   * Cria o formGroup com suas validações.
   */
  abstract createForm(): void;

  /**
   * Carrega os dados da sessão (se existirem) para o formGroup.
   */
  abstract loadFromSession(): void;

  /**
   * Salva os dados do formGroup na sessão.
   */
  abstract saveToSession(payload: T): void;

  /**
   * Lógica para avançar para o próximo passo.
   */
  abstract goNext(): void;

  /**
   * Lógica para voltar para o passo anterior.
   */
  abstract goBack(): void;

  /**
   * Executa a validação do formulário, salva na sessão e avança.
   */
  saveAndNext(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    
    this.saveToSession(this.formGroup.value);
    this.goNext();
  }
}
