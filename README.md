# fetch-unfiller

[![npm](https://img.shields.io/npm/v/fetch-unfiller)](https://www.npmjs.com/package/fetch-unfiller)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/fetch-unfiller)

## Installation

## Usage

### Vite

```ts
import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    alias: {
      // Alias any `fetch` package in use to `fetch-unfiller`
      "cross-fetch": "fetch-unfiller",
      // Use `fetch-unfiller/node` if building for node
      "node-fetch": "fetch-unfiller/node",
    },
  },
})
```

### esbuild

```ts
import { build } from "esbuild"

await build({
  // ...
  alias: {
    // Alias any `fetch` package in use to `fetch-unfiller`
    "cross-fetch": "fetch-unfiller",
    // Use `fetch-unfiller/node` if building for node
    "node-fetch": "fetch-unfiller/node",
  },
})
```

### Webpack/Rspack

```ts
import { type Configuration } from "webpack"

export default {
  // ...
  resolve: {
    alias: {
      // Alias any `fetch` package in use to `fetch-unfiller`
      "cross-fetch": "fetch-unfiller",
      // Use `fetch-unfiller/node` if building for node
      "node-fetch": "fetch-unfiller/node",
    },
  },
} satisfies Configuration
```

### Rollup

```ts
import { RollupOptions } from "rollup"
import Alias from "@rollup/plugin-alias"

export default {
  // ...
  plugins: [
    // ...
    Alias({
      entries: {
        // Alias any `fetch` package in use to `fetch-unfiller`
        "cross-fetch": "fetch-unfiller",
        // Use `fetch-unfiller/node` if building for node
        "node-fetch": "fetch-unfiller/node",
      },
    }),
  ],
} satisfies RollupOptions
```
