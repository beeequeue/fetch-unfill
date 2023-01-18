const fetchFn = globalThis.fetch

globalThis.fetch.polyfill = false
fetchFn.polyfill = false

module.exports = fetchFn
Object.assign(module.exports, {
  fetch: fetchFn,
  Request: globalThis.Request,
  Response: globalThis.Response,
  Headers: globalThis.Headers,
  AbortController: globalThis.AbortController,
})
