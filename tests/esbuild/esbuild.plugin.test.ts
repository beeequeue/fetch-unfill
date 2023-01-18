import { Buffer } from "node:buffer"
import path from "node:path"

import esbuild from "esbuild"
import { fetchUnfillUnplugin } from "unplugin-fetch-unfill"
import { expect, it } from "vitest"

const options = {
  entryPoints: [path.resolve(__dirname, "..", "fixtures", "node-fetch.mjs")],
  format: "esm",
  write: false,
  nodePaths: [path.resolve(__dirname, "..", "node_modules")],

  platform: "node",
  target: "node18",
  bundle: true,
  minify: true,

  plugins: [fetchUnfillUnplugin.esbuild()],
} satisfies esbuild.BuildOptions

it("creates alias config if none exists", async () => {
  const mjs = await esbuild.build(options)

  expect(Buffer.from(mjs.outputFiles[0].text).byteLength).toBeLessThan(1000)
})

it("applies the correct settings to an alias config", async () => {
  const mjs = await esbuild.build({
    ...options,
    alias: {
      foo: "bar",
    },
  })

  expect(mjs.outputFiles).toHaveLength(1)
  expect(Buffer.from(mjs.outputFiles[0].text).byteLength).toBeLessThan(1000)
})
