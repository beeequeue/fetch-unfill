/* eslint-disable unicorn/prefer-module,prefer-destructuring */
import path from "path"

import { rollup } from "rollup"
import { describe, expect, test } from "vitest"

import Alias from "@rollup/plugin-alias"
import CommonJs from "@rollup/plugin-commonjs"
import Json from "@rollup/plugin-json"
import Resolve from "@rollup/plugin-node-resolve"

const build = async (name: string, useAlias = false) => {
  const context = await rollup({
    input: path.resolve(__dirname, "fixtures", `${name}.mjs`),
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
    ],
  })

  return await context.generate({
    format: "cjs",
    compact: true,
  })
}

const cases: Array<[name: string, snapshotName: string, useAlias: boolean]> = [
  ["bundles the original package", "rollup_node-fetch_bundled.js", false],
  ["unfills it", "rollup_node-fetch_unfilled.js", true],
]

describe("node-fetch", () => {
  test.each(cases)("%s", async (_, snapshotName, useAlias) => {
    const result = await build("node-fetch", useAlias)

    const { code } = result.output[0]

    await expect(code).toMatchFileSnapshot(`__snapshots__/${snapshotName}`)
    await expect(code).toBeAbleToFetch()
  })
})

describe("cross-fetch", () => {
  test.each(cases)("%s", async (_, snapshotName, useAlias) => {
    const result = await build("cross-fetch", useAlias)

    const { code } = result.output[0]

    await expect(code).toMatchFileSnapshot(
      `__snapshots__/${snapshotName.replace("node-", "cross-")}`,
    )
    await expect(code).toBeAbleToFetch()
  })
})
