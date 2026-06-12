/**
 * Minimal structured logger used by `ProjectBuilder`. Defaults to a no-op so
 * library code can log unconditionally; a real logger can be injected later
 * (e.g. when the wiki wires console/pino logging).
 */
export interface Logger {
  level: string;
  fatal(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
  trace(message: string, meta?: Record<string, unknown>): void;
  child(meta?: Record<string, unknown>): Logger;
}

/** A do-nothing `Logger`. */
export const NULL_LOGGER: Logger = {
  level: "info",
  fatal: () => {},
  error: () => {},
  warn: () => {},
  info: () => {},
  debug: () => {},
  trace: () => {},
  child: () => NULL_LOGGER,
};
