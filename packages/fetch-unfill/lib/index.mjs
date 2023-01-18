const fetchFn = window.fetch

window.fetch.polyfill = false
fetchFn.polyfill = false

export default fetchFn

const { Request, Response, Headers, AbortController } = window

export { AbortController, fetchFn as fetch, Headers, Request, Response }
