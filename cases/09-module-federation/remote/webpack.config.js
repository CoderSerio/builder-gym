const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

/**
 * Remote（webpack）：
 * - 产出 remoteEntry.js
 * - exposes 暴露 RemoteButton
 * - shared 共享 react/react-dom，避免重复加载
 */
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist/webpack"),
    filename: "remote.[contenthash].js",
    publicPath: "auto",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: { syntax: "ecmascript", jsx: true },
              target: "es2019",
              transform: { react: { runtime: "automatic" } }
            }
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  }
};


