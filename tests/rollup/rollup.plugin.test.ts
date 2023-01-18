import { Buffer } from "node:buffer"
import path from "node:path"

import Alias from "@rollup/plugin-alias"
import CommonJs from "@rollup/plugin-commonjs"
import Json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { rollup, type RollupOptions } from "rollup"
import { minify } from "rollup-plugin-esbuild"
import { fetchUnfillUnplugin } from "unplugin-fetch-unfill"
import { expect, it } from "vitest"

const options = {
  input: path.resolve(__dirname, "..", "fixtures", `node-fetch.mjs`),
  logLevel: "silent",
  output: { inlineDynamicImports: true },
  plugins: [
    // @ts-expect-error: Incorrect default export
    Json({ compact: true, preferConst: true }),
    // @ts-expect-error: Incorrect default export
    CommonJs(),
    nodeResolve({
      modulePaths: [path.resolve(__dirname, "..", "node_modules")],
      preferBuiltins: true,
    }),
    minify(),
    fetchUnfillUnplugin.rollup(),
  ],
} satisfies RollupOptions

it("errors when alias plugin is already registered", async () => {
  const promise = rollup({
    ...options,
    plugins: [
      // @ts-expect-error: incorrect default export
      Alias({ entries: [{ find: "foo", replacement: "bar" }] }),
      ...(options.plugins as unknown[]),
    ],
  })

  await expect(promise).rejects.toThrowError("You are already using the alias plugin")
})

it("applies the correct settings to an existing alias plugin", async () => {
  const compiler = await rollup(options)
  const result = await compiler.generate({
    format: "esm",
    compact: true,
  })

  expect(result.output).toHaveLength(1)
  expect(Buffer.from(result.output[0].code).byteLength).toBeLessThan(1000)
})
