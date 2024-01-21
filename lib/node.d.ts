import type {
  fetch as $fetch,
  $Headers,
  $Request,
  $Response,
  AbortController as $AbortController,
} from "undici-types"

declare global {
  const fetch: typeof $fetch
  const Headers: typeof $Headers
  const Request: typeof $Request
  const Response: typeof $Response
  const AbortController: typeof $AbortController
}
