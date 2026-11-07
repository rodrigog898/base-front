import { consola, type LogObject } from 'consola'
import { getRequestHeader, getRequestURL, setResponseHeader } from 'h3'
import { newRequestId, stripQuery, type LogLevel } from '#shared/utils/log'

const SAFE_REQUEST_ID = /^[A-Za-z0-9._-]{8,128}$/

function consolaLevel(type: LogObject['type']): LogLevel {
  switch (type) {
    case 'fatal': return 'fatal'
    case 'error': return 'error'
    case 'warn': return 'warn'
    case 'debug': return 'debug'
    case 'trace': case 'verbose': return 'trace'
    default: return 'info'
  }
}

/**
 * Estandariza toda la salida del servidor Nitro a JSON (docs/LOGGING.md):
 *  - consola y console.* → JSON
 *  - access log por request con X-Request-Id
 *  - errores no controlados con stack
 */
export default defineNitroPlugin((nitroApp) => {
  const app = useServerLogger('app')
  const access = useServerLogger('access')

  consola.setReporters([
    {
      log(logObj) {
        const [first, ...rest] = logObj.args
        const message = first instanceof Error ? first.message : String(first ?? logObj.message ?? '')
        const err = [first, ...rest].find(a => a instanceof Error)
        app[consolaLevel(logObj.type)](message, {
          ...(logObj.tag ? { tag: logObj.tag } : {}),
          ...(err ? { err } : {}),
          ...(rest.length && !err ? { args: rest } : {}),
        })
      },
    },
  ])
  consola.wrapConsole()

  nitroApp.hooks.hook('request', (event) => {
    const incoming = getRequestHeader(event, 'x-request-id')
    const requestId = incoming && SAFE_REQUEST_ID.test(incoming) ? incoming : newRequestId()
    event.context.requestId = requestId
    event.context.startedAt = performance.now()
    setResponseHeader(event, 'X-Request-Id', requestId)
  })

  nitroApp.hooks.hook('afterResponse', (event) => {
    const path = stripQuery(getRequestURL(event).pathname)
    // Assets estáticos y HMR no se registran
    if (!path || path.startsWith('/_nuxt/') || path.startsWith('/__nuxt') || path === '/favicon.ico') return

    const statusCode = event.node.res.statusCode
    const durationMs = Math.round(performance.now() - (event.context.startedAt ?? performance.now()))
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'

    access[level](`${event.method} ${path} ${statusCode} ${durationMs}ms`, {
      requestId: event.context.requestId,
      httpRequest: {
        method: event.method,
        path,
        ip: event.node.req.socket.remoteAddress,
        // Informativo: X-Forwarded-For lo puede falsificar el cliente si no hay proxy de confianza.
        forwardedFor: getRequestHeader(event, 'x-forwarded-for')?.slice(0, 200),
        userAgent: getRequestHeader(event, 'user-agent'),
      },
      httpResponse: { statusCode },
      durationMs,
    })
  })

  nitroApp.hooks.hook('error', (error, { event }) => {
    app.error(error.message || 'Unhandled server error', {
      err: error,
      requestId: event?.context.requestId,
      path: event ? stripQuery(getRequestURL(event).pathname) : undefined,
    })
  })

  app.info('Nitro server ready')
})
