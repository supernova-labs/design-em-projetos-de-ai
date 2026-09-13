import type { Record } from '@/data'
import { Avatar } from './ui/avatar'
import { Badge } from './ui/badge'
import { Icon } from './ui/icon'
import { Property } from './ui/property'

// Classes completas, nunca interpoladas: o Tailwind varre o código como texto,
// então `text-${x}` não gera classe nenhuma.
const priorityColor = {
  alta: 'text-danger',
  média: 'text-warning',
  baixa: 'text-success',
} as const

/** Cabeçalho de registro: título, descrição e as propriedades editáveis. */
export function RecordHeader({ record }: { record: Record }) {
  return (
    <header className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <div className="space-y-1 px-5 pt-5 pb-4">
        <h1 className="text-title font-semibold">{record.title}</h1>
        <button
          type="button"
          className="cursor-pointer rounded px-1 -mx-1 text-muted transition-colors hover:bg-surface-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        >
          {record.description || 'Adicionar descrição…'}
        </button>
      </div>

      <div className="flex flex-wrap items-start gap-x-8 gap-y-4 border-t border-border px-5 py-4">
        <Property label="Tipo">
          <Badge tone="accent">{record.type}</Badge>
        </Property>

        <Property label="Status">
          <Badge tone="warning" dot>
            {record.status}
          </Badge>
        </Property>

        <Property label="Responsável">
          {record.assignee ? (
            <span className="flex items-center gap-1.5">
              <Avatar name={record.assignee} size="sm" />
              {record.assignee}
            </span>
          ) : (
            <span className="text-muted">Sem responsável</span>
          )}
        </Property>

        <Property label="Prioridade">
          <span className="flex items-center gap-1.5">
            <Icon name="flag" className={`size-3.5 ${priorityColor[record.priority]}`} />
            <span className="capitalize">{record.priority}</span>
          </span>
        </Property>

        <Property label="Seguidores">
          <span className="flex items-center gap-1.5">
            {record.followers.map((f) => (
              <Avatar key={f} name={f} size="sm" />
            ))}
          </span>
        </Property>

        <div className="ml-auto space-y-2 text-right">
          <p className="font-medium">{record.account}</p>
          <div className="flex flex-wrap justify-end gap-1.5">
            {record.tags.map((t) => (
              <Badge key={t} dot>
                {t}
              </Badge>
            ))}
            <Badge>+1</Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
