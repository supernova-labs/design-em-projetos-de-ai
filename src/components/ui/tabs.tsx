import { Icon, type IconName } from './icon'

export interface Tab {
  id: string
  label: string
  icon: IconName
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div role="tablist" className="flex flex-wrap items-center gap-1">
      {tabs.map((t) => {
        const on = t.id === active
        return (
          <button
            type="button"
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5
              font-medium transition-colors duration-100
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
              ${on ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-surface-hover hover:text-fg'}`}
          >
            <Icon name={t.icon} className="size-[18px]" />
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
