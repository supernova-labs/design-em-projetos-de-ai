# Tokens em DTCG → Tailwind v4 — rodado em 10/09/2026

A camada 1 diz: *"se o cliente tem Figma com variables, elas saem de lá uma vez, por
script: Figma exporta DTCG, o Style Dictionary converte. Não à mão."* Este é o relato de
testar a segunda metade dessa frase. A primeira, o export do Figma, **não foi testada** —
não temos Figma. O que dá para afirmar é que, chegando um arquivo DTCG, o resto funciona.

## O arquivo de entrada

DTCG é o formato aberto do W3C para tokens, e é o que o Figma exporta. Um arquivo escrito
à mão no formato, com os três níveis que o padrão usa — repare que o nível semântico
**referencia** o base, com `{color.neutral.25}`:

```json
{
  "color": {
    "neutral": {
      "25":  { "$type": "color", "$value": "#fcfcfd" },
      "800": { "$type": "color", "$value": "#2b2d36" }
    },
    "indigo": { "600": { "$type": "color", "$value": "#4f46e5" } },
    "bg":      { "$type": "color", "$value": "{color.neutral.25}" },
    "fg":      { "$type": "color", "$value": "{color.neutral.800}" },
    "primary": { "$type": "color", "$value": "{color.indigo.600}" }
  },
  "spacing": { "gutter": { "$type": "dimension", "$value": { "value": 24, "unit": "px" } } },
  "radius":  { "md": { "$type": "dimension", "$value": { "value": 7, "unit": "px" } } },
  "font":    { "sans": { "$type": "fontFamily", "$value": ["Inter", "system-ui"] } }
}
```

## A conversão

```json
// config.json
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/",
      "files": [{
        "destination": "theme.css",
        "format": "css/variables",
        "options": { "outputReferences": true }
      }]
    }
  }
}
```

```bash
bunx style-dictionary@latest build      # v5.5.3
```

## O que saiu

```css
:root {
  --color-neutral-25: #fcfcfd;
  --color-neutral-800: #2b2d36;
  --color-indigo-600: #4f46e5;
  --spacing-gutter: 24px;
  --radius-md: 7px;
  --font-sans: Inter, system-ui;
  --color-bg: var(--color-neutral-25);
  --color-fg: var(--color-neutral-800);
  --color-primary: var(--color-indigo-600);
}
```

Três coisas a notar:

- **Os nomes já são os do Tailwind v4.** `color.bg` virou `--color-bg`, `spacing.gutter`
  virou `--spacing-gutter`. Nenhum mapeamento à mão.
- **As referências sobreviveram.** `outputReferences: true` mantém `--color-bg` apontando
  para `--color-neutral-25`, que é exatamente a estrutura de três níveis da camada 1.
- **Sai em `:root`, não em `@theme`.** O Tailwind v4 só gera as classes (`bg-primary`,
  `gap-gutter`) para variáveis declaradas dentro de `@theme { }`. É uma linha de `sed`,
  ou um formato customizado no Style Dictionary:

```bash
sed 's/^:root {/@theme {/' build/theme.css > src/styles/theme.css
```

## A prova

Com o arquivo convertido importado depois do Tailwind, e um HTML usando as classes:

```html
<div class="bg-primary text-fg gap-gutter rounded-md font-sans text-danger"></div>
```

O build do Tailwind gerou as seis. **Passou.**

## O que isso muda no padrão

A frase da camada 1 está certa, com um detalhe a mais: o `:root` precisa virar `@theme`.
Foi para o playbook.

O que segue sem relato é o lado do Figma: qual plugin ou API exporta as variables em DTCG,
e se o export sai com as referências entre níveis ou com os valores resolvidos. Se sair
resolvido, o nível semântico perde o `var()` e vira valor cru — o script de conversão
continua funcionando, mas o tema escuro deixa de ser "redefinir quinze linhas".
