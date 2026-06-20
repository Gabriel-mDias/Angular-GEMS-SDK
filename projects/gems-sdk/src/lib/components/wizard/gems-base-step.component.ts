import { Directive, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Classe base abstrata para os passos de um formulário multi-step (Wizard).
 * Gerencia validação do FormGroup, persistência em sessão e navegação entre passos.
 *
 * Uso: extenda esta classe nos componentes de cada step, implementando os
 * métodos abstratos.
 */
@Directive()
export abstract class GemsBaseStepComponent<T = Record<string, unknown>> implements OnInit {
  // ── Campos abstratos ──────────────────────────────────────────────
  /** FormGroup reativo deste passo. */
  abstract formGroup: FormGroup;

  /** Índice ou identificador deste passo (começa em 1). */
  abstract stepIndex: number;

  // ── Ciclo de vida ─────────────────────────────────────────────────
  ngOnInit(): void {
    this.createForm();
    this.loadFromSession();
  }

  // ── Métodos abstratos ─────────────────────────────────────────────
  /** Cria o formGroup com validações. */
  abstract createForm(): void;

  /** Carrega dados da sessão (se existirem) no formGroup. */
  abstract loadFromSession(): void;

  /** Salva os dados do formGroup na sessão. */
  abstract saveToSession(payload: T): void;

  /** Avança para o próximo passo. */
  abstract goNext(): void;

  /** Volta para o passo anterior. */
  abstract goBack(): void;

  // ── Métodos públicos ──────────────────────────────────────────────
  /** Valida o form, salva na sessão e avança. Marca todos os campos como tocados se inválido. */
  saveAndNext(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.saveToSession(this.formGroup.value as T);
    this.goNext();
  }
}
