# Design em projetos de AI

Como a gente cuida de interface quando quem escreve o código é um agente.

**Tipo:** Padrão da Supernova Labs  
**Data:** 07/09/2026  
**Escopo:** Projeto novo e projeto herdado  

## Índice

1. [Contexto](#1-contexto)
2. [Objetivo](#2-objetivo)
3. [Solução](#3-solução)
   1. [Tokens](#31-camada-1-tokens)
   2. [Componentes](#32-camada-2-componentes)
   3. [Padrões de página](#33-camada-3-padrões-de-página)
   4. [Contexto](#34-camada-4-contexto)
   5. [Verificação](#35-camada-5-verificação)
4. [Casos de uso](#4-casos-de-uso)
5. [Implantação](#5-implantação)
6. [Antipadrões](#6-antipadrões)
7. [Limitações e questões em aberto](#7-limitações-e-questões-em-aberto)
8. [Referências](#8-referências)

---

## 1. Contexto

Você pede uma tela nova. O agente entrega em três minutos. E está errada — não de bug, mas de *não é assim que a gente faz*:

| O que saiu | O que devia ter saído |
| --- | --- |
| Um azul parecido | O azul do produto |
| Uma tabela escrita do zero | A `DataTable` que já existe |
| Só o caminho feliz | Carregando, vazio, erro |
| Deletar sem perguntar | Deletar pede confirmação, sempre |

Você corrige. Amanhã, outra tela, os mesmos erros.

**Não é um agente ruim. É um agente sem acesso.** Quando o time era só de gente, esse entendimento morava na cabeça de quem tinha um ano de casa. O agente começa do zero em toda sessão — e o que ele não sabe, ele inventa.

## 2. Objetivo

Responder a uma pergunta: **de onde vem o entendimento de design, e como ele chega até o agente?**

O padrão define o que precisa existir no repositório para que um agente produza interface consistente com o produto — sem uma pessoa revisando o mesmo erro toda semana — e como implantar isso em um projeto novo ou herdado.

---

## 3. Solução

Pensa num dev que entrou hoje. Para fazer a primeira tela sem perguntar nada, ele precisa saber quais são as cores e os espaçamentos do produto, que peças já existem, como é uma tela daqui, onde encontrar tudo isso, e como conferir se acertou antes de mostrar para alguém.

O agente precisa exatamente do mesmo. A diferença é que **o dev pergunta quando não sabe, e o agente inventa.**

Estas são as informações que o agente precisa ter, na ordem em que uma depende da outra:

```mermaid
flowchart LR
    L1["<b>1 · Tokens</b><br/>quais cores, fontes,<br/>espaços<br/><i>theme.css</i>"]
    L2["<b>2 · Componentes</b><br/>que peças<br/>existem<br/><i>components/ui/</i>"]
    L3["<b>3 · Padrões de página</b><br/>como é uma<br/>tela daqui<br/><i>skill + exemplo real</i>"]
    L4["<b>4 · Contexto</b><br/>onde está<br/>tudo<br/><i>AGENTS.md</i>"]
    L5["<b>5 · Verificação</b><br/>acertei?<br/>&nbsp;<br/><i>lint · axe · screenshot</i>"]
    L1 --> L2 --> L3 --> L4 --> L5
    classDef voc fill:#eef0ff,stroke:#5b5bd6,color:#1a1a2e
    classDef map fill:#fff6e5,stroke:#d98b1e,color:#1a1a2e
    classDef mir fill:#e9f8ef,stroke:#2f9e5f,color:#1a1a2e
    class L1,L2,L3 voc
    class L4 map
    class L5 mir
```

Chamamos cada uma de **camada** porque uma apoia a outra: sem cores definidas não há componentes consistentes; sem componentes não há padrão de tela; e nada disso vale se o agente não souber onde está, ou não conseguir se corrigir.

- **1, 2 e 3 são o vocabulário** — o que o produto é.
- **4 é o mapa** — onde cada coisa está.
- **5 é o espelho** — e é a que quase todo time esquece.

Nada disso é sobre gosto. É sobre o agente **enxergar decisões que já foram tomadas.**

**As cinco camadas não dependem de stack.** Os arquivos citados daqui em diante são a resposta para React + Tailwind + shadcn, que é o que a gente usa. Em outra stack, muda o arquivo — o `theme.css` vira um tema do MUI, a skill aponta para outro exemplo — e a pergunta continua a mesma. O que se instala é o princípio; a tecnologia é o veículo.

---

### 3.1 Camada 1: Tokens

**A dor:** o agente escolhe um cinza. Amanhã escolhe outro. Em seis meses o produto tem 40 tons de cinza e ninguém decidiu nenhum deles.

**A regra:** token é um nome para um valor, em três níveis — e o agente **só usa o do meio**.

```mermaid
flowchart LR
    B["<b>base</b><br/>--color-indigo-600<br/><i>a paleta crua</i>"]
    S["<b>semântico</b><br/>--color-primary<br/><i>para que serve</i>"]
    C["<b>componente</b><br/>--button-bg<br/><i>só quando diverge</i>"]
    B -->|"alimenta"| S -->|"quase nunca"| C
    A(("agente")) -.->|"usa só isto"| S
    A -.-x B
    classDef ok fill:#e9f8ef,stroke:#2f9e5f,color:#1a1a2e
    classDef no fill:#fdeeee,stroke:#c94a4a,color:#1a1a2e
    class S ok
    class B no
```

O nível semântico carrega a decisão: `--color-danger` diz *para que serve*; `--color-red-600` diz só qual cor é. Quando a marca mudar, o vermelho muda e o significado fica.

**O tema escuro é a prova de que a camada funciona.** Ele redefine só o nível semântico. Nenhum componente muda uma linha — o botão de tema nem conhece uma cor, só escreve `data-theme` no `<html>`:

![Trocando o tema: só o nível semântico muda, nenhum componente sabe disso](img/theme.gif)

Se algum componente precisa de `dark:` numa classe, uma decisão de cor vazou para dentro dele.

<details>
<summary><b>Na prática</b> — o <code>theme.css</code> do projeto de referência, resumido</summary>

```css
/* src/styles/theme.css */
@import "tailwindcss";

@theme {
  /* base — a paleta crua. Ninguém usa direto. */
  --color-neutral-25:  oklch(0.99 0.002 260);
  --color-neutral-800: oklch(0.26 0.012 260);
  --color-indigo-600:  oklch(0.55 0.21 264);
  --color-rose-600:    oklch(0.58 0.21 18);

  /* semântico — o que o agente usa. Tema claro. */
  --color-bg:      var(--color-neutral-25);
  --color-fg:      var(--color-neutral-800);
  --color-primary: var(--color-indigo-600);
  --color-danger:  var(--color-rose-600);

  --text-body:      0.9375rem;   /* o único tamanho de corpo */
  --spacing-gutter: 1.5rem;      /* o espaço entre blocos de página */
}

/* tema escuro: redefine só o nível semântico */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: var(--color-neutral-950);
    --color-fg: var(--color-neutral-100);
    /* … */
  }
}
:root[data-theme="dark"] { /* mesmo bloco — o botão de tema vence o sistema */ }
```

No componente, só o nível semântico: `bg-surface`, `text-fg`, `bg-primary`. Nunca o nível base (`bg-neutral-50`), nunca um valor cru (`bg-[#fafafa]`).

Falta uma cor? Não se usa a paleta base direto no componente. Cria-se um token semântico com nome de função, apontando para a base: `--color-warning: var(--color-amber-600)`. O componente usa `text-warning`; o amber continua existindo, mas só no nível base.

Tailwind v4 com `@theme` é o alvo porque a config vira CSS, e o agente lê CSS variable com confiança. Se o cliente tem Figma com variables, elas saem de lá uma vez, por script (Figma exporta DTCG, o Style Dictionary converte, e o `:root` que ele gera vira `@theme`). Não à mão. [Rodamos a conversão](../experiment/style-dictionary/): os nomes já saem no formato do Tailwind e as referências entre níveis sobrevivem.

</details>

> **Teste da camada:** troque o tema. Se algum componente precisou de `dark:`, a camada não está pronta.

---

### 3.2 Camada 2: Componentes

**A dor:** já existe um `FilterChip` no projeto. O agente escreve outro, com nome diferente, porque não sabia que existia.

Isso acontece mesmo com componente bem escrito, em Tailwind puro. O agente não varre o repositório inteiro antes de cada tela: ele escreve o que o pedido sugere. Se nada o obriga a olhar, ele não olha.

```mermaid
flowchart LR
    subgraph NM["node_modules/"]
        X["Dropdown<br/><i>dependência</i>"]
    end
    subgraph UI["src/components/"]
        Y["dropdown.tsx<br/><i>código nosso</i>"]
    end
    A(("agente"))
    A -.-x|"não lê, não adapta,<br/>escreve outro"| X
    A -->|"lê, entende o padrão,<br/>segue"| Y
    classDef ok fill:#e9f8ef,stroke:#2f9e5f,color:#1a1a2e
    classDef no fill:#fdeeee,stroke:#c94a4a,color:#1a1a2e
    class Y ok
    class X no
```

**A regra:** os componentes ficam no repositório, cada um diz para que serve, e o agente consulta antes de criar.

1. **No repositório, na convenção do mercado.** Um arquivo por componente, todos no mesmo formato, em `src/components/`. Se o componente está em `node_modules`, o agente não lê. Se está espalhado, ele não acha.

   A convenção que o shadcn e os templates da Vercel consolidaram, e que o agente já conhece de treinamento:

   ```
   src/components/
     ui/                ← peças genéricas, sem saber do produto: button, badge, dialog
     task-row.tsx       ← peças do produto, compostas com as de ui/
     record-header.tsx
   ```

   Projeto que já existe com outros nomes de pasta não precisa mudar nada: basta o `AGENTS.md` dizer onde está o quê.

2. **Cada componente diz para que serve**, num comentário em cima. É o que o agente lê quando abre a pasta — e é o que chega até ele pelo MCP, sem abrir nada:

   ```tsx
   /** Filtro ativo. Sempre removível — filtro que não se tira vira armadilha. */
   export function FilterChip({ label, onRemove }: …) { … }

   /** Erro. Nunca uma tela em branco: diz o que houve e oferece tentar de novo. */
   export function ErrorState({ onRetry }: …) { … }
   ```

3. **A instrução de consultar antes de criar**, no `AGENTS.md`. Sem ela, os dois itens acima são uma pasta que ninguém abre. No projeto de referência ela tem duas formas: *"leia a pasta antes"* e, com o Storybook rodando, *"pergunte ao MCP o que existe"* — o `docs-list` devolve a lista com o comentário de cada um.

O resultado é o agente compondo com o que existe, e criando só o que falta, no formato dos vizinhos.

#### Sugestão: shadcn para o que tem comportamento

Para componentes mais complexos, como dialog, dropdown, combobox, popover e date picker, escrever do zero significa resolver foco, teclado, posicionamento e `aria-*` — umas duzentas linhas cada, e exatamente o que o agente mais erra ao inventar.

A sugestão para esses é o [shadcn/ui](https://ui.shadcn.com): um comando copia o componente para `src/components/ui/`, e ele passa a ser seu — mesma pasta, mesmo formato, mesma regra. Em 2026 ele virou o formato de distribuição de UI para agente, com MCP oficial, skills, presets e registry privado.

Se o projeto já usa outra biblioteca — Mantine, MUI, o que for — não se troca. Documenta as decisões em cima dela na camada 4.

**Quando rodar o `init` depende do projeto.** Ele traz o próprio vocabulário de tokens, e os componentes copiados dependem desses nomes:

| Projeto | O que fazer |
| --- | --- |
| Do zero | `init` primeiro. O `theme.css` nasce com os nomes do shadcn. |
| Existente, sem sistema | `init`, apagar o bloco de tokens injetado, e apelidar os nomes que os componentes usam para os seus tokens. Uma vez só. |
| Existente, com sistema próprio | Não roda o `init`. Documenta o que existe. |

Rodamos os dois primeiros casos: o relato está em [`experiment/shadcn-cli/`](../experiment/shadcn-cli/).

<details>
<summary><b>Na prática</b> — do zero até o agente instalar componente sozinho</summary>

```bash
bunx shadcn@latest init                       # preset: cores, fonte, ícones, raio
bunx shadcn@latest add button input dialog table form
bunx shadcn@latest mcp init --client claude   # o agente passa a consultar o catálogo
bunx skills add shadcn/ui                     # e a saber usar o CLI
```

Depois disso, *"adiciona um seletor de data"* vira o agente consultando o catálogo, achando `calendar` + `popover` e compondo — em vez de escrever um do zero.

Componentes que o cliente reusa entre produtos viram um **registry privado**, e a identidade viaja:

```jsonc
// components.json
{
  "registries": {
    "@acme": {
      "url": "https://registry.acme.com/{name}.json",
      "headers": { "Authorization": "Bearer ${REGISTRY_TOKEN}" }
    }
  }
}
```

</details>

> **Teste da camada:** peça algo que já existe com outro nome — *"um chip de filtro removível"*. Se o agente usou o `FilterChip` em vez de escrever um, a camada está funcionando. Com o shadcn, peça *"um seletor de data"* e veja se ele consulta o catálogo. [Rodamos](../experiment/shadcn-cli/): ele compôs `calendar` + `popover` + `button`.

---

### 3.3 Camada 3: Padrões de página

Esta é a camada que quase ninguém tem — e a que mais muda o resultado.

**A dor:** o agente já sabe fazer um botão. O que ele inventa é a *tela*. Nem o shadcn, nem o Storybook, nem o Figma respondem "como é uma tela de lista *neste* produto". É uma decisão do produto, e mora com ele.

**A regra:** uma skill por padrão, com um exemplo real junto. A skill descreve a anatomia; o exemplo mostra.

Esta é a anatomia da tela de referência do projeto, e a skill diz exatamente isso, nesta ordem:

![A tela de referência: RecordHeader, Tabs, FilterBar, TaskGroup, Pagination](img/screen-light.png)

```mermaid
flowchart LR
    H["<b>1 · RecordHeader</b><br/>título, descrição,<br/>propriedades"]
    T["<b>2 · Tabs</b><br/>Tarefas é a primeira<br/>e a padrão"]
    F["<b>3 · FilterBar</b><br/>busca à esquerda,<br/>filtros à direita"]
    G["<b>4 · TaskGroup</b><br/>um por grupo,<br/>colapsável"]
    P["<b>5 · Pagination</b><br/>10 por página"]
    H --> T --> F --> G --> P
    classDef b fill:#eef0ff,stroke:#5b5bd6,color:#1a1a2e
    class H,T,F,G,P b
```

**Toda tela tem quatro estados, sempre.** Não é detalhe: é a diferença entre uma tela e uma demo.

| Carregando — skeleton, nunca spinner | Erro — nunca tela em branco |
| --- | --- |
| ![carregando](img/state-loading.png) | ![erro](img/state-error.png) |
| **Vazio — com a ação primária** | **Vazio por filtro — com "limpar filtros"** |
| ![vazio](img/state-empty.png) | ![vazio por filtro](img/state-empty-filtered.png) |

E a tela sabe o que some quando aperta — nesta ordem: prazo, contador, badges. Checkbox, título e avatar nunca somem.

<img src="img/screen-375.png" alt="A mesma tela em 375px" width="320" />

**O detalhe que evita o drift:** o exemplo da skill não é uma cópia da tela — é um **symlink** para o arquivo que está em produção. Cópia envelhece em silêncio; symlink não tem como.

```
.claude/skills/page-tasks/
  SKILL.md
  example.tsx  →  ../../../src/pages/TasksPage.tsx
```

Na prática, poucos padrões cobrem quase tudo: lista com filtro · form de criar e editar · detalhe de registro · settings · estado vazio · estado de erro · confirmação destrutiva.

<details>
<summary><b>Na prática</b> — a skill <code>page-tasks</code> do projeto de referência, inteira</summary>

```markdown
---
name: page-tasks
description: Detalhe de um registro com lista de tarefas agrupadas. Use quando a tela mostra um registro (projeto, conta, caso) e as tarefas ligadas a ele.
---

# Detalhe de registro com tarefas

Toda tela deste tipo tem a mesma anatomia. Não invente outra.

## De cima para baixo

1. `<RecordHeader>` — título, descrição editável e as propriedades do registro.
2. `<Tabs>` — Tarefas é a primeira e a padrão. Aba ativa usa `accent`, nunca `primary`.
3. `<FilterBar>` — busca à esquerda, filtros de prioridade à direita.
4. `<TaskGroup>` — um por grupo, colapsável, com `<ProgressRing>` à direita.
5. `<Pagination>` — 10 tarefas por página, contando o total filtrado.

Entre os blocos, `space-y-gutter`. Dentro do painel de tarefas, `space-y-4`.

## A linha de tarefa

`<Checkbox>` · título · `<Badge>` de prioridade · `<Badge>` de escopo ·
contador de comentários · prazo · `<Avatar>` do responsável

**O que some em tela estreita**, nesta ordem: prazo (abaixo de `lg`), contador
(abaixo de `md`), badges (abaixo de `sm`). Checkbox, título e avatar nunca somem.

## Prazo: a cor carrega significado

| Situação | Token | Texto |
| --- | --- | --- |
| Atrasada | `text-danger` | "Atrasada N dias" |
| Vence hoje | `text-success` | "Vence hoje" |
| Vence amanhã | `text-warning` | "Vence amanhã" |
| Depois | `text-muted` | data curta |

A cor nunca vai sozinha — o texto diz a mesma coisa, para quem não distingue as cores.

## Os quatro estados, sempre

| Estado | Componente |
| --- | --- |
| Carregando | `<TasksSkeleton />` — nunca spinner |
| Vazio | `<EmptyState>` com a ação primária |
| Vazio por filtro | `<EmptyState>` com "Limpar filtros" |
| Erro | `<ErrorState onRetry />` — nunca tela em branco |

## Varia e não varia

**Varia:** os grupos, os filtros, as colunas de metadado da linha, os textos.
**Não varia:** a ordem dos blocos, os componentes, os quatro estados, a ordem
da linha de tarefa, o gutter, 10 por página.

## Referência

`example.tsx` é a tela real deste projeto — não uma cópia. Copie a estrutura dela.

## Antes de dizer pronto

- [ ] Usa `RecordHeader`, `Tabs`, `FilterBar`, `TaskGroup`, `Pagination` — não versões próprias
- [ ] Os quatro estados existem
- [ ] `bun lint` e `bun run test:ui` passam
- [ ] **Screenshot em 1280px (desktop) e 375px (celular), comparado com o exemplo.** Um título longo trunca?
      Nenhum elemento sobrepõe outro?
- [ ] Troque o tema: nada perde contraste
```

</details>

> **Teste da camada:** peça uma tela irmã da de referência. Se o agente carregou a skill e copiou a estrutura em vez de inventar, a camada está funcionando.

---

### 3.4 Camada 4: Contexto

**A dor:** as três camadas anteriores existem, mas o agente não sabe que existem.

**A regra:** o `AGENTS.md` tem uma função só — **dizer onde está cada coisa e o que não se faz.** Ele não repete token nem padrão de tela. Ele aponta.

```mermaid
flowchart LR
    A["<b>4 · Contexto</b><br/>AGENTS.md<br/>~60 linhas"]
    A -->|"onde estão os tokens"| L1["<b>1 · Tokens</b><br/>theme.css"]
    A -->|"onde estão as peças"| L2["<b>2 · Componentes</b><br/>components/ui/"]
    A -->|"leia a skill antes da tela"| L3["<b>3 · Padrões de página</b><br/>.claude/skills/"]
    A -->|"comandos · consulte o MCP ·<br/>antes de dizer pronto"| L5["<b>5 · Verificação</b><br/>lint · story + axe · screenshot"]
    classDef voc fill:#eef0ff,stroke:#5b5bd6,color:#1a1a2e
    classDef map fill:#fff6e5,stroke:#d98b1e,color:#1a1a2e
    classDef mir fill:#e9f8ef,stroke:#2f9e5f,color:#1a1a2e
    class L1,L2,L3 voc
    class A map
    class L5 mir
```

E precisa ser **curto**. Arquivo de 150 linhas o agente lê o começo e ignora o resto. O do projeto de referência tem 61 linhas — e são basicamente essas quatro setas.

<details>
<summary><b>Na prática</b> — o <code>AGENTS.md</code> do projeto de referência, inteiro</summary>

```markdown
# UI — como trabalhar neste repo

## Stack
React 19 · Vite · Tailwind v4 (tokens em `src/styles/theme.css`) · TypeScript.
Componentes em `src/components/`: as peças genéricas em `ui/`, as do produto ao lado. Padrão shadcn, código nosso, no repo.

## Onde está o quê
- **Tokens**: `src/styles/theme.css`. Componente usa **só o nível semântico**.
- **Componentes genéricos**: `src/components/ui/` — botão, badge, estados, sem saber do produto.
- **Componentes do produto**: `src/components/` — `RecordHeader`, `TaskGroup`, `UpdateList`. Consulte as duas pastas antes de criar qualquer coisa.
- **Padrões de página**: `.claude/skills/page-*/`. **Antes de criar uma tela, leia a skill.**
- **Tela de referência**: `src/pages/TasksPage.tsx` — o exemplo real do padrão `page-tasks`.

## Comandos
- `bun dev` · `bun lint` · `bun run build` · `bun storybook` · `bun run test:ui`

## Os cinco erros mais comuns aqui
1. Cor em hex ou classe `bg-gray-*` em vez do token semântico. O lint pega.
2. Criar componente que já existe em `components/` com outro nome — leia as duas pastas antes.
3. Tela sem os quatro estados (carregando, vazio, vazio-por-filtro, erro).
4. Spinner no lugar de skeleton. Toda lista tem seu esqueleto.
5. `div` com `onClick`. Botão é `<Button>`, link é `<a>`.

## Tema claro e escuro
Nenhum componente conhece o tema. Se você está escrevendo `dark:` numa classe,
parou no lugar errado: a diferença mora só no `theme.css`.

## Consulte antes de criar
Com o Storybook rodando, o MCP responde o que existe:
- `docs-list` — todos os componentes, com a regra de uso de cada um
- `docs-show` — as props de um componente
- `test-run` — roda as stories e devolve as violações de acessibilidade

## Antes de dizer "pronto"
1. `bun lint` passa.
2. `bun run build` passa.
3. `bun run test:ui` passa.
4. Se é uma tela: os quatro estados existem e a anatomia bate com a skill.
5. **Tire um screenshot em 1280px (desktop) e em 375px (celular)** e compare com o exemplo da skill.
6. Troque o tema. Nada some, nada perde contraste.

Se algum falhar, não está pronto.
```

Repare no que **não** está aí: nenhum token, nenhum padrão de tela, nenhuma explicação de design. Só o mapa e as regras.

</details>

> **Teste da camada:** o [experimento](../experiment/agents-md/) — a mesma tela, com e sem o arquivo. Se as duas saem iguais, o `AGENTS.md` não está sendo lido. É a primeira coisa a corrigir, antes de qualquer outra camada.

---

### 3.5 Camada 5: Verificação

Sem esta camada, as outras quatro são documentação — e documentação que ninguém verifica mente em silêncio.

**A dor:** o agente diz "pronto". Quem descobre que não está é uma pessoa, na review, uma hora depois. A cada vez.

**A regra:** o agente olha o próprio trabalho antes de entregar. É o mesmo princípio dos testes.

```mermaid
flowchart LR
    G["gera"] --> L["lint"] --> S["story + axe"] --> P["screenshot<br/>desktop e celular"] --> C{"bate com<br/>o exemplo?"}
    C -->|"não"| F["corrige"] --> L
    C -->|"sim"| D(["pronto"])
    classDef mir fill:#e9f8ef,stroke:#2f9e5f,color:#1a1a2e
    class D mir
```

#### Por que são quatro peças, e não uma

É tentador parar no lint, que é a mais barata. Mas cada peça pega uma classe diferente de erro:

| Peça | Pega | Não pega |
| --- | --- | --- |
| **Lint** | vocabulário: cor crua, classe errada, `div` clicável | composição |
| **Story + axe** | o componente renderiza e é acessível | como ele se comporta na página |
| **Screenshot comparado** | layout: o que vaza, sobrepõe, some | intenção |
| **Regressão visual** | mudança não intencional entre versões | a primeira versão já errada |

**axe** é o motor de acessibilidade da Deque, o mesmo por trás da aba Accessibility do Lighthouse. Ele examina a página renderizada e devolve as violações das regras WCAG: botão só com ícone sem `aria-label`, contraste insuficiente, campo sem rótulo, elemento clicável que o teclado não alcança. Aqui ele roda em toda story, e uma violação falha o teste.

A gente aprendeu isso apanhando. No experimento da camada 4, a versão sem contexto montou o link como elemento `inline` dentro de uma `div` — e `truncate` não tem efeito em `inline`. **O lint passou. O build passou.** Os elementos estavam certos; a composição, não.

| Sem contexto — o título atravessa a linha | Com contexto — trunca, o resto fica intacto |
| --- | --- |
| ![sem](../experiment/agents-md/without-agents-md.png) | ![com](../experiment/agents-md/with-agents-md.png) |

Só o screenshot pegaria. A análise completa está em [`experiment/agents-md/`](../experiment/agents-md/).

<details>
<summary><b>Na prática</b> — as quatro peças, no projeto de referência</summary>

**1. Regra vira lint, não instrução.** "Evite cores fora da paleta" num documento é sugestão. No lint é lei:

```js
// eslint.config.js (trecho)
"no-restricted-syntax": ["error",
  {
    // cor crua em hex — só dentro de className e style
    selector: ":matches(JSXAttribute[name.name='className'], JSXAttribute[name.name='style']) Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
    message: "Cor em hex não entra no componente. Use um token semântico do theme.css.",
  },
  {
    // classe do nível base do token, direto no componente
    selector: "Literal[value=/\\b(bg|text|border)-(gray|blue|red|slate|zinc|neutral)-[0-9]{2,3}\\b/]",
    message: "Esse é o nível base da paleta. Use o token semântico: bg-bg, text-fg, bg-primary…",
  },
  {
    // div clicável
    selector: "JSXOpeningElement[name.name='div'] > JSXAttribute[name.name='onClick']",
    message: "div não é botão. Use <Button> — foco e teclado vêm junto.",
  },
]
```

> **Escope a regra, ou ela vira ruído.** A primeira versão da regra de hex olhava qualquer literal — e acusou `#1327`, um número de issue num título, como se fosse cor. Regra com falso positivo é regra que o time desliga na semana seguinte.

**2. Acessibilidade vira teste vermelho.** Toda story roda num Chromium real, com o axe:

```tsx
// .storybook/preview.tsx
parameters: { a11y: { test: "error" } }   // violação falha o teste; não é aviso
```

```ts
// vitest.config.ts
plugins: [storybookTest({ configDir: ".storybook" })],
test: { browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: "chromium" }] } }
```

**3. O agente consulta em vez de adivinhar.** Storybook exposto por MCP: ele pergunta quais componentes existem, quais props aceitam, e roda as stories para receber as violações. Os comentários JSDoc de cada componente chegam junto — então a regra de uso escrita no código vira contexto.

```json
// .mcp.json
{ "mcpServers": {
  "storybook":  { "type": "http", "url": "http://localhost:6006/mcp" },
  "playwright": { "command": "bunx", "args": ["@playwright/mcp@latest", "--headless"] }
} }
```

**4. E olha o resultado.** Playwright MCP registrado, e a instrução no `AGENTS.md`: screenshot em 1280px (desktop) e em 375px (celular), comparado com o exemplo da skill.

</details>

O CI é a rede de segurança. O loop é o que evita cair nela.

> **Teste da camada:** plante `style={{ color: "#ff0000" }}` num componente e rode `bun lint`. Tire o `aria-label` de um botão só com ícone e rode `bun run test:ui`. Os dois têm que ficar vermelhos.
>
> E o loop inteiro: peça uma tela nova e veja se o agente tira o screenshot sem ser lembrado. [Rodamos](../experiment/screenshot-loop/): tirou, nos dois tamanhos e nos dois temas, e de novo depois de uma mudança.

---

## 4. Casos de uso

Duas situações que aparecem em quase todo projeto, e o que muda nelas com as camadas no lugar.

#### O protótipo que não serve para nada

Quem precisa mostrar a ideia antes de ela existir — produto, negócio, quem apresenta ao cliente — monta a tela com o agente. Aprovam. O dev vai construir e o protótipo não ajuda: componente que não existe, espaçamento inventado, estados que ninguém previu. O que foi aprovado não é o que é entregue.

```mermaid
flowchart TB
    subgraph antes["Sem o padrão"]
        direction LR
        A1["protótipo em HTML<br/>com o agente"] --> A2["aprovado"] --> A3["dev vai construir:<br/>componente que não existe,<br/>espaçamento inventado"] --> A4["protótipo descartado,<br/>tela reinterpretada"]
    end
    subgraph depois["Com as camadas 1 a 3"]
        direction LR
        B1["protótipo com os<br/>mesmos componentes"] --> B2["aprovado"] --> B3["dev parte<br/>do protótipo"]
    end
    antes ~~~ depois
    classDef no fill:#fdeeee,stroke:#c94a4a,color:#1a1a2e
    classDef ok fill:#e9f8ef,stroke:#2f9e5f,color:#1a1a2e
    class A4 no
    class B3 ok
```

**O que o padrão muda:** o protótipo passa a ser feito com o mesmo vocabulário do produto.

| Camada | O que ela dá ao protótipo |
| --- | --- |
| [1 · Tokens](#31-camada-1-tokens) | as cores e espaçamentos certos, sem escolher nada |
| [2 · Componentes](#32-camada-2-componentes) | as mesmas peças que o dev vai usar — instaláveis por um comando, se há registry |
| [3 · Padrões de página](#33-camada-3-padrões-de-página) | a anatomia da tela, com os estados que o protótipo esqueceria |

O protótipo deixa de ser uma referência a interpretar e vira o ponto de partida. E o que não existe no sistema aparece cedo, na validação da ideia, não no meio da construção.

Um limite honesto: protótipo não passa por lint nem CI, e nem deve. Ele herda o vocabulário, não o rigor.

#### O Figma que não bate com a tela

Planeja-se em cima do Figma, manda-se desenvolver, e a tela não bate com o desenho. É lido como falha do agente. Não é: são **duas fontes sem contrato**. O agente traduz o Figma na hora, e traduzir é interpretar.

```mermaid
flowchart TB
    subgraph antes["Duas fontes"]
        direction LR
        F1["Figma"] -.->|"imagem para interpretar"| A1(("agente")) --> T1["tela ≠ desenho"]
    end
    subgraph depois["O código é a fonte"]
        direction LR
        F2["Figma"] -.->|"Code Connect"| C2["componentes no repo"] --> A2(("agente")) --> T2["tela = componente"]
    end
    antes ~~~ depois
    classDef no fill:#fdeeee,stroke:#c94a4a,color:#1a1a2e
    classDef ok fill:#e9f8ef,stroke:#2f9e5f,color:#1a1a2e
    class T1 no
    class T2 ok
```

**O que o padrão muda:** o código vira a fonte, e o Figma documenta.

| Camada | O que ela resolve |
| --- | --- |
| [1 · Tokens](#31-camada-1-tokens) | os valores saem do Figma uma vez, por script, e passam a viver no `theme.css` |
| [2 · Componentes](#32-camada-2-componentes) | com Code Connect, cada componente do canvas aponta para o arquivo real no repo — o agente recebe código, não imagem |
| [4 · Contexto](#34-camada-4-contexto) | o `AGENTS.md` diz que a referência é o componente, não o desenho |

É a diferença entre *"faça uma tabela parecida com esta imagem"* e *"use a `DataTable`"*. Se o Figma está abandonado, não se ressuscita: os tokens saem dele uma vez e ele vira histórico.

---

## 5. Implantação

Três estágios. Não se pula estágio.

```mermaid
timeline
    title Do zero ao sistema com dono
    Estágio 1 : inventário do que existe
                          : theme.css com o que é intencional
                          : lint em warn + AGENTS.md
                          : o experimento com e sem contexto
    Estágio 2 : story + axe por componente
                           : Storybook por MCP
                           : skills dos 3 padrões mais frequentes
                           : self-check no AGENTS.md
    Estágio 3 : registry com preset
                         : as skills de padrão de tela versionadas
                         : tokens DTCG ↔ Figma
                         : regressão visual no CI
                         : um dono nomeado
```

#### Estágio 1 — Codificar o que já existe

Não cria nada novo. Organiza o que está lá para o agente enxergar.

| Passo | O quê | O detalhe que importa |
| --- | --- | --- |
| 1 | **Inventário** | Contar a dívida antes de decidir. O normal é achar 30 a 60 cores onde deveriam existir 8. |
| 2 | **Tokens** | Só o que é *intencional*: as 8 cores que aparecem 200 vezes. As 40 que aparecem uma vez são erro, não decisão. Não migrar nada ainda. |
| 3 | **Lint e mapa** | Lint em `warn`, não `error` — ele vai apontar centenas de lugares, e isso é backlog, não bloqueio. `AGENTS.md` com os cinco erros tirados do inventário real. |
| 4 | **O teste** | A mesma tela, sem e com o `AGENTS.md`. Se as duas saem iguais, o arquivo não está sendo lido — corrija isso antes de qualquer outra coisa. |

<details>
<summary>Os comandos do inventário</summary>

```bash
# quantas cores existem hoje?
grep -rhoE '#[0-9a-fA-F]{3,8}\b' src | sort | uniq -c | sort -rn | head -30
grep -rhoE '\b(bg|text|border)-[a-z]+-[0-9]{2,3}\b' src | sort | uniq -c | sort -rn | head -30
# quantos tamanhos de fonte?
grep -rhoE '\btext-(xs|sm|base|lg|xl|[0-9]xl|\[[^]]+\])' src | sort | uniq -c | sort -rn
```

</details>

**Rodamos esse teste em 09/09/2026.** A versão sem contexto mandou rodar `npm` num projeto que usa `bun`, esqueceu uma coluna, repetiu o autor em avatar e por extenso, e trouxe o bug de truncamento da camada 5. A versão com contexto acertou o comando, seguiu a anatomia da referência e saiu 43 linhas menor. **As duas passaram no lint e no build** — o que separou foi estrutura, não vocabulário.

**O que não se faz aqui:** migrar telas antigas, criar componente novo, instalar Storybook, escrever skill. Isso é estágio 2.

#### Estágio 2 — Fechar o loop

O agente passa a verificar o próprio trabalho. A review humana deixa de ser *"isso está fora do padrão?"* e vira *"isso resolve o problema?"*.

#### Estágio 3 — Sistema com dono

Só faz sentido com mais de um produto compartilhando identidade, ou horizonte longo. E **um dono nomeado**: design system sem dono morre em meses.

#### A régua

Oito itens, inspirados no Agent-Ready Index, que auditou 37 design systems públicos em setembro de 2026 — 19 tiraram zero:

| # | Item | Fecha no |
| --- | --- | --- |
| 1 | Tokens semânticos, sem hex nas classes, lint barrando | estágio 1 |
| 2 | `AGENTS.md` curto, com self-check | estágio 1 |
| 3 | O experimento mostra que o contexto chega | estágio 1 |
| 4 | Componentes no repo, instaláveis por CLI | estágio 2 |
| 5 | Skills de padrão de tela, com exemplo real | estágio 2 |
| 6 | Story + axe por componente, no CI | estágio 2 |
| 7 | Storybook por MCP; o agente tira e compara o próprio screenshot | estágio 2 |
| 8 | Um dono nomeado | estágio 3 — e decide se os outros sobrevivem |

---

## 6. Antipadrões

| Não faz | Por quê | Faz |
| --- | --- | --- |
| Colar o design system no prompt | 30k tokens por consulta, 82% de cobertura e alucinações (benchmark da Indeed, 1.056 prompts) | Expõe por MCP |
| `AGENTS.md` de 150 linhas | O agente lê o começo e ignora o resto | 60 linhas apontando |
| Documentar componente à mão | Drifta em silêncio até o agente gerar errado | JSDoc no código, exposto pelo MCP |
| Regra escrita em texto ("evite cores fora da paleta") | Texto é sugestão; o agente lê e segue em frente | Regra em lint, que falha o build |
| Componente sem padrão de tela | O agente monta a página do zero toda vez | Skill por padrão, com exemplo real |
| Exemplo copiado para a skill | Envelhece em silêncio | Symlink para a tela real |
| Design system sem dono | Morre em meses | Um dono nomeado, com mandato para podar e consolidar |
| Pixel-diff em todo PR | Ruído demais, o time para de olhar | Só no estágio 3 |

---

## 7. Limitações e questões em aberto

Três frentes em que o campo ainda se move — a gente acompanha, mas não apostou:

- **Regressão visual em PR de agente.** Pixel-diff gera ruído; os fornecedores estão migrando para classificar a diferença por intenção. Não há vencedor ainda.
- **Um arquivo só para identidade visual.** O Google Labs propôs o [`DESIGN.md`](https://github.com/google-labs-code/design.md), um formato para descrever paleta, tipografia e tom ao agente. Não usamos: está em alpha e duplica o que tokens + `AGENTS.md` já cobrem. Observar, não adotar.
- **Quanto contexto é o ideal.** No benchmark da Indeed, JSON via MCP gastou 80% menos tokens que markdown, com mais acurácia. Mas o MCP do Storybook está em preview, e o toolset de docs só existe nos frameworks que geram o manifesto de componentes (React, Vue e Angular com Vite, por enquanto).

**O que já foi exercitado de verdade:** as cinco camadas, o shadcn CLI do zero e em projeto existente, o lint, as stories com axe num navegador real, o MCP do Storybook, o experimento com e sem contexto, e o loop de screenshot pelo agente — tudo no [projeto de referência](../README.md). **O que ainda segue a documentação, não a nossa experiência:** a regressão visual, que só entra no estágio 3.

---

## 8. Referências

As fontes que sustentam cada afirmação estão em [**sources.md**](sources.md).
