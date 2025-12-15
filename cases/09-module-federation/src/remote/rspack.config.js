const path = require("path");
const { defineConfig } = require("@rspack/cli");
const { HtmlRspackPlugin } = require("@rspack/core");
const { ModuleFederationPlugin } = require("@rspack/core").container;

/**
 * Remote（Rspack）：
 * - 产出 remoteEntry.js
 * - exposes 暴露 RemoteButton
 * - shared 共享 react/react-dom，避免重复加载
 */
module.exports = defineConfig({
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist/rspack"),
    filename: "remote.[contenthash].js",
    publicPath: "auto",
    clean: true
  },
  resolve: {
    extensions: [".js", ".jsx"]
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
            transform: { react: { runtime: "automatic" } }
          }
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteApp",
      filename: "remoteEntry.js",
      exposes: {
        "./RemoteButton": path.resolve(__dirname, "src/RemoteButton.jsx")
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false }
      }
    }),
    new HtmlRspackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ]
});

