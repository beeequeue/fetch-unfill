import { Buffer } from "node:buffer"
import path from "node:path"

import { build, type RolldownOptions } from "rolldown"
import { aliasPlugin } from "rolldown/experimental"
import { fetchUnfillUnplugin } from "unplugin-fetch-unfill"
import { expect, it } from "vitest"

const options = {
  input: path.resolve(__dirname, "..", "fixtures", `node-fetch.mjs`),
  logLevel: "silent",
  output: {
    format: "esm",
    minify: true,
    inlineDynamicImports: true,
  },
  plugins: [fetchUnfillUnplugin.rolldown() as never],
} satisfies RolldownOptions

it("errors when alias plugin is already registered", async () => {
  const promise = build({
    ...options,
    plugins: [
      aliasPlugin({ entries: [{ find: "foo", replacement: "bar" }] }),
      ...options.plugins,
    ],
  })

  await expect(promise).rejects.toThrowError("You are already using the alias plugin")
})

it("applies the correct settings to an existing alias plugin", async () => {
  const result = await build(options)

  expect(Buffer.from(result.output[0].code).byteLength).toBeLessThan(1000)
})
