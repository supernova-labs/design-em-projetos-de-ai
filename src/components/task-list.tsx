import { useState } from 'react'
import { Icon, type IconName } from './ui/icon'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Avatar } from './ui/avatar'
import { ProgressRing } from './ui/progress-ring'
import { InlineAdd } from './ui/inline-add'
import { formatDue, type Task } from '@/data'

const priorityTone = { alta: 'danger', média: 'warning', baixa: 'success' } as const
const scopeTone = { externa: 'warning', interna: 'info' } as const
const contextIcon: Record<Task['context'], IconName> = {
  conta: 'shield',
  menção: 'at',
  contrato: 'briefcase',
}
const dueClass = {
  danger: 'text-danger',
  success: 'text-success',
  warning: 'text-warning',
  muted: 'text-muted',
} as const

/** Uma linha de tarefa. Toda a informação da linha cabe numa varredura de olho. */
function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: string, v: boolean) => void }) {
  const due = formatDue(task.dueInDays)

  return (
    <li className="group flex items-center gap-3 border-b border-border px-3 py-2.5 transition-colors duration-100 last:border-0 hover:bg-accent-soft/40">
      <Checkbox
        checked={task.done}
        onChange={(v) => onToggle(task.id, v)}
        label={`Concluir: ${task.title}`}
      />

      <a
        href={task.url ?? `#/tarefas/${task.id}`}
        {...(task.url ? { target: '_blank', rel: 'noreferrer' } : {})}
        className={`min-w-0 flex-1 cursor-pointer truncate underline-offset-2 hover:underline
          ${task.done ? 'text-muted line-through' : ''}`}
      >
        {task.title}
        <Icon name="external" className="ml-1 inline size-3.5 text-muted align-[-1px]" />
      </a>

      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
        <Badge tone={scopeTone[task.scope]}>{task.scope}</Badge>
      </div>

      <div className="hidden w-16 shrink-0 items-center gap-1.5 text-muted md:flex">
        <Icon name="comment" className="size-3.5" />
        <span className="tabular-nums">{task.comments}</span>
        <span aria-hidden="true">·</span>
        <span title={task.context} className="flex">
          <Icon name={contextIcon[task.context]} className="size-3.5" />
          <span className="sr-only">{task.context}</span>
        </span>
      </div>

      <span className={`hidden w-28 shrink-0 text-right lg:block ${dueClass[due.tone]}`}>
        {due.label}
      </span>

      <Avatar name={task.assignee} />
    </li>
  )
}

/** Grupo colapsável de tarefas, com progresso próprio. */
export function TaskGroup({
  name,
  tasks,
  onToggle,
  onAdd,
}: {
  name: string
  tasks: Task[]
  onToggle: (id: string, v: boolean) => void
  onAdd: (group: string, title: string) => void
}) {
  const [open, setOpen] = useState(true)
  const [adding, setAdding] = useState(false)
  const done = tasks.filter((t) => t.done).length

  return (
    <section className="group/g overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <header className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? `Recolher ${name}` : `Expandir ${name}`}
          className="cursor-pointer rounded p-0.5 text-muted transition-transform duration-150 hover:text-fg
            focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          <Icon name="chevronDown" />
        </button>

        <h3 className="font-medium">{name}</h3>

        <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-100 group-hover/g:opacity-100 focus-within:opacity-100">
          <Button variant="ghost" size="sm" aria-label={`Renomear ${name}`}>
            <Icon name="pencil" className="size-3.5" />
          </Button>
          <Button variant="ghost" size="sm" aria-label={`Excluir ${name}`}>
            <Icon name="trash" className="size-3.5" />
          </Button>
        </div>

        <div className="ml-auto">
          <ProgressRing done={done} total={tasks.length} />
        </div>
      </header>

      {open && (
        <>
          <ul>
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} onToggle={onToggle} />
            ))}
          </ul>

          {adding ? (
            <InlineAdd
              placeholder="Digite o nome da tarefa e aperte enter…"
              onSave={(title) => {
                onAdd(name, title)
                setAdding(false)
              }}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex w-full cursor-pointer items-center gap-2 border-t border-border px-3 py-2.5 text-muted
                transition-colors hover:bg-surface-hover hover:text-fg
                focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            >
              <Icon name="plus" className="size-3.5" />
              Nova tarefa
            </button>
          )}
        </>
      )}
    </section>
  )
}
