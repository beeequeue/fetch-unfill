import path from "node:path"

import fetchUnfillAliases, { rollupAliases } from "fetch-unfill/aliases"
import { rolldown, type RolldownOptions } from "rolldown"
import { aliasPlugin } from "rolldown/experimental"
import { describe, expect, it } from "vitest"

import { createTester, sanitizePackageName } from "../utils.js"

const test = createTester("rollup", async (name: string, useAlias: boolean = false) => {
  const options = {
    logLevel: "silent",
    platform: "node",
    plugins: [useAlias ? aliasPlugin({ entries: rollupAliases }) : null],
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

const cases = Object.keys(fetchUnfillAliases) as Array<keyof typeof fetchUnfillAliases>

describe.each(cases)("%s", (packageName) => {
  it("bundles the original package", async () => {
    await test(sanitizePackageName(packageName), false)
  })

  it("unfills it", async () => {
    await test(sanitizePackageName(packageName), true, true)
  })
})
