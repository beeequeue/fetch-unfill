import path from "node:path"

import { rolldown, type RolldownOptions } from "rolldown"
import { aliasPlugin } from "rolldown/experimental"
import { describe, expect, it } from "vitest"

import { createTester } from "../utils.js"

const test = createTester("rollup", async (name: string, useAlias: boolean = false) => {
  const options = {
    logLevel: "silent",
    resolve: {
      mainFields: ["module", "main"],
      conditionNames: ["node", "import", "default"],
    },
    plugins: [
      useAlias
        ? aliasPlugin({
            entries: [
              { find: "node-fetch", replacement: "fetch-unfill" },
              { find: "cross-fetch", replacement: "fetch-unfill" },
            ],
          })
        : null,
    ],
  } satisfies RolldownOptions

  const cjs = await rolldown({
    ...options,
    input: path.resolve(__dirname, "..", "fixtures", `${name}.cjs`),
  }).then(async (c) =>
    c.generate({
      format: "cjs",
      minify: true,
      inlineDynamicImports: true,
    }),
  )
  expect(cjs.output).toHaveLength(1)

  const mjs = await rolldown({
    ...options,
    input: path.resolve(__dirname, "..", "fixtures", `${name}.mjs`),
  }).then(async (c) =>
    c.generate({
      format: "esm",
      minify: true,
      inlineDynamicImports: true,
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
