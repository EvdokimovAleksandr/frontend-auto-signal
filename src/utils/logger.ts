/**
 * Утилита для логирования только в development режиме
 * В production все логи отключены
 */

const isDev = import.meta.env.DEV

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args)
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args)
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args)
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args)
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args)
  },
}

export default logger

