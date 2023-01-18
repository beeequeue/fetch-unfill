import { Buffer } from "node:buffer"

import bytes from "bytes"
import { expect } from "vitest"

export type Output = { cjs: string; mjs: string }

export const getByteSize = (contents: string) => bytes(Buffer.from(contents).byteLength)

export const createTester =
  <Fn extends (name: string, options: any) => Promise<Output>>(
    _bundler: string,
    build: Fn,
  ) =>
  async (
    name: string,
    options: Fn extends (_: string, options: infer O) => unknown ? O : never,
    fileSnapshot = false,
  ) => {
    const { cjs, mjs } = await build(name, options)

    expect(getByteSize(cjs)).toMatchSnapshot("cjs")
    expect(getByteSize(mjs)).toMatchSnapshot("mjs")

    if (fileSnapshot) {
      expect(cjs).toMatchSnapshot("unfilled cjs code")
      expect(mjs).toMatchSnapshot("unfilled mjs code")
    }

    await expect(mjs).toBeAbleToFetch()
  }
