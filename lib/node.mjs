const fetchFn = globalThis.fetch

globalThis.fetch.polyfill = false
fetchFn.polyfill = false

export default fetchFn

const { Request, Response, Headers, AbortController } = globalThis

export { fetchFn as fetch, Request, Response, Headers, AbortController }
