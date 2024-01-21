/* eslint-disable @typescript-eslint/no-explicit-any */
import bytes from "bytes"
import { expect } from "vitest"

const getByteSize = (contents: string) =>
  bytes(Uint8Array.from(new TextEncoder().encode(contents)).byteLength)

export const createTester =
  <Fn extends (name: string, options: any) => Promise<string>>(build: Fn) =>
  async (
    name: string,
    options: Fn extends (_: string, options: infer O) => unknown ? O : never,
    fileSnapshot = false,
  ) => {
    const code = await build(name, options)

    expect(getByteSize(code)).toMatchSnapshot()
    if (fileSnapshot) {
      await expect(code).toMatchFileSnapshot(`__snapshots__/esbuild_${name}_unfilled.js`)
    }
    await expect(code).toBeAbleToFetch()
  }
