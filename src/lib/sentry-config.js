import * as Sentry from "@sentry/browser";

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  // Only initialize if DSN is configured
  if (!dsn) {
    console.debug("Sentry DSN not configured. Set VITE_SENTRY_DSN environment variable.");
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || "development",
    sendDefaultPii: true,
    integrations: [Sentry.replayIntegration()],
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export default Sentry;
