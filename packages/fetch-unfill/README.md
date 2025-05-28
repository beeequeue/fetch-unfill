See https://github.com/beeequeue/fetch-unfill#readme

---

Install `fetch-unfill` with your package manager, then add it to your bundler's alias config:

```ts
import fetchUnfillAliases from "fetch-unfill/aliases"

export const config = {
  resolve: {
    alias: {
      ...fetchUnfillAliases,
    },
  },
}
```
