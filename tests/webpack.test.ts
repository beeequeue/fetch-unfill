/* eslint-disable unicorn/prefer-module */
import assert from "assert"
import path from "path"

import { createFsFromVolume, Volume } from "memfs"
import { describe, expect, test } from "vitest"
import { Configuration, webpack } from "webpack"
import { merge } from "webpack-merge"

const build = async (name: string, extraOptions: Configuration | null = {}) => {
  const compiler = webpack(
    merge(
      {
        entry: path.resolve(__dirname, "fixtures", `${name}.js`),
        resolve: {
          modules: [path.resolve(__dirname, "..", "node_modules")],
        },
        output: { libraryTarget: "commonjs-module" },

        mode: "production",
        target: "node18",
        stats: "none",
        devtool: false,
        experiments: { futureDefaults: true },
      },
      extraOptions ?? {},
    ),
  )

  const output = createFsFromVolume(new Volume())
  compiler.outputFileSystem = output

  return await new Promise<string | Error>((resolve, reject) =>
    compiler.run((err, stats) => {
      if (err || stats?.hasErrors()) {
        return reject(err ?? stats!.toJson({ errors: true }).errors?.[0])
      }

      resolve(output.readFileSync("dist/main.js", { encoding: "utf8" }) as string)
    }),
  )
}

const alias = {
  resolve: {
    alias: {
      "node-fetch": path.resolve(__dirname, "..", "lib", "index.cjs"),
      "cross-fetch": path.resolve(__dirname, "..", "lib", "index.cjs"),
    },
  },
} satisfies Configuration

const cases: Array<[name: string, snapshotName: string, options: Configuration | null]> =
  [
    ["bundles the original package", "webpack_node-fetch_bundled.js", null],
    ["unfills it", "webpack_node-fetch_unfilled.js", alias],
  ]

describe("node-fetch", () => {
  test.each(cases)(
    "%s",
    async (_, snapshotName, options) => {
      const result = await build("node-fetch", options)

      expect(result).not.toBeInstanceOf(Error)
      assert(!(result instanceof Error))

      await expect(result).toMatchFileSnapshot(`__snapshots__/${snapshotName}`)

      await expect(result).toBeAbleToFetch()
    },
    { timeout: 10_000 },
  )
})

describe("cross-fetch", () => {
  test.each(cases)(
    "%s",
    async (_, snapshotName, options) => {
      const result = await build("cross-fetch", options)

      expect(result).not.toBeInstanceOf(Error)
      assert(!(result instanceof Error))

      await expect(result).toMatchFileSnapshot(
        `__snapshots__/${snapshotName.replace("node-", "cross-")}`,
      )

      await expect(result).toBeAbleToFetch()
    },
    { timeout: 10_000 },
  )
})
