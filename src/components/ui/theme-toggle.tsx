import { useEffect, useState } from 'react'
import { Button } from './button'
import { Icon } from './icon'

type Theme = 'light' | 'dark'

function preferred(): Theme {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Alterna o tema. Note o que ele NÃO faz: não conhece nenhuma cor.
 * Só troca `data-theme` no <html> — quem sabe as cores é o theme.css.
 *
 * O estado nasce já com o valor salvo (lazy initializer). Inicializar com
 * um valor fixo e corrigir depois num efeito sobrescreve a escolha do
 * usuário antes de lê-la — em StrictMode o efeito roda duas vezes e a
 * preferência se perde.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(preferred)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
      title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </Button>
  )
}
