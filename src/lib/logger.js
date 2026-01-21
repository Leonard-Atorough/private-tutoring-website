import * as Sentry from "@sentry/browser";

const LOG_LEVELS = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
};

/**
 * Creates a structured log entry in JSON format
 * @param {string} level - Log level (debug, info, warn, error)
 * @param {string} message - Main log message
 * @param {object} context - Additional context/metadata
 * @returns {object} Structured log object
 */
function createStructuredLog(level, message, context = {}) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
}

/**
 * Logs a message with structured format
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} data - Additional context data
 * @param {Error} errorObj - Optional Error object for stack trace. If provided, it will be sent to Sentry.
 * @returns {object} Structured log object
 */
function log(level, message, data = {}, errorObj = null) {
  const structuredLog = createStructuredLog(level, message, data);
  if (import.meta.env.VITE_ENVIRONMENT === "development") {
    console[level === "warn" ? "warn" : level === "error" ? "error" : "log"](structuredLog);
  }

  // Send to Sentry
  if (level === LOG_LEVELS.ERROR) {
    if (errorObj) {
      Sentry.captureException(errorObj);
    } else {
      Sentry.captureMessage(message, "error");
    }
  } else if (level === LOG_LEVELS.WARN) {
    Sentry.captureMessage(message, "warning");
  } else {
    // Info and debug as breadcrumbs only
    Sentry.addBreadcrumb({
      level,
      message,
      data: structuredLog,
      category: data.category || "app",
    });
  }

  return structuredLog;
}

/**
 * Public API for structured logging
 */
const logger = {
  debug: (message, data = {}) => log(LOG_LEVELS.DEBUG, message, data),
  info: (message, data = {}) => log(LOG_LEVELS.INFO, message, data),
  warn: (message, data = {}) => log(LOG_LEVELS.WARN, message, data),
  error: (message, data = {}, errorObj = null) => log(LOG_LEVELS.ERROR, message, data, errorObj),
};

export default logger;
