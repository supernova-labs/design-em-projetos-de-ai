# shadcn CLI — rodado em 10/09/2026

O playbook, na camada 2, diz que quatro comandos levam do zero até o agente instalar
componente sozinho. Este é o relato de rodar esses comandos de verdade, em dois cenários:
um projeto do zero e um projeto que já existia.

## Cenário A — projeto do zero

Numa pasta vazia:

```bash
bunx shadcn@latest init
bunx shadcn@latest add button input dialog table
bunx shadcn@latest mcp init --client claude
bunx skills add shadcn/ui
```

### O que saiu

| | |
| --- | --- |
| `init` numa pasta vazia | gera o projeto Vite inteiro — React, TypeScript, Tailwind v4, alias `@`, Prettier — não só o `components.json` |
| Versões | shadcn 4.21 · Base UI 1.8 · estilo `base-nova` · ícones lucide |
| Componentes | caem em `src/components/ui/`, um arquivo por componente, importando `@base-ui/react/*` |
| Tokens | `src/index.css` com dois níveis: `--primary`, `--muted`… em `:root` e `.dark`, mapeados em `@theme inline` para `--color-primary`, `--color-muted`… |
| Tema escuro | classe `.dark` no `<html>`, via `@custom-variant dark` |
| `mcp init` | escreve `.mcp.json` com `npx shadcn@latest mcp` — **`npx`, não `bunx`**; troque à mão |
| `skills add` | instala a skill em `.agents/skills/shadcn/` com symlink em `.claude/skills/shadcn`, e um `skills-lock.json` |

### O teste da camada 2

Com o MCP ligado, o pedido foi *"adiciona um seletor de data"*. O agente consultou o
catálogo, instalou `calendar` e `popover`, e escreveu `date-picker.tsx` compondo os dois
com o `Button` — em vez de escrever um seletor do zero:

```tsx
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger render={<Button variant="outline" … />}>
    <CalendarIcon />
    {date ? format(date, "dd/MM/yyyy") : <span>{placeholder}</span>}
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar mode="single" selected={date} onSelect={handleSelect} autoFocus />
  </PopoverContent>
</Popover>
```

É o comportamento que a camada 2 promete: consultar antes de criar. **Passou.**

## Cenário B — projeto que já existe

O `init` foi rodado numa cópia deste projeto de referência, que já tinha `theme.css`,
13 componentes em `src/components/ui/` e tema escuro por `data-theme`. Com `-y -d`
(aceitar os padrões sem perguntar).

### O que aconteceu

| Passo | Resultado |
| --- | --- |
| Detectar Vite, Tailwind v4 e o alias `@` | passou |
| `components.json` e `src/lib/utils.ts` | criados |
| `theme.css` | **+129 linhas**: um segundo vocabulário de tokens (`--background`, `--primary`, `--muted`, `--sidebar-*`, `--chart-*`), a fonte Geist, `tw-animate-css`, e dark mode por classe `.dark` |
| `button.tsx` que já existia | **sobrescrito** pelo do shadcn |
| `package.json` | +7 dependências |
| `bun lint` | passou |
| `bun run build` | **quebrou**: as variantes `primary` e `danger` do botão antigo viraram `default` e `destructive` no novo |

O `button.tsx` só foi sobrescrito porque o `-y` aceitou tudo; no modo interativo o CLI
pergunta. Mas o resultado do "sim" é o mesmo.

### O que isso ensina

O `init` não é "adicionar": ele traz o próprio vocabulário de tokens e o próprio mecanismo
de tema, e os componentes copiados dependem desses nomes (`bg-primary`,
`text-primary-foreground`, `bg-muted`, `bg-background`). Num projeto que já tem tokens,
o resultado são **duas paletas semânticas convivendo** — o problema dos 40 tons de
cinza, institucionalizado.

Daí a regra de três casos que foi para o playbook:

| Projeto | O que fazer |
| --- | --- |
| **Do zero** | `init` primeiro. O `theme.css` do estágio 1 nasce com os nomes do shadcn. |
| **Existente, sem sistema** | `init`, apagar o bloco de tokens injetado, e definir os nomes que os componentes usam como apelidos dos seus tokens. Uma vez só. |
| **Existente, com sistema próprio** | Não roda o `init`. Documenta o que existe. |

O apelido do segundo caso, no `@theme` do seu `theme.css`:

```css
/* os nomes que os componentes do shadcn esperam, apontando para os nossos tokens */
--color-background:         var(--color-bg);
--color-foreground:         var(--color-fg);
--color-primary-foreground: var(--color-on-primary);
--color-muted:              var(--color-surface-hover);
--color-muted-foreground:   var(--color-muted);
--color-destructive:        var(--color-danger);
--color-ring:               var(--color-primary);
```

Com isso, todo `add` futuro funciona sem segunda paleta, e o tema escuro continua sendo
o seu — nenhum componente precisa da classe `.dark`.
