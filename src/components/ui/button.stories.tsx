import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import { Icon } from './icon'

const meta = {
  title: 'Base/Button',
  component: Button,
  args: { children: 'Nova tarefa' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Excluir' } }
export const Disabled: Story = { args: { disabled: true } }

export const WithIcon: Story = {
  name: 'Com ícone',
  args: {
    children: (
      <>
        <Icon name="plus" />
        Nova tarefa
      </>
    ),
  },
}

/** Botão só com ícone precisa de nome acessível — sem isso o axe falha, e deve falhar. */
export const IconOnly: Story = {
  name: 'Só ícone',
  args: {
    children: <Icon name="more" />,
    'aria-label': 'Mais ações',
    size: 'sm',
    variant: 'ghost',
  },
}
