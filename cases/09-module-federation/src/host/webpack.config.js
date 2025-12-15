const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

/**
 * Host（webpack）：
 * - 从 Remote 加载模块
 * - remotes 配置 Remote 的地址
 * - shared 共享 react/react-dom，避免重复加载
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: argv.mode || "production",
    entry: path.resolve(__dirname, "src/index.jsx"), // 入口文件异步加载 bootstrap.jsx
    output: {
      path: path.resolve(__dirname, "dist/webpack"),
      filename: isProduction ? "host.[contenthash].js" : "host.js",
      publicPath: isProduction ? "auto" : "http://localhost:3000/",
      clean: true
    },
    devServer: {
      port: 3000,
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
        name: "hostApp",
        remotes: {
          remoteApp: "remoteApp@http://localhost:3001/remoteEntry.js"
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
