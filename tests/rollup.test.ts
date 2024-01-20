/* eslint-disable unicorn/prefer-module,prefer-destructuring */
import path from "path"

import { rollup } from "rollup"
import { minify } from "rollup-plugin-esbuild"
import { describe, it } from "vitest"

import Alias from "@rollup/plugin-alias"
import CommonJs from "@rollup/plugin-commonjs"
import Json from "@rollup/plugin-json"
import Resolve from "@rollup/plugin-node-resolve"

import { createTester } from "./utils"

const test = createTester(async (name: string, useAlias = false) => {
  const context = await rollup({
    input: path.resolve(__dirname, "fixtures", `${name}.mjs`),
    logLevel: "silent",
    plugins: [
      Json({ compact: true, preferConst: true }),
      CommonJs(),
      Resolve({
        modulePaths: [path.resolve(__dirname, "..", "node_modules")],
        preferBuiltins: true,
      }),
      useAlias
        ? Alias({
            entries: {
              "node-fetch": "fetch-unfiller/node",
              "cross-fetch": "fetch-unfiller/node",
            },
          })
        : null,
      minify(),
    ],
  })

  const result = await context.generate({
    format: "cjs",
    compact: true,
    manualChunks: () => "index",
  })

  return result.output[0].code
})

describe("node-fetch", () => {
  it("bundles the original package", async () => {
    await test("node-fetch", false)
  })

  it("unfills it", async () => {
    await test("node-fetch", true)
  })
})

describe("cross-fetch", () => {
  it("bundles the original package", async () => {
    await test("cross-fetch", false)
  })

  it("unfills it", async () => {
    await test("cross-fetch", true)
  })
})
