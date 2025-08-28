import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
   test: {
      coverage: {
         provider: "v8",
         enabled: true,
         exclude: ["bs-config.js", ...coverageConfigDefaults.exclude]
      }
      // reporters: ["html"]
   }
});
