/* eslint-disable unicorn/prefer-module */
import path from "path"

import { createFsFromVolume, Volume } from "memfs"
import { describe, it, expect } from "vitest"
import { Configuration, webpack } from "webpack"
import { merge } from "webpack-merge"

import { createTester } from "./utils"

const test = createTester(
  async (name: string, extraOptions: Configuration | null = {}) => {
    const compiler = webpack(
      merge(
        {
          entry: path.resolve(__dirname, "fixtures", `${name}.mjs`),
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

    const result = await new Promise<string | Error>((resolve, reject) =>
      compiler.run((err, stats) => {
        if (err != null || stats?.hasErrors()) {
          return reject(err ?? stats!.toJson({ errors: true }).errors?.[0])
        }

        resolve(output.readFileSync("dist/main.js", { encoding: "utf8" }) as string)
      }),
    )

    expect(result).not.toBeInstanceOf(Error)

    return result as string
  },
)

const alias = {
  resolve: {
    alias: {
      "node-fetch": "fetch-unfiller/node",
      "cross-fetch": "fetch-unfiller/node",
    },
  },
} satisfies Configuration

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
