import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Directive({
  selector: '[gemsHasRole]',
  standalone: true
})
export class GemsHasRoleDirective implements OnInit {
  private requiredRoles: string[] = [];
  private hasView = false;

  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly keycloak = inject(KeycloakService, { optional: true });

  @Input()
  set gemsHasRole(val: string | string[] | undefined) {
    if (!val) {
      this.requiredRoles = [];
    } else {
      this.requiredRoles = Array.isArray(val) ? val : [val];
    }
    this.updateView();
  }

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    if (this.requiredRoles.length === 0 || !this.keycloak) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
      return;
    }

    const userRoles = this.keycloak.getUserRoles();
    const hasRole = this.requiredRoles.some(role => userRoles.includes(role));

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
