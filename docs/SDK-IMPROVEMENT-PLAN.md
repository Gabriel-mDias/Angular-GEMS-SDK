# Plano de Evolução — Angular GEMS SDK

> Documento de planejamento detalhado para handoff. Pode ser executado por outro
> modelo/desenvolvedor. Cada fase é independente e verificável. Siga sempre as
> [regras de código](../rules/CODING-STANDARDS.md).

## Contexto e objetivo

A SDK foi criada (com apoio do Gemini) para padronizar componentes reutilizáveis
e acelerar a criação de novos projetos G&Ms. O autor é desenvolvedor **Java
backend** e deseja que a SDK tenha um estilo **fortemente tipado, claro e
estruturado**, com **regras severas de padronização**. As aplicações são
**desktop-first** mas precisam ser confortáveis em **mobile**, com o objetivo
final de virarem **PWA**.

Hoje a SDK já tem uma base sólida (signals, CVA, theming por CSS vars, base store
HTTP com Keycloak opcional), mas sofre de inconsistências típicas de código
frontend: templates inline misturados com arquivos `.html`, mistura de `inject()`
e injeção por construtor, mistura de `*ngIf` com `@if`, uso de `any`, tipos
públicos não exportados e responsividade incompleta.

Este plano organiza a estabilização e o crescimento da SDK em fases.

---

## Diagnóstico atual (resumo)

### Inconsistências de padronização
| Tema | Situação atual |
|------|----------------|
| Templates | Inline em ~10 componentes (`footer`, `form-card`, `summary-card`, `loading`, `file-upload`, `wizard`, `input-password/-document/-mask/-range`); separados nos demais |
| Injeção (DI) | Construtor em `file-upload`, `side-menu`, `session`, `navigation`, `s3`, `has-role`; `inject()` em `loading.component`. Interceptor e guard usam `inject()` (correto, são funções) |
| Control flow | Mistura de `*ngIf`/`*ngFor` (antigos) com `@if`/`@for` (novos) |
| Tipagem | `any` em `table` (`data: any[]`), `card-list-select` (`items: any[]`), callbacks CVA (`onChange: any`) |
| Imports | Imports não usados (ex.: `computed`/`OnInit`) em vários componentes |
| Hooks | `ngOnInit` sem `implements OnInit` (`file-upload`) |

### Problemas de consumibilidade (integração em projetos futuros)
- **Tipos públicos não exportados**: `GemsDocumentType`, `GemsMaskType`,
  `GemsRangeValue`, `GemsDateFormat`, `GemsWizardStep`, `GemsBaseStepComponent`.
  O consumidor não consegue declarar variáveis desses tipos.
- **Secondary entry points não configurados**: o `README` da lib anuncia imports
  como `@gabriel-mdias/angular-gems-sdk/components`, mas só existe **um**
  `ng-package.json` (raiz). Hoje tudo resolve só pela raiz do pacote.
- **Componentes de dados não-genéricos**: `table` e `card-list-select` usam `any`,
  perdendo o autocomplete/segurança que um dev Java espera.
- **Bug de tema**: `GemsAlertService` referencia `--gems-error-500`, mas o tema
  gera a paleta como `--gems-danger-*`. Botões de erro caem no fallback `#d33`.

### UX / Mobile / PWA
- Só 4 componentes têm `@media` (`table`, `side-menu`, `footer`, `wizard`).
  Inputs, cards, file-upload e list-select não têm tratamento mobile.
- `table` em telas pequenas precisa de layout empilhado (card) ou scroll com
  affordance.
- `file-upload` mostra só spinner (sem barra de progresso), não suporta múltiplos
  arquivos e a dropzone não é acessível por teclado.
- Animações não respeitam `prefers-reduced-motion`.
- Sem dark mode (tema só claro).
- **Sem infraestrutura PWA**: não há `manifest.webmanifest`, service worker, nem
  ícones em `public/`.

---

## Fase 0 — Ferramentas de enforcement (fazer primeiro)

Regras em markdown não se aplicam sozinhas. Automatize a verificação:

1. **ESLint + angular-eslint** com regras que reflitam o padrão:
   - `@angular-eslint/template/prefer-control-flow` (proíbe `*ngIf`/`*ngFor`)
   - `@typescript-eslint/no-explicit-any` como **erro**
   - `@typescript-eslint/no-unused-vars` como erro
   - regra/lint para impedir `template:` inline (via `@angular-eslint` +
     `no-restricted-syntax` no decorator, ou revisão no PR template)
2. **Prettier** para formatação consistente.
3. **Husky + lint-staged**: rodar lint/format no `pre-commit`.
4. Adicionar scripts: `lint`, `format`, e incluí-los no fluxo.

**Verificação:** `npm run lint` falha nos arquivos que violam as regras hoje
(serve de checklist para a Fase 1).

---

## Fase 1 — Padronização estrutural (sem mudar comportamento)

Aplicar [CODING-STANDARDS.md](../rules/CODING-STANDARDS.md) arquivo a arquivo:

1. **Extrair todos os templates inline** para `.component.html`.
2. **Migrar `inject()` → construtor** nas classes (manter `inject()` apenas no
   interceptor e no guard funcionais).
3. **Migrar `*ngIf`/`*ngFor` → `@if`/`@for`** (com `track`).
4. **Reordenar as seções** de cada classe conforme o padrão; adicionar
   divisórias de seção.
5. **Limpar imports** não usados; adicionar `implements` faltantes.
6. Trocar IDs aleatórios por `crypto.randomUUID()`.

Faça **um componente por commit** para revisão incremental. Ordem sugerida (do
mais simples ao mais complexo): `footer` → `loading` → `form-card` →
`summary-card` → `wizard` → `input-password` → `input-mask` → `input-document` →
`input-range` → `file-upload` → `side-menu`.

**Verificação:** `npm run build:lib` e `npm start` continuam funcionando; o
showcase renderiza cada componente igual a antes.

---

## Fase 2 — Tipagem forte e superfície pública

1. **Mover tipos públicos** para `*.model.ts` ao lado de cada componente.
2. **Tornar genéricos** `GemsTableComponent<T>` e `GemsCardListSelectComponent<T>`
   (eliminar `any[]`); tipar callbacks de CVA.
3. **Exportar todos os tipos públicos** nos barris (`components/public-api.ts`
   etc.): incluir `GemsDocumentType`, `GemsMaskType`, `GemsRangeValue`,
   `GemsDateFormat`, `GemsWizardStep`, `GemsBaseStepComponent`.
4. **Configurar secondary entry points** de verdade no ng-packagr (criar
   `ng-package.json` em `src/components`, `src/services`, `src/http`, `src/auth`)
   **ou** ajustar o README para refletir o entry-point único atual. Recomendado:
   configurar os entry points (melhor tree-shaking, alinha com o README).

**Verificação:** um projeto consumidor consegue importar e tipar
`GemsTableColumn`, `GemsRangeValue`, etc.; `ng build:lib` gera os entry points.

---

## Fase 3 — Correções de comportamento e consumibilidade

1. **Corrigir paleta do alerta**: `--gems-error-*` → `--gems-danger-*` no
   `GemsAlertService`.
2. `side-menu`: substituir `JSON.parse(JSON.stringify(...))` por `structuredClone`;
   migrar estado para signals; rever lógica de `checkScreenSize`.
3. Revisar `model()` para two-way nos componentes de seleção
   (`card-list-select`) em vez de pares `input/output` manuais.
4. Padronizar exibição de **mensagens de validação** nos inputs (área de erro
   consistente quando o `FormControl` é inválido e tocado).

**Verificação:** alertas de erro aparecem com a cor `danger` do tema; formulários
mostram erros de validação de forma uniforme.

---

## Fase 4 — Escalabilidade (novos componentes e organização)

Com o catálogo atual (layout, inputs mascarados, table, wizard, upload, cards),
faltam peças comuns para acelerar novos projetos. Priorizar:

- **`gems-button`** (variações primary/secondary/tertiary/danger, loading state) —
  hoje botões são só classes CSS.
- **`gems-input-text`/`-number`/`-textarea`** e **`gems-select`/dropdown** com CVA.
- **`gems-radio-group`** e refino do checkbox.
- **`gems-modal`/`dialog`** reutilizável (além do Swal para alertas).
- **`gems-tabs`**, **`gems-breadcrumb`**, **`gems-badge`**, **`gems-empty-state`**,
  **`gems-tooltip`**, **`gems-pagination`** (extrair a paginação repetida em
  `table`/`card-list-select`).
- **`gems-toast`** (notificações não-bloqueantes).

Padronizar o **showcase**: uma página por componente, com exemplos de uso e
snippet de código (já existe `code-snippet`). Avaliar adoção de **Storybook**
como vitrine/documentação viva (opcional, mas é padrão de mercado para SDKs de
componentes).

**Verificação:** cada novo componente tem página no showcase e está exportado no
barrel correto.

---

## Fase 5 — UX, mobile e acessibilidade

1. **Responsividade**: adicionar `@media (max-width: 768px)` a todos os
   componentes que faltam (inputs, cards, file-upload, list-select).
2. **Table mobile**: layout empilhado (label + valor) ou container com scroll
   horizontal e sombra de affordance.
3. **file-upload**: barra de progresso real, suporte opcional a múltiplos
   arquivos, dropzone acessível por teclado.
4. **Acessibilidade**: `role`/`tabindex`/handlers de teclado em elementos
   clicáveis não-nativos; `aria-expanded` em `summary-card`/`side-menu`;
   `focus-visible` consistente; alvos de toque ≥ 44px.
5. **Movimento**: respeitar `prefers-reduced-motion`.
6. **Dark mode** (opcional): gerar variante de paleta e alternância via
   `GemsThemeService`.

**Verificação:** testar no DevTools em larguras 360/768/1024/1440px; navegação só
por teclado funciona; Lighthouse (Accessibility) ≥ 90.

---

## Fase 6 — PWA

1. `ng add @angular/pwa` no projeto **showcase** (a SDK é uma lib; PWA é
   responsabilidade do app consumidor — documentar isso no README da lib).
2. Adicionar `manifest.webmanifest`, ícones (192/512) e tema.
3. Configurar `ngsw-config.json` (cache de assets e API com estratégia adequada).
4. Documentar no README da SDK o passo-a-passo para o consumidor habilitar PWA.

**Verificação:** Lighthouse (PWA) instalável; app abre offline (assets em cache).

---

## Fase 7 — Testes

Hoje **não há `.spec.ts`** apesar do Karma/Jasmine configurado.

1. Testes unitários para a lógica pura crítica: máscaras
   (`input-date`/`-mask`/`-document`), `gems-palette.util`, `GemsBaseStore`
   (URL building + pageable), `GemsDocumentPipe`.
2. Testes de CVA (writeValue/registerOnChange) dos inputs.
3. Smoke tests de renderização dos componentes.

**Verificação:** `npm test` roda verde; cobertura mínima acordada nos utilitários.

---

## Ordem recomendada de execução

`Fase 0` (enforcement) → `Fase 1` (padronização) → `Fase 2` (tipagem/exports) →
`Fase 3` (correções) → `Fase 7` (testes da base já estável) → `Fase 5` (UX/mobile)
→ `Fase 4` (novos componentes) → `Fase 6` (PWA).

As Fases 0–3 estabilizam e padronizam o que existe (alto valor, baixo risco) e
devem vir primeiro. As demais são incrementais.
