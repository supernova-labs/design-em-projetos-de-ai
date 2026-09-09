# Experimentos

Cada pasta é um teste que rodamos de verdade, com o que foi pedido, o que saiu e o que isso mudou no [playbook](../docs/playbook.md).

| Pasta | Pergunta | Resposta curta |
| --- | --- | --- |
| [**agents-md/**](agents-md/) | O contexto está chegando no agente? | Sim — e o bug que só o screenshot pega apareceu na versão sem contexto. |
| [**shadcn-cli/**](shadcn-cli/) | Os quatro comandos da camada 2 funcionam? E em projeto existente? | Do zero, sim. Em projeto existente, o `init` traz uma segunda paleta. |
| [**screenshot-loop/**](screenshot-loop/) | O agente tira o próprio screenshot sem ser lembrado? | Sim, nos dois tamanhos e nos dois temas, e de novo após uma mudança. |
| [**style-dictionary/**](style-dictionary/) | Um DTCG vira `@theme` do Tailwind por script? | Sim, com um `sed` de `:root` para `@theme`. O export do Figma segue sem teste. |
