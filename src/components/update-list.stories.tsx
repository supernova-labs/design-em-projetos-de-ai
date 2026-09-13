import type { Meta, StoryObj } from '@storybook/react-vite'
import { updates } from '@/data'
import { UpdateList, UpdateListSkeleton } from './update-list'

const meta = { title: 'Listas/Atualizações', component: UpdateList } satisfies Meta<
  typeof UpdateList
>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Lista',
  args: { updates },
}

export const Loading: Story = {
  name: 'Carregando',
  args: { updates: [] },
  render: () => <UpdateListSkeleton />,
}
