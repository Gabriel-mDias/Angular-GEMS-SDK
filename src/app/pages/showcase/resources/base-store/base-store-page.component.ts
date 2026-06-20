import { Component } from '@angular/core';

import { GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../../components/code-snippet';

@Component({
  selector: 'app-base-store-page',
  standalone: true,
  imports: [GemsFormCardComponent, CodeSnippetComponent],
  templateUrl: './base-store-page.component.html',
  styleUrls: ['./base-store-page.component.css'],
})
export class BaseStorePageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  readonly codeTabs: CodeTab[] = [
    {
      name: 'app.config.ts',
      language: 'typescript',
      code: `import { GEMS_API_URL } from '@gabriel-mdias/angular-gems-sdk';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    { provide: GEMS_API_URL, useValue: 'https://api.meuapp.com' },
  ],
};`,
    },
    {
      name: 'usuario.store.ts',
      language: 'typescript',
      code: `import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GemsBaseStore, GemsPageable } from '@gabriel-mdias/angular-gems-sdk';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioStore extends GemsBaseStore {
  constructor() {
    super('usuarios'); // base: GEMS_API_URL + '/usuarios'
  }

  listar(pageable?: GemsPageable): Observable<Usuario[]> {
    return this.get<Usuario[]>('', { pageable });
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.get<Usuario>(\`/\${id}\`);
  }

  criar(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.post<Usuario>('', usuario);
  }

  atualizar(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.put<Usuario>(\`/\${id}\`, usuario);
  }

  remover(id: number): Observable<void> {
    return this.delete<void>(\`/\${id}\`);
  }
}`,
    },
    {
      name: 'Paginação',
      language: 'typescript',
      code: `import { GemsPageable } from '@gabriel-mdias/angular-gems-sdk';

// GemsPageable suporta page, size e sort
const pageable: GemsPageable = {
  page: 0,
  size: 20,
  sort: 'nome,asc',
};

this.usuarioStore.listar(pageable).subscribe(usuarios => {
  // ...
});`,
    },
  ];
}
