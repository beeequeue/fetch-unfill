const aliases = {
  "node-fetch": "fetch-unfill",
  "node-fetch-native": "fetch-unfill",
  "cross-fetch": "fetch-unfill",
}

// prettier-ignore
export const rollupAliases = Object.entries(aliases).map(([find, replacement]) => ({ find, replacement }))

export default aliases
