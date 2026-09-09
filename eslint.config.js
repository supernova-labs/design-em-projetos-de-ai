import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

/**
 * CAMADA 5 · VERIFICAÇÃO (parte 1: lint)
 *
 * As duas regras abaixo são o coração do padrão: a decisão de design
 * vira erro de build, não recomendação num documento.
 */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Estilo: sem ponto e vírgula, aspas simples (JSX continua com aspas duplas).
    files: ['**/*.{ts,tsx,js}'],
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/member-delimiter-style': [
        'error',
        { multiline: { delimiter: 'none' }, singleline: { delimiter: 'semi', requireLast: false } },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          // 1. cor crua em hex — só dentro de className e style.
          //    A primeira versão desta regra olhava qualquer literal e acusava
          //    "#1327" (número de issue) como se fosse cor. Regra de lint sem
          //    escopo vira ruído, e ruído faz o time desligar a regra.
          selector:
            ":matches(JSXAttribute[name.name='className'], JSXAttribute[name.name='style']) Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message:
            'Cor em hex não entra no componente. Use um token semântico do theme.css (bg-primary, text-fg…).',
        },
        {
          // 2. classe do nível base do token, direto no componente
          selector:
            'Literal[value=/\\b(bg|text|border)-(gray|blue|red|green|amber|slate|zinc|neutral)-[0-9]{2,3}\\b/]',
          message:
            'Esse é o nível base da paleta. Use o token semântico: bg-bg, text-fg, bg-primary, text-danger…',
        },
        {
          // 3. div clicável — acessibilidade
          selector: "JSXOpeningElement[name.name='div'] > JSXAttribute[name.name='onClick']",
          message: 'div não é botão. Use <Button> — foco e teclado vêm junto.',
        },
      ],
    },
  },
  {
    // A tela de exemplo da skill é referência; não é código de produção.
    ignores: ['dist', '.claude/**'],
  },
)
