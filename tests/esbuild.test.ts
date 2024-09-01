import path from "node:path"

import esbuild from "esbuild"
import { describe, expect, it } from "vitest"

import { createTester } from "./utils"

const test = createTester(
  "esbuild",
  async (name: string, extraOptions: esbuild.BuildOptions | null = {}) => {
    const result = await esbuild.build({
      entryPoints: [path.resolve(__dirname, "fixtures", `${name}.mjs`)],
      write: false,
      nodePaths: [path.resolve(__dirname, "..", "node_modules")],

      format: "cjs",
      platform: "node",
      target: "node20",
      bundle: true,
      minify: true,

      ...extraOptions,
    })

    expect(result.errors).toStrictEqual([])

    return result.outputFiles![0].text
  },
)

const alias = {
  alias: {
    "node-fetch": "fetch-unfiller/node",
    "cross-fetch": "fetch-unfiller/node",
  },
} satisfies esbuild.BuildOptions

describe("node-fetch", () => {
  it("bundles the original package", async () => {
    await test("node-fetch", null)
  })

  it("unfills it", async () => {
    await test("node-fetch", alias)
  })
})

describe("cross-fetch", () => {
  it("bundles the original package", async () => {
    await test("cross-fetch", null)
  })

  it("unfills it", async () => {
    await test("cross-fetch", alias)
  })
})
