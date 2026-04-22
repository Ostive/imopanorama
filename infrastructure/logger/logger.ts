/**
 * Centralised logging utility for ImoPanorama.
 *
 * Provides consistent, level-based logging with environment-aware behaviour:
 * - **debug / info / warn**: disabled in production by default.
 * - **error**: always active, even in production.
 *
 * Usage:
 * ```ts
 * import { logger } from '@/infrastructure/logger/logger';
 * logger.info('User created', { id: userId });
 * logger.error('Payment failed', error);
 * ```
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Supported log levels, ordered from most to least verbose. */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Runtime configuration for the logger instance. */
interface LoggerConfig {
  /** Master switch – when `false` only `error()` calls are emitted. */
  enabled: boolean;
  /** Minimum severity to emit (inclusive). */
  level: LogLevel;
  /** Prepend an ISO-8601 timestamp to every message. */
  includeTimestamp: boolean;
}

// ---------------------------------------------------------------------------
// Logger class
// ---------------------------------------------------------------------------

class Logger {
  private config: LoggerConfig;

  /** Numeric weight per level – higher = more severe. */
  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor() {
    this.config = {
      enabled: process.env.NODE_ENV !== 'production',
      level: (process.env.LOG_LEVEL as LogLevel) || 'info',
      includeTimestamp: true,
    };
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** Log verbose debug information (development only). */
  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(this.prefix('debug', message), data ?? '');
    }
  }

  /** Log general operational information. */
  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(this.prefix('info', message), data ?? '');
    }
  }

  /** Log non-critical warnings. */
  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(this.prefix('warn', message), data ?? '');
    }
  }

  /**
   * Log errors – **always active**, even in production.
   * Automatically extracts `message` and `stack` from `Error` instances.
   */
  error(message: string, error?: unknown): void {
    console.error(this.prefix('error', message));

    if (error instanceof Error) {
      console.error('Error details:', { message: error.message, stack: error.stack });
    } else if (error) {
      console.error('Error data:', error);
    }
  }

  /** Shorthand for debug-level API call logging. */
  api(method: string, url: string, status?: number, data?: unknown): void {
    if (this.shouldLog('debug')) {
      const statusStr = status ? `[${status}]` : '';
      console.debug(this.prefix('debug', `API ${method} ${url} ${statusStr}`), data ?? '');
    }
  }

  /** Shorthand for debug-level database operation logging. */
  db(operation: string, table: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(this.prefix('debug', `DB ${operation} on ${table}`), data ?? '');
    }
  }

  /** Merge partial configuration into the current settings. */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  /** Returns `true` when the given level should be emitted. */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return this.levels[level] >= this.levels[this.config.level];
  }

  /** Builds a formatted prefix string: `[timestamp] [LEVEL] message`. */
  private prefix(level: LogLevel, message: string): string {
    const ts = this.config.includeTimestamp ? `[${new Date().toISOString()}] ` : '';
    return `${ts}[${level.toUpperCase()}] ${message}`;
  }
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

/** Shared logger instance – import this everywhere. */
export const logger = new Logger();

export type { LogLevel, LoggerConfig };
