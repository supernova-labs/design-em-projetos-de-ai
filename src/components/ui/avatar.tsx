const palette = [
  'bg-primary-soft text-primary',
  'bg-success-soft text-success',
  'bg-warning-soft text-warning',
  'bg-danger-soft text-danger',
  'bg-accent-soft text-accent',
  'bg-info-soft text-info',
]

/** Avatar por iniciais. A cor é derivada do nome — a mesma pessoa sempre na mesma cor. */
export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0)

  return (
    <span
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full
        font-medium ${palette[hash % palette.length]}
        ${size === 'sm' ? 'size-5 text-[0.5625rem]' : 'size-6 text-label'}`}
    >
      {initials}
    </span>
  )
}
