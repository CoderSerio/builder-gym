const path = require("path");
const { defineConfig } = require("@rspack/cli");

/**
 * TODO：在 Rspack 中实现 runtime 抽离与稳定 hash。
 */
module.exports = defineConfig({
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "src/index.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: { parser: { syntax: "ecmascript" } }
        }
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all"
    }
  }
});


