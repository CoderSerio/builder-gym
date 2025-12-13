const path = require("path");
const { defineConfig } = require("@rspack/cli");

/**
 * TODO：在 Rspack 中使用内置 SWC，并结合 cache/lazyCompilation。
 */
module.exports = defineConfig({
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/index.tsx")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  devtool: "eval-cheap-module-source-map",
  builtins: {
    react: {
      runtime: "automatic",
      development: true,
      refresh: true
    }
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: { syntax: "typescript", tsx: true },
            target: "es2019",
            transform: { react: { runtime: "automatic", refresh: true } }
          }
        }
      }
    ]
  },
  cache: { type: "filesystem" },
  experiments: {
    lazyCompilation: {
      entries: true
    }
  }
});


