const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

/**
 * Remote（webpack）：
 * - 产出 remoteEntry.js
 * - exposes 暴露 RemoteButton
 * - shared 共享 react/react-dom，避免重复加载
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: argv.mode || "production",
    entry: path.resolve(__dirname, "src/index.js"), // 入口文件异步加载 bootstrap.js
    output: {
      path: path.resolve(__dirname, "dist/webpack"),
      filename: isProduction ? "remote.[contenthash].js" : "remote.js",
      publicPath: isProduction ? "auto" : "http://localhost:3001/",
      clean: true
    },
    devServer: {
      port: 3001,
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
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
          react: {
            singleton: true,
            requiredVersion: false,
            eager: false
          },
          "react-dom": {
            singleton: true,
            requiredVersion: false,
            eager: false
          }
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
};
