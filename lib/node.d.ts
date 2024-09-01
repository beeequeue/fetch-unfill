import type {
  AbortController as $AbortController,
  $Headers,
  $Request,
  $Response,
  fetch as $fetch,
} from "undici-types"

declare global {
  const fetch: typeof $fetch
  const Headers: typeof $Headers
  const Request: typeof $Request
  const Response: typeof $Response
  const AbortController: typeof $AbortController
}
