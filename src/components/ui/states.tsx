import type { ReactNode } from 'react'
import { Button } from './button'
import { Icon } from './icon'

/** Vazio. Sempre com uma saída: criar o primeiro, ou limpar o filtro. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-20 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-surface-hover text-muted">
        <Icon name="inbox" className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description && <p className="max-w-sm text-muted">{description}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  )
}

/** Erro. Nunca uma tela em branco: diz o que houve e oferece tentar de novo. */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface px-6 py-20 text-center shadow-card"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-danger-soft text-danger">
        <Icon name="alert" className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="font-medium">Não foi possível carregar</p>
        <p className="max-w-sm text-muted">A lista não veio. Isso costuma ser temporário.</p>
      </div>
      <div className="pt-1">
        <Button variant="secondary" onClick={onRetry}>
          Tentar de novo
        </Button>
      </div>
    </div>
  )
}
