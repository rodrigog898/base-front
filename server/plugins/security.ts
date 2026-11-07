/**
 * Ajusta connect-src de la CSP en runtime con NUXT_PUBLIC_API_BASE,
 * para que la misma imagen Docker sirva en distintos entornos.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('nuxt-security:routeRules', (routeRules) => {
    const apiBase = useRuntimeConfig().public.apiBase as string
    let origin: string
    try {
      origin = new URL(apiBase).origin
    }
    catch {
      return
    }

    const headers = routeRules['/**']?.headers
    const csp = headers ? headers.contentSecurityPolicy : undefined
    if (csp && typeof csp === 'object') {
      const current = (csp['connect-src'] as string[] | undefined) ?? ["'self'"]
      if (!current.includes(origin)) csp['connect-src'] = [...current, origin]
    }
  })
})
