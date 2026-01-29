// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }], // 禁止 console.log/info，允许 warn/error
      'no-debugger': 'error',
    },
  },
  // 覆盖 layouts 和 pages 目录的规则（Nuxt 约定允许单名单词）
  {
    files: ['layouts/**/*.vue', 'pages/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
