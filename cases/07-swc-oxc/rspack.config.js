const path = require("path");
const { defineConfig } = require("@rspack/cli");
const { HtmlRspackPlugin } = require("@rspack/core");

/**
 * Rspack + SWC 示例（已完成，可作为参考）：
 * - 使用 builtin:swc-loader（Rspack 内置，无需额外安装）
 * - 启用 filesystem cache（二次启动更快）
 * - 启用 lazyCompilation（按需编译，减少冷启动工作量）
 */
module.exports = defineConfig({
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/index.tsx")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  devtool: "eval-cheap-module-source-map",
  plugins: [
    new HtmlRspackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ],
  builtins: {
    react: {
      runtime: "automatic",
      development: true,
      refresh: false  // CLI build 不需要 refresh
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
            transform: { react: { runtime: "automatic" } }
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


