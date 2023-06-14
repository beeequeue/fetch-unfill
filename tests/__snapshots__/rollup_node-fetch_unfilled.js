'use strict';const fetchFn = globalThis.fetch;

globalThis.fetch.polyfill = false;
fetchFn.polyfill = false;var nodeFetch = () => fetchFn("https://example.com");
module.exports=nodeFetch;