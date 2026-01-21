/**
 * Minimal structured JSON logger with Sentry integration
 * Outputs logs as JSON and sends to Sentry
 */

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
 */
function log(level, message, data = {}) {
  const structuredLog = createStructuredLog(level, message, data);
  console[level === "warn" ? "warn" : level === "error" ? "error" : "log"](structuredLog);

  // Send to Sentry
  if (level === LOG_LEVELS.ERROR) {
    Sentry.captureMessage(message, "error");
    Sentry.addBreadcrumb({
      level: "error",
      message,
      data: structuredLog,
      category: data.category || "app",
    });
  } else if (level === LOG_LEVELS.WARN) {
    Sentry.captureMessage(message, "warning");
    Sentry.addBreadcrumb({
      level: "warning",
      message,
      data: structuredLog,
      category: data.category || "app",
    });
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
  error: (message, data = {}) => log(LOG_LEVELS.ERROR, message, data),
};

export default logger;
