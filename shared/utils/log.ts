/**
 * Esquema común de logs JSON (docs/LOGGING.md): idéntico al backend.
 * Usado tanto en el navegador (app/) como en el servidor Nitro (server/).
 */

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
export type LogType = 'app' | 'access' | 'audit' | 'client'

export const LOG_LEVEL_VALUE: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  service: string
  version: string
  environment: string
  logType: LogType
  message: string
  requestId?: string
  userId?: string
  [key: string]: unknown
}

const SENSITIVE_KEY = /pass(word)?|secret|token|authorization|cookie|api[-_]?key|credential/i
const MAX_DEPTH = 6

/** Reemplaza valores sensibles por "[REDACTED]" y serializa errores. */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) return '[Truncated]'
  if (value instanceof Error) {
    return { type: value.name, message: value.message, stack: value.stack }
  }
  if (Array.isArray(value)) return value.slice(0, 50).map(v => redact(v, depth + 1))
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SENSITIVE_KEY.test(key) ? '[REDACTED]' : redact(v, depth + 1)
    }
    return out
  }
  if (typeof value === 'string' && value.length > 2000) return `${value.slice(0, 2000)}…`
  return value
}

/** Elimina la query string (puede contener tokens o PII). */
export function stripQuery(url: string | undefined): string | undefined {
  return url?.split('?')[0]
}

export interface LogBase {
  service: string
  version: string
  environment: string
}

export function buildLogEntry(
  base: LogBase,
  level: LogLevel,
  logType: LogType,
  message: string,
  fields: Record<string, unknown> = {},
): LogEntry {
  const { err, error, ...rest } = fields
  const safe = redact(rest) as Record<string, unknown>
  const errorValue = err ?? error
  return {
    timestamp: new Date().toISOString(),
    level,
    ...base,
    logType,
    ...safe,
    ...(errorValue !== undefined ? { err: redact(errorValue) } : {}),
    message,
  }
}

export interface Logger {
  trace: (message: string, fields?: Record<string, unknown>) => void
  debug: (message: string, fields?: Record<string, unknown>) => void
  info: (message: string, fields?: Record<string, unknown>) => void
  warn: (message: string, fields?: Record<string, unknown>) => void
  error: (message: string, fields?: Record<string, unknown>) => void
  fatal: (message: string, fields?: Record<string, unknown>) => void
  child: (fields: Record<string, unknown>) => Logger
}

export function createLogger(
  write: (entry: LogEntry) => void,
  base: LogBase,
  options: { minLevel?: LogLevel, logType?: LogType, bindings?: Record<string, unknown> } = {},
): Logger {
  const min = LOG_LEVEL_VALUE[options.minLevel ?? 'info']
  const logType = options.logType ?? 'app'
  const bindings = options.bindings ?? {}

  const emit = (level: LogLevel) => (message: string, fields: Record<string, unknown> = {}) => {
    if (LOG_LEVEL_VALUE[level] < min) return
    write(buildLogEntry(base, level, logType, message, { ...bindings, ...fields }))
  }

  return {
    trace: emit('trace'),
    debug: emit('debug'),
    info: emit('info'),
    warn: emit('warn'),
    error: emit('error'),
    fatal: emit('fatal'),
    child: extra => createLogger(write, base, { ...options, bindings: { ...bindings, ...extra } }),
  }
}

export function newRequestId(): string {
  return globalThis.crypto.randomUUID()
}
