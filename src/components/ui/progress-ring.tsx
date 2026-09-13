/** Anel de progresso. Acompanha sempre um texto — cor e forma sozinhas não comunicam. */
export function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 8
  const c = 2 * Math.PI * r
  const pct = total === 0 ? 0 : done / total

  return (
    <span className="inline-flex items-center gap-2 text-muted tabular-nums">
      <span>
        {done}/{total}
      </span>
      <svg viewBox="0 0 20 20" className="size-[18px] -rotate-90" aria-hidden="true">
        <circle
          cx="10"
          cy="10"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.25"
        />
        <circle
          cx="10"
          cy="10"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className={pct === 1 ? 'text-success' : 'text-primary'}
          style={{ transition: 'stroke-dashoffset 240ms var(--ease-out)' }}
        />
      </svg>
    </span>
  )
}
