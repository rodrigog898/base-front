// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': ['error', { allow: ['debug', 'info', 'warn', 'error'] }],
    'vue/no-v-html': 'error', // XSS: no renderizar HTML sin sanitizar
  },
})
