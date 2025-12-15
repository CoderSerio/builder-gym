const path = require("path");
const { defineConfig } = require("@rspack/cli");
const { HtmlRspackPlugin } = require("@rspack/core");
const { ModuleFederationPlugin } = require("@rspack/core").container;

/**
 * Host（Rspack）：
 * - 从 Remote 加载模块
 * - remotes 配置 Remote 的地址
 * - shared 共享 react/react-dom，避免重复加载
 */
module.exports = defineConfig({
  mode: "production",
  entry: path.resolve(__dirname, "src/index.jsx"),
  output: {
    path: path.resolve(__dirname, "dist/rspack"),
    filename: "host.[contenthash].js",
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
      name: "hostApp",
      remotes: {
        remoteApp: "remoteApp@http://localhost:3001/remoteEntry.js"
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

