const fetchFn = window.fetch

window.fetch.polyfill = false
fetchFn.polyfill = false

export default fetchFn

const { Request, Response, Headers, AbortController } = window

export { fetchFn as fetch, Request, Response, Headers, AbortController }
