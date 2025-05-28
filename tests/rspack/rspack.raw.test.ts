import path from "node:path"

import { type Configuration, optimize, type OutputFileSystem, rspack } from "@rspack/core"
import fetchUnfillAliases from "fetch-unfill/aliases"
import { createFsFromVolume, Volume } from "memfs"
import { describe, expect, it } from "vitest"
import { merge } from "webpack-merge"

import { createTester, type Output, sanitizePackageName } from "../utils.js"

const test = createTester(
  "rspack",
  async (name: string, extraOptions: Configuration | null = {}) => {
    const compiler = rspack(
      merge(
        {
          entry: {
            cjs: path.resolve(__dirname, "..", "fixtures", `${name}.cjs`),
            mjs: path.resolve(__dirname, "..", "fixtures", `${name}.mjs`),
          },
          output: { library: { type: "commonjs-module" } },
          externals: ["xmlhttprequest"],
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
    alias: fetchUnfillAliases,
  },
} satisfies Configuration

const cases = Object.keys(fetchUnfillAliases) as Array<keyof typeof fetchUnfillAliases>

describe.each(cases)("%s", (packageName) => {
  it("bundles the original package", async () => {
    await test(sanitizePackageName(packageName), null)
  })

  it("unfills it", async () => {
    await test(sanitizePackageName(packageName), alias, true)
  })
})
