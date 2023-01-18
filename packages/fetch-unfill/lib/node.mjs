const fetchFn = globalThis.fetch

globalThis.fetch.polyfill = false
fetchFn.polyfill = false

export default fetchFn

const { Request, Response, Headers, AbortController } = globalThis

export { AbortController, fetchFn as fetch, Headers, Request, Response }
