import path from "node:path"

import Alias from "@rollup/plugin-alias"
import CommonJs from "@rollup/plugin-commonjs"
import Json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { rollupAliases } from "fetch-unfill/aliases"
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
            entries: rollupAliases,
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
      file: "cjs.js",
      format: "cjs",
      compact: true,
      inlineDynamicImports: true,
    }),
  )

  const mjs = await rollup({
    ...options,
    input: path.resolve(__dirname, "..", "fixtures", `${name}.mjs`),
  }).then(async (c) =>
    c.generate({
      file: "mjs.js",
      format: "esm",
      compact: true,
      inlineDynamicImports: true,
    }),
  )

  expect(cjs.output).toHaveLength(1)
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
