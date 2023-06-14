'use strict';const fetchFn = globalThis.fetch;

globalThis.fetch.polyfill = false;
fetchFn.polyfill = false;var crossFetch = () => fetchFn("https://example.com");
module.exports=crossFetch;