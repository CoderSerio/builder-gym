const path = require("path");

/**
 * 反例（bad）：
 * - 文件名固定为 bundle.js（URL 不变）
 * - 发布新版本时，要么强制刷新，要么禁用强缓存，否则容易“拿到旧代码”
 */
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist/bad"),
    filename: "bundle.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
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
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};


