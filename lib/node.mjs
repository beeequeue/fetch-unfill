const fetchFn = globalThis.fetch

globalThis.fetch.polyfill = false
fetchFn.polyfill = false

export default fetchFn

const { Request, Response, Headers } = globalThis

export { Request, Response, Headers }
