import type { Preview } from '@storybook/react-vite'
import '../src/styles/theme.css'

const preview: Preview = {
  parameters: {
    // CAMADA 5 · uma violação de acessibilidade falha o teste; não é aviso.
    a11y: { test: 'error' },
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: 'Tema',
      defaultValue: 'light',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Escuro' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // O tema é do documento, como na aplicação: nenhum componente sabe dele.
      document.documentElement.dataset.theme = context.globals.theme as string
      // `<Story />`, nunca `Story()` — chamar o componente como função
      // quebra os hooks dele (o React perde o dispatcher).
      return (
        <div className="bg-bg text-fg p-4">
          <Story />
        </div>
      )
    },
  ],
}

export default preview
