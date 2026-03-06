// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    pnpm: true,
    ignores: ['data/**'],
    rules: {
      'pnpm/json-enforce-catalog': 'off',
      'no-console': 'warn',
      'node/prefer-global/process': 'off',
      '@stylistic/quotes': 'off',
    },
  },
)
