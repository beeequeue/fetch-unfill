import type { InputOptions, MinimalPluginContext, Plugin } from "rollup"
import { createUnplugin, type UnpluginInstance, type WebpackCompiler } from "unplugin"

type FetchUnfillOptions = {
  nodeFetch?: boolean
  crossFetch?: boolean
  whatwgFetch?: boolean
  unfetch?: boolean
}

export {
  default as fetchUnfillAliases,
  rollupAliases as fetchUnfillRollupAliases,
} from "fetch-unfill/aliases"

export const fetchUnfillUnplugin: UnpluginInstance<
  FetchUnfillOptions | undefined,
  false
> = createUnplugin((options, { framework }) => {
  type Rplc = { [key: string]: string | undefined }
  const replacements = {
    "node-fetch": "fetch-unfill",
    "cross-fetch": "fetch-unfill",
    "whatwg-fetch": "fetch-unfill",
    unfetch: "fetch-unfill",
  } satisfies Rplc

  if (options?.nodeFetch === false) delete (replacements as Rplc)["node-fetch"]
  if (options?.crossFetch === false) delete (replacements as Rplc)["cross-fetch"]
  if (options?.whatwgFetch === false) delete (replacements as Rplc)["whatwg-fetch"]
  if (options?.unfetch === false) delete (replacements as Rplc).unfetch

  const webpackConfigurer = (compiler: Pick<WebpackCompiler, "options">) => {
    compiler.options.resolve.alias ??= {}

    for (const pkg in replacements) {
      if (Array.isArray(compiler.options.resolve.alias)) {
        compiler.options.resolve.alias.push({
          name: pkg,
          alias: "fetch-unfill",
        })
      } else {
        compiler.options.resolve.alias = {
          ...compiler.options.resolve.alias,
          ...replacements,
        }
      }
    }
  }

  async function rollupConfigurer(this: MinimalPluginContext, options: InputOptions) {
    type AliasPluginConfig = {
      entries?: Array<{
        find: string | RegExp
        replacement: string
      }>
    }
    type AliasPlugin = (options?: AliasPluginConfig) => Plugin

    options.plugins ??= []
    if (!Array.isArray(options.plugins)) throw new Error("config.plugins is not an array")

    const existingPlugin = options.plugins.find(
      (plugin) =>
        (plugin as Plugin)?.name === "alias" ||
        (plugin as Plugin)?.name === "builtin:alias",
    ) as Plugin<AliasPluginConfig> | undefined

    if (existingPlugin != null) {
      this.error(
        "You are already using the alias plugin, which this plugin can't modify.\nPlease add the replacements (see `fetch-unfill`) to the alias plugin config and remove this plugin.",
      )
    }

    const aliasPlugin =
      framework === "rollup"
        ? ((await import("@rollup/plugin-alias")).default as unknown as AliasPlugin)
        : ((await import("rolldown/experimental")).aliasPlugin as AliasPlugin)

    options.plugins.unshift(
      aliasPlugin({
        entries: Object.entries(replacements).map(([key, value]) => ({
          find: key,
          replacement: value,
        })),
      }),
    )
  }

  return {
    name: "fetch-unfill",
    enforce: "pre",

    webpack: webpackConfigurer,
    rspack: webpackConfigurer,

    rollup: { options: rollupConfigurer },
    rolldown: { options: rollupConfigurer as never },

    esbuild: {
      config(config) {
        config.alias ??= {}

        config.alias = {
          ...config.alias,
          ...replacements,
        }
      },
    },

    vite: {
      config(config) {
        config.resolve ??= {}
        config.resolve.alias ??= {}

        config.resolve.alias = {
          ...config.resolve.alias,
          ...replacements,
        }
      },
    },
  }
})
