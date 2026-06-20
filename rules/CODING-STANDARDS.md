# Padrões de Código — Angular GEMS SDK

Regras **obrigatórias** para todo arquivo da SDK (`projects/gems-sdk`) e do app
de showcase (`src`). O objetivo é um código **tipado, claro e estruturado**, no
estilo de linguagens fortemente tipadas (Java). Estas regras são severas: PRs e
alterações de IA que não as cumpram devem ser corrigidos antes de prosseguir.

---

## 1. Estrutura dos arquivos `.ts`

Todo arquivo de classe (component, service, directive, store) segue **esta ordem
fixa de seções**, com um comentário de divisória `// ──────` separando-as:

```typescript
// 1. Imports (Angular primeiro, libs depois, internos por último)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsFooModel } from './gems-foo.model';

// 2. Tipos auxiliares pequenos podem ficar aqui; tipos públicos vão em .model.ts
//    (ver regra 5)

/**
 * 3. JSDoc da classe — o que ela é e como se usa. Em português.
 */
@Component({
  selector: 'gems-foo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gems-foo.component.html', // NUNCA template inline (regra 2)
  styleUrls: ['./gems-foo.component.css'],
})
export class GemsFooComponent implements OnInit {

  // ── Inputs / Outputs (a "API pública" do componente) ──────────────
  readonly titulo = input<string>('');
  readonly itemSelecionado = output<GemsFooModel>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly carregando = signal<boolean>(false);

  // ── Estado derivado (computed) ────────────────────────────────────
  protected readonly temItens = computed(() => this.itens().length > 0);

  // ── Construtor (injeção de dependências — ver regra 3) ────────────
  constructor(private readonly fooService: GemsFooService) {}

  // ── Ciclo de vida ─────────────────────────────────────────────────
  ngOnInit(): void { /* ... */ }

  // ── Métodos públicos ──────────────────────────────────────────────
  selecionar(item: GemsFooModel): void { /* ... */ }

  // ── Métodos privados ──────────────────────────────────────────────
  private carregarDados(): void { /* ... */ }
}
```

**Ordem canônica das seções:**
1. Imports
2. Tipos/constantes auxiliares (apenas se realmente locais)
3. JSDoc + decorator + declaração da classe (`implements ...` sempre que houver hook/interface)
4. Inputs e Outputs (parâmetros do componente)
5. Estado interno (signals e campos)
6. Estado derivado (`computed`)
7. Construtor
8. Hooks de ciclo de vida (`ngOnInit`, `ngOnChanges`, ...)
9. Métodos públicos
10. Métodos privados

**Regras adicionais:**
- Se a classe usa um hook (`ngOnInit`, `ngOnChanges`, ...), **declare a interface** correspondente (`implements OnInit`). Hoje há casos com `ngOnInit` sem `implements OnInit` — corrigir.
- Em componentes que implementam `ControlValueAccessor`/`Validator`, agrupe os métodos da interface numa subseção `// ── ControlValueAccessor ──` dentro dos métodos públicos.
- Remova imports não utilizados (há vários `computed`/`OnInit` importados sem uso).

---

## 2. Templates e estilos sempre em arquivos separados

- **PROIBIDO `template: \`...\`` inline.** Todo componente usa `templateUrl`
  apontando para um `.component.html` ao lado do `.ts`.
- O mesmo vale para estilos: use `styleUrls` com `.component.css` (já é o padrão).
- Ao migrar um componente com template inline, crie o `.html` correspondente e
  remova o bloco `template`. Componentes que hoje violam isso: `footer`,
  `form-card`, `summary-card`, `loading`, `file-upload`, `wizard`,
  `input-password`, `input-document`, `input-mask`, `input-range`.

---

## 3. Injeção de dependências via construtor

- **Use injeção pelo construtor** (`constructor(private readonly x: X)`), não
  `inject(X)` dentro do corpo da classe. Familiaridade e clareza de dependências.
- Sempre `private readonly` (ou `protected readonly` se o template precisar).
- **Única exceção técnica:** funções do Angular que **não são classes** —
  `HttpInterceptorFn` (ex.: `gemsLoadingInterceptor`) e guards funcionais
  (`CanActivateFn`, ex.: `gemsRoleGuard`) — **obrigatoriamente** usam `inject()`,
  pois não há construtor. Não "corrija" esses dois casos para construtor.
- Dependências opcionais: `@Optional()` no construtor (ex.: `KeycloakService`).

---

## 4. Tipagem forte — proibido `any` solto

- **Nunca** use `any` como tipo de dado de domínio. Hoje há `data: any[]`,
  `items: any[]`, `onChange: any`, `getBadgeStyle(...): any` — todos devem ser tipados.
- Componentes de dados são **genéricos**: `GemsTableComponent<T>`,
  `GemsCardListSelectComponent<T>` em vez de `any[]`.
- Callbacks de `ControlValueAccessor` são tipados:
  `private onChange: (value: T) => void = () => {};`
- Use `unknown` + narrowing quando o tipo for realmente desconhecido, nunca `any`.
- Prefira `type`/`interface` explícitos e exporte-os (regra 5).

---

## 5. Tipos públicos ficam em `.model.ts` e são exportados

- Interfaces/types/enums que fazem parte da API pública de um componente vão num
  arquivo `*.model.ts` (ou `*.models.ts`) ao lado do componente.
- **Todo tipo público deve ser reexportado** no `public-api.ts` do entry-point
  correspondente. Hoje faltam exports de: `GemsDocumentType`, `GemsMaskType`,
  `GemsRangeValue`, `GemsDateFormat`, `GemsWizardStep`, `GemsBaseStepComponent`.
  Sem isso o consumidor não consegue tipar suas variáveis.
- Ao criar um novo export, adicione-o ao barrel correto
  (`components|services|http|auth/public-api.ts`), que flui para o `public-api.ts` raiz.

---

## 6. Control flow e signals (Angular 20)

- Use o **control flow novo** (`@if`, `@for`, `@switch`) no template. Não use
  `*ngIf`/`*ngFor`. (Há mistura dos dois hoje — padronizar no novo.)
- `@for` sempre com `track` (ex.: `track item.id`).
- Estado reativo usa **signals** (`signal`, `computed`, `input`, `output`,
  `model`). Evite campos mutáveis "soltos" para estado de UI (ex.: o `side-menu`
  usa `isCollapsed`/`isMobileView` como booleans — migrar para `signal`).
- Two-way binding usa `model()` (como em `summary-card`), não pares manuais
  `input()` + `output()` + `xxxChange` (como em `card-list-select`).
- Marque inputs/outputs como `readonly`.

---

## 7. Nomenclatura

- Prefixo `gems` em todos os seletores, classes (`GemsXxx`), arquivos
  (`gems-xxx.component.ts`) e CSS custom properties (`--gems-*`).
- Arquivos: `kebab-case`. Classes/Tipos: `PascalCase`. Membros: `camelCase`.
- IDs únicos de inputs: usar `crypto.randomUUID()` em vez de
  `Math.random().toString(36)`.

---

## 8. Estilos, tema e responsividade

- **Nunca** hardcode cores/espaçamentos. Use as CSS custom properties dos design
  tokens (`--gems-primary-*`, `--gems-spacing-*`, `--gems-radius-*`, etc.).
- ⚠️ Use os nomes **corretos** das paletas geradas pelo tema: a paleta de erro é
  `--gems-danger-*` (não `--gems-error-*`). Corrigir o `GemsAlertService`.
- **Desktop-first, mas mobile-friendly**: todo componente precisa de
  `@media (max-width: 768px)`. Hoje só `table`, `side-menu`, `footer` e `wizard`
  têm media queries; os demais devem ganhar tratamento mobile.
- Respeite `@media (prefers-reduced-motion: reduce)` nas animações.
- Alvos de toque ≥ 44×44px em mobile.

---

## 9. Acessibilidade (mínimo obrigatório)

- `label` associado a todo input (`[for]`/`id`).
- Elementos interativos não-nativos (divs clicáveis, dropzone do upload) precisam
  de `role`, `tabindex="0"` e handlers de teclado (`Enter`/`Space`).
- Use `aria-*` em estados (ex.: `aria-expanded` no summary-card e side-menu).

---

## 10. Textos e i18n

- Não deixe strings de UI hardcoded em português dentro do componente quando elas
  forem visíveis ao usuário final (ex.: "Enviando arquivo...", "até",
  "Nenhum registro encontrado"). Exponha-as como `input()` com default em PT, para
  o consumidor poder sobrescrever/traduzir.
