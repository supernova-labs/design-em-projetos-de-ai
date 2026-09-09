import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordHeader } from './record-header'
import { record } from '@/data'

const meta = {
  title: 'Padrões/Cabeçalho de registro',
  component: RecordHeader,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RecordHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Padrão', args: { record } }

export const WithAssignee: Story = {
  name: 'Com responsável',
  args: { record: { ...record, assignee: 'Renato Ames', priority: 'média' } },
}

export const LongTitle: Story = {
  name: 'Título longo',
  args: {
    record: {
      ...record,
      title:
        'Open source — o que está aberto nos nossos repositórios, e o que precisa de decisão antes da próxima release',
    },
  },
}
