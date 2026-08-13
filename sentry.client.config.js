import * as Sentry from "@sentry/astro";

Sentry.init({
  // Set your DSN here
  dsn: import.meta.env.VITE_SENTRY_DSN,

  environment: import.meta.env.VITE_ENVIRONMENT || "development",

  // Set the app version
  release: import.meta.env.VITE_APP_VERSION,

  // Configure integrations
  integrations: [
    // Browser tracing for performance monitoring
    Sentry.browserTracingIntegration(),
    // Session replay for debugging user sessions
    Sentry.replayIntegration({
      // Mask all text content to protect user privacy
      maskAllText: true,
      // Mask all input content
      maskAllInputs: true,
    }),
  ],

  // Performance monitoring
  tracesSampleRate: import.meta.env.VITE_ENVIRONMENT === "production" ? 0.1 : 1.0,

  // Session replay sampling
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Ignore certain errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    // Ignore errors from Chrome extensions
    "chrome-extension://",
    "moz-extension://",
    // Random ad blockers errors
    "fb_xd_fragment",
  ],
});
