import { coverageConfigDefaults, defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        privacy: resolve(__dirname, "privacy-policy.html"),
      },
    },
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
