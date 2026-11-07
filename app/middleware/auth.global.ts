const PUBLIC_ROUTES = new Set(['/login'])

/**
 * Protege todas las rutas salvo las públicas.
 * Se ejecuta en el cliente: el refresh token es una cookie HttpOnly del dominio
 * de la API, por lo que el servidor SSR no puede validarla.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const auth = useAuth()
  const isPublic = PUBLIC_ROUTES.has(to.path) || to.meta.public === true
  const hasSession = await auth.ensureSession()

  if (!isPublic && !hasSession) {
    return navigateTo({ path: '/login', query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined })
  }
  if (to.path === '/login' && hasSession) {
    return navigateTo('/')
  }
})
