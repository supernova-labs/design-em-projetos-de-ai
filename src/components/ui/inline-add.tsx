import { useState } from 'react'
import { Button } from './button'

/**
 * Entrada inline: cria sem tirar a pessoa da lista.
 * Enter salva, Escape cancela — as duas teclas que todo mundo tenta.
 */
export function InlineAdd({
  placeholder,
  onSave,
  onCancel,
}: {
  placeholder: string
  onSave: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState('')

  const save = () => {
    if (value.trim()) onSave(value.trim())
    setValue('')
  }

  return (
    <div className="flex items-center gap-2 border-t border-border px-3 py-2">
      <input
        // biome-ignore lint/a11y/noAutofocus: o campo só existe depois de o usuário pedir para adicionar
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-8 flex-1 rounded-md border border-border bg-surface px-2.5
          text-body placeholder:text-muted
          transition-[border-color,box-shadow] duration-100
          focus-visible:border-primary focus-visible:outline-none
          focus-visible:ring-[3px] focus-visible:ring-primary/20"
      />
      <Button variant="ghost" size="sm" onClick={onCancel} className="text-danger">
        Cancelar
      </Button>
      <Button size="sm" onClick={save} disabled={!value.trim()}>
        Salvar
      </Button>
    </div>
  )
}
