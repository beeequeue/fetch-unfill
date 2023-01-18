import { execSync } from "child_process"

import { defineConfig } from "vitest/config"

const gitSha = execSync("git rev-parse --short HEAD").toString().trim()
export default defineConfig({
  test: {
    env: {
      GIT_SHA: JSON.stringify(gitSha),
    },

    coverage: {
      enabled: true,
      reporter: ["text", "lcov"],
      reportsDirectory: "node_modules/.coverage",
    },
  },
})
