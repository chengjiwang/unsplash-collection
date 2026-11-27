import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // Node 25+ enables a built-in global localStorage that shadows jsdom's
      // (and is undefined without --localstorage-file). Disable it in workers.
      execArgv: ['--no-webstorage'],
    },
  }),
)
