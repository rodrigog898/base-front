import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devServer: {
    port: 4000,
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || 'http://localhost:3000',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || process.env.NUXT_API_BASE || 'http://localhost:3000',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'DoorHQ',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
