import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, Optional } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { GemsRoleMode, gemsHasRequiredRoles } from './gems-role.util';

/**
 * Diretiva estrutural que renderiza o elemento apenas se o usuário possuir os
 * papéis exigidos.
 *
 * ```html
 * <button *gemsHasRole="'ADMIN'">Excluir</button>
 * <button *gemsHasRole="['EDITOR','ADMIN']">Editar</button>
 * <div *gemsHasRole="['A','B']; mode: 'all'">Só com A e B</div>
 * ```
 *
 * Quando o `KeycloakService` não está configurado, o conteúdo é renderizado
 * (fail-open), assumindo que a aplicação não usa autenticação.
 */
@Directive({
  selector: '[gemsHasRole]',
  standalone: true,
})
export class GemsHasRoleDirective implements OnInit {
  private requiredRoles: string[] = [];
  private mode: GemsRoleMode = 'any';
  private hasView = false;

  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    @Optional() private readonly keycloak: KeycloakService,
  ) {}

  @Input()
  set gemsHasRole(val: string | string[] | undefined) {
    this.requiredRoles = !val ? [] : Array.isArray(val) ? val : [val];
    this.updateView();
  }

  @Input()
  set gemsHasRoleMode(mode: GemsRoleMode) {
    this.mode = mode ?? 'any';
    this.updateView();
  }

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const allowed =
      !this.keycloak ||
      gemsHasRequiredRoles(this.keycloak.getUserRoles(), this.requiredRoles, this.mode);

    if (allowed && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!allowed && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
