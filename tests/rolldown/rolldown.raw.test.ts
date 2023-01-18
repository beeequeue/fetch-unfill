import path from "node:path"

import Alias from "@rollup/plugin-alias"
import CommonJs from "@rollup/plugin-commonjs"
import Json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { rollup, type RollupOptions } from "rollup"
import { minify } from "rollup-plugin-esbuild"
import { describe, expect, it } from "vitest"

import { createTester } from "../utils.js"

const test = createTester("rollup", async (name: string, useAlias: boolean = false) => {
  const options = {
    logLevel: "silent",
    plugins: [
      // @ts-expect-error: Incorrect default export
      Json({ compact: true, preferConst: true }),
      // @ts-expect-error: Incorrect default export
      CommonJs(),
      nodeResolve({
        modulePaths: [path.resolve(__dirname, "..", "node_modules")],
        preferBuiltins: true,
      }),
      useAlias
        ? // @ts-expect-error: Incorrect default export
          Alias({
            entries: {
              "node-fetch": "fetch-unfill",
              "cross-fetch": "fetch-unfill",
            },
          })
        : null,
      minify(),
    ],
  } satisfies RollupOptions

  const cjs = await rollup({
    ...options,
    input: path.resolve(__dirname, "..", "fixtures", `${name}.cjs`),
  }).then(async (c) =>
    c.generate({
      format: "cjs",
      compact: true,
      manualChunks: () => "index",
    }),
  )
  expect(cjs.output).toHaveLength(1)

  const mjs = await rollup({
    ...options,
    input: path.resolve(__dirname, "..", "fixtures", `${name}.mjs`),
  }).then(async (c) =>
    c.generate({
      format: "esm",
      compact: true,
      manualChunks: () => "index",
    }),
  )
  expect(mjs.output).toHaveLength(1)

  return {
    cjs: cjs.output[0].code,
    mjs: mjs.output[0].code,
  }
})

describe("node-fetch", () => {
  it("bundles the original package", async () => {
    await test("node-fetch", false)
  })

  it("unfills it", async () => {
    await test("node-fetch", true, true)
  })
})

describe("cross-fetch", () => {
  it("bundles the original package", async () => {
    await test("cross-fetch", false)
  })

  it("unfills it", async () => {
    await test("cross-fetch", true, true)
  })
})
