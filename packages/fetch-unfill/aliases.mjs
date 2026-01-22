const aliases = {
  "cross-fetch": "fetch-unfill",
  "node-fetch": "fetch-unfill",
  "node-fetch-native": "fetch-unfill",
  unfetch: "fetch-unfill",
  "whatwg-fetch": "fetch-unfill",
  "@supabase/node-fetch": "fetch-unfill",
}

// prettier-ignore
export const rollupAliases = Object.entries(aliases).map(([find, replacement]) => ({ find, replacement }))

export default aliases
