import type { fetch as $fetch, $Headers, $Request, $Response } from "undici-types"

declare global {
  const fetch: typeof $fetch
  const Headers: typeof $Headers
  const Request: typeof $Request
  const Response: typeof $Response
}
