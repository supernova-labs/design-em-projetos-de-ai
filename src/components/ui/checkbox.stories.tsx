import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from './checkbox'

const meta = { title: 'Base/Checkbox', component: Checkbox } satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>

/** Interativo: o axe checa que o input tem nome acessível mesmo estando escondido. */
export const Interactive: Story = {
  name: 'Interativo',
  args: { checked: false, label: 'Concluir a tarefa', onChange: () => {} },
  render: (args) => {
    const [on, setOn] = useState(args.checked)
    return <Checkbox {...args} checked={on} onChange={setOn} />
  },
}

export const Checked: Story = {
  name: 'Marcado',
  args: { checked: true, label: 'Tarefa concluída', onChange: () => {} },
}
