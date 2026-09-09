import type { ReactNode } from 'react'
import { Icon } from './icon'

export function FilterBar({
  search,
  onSearch,
  placeholder = 'Buscar…',
  children,
  chips,
}: {
  search: string
  onSearch: (v: string) => void
  placeholder?: string
  children?: ReactNode
  chips?: ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
            <Icon name="search" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3
              text-body shadow-card placeholder:text-muted
              transition-[color,border-color,box-shadow] duration-100
              hover:border-border-strong
              focus-visible:border-primary focus-visible:outline-none
              focus-visible:ring-[3px] focus-visible:ring-primary/20
              [&::-webkit-search-cancel-button]:appearance-none"
          />
        </div>
        <div className="flex items-center gap-1.5">{children}</div>
      </div>
      {chips && <div className="flex flex-wrap gap-2">{chips}</div>}
    </div>
  )
}

/** Filtro ativo. Sempre removível — filtro que não se tira vira armadilha. */
export function FilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-primary-soft py-1 pl-2.5 pr-1 text-label font-medium text-primary">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remover filtro ${label}`}
        className="cursor-pointer rounded-sm p-0.5 transition-colors hover:bg-surface
          focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
      >
        <Icon name="close" className="size-3" />
      </button>
    </span>
  )
}
