const fetchUnfillAliases: {
  "cross-fetch": "fetch-unfill"
  "node-fetch": "fetch-unfill"
  "node-fetch-native": "fetch-unfill"
  unfetch: "fetch-unfill"
  "whatwg-fetch": "fetch-unfill"
}

export const rollupAliases: Array<{
  find: keyof typeof fetchUnfillAliases
  replacement: "fetch-unfill"
}>

export default fetchUnfillAliases
