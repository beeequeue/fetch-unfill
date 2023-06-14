const fetchFn = window.fetch

window.fetch.polyfill = false
window.polyfill = false

module.exports = fetchFn
module.exports.Request = window.Request
module.exports.Response = window.Response
module.exports.Headers = window.Headers
