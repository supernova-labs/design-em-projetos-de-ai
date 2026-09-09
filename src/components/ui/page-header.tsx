import type { ReactNode } from 'react'

/** Cabeçalho de página: título no plural, uma ação primária no máximo. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-title font-semibold">{title}</h1>
        {description && <p className="text-muted">{description}</p>}
      </div>
      {action}
    </header>
  )
}
