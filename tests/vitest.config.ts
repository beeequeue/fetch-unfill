import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    testTimeout: 25_000,
    setupFiles: "vitest.setup.ts",
  },
})
