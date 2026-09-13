import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import { EmptyState, ErrorState } from './states'

const meta = { title: 'Estados/Vazio e erro' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: 'Vazio',
  render: () => (
    <EmptyState
      title="Nenhuma tarefa ainda"
      description="Quando alguém criar a primeira, ela aparece aqui."
      action={<Button>Nova tarefa</Button>}
    />
  ),
}

export const EmptyFiltered: Story = {
  name: 'Vazio por filtro',
  render: () => (
    <EmptyState
      title="Nenhuma tarefa bate com o filtro"
      description="Tente outro termo ou remova os filtros ativos."
      action={<Button variant="secondary">Limpar filtros</Button>}
    />
  ),
}

export const Failed: Story = {
  name: 'Erro',
  render: () => <ErrorState onRetry={() => {}} />,
}
