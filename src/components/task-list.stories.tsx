import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TaskGroup } from './task-list'
import type { Task } from '@/data'

const base: Task = {
  id: 'T-1', group: 'Open Notebook', title: '#1327 · O SSE do chat não tem keepalive, e cancelar não faz nada',
  priority: 'alta', scope: 'interna', comments: 0, context: 'conta',
  dueInDays: -1, assignee: 'Luis Novo', done: false,
}

const tasks: Task[] = [
  base,
  { ...base, id: 'T-2', title: '#1264 · A aba de insights desiste depois de 4 minutos', priority: 'alta', scope: 'externa', comments: 1, context: 'menção', dueInDays: 0, assignee: 'Gyovana Prado' },
  { ...base, id: 'T-3', title: '#1290 · Senha com caractere fora de latin-1 nunca autentica', priority: 'baixa', scope: 'externa', dueInDays: 8, assignee: 'Renato Ames', done: true },
]

const meta = {
  title: 'Padrões/Grupo de tarefas',
  component: TaskGroup,
} satisfies Meta<typeof TaskGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Padrão',
  args: { name: 'Open Notebook', tasks, onToggle: () => {}, onAdd: () => {} },
  render: (args) => {
    const [rows, setRows] = useState(args.tasks)
    return (
      <TaskGroup
        {...args}
        tasks={rows}
        onToggle={(id, done) => setRows((r) => r.map((t) => (t.id === id ? { ...t, done } : t)))}
      />
    )
  },
}

/**
 * O caso que o experimento expôs: título longo tem que truncar, não atravessar
 * a linha. Se o `<a>` voltar a ser `inline`, esta story mostra na hora.
 */
export const LongTitle: Story = {
  name: 'Título longo',
  args: {
    name: 'Content Core',
    onToggle: () => {},
    onAdd: () => {},
    tasks: [
      {
        ...base,
        id: 'T-long',
        title:
          '#60 · Corrigir a normalização de acentos no pipeline de extração de conteúdo quando o documento vem de uma fonte externa sem charset declarado no cabeçalho HTTP',
      },
    ],
  },
}

export const AllDone: Story = {
  name: 'Tudo concluído',
  args: {
    name: 'Esperanto',
    onToggle: () => {},
    onAdd: () => {},
    tasks: tasks.map((t) => ({ ...t, done: true })),
  },
}
