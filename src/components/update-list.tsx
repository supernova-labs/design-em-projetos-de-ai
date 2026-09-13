import { formatUpdateDate, type Update, type UpdateKind } from '@/data'
import { Avatar } from './ui/avatar'
import { Badge } from './ui/badge'

const kindTone = {
  release: 'accent',
  correção: 'success',
  decisão: 'info',
  comentário: 'neutral',
} as const satisfies Record<UpdateKind, string>

/** Uma atualização: quando, quem e o que mudou. Nessa ordem de leitura. */
function UpdateRow({ update }: { update: Update }) {
  const date = formatUpdateDate(update.date)

  return (
    <li className="flex gap-3 border-b border-border px-3 py-3 last:border-0">
      <Avatar name={update.author} />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium">{update.author}</span>
          <time dateTime={update.date} title={date.title} className="text-muted tabular-nums">
            {date.label}
          </time>
          <Badge tone={kindTone[update.kind]}>{update.kind}</Badge>
        </div>
        <p className="text-muted">{update.summary}</p>
      </div>
    </li>
  )
}

/** Lista de atualizações do registro, da mais recente para a mais antiga. */
export function UpdateList({ updates }: { updates: Update[] }) {
  return (
    <ul className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      {updates.map((u) => (
        <UpdateRow key={u.id} update={u} />
      ))}
    </ul>
  )
}

/** Esqueleto da lista. Skeleton, nunca spinner: o layout não pula. */
export function UpdateListSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
      role="status"
      aria-label="Carregando atualizações"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: esqueleto fixo, sem reordenação
        <div key={i} className="flex gap-3 border-b border-border px-3 py-3 last:border-0">
          <div className="size-6 shrink-0 animate-pulse rounded-full bg-border" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-40 animate-pulse rounded bg-border" />
            <div
              className="h-3.5 w-full animate-pulse rounded bg-border"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
