import { defineConfig } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath, URL } from 'node:url'

/**
 * CAMADA 5 · toda story vira um teste que roda num navegador de verdade,
 * com o axe checando acessibilidade. Falha vira build vermelho, não comentário.
 */
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // Sem isto, a primeira rodada num clone limpo falha: o Vite descobre o
  // jsx-dev-runtime no meio do teste, otimiza e recarrega a suíte.
  optimizeDeps: { include: ['react/jsx-dev-runtime'] },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
