export interface AuthUser {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  lastConnectionAt?: string | null
}

interface AuthPayload {
  user: AuthUser
  accessToken: string
  expiresIn: number
}

type AuthStatus = 'unknown' | 'authenticated' | 'anonymous'

// Compartido entre todas las instancias (sólo cliente): un único refresh en vuelo.
let refreshing: Promise<boolean> | null = null

/**
 * Estado de autenticación.
 * - El access token vive SÓLO en memoria (nunca localStorage/sessionStorage → mitiga robo por XSS).
 * - El refresh token lo gestiona el backend en una cookie HttpOnly; el front nunca lo ve.
 */
export function useAuth() {
  const user = useState<AuthUser | null>('auth:user', () => null)
  const status = useState<AuthStatus>('auth:status', () => 'unknown')
  const accessToken = useState<string | null>('auth:token', () => null)
  const config = useRuntimeConfig().public
  const log = useLogger({ module: 'auth' })

  const apply = (payload: AuthPayload) => {
    user.value = payload.user
    accessToken.value = payload.accessToken
    status.value = 'authenticated'
  }

  const clear = () => {
    user.value = null
    accessToken.value = null
    status.value = 'anonymous'
  }

  const authFetch = <T>(path: string, body?: Record<string, unknown>) =>
    $fetch<{ success: boolean, data: T }>(`${config.apiBase}/api/auth${path}`, {
      method: 'POST',
      body,
      credentials: 'include',
      headers: { 'X-Request-Id': newRequestId() },
    })

  /** Renueva el access token usando la cookie. Concurrencia: una sola request en vuelo. */
  const refresh = (): Promise<boolean> => {
    if (import.meta.server) return Promise.resolve(false)
    refreshing ??= authFetch<AuthPayload>('/refresh')
      .then((res) => {
        apply(res.data)
        return true
      })
      .catch(() => {
        clear()
        return false
      })
      .finally(() => {
        refreshing = null
      })
    return refreshing
  }

  const login = async (email: string, password: string) => {
    const res = await authFetch<AuthPayload>('/login', { email, password })
    apply(res.data)
    log.info('Login exitoso', { userId: res.data.user.id })
  }

  const register = async (email: string, password: string) => {
    const res = await authFetch<AuthPayload>('/register', { email, password })
    apply(res.data)
  }

  const logout = async () => {
    try {
      await authFetch('/logout')
    }
    catch (err) {
      log.warn('Logout falló en el servidor', { err })
    }
    clear()
    await navigateTo('/login')
  }

  /** Restaura la sesión al cargar la app (si existe cookie de refresh válida). */
  const ensureSession = async (): Promise<boolean> => {
    if (status.value === 'authenticated') return true
    if (status.value === 'anonymous') return false
    return refresh()
  }

  return {
    user: readonly(user),
    status: readonly(status),
    accessToken: readonly(accessToken),
    isAuthenticated: computed(() => status.value === 'authenticated'),
    login,
    register,
    logout,
    refresh,
    ensureSession,
    clear,
  }
}
