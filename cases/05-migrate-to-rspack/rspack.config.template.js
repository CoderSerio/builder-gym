const path = require("path");
const { defineConfig } = require("@rspack/cli");

/**
 * TODO：将 legacy webpack 配置迁移到 Rspack，并优化 devtool/cache/HMR。
 */
module.exports = defineConfig({
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/index.jsx")
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: { syntax: "ecmascript", jsx: true },
            target: "es2019",
            transform: { react: { runtime: "automatic", refresh: true } }
          }
        }
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  cache: {
    type: "filesystem"
  },
  experiments: {
    lazyCompilation: {
      entries: true
    }
  }
});


