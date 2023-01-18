import { defineConfig } from "tsdown/config"

export default defineConfig({
  entry: ["src/plugin.ts"],
  outDir: "dist",

  external: ["rolldown", "rolldown/experimental", "@rollup/plugin-alias"],

  env: {
    TEST: false,
  },

  target: "node18",
  platform: "node",
  format: ["cjs", "esm"],
  dts: true,
  fixedExtension: true,
})
