import * as Sentry from "@sentry/astro";

Sentry.init({
  // Set your DSN here
  dsn: process.env.VITE_SENTRY_DSN,

  environment: process.env.VITE_ENVIRONMENT || "development",

  // Set the app version
  release: process.env.VITE_APP_VERSION,

  // Only send errors from production
  enabled: process.env.VITE_ENVIRONMENT === "production",

  // Performance monitoring
  tracesSampleRate: process.env.VITE_ENVIRONMENT === "production" ? 0.1 : 1.0,
});
