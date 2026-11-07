import type { Logger } from '#shared/utils/log'

/** Logger JSON estándar. Uso: const log = useLogger(); log.info('mensaje', { campo }) */
export function useLogger(bindings?: Record<string, unknown>): Logger {
  const logger = useNuxtApp().$logger
  return bindings ? logger.child(bindings) : logger
}
