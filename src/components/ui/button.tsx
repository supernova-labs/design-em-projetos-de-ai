import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

// `disabled:hover:*` anula o hover no estado desabilitado — sem isso o botão
// continua reagindo ao mouse enquanto está bloqueado.
const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary shadow-card hover:bg-primary-hover disabled:hover:bg-primary active:translate-y-px disabled:active:translate-y-0',
  secondary:
    'bg-surface text-fg border border-border shadow-card hover:bg-surface-hover hover:border-border-strong disabled:hover:bg-surface disabled:hover:border-border active:translate-y-px disabled:active:translate-y-0',
  ghost:
    'text-muted hover:bg-surface-hover hover:text-fg disabled:hover:bg-transparent disabled:hover:text-muted',
  danger:
    'bg-danger text-on-primary shadow-card hover:opacity-90 disabled:hover:opacity-100 active:translate-y-px disabled:active:translate-y-0',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-2.5 gap-1.5',
  md: 'h-9 px-3.5 gap-2',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

/** Botão. Nunca use `div` com onClick — foco e teclado vêm de graça aqui. */
export function Button({ variant = 'primary', size = 'md', className = '', ...props }: Props) {
  return (
    <button
      type={props.type ?? 'button'}
      className={`inline-flex cursor-pointer select-none items-center justify-center rounded-md
        text-body font-medium whitespace-nowrap
        transition-all duration-100 ease-out
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
        disabled:cursor-not-allowed disabled:opacity-40
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
