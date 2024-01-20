const fetchFn = window.fetch

window.fetch.polyfill = false
fetchFn.polyfill = false

export default fetchFn

const { Request, Response, Headers, AbortController } = window

export { Request, Response, Headers, AbortController }
