import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta = {
  title: 'Base/Badge',
  component: Badge,
  args: { children: 'aberto' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = {}
export const Success: Story = { args: { tone: 'success', children: 'aberto', dot: true } }
export const Warning: Story = { args: { tone: 'warning', children: 'em review', dot: true } }
export const Danger: Story = { args: { tone: 'danger', children: 'alta' } }
export const Info: Story = { args: { tone: 'info', children: 'interna' } }
export const Accent: Story = { args: { tone: 'accent', children: 'mergeado', dot: true } }

/** Todos os tons juntos: é onde se vê se algum perde contraste no tema escuro. */
export const AllTones: Story = {
  name: 'Todos',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>neutro</Badge>
      <Badge tone="success" dot>sucesso</Badge>
      <Badge tone="warning" dot>atenção</Badge>
      <Badge tone="danger">perigo</Badge>
      <Badge tone="info">informação</Badge>
      <Badge tone="accent" dot>destaque</Badge>
    </div>
  ),
}
