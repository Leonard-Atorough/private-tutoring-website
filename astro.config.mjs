import process from "process";
import { defineConfig } from "astro/config";
import sentry from "@sentry/astro";

export default defineConfig({
  site: "https://kailistacey.com",
  output: "static",

  integrations: [
    sentry({
      // Source map upload for readable stack traces
      org: process.env.SENTRY_ORG || "leonard-atorough",
      project: process.env.SENTRY_PROJECT || "kailis-tutoring",
      authToken: process.env.SENTRY_AUTH_TOKEN,

      // Paths to custom Sentry config files (relative to project root, without leading ./)
      clientInitPath: "sentry.client.config.js",
      serverInitPath: "sentry.server.config.js",
    }),
  ],

  server: {
    host: true,
    port: 3000,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
