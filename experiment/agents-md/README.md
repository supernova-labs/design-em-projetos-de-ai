# Com e sem `AGENTS.md` — rodado em 09/09/2026

O contexto está chegando no agente? A mesma tela, pedida duas vezes: uma sessão sem o arquivo, outra com.

Tela pedida, palavra por palavra igual nas duas rodadas:

> Crie a aba de pull requests: lista com busca, filtro por estado (aberto, em review, mergeado), mostrando o título, o autor, o repositório e há quanto tempo está aberto.

Rodada A sem o `AGENTS.md`, rodada B com. Sessões separadas.

## O placar

| | Sem `AGENTS.md` | Com |
| --- | --- | --- |
| Comando que mandou rodar | `npm run dev` (o projeto é bun) | `bun run dev` |
| Truncamento do título | **quebrado** | funciona |
| Coluna de repositório | não existe | `Badge` com o repo |
| Autor | avatar **e** nome por extenso | só o avatar, como nas outras telas |
| Linhas de código | 360 | 317 |
| Os quatro estados | ✓ | ✓ |
| `FilterBar`, `Pagination`, 10 por página | ✓ | ✓ |
| Cor crua ou token do nível base | nenhuma | nenhuma |
| `bun lint` | passa | passa |
| `bun run build` | passa | passa |

## O bug, e por que ele é interessante

Uma linha separa as duas versões.

Sem o `AGENTS.md`, o link ficou dentro de uma `div`:

```jsx
<div className="min-w-0 flex-1">
  <a className="truncate …">{título}</a>
</div>
```

Com o `AGENTS.md`, o link **é** o item flex:

```jsx
<a className="min-w-0 flex-1 truncate …">{título}</a>
```

`truncate` é `overflow:hidden` + `text-overflow:ellipsis` + `white-space:nowrap`, e
**`overflow` não tem efeito em elemento `inline`**. Um `<a>` solto dentro de uma `div`
continua inline; um `<a>` filho direto de um container flex vira item flex e passa a
aceitar `overflow`.

Na versão A o `nowrap` aplica e o `hidden` não: o título não quebra linha e não é
cortado — ele atravessa o resto da linha. Medido no navegador: os dez links são
`display: inline`, e com um título longo o texto vaza 52px além da linha e colide
com o ícone de estado.

O código das duas versões está aqui, para comparar linha a linha:
[`without-context/`](without-context/) e [`with-context/`](with-context/).

**Sem o `AGENTS.md`** — o título passa por cima do badge, do contador, da data e do avatar:

![sem](without-agents-md.png)

**Com o `AGENTS.md`** — trunca com reticências, o resto da linha fica intacto:

![com](with-agents-md.png)

Com os títulos curtos que o agente inventou, o bug fica **latente**: só aparece quando
chega um título de verdade. É o pior tipo — passa na revisão e quebra em produção.

---

## Como rodar

É o teste que fecha o estágio 1 do padrão. Ele responde uma pergunta só, e a resposta é visível a olho nu.

Peça **a mesma tela** em duas condições diferentes. Sugestão de tela: *"a aba de pull requests"* — não existe no projeto, mas é irmã da de tarefas.

### Rodada A — sem contexto

```bash
mv AGENTS.md _AGENTS.md.off
```

Abra uma sessão nova do agente na pasta do projeto e peça:

> Crie a aba de pull requests: lista com busca, filtro por estado (aberto, em review, mergeado), mostrando o título, o autor, o repositório e há quanto tempo está aberto.

Guarde o resultado (`git stash` ou copie o arquivo para `experiment/rodada-a.tsx`).

### Rodada B — com contexto

```bash
mv _AGENTS.md.off AGENTS.md
```

Sessão **nova** (o contexto da anterior contamina), mesmo pedido, palavra por palavra.

### O que comparar

| | Rodada A | Rodada B (esperado) |
| --- | --- | --- |
| Cores | inventadas, hex ou `bg-gray-*` | tokens semânticos |
| Componentes | lista nova, escrita do zero | `TaskGroup`, `FilterBar`, `Avatar`, `Badge` |
| Estados | só o feliz | os quatro |
| Espaçamento | valores avulsos | `gap-gutter` |
| `bun lint` | falha | passa |

O item mais revelador é o último: **na rodada A o lint costuma falhar**, porque o agente escolheu cores que ninguém decidiu.

### Como ler o resultado

- **B claramente melhor que A** → o contexto está chegando. Estágio 1 concluído.
- **A e B iguais** → o `AGENTS.md` não foi lido. Quase sempre é uma destas: nome ou lugar errado do arquivo, arquivo grande demais, ou o pedido não deu ao agente motivo para procurar o padrão. Corrija isso antes de investir nas outras camadas — sem esse elo, nada do resto funciona.
- **B melhor mas ainda inventando telas** → o contexto chega, mas falta a camada 3. É o sinal de que padrões de página valem mais que componentes.
