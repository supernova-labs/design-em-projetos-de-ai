import { Button } from './button'
import { Icon } from './icon'

/** Paginação. 10 por página, sem scroll infinito. */
export function Pagination({
  page,
  pageCount,
  total,
  perPage,
  onChange,
}: {
  page: number
  pageCount: number
  total: number
  perPage: number
  onChange: (p: number) => void
}) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Paginação">
      <p className="text-muted">
        <span className="font-medium text-fg">
          {from}–{to}
        </span>{' '}
        de {total}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <Icon name="chevronLeft" className="size-3.5" />
          Anterior
        </Button>
        <span className="px-2 text-muted tabular-nums">
          {page} / {pageCount || 1}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Próxima página"
        >
          Próxima
          <Icon name="chevronRight" className="size-3.5" />
        </Button>
      </div>
    </nav>
  )
}
