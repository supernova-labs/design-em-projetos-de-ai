# UI — como trabalhar neste repo

## Stack

React 19 · Vite · Tailwind v4 (tokens em `src/styles/theme.css`) · TypeScript.
Componentes em `src/components/`: as peças genéricas em `ui/`, as do produto ao lado. Padrão shadcn, código nosso, no repo.

## Onde está o quê

- **Tokens**: `src/styles/theme.css`. Componente usa **só o nível semântico**.
- **Componentes genéricos**: `src/components/ui/` — botão, badge, estados, sem saber do produto.
- **Componentes do produto**: `src/components/` — `RecordHeader`, `TaskGroup`, `UpdateList`. Consulte as duas pastas antes de criar qualquer coisa.
- **Padrões de página**: `.claude/skills/page-*/`. **Antes de criar uma tela, leia a skill do padrão.**
- **Tela de referência**: `src/pages/TasksPage.tsx` — é o exemplo real do padrão `page-tasks`.

## Comandos

- `bun dev` — sobe a aplicação
- `bun lint` — Biome: falha em cor crua, token do nível base, `div` clicável e formatação
- `bun run format` — aplica as correções automáticas do Biome
- `bun run build` — typecheck + build
- `bun storybook` — o catálogo de componentes, com o MCP em `localhost:6006/mcp`
- `bun run test:ui` — roda toda story num navegador de verdade, com axe

## Os cinco erros mais comuns aqui

1. Cor em hex ou classe `bg-gray-*` em vez do token semântico. O lint pega.
2. Criar componente que já existe em `components/` com outro nome — leia as duas pastas antes.
3. Tela sem os quatro estados (carregando, vazio, vazio-por-filtro, erro).
4. Spinner no lugar de skeleton. Toda lista tem seu esqueleto.
5. `div` com `onClick`. Botão é `<Button>`, link é `<a>`.

## Tema claro e escuro

Nenhum componente conhece o tema. Se você está escrevendo `dark:` numa classe, parou no
lugar errado: a diferença entre os temas mora só no `theme.css`, redefinindo o nível
semântico. Componente usa `bg-surface` e funciona nos dois.

## Consulte antes de criar

Com o Storybook rodando (`bun storybook`), o MCP responde o que existe:

- `docs-list` — todos os componentes, com a regra de uso de cada um
- `docs-show` — as props de um componente
- `test-run` — roda as stories e devolve as violações de acessibilidade

**Consulte antes de escrever um componente novo.** Quase sempre já existe.

## Antes de dizer "pronto"

1. `bun lint` passa. *(pega cor crua, classe errada, `div` clicável)*
2. `bun run build` passa.
3. `bun run test:ui` passa. *(pega componente que não renderiza ou que o axe reprova)*
4. Se é uma tela: os quatro estados existem e a anatomia bate com a skill.
5. **Tire um screenshot em 1280px (desktop) e em 375px (celular)** e compare com o exemplo da skill. Diga o que
   bateu e o que não bateu com a referência — não só o que viu. *(pega o que as três
   anteriores não pegam: título que atravessa a linha, elemento que sobrepõe outro,
   coluna que some errado)*
6. Troque o tema. Nada some, nada perde contraste.

Se algum falhar, não está pronto.

O passo 5 existe por um motivo concreto: o lint e o build passam num layout quebrado.
Ver `experiment/agents-md/`.
