# Design em projetos de AI

Um produto de exemplo aplicando as cinco camadas do padrão da Supernova Labs — para ver o padrão funcionando, e para rodar o experimento que mostra a diferença que ele faz.

**Camada** é cada coisa que o agente precisa saber para acertar uma tela, e uma apoia a outra: quais são as **cores e espaçamentos** (1), que **peças já existem** (2), como é uma **tela deste produto** (3), **onde encontrar** tudo isso (4), e como **saber que acertou** antes de dizer "pronto" (5). Sem cores definidas não há componentes consistentes; sem componentes não há padrão de tela; e nada disso vale se o agente não souber onde está ou não conseguir se corrigir.

A tela é a lista de issues abertas nos nossos repositórios públicos.

```bash
bun install
bunx playwright install chromium   # uma vez: o navegador que roda as stories e o axe
bun run dev                        # http://localhost:5173
```

## Documentação

| Documento | O que tem lá |
| --- | --- |
| [**docs/playbook.md**](docs/playbook.md) | O padrão da Supernova Labs. As cinco camadas — cada uma com a dor, a regra, um desenho ou imagem deste projeto, o código dobrado e um teste — e como implantar em três estágios. **Comece por aqui.** |
| [**docs/sources.md**](docs/sources.md) | As referências por trás de cada afirmação do playbook, agrupadas por tema. |
| [**AGENTS.md**](AGENTS.md) | O contexto que o agente lê neste repositório: mapa, comandos, os cinco erros mais comuns e o self-check. É a camada 4, em 60 linhas. |
| [**.claude/skills/page-tasks/**](.claude/skills/page-tasks/SKILL.md) | A skill do padrão de tela: a anatomia, os quatro estados que toda lista precisa ter (carregando, vazio, vazio por filtro, erro), e o que varia de uma tela para outra. É a camada 3. |
| [**experiment/**](experiment/) | Os quatro testes que rodamos de verdade: [com e sem `AGENTS.md`](experiment/agents-md/), o [shadcn CLI](experiment/shadcn-cli/) do zero e em projeto existente, o [loop de screenshot](experiment/screenshot-loop/) pelo agente, e a [conversão de tokens DTCG](experiment/style-dictionary/). Cada um com o pedido, o que saiu e o que mudou no playbook. |

## Onde está cada camada

| Camada | Arquivo | O que olhar |
| --- | --- | --- |
| 1 · Tokens | `src/styles/theme.css` | os três níveis, e o tema escuro redefinindo só o do meio |
| 2 · Componentes | `src/components/` | as peças genéricas em `ui/`, as do produto ao lado; código no repositório, sem dependência de UI |
| 3 · Padrão de tela | `.claude/skills/page-tasks/` | o `example.tsx` é um symlink para a tela real, não uma cópia |
| 4 · Contexto | `AGENTS.md` | 60 linhas que apontam, sem repetir o que já está nas outras camadas |
| 5 · Verificação | `biome.json`, `.biome/rules/`, `.storybook/`, `vitest.config.ts`, `.mcp.json` | as quatro peças: lint, story + axe, MCP e screenshot |

A tela de referência é `src/pages/TasksPage.tsx`.

## Ver funcionando

```bash
bun lint            # vocabulário: cor crua, classe errada, div clicável (Biome)
bun run test:ui     # 27 stories num Chromium real, com axe
bun storybook       # o catálogo, com MCP em localhost:6006/mcp
bun run build       # typecheck + build
```

Três coisas que valem um minuto cada:

- **Plante um erro.** `<div onClick={…} className="bg-gray-100" style={{ color: "#ff0000" }} />` em qualquer componente, e rode `bun lint`. Três decisões de design que deixaram de ser recomendação.
- **Tire um `aria-label`** de um botão que só tem ícone e rode `bun run test:ui`. Acessibilidade vira teste vermelho, não comentário de review.
- **Troque o tema** no botão do topo. `src/components/ui/theme-toggle.tsx` não conhece nenhuma cor — só escreve `data-theme` no `<html>`. Nenhum componente tem `dark:` em lugar nenhum.

## O que este projeto não tem

- **Regressão visual**, a quarta peça da camada 5: só faz sentido quando mais de um produto compartilha o mesmo sistema.
- **Os outros padrões de tela** — form, detalhe, settings, confirmação: só o `page-tasks` está escrito, e os demais seguem o mesmo formato.
- **Registry e instalação por CLI**: os componentes foram escritos à mão no padrão shadcn, para o projeto rodar sem rede e sem passo interativo.
