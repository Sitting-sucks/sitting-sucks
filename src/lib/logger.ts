/**
 * Application Logger Utility
 *
 * Provides structured logging with different severity levels.
 * In production, this can be extended to send logs to external services
 * like Sentry, LogRocket, or a custom logging backend.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
}

// Check if we're in production mode
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// Log level hierarchy
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Minimum log level to output (can be configured via env)
const MIN_LOG_LEVEL = isProduction ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
}

function formatLogEntry(entry: LogEntry): string {
  const { level, message, timestamp, context } = entry;
  let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (context && Object.keys(context).length > 0) {
    formatted += ` | ${JSON.stringify(context)}`;
  }

  return formatted;
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    error,
  };
}

/**
 * Send log to external service (placeholder for production)
 * Replace this with actual service integration (Sentry, LogRocket, etc.)
 */
async function sendToExternalService(entry: LogEntry): Promise<void> {
  // In production, you would send to your logging service here
  // Example with Sentry:
  // if (entry.error) {
  //   Sentry.captureException(entry.error, { extra: entry.context });
  // } else if (entry.level === 'error') {
  //   Sentry.captureMessage(entry.message, { level: 'error', extra: entry.context });
  // }

  // For now, this is a no-op in production
  // You can implement your own logging service integration here
}

function log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
  if (!shouldLog(level)) return;

  const entry = createLogEntry(level, message, context, error);

  // In development, output to console
  if (isDevelopment) {
    const formatted = formatLogEntry(entry);

    switch (level) {
      case 'debug':
        console.debug(formatted, error || '');
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted, error || '');
        break;
    }
  }

  // In production, send to external service for errors and warnings
  if (isProduction && (level === 'error' || level === 'warn')) {
    sendToExternalService(entry).catch(() => {
      // Silently fail - we don't want logging failures to break the app
    });
  }
}

/**
 * Logger API
 */
export const logger = {
  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    log('debug', message, context);
  },

  /**
   * Log general information
   */
  info(message: string, context?: LogContext): void {
    log('info', message, context);
  },

  /**
   * Log warnings
   */
  warn(message: string, context?: LogContext): void {
    log('warn', message, context);
  },

  /**
   * Log errors
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const err = error instanceof Error ? error : undefined;
    const ctx = error instanceof Error ? context : { ...(context || {}), errorValue: error };
    log('error', message, ctx, err);
  },

  /**
   * Create a child logger with preset context
   */
  child(baseContext: LogContext) {
    return {
      debug: (message: string, context?: LogContext) =>
        logger.debug(message, { ...baseContext, ...context }),
      info: (message: string, context?: LogContext) =>
        logger.info(message, { ...baseContext, ...context }),
      warn: (message: string, context?: LogContext) =>
        logger.warn(message, { ...baseContext, ...context }),
      error: (message: string, error?: Error | unknown, context?: LogContext) =>
        logger.error(message, error, { ...baseContext, ...context }),
    };
  },
};

export default logger;
