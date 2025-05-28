import { fetch } from "whatwg-fetch"
import XMLHttpRequest from "xmlhttprequest"

globalThis.XMLHttpRequest = XMLHttpRequest

export default () => fetch("https://example.com")
export const example = () => fetch("https://example.com")
