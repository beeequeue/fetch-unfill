import path from "node:path"

import esbuild from "esbuild"
import fetchUnfillAliases from "fetch-unfill/aliases"
import { describe, expect, it } from "vitest"

import { createTester } from "../utils.js"

const test = createTester(
  "esbuild",
  async (name: string, extraOptions: esbuild.BuildOptions | null = {}) => {
    const options = {
      write: false,
      nodePaths: [path.resolve(__dirname, "..", "node_modules")],

      platform: "node",
      target: "node18",
      bundle: true,
      minify: true,
    } satisfies esbuild.BuildOptions

    const cjs = await esbuild.build({
      ...options,
      ...extraOptions,

      entryPoints: [path.resolve(__dirname, "..", "fixtures", `${name}.cjs`)],
      format: "cjs",
    })

    const mjs = await esbuild.build({
      ...options,
      ...extraOptions,

      entryPoints: [path.resolve(__dirname, "..", "fixtures", `${name}.mjs`)],
      format: "esm",
    })

    expect(cjs.errors).toStrictEqual([])
    expect(cjs.outputFiles).toHaveLength(1)
    expect(mjs.errors).toStrictEqual([])
    expect(mjs.outputFiles).toHaveLength(1)

    return {
      cjs: cjs.outputFiles![0].text,
      mjs: mjs.outputFiles![0].text,
    }
  },
)

const alias = {
  alias: fetchUnfillAliases,
} satisfies esbuild.BuildOptions

describe("node-fetch", () => {
  it("bundles the original package", async () => {
    await test("node-fetch", null)
  })

  it("unfills it", async () => {
    await test("node-fetch", alias, true)
  })
})

describe("cross-fetch", () => {
  it("bundles the original package", async () => {
    await test("cross-fetch", null)
  })

  it("unfills it", async () => {
    await test("cross-fetch", alias, true)
  })
})
