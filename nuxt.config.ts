import { defineNuxtConfig } from 'nuxt/config'

const isDev = process.env.NODE_ENV !== 'production'
const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
const apiOrigin = new URL(apiBase).origin

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devServer: { port: 4000 },
  devtools: { enabled: isDev },
  sourcemap: { server: true, client: false },

  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts', 'nuxt-security', '@nuxt/eslint'],

  // Fuentes autoalojadas: sin peticiones a Google desde el navegador (privacidad + CSP estricta)
  fonts: {
    families: [{ name: 'Inter', weights: [400, 500, 600, 700], provider: 'google' }],
  },

  runtimeConfig: {
    public: {
      appName: 'Base Negocio',
      serviceName: 'base-front',
      appVersion: process.env.npm_package_version || '0.0.0',
      apiBase,
      clientLogs: {
        enabled: true,
        // niveles que se envían al backend
        level: 'warn',
      },
    },
  },

  /**
   * Cabeceras de seguridad OWASP (ISO 27001 A.8.26) vía nuxt-security.
   * La CSP usa nonce + strict-dynamic en SSR. connect-src se ajusta en runtime
   * (server/plugins/security.ts) según NUXT_PUBLIC_API_BASE.
   */
  security: {
    nonce: true,
    sri: true,
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'base-uri': ["'none'"],
        'object-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'img-src': ["'self'", 'data:', 'blob:'],
        'font-src': ["'self'", 'data:'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'script-src': ["'self'", "'nonce-{{nonce}}'", "'strict-dynamic'"],
        'script-src-attr': ["'none'"],
        'connect-src': isDev ? ["'self'", apiOrigin, 'ws:', 'wss:'] : ["'self'", apiOrigin],
        'upgrade-insecure-requests': !isDev,
      },
      strictTransportSecurity: isDev ? false : { maxAge: 31536000, includeSubdomains: true, preload: true },
      crossOriginEmbedderPolicy: isDev ? 'unsafe-none' : 'credentialless',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin',
      referrerPolicy: 'strict-origin-when-cross-origin',
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        'display-capture': [],
        fullscreen: ['self'],
      },
    },
    rateLimiter: { tokensPerInterval: 300, interval: 60000 },
    requestSizeLimiter: { maxRequestSizeInBytes: 100_000, maxUploadFileRequestInBytes: 1_000_000 },
    xssValidator: {},
    corsHandler: false,
    hidePoweredBy: true,
    removeLoggers: !isDev,
  },

  nitro: {
    // Los logs de Nitro salen en JSON (server/plugins/logger.ts)
    compressPublicAssets: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
    },
  },

  eslint: {
    config: { standalone: true },
  },
})
