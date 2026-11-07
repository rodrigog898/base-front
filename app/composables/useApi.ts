import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

type ApiOptions = NitroFetchOptions<NitroFetchRequest> & { retryOnUnauthorized?: boolean }

export interface ApiError {
  status?: number
  code?: string
  message: string
  requestId?: string
}

/**
 * Cliente HTTP hacia el backend:
 *  - agrega Authorization (token en memoria) y X-Request-Id para correlación de logs
 *  - ante 401 intenta un refresh una sola vez y reintenta
 *  - normaliza errores { status, code, message, requestId } y los registra en JSON
 */
export function useApi() {
  const config = useRuntimeConfig().public
  const auth = useAuth()
  const log = useLogger({ module: 'api' })

  async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const { retryOnUnauthorized = true, ...fetchOptions } = options
    const requestId = newRequestId()
    const headers = new Headers(fetchOptions.headers as HeadersInit | undefined)
    headers.set('X-Request-Id', requestId)
    if (auth.accessToken.value) headers.set('Authorization', `Bearer ${auth.accessToken.value}`)

    try {
      return await $fetch<T>(path, {
        baseURL: config.apiBase as string,
        credentials: 'include',
        ...fetchOptions,
        headers,
      })
    }
    catch (e) {
      const err = e as { status?: number, data?: { code?: string, message?: string, requestId?: string }, message: string }

      if (err.status === 401 && retryOnUnauthorized && (await auth.refresh())) {
        return request<T>(path, { ...options, retryOnUnauthorized: false })
      }
      if (err.status === 401) {
        auth.clear()
        if (import.meta.client) await navigateTo('/login')
      }

      const apiError: ApiError = {
        status: err.status,
        code: err.data?.code,
        message: err.data?.message ?? 'No pudimos completar la operación',
        requestId: err.data?.requestId ?? requestId,
      }
      const level = !err.status || err.status >= 500 ? 'error' : 'warn'
      log[level]('API request failed', {
        requestId: apiError.requestId,
        path: stripQuery(path),
        method: fetchOptions.method ?? 'GET',
        status: apiError.status,
        code: apiError.code,
      })
      throw apiError
    }
  }

  return {
    request,
    get: <T>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: unknown, options?: ApiOptions) =>
      request<T>(path, { ...options, method: 'POST', body: body as Record<string, unknown> }),
    put: <T>(path: string, body?: unknown, options?: ApiOptions) =>
      request<T>(path, { ...options, method: 'PUT', body: body as Record<string, unknown> }),
    patch: <T>(path: string, body?: unknown, options?: ApiOptions) =>
      request<T>(path, { ...options, method: 'PATCH', body: body as Record<string, unknown> }),
    del: <T>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: 'DELETE' }),
  }
}
