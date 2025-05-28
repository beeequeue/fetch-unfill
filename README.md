# fetch-unfill + unplugin

![node >=18](https://img.shields.io/node/v/fetch-unfill)
[![npm](https://img.shields.io/npm/v/fetch-unfill?label=fetch-unfill)](https://www.npmjs.com/package/fetch-unfill)
[![npm](https://img.shields.io/npm/v/unplugin-fetch-unfill?label=unplugin-fetch-unfill)](https://www.npmjs.com/package/unplugin-fetch-unfill)
[![node-fetch before: 200kb](https://img.shields.io/bundlejs/size/node-fetch@^1?label=node-fetch+before)](https://bundlejs.com/?q=node-fetch%40%5E1&treeshake=%5B%7B+default+%7D%5D)
[![node-fetch after: 162b](https://img.shields.io/bundlejs/size/fetch-unfill?label=node-fetch+after)](https://bundlejs.com/?q=fetch-unfill&treeshake=%5B%7B+default+%7D%5D)

Removes `fetch` polyfills from your bundles in favor of native implementations.

- ✅ `node-fetch`
- ✅ `node-fetch-native`
- ✅ `cross-fetch`
- ❔ `whatwg-fetch`
- ❔ `unfetch`
- ❌ `@whatwg-node/fetch`

✅: verified ❔: unverified, should work ❌: not removable

## Usage

### Unplugin

Add the plugin to your config's plugin array:

```ts
import { fetchUnfillUnplugin } from "unplugin-fetch-unfill"

// ...
plugins: [
  // ...
  fetchUnfillUnplugin.{BUNDLER}()
]
```

### Manual Configuration

Install `fetch-unfill` with your package manager.

### Vite

<details>
<summary>Open</summary>

```ts
import { defineConfig } from "vite"
import fetchUnfillAliases from "fetch-unfill/aliases"

export default defineConfig({
  resolve: {
    alias: {
      // Alias any known, replaceable polyfills in use to `fetch-unfill`
      ...fetchUnfillAliases,
    },
  },
})
```

</details>

### esbuild

<details>
<summary>Open</summary>

```ts
import { build } from "esbuild"
import fetchUnfillAliases from "fetch-unfill/aliases"

await build({
  // ...
  alias: {
    // Alias any known, replaceable polyfills in use to `fetch-unfill`
    ...fetchUnfillAliases,
  },
})
```

</details>

### Webpack/Rspack

<details>
<summary>Open</summary>

```ts
import type { Configuration } from "webpack"
import fetchUnfillAliases from "fetch-unfill/aliases"

export default {
  // ...
  resolve: {
    alias: {
      // Alias any known, replaceable polyfills in use to `fetch-unfill`
      ...fetchUnfillAliases,
    },
  },
} satisfies Configuration
```

</details>

### Rolldown

<details>
<summary>Open</summary>

```ts
import type { RolldownOptions } from "rolldown"
import { aliasPlugin } from "rolldown/experimental"
import { rollupAliases } from "fetch-unfill/aliases"

export default {
  // ...
  plugins: [
    // ...
    aliasPlugin({
      entries: [
        // Alias any known, replaceable polyfills in use to `fetch-unfill`
        ...rollupAliases,
      ],
    }),
  ],
} satisfies RolldownOptions
```

</details>

### Rollup

<details>
<summary>Open</summary>

```ts
import type { RollupOptions } from "rollup"
import Alias from "@rollup/plugin-alias"
import { rollupAliases } from "fetch-unfill/aliases"

export default {
  // ...
  plugins: [
    // ...
    Alias({
      entries: [
        // Alias any known, replaceable polyfills in use to `fetch-unfill`
        ...rollupAliases,
      ],
    }),
  ],
} satisfies RollupOptions
```

</details>
