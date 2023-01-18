import { Buffer } from "node:buffer"
import path from "node:path"

import { createFsFromVolume, Volume } from "memfs"
import { fetchUnfillUnplugin } from "unplugin-fetch-unfill"
import { expect, it } from "vitest"
import { type Configuration, optimize, type OutputFileSystem, webpack } from "webpack"
import { merge } from "webpack-merge"

const options = {
  entry: path.resolve(__dirname, "..", "fixtures", "node-fetch.mjs"),
  output: { libraryTarget: "commonjs-module" },
  plugins: [
    new optimize.LimitChunkCountPlugin({
      maxChunks: 1, // disable creating additional chunks
    }),
    fetchUnfillUnplugin.webpack(),
  ],

  mode: "production",
  target: "node18",
  stats: "none",
  devtool: false,
  experiments: { futureDefaults: true },
} as Configuration

it("creates alias config if none exists", async () => {
  const compiler = webpack(merge(options, {}))

  const output = createFsFromVolume(new Volume())
  compiler.outputFileSystem = output as OutputFileSystem

  await new Promise((resolve, reject) =>
    compiler.run((err, stats) => (err ? reject(err) : resolve(stats))),
  )
  const code = output.readFileSync("dist/main.js", { encoding: "utf8" }) as string

  expect(Buffer.from(code).byteLength).toBeLessThan(1000)
})

it("applies the correct settings to an alias config", async () => {
  const compiler = webpack(
    merge(options, {
      resolve: {
        alias: {
          foo: path.resolve("bar"),
        },
        conditionNames: ["browser"],
      },
    }),
  )

  const output = createFsFromVolume(new Volume())
  compiler.outputFileSystem = output as OutputFileSystem

  await new Promise((resolve, reject) =>
    compiler.run((err, stats) => (err ? reject(err) : resolve(stats))),
  )
  const code = output.readFileSync("dist/main.js", { encoding: "utf8" }) as string

  expect(Buffer.from(code).byteLength).toBeLessThan(1000)
})
