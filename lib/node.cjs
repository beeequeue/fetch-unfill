const fetchFn = globalThis.fetch

globalThis.fetch.polyfill = false
fetchFn.polyfill = false

module.exports = fetchFn
module.exports.Request = globalThis.Request
module.exports.Response = globalThis.Response
module.exports.Headers = globalThis.Headers
module.exports.AbortController = globalThis.AbortController
