---
name: page-tasks
description: Detalhe de um registro com lista de tarefas agrupadas. Use quando a tela mostra um registro (projeto, conta, caso) e as tarefas ligadas a ele.
---

# Detalhe de registro com tarefas

Toda tela deste tipo tem a mesma anatomia. Não invente outra.

## De cima para baixo

1. `<RecordHeader>` — título, descrição editável e as propriedades do registro.
   As propriedades são `<Property>`: rótulo clicável em cima, valor embaixo.
   A identidade do dono fica à direita, alinhada ao fim.
2. `<Tabs>` — Tarefas é a primeira e a padrão. Aba ativa usa `accent`, nunca `primary`.
3. `<FilterBar>` — busca à esquerda, filtros de prioridade à direita.
   Filtro ativo vira `<FilterChip>` removível.
4. `<TaskGroup>` — um por grupo, colapsável, com `<ProgressRing>` à direita.
   As ações de renomear e excluir aparecem no hover do grupo, nunca fixas.
5. `<Pagination>` — 10 tarefas por página, contando o total filtrado.

Entre os blocos, `space-y-gutter`. Dentro do painel de tarefas, `space-y-4`.

## A linha de tarefa

Nesta ordem, da esquerda para a direita:

`<Checkbox>` · título com ícone `external` · `<Badge>` de prioridade · `<Badge>` de escopo ·
contador de comentários com ícone de contexto · prazo · `<Avatar>` do responsável

Tarefa concluída fica com `line-through` e texto `muted`.

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

`example.tsx` é a tela real deste projeto (`src/pages/TasksPage.tsx`) — não uma cópia.
Copie a estrutura dela.

## Antes de dizer pronto

- [ ] Usa `RecordHeader`, `Tabs`, `FilterBar`, `TaskGroup`, `Pagination` — não versões próprias
- [ ] Os quatro estados existem
- [ ] `bun lint` passa
- [ ] `bun run test:ui` passa — inclusive o axe
- [ ] **Screenshot em 1280px (desktop) e 375px (celular), comparado com o exemplo.** Um título longo trunca com
      reticências? Nenhum elemento sobrepõe outro? É aqui que aparece o que o lint e o
      build não pegam
- [ ] Em 375px nada vaza, e o que some segue a ordem acima
- [ ] Troque o tema: nada perde contraste
