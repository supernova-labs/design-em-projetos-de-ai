import type { ReactNode } from 'react'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-hover text-muted',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  accent: 'bg-accent-soft text-accent',
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
}: {
  children: ReactNode
  tone?: Tone
  dot?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5
        text-label font-medium ${tones[tone]}`}
    >
      {dot && <span className="size-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  )
}
