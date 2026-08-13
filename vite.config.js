import { sentryVitePlugin } from "@sentry/vite-plugin";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  // Note: This config is primarily for testing via Vitest
  // Astro handles the actual build configuration
  
  test: {
    globals: true,
    jsdom: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      enabled: true,
      exclude: [...coverageConfigDefaults.exclude],
    },
  },

  plugins: [sentryVitePlugin({
    org: "leonard-atorough",
    project: "kailis-tutoring"
  })]
});