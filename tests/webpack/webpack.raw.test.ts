import path from "node:path"

import { createFsFromVolume, Volume } from "memfs"
import { describe, expect, it } from "vitest"
import { type Configuration, optimize, type OutputFileSystem, webpack } from "webpack"
import { merge } from "webpack-merge"

import { createTester, type Output } from "../utils.js"

const test = createTester(
  "webpack",
  async (name: string, extraOptions: Configuration | null = {}) => {
    const compiler = webpack(
      merge(
        {
          entry: {
            cjs: path.resolve(__dirname, "..", "fixtures", `${name}.cjs`),
            mjs: path.resolve(__dirname, "..", "fixtures", `${name}.mjs`),
          },
          output: { libraryTarget: "commonjs-module" },
          plugins: [
            new optimize.LimitChunkCountPlugin({
              maxChunks: 1, // disable creating additional chunks
            }),
          ],

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
    compiler.outputFileSystem = output as OutputFileSystem

    const result = await new Promise<Output | Error>((resolve, reject) =>
      compiler.run((err, stats) => {
        if (err != null || stats?.hasErrors()) {
          return reject(err ?? stats!.toJson({ errors: true }).errors?.[0])
        }

        resolve({
          cjs: output.readFileSync("dist/cjs.js", { encoding: "utf8" }) as string,
          mjs: output.readFileSync("dist/mjs.js", { encoding: "utf8" }) as string,
        })
      }),
    )

    expect(result).not.toBeInstanceOf(Error)

    return result as Output
  },
)

const alias = {
  resolve: {
    alias: {
      "node-fetch": "fetch-unfill",
      "cross-fetch": "fetch-unfill",
    },
  },
} satisfies Configuration

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
