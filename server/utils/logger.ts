import { createLogger, type LogEntry, type LogLevel, type Logger, type LogType } from '#shared/utils/log'

function base() {
  const config = useRuntimeConfig()
  return {
    service: config.public.serviceName as string,
    version: config.public.appVersion as string,
    environment: process.env.NODE_ENV || 'development',
  }
}

function write(entry: LogEntry): void {
  // Una línea JSON por evento a stdout (error/fatal a stderr).
  const line = `${JSON.stringify(entry)}\n`
  if (entry.level === 'error' || entry.level === 'fatal') process.stderr.write(line)
  else process.stdout.write(line)
}

const minLevel = (process.env.LOG_LEVEL as LogLevel | undefined) || 'info'
const cache = new Map<LogType, Logger>()

/** Logger JSON del servidor Nitro (SSR). */
export function useServerLogger(logType: LogType = 'app'): Logger {
  let logger = cache.get(logType)
  if (!logger) {
    logger = createLogger(write, base(), { minLevel, logType, bindings: { component: 'nitro' } })
    cache.set(logType, logger)
  }
  return logger
}
