import type { ReactNode } from 'react'
import { Icon } from './icon'

/**
 * Campo de propriedade do cabeçalho de registro: rótulo clicável e valor abaixo.
 * O rótulo é um botão porque abre um seletor — se fosse só texto, seria `<span>`.
 */
export function Property({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <button
        className="inline-flex cursor-pointer items-center gap-1 rounded px-1 -mx-1 font-medium text-primary
          transition-colors hover:bg-surface-hover
          focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
      >
        {label}
        <Icon name="chevronDown" className="size-3.5" />
      </button>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  )
}
