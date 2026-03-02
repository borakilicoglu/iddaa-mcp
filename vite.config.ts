import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
    target: 'node18',
    ssr: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'esm',
        entryFileNames: 'server.mjs',
      },
    },
  },
  test: {
    environment: 'node',
  },
})
