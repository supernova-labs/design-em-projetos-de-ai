import { Icon } from './icon'

/** Checkbox. O input real fica invisível mas presente — teclado e leitor de tela funcionam. */
export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="group inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={`flex size-[18px] items-center justify-center rounded-[4px] border
          transition-all duration-100 ease-out
          peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary
          ${
            checked
              ? 'border-primary bg-primary text-on-primary'
              : 'border-border-strong bg-surface group-hover:border-primary'
          }`}
      >
        {checked && <Icon name="check" className="size-3" />}
      </span>
    </label>
  )
}
