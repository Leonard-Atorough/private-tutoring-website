import * as Sentry from "@sentry/browser";

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export default function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  // Only initialize if DSN is configured
  if (!dsn) {
    console.debug("Sentry DSN not configured. Set VITE_SENTRY_DSN environment variable.");
    return;
  }

  console.log("Initializing Sentry");

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.VITE_ENVIRONMENT || "development",
      release: `private-tutoring-website@${import.meta.env.VITE_APP_VERSION || "unknown"}`,

      integrations: [Sentry.replayIntegration()],

      // Performance monitoring - sample 20% of transactions
      tracesSampleRate: 0.2,

      // Session Replay - record 10% of sessions, 100% of error sessions
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      enableLogs: true,
    });

    console.log("Sentry initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Sentry:", error);
    Sentry.captureException(error);
  }
}
