import { useState } from 'react'
import { TasksPage } from '@/pages/TasksPage'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

type Sim = 'ok' | 'empty' | 'error'

const options = [
  ['ok', 'com dados'],
  ['empty', 'vazio'],
  ['error', 'erro'],
] as const

export default function App() {
  const [sim, setSim] = useState<Sim>('ok')

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-gutter py-3">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-label font-bold text-on-primary">
            S
          </span>
          <span className="font-medium">Supernova</span>
          <span className="text-muted">·</span>
          <span className="text-muted">Projetos</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-gutter px-gutter py-gutter">
        <TasksPage simulate={sim} />

        {/* Painel de demonstração: permite ver os quatro estados sem mexer no código. */}
        <aside className="rounded-lg border border-dashed border-border px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-label font-medium tracking-wide text-muted uppercase">
              Simular estado
            </span>
            {options.map(([value, label]) => (
              <Button
                key={value}
                size="sm"
                variant={sim === value ? 'primary' : 'secondary'}
                onClick={() => setSim(value)}
              >
                {label}
              </Button>
            ))}
            <span className="ml-auto text-muted">
              recarregue a página para ver o carregando
            </span>
          </div>
        </aside>
      </main>
    </div>
  )
}
