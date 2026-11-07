import { createLogger, LOG_LEVEL_VALUE, type LogEntry, type LogLevel, type Logger } from '#shared/utils/log'

/**
 * Logger JSON universal (docs/LOGGING.md).
 *  - SSR: una línea JSON por evento a stdout/stderr.
 *  - Navegador: objeto estructurado en consola (sólo dev) y envío por lotes de
 *    warn/error al backend (POST /api/logs/client) para centralizarlos.
 */
export default defineNuxtPlugin({
  name: 'logger',
  enforce: 'pre',
  setup(nuxtApp) {
    const config = useRuntimeConfig().public
    const base = {
      service: config.serviceName as string,
      version: config.appVersion as string,
      environment: import.meta.dev ? 'development' : 'production',
    }

    let write: (entry: LogEntry) => void

    if (import.meta.server) {
      write = (entry) => {
        const line = `${JSON.stringify(entry)}\n`
        if (LOG_LEVEL_VALUE[entry.level] >= LOG_LEVEL_VALUE.error) process.stderr.write(line)
        else process.stdout.write(line)
      }
    }
    else {
      write = createBrowserWriter(
        `${config.apiBase}/api/logs/client`,
        config.clientLogs.enabled as boolean,
        config.clientLogs.level as LogLevel,
      )
    }

    const logger = createLogger(write, base, {
      minLevel: import.meta.dev ? 'debug' : 'info',
      logType: import.meta.server ? 'app' : 'client',
    })

    // Errores no controlados de Vue / Nuxt
    nuxtApp.hook('vue:error', (err, _instance, info) => {
      logger.error(err instanceof Error ? err.message : 'Vue error', { err, info, route: stripQuery(nuxtApp._route?.fullPath) })
    })
    nuxtApp.hook('app:error', (err) => {
      logger.error(err instanceof Error ? err.message : 'App error', { err })
    })

    if (import.meta.client) {
      window.addEventListener('error', (e) => {
        logger.error(e.message || 'Window error', { err: e.error, source: stripQuery(e.filename), line: e.lineno })
      })
      window.addEventListener('unhandledrejection', (e) => {
        const reason = e.reason
        logger.error(reason instanceof Error ? reason.message : 'Unhandled promise rejection', { err: reason })
      })
    }

    return { provide: { logger } }
  },
})

function createBrowserWriter(endpoint: string, shipEnabled: boolean, shipLevel: LogLevel) {
  const queue: Record<string, unknown>[] = []
  let timer: ReturnType<typeof setTimeout> | undefined
  const MAX_BATCH = 20

  const flush = () => {
    timer = undefined
    if (!queue.length) return
    const logs = queue.splice(0, MAX_BATCH)
    // keepalive permite enviar al cerrar la pestaña; sin cookies (credentials: omit)
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs }),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => { /* nunca generar logs a partir de un fallo de logging */ })
    if (queue.length) timer = setTimeout(flush, 1000)
  }

  if (shipEnabled) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush()
    })
  }

  return (entry: LogEntry) => {
    if (import.meta.dev) {
      const method = entry.level === 'fatal' ? 'error' : entry.level === 'trace' ? 'debug' : entry.level
      // eslint-disable-next-line no-console -- único punto de salida a consola (sólo dev)
      console[method](entry)
    }

    if (!shipEnabled || LOG_LEVEL_VALUE[entry.level] < LOG_LEVEL_VALUE[shipLevel]) return
    if (queue.length >= 100) return // backpressure

    const {
      level, message, timestamp, requestId,
      service: _service, version: _version, environment: _environment, logType: _logType,
      ...context
    } = entry

    queue.push({
      level: level === 'fatal' ? 'error' : level,
      message: message.slice(0, 1000),
      timestamp,
      ...(requestId ? { requestId } : {}),
      url: stripQuery(window.location.href)?.slice(0, 500),
      userAgent: navigator.userAgent.slice(0, 500),
      context: trimContext(context),
    })

    if (queue.length >= MAX_BATCH) flush()
    else timer ??= setTimeout(flush, 5000)
  }
}

function trimContext(context: Record<string, unknown>): Record<string, unknown> {
  const json = JSON.stringify(context)
  return json.length <= 3500 ? context : { truncated: json.slice(0, 3500) }
}

declare module '#app' {
  interface NuxtApp {
    $logger: Logger
  }
}
