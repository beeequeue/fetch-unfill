type DefaultAliases = {
  "node-fetch": "fetch-unfill"
  "node-fetch-native": "fetch-unfill"
  "cross-fetch": "fetch-unfill"
}

export const rollupAliases: Array<{
  find: keyof DefaultAliases
  replacement: "fetch-unfill"
}>

const fetchUnfillAliases: DefaultAliases
export default fetchUnfillAliases
