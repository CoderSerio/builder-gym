const path = require("path");
const { defineConfig } = require("@rspack/cli");
const { HtmlRspackPlugin } = require("@rspack/core");
const { ReactRefreshRspackPlugin } = require("@rspack/plugin-react-refresh");

// 判断是否为 dev serve 场景（只有 dev 才需要 React Refresh）
// 本 demo 中通过 pnpm dev:rspack 启动时，npm_lifecycle_event 就是 "dev:rspack"
const isDevServe = process.env.npm_lifecycle_event === "dev:rspack";

/**
 * 这是对照组，直接就能运行
 * TODO：将 legacy webpack 配置迁移到 Rspack，并优化 devtool/cache/HMR。
 */
module.exports = defineConfig({
  mode: isDevServe ? "development" : "production",
  entry: {
    main: path.resolve(__dirname, "src/index.jsx")
  },
  resolve: {
    // 与 webpack 对照组保持一致：支持 .jsx 的扩展解析
    extensions: [".js", ".jsx", ".json"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  // TODO：这里可以根据 isDevServe 来选择
  devtool: "source-map",
  plugins: [
    new HtmlRspackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ].concat(
    // TODO: 小心处理！React Refresh 只应该在 dev 场景启用；build 阶段不需要它
  ),
  builtins: {
    react: {
      runtime: "automatic",
      development: true,
      // TODO: 这里可以根据 isDevServe 来选择
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
            transform: { react: { runtime: "automatic", refresh: isDevServe } }
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


