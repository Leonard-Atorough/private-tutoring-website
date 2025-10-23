import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
  test: {
    globals: true,
    jsdom: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      enabled: true,
      exclude: ["bs-config.js", ...coverageConfigDefaults.exclude],
    },
    // reporters: ["html"]
  },
});
