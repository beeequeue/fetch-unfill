/* eslint-disable unicorn/prefer-module */
import path from "path"

import esbuild from "esbuild"
import { describe, expect, test } from "vitest"

const build = async (name: string, extraOptions: esbuild.BuildOptions | null = {}) =>
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, "fixtures", `${name}.js`)],
    write: false,
    nodePaths: [path.resolve(__dirname, "..", "node_modules")],

    platform: "node",
    target: "node16",
    bundle: true,
    minify: true,

    ...extraOptions,
  })

const alias = {
  alias: {
    "node-fetch": path.resolve(__dirname, "..", "lib", "index.cjs"),
    "cross-fetch": path.resolve(__dirname, "..", "lib", "index.cjs"),
  },
} satisfies esbuild.BuildOptions

const cases: Array<
  [name: string, snapshotName: string, options: esbuild.BuildOptions | null]
> = [
  ["bundles the original package", "esbuild_node-fetch_bundled.js", null],
  ["unfills it", "esbuild_node-fetch_unfilled.js", alias],
]

describe("node-fetch", () => {
  test.each(cases)("%s", async (_, snapshotName, options) => {
    const result = await build("node-fetch", options)

    expect(result.errors).toStrictEqual([])

    const contents = result.outputFiles![0].text
    await expect(contents).toMatchFileSnapshot(`__snapshots__/${snapshotName}`)
  })
})

describe("cross-fetch", () => {
  test.each(cases)("%s", async (_, snapshotName, options) => {
    const result = await build("cross-fetch", options)

    expect(result.errors).toStrictEqual([])

    await expect(result.outputFiles![0].text).toMatchFileSnapshot(
      `__snapshots__/${snapshotName.replace("node-", "cross-")}`,
    )
  })
})
