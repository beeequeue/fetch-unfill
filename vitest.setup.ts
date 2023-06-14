import type { Response } from "node-fetch"
import requireFromString from "require-from-string"
import { expect } from "vitest"

/* eslint-disable @typescript-eslint/consistent-type-definitions,@typescript-eslint/no-empty-interface */
interface CustomMatchers {
  toBeAbleToFetch(): Promise<void>
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers {}

  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
/* eslint-enable */

expect.extend({
  async toBeAbleToFetch(code: string) {
    let module: { default: () => Promise<Response> }
    try {
      module = requireFromString(code)
    } catch (error) {
      return {
        pass: false,
        message: () => `Failed to load code.\n${(error as Error).message}`,
      }
    }

    try {
      const response = await module.default()
      const body = await response.text()

      return {
        pass: response.status === 200 && body.includes("Example Domain"),
        message: () =>
          `Failed to fetch 'example.com'. (${response.status}, included text: ${body
            .includes("Example Domain")
            .toString()})`,
      }
    } catch (error) {
      return {
        pass: false,
        message: () => `Failed to fetch 'example.com'.\n${(error as Error).message}`,
      }
    }
  },
})
