// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/test-utils',
  ],
  devtools: { enabled: true },

  css: ['~/assets/css/design-system.css'],
  compatibilityDate: '2025-07-15',

  eslint: {
    config: {
      stylistic: {
        semi: false, // 无分号
        quotes: 'single', // 单引号
        indent: 2, // 2空格缩进
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
        arrowParens: true,
      },
    },
  },
})
