const fetchFn = window.fetch

window.fetch.polyfill = false
window.polyfill = false

module.exports = fetchFn
Object.assign(module.exports, {
  fetch: fetchFn,
  Request: window.Request,
  Response: window.Response,
  Headers: window.Headers,
  AbortController: window.AbortController,
})
